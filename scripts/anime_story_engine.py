#!/usr/bin/env python3
"""
Anime & Cinematic Story Engine (Inspired by claude-make-an-anime).
Parses narrative Markdown story scripts into:
  1. Character Roster & Voicebox mapping (Protagonist -> 'myVoice', Supporting -> Kokoro/Edge-TTS)
  2. Shot-by-shot Camera Breakdown (Framing, Angle, Motion, Duration)
  3. Dialogue stems with EBU R128 mastering & Faster-Whisper word-level subtitle JSON
  4. SFX & Foley cue sheets for sound design
  5. Blender 4.2 NPR shot definitions & Remotion anime composition metadata
"""
import argparse
import datetime
import json
import os
import re
import subprocess
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

VOICE_MAPPING_DEFAULTS = {
    # Default character archetype mappings
    "protagonist": "myvoice",
    "hero": "myvoice",
    "subro": "myvoice",
    "narrator": "myvoice",
    "mentor": "bm_george",
    "sensei": "bm_george",
    "companion": "af_bella",
    "heroine": "af_heart",
    "villain": "am_michael",
    "rival": "am_adam",
    "system": "tech",
    "ai": "tech",
    "operator": "en-US-ChristopherNeural"
}

def parse_markdown_story(story_text: str) -> Dict[str, Any]:
    """Parses a markdown story into structured scenes, characters, and shots."""
    lines = story_text.strip().splitlines()
    title = "Untitled Anime Story"
    setting = "Cyberpunk / Tech Fantasy Realm"
    scenes: List[Dict[str, Any]] = []
    current_scene: Optional[Dict[str, Any]] = None
    current_char: Optional[str] = None
    char_lines: Dict[str, List[str]] = {}

    pending_camera = "Cinematic Medium Tracking"
    pending_sfx = None

    for line in lines:
        raw = line.strip()
        if not raw:
            continue

        # Title
        if raw.startswith("# ") and not raw.startswith("## "):
            title = raw[2:].strip()
            continue

        # Scene / Setting Header
        if raw.startswith("## "):
            header_content = raw[3:].strip()
            if ":" in header_content:
                header_type, header_val = header_content.split(":", 1)
                if "setting" in header_type.lower():
                    setting = header_val.strip()
            current_scene = {
                "name": header_content,
                "setting": setting,
                "shots": []
            }
            scenes.append(current_scene)
            current_char = None
            pending_camera = "Cinematic Medium Tracking"
            pending_sfx = None
            continue

        if current_scene is None:
            current_scene = {
                "name": "Scene 1: Introduction",
                "setting": setting,
                "shots": []
            }
            scenes.append(current_scene)

        # Character Dialogue tag: [Character] or **Character**: (allows trailing cues on same line)
        char_match = re.match(r"^\[([A-Za-z0-9_\-\s]+)\](?:\s*[\(\[].*?[\)\]])*\s*$", raw) or re.match(r"^\*\*([A-Za-z0-9_\-\s]+)\*\*:?.*$", raw)
        if char_match:
            current_char = char_match.group(1).strip()
            if current_char not in char_lines:
                char_lines[current_char] = []
            cam_m = re.search(r"[\(\[]Camera:\s*(.+?)[\)\]]", raw, re.IGNORECASE)
            if cam_m:
                pending_camera = cam_m.group(1).strip()
            sfx_m = re.search(r"[\(\[]SFX:\s*(.+?)[\)\]]", raw, re.IGNORECASE)
            if sfx_m:
                pending_sfx = sfx_m.group(1).strip()
            continue

        # Camera Cue on dialogue line
        cam_match = re.search(r"[\(\[]Camera:\s*(.+?)[\)\]]", raw, re.IGNORECASE)
        cam_instruction = cam_match.group(1).strip() if cam_match else pending_camera

        # SFX Cue on dialogue line
        sfx_match = re.search(r"[\(\[]SFX:\s*(.+?)[\)\]]", raw, re.IGNORECASE)
        sfx_instruction = sfx_match.group(1).strip() if sfx_match else pending_sfx

        # Reset pending cues
        pending_camera = "Cinematic Medium Tracking"
        pending_sfx = None

        # Clean dialogue text (strip camera / sfx cues and any bracket tags)
        clean_text = re.sub(r"[\(\[](?:Camera|SFX):.+?[\)\]]", "", raw, flags=re.IGNORECASE)
        clean_text = re.sub(r"^\[.+?\]\s*", "", clean_text).strip()

        if clean_text:
            speaker = current_char or "Narrator"
            if speaker not in char_lines:
                char_lines[speaker] = []
            char_lines[speaker].append(clean_text)

            # Estimate shot duration based on word count (approx 130 words per minute / ~2.2 words per sec + 1s buffer)
            word_count = len(clean_text.split())
            duration_sec = max(2.5, round((word_count / 2.3) + 0.8, 1))

            shot_data = {
                "id": f"shot_{len(current_scene['shots']) + 1:02d}",
                "speaker": speaker,
                "text": clean_text,
                "camera": cam_instruction,
                "sfx": sfx_instruction,
                "duration_seconds": duration_sec,
                "fps": 30,
                "duration_frames": int(duration_sec * 30)
            }
            current_scene["shots"].append(shot_data)

    return {
        "title": title,
        "setting": setting,
        "characters": list(char_lines.keys()),
        "scenes": scenes
    }

