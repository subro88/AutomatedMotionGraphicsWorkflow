---
name: motion-explainer-director
description: "Production-grade motion graphics and technical explainer director for Remotion and DaVinci Resolve. Governs continuous phrase-by-phrase spatial choreography, SVG asset decomposition, kinetic word-pop subtitles, and foolproof DaVinci Resolve timeline interchange (FCP7 XML, FCPXML, EDL)."
---

# Motion Explainer Director (`motion-explainer-director`)

The **Motion Explainer Director** skill orchestrates high-retention, high-fidelity technical explainer videos using **Remotion**, **Anime.js**, and **DaVinci Resolve**.

It bridges programmatic video-as-code with post-production editorial workflows, ensuring that every phrase of the voiceover triggers synchronized visual choreography while maintaining 100% deterministic timeline interchange with DaVinci Resolve.

---

## 1. Core Engineering Principles

### I. Continuous Spatial Choreography (Zero Static Slides)
- **The Rule:** An explainer must never feel like a PowerPoint presentation or a sequence of static Canva cards.
- **Phase Breakdown:** Every 30-50 second scene MUST be decomposed into 3 to 4 chronological narrative phases tied directly to voiceover timestamps:
  - **Phase 1 (Hook / Concept Intro):** Hero element enters center stage with bouncy spring physics (`damping: 14, stiffness: 85`).
  - **Phase 2 (Growth / Feature Explosion):** Supporting elements burst outward radially or in staggered grids with floating sine-wave inertia (`sin(frame * freq)`).
  - **Phase 3 (Conflict / Constraint Warning):** The layout shifts to highlight bottlenecks (pulsing red/amber glow, alert badges, shake/vibration).
  - **Phase 4 (Resolution / Spatial Morph):** Elements do NOT disappear abruptly; they translate and scale smoothly into anchor positions (e.g. `(0, 0) -> (-200, -180)` with scale `0.86`), opening visual space for the solution (e.g. Dedicated Hard Drive + Progressive Curved Spline).

### II. Canvas Saturation & Minimal Dead Space
- **The Rule:** A standard 1920x1080 (16:9) or 1080x1920 (9:16) frame must never feel empty or float a tiny card in a void.
- **Layering System:**
  1. **Background Layer:** Warm tinted canvas (`#FAF7F2` or `#0F172A`) with subtle radial dot grid (`radial-gradient(rgba(41,37,36,0.08) 1.2px, transparent 1.2px)`) on `28px` grid pitch.
  2. **Atmospheric Layer:** Floating micro-particles, subtle ambient gradient halos behind active components.
  3. **Visual Content Layer:** Large, crisp SVG vector hardware, interactive UI window mockups, and dynamic flow connections.
  4. **Kinetic Subtitle Layer:** Positioned in dedicated visual baseline (bottom 25% on 16:9; bottom 45% on 9:16) with high-contrast pill styling and active word scale pop.

### III. Vector SVG Asset Extraction & Precision ViewBox
- Never embed uncropped, bloated multi-icon SVG sheets directly.
- **Decomposition Process:**
  1. Inspect the source SVG artboard to identify component cluster coordinates.
  2. Compute exact bounding boxes with `12-16px` padding to prevent clipping strokes or dropshadows.
  3. Extract into reusable React components (`ComponentSvgIcon`, `ServerRackCard`, `HardDrivePlatterCard`).
  4. Ensure `viewBox` is explicitly declared so vectors scale infinitely without pixelation.

### IV. Kinetic Word-Pop Subtitles (Whisper Word Timestamps)
- Subtitles must be word-level synchronized with speech cadence:
  - **Active Word:** Scales up (`1.0 -> 1.14 -> 1.0`), tinted with vibrant brand highlight (`#F45B16` or `#38BDF8`), white text, subtle glow.
  - **Word Spacing:** MUST include trailing inline spacing (`marginRight: '0.28em'`) so words never cram or overlap.
  - **Responsive Layout:**
    - **16:9 Widescreen:** Centered bottom banner (`fontSize: 38-48px`), max width `1400px`, 1-2 lines maximum.
    - **9:16 Vertical:** Centered lower-half block (`fontSize: 44-52px`), max width `900px`, 2-3 lines with auto-scrolling line wrap.

---

## 2. DaVinci Resolve Interchange Architecture

When exporting timelines for DaVinci Resolve, follow strict XML compatibility rules to prevent blank video tracks, media offline errors, or corrupt sequences:

