#!/usr/bin/env python3
"""
Beat-Grid Musical Synchronizer (Inspired by Charlie Hills / Mort1d on SkillsLLM).
Calculates exact frame-to-beat synchronization for Remotion and DaVinci Resolve.
Features:
  1. Mathematical BPM grid generator (quarter, eighth, sixteenth notes, bar markers)
  2. Pure NumPy audio transient & onset energy detection via FFmpeg PCM streaming
  3. Dual export:
     - src/data/beat_grid.json for Remotion React / GSAP animation components
     - out/resolve_exports/beat_markers.edl with custom color markers for DaVinci Resolve
"""
import argparse
import json
import math
import shutil
import subprocess
import sys
from pathlib import Path
from typing import Any, Dict, List, Tuple

import numpy as np

ROOT = Path(__file__).resolve().parents[1]

def frames_to_timecode(frame: int, fps: int = 30) -> str:
    """Converts a frame number to SMPTE timecode (HH:MM:SS:FF)."""
    total_sec = frame // fps
    ff = frame % fps
    ss = total_sec % 60
    mm = (total_sec // 60) % 60
    hh = total_sec // 3600
    return f"{hh:02d}:{mm:02d}:{ss:02d}:{ff:02d}"

def extract_audio_transients(audio_path: Path, fps: int = 30, target_duration: float = None) -> List[Dict[str, Any]]:
    """Extracts transient energy peaks from an audio file using FFmpeg PCM pipe & pure NumPy."""
    ffmpeg = shutil.which("ffmpeg") or "ffmpeg"
    sample_rate = 22050
    cmd = [
        ffmpeg, "-v", "error",
        "-i", str(audio_path),
        "-f", "s16le",
        "-ac", "1",
        "-ar", str(sample_rate),
        "-"
    ]

    try:
        proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        raw_bytes, _ = proc.communicate()
        if not raw_bytes:
            raise RuntimeError("Empty audio stream from FFmpeg")
    except Exception as e:
        print(f"⚠️ Audio extraction error: {e}; falling back to mathematical grid.")
        return []

    # Convert PCM to float array
    samples = np.frombuffer(raw_bytes, dtype=np.int16).astype(np.float32) / 32768.0
    total_audio_sec = len(samples) / sample_rate
    duration = target_duration if target_duration else total_audio_sec

    # Compute short-time energy / spectral flux in 20ms hops (~50 hops per second)
    hop_size = int(sample_rate / (fps * 2)) # 2 hops per video frame
    frame_size = hop_size * 2
    num_hops = int(len(samples) / hop_size) - 1

    energies = []
    for h in range(num_hops):
        start = h * hop_size
        chunk = samples[start:start + frame_size]
        if len(chunk) < frame_size:
            break
        # Root mean square energy
        rms = np.sqrt(np.mean(chunk ** 2))
        energies.append(rms)

    energies = np.array(energies)
    if len(energies) == 0:
        return []

    # Onset detection: positive energy difference (flux)
    diff = np.diff(energies)
    diff = np.maximum(0, diff)

    # Dynamic thresholding for transient peaks
    mean_flux = np.mean(diff)
    std_flux = np.std(diff)
    threshold = mean_flux + 0.8 * std_flux

    peaks = []
    min_frame_gap = int(fps * 0.25) # Minimum 250ms between major hits
    last_peak_frame = -min_frame_gap

    for i in range(1, len(diff) - 1):
        if diff[i] > threshold and diff[i] > diff[i - 1] and diff[i] > diff[i + 1]:
            hop_time = (i * hop_size) / sample_rate
            frame_idx = int(round(hop_time * fps))
            if frame_idx - last_peak_frame >= min_frame_gap:
                peaks.append({
                    "frame": frame_idx,
                    "timestampSec": round(hop_time, 3),
                    "energy": round(float(diff[i]), 4),
                    "type": "audio_transient"
                })
                last_peak_frame = frame_idx

    print(f"🎵 [BeatGrid] Detected {len(peaks)} transient energy hits from '{audio_path.name}' ({total_audio_sec:.1f}s)")
    return peaks

def generate_mathematical_grid(bpm: float, fps: int = 30, duration_sec: float = 30.0) -> List[Dict[str, Any]]:
    """Calculates mathematical beats, bars, and subdivisions."""
    total_frames = int(duration_sec * fps)
    frames_per_beat = (fps * 60.0) / bpm
    total_beats = int(duration_sec * (bpm / 60.0))

    beats = []
    for b in range(total_beats + 1):
        f = int(round(b * frames_per_beat))
        if f > total_frames:
            break
        is_bar_start = (b % 4 == 0)
        t_sec = f / fps
        beats.append({
            "beat": b + 1,
            "frame": f,
            "timestampSec": round(t_sec, 3),
            "isBarStart": is_bar_start,
            "measure": (b // 4) + 1,
            "beatInMeasure": (b % 4) + 1,
            "type": "bar_downbeat" if is_bar_start else "beat"
        })
    return beats

def export_resolve_edl(markers: List[Dict[str, Any]], fps: int, out_edl: Path, title: str = "BEAT_MARKERS"):
    """Exports markers as a CMX 3600 EDL file with native DaVinci Resolve color tags."""
    out_edl.parent.mkdir(parents=True, exist_ok=True)
    lines = [
        f"TITLE: {title}",
        "FCM: NON-DROP FRAME",
        ""
    ]

    for idx, m in enumerate(markers, 1):
        f = m["frame"]
        tc_in = frames_to_timecode(f, fps)
        tc_out = frames_to_timecode(f + 1, fps)
        
        is_bar = m.get("isBarStart", False)
        marker_color = "ResolveColorBlue" if is_bar else "ResolveColorCyan"
        if m.get("type") == "audio_transient":
            marker_color = "ResolveColorOrange"

        label = f"Bar {(f // (fps * 2)) + 1}" if is_bar else f"Hit F{f}"
        if "measure" in m:
            label = f"M{m['measure']}.{m['beatInMeasure']}"

        lines.append(f"{idx:03d}  AX       V     C        {tc_in} {tc_out} {tc_in} {tc_out}")
        lines.append(f" |C:{marker_color} |M:{label} |D:1")
        lines.append("")

    out_edl.write_text("\n".join(lines), encoding="utf-8")
    print(f"🎞️ [Resolve] Exported {len(markers)} timeline markers to: {out_edl}")

def calculate_beat_grid(
    bpm: float = 120.0,
    fps: int = 30,
    duration_sec: float = 30.0,
    audio_path: Path = None,
    output_json: Path = None,
    output_edl: Path = None
) -> Dict[str, Any]:
    """Generates the unified Beat-Grid payload and exports to JSON & EDL."""
    if output_json is None:
        output_json = ROOT / "src/data/beat_grid.json"
    if output_edl is None:
        output_edl = ROOT / "out/resolve_exports/beat_markers.edl"

    total_frames = int(duration_sec * fps)
    frames_per_beat = (fps * 60.0) / bpm

    # 1. Mathematical Grid
    math_beats = generate_mathematical_grid(bpm, fps, duration_sec)

    # 2. Eighth-note and Sixteenth-note subdivisions
    frames_per_eighth = frames_per_beat / 2.0
    eighth_notes = [int(round(i * frames_per_eighth)) for i in range(int(total_frames / frames_per_eighth))]

    # 3. Audio Transients (if audio file provided)
    transients = []
    if audio_path and audio_path.exists():
        transients = extract_audio_transients(audio_path, fps=fps, target_duration=duration_sec)

    # Combine markers for Resolve (primary bar downbeats + major transients)
    resolve_markers = [b for b in math_beats if b["isBarStart"]]
    if transients:
        # Interleave significant transients
        resolve_markers.extend(transients)
        resolve_markers.sort(key=lambda x: x["frame"])

    # Build final payload
    payload: Dict[str, Any] = {
        "bpm": bpm,
        "fps": fps,
        "totalFrames": total_frames,
        "durationSec": duration_sec,
        "framesPerBeat": round(frames_per_beat, 2),
        "framesPerEighth": round(frames_per_eighth, 2),
        "beats": math_beats,
        "eighthNotes": eighth_notes,
        "transients": transients,
        "recommendedSceneCuts": [b["frame"] for b in math_beats if b.get("isBarStart", False) and b["frame"] > 0]
    }

    # Save JSON
    output_json.parent.mkdir(parents=True, exist_ok=True)
    output_json.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    print(f"✅ [BeatGrid] Saved Beat-Grid configuration to: {output_json}")

    # Export DaVinci Resolve EDL
    export_resolve_edl(resolve_markers if resolve_markers else math_beats, fps, output_edl, title=f"BEAT_GRID_{int(bpm)}BPM")

    return payload

def main():
    parser = argparse.ArgumentParser(description="Beat-Grid Musical Synchronizer (SkillsLLM / Charlie Hills)")
    parser.add_argument("--bpm", type=float, default=120.0, help="Target music BPM (e.g. 120.0)")
    parser.add_argument("--fps", type=int, default=30, choices=[30, 60], help="Video Framerate (30 or 60)")
    parser.add_argument("--duration", type=float, default=30.0, help="Timeline duration in seconds")
    parser.add_argument("--audio", type=str, default="", help="Optional audio file for real transient detection")
    parser.add_argument("--out", type=str, default="src/data/beat_grid.json", help="Output JSON path")
    parser.add_argument("--export-edl", type=str, default="out/resolve_exports/beat_markers.edl", help="Output Resolve EDL path")
    args = parser.parse_args()

    a_path = Path(args.audio) if args.audio else None

    calculate_beat_grid(
        bpm=args.bpm,
        fps=args.fps,
        duration_sec=args.duration,
        audio_path=a_path,
        output_json=Path(args.out),
        output_edl=Path(args.export_edl)
    )

if __name__ == "__main__":
    main()
