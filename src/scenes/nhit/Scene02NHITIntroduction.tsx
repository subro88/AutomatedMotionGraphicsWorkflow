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
import { LogoPlaceholder } from "../../components/nhit/LogoPlaceholder";
import { ParticleSystem } from "../../components/nhit/ParticleSystem";

export const Scene02NHITIntroduction: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. Scene Entrance Wipe
  const entryWipe = interpolate(frame, [0, 15], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 2. Logo Reveal spring (Frames 10-50)
  const logoSpring = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 100, mass: 0.8 },
  });
  const logoScale = interpolate(logoSpring, [0, 1], [0.3, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const logoOpacity = interpolate(logoSpring, [0, 0.4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 3. Blueprint Rings Drawing Around Logo
  const ringDash = interpolate(frame, [15, 65], [600, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 4. Institution Name Lines Staggered Entrance
  // Line 1: THE NEW HORIZONS (Frame 35)
  const line1Spr = spring({
    frame: Math.max(0, frame - 35),
    fps,
    config: { damping: 100, mass: 0.8 },
  });
  const line1Y = interpolate(line1Spr, [0, 1], [30, 0]);
  const line1Op = interpolate(line1Spr, [0, 0.4], [0, 1]);

  // Line 2: INSTITUTE OF TECHNOLOGY (Frame 45)
  const line2Spr = spring({
    frame: Math.max(0, frame - 45),
    fps,
    config: { damping: 100, mass: 0.8 },
  });
  const line2Y = interpolate(line2Spr, [0, 1], [30, 0]);
  const line2Op = interpolate(line2Spr, [0, 0.4], [0, 1]);

  // Line 3: DURGAPUR badge (Frame 55)
  const line3Spr = spring({
    frame: Math.max(0, frame - 55),
    fps,
    config: { damping: 100, mass: 0.8 },
  });
  const line3Scale = interpolate(line3Spr, [0, 1], [0.8, 1.0]);
  const line3Op = interpolate(line3Spr, [0, 0.4], [0, 1]);

  // Supporting Badge: DIPLOMA ENGINEERING FOR WORKING PROFESSIONALS (Frame 68)
  const badgeSpr = spring({
    frame: Math.max(0, frame - 68),
    fps,
    config: { damping: 100, mass: 0.8 },
  });
  const badgeY = interpolate(badgeSpr, [0, 1], [25, 0]);
  const badgeOp = interpolate(badgeSpr, [0, 0.4], [0, 1]);

  // Tagline: SHAPING ENGINEERS, BUILDING FUTURES (Frame 80)
  const tagSpr = spring({
    frame: Math.max(0, frame - 80),
    fps,
    config: { damping: 100, mass: 0.8 },
  });
  const tagOp = interpolate(tagSpr, [0, 0.5], [0, 1]);
  const tagTracking = interpolate(tagSpr, [0, 1], [0.3, 0.15]);

  // Rotating background radar rings
  const radarRot = (frame * 0.4) % 360;

  // Transition Out into Gears (Frames 130-150)
  const exitGearsScale = interpolate(frame, [125, 150], [0.8, 1.8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitGearsOpacity = interpolate(frame, [125, 145], [0, 0.9], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: NHIT_THEME.colors.bgNavy,
        overflow: "hidden",
      }}
    >
      <BlueprintBackground pulseGlow />
      <ParticleSystem count={30} />
      <CircuitAnimation opacity={0.2} scale={1.2} />

      {/* Center Technical Blueprint Compass Circles */}
      <div
        style={{
          position: "absolute",
          top: "45%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 700,
          height: 700,
          pointerEvents: "none",
        }}
      >
        <svg
          viewBox="0 0 700 700"
          style={{ width: "100%", height: "100%", overflow: "visible" }}
        >
          {/* Blueprint Drawn Circles */}
          <circle
            cx="350"
            cy="350"
            r="280"
            fill="none"
            stroke={NHIT_THEME.colors.electricBlue}
            strokeWidth="1.5"
            strokeDasharray="600"
            strokeDashoffset={ringDash}
            opacity="0.4"
          />
          <circle
            cx="350"
            cy="350"
            r="320"
            fill="none"
            stroke={NHIT_THEME.colors.industrialOrange}
            strokeWidth="1"
            strokeDasharray="12 24"
            transform={`rotate(${radarRot}, 350, 350)`}
            opacity="0.5"
          />
          {/* Radial Crosshairs */}
          <line x1="30" y1="350" x2="670" y2="350" stroke={NHIT_THEME.colors.electricBlue} strokeWidth="0.8" opacity="0.25" />
          <line x1="350" y1="30" x2="350" y2="670" stroke={NHIT_THEME.colors.electricBlue} strokeWidth="0.8" opacity="0.25" />
        </svg>
      </div>

      {/* Main Center Content Container */}
      <div
        style={{
          position: "absolute",
          top: "46%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          zIndex: 10,
          width: 1400,
        }}
      >
        {/* Animated NHIT Logo Reveal */}
        <div
          style={{
            transform: `scale(${logoScale})`,
            opacity: logoOpacity,
            marginBottom: 24,
          }}
        >
          <LogoPlaceholder size={170} glow />
        </div>

        {/* Institution Name: Line 1 */}
        <div style={{ transform: `translateY(${line1Y}px)`, opacity: line1Op }}>
          <h2
            style={{
              margin: 0,
              fontFamily: NHIT_THEME.fonts.headline,
              fontSize: 48,
              fontWeight: 900,
              color: NHIT_THEME.colors.white,
              letterSpacing: "0.08em",
              lineHeight: 1.1,
              textTransform: "uppercase",
            }}
          >
            THE NEW HORIZONS
          </h2>
        </div>

        {/* Institution Name: Line 2 */}
        <div style={{ transform: `translateY(${line2Y}px)`, opacity: line2Op }}>
          <h1
            style={{
              margin: 0,
              fontFamily: NHIT_THEME.fonts.headline,
              fontSize: 60,
              fontWeight: 900,
              color: NHIT_THEME.colors.electricBlue,
              letterSpacing: "0.04em",
              lineHeight: 1.15,
              textTransform: "uppercase",
              textShadow: `0 0 25px ${NHIT_THEME.colors.electricBlueGlow}`,
            }}
          >
            INSTITUTE OF TECHNOLOGY
          </h1>
        </div>

        {/* City Badge: DURGAPUR */}
        <div
          style={{
            transform: `scale(${line3Scale})`,
            opacity: line3Op,
            marginTop: 10,
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "6px 28px",
              backgroundColor: "rgba(255, 157, 50, 0.15)",
              border: `1.5px solid ${NHIT_THEME.colors.industrialOrange}`,
              borderRadius: 30,
              fontFamily: NHIT_THEME.fonts.headline,
              fontSize: 20,
              fontWeight: 800,
              color: NHIT_THEME.colors.industrialOrange,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              boxShadow: `0 0 16px ${NHIT_THEME.colors.industrialOrangeGlow}`,
            }}
          >
            DURGAPUR, WEST BENGAL
          </div>
        </div>

        {/* Supporting Headline: Diploma Engineering for Working Professionals */}
        <div
          style={{
            transform: `translateY(${badgeY}px)`,
            opacity: badgeOp,
            marginTop: 22,
          }}
        >
          <div
            style={{
              fontFamily: NHIT_THEME.fonts.body,
              fontSize: 24,
              fontWeight: 700,
              color: NHIT_THEME.colors.white,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            DIPLOMA ENGINEERING FOR WORKING PROFESSIONALS
          </div>
          <div
            style={{
              fontFamily: NHIT_THEME.fonts.mono,
              fontSize: 14,
              color: NHIT_THEME.colors.textMuted,
              marginTop: 6,
              letterSpacing: "0.1em",
            }}
          >
            APPROVED BY AICTE &bull; AFFILIATED TO WBSCT&amp;VE&amp;SD
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            opacity: tagOp,
            marginTop: 24,
            paddingTop: 16,
            borderTop: `1px solid rgba(8, 126, 255, 0.25)`,
            width: 700,
          }}
        >
          <span
            style={{
              fontFamily: NHIT_THEME.fonts.headline,
              fontSize: 18,
              fontWeight: 800,
              color: NHIT_THEME.colors.industrialOrange,
              letterSpacing: `${tagTracking}em`,
              textTransform: "uppercase",
            }}
          >
            "SHAPING ENGINEERS, BUILDING FUTURES."
          </span>
        </div>
      </div>

      {/* Transition Out: Giant Mechanical Gears & Circuit Wipe (Frames 125-150) */}
      {frame >= 120 && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: `translate(-50%, -50%) scale(${exitGearsScale})`,
            opacity: exitGearsOpacity,
            zIndex: 80,
            pointerEvents: "none",
          }}
        >
          <MechanicalGears color={NHIT_THEME.colors.industrialOrange} speed={2.5} />
        </div>
      )}

      {/* Entry wipe overlay */}
      {frame <= 15 && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: NHIT_THEME.colors.electricBlue,
            transform: `translateX(-${(1 - entryWipe) * 100}%)`,
            zIndex: 100,
          }}
        />
      )}
    </AbsoluteFill>
  );
};

