#!/usr/bin/env python3
import argparse
import datetime
import json
import os
import shutil
import sqlite3
import subprocess
import sys
import time
from pathlib import Path

# Ensure FFmpeg and Python 3.12 on Windows
for extra_p in [
    r"C:\Users\User\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.2-full_build\bin",
    r"C:\Users\User\AppData\Local\Programs\Python\Python312\Scripts",
    r"C:\Users\User\AppData\Local\Programs\Python\Python312"
]:
    if os.path.exists(extra_p) and extra_p not in os.environ.get("PATH", ""):
        os.environ["PATH"] = extra_p + os.pathsep + os.environ.get("PATH", "")

ROOT = Path(__file__).resolve().parents[3]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))
DB_PATH = ROOT / "out/pipeline_history.db"

def init_db():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    with sqlite3.connect(str(DB_PATH)) as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS runs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT NOT NULL,
                project_name TEXT NOT NULL,
                audio_file TEXT NOT NULL,
                aspect_ratio TEXT NOT NULL,
                total_duration_sec REAL NOT NULL,
                stage_timings_json TEXT NOT NULL,
                artifacts_json TEXT NOT NULL,
                status TEXT NOT NULL
            )
        """)

def log_run_to_db(project_name: str, audio_file: str, aspect_ratio: str, total_sec: float, timings: dict, artifacts: list[dict], status: str):
    init_db()
    with sqlite3.connect(str(DB_PATH)) as conn:
        conn.execute("""
            INSERT INTO runs (timestamp, project_name, audio_file, aspect_ratio, total_duration_sec, stage_timings_json, artifacts_json, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            project_name,
            str(audio_file),
            aspect_ratio,
            round(total_sec, 2),
            json.dumps(timings),
            json.dumps(artifacts),
            status
        ))

