import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  AbsoluteFill,
} from "remotion";
import { NHIT_THEME } from "../../styles/nhitTheme";
import { BlueprintBackground } from "../../components/nhit/BlueprintBackground";
import { CircuitAnimation } from "../../components/nhit/CircuitAnimation";
import { MechanicalGears } from "../../components/nhit/MechanicalGears";
import { SpringCounter } from "../../components/nhit/SpringCounter";
import { ParticleSystem } from "../../components/nhit/ParticleSystem";

export const Scene03EngineeringBranches: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  // 1. Center Split Opening spring (Frames 0-30)
  const splitSpr = spring({
    frame,
    fps,
    config: { damping: 100, mass: 0.8 },
  });
  const splitOffset = interpolate(splitSpr, [0, 1], [width / 2, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 2. Left Card Entrance (Electrical)
  const leftSpr = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 100, mass: 0.8 },
  });
  const leftX = interpolate(leftSpr, [0, 1], [-60, 0]);
  const leftOp = interpolate(leftSpr, [0, 0.4], [0, 1]);

  // 3. Right Card Entrance (Mechanical)
  const rightSpr = spring({
    frame: Math.max(0, frame - 18),
    fps,
    config: { damping: 100, mass: 0.8 },
  });
  const rightX = interpolate(rightSpr, [0, 1], [60, 0]);
  const rightOp = interpolate(rightSpr, [0, 0.4], [0, 1]);

  // 4. Energy Pulses and Animations
  const lightningPhase = (frame * 12) % 100;
  const shaftRot = (frame * 6) % 360;

  // 5. Exit Collapse Transition (Frames 130-150)
  const exitSpr = spring({
    frame: Math.max(0, frame - 130),
    fps,
    config: { damping: 90, mass: 0.9 },
  });
  const collapseScale = interpolate(exitSpr, [0, 1], [1, 0.1]);
  const collapseOpacity = interpolate(exitSpr, [0, 0.8], [1, 0]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: NHIT_THEME.colors.bgDark,
        overflow: "hidden",
      }}
    >
      <BlueprintBackground pulseGlow />
      <ParticleSystem count={25} />

      {/* Main Split Container */}
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          transform: `scale(${collapseScale})`,
          opacity: collapseOpacity,
          position: "relative",
        }}
      >
        {/* ================= LEFT HALF: ELECTRICAL ENGINEERING ================= */}
        <div
          style={{
            flex: 1,
            height: "100%",
            position: "relative",
            borderRight: "1px solid rgba(8, 126, 255, 0.3)",
            backgroundColor: "rgba(5, 18, 38, 0.75)",
            transform: `translateX(-${splitOffset}px)`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "40px 60px",
            overflow: "hidden",
          }}
        >
          {/* Animated Background Electrical Circuits */}
          <CircuitAnimation
            color={NHIT_THEME.colors.electricBlue}
            glowColor={NHIT_THEME.colors.electricBlueGlow}
            opacity={0.35}
            scale={0.9}
            speed={1.2}
          />

          {/* Left Card Content */}
          <div
            style={{
              position: "relative",
              zIndex: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              transform: `translateX(${leftX}px)`,
              opacity: leftOp,
              width: "100%",
              maxWidth: 620,
            }}
          >
            {/* Electrical Department Pillar Badge */}
            <div
              style={{
                padding: "6px 20px",
                borderRadius: 20,
                backgroundColor: "rgba(8, 126, 255, 0.15)",
                border: `1.5px solid ${NHIT_THEME.colors.electricBlue}`,
                fontFamily: NHIT_THEME.fonts.mono,
                fontSize: 13,
                fontWeight: "bold",
                color: NHIT_THEME.colors.electricBlue,
                letterSpacing: "0.2em",
                marginBottom: 20,
              }}
            >
              BRANCH 01 // DEPT. OF ELECTRICAL ENG.
            </div>

            {/* Electrical Technical Graphic (Transformer, Coils, Energy Lightning) */}
            <div style={{ width: 260, height: 200, marginBottom: 20 }}>
              <svg viewBox="0 0 260 200" style={{ width: "100%", height: "100%" }}>
                {/* Transformer Core */}
                <rect x="50" y="30" width="160" height="140" rx="10" fill="none" stroke="#087EFF" strokeWidth="4" />
                <rect x="90" y="60" width="80" height="80" rx="6" fill="#041224" stroke="#087EFF" strokeWidth="2.5" />
                
                {/* Primary & Secondary Induction Coils */}
                <path d="M 30 50 Q 50 65 30 80 Q 50 95 30 110 Q 50 125 30 140" fill="none" stroke="#FF9D32" strokeWidth="4" />
                <path d="M 230 50 Q 210 65 230 80 Q 210 95 230 110 Q 210 125 230 140" fill="none" stroke="#087EFF" strokeWidth="4" />

                {/* Center Dynamic Lightning Pulse */}
                <path
                  d="M 130 50 L 115 100 L 138 100 L 120 150"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  filter="drop-shadow(0 0 8px #087EFF)"
                  opacity={0.8 + Math.sin(frame * 0.4) * 0.2}
                />

                {/* Energy Indicator Dots */}
                <circle cx="50" cy="30" r="5" fill="#087EFF" />
                <circle cx="210" cy="30" r="5" fill="#087EFF" />
                <circle cx="50" cy="170" r="5" fill="#087EFF" />
                <circle cx="210" cy="170" r="5" fill="#087EFF" />
              </svg>
            </div>

            {/* Branch Title */}
            <h2
              style={{
                margin: 0,
                fontFamily: NHIT_THEME.fonts.headline,
                fontSize: 48,
                fontWeight: 900,
                color: NHIT_THEME.colors.white,
                letterSpacing: "0.02em",
                lineHeight: 1.1,
                textTransform: "uppercase",
              }}
            >
              ELECTRICAL
            </h2>
            <h3
              style={{
                margin: "4px 0 16px 0",
                fontFamily: NHIT_THEME.fonts.headline,
                fontSize: 34,
                fontWeight: 800,
                color: NHIT_THEME.colors.electricBlue,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                textShadow: `0 0 18px ${NHIT_THEME.colors.electricBlueGlow}`,
              }}
            >
              ENGINEERING
            </h3>

            {/* Approved Intake Counter Card */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "12px 28px",
                borderRadius: 12,
                backgroundColor: "rgba(8, 126, 255, 0.12)",
                border: `2px solid ${NHIT_THEME.colors.electricBlue}`,
                boxShadow: `0 0 20px rgba(8, 126, 255, 0.25)`,
              }}
            >
              <span
                style={{
                  fontFamily: NHIT_THEME.fonts.headline,
                  fontSize: 48,
                  fontWeight: 900,
                  color: NHIT_THEME.colors.electricBlue,
                  lineHeight: 1,
                }}
              >
                <SpringCounter from={0} to={30} startFrame={25} />
              </span>
              <div style={{ textAlign: "left" }}>
                <div
                  style={{
                    fontFamily: NHIT_THEME.fonts.headline,
                    fontSize: 16,
                    fontWeight: 800,
                    color: NHIT_THEME.colors.white,
                    letterSpacing: "0.08em",
                  }}
                >
                  APPROVED SEATS
                </div>
                <div
                  style={{
                    fontFamily: NHIT_THEME.fonts.mono,
                    fontSize: 11,
                    color: NHIT_THEME.colors.textMuted,
                  }}
                >
                  AICTE / WBSCT&amp;VE&amp;SD
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT HALF: MECHANICAL ENGINEERING ================= */}
        <div
          style={{
            flex: 1,
            height: "100%",
            position: "relative",
            borderLeft: "1px solid rgba(255, 157, 50, 0.3)",
            backgroundColor: "rgba(20, 16, 12, 0.75)",
            transform: `translateX(${splitOffset}px)`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "40px 60px",
            overflow: "hidden",
          }}
        >
          {/* Animated Background Gears */}
          <div style={{ position: "absolute", opacity: 0.3, transform: "scale(1.1)" }}>
            <MechanicalGears color={NHIT_THEME.colors.industrialOrange} speed={0.8} />
          </div>

          {/* Right Card Content */}
          <div
            style={{
              position: "relative",
              zIndex: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              transform: `translateX(${rightX}px)`,
              opacity: rightOp,
              width: "100%",
              maxWidth: 620,
            }}
          >
            {/* Mechanical Department Pillar Badge */}
            <div
              style={{
                padding: "6px 20px",
                borderRadius: 20,
                backgroundColor: "rgba(255, 157, 50, 0.15)",
                border: `1.5px solid ${NHIT_THEME.colors.industrialOrange}`,
                fontFamily: NHIT_THEME.fonts.mono,
                fontSize: 13,
                fontWeight: "bold",
                color: NHIT_THEME.colors.industrialOrange,
                letterSpacing: "0.2em",
                marginBottom: 20,
              }}
            >
              BRANCH 02 // DEPT. OF MECHANICAL ENG.
            </div>

            {/* Mechanical Technical Graphic (CNC Lathe, Shaft, Piston, Bearing) */}
            <div style={{ width: 260, height: 200, marginBottom: 20 }}>
              <svg viewBox="0 0 260 200" style={{ width: "100%", height: "100%" }}>
                {/* Lathe Shaft Bed */}
                <rect x="30" y="90" width="200" height="24" rx="4" fill="#1C1814" stroke="#FF9D32" strokeWidth="2" />
                
                {/* Rotating Flanged Shaft Components */}
                <g transform={`rotate(${shaftRot}, 130, 102)`}>
                  <circle cx="130" cy="102" r="32" fill="#0C1B2E" stroke="#FF9D32" strokeWidth="3" />
                  <circle cx="130" cy="102" r="14" fill="#FF9D32" />
                  <line x1="98" y1="102" x2="162" y2="102" stroke="#FFFFFF" strokeWidth="2.5" />
                  <line x1="130" y1="70" x2="130" y2="134" stroke="#FFFFFF" strokeWidth="2.5" />
                </g>

                {/* Left/Right Toolheads */}
                <path d="M 40 60 L 70 85 L 70 120 L 40 145 Z" fill="#09182A" stroke="#FF9D32" strokeWidth="2" />
                <path d="M 220 60 L 190 85 L 190 120 L 220 145 Z" fill="#09182A" stroke="#FF9D32" strokeWidth="2" />

                {/* CNC Tool Indicator Dimension Lines */}
                <line x1="30" y1="165" x2="230" y2="165" stroke="#94A3B8" strokeWidth="1" strokeDasharray="4 4" />
                <text x="130" y="180" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily={NHIT_THEME.fonts.mono}>
                  TOLERANCE ±0.005 MM
                </text>
              </svg>
            </div>

            {/* Branch Title */}
            <h2
              style={{
                margin: 0,
                fontFamily: NHIT_THEME.fonts.headline,
                fontSize: 48,
                fontWeight: 900,
                color: NHIT_THEME.colors.white,
                letterSpacing: "0.02em",
                lineHeight: 1.1,
                textTransform: "uppercase",
              }}
            >
              MECHANICAL
            </h2>
            <h3
              style={{
                margin: "4px 0 16px 0",
                fontFamily: NHIT_THEME.fonts.headline,
                fontSize: 34,
                fontWeight: 800,
                color: NHIT_THEME.colors.industrialOrange,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                textShadow: `0 0 18px ${NHIT_THEME.colors.industrialOrangeGlow}`,
              }}
            >
              ENGINEERING
            </h3>

            {/* Approved Intake Counter Card */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "12px 28px",
                borderRadius: 12,
                backgroundColor: "rgba(255, 157, 50, 0.12)",
                border: `2px solid ${NHIT_THEME.colors.industrialOrange}`,
                boxShadow: `0 0 20px rgba(255, 157, 50, 0.25)`,
              }}
            >
              <span
                style={{
                  fontFamily: NHIT_THEME.fonts.headline,
                  fontSize: 48,
                  fontWeight: 900,
                  color: NHIT_THEME.colors.industrialOrange,
                  lineHeight: 1,
                }}
              >
                <SpringCounter from={0} to={30} startFrame={32} />
              </span>
              <div style={{ textAlign: "left" }}>
                <div
                  style={{
                    fontFamily: NHIT_THEME.fonts.headline,
                    fontSize: 16,
                    fontWeight: 800,
                    color: NHIT_THEME.colors.white,
                    letterSpacing: "0.08em",
                  }}
                >
                  APPROVED SEATS
                </div>
                <div
                  style={{
                    fontFamily: NHIT_THEME.fonts.mono,
                    fontSize: 11,
                    color: NHIT_THEME.colors.textMuted,
                  }}
                >
                  AICTE / WBSCT&amp;VE&amp;SD
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Central Dynamic Energy Separator */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: 3,
            height: "100%",
            background: `linear-gradient(180deg, ${NHIT_THEME.colors.electricBlue}, #FFFFFF, ${NHIT_THEME.colors.industrialOrange})`,
            boxShadow: "0 0 16px #FFFFFF",
            zIndex: 30,
          }}
        >
          {/* Pulsing center node */}
          <div
            style={{
              position: "absolute",
              top: `${(frame * 2.5) % 100}%`,
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 14,
              height: 14,
              borderRadius: "50%",
              backgroundColor: "#FFFFFF",
              boxShadow: "0 0 15px #FFFFFF, 0 0 30px #087EFF",
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

