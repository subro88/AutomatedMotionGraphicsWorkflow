---
name: motion-skills
description: "Open-source motion graphics & animation skill suite for AI agents (adapted from iart-ai/motion-skills). Features a 19-pack master catalog across 6 domains, deep-dive guides for Data Animation, Kinetic Typography, and Video Ads, and an automated Deliver-and-Verify visual contact sheet tool."
---

# 🎨 Motion Skills Suite (iart-ai Catalog)

The **Motion Skills Suite** (adapted from [`iart-ai/motion-skills`](https://github.com/iart-ai/motion-skills)) equips AI coding agents with expert knowledge to plan, code, animate, and verify motion graphics, data visualizations, commercial video ads, and social media content.

---

## 🏆 The "Deliver-and-Verify" Loop

The signature operating principle of `iart-ai/motion-skills` is **self-auditing before delivery**:
1. **Plan & Stage:** Deconstruct narrative into 2.0s–4.0s visual beats.
2. **Code & Animate:** Write frame-deterministic Remotion / GSAP / Three.js code.
3. **Render Contact Sheet:** Run `python scripts/contact_sheet.py --comp <Name>` to tile 6–9 milestone frames into a single image.
4. **Visual Self-Audit:** Inspect typography readability, contrast against background, element alignment, and safe-area margins.
5. **Final Render:** Only export full MP4 master once contact sheet passes inspection.

---

## 📚 19-Pack Master Motion Catalog

The catalog organizes 56+ motion skills across 6 core production domains:

### Domain 1: Social & Short-Form Video Packs
- **`tiktok-video-skills`**: Vertical (9:16) safe-area clearance (avoiding top 15% and bottom 20% UI chrome), high-retention 3-second visual hooks, rapid B-roll cuts.
- **`text-message-video-skills`**: Dynamic SMS / iMessage conversation bubble animations with typing indicators, audio pops, and avatar reactions.
- **`youtube-video-skills`**: Pacing structures for tech explainers, picture-in-picture commentary frames, lower-third cards, and subscribe end-screens.

### Domain 2: Data & Explainer Video Packs
- **`data-animation-skills`** *(Curated Deep-Dive: [data-animation/SKILL.md](data-animation/SKILL.md))*: Frame-accurate animated bar charts, racing rankings, donut percentages, and quantitative metrics driven directly from CSV/JSON.
- **`explainer-video-skills`**: Isometric 2.5D technology diagrams, architectural block diagrams, step-by-step feature walkthroughs.
- **`map-animation-skills`**: Vox-style animated geographic maps, route line traces, boundary highlights, and spatial camera zooms.

### Domain 3: Web & UI Animation Packs
- **`web-animation-skills`**: Frontend micro-interactions, GSAP timeline sequencing, SVG morphing, Lottie integration, and 60/120 FPS GPU transforms.
- **`motion-design-skills`**: Animation physics fundamentals: timing, overshoot, anticipation, easing curves, and visual weight.

### Domain 4: Typography & Craft Packs
- **`kinetic-typography-skills`** *(Curated Deep-Dive: [kinetic-typography/SKILL.md](kinetic-typography/SKILL.md))*: Active word-by-word karaoke highlights, semantic font weight scaling, staggered letter reveals, and rhythm-synced text cards.
- **`brand-motion-skills`**: Brand identity animations: logo reveals, secondary motion lines, color transitions, and design token enforcement.

### Domain 5: 3D, Shaders & Math Animation Packs
- **`webgl-animation-skills`**: Three.js 3D spatial scenes, particle cloud systems, and Crucible 3D PBR scene integrations.
- **`manim-skills`**: Programmatic mathematical animation (3Blue1Brown style) for geometric formulas, coordinate planes, and technical proofs.
- **`shader-animation-skills`**: GLSL fragment and vertex shaders for holographic glows, chromatic aberration, and audio-reactive waveforms.

### Domain 6: Commercial & Agency Packs
- **`ad-video-skills`** *(Curated Deep-Dive: [ad-video/SKILL.md](ad-video/SKILL.md))*: Commercial performance advertising frameworks: Problem-Agitate-Solution, proof badge cards, urgency timers, and multi-variant CTA loops.
- **`freelance-motion-skills`**: Client delivery specifications, review contact sheets, revision management, and multi-aspect ratio delivery (16:9, 9:16, 1:1).

---

## 🛠️ Workstation CLI Reference

```bash
# 1. Generate a 3x2 or 3x3 visual contact sheet for any Remotion composition
python scripts/contact_sheet.py --comp NHIT-Infographic-16x9 --frames 6
python scripts/contact_sheet.py --comp NHIT-Infographic-9x16 --frames 9 --safe-area

# 2. Generate contact sheet for GsapMotion
python scripts/contact_sheet.py --comp GsapMotion-16x9 --frames 6

# 3. Invoke via unified Antigravity motion pipeline runner
python .agent/skills/motion-pipeline/run.py --action contact-sheet --project NHIT-Infographic-16x9
```
