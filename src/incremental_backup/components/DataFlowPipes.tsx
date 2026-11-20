import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { THEME } from "../theme";

export interface DataFlowPipeProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  curvature?: number; // Curvature offset in px (0 for straight orthogonal)
  color?: string; // Theme color: orange, blue, green, red
  lineWidth?: number;
  speed?: number; // Speed multiplier for packet flow
  packetCount?: number;
  isLatching?: boolean; // Whether data block latches into target
  latchFrame?: number; // Frame when block latches and triggers save ripple
  label?: string;
  style?: React.CSSProperties;
}

export const DataFlowPipes: React.FC<DataFlowPipeProps> = ({
  startX,
  startY,
  endX,
  endY,
  curvature = 40,
  color = THEME.colors.orange,
  lineWidth = 4,
  speed = 1.2,
  packetCount = 3,
  isLatching = true,
  latchFrame = 30,
  label,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Compute bounding box for SVG
  const minX = Math.min(startX, endX) - 60;
  const minY = Math.min(startY, endY) - 60;
  const width = Math.max(120, Math.abs(endX - startX) + 120);
  const height = Math.max(120, Math.abs(endY - startY) + 120);

  // Local coordinates inside SVG viewbox
  const p1x = startX - minX;
  const p1y = startY - minY;
  const p2x = endX - minX;
  const p2y = endY - minY;

  // Midpoint control points for smooth ergonomic S-curve / bus cable
  const midX = (p1x + p2x) / 2;
  const c1x = midX;
  const c1y = p1y;
  const c2x = midX;
  const c2y = p2y;

  const pathD = `M ${p1x} ${p1y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2x} ${p2y}`;

  // Packets progress along curve (0.0 to 1.0)
  const packets = Array.from({ length: packetCount }, (_, i) => {
    const offset = i / packetCount;
    const progress = ((frame * speed * 0.02) + offset) % 1.0;
    
    // Cubic Bezier interpolation for position: B(t) = (1-t)^3 P0 + 3(1-t)^2 t P1 + 3(1-t) t^2 P2 + t^3 P3
    const t = progress;
    const mt = 1 - t;
    const x = mt * mt * mt * p1x + 3 * mt * mt * t * c1x + 3 * mt * t * t * c2x + t * t * t * p2x;
    const y = mt * mt * mt * p1y + 3 * mt * mt * t * c1y + 3 * mt * t * t * c2y + t * t * t * p2y;

    return { progress, x, y };
  });

  // Save ripple animation at target point
  const latchTime = Math.max(0, frame - latchFrame);
  const rippleProgress = (latchTime % (fps * 1.5)) / (fps * 1.5);
  const rippleScale = 0.5 + rippleProgress * 2.8;
  const rippleOpacity = Math.max(0, 1 - rippleProgress);

  return (
    <div
      style={{
        position: "absolute",
        left: minX,
        top: minY,
        width,
        height,
        pointerEvents: "none",
        zIndex: 5,
        ...style,
      }}
    >
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: "visible" }}>
        <defs>
          {/* Glowing Filter */}
          <filter id={`glow-${minX}-${minY}`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Pipe Linear Gradient */}
          <linearGradient id={`pipeGrad-${minX}-${minY}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="50%" stopColor={color} stopOpacity="0.85" />
            <stop offset="100%" stopColor={color} stopOpacity="0.95" />
          </linearGradient>
        </defs>

        {/* Outer Conduit Shadow / Track */}
        <path
          d={pathD}
          fill="none"
          stroke="rgba(41, 37, 36, 0.08)"
          strokeWidth={lineWidth + 6}
          strokeLinecap="round"
        />

        {/* Base Glowing Bus Cable */}
        <path
          d={pathD}
          fill="none"
          stroke={`url(#pipeGrad-${minX}-${minY})`}
          strokeWidth={lineWidth}
          strokeLinecap="round"
          filter={`url(#glow-${minX}-${minY})`}
        />

        {/* High-frequency animated dash shimmer */}
        <path
          d={pathD}
          fill="none"
          stroke="#FFFFFF"
          strokeWidth={lineWidth * 0.45}
          strokeDasharray="8 20"
          strokeDashoffset={-frame * speed * 2.5}
          strokeLinecap="round"
          opacity={0.8}
        />

        {/* Port Terminal Dots */}
        <circle cx={p1x} cy={p1y} r={lineWidth + 3} fill={color} filter={`url(#glow-${minX}-${minY})`} />
        <circle cx={p1x} cy={p1y} r={lineWidth} fill="#FFFFFF" />

        <circle cx={p2x} cy={p2y} r={lineWidth + 3} fill={color} filter={`url(#glow-${minX}-${minY})`} />
        <circle cx={p2x} cy={p2y} r={lineWidth} fill="#FFFFFF" />

        {/* Traveling Energy Photons / Light Packets */}
        {packets.map((pkt, idx) => (
          <g key={idx} transform={`translate(${pkt.x}, ${pkt.y})`}>
            {/* Outer soft glow ring */}
            <circle r={12} fill={color} opacity={0.35} filter={`url(#glow-${minX}-${minY})`} />
            {/* Core bright photon */}
            <circle r={6} fill="#FFFFFF" filter={`url(#glow-${minX}-${minY})`} />
            <circle r={3} fill={color} />
          </g>
        ))}

        {/* Destination Latching & Save Ripple */}
        {isLatching && frame >= latchFrame && (
          <g transform={`translate(${p2x}, ${p2y})`}>
            {/* Expanding Shockwave Ripple */}
            <circle
              r={18 * rippleScale}
              fill="none"
              stroke={color}
              strokeWidth={3}
              opacity={rippleOpacity}
              filter={`url(#glow-${minX}-${minY})`}
            />
            <circle
              r={12 * rippleScale * 0.7}
              fill="none"
              stroke="#10B981"
              strokeWidth={2}
              opacity={rippleOpacity * 0.8}
            />

            {/* Pulsing Latch Checkmark Badge */}
            <g transform="translate(18, -26)">
              <rect
                x="-8"
                y="-14"
                width="64"
                height="22"
                rx="11"
                fill="#10B981"
                filter={`url(#glow-${minX}-${minY})`}
              />
              <text
                x="24"
                y="1"
                fill="#FFFFFF"
                fontSize="10"
                fontWeight="800"
                textAnchor="middle"
                fontFamily="Inter, sans-serif"
              >
                ✓ SAVED
              </text>
            </g>
          </g>
        )}
      </svg>

      {/* Optional Cable Label Badge */}
      {label && (
        <div
          style={{
            position: "absolute",
            left: (p1x + p2x) / 2 - 45,
            top: (p1y + p2y) / 2 - 14,
            padding: "4px 12px",
            borderRadius: "12px",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(8px)",
            border: `1.5px solid ${color}`,
            boxShadow: "0 4px 14px rgba(41, 37, 36, 0.12)",
            fontSize: "11px",
            fontWeight: 800,
            color: THEME.colors.charcoal,
            whiteSpace: "nowrap",
            zIndex: 10,
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
};
