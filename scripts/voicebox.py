#!/usr/bin/env python3
"""
Voice Box — Hybrid Neural Speech & Voice Profile Generator
Supports:
  1. Voicebox Desktop API / MCP (Official App @ http://127.0.0.1:17493 - 'myVoice' cloned profile)
  2. Edge-TTS (Microsoft Neural Cloud Voices - fast & zero-VRAM)
  3. Kokoro-82M (Jamie Pine's offline local ONNX model - 54 voices + voice style vector blending)
  4. Automatic EBU R128 (-16 LUFS) broadcast loudness mastering via FFmpeg
  5. Automatic Faster-Whisper word-level subtitle JSON extraction for KineticSubtitleEngine
"""
import argparse
import asyncio
import json
import os
import subprocess
import sys
import time
import urllib.request
import urllib.error
from pathlib import Path
from typing import Dict, Any, Optional

# Ensure FFmpeg and Python paths are on Windows PATH
for extra_p in [
    r"C:\Users\User\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.2-full_build\bin",
    r"C:\Users\User\AppData\Local\Programs\Python\Python312\Scripts",
    r"C:\Users\User\AppData\Local\Programs\Python\Python312"
]:
    if os.path.exists(extra_p) and extra_p not in os.environ.get("PATH", ""):
        os.environ["PATH"] = extra_p + os.pathsep + os.environ.get("PATH", "")

VOICES_DIR = Path("assets/voices")
KOKORO_MODEL = Path("assets/models/kokoro/kokoro-v1.0.onnx")
KOKORO_VOICES = Path("assets/models/kokoro/voices-v1.0.bin")
VOICEBOX_API_URL = os.environ.get("VOICEBOX_URL", "http://127.0.0.1:17493").rstrip("/")

VOICE_PRESETS = {
    # Voicebox Cloned User Profiles (Live Official App @ http://127.0.0.1:17493)
    "myvoice": "85e227cd-f7fc-4fa1-8659-6b512f4fc557",
    "my-voice": "85e227cd-f7fc-4fa1-8659-6b512f4fc557",
    "cloned": "85e227cd-f7fc-4fa1-8659-6b512f4fc557",

    # Edge-TTS Online Presets (US & International)
    "tech": "en-US-ChristopherNeural",
    "energetic": "en-US-GuyNeural",
    "female-friendly": "en-US-JennyNeural",
    "female-pro": "en-US-AriaNeural",
    "casual": "en-US-EricNeural",
    "british-doc": "en-GB-RyanNeural",
    "australian": "en-AU-WilliamNeural",

    # Indian English & Hindi Presets (Edge-TTS Cloud)
    "indian-male": "en-IN-PrabhatNeural",
    "indian-female": "en-IN-NeerjaNeural",
    "indian-female-expressive": "en-IN-NeerjaExpressiveNeural",
    "hindi-male": "hi-IN-MadhurNeural",
    "hindi-female": "hi-IN-SwaraNeural",

    # Bengali / Bangla Presets (India & Bangladesh - Bilingual English Friendly)
    "bengali-male": "bn-IN-BashkarNeural",
    "bengali-female": "bn-IN-TanishaaNeural",
    "bangla-bd-male": "bn-BD-PradeepNeural",
    "bangla-bd-female": "bn-BD-NabanitaNeural",

    # Kokoro-82M Local Offline Presets (Jamie Pine Engine)
    "kokoro-heart": "af_heart",
    "kokoro-bella": "af_bella",
    "kokoro-sarah": "af_sarah",
    "kokoro-adam": "am_adam",
    "kokoro-michael": "am_michael",
    "kokoro-george": "bm_george",
    "kokoro-alice": "bf_alice",
    "kokoro-hindi-female": "hf_alpha",
    "kokoro-hindi-male": "hm_omega",
}

def check_voicebox_server(api_url: str = VOICEBOX_API_URL, timeout: float = 1.5) -> bool:
    """Checks if the Voicebox desktop server is running and accessible."""
    try:
        req = urllib.request.Request(f"{api_url}/", headers={"User-Agent": "Antigravity"})
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return resp.status == 200
    except Exception:
        return False

