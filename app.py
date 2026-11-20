#!/usr/bin/env python3
import json
import os
import shutil
import sqlite3
import subprocess
import sys
import threading
import time
from pathlib import Path

from PySide6.QtCore import QObject, QThread, Qt, QUrl, Signal, Slot
from PySide6.QtGui import QColor, QFont, QIcon, QPixmap
from PySide6.QtWidgets import (
    QApplication,
    QCheckBox,
    QColorDialog,
    QComboBox,
    QFileDialog,
    QFormLayout,
    QFrame,
    QGridLayout,
    QGroupBox,
    QHBoxLayout,
    QHeaderView,
    QLabel,
    QLineEdit,
    QMainWindow,
    QMessageBox,
    QProgressBar,
    QPushButton,
    QScrollArea,
    QSlider,
    QSpinBox,
    QSplitter,
    QTableWidget,
    QTableWidgetItem,
    QTabWidget,
    QTextEdit,
    QVBoxLayout,
    QWidget,
)

# Ensure FFmpeg and Python on Windows
for extra_p in [
    r"C:\Users\User\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.2-full_build\bin",
    r"C:\Users\User\AppData\Local\Programs\Python\Python312\Scripts",
    r"C:\Users\User\AppData\Local\Programs\Python\Python312"
]:
    if os.path.exists(extra_p) and extra_p not in os.environ.get("PATH", ""):
        os.environ["PATH"] = extra_p + os.pathsep + os.environ.get("PATH", "")

ROOT = Path(__file__).resolve().parent
DB_PATH = ROOT / "out/pipeline_history.db"

DARK_STYLESHEET = """
QMainWindow {
    background-color: #060911;
}
QWidget {
    color: #f1f5f9;
    font-family: 'Segoe UI', 'Plus Jakarta Sans', sans-serif;
    font-size: 13px;
}
QTabWidget::pane {
    border: 1px solid #1e2c4a;
    background-color: #0c1322;
    border-radius: 8px;
    top: -1px;
}
QTabBar::tab {
    background: #090e1a;
    border: 1px solid #1e2c4a;
    padding: 10px 20px;
    margin-right: 4px;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    color: #94a3b8;
    font-weight: 600;
}
QTabBar::tab:selected {
    background: #0c1322;
    border-bottom-color: #0c1322;
    color: #00f2fe;
}
QTabBar::tab:hover {
    color: #ffffff;
}
QGroupBox {
    border: 1px solid #1e2c4a;
    border-radius: 8px;
    margin-top: 14px;
    padding-top: 14px;
    background: #0c1322;
    font-weight: bold;
    color: #00f2fe;
}
QGroupBox::title {
    subcontrol-origin: margin;
    left: 14px;
    padding: 0 6px;
}
QPushButton {
    background: #111a2f;
    border: 1px solid #1e2c4a;
    color: #f1f5f9;
    padding: 8px 16px;
    border-radius: 6px;
    font-weight: 600;
}
QPushButton:hover {
    background: #16223c;
    border-color: #00f2fe;
}
QPushButton:pressed {
    background: #090e1a;
}
QPushButton#primaryBtn {
    background: qlineargradient(x1:0, y1:0, x2:1, y2:0, stop:0 #00f2fe, stop:1 #4facfe);
    color: #060911;
    border: none;
    font-weight: 800;
    padding: 10px 22px;
}
QPushButton#primaryBtn:hover {
    background: qlineargradient(x1:0, y1:0, x2:1, y2:0, stop:0 #38bdf8, stop:1 #60a5fa);
}
QLineEdit, QTextEdit, QComboBox, QSpinBox {
    background-color: #090e1a;
    border: 1px solid #1e2c4a;
    border-radius: 6px;
    padding: 6px 10px;
    color: #ffffff;
}
QLineEdit:focus, QTextEdit:focus, QComboBox:focus, QSpinBox:focus {
    border-color: #00f2fe;
}
QProgressBar {
    border: 1px solid #1e2c4a;
    border-radius: 6px;
    text-align: center;
    background-color: #090e1a;
    color: #ffffff;
    font-weight: bold;
}
QProgressBar::chunk {
    background: qlineargradient(x1:0, y1:0, x2:1, y2:0, stop:0 #00f2fe, stop:1 #4facfe);
    border-radius: 5px;
}
QTableWidget {
    background-color: #090e1a;
    border: 1px solid #1e2c4a;
    gridline-color: #1e2c4a;
    border-radius: 6px;
}
QHeaderView::section {
    background-color: #0f182c;
    color: #94a3b8;
    padding: 6px;
    border: 1px solid #1e2c4a;
    font-weight: bold;
    font-size: 12px;
}
QScrollBar:vertical {
    border: none;
    background: #090e1a;
    width: 8px;
    border-radius: 4px;
}
QScrollBar::handle:vertical {
    background: #1e2c4a;
    min-height: 20px;
    border-radius: 4px;
}
QScrollBar::handle:vertical:hover {
    background: #00f2fe;
}
"""