def map_characters_to_voices(characters: List[str]) -> Dict[str, str]:
    """Assigns voice profiles from Voicebox to detected characters."""
    voice_roster: Dict[str, str] = {}
    assigned_kokoro = ["bm_george", "af_bella", "am_adam", "af_heart", "am_michael"]
    k_idx = 0

    for ch in characters:
        clean_ch = ch.lower().strip()
        matched_voice = None
        for key, v_preset in VOICE_MAPPING_DEFAULTS.items():
            if key in clean_ch:
                matched_voice = v_preset
                break

        if not matched_voice:
            # Assign next Kokoro voice or fallback to myvoice
            if k_idx < len(assigned_kokoro):
                matched_voice = assigned_kokoro[k_idx]
                k_idx += 1
            else:
                matched_voice = "myvoice"

        voice_roster[ch] = matched_voice

    return voice_roster

def generate_production_plan(
    story_path: Path,
    output_dir: Path,
    synthesize_audio: bool = True
) -> Dict[str, Any]:
    """Generates the full anime production plan and audio stems."""
    story_text = story_path.read_text(encoding="utf-8")
    parsed = parse_markdown_story(story_text)
    voice_roster = map_characters_to_voices(parsed["characters"])

    output_dir.mkdir(parents=True, exist_ok=True)
    audio_dir = output_dir / "audio"
    audio_dir.mkdir(parents=True, exist_ok=True)

    print(f"\n🎌 [ANIME STORY ENGINE] Parsing Story: '{parsed['title']}'")
    print(f"   • Setting    : {parsed['setting']}")
    print(f"   • Characters : {len(parsed['characters'])} ({', '.join(parsed['characters'])})")
    print(f"   • Scenes     : {len(parsed['scenes'])}")

    print("\n🎙️ Character Voice Roster:")
    for ch, v_id in voice_roster.items():
        v_name = "Cloned User Voice ('myVoice')" if v_id == "myvoice" else f"Neural Engine ({v_id})"
        print(f"   • [{ch:<15}] -> {v_name}")

    all_shots: List[Dict[str, Any]] = []
    total_frames = 0

    # Process all shots across scenes
    shot_global_idx = 1
    for s_idx, scene in enumerate(parsed["scenes"], 1):
        for shot in scene["shots"]:
            shot_id = f"scene{s_idx:02d}_shot{shot_global_idx:02d}"
            shot["global_id"] = shot_id
            speaker = shot["speaker"]
            speaker_voice = voice_roster.get(speaker, "myvoice")
            shot["voice"] = speaker_voice

            wav_path = audio_dir / f"{shot_id}.wav"
            shot["audio_file"] = str(wav_path)
            shot["start_frame"] = total_frames
            shot["end_frame"] = total_frames + shot["duration_frames"]
            total_frames += shot["duration_frames"]

            # Synthesize audio if requested
            if synthesize_audio:
                print(f"   ▶ [{speaker}] Generating shot dialogue: '{shot['text'][:35]}...'")
                from scripts.voicebox import run_voicebox
                try:
                    run_voicebox(
                        text=shot["text"],
                        voice=speaker_voice,
                        output=str(wav_path),
                        auto_subtitles=True,
                        fallback_offline=True
                    )
                except Exception as e:
                    print(f"   ⚠️ Voice synthesis warning for {shot_id}: {e}")

            all_shots.append(shot)
            shot_global_idx += 1

    plan = {
        "title": parsed["title"],
        "setting": parsed["setting"],
        "genre": "anime",
        "fps": 30,
        "total_frames": total_frames,
        "total_duration_seconds": round(total_frames / 30.0, 2),
        "characters": voice_roster,
        "scenes": parsed["scenes"],
        "all_shots": all_shots,
        "created_at": datetime.datetime.now().isoformat()
    }

    plan_path = output_dir / "anime_production_plan.json"
    plan_path.write_text(json.dumps(plan, indent=2), encoding="utf-8")
    print(f"\n✓ [ANIME STORY ENGINE] Production Plan written to: {plan_path}")
    print(f"   • Total Duration: {plan['total_duration_seconds']}s ({total_frames} frames @ 30 FPS)")
    return plan

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Anime Story Ingestion & Shot Planner")
    parser.add_argument("--story", required=True, help="Path to markdown story file")
    parser.add_argument("--out-dir", default="out/anime/DemoAnime", help="Output directory")
    parser.add_argument("--no-audio", action="store_true", help="Skip speech synthesis")
    args = parser.parse_args()

    generate_production_plan(
        story_path=Path(args.story).resolve(),
        output_dir=Path(args.out_dir).resolve(),
        synthesize_audio=not args.no_audio
    )
