#!/usr/bin/env python3
import argparse
import math
import os
import subprocess
from pathlib import Path

# Ensure FFmpeg is found on Windows even if shell environment is stale
for extra_p in [
    r"C:\Users\User\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.2-full_build\bin",
    r"C:\Users\User\AppData\Local\Programs\Python\Python312\Scripts",
    r"C:\Users\User\AppData\Local\Programs\Python\Python312"
]:
    if os.path.exists(extra_p) and extra_p not in os.environ.get("PATH", ""):
        os.environ["PATH"] = extra_p + os.pathsep + os.environ.get("PATH", "")

def get_video_duration(video_path: Path) -> float:
    cmd = ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", str(video_path)]
    result = subprocess.run(cmd, capture_output=True, text=True, check=True)
    return float(result.stdout.strip())

def slice_shorts(input_video: Path, out_dir: Path, chapter_duration: int = 30):
    out_dir.mkdir(parents=True, exist_ok=True)
    total_sec = get_video_duration(input_video)
    num_parts = math.ceil(total_sec / chapter_duration)

    for i in range(num_parts):
        start = i * chapter_duration
        clip_dur = min(chapter_duration, total_sec - start)
        fade_start = max(0.0, clip_dur - 1.0)
        out_file = out_dir / f"{input_video.stem}_part_{i+1:02d}.mp4"

        cmd = [
            "ffmpeg", "-y",
            "-ss", str(start),
            "-t", str(clip_dur),
            "-i", str(input_video),
            "-af", f"afade=t=out:st={fade_start}:d=1.0",
            "-c:v", "h264_nvenc",
            "-preset", "p6",
            "-cq", "18",
            "-c:a", "aac",
            str(out_file)
        ]
        try:
            subprocess.run(cmd, check=True)
        except subprocess.CalledProcessError:
            # Fall back to libx264 if NVENC has temporary session constraints
            cmd[cmd.index("h264_nvenc")] = "libx264"
            cmd[cmd.index("-cq")] = "-crf"
            subprocess.run(cmd, check=True)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--out", required=True)
    parser.add_argument("--duration", type=int, default=30)
    args = parser.parse_args()
    slice_shorts(Path(args.input), Path(args.out), args.duration)
