import React from "react";
import { useCurrentFrame } from "remotion";
import { NHIT_THEME } from "../../styles/nhitTheme";

interface LogoPlaceholderProps {
  size?: number;
  glow?: boolean;
}

export const LogoPlaceholder: React.FC<LogoPlaceholderProps> = ({
  size = 180,
  glow = true,
}) => {
  const frame = useCurrentFrame();

  const rotCompass = (frame * 0.5) % 360;
  const pulseRing = 1.0 + Math.sin(frame * 0.1) * 0.04;

  return (
    <div
      style={{
        width: size,
        height: size,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        filter: glow
          ? `drop-shadow(0 0 20px ${NHIT_THEME.colors.electricBlueGlow})`
          : undefined,
      }}
    >
      <svg
        viewBox="0 0 200 200"
        style={{ width: "100%", height: "100%", overflow: "visible" }}
      >
        <defs>
          <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0B2F5E" />
            <stop offset="100%" stopColor="#051429" />
          </linearGradient>
          <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={NHIT_THEME.colors.electricBlue} />
            <stop offset="50%" stopColor={NHIT_THEME.colors.industrialOrange} />
            <stop offset="100%" stopColor={NHIT_THEME.colors.electricBlue} />
          </linearGradient>
        </defs>

        {/* Outer Rotating Compass Ring */}
        <g transform={`translate(100, 100) rotate(${rotCompass})`}>
          <circle
            cx="0"
            cy="0"
            r="92"
            fill="none"
            stroke={NHIT_THEME.colors.electricBlue}
            strokeWidth="1.2"
            strokeDasharray="6 8"
            opacity="0.6"
          />
          <circle
            cx="0"
            cy="0"
            r="84"
            fill="none"
            stroke={NHIT_THEME.colors.industrialOrange}
            strokeWidth="1"
            strokeDasharray="18 40"
            opacity="0.8"
          />
        </g>

        {/* Inner Pulsing Shield (Hexagon) */}
        <polygon
          points="100,20 170,55 170,145 100,180 30,145 30,55"
          fill="url(#shieldGrad)"
          stroke="url(#borderGrad)"
          strokeWidth="3.5"
          transform={`scale(${pulseRing})`}
          transform-origin="100 100"
        />

        {/* Technical Gear / Orbit Ring */}
        <circle
          cx="100"
          cy="100"
          r="48"
          fill="none"
          stroke={NHIT_THEME.colors.electricBlue}
          strokeWidth="1.5"
          opacity="0.5"
        />

        {/* Stylized Torch / Engineering Beacon Motif */}
        <path
          d="M 100 62 L 115 88 L 105 88 L 110 115 L 90 115 L 95 88 L 85 88 Z"
          fill={NHIT_THEME.colors.industrialOrange}
          opacity="0.95"
        />

        {/* Technical Foundation Lines */}
        <line x1="60" y1="125" x2="140" y2="125" stroke={NHIT_THEME.colors.white} strokeWidth="2.5" />
        <line x1="72" y1="133" x2="128" y2="133" stroke={NHIT_THEME.colors.electricBlue} strokeWidth="2" />

        {/* Bold NHIT Monogram */}
        <text
          x="100"
          y="158"
          textAnchor="middle"
          fill={NHIT_THEME.colors.white}
          fontSize="17"
          fontWeight="900"
          fontFamily={NHIT_THEME.fonts.headline}
          letterSpacing="2.5"
        >
          NHIT
        </text>
      </svg>
    </div>
  );
};

