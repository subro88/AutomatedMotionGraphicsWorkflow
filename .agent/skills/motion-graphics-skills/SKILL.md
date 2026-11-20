---
name: motion-graphics-skills
description: "Showreel-grade motion graphics & beat-grid synchronization skill (adapted from Charlie Hills / Mort1d on SkillsLLM). Covers 60 FPS launch trailers, mathematical & audio transient beat-grid alignment, sub-frame motion blur emulation, and DaVinci Resolve marker generation."
---

# 🚀 Showreel & Beat-Grid Motion Graphics Skills

Adapted from **Charlie Hills / Mort1d** on [SkillsLLM](https://skillsllm.com/skill/motion-graphics-skills), this skill governs the creation of **high-energy showreels, launch trailers, and beat-synced motion graphics** generated entirely out of code.

---

## 🏆 Core Directing Principles

1. **The Beat Grid is the Timeline Backbone:**
   - Every major visual transition, camera whip, text pop, and card shuffle lands on an exact musical transient or downbeat.
   - A video running at 30 FPS with music at 120 BPM has 1 beat every 15 frames:
     $$\text{Frames Per Beat} = \frac{\text{FPS} \times 60}{\text{BPM}} = \frac{30 \times 60}{120} = 15.0 \text{ frames}$$
     - Quarter note ($1/4$): 15 frames
     - Eighth note ($1/8$): 7.5 frames (alternate 7 and 8)
     - Sixteenth note ($1/16$): 3.75 frames

2. **The 5-Beat Showreel Launch Structure:**
   - **Beat 1: The Cold Open / Logo Sting (0–3s):** High visual contrast, dramatic typography punch, sub-bass drop on frame 0.
   - **Beat 2: The Core Problem / Friction (3–8s):** Monochromatic tension, broken workflows, bold pain points.
   - **Beat 3: Rapid Feature Cascade (8–18s):** Beat-synced cuts every 0.5s–1.0s (eighth notes), staggered metric counters, UI cards.
   - **Beat 4: The Climax / Technical Moat (18–25s):** 3D spatial particle shockwave, Crucible 3D model reveal, peak music energy.
   - **Beat 5: Outro / Unmistakable CTA (25–30s):** High-octane brand mark, primary helpline / URL, glowing action badge.

3. **Sub-Frame Motion Blur Shutter:**
   - At 30 FPS or 60 FPS, rapid linear movement causes visual strobing unless motion blur is emulated.
   - Emulate camera shutter angle (180°) using velocity-based directional CSS blur:
     $$\text{Blur Px} = \min\left(16, \left|\frac{\Delta x}{\Delta t}\right| \times 0.15\right)$$
     Apply `filter: blur(${blurPx}px, 0px)` during high-speed transitions.

4. **High-Contrast Agency Aesthetics:**
   - Dominant Canvas: Pure Black (`#0A0A0A`).
   - Clean Structure: Stark White (`#FFFFFF`).
   - High-Velocity Accent: Vibrant Orange (`#FF5722`) and Electric Amber (`#FFB800`).

---

## 🎵 Beat-Grid Math Reference Table

| BPM | Beat Duration | 30 FPS (Quarter Note) | 30 FPS (Eighth Note) | 60 FPS (Quarter Note) | 60 FPS (Eighth Note) |
| :---: | :---: | :---: | :---: | :---: | :---: |
| **96 BPM** | 0.625s | 18.75 frames | ~9.4 frames | 37.5 frames | 18.75 frames |
| **110 BPM** | 0.545s | 16.36 frames | ~8.2 frames | 32.7 frames | 16.36 frames |
| **120 BPM** | 0.500s | **15.00 frames** | **7.5 frames** | **30.0 frames** | **15.0 frames** |
| **128 BPM** | 0.469s | 14.06 frames | ~7.0 frames | 28.1 frames | 14.06 frames |
| **140 BPM** | 0.428s | 12.85 frames | ~6.4 frames | 25.7 frames | 12.85 frames |

---

## 🛠️ Workstation CLI Reference

```bash
# 1. Calculate mathematical beat grid at 120 BPM for 30 FPS
python scripts/beat_grid.py --bpm 120 --fps 30 --duration 30

# 2. Extract real audio transient peaks from background music
python scripts/beat_grid.py --audio assets/audio/music.mp3 --fps 30

# 3. Export DaVinci Resolve timeline markers (.edl)
python scripts/beat_grid.py --bpm 128 --fps 30 --export-edl out/resolve_exports/beat_markers.edl

# 4. Generate high-octane Showreel Launch Promo storyboard
python scripts/storyboard_generator.py --recipe showreel-launch --duration 30
```
