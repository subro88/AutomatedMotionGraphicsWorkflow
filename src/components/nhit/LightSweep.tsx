import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { NHIT_THEME } from "../../styles/nhitTheme";

interface LightSweepProps {
  color?: string;
  triggerFrame?: number;
  durationInFrames?: number;
  angle?: number;
}

export const LightSweep: React.FC<LightSweepProps> = ({
  color = NHIT_THEME.colors.electricBlue,
  triggerFrame = 0,
  durationInFrames = 30,
  angle = 15,
}) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();

  const relFrame = Math.max(0, frame - triggerFrame);
  if (relFrame < 0 || relFrame > durationInFrames) {
    return null;
  }

  const progress = interpolate(relFrame, [0, durationInFrames], [-0.3, 1.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const opacity = interpolate(
    relFrame,
    [0, durationInFrames * 0.2, durationInFrames * 0.8, durationInFrames],
    [0, 0.85, 0.85, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const posX = progress * width;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        overflow: "hidden",
        opacity,
        zIndex: 50,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -200,
          left: posX,
          width: 140,
          height: "150%",
          transform: `rotate(${angle}deg)`,
          background: `linear-gradient(90deg, rgba(255,255,255,0) 0%, ${color} 50%, rgba(255,255,255,0) 100%)`,
          filter: `blur(8px) drop-shadow(0 0 25px ${color})`,
        }}
      />
    </div>
  );
};

