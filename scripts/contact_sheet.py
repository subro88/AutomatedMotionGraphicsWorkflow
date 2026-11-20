#!/usr/bin/env python3
"""
Deliver-and-Verify Visual Contact Sheet Generator (Inspired by iart-ai/motion-skills).
Generates a multi-frame visual montage (3x2 or 3x3 tiled grid) of milestone frames
across any Remotion composition or rendered video for instant visual self-auditing.
Features:
  - 6-frame or 9-frame tiled montage grid
  - Frame index and timestamp badges
  - SMPTE ST 2046-1 Safe-Area (90% Action Safe, 80% Title Safe) overlay
  - 9:16 Social UI Danger Zone clearance visualization
  - Fast extraction via FFmpeg when master MP4 exists; fallback to Remotion still
"""
import argparse
import json
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path
from typing import List, Tuple

from PySide6.QtCore import QPoint, QRect, Qt
from PySide6.QtGui import QBrush, QColor, QFont, QGuiApplication, QImage, QPainter, QPen

ROOT = Path(__file__).resolve().parents[1]

# Ensure headless Qt application instance exists
_qt_app = QGuiApplication.instance() or QGuiApplication(sys.argv)

def get_video_info(video_path: Path) -> Tuple[int, int, float, int]:
    """Retrieve width, height, duration (sec), and total frames using ffprobe."""
    ffprobe = shutil.which("ffprobe") or "ffprobe"
    cmd = [
        ffprobe, "-v", "error",
        "-select_streams", "v:0",
        "-show_entries", "stream=width,height,r_frame_rate,duration,nb_frames",
        "-of", "json",
        str(video_path)
    ]
    try:
        res = subprocess.run(cmd, capture_output=True, text=True, check=True)
        data = json.loads(res.stdout)
        stream = data["streams"][0]
        w = int(stream.get("width", 1920))
        h = int(stream.get("height", 1080))
        
        # Parse framerate
        fps_raw = stream.get("r_frame_rate", "30/1")
        if "/" in fps_raw:
            num, den = fps_raw.split("/")
            fps = float(num) / float(den)
        else:
            fps = float(fps_raw)

        # Parse duration
        dur_raw = stream.get("duration")
        if dur_raw:
            duration = float(dur_raw)
        else:
            duration = 30.0

        total_frames = int(stream.get("nb_frames") or int(duration * fps))
        return w, h, duration, total_frames
    except Exception as e:
        print(f"⚠️ ffprobe probe error: {e}; defaulting to 1920x1080 @ 30fps")
        return 1920, 1080, 30.0, 900

def extract_frame_ffmpeg(video_path: Path, timestamp_sec: float, out_png: Path):
    """Extract a single frame from video at exact timestamp using FFmpeg."""
    ffmpeg = shutil.which("ffmpeg") or "ffmpeg"
    cmd = [
        ffmpeg, "-y",
        "-ss", f"{timestamp_sec:.3f}",
        "-i", str(video_path),
        "-frames:v", "1",
        "-update", "1",
        str(out_png)
    ]
    subprocess.run(cmd, capture_output=True, check=True)

def extract_frame_remotion(comp: str, frame_num: int, out_png: Path):
    """Render a single frame from Remotion composition using 'remotion still'."""
    npx = shutil.which("npx.cmd") or shutil.which("npx") or "npx"
    props_p = ROOT / "src/data/render_props.json"
    cmd = [
        npx, "remotion", "still",
        "src/index.ts", comp,
        f"--frame={frame_num}",
        f"--output={out_png.as_posix()}",
        "--gl=angle"
    ]
    if props_p.exists():
        cmd.append(f"--props={props_p.as_posix()}")
    subprocess.run(cmd, cwd=str(ROOT), capture_output=True, check=True)