class BlenderScrubBox(QWidget):
    """
    Blender-inspired Drag-to-Scrub Numeric Box (BUI style).
    - Drag horizontally to continuously scrub values.
    - Shift + Drag for high-precision micro-adjustment.
    - Double-click to switch to inline QLineEdit for typing exact numbers.
    - Subtle horizontal progress fill bar indicating value position.
    - Left/Right nudge chevrons (◀ and ▶).
    - Mouse wheel increment/decrement.
    """
    valueChanged = Signal(float)
    editingFinished = Signal(float)

    def __init__(self, min_val=0.0, max_val=100.0, val=50.0, step=1.0, decimals=0, prefix="", suffix="", fill_color="#087EFF", parent=None):
        super().__init__(parent)
        self.min_val = float(min_val)
        self.max_val = float(max_val)
        self.current_val = float(val)
        self.step = float(step)
        self.decimals = int(decimals)
        self.prefix = prefix
        self.suffix = suffix
        self.fill_color = QColor(fill_color)
        
        self.is_dragging = False
        self.drag_start_x = 0
        self.drag_start_val = 0.0
        self.hover = False

        self.setFixedHeight(28)
        self.setMinimumWidth(140)
        self.setCursor(Qt.CursorShape.SizeHorCursor)

        self.editor = QLineEdit(self)
        self.editor.setVisible(False)
        self.editor.setStyleSheet("background: #060911; border: 1px solid #00f2fe; color: #ffffff; border-radius: 4px; padding: 2px 6px; font-weight: bold;")
        self.editor.returnPressed.connect(self._finish_editing)
        self.editor.editingFinished.connect(self._finish_editing)

    def value(self) -> float:
        return self.current_val

    def setValue(self, val: float):
        clamped = max(self.min_val, min(self.max_val, float(val)))
        if clamped != self.current_val:
            self.current_val = clamped
            self.valueChanged.emit(self.current_val)
            self.update()

    def setSuffix(self, suffix: str):
        self.suffix = suffix
        self.update()

    def enterEvent(self, event):
        self.hover = True
        self.update()

    def leaveEvent(self, event):
        self.hover = False
        self.update()

    def paintEvent(self, event):
        painter = QPainter(self)
        painter.setRenderHint(QPainter.RenderHint.Antialiasing)

        w = self.width()
        h = self.height()

        bg_color = QColor(14, 20, 34) if self.hover else QColor(10, 15, 26)
        border_color = QColor(0, 242, 254) if (self.hover or self.is_dragging) else QColor(30, 44, 74)
        painter.setBrush(QBrush(bg_color))
        painter.setPen(QPen(border_color, 1))
        painter.drawRoundedRect(1, 1, w - 2, h - 2, 5, 5)

        span = self.max_val - self.min_val
        pct = (self.current_val - self.min_val) / span if span > 0 else 0.0
        pct = max(0.0, min(1.0, pct))
        fill_w = int((w - 4) * pct)
        if fill_w > 0:
            fill_c = QColor(self.fill_color)
            fill_c.setAlpha(65 if self.hover else 45)
            painter.setBrush(QBrush(fill_c))
            painter.setPen(Qt.PenStyle.NoPen)
            painter.drawRoundedRect(2, 2, fill_w, h - 4, 4, 4)

        painter.setFont(QFont("Segoe UI", 7))
        painter.setPen(QColor(100, 116, 139) if not self.hover else QColor(148, 163, 184))
        painter.drawText(6, h // 2 + 3, "◀")
        painter.drawText(w - 12, h // 2 + 3, "▶")

        painter.setFont(QFont("Segoe UI", 9, QFont.Weight.Bold))
        text_color = QColor(0, 242, 254) if self.is_dragging else QColor(241, 245, 249)
        painter.setPen(text_color)

        formatted_num = f"{self.current_val:.{self.decimals}f}" if self.decimals > 0 else f"{int(round(self.current_val))}"
        label_text = f"{self.prefix}: {formatted_num}{self.suffix}" if self.prefix else f"{formatted_num}{self.suffix}"
        
        painter.drawText(QRect(16, 0, w - 32, h), Qt.AlignmentFlag.AlignCenter, label_text)
        painter.end()

    def mousePressEvent(self, event):
        if event.button() == Qt.MouseButton.LeftButton:
            x = event.pos().x()
            if x <= 16:
                self.setValue(self.current_val - self.step)
                self.editingFinished.emit(self.current_val)
                return
            elif x >= self.width() - 16:
                self.setValue(self.current_val + self.step)
                self.editingFinished.emit(self.current_val)
                return

            self.is_dragging = True
            self.drag_start_x = event.globalPosition().x()
            self.drag_start_val = self.current_val
            self.setCursor(Qt.CursorShape.SizeHorCursor)
            self.update()

    def mouseMoveEvent(self, event):
        if self.is_dragging:
            cur_x = event.globalPosition().x()
            delta_px = cur_x - self.drag_start_x

            is_shift = bool(event.modifiers() & Qt.KeyboardModifier.ShiftModifier)
            precision = 0.1 if is_shift else 1.0

            span = self.max_val - self.min_val
            delta_val = (delta_px / 200.0) * span * precision

            new_val = self.drag_start_val + delta_val
            if self.decimals == 0:
                new_val = round(new_val)
            self.setValue(new_val)

    def mouseReleaseEvent(self, event):
        if self.is_dragging:
            self.is_dragging = False
            self.editingFinished.emit(self.current_val)
            self.update()

    def mouseDoubleClickEvent(self, event):
        self.editor.setGeometry(2, 2, self.width() - 4, self.height() - 4)
        formatted = f"{self.current_val:.{self.decimals}f}" if self.decimals > 0 else str(int(round(self.current_val)))
        self.editor.setText(formatted)
        self.editor.selectAll()
        self.editor.setVisible(True)
        self.editor.setFocus()

    def _finish_editing(self):
        if self.editor.isVisible():
            txt = self.editor.text().strip()
            try:
                new_val = float(txt)
                self.setValue(new_val)
                self.editingFinished.emit(self.current_val)
            except ValueError:
                pass
            self.editor.setVisible(False)
            self.update()

    def wheelEvent(self, event):
        delta = 1 if event.angleDelta().y() > 0 else -1
        is_shift = bool(event.modifiers() & Qt.KeyboardModifier.ShiftModifier)
        effective_step = self.step * (0.1 if is_shift else 1.0)
        self.setValue(self.current_val + (delta * effective_step))
        self.editingFinished.emit(self.current_val)

class Worker(QObject):
    log_signal = Signal(str)
    progress_signal = Signal(int)
    step_signal = Signal(str)
    finished_signal = Signal(bool, str)

    def __init__(self, cmd_args, cwd=ROOT):
        super().__init__()
        self.cmd_args = cmd_args
        self.cwd = cwd

    def run(self):
        try:
            self.log_signal.emit(f"🚀 Executing: {' '.join(self.cmd_args)}\n")
            proc = subprocess.Popen(
                self.cmd_args,
                cwd=str(self.cwd),
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                bufsize=1,
                universal_newlines=True
            )
            for line in proc.stdout:
                line_str = line.strip()
                self.log_signal.emit(line_str)
                if "[STEP]" in line_str:
                    step_name = line_str.split("[STEP]")[-1].replace("...", "").strip()
                    self.step_signal.emit(step_name)

            proc.wait()
            if proc.returncode == 0:
                self.finished_signal.emit(True, "Process completed successfully!")
            else:
                self.finished_signal.emit(False, f"Process exited with error code {proc.returncode}")
        except Exception as e:
            self.finished_signal.emit(False, str(e))

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Motion Graphics & DaVinci Resolve Workstation")
        self.resize(1200, 840)
        self.setStyleSheet(DARK_STYLESHEET)

        self.worker_thread = None
        self.worker = None

        self.init_ui()
        self.load_history_from_db()

    def init_ui(self):
        central = QWidget()
        self.setCentralWidget(central)
        main_layout = QVBoxLayout(central)
        main_layout.setContentsMargins(18, 16, 18, 16)
        main_layout.setSpacing(12)

        # Header Title Bar
        header = QHBoxLayout()
        title_box = QVBoxLayout()
        title = QLabel("Automated Motion Graphics Workstation")
        title.setStyleSheet("font-size: 22px; font-weight: 800; color: #ffffff;")
        subtitle = QLabel("Unified Multimodal Studio: Voice Box • Remotion • 3D WebGL • Whisper • DaVinci Resolve")
        subtitle.setStyleSheet("color: #94a3b8; font-size: 13px;")
        title_box.addWidget(title)
        title_box.addWidget(subtitle)
        header.addLayout(title_box)
        header.addStretch()

        self.btn_studio = QPushButton("🎨 Launch Remotion Studio")
        self.btn_studio.clicked.connect(self.launch_remotion_studio)
        header.addWidget(self.btn_studio)

        self.btn_guide = QPushButton("📖 User Guide")
        self.btn_guide.clicked.connect(self.open_user_guide)
        header.addWidget(self.btn_guide)

        main_layout.addLayout(header)

        # Tabs Widget
        self.tabs = QTabWidget()
        self.tab_script = QWidget()
        self.tab_storyboard = QWidget()
        self.tab_remotion = QWidget()
        self.tab_subtitles = QWidget()
        self.tab_resolve = QWidget()
        self.tab_qa = QWidget()

        self.tabs.addTab(self.tab_script, "🎙️ 1. Voice Box & Script")
        self.tabs.addTab(self.tab_storyboard, "🎬 2. Visual Storyboard")
        self.tabs.addTab(self.tab_remotion, "✨ 3. Motion Graphics Tweak Studio")
        self.tabs.addTab(self.tab_subtitles, "📝 4. Shorts & Subtitles")
        self.tabs.addTab(self.tab_resolve, "🎞️ 5. DaVinci Resolve & History")
        self.tabs.addTab(self.tab_qa, "🛡️ 6. Automated QA & Provenance Ledger")

        self.setup_tab_script()
        self.setup_tab_storyboard()
        self.setup_tab_remotion()
        self.setup_tab_subtitles()
        self.setup_tab_resolve()
        self.setup_tab_qa()

        main_layout.addWidget(self.tabs, stretch=1)

        # Execution Progress & Global Run Bar
        exec_box = QGroupBox("Global Pipeline Execution")
        exec_layout = QVBoxLayout(exec_box)

        bar_row = QHBoxLayout()
        self.lbl_current_step = QLabel("Ready")
        self.lbl_current_step.setStyleSheet("color: #00f2fe; font-weight: bold;")
        bar_row.addWidget(QLabel("Current Phase:"))
        bar_row.addWidget(self.lbl_current_step)
        bar_row.addStretch()

        self.btn_run_all = QPushButton("▶ Run Entire Autonomous Pipeline")
        self.btn_run_all.setObjectName("primaryBtn")
        self.btn_run_all.clicked.connect(self.run_entire_pipeline)
        bar_row.addWidget(self.btn_run_all)
        exec_layout.addLayout(bar_row)

        self.prog_bar = QProgressBar()
        self.prog_bar.setRange(0, 0) # indeterminate while running
        self.prog_bar.setVisible(False)
        self.prog_bar.setFixedHeight(12)
        exec_layout.addWidget(self.prog_bar)

        # Collapsible Console Log
        self.console = QTextEdit()
        self.console.setReadOnly(True)
        self.console.setFixedHeight(120)
        self.console.setStyleSheet("background-color: #05070d; font-family: 'Consolas', monospace; font-size: 12px; color: #38bdf8;")
        exec_layout.addWidget(self.console)

        main_layout.addWidget(exec_box)

    # -------------------------------------------------------------
    # TAB 1: Voice Box & Script
    # -------------------------------------------------------------
    def setup_tab_script(self):
        layout = QVBoxLayout(self.tab_script)
        layout.setContentsMargins(14, 14, 14, 14)

        form = QFormLayout()

        self.txt_project = QLineEdit("MyProductionDeck")
        form.addRow("Project Name:", self.txt_project)

        self.combo_genre = QComboBox()
        self.combo_genre.addItems([
            "1. 🎨 Motion Graphics (Ads, Flyers, Vox, Infographics)",
            "2. 🔬 3D Realistic Explainer (Branch Education Teardown)",
            "3. 📜 Documentary, History & Cartoon (Vox / Kurzgesagt)",
            "4. 🎙️ Podcast, Vodcast & Audiograms (Multi-Speaker & Waves)"
        ])
        form.addRow("Production Genre:", self.combo_genre)

        self.combo_aspect = QComboBox()
        self.combo_aspect.addItems(["9:16 (Vertical Shorts / Reels)", "16:9 (Landscape / YouTube)"])
        form.addRow("Aspect Ratio:", self.combo_aspect)

        self.txt_script = QTextEdit()
        self.txt_script.setPlaceholderText("Enter narration script text here or load a script file...")
        self.txt_script.setText(
            "Autonomous motion graphics revolutionize enterprise media production. "
            "Our pipeline delivers 99.8% precision with multi-track DaVinci Resolve timeline assembly. "
            "Quarterly benchmarks reveal a 142% throughput surge across all video channels."
        )
        self.txt_script.setFixedHeight(110)
        form.addRow("Script Text:", self.txt_script)

        self.combo_voice = QComboBox()
        self.combo_voice.addItems([
            # Indian English & Hindi Voices
            "en-IN-PrabhatNeural (Indian English Male - Natural Narrator 🇮🇳)",
            "en-IN-NeerjaNeural (Indian English Female - Engaging Corporate 🇮🇳)",
            "en-IN-NeerjaExpressiveNeural (Indian English Female - Expressive 🇮🇳)",
            "hi-IN-MadhurNeural (Hindi Male - Clear Voiceover 🇮🇳)",
            "hi-IN-SwaraNeural (Hindi Female - Smooth Broadcast 🇮🇳)",
            # Bengali / Bangla Voices (Bilingual English Friendly)
            "bn-IN-BashkarNeural (Bengali India Male - Warm Narrator 🇮🇳)",
            "bn-IN-TanishaaNeural (Bengali India Female - Clear & Modern 🇮🇳)",
            "bn-BD-PradeepNeural (Bangla Male - Professional BD 🇧🇩)",
            "bn-BD-NabanitaNeural (Bangla Female - Expressive BD 🇧🇩)",
            # Kokoro-82M Local Offline Engine (Jamie Pine Voicebox Stack)
            "kokoro-hindi-female (Kokoro Local - Hindi Female [hf_alpha])",
            "kokoro-hindi-male (Kokoro Local - Hindi Male [hm_omega])",
            "kokoro-heart (Kokoro Local - Warm Conversational Female ⭐)",
            "kokoro-adam (Kokoro Local - Tech Founder / Dynamic Male)",
            "kokoro-bella (Kokoro Local - Upbeat / Energetic Female)",
            "kokoro-sarah (Kokoro Local - Clear American Narrator Female)",
            "kokoro-michael (Kokoro Local - Authoritative Documentary Male)",
            "kokoro-george (Kokoro Local - Sophisticated British Male)",
            "kokoro-alice (Kokoro Local - British Storyteller Female)",
            # Edge-TTS Neural Cloud Engine (US & UK)
            "en-US-ChristopherNeural (Edge Cloud - Tech / Authoritative)",
            "en-US-GuyNeural (Edge Cloud - Energetic / YouTube)",
            "en-US-JennyNeural (Edge Cloud - Friendly / Engaging)",
            "en-US-AriaNeural (Edge Cloud - Professional Female)",
            "en-US-EricNeural (Edge Cloud - Conversational)",
            "en-GB-RyanNeural (Edge Cloud - British Documentary)",
            "en-AU-WilliamNeural (Edge Cloud - Australian Narrator)"
        ])
        form.addRow("Neural Voice:", self.combo_voice)

        # Voice Clone & Style Blend Row
        clone_row = QHBoxLayout()
        self.txt_clone = QLineEdit()
        self.txt_clone.setPlaceholderText("Optional: sample WAV in assets/voices/ or blend e.g. af_heart:0.6,am_adam:0.4")
        btn_browse_clone = QPushButton("Browse...")
        btn_browse_clone.clicked.connect(self.browse_clone_file)
        clone_row.addWidget(self.txt_clone)
        clone_row.addWidget(btn_browse_clone)
        form.addRow("Voice Clone / Blend:", clone_row)

        layout.addLayout(form)

        btn_row = QHBoxLayout()
        btn_synth = QPushButton("🎙️ Synthesize & Master Voiceover Only")
        btn_synth.clicked.connect(self.synthesize_voiceover_only)
        btn_row.addWidget(btn_synth)

        btn_open_vb = QPushButton("🎧 Open Voice Box Quick Studio")
        btn_open_vb.clicked.connect(self.launch_voicebox_quick_studio)
        btn_row.addWidget(btn_open_vb)
        btn_row.addStretch()
        layout.addLayout(btn_row)
        layout.addStretch()

    # -------------------------------------------------------------
    # TAB 2: Visual Storyboard Director (Motion Video Director Recipes)
    # -------------------------------------------------------------
    def setup_tab_storyboard(self):
        layout = QVBoxLayout(self.tab_storyboard)
        layout.setContentsMargins(14, 14, 14, 14)
        layout.setSpacing(10)

        # Control Bar with Recipe Selector
        ctrl_bar = QHBoxLayout()
        lbl_rec = QLabel("🎬 Director Recipe:")
        lbl_rec.setStyleSheet("font-weight: bold; color: #38bdf8; font-size: 13px;")
        ctrl_bar.addWidget(lbl_rec)

        self.combo_sb_recipe = QComboBox()
        self.combo_sb_recipe.addItems([
            "🏆 NHIT Technical Admission Campaign (16:9 & 9:16)",
            "⚡ SaaS Product Launch (Slack-style 16:9)",
            "📱 Premium Talking-Head Caption Reel (9:16 Vertical)",
            "🎞️ Cinematic Storyteller Documentary (16:9 Landscape)",
            "🔥 Brand-Agency Kinetic Promo (Frontify-style 16:9)",
            "🚀 Showreel / Launch Trailer (60 FPS Beat-Synced 16:9)",
        ])
        self.combo_sb_recipe.setStyleSheet("background-color: #1a1e29; color: #fff; padding: 6px 12px; border-radius: 4px; border: 1px solid #334155; font-size: 12px;")
        self.combo_sb_recipe.currentIndexChanged.connect(self.on_recipe_changed)
        ctrl_bar.addWidget(self.combo_sb_recipe)

        btn_auto_sb = QPushButton("✨ Auto-Generate Storyboard")
        btn_auto_sb.setStyleSheet("background-color: #0284c7; color: white; font-weight: bold; padding: 6px 14px; border-radius: 4px;")
        btn_auto_sb.clicked.connect(self.auto_generate_storyboard)
        ctrl_bar.addWidget(btn_auto_sb)

        btn_reload_sb = QPushButton("🔄 Reload JSON")
        btn_reload_sb.clicked.connect(self.load_storyboard_table)
        ctrl_bar.addWidget(btn_reload_sb)

        btn_web_sb = QPushButton("🌐 Web Storyboard Studio")
        btn_web_sb.clicked.connect(self.launch_web_storyboard_gui)
        ctrl_bar.addWidget(btn_web_sb)

        btn_cs_sb = QPushButton("📸 Scene Contact Sheet")
        btn_cs_sb.setStyleSheet("background-color: #0d9488; color: white; font-weight: bold; padding: 6px 12px; border-radius: 4px;")
        btn_cs_sb.clicked.connect(self.generate_contact_sheet_action)
        ctrl_bar.addWidget(btn_cs_sb)

        btn_bg_sb = QPushButton("🎵 Beat-Grid Sync")
        btn_bg_sb.setStyleSheet("background-color: #ea580c; color: white; font-weight: bold; padding: 6px 12px; border-radius: 4px;")
        btn_bg_sb.clicked.connect(self.generate_beat_grid_action)
        ctrl_bar.addWidget(btn_bg_sb)

        btn_sfx_sb = QPushButton("🔊 Real SFX Mix")
        btn_sfx_sb.setStyleSheet("background-color: #8b5cf6; color: white; font-weight: bold; padding: 6px 12px; border-radius: 4px;")
        btn_sfx_sb.clicked.connect(self.generate_sfx_action)
        ctrl_bar.addWidget(btn_sfx_sb)

        btn_ov_sb = QPushButton("🌐 Openverse Media")
        btn_ov_sb.setStyleSheet("background-color: #059669; color: white; font-weight: bold; padding: 6px 12px; border-radius: 4px;")
        btn_ov_sb.clicked.connect(self.fetch_openverse_media_action)
        ctrl_bar.addWidget(btn_ov_sb)

        btn_td_sb = QPushButton("🔬 3D Teardown")
        btn_td_sb.setStyleSheet("background-color: #0284c7; color: white; font-weight: bold; padding: 6px 12px; border-radius: 4px;")
        btn_td_sb.clicked.connect(self.run_hardware_teardown_action)
        ctrl_bar.addWidget(btn_td_sb)
        ctrl_bar.addStretch()
        layout.addLayout(ctrl_bar)

        # Recipe Information Card / Banner
        self.lbl_sb_recipe_info = QLabel("Loading recipe details...")
        self.lbl_sb_recipe_info.setStyleSheet("background-color: #0f172a; color: #94a3b8; border: 1px solid #1e293b; border-radius: 6px; padding: 8px 12px; font-size: 12px;")
        layout.addWidget(self.lbl_sb_recipe_info)

        # Storyboard Scenes Table
        self.table_sb = QTableWidget()
        self.table_sb.setColumnCount(7)
        self.table_sb.setHorizontalHeaderLabels([
            "ID", "Type & Archetype", "Scene Headline / Beat", "Visual Cue & Physics", "SFX Trigger", "Start Frame", "Duration"
        ])
        self.table_sb.horizontalHeader().setSectionResizeMode(QHeaderView.Interactive)
        self.table_sb.horizontalHeader().setStretchLastSection(True)
        self.table_sb.setColumnWidth(0, 75)
        self.table_sb.setColumnWidth(1, 170)
        self.table_sb.setColumnWidth(2, 240)
        self.table_sb.setColumnWidth(3, 310)
        self.table_sb.setColumnWidth(4, 130)
        self.table_sb.setColumnWidth(5, 90)
        self.table_sb.setColumnWidth(6, 90)
        layout.addWidget(self.table_sb)

        self.load_storyboard_table()

    def on_recipe_changed(self, index: int):
        recipe_descriptions = [
            "🏆 <b>NHIT Industrial Technical Admission</b> | Intensity: Level 3-4 (Kinetic) | Aspect: 16:9 & 9:16 | Color: #087EFF / #FF9D32 | Crucible 3D Gears & Transformer, Circuit Trace, AICTE Approval Seal",
            "⚡ <b>SaaS Product Launch (Slack-style)</b> | Intensity: Level 2-3 (Executive) | Aspect: 16:9 | Color: #38BDF8 / #818CF8 | Monospace Scramble, Glass Dock Icons, 3D Tilted Cards (rotateY: 15°)",
            "📱 <b>Premium Talking-Head Caption Reel</b> | Intensity: Level 3-4 (Kinetic) | Aspect: 9:16 | Color: #10B981 / #06B6D4 | 1-3 Words at Chest Height, Rolling Counters, Arc Proof Cards (scale 0→1.08→1)",
            "🎞️ <b>Cinematic Storyteller Documentary</b> | Intensity: Level 5 (Hyper-Cine) | Aspect: 16:9 | Color: #C5A059 / #E0E2EC | 1.5s per visual idea, Torn Paper, Chunky 3D Extruded Type, Light Tunnel",
            "🔥 <b>Brand-Agency Kinetic Promo</b> | Intensity: Level 4 (Kinetic) | Aspect: 16:9 | Color: #FF6A1A / #FAF8FA | 96 BPM Eighths, Card Snake Bezier, 4x2 Grid Explosion, Y-Flip Contrast Cuts",
            "🚀 <b>Showreel / Launch Trailer</b> | Intensity: Level 5 (Hyper-Cine) | Aspect: 16:9 | Color: #FF5722 / #FFFFFF / #FFB800 | 60 FPS Beat-Grid, Sub-frame Shutter Blur, 3D Spatial Shockwaves, Brand Climax CTA"
        ]
        if 0 <= index < len(recipe_descriptions):
            self.lbl_sb_recipe_info.setText(recipe_descriptions[index])

    def load_storyboard_table(self):
        sb_file = ROOT / "src/data/storyboard.json"
        if not sb_file.exists():
            return
        try:
            data = json.loads(sb_file.read_text(encoding="utf-8"))
            rec_name = data.get("recipeName", "Production Storyboard")
            intensity = data.get("intensity", "Standard")
            aspect = data.get("aspectRatio", "16:9")
            palette = data.get("palette", {})
            p_color = palette.get("primary", "#087eff")
            s_color = palette.get("secondary", "#ff9d32")

            # Update banner
            banner_text = (
                f"<b>Recipe:</b> {rec_name} &nbsp;|&nbsp; "
                f"<b>Intensity:</b> {intensity} &nbsp;|&nbsp; "
                f"<b>Target Aspect:</b> {aspect} &nbsp;|&nbsp; "
                f"<b>Palette:</b> <span style='color:{p_color};'>■ {p_color}</span> <span style='color:{s_color};'>■ {s_color}</span>"
            )
            self.lbl_sb_recipe_info.setText(banner_text)

            # Sync combobox without triggering signals
            recipe_id = data.get("recipe", "")
            rec_map = {"nhit-admission": 0, "saas-launch": 1, "caption-reel": 2, "documentary": 3, "brand-promo": 4, "showreel-launch": 5}
            if recipe_id in rec_map and hasattr(self, "combo_sb_recipe"):
                self.combo_sb_recipe.blockSignals(True)
                self.combo_sb_recipe.setCurrentIndex(rec_map[recipe_id])
                self.combo_sb_recipe.blockSignals(False)

            scenes = data.get("scenes", [])
            self.table_sb.setRowCount(len(scenes))
            for i, s in enumerate(scenes):
                arch = s.get("archetype", s.get("type", "kinetic"))
                s_type = f"{s.get('type', 'kinetic')} ({arch})"
                vis_cue = s.get("visualCue", "")
                if not vis_cue:
                    vis_cue = s.get("metricValue", "") or ", ".join(s.get("bullets", []))

                self.table_sb.setItem(i, 0, QTableWidgetItem(s.get("id", f"scene_{i+1}")))
                self.table_sb.setItem(i, 1, QTableWidgetItem(s_type))
                self.table_sb.setItem(i, 2, QTableWidgetItem(s.get("title", "")))
                self.table_sb.setItem(i, 3, QTableWidgetItem(vis_cue))
                self.table_sb.setItem(i, 4, QTableWidgetItem(s.get("sfxCue", "whoosh")))
                self.table_sb.setItem(i, 5, QTableWidgetItem(str(s.get("startFrame", 0))))
                self.table_sb.setItem(i, 6, QTableWidgetItem(str(s.get("durationInFrames", 120))))
        except Exception as e:
            print(f"Error loading storyboard: {e}")

    # -------------------------------------------------------------
    # TAB 3: Motion Graphics Tweak Studio (Split-View Inspector & Live Preview)
    # -------------------------------------------------------------
    def setup_tab_remotion(self):
        tab_layout = QVBoxLayout(self.tab_remotion)
        tab_layout.setContentsMargins(10, 10, 10, 10)
        tab_layout.setSpacing(10)

        # Top Control & Preset Bar
        top_bar = QHBoxLayout()
        top_bar.addWidget(QLabel("Target Composition:"))

        self.combo_comp = QComboBox()
        self.combo_comp.addItems([
            "GsapMotion-16x9 (GSAP HyperFrames-Style Kinetic Engineering - 16:9)",
            "GsapMotion-9x16 (GSAP HyperFrames-Style Kinetic Engineering - 9:16)",
            "NHIT-Infographic-16x9 (NHIT 84s Infographic Admission Ad - 16:9)",
            "NHIT-Infographic-9x16 (NHIT 84s Infographic Admission Ad - 9:16)",
            "NHIT-Broadcast-45s (NHIT Indian Female Voiceover 45s Broadcast - 16:9)",
            "NHIT-Extended-70s (NHIT Indian Female Voiceover 70s Extended - 16:9)",
            "NHITAdvertisement (NHIT Durgapur 30s Engineering Admission - 16:9)",
            "TaskFlow-16x9 (TaskFlow 20s SaaS Promo - 16:9)",
            "TaskFlow-9x16 (TaskFlow 20s SaaS Promo - 9:16)",
            "Audiogram-16x9 (Podcast Audiogram Waveform - 16:9)",
            "Audiogram-9x16 (Podcast Audiogram Shorts - 9:16)",
            "CodeWalkthrough-16x9 (Code Walkthrough IDE - 16:9)",
            "CodeWalkthrough-9x16 (Code Walkthrough Shorts - 9:16)",
            "Stargazer-16x9 (GitHub Star Milestone - 16:9)",
            "Stargazer-9x16 (GitHub Star Milestone - 9:16)",
            "Overlay-16x9 (Transparent Alpha Overlays - 16:9)",
            "Overlay-9x16 (Transparent Alpha Overlays - 9:16)",
            "EffectsShowcase-16x9 (Remotion Shader Effects - 16:9)",
            "EffectsShowcase-9x16 (Remotion Shader Effects - 9:16)",
            "MultiSceneDeck-16x9 (Multi-Scene Landscape)",
            "MultiSceneDeck-9x16 (Multi-Scene Vertical)",
            "ThreeCore-16x9 (3D WebGL Torus Knot)",
            "ThreeBars-16x9 (3D Isometric Columns)",
            "ThreeHologram-16x9 (3D Glassmorphic Hologram)",
            "Master-16x9 (Standalone Kinetic)"
        ])
        self.combo_comp.currentTextChanged.connect(self.on_composition_changed)
        top_bar.addWidget(self.combo_comp, stretch=1)

        # Quick Style Presets
        top_bar.addWidget(QLabel("⚡ Style Presets:"))
        
        btn_preset_saffron = QPushButton("👑 Saffron & Gold")
        btn_preset_saffron.setStyleSheet("color: #FFD700; font-weight: bold;")
        btn_preset_saffron.clicked.connect(lambda: self.apply_preset("saffron_gold"))
        top_bar.addWidget(btn_preset_saffron)

        btn_preset_cyber = QPushButton("⚡ Cyber Neon")
        btn_preset_cyber.clicked.connect(lambda: self.apply_preset("cyber_neon"))
        top_bar.addWidget(btn_preset_cyber)

        btn_preset_apple = QPushButton("⚪ Apple Minimal")
        btn_preset_apple.clicked.connect(lambda: self.apply_preset("apple_minimal"))
        top_bar.addWidget(btn_preset_apple)

        btn_preset_purple = QPushButton("🔮 Obsidian Violet")
        btn_preset_purple.clicked.connect(lambda: self.apply_preset("obsidian_purple"))
        top_bar.addWidget(btn_preset_purple)

        btn_preset_emerald = QPushButton("🌿 Emerald High-Energy")
        btn_preset_emerald.clicked.connect(lambda: self.apply_preset("emerald_energy"))
        top_bar.addWidget(btn_preset_emerald)

        tab_layout.addLayout(top_bar)

        # Splitter: Left (Preview & Scrubber) | Right (Inspector)
        splitter = QSplitter(Qt.Horizontal)
        splitter.setHandleWidth(6)

        # ---------------------------------------------------------
        # LEFT PANE: Visual Preview & Scrubber
        # ---------------------------------------------------------
        left_widget = QWidget()
        left_layout = QVBoxLayout(left_widget)
        left_layout.setContentsMargins(0, 0, 8, 0)
        left_layout.setSpacing(10)

        # Preview Canvas Container
        preview_box = QGroupBox("Live Frame Canvas")
        preview_box_layout = QVBoxLayout(preview_box)
        preview_box_layout.setContentsMargins(8, 8, 8, 8)

        self.lbl_preview_canvas = QLabel()
        self.lbl_preview_canvas.setAlignment(Qt.AlignCenter)
        self.lbl_preview_canvas.setMinimumSize(460, 260)
        self.lbl_preview_canvas.setStyleSheet("background-color: #05070f; border: 1px solid #1e293b; border-radius: 8px;")
        
        # Load initial preview if available
        init_still = ROOT / "out/taskflow_still_s1.png"
        if not init_still.exists():
            init_still = ROOT / "out/tweak_preview.png"
        if init_still.exists():
            pix = QPixmap(str(init_still))
            if not pix.isNull():
                self.lbl_preview_canvas.setPixmap(pix.scaled(520, 292, Qt.KeepAspectRatio, Qt.SmoothTransformation))
        else:
            self.lbl_preview_canvas.setText("No Preview Rendered. Click 'Refresh Frame Preview'.")
            
        preview_box_layout.addWidget(self.lbl_preview_canvas)
        left_layout.addWidget(preview_box)

        # Timeline Scrubber Box
        scrubber_box = QGroupBox("Timeline Scrubber (0–600 Frames | 0.0s–20.0s)")
        scrubber_layout = QVBoxLayout(scrubber_box)

        # Scrubber readouts
        readout_row = QHBoxLayout()
        self.lbl_frame_info = QLabel("Frame: 045 / 600 (01.50s) • Scene 1: Logo Reveal")
        self.lbl_frame_info.setStyleSheet("color: #00f2fe; font-weight: bold; font-family: monospace;")
        readout_row.addWidget(self.lbl_frame_info)
        readout_row.addStretch()
        scrubber_layout.addLayout(readout_row)

        # Blender-style Drag Scrubber & Standard Slider
        self.scrub_frame = BlenderScrubBox(min_val=0, max_val=600, val=45, step=1, decimals=0, prefix="Timeline Frame", suffix=" / 600", fill_color="#00f2fe")
        self.scrub_frame.valueChanged.connect(self.on_frame_scrubbed)
        self.scrub_frame.editingFinished.connect(lambda _: self.refresh_preview_frame())
        scrubber_layout.addWidget(self.scrub_frame)

        self.slider_frame = QSlider(Qt.Horizontal)
        self.slider_frame.setRange(0, 600)
        self.slider_frame.setValue(45)
        self.slider_frame.valueChanged.connect(self.on_frame_scrubbed)
        scrubber_layout.addWidget(self.slider_frame)

        # Quick Scene Jump Buttons Row
        jump_row = QHBoxLayout()
        jump_row.addWidget(QLabel("Jump to:"))
        for name, frame_no in [("S1: Logo (0s)", 45), ("S2: Chaos (4s)", 160), ("S3: AI Sched (8s)", 280), ("S4: Stats (13s)", 420), ("S5: CTA (18s)", 550)]:
            btn_j = QPushButton(name)
            btn_j.setStyleSheet("padding: 4px 8px; font-size: 11px;")
            btn_j.clicked.connect(lambda _, f=frame_no: self.jump_to_frame(f))
            jump_row.addWidget(btn_j)
        jump_row.addStretch()
        scrubber_layout.addLayout(jump_row)
        left_layout.addWidget(scrubber_box)

        # Action Buttons Row
        actions_row = QHBoxLayout()
        self.btn_refresh_preview = QPushButton("🔄 Refresh Preview Frame")
        self.btn_refresh_preview.setStyleSheet("background-color: #0284c7; color: white; font-weight: bold; padding: 7px 12px;")
        self.btn_refresh_preview.clicked.connect(self.refresh_preview_frame)
        actions_row.addWidget(self.btn_refresh_preview)

        btn_render_gpu = QPushButton("⚡ Render GPU Master Video")
        btn_render_gpu.setObjectName("primaryBtn")
        btn_render_gpu.setStyleSheet("padding: 7px 12px;")
        btn_render_gpu.clicked.connect(self.render_selected_composition)
        actions_row.addWidget(btn_render_gpu)

        btn_open_out = QPushButton("📁 Master Folder")
        btn_open_out.clicked.connect(lambda: os.startfile(str(ROOT / "out/master")))
        actions_row.addWidget(btn_open_out)

        btn_contact_sheet = QPushButton("📸 Visual Contact Sheet")
        btn_contact_sheet.setStyleSheet("background-color: #0d9488; color: white; font-weight: bold; padding: 7px 12px;")
        btn_contact_sheet.clicked.connect(self.generate_contact_sheet_action)
        actions_row.addWidget(btn_contact_sheet)

        left_layout.addLayout(actions_row)
        left_layout.addStretch()
        splitter.addWidget(left_widget)

        # ---------------------------------------------------------
        # RIGHT PANE: Categorized Dynamic Property Inspector
        # ---------------------------------------------------------
        right_scroll = QScrollArea()
        right_scroll.setWidgetResizable(True)
        right_scroll.setStyleSheet("QScrollArea { border: 1px solid #1e293b; border-radius: 8px; background-color: #0a0f1d; }")

        right_widget = QWidget()
        right_layout = QVBoxLayout(right_widget)
        right_layout.setContentsMargins(10, 10, 10, 10)
        right_layout.setSpacing(12)

        # Section 1: Colors & Glow
        group_colors = QGroupBox("🎨 Brand Identity & Lighting")
        gc_layout = QFormLayout(group_colors)

        row_c1 = QHBoxLayout()
        self.txt_col_primary = QLineEdit("#0066FF")
        self.txt_col_primary.textChanged.connect(self.auto_save_render_props)
        self.btn_swatch_primary = QPushButton()
        self.btn_swatch_primary.setFixedSize(32, 26)
        self.btn_swatch_primary.clicked.connect(lambda: self.pick_color("primary"))
        row_c1.addWidget(self.txt_col_primary)
        row_c1.addWidget(self.btn_swatch_primary)
        gc_layout.addRow("Primary Color:", row_c1)

        row_c2 = QHBoxLayout()
        self.txt_col_secondary = QLineEdit("#8B5CF6")
        self.txt_col_secondary.textChanged.connect(self.auto_save_render_props)
        self.btn_swatch_secondary = QPushButton()
        self.btn_swatch_secondary.setFixedSize(32, 26)
        self.btn_swatch_secondary.clicked.connect(lambda: self.pick_color("secondary"))
        row_c2.addWidget(self.txt_col_secondary)
        row_c2.addWidget(self.btn_swatch_secondary)
        gc_layout.addRow("Secondary Color:", row_c2)

        row_c3 = QHBoxLayout()
        self.txt_col_accent = QLineEdit("#00FF88")
        self.txt_col_accent.textChanged.connect(self.auto_save_render_props)
        self.btn_swatch_accent = QPushButton()
        self.btn_swatch_accent.setFixedSize(32, 26)
        self.btn_swatch_accent.clicked.connect(lambda: self.pick_color("accent"))
        row_c3.addWidget(self.txt_col_accent)
        row_c3.addWidget(self.btn_swatch_accent)
        gc_layout.addRow("Accent (Neon):", row_c3)

        row_c4 = QHBoxLayout()
        self.txt_col_bg = QLineEdit("#0A0A0F")
        self.txt_col_bg.textChanged.connect(self.auto_save_render_props)
        self.btn_swatch_bg = QPushButton()
        self.btn_swatch_bg.setFixedSize(32, 26)
        self.btn_swatch_bg.clicked.connect(lambda: self.pick_color("bg"))
        row_c4.addWidget(self.txt_col_bg)
        row_c4.addWidget(self.btn_swatch_bg)
        gc_layout.addRow("Background Color:", row_c4)

        row_glow = QHBoxLayout()
        self.scrub_glow = BlenderScrubBox(min_val=0.2, max_val=2.5, val=1.0, step=0.1, decimals=1, prefix="Glow Multiplier", suffix="x", fill_color="#00f2fe")
        self.scrub_glow.valueChanged.connect(self.auto_save_render_props)
        self.scrub_glow.editingFinished.connect(self.auto_save_render_props)
        row_glow.addWidget(self.scrub_glow)
        gc_layout.addRow("Glow & Lighting:", row_glow)

        right_layout.addWidget(group_colors)

        # Section 2: Copy, Headlines & Script
        group_text = QGroupBox("✍️ Typography, Headlines & Copy")
        gt_layout = QFormLayout(group_text)

        self.txt_brand_name = QLineEdit("TaskFlow")
        self.txt_brand_name.textChanged.connect(self.auto_save_render_props)
        gt_layout.addRow("Brand Name:", self.txt_brand_name)

        self.txt_tagline = QLineEdit("Get Things Done. Effortlessly.")
        self.txt_tagline.textChanged.connect(self.auto_save_render_props)
        gt_layout.addRow("Tagline:", self.txt_tagline)

        self.txt_chaos_bad = QLineEdit("Scattered Tasks. Lost Momentum.")
        self.txt_chaos_bad.textChanged.connect(self.auto_save_render_props)
        gt_layout.addRow("Chaos Bad Hook:", self.txt_chaos_bad)

        self.txt_chaos_good = QLineEdit("From Endless Chaos... to Absolute Clarity.")
        self.txt_chaos_good.textChanged.connect(self.auto_save_render_props)
        gt_layout.addRow("Clarity Resolution:", self.txt_chaos_good)

        self.txt_ai_badge = QLineEdit("+3.4 Hours Saved Today")
        self.txt_ai_badge.textChanged.connect(self.auto_save_render_props)
        gt_layout.addRow("AI Hero Badge:", self.txt_ai_badge)

        self.txt_cta_btn = QLineEdit("Start Free Trial")
        self.txt_cta_btn.textChanged.connect(self.auto_save_render_props)
        gt_layout.addRow("CTA Button Text:", self.txt_cta_btn)

        self.txt_cta_url = QLineEdit("taskflow.app")
        self.txt_cta_url.textChanged.connect(self.auto_save_render_props)
        gt_layout.addRow("CTA Target URL:", self.txt_cta_url)

        right_layout.addWidget(group_text)

        # Section 3: Motion Dynamics & Spring Physics
        group_physics = QGroupBox("⚡ Motion Dynamics & Spring Physics")
        gp_layout = QFormLayout(group_physics)

        row_damp = QHBoxLayout()
        self.scrub_damping = BlenderScrubBox(min_val=60, max_val=160, val=100, step=1, decimals=0, prefix="Spring Damping", suffix="", fill_color="#087EFF")
        self.scrub_damping.valueChanged.connect(self.auto_save_render_props)
        self.scrub_damping.editingFinished.connect(self.auto_save_render_props)
        row_damp.addWidget(self.scrub_damping)
        gp_layout.addRow("Spring Damping:", row_damp)

        row_mass = QHBoxLayout()
        self.scrub_mass = BlenderScrubBox(min_val=0.20, max_val=1.50, val=0.50, step=0.05, decimals=2, prefix="Spring Mass", suffix="", fill_color="#FF9D32")
        self.scrub_mass.valueChanged.connect(self.auto_save_render_props)
        self.scrub_mass.editingFinished.connect(self.auto_save_render_props)
        row_mass.addWidget(self.scrub_mass)
        gp_layout.addRow("Spring Mass (Inertia):", row_mass)

        row_parts = QHBoxLayout()
        self.scrub_particles = BlenderScrubBox(min_val=5, max_val=50, val=20, step=1, decimals=0, prefix="Burst Particles", suffix=" particles", fill_color="#10b981")
        self.scrub_particles.valueChanged.connect(self.auto_save_render_props)
        self.scrub_particles.editingFinished.connect(self.auto_save_render_props)
        row_parts.addWidget(self.scrub_particles)
        gp_layout.addRow("Burst Particle Count:", row_parts)

        right_layout.addWidget(group_physics)

        # Section 4: Metrics & Wrapped Data
        group_metrics = QGroupBox("📊 Metrics & Wrapped Analytics")
        gm_layout = QFormLayout(group_metrics)

        row_score = QHBoxLayout()
        self.scrub_score = BlenderScrubBox(min_val=60.0, max_val=99.9, val=94.8, step=0.5, decimals=1, prefix="Focus Score", suffix="%", fill_color="#a855f7")
        self.scrub_score.valueChanged.connect(self.auto_save_render_props)
        self.scrub_score.editingFinished.connect(self.auto_save_render_props)
        row_score.addWidget(self.scrub_score)
        gm_layout.addRow("Deep Focus Score %:", row_score)

        self.txt_stat1 = QLineEdit("48 Tasks Crushed")
        self.txt_stat1.textChanged.connect(self.auto_save_render_props)
        gm_layout.addRow("Stat Pill 1:", self.txt_stat1)

        self.txt_stat2 = QLineEdit("10x Faster")
        self.txt_stat2.textChanged.connect(self.auto_save_render_props)
        gm_layout.addRow("Stat Pill 2:", self.txt_stat2)

        self.txt_stat3 = QLineEdit("Top 1% Global")
        self.txt_stat3.textChanged.connect(self.auto_save_render_props)
        gm_layout.addRow("Stat Pill 3:", self.txt_stat3)

        right_layout.addWidget(group_metrics)

        right_layout.addStretch()
        right_scroll.setWidget(right_widget)
        splitter.addWidget(right_scroll)

        splitter.setSizes([560, 480])
        tab_layout.addWidget(splitter)

        self.update_swatch_styles()

    # -------------------------------------------------------------
    # TAB 4: Shorts Slicing & Whisper Subtitles
    # -------------------------------------------------------------
    def setup_tab_subtitles(self):
        layout = QVBoxLayout(self.tab_subtitles)
        layout.setContentsMargins(14, 14, 14, 14)

        form = QFormLayout()
        self.spin_slice_dur = QSpinBox()
        self.spin_slice_dur.setRange(5, 120)
        self.spin_slice_dur.setValue(30)
        form.addRow("Shorts Slice Duration (Seconds):", self.spin_slice_dur)

        self.combo_whisper_model = QComboBox()
        self.combo_whisper_model.addItems(["tiny", "base", "small"])
        form.addRow("Faster-Whisper Model:", self.combo_whisper_model)

        layout.addLayout(form)

        btn_row = QHBoxLayout()
        btn_slice = QPushButton("✂️ Slice Shorts & Burn Bouncing Karaoke Subtitles")
        btn_slice.clicked.connect(self.run_subtitles_stage)
        btn_row.addWidget(btn_slice)

        btn_open_shorts = QPushButton("📁 Open out/shorts/ Folder")
        btn_open_shorts.clicked.connect(lambda: os.startfile(str(ROOT / "out/shorts")))
        btn_row.addWidget(btn_open_shorts)
        btn_row.addStretch()
        layout.addLayout(btn_row)
        layout.addStretch()

    # -------------------------------------------------------------
    # TAB 5: DaVinci Resolve & History
    # -------------------------------------------------------------
    def setup_tab_resolve(self):
        layout = QVBoxLayout(self.tab_resolve)
        layout.setContentsMargins(14, 14, 14, 14)

        btn_bar = QHBoxLayout()
        btn_gen_fcpxml = QPushButton("🎞️ Export Multi-Track FCPXML Timeline")
        btn_gen_fcpxml.clicked.connect(self.export_fcpxml_only)
        btn_bar.addWidget(btn_gen_fcpxml)

        btn_open_resolve_dir = QPushButton("📁 Open out/resolve_exports/")
        btn_open_resolve_dir.clicked.connect(lambda: os.startfile(str(ROOT / "out/resolve_exports")))
        btn_bar.addWidget(btn_open_resolve_dir)

        btn_open_lut = QPushButton("🎨 Open Tech_Cinematic.cube LUT")
        btn_open_lut.clicked.connect(lambda: os.startfile(str(ROOT / "assets/grades")))
        btn_bar.addWidget(btn_open_lut)

        btn_gen_sfx = QPushButton("🔊 Design & Mix Real SFX (Track A2)")
        btn_gen_sfx.setStyleSheet("background-color: #8b5cf6; color: white; font-weight: bold; padding: 6px 12px; border-radius: 4px;")
        btn_gen_sfx.clicked.connect(self.generate_sfx_action)
        btn_bar.addWidget(btn_gen_sfx)

        btn_open_vault = QPushButton("📦 Studio Asset Vault")
        btn_open_vault.clicked.connect(lambda: os.startfile(str(ROOT / "assets/studio_vault")) if (ROOT / "assets/studio_vault").exists() else None)
        btn_bar.addWidget(btn_open_vault)

        btn_open_blend = QPushButton("💎 Open Teardown Studio (.blend)")
        btn_open_blend.clicked.connect(lambda: os.startfile(str(ROOT / "assets/templates/hardware_teardown_studio.blend")) if (ROOT / "assets/templates/hardware_teardown_studio.blend").exists() else None)
        btn_bar.addWidget(btn_open_blend)

        btn_bar.addStretch()
        layout.addLayout(btn_bar)

        lbl_hist = QLabel("SQLite Pipeline Run History (out/pipeline_history.db):")
        lbl_hist.setStyleSheet("font-weight: bold; margin-top: 10px;")
        layout.addWidget(lbl_hist)

        self.table_hist = QTableWidget()
        self.table_hist.setColumnCount(6)
        self.table_hist.setHorizontalHeaderLabels(["ID", "Timestamp", "Project", "Aspect", "Latency", "Status"])
        self.table_hist.horizontalHeader().setSectionResizeMode(QHeaderView.Stretch)
        layout.addWidget(self.table_hist)

    def load_history_from_db(self):
        if not DB_PATH.exists():
            return
        try:
            with sqlite3.connect(str(DB_PATH)) as conn:
                conn.row_factory = sqlite3.Row
                runs = conn.execute("SELECT id, timestamp, project_name, aspect_ratio, total_duration_sec, status FROM runs ORDER BY id DESC").fetchall()
                self.table_hist.setRowCount(len(runs))
                for i, r in enumerate(runs):
                    self.table_hist.setItem(i, 0, QTableWidgetItem(f"#{r['id']}"))
                    self.table_hist.setItem(i, 1, QTableWidgetItem(r['timestamp']))
                    self.table_hist.setItem(i, 2, QTableWidgetItem(r['project_name']))
                    self.table_hist.setItem(i, 3, QTableWidgetItem(r['aspect_ratio']))
                    self.table_hist.setItem(i, 4, QTableWidgetItem(f"{r['total_duration_sec']}s"))
                    self.table_hist.setItem(i, 5, QTableWidgetItem(r['status']))
        except Exception as e:
            print(f"Error reading DB: {e}")

    def setup_tab_qa(self):
        layout = QVBoxLayout(self.tab_qa)
        layout.setContentsMargins(14, 14, 14, 14)
        layout.setSpacing(12)

        # Top Control Bar
        top_bar = QHBoxLayout()
        top_bar.addWidget(QLabel("Target Video:"))
        self.qa_video_combo = QComboBox()
        self.qa_video_combo.setMinimumWidth(320)
        self.qa_video_combo.currentIndexChanged.connect(self.on_qa_video_selected)
        top_bar.addWidget(self.qa_video_combo)

        btn_refresh_qa = QPushButton("🔄 Refresh")
        btn_refresh_qa.clicked.connect(self.refresh_qa_videos)
        top_bar.addWidget(btn_refresh_qa)

        btn_browse_qa = QPushButton("📂 Browse...")
        btn_browse_qa.clicked.connect(self.browse_qa_video)
        top_bar.addWidget(btn_browse_qa)

        btn_run_qa = QPushButton("🛡️ Run QA Audit & Ledger")
        btn_run_qa.setObjectName("primaryBtn")
        btn_run_qa.clicked.connect(self.run_qa_audit_and_ledger)
        top_bar.addWidget(btn_run_qa)

        btn_run_acoustic = QPushButton("🎧 Audit Audio (Earshot)")
        btn_run_acoustic.setStyleSheet("background-color: #0284c7; color: white; font-weight: bold; padding: 6px 12px; border-radius: 4px;")
        btn_run_acoustic.clicked.connect(self.run_acoustic_audit_action)
        top_bar.addWidget(btn_run_acoustic)

        btn_open_reports = QPushButton("📁 Open out/qa_reports/")
        btn_open_reports.clicked.connect(lambda: os.startfile(str(ROOT / "out/qa_reports")) if (ROOT / "out/qa_reports").exists() else None)
        top_bar.addWidget(btn_open_reports)

        top_bar.addStretch()
        layout.addLayout(top_bar)

        # Telemetry Stat Cards
        cards_layout = QHBoxLayout()
        cards_layout.setSpacing(10)

        def make_card(title: str, default_val: str):
            box = QFrame()
            box.setStyleSheet("background: #090e1a; border: 1px solid #1e2c4a; border-radius: 8px; padding: 10px;")
            vbox = QVBoxLayout(box)
            vbox.setContentsMargins(4, 4, 4, 4)
            lbl_title = QLabel(title)
            lbl_title.setStyleSheet("font-size: 11px; color: #94a3b8; font-weight: 600; text-transform: uppercase;")
            lbl_val = QLabel(default_val)
            lbl_val.setStyleSheet("font-size: 15px; color: #00f2fe; font-weight: bold;")
            vbox.addWidget(lbl_title)
            vbox.addWidget(lbl_val)
            return box, lbl_val

        card_lufs_box, self.lbl_card_lufs = make_card("Integrated Loudness (EBU R128)", "-16.0 LUFS [READY]")
        card_peak_box, self.lbl_card_peak = make_card("Maximum True Peak", "≤ -1.0 dBTP [READY]")
        card_acoustic_box, self.lbl_card_acoustic = make_card("🎧 Acoustic Score (Earshot)", "74.2 / 100 [GRADE B]")
        card_safe_box, self.lbl_card_safe = make_card("Safe-Area Compliance", "90% Action / 80% Title")
        card_social_box, self.lbl_card_social = make_card("Social UI Clearance", "Feed Chrome Checked")

        cards_layout.addWidget(card_lufs_box)
        cards_layout.addWidget(card_peak_box)
        cards_layout.addWidget(card_acoustic_box)
        cards_layout.addWidget(card_safe_box)
        cards_layout.addWidget(card_social_box)
        layout.addLayout(cards_layout)

        # Main Splitter: Left Preview, Right Receipt Ledger
        splitter = QSplitter(Qt.Orientation.Horizontal)

        # Left: Annotated Plate Preview
        preview_group = QGroupBox("Annotated Diagnostic Safe-Area Plate")
        pv_layout = QVBoxLayout(preview_group)
        self.qa_image_preview = QLabel("Select or run QA on a video to preview diagnostic overlay.")
        self.qa_image_preview.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self.qa_image_preview.setStyleSheet("background: #05070d; border: 1px solid #1e2c4a; border-radius: 6px; color: #64748b;")
        self.qa_image_preview.setMinimumHeight(350)
        pv_layout.addWidget(self.qa_image_preview)
        splitter.addWidget(preview_group)

        # Right: Receipt Ledger Text Viewer
        receipt_group = QGroupBox("Cryptographic Provenance Receipt (receipt.md)")
        rc_layout = QVBoxLayout(receipt_group)
        self.qa_receipt_text = QTextEdit()
        self.qa_receipt_text.setReadOnly(True)
        self.qa_receipt_text.setStyleSheet("background: #05070d; font-family: 'Consolas', monospace; font-size: 11px; color: #cbd5e1;")
        rc_layout.addWidget(self.qa_receipt_text)

        rc_btn_row = QHBoxLayout()
        btn_open_receipt_md = QPushButton("📜 Open in System Markdown Viewer")
        btn_open_receipt_md.clicked.connect(self.open_current_receipt_md)
        rc_btn_row.addWidget(btn_open_receipt_md)
        rc_btn_row.addStretch()
        rc_layout.addLayout(rc_btn_row)

        splitter.addWidget(receipt_group)
        splitter.setStretchFactor(0, 1)
        splitter.setStretchFactor(1, 1)
        layout.addWidget(splitter, stretch=1)

        self.refresh_qa_videos()

    def refresh_qa_videos(self):
        self.qa_video_combo.blockSignals(True)
        self.qa_video_combo.clear()
        master_dir = ROOT / "out/master"
        if master_dir.exists():
            videos = sorted(master_dir.glob("*.mp4"))
            for v in videos:
                self.qa_video_combo.addItem(v.name, str(v.resolve()))
        self.qa_video_combo.blockSignals(False)
        self.on_qa_video_selected()

    def browse_qa_video(self):
        fn, _ = QFileDialog.getOpenFileName(self, "Select Video for QA Audit", str(ROOT / "out/master"), "Video Files (*.mp4 *.mov)")
        if fn:
            p = Path(fn)
            # Add or select
            idx = self.qa_video_combo.findData(str(p.resolve()))
            if idx >= 0:
                self.qa_video_combo.setCurrentIndex(idx)
            else:
                self.qa_video_combo.addItem(p.name, str(p.resolve()))
                self.qa_video_combo.setCurrentIndex(self.qa_video_combo.count() - 1)

    def on_qa_video_selected(self):
        video_path_str = self.qa_video_combo.currentData()
        if not video_path_str:
            return
        video_path = Path(video_path_str)
        stem = video_path.stem

        # Try to load existing QA report
        qa_json_path = ROOT / f"out/qa_reports/{stem}_qa.json"
        overlay_path = ROOT / f"out/qa_reports/{stem}_safe_area.png"
        receipt_md_path = ROOT / f"out/receipts/{stem}_receipt.md"

        if qa_json_path.exists():
            try:
                with open(qa_json_path, "r", encoding="utf-8") as f:
                    qa = json.load(f)
                audio_qa = qa.get("audio_loudness", {})
                geo_qa = qa.get("safe_area_geometry", {})

                # Update cards
                lufs = audio_qa.get("integrated_lufs", -16.0)
                lufs_pass = audio_qa.get("lufs_pass", False)
                self.lbl_card_lufs.setText(f"{lufs:.1f} LUFS {'[PASS]' if lufs_pass else '[FAIL]'}")
                self.lbl_card_lufs.setStyleSheet(f"font-size: 15px; font-weight: bold; color: {'#10b981' if lufs_pass else '#ef4444'};")

                tp = audio_qa.get("true_peak_dbtp", -4.0)
                tp_pass = audio_qa.get("true_peak_pass", False)
                self.lbl_card_peak.setText(f"{tp:.1f} dBTP {'[PASS]' if tp_pass else '[WARN]'}")
                self.lbl_card_peak.setStyleSheet(f"font-size: 15px; font-weight: bold; color: {'#10b981' if tp_pass else '#f59e0b'};")

                safe_pass = geo_qa.get("action_safe_pass", True) and geo_qa.get("title_safe_pass", True)
                self.lbl_card_safe.setText(f"90% Act / 80% Tit {'[PASS]' if safe_pass else '[WARN]'}")
                self.lbl_card_safe.setStyleSheet(f"font-size: 15px; font-weight: bold; color: {'#10b981' if safe_pass else '#f59e0b'};")

                social_pass = geo_qa.get("social_ui_pass", True)
                self.lbl_card_social.setText(f"{'Clean Clearance' if social_pass else 'Overlap Alert'} {'[PASS]' if social_pass else '[WARN]'}")
                self.lbl_card_social.setStyleSheet(f"font-size: 15px; font-weight: bold; color: {'#10b981' if social_pass else '#f59e0b'};")
            except Exception as e:
                print(f"Error parsing QA json: {e}")
        else:
            self.lbl_card_lufs.setText("Not yet audited")
            self.lbl_card_lufs.setStyleSheet("font-size: 15px; font-weight: bold; color: #64748b;")
            self.lbl_card_peak.setText("Not yet audited")
            self.lbl_card_peak.setStyleSheet("font-size: 15px; font-weight: bold; color: #64748b;")
            self.lbl_card_safe.setText("Not yet audited")
            self.lbl_card_safe.setStyleSheet("font-size: 15px; font-weight: bold; color: #64748b;")
            self.lbl_card_social.setText("Not yet audited")
            self.lbl_card_social.setStyleSheet("font-size: 15px; font-weight: bold; color: #64748b;")

        # Update Image Preview
        if overlay_path.exists():
            pix = QPixmap(str(overlay_path))
            self.qa_image_preview.setPixmap(pix.scaled(
                self.qa_image_preview.width() if self.qa_image_preview.width() > 100 else 600,
                self.qa_image_preview.height() if self.qa_image_preview.height() > 100 else 400,
                Qt.AspectRatioMode.KeepAspectRatio,
                Qt.TransformationMode.SmoothTransformation
            ))
        else:
            self.qa_image_preview.setText(f"No overlay plate generated for {video_path.name}.\nClick 'Run QA Audit & Ledger' to generate.")

        # Update Receipt Viewer
        if receipt_md_path.exists():
            try:
                self.qa_receipt_text.setPlainText(receipt_md_path.read_text(encoding="utf-8"))
            except Exception:
                pass
        else:
            self.qa_receipt_text.setPlainText(f"No receipt generated yet for {video_path.name}.\nClick 'Run QA Audit & Ledger' to create cryptographic provenance ledger.")

    def run_qa_audit_and_ledger(self):
        video_path_str = self.qa_video_combo.currentData()
        if not video_path_str:
            QMessageBox.warning(self, "No Video", "Please select a master video from the list.")
            return

        cmd = [
            sys.executable,
            str(ROOT / ".agent/skills/motion-pipeline/run.py"),
            "--action", "qa-check",
            "--video", video_path_str
        ]
        self.start_worker(cmd)
        # We also trigger receipt generator as next step
        self.worker.finished_signal.connect(lambda: self.on_qa_worker_finished(video_path_str))

    def on_qa_worker_finished(self, video_path_str):
        # Run receipt generator
        cmd_rcpt = [
            sys.executable,
            str(ROOT / ".agent/skills/motion-pipeline/run.py"),
            "--action", "generate-receipt",
            "--video", video_path_str
        ]
        subprocess.run(cmd_rcpt, cwd=str(ROOT))
        self.on_qa_video_selected()
        self.update_acoustic_card_from_report()

    def run_acoustic_audit_action(self):
        sfx_candidates = [
            ROOT / "out/sfx/hardware_teardown_sfx.wav",
            ROOT / "out/sfx/master_sfx.wav",
            ROOT / "public/audio.mp3"
        ]
        target = next((p for p in sfx_candidates if p.exists()), None)
        if not target:
            QMessageBox.information(self, "No Audio", "No rendered audio file found in out/sfx/ or public/.")
            return

        sb_candidates = [
            ROOT / "src/data/hardware_teardown_storyboard.json",
            ROOT / "src/data/storyboard.json"
        ]
        target_sb = next((p for p in sb_candidates if p.exists()), ROOT / "src/data/storyboard.json")

        cmd = [
            sys.executable,
            str(ROOT / "scripts/acoustic_auditor.py"),
            "--audio", str(target),
            "--storyboard", str(target_sb)
        ]
        self.start_worker(cmd)
        self.worker.finished_signal.connect(self.update_acoustic_card_from_report)

    def update_acoustic_card_from_report(self):
        rep_p = ROOT / "out/qa_reports/acoustic_audit.json"
        if rep_p.exists():
            try:
                data = json.loads(rep_p.read_text(encoding="utf-8"))
                score = data.get("overall_acoustic_score", 0.0)
                grade = data.get("grade", "N/A")
                if hasattr(self, "lbl_card_acoustic"):
                    self.lbl_card_acoustic.setText(f"{score}/100 [{grade}]")
            except Exception:
                pass

    def open_current_receipt_md(self):
        video_path_str = self.qa_video_combo.currentData()
        if video_path_str:
            stem = Path(video_path_str).stem
            receipt_path = ROOT / f"out/receipts/{stem}_receipt.md"
            if receipt_path.exists():
                os.startfile(str(receipt_path))
            else:
                QMessageBox.information(self, "Not Found", f"Receipt not found: {receipt_path.name}")

    # -------------------------------------------------------------
    # Execution Helpers
    # -------------------------------------------------------------
    def start_worker(self, cmd_args):
        self.console.clear()
        self.prog_bar.setVisible(True)
        self.btn_run_all.setEnabled(False)

        self.worker_thread = QThread()
        self.worker = Worker(cmd_args)
        self.worker.moveToThread(self.worker_thread)

        self.worker_thread.started.connect(self.worker.run)
        self.worker.log_signal.connect(self.on_log)
        self.worker.step_signal.connect(self.on_step)
        self.worker.finished_signal.connect(self.on_finished)

        self.worker_thread.start()

    @Slot(str)
    def on_log(self, text):
        self.console.append(text)

    @Slot(str)
    def on_step(self, step_name):
        self.lbl_current_step.setText(step_name)

    @Slot(bool, str)
    def on_finished(self, success, msg):
        self.prog_bar.setVisible(False)
        self.btn_run_all.setEnabled(True)
        self.lbl_current_step.setText("Completed" if success else "Failed")
        self.worker_thread.quit()
        self.worker_thread.wait()

        self.load_history_from_db()
        self.load_storyboard_table()

        # Auto-reload preview image if a still preview was generated
        tweak_p = ROOT / "out/tweak_preview.png"
        if tweak_p.exists() and hasattr(self, "lbl_preview_canvas"):
            self.load_preview_pixmap(tweak_p)

        if success:
            QMessageBox.information(self, "Pipeline Execution", "Operation completed successfully!")
        else:
            QMessageBox.critical(self, "Pipeline Execution Error", msg)

    # -------------------------------------------------------------
    # Tweak Studio Helpers
    # -------------------------------------------------------------
    def load_preview_pixmap(self, path):
        if path.exists() and hasattr(self, "lbl_preview_canvas"):
            pix = QPixmap(str(path))
            if not pix.isNull():
                self.lbl_preview_canvas.setPixmap(pix.scaled(
                    self.lbl_preview_canvas.width() or 520,
                    self.lbl_preview_canvas.height() or 292,
                    Qt.KeepAspectRatio,
                    Qt.SmoothTransformation
                ))

    def update_swatch_styles(self):
        c_p = self.txt_col_primary.text().strip()
        c_s = self.txt_col_secondary.text().strip()
        c_a = self.txt_col_accent.text().strip()
        c_b = self.txt_col_bg.text().strip()
        if hasattr(self, "btn_swatch_primary"):
            self.btn_swatch_primary.setStyleSheet(f"background-color: {c_p}; border: 1.5px solid white; border-radius: 4px;")
        if hasattr(self, "btn_swatch_secondary"):
            self.btn_swatch_secondary.setStyleSheet(f"background-color: {c_s}; border: 1.5px solid white; border-radius: 4px;")
        if hasattr(self, "btn_swatch_accent"):
            self.btn_swatch_accent.setStyleSheet(f"background-color: {c_a}; border: 1.5px solid white; border-radius: 4px;")
        if hasattr(self, "btn_swatch_bg"):
            self.btn_swatch_bg.setStyleSheet(f"background-color: {c_b}; border: 1.5px solid white; border-radius: 4px;")

    def pick_color(self, target):
        curr_hex = {
            "primary": self.txt_col_primary.text().strip(),
            "secondary": self.txt_col_secondary.text().strip(),
            "accent": self.txt_col_accent.text().strip(),
            "bg": self.txt_col_bg.text().strip(),
        }.get(target, "#0066FF")
        
        col = QColorDialog.getColor(QColor(curr_hex), self, f"Select {target.capitalize()} Color")
        if col.isValid():
            hex_val = col.name().upper()
            if target == "primary":
                self.txt_col_primary.setText(hex_val)
            elif target == "secondary":
                self.txt_col_secondary.setText(hex_val)
            elif target == "accent":
                self.txt_col_accent.setText(hex_val)
            elif target == "bg":
                self.txt_col_bg.setText(hex_val)
            self.update_swatch_styles()
            self.auto_save_render_props()

    def apply_preset(self, preset_name):
        presets = {
            "saffron_gold": {
                "primary": "#FF9933",
                "secondary": "#FFD700",
                "accent": "#FFA500",
                "bg": "#0B0B0E",
                "glow": 130,
            },
            "cyber_neon": {
                "primary": "#0066FF",
                "secondary": "#8B5CF6",
                "accent": "#00FF88",
                "bg": "#0A0A0F",
                "glow": 120,
            },
            "apple_minimal": {
                "primary": "#FFFFFF",
                "secondary": "#A1A1A6",
                "accent": "#0071E3",
                "bg": "#000000",
                "glow": 80,
            },
            "obsidian_purple": {
                "primary": "#A855F7",
                "secondary": "#EC4899",
                "accent": "#06B6D4",
                "bg": "#080410",
                "glow": 140,
            },
            "emerald_energy": {
                "primary": "#10B981",
                "secondary": "#065F46",
                "accent": "#F59E0B",
                "bg": "#02140D",
                "glow": 110,
            }
        }
        p = presets.get(preset_name)
        if not p:
            return
        self.txt_col_primary.setText(p["primary"])
        self.txt_col_secondary.setText(p["secondary"])
        self.txt_col_accent.setText(p["accent"])
        self.txt_col_bg.setText(p["bg"])
        self.scrub_glow.setValue(p["glow"] / 100.0)
        self.update_swatch_styles()
        self.auto_save_render_props()

    def collect_render_props(self):
        return {
            "primaryColor": self.txt_col_primary.text().strip(),
            "secondaryColor": self.txt_col_secondary.text().strip(),
            "accentColor": self.txt_col_accent.text().strip(),
            "backgroundColor": self.txt_col_bg.text().strip(),
            "glowIntensity": round(float(self.scrub_glow.value()), 2),
            "brandName": self.txt_brand_name.text().strip(),
            "tagline": self.txt_tagline.text().strip(),
            "chaosHeadlineBad": self.txt_chaos_bad.text().strip(),
            "chaosHeadlineGood": self.txt_chaos_good.text().strip(),
            "aiBadgeText": self.txt_ai_badge.text().strip(),
            "ctaButtonText": self.txt_cta_btn.text().strip(),
            "ctaButtonUrl": self.txt_cta_url.text().strip(),
            "springDamping": round(float(self.scrub_damping.value()), 1),
            "springMass": round(float(self.scrub_mass.value()), 2),
            "particleCount": int(round(self.scrub_particles.value())),
            "focusScore": round(float(self.scrub_score.value()), 1),
            "statPill1": self.txt_stat1.text().strip(),
            "statPill2": self.txt_stat2.text().strip(),
            "statPill3": self.txt_stat3.text().strip(),
        }

    def auto_save_render_props(self):
        try:
            props = self.collect_render_props()
            out_p = ROOT / "src/data/render_props.json"
            out_p.parent.mkdir(parents=True, exist_ok=True)
            with open(out_p, "w", encoding="utf-8") as f:
                json.dump(props, f, indent=2)
            self.update_swatch_styles()
        except Exception as e:
            print(f"Error auto-saving props: {e}")

    def on_frame_scrubbed(self, frame_no):
        frame_no = int(round(frame_no))
        if self.slider_frame.value() != frame_no:
            self.slider_frame.blockSignals(True)
            self.slider_frame.setValue(frame_no)
            self.slider_frame.blockSignals(False)
        if int(round(self.scrub_frame.value())) != frame_no:
            self.scrub_frame.blockSignals(True)
            self.scrub_frame.setValue(frame_no)
            self.scrub_frame.blockSignals(False)

        sec = frame_no / 30.0
        scene_desc = "Scene 1: Logo Reveal"
        if frame_no >= 480:
            scene_desc = "Scene 5: Grand Finale & CTA"
        elif frame_no >= 360:
            scene_desc = "Scene 4: Wrapped Metrics"
        elif frame_no >= 210:
            scene_desc = "Scene 3: AI Auto-Scheduler"
        elif frame_no >= 90:
            scene_desc = "Scene 2: Chaos to Clarity"

        self.lbl_frame_info.setText(f"Frame: {frame_no:03d} / 600 ({sec:05.2f}s) • {scene_desc}")

    def jump_to_frame(self, frame_no):
        self.slider_frame.setValue(frame_no)
        self.scrub_frame.setValue(frame_no)
        self.on_frame_scrubbed(frame_no)
        self.refresh_preview_frame()

    def on_composition_changed(self, text):
        self.on_frame_scrubbed(self.slider_frame.value())

    def refresh_preview_frame(self):
        self.auto_save_render_props()
        comp = self.combo_comp.currentText().split()[0]
        frame_no = self.slider_frame.value()
        out_preview = ROOT / "out/tweak_preview.png"
        npx = shutil.which("npx.cmd") or shutil.which("npx") or "npx"
        props_file = ROOT / "src/data/render_props.json"
        
        cmd = [
            npx, "remotion", "still", "src/index.ts", comp,
            str(out_preview),
            f"--frame={frame_no}",
            f"--props={props_file.as_posix()}"
        ]
        self.start_worker(cmd)

    # -------------------------------------------------------------
    # Button Actions
    # -------------------------------------------------------------
    def browse_clone_file(self):
        f, _ = QFileDialog.getOpenFileName(self, "Select Voice Sample WAV", str(ROOT / "assets/voices"), "Audio Files (*.wav *.mp3)")
        if f:
            self.txt_clone.setText(f)

    def launch_remotion_studio(self):
        subprocess.Popen(["cmd.exe", "/c", "npm start"], cwd=str(ROOT), creationflags=subprocess.CREATE_NEW_CONSOLE)
        time.sleep(1)
        import webbrowser
        webbrowser.open("http://localhost:3000")

    def open_user_guide(self):
        guide = ROOT / "docs/workflow_user_guide.html"
        if guide.exists():
            os.startfile(str(guide))

    def launch_web_storyboard_gui(self):
        subprocess.Popen([sys.executable, "scripts/storyboard_gui.py"], cwd=str(ROOT), creationflags=subprocess.CREATE_NEW_CONSOLE)

    def launch_voicebox_quick_studio(self):
        subprocess.Popen([sys.executable, "scripts/voicebox_gui.py"], cwd=str(ROOT), creationflags=subprocess.CREATE_NEW_CONSOLE)

    def auto_generate_storyboard(self):
        text = self.txt_script.toPlainText().strip()
        rec_idx = self.combo_sb_recipe.currentIndex() if hasattr(self, "combo_sb_recipe") else 0
        recipes = ["nhit-admission", "saas-launch", "caption-reel", "documentary", "brand-promo", "showreel-launch"]
        recipe_arg = recipes[rec_idx] if 0 <= rec_idx < len(recipes) else "nhit-admission"
        cmd = [sys.executable, "scripts/storyboard_generator.py", "--text", text, "--duration", "30", "--recipe", recipe_arg]
        self.start_worker(cmd)

    def generate_contact_sheet_action(self):
        comp = self.combo_comp.currentText().split()[0] if hasattr(self, "combo_comp") else "NHIT-Infographic-16x9"
        cmd = [sys.executable, "scripts/contact_sheet.py", "--comp", comp, "--frames", "6"]
        self.start_worker(cmd)

    def generate_beat_grid_action(self):
        audio_candidates = list((ROOT / "inputs").glob("*.wav"))
        cmd = [sys.executable, "scripts/beat_grid.py", "--bpm", "120", "--fps", "30"]
        if audio_candidates:
            cmd.extend(["--audio", str(audio_candidates[0])])
        self.start_worker(cmd)

    def generate_sfx_action(self):
        cmd = [sys.executable, "scripts/sfx_designer.py", "--storyboard", "src/data/storyboard.json", "--fps", "30", "--mux"]
        self.start_worker(cmd)

    def generate_sfx_library_action(self):
        cmd = [sys.executable, "scripts/sfx_library_builder.py"]
        self.start_worker(cmd)

    def fetch_openverse_media_action(self):
        cmd = [sys.executable, "scripts/openverse_search.py", "--storyboard", "src/data/storyboard.json"]
        self.start_worker(cmd)

    def run_hardware_teardown_action(self):
        cmd = [sys.executable, ".agent/skills/motion-pipeline/run.py", "--action", "teardown"]
        self.start_worker(cmd)

    def synthesize_voiceover_only(self):
        text = self.txt_script.toPlainText().strip()
        voice_raw = self.combo_voice.currentText().split()[0]
        clone = self.txt_clone.text().strip()
        proj = self.txt_project.text().strip().lower().replace(" ", "_")
        out_wav = ROOT / f"inputs/{proj}_voicebox.wav"

        cmd = [sys.executable, "scripts/voicebox.py", "--text", text, "--voice", voice_raw, "--out", str(out_wav)]
        if clone:
            if ":" in clone:
                cmd.extend(["--blend", clone])
            else:
                cmd.extend(["--clone", clone])
        self.start_worker(cmd)

    def render_selected_composition(self):
        comp = self.combo_comp.currentText().split()[0]
        out_v = ROOT / f"out/master/{comp}_render.mp4"
        npx = shutil.which("npx.cmd") or shutil.which("npx") or "npx"
        props_file = ROOT / "src/data/render_props.json"
        if not props_file.exists():
            props_file = ROOT / "src/data/storyboard.json"

        cmd = [npx, "remotion", "render", "src/index.ts", comp, f"--output={out_v.as_posix()}", f"--props={props_file.as_posix()}", "--gl=angle"]
        self.start_worker(cmd)

    def run_subtitles_stage(self):
        cmd = [sys.executable, ".agent/skills/motion-pipeline/run.py", "--action", "karaoke"]
        self.start_worker(cmd)

    def export_fcpxml_only(self):
        proj = self.txt_project.text().strip()
        aspect = "9:16" if "9:16" in self.combo_aspect.currentText() else "16:9"
        video_p = ROOT / "out/master/multiscene_showcase_voicebox_9x16.mp4"
        vo_p = ROOT / "inputs/multiscene_showcase_voicebox.wav"
        out_xml = ROOT / f"out/resolve_exports/{proj.lower().replace(' ', '_')}.fcpxml"

        cmd = [
            sys.executable, "scripts/fcpxml_generator.py",
            "--project", proj,
            "--video", str(video_p),
            "--voiceover", str(vo_p),
            "--out", str(out_xml),
            "--aspect", aspect
        ]
        self.start_worker(cmd)

    def run_entire_pipeline(self):
        text = self.txt_script.toPlainText().strip()
        voice_raw = self.combo_voice.currentText().split()[0]
        clone = self.txt_clone.text().strip()
        proj = self.txt_project.text().strip()
        aspect = "9:16" if "9:16" in self.combo_aspect.currentText() else "16:9"

        genre_map = ["motion-graphics", "3d-realistic", "documentary", "podcast"]
        genre_key = genre_map[self.combo_genre.currentIndex()] if hasattr(self, "combo_genre") else "motion-graphics"

        cmd = [
            sys.executable, ".agent/skills/motion-pipeline/run.py",
            "--action", "run-all",
            "--genre", genre_key,
            "--text", text,
            "--voice", voice_raw,
            "--project", proj,
            "--aspect", aspect
        ]
        if clone:
            cmd.extend(["--clone", clone])

        self.start_worker(cmd)

def main():
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec())

if __name__ == "__main__":
    main()

