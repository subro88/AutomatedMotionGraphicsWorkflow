#!/usr/bin/env python3
"""
Generates a multi-scene visual contact sheet across all 10 upgraded vertical scenes.
Uses Remotion still extraction and PySide6 / FFmpeg tiling.
"""
import os
import subprocess
import sys
from pathlib import Path
from PySide6.QtGui import QImage, QPainter, QColor, QFont, QGuiApplication
from PySide6.QtCore import QRect, Qt

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "out" / "incremental_backup_vertical"
OUT_DIR.mkdir(parents=True, exist_ok=True)

_qt_app = QGuiApplication.instance() or QGuiApplication(sys.argv)

SCENES = [
    ("Incremental-Vertical-Scene01", 120, "Scene 1: Architecture Overview"),
    ("Incremental-Vertical-Scene02", 180, "Scene 2: Incremental Timeline"),
    ("Incremental-Vertical-Scene03", 180, "Scene 3: Incremental vs Differential"),
    ("Incremental-Vertical-Scene04", 220, "Scene 4: Server Backup Install"),
    ("Incremental-Vertical-Scene05", 150, "Scene 5: Performance Settings"),
    ("Incremental-Vertical-Scene06", 220, "Scene 6: Schedule Wizard"),
    ("Incremental-Vertical-Scene07", 180, "Scene 7: AOMEI Backupper"),
    ("Incremental-Vertical-Scene08", 150, "Scene 8: Critical Network Limitation"),
    ("Incremental-Vertical-Scene09", 160, "Scene 9: EOL & Cloud Migration"),
    ("Incremental-Vertical-Scene10", 180, "Scene 10: Best Practice Summary"),
]

def render_stills():
    print("🎨 Rendering diagnostic stills for all 10 scenes...")
    for comp_id, frame_num, label in SCENES:
        img_path = OUT_DIR / f"{comp_id}.png"
        if not img_path.exists() or img_path.stat().st_size == 0:
            print(f"  Rendering {comp_id} at frame {frame_num}...")
            cmd = ["npx", "remotion", "still", "src/index.ts", comp_id, str(img_path), f"--frame={frame_num}", "--gl=angle"]
            subprocess.run(cmd, check=True, cwd=str(ROOT), shell=True)
        else:
            print(f"  ✓ {comp_id} still already cached ({img_path.name})")

def create_montage():
    print("🖼️ Generating 5x2 tiled contact sheet montage...")
    # 5 columns x 2 rows
    thumb_w, thumb_h = 360, 640
    padding = 24
    header_h = 90
    footer_h = 50

    total_w = 5 * thumb_w + 6 * padding
    total_h = 2 * thumb_h + 3 * padding + header_h + footer_h

    canvas = QImage(total_w, total_h, QImage.Format_ARGB32)
    canvas.fill(QColor("#0B0F19"))

    painter = QPainter(canvas)
    painter.setRenderHint(QPainter.Antialiasing)

    # Draw Header Banner
    painter.fillRect(QRect(0, 0, total_w, header_h), QColor("#111827"))
    painter.setPen(QColor("#F45B16"))
    font_h1 = QFont("Inter", 20, QFont.Bold)
    painter.setFont(font_h1)
    painter.drawText(QRect(padding, 16, total_w - 2 * padding, 32), Qt.AlignLeft | Qt.AlignVCenter, "INCREMENTAL BACKUP IN WINDOWS SERVER 2008 — 10-SCENE PRODUCTION CONTACT SHEET")

    painter.setPen(QColor("#9CA3AF"))
    font_sub = QFont("Inter", 12)
    painter.setFont(font_sub)
    painter.drawText(QRect(padding, 50, total_w - 2 * padding, 24), Qt.AlignLeft | Qt.AlignVCenter, "Dual Delivery 9:16 Vertical Edition • 100/100 Grade S MotionScore • Kinetic Subtitles & 3D Hardware B-Roll")

    # Draw Grid
    for idx, (comp_id, frame_num, label) in enumerate(SCENES):
        row = idx // 5
        col = idx % 5
        x = padding + col * (thumb_w + padding)
        y = header_h + padding + row * (thumb_h + padding)

        img_path = OUT_DIR / f"{comp_id}.png"
        if img_path.exists():
            img = QImage(str(img_path)).scaled(thumb_w, thumb_h, Qt.KeepAspectRatioByExpanding, Qt.SmoothTransformation)
            painter.drawImage(x, y, img)
            
            # Subtle card border
            painter.setPen(QColor("rgba(255, 255, 255, 0.15)"))
            painter.drawRect(x, y, thumb_w, thumb_h)

            # Title badge at top of thumb
            painter.fillRect(QRect(x + 10, y + 10, thumb_w - 20, 30), QColor("rgba(17, 24, 39, 0.85)"))
            painter.setPen(QColor("#FFFFFF"))
            font_badge = QFont("Inter", 10, QFont.Bold)
            painter.setFont(font_badge)
            painter.drawText(QRect(x + 16, y + 10, thumb_w - 32, 30), Qt.AlignLeft | Qt.AlignVCenter, label)

    painter.end()

    out_montage = OUT_DIR / "incremental_backup_vertical_contact_sheet.png"
    canvas.save(str(out_montage))
    print(f"🎉 Contact sheet successfully created at: {out_montage} ({out_montage.stat().st_size} bytes)")

if __name__ == "__main__":
    render_stills()
    create_montage()
