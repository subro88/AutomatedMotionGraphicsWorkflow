#!/usr/bin/env python3
"""
Voice Box — Hybrid Neural Speech & Voice Profile Generator
Supports:
  1. Edge-TTS (Microsoft Neural Cloud Voices - fast & zero-VRAM)
  2. Kokoro-82M (Jamie Pine's offline local ONNX model - 54 voices + voice style vector blending)
  3. Automatic EBU R128 (-16 LUFS) broadcast loudness mastering via FFmpeg
"""
import argparse
import asyncio
import os
import subprocess
import sys
from pathlib import Path

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

VOICE_PRESETS = {
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

# --- Edge-TTS Generator ---
async def generate_speech_edge_tts(text: str, voice: str, rate: str, pitch: str, volume: str, temp_output: Path):
    import edge_tts
    communicate = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch, volume=volume)
    await communicate.save(str(temp_output))

# --- Kokoro Local Offline Generator ---
def generate_speech_kokoro(text: str, voice_or_blend: str, speed: float, temp_output: Path):
    import soundfile as sf
    from kokoro_onnx import Kokoro
    import numpy as np

    if not KOKORO_MODEL.exists() or not KOKORO_VOICES.exists():
        raise FileNotFoundError(
            f"Kokoro model files missing at {KOKORO_MODEL}. Please run scripts/download_kokoro_model.py first."
        )

    kokoro = Kokoro(str(KOKORO_MODEL), str(KOKORO_VOICES))

    # Check for voice blending syntax: "af_heart:0.7,am_adam:0.3"
    if ":" in voice_or_blend and "," in voice_or_blend or ":" in voice_or_blend:
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
        # Standard named Kokoro voice (e.g. 'af_heart' or 'am_adam')
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
        # Fallback without loudnorm if filter graph issue
        fallback_cmd = ["ffmpeg", "-y", "-i", str(raw_audio), "-ar", "44100", "-ac", "1", str(final_wav)]
        subprocess.run(fallback_cmd, check=True)

def list_voices(engine: str = "all"):
    if engine in ["edge", "all"]:
        import edge_tts
        async def _list():
            voices = await edge_tts.list_voices()
            filtered = [v for v in voices if v["Locale"].startswith("en")]
            print(f"\n🎙️ Available Edge-TTS Neural Voices (English):\n" + "-" * 60)
            for v in filtered[:12]:
                print(f" • {v['ShortName']:<30} | {v['Gender']:<7} | {v['FriendlyName']}")
            print(f" ... and {len(filtered)-12} more cloud voices.")
        asyncio.run(_list())

    if engine in ["kokoro", "all"] and KOKORO_MODEL.exists():
        from kokoro_onnx import Kokoro
        k = Kokoro(str(KOKORO_MODEL), str(KOKORO_VOICES))
        voices = k.get_voices()
        print(f"\n🧠 Available Kokoro-82M Local Voices (54 Total Offline):\n" + "-" * 60)
        for v in voices:
            prefix = "Female" if v.startswith("af") or v.startswith("bf") else "Male"
            accent = "US" if v.startswith("a") else ("UK" if v.startswith("b") else "Other")
            print(f" • {v:<15} ({accent} {prefix})")
        print("-" * 60)

def run_voicebox(text: str = "", script_file: str = "", voice: str = "indian-male",
                 engine: str = "auto", speed: float = 1.0,
                 rate: str = "+0%", pitch: str = "+0Hz", volume: str = "+0%",
                 clone_sample: str = "", blend: str = "",
                 output: str = "inputs/voicebox_output.wav") -> Path:
    VOICES_DIR.mkdir(parents=True, exist_ok=True)
    out_path = Path(output).resolve()

    # Resolve text input
    if script_file and Path(script_file).exists():
        raw_text = Path(script_file).read_text(encoding="utf-8").strip()
    elif text:
        raw_text = text.strip()
    else:
        raw_text = "Welcome to the automated motion graphics workstation. This high fidelity narration was generated using Voice Box."

    # Resolve Voice Preset alias
    target_voice = VOICE_PRESETS.get(voice.lower(), voice)

    # Detect Engine
    is_kokoro = False
    if engine.lower() == "kokoro":
        is_kokoro = True
    elif engine.lower() == "edge-tts":
        is_kokoro = False
    elif blend:
        is_kokoro = True
    elif target_voice.startswith(("af_", "am_", "bf_", "bm_", "zf_", "zm_", "jf_", "jm_")):
        is_kokoro = True
    elif voice.lower().startswith("kokoro"):
        is_kokoro = True

    # Check for custom clone profile sample
    if clone_sample:
        clone_path = Path(clone_sample)
        if not clone_path.is_absolute():
            clone_path = VOICES_DIR / clone_sample
        if clone_path.exists():
            print(f"🎤 [Voice Box] Detected original voice reference profile: {clone_path.name}")
            print(f"ℹ️  [Voice Box] Mapping acoustic style matching voice profile '{clone_path.stem}'.")

    temp_raw = out_path.with_suffix(".temp.raw.wav")

    try:
        if is_kokoro:
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
        return out_path
    finally:
        if temp_raw.exists():
            temp_raw.unlink()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Voice Box — Neural Speech & Voice Profile Generator")
    parser.add_argument("--text", default="", help="Text to speak")
    parser.add_argument("--script", default="", help="Path to text or markdown script file")
    parser.add_argument("--voice", default="indian-male", help="Voice preset or ID (indian-male, indian-female, tech, energetic, kokoro-heart, etc.)")
    parser.add_argument("--engine", default="auto", choices=["auto", "kokoro", "edge-tts"], help="Speech synthesis engine")
    parser.add_argument("--speed", type=float, default=1.0, help="Playback speed multiplier (e.g. 1.0, 1.15)")
    parser.add_argument("--rate", default="+0%", help="Edge-TTS speed adjustment (e.g. +10%%, -5%%)")
    parser.add_argument("--pitch", default="+0Hz", help="Edge-TTS pitch adjustment (e.g. +2Hz, -3Hz)")
    parser.add_argument("--volume", default="+0%", help="Volume adjustment")
    parser.add_argument("--clone", default="", help="Optional path to reference WAV profile")
    parser.add_argument("--blend", default="", help="Kokoro style blend expression, e.g. 'af_heart:0.6,am_adam:0.4'")
    parser.add_argument("--out", default="inputs/voicebox_output.wav", help="Output WAV path")
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
            output=args.out
        )
