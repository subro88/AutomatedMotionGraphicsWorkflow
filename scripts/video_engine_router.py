#!/usr/bin/env python3
"""
Universal Multi-Genre Video Engine Router.
Dispatches video production to 4 specialized, production-grade engine paths:
  1. motion-graphics: Remotion + GSAP 3 physics, Swiss typography, paper grain, and animated charts.
  2. 3d-realistic: Headless Blender 4.2 Cycles GPU raytracing + editable .blend timeline + Remotion HUD.
  3. documentary: 2.5D Parallax (Ken Burns 2.0), vintage map routes, document highlighters, and Kurzgesagt puppets.
  4. podcast: Whisper multi-speaker layout switching, 60-band FFT reactive waveforms, and word-level captions.
"""
import argparse
import datetime
import json
import os
import shutil
import subprocess
import sys
import time
from pathlib import Path
from typing import Any, Dict, List, Optional

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

GENRE_MAP = {
    # 1. Motion Graphics
    "motion-graphics": "motion-graphics",
    "mograph": "motion-graphics",
    "adv": "motion-graphics",
    "flyer": "motion-graphics",
    "vox": "motion-graphics",
    "infographic": "motion-graphics",
    "nhit": "motion-graphics",
    "saas-launch": "motion-graphics",
    # 2. 3D Realistic Teardown
    "3d-realistic": "3d-realistic",
    "3d": "3d-realistic",
    "teardown": "3d-realistic",
    "hardware": "3d-realistic",
    "branch-education": "3d-realistic",
    # 3. Documentary & History & Cartoon
    "documentary": "documentary",
    "doc": "documentary",
    "history": "documentary",
    "cartoon": "documentary",
    "parallax": "documentary",
    "kurzgesagt": "documentary",
    "johnny-harris": "documentary",
    # 4. Podcast & Audiograms
    "podcast": "podcast",
    "audiogram": "podcast",
    "interview": "podcast",
    "vodcast": "podcast",
    "audio-video": "podcast"
}

def resolve_genre(raw_genre: str) -> str:
    """Normalizes any genre alias into one of the 4 canonical genre keys."""
    clean = raw_genre.strip().lower().replace("_", "-").replace(" ", "-")
    return GENRE_MAP.get(clean, "motion-graphics")

def run_step(cmd: List[str], label: str) -> None:
    """Executes a pipeline step and measures wall-clock duration."""
    print(f"\n▶️ [ROUTER: {label}] Running: {' '.join(cmd[:4])}...")
    t0 = time.time()
    res = subprocess.run(cmd, text=True)
    if res.returncode != 0:
        raise RuntimeError(f"Step '{label}' failed with exit code {res.returncode}")
    print(f"✓ [{label}] Completed in {time.time() - t0:.2f}s")

