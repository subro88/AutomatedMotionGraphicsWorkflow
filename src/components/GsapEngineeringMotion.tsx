import React from "react";
import { useGsapTimeline } from "../hooks/useGsapTimeline";
import { AbsoluteFill } from "remotion";

interface GsapEngineeringMotionProps {
  aspectRatio?: "16:9" | "9:16";
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  headline?: string;
  tagline?: string;
}

export const GsapEngineeringMotion: React.FC<GsapEngineeringMotionProps> = ({
  aspectRatio = "16:9",
  primaryColor = "#087EFF",
  secondaryColor = "#071B33",
  accentColor = "#FF9D32",
  headline = "YOU HAVE THE EXPERIENCE.",
  tagline = "NOW GET THE QUALIFICATION."
}) => {
  const isVertical = aspectRatio === "9:16";

  const containerRef = useGsapTimeline((tl, container) => {
    // 1. Initial State Setups
    tl.set(".gsap-bg-grid", { opacity: 0, scale: 0.95 });
    tl.set(".gsap-circuit-line", { strokeDashoffset: 1200, strokeDasharray: 1200 });
    tl.set(".gsap-badge-top", { y: -30, opacity: 0 });
    tl.set(".gsap-char", { y: 60, opacity: 0, rotateX: -45 });
    tl.set(".gsap-tagline", { scale: 0.85, opacity: 0 });
    tl.set(".gsap-card-left", { x: isVertical ? 0 : -80, y: isVertical ? 40 : 0, opacity: 0 });
    tl.set(".gsap-card-right", { x: isVertical ? 0 : 80, y: isVertical ? 40 : 0, opacity: 0 });
    tl.set(".gsap-footer-cta", { y: 30, opacity: 0 });
    tl.set(".gsap-reticle", { rotation: 0, opacity: 0, scale: 0.8 });

    // 2. Scene Timeline Sequencing
    // T = 0.0s -> 1.0s: Blueprint Grid & Rotating Reticle In
    tl.to(".gsap-bg-grid", { opacity: 0.35, scale: 1.0, duration: 1.0, ease: "power2.out" }, 0.0);
    tl.to(".gsap-reticle", { opacity: 0.45, scale: 1.0, duration: 1.2, ease: "back.out(1.5)" }, 0.2);
    tl.to(".gsap-reticle", { rotation: 360, duration: 14.0, ease: "none", repeat: -1 }, 0.2);

    // T = 0.5s -> 2.5s: Circuit Path Tracing
    tl.to(".gsap-circuit-line", { strokeDashoffset: 0, duration: 1.8, ease: "power2.inOut", stagger: 0.2 }, 0.4);

    // T = 0.8s: Top Institute Header Badge
    tl.to(".gsap-badge-top", { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, 0.8);

    // T = 1.2s -> 2.2s: Staggered Main Headline Character Blast
    tl.to(".gsap-char", {
      y: 0,
      opacity: 1,
      rotateX: 0,
      stagger: 0.035,
      duration: 0.7,
      ease: "power4.out"
    }, 1.1);

    // T = 2.2s -> 3.2s: Punchy Tagline Zoom & Glow
    tl.to(".gsap-tagline", {
      scale: 1.0,
      opacity: 1,
      duration: 0.9,
      ease: "elastic.out(1.0, 0.6)"
    }, 2.0);

    // T = 3.5s -> 4.5s: 2-Branch Seat Cards Entrance
    tl.to(".gsap-card-left", { x: 0, y: 0, opacity: 1, duration: 0.9, ease: "power3.out" }, 3.3);
    tl.to(".gsap-card-right", { x: 0, y: 0, opacity: 1, duration: 0.9, ease: "power3.out" }, 3.5);

    // T = 4.5s: Footer Affiliation & Helpline Reveal
    tl.to(".gsap-footer-cta", { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }, 4.3);
  }, [isVertical]);

  // Split headline into characters for kinetic stagger
  const headlineWords = headline.split(" ");

  return (
    <AbsoluteFill
      ref={containerRef}
      style={{
        backgroundColor: secondaryColor,
        color: "#ffffff",
        fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif",
        overflow: "hidden",
        position: "relative"
      }}
    >
      {/* 1. Animated Blueprint Technical Grid */}
      <div
        className="gsap-bg-grid"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(8, 126, 255, 0.12) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(8, 126, 255, 0.12) 1px, transparent 1px)
          `,
          backgroundSize: isVertical ? "40px 40px" : "60px 60px",
          pointerEvents: "none"
        }}
      />

      {/* 2. Rotating Technical HUD Reticle */}
      <div
        className="gsap-reticle"
        style={{
          position: "absolute",
          top: isVertical ? "32%" : "45%",
          left: "50%",
          width: isVertical ? 420 : 640,
          height: isVertical ? 420 : 640,
          marginLeft: isVertical ? -210 : -320,
          marginTop: isVertical ? -210 : -320,
          pointerEvents: "none"
        }}
      >
        <svg viewBox="0 0 400 400" width="100%" height="100%">
          <circle cx="200" cy="200" r="180" fill="none" stroke="rgba(8, 126, 255, 0.25)" strokeWidth="1.5" strokeDasharray="6 8" />
          <circle cx="200" cy="200" r="140" fill="none" stroke="rgba(255, 157, 50, 0.3)" strokeWidth="1" strokeDasharray="12 16" />
          <line x1="200" y1="10" x2="200" y2="40" stroke="#087EFF" strokeWidth="2" />
          <line x1="200" y1="360" x2="200" y2="390" stroke="#087EFF" strokeWidth="2" />
          <line x1="10" y1="200" x2="40" y2="200" stroke="#087EFF" strokeWidth="2" />
          <line x1="360" y1="200" x2="390" y2="200" stroke="#087EFF" strokeWidth="2" />
        </svg>
      </div>

      {/* 3. SVG Circuit Connection Trace */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none"
        }}
      >
        <path
          className="gsap-circuit-line"
          d={isVertical
            ? "M 100 200 L 100 450 L 540 600 L 980 450 L 980 200"
            : "M 150 180 L 350 180 L 450 300 L 1470 300 L 1570 180 L 1770 180"
          }
          fill="none"
          stroke="url(#electricGrad)"
          strokeWidth="2.5"
        />
        <defs>
          <linearGradient id="electricGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#087EFF" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#00f2fe" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FF9D32" stopOpacity="0.8" />
          </linearGradient>
        </defs>
      </svg>

      {/* 4. Top Institutional Header */}
      <div
        className="gsap-badge-top"
        style={{
          position: "absolute",
          top: isVertical ? 120 : 64,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            background: "rgba(8, 126, 255, 0.12)",
            border: "1px solid rgba(8, 126, 255, 0.35)",
            padding: "8px 24px",
            borderRadius: 30,
            backdropFilter: "blur(12px)"
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#00f2fe", boxShadow: "0 0 10px #00f2fe" }} />
          <span style={{ fontSize: isVertical ? 22 : 16, fontWeight: 700, letterSpacing: "0.1em", color: "#f1f5f9", textTransform: "uppercase" }}>
            NHIT DURGAPUR • DIPLOMA ENGINEERING 2026–27
          </span>
        </div>
      </div>

      {/* 5. Center Kinetic Typography Container */}
      <div
        style={{
          position: "absolute",
          top: isVertical ? "28%" : "26%",
          left: isVertical ? 60 : 120,
          right: isVertical ? 60 : 120,
          textAlign: "center"
        }}
      >
        {/* Kinetic Staggered Words */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: isVertical ? 16 : 24, marginBottom: 16 }}>
          {headlineWords.map((word, wIdx) => (
            <div key={wIdx} style={{ display: "inline-flex" }}>
              {word.split("").map((char, cIdx) => (
                <span
                  key={cIdx}
                  className="gsap-char"
                  style={{
                    display: "inline-block",
                    fontSize: isVertical ? 58 : 64,
                    fontWeight: 900,
                    color: "#ffffff",
                    letterSpacing: "-0.02em",
                    textShadow: "0 4px 25px rgba(0,0,0,0.8)"
                  }}
                >
                  {char}
                </span>
              ))}
            </div>
          ))}
        </div>

        {/* Tagline Reveal */}
        <div
          className="gsap-tagline"
          style={{
            fontSize: isVertical ? 42 : 48,
            fontWeight: 800,
            color: accentColor,
            letterSpacing: "-0.01em",
            textTransform: "uppercase",
            textShadow: `0 0 35px ${accentColor}66`,
            marginBottom: 32
          }}
        >
          {tagline}
        </div>
      </div>

      {/* 6. Dual Branch Cards (Electrical & Mechanical) */}
      <div
        style={{
          position: "absolute",
          top: isVertical ? "48%" : "52%",
          left: isVertical ? 60 : 200,
          right: isVertical ? 60 : 200,
          display: "flex",
          flexDirection: isVertical ? "column" : "row",
          justifyContent: "center",
          gap: isVertical ? 20 : 36
        }}
      >
        {/* Card Left: Electrical */}
        <div
          className="gsap-card-left"
          style={{
            flex: 1,
            background: "rgba(10, 20, 38, 0.85)",
            border: "1.5px solid rgba(8, 126, 255, 0.4)",
            borderRadius: 16,
            padding: isVertical ? "24px 28px" : "28px 36px",
            boxShadow: "0 12px 30px rgba(0,0,0,0.6)",
            position: "relative",
            overflow: "hidden"
          }}
        >
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "#087EFF" }} />
          <div style={{ fontSize: isVertical ? 18 : 14, fontWeight: 700, color: "#00f2fe", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
            Branch 01
          </div>
          <div style={{ fontSize: isVertical ? 32 : 30, fontWeight: 800, color: "#ffffff", marginBottom: 8 }}>
            Electrical Engineering
          </div>
          <div style={{ display: "inline-block", background: "rgba(8, 126, 255, 0.2)", padding: "4px 14px", borderRadius: 6, color: "#60a5fa", fontWeight: 700, fontSize: isVertical ? 18 : 15 }}>
            30 Approved Seats
          </div>
        </div>

        {/* Card Right: Mechanical */}
        <div
          className="gsap-card-right"
          style={{
            flex: 1,
            background: "rgba(10, 20, 38, 0.85)",
            border: "1.5px solid rgba(255, 157, 50, 0.4)",
            borderRadius: 16,
            padding: isVertical ? "24px 28px" : "28px 36px",
            boxShadow: "0 12px 30px rgba(0,0,0,0.6)",
            position: "relative",
            overflow: "hidden"
          }}
        >
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "#FF9D32" }} />
          <div style={{ fontSize: isVertical ? 18 : 14, fontWeight: 700, color: "#f59e0b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
            Branch 02
          </div>
          <div style={{ fontSize: isVertical ? 32 : 30, fontWeight: 800, color: "#ffffff", marginBottom: 8 }}>
            Mechanical Engineering
          </div>
          <div style={{ display: "inline-block", background: "rgba(255, 157, 50, 0.2)", padding: "4px 14px", borderRadius: 6, color: "#fbbf24", fontWeight: 700, fontSize: isVertical ? 18 : 15 }}>
            30 Approved Seats
          </div>
        </div>
      </div>

      {/* 7. Footer Affiliation & Helpline */}
      <div
        className="gsap-footer-cta"
        style={{
          position: "absolute",
          bottom: isVertical ? 140 : 54,
          left: 0,
          right: 0,
          textAlign: "center"
        }}
      >
        <div style={{ fontSize: isVertical ? 22 : 17, color: "#94a3b8", fontWeight: 600, marginBottom: 8 }}>
          Affiliated to WBSCT&VE&SD • Approved by AICTE • 1 Year Work Exp Required
        </div>
        <div style={{ fontSize: isVertical ? 26 : 21, color: "#ffffff", fontWeight: 800 }}>
          Helpline: <span style={{ color: "#00f2fe" }}>+91 98005 71423</span> | Visit: <span style={{ color: "#FF9D32" }}>www.nhit.in</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
