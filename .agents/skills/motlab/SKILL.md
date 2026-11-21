---
name: motlab
description: "Video-as-Code engine: build deterministic, canvas-based motion graphics and explainer scenes with renderAt(t), review with the frame-accurate web viewer, and render via WebCodecs."
---

# Motlab: Video as Code Skill

Motlab enables coding agents to programmatically create, review, and render pixel-perfect motion graphics, product advertisements, explainers, and UI walkthroughs using HTML5 Canvas and mathematical time functions (`renderAt(t)`).

## Core Philosophy: Zero Generative Slop

Unlike AI video diffusion models (Sora, Runway, Kling), Motlab relies 100% on **deterministic code**:
- Mathematical easing curves, springs, and vector transformations.
- 100% reproducible at any framerate (24, 30, 60, 120 FPS).
- Pixel-perfect typography, brand palettes, and SVG path morphing.

---

## 1. Scene File Specification

Every scene is a self-contained HTML page containing a `<canvas id="c">` and a global deterministic `renderAt(t)` function where `t` is elapsed time in seconds.

### Minimum Scene Template
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body, html { margin: 0; padding: 0; overflow: hidden; background: #0a0b10; }
    canvas { width: 1920px; height: 1080px; display: block; }
  </style>
</head>
<body>
  <canvas id="c" width="1920" height="1080"></canvas>
  <script>
    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d');

    // Deterministic render function evaluated at timestamp t (in seconds)
    window.renderAt = function(t) {
      ctx.clearRect(0, 0, 1920, 1080);

      // Example: Eased kinetic card entering from frame 0 to 1.2s
      const p = Math.min(Math.max(t / 1.2, 0), 1);
      const ease = 1 - Math.pow(1 - p, 4); // Quartic ease out

      ctx.save();
      ctx.translate(960, 540);
      ctx.scale(ease, ease);
      ctx.globalAlpha = ease;

      // Draw Card
      ctx.fillStyle = '#1e1b4b';
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(-250, -120, 500, 240, 24);
      ctx.fill();
      ctx.stroke();

      // Draw Title
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Deterministic Video as Code', 0, 12);
      ctx.restore();
    };

    window.SCENE_META = {
      duration: 5.0,
      fps: 60,
      width: 1920,
      height: 1080
    };
  </script>
</body>
</html>
```

---

## 2. Review Viewer & Spatial Feedback (`selection.json`)

Motlab includes an interactive, frame-accurate web viewer. When directors or users review a video:
1. They scrub frame-by-frame with `<` and `>` arrow keys.
2. They drag a bounding box over any visual element on screen.
3. They enter a feedback note (e.g. *"Make title font 20% larger and glow neon cyan"*).
4. The viewer saves this into `projects/<project>/selection.json`.

### Working with `selection.json`
When the user says "review feedback" or runs `python scripts/motlab_reviewer.py --apply`:
- Read `projects/<project>/selection.json`.
- Inspect the `bbox` coordinates $(x, y, w, h)$, the `timestamp`, and the `comment`.
- Pinpoint which element in the scene corresponds to that spatial region and timestamp.
- Surgically apply the requested code change.

---

## 3. Workstation CLI Commands

```powershell
# 1. Launch Universal Review Viewer on any rendered MP4
python scripts/motlab_reviewer.py --video out/master/video.mp4 --project "MyProject"

# 2. Watch for real-time visual notes from the user
python scripts/motlab_reviewer.py --project "MyProject" --watch

# 3. Apply pending feedback notes from selection.json
python scripts/motlab_reviewer.py --project "MyProject" --apply

# 4. Render a Motlab Canvas scene to high-framerate MP4
python scripts/motlab_renderer.py --scene scenes/Scene01.html --out out/scene01.mp4 --fps 60

# 5. Route via Video Engine Router
python scripts/video_engine_router.py --genre canvas --script inputs/explainer.md --project "CanvasAd" --review
```