### I. The "Blank Video Track" Anti-Pattern & Prevention
```
❌ FATAL ANTI-PATTERN (Breaks Resolve FCPXML Parser):
   <asset-clip ref="r2" ...>
     <gap lane="1" offset="0s" duration="30s" />  <-- INVALID! Gap cannot be anchored inside asset-clip!
     <gap lane="1" offset="30s" duration="20s" /> <-- Creates opaque black generator covering V1!
   </asset-clip>
```
```
✔ CORRECT FCPXML SPECIFICATION:
   <asset-clip ref="r2" offset="0s" duration="349s" format="r1">
     <!-- All scene cuts positioned directly as clip markers -->
     <marker start="0/30s" duration="1/30s" value="[INFOGRAPHIC] Scene 1" color="yellow" />
     <marker start="914/30s" duration="1/30s" value="[CORPORATE] Scene 2" color="cyan" />
     <!-- Synchronous audio anchored cleanly -->
     <asset-clip ref="r3" offset="0s" duration="349s" lane="-1" />
   </asset-clip>
```

### II. Export Format Hierarchy for DaVinci Resolve
Always generate all three interchange formats using `scripts/resolve_multi_exporter.py`:
1. **FCP7 XML (XMEML v5) — Primary / Most Reliable:**
   - Native track-based XML with explicit `<video><track><clipitem>` and `<audio><track><clipitem>`.
   - Never suffers from Apple magnetic timeline lane translation bugs.
   - 100% deterministic in every DaVinci Resolve version on Windows and macOS.
2. **Clean FCPXML v1.10:**
   - Format must include `colorSpace="1-1-1 (Rec. 709)"`.
   - Video asset MUST include both `hasVideo="1"` and `hasAudio="1"` when pointing to MP4 files with embedded audio.
   - Zero invalid anchored gaps.
3. **CMX 3600 EDL:**
   - Frame-accurate non-drop-frame timecode cuts at every scene boundary for preconform workflows.

---

## 3. Code Implementation Patterns

### Pattern A: Multi-Phase Spatial Morph Component
```tsx
import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const MultiPhaseScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: Center Entrance (f: 0 -> 120)
  const heroEntrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  // Phase 2: Spatial Shift to Anchor Corner (f: 180 -> 240)
  const morphProgress = interpolate(frame, [180, 240], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const posX = interpolate(morphProgress, [0, 1], [0, -280]);
  const posY = interpolate(morphProgress, [0, 1], [0, -160]);
  const scale = interpolate(morphProgress, [0, 1], [1.0, 0.82]);

  // Phase 3: Secondary Element Arrival
  const secEntrance = spring({
    frame: frame - 220,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* Hero Unit with Continuous Morph */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) translate(${posX}px, ${posY}px) scale(${heroEntrance * scale})`,
        }}
      >
        <ServerCard />
      </div>

      {/* Secondary Destination Unit */}
      {frame >= 200 && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: `translate(-50%, -50%) translate(280px, 120px) scale(${secEntrance})`,
          }}
        >
          <StorageDiskCard />
        </div>
      )}
    </div>
  );
};
```

### Pattern B: Progressive Curved Spline Connection
```tsx
export const CurvedDataStream: React.FC<{ progress: number }> = ({ progress }) => {
  const pathD = "M 200 400 C 450 200, 750 600, 1000 400";
  const pathLength = 1000;
  const strokeOffset = pathLength * (1 - progress);

  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
      {/* Background Track */}
      <path d={pathD} fill="none" stroke="#E2E8F0" strokeWidth="4" strokeDasharray="8 8" />
      {/* Animated Glowing Signal */}
      <path
        d={pathD}
        fill="none"
        stroke="#F45B16"
        strokeWidth="6"
        strokeDasharray={pathLength}
        strokeDashoffset={strokeOffset}
        strokeLinecap="round"
        style={{ filter: "drop-shadow(0 0 12px rgba(244, 91, 22, 0.6))" }}
      />
    </svg>
  );
};
```

---

## 4. Polishing Roadmap: What Elevates Good to World-Class

When the user requests further polishing (`/grill`, "make it look like Kurzgesagt / Apple / Branch Education"), focus on these 5 dimensions:

1. **Easing Curve Exaggeration:**
   - Ditch standard ease-in-out. Use quartic/quintic anticipate-overshoot curves (`cubic-bezier(0.34, 1.56, 0.64, 1)`).
2. **Particle & Data Stream Fluidity:**
   - Add moving light pulses / traveling data packets with trailing alpha gradients along Bezier curves rather than just static stroke drawing.
3. **Pseudo-3D Isometric Tilt & Parallax:**
   - Add subtle CSS 3D transforms (`perspective(1200px) rotateX(12deg) rotateY(-8deg)`) with mouse/frame-driven parallax between foreground hardware and background grid.
4. **Interactive UI Window Life:**
   - Simulated realistic mouse pointer with smooth cubic spline motion, cursor clicking ripples (`scale(0.9) -> ring burst`), and dynamic window header buttons.
5. **Acoustic & Foley SFX Alignment:**
   - Every physical motion (card entrance, spline lock, switch toggle, error shake) must trigger an aligned foley stem (whoosh, click, mechanical relay, low-pass drone).