# --- Voicebox Desktop API / MCP Generator ---
def generate_speech_voicebox_api(
    text: str,
    profile_id_or_name: str,
    temp_output: Path,
    api_url: str = VOICEBOX_API_URL,
    personality: bool = False,
    timeout: int = 90
):
    """
    Synthesizes speech using the official Voicebox desktop server (POST /speak).
    Polls the SSE stream at /generate/{id}/status and downloads from /audio/{id}.
    """
    payload = {
        "text": text,
        "profile": profile_id_or_name,
        "personality": personality
    }
    req_data = json.dumps(payload).encode("utf-8")
    speak_req = urllib.request.Request(
        f"{api_url}/speak",
        data=req_data,
        headers={"Content-Type": "application/json"}
    )

    try:
        with urllib.request.urlopen(speak_req, timeout=10) as resp:
            init_res = json.loads(resp.read().decode("utf-8"))
            gen_id = init_res.get("id")
            if not gen_id:
                raise RuntimeError(f"Voicebox returned unexpected response: {init_res}")
    except urllib.error.URLError as ue:
        raise ConnectionError(
            f"Unable to reach Voicebox server at {api_url}.\n"
            f"Please ensure Voicebox Desktop is running (launch via 'launch_official_voicebox.bat')."
        ) from ue

    print(f"   [Voicebox Server] Generation task started: {gen_id} (polling progress...)")

    # Poll status via SSE stream or polling fallback
    status_url = f"{api_url}/generate/{gen_id}/status"
    status_req = urllib.request.Request(status_url, headers={"Accept": "text/event-stream, application/json"})
    completed = False
    start_time = time.time()

    try:
        with urllib.request.urlopen(status_req, timeout=timeout) as sresp:
            for line in sresp:
                if time.time() - start_time > timeout:
                    raise TimeoutError(f"Voicebox generation exceeded {timeout}s timeout.")

                line_str = line.decode("utf-8", errors="replace").strip()
                if line_str.startswith("data:"):
                    raw_json = line_str[5:].strip()
                    try:
                        pl = json.loads(raw_json)
                        curr_status = pl.get("status")
                        if curr_status == "completed":
                            completed = True
                            duration = pl.get("duration", 0.0)
                            print(f"   [Voicebox Server] Synthesis completed in {round(time.time() - start_time, 2)}s (audio duration: {duration}s)")
                            break
                        elif curr_status == "failed":
                            raise RuntimeError(f"Voicebox synthesis failed: {pl.get('error')}")
                    except json.JSONDecodeError:
                        continue
    except Exception as e:
        if not completed:
            # Fallback direct poll
            for _ in range(30):
                time.sleep(1)
                try:
                    check_req = urllib.request.Request(f"{api_url}/history/{gen_id}")
                    with urllib.request.urlopen(check_req, timeout=3) as hresp:
                        hdata = json.loads(hresp.read().decode("utf-8"))
                        if hdata.get("status") == "completed":
                            completed = True
                            break
                except Exception:
                    pass

    if not completed:
        raise RuntimeError(f"Voicebox generation did not complete within {timeout} seconds.")

    # Download mastered audio
    audio_url = f"{api_url}/audio/{gen_id}"
    with urllib.request.urlopen(audio_url, timeout=15) as aresp:
        temp_output.write_bytes(aresp.read())

# --- Edge-TTS Generator ---
async def generate_speech_edge_tts(text: str, voice: str, rate: str, pitch: str, volume: str, temp_output: Path):
    import edge_tts
    communicate = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch, volume=volume)
    await communicate.save(str(temp_output))

# --- Kokoro Local Offline Generator ---
def generate_speech_kokoro(text: str, voice_or_blend: str, speed: float, temp_output: Path):
    import soundfile as sf
    from kokoro_onnx import Kokoro

    if not KOKORO_MODEL.exists() or not KOKORO_VOICES.exists():
        raise FileNotFoundError(
            f"Kokoro model files missing at {KOKORO_MODEL}. Please run scripts/download_kokoro_model.py first."
        )

    kokoro = Kokoro(str(KOKORO_MODEL), str(KOKORO_VOICES))

    if ":" in voice_or_blend:
        blends = [item.strip().split(":") for item in voice_or_blend.split(",") if ":" in item]
        composite_vector = None
        total_weight = 0.0
        for v_name, weight_str in blends:
            weight = float(weight_str)
            v_vec = kokoro.get_voice_style(v_name)
            if composite_vector is None:
                composite_vector = v_vec * weight
            else:
                composite_vector += v_vec * weight
            total_weight += weight
        if total_weight > 0 and composite_vector is not None:
            composite_vector /= total_weight
            samples, sr = kokoro.create(text, voice=composite_vector, speed=speed, lang="en-us")
        else:
            samples, sr = kokoro.create(text, voice=voice_or_blend, speed=speed, lang="en-us")
    else:
        samples, sr = kokoro.create(text, voice=voice_or_blend, speed=speed, lang="en-us")

    sf.write(str(temp_output), samples, sr)

def master_audio_ffmpeg(raw_audio: Path, final_wav: Path):
    """Normalize loudness to EBU R128 (-16 LUFS) and trim silence"""
    final_wav.parent.mkdir(parents=True, exist_ok=True)
    cmd = [
        "ffmpeg", "-y", "-i", str(raw_audio),
        "-af", "silenceremove=start_periods=1:start_threshold=-50dB,loudnorm=I=-16:TP=-1.5:LRA=11",
        "-ar", "44100", "-ac", "1",
        str(final_wav)
    ]
    res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if res.returncode != 0:
        fallback_cmd = ["ffmpeg", "-y", "-i", str(raw_audio), "-ar", "44100", "-ac", "1", str(final_wav)]
        subprocess.run(fallback_cmd, check=True)

