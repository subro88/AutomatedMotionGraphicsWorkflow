#!/usr/bin/env python3
"""
Voice Box Quick Studio — Standalone Neural TTS & Audio Mastering GUI
Powered by PySide6, Edge-TTS, Kokoro-82M, and FFmpeg EBU R128 Loudness Normalization.
"""
import os
import sys
import subprocess
from pathlib import Path

from PySide6.QtCore import Qt, QUrl, QThread, Signal
from PySide6.QtGui import QIcon, QFont
from PySide6.QtWidgets import (
    QApplication, QMainWindow, QWidget, QVBoxLayout, QHBoxLayout,
    QLabel, QTextEdit, QComboBox, QLineEdit, QPushButton, QProgressBar,
    QGroupBox, QFileDialog, QMessageBox, QFrame, QDoubleSpinBox
)
from PySide6.QtMultimedia import QMediaPlayer, QAudioOutput

ROOT = Path(__file__).resolve().parent.parent
INPUTS_DIR = ROOT / "inputs"
INPUTS_DIR.mkdir(parents=True, exist_ok=True)

VOICE_OPTIONS = [
    # Indian English & Hindi Voices
    ("en-IN-PrabhatNeural (Indian English Male - Natural Narrator 🇮🇳)", "en-IN-PrabhatNeural"),
    ("en-IN-NeerjaNeural (Indian English Female - Corporate 🇮🇳)", "en-IN-NeerjaNeural"),
    ("en-IN-NeerjaExpressiveNeural (Indian English Female - Expressive 🇮🇳)", "en-IN-NeerjaExpressiveNeural"),
    ("hi-IN-MadhurNeural (Hindi Male - Clear Voiceover 🇮🇳)", "hi-IN-MadhurNeural"),
    ("hi-IN-SwaraNeural (Hindi Female - Smooth Broadcast 🇮🇳)", "hi-IN-SwaraNeural"),
    # Bengali / Bangla Voices
    ("bn-IN-BashkarNeural (Bengali India Male - Warm Narrator 🇮🇳)", "bn-IN-BashkarNeural"),
    ("bn-IN-TanishaaNeural (Bengali India Female - Modern Banglish 🇮🇳)", "bn-IN-TanishaaNeural"),
    ("bn-BD-PradeepNeural (Bangla BD Male - Professional 🇧🇩)", "bn-BD-PradeepNeural"),
    ("bn-BD-NabanitaNeural (Bangla BD Female - Expressive 🇧🇩)", "bn-BD-NabanitaNeural"),
    # Kokoro-82M Local Offline Engine
    ("kokoro-heart (Kokoro Local - Warm Conversational Female ⭐)", "kokoro-heart"),
    ("kokoro-adam (Kokoro Local - Tech Founder Dynamic Male)", "kokoro-adam"),
    ("kokoro-bella (Kokoro Local - Upbeat Energetic Female)", "kokoro-bella"),
    ("kokoro-sarah (Kokoro Local - Clear American Female)", "kokoro-sarah"),
    ("kokoro-michael (Kokoro Local - Authoritative Documentary Male)", "kokoro-michael"),
    ("kokoro-george (Kokoro Local - Sophisticated British Male)", "kokoro-george"),
    ("kokoro-alice (Kokoro Local - British Storyteller Female)", "kokoro-alice"),
    ("kokoro-hindi-female (Kokoro Local - Hindi Female [hf_alpha])", "kokoro-hindi-female"),
    ("kokoro-hindi-male (Kokoro Local - Hindi Male [hm_omega])", "kokoro-hindi-male"),
    # Edge-TTS US & UK Voices
    ("en-US-ChristopherNeural (Edge Cloud - Tech Authoritative)", "en-US-ChristopherNeural"),
    ("en-US-GuyNeural (Edge Cloud - Energetic YouTube)", "en-US-GuyNeural"),
    ("en-US-JennyNeural (Edge Cloud - Friendly Engaging)", "en-US-JennyNeural"),
    ("en-US-AriaNeural (Edge Cloud - Professional Female)", "en-US-AriaNeural"),
    ("en-GB-RyanNeural (Edge Cloud - British Documentary)", "en-GB-RyanNeural"),
]

