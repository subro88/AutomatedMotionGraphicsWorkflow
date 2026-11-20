import React from "react";
import { interpolate, spring } from "remotion";

interface CorporateSlideSceneProps {
  frame: number;
  fps: number;
  width: number;
  height: number;
  title: string;
  subtitle?: string;
  category?: string;
  bullets?: string[];
  primaryColor?: string;
}

export const CorporateSlideScene: React.FC<CorporateSlideSceneProps> = ({
  frame,
  fps,
  width,
  height,
  title,
  subtitle = "Strategic Executive Overview",
  category = "Corporate Brief",
  bullets = [
    "Enterprise-wide operational velocity",
    "Autonomous kinetic production workflows",
    "Deterministic multi-track delivery",
  ],
  primaryColor = "#00f2fe",
}) => {
  const isVertical = height > width;

  // Title entrance spring
  const titleEntrance = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.8 },
  });

  const cardOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: isVertical ? "40px 24px" : "60px 80px",
        position: "relative",
        boxSizing: "border-box",
      }}
    >
      {/* Background Tech Grid */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `radial-gradient(circle at 20% 20%, rgba(0, 242, 254, 0.08) 0%, transparent 45%),
                            radial-gradient(circle at 80% 80%, rgba(79, 172, 254, 0.06) 0%, transparent 45%)`,
          pointerEvents: "none",
        }}
      />

      {/* Main Glassmorphic Slide Card */}
      <div
        style={{
          width: "100%",
          maxWidth: isVertical ? "92%" : "85%",
          background: "linear-gradient(135deg, rgba(17, 26, 47, 0.85), rgba(12, 19, 34, 0.95))",
          border: "1px solid rgba(0, 242, 254, 0.25)",
          borderRadius: 24,
          padding: isVertical ? "48px 32px" : "64px 72px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(20px)",
          opacity: cardOpacity,
          transform: `scale(${0.96 + titleEntrance * 0.04})`,
          boxSizing: "border-box",
        }}
      >
        {/* Category Pill */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(0, 242, 254, 0.12)",
            border: "1px solid rgba(0, 242, 254, 0.35)",
            padding: "6px 16px",
            borderRadius: 999,
            color: primaryColor,
            fontSize: isVertical ? 22 : 16,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: isVertical ? 24 : 20,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: primaryColor,
              boxShadow: `0 0 10px ${primaryColor}`,
            }}
          />
          {category}
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: isVertical ? 48 : 46,
            fontWeight: 800,
            lineHeight: 1.15,
            color: "#ffffff",
            margin: 0,
            marginBottom: 12,
            textShadow: "0 2px 10px rgba(0,0,0,0.5)",
          }}
        >
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p
            style={{
              fontSize: isVertical ? 24 : 20,
              color: "#94a3b8",
              margin: 0,
              marginBottom: isVertical ? 36 : 40,
              fontWeight: 400,
            }}
          >
            {subtitle}
          </p>
        )}

        {/* Animated Bullet Points */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: isVertical ? 20 : 18,
          }}
        >
          {bullets.map((bullet, i) => {
            const delay = 10 + i * 8;
            const bulletSpring = spring({
              frame: Math.max(0, frame - delay),
              fps,
              config: { damping: 15, mass: 0.7 },
            });
            const bulletOpacity = interpolate(frame, [delay, delay + 10], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const translateX = interpolate(bulletSpring, [0, 1], [-30, 0]);

            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: isVertical ? 20 : 16,
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                  borderRadius: 14,
                  padding: isVertical ? "20px 24px" : "16px 20px",
                  opacity: bulletOpacity,
                  transform: `translateX(${translateX}px)`,
                }}
              >
                <div
                  style={{
                    minWidth: isVertical ? 36 : 28,
                    height: isVertical ? 36 : 28,
                    borderRadius: 8,
                    background: `linear-gradient(135deg, ${primaryColor}, #4facfe)`,
                    color: "#060911",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: isVertical ? 18 : 14,
                  }}
                >
                  {i + 1}
                </div>
                <span
                  style={{
                    color: "#f1f5f9",
                    fontSize: isVertical ? 26 : 20,
                    fontWeight: 500,
                    lineHeight: 1.4,
                  }}
                >
                  {bullet}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