def route_and_execute(
    genre: str = "motion-graphics",
    project_name: str = "Production_Master",
    aspect_ratio: str = "16:9",
    storyboard: Optional[str] = None,
    audio: Optional[str] = None,
    text: Optional[str] = None,
    render_video: bool = False
) -> Dict[str, Any]:
    """Routes the production request to the appropriate genre pipeline."""
    canon_genre = resolve_genre(genre)
    npx_cmd = shutil.which("npx.cmd") or shutil.which("npx") or "npx"

    print("=" * 80)
    print(f"🎬 [VIDEO ENGINE ROUTER] INITIALIZING PIPELINE: {canon_genre.upper()}")
    print(f"   • Project Name : {project_name}")
    print(f"   • Aspect Ratio : {aspect_ratio}")
    print(f"   • Audio Source : {audio or 'Auto / Synthetic'}")
    print("=" * 80)

    results: Dict[str, Any] = {
        "genre": canon_genre,
        "project": project_name,
        "aspectRatio": aspect_ratio,
        "timestamp": datetime.datetime.now().isoformat(),
        "steps_completed": []
    }

    # ==========================================================================
    # ROUTE 1: MOTION GRAPHICS (Ads, Flyers, Vox, Infographics)
    # ==========================================================================
    if canon_genre == "motion-graphics":
        sb_file = Path(storyboard) if storyboard else (ROOT / "src/data/storyboard.json")
        comp = "NHIT-Infographic-16x9" if aspect_ratio == "16:9" else "NHIT-Infographic-9x16"
        out_v = ROOT / f"out/master/{project_name}_{aspect_ratio.replace(':', 'x')}.mp4"

        # 1. Synthesize SFX Stem
        sfx_wav = ROOT / "out/sfx/master_sfx.wav"
        run_step([
            sys.executable, "scripts/sfx_designer.py",
            "--storyboard", str(sb_file),
            "--out", str(sfx_wav)
        ], "Real SFX Motion Design")
        results["steps_completed"].append("sfx_designer")

        # 2. Render Remotion Motion Graphics Video (if requested)
        if render_video:
            out_v.parent.mkdir(parents=True, exist_ok=True)
            run_step([
                npx_cmd, "remotion", "render", "src/index.ts", comp,
                f"--output={out_v.as_posix()}", "--gl=angle"
            ], "Remotion 2D Motion Graphics Render")
            results["master_video"] = str(out_v)
            results["steps_completed"].append("remotion_render")

        # 3. Generate Resolve FCPXML
        run_step([sys.executable, "scripts/generate_hybrid_3d_fcpxml.py"], "DaVinci Resolve Hybrid FCPXML")
        results["steps_completed"].append("fcpxml")

    # ==========================================================================
    # ROUTE 2: 3D REALISTIC EXPLAINER (Branch Education Hardware Teardowns)
    # ==========================================================================
    elif canon_genre == "3d-realistic":
        sb_file = Path(storyboard) if storyboard else (ROOT / "src/data/hardware_teardown_storyboard.json")
        comp = "Hardware-Teardown-16x9" if aspect_ratio == "16:9" else "Hardware-Teardown-9x16"
        out_v = ROOT / f"out/master/{project_name}_teardown_{aspect_ratio.replace(':', 'x')}.mp4"

        # 0. Ensure Studio Asset Vault has production assets
        if not (ROOT / "assets/studio_vault/manifest.json").exists():
            run_step([sys.executable, "scripts/asset_ingest_pipeline.py", "--seed"], "Seed Studio Asset Vault")

        # 1. Generate Blender 4.2 Production Scene & 3D Tracking Matrix
        run_step([
            sys.executable, "scripts/blender_hardware_studio.py",
            "--storyboard", str(sb_file),
            "--mode", "multi-pass"
        ], "Blender Cycles GPU Teardown & 3D Tracking")
        results["steps_completed"].append("blender_cycles_studio")

        # 2. Synthesize Teardown Mechanical Foley
        sfx_wav = ROOT / "out/sfx/hardware_teardown_sfx.wav"
        run_step([
            sys.executable, "scripts/sfx_designer.py",
            "--storyboard", str(sb_file),
            "--out", str(sfx_wav)
        ], "Teardown Mechanical Foley Synthesis")
        results["steps_completed"].append("teardown_foley")

        # 3. Render WebGL / HUD Video Plate (if requested)
        if render_video:
            out_v.parent.mkdir(parents=True, exist_ok=True)
            run_step([
                npx_cmd, "remotion", "render", "src/index.ts", comp,
                f"--output={out_v.as_posix()}", "--gl=angle"
            ], "Remotion Vector HUD & WebGL Render")
            results["master_video"] = str(out_v)
            results["steps_completed"].append("remotion_teardown_render")

        # 4. Generate Hardware Teardown FCPXML Timeline
        run_step([sys.executable, "scripts/generate_hybrid_3d_fcpxml.py", "--teardown"], "DaVinci Resolve Teardown FCPXML")
        results["steps_completed"].append("fcpxml_teardown")

    # ==========================================================================
    # ROUTE 3: DOCUMENTARY, HISTORY & CARTOON ANIMATION
    # ==========================================================================
    elif canon_genre == "documentary":
        comp = "Documentary-16x9" if aspect_ratio == "16:9" else "Documentary-9x16"
        out_v = ROOT / f"out/master/{project_name}_documentary_{aspect_ratio.replace(':', 'x')}.mp4"

        # 1. Source Archival Media via Openverse
        run_step([
            sys.executable, "scripts/openverse_search.py",
            "--query", "historical archive vintage map",
            "--type", "image",
            "--aspect", "wide",
            "--limit", "3"
        ], "Openverse Archival Asset Sourcing")
        results["steps_completed"].append("openverse_archival")

        # 2. Generate Documentary Ambience & Film Projector Foley
        sfx_wav = ROOT / "out/sfx/documentary_sfx.wav"
        run_step([
            sys.executable, "scripts/sfx_designer.py",
            "--storyboard", "src/data/storyboard.json",
            "--out", str(sfx_wav)
        ], "Documentary Atmospheric Foley")
        results["steps_completed"].append("documentary_foley")

        # 3. Render Documentary Scene (if requested)
        if render_video:
            out_v.parent.mkdir(parents=True, exist_ok=True)
            run_step([
                npx_cmd, "remotion", "render", "src/index.ts", comp,
                f"--output={out_v.as_posix()}", "--gl=angle"
            ], "Remotion 2.5D Parallax & Map Render")
            results["master_video"] = str(out_v)
            results["steps_completed"].append("remotion_doc_render")

    # ==========================================================================
    # ROUTE 4: PODCAST, VODCAST & AUDIOGRAMS
    # ==========================================================================
    elif canon_genre == "podcast":
        audio_file = Path(audio).resolve() if audio else (ROOT / "inputs/test_voiceover.wav")
        comp = "Podcast-16x9" if aspect_ratio == "16:9" else "Podcast-9x16"
        out_v = ROOT / f"out/master/{project_name}_podcast_{aspect_ratio.replace(':', 'x')}.mp4"

        # 1. Extract 60-band Mel Spectrum & Audio Reactive Energy
        spectrum_file = ROOT / "src/data/spectrum.json"
        run_step([
            sys.executable, "scripts/extract_audio.py",
            "--audio", str(audio_file),
            "--out", str(spectrum_file)
        ], "Podcast Audio Spectrum Extraction")
        results["steps_completed"].append("audio_spectrum")

        # 2. Generate Beat Grid & Timeline Markers
        run_step([
            sys.executable, "scripts/beat_grid.py",
            "--audio", str(audio_file),
            "--bpm", "120",
            "--fps", "30"
        ], "Podcast Rhythm & Chapter Markers")
        results["steps_completed"].append("beat_grid")

        # 3. Render Podcast Audiogram (if requested)
        if render_video:
            out_v.parent.mkdir(parents=True, exist_ok=True)
            run_step([
                npx_cmd, "remotion", "render", "src/index.ts", comp,
                f"--output={out_v.as_posix()}", "--gl=angle"
            ], "Remotion Reactive Podcast Render")
            results["master_video"] = str(out_v)
            results["steps_completed"].append("remotion_podcast_render")

    print("\n" + "=" * 80)
    print(f"✨ [VIDEO ENGINE ROUTER] PIPELINE COMPLETED FOR: {canon_genre.upper()}")
    print(f"   • Steps Executed: {', '.join(results['steps_completed'])}")
    print("=" * 80)
    return results

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Universal Multi-Genre Video Engine Router")
    parser.add_argument("--genre", default="motion-graphics", help="Genre: motion-graphics, 3d-realistic, documentary, podcast")
    parser.add_argument("--project", default="Production_Master", help="Project name")
    parser.add_argument("--aspect", default="16:9", help="Aspect ratio (16:9 or 9:16)")
    parser.add_argument("--storyboard", default=None, help="Path to storyboard JSON")
    parser.add_argument("--audio", default=None, help="Path to input audio file")
    parser.add_argument("--text", default=None, help="Input script text")
    parser.add_argument("--render", action="store_true", help="Render final video MP4")
    args = parser.parse_args()

    route_and_execute(
        genre=args.genre,
        project_name=args.project,
        aspect_ratio=args.aspect,
        storyboard=args.storyboard,
        audio=args.audio,
        text=args.text,
        render_video=args.render
    )
