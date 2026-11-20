---
name: kinetic-typography-skills
description: "Kinetic typography & text animation skill (iart-ai pack). Staggered character/word reveals, active karaoke pop highlighting, semantic weight scaling, and beat-synced text blocks in Remotion and GSAP."
---

# ✍️ Kinetic Typography Skills (iart-ai Pack)

This skill governs **high-impact text motion, letter staggers, karaoke highlights, and typography hierarchy**.

---

## 🏆 Core Typography Rules

1. **Hierarchy of Visual Scale:**
   - **Hero Headline:** 56px–84px (16:9) / 64px–96px (9:16). Bold weight (700–900). Max 4–7 words.
   - **Subhead / Pill:** 24px–36px. Semi-bold (600). Uppercase tracking +0.08em.
   - **Body / Supporting:** 20px–28px. Regular (400–500) for effortless scanning.

2. **Staggered Word & Letter Reveals:**
   - Never fade an entire sentence at once. Reveal words or characters staggered by 1–2 frames (`0.03s – 0.06s`):
     - GSAP: `gsap.from(".word", { opacity: 0, y: 30, stagger: 0.04, ease: "power4.out" })`
     - Remotion: `const wordSpring = spring({ frame: frame - idx * 2, fps, ... })`

3. **Active Word Karaoke Highlighting:**
   - In social reels (9:16), maintain audience focus by illuminating the *currently spoken word* with a bright accent color (`#00F2FE` or `#FF9D32`) and a 1.08× scale pop, while past words remain readable and future words stay muted.

4. **Contrast & Scrim Law:**
   - Text rendered over video or 3D geometry must have either:
     - A dark scrim gradient (`linear-gradient(180deg, rgba(7,27,51,0.85), rgba(7,27,51,0.98))`).
     - A subtle text-shadow / glow (`text-shadow: 0 4px 20px rgba(0,0,0,0.8)`).
     - A dedicated frosted glass container card.

---

## 📐 GSAP / Remotion Pattern (Staggered Word Reveal)

```tsx
import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const StaggeredKineticTitle: React.FC<{ text: string; accentWord?: string }> = ({ text, accentWord }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ");

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", justifyContent: "center" }}>
      {words.map((word, idx) => {
        const s = spring({
          frame: frame - idx * 3, // 3-frame delay per word
          fps,
          config: { damping: 12, stiffness: 140, mass: 0.7 },
        });

        const y = interpolate(s, [0, 1], [40, 0]);
        const isAccent = accentWord && word.toLowerCase().includes(accentWord.toLowerCase());

        return (
          <span
            key={idx}
            style={{
              fontSize: "64px",
              fontWeight: 800,
              color: isAccent ? "#FF9D32" : "#FFFFFF",
              transform: `translateY(${y}px) scale(${Math.max(0, s)})`,
              opacity: s,
              display: "inline-block",
              textShadow: isAccent ? "0 0 25px rgba(255, 157, 50, 0.5)" : "0 4px 20px rgba(0,0,0,0.6)",
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};
```