def generate_dashboard():
    init_db()
    with sqlite3.connect(str(DB_PATH)) as conn:
        conn.row_factory = sqlite3.Row
        runs = conn.execute("SELECT * FROM runs ORDER BY id DESC LIMIT 50").fetchall()

    dashboard_path = ROOT / "docs/dashboard.html"
    dashboard_path.parent.mkdir(parents=True, exist_ok=True)

    rows_html = ""
    for r in runs:
        timings = json.loads(r["stage_timings_json"]) if r["stage_timings_json"] else {}
        artifacts = json.loads(r["artifacts_json"]) if r["artifacts_json"] else []
        badge_color = "#10b981" if r["status"] == "SUCCESS" else "#ef4444"

        timings_chips = "".join([
            f'<span style="background: rgba(255,255,255,0.06); padding: 2px 6px; border-radius: 4px; margin-right: 4px; font-size: 0.72rem;">{k}: <b>{v}s</b></span>'
            for k, v in timings.items()
        ])

        artifacts_chips = "".join([
            f'<span style="background: rgba(0,242,254,0.12); color: #00f2fe; padding: 2px 6px; border-radius: 4px; margin-right: 4px; font-size: 0.72rem;">{a.get("name")}: <b>{round(a.get("size_bytes",0)/(1024*1024), 2)}MB</b></span>'
            for a in artifacts
        ])

        rows_html += f"""
        <tr>
            <td style="font-family: monospace; font-size: 0.8rem; color: #94a3b8;">#{r['id']}</td>
            <td style="font-size: 0.82rem; color: #cbd5e1;">{r['timestamp']}</td>
            <td><strong style="color: #fff;">{r['project_name']}</strong></td>
            <td style="font-family: monospace; font-size: 0.78rem; color: #38bdf8;">{Path(r['audio_file']).name}</td>
            <td><span style="background: rgba(79, 172, 254, 0.15); color: #4facfe; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem;">{r['aspect_ratio']}</span></td>
            <td><strong style="color: #fde047;">{r['total_duration_sec']}s</strong></td>
            <td>{timings_chips}</td>
            <td>{artifacts_chips}</td>
            <td><span style="background: {badge_color}22; color: {badge_color}; border: 1px solid {badge_color}55; padding: 3px 8px; border-radius: 4px; font-size: 0.72rem; font-weight: 700;">{r['status']}</span></td>
        </tr>
        """

    if not rows_html:
        rows_html = '<tr><td colspan="9" style="text-align: center; color: #64748b; padding: 32px;">No logged runs yet. Execute a pipeline task to populate.</td></tr>'

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Pipeline Execution Dashboard — Motion Graphics Workstation</title>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
    <style>
        body {{
            background: #060911;
            color: #f1f5f9;
            font-family: 'Plus Jakarta Sans', sans-serif;
            margin: 0;
            padding: 32px;
        }}
        .header {{
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #1e2c4a;
            padding-bottom: 20px;
            margin-bottom: 28px;
        }}
        h1 {{
            font-size: 1.8rem;
            background: linear-gradient(135deg, #fff, #00f2fe);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }}
        .table-wrap {{
            background: #0c1322;
            border: 1px solid #1e2c4a;
            border-radius: 12px;
            overflow-x: auto;
            box-shadow: 0 10px 25px rgba(0,0,0,0.5);
        }}
        table {{
            width: 100%;
            border-collapse: collapse;
            font-size: 0.85rem;
        }}
        th {{
            background: #0f182c;
            color: #94a3b8;
            text-align: left;
            padding: 12px 16px;
            border-bottom: 1px solid #1e2c4a;
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }}
        td {{
            padding: 14px 16px;
            border-bottom: 1px solid #1e2c4a;
            vertical-align: middle;
        }}
        tr:hover td {{
            background: rgba(255, 255, 255, 0.02);
        }}
        .nav-btn {{
            background: rgba(0, 242, 254, 0.12);
            color: #00f2fe;
            border: 1px solid rgba(0, 242, 254, 0.3);
            padding: 8px 16px;
            border-radius: 8px;
            font-size: 0.82rem;
            font-weight: 600;
            text-decoration: none;
        }}
    </style>
</head>
<body>
    <div class="header">
        <div>
            <h1>Pipeline Execution Dashboard</h1>
            <p style="color: #64748b; font-size: 0.88rem; margin-top: 4px;">Real-time execution log from SQLite database (<code>out/pipeline_history.db</code>)</p>
        </div>
        <div>
            <a href="workflow_user_guide.html" class="nav-btn">← Back to User Guide</a>
        </div>
    </div>
    <div class="table-wrap">
        <table>
            <thead>
                <tr>
                    <th>Run</th>
                    <th>Timestamp</th>
                    <th>Project</th>
                    <th>Audio Source</th>
                    <th>Aspect</th>
                    <th>Total Latency</th>
                    <th>Stage Durations</th>
                    <th>Artifacts Generated</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {rows_html}
            </tbody>
        </table>
    </div>
</body>
</html>
    """
    dashboard_path.write_text(html, encoding="utf-8")
    print(f"📊 Live Dashboard updated: {dashboard_path}")

def run_step(cmd: list[str], step_name: str) -> float:
    t0 = time.time()
    print(f"\n▶️ [STEP] {step_name}...")
    res = subprocess.run(cmd, cwd=str(ROOT))
    if res.returncode != 0:
        raise RuntimeError(f"Step '{step_name}' failed with return code {res.returncode}")
    elapsed = round(time.time() - t0, 2)
    print(f"✓ [{step_name}] completed in {elapsed}s")
    return elapsed

def execute_end_to_end(audio_path: str = "", text: str = "", script_path: str = "", voice: str = "tech", clone: str = "", project_name: str = "Automated_Reel", aspect_ratio: str = "9:16"):
    start_time = time.time()
    timings = {}
    artifacts = []
    status = "SUCCESS"

    # Step 0: Voice Box Speech Synthesis (if text or script passed)
    if text or script_path:
        audio_name = project_name.lower().replace(" ", "_")
        generated_audio = ROOT / f"inputs/{audio_name}_voicebox.wav"
        t0_voice = time.time()
        print(f"\n▶️ [STEP] Voice Box Neural Speech Synthesis...")
        voicebox_cmd = [
            sys.executable, "scripts/voicebox.py",
            "--voice", voice,
            "--out", str(generated_audio)
        ]
        if text:
            voicebox_cmd.extend(["--text", text])
        elif script_path:
            voicebox_cmd.extend(["--script", str(Path(script_path).resolve())])
        if clone:
            if ":" in clone:
                voicebox_cmd.extend(["--blend", clone])
            else:
                voicebox_cmd.extend(["--clone", clone])

        res = subprocess.run(voicebox_cmd, cwd=str(ROOT))
        if res.returncode != 0:
            raise RuntimeError("Voice Box synthesis failed.")
        timings["0_voicebox_synthesis"] = round(time.time() - t0_voice, 2)
        audio_file = generated_audio
    else:
        audio_file = Path(audio_path).resolve()

    if not audio_file.exists():
        raise FileNotFoundError(f"Source audio file not found: {audio_file}")

    stem = audio_file.stem
    spectrum_json = ROOT / "src/data/spectrum.json"
    master_video = ROOT / f"out/master/{stem}_{aspect_ratio.replace(':', 'x')}.mp4"
    shorts_dir = ROOT / f"out/shorts/{stem}"
    final_render_dir = ROOT / "out/resolve_exports"
    drfx_file = ROOT / f"out/drfx/{stem}.drfx"

    try:
        # Ensure public/audio.mp3 exists for Remotion staticFile
        public_dir = ROOT / "public"
        public_dir.mkdir(parents=True, exist_ok=True)
        shutil.copy2(audio_file, public_dir / "audio.mp3")

        # 1. Mel Spectrum
        timings["1_mel_spectrum"] = run_step([
            sys.executable, "scripts/extract_audio.py",
            "--audio", str(audio_file),
            "--out", str(spectrum_json)
        ], "Mel Spectrum Extraction")
        if spectrum_json.exists():
            artifacts.append({"name": "spectrum.json", "size_bytes": spectrum_json.stat().st_size})

        # 1.5 Storyboard Generation & Preparation
        storyboard_file = ROOT / "src/data/storyboard.json"
        storyboard_cmd = [
            sys.executable, "scripts/storyboard_generator.py",
            "--out", str(storyboard_file)
        ]
        if text:
            storyboard_cmd.extend(["--text", text])
        elif script_path:
            storyboard_cmd.extend(["--script", str(Path(script_path).resolve())])
        run_step(storyboard_cmd, "Storyboard Generation")

        # Combine storyboard and spectrumData into unified render props
        with open(storyboard_file, "r", encoding="utf-8") as f:
            sb_data = json.load(f)
        with open(spectrum_json, "r", encoding="utf-8") as f:
            spec_data = json.load(f)

        render_props_file = ROOT / "src/data/render_props.json"
        with open(render_props_file, "w", encoding="utf-8") as f:
            json.dump({"storyboard": sb_data, "spectrumData": spec_data}, f)

        # 2. Remotion Render (MultiSceneDeck)
        comp_id = "MultiSceneDeck-9x16" if aspect_ratio == "9:16" else "MultiSceneDeck-16x9"
        master_video.parent.mkdir(parents=True, exist_ok=True)
        npx_bin = shutil.which("npx.cmd") or shutil.which("npx") or "npx"
        timings["2_remotion_render"] = run_step([
            npx_bin, "remotion", "render", "src/index.ts", comp_id,
            f"--output={master_video.as_posix()}",
            f"--props={render_props_file.as_posix()}",
            "--gl=angle", "--concurrency=50%"
        ], "Remotion Multi-Scene GPU Render")
        if master_video.exists():
            artifacts.append({"name": master_video.name, "size_bytes": master_video.stat().st_size})

        # 3. Slice Shorts
        timings["3_shorts_slicing"] = run_step([
            sys.executable, "scripts/slice_shorts.py",
            "--input", str(master_video),
            "--out", str(shorts_dir),
            "--duration", "30"
        ], "30s Shorts Slicing")

        # 4. Whisper Subtitles
        t4_start = time.time()
        subtitled_clips = []
        for raw_part in sorted(shorts_dir.glob("*_part_*.mp4")):
            if "_subtitled" in raw_part.name:
                continue
            run_step([sys.executable, "scripts/whisper_karaoke.py", "--video", str(raw_part)], f"Whisper Subtitles: {raw_part.name}")
            sub = raw_part.parent / f"{raw_part.stem}_subtitled.mp4"
            if sub.exists():
                subtitled_clips.append(str(sub.resolve()))
                artifacts.append({"name": sub.name, "size_bytes": sub.stat().st_size})

        timings["4_whisper_karaoke"] = round(time.time() - t4_start, 2)
        if not subtitled_clips:
            subtitled_clips = [str(p.resolve()) for p in sorted(shorts_dir.glob("*_part_*.mp4")) if "_subtitled" not in p.name]

        # 4.5 Real SFX Sound Design & Audio Stem
        if storyboard_file.exists():
            sfx_stem = ROOT / "out/sfx/master_sfx.wav"
            run_step([
                sys.executable, "scripts/sfx_designer.py",
                "--storyboard", str(storyboard_file),
                "--fps", "30"
            ], "Real SFX Sound Design & Mix")
            if sfx_stem.exists():
                artifacts.append({"name": "master_sfx.wav", "size_bytes": sfx_stem.stat().st_size})

        # 5. Build .drfx Template
        timings["5_drfx_build"] = run_step([sys.executable, "scripts/build_drfx.py", "--title", stem], "DRFX Deploy")
        if drfx_file.exists():
            artifacts.append({"name": drfx_file.name, "size_bytes": drfx_file.stat().st_size})

        # 6. DaVinci Resolve Assembly & Deliver
        resolve_master = final_render_dir / f"{stem}_resolve_master.mp4"
        timings["6_resolve_assembly"] = run_step([
            sys.executable, "scripts/resolve_timeline_builder.py",
            "--project", project_name,
            "--timeline", "Master_Assembly",
            "--aspect", aspect_ratio,
            "--voiceover", str(audio_file),
            "--export-dir", str(final_render_dir),
            "--export-name", f"{stem}_resolve_master",
            "--videos"
        ] + subtitled_clips, "Resolve Timeline Assembly & Render")
        if resolve_master.exists():
            artifacts.append({"name": resolve_master.name, "size_bytes": resolve_master.stat().st_size})

        # 7. Automated QA Safe-Area & Audio Loudness Verification
        t7_start = time.time()
        qa_target_video = resolve_master if resolve_master.exists() else master_video
        if qa_target_video.exists():
            run_step([
                sys.executable, "scripts/qa_validator.py",
                "--video", str(qa_target_video)
            ], "Broadcast QA & Safe-Area Verification")
            qa_json = ROOT / f"out/qa_reports/{qa_target_video.stem}_qa.json"
            if qa_json.exists():
                artifacts.append({"name": qa_json.name, "size_bytes": qa_json.stat().st_size})

            # 8. Cryptographic Production Receipt & Provenance Ledger
            run_step([
                sys.executable, "scripts/receipt_generator.py",
                "--video", str(qa_target_video),
                "--audio", str(audio_file)
            ], "Production Receipt & Ledger Generation")
            rcpt_file = ROOT / f"out/receipts/{qa_target_video.stem}_receipt.md"
            if rcpt_file.exists():
                artifacts.append({"name": rcpt_file.name, "size_bytes": rcpt_file.stat().st_size})
        timings["7_qa_and_receipt"] = round(time.time() - t7_start, 2)

    except Exception as e:
        status = f"FAILED: {e}"
        print(f"\n❌ Pipeline execution error: {e}")
        raise
    finally:
        total_sec = round(time.time() - start_time, 2)
        log_run_to_db(project_name, str(audio_file), aspect_ratio, total_sec, timings, artifacts, status)
        generate_dashboard()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Automated Motion Graphics Workstation Runner")
    parser.add_argument("--action", default="run-all", choices=[
        "run-all", "route", "voicebox", "extract-audio", "render-remotion", "render-crucible", "slice-shorts", "karaoke", "build-drfx", "build-nhit-drfx", "assemble-resolve", "hybrid-3d-resolve", "qa-check", "generate-receipt", "contact-sheet", "sfx", "mux-sfx", "sfx-library", "openverse", "fetch-media", "teardown", "hardware", "studio-blend", "dashboard", "ingest", "seed-assets", "list-assets", "audit-audio"
    ])
    parser.add_argument("--genre", default=None, choices=[
        "motion-graphics", "3d-realistic", "documentary", "podcast",
        "mograph", "adv", "flyer", "vox", "infographic", "3d", "teardown", "hardware", "branch-education", "doc", "history", "cartoon", "audiogram", "interview"
    ], help="Target production genre for specialized engine routing")
    parser.add_argument("--audio", default="inputs/test_voiceover.wav")
    parser.add_argument("--text", default="", help="Text script for Voice Box synthesis")
    parser.add_argument("--script", default="", help="Path to text/markdown script file for Voice Box")
    parser.add_argument("--voice", default="tech", help="Voice Box preset: tech, energetic, female-friendly, casual, etc.")
    parser.add_argument("--clone", default="", help="Voice clone reference WAV in assets/voices/")
    parser.add_argument("--video", default="")
    parser.add_argument("--project", default="Motion_Reel")
    parser.add_argument("--aspect", default="9:16")
    parser.add_argument("--import-file", default="", help="Path to 3D CAD or model file to ingest into studio vault")
    args = parser.parse_args()

    audio_p = Path(args.audio).resolve()
    spectrum_p = ROOT / "src/data/spectrum.json"
    comp = "Master-9x16" if args.aspect == "9:16" else "Master-16x9"
    master_v = ROOT / f"out/master/{audio_p.stem}_{args.aspect.replace(':', 'x')}.mp4"
    shorts_d = ROOT / f"out/shorts/{audio_p.stem}"
    npx_cmd = shutil.which("npx.cmd") or shutil.which("npx") or "npx"

    if args.genre or args.action == "route":
        from scripts.video_engine_router import route_and_execute
        route_and_execute(
            genre=args.genre or "motion-graphics",
            project_name=args.project,
            aspect_ratio=args.aspect,
            audio=args.audio if Path(args.audio).exists() else None,
            text=args.text
        )
    elif args.action == "run-all":
        execute_end_to_end(
            audio_path=args.audio,
            text=args.text,
            script_path=args.script,
            voice=args.voice,
            clone=args.clone,
            project_name=args.project,
            aspect_ratio=args.aspect
        )
    elif args.action == "voicebox":
        out_v = ROOT / f"inputs/{args.project.lower().replace(' ', '_')}_voicebox.wav"
        vb_cmd = [sys.executable, "scripts/voicebox.py", "--voice", args.voice, "--out", str(out_v)]
        if args.text:
            vb_cmd.extend(["--text", args.text])
        elif args.script:
            vb_cmd.extend(["--script", str(Path(args.script).resolve())])
        if args.clone:
            if ":" in args.clone:
                vb_cmd.extend(["--blend", args.clone])
            else:
                vb_cmd.extend(["--clone", args.clone])
        run_step(vb_cmd, "Voice Box Speech Synthesis")
    elif args.action == "extract-audio":
        run_step([sys.executable, "scripts/extract_audio.py", "--audio", str(audio_p), "--out", str(spectrum_p)], "Mel Spectrum Extraction")
    elif args.action == "render-remotion":
        # ensure public/audio.mp3
        (ROOT / "public").mkdir(parents=True, exist_ok=True)
        if audio_p.exists():
            shutil.copy2(audio_p, ROOT / "public/audio.mp3")
        run_step([npx_cmd, "remotion", "render", "src/index.ts", comp, f"--output={master_v.as_posix()}", f"--props={spectrum_p.as_posix()}", "--gl=angle"], "Remotion Render")
    elif args.action == "slice-shorts":
        inp_v = Path(args.video).resolve() if args.video else master_v
        run_step([sys.executable, "scripts/slice_shorts.py", "--input", str(inp_v), "--out", str(shorts_d)], "Slice Shorts")
    elif args.action == "karaoke":
        inp_v = Path(args.video).resolve() if args.video else list(shorts_d.glob("*_part_*.mp4"))[0]
        run_step([sys.executable, "scripts/whisper_karaoke.py", "--video", str(inp_v)], "Whisper Karaoke")
    elif args.action == "build-drfx":
        run_step([sys.executable, "scripts/build_drfx.py", "--title", audio_p.stem], "Build DRFX")
    elif args.action == "build-nhit-drfx":
        run_step([sys.executable, "scripts/build_nhit_drfx.py"], "Build & Install NHIT Admission DRFX Pack")
    elif args.action == "render-crucible":
        node_cmd = shutil.which("node.exe") or shutil.which("node") or "node"
        run_step([node_cmd, "scripts/render_crucible_scenes.mjs"], "Crucible 3D Scene Rendering")
    elif args.action == "hybrid-3d-resolve":
        run_step([sys.executable, "scripts/generate_hybrid_3d_fcpxml.py"], "Generate Hybrid 3D DaVinci Resolve Timeline")
    elif args.action == "assemble-resolve":
        videos = [str(p.resolve()) for p in sorted(shorts_d.glob("*_subtitled.mp4"))]
        run_step([
            sys.executable, "scripts/resolve_timeline_builder.py",
            "--project", args.project,
            "--timeline", "Master_Assembly",
            "--aspect", args.aspect,
            "--voiceover", str(audio_p),
            "--export-dir", str(ROOT / "out/resolve_exports"),
            "--export-name", f"{audio_p.stem}_resolve_master",
            "--videos"
        ] + videos, "Assemble Resolve")
    elif args.action == "qa-check":
        inp_v = Path(args.video).resolve() if args.video else master_v
        run_step([sys.executable, "scripts/qa_validator.py", "--video", str(inp_v)], "Broadcast Safe-Area & Audio QA")
    elif args.action == "generate-receipt":
        inp_v = Path(args.video).resolve() if args.video else master_v
        run_step([sys.executable, "scripts/receipt_generator.py", "--video", str(inp_v), "--audio", str(audio_p)], "Generate Provenance Receipt")
    elif args.action == "contact-sheet":
        comp_target = args.project or "NHIT-Infographic-16x9"
        inp_v = Path(args.video).resolve() if args.video else master_v
        cs_cmd = [sys.executable, "scripts/contact_sheet.py", "--comp", comp_target]
        if inp_v.exists():
            cs_cmd.extend(["--video", str(inp_v)])
        run_step(cs_cmd, "Visual Contact Sheet Generation")
    elif args.action == "sfx-library":
        run_step([sys.executable, "scripts/sfx_library_builder.py"], "Procedural SFX Library Synthesis")
    elif args.action == "sfx":
        run_step([sys.executable, "scripts/sfx_designer.py", "--storyboard", "src/data/storyboard.json", "--fps", "30"], "Real SFX Sound Design & Mix")
    elif args.action == "mux-sfx":
        inp_v = Path(args.video).resolve() if args.video else master_v
        run_step([sys.executable, "scripts/sfx_designer.py", "--mux", "--video", str(inp_v)], "Mux Real SFX with Master Video")
    elif args.action in ["openverse", "fetch-media"]:
        sb_path = ROOT / "src/data/storyboard.json"
        run_step([sys.executable, "scripts/openverse_search.py", "--storyboard", str(sb_path)], "Openverse Media Sourcing")
    elif args.action in ["teardown", "hardware"]:
        sb_path = ROOT / "src/data/hardware_teardown_storyboard.json"
        run_step([sys.executable, "scripts/blender_teardown.py", "--storyboard", str(sb_path)], "Blender 3D Hardware Teardown & Tracking")
        run_step([
            sys.executable, "scripts/sfx_designer.py",
            "--storyboard", str(sb_path),
            "--out", str(ROOT / "out/sfx/hardware_teardown_sfx.wav")
        ], "Teardown Mechanical Foley Sound Design")
        run_step([sys.executable, "scripts/generate_hybrid_3d_fcpxml.py", "--teardown"], "Hardware Teardown DaVinci Resolve FCPXML")
    elif args.action == "studio-blend":
        run_step([sys.executable, "scripts/blender_hardware_studio.py", "--mode", "multi-pass"], "Branch Hardware Studio Template Generation")
    elif args.action == "seed-assets":
        run_step([sys.executable, "scripts/asset_ingest_pipeline.py", "--seed"], "Seed Studio Asset Vault")
    elif args.action == "list-assets":
        run_step([sys.executable, "scripts/asset_ingest_pipeline.py", "--list"], "List Studio Asset Vault Inventory")
    elif args.action == "ingest":
        if not args.import_file:
            print("[ERROR] Please provide --import-file path/to/model.step (or .obj / .glb)")
        else:
            run_step([sys.executable, "scripts/asset_ingest_pipeline.py", "--import-file", str(Path(args.import_file).resolve())], f"Ingest 3D Asset: {Path(args.import_file).name}")
    elif args.action == "audit-audio":
        sfx_candidates = [
            ROOT / "out/sfx/hardware_teardown_sfx.wav",
            ROOT / "out/sfx/master_sfx.wav",
            audio_p
        ]
        target_audio = next((p for p in sfx_candidates if p.exists()), audio_p)
        sb_candidates = [
            ROOT / "src/data/hardware_teardown_storyboard.json",
            ROOT / "src/data/storyboard.json"
        ]
        target_sb = next((p for p in sb_candidates if p.exists()), ROOT / "src/data/storyboard.json")
        run_step([
            sys.executable, "scripts/acoustic_auditor.py",
            "--audio", str(target_audio),
            "--storyboard", str(target_sb)
        ], "Acoustic Intelligence & Earshot Semantic Audit")
    elif args.action == "dashboard":
        generate_dashboard()
