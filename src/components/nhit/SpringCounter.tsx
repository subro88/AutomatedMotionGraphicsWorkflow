import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { NHIT_THEME } from "../../styles/nhitTheme";

interface SpringCounterProps {
  from?: number;
  to: number;
  startFrame?: number;
  prefix?: string;
  suffix?: string;
  style?: React.CSSProperties;
  color?: string;
}

export const SpringCounter: React.FC<SpringCounterProps> = ({
  from = 0,
  to,
  startFrame = 0,
  prefix = "",
  suffix = "",
  style,
  color = NHIT_THEME.colors.white,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relFrame = Math.max(0, frame - startFrame);

  const spr = spring({
    frame: relFrame,
    fps,
    config: {
      damping: 100,
      mass: 0.8,
      stiffness: 110,
    },
  });

  const currentVal = Math.round(
    interpolate(spr, [0, 1], [from, to], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  return (
    <span style={{ color, ...style }}>
      {prefix}
      {currentVal}
      {suffix}
    </span>
  );
};

