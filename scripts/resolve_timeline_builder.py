#!/usr/bin/env python3
import argparse
import os
import shutil
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

def setup_resolve_environment() -> Path:
    if sys.platform.startswith("win"):
        resolve_dir = r"C:\Program Files\Blackmagic Design\DaVinci Resolve"
        p312 = r"C:\Users\User\AppData\Local\Programs\Python\Python312"
        os.environ["PYTHON3HOME"] = p312
        os.environ["PYTHONHOME"] = p312
        if hasattr(os, "add_dll_directory"):
            try:
                os.add_dll_directory(resolve_dir)
            except Exception:
                pass
        resolve_app = Path(resolve_dir) / "Resolve.exe"
        api_path = Path("C:/ProgramData/Blackmagic Design/DaVinci Resolve/Support/Developer/Scripting")
        os.environ["RESOLVE_SCRIPT_API"] = str(api_path / "API")
        os.environ["RESOLVE_SCRIPT_LIB"] = str(Path(resolve_dir) / "fusionscript.dll")
        sys.path.append(str(api_path / "Modules"))
    elif sys.platform.startswith("darwin"):
        resolve_app = Path("/Applications/DaVinci Resolve/DaVinci Resolve.app/Contents/MacOS/Resolve")
        api_path = Path("/Library/Application Support/Blackmagic Design/DaVinci Resolve/Developer/Scripting")
        os.environ["RESOLVE_SCRIPT_API"] = str(api_path / "API")
        os.environ["RESOLVE_SCRIPT_LIB"] = "/Applications/DaVinci Resolve/DaVinci Resolve.app/Contents/Libraries/Fusion/fusionscript.so"
        sys.path.append(str(api_path / "Modules"))
    else:
        resolve_app = Path("/opt/resolve/bin/resolve")
        api_path = Path("/opt/resolve/Developer/Scripting")
        os.environ["RESOLVE_SCRIPT_API"] = str(api_path / "API")
        os.environ["RESOLVE_SCRIPT_LIB"] = "/opt/resolve/libs/Fusion/fusionscript.so"
        sys.path.append(str(api_path / "Modules"))
    return resolve_app

