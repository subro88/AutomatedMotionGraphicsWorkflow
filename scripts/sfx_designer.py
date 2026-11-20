#!/usr/bin/env python3
"""
Real SFX Master Sound Designer & Audio Mixer (Clipwing Real-SFX Inspired).
Features:
  1. Automated frame-accurate placement from storyboard cues
  2. Category-based nominal gain scaling (-10 to -18 dBFS)
  3. Intelligent sidechain speech ducking (-4 dB under active voiceover)
  4. 48kHz broadcast stereo master stem generation (out/sfx/master_sfx.wav)
  5. Multi-track FFmpeg muxing into final master MP4 (out/master/*_sfx_master.mp4)
  6. Self-critique QA scoreboard (sync, density, peak dBFS, ducking count)
"""
import argparse
import json
import math
import shutil
import struct
import subprocess
import sys
import wave
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import numpy as np

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))
if str(Path(__file__).parent) not in sys.path:
    sys.path.insert(0, str(Path(__file__).parent))

SFX_DIR = ROOT / "assets/sfx"
OUT_SFX_DIR = ROOT / "out/sfx"
SAMPLE_RATE = 48000

# Category nominal gains (dB relative to full scale)
CATEGORY_GAINS = {
    # Impacts & Booms: -10 dBFS
    "sub_boom_drop": -10.0,
    "logo_sub_boom": -11.0,
    "heavy_sub_impact": -9.0,
    # Whooshes & Swipes: -14 dBFS
    "whoosh_swipe": -14.0,
    "whoosh_heavy": -12.0,
    "fast_whoosh_swipe": -15.0,
    # UI Pops & Clicks: -16 dBFS
    "snappy_pop": -15.0,
    "tactile_pop": -16.0,
    "pop_snap": -14.0,
    # Mechanical & Relays: -16 dBFS
    "circuit_relay_click": -16.0,
    "gear_ratchet_swish": -15.0,
    # Shimmers & Counters: -18 dBFS
    "tick_shimmer": -18.0,
    "metric_tick_shimmer": -17.0,
    # Chimes & Risers: -14 to -16 dBFS
    "dock_open_chime": -15.0,
    "airy_riser": -13.0,
    # Branch Education Hardware Teardown Foley: -13 to -16 dBFS
    "metallic_unlatch": -14.0,
    "glass_lift": -14.0,
    "silicon_macro_riser": -13.0,
    "data_packet_pulse": -16.0,
}

def db_to_linear(db: float) -> float:
    """Converts decibels to linear amplitude multiplier."""
    return 10.0 ** (db / 20.0)

def load_wav_as_float(path: Path) -> Tuple[np.ndarray, int]:
    """Loads a WAV file into a float32 numpy array with range [-1.0, 1.0]."""
    with wave.open(str(path), "rb") as wf:
        n_channels = wf.getnchannels()
        sampwidth = wf.getsampwidth()
        framerate = wf.getframerate()
        n_frames = wf.getnframes()
        raw_bytes = wf.readframes(n_frames)

    if sampwidth == 2:
        data = np.frombuffer(raw_bytes, dtype=np.int16).astype(np.float32) / 32768.0
    elif sampwidth == 1:
        data = (np.frombuffer(raw_bytes, dtype=np.uint8).astype(np.float32) - 128.0) / 128.0
    elif sampwidth == 4:
        data = np.frombuffer(raw_bytes, dtype=np.int32).astype(np.float32) / 2147483648.0
    else:
        raise ValueError(f"Unsupported sample width: {sampwidth}")

    if n_channels == 2:
        stereo = data.reshape(-1, 2)
    else:
        stereo = np.column_stack((data, data))

    # Resample to 48kHz if necessary
    if framerate != SAMPLE_RATE:
        new_len = int(len(stereo) * (SAMPLE_RATE / framerate))
        indices = np.linspace(0, len(stereo) - 1, new_len)
        left = np.interp(indices, np.arange(len(stereo)), stereo[:, 0])
        right = np.interp(indices, np.arange(len(stereo)), stereo[:, 1])
        stereo = np.column_stack((left, right))

    return stereo, SAMPLE_RATE

