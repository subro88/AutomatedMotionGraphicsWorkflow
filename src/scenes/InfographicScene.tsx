import React from "react";
import { interpolate, spring } from "remotion";
import { ChartBarItem } from "./types";

interface InfographicSceneProps {
  frame: number;
  fps: number;
  width: number;
  height: number;
  title: string;
  metricValue?: string;
  metricLabel?: string;
  chartBars?: ChartBarItem[];
  primaryColor?: string;
}

export const InfographicScene: React.FC<InfographicSceneProps> = ({
  frame,
  fps,
  width,
  height,
  title,
  metricValue = "+142%",
  metricLabel = "Efficiency Acceleration",
  chartBars = [
    { label: "Legacy Manual Workflow", value: 28 },
    { label: "Scripted Automation", value: 65 },
    { label: "Antigravity Autonomous Workstation", value: 98 },
  ],
  primaryColor = "#00f2fe",
}) => {
  const isVertical = height > width;

  // Metric spring pop
  const metricSpring = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.6 },
  });

  const gaugeProgress = interpolate(frame, [5, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const radius = isVertical ? 90 : 75;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - gaugeProgress * 0.85 * circumference;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: isVertical ? "40px 24px" : "50px 80px",
        position: "relative",
        boxSizing: "border-box",
      }}
    >
      {/* Background Ambient Glow */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          height: 500,
          background: "radial-gradient(circle, rgba(0, 242, 254, 0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Main Glassmorphic Infographic Deck */}
      <div
        style={{
          width: "100%",
          maxWidth: isVertical ? "92%" : "85%",
          background: "linear-gradient(135deg, rgba(17, 26, 47, 0.9), rgba(12, 19, 34, 0.98))",
          border: "1px solid rgba(0, 242, 254, 0.25)",
          borderRadius: 24,
          padding: isVertical ? "40px 28px" : "48px 64px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
          backdropFilter: "blur(20px)",
          boxSizing: "border-box",
        }}
      >
        {/* Infographic Category Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(16, 185, 129, 0.12)",
            border: "1px solid rgba(16, 185, 129, 0.35)",
            padding: "6px 14px",
            borderRadius: 999,
            color: "#10b981",
            fontSize: isVertical ? 20 : 15,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: 16,
          }}
        >
          <span>📊</span>
          Key Metrics &amp; Analytics
        </div>

        {/* Headline */}
        <h2
          style={{
            fontSize: isVertical ? 42 : 38,
            fontWeight: 800,
            color: "#ffffff",
            margin: 0,
            marginBottom: isVertical ? 28 : 24,
            lineHeight: 1.2,
          }}
        >
          {title}
        </h2>

        {/* Metric Callout + Circular Gauge */}
        <div
          style={{
            display: "flex",
            flexDirection: isVertical ? "column" : "row",
            alignItems: "center",
            gap: isVertical ? 24 : 48,
            background: "rgba(0, 0, 0, 0.25)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            borderRadius: 18,
            padding: isVertical ? "28px 20px" : "24px 36px",
            marginBottom: isVertical ? 32 : 28,
          }}
        >
          {/* Animated Circular Gauge */}
          <div style={{ position: "relative", width: radius * 2 + 30, height: radius * 2 + 30, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width={radius * 2 + 30} height={radius * 2 + 30} style={{ transform: "rotate(-90deg)" }}>
              <circle
                cx={(radius * 2 + 30) / 2}
                cy={(radius * 2 + 30) / 2}
                r={radius}
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="12"
              />
              <circle
                cx={(radius * 2 + 30) / 2}
                cy={(radius * 2 + 30) / 2}
                r={radius}
                fill="none"
                stroke={primaryColor}
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{ filter: `drop-shadow(0 0 10px ${primaryColor})` }}
              />
            </svg>
            <div
              style={{
                position: "absolute",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                transform: `scale(${metricSpring})`,
              }}
            >
              <span
                style={{
                  fontSize: isVertical ? 38 : 34,
                  fontWeight: 900,
                  color: "#ffffff",
                  lineHeight: 1,
                  fontFamily: "monospace",
                }}
              >
                {metricValue}
              </span>
            </div>
          </div>

          {/* Metric Details */}
          <div style={{ display: "flex", flexDirection: "column", textAlign: isVertical ? "center" : "left" }}>
            <span
              style={{
                fontSize: isVertical ? 26 : 22,
                fontWeight: 700,
                color: primaryColor,
                marginBottom: 6,
              }}
            >
              {metricLabel}
            </span>
            <span style={{ fontSize: isVertical ? 20 : 16, color: "#94a3b8", lineHeight: 1.4 }}>
              Deterministic quantitative performance lift captured across multi-track media streams.
            </span>
          </div>
        </div>

        {/* Comparative Chart Bars */}
        <div style={{ display: "flex", flexDirection: "column", gap: isVertical ? 18 : 14 }}>
          {chartBars.map((bar, i) => {
            const barDelay = 15 + i * 8;
            const barProgress = interpolate(frame, [barDelay, barDelay + 25], [0, bar.value], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            return (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: isVertical ? 22 : 16, color: "#e2e8f0", fontWeight: 600 }}>
                    {bar.label}
                  </span>
                  <span style={{ fontSize: isVertical ? 22 : 16, color: primaryColor, fontWeight: 700, fontFamily: "monospace" }}>
                    {Math.round(barProgress)}%
                  </span>
                </div>
                {/* Track */}
                <div
                  style={{
                    width: "100%",
                    height: isVertical ? 14 : 10,
                    background: "rgba(255, 255, 255, 0.08)",
                    borderRadius: 999,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${barProgress}%`,
                      height: "100%",
                      background: `linear-gradient(90deg, #38bdf8, ${primaryColor})`,
                      borderRadius: 999,
                      boxShadow: `0 0 10px ${primaryColor}88`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

