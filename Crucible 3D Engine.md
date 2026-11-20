# Crucible 3D Engine — AI-Driven Visuals for DaVinci Resolve & Remotion
## Architectural Breakdown, Usefulness & Production Roadmap

> [!IMPORTANT]
> **What is Crucible?**
> **`codepawl/crucible`** is a specialized, lightweight WebGL2/WebGPU 3D rendering engine and path tracer designed specifically to be **driven programmatically by AI agents**. 
> Instead of manually operating Blender or coding thousands of lines of low-level Three.js boilerplate, an AI agent builds 3D scenes via **JSON Scene Recipes**, evaluates them through review grids, and renders out **1080p MP4 videos or transparent image sequences**.

---

## 1. Why Crucible is Useful for Your Motion Graphics Workflow

| Challenge in Traditional 3D Motion Graphics | How Crucible Solves It | Benefit for Your Workflow |
| :--- | :--- | :--- |
| **Blender is Heavy & Hard to Automate:** Blender is a ~500MB binary requiring complex Python `bpy` scripting that easily breaks in headless environments. | **Lightweight Node/NPM Engine:** Installs as an npm package (`@codepawlhq/crucible`), boots headlessly in seconds, and uses Chrome/Playwright GPU rasterization. | Automated, one-click 3D rendering directly from scripts without opening heavy software. |
| **Three.js in React (Remotion) is Verbose:** Writing Three.js shaders, lighting, and camera paths inside React requires hundreds of lines of code and high CPU/GPU overhead during Remotion preview bundling. | **Decoupled JSON Scene Recipes:** The 3D world is pure data (geometries, matrices, materials). The AI agent creates or adjusts JSON without touching React code. | Separates 3D rendering from 2D motion graphics. 3D renders once into high-speed video clips. |
| **AI "Blindness" in 3D Space:** AI models often hallucinate camera angles or create pitch-black scenes when writing 3D code blindly. | **Automated Review Grids & Inspection:** Crucible includes MCP inspection tools (`scene_look`, `scene_review`) that generate contact sheets to self-correct lighting and composition. | Guarantees broadcast-quality camera angles and lighting before final video export. |
| **DaVinci Resolve Needs B-Roll Plates:** DaVinci Resolve is an editing/grading powerhouse, but modeling 3D assets inside Fusion from scratch is slow. | **Direct MP4 & Alpha Channel Export:** Crucible renders hardware-accelerated H.264 MP4s or transparent stills that drop right onto **Track V1/V2** in Resolve. | Real-time timeline playback in Resolve with your newly built `.drfx` titles floating on Track V3! |

---

## 2. The 3 Custom Engineering 3D Scene Recipes

We have prepared 3 dedicated 3D scene recipes for The New Horizons Institute of Technology admission campaign:

### ⚙️ Recipe 1: Industrial Mechanical Gears (`mechanical_gears.json`)
* **Branch:** Mechanical Engineering (30 Approved Seats)
* **Visual Elements:**
  * Interlocking 3D spur gear train and drive shaft.
  * PBR Materials: Brushed industrial steel (`metallic: 0.9`, `roughness: 0.25`) with Industrial Orange accent teeth (`#FF9D32`).
  * Motion: Continuous rotational gear mesh with a slow cinematic dolly zoom.
* **Resolve Timeline Placement:** Drop on **Track V1** behind the `NHIT_Branch_Seats_Card` DRFX title.

### ⚡ Recipe 2: Electrical Transformer & Power Grid (`electrical_transformer.json`)
* **Branch:** Electrical Engineering (30 Approved Seats)
* **Visual Elements:**
  * High-voltage transformer core, ceramic insulator bushings, and copper busbars.
  * PBR Materials: Dark charcoal enamel with Electric Blue emissive pulse lines (`#087EFF`).
  * Motion: Sweeping camera arc with synchronized energy pulse cycles.
* **Resolve Timeline Placement:** Drop on **Track V1** behind the `NHIT_Branch_Seats_Card` DRFX title.

### 🎓 Recipe 3: Futuristic Holographic Diploma Badge (`holographic_diploma.json`)
* **Theme:** Working Professionals Qualification ("You Have the Experience. Now Get the Qualification.")
* **Visual Elements:**
  * 3D floating engineering seal badge with beveled golden laurels (`#FFB800`).
  * Orbiting concentric telemetry rings, depth particles, and blueprint grid floor.
  * Motion: 360° orbital camera rotation with subtle elevation floating.
* **Resolve Timeline Placement:** Drop on **Track V1/V2** during Scene 1 & Scene 7 behind the `NHIT_Main_Headline` and `NHIT_CTA_Helpline` DRFX titles.

---

## 3. End-to-End Hybrid Production Pipeline

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CRUCIBLE + REMOTION + DAVINCI RESOLVE                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  [Crucible Engine]                                                          │
│   • JSON Scene Recipe (Gears / Transformers / Hologram)                     │
│   • Headless GPU Render (H.264 MP4 / Transparent Stills)                    │
│          │                                                                  │
│          ├──► [Option A: Remotion]                                          │
│          │     • Load via <OffthreadVideo src={staticFile("gear_3d.mp4")}/> │
│          │     • Overlay 2D Kinetic SVG, countdown meters, ElevenLabs audio │
│          │                                                                  │
│          └──► [Option B: DaVinci Resolve Master Timeline]                   │
│                • Track V1: Crucible 3D B-Roll Plate (Rendered MP4)          │
│                • Track V2: Remotion Vector Reticles & Telemetry             │
│                • Track V3: Native NHIT_Admission_Kit.drfx Titles (Editable) │
│                • Track A1: ElevenLabs Master Audio WAV                      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Installed Packages & Next Steps

* Package installed: `@codepawlhq/crucible@0.21.0` in `node_modules/@codepawlhq/crucible`
* Output folders ready:
  * `out/crucible_jobs/` (Private render scratch store)
  * `assets/3d_broll/` (Export destination for 3D MP4s)
  * `src/crucible_scenes/` (Declarative JSON scene definitions)
