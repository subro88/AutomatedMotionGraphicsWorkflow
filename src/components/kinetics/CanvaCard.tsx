import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { THEME } from "../theme";

interface CanvaCardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  delay?: number;
  highlight?: boolean;
  className?: string;
  tiltAngle?: number;
}

export const CanvaCard: React.FC<CanvaCardProps> = ({
  children,
  style = {},
  delay = 0,
  highlight = false,
  tiltAngle = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: THEME.springs.gentle,
  });

  // Subtle floating hover motion after entrance
  const float = Math.sin((frame + delay * 5) * 0.04) * 3;

  const opacity = entrance;
  const translateY = (1 - entrance) * 35 + float;
  const scale = 0.94 + entrance * 0.06;

  return (
    <div
      style={{
        background: THEME.colors.white,
        borderRadius: THEME.borderRadius.card,
        boxShadow: highlight ? THEME.shadows.cardElevated : THEME.shadows.card,
        border: highlight
          ? `2px solid ${THEME.colors.orange}`
          : `1px solid ${THEME.colors.border}`,
        padding: "28px 32px",
        opacity,
        transform: `perspective(1200px) translateY(${translateY}px) scale(${scale}) rotateZ(${tiltAngle}deg)`,
        position: "relative",
        overflow: "hidden",
        boxSizing: "border-box",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
