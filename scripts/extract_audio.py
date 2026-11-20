#!/usr/bin/env python3
import argparse
import json
import math
import os
import subprocess
from pathlib import Path
import numpy as np

# Ensure FFmpeg is found on Windows even if shell environment is stale
for extra_p in [
    r"C:\Users\User\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.2-full_build\bin",
    r"C:\Users\User\AppData\Local\Programs\Python\Python312\Scripts",
    r"C:\Users\User\AppData\Local\Programs\Python\Python312"
]:
    if os.path.exists(extra_p) and extra_p not in os.environ.get("PATH", ""):
        os.environ["PATH"] = extra_p + os.pathsep + os.environ.get("PATH", "")

def hz_to_mel(hz: float) -> float:
    return 2595.0 * np.log10(1.0 + hz / 700.0)

def mel_to_hz(mel: float) -> float:
    return 700.0 * (10.0 ** (mel / 2595.0) - 1.0)

def build_mel_filterbank(num_filters: int, fft_size: int, sample_rate: int, f_min: float = 20.0, f_max: float = 8000.0) -> np.ndarray:
    mel_min = hz_to_mel(f_min)
    mel_max = hz_to_mel(f_max)
    mel_points = np.linspace(mel_min, mel_max, num_filters + 2)
    hz_points = mel_to_hz(mel_points)
    bin_indices = np.floor((fft_size + 1) * hz_points / sample_rate).astype(int)
    num_bins = fft_size // 2 + 1
    weights = np.zeros((num_filters, num_bins), dtype=np.float32)

    for i in range(num_filters):
        start, center, end = bin_indices[i], bin_indices[i + 1], bin_indices[i + 2]
        if center > start:
            weights[i, start:center] = (np.arange(start, center) - start) / (center - start)
        if end > center:
            weights[i, center:end] = (end - np.arange(center, end)) / (end - center)
    return weights

def extract_audio_pcm(audio_path: Path, sample_rate: int = 44100) -> np.ndarray:
    cmd = ["ffmpeg", "-y", "-i", str(audio_path), "-vn", "-f", "s16le", "-acodec", "pcm_s16le", "-ar", str(sample_rate), "-ac", "1", "-"]
    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
    raw_bytes, _ = proc.communicate()
    if proc.returncode != 0 or not raw_bytes:
        raise RuntimeError(f"FFmpeg failed to extract PCM audio from {audio_path}")
    return np.frombuffer(raw_bytes, dtype=np.int16).astype(np.float32) / 32768.0

def process_mel_spectrum(audio_file: Path, output_json: Path, fps: int = 30, num_bars: int = 24, sample_rate: int = 44100, db_min: float = -60.0, db_max: float = 0.0):
    samples = extract_audio_pcm(audio_file, sample_rate)
    samples_per_frame = int(sample_rate / fps)
    total_frames = int(len(samples) / samples_per_frame)
    if total_frames == 0:
        raise ValueError("Audio file too short to generate frames.")

    fft_size = 1 << math.ceil(math.log2(max(1024, samples_per_frame)))
    mel_filters = build_mel_filterbank(num_bars, fft_size, sample_rate)
    window = np.hanning(samples_per_frame)
    frames_payload = []

    for i in range(total_frames):
        chunk = samples[i * samples_per_frame : (i + 1) * samples_per_frame] * window
        fft_complex = np.fft.rfft(chunk, n=fft_size)
        power_spectrum = np.abs(fft_complex) ** 2 / fft_size
        mel_energies = np.dot(mel_filters, power_spectrum)
        mel_db = 10.0 * np.log10(np.maximum(mel_energies, 1e-10))
        norm_db = np.clip((mel_db - db_min) / (db_max - db_min), 0.0, 1.0)
        frames_payload.append([round(float(v), 4) for v in norm_db])

    output_data = {
        "audioFile": audio_file.name,
        "sampleRate": sample_rate,
        "fps": fps,
        "numBars": num_bars,
        "totalFrames": total_frames,
        "frames": frames_payload
    }
    output_json.parent.mkdir(parents=True, exist_ok=True)
    output_json.write_text(json.dumps(output_data, indent=2), encoding="utf-8")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--audio", required=True)
    parser.add_argument("--out", default="src/data/spectrum.json")
    parser.add_argument("--fps", type=int, default=30)
    parser.add_argument("--bars", type=int, default=24)
    args = parser.parse_args()
    process_mel_spectrum(Path(args.audio), Path(args.out), args.fps, args.bars)
