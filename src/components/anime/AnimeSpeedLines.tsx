import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

interface AnimeSpeedLinesProps {
  color?: string;
  density?: number;
  intensity?: number;
  center?: [number, number]; // [x, y] in px
}

export const AnimeSpeedLines: React.FC<AnimeSpeedLinesProps> = ({
  color = "rgba(255, 255, 255, 0.45)",
  density = 48,
  intensity = 1.0,
  center = [960, 540],
}) => {
  const frame = useCurrentFrame();

  const lines = React.useMemo(() => {
    const list = [];
    for (let i = 0; i < density; i++) {
      const angle = (i / density) * 2 * Math.PI;
      const seed = Math.sin(i * 999);
      const length = 400 + Math.abs(seed) * 300;
      const offsetRadius = 250 + (i % 3) * 60;
      list.push({ angle, length, offsetRadius, speedMod: 1 + (i % 5) * 0.2 });
    }
    return list;
  }, [density]);

  const pulse = interpolate(
    Math.sin(frame * 0.8),
    [-1, 1],
    [0.7 * intensity, 1.2 * intensity]
  );

  return (
    <svg
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 20,
        opacity: pulse,
        mixBlendMode: "overlay",
      }}
      viewBox="0 0 1920 1080"
    >
      <g transform={`translate(${center[0]}, ${center[1]})`}>
        {lines.map((l, idx) => {
          const wobble = Math.sin(frame * l.speedMod + idx) * 15;
          const r1 = l.offsetRadius + wobble;
          const r2 = r1 + l.length;
          const x1 = Math.cos(l.angle) * r1;
          const y1 = Math.sin(l.angle) * r1;
          const x2 = Math.cos(l.angle) * r2;
          const y2 = Math.sin(l.angle) * r2;

          return (
            <line
              key={idx}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={color}
              strokeWidth={idx % 2 === 0 ? 3 : 1.5}
              strokeLinecap="round"
            />
          );
        })}
      </g>
    </svg>
  );
};