def extract_subtitles_for_audio(wav_path: Path, output_json: Optional[Path] = None) -> Optional[Path]:
    """Extracts frame-accurate word-level timestamp JSON via Faster-Whisper."""
    try:
        from faster_whisper import WhisperModel
        print(f"📝 [Voice Box] Extracting word boundaries via Faster-Whisper for {wav_path.name}...")
        model = WhisperModel("tiny", device="cpu", compute_type="int8")
        segments, _ = model.transcribe(str(wav_path), word_timestamps=True)

        word_list = []
        for segment in segments:
            if segment.words:
                for w in segment.words:
                    word_list.append({
                        "word": w.word.strip(),
                        "start": round(w.start, 3),
                        "end": round(w.end, 3),
                        "probability": round(w.probability, 3)
                    })

        target_json = output_json or wav_path.with_suffix(".subtitles.json")
        target_json.write_text(json.dumps(word_list, indent=2), encoding="utf-8")
        print(f"✓ [Voice Box] Subtitles extracted: {target_json} ({len(word_list)} words)")
        return target_json
    except Exception as e:
        print(f"⚠️  [Voice Box] Could not extract subtitles automatically: {e}")
        return None

def list_voices(engine: str = "all"):
    # 1. Voicebox Local Profiles
    print("\n🎤 Available Voicebox Desktop Profiles (http://127.0.0.1:17493):\n" + "-" * 60)
    if check_voicebox_server():
        try:
            req = urllib.request.Request(f"{VOICEBOX_API_URL}/profiles")
            with urllib.request.urlopen(req, timeout=2) as resp:
                profiles = json.loads(resp.read().decode("utf-8"))
                for p in profiles:
                    print(f" • {p.get('name', 'unnamed'):<20} | ID: {p.get('id')} | Type: {p.get('voice_type', 'cloned')}")
        except Exception as e:
            print(f"   (Failed to list profiles: {e})")
    else:
        print("   (Voicebox Desktop is offline. Launch 'launch_official_voicebox.bat' to activate)")

    # 2. Edge-TTS Cloud
    if engine in ["edge", "all"]:
        import edge_tts
        async def _list():
            voices = await edge_tts.list_voices()
            filtered = [v for v in voices if v["Locale"].startswith("en")]
            print(f"\n🎙️ Available Edge-TTS Neural Voices (English):\n" + "-" * 60)
            for v in filtered[:10]:
                print(f" • {v['ShortName']:<30} | {v['Gender']:<7} | {v['FriendlyName']}")
            print(f" ... and {len(filtered)-10} more cloud voices.")
        asyncio.run(_list())

    # 3. Kokoro Offline
    if engine in ["kokoro", "all"] and KOKORO_MODEL.exists():
        from kokoro_onnx import Kokoro
        k = Kokoro(str(KOKORO_MODEL), str(KOKORO_VOICES))
        voices = k.get_voices()
        print(f"\n🧠 Available Kokoro-82M Local Voices (54 Total Offline):\n" + "-" * 60)
        for v in voices[:10]:
            prefix = "Female" if v.startswith("af") or v.startswith("bf") else "Male"
            accent = "US" if v.startswith("a") else ("UK" if v.startswith("b") else "Other")
            print(f" • {v:<15} ({accent} {prefix})")
        print(f" ... and {len(voices)-10} more offline voices.")
        print("-" * 60)

