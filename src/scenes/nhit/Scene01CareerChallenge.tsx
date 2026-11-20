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
import { TechnicianFigure } from "../../components/nhit/TechnicianFigure";
import { LightSweep } from "../../components/nhit/LightSweep";
import { ParticleSystem } from "../../components/nhit/ParticleSystem";

export const Scene01CareerChallenge: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // 1. Initial fade-in from pure dark
  const bgOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 2. Headline 1: "YOU HAVE THE EXPERIENCE." (Frames 15-45)
  // Enters with horizontal clipping mask
  const spr1 = spring({
    frame: Math.max(0, frame - 15),
    fps,
    config: { damping: 100, mass: 0.8 },
  });
  const clipWidth1 = interpolate(spr1, [0, 1], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 3. Headline 2: "YOU HAVE THE SKILLS." (Frames 45-75)
  // Enters with 3D-style perspective movement
  const spr2 = spring({
    frame: Math.max(0, frame - 45),
    fps,
    config: { damping: 100, mass: 0.8 },
  });
  const rotX2 = interpolate(spr2, [0, 1], [60, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const translateY2 = interpolate(spr2, [0, 1], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity2 = interpolate(spr2, [0, 0.4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 4. Headline 3: "NOW UPGRADE YOURSELF." (Frames 75-105)
  // Enters with powerful scale animation
  const spr3 = spring({
    frame: Math.max(0, frame - 75),
    fps,
    config: { damping: 100, mass: 0.8 },
  });
  const scale3 = interpolate(spr3, [0, 1], [1.8, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity3 = interpolate(spr3, [0, 0.3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Light sweep beneath final headline
  const sweepProgress = interpolate(frame, [85, 125], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Transition out (Electric blue sweep covers screen frames 130-150)
  const exitWipe = interpolate(frame, [130, 150], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: NHIT_THEME.colors.bgNavy,
        overflow: "hidden",
        opacity: bgOpacity,
      }}
    >
      {/* Background blueprint grid & circuit patterns */}
      <BlueprintBackground pulseGlow />
      <CircuitAnimation opacity={0.35} scale={1.1} />

      {/* Floating technical dust & spark particles */}
      <ParticleSystem count={25} />

      {/* Background rotating gear mechanism behind the figure */}
      <div
        style={{
          position: "absolute",
          right: -80,
          bottom: 20,
          opacity: 0.25,
          transform: "scale(1.2)",
        }}
      >
        <MechanicalGears speed={0.5} />
      </div>

      {/* Technician & Console Programmatic Illustration */}
      <div
        style={{
          position: "absolute",
          right: 80,
          bottom: 40,
          opacity: interpolate(frame, [10, 35], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <TechnicianFigure scale={1.15} />
      </div>

      {/* Left Column: Animated High-Impact Typography */}
      <div
        style={{
          position: "absolute",
          left: 120,
          top: "50%",
          transform: "translateY(-50%)",
          width: 900,
          display: "flex",
          flexDirection: "column",
          gap: 24,
          zIndex: 10,
        }}
      >
        {/* Industry Pill Badge */}
        <div
          style={{
            alignSelf: "flex-start",
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 18px",
            borderRadius: 6,
            backgroundColor: "rgba(8, 126, 255, 0.15)",
            border: `1px solid ${NHIT_THEME.colors.electricBlue}`,
            fontFamily: NHIT_THEME.fonts.mono,
            fontSize: 13,
            fontWeight: "bold",
            color: NHIT_THEME.colors.electricBlue,
            letterSpacing: "0.2em",
            opacity: interpolate(frame, [5, 25], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: NHIT_THEME.colors.industrialOrange,
              boxShadow: `0 0 8px ${NHIT_THEME.colors.industrialOrange}`,
            }}
          />
          WORKING PROFESSIONALS CATEGORY // 2026–27
        </div>

        {/* Headline 1: Clipping Mask */}
        <div
          style={{
            overflow: "hidden",
            width: `${clipWidth1}%`,
            whiteSpace: "nowrap",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontFamily: NHIT_THEME.fonts.headline,
              fontSize: 56,
              fontWeight: 900,
              color: NHIT_THEME.colors.white,
              letterSpacing: "-0.01em",
              lineHeight: 1.1,
              textTransform: "uppercase",
            }}
          >
            YOU HAVE THE <span style={{ color: NHIT_THEME.colors.electricBlue }}>EXPERIENCE.</span>
          </h2>
        </div>

        {/* Headline 2: 3D Perspective Flip */}
        <div
          style={{
            perspective: 800,
            opacity: opacity2,
            transform: `translateY(${translateY2}px) rotateX(${rotX2}deg)`,
            transformOrigin: "center bottom",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontFamily: NHIT_THEME.fonts.headline,
              fontSize: 56,
              fontWeight: 900,
              color: NHIT_THEME.colors.white,
              letterSpacing: "-0.01em",
              lineHeight: 1.1,
              textTransform: "uppercase",
            }}
          >
            YOU HAVE THE <span style={{ color: NHIT_THEME.colors.industrialOrange }}>SKILLS.</span>
          </h2>
        </div>

        {/* Headline 3: Scale Impact Explosion with Orange Underline */}
        <div
          style={{
            opacity: opacity3,
            transform: `scale(${scale3})`,
            transformOrigin: "left center",
            marginTop: 8,
          }}
        >
          <h1
            style={{
              margin: 0,
              fontFamily: NHIT_THEME.fonts.headline,
              fontSize: 68,
              fontWeight: 900,
              color: NHIT_THEME.colors.industrialOrange,
              letterSpacing: "0.02em",
              lineHeight: 1.05,
              textTransform: "uppercase",
              textShadow: `0 0 30px ${NHIT_THEME.colors.industrialOrangeGlow}`,
            }}
          >
            NOW UPGRADE YOURSELF.
          </h1>

          {/* Orange Light Sweep Line Underneath */}
          <div
            style={{
              marginTop: 14,
              width: "100%",
              height: 4,
              backgroundColor: "rgba(255, 157, 50, 0.2)",
              position: "relative",
              overflow: "hidden",
              borderRadius: 2,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: `${sweepProgress - 40}%`,
                width: "40%",
                height: "100%",
                background: `linear-gradient(90deg, transparent, #FFFFFF, ${NHIT_THEME.colors.industrialOrange}, transparent)`,
                boxShadow: `0 0 14px ${NHIT_THEME.colors.industrialOrange}`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Cinematic Transition Sweep (Frames 130–150) */}
      {frame >= 125 && (
        <LightSweep
          color={NHIT_THEME.colors.electricBlue}
          triggerFrame={125}
          durationInFrames={25}
          angle={20}
        />
      )}

      {/* Final wipe to next scene */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: NHIT_THEME.colors.electricBlue,
          transform: `translateX(${(1 - exitWipe) * 100}%)`,
          pointerEvents: "none",
          zIndex: 100,
        }}
      />
    </AbsoluteFill>
  );
};

