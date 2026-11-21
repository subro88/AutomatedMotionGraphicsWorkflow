import React from "react";
import { THEME } from "../theme";

interface CurvedSplineProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  curvature?: number; // offset distance for control points
  color?: string;
  lineWidth?: number;
  frame?: number;
  packetCount?: number;
}

export const CurvedSpline: React.FC<CurvedSplineProps> = ({
  x1,
  y1,
  x2,
  y2,
  curvature = 80,
  color = THEME.colors.blue,
  lineWidth = 4,
  frame = 0,
  packetCount = 3,
}) => {
  // SVG Viewport bounding box with padding
  const minX = Math.min(x1, x2) - 100;
  const minY = Math.min(y1, y2) - 100;
  const maxX = Math.max(x1, x2) + 100;
  const maxY = Math.max(y1, y2) + 100;
  const width = Math.max(maxX - minX, 200);
  const height = Math.max(maxY - minY, 200);

  // Local coordinates relative to SVG container
  const lx1 = x1 - minX;
  const ly1 = y1 - minY;
  const lx2 = x2 - minX;
  const ly2 = y2 - minY;

  // Cubic bezier control points (S-curve or natural droop)
  const dx = lx2 - lx1;
  const dy = ly2 - ly1;
  const cx1 = lx1 + dx * 0.25;
  const cy1 = ly1 + dy * 0.25 + curvature;
  const cx2 = lx1 + dx * 0.75;
  const cy2 = ly1 + dy * 0.75 - curvature;

  const pathD = `M ${lx1} ${ly1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${lx2} ${ly2}`;

  // Calculate packet positions along bezier approximation
  const packets = [];
  for (let i = 0; i < packetCount; i++) {
    const t = ((frame * 0.02 + i / packetCount) % 1.0);
    // Cubic bezier formula: B(t) = (1-t)^3 P0 + 3(1-t)^2 t P1 + 3(1-t) t^2 P2 + t^3 P3
    const mt = 1 - t;
    const px =
      mt * mt * mt * lx1 +
      3 * mt * mt * t * cx1 +
      3 * mt * t * t * cx2 +
      t * t * t * lx2;
    const py =
      mt * mt * mt * ly1 +
      3 * mt * mt * t * cy1 +
      3 * mt * t * t * cy2 +
      t * t * t * ly2;
    packets.push({ x: px, y: py });
  }

  return (
    <svg
      style={{
        position: "absolute",
        left: minX,
        top: minY,
        width,
        height,
        pointerEvents: "none",
        overflow: "visible",
        zIndex: 4,
      }}
      viewBox={`0 0 ${width} ${height}`}
    >
      <defs>
        <filter id="splineGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Background soft ambient stroke */}
      <path
        d={pathD}
        fill="none"
        stroke="rgba(41, 37, 36, 0.08)"
        strokeWidth={lineWidth + 2}
        strokeLinecap="round"
      />

      {/* Main animated dashed path */}
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={lineWidth}
        strokeLinecap="round"
        strokeDasharray="12 8"
        strokeDashoffset={-frame * 1.5}
        opacity={0.85}
      />

      {/* Flowing glowing data packets */}
      {packets.map((p, idx) => (
        <g key={idx} filter="url(#splineGlow)">
          <circle cx={p.x} cy={p.y} r={7} fill={color} />
          <circle cx={p.x} cy={p.y} r={3.5} fill="#FFFFFF" />
        </g>
      ))}
    </svg>
  );
};
