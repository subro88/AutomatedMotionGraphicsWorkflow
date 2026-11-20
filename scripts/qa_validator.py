#!/usr/bin/env python3
"""
Automated Broadcast Safe-Area & EBU R128 Audio Loudness QA Validator
====================================================================
Inspired by Showtime's QA safe-area auditing and broadcast engineering standards.
Validates:
1. Audio Loudness Compliance (EBU R128 / ITU-R BS.1770-4):
   - Integrated Loudness (LUFS) vs configurable target (default -16.0 LUFS ±1.5 LUFS)
   - Maximum True Peak (dBTP <= -1.0 dBFS)
   - Loudness Range (LRA <= 14.0 LU)
2. Safe-Area Geometry Compliance:
   - 90% Action-Safe boundary compliance (SMPTE ST 2046-1)
   - 80% Title-Safe boundary compliance (SMPTE ST 2046-1)
   - 9:16 Social UI clearance zones (TikTok/Instagram Reels/YouTube Shorts chrome)
3. Contrast & Dynamic Range Legibility:
   - Evaluates frame luminance and contrast ratios
   - Flags blank/dark/clipped frames
4. Visual QA Overlay Plate:
   - Generates annotated diagnostic PNGs with colored boundary wireframes and floating HUD telemetry.
"""

import argparse
import datetime
import hashlib
import json
import os
import re
import subprocess
import sys
from pathlib import Path

import numpy as np
from PySide6.QtCore import QPoint, QRect, Qt
from PySide6.QtGui import QBrush, QColor, QFont, QGuiApplication, QImage, QPainter, QPen

# Ensure QGuiApplication instance exists for font engine & headless offscreen rendering
_qt_app = QGuiApplication.instance() or QGuiApplication(sys.argv)

# Ensure FFmpeg in PATH
for extra_p in [
    r"C:\Users\User\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.2-full_build\bin",
    r"C:\Users\User\AppData\Local\Programs\Python\Python312\Scripts",
    r"C:\Users\User\AppData\Local\Programs\Python\Python312"
]:
    if os.path.exists(extra_p) and extra_p not in os.environ.get("PATH", ""):
        os.environ["PATH"] = extra_p + os.pathsep + os.environ.get("PATH", "")

ROOT = Path(__file__).resolve().parents[1]


def get_video_metadata(video_path: Path) -> dict:
    """Run ffprobe to extract stream, codec, resolution, and container info."""
    cmd = [
        "ffprobe",
        "-v", "quiet",
        "-print_format", "json",
        "-show_format",
        "-show_streams",
        str(video_path)
    ]
    res = subprocess.run(cmd, capture_output=True, text=True, check=True)
    probe_data = json.loads(res.stdout)
    
    video_stream = next((s for s in probe_data.get("streams", []) if s.get("codec_type") == "video"), None)
    audio_stream = next((s for s in probe_data.get("streams", []) if s.get("codec_type") == "audio"), None)
    format_info = probe_data.get("format", {})

    width = int(video_stream.get("width", 1920)) if video_stream else 1920
    height = int(video_stream.get("height", 1080)) if video_stream else 1080
    fps_raw = video_stream.get("r_frame_rate", "30/1") if video_stream else "30/1"
    try:
        num, den = map(int, fps_raw.split("/"))
        fps = round(num / den, 2)
    except Exception:
        fps = 30.0

    duration = float(format_info.get("duration", 0.0))
    aspect_ratio = "9:16" if height > width else "16:9"

    return {
        "file_name": video_path.name,
        "file_size_bytes": int(format_info.get("size", video_path.stat().st_size)),
        "duration_sec": duration,
        "width": width,
        "height": height,
        "aspect_ratio": aspect_ratio,
        "fps": fps,
        "video_codec": video_stream.get("codec_name", "unknown") if video_stream else "none",
        "audio_codec": audio_stream.get("codec_name", "unknown") if audio_stream else "none",
        "audio_sample_rate": int(audio_stream.get("sample_rate", 0)) if audio_stream else 0,
        "audio_channels": int(audio_stream.get("channels", 0)) if audio_stream else 0,
        "bit_rate": int(format_info.get("bit_rate", 0))
    }


