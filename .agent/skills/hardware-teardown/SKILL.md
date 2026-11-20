---
name: hardware-teardown
description: Branch Education style 3D hardware teardown engine. Orchestrates headless Blender Cycles/Eevee exploded assemblies, automated 3D-to-2D screen coordinate projection for Remotion HUD tracking, and procedural mechanical foley.
---

# 🔬 Branch Education 3D Hardware Teardown Engine

Inspired by **Branch Education's** iconic [*"What's Inside a Smartphone?"*](https://www.youtube.com/watch?v=fCS8jGc3log) teardown documentary, this skill enables automated creation of photorealistic 3D exploded hardware assemblies, microscopic silicon macro fly-throughs, and synchronized 2D vector HUD overlays.

---

## 1. Core Architecture

The teardown pipeline operates across a 3-tier hybrid workflow:

1. **3D Volumetric Stage (Blender & Three.js):**
   - **Headless Blender Engine (`scripts/blender_teardown.py`):** Automatically sets up studio three-point lighting, PBR materials (anodized titanium, Gorilla Glass, FR4 PCB, copper vias, silicon wafer gloss, and solder balls), and keyframes exploded layer separations and macro camera sweeps.
   - **Pure WebGL Remotion Fallback (`src/HardwareTeardownScene.tsx`):** If Blender is not installed on the host, Remotion renders the exploded 3D smartphone assembly in real-time WebGL via `@remotion/three`.
2. **Automated 3D-to-2D Matrix Projection:**
   - Projects 3D world coordinates $(X, Y, Z)$ of moving components into normalized 2D camera screen pixels $(x, y)$ frame-by-frame:
     $$\begin{pmatrix} x_{\text{screen}} \\ y_{\text{screen}} \\ z_{\text{depth}} \end{pmatrix} = \mathbf{P}_{\text{cam}} \times \mathbf{V}_{\text{lookAt}} \times \begin{pmatrix} X \\ Y \\ Z \end{pmatrix}$$
   - Generates `out/tracking/screen_coords.json`, allowing Remotion and GSAP to draw pixel-accurate dashed leader lines, anchor reticles, and specification cards with zero manual optical tracking.
3. **Dual-Layer Electrical Signal Flow:**
   - Physical 3D copper trace emission in Blender + 2D SVG pulsing data packets in Remotion visualizing memory fetches, CPU buses, and RF transmissions.
4. **Hardware Teardown Mechanical Foley:**
   - Procedural 48kHz audio foley (`metallic_unlatch.wav`, `glass_lift.wav`, `silicon_macro_riser.wav`, `data_packet_pulse.wav`) synchronized to visual detachment events and ducked under voiceover speech.
5. **DaVinci Resolve Multi-Track Spine:**
   - Exports `Hardware_Teardown_Resolve_Timeline.fcpxml` with Track V1 (3D Plate), Track V2 (Remotion HUD), Track A1 (Voiceover), Track A2 (Foley), and Track A3 (BGM).

---

## 2. CLI Usage

```powershell
# 1. Run complete automated hardware teardown pipeline (Blender tracking + Foley + FCPXML)
python .agent/skills/motion-pipeline/run.py --action teardown

# 2. Re-compute 3D-to-2D camera perspective tracking coordinates only
python scripts/blender_teardown.py --tracking-only

# 3. Generate hardware teardown mechanical foley stem
python scripts/sfx_designer.py --storyboard src/data/hardware_teardown_storyboard.json --out out/sfx/hardware_teardown_sfx.wav

# 4. Generate DaVinci Resolve FCPXML v1.10 timeline
python scripts/generate_hybrid_3d_fcpxml.py --teardown

# 5. Render Remotion WebGL master video (16:9 or 9:16)
npx remotion render src/index.ts Hardware-Teardown-16x9 out/master/Hardware_Teardown_16x9.mp4 --gl=angle
npx remotion render src/index.ts Hardware-Teardown-9x16 out/master/Hardware_Teardown_9x16.mp4 --gl=angle
```

---

## 3. Component Hierarchy & Exploded Z-Offsets

| Component Key | Hardware Element | PBR Shader Profile | Explode $Z$-Offset |
| :--- | :--- | :--- | :--- |
| `display_glass` | Ceramic Shield Glass | Glass transmission (0.9), Roughness (0.05) | $+160.0\text{ mm}$ |
| `display_panel` | 120Hz LTPO 2.0 OLED | Dark metallic obsidian, 0.15 roughness | $+125.0\text{ mm}$ |
| `seal_gasket` | IP68 Waterproof Gasket | Black synthetic elastomer | $+95.0\text{ mm}$ |
| `graphite_sheet` | Thermal Heat Spreader | Carbon matte film | $+70.0\text{ mm}$ |
| `motherboard` | 10-Layer FR4 Logic Board | High-density green/black PCB with gold vias | $+45.0\text{ mm}$ |
| `processor_die` | 3nm Silicon SoC | Specular mirror finish (0.95 metalness) | $+65.0\text{ mm}$ |
| `lpddr5_memory` | Unified 8GB LPDDR5X | Matte silicon IC package | $+62.0\text{ mm}$ |
| `camera_sensor` | 48MP Quad-Bayer CMOS | Optical glass lenses + brass barrel | $+85.0\text{ mm}$ |
| `battery_pack` | 4,422 mAh Li-Ion Cell | High-density brushed graphite/aluminum | $-35.0\text{ mm}$ |
| `wireless_coil` | Qi2 Induction Spiral | High-conductivity copper wire ($#C87D55$) | $-65.0\text{ mm}$ |
| `chassis_frame` | Grade 5 Titanium Chassis | Anodized metallic enclosure with antenna breaks | $-90.0\text{ mm}$ |
