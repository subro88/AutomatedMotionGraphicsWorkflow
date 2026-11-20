import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { NHIT_THEME } from "../../styles/nhitTheme";

interface ParticleSystemProps {
  count?: number;
  primaryColor?: string;
  secondaryColor?: string;
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({
  count = 35,
  primaryColor = NHIT_THEME.colors.electricBlue,
  secondaryColor = NHIT_THEME.colors.industrialOrange,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Generate deterministic particles using mathematical hashes
  const particles = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      // Deterministic pseudo-random seed based on index
      const seed1 = Math.sin(i * 127.1 + 311.7) * 43758.5453;
      const seed2 = Math.sin(i * 269.5 + 183.3) * 43758.5453;
      const seed3 = Math.sin(i * 419.2 + 371.9) * 43758.5453;

      const baseX = (seed1 - Math.floor(seed1)) * width;
      const baseY = (seed2 - Math.floor(seed2)) * height;
      const speedY = 0.4 + (seed3 - Math.floor(seed3)) * 0.8;
      const size = 2 + ((seed1 + seed2) % 3);
      const isOrange = i % 3 === 0;

      return {
        baseX,
        baseY,
        speedY,
        size,
        color: isOrange ? secondaryColor : primaryColor,
        phase: (i * 0.4) % (Math.PI * 2),
      };
    });
  }, [count, width, height, primaryColor, secondaryColor]);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width,
        height,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {particles.map((p, idx) => {
        const y = (p.baseY - frame * p.speedY * 2) % height;
        const currentY = y < 0 ? y + height : y;
        const xOffset = Math.sin(frame * 0.05 + p.phase) * 20;
        const currentX = p.baseX + xOffset;
        const opacity = 0.3 + 0.4 * Math.sin(frame * 0.08 + p.phase);

        return (
          <div
            key={idx}
            style={{
              position: "absolute",
              left: currentX,
              top: currentY,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              backgroundColor: p.color,
              boxShadow: `0 0 6px ${p.color}`,
              opacity,
            }}
          />
        );
      })}
    </div>
  );
};

