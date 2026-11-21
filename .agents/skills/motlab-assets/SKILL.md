---
name: motlab-assets
description: "Decompose brand assets (SVGs, logos, palettes, typography) into clean, high-performance HTML5 Canvas drawing routines for Motlab scenes."
---

# Motlab Assets: Brand & Graphic Decomposition

The `motlab-assets` skill teaches agents how to transform static assets into dynamic, frame-accurate canvas drawing code.

## 1. Converting SVGs to Canvas Path2D
Rather than embedding raster images or relying on DOM elements, Motlab converts vector SVG icons into native `Path2D` objects:

```javascript
// Pre-instantiate Path2D once outside renderAt
const serverIconPath = new Path2D("M4 4h16v4H4zm0 6h16v4H4zm0 6h16v4H4z");

window.renderAt = function(t) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "#38bdf8";
  ctx.fill(serverIconPath);
  ctx.restore();
};
```

## 2. Kinetic Spring Dynamics
Use damped spring math for bouncy UI elements without importing heavy animation packages:

```javascript
function spring(t, delay = 0, tension = 180, friction = 12) {
  const elapsed = Math.max(t - delay, 0);
  if (elapsed === 0) return 0;
  const omega = Math.sqrt(tension);
  const zeta = friction / (2 * omega);
  return 1 - Math.exp(-zeta * omega * elapsed) * Math.cos(omega * elapsed);
}
```

## 3. Kinetic Typography Highlighting
Draw dynamic, animated underline/glow behind words at specific audio word timestamps:

```javascript
function drawWordHighlight(ctx, x, y, width, height, t, startT, endT) {
  if (t < startT) return;
  const progress = Math.min((t - startT) / (endT - startT), 1);
  ctx.save();
  ctx.fillStyle = "rgba(99, 102, 241, 0.35)";
  ctx.fillRect(x, y, width * progress, height);
  ctx.restore();
}
```
