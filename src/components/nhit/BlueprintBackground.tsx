import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { NHIT_THEME } from "../../styles/nhitTheme";

interface BlueprintBackgroundProps {
  opacity?: number;
  pulseGlow?: boolean;
}

export const BlueprintBackground: React.FC<BlueprintBackgroundProps> = ({
  opacity = 1.0,
  pulseGlow = true,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Subtle slow technical grid drift
  const gridOffsetY = (frame * 0.4) % 60;
  const gridOffsetX = (frame * 0.2) % 60;

  // Pulse effect
  const glowPulse = pulseGlow
    ? 0.7 + Math.sin(frame * 0.08) * 0.15
    : 0.8;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width,
        height,
        backgroundColor: NHIT_THEME.colors.bgNavy,
        backgroundImage: `radial-gradient(circle at 50% 45%, #0B2545 0%, #051426 65%, #020A14 100%)`,
        overflow: "hidden",
        pointerEvents: "none",
        opacity,
      }}
    >
      {/* Precision Blueprint Grid */}
      <svg
        width={width}
        height={height}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          opacity: 0.35 * glowPulse,
        }}
      >
        <defs>
          <pattern
            id="subgrid"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
            x={gridOffsetX}
            y={gridOffsetY}
          >
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke={NHIT_THEME.colors.electricBlue}
              strokeWidth="0.5"
              strokeOpacity="0.15"
            />
          </pattern>
          <pattern
            id="grid"
            width="100"
            height="100"
            patternUnits="userSpaceOnUse"
            x={gridOffsetX}
            y={gridOffsetY}
          >
            <rect width="100" height="100" fill="url(#subgrid)" />
            <path
              d="M 100 0 L 0 0 0 100"
              fill="none"
              stroke={NHIT_THEME.colors.electricBlue}
              strokeWidth="1.2"
              strokeOpacity="0.35"
            />
            {/* Crosshair markers at corners */}
            <circle cx="0" cy="0" r="1.5" fill={NHIT_THEME.colors.industrialOrange} />
            <circle cx="100" cy="0" r="1.5" fill={NHIT_THEME.colors.industrialOrange} />
            <circle cx="0" cy="100" r="1.5" fill={NHIT_THEME.colors.industrialOrange} />
            <circle cx="100" cy="100" r="1.5" fill={NHIT_THEME.colors.industrialOrange} />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Blueprint Architectural Coordinate Markings */}
      <div
        style={{
          position: "absolute",
          top: 36,
          left: 48,
          fontFamily: NHIT_THEME.fonts.mono,
          fontSize: 11,
          color: NHIT_THEME.colors.electricBlue,
          letterSpacing: "0.15em",
          opacity: 0.6,
          lineHeight: 1.5,
        }}
      >
        <div>NHIT // TECH.SPEC.2026-27 // DET-WP</div>
        <div>COORD: 23°31'13.4"N 87°18'42.8"E // DURGAPUR HUB</div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 36,
          right: 48,
          textAlign: "right",
          fontFamily: NHIT_THEME.fonts.mono,
          fontSize: 11,
          color: NHIT_THEME.colors.industrialOrange,
          letterSpacing: "0.15em",
          opacity: 0.7,
          lineHeight: 1.5,
        }}
      >
        <div>WBSCT&amp;VE&amp;SD APPROVED</div>
        <div>AICTE WORKING PROFESSIONALS SCHEME</div>
      </div>

      {/* Tech Corner Viewfinder Brackets */}
      <svg
        width={width}
        height={height}
        style={{ position: "absolute", top: 0, left: 0, opacity: 0.45 }}
      >
        {/* Top-Left Bracket */}
        <path d="M 30 70 L 30 30 L 70 30" fill="none" stroke={NHIT_THEME.colors.electricBlue} strokeWidth="2" />
        {/* Top-Right Bracket */}
        <path d="M 1850 30 L 1890 30 L 1890 70" fill="none" stroke={NHIT_THEME.colors.electricBlue} strokeWidth="2" />
        {/* Bottom-Left Bracket */}
        <path d="M 30 1010 L 30 1050 L 70 1050" fill="none" stroke={NHIT_THEME.colors.electricBlue} strokeWidth="2" />
        {/* Bottom-Right Bracket */}
        <path d="M 1850 1050 L 1890 1050 L 1890 1010" fill="none" stroke={NHIT_THEME.colors.electricBlue} strokeWidth="2" />
      </svg>
    </div>
  );
};