def analyze_speech_activity(voice_path: Optional[Path], total_sec: float) -> np.ndarray:
    """Analyzes voice audio to detect active speech timestamps via 50ms RMS window."""
    if not voice_path or not voice_path.exists():
        return np.zeros(int(total_sec * 20), dtype=bool)

    try:
        samples, sr = load_wav_as_float(voice_path)
        mono = np.mean(samples, axis=1)
        hop_size = int(sr * 0.05)  # 50ms hops (20 hops per second)
        n_hops = int(len(mono) / hop_size)
        rms_vals = []
        for i in range(n_hops):
            chunk = mono[i * hop_size:(i + 1) * hop_size]
            rms_vals.append(np.sqrt(np.mean(chunk ** 2)))
        rms_vals = np.array(rms_vals)
        silence_thresh = max(0.015, np.mean(rms_vals) * 0.35)
        return rms_vals > silence_thresh
    except Exception as e:
        print(f"⚠️ Voice analysis notice: {e}; proceeding without speech ducking.")
        return np.zeros(int(total_sec * 20), dtype=bool)

def is_speech_active_at(speech_mask: np.ndarray, time_sec: float) -> bool:
    """Checks if speech is active at a specific timestamp."""
    hop_idx = int(time_sec * 20)  # 20 hops per second
    if 0 <= hop_idx < len(speech_mask):
        return bool(speech_mask[hop_idx])
    return False

