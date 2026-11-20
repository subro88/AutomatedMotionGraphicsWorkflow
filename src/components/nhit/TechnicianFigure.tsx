import React from "react";
import { useCurrentFrame } from "remotion";
import { NHIT_THEME } from "../../styles/nhitTheme";

interface TechnicianFigureProps {
  scale?: number;
}

export const TechnicianFigure: React.FC<TechnicianFigureProps> = ({ scale = 1.0 }) => {
  const frame = useCurrentFrame();

  // Subtle breathing/working motion
  const armAngle = Math.sin(frame * 0.12) * 6;
  const indicatorWave = Math.sin(frame * 0.2) * 15;
  const signalSweep = (frame * 5) % 200;

  return (
    <div
      style={{
        position: "relative",
        width: 600,
        height: 520,
        transform: `scale(${scale})`,
        transformOrigin: "bottom center",
      }}
    >
      <svg
        viewBox="0 0 600 520"
        style={{ width: "100%", height: "100%", overflow: "visible" }}
      >
        <defs>
          <linearGradient id="panelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0E2A4D" />
            <stop offset="100%" stopColor="#06162B" />
          </linearGradient>
          <linearGradient id="screenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#087EFF" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#030D1A" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="visorGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#087EFF" />
            <stop offset="100%" stopColor="#FF9D32" />
          </linearGradient>
        </defs>

        {/* ---------------- INDUSTRIAL CONTROL CONSOLE ---------------- */}
        <g id="control-console">
          {/* Main Console Frame */}
          <path
            d="M 320 180 L 560 180 L 540 480 L 300 480 Z"
            fill="url(#panelGrad)"
            stroke={NHIT_THEME.colors.electricBlue}
            strokeWidth="2"
            opacity="0.9"
          />

          {/* Console Stand */}
          <rect x="400" y="480" width="40" height="40" fill="#061528" stroke={NHIT_THEME.colors.borderNavy} strokeWidth="2" />
          <line x1="340" y1="520" x2="500" y2="520" stroke={NHIT_THEME.colors.electricBlue} strokeWidth="3" />

          {/* Main Diagnostic Display Screen */}
          <rect
            x="335"
            y="200"
            width="200"
            height="140"
            rx="4"
            fill="url(#screenGrad)"
            stroke={NHIT_THEME.colors.electricBlue}
            strokeWidth="1.5"
          />

          {/* Oscilloscope Waveform on Screen */}
          <path
            d={`M 345 270 Q 370 ${250 + indicatorWave} 395 270 T 445 270 T 495 270 T 525 270`}
            fill="none"
            stroke={NHIT_THEME.colors.industrialOrange}
            strokeWidth="2.5"
            filter="drop-shadow(0 0 4px #FF9D32)"
          />

          {/* Secondary Telemetry Grid Bars */}
          <g fill={NHIT_THEME.colors.electricBlue} opacity="0.8">
            <rect x="345" y="215" width="22" height={40 + Math.sin(frame * 0.15) * 15} rx="2" />
            <rect x="375" y="215" width="22" height={55 + Math.cos(frame * 0.18) * 20} rx="2" />
            <rect x="405" y="215" width="22" height={30 + Math.sin(frame * 0.22) * 12} rx="2" />
            <rect x="435" y="215" width="22" height={65 + Math.cos(frame * 0.12) * 18} rx="2" />
          </g>

          {/* Digital Status Readout */}
          <text
            x="475"
            y="230"
            fill={NHIT_THEME.colors.white}
            fontSize="10"
            fontFamily={NHIT_THEME.fonts.mono}
            fontWeight="bold"
          >
            SYS.STATUS
          </text>
          <text
            x="475"
            y="245"
            fill={NHIT_THEME.colors.industrialOrange}
            fontSize="11"
            fontFamily={NHIT_THEME.fonts.mono}
            fontWeight="bold"
          >
            98.4% OK
          </text>

          {/* Physical Buttons & Dial Sliders */}
          <g fill="#163860">
            <circle cx="345" cy="375" r="10" fill={NHIT_THEME.colors.industrialOrange} />
            <circle cx="375" cy="375" r="10" fill={NHIT_THEME.colors.electricBlue} />
            <circle cx="405" cy="375" r="10" fill="#087EFF" opacity="0.6" />
            <rect x="435" y="365" width="85" height="20" rx="3" stroke={NHIT_THEME.colors.borderNavy} strokeWidth="1" />
            <circle cx={445 + signalSweep % 65} cy="375" r="5" fill={NHIT_THEME.colors.white} />
          </g>

          {/* Lower Access Hatch */}
          <rect x="330" y="415" width="180" height="45" rx="3" stroke={NHIT_THEME.colors.borderNavy} strokeWidth="1.5" fill="none" />
          <line x1="330" y1="437" x2="510" y2="437" stroke={NHIT_THEME.colors.borderNavy} strokeWidth="1" />
        </g>

        {/* ---------------- INDUSTRIAL TECHNICIAN FIGURE ---------------- */}
        <g id="technician-figure" transform="translate(40, 20)">
          {/* Work Boots */}
          <path d="M 120 460 L 175 460 L 175 490 L 115 490 Z" fill="#0A1C33" stroke={NHIT_THEME.colors.borderNavy} strokeWidth="2" />
          <path d="M 185 460 L 240 460 L 240 490 L 180 490 Z" fill="#0A1C33" stroke={NHIT_THEME.colors.borderNavy} strokeWidth="2" />

          {/* Industrial Cargo Pants */}
          <path
            d="M 125 320 L 175 320 L 170 465 L 120 465 Z"
            fill="#0D274A"
            stroke={NHIT_THEME.colors.electricBlue}
            strokeWidth="1.5"
          />
          <path
            d="M 175 320 L 225 320 L 235 465 L 185 465 Z"
            fill="#0D274A"
            stroke={NHIT_THEME.colors.electricBlue}
            strokeWidth="1.5"
          />
          {/* Knee Reinforcement Pads */}
          <rect x="130" y="380" width="35" height="30" rx="3" fill="#133866" stroke={NHIT_THEME.colors.industrialOrange} strokeWidth="1" />
          <rect x="190" y="380" width="35" height="30" rx="3" fill="#133866" stroke={NHIT_THEME.colors.industrialOrange} strokeWidth="1" />

          {/* Torso / Heavy Duty Engineering Jacket */}
          <path
            d="M 110 200 L 240 200 L 225 330 L 125 330 Z"
            fill="#0F335C"
            stroke={NHIT_THEME.colors.electricBlue}
            strokeWidth="2"
          />
          {/* High-Visibility Safety Harness Straps (Industrial Orange) */}
          <path d="M 140 200 L 150 330" stroke={NHIT_THEME.colors.industrialOrange} strokeWidth="7" />
          <path d="M 210 200 L 200 330" stroke={NHIT_THEME.colors.industrialOrange} strokeWidth="7" />
          <line x1="125" y1="280" x2="225" y2="280" stroke={NHIT_THEME.colors.industrialOrange} strokeWidth="7" />

          {/* Left Arm Resting at side */}
          <path
            d="M 110 210 L 85 290 L 95 360"
            fill="none"
            stroke="#0D274A"
            strokeWidth="24"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="95" cy="365" r="11" fill="#FF9D32" /> {/* Work Glove */}

          {/* Right Arm Reaching to Console (Animated Interactive Work) */}
          <g transform={`rotate(${armAngle}, 235, 220)`}>
            <path
              d="M 235 220 L 290 250 L 340 270"
              fill="none"
              stroke="#0D274A"
              strokeWidth="24"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Extended Hand / Stylus Operating Screen */}
            <circle cx="345" cy="272" r="11" fill="#FF9D32" />
            <line x1="345" y1="272" x2="360" y2="274" stroke={NHIT_THEME.colors.white} strokeWidth="3" />
            {/* Interactive Touch Spark */}
            <circle cx="360" cy="274" r={3 + Math.sin(frame * 0.3) * 2} fill={NHIT_THEME.colors.electricBlue} />
          </g>

          {/* Neck & Head */}
          <rect x="160" y="175" width="25" height="30" fill="#E2E8F0" />

          {/* Protective Industrial Hardhat / Helmet */}
          <path
            d="M 140 160 C 140 120 210 120 210 160 Z"
            fill={NHIT_THEME.colors.industrialOrange}
            stroke="#FFFFFF"
            strokeWidth="1.5"
          />
          {/* Hardhat Rim */}
          <path d="M 132 160 L 225 160" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
          {/* High-Tech HUD Smart Visor */}
          <path
            d="M 175 162 L 218 162 L 210 178 L 180 178 Z"
            fill="url(#visorGrad)"
            opacity="0.95"
            filter="drop-shadow(0 0 5px #087EFF)"
          />
        </g>
      </svg>
    </div>
  );
};

