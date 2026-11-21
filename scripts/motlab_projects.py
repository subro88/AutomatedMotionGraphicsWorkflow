#!/usr/bin/env python3
"""
Motlab Unified Project Registry & Discovery Engine
===================================================
Automatically scans and catalogs all video projects, canvas scenes,
and review feedback logs across the entire motion graphics workstation.

Sources Scanned:
1. projects/* - Project directories with project.json and selection.json logs.
2. out/master/*.mp4 & out/*.mp4 - Rendered broadcast video deliverables.
3. scenes/*.html - Motlab Canvas 2D renderAt(t) scene files.

Usage:
  python scripts/motlab_projects.py --list
  python scripts/motlab_projects.py --json
  python scripts/motlab_projects.py --inspect <project_id>
  python scripts/motlab_projects.py --create <project_id> --name "Display Name" --genre canvas
"""

import os
import sys
import json
import argparse
from pathlib import Path
from datetime import datetime, timezone

WORKSPACE_ROOT = Path(__file__).resolve().parent.parent
PROJECTS_DIR = WORKSPACE_ROOT / "projects"
OUT_DIR = WORKSPACE_ROOT / "out"
SCENES_DIR = WORKSPACE_ROOT / "scenes"


def format_iso(ts: float) -> str:
    return datetime.fromtimestamp(ts, tz=timezone.utc).isoformat()


def detect_genre_from_name(name: str) -> str:
    lower = name.lower()
    if "canvas" in lower or "explainer" in lower:
        return "canvas"
    if "3d" in lower or "blade" in lower or "server" in lower:
        return "3d-realistic"
    if "anime" in lower or "toon" in lower or "manga" in lower:
        return "anime"
    if "podcast" in lower or "audiogram" in lower or "voice" in lower:
        return "podcast"
    if "doc" in lower or "history" in lower:
        return "documentary"
    return "motion-graphics"


