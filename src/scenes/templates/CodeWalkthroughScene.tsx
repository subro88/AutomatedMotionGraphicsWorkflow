import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

export interface CodeWalkthroughProps {
  fileName?: string;
  focusLineStart?: number;
  focusLineEnd?: number;
  language?: string;
  primaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  statusBadge?: string;
}

export const CodeWalkthroughScene: React.FC<CodeWalkthroughProps> = ({
  fileName = "motion_pipeline.ts",
  focusLineStart = 4,
  focusLineEnd = 7,
  language = "TypeScript",
  primaryColor = "#0066FF",
  accentColor = "#00FF88",
  backgroundColor = "#0A0A0F",
  statusBadge = "⚡ GPU NVENC Active • 60fps",
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const isVertical = height > width;
  const contentScale = isVertical ? 0.8 : 1.0;

  // Window spring entrance
  const winScale = spring({
    frame,
    fps,
    config: { damping: 95, mass: 0.7, stiffness: 130 },
  });

  // Line focus slide-in
  const focusOpacity = interpolate(frame, [15, 30], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Simulated code tokens with syntax styling
  const codeLines = [
    { line: 1, text: 'import { assembleTimeline, renderGPU } from "@remotion/pipeline";', color: "#c084fc" },
    { line: 2, text: 'import { resolveColorGrade } from "davinci-resolve-api";', color: "#c084fc" },
    { line: 3, text: "", color: "#ffffff" },
    { line: 4, text: "export async function buildMotionGraphicsDeck(spec: VideoConfig) {", color: "#38bdf8" },
    { line: 5, text: "  const spectrum = await extractMelFilterbank(spec.audioPath);", color: "#e2e8f0" },
    { line: 6, text: "  const timeline = assembleResolveFCPXML({ tracks: [V1, V2, A1, A2] });", color: "#e2e8f0" },
    { line: 7, text: "  return renderGPU(timeline, { codec: 'nvenc_h264', crf: 18 });", color: "#00FF88" },
    { line: 8, text: "}", color: "#38bdf8" },
    { line: 9, text: "", color: "#ffffff" },
    { line: 10, text: "// Dispatched 600 frames at 30fps with Fairlight auto-ducking", color: "#64748b" },
  ];

  // Blinking cursor
  const cursorBlink = Math.floor(frame / 12) % 2 === 0;

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
      {/* Background radial glow */}
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${primaryColor}33 0%, transparent 70%)`,
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      {/* Code Editor Window Card */}
      <div
        style={{
          width: isVertical ? "92%" : 1040,
          borderRadius: 24,
          backgroundColor: "rgba(10, 14, 26, 0.88)",
          border: "1px solid rgba(255, 255, 255, 0.14)",
          backdropFilter: "blur(24px)",
          boxShadow: `0 24px 70px rgba(0, 0, 0, 0.7), 0 0 40px ${primaryColor}22`,
          overflow: "hidden",
          transform: `scale(${contentScale * winScale})`,
          zIndex: 10,
        }}
      >
        {/* Editor Title Bar */}
        <div
          style={{
            height: 48,
            backgroundColor: "rgba(15, 22, 38, 0.9)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 18px",
          }}
        >
          {/* macOS Traffic Lights */}
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#ff5f56" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#ffbd2e" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#27c93f" }} />
          </div>

          {/* Active File Tab */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 16px",
              borderRadius: "8px 8px 0 0",
              backgroundColor: "rgba(10, 14, 26, 0.9)",
              borderTop: `2px solid ${primaryColor}`,
              borderLeft: "1px solid rgba(255, 255, 255, 0.08)",
              borderRight: "1px solid rgba(255, 255, 255, 0.08)",
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "Consolas, monospace",
              color: "#38bdf8",
            }}
          >
            <span>📄</span>
            <span>{fileName}</span>
          </div>

          {/* Language Pill */}
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              padding: "3px 10px",
              borderRadius: 12,
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              color: "rgba(255, 255, 255, 0.7)",
              letterSpacing: "0.05em",
            }}
          >
            {language}
          </div>
        </div>

        {/* Code Content Area */}
        <div style={{ padding: isVertical ? "20px 16px" : "28px 32px", position: "relative" }}>
          {codeLines.map((cl) => {
            const isFocused = cl.line >= focusLineStart && cl.line <= focusLineEnd;

            return (
              <div
                key={cl.line}
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: 32,
                  borderRadius: 6,
                  backgroundColor: isFocused ? "rgba(0, 102, 255, 0.12)" : "transparent",
                  borderLeft: isFocused ? `3px solid ${accentColor}` : "3px solid transparent",
                  paddingLeft: 8,
                  opacity: isFocused ? 1.0 : 0.4 + (1 - focusOpacity) * 0.4,
                  transition: "opacity 0.2s, background-color 0.2s",
                }}
              >
                {/* Line Number */}
                <span
                  style={{
                    width: 32,
                    fontSize: 13,
                    fontFamily: "Consolas, monospace",
                    color: isFocused ? accentColor : "rgba(255, 255, 255, 0.3)",
                    userSelect: "none",
                  }}
                >
                  {cl.line}
                </span>

                {/* Line Code */}
                <span
                  style={{
                    fontSize: isVertical ? 12 : 14,
                    fontFamily: "Consolas, 'Courier New', monospace",
                    fontWeight: 500,
                    color: cl.color,
                    whiteSpace: "pre",
                  }}
                >
                  {cl.text}
                </span>

                {/* Cursor on last focused line */}
                {cl.line === focusLineEnd && cursorBlink && (
                  <span
                    style={{
                      display: "inline-block",
                      width: 8,
                      height: 16,
                      backgroundColor: accentColor,
                      marginLeft: 4,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Editor Bottom Status Bar */}
        <div
          style={{
            height: 36,
            backgroundColor: "rgba(12, 18, 32, 0.95)",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 20px",
            fontSize: 12,
            color: "rgba(255, 255, 255, 0.6)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ color: accentColor }}>●</span>
            <span style={{ fontWeight: 600 }}>{statusBadge}</span>
          </div>
          <div>UTF-8 • CRLF • TypeScript 5.2</div>
        </div>
      </div>
    </div>
  );
};

