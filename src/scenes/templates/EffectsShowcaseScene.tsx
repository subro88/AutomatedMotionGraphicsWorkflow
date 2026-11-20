import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Solid,
  HtmlInCanvas,
} from "remotion";
import { blur } from "@remotion/effects/blur";
import { duotone } from "@remotion/effects/duotone";
import { pixelate } from "@remotion/effects/pixelate";

export interface EffectsShowcaseProps {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  blurRadius?: number;
  duotoneThreshold?: number;
  pixelBlockSize?: number;
  title?: string;
}

export const EffectsShowcaseScene: React.FC<EffectsShowcaseProps> = ({
  primaryColor = "#0066FF",
  secondaryColor = "#8B5CF6",
  accentColor = "#00FF88",
  backgroundColor = "#0A0A0F",
  blurRadius = 24,
  duotoneThreshold = 0.5,
  pixelBlockSize = 16,
  title = "Remotion Shader Effects Engine",
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const isVertical = height > width;
  const contentScale = isVertical ? 0.82 : 1.0;

  // Determine current phase (4 phases across 450 frames / 15s)
  let activePhaseName = "PHASE 1: CLEAN VISUAL BASE";
  let activeEffectBadge = "Native High-Definition Pass";

  const effectsList = [];

  if (frame >= 110 && frame < 225) {
    activePhaseName = "PHASE 2: SPOTIFY DUOTONE MAPPING";
    activeEffectBadge = "@remotion/effects/duotone";
    effectsList.push(
      duotone({
        darkColor: primaryColor,
        lightColor: accentColor,
        threshold: duotoneThreshold,
      })
    );
  } else if (frame >= 225 && frame < 340) {
    activePhaseName = "PHASE 3: CYBER PIXELATE GLITCH";
    activeEffectBadge = "@remotion/effects/pixelate";
    const dynamicBlockSize = interpolate(
      frame,
      [225, 255, 310, 340],
      [2, pixelBlockSize, pixelBlockSize, 2],
      { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
    );
    effectsList.push(pixelate({ blockSize: Math.round(dynamicBlockSize) }));
  } else if (frame >= 340) {
    activePhaseName = "PHASE 4: CINEMATIC DYNAMIC MOTION BLUR";
    activeEffectBadge = "@remotion/effects/blur";
    const dynamicBlur = interpolate(
      frame,
      [340, 380, 420, 450],
      [0, blurRadius, blurRadius * 0.5, 0],
      { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
    );
    effectsList.push(blur({ radius: Math.round(dynamicBlur) }));
  }

  // Card spring entrance
  const cardSpring = spring({
    frame,
    fps,
    config: { damping: 95, mass: 0.6 },
  });

  return (
    <div
      style={{
        width,
        height,
        backgroundColor,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        color: "#FFFFFF",
      }}
    >
      {/* Background ambient radial aura */}
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${primaryColor}44 0%, transparent 70%)`,
          filter: "blur(70px)",
          pointerEvents: "none",
        }}
      />

      {/* HtmlInCanvas Container applying the shader effect chain */}
      <HtmlInCanvas
        width={width}
        height={height}
        effects={effectsList}
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {/* Main Visual Demo Card */}
          <div
            style={{
              width: isVertical ? "88%" : 960,
              padding: isVertical ? "36px 24px" : "48px 56px",
              borderRadius: 32,
              backgroundColor: "rgba(15, 22, 38, 0.85)",
              border: "1.5px solid rgba(255, 255, 255, 0.16)",
              boxShadow: `0 24px 70px rgba(0, 0, 0, 0.7), 0 0 50px ${primaryColor}33`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              transform: `scale(${contentScale * cardSpring})`,
            }}
          >
            {/* Top Phase Header */}
            <div
              style={{
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: "0.2em",
                color: accentColor,
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              {activePhaseName}
            </div>

            {/* Active Shader Effect Pill */}
            <div
              style={{
                padding: "6px 18px",
                borderRadius: 20,
                backgroundColor: `${primaryColor}33`,
                border: `1px solid ${primaryColor}88`,
                fontSize: 13,
                fontFamily: "monospace",
                color: "#38bdf8",
                marginBottom: 24,
              }}
            >
              {activeEffectBadge}
            </div>

            {/* Hero Graphic Badge */}
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: 30,
                background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                boxShadow: `0 0 50px ${primaryColor}88`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 24,
                border: "2px solid rgba(255, 255, 255, 0.3)",
              }}
            >
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                  fill="#FFFFFF"
                />
              </svg>
            </div>

            {/* Title */}
            <h1
              style={{
                fontSize: isVertical ? 38 : 52,
                fontWeight: 900,
                letterSpacing: "-0.03em",
                margin: 0,
                background: `linear-gradient(180deg, #FFFFFF 40%, ${primaryColor} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {title}
            </h1>

            {/* Feature Description */}
            <p
              style={{
                fontSize: isVertical ? 15 : 18,
                color: "rgba(255, 255, 255, 0.75)",
                margin: "16px 0 28px 0",
                maxWidth: 680,
                lineHeight: 1.5,
              }}
            >
              Real-time hardware-accelerated GPU shader pipeline featuring WebGL &amp; WebGPU multipass execution.
            </p>

            {/* 3 Metrics Badges */}
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
              <div
                style={{
                  padding: "10px 18px",
                  borderRadius: 14,
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                ⚡ 0ms Buffer Latency
              </div>
              <div
                style={{
                  padding: "10px 18px",
                  borderRadius: 14,
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  fontSize: 13,
                  fontWeight: 600,
                  color: accentColor,
                }}
              >
                ✓ WebGPU Accelerated
              </div>
              <div
                style={{
                  padding: "10px 18px",
                  borderRadius: 14,
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#38bdf8",
                }}
              >
                🎬 60fps Zero-Drop
              </div>
            </div>
          </div>
        </div>
      </HtmlInCanvas>
    </div>
  );
};

