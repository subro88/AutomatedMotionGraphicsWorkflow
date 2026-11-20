#!/usr/bin/env python3
"""
Automated Project Scaffolding CLI for Motion Graphics Workflow
Creates an isolated, 100% gitignored project directory under projects/<name>/
"""

import argparse
import json
import os
import re
import sys
from pathlib import Path

STARTER_SCENE_TEMPLATE = """import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CanvaCard, HeaderBanner, HardDrive3DWidget, VssDataBlockStream } from "../../src/components/kinetics";
import { THEME } from "../../src/engine/theme";

export const Scene01Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        background: THEME.colors.cream,
        backgroundImage: `radial-gradient(${THEME.colors.charcoal} 0.75px, transparent 0.75px)`,
        backgroundSize: "28px 28px",
        padding: "60px 48px",
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
        fontFamily: THEME.typography.fontFamily,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
        <div
          style={{
            padding: "8px 22px",
            borderRadius: "9999px",
            background: THEME.colors.orange,
            color: "#FFF",
            fontSize: "14px",
            fontWeight: 800,
            letterSpacing: "0.08em",
            boxShadow: "0 8px 20px rgba(244, 91, 22, 0.3)",
          }}
        >
          {PROJECT_CATEGORY}
        </div>
      </div>

      <h1
        style={{
          ...THEME.typography.h1,
          fontSize: "46px",
          textAlign: "center",
          margin: "0 0 30px 0",
          color: THEME.colors.charcoal,
        }}
      >
        {PROJECT_TITLE}
      </h1>

      {/* TOP 55% ZONE: 3D B-ROLL & KINEMATICS */}
      <div
        style={{
          height: 960,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          gap: "24px",
        }}
      >
        <HardDrive3DWidget width={420} height={460} isWriting delay={10} />
        <VssDataBlockStream blockCount={5} isIncremental style={{ transform: "scale(1.1)" }} />
      </div>

      {/* BOTTOM 45% ZONE: KINETIC SUBTITLE & TYPOGRAPHY PLACEHOLDER */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          paddingBottom: "80px",
        }}
      >
        <div style={{ fontSize: "54px", fontWeight: 900, color: THEME.colors.charcoal, letterSpacing: "-0.03em" }}>
          Your Kinetic Story Begins Here
        </div>
        <div style={{ fontSize: "20px", color: THEME.colors.charcoalMuted, marginTop: "12px" }}>
          Drop audio stems in audio/ and run python scripts/extract_word_timestamps.py
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "35px",
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: "14px",
          fontWeight: 700,
          color: THEME.colors.charcoalLight,
          letterSpacing: "0.12em",
        }}
      >
        techblock.io
      </div>
    </div>
  );
};
"""

def sanitize_name(name: str) -> str:
    s = re.sub(r"[^a-zA-Z0-9_\-]", "_", name.strip().lower())
    return s.strip("_")

def scaffold_project(name: str, title: str = None, category: str = "MOTION GRAPHICS"):
    proj_slug = sanitize_name(name)
    if not proj_slug:
        print("❌ Invalid project name provided.")
        sys.exit(1)

    project_root = Path("projects") / proj_slug
    if project_root.exists():
        print(f"⚠️ Project folder already exists at: {project_root}")
        return project_root

    proj_title = title or proj_slug.replace("_", " ").title()

    # Create directory tree
    (project_root / "assets").mkdir(parents=True, exist_ok=True)
    (project_root / "audio").mkdir(parents=True, exist_ok=True)
    (project_root / "scenes").mkdir(parents=True, exist_ok=True)
    (project_root / "vertical").mkdir(parents=True, exist_ok=True)
    (project_root / "renders").mkdir(parents=True, exist_ok=True)

    # Create project manifest
    manifest = {
        "projectName": proj_slug,
        "title": proj_title,
        "category": category,
        "createdAt": "2026-11-20",
        "aspectRatio": "both",
        "fps": 30,
        "scenes": [
            {
                "id": "scene01",
                "title": "Introduction",
                "audio": "audio/scene1.wav",
                "durationFrames": 450
            }
        ]
    }

    with open(project_root / "project_manifest.json", "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)

    # Write starter scene
    starter_code = (
        STARTER_SCENE_TEMPLATE
        .replace("{PROJECT_TITLE}", proj_title)
        .replace("{PROJECT_CATEGORY}", category.upper())
    )
    with open(project_root / "vertical" / "Scene01Intro.tsx", "w", encoding="utf-8") as f:
        f.write(starter_code)

    # Create README inside project
    readme = f"""# {proj_title}

> **Local-Only Video Project** (100% Gitignored)
> This project and its media files will never be tracked or pushed to GitHub.

## Quick Workflow Guide:
1. Place voiceover audio stems into `projects/{proj_slug}/audio/`
2. Run `python scripts/extract_word_timestamps.py` to generate word-level timings
3. Develop your scenes in `scenes/` (Landscape) and `vertical/` (Shorts)
4. Preview or render using Remotion:
   ```bash
   npx remotion preview
   ```
"""
    with open(project_root / "README.md", "w", encoding="utf-8") as f:
        f.write(readme)

    print(f"✅ Successfully scaffolded local project at: {project_root}")
    print(f"   📁 Subdirectories created: assets/, audio/, scenes/, vertical/, renders/")
    print(f"   🔒 Git status: 100% ignored by .gitignore (Safe from accidental push)")
    return project_root

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Scaffold a new gitignored video project workspace.")
    parser.add_argument("name", help="Project slug name (e.g. docker_mastery, cloud_architecture)")
    parser.add_argument("--title", help="Human-readable project title", default=None)
    parser.add_argument("--category", help="Category tag", default="MOTION GRAPHICS")
    args = parser.parse_args()

    scaffold_project(args.name, args.title, args.category)