def render_sfx_track(
    storyboard_path: Path = ROOT / "src/data/storyboard.json",
    voice_path: Optional[Path] = None,
    output_wav: Path = OUT_SFX_DIR / "master_sfx.wav",
    ducking_db: float = 4.0,
    fps: int = 30
) -> Dict[str, Any]:
    """Generates the synchronized master SFX audio stem from storyboard cues."""
    OUT_SFX_DIR.mkdir(parents=True, exist_ok=True)

    if not storyboard_path.exists():
        raise FileNotFoundError(f"Storyboard not found at: {storyboard_path}")

    storyboard = json.loads(storyboard_path.read_text(encoding="utf-8"))
    scenes = storyboard.get("scenes", [])
    total_frames = storyboard.get("totalDurationInFrames", 900)
    fps = storyboard.get("fps", fps)
    total_sec = total_frames / fps
    total_samples = int(total_sec * SAMPLE_RATE)

    # Auto-detect voice audio if not provided
    if voice_path is None:
        candidates = list((ROOT / "inputs").glob("*.wav")) + list((ROOT / "public").glob("*.wav"))
        if candidates:
            voice_path = candidates[0]

    # Analyze voice speech activity
    speech_mask = analyze_speech_activity(voice_path, total_sec)
    ducking_linear = db_to_linear(-abs(ducking_db))

    # Initialize master stereo SFX buffer
    master_buffer = np.zeros((total_samples, 2), dtype=np.float32)

    # Cache loaded sound assets
    sfx_cache: Dict[str, np.ndarray] = {}
    events_log: List[Dict[str, Any]] = []
    ducked_count = 0

    print(f"🎬 [Real SFX] Processing sound design for {len(scenes)} scenes ({total_sec:.1f}s, {total_frames} frames @ {fps} FPS)")

    for idx, sc in enumerate(scenes):
        cue_name = sc.get("sfxCue", "snappy_pop")
        start_frame = sc.get("startFrame", 0)
        offset = sc.get("sfxFrameOffset", 0)

        # Whooshes lead into transitions by ~6 frames
        if "whoosh" in cue_name and offset == 0:
            offset = -max(4, int(fps * 0.15))

        hit_frame = max(0, start_frame + offset)
        hit_sec = hit_frame / fps
        hit_sample = int(hit_sec * SAMPLE_RATE)

        # Locate audio asset
        cue_file = SFX_DIR / f"{cue_name}.wav"
        if not cue_file.exists():
            # Fallback to snappy_pop
            cue_file = SFX_DIR / "snappy_pop.wav"
            if not cue_file.exists():
                from scripts.sfx_library_builder import build_all_sfx
                build_all_sfx()

        # Load or retrieve from cache
        if cue_name not in sfx_cache and cue_file.exists():
            data, _ = load_wav_as_float(cue_file)
            sfx_cache[cue_name] = data

        if cue_name not in sfx_cache:
            continue

        raw_audio = sfx_cache[cue_name].copy()
        raw_len = len(raw_audio)

        # Base nominal category gain
        nom_db = CATEGORY_GAINS.get(cue_name, -14.0)
        gain = db_to_linear(nom_db)

        # Speech sidechain ducking check
        speech_active = is_speech_active_at(speech_mask, hit_sec)
        was_ducked = False
        if speech_active:
            gain *= ducking_linear
            was_ducked = True
            ducked_count += 1

        processed_audio = raw_audio * gain

        # Composite into master buffer
        end_sample = min(total_samples, hit_sample + raw_len)
        chunk_len = end_sample - hit_sample
        if chunk_len > 0 and hit_sample < total_samples:
            master_buffer[hit_sample:end_sample] += processed_audio[:chunk_len]

        events_log.append({
            "sceneId": sc.get("id", f"scene_{idx + 1}"),
            "cue": cue_name,
            "hitFrame": hit_frame,
            "timestampSec": round(hit_sec, 3),
            "nominalGainDb": nom_db,
            "speechDucked": was_ducked,
            "effectiveGainDb": round(nom_db - (ducking_db if was_ducked else 0.0), 1)
        })

    # Broadcast soft peak limiter (ceiling <= -1.0 dBFS)
    peak = np.max(np.abs(master_buffer))
    peak_dbfs = 20.0 * np.log10(max(peak, 1e-6))
    if peak > 0.89:  # > -1.0 dBFS
        master_buffer = np.tanh(master_buffer / 0.89) * 0.89
        peak = np.max(np.abs(master_buffer))
        peak_dbfs = 20.0 * np.log10(max(peak, 1e-6))

    # Write master 48kHz WAV
    from scripts.sfx_library_builder import write_wav
    write_wav(output_wav, master_buffer, SAMPLE_RATE)
    size_kb = output_wav.stat().st_size / 1024
    print(f"✅ [Real SFX] Generated master SFX stem: {output_wav} ({size_kb:.1f} KB, Peak: {peak_dbfs:.1f} dBFS)")

    # Self-Critique QA Scoreboard
    gaps = []
    for i in range(1, len(events_log)):
        dt = float(events_log[i]["timestampSec"] - events_log[i - 1]["timestampSec"])
        gaps.append(dt)

    min_gap = float(min(gaps)) if gaps else float(total_sec)
    max_gap = float(max(gaps)) if gaps else float(total_sec)

    # Quality scoring (out of 100)
    score = 100
    warnings = []
    if min_gap < 0.2:  # Less than 200ms apart
        score -= 10
        warnings.append(f"High sound density warning: minimum cue gap is {min_gap:.2f}s (< 0.2s)")
    if max_gap > 8.0:
        score -= 5
        warnings.append(f"Long sonic silence warning: maximum cue gap is {max_gap:.2f}s (> 8.0s)")
    if float(peak_dbfs) > -1.0:
        score -= 15
        warnings.append(f"Peak clipping risk: {float(peak_dbfs):.1f} dBFS exceeds -1.0 dBFS threshold")

    scoreboard = {
        "status": "PASS" if score >= 85 else "WARN",
        "score": int(score),
        "totalCues": len(events_log),
        "duckedUnderSpeech": int(ducked_count),
        "peakDbfs": round(float(peak_dbfs), 2),
        "minCueGapSec": round(float(min_gap), 2),
        "maxCueGapSec": round(float(max_gap), 2),
        "warnings": warnings,
        "cues": events_log
    }

    # Save report
    report_path = OUT_SFX_DIR / "sfx_audit_report.json"
    report_path.write_text(json.dumps(scoreboard, indent=2), encoding="utf-8")
    print(f"📊 [Real SFX] Scoreboard: Score {score}/100 | {len(events_log)} cues placed | {ducked_count} ducked under speech | Peak: {peak_dbfs:.1f} dBFS")
    return scoreboard

