---
name: data-animation-skills
description: "Data animation & quantitative visualization skill (iart-ai pack). Principles and Remotion patterns for frame-accurate animated charts, racing bars, metric counters, and quantitative proof cards driven directly from CSV/JSON data with zero hallucination."
---

# 📊 Data Animation Skills (iart-ai Pack)

This skill provides rules, math, and code patterns for **frame-accurate, data-driven motion graphics**.

---

## 🏆 Core Data Animation Rules

1. **Zero Hallucinated Numbers:**
   - Visual charts, percentages, and bar graphs must be derived directly from structured data (`render_props.json`, `storyboard.json`, or CSV files).
   - Never hardcode static bar heights when animating comparisons; compute `height = (val / maxVal) * 100%`.

2. **Smooth Numeric Interpolation (`interpolate` / `spring`):**
   - Numbers rolling up must use Remotion's `interpolate()` or `spring()` with `Math.floor()` or fixed decimals to prevent decimal jitter:
     ```tsx
     const displayVal = Math.floor(
       interpolate(frame, [startFrame, startFrame + 30], [0, targetVal], {
         extrapolateLeft: "clamp",
         extrapolateRight: "clamp",
       })
     );
     ```

3. **Staggered Bar Introductions:**
   - Multi-bar charts should reveal sequentially from left to right or highest to lowest with a `0.1s – 0.15s` (3–5 frames at 30 FPS) stagger delay.

4. **Visual Anchoring:**
   - Always pair an animated number with a descriptive label below and a unit/symbol prefix or suffix (`+`, `%`, `₹`, `$`, `Seats`).

---

## 📐 Remotion Component Pattern (Animated Bar Chart)

```tsx
import React from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";

interface BarData {
  label: string;
  value: number;
}

export const AnimatedBarChart: React.FC<{ data: BarData[]; maxVal: number }> = ({ data, maxVal }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div style={{ display: "flex", gap: "24px", alignItems: "flex-end", height: "300px" }}>
      {data.map((item, idx) => {
        const barSpring = spring({
          frame: frame - idx * 5, // 5-frame stagger
          fps,
          config: { damping: 14, stiffness: 120, mass: 0.8 },
        });

        const heightPct = (item.value / maxVal) * 100 * Math.max(0, barSpring);

        return (
          <div key={idx} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span style={{ color: "#fff", fontWeight: "bold", marginBottom: "8px" }}>
              {Math.floor(item.value * Math.max(0, barSpring))}
            </span>
            <div
              style={{
                width: "100%",
                height: `${heightPct}%`,
                background: "linear-gradient(180deg, #087EFF, #071B33)",
                borderRadius: "8px 8px 0 0",
                boxShadow: "0 0 20px rgba(8, 126, 255, 0.4)",
              }}
            />
            <span style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "12px" }}>{item.label}</span>
          </div>
        );
      })}
    </div>
  );
};
```
