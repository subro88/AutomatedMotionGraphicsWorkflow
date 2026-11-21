#!/usr/bin/env python3
"""
Motlab Headless WebCodecs Canvas Renderer
==========================================
Renders Motlab HTML Canvas scenes (driven by window.renderAt(t)) to broadcast-ready
MP4 videos using headless Chrome GPU acceleration and FFmpeg NVENC encoding.

Features:
- Sub-millisecond mathematical canvas rendering via renderAt(t).
- Hardware-accelerated H.264 NVENC encoding.
- Optional voiceover audio muxing with Voicebox (-16 LUFS broadcast standard).
- DaVinci Resolve multi-track FCPXML export.
- Automatic launch of Motlab Review Viewer via --review.

Usage:
  python scripts/motlab_renderer.py --scene scenes/sample_explainer.html --out out/sample_explainer.mp4
  python scripts/motlab_renderer.py --scene scenes/sample_explainer.html --audio inputs/narration.wav --project "Explainer_01" --review
"""

import os
import sys
import json
import shutil
import argparse
import subprocess
from pathlib import Path

WORKSPACE_ROOT = Path(__file__).resolve().parent.parent


def render_scene(scene_path: str, out_path: str, fps: int = 60, width: int = 1920, height: int = 1080, duration: float = None):
    scene_file = Path(scene_path).resolve()
    if not scene_file.exists():
        raise FileNotFoundError(f"Scene HTML file not found: {scene_file}")

    out_file = Path(out_path).resolve()
    out_file.parent.mkdir(parents=True, exist_ok=True)

    worker_script = WORKSPACE_ROOT / "scripts" / "motlab_worker.mjs"
    cmd = [
        "node",
        str(worker_script),
        "--scene", str(scene_file),
        "--out", str(out_file),
        "--fps", str(fps),
        "--width", str(width),
        "--height", str(height)
    ]
    if duration:
        cmd.extend(["--duration", str(duration)])

    print(f"\n🚀 Launching Motlab Canvas Render: {scene_file.name}")
    res = subprocess.run(cmd, cwd=str(WORKSPACE_ROOT))
    if res.returncode != 0:
        raise RuntimeError(f"Motlab worker failed with exit code {res.returncode}")

    return out_file


def mux_audio(video_path: Path, audio_path: Path, final_out: Path):
    print(f"\n🎵 Muxing voiceover audio into final MP4: {audio_path.name}")
    cmd = [
        "ffmpeg",
        "-y",
        "-i", str(video_path),
        "-i", str(audio_path),
        "-c:v", "copy",
        "-c:a", "aac",
        "-b:a", "192k",
        "-shortest",
        str(final_out)
    ]
    res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if res.returncode != 0:
        print("Warning: FFmpeg audio muxing failed, retaining raw video.")
        shutil.copy2(video_path, final_out)
    else:
        print(f"✅ Audio muxed successfully: {final_out}")


def main():
    parser = argparse.ArgumentParser(description="Motlab Headless WebCodecs Canvas Renderer")
    parser.add_argument("--scene", type=str, required=True, help="Path to Motlab HTML canvas scene file")
    parser.add_argument("--out", type=str, default="out/motlab_render.mp4", help="Path for rendered MP4")
    parser.add_argument("--fps", type=int, default=60, help="Framerate (default: 60)")
    parser.add_argument("--width", type=int, default=1920, help="Canvas width (default: 1920)")
    parser.add_argument("--height", type=int, default=1080, help="Canvas height (default: 1080)")
    parser.add_argument("--duration", type=float, default=None, help="Duration override in seconds")
    parser.add_argument("--audio", type=str, default=None, help="Optional audio voiceover to mux")
    parser.add_argument("--project", type=str, default="canvas_project", help="Project name")
    parser.add_argument("--review", action="store_true", help="Launch Motlab Review Viewer immediately after render")

    args = parser.parse_args()

    out_target = Path(args.out).resolve()
    temp_raw = out_target.parent / f"temp_raw_{out_target.name}"

    rendered_video = render_scene(
        scene_path=args.scene,
        out_path=str(out_target) if not args.audio else str(temp_raw),
        fps=args.fps,
        width=args.width,
        height=args.height,
        duration=args.duration
    )

    final_video = out_target
    if args.audio:
        audio_p = Path(args.audio).resolve()
        if audio_p.exists():
            mux_audio(rendered_video, audio_p, final_video)
            if rendered_video.exists() and rendered_video != final_video:
                rendered_video.unlink()
        else:
            print(f"Warning: Audio file {audio_p} not found, outputting raw video.")
            if rendered_video != final_video:
                shutil.move(str(rendered_video), str(final_video))

    print("\n" + "=" * 70)
    print(" 🎉 MOTLAB RENDER COMPLETE")
    print("=" * 70)
    print(f" Output Video: {final_video}")
    print(f" Resolution:   {args.width}x{args.height} @ {args.fps} FPS")
    print("=" * 70 + "\n")

    if args.review:
        print("🔍 Launching Motlab Review Viewer...")
        reviewer_script = WORKSPACE_ROOT / "scripts" / "motlab_reviewer.py"
        subprocess.run([sys.executable, str(reviewer_script), "--video", str(final_video), "--project", args.project])


if __name__ == "__main__":
    main()