def generate_contact_sheet(
    comp_name: str = "NHIT-Infographic-16x9",
    video_path: Path = None,
    num_frames: int = 6,
    draw_safe_area: bool = True,
    output_png: Path = None
) -> Path:
    """Creates a multi-frame contact sheet montage."""
    if output_png is None:
        output_png = ROOT / f"out/contact_sheets/{comp_name}_contact_sheet.png"
    output_png.parent.mkdir(parents=True, exist_ok=True)

    # Locate video file if not explicitly given
    if video_path is None or not video_path.exists():
        candidates = [
            ROOT / f"out/master/{comp_name}.mp4",
            ROOT / f"out/master/{comp_name.replace('-', '_')}.mp4",
            ROOT / f"out/master/{comp_name}_render.mp4",
            ROOT / "out/master/NHIT_Infographic_Admission_16x9.mp4" if "16x9" in comp_name else ROOT / "out/master/NHIT_Infographic_Admission_9x16.mp4"
        ]
        for c in candidates:
            if c.exists():
                video_path = c
                break

    has_video = video_path is not None and video_path.exists()
    
    if has_video:
        w, h, duration_sec, total_frames = get_video_info(video_path)
    else:
        # Default estimation for Remotion still
        is_vertical = "9x16" in comp_name or "Shorts" in comp_name
        w, h = (1080, 1920) if is_vertical else (1920, 1080)
        duration_sec = 30.0
        total_frames = 900

    aspect = "9:16" if h > w else "16:9"

    # Distribute milestone frame positions across timeline
    if num_frames == 9:
        pcts = [0.03, 0.15, 0.27, 0.39, 0.51, 0.63, 0.75, 0.87, 0.97]
        cols, rows = 3, 3
    else: # 6 frames default
        pcts = [0.04, 0.20, 0.40, 0.60, 0.80, 0.96]
        cols, rows = 3, 2

    frame_indices = [int(p * total_frames) for p in pcts]
    timestamps = [p * duration_sec for p in pcts]

    print(f"📸 Generating {num_frames}-Frame Contact Sheet for '{comp_name}' ({aspect})...")
    if has_video:
        print(f"   Using pre-rendered video: {video_path.name} ({duration_sec:.1f}s, {total_frames} frames)")
    else:
        print(f"   Rendering still frames via Remotion CLI...")

    # Extract temporary frame images
    temp_dir = Path(tempfile.mkdtemp(prefix="contact_sheet_"))
    frame_files: List[Path] = []

    try:
        for idx, (f_num, t_sec) in enumerate(zip(frame_indices, timestamps)):
            tmp_f = temp_dir / f"frame_{idx:02d}.png"
            if has_video:
                extract_frame_ffmpeg(video_path, t_sec, tmp_f)
            else:
                extract_frame_remotion(comp_name, f_num, tmp_f)
            frame_files.append(tmp_f)

        # Calculate contact sheet dimensions
        tile_w = 640 if aspect == "16:9" else 360
        tile_h = int(tile_w * (h / w))
        gap = 18
        margin = 24
        header_h = 75

        sheet_w = margin * 2 + (tile_w * cols) + (gap * (cols - 1))
        sheet_h = margin * 2 + header_h + (tile_h * rows) + (gap * (rows - 1))

        # Create master QImage
        sheet_img = QImage(sheet_w, sheet_h, QImage.Format.Format_ARGB32)
        sheet_img.fill(QColor("#060911"))

        painter = QPainter(sheet_img)
        painter.setRenderHint(QPainter.RenderHint.Antialiasing)

        # Draw Header Bar
        painter.setBrush(QColor("#0B1323"))
        painter.setPen(QColor("#1E2C4A"))
        painter.drawRect(margin, margin, sheet_w - (margin * 2), header_h - 12)

        # Header Title
        font_title = QFont("Plus Jakarta Sans", 14, QFont.Weight.Bold)
        font_title.setStyleHint(QFont.StyleHint.SansSerif)
        painter.setFont(font_title)
        painter.setPen(QColor("#00F2FE"))
        painter.drawText(margin + 16, margin + 28, f"🎬 MULTI-FRAME CONTACT SHEET: {comp_name.upper()}")

        # Header Subtitle
        font_sub = QFont("JetBrains Mono", 9)
        painter.setFont(font_sub)
        painter.setPen(QColor("#94A3B8"))
        header_sub = (
            f"Aspect: {aspect} ({w}x{h}) • Duration: {duration_sec:.1f}s ({total_frames} frames) • "
            f"Deliver-and-Verify Visual Audit ({num_frames} Milestones)"
        )
        painter.drawText(margin + 16, margin + 48, header_sub)

        # Safe area legend on right
        if draw_safe_area:
            leg_x = sheet_w - margin - 260
            painter.setFont(QFont("Plus Jakarta Sans", 8, QFont.Weight.Bold))
            painter.setPen(QColor("#00F2FE"))
            painter.drawText(leg_x, margin + 28, "■ 90% Action Safe")
            painter.setPen(QColor("#F59E0B"))
            painter.drawText(leg_x + 130, margin + 28, "■ 80% Title Safe")
            if aspect == "9:16":
                painter.setPen(QColor("#EF4444"))
                painter.drawText(leg_x, margin + 48, "■ Social UI Danger Zone (15% / 20%)")

        # Fonts for tile overlay badges
        font_badge = QFont("JetBrains Mono", 8, QFont.Weight.Bold)

        # Draw Tiles
        curr_y = margin + header_h
        for r in range(rows):
            curr_x = margin
            for c in range(cols):
                tile_idx = r * cols + c
                if tile_idx >= len(frame_files):
                    break

                tile_img_path = frame_files[tile_idx]
                tile_f_num = frame_indices[tile_idx]
                tile_sec = timestamps[tile_idx]

                if tile_img_path.exists():
                    loaded_tile = QImage(str(tile_img_path))
                    scaled_tile = loaded_tile.scaled(tile_w, tile_h, Qt.AspectRatioMode.KeepAspectRatio, Qt.TransformationMode.SmoothTransformation)
                    painter.drawImage(curr_x, curr_y, scaled_tile)

                # Draw 1px tile border
                painter.setBrush(Qt.BrushStyle.NoBrush)
                painter.setPen(QPen(QColor("#1E2C4A"), 1))
                painter.drawRect(curr_x, curr_y, tile_w, tile_h)

                # Safe-Area Overlays on Tile
                if draw_safe_area:
                    # 90% Action Safe (Cyan)
                    ax = int(tile_w * 0.05)
                    ay = int(tile_h * 0.05)
                    aw = int(tile_w * 0.90)
                    ah = int(tile_h * 0.90)
                    pen_action = QPen(QColor(0, 242, 254, 180), 1, Qt.PenStyle.DashLine)
                    painter.setPen(pen_action)
                    painter.drawRect(curr_x + ax, curr_y + ay, aw, ah)

                    # 80% Title Safe (Yellow)
                    tx = int(tile_w * 0.10)
                    ty = int(tile_h * 0.10)
                    tw = int(tile_w * 0.80)
                    th = int(tile_h * 0.80)
                    pen_title = QPen(QColor(245, 158, 11, 180), 1, Qt.PenStyle.DashLine)
                    painter.setPen(pen_title)
                    painter.drawRect(curr_x + tx, curr_y + ty, tw, th)

                    # 9:16 Social Feed Danger Zones
                    if aspect == "9:16":
                        danger_brush = QBrush(QColor(239, 68, 68, 45))
                        painter.setPen(Qt.PenStyle.NoPen)
                        painter.setBrush(danger_brush)
                        # Top 15%
                        painter.drawRect(curr_x, curr_y, tile_w, int(tile_h * 0.15))
                        # Bottom 20%
                        painter.drawRect(curr_x, curr_y + int(tile_h * 0.80), tile_w, int(tile_h * 0.20))

                # Frame Pill Badge
                badge_text = f"F{tile_f_num:03d} • {tile_sec:.2f}s"
                badge_w = 110
                badge_h = 22
                painter.setBrush(QColor(6, 9, 17, 215))
                painter.setPen(QColor(0, 242, 254, 120))
                painter.drawRoundedRect(curr_x + 8, curr_y + 8, badge_w, badge_h, 4, 4)

                painter.setFont(font_badge)
                painter.setPen(QColor("#00F2FE"))
                painter.drawText(curr_x + 14, curr_y + 23, badge_text)

                curr_x += tile_w + gap
            curr_y += tile_h + gap

        painter.end()

        # Save Contact Sheet
        saved = sheet_img.save(str(output_png))
        if not saved:
            raise RuntimeError(f"Failed to save contact sheet to {output_png}")

        # Mirror to docs/screenshots for user guide integration
        docs_screenshot = ROOT / f"docs/screenshots/{comp_name}_contact_sheet.png"
        docs_screenshot.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(str(output_png), str(docs_screenshot))

        print(f"✅ Contact Sheet saved to: {output_png}")
        print(f"   Mirrored to: {docs_screenshot}")
        return output_png

    finally:
        # Cleanup temp directory
        shutil.rmtree(temp_dir, ignore_errors=True)

def main():
    parser = argparse.ArgumentParser(description="Deliver-and-Verify Contact Sheet Generator (iart-ai/motion-skills)")
    parser.add_argument("--comp", default="NHIT-Infographic-16x9", help="Remotion composition name")
    parser.add_argument("--video", type=str, default="", help="Optional pre-rendered MP4 path to extract from")
    parser.add_argument("--frames", type=int, default=6, choices=[6, 9], help="Number of frames to tile (6 or 9)")
    parser.add_argument("--no-safe-area", action="store_true", help="Disable safe-area wireframe overlay")
    parser.add_argument("--out", type=str, default="", help="Custom output image path")
    args = parser.parse_args()

    v_path = Path(args.video) if args.video else None
    out_p = Path(args.out) if args.out else None

    generate_contact_sheet(
        comp_name=args.comp,
        video_path=v_path,
        num_frames=args.frames,
        draw_safe_area=(not args.no_safe_area),
        output_png=out_p
    )

if __name__ == "__main__":
    main()