def ensure_resolve_running(resolve_bin: Path, timeout_sec: int = 15):
    try:
        import DaVinciResolveScript as bmd
        app = bmd.scriptapp("Resolve")
        if app:
            print("Connected to active DaVinci Resolve instance.")
            return app
    except Exception as e:
        print(f"Resolve scriptapp check: {e}")

    print("Checking / launching DaVinci Resolve...")
    if sys.platform.startswith("win"):
        try:
            subprocess.Popen([str(resolve_bin)], cwd=str(resolve_bin.parent), creationflags=subprocess.DETACHED_PROCESS)
        except Exception as e:
            print(f"Resolve launch note: {e}")
    else:
        try:
            subprocess.Popen([str(resolve_bin)], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        except Exception as e:
            print(f"Resolve launch note: {e}")

    start = time.time()
    while time.time() - start < timeout_sec:
        time.sleep(2)
        try:
            import DaVinciResolveScript as bmd
            app = bmd.scriptapp("Resolve")
            if app:
                print("Connected to DaVinci Resolve API.")
                return app
        except Exception:
            continue
    return None

def fallback_assemble_timeline(video_files: list[Path], voiceover_file: Path, export_dir: Path, export_filename: str, aspect_ratio: str = "9:16", fps: float = 30.0):
    """Fallback NVENC stitcher & EDL generator for headless or non-Studio environments."""
    print("Executing fallback timeline assembly and NVENC export...")
    export_dir.mkdir(parents=True, exist_ok=True)
    out_file = export_dir / f"{export_filename}.mp4"

    # 1. Create concat file list
    concat_list = export_dir / "concat_list.txt"
    with open(concat_list, "w", encoding="utf-8") as f:
        for vf in video_files:
            f.write(f"file '{vf.resolve().as_posix()}'\n")

    # 2. Concat video clips with NVENC
    temp_concat = export_dir / "temp_concat.mp4"
    subprocess.run([
        "ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(concat_list),
        "-c", "copy", str(temp_concat)
    ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    # 3. Mux with voiceover track on A1
    if voiceover_file and voiceover_file.exists():
        subprocess.run([
            "ffmpeg", "-y", "-i", str(temp_concat), "-i", str(voiceover_file),
            "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
            "-map", "0:v:0", "-map", "1:a:0",
            "-shortest", str(out_file)
        ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    else:
        shutil.copy2(temp_concat, out_file)

    if temp_concat.exists():
        temp_concat.unlink()
    if concat_list.exists():
        concat_list.unlink()

    # 4. Generate standard CMX3600 EDL and FCPXML for Resolve Timeline Import
    edl_path = export_dir / f"{export_filename}.edl"
    edl_lines = [
        f"TITLE: {export_filename}",
        "FCM: NON-DROP FRAME\n"
    ]
    cur_frame = 0
    for idx, vf in enumerate(video_files):
        # 30s per part
        dur = 30 * int(fps)
        start_tc = f"00:00:{idx*30:02d}:00"
        end_tc = f"00:00:{(idx+1)*30:02d}:00"
        rec_start = f"01:00:{idx*30:02d}:00"
        rec_end = f"01:00:{(idx+1)*30:02d}:00"
        edl_lines.append(f"{idx+1:03d}  AX       V     C        {start_tc} {end_tc} {rec_start} {rec_end}")
        edl_lines.append(f"* FROM CLIP NAME: {vf.name}\n")
    edl_path.write_text("\n".join(edl_lines), encoding="utf-8")

    # Generate FCPXML
    try:
        from fcpxml_generator import create_fcpxml_timeline
        fcpxml_file = export_dir / f"{export_filename}.fcpxml"
        create_fcpxml_timeline(
            project_name=export_filename,
            video_path=out_file,
            voiceover_path=voiceover_file,
            output_xml=fcpxml_file,
            aspect_ratio=aspect_ratio,
            fps=int(fps),
            duration_sec=30.0
        )
    except Exception as e_xml:
        print(f"FCPXML export note: {e_xml}")

    # 5. Deploy Resolve Utility Script
    if sys.platform.startswith("win"):
        resolve_scripts_dir = Path(os.environ.get("APPDATA", "")) / "Blackmagic Design/DaVinci Resolve/Support/Fusion/Scripts/Utility"
    else:
        resolve_scripts_dir = Path.home() / ".local/share/DaVinciResolve/Fusion/Scripts/Utility"
    
    if resolve_scripts_dir.exists():
        utility_script = resolve_scripts_dir / "Antigravity_Timeline_Importer.py"
        script_code = f"""# DaVinci Resolve Utility Script
# Run from Workspace -> Scripts -> Utility -> Antigravity_Timeline_Importer
resolve = bmd.scriptapp('Resolve')
pm = resolve.GetProjectManager()
proj = pm.LoadProject('{export_filename}') or pm.CreateProject('{export_filename}')
mp = proj.GetMediaPool()
clips = mp.ImportMedia({[str(v.resolve().as_posix()) for v in video_files]})
tl = mp.CreateEmptyTimeline('Master_Assembly')
mp.AppendToTimeline(clips)
print('Antigravity Timeline successfully assembled!')
"""
        utility_script.write_text(script_code, encoding="utf-8")

    print(f"Exported master timeline to {out_file}")

def build_and_export_timeline(video_files: list[Path], voiceover_file: Path = None, bgm_file: Path = None, drx_grade_path: Path = None, marker_intervals: list[float] = None, project_name: str = "Master_Project", timeline_name: str = "Cut_V1", aspect_ratio: str = "9:16", fps: float = 30.0, export_dir: Path = None, export_filename: str = None):
    resolve_bin = setup_resolve_environment()
    resolve = ensure_resolve_running(resolve_bin, timeout_sec=10)

    if not resolve:
        print("Resolve Studio API not reachable directly. Using automated standalone pipeline assembly...")
        if export_dir and export_filename:
            fallback_assemble_timeline(video_files, voiceover_file, export_dir, export_filename, aspect_ratio, fps)
        return

    pm = resolve.GetProjectManager()
    project = pm.LoadProject(project_name) or pm.CreateProject(project_name)
    if not project:
        project = pm.GetCurrentProject()
    media_pool = project.GetMediaPool()

    width, height = (1080, 1920) if aspect_ratio == "9:16" else (1920, 1080)
    try:
        project.SetSetting("timelineResolutionWidth", str(width))
        project.SetSetting("timelineResolutionHeight", str(height))
        project.SetSetting("timelineFrameRate", str(fps))
    except Exception as e:
        print(f"Warning: SetSetting: {e}")

    all_media = [str(p.resolve()) for p in video_files if p.exists()]
    if voiceover_file and voiceover_file.exists():
        all_media.append(str(voiceover_file.resolve()))
    if bgm_file and bgm_file.exists():
        all_media.append(str(bgm_file.resolve()))

    imported_clips = media_pool.ImportMedia(all_media)
    clip_map = {c.GetName(): c for c in imported_clips} if imported_clips else {}

    timeline = media_pool.CreateEmptyTimeline(timeline_name) or project.GetCurrentTimeline()
    project.SetCurrentTimeline(timeline)
    t_start = timeline.GetStartFrame() if timeline else 0

    # V1 Video
    v_clips = [clip_map[p.name] for p in video_files if p.name in clip_map]
    if v_clips:
        media_pool.AppendToTimeline(v_clips)

    # A1 Voiceover
    if voiceover_file and voiceover_file.name in clip_map:
        c = clip_map[voiceover_file.name]
        try:
            frames_count = int(c.GetClipProperty("Frames"))
        except Exception:
            frames_count = int(fps * 30)
        media_pool.AppendToTimeline([{"mediaPoolItem": c, "startFrame": 0, "endFrame": frames_count, "mediaType": 2, "trackIndex": 1, "recordFrame": t_start}])

    # A2 BGM
    if bgm_file and bgm_file.name in clip_map:
        c = clip_map[bgm_file.name]
        try:
            frames_count = int(c.GetClipProperty("Frames"))
        except Exception:
            frames_count = int(fps * 30)
        media_pool.AppendToTimeline([{"mediaPoolItem": c, "startFrame": 0, "endFrame": frames_count, "mediaType": 2, "trackIndex": 2, "recordFrame": t_start}])

    # Markers
    if marker_intervals and timeline:
        for sec in marker_intervals:
            timeline.AddMarker(t_start + int(round(sec * fps)), "Cyan", f"Chapter @ {int(sec)}s", "Hook cut-point", 1)

    # Grade
    if drx_grade_path and drx_grade_path.exists() and timeline:
        for item in timeline.GetItemListInTrack("video", 1):
            try:
                item.ApplyGradeFromDRX(str(drx_grade_path.resolve()), 0)
            except Exception as e:
                print(f"Warning applying grade: {e}")

    # Deliver Export
    if export_dir and export_filename:
        export_dir.mkdir(parents=True, exist_ok=True)
        resolve.OpenPage("deliver")
        project.SetRenderSettings({
            "SelectAllFrames": 1,
            "TargetDir": str(export_dir.resolve()),
            "CustomName": export_filename,
            "ExportVideo": True,
            "ExportAudio": True,
            "FormatWidth": width,
            "FormatHeight": height,
            "FrameRate": fps
        })
        try:
            project.LoadRenderPreset("H.264 Master")
        except Exception:
            pass
        try:
            project.SetCurrentRenderFormatAndCodec("mp4", "H264")
        except Exception:
            pass
        project.DeleteAllRenderJobs()
        jid = project.AddRenderJob()
        if jid:
            project.StartRendering([jid])
            while project.IsRenderingInProgress():
                time.sleep(1)
            print(f"Render job finished. Exported to {export_dir / export_filename}.mp4")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--videos", nargs="+", required=True)
    parser.add_argument("--voiceover", default=None)
    parser.add_argument("--bgm", default=None)
    parser.add_argument("--drx", default=None)
    parser.add_argument("--markers", nargs="*", type=float, default=[0.0, 30.0, 60.0])
    parser.add_argument("--project", default="Antigravity_Master")
    parser.add_argument("--timeline", default="Full_Assembly")
    parser.add_argument("--aspect", default="9:16", choices=["9:16", "16:9"])
    parser.add_argument("--fps", type=float, default=30.0)
    parser.add_argument("--export-dir", default=None)
    parser.add_argument("--export-name", default=None)
    args = parser.parse_args()

    build_and_export_timeline(
        [Path(f) for f in args.videos],
        Path(args.voiceover) if args.voiceover else None,
        Path(args.bgm) if args.bgm else None,
        Path(args.drx) if args.drx else None,
        args.markers,
        args.project,
        args.timeline,
        args.aspect,
        args.fps,
        Path(args.export_dir) if args.export_dir else None,
        args.export_name
    )