DARK_STYLE = """
QMainWindow, QWidget {
    background-color: #0B0B0E;
    color: #F1F5F9;
    font-family: 'Segoe UI', 'Nirmala UI', sans-serif;
    font-size: 13px;
}
QGroupBox {
    border: 1px solid #1E293B;
    border-radius: 8px;
    margin-top: 14px;
    padding-top: 16px;
    font-weight: bold;
    color: #FFD700;
}
QGroupBox::title {
    subcontrol-origin: margin;
    subcontrol-position: top left;
    padding: 0 8px;
}
QTextEdit, QLineEdit, QComboBox, QDoubleSpinBox {
    background-color: #121826;
    border: 1px solid #334155;
    border-radius: 6px;
    padding: 8px;
    color: #F8FAFC;
    selection-background-color: #FF9933;
}
QTextEdit:focus, QLineEdit:focus, QComboBox:focus {
    border: 1px solid #FF9933;
}
QPushButton {
    background-color: #1E293B;
    border: 1px solid #334155;
    border-radius: 6px;
    padding: 8px 16px;
    font-weight: 600;
    color: #FFFFFF;
}
QPushButton:hover {
    background-color: #334155;
    border-color: #FF9933;
}
QPushButton#primaryBtn {
    background-color: #FF9933;
    color: #000000;
    font-weight: bold;
    font-size: 14px;
    padding: 10px 20px;
    border: none;
}
QPushButton#primaryBtn:hover {
    background-color: #FFA500;
}
QPushButton#playBtn {
    background-color: #10B981;
    color: #FFFFFF;
    font-weight: bold;
}
QPushButton#playBtn:hover {
    background-color: #059669;
}
QProgressBar {
    background-color: #121826;
    border: 1px solid #334155;
    border-radius: 6px;
    text-align: center;
    color: #FFFFFF;
}
QProgressBar::chunk {
    background-color: #FF9933;
    border-radius: 5px;
}
"""

class SynthesisWorker(QThread):
    finished_signal = Signal(bool, str)
    log_signal = Signal(str)

    def __init__(self, cmd):
        super().__init__()
        self.cmd = cmd

    def run(self):
        try:
            self.log_signal.emit(f"🚀 Running: {' '.join(self.cmd[:4])}...")
            env = os.environ.copy()
            env["PYTHONUNBUFFERED"] = "1"
            ffmpeg_dir = Path(r"C:\Users\User\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.2-full_build\bin")
            if ffmpeg_dir.exists():
                env["PATH"] = f"{ffmpeg_dir};{env.get('PATH', '')}"

            p = subprocess.Popen(
                self.cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                cwd=str(ROOT),
                env=env,
                encoding="utf-8",
                errors="replace"
            )
            output_lines = []
            for line in iter(p.stdout.readline, ""):
                if line:
                    clean = line.strip()
                    self.log_signal.emit(clean)
                    output_lines.append(clean)
            p.stdout.close()
            p.wait()
            if p.returncode == 0:
                self.finished_signal.emit(True, "Voiceover synthesis and audio mastering succeeded!")
            else:
                err_text = "\n".join(output_lines) if output_lines else f"Process exited with code {p.returncode}"
                self.finished_signal.emit(False, f"Synthesis failed (code {p.returncode}):\n\n{err_text}")
        except Exception as e:
            self.finished_signal.emit(False, f"Subprocess exception: {e}")

