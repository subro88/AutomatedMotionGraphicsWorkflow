#!/usr/bin/env python3
"""
Motion Video Director — Local Preflight Checklist Auditor
=========================================================
Checks all required runtime environments, CLI binaries, animation libraries,
audio tools, and NLE template directories on the host workstation.
"""

import os
import platform
import shutil
import subprocess
import sys
from pathlib import Path

# Ensure Gyan FFmpeg on Windows PATH
for extra_p in [
    r"C:\Users\User\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.2-full_build\bin",
    r"C:\Users\User\AppData\Local\Programs\Python\Python312\Scripts",
    r"C:\Users\User\AppData\Local\Programs\Python\Python312"
]:
    if os.path.exists(extra_p) and extra_p not in os.environ.get("PATH", ""):
        os.environ["PATH"] = extra_p + os.pathsep + os.environ.get("PATH", "")

ROOT = Path(__file__).resolve().parents[3]


def get_version(cmd: list[str]) -> str:
    """Run command and return first line of output."""
    try:
        res = subprocess.run(cmd, capture_output=True, text=True, check=True)
        out = (res.stdout or res.stderr).strip().splitlines()
        return out[0] if out else "Installed"
    except Exception:
        return ""


def check_python_module(module_name: str) -> str:
    """Check if python module is importable."""
    try:
        res = subprocess.run(
            [sys.executable, "-c", f"import {module_name}; print(getattr({module_name}, '__version__', 'Installed'))"],
            capture_output=True, text=True, check=True
        )
        return res.stdout.strip()
    except Exception:
        return ""


def check_node_module(pkg_name: str) -> str:
    """Check if node package exists in node_modules."""
    try:
        res = subprocess.run(
            ["node", "-e", f"try {{ console.log(require('{pkg_name}/package.json').version); }} catch(e) {{ console.log(''); }}"],
            cwd=str(ROOT), capture_output=True, text=True
        )
        return res.stdout.strip()
    except Exception:
        return ""


def run_preflight() -> bool:
    print("\n" + "=" * 78)
    print(" 🎬 MOTION VIDEO DIRECTOR — WORKSTATION PREFLIGHT AUDIT")
    print("=" * 78)
    print(f" Host: {platform.platform()} | Python: {platform.python_version()} | Working Dir: {ROOT}\n")

    items = []

    # 1. Runtimes
    node_v = get_version(["node", "-v"])
    items.append(("Node.js Runtime", "node -v", bool(node_v), node_v, "Install Node.js ≥18"))

    py_ok = sys.version_info >= (3, 10)
    items.append(("Python Runtime", f"Python {platform.python_version()}", py_ok, f"v{platform.python_version()}", "Install Python ≥3.10"))

    # 2. FFmpeg & Media Encoding
    ffmpeg_v = get_version(["ffmpeg", "-version"])
    items.append(("FFmpeg Video Encoder", "ffmpeg", bool(ffmpeg_v), ffmpeg_v.split("Copyright")[0].strip() if ffmpeg_v else "", "Install Gyan FFmpeg"))

    ffprobe_v = get_version(["ffprobe", "-version"])
    items.append(("FFprobe Stream Analyzer", "ffprobe", bool(ffprobe_v), "Available" if ffprobe_v else "", "Install FFprobe"))

    # 3. Motion & Animation Engines
    remotion_v = check_node_module("remotion") or check_node_module("@remotion/cli")
    items.append(("Remotion Motion Engine", "remotion", bool(remotion_v), f"v{remotion_v}" if remotion_v else "", "npm install remotion"))

    gsap_v = check_node_module("gsap")
    items.append(("GSAP Animation Engine", "gsap", bool(gsap_v), f"v{gsap_v}" if gsap_v else "", "npm install gsap"))

    crucible_v = check_node_module("@codepawlhq/crucible")
    items.append(("Crucible 3D Engine", "@codepawlhq/crucible", bool(crucible_v), f"v{crucible_v}" if crucible_v else "", "npm install @codepawlhq/crucible"))

    # 4. Neural Speech & Transcription
    whisper_v = check_python_module("faster_whisper")
    items.append(("Faster-Whisper (Subtitles)", "faster-whisper", bool(whisper_v), f"v{whisper_v}" if whisper_v else "", "pip install faster-whisper"))

    edge_tts_v = check_python_module("edge_tts")
    items.append(("Voice Box (Neural TTS)", "edge-tts", bool(edge_tts_v), f"v{edge_tts_v}" if edge_tts_v else "", "pip install edge-tts"))

    # 5. UI & NLE Support
    pyside_v = check_python_module("PySide6")
    items.append(("PySide6 Studio GUI", "PySide6", bool(pyside_v), f"v{pyside_v}" if pyside_v else "", "pip install PySide6"))

    resolve_fusion_dir = Path(os.environ.get("APPDATA", "")) / r"Blackmagic Design\DaVinci Resolve\Support\Fusion\Templates"
    has_fusion = resolve_fusion_dir.exists()
    items.append(("DaVinci Resolve Fusion Path", "Templates dir", has_fusion, "Found" if has_fusion else "Not Detected", "Check Resolve Support dir"))

    # Print Table
    col_w = [26, 12, 10, 26]
    header = f"{'Component':<26} | {'Status':<10} | {'Version':<18} | {'Notes / Action':<20}"
    print(header)
    print("-" * 78)

    all_ok = True
    for name, cmd, ok, ver, act in items:
        status_str = "✅ READY" if ok else "❌ MISSING"
        if not ok:
            all_ok = False
        ver_str = (ver[:16] + "..") if len(ver) > 18 else ver
        print(f"{name:<26} | {status_str:<10} | {ver_str:<18} | {act:<20}")

    print("-" * 78)
    if all_ok:
        print("🎉 ALL CORE WORKSTATION SUBSYSTEMS ARE VERIFIED & READY FOR PRODUCTION!\n")
    else:
        print("⚠️ Some optional or recommended tools are missing. Review the table above.\n")

    return all_ok


if __name__ == "__main__":
    success = run_preflight()
    sys.exit(0 if success else 1)
