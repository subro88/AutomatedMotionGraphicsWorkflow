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
import { LightSweep } from "../../components/nhit/LightSweep";

export const Scene05ApprovedIntake: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. Central 60 Seats Explosion Entrance (Frames 5-45)
  const count60Spr = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: { damping: 100, mass: 0.8 },
  });
  const count60Scale = interpolate(count60Spr, [0, 1], [2.2, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const count60Op = interpolate(count60Spr, [0, 0.3], [0, 1]);

  // 2. Left Card (Electrical 30) Slide-in
  const leftSpr = spring({
    frame: Math.max(0, frame - 30),
    fps,
    config: { damping: 100, mass: 0.8 },
  });
  const leftX = interpolate(leftSpr, [0, 1], [-80, 0]);
  const leftOp = interpolate(leftSpr, [0, 0.4], [0, 1]);

  // 3. Right Card (Mechanical 30) Slide-in
  const rightSpr = spring({
    frame: Math.max(0, frame - 40),
    fps,
    config: { damping: 100, mass: 0.8 },
  });
  const rightX = interpolate(rightSpr, [0, 1], [80, 0]);
  const rightOp = interpolate(rightSpr, [0, 0.4], [0, 1]);

  // 4. Footer Affiliation Slide-up (Frame 55)
  const footSpr = spring({
    frame: Math.max(0, frame - 55),
    fps,
    config: { damping: 100, mass: 0.8 },
  });
  const footY = interpolate(footSpr, [0, 1], [30, 0]);
  const footOp = interpolate(footSpr, [0, 0.4], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: NHIT_THEME.colors.bgNavy,
        overflow: "hidden",
      }}
    >
      <BlueprintBackground pulseGlow />
      <ParticleSystem count={30} />

      {/* Main Layout Container */}
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "36px 80px",
          zIndex: 10,
        }}
      >
        {/* Top Header: 60 APPROVED SEATS */}
        <div
          style={{
            textAlign: "center",
            transform: `scale(${count60Scale})`,
            opacity: count60Op,
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "4px 20px",
              borderRadius: 20,
              backgroundColor: "rgba(255, 157, 50, 0.15)",
              border: `1.5px solid ${NHIT_THEME.colors.industrialOrange}`,
              fontFamily: NHIT_THEME.fonts.mono,
              fontSize: 12,
              fontWeight: "bold",
              color: NHIT_THEME.colors.industrialOrange,
              letterSpacing: "0.2em",
              marginBottom: 6,
            }}
          >
            TOTAL SANCTIONED CAPACITY // SESSION 2026–27
          </div>

          <h1
            style={{
              margin: 0,
              fontFamily: NHIT_THEME.fonts.headline,
              fontSize: 64,
              fontWeight: 900,
              color: NHIT_THEME.colors.white,
              letterSpacing: "0.02em",
              lineHeight: 1.05,
              textTransform: "uppercase",
            }}
          >
            <span
              style={{
                color: NHIT_THEME.colors.industrialOrange,
                textShadow: `0 0 35px ${NHIT_THEME.colors.industrialOrangeGlow}`,
              }}
            >
              <SpringCounter from={0} to={60} startFrame={8} />
            </span>{" "}
            APPROVED SEATS
          </h1>
        </div>

        {/* Center: Two 30-Seat Branch Cards */}
        <div
          style={{
            display: "flex",
            gap: 40,
            width: "100%",
            maxWidth: 1300,
            justifyContent: "center",
          }}
        >
          {/* LEFT: Electrical Engineering Card */}
          <div
            style={{
              flex: 1,
              position: "relative",
              height: 380,
              backgroundColor: "rgba(8, 25, 48, 0.85)",
              border: `2px solid ${NHIT_THEME.colors.electricBlue}`,
              borderRadius: 16,
              overflow: "hidden",
              padding: "32px 36px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: `0 12px 40px rgba(0,0,0,0.6), 0 0 25px ${NHIT_THEME.colors.electricBlueGlow}`,
              transform: `translateX(${leftX}px)`,
              opacity: leftOp,
            }}
          >
            {/* Pulsing Circuit in Card Background */}
            <div style={{ position: "absolute", top: 0, left: 0, opacity: 0.35 }}>
              <CircuitAnimation
                color={NHIT_THEME.colors.electricBlue}
                scale={0.8}
                speed={1.5}
              />
            </div>

            <div style={{ position: "relative", zIndex: 5 }}>
              <span
                style={{
                  fontFamily: NHIT_THEME.fonts.mono,
                  fontSize: 12,
                  color: NHIT_THEME.colors.electricBlue,
                  letterSpacing: "0.15em",
                  fontWeight: "bold",
                }}
              >
                COURSE INTAKE // BRANCH 01
              </span>
              <h2
                style={{
                  margin: "8px 0 0 0",
                  fontFamily: NHIT_THEME.fonts.headline,
                  fontSize: 34,
                  fontWeight: 900,
                  color: NHIT_THEME.colors.white,
                  letterSpacing: "0.02em",
                }}
              >
                ELECTRICAL ENGINEERING
              </h2>
            </div>

            {/* Giant 30 Counter */}
            <div style={{ position: "relative", zIndex: 5 }}>
              <div
                style={{
                  fontFamily: NHIT_THEME.fonts.headline,
                  fontSize: 90,
                  fontWeight: 900,
                  color: NHIT_THEME.colors.electricBlue,
                  lineHeight: 0.9,
                  textShadow: `0 0 30px ${NHIT_THEME.colors.electricBlueGlow}`,
                }}
              >
                <SpringCounter from={0} to={30} startFrame={38} />
              </div>
              <div
                style={{
                  fontFamily: NHIT_THEME.fonts.headline,
                  fontSize: 16,
                  fontWeight: 800,
                  color: NHIT_THEME.colors.white,
                  letterSpacing: "0.12em",
                  marginTop: 6,
                }}
              >
                APPROVED SEATS
              </div>
            </div>

            <div
              style={{
                position: "relative",
                zIndex: 5,
                borderTop: "1px solid rgba(8, 126, 255, 0.25)",
                paddingTop: 12,
                fontFamily: NHIT_THEME.fonts.mono,
                fontSize: 11,
                color: NHIT_THEME.colors.textMuted,
              }}
            >
              MEMO: WBSCTVESD/TED/2026-27/AFF/DET/WP/0004
            </div>
          </div>

          {/* RIGHT: Mechanical Engineering Card */}
          <div
            style={{
              flex: 1,
              position: "relative",
              height: 380,
              backgroundColor: "rgba(28, 20, 14, 0.85)",
              border: `2px solid ${NHIT_THEME.colors.industrialOrange}`,
              borderRadius: 16,
              overflow: "hidden",
              padding: "32px 36px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: `0 12px 40px rgba(0,0,0,0.6), 0 0 25px ${NHIT_THEME.colors.industrialOrangeGlow}`,
              transform: `translateX(${rightX}px)`,
              opacity: rightOp,
            }}
          >
            {/* Rotating Mechanical Gear in Background */}
            <div
              style={{
                position: "absolute",
                right: -40,
                bottom: -40,
                opacity: 0.35,
                transform: "scale(0.85)",
              }}
            >
              <MechanicalGears color={NHIT_THEME.colors.industrialOrange} speed={1.2} />
            </div>

            <div style={{ position: "relative", zIndex: 5 }}>
              <span
                style={{
                  fontFamily: NHIT_THEME.fonts.mono,
                  fontSize: 12,
                  color: NHIT_THEME.colors.industrialOrange,
                  letterSpacing: "0.15em",
                  fontWeight: "bold",
                }}
              >
                COURSE INTAKE // BRANCH 02
              </span>
              <h2
                style={{
                  margin: "8px 0 0 0",
                  fontFamily: NHIT_THEME.fonts.headline,
                  fontSize: 34,
                  fontWeight: 900,
                  color: NHIT_THEME.colors.white,
                  letterSpacing: "0.02em",
                }}
              >
                MECHANICAL ENGINEERING
              </h2>
            </div>

            {/* Giant 30 Counter */}
            <div style={{ position: "relative", zIndex: 5 }}>
              <div
                style={{
                  fontFamily: NHIT_THEME.fonts.headline,
                  fontSize: 90,
                  fontWeight: 900,
                  color: NHIT_THEME.colors.industrialOrange,
                  lineHeight: 0.9,
                  textShadow: `0 0 30px ${NHIT_THEME.colors.industrialOrangeGlow}`,
                }}
              >
                <SpringCounter from={0} to={30} startFrame={48} />
              </div>
              <div
                style={{
                  fontFamily: NHIT_THEME.fonts.headline,
                  fontSize: 16,
                  fontWeight: 800,
                  color: NHIT_THEME.colors.white,
                  letterSpacing: "0.12em",
                  marginTop: 6,
                }}
              >
                APPROVED SEATS
              </div>
            </div>

            <div
              style={{
                position: "relative",
                zIndex: 5,
                borderTop: "1px solid rgba(255, 157, 50, 0.25)",
                paddingTop: 12,
                fontFamily: NHIT_THEME.fonts.mono,
                fontSize: 11,
                color: NHIT_THEME.colors.textMuted,
              }}
            >
              AFFILIATION DATE: 06 NOVEMBER 2026
            </div>
          </div>
        </div>

        {/* Bottom Technical Affiliation Footer Banner */}
        <div
          style={{
            transform: `translateY(${footY}px)`,
            opacity: footOp,
            width: "100%",
            maxWidth: 1300,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 28px",
            backgroundColor: "rgba(6, 20, 38, 0.8)",
            borderRadius: 10,
            border: "1px solid rgba(8, 126, 255, 0.3)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: NHIT_THEME.colors.electricBlue,
                boxShadow: `0 0 10px ${NHIT_THEME.colors.electricBlue}`,
              }}
            />
            <span
              style={{
                fontFamily: NHIT_THEME.fonts.headline,
                fontSize: 13,
                fontWeight: 800,
                color: NHIT_THEME.colors.white,
                letterSpacing: "0.08em",
              }}
            >
              AFFILIATED TO WBSCT&amp;VE&amp;SD &bull; GOVT. OF WEST BENGAL
            </span>
          </div>

          <div
            style={{
              fontFamily: NHIT_THEME.fonts.mono,
              fontSize: 12,
              color: NHIT_THEME.colors.industrialOrange,
              letterSpacing: "0.1em",
            }}
          >
            ACADEMIC SESSION: 2026–27 (WORKING PROFESSIONALS)
          </div>
        </div>
      </div>

      {/* Exit Transition Light Streaks (Frames 130-150) */}
      {frame >= 128 && (
        <LightSweep
          color={NHIT_THEME.colors.electricBlue}
          triggerFrame={128}
          durationInFrames={22}
        />
      )}
    </AbsoluteFill>
  );
};

