import React from "react";
import { useCurrentFrame } from "remotion";
import { NHIT_THEME } from "../../styles/nhitTheme";

interface MechanicalGearsProps {
  color?: string;
  opacity?: number;
  scale?: number;
  speed?: number;
}

// Function to generate an SVG path for a gear with N teeth
function createGearPath(cx: number, cy: number, outerR: number, rootR: number, teeth: number): string {
  const points: string[] = [];
  const angleStep = (Math.PI * 2) / teeth;

  for (let i = 0; i < teeth; i++) {
    const a0 = i * angleStep;
    const a1 = a0 + angleStep * 0.25;
    const a2 = a0 + angleStep * 0.5;
    const a3 = a0 + angleStep * 0.75;
    const a4 = a0 + angleStep;

    const x0 = cx + Math.cos(a0) * rootR;
    const y0 = cy + Math.sin(a0) * rootR;

    const x1 = cx + Math.cos(a1) * outerR;
    const y1 = cy + Math.sin(a1) * outerR;

    const x2 = cx + Math.cos(a2) * outerR;
    const y2 = cy + Math.sin(a2) * outerR;

    const x3 = cx + Math.cos(a3) * rootR;
    const y3 = cy + Math.sin(a3) * rootR;

    const x4 = cx + Math.cos(a4) * rootR;
    const y4 = cy + Math.sin(a4) * rootR;

    if (i === 0) {
      points.push(`M ${x0.toFixed(1)} ${y0.toFixed(1)}`);
    }
    points.push(`L ${x1.toFixed(1)} ${y1.toFixed(1)}`);
    points.push(`L ${x2.toFixed(1)} ${y2.toFixed(1)}`);
    points.push(`L ${x3.toFixed(1)} ${y3.toFixed(1)}`);
    points.push(`L ${x4.toFixed(1)} ${y4.toFixed(1)}`);
  }
  points.push("Z");
  return points.join(" ");
}

export const MechanicalGears: React.FC<MechanicalGearsProps> = ({
  color = NHIT_THEME.colors.industrialOrange,
  opacity = 0.85,
  scale = 1.0,
  speed = 1.0,
}) => {
  const frame = useCurrentFrame();

  const rot1 = (frame * 0.75 * speed) % 360;
  const rot2 = (-rot1 * (16 / 10)) % 360;
  const rot3 = (rot1 * (16 / 6)) % 360;

  // Gear dimensions
  const g1Path = createGearPath(0, 0, 110, 92, 16);
  const g2Path = createGearPath(0, 0, 72, 60, 10);
  const g3Path = createGearPath(0, 0, 48, 38, 6);

  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        opacity,
        transform: `scale(${scale})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        viewBox="-250 -250 500 500"
        style={{
          width: 500,
          height: 500,
          filter: `drop-shadow(0 0 12px ${color}66)`,
        }}
      >
        {/* Main Drive Gear (Left / Center) */}
        <g
          transform={`translate(-50, 0) rotate(${rot1})`}
          stroke={color}
          strokeWidth="2"
          fill="none"
        >
          <path d={g1Path} fill="#091E38" fillOpacity="0.75" />
          <circle cx="0" cy="0" r="40" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="16" fill={color} fillOpacity="0.3" strokeWidth="2" />
          {/* 4 Cutout Spokes */}
          <line x1="-34" y1="0" x2="-18" y2="0" strokeWidth="4" />
          <line x1="18" y1="0" x2="34" y2="0" strokeWidth="4" />
          <line x1="0" y1="-34" x2="0" y2="-18" strokeWidth="4" />
          <line x1="0" y1="18" x2="0" y2="34" strokeWidth="4" />
        </g>

        {/* Secondary Driven Gear (Interlocking Top-Right) */}
        <g
          transform={`translate(108, -62) rotate(${rot2 + 10})`}
          stroke={color}
          strokeWidth="2"
          fill="none"
        >
          <path d={g2Path} fill="#091E38" fillOpacity="0.75" />
          <circle cx="0" cy="0" r="26" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="12" fill={color} fillOpacity="0.3" strokeWidth="2" />
          <line x1="-22" y1="0" x2="-14" y2="0" strokeWidth="3" />
          <line x1="14" y1="0" x2="22" y2="0" strokeWidth="3" />
        </g>

        {/* High-Speed Pinion Gear (Bottom-Right) */}
        <g
          transform={`translate(96, 78) rotate(${rot3 + 24})`}
          stroke={color}
          strokeWidth="2"
          fill="none"
        >
          <path d={g3Path} fill="#091E38" fillOpacity="0.75" />
          <circle cx="0" cy="0" r="18" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="8" fill={color} fillOpacity="0.4" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
};