def mux_sfx_with_video(
    video_path: Path,
    sfx_wav: Path = OUT_SFX_DIR / "master_sfx.wav",
    bgm_path: Optional[Path] = None,
    output_mp4: Optional[Path] = None
) -> Path:
    """Muxes the generated SFX and optional Openverse BGM audio stem with the master video using FFmpeg."""
    ffmpeg = shutil.which("ffmpeg") or "ffmpeg"
    if not video_path.exists():
        raise FileNotFoundError(f"Source video not found: {video_path}")
    if not sfx_wav.exists():
        raise FileNotFoundError(f"SFX track not found: {sfx_wav}")

    if bgm_path is None:
        candidates = list((ROOT / "assets/bgm").glob("master_bgm.*"))
        if candidates:
            bgm_path = candidates[0]

    if output_mp4 is None:
        output_mp4 = video_path.parent / f"{video_path.stem}_sfx_master.mp4"

    # FFmpeg command: 2-stem or 3-stem mixing
    if bgm_path and bgm_path.exists():
        print(f"🎵 [Real SFX] Incorporating Openverse BGM from: {bgm_path.name} (calibrated to -22 dBFS)")
        cmd = [
            ffmpeg, "-y",
            "-i", str(video_path),
            "-i", str(sfx_wav),
            "-stream_loop", "-1",
            "-i", str(bgm_path),
            "-filter_complex",
            "[2:a]volume=0.15[bgm];[0:a][1:a][bgm]amix=inputs=3:duration=first:dropout_transition=2[aout]",
            "-map", "0:v",
            "-map", "[aout]",
            "-c:v", "copy",
            "-c:a", "aac",
            "-b:a", "320k",
            "-shortest",
            str(output_mp4)
        ]
    else:
        cmd = [
            ffmpeg, "-y",
            "-i", str(video_path),
            "-i", str(sfx_wav),
            "-filter_complex",
            "[0:a][1:a]amix=inputs=2:duration=first:dropout_transition=2[aout]",
            "-map", "0:v",
            "-map", "[aout]",
            "-c:v", "copy",
            "-c:a", "aac",
            "-b:a", "320k",
            "-shortest",
            str(output_mp4)
        ]

    print(f"🎞️ [Real SFX] Muxing multi-stem audio into master MP4 via FFmpeg...")
    res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if res.returncode != 0:
        raise RuntimeError(f"FFmpeg muxing failed: {res.stderr}")

    size_mb = output_mp4.stat().st_size / (1024 * 1024)
    print(f"✨ [Real SFX] Created final audio-mastered video: {output_mp4} ({size_mb:.2f} MB)")
    return output_mp4

def main():
    parser = argparse.ArgumentParser(description="Real SFX Sound Designer & Audio Mixer")
    parser.add_argument("--storyboard", default="src/data/storyboard.json", help="Path to storyboard.json")
    parser.add_argument("--voice", default="", help="Path to voiceover WAV/MP3")
    parser.add_argument("--out", default="out/sfx/master_sfx.wav", help="Output SFX WAV stem path")
    parser.add_argument("--mux", action="store_true", help="Mux SFX stem with master video MP4")
    parser.add_argument("--video", default="out/master/NHIT_Infographic_Admission_16x9.mp4", help="Video path for muxing")
    parser.add_argument("--fps", type=int, default=30, help="Timeline Framerate")
    parser.add_argument("--ducking", type=float, default=4.0, help="Speech ducking attenuation in dB")
    args = parser.parse_args()

    v_path = Path(args.voice) if args.voice else None
    res = render_sfx_track(
        storyboard_path=Path(args.storyboard),
        voice_path=v_path,
        output_wav=Path(args.out),
        ducking_db=args.ducking,
        fps=args.fps
    )

    if args.mux:
        mux_sfx_with_video(video_path=Path(args.video), sfx_wav=Path(args.out))

if __name__ == "__main__":
    main()