def get_selection_counts(sel_path: Path) -> tuple[int, int]:
    """Returns (pending_count, resolved_count) from selection.json."""
    if not sel_path.exists():
        return 0, 0
    try:
        with open(sel_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            notes = data.get("annotations", [])
            pending = sum(1 for n in notes if n.get("status") == "pending")
            resolved = sum(1 for n in notes if n.get("status") == "resolved")
            return pending, resolved
    except Exception:
        return 0, 0


def discover_projects() -> list[dict]:
    """Scans projects/, out/, and scenes/ to produce a normalized project list."""
    registry = {}

    # 1. Scan projects/* directories
    if PROJECTS_DIR.exists():
        for d in PROJECTS_DIR.iterdir():
            if d.is_dir() and not d.name.startswith("."):
                pid = d.name
                sel_file = d / "selection.json"
                proj_json = d / "project.json"

                # Check if custom project.json exists
                display_name = pid.replace("_", " ").title()
                genre = detect_genre_from_name(pid)
                if proj_json.exists():
                    try:
                        with open(proj_json, "r", encoding="utf-8") as pf:
                            pj_data = json.load(pf)
                            display_name = pj_data.get("name", display_name)
                            genre = pj_data.get("genre", genre)
                    except Exception:
                        pass

                pending, resolved = get_selection_counts(sel_file)
                mtime = d.stat().st_mtime

                registry[pid] = {
                    "id": pid,
                    "name": display_name,
                    "genre": genre,
                    "source": "projects_dir",
                    "project_dir": str(d.relative_to(WORKSPACE_ROOT)).replace("\\", "/"),
                    "video_path": None,
                    "scene_path": None,
                    "selection_path": str(sel_file.relative_to(WORKSPACE_ROOT)).replace("\\", "/") if sel_file.exists() else None,
                    "video_size_mb": 0.0,
                    "pending_notes": pending,
                    "resolved_notes": resolved,
                    "mtime": mtime,
                    "last_modified": format_iso(mtime)
                }

    # 2. Scan out/master/ and out/ for rendered MP4s
    mp4_files = []
    if OUT_DIR.exists():
        for f in OUT_DIR.rglob("*.mp4"):
            if f.is_file() and not f.name.startswith("temp_"):
                mp4_files.append(f)

    for vid in mp4_files:
        vid_name = vid.stem
        # Clean up suffix tags like _16x9, _canvas, etc.
        base_id = vid_name.split("_canvas")[0].split("_16x9")[0].split("_9x16")[0].split("_resolve")[0]
        size_mb = round(vid.stat().st_size / (1024 * 1024), 2)
        rel_vid = str(vid.relative_to(WORKSPACE_ROOT)).replace("\\", "/")
        mtime = vid.stat().st_mtime

        matched_key = None
        for k in registry.keys():
            if k.lower() == base_id.lower() or base_id.lower().startswith(k.lower()):
                matched_key = k
                break

        if matched_key:
            # Associate video with existing project
            registry[matched_key]["video_path"] = rel_vid
            registry[matched_key]["video_size_mb"] = size_mb
            if mtime > registry[matched_key]["mtime"]:
                registry[matched_key]["mtime"] = mtime
                registry[matched_key]["last_modified"] = format_iso(mtime)
        else:
            # Create a standalone project entry for this video
            pending, resolved = 0, 0
            sel_file = PROJECTS_DIR / base_id / "selection.json"
            if sel_file.exists():
                pending, resolved = get_selection_counts(sel_file)

            registry[base_id] = {
                "id": base_id,
                "name": base_id.replace("_", " ").title(),
                "genre": detect_genre_from_name(vid_name),
                "source": "rendered_video",
                "project_dir": f"projects/{base_id}",
                "video_path": rel_vid,
                "scene_path": None,
                "selection_path": str(sel_file.relative_to(WORKSPACE_ROOT)).replace("\\", "/") if sel_file.exists() else None,
                "video_size_mb": size_mb,
                "pending_notes": pending,
                "resolved_notes": resolved,
                "mtime": mtime,
                "last_modified": format_iso(mtime)
            }

    # 3. Scan scenes/*.html for Motlab canvas scenes
    if SCENES_DIR.exists():
        for s in SCENES_DIR.glob("*.html"):
            s_name = s.stem
            rel_scene = str(s.relative_to(WORKSPACE_ROOT)).replace("\\", "/")
            mtime = s.stat().st_mtime

            matched_key = None
            for k in registry.keys():
                if k.lower() in s_name.lower() or s_name.lower().startswith(k.lower()):
                    matched_key = k
                    break

            if matched_key:
                registry[matched_key]["scene_path"] = rel_scene
            else:
                registry[s_name] = {
                    "id": s_name,
                    "name": s_name.replace("_", " ").title(),
                    "genre": "canvas",
                    "source": "canvas_scene",
                    "project_dir": f"projects/{s_name}",
                    "video_path": None,
                    "scene_path": rel_scene,
                    "selection_path": None,
                    "video_size_mb": 0.0,
                    "pending_notes": 0,
                    "resolved_notes": 0,
                    "mtime": mtime,
                    "last_modified": format_iso(mtime)
                }

    # Sort descending by last modified
    project_list = sorted(registry.values(), key=lambda p: p["mtime"], reverse=True)
    return project_list


def list_projects_cli():
    projects = discover_projects()

    print("\n" + "=" * 105)
    print(" 🎬 MOTLAB & WORKSTATION UNIFIED PROJECT REGISTRY")
    print("=" * 105)
    print(f" Total Discovered Projects: {len(projects)}")
    print("-" * 105)

    if not projects:
        print(" (No active projects discovered.)")
        print("=" * 105 + "\n")
        return

    header = f"{'ID':<24} | {'Name':<24} | {'Genre':<14} | {'Video Output':<20} | {'Notes':<10}"
    print(header)
    print("-" * 105)

    genre_icons = {
        "canvas": "⚡ canvas",
        "motion-graphics": "🎬 mograph",
        "3d-realistic": "🧊 3d",
        "anime": "⛩️ anime",
        "podcast": "🎙️ podcast",
        "documentary": "📜 doc"
    }

    for p in projects:
        g_str = genre_icons.get(p["genre"], p["genre"])
        vid_str = f"✅ {p['video_size_mb']} MB" if p["video_path"] else "⏳ None"
        notes_str = f"🟡 {p['pending_notes']} pend" if p["pending_notes"] > 0 else "🟢 0"

        print(f"{p['id'][:23]:<24} | {p['name'][:23]:<24} | {g_str:<14} | {vid_str:<20} | {notes_str}")

    print("=" * 105 + "\n")


def inspect_project_cli(project_id: str):
    projects = discover_projects()
    target = next((p for p in projects if p["id"].lower() == project_id.lower()), None)

    if not target:
        print(f"\n❌ Error: Project '{project_id}' not found.")
        return

    print("\n" + "=" * 70)
    print(f" 🔍 PROJECT INSPECTION: {target['name']} ({target['id']})")
    print("=" * 70)
    for k, v in target.items():
        if k != "mtime":
            print(f"  {k:<16}: {v}")
    print("=" * 70 + "\n")


def create_project(project_id: str, name: str = None, genre: str = "canvas"):
    pid = project_id.strip().lower().replace(" ", "_")
    pdir = PROJECTS_DIR / pid
    pdir.mkdir(parents=True, exist_ok=True)

    manifest_file = pdir / "project.json"
    data = {
        "id": pid,
        "name": name or pid.replace("_", " ").title(),
        "genre": genre,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "scenes": [],
        "audio": []
    }
    with open(manifest_file, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

    sel_file = pdir / "selection.json"
    if not sel_file.exists():
        with open(sel_file, "w", encoding="utf-8") as sf:
            json.dump({
                "version": "1.0.0",
                "project": pid,
                "updated_at": datetime.now(timezone.utc).isoformat(),
                "annotations": []
            }, sf, indent=2)

    print(f"\n✅ Created Motlab project: {pid} in {pdir}")


def main():
    parser = argparse.ArgumentParser(description="Motlab Unified Project Registry & Discovery Engine")
    parser.add_argument("--list", action="store_true", help="List all discovered projects in a formatted table")
    parser.add_argument("--json", action="store_true", help="Output all discovered projects as JSON")
    parser.add_argument("--inspect", type=str, help="Inspect detailed metadata of a specific project ID")
    parser.add_argument("--create", type=str, help="Scaffold a new project directory by ID")
    parser.add_argument("--name", type=str, help="Display name for new project")
    parser.add_argument("--genre", type=str, default="canvas", help="Genre for new project")

    args = parser.parse_args()

    if args.json:
        projects = discover_projects()
        # Clean mtime for clean JSON output
        clean_list = [{k: v for k, v in p.items() if k != "mtime"} for p in projects]
        print(json.dumps(clean_list, indent=2))
        return

    if args.inspect:
        inspect_project_cli(args.inspect)
        return

    if args.create:
        create_project(args.create, args.name, args.genre)
        return

    # Default to listing
    list_projects_cli()


if __name__ == "__main__":
    main()