class VoiceBoxQuickStudio(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("🎙️ Voice Box Studio — Neural Speech & Mastering")
        self.resize(760, 680)
        self.setStyleSheet(DARK_STYLE)

        self.last_output_wav = None

        # Media Player for In-App Preview
        self.player = QMediaPlayer()
        self.audio_output = QAudioOutput()
        self.player.setAudioOutput(self.audio_output)
        self.audio_output.setVolume(1.0)

        self.init_ui()

    def init_ui(self):
        central = QWidget()
        self.setCentralWidget(central)
        main_layout = QVBoxLayout(central)
        main_layout.setContentsMargins(20, 20, 20, 20)
        main_layout.setSpacing(14)

        # Header Title
        title_box = QHBoxLayout()
        lbl_title = QLabel("🎙️ Voice Box Studio")
        lbl_title.setStyleSheet("font-size: 20px; font-weight: bold; color: #FF9933;")
        lbl_subtitle = QLabel("Indian • Bengali • Kokoro Offline • Cloud Neural TTS")
        lbl_subtitle.setStyleSheet("color: #94A3B8; font-size: 12px; margin-top: 4px;")
        title_box.addWidget(lbl_title)
        title_box.addWidget(lbl_subtitle)
        title_box.addStretch()

        btn_launch_official = QPushButton("✨ Open Official Voicebox App (voicebox.sh)")
        btn_launch_official.setStyleSheet("background-color: #2563EB; color: #FFFFFF; font-weight: bold; padding: 6px 14px; border-radius: 6px;")
        btn_launch_official.setToolTip("Opens the official dark luxury Voicebox desktop app (with Jarvis, Samuel L. Jackson, Qwen 1.7B, and voice cloning)")
        btn_launch_official.clicked.connect(self.launch_official_voicebox)
        title_box.addWidget(btn_launch_official)

        main_layout.addLayout(title_box)

        # Script Input Box
        group_script = QGroupBox("📝 Script & Voiceover Text")
        gs_layout = QVBoxLayout(group_script)
        self.txt_script = QTextEdit()
        self.txt_script.setPlaceholderText("Enter your text in English, Bengali, Hindi, or Banglish...\nExample: স্বাগতম TaskFlow তে! Experience effortless motion graphics velocity.")
        self.txt_script.setText("Welcome to TaskFlow. We are building world-class automated motion graphics with seamless voiceover.")
        self.txt_script.setFixedHeight(120)
        gs_layout.addWidget(self.txt_script)

        btn_row_script = QHBoxLayout()
        btn_clear = QPushButton("Clear")
        btn_clear.clicked.connect(self.txt_script.clear)
        btn_load_file = QPushButton("📂 Load Script File (.txt/.md)")
        btn_load_file.clicked.connect(self.load_script_file)
        btn_row_script.addWidget(btn_load_file)
        btn_row_script.addStretch()
        btn_row_script.addWidget(btn_clear)
        gs_layout.addLayout(btn_row_script)
        main_layout.addWidget(group_script)

        # Voice & Settings Group
        group_voice = QGroupBox("🎙️ Voice & Acoustic Engine")
        gv_layout = QVBoxLayout(group_voice)

        row_v1 = QHBoxLayout()
        row_v1.addWidget(QLabel("Neural Voice:"))
        self.combo_voice = QComboBox()
        for label, val in VOICE_OPTIONS:
            self.combo_voice.addItem(label, val)
        row_v1.addWidget(self.combo_voice, 1)
        gv_layout.addLayout(row_v1)

        row_v2 = QHBoxLayout()
        row_v2.addWidget(QLabel("Speed:"))
        self.spin_speed = QDoubleSpinBox()
        self.spin_speed.setRange(0.5, 2.0)
        self.spin_speed.setSingleStep(0.05)
        self.spin_speed.setValue(1.0)
        self.spin_speed.setSuffix("x")
        row_v2.addWidget(self.spin_speed)

        row_v2.addSpacing(15)
        row_v2.addWidget(QLabel("Voice Blend / Clone:"))
        self.txt_blend = QLineEdit()
        self.txt_blend.setPlaceholderText("Optional: af_heart:0.6,am_adam:0.4 or WAV file")
        row_v2.addWidget(self.txt_blend, 1)
        gv_layout.addLayout(row_v2)

        row_v3 = QHBoxLayout()
        row_v3.addWidget(QLabel("Output File:"))
        self.txt_out = QLineEdit(str(INPUTS_DIR / "voicebox_quick_output.wav"))
        row_v3.addWidget(self.txt_out, 1)
        btn_browse_out = QPushButton("Browse...")
        btn_browse_out.clicked.connect(self.browse_output)
        row_v3.addWidget(btn_browse_out)
        gv_layout.addLayout(row_v3)

        main_layout.addWidget(group_voice)

        # Execution Button
        self.btn_generate = QPushButton("⚡ Synthesize & Master Audio (EBU R128)")
        self.btn_generate.setObjectName("primaryBtn")
        self.btn_generate.clicked.connect(self.run_synthesis)
        main_layout.addWidget(self.btn_generate)

        # In-App Audio Player Preview Bar
        group_player = QGroupBox("🔊 Mastered Audio Preview")
        gp_layout = QHBoxLayout(group_player)
        self.btn_play = QPushButton("▶ Play")
        self.btn_play.setObjectName("playBtn")
        self.btn_play.setEnabled(False)
        self.btn_play.clicked.connect(self.toggle_playback)
        gp_layout.addWidget(self.btn_play)

        self.btn_stop = QPushButton("⏹ Stop")
        self.btn_stop.setEnabled(False)
        self.btn_stop.clicked.connect(self.stop_playback)
        gp_layout.addWidget(self.btn_stop)

        self.lbl_player_status = QLabel("No audio synthesized yet.")
        self.lbl_player_status.setStyleSheet("color: #94A3B8; font-style: italic;")
        gp_layout.addWidget(self.lbl_player_status, 1)

        btn_open_folder = QPushButton("📁 Open Folder")
        btn_open_folder.clicked.connect(lambda: os.startfile(str(INPUTS_DIR)))
        gp_layout.addWidget(btn_open_folder)
        main_layout.addWidget(group_player)

        # Log & Status Bar
        self.lbl_status = QLabel("Ready.")
        self.lbl_status.setStyleSheet("color: #38BDF8; font-weight: 500;")
        main_layout.addWidget(self.lbl_status)

        self.progress_bar = QProgressBar()
        self.progress_bar.setRange(0, 0)
        self.progress_bar.setVisible(False)
        main_layout.addWidget(self.progress_bar)

    def load_script_file(self):
        f, _ = QFileDialog.getOpenFileName(self, "Open Script Text", str(ROOT), "Text Files (*.txt *.md *.json)")
        if f:
            content = Path(f).read_text(encoding="utf-8")
            self.txt_script.setText(content)
            self.lbl_status.setText(f"Loaded script: {Path(f).name}")

    def browse_output(self):
        f, _ = QFileDialog.getSaveFileName(self, "Save Output WAV", str(INPUTS_DIR / "voiceover.wav"), "Wave Audio (*.wav)")
        if f:
            self.txt_out.setText(f)

    def launch_official_voicebox(self):
        # 1. Check if already installed
        local_app_data = os.environ.get("LOCALAPPDATA", "")
        installed_candidates = [
            Path(local_app_data) / "Programs" / "Voicebox" / "Voicebox.exe",
            Path(local_app_data) / "Programs" / "voicebox" / "Voicebox.exe",
            Path(r"C:\Program Files\Voicebox\Voicebox.exe"),
        ]
        for c in installed_candidates:
            if c.exists():
                subprocess.Popen([str(c)])
                self.lbl_status.setText(f"Launched Voicebox app: {c.name}")
                return

        # 2. Check if setup installer exists
        setup_exe = ROOT / "Voicebox_Setup.exe"
        if setup_exe.exists():
            subprocess.Popen([str(setup_exe)])
            QMessageBox.information(
                self,
                "Official Voicebox Setup",
                f"Launching official Voicebox installer:\n{setup_exe.name}\n\n"
                "Once setup finishes, the default Voicebox dark interface (with Jarvis, Samuel L Jackson, Qwen 1.7B, and voice cloning) will open."
            )
            return

        # 3. Fallback to web link
        import webbrowser
        webbrowser.open("https://voicebox.sh")

    def run_synthesis(self):
        text = self.txt_script.toPlainText().strip()
        if not text:
            QMessageBox.warning(self, "Warning", "Please enter some text in the script area.")
            return

        # Release any active file handle on the audio output
        self.player.stop()
        self.player.setSource(QUrl())
        self.btn_play.setText("▶ Play")

        voice = self.combo_voice.currentData()
        out_path = Path(self.txt_out.text().strip())
        blend = self.txt_blend.text().strip()
        speed = self.spin_speed.value()

        cmd = [
            sys.executable,
            "-u",
            str((ROOT / "scripts" / "voicebox.py").resolve()),
            "--text", text,
            "--voice", voice,
            "--speed", str(speed),
            "--out", str(out_path)
        ]

        if blend:
            if ":" in blend:
                cmd.extend(["--blend", blend])
            else:
                cmd.extend(["--clone", blend])

        self.btn_generate.setEnabled(False)
        self.progress_bar.setVisible(True)
        self.lbl_status.setText(f"Synthesizing with {voice} and mastering via FFmpeg...")

        self.worker = SynthesisWorker(cmd)
        self.worker.log_signal.connect(lambda msg: self.lbl_status.setText(msg))
        self.worker.finished_signal.connect(self.on_synthesis_finished)
        self.worker.start()

    def on_synthesis_finished(self, success, message):
        self.btn_generate.setEnabled(True)
        self.progress_bar.setVisible(False)
        if success:
            out_path = Path(self.txt_out.text().strip())
            self.last_output_wav = out_path
            self.lbl_status.setText(f"✔ Ready: {out_path.name} ({round(out_path.stat().st_size/1024, 1)} KB)")
            self.btn_play.setEnabled(True)
            self.btn_stop.setEnabled(True)
            self.lbl_player_status.setText(f"Mastered: {out_path.name} (EBU R128 -16 LUFS)")
            # Auto load audio into player
            self.player.setSource(QUrl.fromLocalFile(str(out_path)))
        else:
            self.lbl_status.setText(f"❌ Error: {message}")
            QMessageBox.critical(self, "Synthesis Error", message)

    def toggle_playback(self):
        if self.player.playbackState() == QMediaPlayer.PlayingState:
            self.player.pause()
            self.btn_play.setText("▶ Play")
        else:
            self.player.play()
            self.btn_play.setText("⏸ Pause")

    def stop_playback(self):
        self.player.stop()
        self.btn_play.setText("▶ Play")

def main():
    app = QApplication(sys.argv)
    win = VoiceBoxQuickStudio()
    win.show()
    sys.exit(app.exec())

if __name__ == "__main__":
    main()