def run_voicebox(
    text: str = "",
    script_file: str = "",
    voice: str = "myvoice",
    engine: str = "auto",
    speed: float = 1.0,
    rate: str = "+0%",
    pitch: str = "+0Hz",
    volume: str = "+0%",
    clone_sample: str = "",
    blend: str = "",
    output: str = "inputs/voicebox_output.wav",
    auto_subtitles: bool = True,
    fallback_offline: bool = False
) -> Path:
    VOICES_DIR.mkdir(parents=True, exist_ok=True)
    out_path = Path(output).resolve()
    out_path.parent.mkdir(parents=True, exist_ok=True)

    # Resolve text input
    if script_file and Path(script_file).exists():
        raw_text = Path(script_file).read_text(encoding="utf-8").strip()
    elif text:
        raw_text = text.strip()
    else:
        raw_text = "Welcome to the automated motion graphics workstation. This narration was generated using your cloned voice profile in Voice Box."

    # Resolve Voice Preset alias
    target_voice = VOICE_PRESETS.get(voice.lower(), voice)

    # Determine Engine
    selected_engine = engine.lower()
    if selected_engine == "auto":
        if voice.lower() in ["myvoice", "my-voice", "cloned"] or target_voice == "85e227cd-f7fc-4fa1-8659-6b512f4fc557":
            if check_voicebox_server():
                selected_engine = "voicebox-api"
            else:
                if fallback_offline:
                    print("⚠️  [Voice Box] Local Voicebox server offline. Falling back to Kokoro-82M.")
                    selected_engine = "kokoro"
                    target_voice = "af_heart"
                else:
                    raise ConnectionError(
                        f"⚠️  [Voice Box] Local Voicebox server (http://127.0.0.1:17493) is not running.\n"
                        f"   To use your cloned 'myVoice' profile, launch the desktop app via:\n"
                        f"   > launch_official_voicebox.bat\n"
                        f"   (Or pass --fallback-offline to use local Kokoro/Edge-TTS fallback)"
                    )
        elif target_voice.startswith(("af_", "am_", "bf_", "bm_", "zf_", "zm_", "jf_", "jm_")) or blend or voice.lower().startswith("kokoro"):
            selected_engine = "kokoro"
        else:
            selected_engine = "edge-tts"

    temp_raw = out_path.with_suffix(".temp.raw.wav")

    try:
        if selected_engine == "voicebox-api":
            print(f"🎤 [Voice Box] Engine: Voicebox Desktop API (myVoice Profile @ {VOICEBOX_API_URL})")
            print(f"   Profile: {target_voice} | Words: {len(raw_text.split())}")
            generate_speech_voicebox_api(raw_text, target_voice, temp_raw, api_url=VOICEBOX_API_URL)
        elif selected_engine == "kokoro":
            print(f"🧠 [Voice Box] Engine: Kokoro-82M (Local Offline ONNX)")
            active_kokoro_voice = blend if blend else target_voice
            print(f"   Voice: {active_kokoro_voice} | Speed: {speed}x | Words: {len(raw_text.split())}")
            generate_speech_kokoro(raw_text, active_kokoro_voice, speed, temp_raw)
        else:
            print(f"🎙️ [Voice Box] Engine: Edge-TTS (Microsoft Neural Cloud)")
            print(f"   Voice: {target_voice} | Rate: {rate} | Pitch: {pitch} | Words: {len(raw_text.split())}")
            asyncio.run(generate_speech_edge_tts(raw_text, target_voice, rate, pitch, volume, temp_raw))

        print("🔊 [Voice Box] Mastering audio via FFmpeg (silence trim & EBU R128 loudness normalization)...")
        master_audio_ffmpeg(temp_raw, out_path)
        print(f"✓ [Voice Box] Master audio created: {out_path} ({round(out_path.stat().st_size / 1024, 1)} KB)")

        if auto_subtitles:
            extract_subtitles_for_audio(out_path)

        return out_path
    finally:
        if temp_raw.exists():
            temp_raw.unlink()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Voice Box — Neural Speech & Voice Profile Generator")
    parser.add_argument("--text", default="", help="Text to speak")
    parser.add_argument("--script", default="", help="Path to text or markdown script file")
    parser.add_argument("--voice", default="myvoice", help="Voice preset or ID (default: myvoice)")
    parser.add_argument("--engine", default="auto", choices=["auto", "voicebox-api", "kokoro", "edge-tts"], help="Speech synthesis engine")
    parser.add_argument("--speed", type=float, default=1.0, help="Playback speed multiplier")
    parser.add_argument("--rate", default="+0%", help="Edge-TTS speed adjustment")
    parser.add_argument("--pitch", default="+0Hz", help="Edge-TTS pitch adjustment")
    parser.add_argument("--volume", default="+0%", help="Volume adjustment")
    parser.add_argument("--clone", default="", help="Optional path to reference WAV profile")
    parser.add_argument("--blend", default="", help="Kokoro style blend expression")
    parser.add_argument("--out", default="inputs/voicebox_output.wav", help="Output WAV path")
    parser.add_argument("--no-subtitles", action="store_true", help="Disable automatic subtitle extraction")
    parser.add_argument("--fallback-offline", action="store_true", help="Allow fallback to Kokoro if Voicebox app is closed")
    parser.add_argument("--list-voices", action="store_true", help="List available neural voices")
    args = parser.parse_args()

    if args.list_voices:
        list_voices()
    else:
        run_voicebox(
            text=args.text,
            script_file=args.script,
            voice=args.voice,
            engine=args.engine,
            speed=args.speed,
            rate=args.rate,
            pitch=args.pitch,
            volume=args.volume,
            clone_sample=args.clone,
            blend=args.blend,
            output=args.out,
            auto_subtitles=not args.no_subtitles,
            fallback_offline=args.fallback_offline
        )
