import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

export interface TransparentOverlayProps {
  overlayMode?: "lower_third" | "corner_badge" | "floating_callout" | "full_sequence";
  speakerName?: string;
  speakerRole?: string;
  badgeText?: string;
  calloutTitle?: string;
  calloutSubtitle?: string;
  primaryColor?: string;
  accentColor?: string;
}

export const TransparentOverlayScene: React.FC<TransparentOverlayProps> = ({
  overlayMode = "full_sequence",
  speakerName = "Christopher Vance",
  speakerRole = "AI Video Systems Architect • @chris_vance",
  badgeText = "🔔 SUBSCRIBE • Join 50K Creators",
  calloutTitle = "10x Render Acceleration",
  calloutSubtitle = "NVIDIA NVENC Gen 7 • 0.2s Frame Latency",
  primaryColor = "#0066FF",
  accentColor = "#00FF88",
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const isVertical = height > width;
  const contentScale = isVertical ? 0.85 : 1.0;

  // Determine which widgets are active based on mode or sequence
  const showLowerThird =
    overlayMode === "lower_third" ||
    (overlayMode === "full_sequence" && frame >= 0 && frame < 180);

  const showCornerBadge =
    overlayMode === "corner_badge" ||
    (overlayMode === "full_sequence" && frame >= 150 && frame < 330);

  const showFloatingCallout =
    overlayMode === "floating_callout" ||
    (overlayMode === "full_sequence" && frame >= 300);

  // 1. Lower Third Spring Entrance & Exit
  const ltFrame = overlayMode === "full_sequence" ? frame : frame;
  const ltEnter = spring({
    frame: ltFrame - 8,
    fps,
    config: { damping: 90, mass: 0.6 },
  });
  const ltExit = overlayMode === "full_sequence"
    ? interpolate(frame, [155, 175], [1, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" })
    : 1.0;

  // 2. Corner Badge Spring Entrance & Exit
  const cbFrame = overlayMode === "full_sequence" ? frame - 150 : frame;
  const cbEnter = spring({
    frame: cbFrame - 8,
    fps,
    config: { damping: 90, mass: 0.5, stiffness: 140 },
  });
  const cbExit = overlayMode === "full_sequence"
    ? interpolate(frame, [305, 325], [1, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" })
    : 1.0;

  // 3. Floating Callout Spring Entrance
  const fcFrame = overlayMode === "full_sequence" ? frame - 300 : frame;
  const fcEnter = spring({
    frame: fcFrame - 8,
    fps,
    config: { damping: 95, mass: 0.7 },
  });

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: "transparent", // True Alpha Channel for Video NLEs
        position: "relative",
        overflow: "hidden",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        color: "#FFFFFF",
      }}
    >
      {/* ------------------------------------------------------------- */}
      {/* 1. LOWER THIRD OVERLAY (Bottom-Left)                          */}
      {/* ------------------------------------------------------------- */}
      {showLowerThird && (
        <div
          style={{
            position: "absolute",
            bottom: isVertical ? 140 : 80,
            left: isVertical ? 32 : 80,
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "16px 24px 16px 16px",
            borderRadius: 20,
            backgroundColor: "rgba(10, 15, 28, 0.88)",
            border: "1px solid rgba(255, 255, 255, 0.14)",
            borderLeft: `5px solid ${primaryColor}`,
            backdropFilter: "blur(20px)",
            boxShadow: `0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px ${primaryColor}33`,
            transform: `translateX(${(1 - ltEnter) * -280}px) scale(${contentScale})`,
            opacity: ltEnter * ltExit,
            zIndex: 20,
          }}
        >
          {/* Avatar Icon */}
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 0 16px ${primaryColor}88`,
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#FFFFFF">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 6C13.66 6 15 7.34 15 9C15 10.66 13.66 12 12 12C10.34 12 9 10.66 9 9C9 7.34 10.34 6 12 6ZM12 20C9.5 20 7.29 18.92 5.8 17.2C6.72 15.68 9.24 14.8 12 14.8C14.76 14.8 17.28 15.68 18.2 17.2C16.71 18.92 14.5 20 12 20Z" />
            </svg>
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: isVertical ? 18 : 22, fontWeight: 800, letterSpacing: "-0.02em" }}>
                {speakerName}
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  backgroundColor: `${accentColor}33`,
                  color: accentColor,
                  padding: "2px 8px",
                  borderRadius: 10,
                }}
              >
                PRO
              </span>
            </div>
            <div style={{ fontSize: isVertical ? 12 : 14, color: "rgba(255, 255, 255, 0.65)", marginTop: 2 }}>
              {speakerRole}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. CORNER BADGE OVERLAY (Top-Right)                           */}
      {/* ------------------------------------------------------------- */}
      {showCornerBadge && (
        <div
          style={{
            position: "absolute",
            top: isVertical ? 120 : 60,
            right: isVertical ? 24 : 60,
            padding: "12px 22px",
            borderRadius: 30,
            background: `linear-gradient(135deg, ${primaryColor}dd, ${accentColor}dd)`,
            border: "1.5px solid rgba(255, 255, 255, 0.4)",
            boxShadow: `0 12px 35px ${primaryColor}66`,
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: isVertical ? 13 : 15,
            fontWeight: 800,
            color: "#FFFFFF",
            letterSpacing: "-0.01em",
            transform: `scale(${cbEnter * contentScale}) translateY(${(1 - cbEnter) * -40}px)`,
            opacity: cbEnter * cbExit,
            zIndex: 20,
          }}
        >
          <span style={{ fontSize: 18 }}>🔔</span>
          <span>{badgeText}</span>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. FLOATING METRIC CALLOUT (Bottom-Right)                      */}
      {/* ------------------------------------------------------------- */}
      {showFloatingCallout && (
        <div
          style={{
            position: "absolute",
            bottom: isVertical ? 140 : 80,
            right: isVertical ? 24 : 80,
            padding: "18px 24px",
            borderRadius: 22,
            backgroundColor: "rgba(12, 18, 32, 0.88)",
            border: `1.5px solid ${accentColor}66`,
            backdropFilter: "blur(20px)",
            boxShadow: `0 20px 50px rgba(0, 0, 0, 0.6), 0 0 24px ${accentColor}33`,
            transform: `scale(${fcEnter * contentScale}) translateY(${(1 - fcEnter) * 50}px)`,
            opacity: fcEnter,
            zIndex: 20,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 20 }}>⚡</span>
            <div>
              <div style={{ fontSize: isVertical ? 15 : 18, fontWeight: 800, color: "#FFFFFF" }}>
                {calloutTitle}
              </div>
              <div style={{ fontSize: isVertical ? 11 : 13, color: accentColor, fontWeight: 600, marginTop: 2 }}>
                {calloutSubtitle}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