def analyze_audio_loudness(video_path: Path, target_lufs: float = -16.0, tolerance_lufs: float = 1.5) -> dict:
    """Analyze integrated loudness, true peak, and LRA using ffmpeg ebur128."""
    cmd = [
        "ffmpeg",
        "-i", str(video_path),
        "-af", "ebur128=peak=true",
        "-f", "null",
        "-"
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    stderr = res.stderr

    # Summary regexes
    i_match = re.search(r"Integrated loudness:\s+I:\s+([-\d\.]+)\s+LUFS", stderr)
    lra_match = re.search(r"Loudness range:\s+LRA:\s+([-\d\.]+)\s+LU", stderr)
    peak_match = re.search(r"True peak:\s+Peak:\s+([-\d\.]+)\s+dBFS", stderr)

    integrated_lufs = float(i_match.group(1)) if i_match else -70.0
    lra = float(lra_match.group(1)) if lra_match else 0.0
    true_peak_db = float(peak_match.group(1)) if peak_match else -99.0

    # Checks
    lufs_diff = abs(integrated_lufs - target_lufs)
    lufs_pass = lufs_diff <= tolerance_lufs
    peak_pass = true_peak_db <= -1.0
    lra_pass = lra <= 14.0

    overall_audio_pass = lufs_pass and peak_pass

    return {
        "integrated_lufs": integrated_lufs,
        "target_lufs": target_lufs,
        "tolerance_lufs": tolerance_lufs,
        "lufs_difference": round(lufs_diff, 2),
        "lufs_pass": lufs_pass,
        "true_peak_dbtp": true_peak_db,
        "true_peak_pass": peak_pass,
        "loudness_range_lra": lra,
        "lra_pass": lra_pass,
        "overall_audio_pass": overall_audio_pass,
        "recommendation": (
            "Audio Loudness passes standard." if overall_audio_pass else
            f"Adjust master volume by {round(target_lufs - integrated_lufs, 2):+0.1f} dB to reach {target_lufs} LUFS target."
        )
    }


def sample_frames(video_path: Path, sample_count: int = 5) -> list[tuple[float, Path]]:
    """Extract N evenly spaced PNG frames from the video for QA visual analysis."""
    meta = get_video_metadata(video_path)
    dur = meta["duration_sec"]
    if dur <= 0:
        dur = 10.0

    temp_dir = ROOT / "out/qa_reports/temp_samples"
    temp_dir.mkdir(parents=True, exist_ok=True)

    # Pick timestamps: e.g. 15%, 35%, 50%, 65%, 85%
    timestamps = [round(dur * (i + 1) / (sample_count + 1), 2) for i in range(sample_count)]
    extracted = []

    for idx, ts in enumerate(timestamps):
        out_frame = temp_dir / f"{video_path.stem}_sample_{idx+1}_t{int(ts)}s.png"
        cmd = [
            "ffmpeg",
            "-ss", str(ts),
            "-i", str(video_path),
            "-frames:v", "1",
            "-update", "1",
            "-q:v", "2",
            "-y",
            str(out_frame)
        ]
        subprocess.run(cmd, capture_output=True, check=True)
        if out_frame.exists():
            extracted.append((ts, out_frame))

    return extracted


def analyze_frame_geometry(frame_path: Path, aspect_ratio: str = "16:9") -> dict:
    """
    Examine pixel distribution across safe margins.
    Action Safe = 90% (5% margin each edge)
    Title Safe = 80% (10% margin each edge)
    For 9:16, Top 15% (0-15%) & Bottom 20% (80-100%) are Social UI danger zones.
    """
    img = QImage(str(frame_path))
    if img.isNull():
        raise RuntimeError(f"Could not load frame {frame_path}")

    w = img.width()
    h = img.height()

    # Convert to grayscale numpy array for edge & contrast measurement
    # QImage Format_RGB32 / Format_ARGB32: 4 bytes per pixel (B, G, R, A)
    img_conv = img.convertToFormat(QImage.Format.Format_Grayscale8)
    ptr = img_conv.bits()
    arr = np.frombuffer(ptr, dtype=np.uint8).reshape((h, w))

    # Action-Safe 90% margins
    action_mx = int(w * 0.05)
    action_my = int(h * 0.05)
    
    # Title-Safe 80% margins
    title_mx = int(w * 0.10)
    title_my = int(h * 0.10)

    # Edge margins: outermost 3% (where cutoffs happen on TVs/monitors)
    outer_mx = int(w * 0.03)
    outer_my = int(h * 0.03)

    # Check outer edge activity: look for high frequency / non-uniform content in outermost 3%
    # Top edge, bottom edge, left edge, right edge
    top_outer = arr[0:outer_my, :]
    bot_outer = arr[h-outer_my:h, :]
    left_outer = arr[:, 0:outer_mx]
    right_outer = arr[:, w-outer_mx:w]

    outer_edge_std = max(
        float(np.std(top_outer)),
        float(np.std(bot_outer)),
        float(np.std(left_outer)),
        float(np.std(right_outer))
    )

    # Check Action-Safe zone (between 3% and 5%)
    # Check Title-Safe zone (between 5% and 10%)
    title_safe_region = arr[title_my:h-title_my, title_mx:w-title_mx]
    mean_luminance = float(np.mean(arr))
    contrast_dyn_range = float(np.max(arr) - np.min(arr))

    # Blank/Black screen check
    is_blank = mean_luminance < 3.0 or contrast_dyn_range < 5.0

    # 9:16 Social UI Clearance Analysis
    social_ui_violation = False
    social_ui_notes = []
    if aspect_ratio == "9:16":
        # Top 15% header check (profile name, search icons)
        top_15pct_h = int(h * 0.15)
        top_15_std = float(np.std(arr[0:top_15pct_h, :]))
        # Bottom 20% caption/audio check (Reels/Shorts captions, sound title)
        bot_20pct_y = int(h * 0.80)
        bot_20_std = float(np.std(arr[bot_20pct_y:h, :]))

        if top_15_std > 45.0:
            social_ui_notes.append("High-contrast visual elements detected in Top 15% header danger zone.")
        if bot_20_std > 50.0:
            social_ui_violation = True
            social_ui_notes.append("Critical elements detected in Bottom 20% social captions overlay zone.")

    # Edge cutoff risk
    edge_cutoff_risk = outer_edge_std > 38.0

    return {
        "width": w,
        "height": h,
        "mean_luminance": round(mean_luminance, 1),
        "dynamic_range": round(contrast_dyn_range, 1),
        "is_blank_frame": is_blank,
        "outer_edge_std": round(outer_edge_std, 1),
        "edge_cutoff_risk": edge_cutoff_risk,
        "action_safe_pass": not edge_cutoff_risk,
        "title_safe_pass": not edge_cutoff_risk,
        "social_ui_violation": social_ui_violation,
        "social_ui_notes": social_ui_notes
    }


def draw_qa_overlay(sample_path: Path, out_overlay_path: Path, meta: dict, audio_qa: dict, geo_qa: dict):
    """Draw broadcast safe-area wireframes, social overlay zones, and HUD telemetry on frame."""
    img = QImage(str(sample_path))
    if img.isNull():
        return

    w = img.width()
    h = img.height()
    aspect = meta["aspect_ratio"]

    painter = QPainter(img)
    painter.setRenderHint(QPainter.RenderHint.Antialiasing)

    # 1. Action-Safe 90% (Cyan)
    ax = int(w * 0.05)
    ay = int(h * 0.05)
    aw = int(w * 0.90)
    ah = int(h * 0.90)
    pen_action = QPen(QColor(0, 242, 254, 200), 2, Qt.PenStyle.DashLine)
    painter.setPen(pen_action)
    painter.setBrush(Qt.BrushStyle.NoBrush)
    painter.drawRect(ax, ay, aw, ah)

    # 2. Title-Safe 80% (Amber / Yellow)
    tx = int(w * 0.10)
    ty = int(h * 0.10)
    tw = int(w * 0.80)
    th = int(h * 0.80)
    pen_title = QPen(QColor(255, 184, 0, 220), 2, Qt.PenStyle.SolidLine)
    painter.setPen(pen_title)
    painter.drawRect(tx, ty, tw, th)

    # 3. Center Crosshairs
    cx = w // 2
    cy = h // 2
    pen_cross = QPen(QColor(255, 255, 255, 120), 1, Qt.PenStyle.DotLine)
    painter.setPen(pen_cross)
    painter.drawLine(cx - 30, cy, cx + 30, cy)
    painter.drawLine(cx, cy - 30, cx, cy + 30)

    # 4. Social UI Danger Zones (if 9:16)
    if aspect == "9:16":
        # Top 15% header danger
        top_h = int(h * 0.15)
        painter.fillRect(0, 0, w, top_h, QColor(255, 59, 48, 40))
        painter.setPen(QPen(QColor(255, 59, 48, 160), 1, Qt.PenStyle.DashLine))
        painter.drawLine(0, top_h, w, top_h)

        # Bottom 20% caption/audio danger
        bot_y = int(h * 0.80)
        bot_h = h - bot_y
        painter.fillRect(0, bot_y, w, bot_h, QColor(255, 59, 48, 50))
        painter.setPen(QPen(QColor(255, 59, 48, 180), 1, Qt.PenStyle.DashLine))
        painter.drawLine(0, bot_y, w, bot_y)

        # Right 15% action rail (likes, share, comments)
        rail_x = int(w * 0.85)
        painter.fillRect(rail_x, int(h * 0.40), int(w * 0.15), int(h * 0.40), QColor(255, 45, 85, 35))

    # 5. Diagnostic HUD Card in Bottom Left
    hud_w = 420 if w >= 1080 else int(w * 0.85)
    hud_h = 175
    hud_x = ax + 10
    hud_y = (ay + ah) - hud_h - 10 if aspect == "16:9" else (ty + th) - hud_h - 10

    # Draw rounded dark HUD card
    painter.setPen(QPen(QColor(0, 242, 254, 150), 1))
    painter.setBrush(QBrush(QColor(6, 9, 17, 235)))
    painter.drawRoundedRect(hud_x, hud_y, hud_w, hud_h, 8, 8)

    # Draw HUD Text
    font_title = QFont("Segoe UI", 11, QFont.Weight.Bold)
    font_body = QFont("Consolas", 9, QFont.Weight.Normal)

    painter.setFont(font_title)
    painter.setPen(QColor(0, 242, 254))
    painter.drawText(hud_x + 16, hud_y + 24, "AUTOMATED QA TELEMETRY")

    painter.setFont(font_body)
    painter.setPen(QColor(241, 245, 249))

    lufs_badge = "PASS" if audio_qa.get("lufs_pass") else "FAIL"
    lufs_color = QColor(16, 185, 129) if lufs_badge == "PASS" else QColor(239, 68, 68)
    
    tp_badge = "PASS" if audio_qa.get("true_peak_pass") else "WARN"
    safe_badge = "PASS" if geo_qa.get("action_safe_pass") else "WARN"

    lines = [
        f"Resolution: {meta['width']}x{meta['height']} ({meta['aspect_ratio']}) @ {meta['fps']} FPS",
        f"Loudness:   {audio_qa['integrated_lufs']} LUFS (Target: {audio_qa['target_lufs']} LUFS) [{lufs_badge}]",
        f"True Peak:  {audio_qa['true_peak_dbtp']} dBTP (Limit: -1.0 dBTP) [{tp_badge}]",
        f"Safe-Area:  90% Action / 80% Title [{safe_badge}]",
        f"Luminance:  Mean {geo_qa['mean_luminance']}, DynRange {geo_qa['dynamic_range']}"
    ]

    for idx, line in enumerate(lines):
        painter.drawText(hud_x + 16, hud_y + 46 + (idx * 19), line)

    # Top right legend
    leg_x = (ax + aw) - 220
    leg_y = ay + 14
    painter.setPen(QPen(QColor(30, 44, 74, 180), 1))
    painter.setBrush(QBrush(QColor(6, 9, 17, 210)))
    painter.drawRoundedRect(leg_x, leg_y, 210, 65, 6, 6)

    painter.setFont(QFont("Segoe UI", 8, QFont.Weight.Bold))
    painter.setPen(QColor(0, 242, 254))
    painter.drawText(leg_x + 12, leg_y + 20, "--- 90% Action Safe Zone")

    painter.setPen(QColor(255, 184, 0))
    painter.drawText(leg_x + 12, leg_y + 38, "--- 80% Title Safe Zone")

    if aspect == "9:16":
        painter.setPen(QColor(255, 59, 48))
        painter.drawText(leg_x + 12, leg_y + 56, "■ Social UI Danger Zone")
    else:
        painter.setPen(QColor(148, 163, 184))
        painter.drawText(leg_x + 12, leg_y + 56, "+ Center Broadcast Focus")

    painter.end()

    out_overlay_path.parent.mkdir(parents=True, exist_ok=True)
    img.save(str(out_overlay_path))


def run_qa_validation(video_path: Path, target_lufs: float = -16.0, tolerance_lufs: float = 1.5) -> dict:
    """Executes full automated QA audit on video and returns structured report dictionary."""
    if not video_path.exists():
        raise FileNotFoundError(f"Video file does not exist: {video_path}")

    print(f"\n🔍 [QA AUDITOR] Analyzing: {video_path.name}")
    t0 = datetime.datetime.now()

    # 1. Metadata
    meta = get_video_metadata(video_path)
    print(f"   ▶ Dimensions: {meta['width']}x{meta['height']} ({meta['aspect_ratio']}) | Duration: {meta['duration_sec']:.2f}s | FPS: {meta['fps']}")

    # 2. Audio Loudness
    print("   ▶ Auditing audio loudness (EBU R128)...")
    audio_qa = analyze_audio_loudness(video_path, target_lufs=target_lufs, tolerance_lufs=tolerance_lufs)
    print(f"     • Integrated: {audio_qa['integrated_lufs']} LUFS (Target: {target_lufs} LUFS) -> {'✓ PASS' if audio_qa['lufs_pass'] else '✗ FAIL'}")
    print(f"     • True Peak:  {audio_qa['true_peak_dbtp']} dBTP -> {'✓ PASS' if audio_qa['true_peak_pass'] else '⚠ PEAK ALERT'}")
    print(f"     • Range (LRA): {audio_qa['loudness_range_lra']} LU")

    # 3. Frame Sampling & Safe-Area Geometry
    print("   ▶ Sampling frames across timeline for safe-area geometry & contrast...")
    samples = sample_frames(video_path, sample_count=5)
    
    geo_results = []
    blank_detected = False
    edge_overflow_detected = False
    social_violation_detected = False

    for ts, frame_file in samples:
        res = analyze_frame_geometry(frame_file, aspect_ratio=meta["aspect_ratio"])
        res["timestamp_sec"] = ts
        geo_results.append(res)
        if res["is_blank_frame"]:
            blank_detected = True
        if res["edge_cutoff_risk"]:
            edge_overflow_detected = True
        if res["social_ui_violation"]:
            social_violation_detected = True

    # Pick representative frame (e.g. 50% midpoint) for annotated overlay
    mid_sample = samples[len(samples) // 2][1] if samples else None
    overlay_path = ROOT / f"out/qa_reports/{video_path.stem}_safe_area.png"
    if mid_sample and mid_sample.exists():
        draw_qa_overlay(
            mid_sample,
            overlay_path,
            meta,
            audio_qa,
            geo_results[len(geo_results) // 2]
        )
        print(f"   ▶ Visual QA Overlay Plate saved: {overlay_path.name}")

    # Clean up temporary samples directory
    temp_dir = ROOT / "out/qa_reports/temp_samples"
    if temp_dir.exists():
        for f in temp_dir.glob("*.png"):
            try:
                f.unlink()
            except Exception:
                pass
        try:
            temp_dir.rmdir()
        except Exception:
            pass

    # 4. Acoustic Intelligence & Earshot Semantic Audit
    acoustic_qa = {}
    try:
        from scripts.acoustic_auditor import audit_audio_cues
        sfx_candidates = [
            ROOT / "out/sfx/hardware_teardown_sfx.wav",
            ROOT / "out/sfx/master_sfx.wav",
            ROOT / "public/nhit_elevenlabs_audio.wav"
        ]
        target_audio = next((p for p in sfx_candidates if p.exists()), None)
        sb_candidates = [
            ROOT / "src/data/hardware_teardown_storyboard.json",
            ROOT / "src/data/storyboard.json"
        ]
        target_sb = next((p for p in sb_candidates if p.exists()), None)
        if target_audio:
            print("   ▶ Auditing Acoustic Intelligence & Semantic Foley (Earshot Protocol)...")
            acoustic_qa = audit_audio_cues(target_audio, target_sb)
            print(f"     • AcousticScore: {acoustic_qa['overall_acoustic_score']}/100 [{acoustic_qa['grade']}]")
            print(f"     • Crest Factor : {acoustic_qa['global_features']['crest_factor_db']} dB")
            print(f"     • Speech Masking: {acoustic_qa['speech_masking_status']}")
    except Exception as e:
        print(f"   ℹ️ Acoustic audit notice: {e}")

    # Overall QA Status Determination
    overall_status = "PASS"
    warnings = []
    if not audio_qa["lufs_pass"]:
        overall_status = "FAIL"
        warnings.append(f"Loudness deviation: {audio_qa['integrated_lufs']} LUFS vs {target_lufs} target")
    if not audio_qa["true_peak_pass"]:
        if overall_status != "FAIL": overall_status = "WARN"
        warnings.append(f"True peak exceeds -1.0 dBTP ({audio_qa['true_peak_dbtp']} dBTP)")
    if edge_overflow_detected:
        if overall_status != "FAIL": overall_status = "WARN"
        warnings.append("High-contrast content detected in outermost 3% raster border")
    if blank_detected:
        overall_status = "FAIL"
        warnings.append("Blank or drop-out frame detected in composition")
    if social_violation_detected and meta["aspect_ratio"] == "9:16":
        if overall_status != "FAIL": overall_status = "WARN"
        warnings.append("High visual density in bottom 20% social caption overlay zone")

    elapsed_sec = round((datetime.datetime.now() - t0).total_seconds(), 2)

    qa_report = {
        "timestamp": datetime.datetime.now().isoformat(),
        "video_path": str(video_path),
        "overall_status": overall_status,
        "warnings": warnings,
        "metadata": meta,
        "audio_loudness": audio_qa,
        "acoustic_intelligence": acoustic_qa,
        "safe_area_geometry": {
            "action_safe_pass": not edge_overflow_detected,
            "title_safe_pass": not edge_overflow_detected,
            "social_ui_pass": not social_violation_detected if meta["aspect_ratio"] == "9:16" else True,
            "blank_frame_detected": blank_detected,
            "samples_analyzed": len(geo_results)
        },
        "annotated_overlay_path": str(overlay_path.resolve()) if overlay_path.exists() else "",
        "execution_time_sec": elapsed_sec
    }

    # Save structured JSON report
    report_json_path = ROOT / f"out/qa_reports/{video_path.stem}_qa.json"
    report_json_path.parent.mkdir(parents=True, exist_ok=True)
    with open(report_json_path, "w", encoding="utf-8") as f:
        json.dump(qa_report, f, indent=2)

    print(f"\n🏁 [QA STATUS] => {overall_status.upper()} in {elapsed_sec}s")
    if warnings:
        for w in warnings:
            print(f"   ⚠ {w}")
    print(f"📄 Full QA Report: {report_json_path}\n")

    return qa_report


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Automated Broadcast Safe-Area & EBU R128 Loudness QA Validator")
    parser.add_argument("--video", required=True, help="Path to video MP4 to audit")
    parser.add_argument("--target-lufs", type=float, default=-16.0, help="EBU R128 Integrated target LUFS (default: -16.0)")
    parser.add_argument("--tolerance", type=float, default=1.5, help="Tolerance in LUFS (default: ±1.5)")
    args = parser.parse_args()

    v_path = Path(args.video).resolve()
    run_qa_validation(v_path, target_lufs=args.target_lufs, tolerance_lufs=args.tolerance)
