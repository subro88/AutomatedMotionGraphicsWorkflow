import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface BroadcastBannerProps {
  category: string;
  categoryColor?: string;
  title: string;
  highlightWord?: string;
  highlightColor?: string;
  subtitle?: string;
  metaBadge?: string;
  alignment?: "left" | "center";
}

export const BroadcastBanner: React.FC<BroadcastBannerProps> = ({
  category,
  categoryColor = "#087EFF",
  title,
  highlightWord,
  highlightColor = "#FF9D32",
  subtitle,
  metaBadge,
  alignment = "left",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring with damping: 100
  const spr = spring({
    frame,
    fps,
    config: { damping: 100, mass: 0.8 },
  });

  const translateY = interpolate(spr, [0, 1], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(spr, [0, 0.4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const plateWidth = interpolate(spr, [0, 1], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Render title with optional highlighted word
  const renderTitle = () => {
    if (!highlightWord || !title.includes(highlightWord)) {
      return title;
    }
    const parts = title.split(highlightWord);
    return (
      <>
        {parts[0]}
        <span style={{ color: highlightColor, textShadow: `0 0 20px ${highlightColor}88` }}>
          {highlightWord}
        </span>
        {parts.slice(1).join(highlightWord)}
      </>
    );
  };

  return (
    <div
      style={{
        transform: `translateY(${translateY}px)`,
        opacity,
        display: "flex",
        flexDirection: "column",
        alignItems: alignment === "center" ? "center" : "flex-start",
        width: "100%",
        maxWidth: "1400px",
        margin: "0 auto",
      }}
    >
      {/* Category Pill / Tag */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "10px",
          backgroundColor: categoryColor,
          color: "#FFFFFF",
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 900,
          fontSize: "15px",
          letterSpacing: "3px",
          textTransform: "uppercase",
          padding: "7px 22px",
          borderRadius: "4px",
          boxShadow: `0 4px 16px ${categoryColor}66`,
          marginBottom: "12px",
        }}
      >
        <span
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: "#FFFFFF",
          }}
        />
        {category}
      </div>

      {/* Main Solid High-Contrast Banner Plate */}
      <div
        style={{
          position: "relative",
          width: "100%",
          backgroundColor: "rgba(3, 13, 26, 0.94)",
          borderLeft: `8px solid ${categoryColor}`,
          borderRight: "1px solid rgba(8, 126, 255, 0.3)",
          borderTop: "1px solid rgba(8, 126, 255, 0.2)",
          borderBottom: "1px solid rgba(8, 126, 255, 0.2)",
          padding: "24px 36px",
          boxSizing: "border-box",
          borderRadius: "0 8px 8px 0",
          boxShadow: "0 14px 45px rgba(0,0,0,0.85), inset 0 0 20px rgba(8,126,255,0.08)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Animated Underline Line */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: `${plateWidth}%`,
            height: "3px",
            background: `linear-gradient(90deg, ${categoryColor}, ${highlightColor})`,
          }}
        />

        {/* Major Headline */}
        <h1
          style={{
            margin: 0,
            fontFamily: "'Montserrat', 'Arial Black', sans-serif",
            fontWeight: 900,
            fontSize: "44px",
            lineHeight: 1.18,
            color: "#FFFFFF",
            letterSpacing: "0.5px",
            textTransform: "uppercase",
            textAlign: alignment,
            textShadow: "0 3px 12px rgba(0,0,0,0.9)",
          }}
        >
          {renderTitle()}
        </h1>

        {/* Supporting Subtitle & Meta Badge */}
        {(subtitle || metaBadge) && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: alignment === "center" ? "center" : "flex-start",
              gap: "20px",
              marginTop: "12px",
            }}
          >
            {metaBadge && (
              <span
                style={{
                  backgroundColor: "rgba(255, 157, 50, 0.2)",
                  border: "1px solid #FF9D32",
                  color: "#FF9D32",
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 800,
                  fontSize: "13px",
                  padding: "4px 12px",
                  borderRadius: "3px",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                }}
              >
                {metaBadge}
              </span>
            )}
            {subtitle && (
              <span
                style={{
                  color: "#94A3B8",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: "20px",
                  letterSpacing: "0.5px",
                }}
              >
                {subtitle}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

