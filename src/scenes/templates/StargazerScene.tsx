import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

export interface StargazerProps {
  repoName?: string;
  targetStars?: number;
  milestoneTitle?: string;
  primaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
}

export const StargazerScene: React.FC<StargazerProps> = ({
  repoName = "antigravity / motion-graphics-pipeline",
  targetStars = 12500,
  milestoneTitle = "10,000 GITHUB STARS CELEBRATION",
  primaryColor = "#0066FF",
  accentColor = "#FFD700", // Gold
  backgroundColor = "#0A0A0F",
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const isVertical = height > width;
  const contentScale = isVertical ? 0.82 : 1.0;

  // Spring animations
  const starScale = spring({
    frame: frame - 10,
    fps,
    config: { damping: 90, mass: 0.5, stiffness: 120 },
  });

  const cardScale = spring({
    frame: frame - 5,
    fps,
    config: { damping: 95, mass: 0.7 },
  });

  // Rapid star counter
  const starCount = interpolate(frame, [15, 75], [0, targetStars], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Sparkle / Confetti particle system
  const particles = Array.from({ length: 30 }).map((_, i) => {
    const angle = (i * Math.PI * 2) / 30;
    const speed = 1.0 + (i % 5) * 0.3;
    const distance = interpolate(frame, [10, 80], [0, (isVertical ? 240 : 420) * speed], {
      extrapolateRight: "clamp",
      extrapolateLeft: "clamp",
    });
    const pOpacity = interpolate(frame, [10, 25, 75, 95], [0, 1, 1, 0], {
      extrapolateRight: "clamp",
      extrapolateLeft: "clamp",
    });
    const size = 4 + (i % 4) * 3;
    const colors = [accentColor, primaryColor, "#00FF88", "#FFFFFF"];

    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      opacity: pOpacity,
      size,
      color: colors[i % colors.length],
    };
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
      {/* Background Star Glow */}
      <div
        style={{
          position: "absolute",
          width: 550,
          height: 550,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accentColor}33 0%, transparent 70%)`,
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      {/* Confetti / Sparkle Particle Field */}
      <div style={{ position: "absolute", width: 0, height: 0, pointerEvents: "none" }}>
        {particles.map((p, idx) => (
          <div
            key={idx}
            style={{
              position: "absolute",
              left: p.x - p.size / 2,
              top: p.y - p.size / 2,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              backgroundColor: p.color,
              opacity: p.opacity,
              boxShadow: `0 0 14px ${p.color}`,
            }}
          />
        ))}
      </div>

      {/* Main Glassmorphic Milestone Card */}
      <div
        style={{
          width: isVertical ? "88%" : 920,
          padding: isVertical ? "36px 24px" : "48px 56px",
          borderRadius: 32,
          backgroundColor: "rgba(18, 22, 38, 0.8)",
          border: `1.5px solid rgba(255, 215, 0, 0.35)`,
          backdropFilter: "blur(24px)",
          boxShadow: `0 24px 70px rgba(0, 0, 0, 0.7), 0 0 40px ${accentColor}33`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          transform: `scale(${contentScale * cardScale})`,
          zIndex: 10,
        }}
      >
        {/* Glowing Golden Star Icon */}
        <div
          style={{
            width: 90,
            height: 90,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${accentColor}, #ff8c00)`,
            boxShadow: `0 0 45px ${accentColor}aa`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${starScale}) rotate(${Math.sin(frame * 0.1) * 8}deg)`,
            marginBottom: 20,
          }}
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="#0A0A0F">
            <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
          </svg>
        </div>

        {/* Milestone Tagline */}
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
          {milestoneTitle}
        </div>

        {/* Big Star Count Ticker */}
        <div
          style={{
            fontSize: isVertical ? 64 : 88,
            fontWeight: 900,
            letterSpacing: "-0.04em",
            fontVariantNumeric: "tabular-nums",
            background: `linear-gradient(180deg, #FFFFFF 40%, ${accentColor} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: `0 0 40px ${accentColor}66`,
            margin: "4px 0",
          }}
        >
          ★ {Math.floor(starCount).toLocaleString()}
        </div>

        {/* Repo Identifier Pill */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 20px",
            borderRadius: 20,
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            border: "1px solid rgba(255, 255, 255, 0.16)",
            fontSize: 15,
            fontWeight: 600,
            fontFamily: "Consolas, monospace",
            color: "#FFFFFF",
            marginTop: 8,
          }}
        >
          {/* GitHub Octocat SVG */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#FFFFFF">
            <path d="M12 0C5.37 0 0 5.37 0 12C0 17.31 3.435 21.795 8.205 23.385C8.805 23.49 9.03 23.13 9.03 22.815C9.03 22.53 9.015 21.585 9.015 20.58C6 21.135 5.25 19.845 5.01 19.17C4.875 18.825 4.305 17.79 3.81 17.52C3.405 17.31 2.82 16.785 3.795 16.77C4.71 16.755 5.37 17.61 5.58 17.955C6.63 19.71 8.31 19.23 8.97 18.915C9.075 18.15 9.375 17.64 9.705 17.355C7.095 17.055 4.365 16.05 4.365 11.55C4.365 10.26 4.83 9.21 5.58 8.385C5.46 8.085 5.055 6.87 5.7 5.235C5.7 5.235 6.69 4.92 9.015 6.495C9.96 6.225 10.98 6.09 12 6.09C13.02 6.09 14.04 6.225 14.985 6.495C17.31 4.905 18.3 5.235 18.3 5.235C18.945 6.87 18.54 8.085 18.42 8.385C19.17 9.21 19.635 10.245 19.635 11.55C19.635 16.065 16.89 17.055 14.28 17.355C14.7 17.715 15.06 18.435 15.06 19.545C15.06 21.135 15.045 22.41 15.045 22.815C15.045 23.13 15.27 23.505 15.87 23.385C20.565 21.795 24 17.295 24 12C24 5.37 18.63 0 12 0Z" />
          </svg>
          <span>{repoName}</span>
        </div>

        {/* Thank You Note */}
        <p
          style={{
            fontSize: 14,
            color: "rgba(255, 255, 255, 0.6)",
            margin: "24px 0 0 0",
          }}
        >
          Thank you to all open-source contributors &amp; stargazers worldwide!
        </p>
      </div>
    </div>
  );
};

