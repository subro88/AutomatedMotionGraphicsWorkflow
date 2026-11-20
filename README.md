# Automated Motion Graphics & DaVinci Resolve Workstation

A zero-touch, automated media production pipeline powered by **[Remotion](https://www.remotion.dev/)**, **[Crucible 3D Engine](https://github.com/codepawl/crucible)**, **Anime.js**, **Faster-Whisper**, **Voicebox**, and **Blackmagic DaVinci Resolve**. Transforms plain text scripts and raw audio into kinetic motion graphics, corporate slide decks, 3D spatial scenes, infographics, vertical Shorts with bouncing karaoke subtitles, and multi-track Resolve timelines.

---

## ⚡ 1-Click Windows Launchers

- **`launch_app.bat`:** Double-click to launch the **Unified Desktop Studio GUI Application** (`app.py`) featuring Voice Box studio, visual storyboard manager, Remotion controls, karaoke subtitle burner, and DaVinci Resolve exporter in one window.
- **`launch_remotion_studio.bat`:** Double-click to launch the official **Remotion Studio** on `http://localhost:3000` with frame-by-frame scrubbing, live animation preview, and prop inspection.
- **`launch_crucible_mcp.bat`:** Double-click to start the persistent **Crucible MCP Server** (v0.21.0) on stdio for AI coding assistants (Claude Code, Antigravity, Cursor) to construct and inspect 3D scenes.
- **`render_3d_broll.bat`:** Double-click to automatically re-render all 3D engineering scene recipes into high-resolution visual plates in `out/crucible_renders/` and `public/3d_broll/`.
- **`run_qa_receipt.bat`:** Double-click to run automated broadcast safe-area verification, EBU R128 audio loudness checks, and cryptographic provenance receipt generation.
- **`launch_voicebox.bat`:** Double-click to launch the standalone **Voice Box Quick Studio** (Indian English, Bengali, Hindi, Kokoro-82M offline neural TTS).
- **`launch_official_voicebox.bat`:** Double-click to install or launch the official **Voicebox Desktop App** (voicebox.sh by Jamie Pine, with Jarvis, Samuel L. Jackson, Morgan Freeman, and local Qwen 1.7B voice cloning).
- **`run_pipeline.bat`:** Double-click to run the entire pipeline end-to-end with zero setup.

---

## 📖 Interactive HTML User Guide

The complete interactive User Guide with high-resolution visual screenshots, flowcharts, CLI references, and architecture breakdown is available at:
👉 **[`docs/workflow_user_guide.html`](docs/workflow_user_guide.html)** (or [`docs/index.html`](docs/index.html))

Live Execution Dashboard:
👉 **[`docs/dashboard.html`](docs/dashboard.html)** (SQLite-backed phase latency metrics)

---

## 🛠 Pipeline Architecture

1. **Phase 0 — Voice Box Speech Synthesis (`scripts/voicebox.py`):** Neural voice generation (Edge-TTS, Kokoro-82M offline, ElevenLabs) with EBU R128 loudness normalization and voice profile cloning support (`assets/voices/`).
2. **Phase 1 — Mel Spectral Ingestion (`scripts/extract_audio.py`):** Computes frame-accurate Mel filterbanks and energy across 24 frequency bands.
3. **Phase 2 — Remotion & GSAP Motion Engine (`src/Root.tsx`):**
   - `GsapMotion-16x9` & `GsapMotion-9x16`: HyperFrames-inspired deterministic GSAP 3.15 timeline with staggered character reveals, SVG circuit tracing, and blueprint reticles.
   - `Master-16x9` & `Master-9x16`: Audio-reactive radial spectrum with Anime.js geometric morphing.
   - `NHIT-Infographic-16x9` & `NHIT-Infographic-9x16`: 84.7s high-impact admission campaign matching ElevenLabs audio.
   - `MultiSceneDeck-16x9` & `MultiSceneDeck-9x16`: Sequenced kinetic graphics, corporate slides, and infographics.
   - `ThreeCore`, `ThreeBars`, `ThreeHologram`: WebGL 3D spatial graphics via `@remotion/three` & Three.js.
4. **Phase 3 — Shorts Slicing (`scripts/slice_shorts.py`):** Slices video into 30-second vertical reels with 1.0s audio tail fades using NVIDIA NVENC.
5. **Phase 4 — Whisper Karaoke Subtitles (`scripts/whisper_karaoke.py`):** Word-level millisecond timestamps via Faster-Whisper, generating bouncing karaoke styles burned via FFmpeg `libass`.
6. **Phase 5 — Crucible 3D AI-Driven B-Roll Engine (`scripts/render_crucible_scenes.mjs`):**
   - `@codepawlhq/crucible` WebGL2 & GPU path-tracing engine.
   - Declarative JSON scene recipes (`src/crucible_scenes/`):
     - `mechanical_gears.json`: Interlocking 3D gears with Industrial Orange accents.
     - `electrical_transformer.json`: High-voltage transformer with Electric Blue glow.
     - `holographic_diploma.json`: Floating engineering degree seal badge with gold bevels.
7. **Phase 6 — Fusion Template Packaging (`scripts/build_nhit_drfx.py`):** Packages 4 native, interactive `.drfx` macro titles directly installed into DaVinci Resolve's Fusion Support directory (`NHIT_Admission_Kit.drfx`):
   - `NHIT_Main_Headline`: Hero hook and institution subtitle.
   - `NHIT_Branch_Seats_Card`: 2-Column Electrical & Mechanical 30-seat split.
   - `NHIT_Eligibility_Badge`: 4-Tier qualification and 1-year work experience criteria.
   - `NHIT_CTA_Helpline`: Admissions Open banner, phone (`+91 98005 71423`), and URL.
8. **Phase 7 — Multi-Track Resolve Assembly (`scripts/generate_hybrid_3d_fcpxml.py`):** Assembles Track V1 (Crucible 3D Plates), Track V2 (Remotion 2D Infographics), Track V3 (Native DRFX Titles), and Track A1 (ElevenLabs Master Voiceover).
9. **Phase 8 — Automated QA Safe-Area & Audio Validator (`scripts/qa_validator.py`):**
   - EBU R128 / ITU-R BS.1770-4 loudness verification (-16.0 LUFS target, <= -1.0 dBTP true peak, <= 14.0 LU loudness range).
   - SMPTE ST 2046-1 safe-area boundary check (90% Action Safe, 80% Title Safe).
   - Social UI Danger Zone clearance for 9:16 vertical reels (Top 15% header & Bottom 20% captions).
   - Annotated diagnostic visual plates (`out/qa_reports/*_safe_area.png`).
10. **Phase 9 — Production Execution Receipt & Provenance Ledger (`scripts/receipt_generator.py`):**
   - Cryptographic SHA-256 fingerprints of master video, input audio, and storyboard assets.
   - Design tokens provenance (Deep Navy `#071B33`, Electric Blue `#087EFF`, Industrial Orange `#FF9D32`, Montserrat & Inter fonts).
   - Host and toolchain audit trail (Git commit SHA, Remotion, FFmpeg, Python, Node).
   - Dual-format output: Human-readable Markdown (`out/receipts/*_receipt.md`) and CI/CD JSON schema (`out/receipts/*_receipt.json`).
11. **Phase 10 — AI Motion Video Director & Production Recipes (`.agent/skills/motion-video-director/`):**
   - Workstation preflight verification (`python .agent/skills/motion-video-director/scripts/preflight.py`).
   - 5 industry-proven production recipes:
     - `saas-launch`: Slack-style (16:9, Intensity 2–3, monospace decode, glass dock, tilted 3D cards).
     - `caption-reel`: Premium Talking-Head Reel (9:16, Intensity 3–4, 1–3 words kinetic, rolling counters, arc proof badges).
     - `documentary`: Cinematic Storyteller Documentary (16:9, Intensity 5, 1.5s cuts, torn-paper, chunky 3D extruded type, hyperspace tunnel).
     - `brand-promo`: Brand-Agency Kinetic Promo (16:9, Intensity 4, 96 BPM eighths, card snake, 4x2 grid explosion, Y-flip contrast cuts).
     - `nhit-admission`: Technical Admission Campaign (16:9 & 9:16, Intensity 3–4, blueprint grid, circuit trace, Crucible 3D gears/transformers).
   - Integrated directly into Desktop Studio (`app.py` Tab 2) and autonomous storyboard generator (`scripts/storyboard_generator.py`).
12. **Phase 11 — Motion AI Kit & MotionScore Performance Doctor (`.agent/skills/motion-ai/`):**
   - Official Motion (formerly Framer Motion) animation best-practices, spring physics, and anti-layout-thrashing rules.
   - Automated **MotionScore Performance Doctor** (`scripts/motion_auditor.py`) grading code from S to F.
   - GPU-accelerated web spring animations integrated into `docs/dashboard.html` and `scripts/storyboard_gui.py`.
13. **Phase 12 — iart-ai Motion Skills Suite & Visual Contact Sheet Verifier (`.agent/skills/motion-skills/`):**
   - 19-pack motion design catalog across 6 production domains (Social, Data, Web, Typography, 3D, Commercial).
   - Dedicated curated guides for **Data Animation** (CSV-driven charts), **Kinetic Typography** (staggered word reveals), and **Video Ads** (3s hooks).
   - Automated **Deliver-and-Verify Visual Contact Sheet** generator (`scripts/contact_sheet.py`) creating 3x2 and 3x3 tiled diagnostic montages with safe-area overlays.
14. **Phase 13 — SkillsLLM Beat-Grid Synchronizer & Showreel Suite (`scripts/beat_grid.py`, `.agent/skills/motion-graphics-skills/`):**
   - Inspired by Charlie Hills / Mort1d's motion design framework on SkillsLLM.
   - Dual-mode musical pacing: Pure mathematical BPM subdivisions ($FramesPerBeat = FPS \times 60 / BPM$) and Pure NumPy audio transient detection via FFmpeg PCM streaming.
   - Dual-export: `src/data/beat_grid.json` for Remotion/GSAP components and `out/resolve_exports/beat_markers.edl` with DaVinci Resolve color markers (`ResolveColorBlue` for bar downbeats, `ResolveColorCyan` for beats, `ResolveColorOrange` for audio hits).
   - `showreel-launch` 60 FPS recipe: High-Contrast Agency Orange (`#FF5722`), Stark White (`#FFFFFF`), Electric Amber (`#FFB800`), Pure Black (`#0A0A0A`) with 5 signature archetypes.
15. **Phase 14 — Clipwing Real SFX Sound Design Engine (`scripts/sfx_designer.py`, `.agent/skills/real-sfx/`):**
   - Eliminates "silent motion graphics" through automated frame-accurate sound effects placement from storyboard visual cues.
   - 15 procedural 48kHz stereo WAV textures synthesized with zero-download pure NumPy in `assets/sfx/` (sub-booms, trailer impacts, UI bubble pops, air whips, industrial relay clicks).
   - Intelligent speech sidechain ducking (-4 dB attenuation during active voiceover dialogue).
   - Broadcast soft peak limiter (<= -1.0 dBFS) outputting master stem `out/sfx/master_sfx.wav`.
   - Automated FFmpeg master video muxing into `out/master/*_sfx_master.mp4`.
   - Embedded into DaVinci Resolve timelines as **Track A2: Real SFX** (`lane="-2"`).
16. **Phase 16 — WordPress Openverse Commercial Media Sourcing (`scripts/openverse_search.py`, `.agent/skills/openverse/`):**
   - Access to 800M+ Creative Commons assets via the official Openverse REST API.
   - Enforces strict Commercial-Safe policy (CC0, PDM, CC-BY only; excludes NC/ND).
   - Dual-media extraction: aspect-ratio matched B-Roll imagery (`assets/broll/`) + royalty-free background music (`assets/bgm/`).
   - DaVinci Resolve Fairlight 3-Stem setup: Track A1 Voiceover, Track A2 Real SFX, Track A3 Openverse BGM (`lane="-3"`).
   - Automated cryptographic legal attribution ledger (`out/openverse/attribution_ledger.md`) and provenance receipt integration.
17. **Phase 17 — Branch Education 3D Hardware Teardown & Tracking (`scripts/blender_teardown.py`, `src/HardwareTeardownScene.tsx`):**
   - Dual-engine 3D hardware pipeline: Headless Blender Cycles/Eevee photorealistic exploded plates + Remotion `@remotion/three` WebGL fallback.
   - Pinhole camera 3D-to-2D perspective projection (`out/tracking/screen_coords.json`) for sub-pixel Remotion HUD tracking.
   - Multi-layer electrical signal flows, mechanical foley audio design, and DaVinci Resolve FCPXML multi-track timeline assembly.
18. **Phase 18 — Universal Multi-Genre Production Video Router (`scripts/video_engine_router.py`):**
   - Dynamic routing across 4 production genre paths: Motion Graphics (Ads/Infographics), 3D Realistic (Branch Education Teardowns), Documentary/History (Vox/Kurzgesagt), and Podcasts/Audiograms.
   - Automated recipe validation and parameter synthesis.
19. **Phase 19 — Isolated Project Workspace & Git Discipline (`projects/*`, `scripts/new_project.py`):**
   - Dedicated, 100% gitignored `projects/<project_slug>/` workspaces for all topic/client video projects.
   - Strict separation: Git tracks only the core workflow engine (`src/components/`, `src/engine/`, `scripts/`), never heavy media, audio stems, or project instances.
   - One-command scaffolding CLI (`python scripts/new_project.py`) setting up modular `assets/`, `audio/`, `scenes/`, `vertical/`, and `renders/`.
   - Strict push discipline: Pushes to remote GitHub occur only upon explicit user command after major architectural milestones. Zero auto-pushes of video projects.
20. **Phase 20 — Kinetic Typography & Reusable 3D B-Roll Widgets (`src/components/kinetics/`, `src/engine/`):**
   - Punchy word-by-word active pop (2–4 words centered) inspired by modern high-velocity tech reels and Insiderforce aesthetic.
   - CPU-optimized Faster-Whisper extraction generating millisecond-accurate word boundaries (`subtitles.json` / `subtitles.ts`).
   - Dynamic keyword accents (`#F45B16`, `#2685D9`, `#10B981`, `#EF4444`) with elastic spring overshoots (1.15x) and muted upcoming text (`#A1A1AA`).
   - Reusable 3D B-Roll library: `HardDrive3DWidget` (SAS 15K 3000 RPM drive), `AeroDialog3DWidget` (Server 2008 R2 Aero Glass with cursor click), `CloudMigration3DWidget` (Server 2008 EOL to Azure particle flow), `VssDataBlockStream` (isometric delta data blocks), and `CanvaCard` (28px radius, multi-layer drop shadow).
   - Dual Delivery: 9:16 Vertical Shorts (`1080x1920`) + 16:9 Landscape Explainer (`1920x1080`) with 100/100 Grade S MotionScore.

---

## 📁 Video Projects & Git Discipline

All specific video projects, voiceover stems, raw footage, and rendered MP4s live strictly inside `projects/*` and are **100% ignored by Git**:

```
projects/
├── incremental_backup_2008/        <-- Full 10-scene explainer (9:16 Shorts + 16:9 Landscape)
│   ├── assets/                     <-- Original audio stems (1-9) & ref video
│   ├── scenes/                     <-- Landscape compositions
│   ├── vertical/                   <-- Vertical Shorts compositions
│   ├── subtitles.ts                <-- Faster-Whisper word sync
│   └── renders/                    <-- Rendered MP4s & contact sheets
└── <your_new_project>/             <-- Local-only workspace
```

---

## 🚀 CLI Usage

```bash
# 0. Scaffold a New Gitignored Local Video Project Workspace
python scripts/new_project.py my_new_video --title "My New Video Explainer" --category "TECH EXPLAINER"

# 0. Extract Frame-Accurate Word Timestamps via Faster-Whisper (CPU int8)
python scripts/extract_word_timestamps.py

# 1. Universal Multi-Genre Production Router
python .agent/skills/motion-pipeline/run.py --genre motion-graphics --project "BrandAd" --aspect 16:9
python .agent/skills/motion-pipeline/run.py --genre 3d-realistic --project "HardwareTeardown" --aspect 16:9
python .agent/skills/motion-pipeline/run.py --genre documentary --project "HistoricalDoc" --aspect 16:9
python .agent/skills/motion-pipeline/run.py --genre podcast --project "Episode42" --audio "inputs/test_voiceover.wav"

# 2. Branch Education 3D Hardware Teardown (Exploded Smartphone)
python .agent/skills/motion-pipeline/run.py --action teardown
npx remotion render src/index.ts Hardware-Teardown-16x9 out/master/Hardware_Teardown_16x9.mp4 --gl=angle
python scripts/generate_hybrid_3d_fcpxml.py --teardown

# 2. Search & Download Commercial-Safe Stock Media via Openverse
python scripts/openverse_search.py --query "engineering workshop" --type image --aspect wide --limit 3
python scripts/openverse_search.py --query "ambient corporate" --type audio --limit 1 --download
python scripts/openverse_search.py --storyboard src/data/storyboard.json

# 2. Synthesize Procedural Studio 48kHz SFX Audio Library
python scripts/sfx_library_builder.py

# 3. Design and Render Master SFX Audio Stem (with Speech Ducking)
python scripts/sfx_designer.py --storyboard src/data/storyboard.json --fps 30

# 4. Mux 3-Stem Audio (Voice + SFX + BGM) Directly into Master MP4
python scripts/sfx_designer.py --mux --video out/master/NHIT_Infographic_Admission_16x9.mp4

# 4. Generate Beat-Grid & DaVinci Resolve Color Markers (EDL)
python scripts/beat_grid.py --bpm 120 --fps 30 --duration 30
python scripts/beat_grid.py --audio inputs/multiscene_showcase_voicebox.wav --bpm 120 --fps 30

# 2. Generate 60 FPS Beat-Synced Showreel Storyboard
python scripts/storyboard_generator.py --recipe showreel-launch --duration 30

# 3. Generate 6-frame visual contact sheet for any composition
python scripts/contact_sheet.py --comp NHIT-Infographic-16x9 --frames 6
python scripts/contact_sheet.py --comp NHIT-Infographic-9x16 --frames 9

# 2. Audit animation performance & layout thrashing (MotionScore)
python scripts/motion_auditor.py

# 3. Audit workstation environment for motion director capabilities
python .agent/skills/motion-video-director/scripts/preflight.py

# 4. Auto-generate storyboard using any production recipe
python scripts/storyboard_generator.py --recipe saas-launch --duration 30
python scripts/storyboard_generator.py --recipe caption-reel --duration 20
python scripts/storyboard_generator.py --recipe documentary --duration 25
python scripts/storyboard_generator.py --recipe brand-promo --duration 15
python scripts/storyboard_generator.py --recipe nhit-admission --duration 30

# 5. Full multimodal pipeline from script text
python .agent/skills/motion-pipeline/run.py \
  --action run-all \
  --text "Your script text here..." \
  --voice tech \
  --project "MyFirstReel" \
  --aspect 9:16

# 4. Render Crucible 3D B-Roll scenes
python .agent/skills/motion-pipeline/run.py --action render-crucible

# 5. Build & Install NHIT Admission DRFX Pack into DaVinci Resolve
python .agent/skills/motion-pipeline/run.py --action build-nhit-drfx

# 6. Generate DaVinci Resolve Hybrid 3D Timeline
python .agent/skills/motion-pipeline/run.py --action hybrid-3d-resolve

# 7. Run Automated Broadcast Safe-Area & Audio QA Audit
python .agent/skills/motion-pipeline/run.py --action qa-check --video out/master/NHIT_Infographic_Admission_16x9.mp4

# 8. Generate Cryptographic Production Receipt & Ledger
python .agent/skills/motion-pipeline/run.py --action generate-receipt --video out/master/NHIT_Infographic_Admission_16x9.mp4
```
