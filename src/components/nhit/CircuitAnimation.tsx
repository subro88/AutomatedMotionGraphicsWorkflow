import React from "react";
import { useCurrentFrame } from "remotion";
import { NHIT_THEME } from "../../styles/nhitTheme";

interface CircuitAnimationProps {
  color?: string;
  glowColor?: string;
  opacity?: number;
  scale?: number;
  speed?: number;
}

export const CircuitAnimation: React.FC<CircuitAnimationProps> = ({
  color = NHIT_THEME.colors.electricBlue,
  glowColor = NHIT_THEME.colors.electricBlueGlow,
  opacity = 0.8,
  scale = 1.0,
  speed = 1.0,
}) => {
  const frame = useCurrentFrame();

  // Moving dash offsets for flowing electrical currents
  const flowOffset1 = (frame * 4 * speed) % 600;
  const flowOffset2 = (frame * 6 * speed) % 500;
  const flowOffset3 = (frame * 5 * speed) % 550;

  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      <svg
        viewBox="0 0 1000 600"
        style={{
          width: "100%",
          height: "100%",
          filter: `drop-shadow(0 0 8px ${glowColor})`,
        }}
      >
        <defs>
          <linearGradient id="traceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.1" />
            <stop offset="50%" stopColor={color} stopOpacity="0.8" />
            <stop offset="100%" stopColor={color} stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Static PCB Base Traces */}
        <g stroke={color} strokeWidth="1.5" strokeOpacity="0.2" fill="none">
          <path d="M 50 100 L 250 100 L 350 200 L 650 200 L 750 300 L 950 300" />
          <path d="M 100 450 L 300 450 L 400 350 L 600 350 L 700 450 L 900 450" />
          <path d="M 450 50 L 450 180 L 550 280 L 550 550" />
          <path d="M 200 500 L 280 420 L 280 250 L 380 150" />
          <path d="M 800 100 L 720 180 L 720 380 L 820 480" />
        </g>

        {/* Dynamic Flowing Energy Packets */}
        <g stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round">
          <path
            d="M 50 100 L 250 100 L 350 200 L 650 200 L 750 300 L 950 300"
            strokeDasharray="40 260"
            strokeDashoffset={-flowOffset1}
          />
          <path
            d="M 100 450 L 300 450 L 400 350 L 600 350 L 700 450 L 900 450"
            strokeDasharray="50 200"
            strokeDashoffset={flowOffset2}
          />
          <path
            d="M 450 50 L 450 180 L 550 280 L 550 550"
            strokeDasharray="30 180"
            strokeDashoffset={-flowOffset3}
          />
        </g>

        {/* Circuit Solder Pads & Microchips */}
        <g fill={color}>
          <circle cx="250" cy="100" r="4" opacity="0.8" />
          <circle cx="350" cy="200" r="4" opacity="0.8" />
          <circle cx="650" cy="200" r="4" opacity="0.8" />
          <circle cx="750" cy="300" r="4" opacity="0.8" />
          <circle cx="300" cy="450" r="4" opacity="0.8" />
          <circle cx="400" cy="350" r="4" opacity="0.8" />
          <circle cx="600" cy="350" r="4" opacity="0.8" />
          <circle cx="700" cy="450" r="4" opacity="0.8" />
        </g>

        {/* Microchip Outline */}
        <rect
          x="465"
          y="235"
          width="70"
          height="70"
          rx="6"
          fill="#07182E"
          stroke={color}
          strokeWidth="1.5"
        />
        <text
          x="500"
          y="275"
          textAnchor="middle"
          fill={color}
          fontSize="9"
          fontFamily={NHIT_THEME.fonts.mono}
          letterSpacing="1"
          opacity="0.9"
        >
          IC-DET
        </text>
      </svg>
    </div>
  );
};

