---
name: motion-ai
description: "Motion (formerly Framer Motion) AI developer toolkit & animation best-practices skill. Enforces GPU-accelerated 60/120 FPS transforms, anti-layout-thrashing rules, spring physics curves, modern 'motion/react' imports, and standalone Motion Vanilla JS patterns. Includes MotionScore performance doctor auditing."
---

# ⚡ Motion AI Kit & Animation Best Practices

This skill incorporates the official **Motion AI Kit** guidelines (from [motion.dev](https://motion.dev), created by Matt Perry). It guides AI coding agents to write production-grade web and UI animations with zero layout thrashing, modern syntax, and refined spring physics.

---

## 🏆 Golden Motion Rules

1. **Transform & Opacity Only (Never Layout Thrash):**
   - **Allowed for 60/120 FPS:** `transform` (`x`, `y`, `z`, `scale`, `scaleX`, `scaleY`, `rotate`), `opacity`, and `filter`.
   - **Forbidden in Transitions / Animations:** `width`, `height`, `top`, `left`, `right`, `bottom`, `margin`, `padding`. Animating these forces browser layout recalculation and paint cycles on every frame (jank).
   - If resizing an element is needed, use `scale` or Motion's automatic layout projection (`layout` prop in React).

2. **Modern Import Path:**
   - **Old / Deprecated:** `import { motion } from "framer-motion";`
   - **Modern React (v11/v12):** `import * as motion from "motion/react";` or `import { motion } from "motion/react";`
   - **Modern Vanilla JS / Web Components:** `import { animate, spring, stagger, inView } from "motion";`

3. **Deterministic Spring Physics:**
   - Prefer springs over duration-based cubic-beziers for natural, physical UI responses:
     - **Snappy UI Feedback (Buttons, Badges):** `stiffness: 300, damping: 25, mass: 0.6`
     - **Smooth Card Entrances (Modals, Shelves):** `stiffness: 140, damping: 18, mass: 0.8`
     - **Heavy Hero Reveals (Logo, Climax):** `stiffness: 90, damping: 15, mass: 1.2`

4. **Remotion vs. Web Motion Rule:**
   - **In Remotion Video Compositions:** Video frames must be 100% deterministic functions of `useCurrentFrame()`. Standard `<motion.div animate={...} />` uses browser `requestAnimationFrame` (wall-clock time) and **will glitch or drop frames during parallel headless rendering**. Use Remotion's `interpolate()`, `spring()`, or our deterministic `useGsapTimeline` hook for video.
   - **In Web Dashboards & HTML GUIs:** Motion's standalone library (`motion`) is the gold standard for high-performance interactive web UI.

---

## 🛠️ Modern Syntax Reference

### 1. Vanilla JavaScript (CDN or NPM `motion`)
```javascript
import { animate, spring, stagger } from "motion";

// Animate cards with spring and stagger
animate(
  ".card",
  { opacity: [0, 1], y: [24, 0], scale: [0.96, 1] },
  {
    delay: stagger(0.06),
    easing: spring({ stiffness: 150, damping: 18, mass: 0.8 })
  }
);
```

### 2. Standalone Browser CDN (No Build Step)
```html
<script src="https://cdn.jsdelivr.net/npm/motion@latest/dist/motion.js"></script>
<script>
  const { animate, spring, stagger } = Motion;

  animate(
    ".stat-card",
    { opacity: [0, 1], transform: ["translateY(20px)", "translateY(0)"] },
    { delay: stagger(0.05), duration: 0.6 }
  );
</script>
```

### 3. Modern React (`motion/react`)
```tsx
import * as motion from "motion/react";

export function HeroCard() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="card"
    >
      <h3>Motion Powered Card</h3>
    </motion.div>
  );
}
```

---

## 🩺 Performance Doctor (MotionScore)

Our workstation includes a built-in static audit script based on Motion AI Kit's Performance Doctor:

```bash
# Audit project files for layout thrashing and animation performance
python scripts/motion_auditor.py

# Audit specific directory or file
python scripts/motion_auditor.py --path docs/dashboard.html
python scripts/motion_auditor.py --path src/components/
```

### MotionScore Tiers:
- **Grade S (Flawless):** 100% GPU-accelerated transforms (`transform`, `opacity`), zero layout thrashing, proper spring damping.
- **Grade A (Excellent):** Clean transforms with non-critical color fades.
- **Grade B / C (Warning):** Layout properties (`top`, `left`, `width`, `height`) used in CSS transitions or keyframes.
- **Grade F (Critical):** Heavy layout thrashing detected in high-frequency animations.
