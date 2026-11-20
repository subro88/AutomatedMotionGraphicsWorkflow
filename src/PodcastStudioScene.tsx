import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface PodcastStudioProps {
  aspectRatio?: "16:9" | "9:16";
  primaryColor?: string;
  accentColor?: string;
}

export const PodcastStudioScene: React.FC<PodcastStudioProps> = ({
  aspectRatio = "16:9",
  primaryColor = "#00e5ff",
  accentColor = "#f59e0b",
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  // Multi-Speaker Camera Switching Logic (Cycles every 150 frames: Host -> Guest -> Split)
  const cycleFrame = frame % 450;
  const layoutMode = cycleFrame < 150 ? "host" : cycleFrame < 300 ? "guest" : "split";

  // Active audio speaker pulse
  const speechEnergy = Math.max(0.2, (Math.sin(frame * 0.35) + 1.0) * 0.5);

  // Hormozi-Style Bouncing Subtitle Words
  const words = [
    { text: "THE", start: 30, end: 45 },
    { text: "SINGLE", start: 45, end: 65 },
    { text: "BIGGEST", start: 65, end: 90, highlight: true },
    { text: "BREAKTHROUGH", start: 90, end: 125, highlight: true },
    { text: "IN", start: 125, end: 140 },
    { text: "AUTONOMOUS", start: 140, end: 175, highlight: true },
    { text: "COMPUTING.", start: 175, end: 220 },
  ];

  return (
    <div
      style={{
        width,
        height,
        background: "#080c14",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Inter', 'Segoe UI', -apple-system, sans-serif",
      }}
    >
      {/* Studio Cyber Acoustic Background Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            radial-gradient(circle at 50% 30%, rgba(0, 229, 255, 0.08) 0%, transparent 70%),
            linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
          `,
          backgroundSize: "100% 100%, 48px 48px, 48px 48px",
        }}
      />

      {/* TOP PODCAST HEADER & EPISODE BADGE */}
      <div
        style={{
          position: "absolute",
          top: 36,
          left: 48,
          right: 48,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          paddingBottom: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              background: "#ef4444",
              borderRadius: "50%",
              width: 12,
              height: 12,
              boxShadow: "0 0 10px #ef4444",
            }}
          />
          <div style={{ fontSize: 13, letterSpacing: "0.22em", fontWeight: 800, color: "#f8fafc", textTransform: "uppercase" }}>
            LIVE STUDIO BROADCAST • EPISODE 42
          </div>
        </div>
        <div style={{ fontSize: 13, color: "rgba(255, 255, 255, 0.6)", fontFamily: "monospace" }}>
          CHAPTER: THE ARCHITECTURAL SHIFT [02:14]
        </div>
      </div>

      {/* MULTI-SPEAKER VIDEO LAYOUT STAGE */}
      <div
        style={{
          position: "absolute",
          top: 100,
          left: 48,
          right: 48,
          height: height * 0.58,
          display: "flex",
          gap: 24,
        }}
      >
        {/* SPEAKER 1: HOST FRAME */}
        <div
          style={{
            flex: layoutMode === "guest" ? 0.35 : 1,
            transition: "flex 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            background: "linear-gradient(180deg, #131d2e 0%, #0d1420 100%)",
            border: layoutMode === "host" ? "2px solid #00e5ff" : "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: 12,
            position: "relative",
            overflow: "hidden",
            boxShadow: layoutMode === "host" ? "0 0 35px rgba(0, 229, 255, 0.2)" : "none",
          }}
        >
          {/* Host Avatar Silhouette */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: 180,
              height: 220,
              background: "radial-gradient(circle at 50% 30%, #38bdf8 0%, #0284c7 100%)",
              borderRadius: "50% 50% 0 0",
              opacity: 0.85,
            }}
          />
          {/* Host Lower Third */}
          <div
            style={{
              position: "absolute",
              bottom: 16,
              left: 16,
              background: "rgba(6, 10, 18, 0.85)",
              padding: "6px 14px",
              borderRadius: 6,
              border: "1px solid rgba(255, 255, 255, 0.15)",
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 700, color: "#ffffff" }}>DR. ALEX CHEN</div>
            <div style={{ fontSize: 11, color: "#38bdf8" }}>HOST • AI SYSTEMS ARCHITECT</div>
          </div>
        </div>

        {/* SPEAKER 2: GUEST FRAME */}
        <div
          style={{
            flex: layoutMode === "host" ? 0.35 : 1,
            transition: "flex 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            background: "linear-gradient(180deg, #1f1b2e 0%, #131020 100%)",
            border: layoutMode === "guest" ? "2px solid #f59e0b" : "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: 12,
            position: "relative",
            overflow: "hidden",
            boxShadow: layoutMode === "guest" ? "0 0 35px rgba(245, 158, 11, 0.2)" : "none",
          }}
        >
          {/* Guest Avatar Silhouette */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: 180,
              height: 220,
              background: "radial-gradient(circle at 50% 30%, #fbbf24 0%, #d97706 100%)",
              borderRadius: "50% 50% 0 0",
              opacity: 0.85,
            }}
          />
          {/* Guest Lower Third */}
          <div
            style={{
              position: "absolute",
              bottom: 16,
              left: 16,
              background: "rgba(6, 10, 18, 0.85)",
              padding: "6px 14px",
              borderRadius: 6,
              border: "1px solid rgba(255, 255, 255, 0.15)",
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 700, color: "#ffffff" }}>SARAH LINDQUIST</div>
            <div style={{ fontSize: 11, color: "#f59e0b" }}>GUEST • VP OF PRODUCT</div>
          </div>
        </div>
      </div>

      {/* DYNAMIC 60-BAND FFT AUDIO SPECTRUM WAVEFORM */}
      <div
        style={{
          position: "absolute",
          bottom: 150,
          left: 48,
          right: 48,
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
        }}
      >
        {[...Array(48)].map((_, i) => {
          // Compute wave height
          const freqMultiplier = Math.sin((i / 48) * Math.PI);
          const barHeight = Math.max(
            8,
            Math.sin(frame * 0.25 + i * 0.45) * 28 * speechEnergy * freqMultiplier + 14
          );
          const isCenter = Math.abs(i - 24) < 8;

          return (
            <div
              key={i}
              style={{
                width: 6,
                height: barHeight,
                borderRadius: 3,
                background: isCenter
                  ? "linear-gradient(180deg, #00e5ff 0%, #3b82f6 100%)"
                  : "linear-gradient(180deg, #64748b 0%, #334155 100%)",
                boxShadow: isCenter ? "0 0 12px rgba(0, 229, 255, 0.5)" : "none",
                transition: "height 0.05s ease",
              }}
            />
          );
        })}
      </div>

      {/* HORMOZI-STYLE BOUNCING SOCIAL SUBTITLE BAR */}
      <div
        style={{
          position: "absolute",
          bottom: 48,
          left: 48,
          right: 48,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        {words.map((w, idx) => {
          const isActive = frame >= w.start && frame <= w.end;
          const isPassed = frame > w.end;
          const scale = isActive ? 1.25 : 1.0;

          return (
            <span
              key={idx}
              style={{
                fontSize: 28,
                fontWeight: 900,
                letterSpacing: "-0.01em",
                transform: `scale(${scale})`,
                color: isActive
                  ? w.highlight
                    ? "#facc15"
                    : "#00e5ff"
                  : isPassed
                  ? "#ffffff"
                  : "rgba(255, 255, 255, 0.35)",
                textShadow: isActive
                  ? `0 0 20px ${w.highlight ? "rgba(250, 204, 21, 0.8)" : "rgba(0, 229, 255, 0.8)"}`
                  : "none",
                transition: "all 0.12s cubic-bezier(0.16, 1, 0.3, 1)",
                display: "inline-block",
              }}
            >
              {w.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};
