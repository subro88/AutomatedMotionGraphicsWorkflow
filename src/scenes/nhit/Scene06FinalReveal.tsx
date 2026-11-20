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
import { LightSweep } from "../../components/nhit/LightSweep";

export const Scene06FinalReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance transition sweep (frames 0-22)
  const entrySweep = interpolate(frame, [0, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 1. Logo and Institution Header Animation (Frames 10-50)
  const logoSpring = spring({
    frame: Math.max(0, frame - 8),
    fps,
    config: { damping: 100, mass: 0.8 },
  });
  const logoScale = interpolate(logoSpring, [0, 1], [0.6, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const logoOpacity = interpolate(logoSpring, [0, 0.4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 2. Main Institution Title (Frames 20-55)
  const titleSpring = spring({
    frame: Math.max(0, frame - 18),
    fps,
    config: { damping: 95, mass: 0.85 },
  });
  const titleY = interpolate(titleSpring, [0, 1], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleOpacity = interpolate(titleSpring, [0, 0.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 3. Central Punchline (Frames 35-70)
  const punchSpring = spring({
    frame: Math.max(0, frame - 32),
    fps,
    config: { damping: 100, mass: 0.9 },
  });
  const punchScale = interpolate(punchSpring, [0, 1], [0.85, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const punchOpacity = interpolate(punchSpring, [0, 0.4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 4. Branch Summary Badges (Frames 45-80)
  const badgeSpringLeft = spring({
    frame: Math.max(0, frame - 42),
    fps,
    config: { damping: 100, mass: 0.8 },
  });
  const badgeXLeft = interpolate(badgeSpringLeft, [0, 1], [-60, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const badgeOpacityLeft = interpolate(badgeSpringLeft, [0, 0.4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const badgeSpringRight = spring({
    frame: Math.max(0, frame - 48),
    fps,
    config: { damping: 100, mass: 0.8 },
  });
  const badgeXRight = interpolate(badgeSpringRight, [0, 1], [60, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const badgeOpacityRight = interpolate(badgeSpringRight, [0, 0.4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 5. Call to Action & Website Box (Frames 60-95)
  const ctaSpring = spring({
    frame: Math.max(0, frame - 58),
    fps,
    config: { damping: 95, mass: 0.85 },
  });
  const ctaScale = interpolate(ctaSpring, [0, 1], [0.9, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ctaOpacity = interpolate(ctaSpring, [0, 0.3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtle pulsing glow on CTA box
  const ctaPulse = interpolate(
    Math.sin((frame / 30) * Math.PI * 2),
    [-1, 1],
    [0.6, 1.0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // 6. Footer and Tagline (Frames 70-105)
  const footerSpring = spring({
    frame: Math.max(0, frame - 68),
    fps,
    config: { damping: 100, mass: 0.8 },
  });
  const footerY = interpolate(footerSpring, [0, 1], [25, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const footerOpacity = interpolate(footerSpring, [0, 0.4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: NHIT_THEME.colors.bgNavy,
        overflow: "hidden",
        fontFamily: NHIT_THEME.fonts.body,
      }}
    >
      {/* 1. Animated Blueprint HUD Background */}
      <BlueprintBackground
        gridOpacity={0.16}
        showTechnicalHUD={true}
        statusLabel="ACADEMIC ADMISSIONS 2026-27 ACTIVE"
      />

      {/* 2. Background Technical Ambience (Circuits & Gears) */}
      <div
        style={{
          position: "absolute",
          top: -40,
          right: -40,
          opacity: 0.22,
          pointerEvents: "none",
        }}
      >
        <MechanicalGears size={340} baseSpeed={0.3} color={NHIT_THEME.colors.electricBlue} />
      </div>

      <div
        style={{
          position: "absolute",
          bottom: -20,
          left: -20,
          opacity: 0.25,
          pointerEvents: "none",
        }}
      >
        <CircuitAnimation
          width={700}
          height={320}
          color={NHIT_THEME.colors.industrialOrange}
          speed={0.7}
        />
      </div>

      {/* Floating Spark Particles */}
      <ParticleSystem count={32} seed={88} color={NHIT_THEME.colors.industrialOrange} speed={0.4} />
      <ParticleSystem count={24} seed={99} color={NHIT_THEME.colors.electricBlue} speed={0.5} />

      {/* 3. Main Brand Container */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "45px 80px 40px",
          boxSizing: "border-box",
        }}
      >
        {/* Top Header Section: Logo + Institution Name */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            transform: `scale(${logoScale}) translateY(${titleY}px)`,
            opacity: Math.min(logoOpacity, titleOpacity),
          }}
        >
          {/* Logo with energetic HUD ring */}
          <div style={{ position: "relative", marginBottom: "14px" }}>
            <LogoPlaceholder size={110} />
            {/* Spinning decorative tech reticle */}
            <svg
              style={{
                position: "absolute",
                top: -15,
                left: -15,
                width: 140,
                height: 140,
                transform: `rotate(${frame * 0.8}deg)`,
                pointerEvents: "none",
              }}
            >
              <circle
                cx="70"
                cy="70"
                r="64"
                fill="none"
                stroke={NHIT_THEME.colors.electricBlue}
                strokeWidth="1.5"
                strokeDasharray="16 12 6 12"
                opacity={0.6}
              />
            </svg>
          </div>

          <div
            style={{
              fontSize: "13px",
              fontFamily: NHIT_THEME.fonts.headline,
              color: NHIT_THEME.colors.industrialOrange,
              letterSpacing: "4px",
              fontWeight: 800,
              textTransform: "uppercase",
              marginBottom: "4px",
            }}
          >
            West Bengal State Council Approved (WBSCT&VE&SD)
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "36px",
              fontFamily: NHIT_THEME.fonts.headline,
              fontWeight: 900,
              color: NHIT_THEME.colors.white,
              letterSpacing: "2px",
              textTransform: "uppercase",
              textAlign: "center",
              lineHeight: 1.15,
              textShadow: "0 4px 20px rgba(0,0,0,0.6)",
            }}
          >
            THE NEW HORIZONS INSTITUTE OF TECHNOLOGY
          </h1>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginTop: "4px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "2px",
                backgroundColor: NHIT_THEME.colors.electricBlue,
              }}
            />
            <span
              style={{
                fontSize: "16px",
                fontFamily: NHIT_THEME.fonts.headline,
                fontWeight: 800,
                color: NHIT_THEME.colors.electricBlue,
                letterSpacing: "3px",
              }}
            >
              DURGAPUR, WEST BENGAL
            </span>
            <div
              style={{
                width: "40px",
                height: "2px",
                backgroundColor: NHIT_THEME.colors.electricBlue,
              }}
            />
          </div>
        </div>

        {/* Center Section: Core Punchline & Intake Badges */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            maxWidth: "1300px",
          }}
        >
          {/* Main Hero Punchline */}
          <div
            style={{
              transform: `scale(${punchScale})`,
              opacity: punchOpacity,
              textAlign: "center",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                fontSize: "15px",
                color: NHIT_THEME.colors.textMuted,
                letterSpacing: "3px",
                fontWeight: 700,
                textTransform: "uppercase",
                marginBottom: "6px",
              }}
            >
              DIPLOMA IN ENGINEERING FOR WORKING PROFESSIONALS • SESSION 2026–27
            </div>
            <div
              style={{
                fontSize: "44px",
                fontFamily: NHIT_THEME.fonts.headline,
                fontWeight: 900,
                color: NHIT_THEME.colors.white,
                letterSpacing: "1px",
                lineHeight: 1.2,
                textShadow: "0 4px 24px rgba(8,126,255,0.45)",
              }}
            >
              YOUR EXPERIENCE.{" "}
              <span style={{ color: NHIT_THEME.colors.electricBlue }}>
                YOUR QUALIFICATION.
              </span>{" "}
              <span style={{ color: NHIT_THEME.colors.industrialOrange }}>
                YOUR FUTURE.
              </span>
            </div>
          </div>

          {/* Two Approved Courses Badges */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "36px",
              width: "100%",
            }}
          >
            {/* Left: Electrical */}
            <div
              style={{
                flex: "1",
                maxWidth: "500px",
                transform: `translateX(${badgeXLeft}px)`,
                opacity: badgeOpacityLeft,
                backgroundColor: "rgba(8, 126, 255, 0.12)",
                border: "1.5px solid rgba(8, 126, 255, 0.45)",
                borderRadius: "10px",
                padding: "16px 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: "0 8px 30px rgba(8,126,255,0.18)",
                backdropFilter: "blur(6px)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "8px",
                    backgroundColor: "rgba(8, 126, 255, 0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: `1px solid ${NHIT_THEME.colors.electricBlue}`,
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M13 2L4 14H12L11 22L20 10H12L13 2Z"
                      stroke={NHIT_THEME.colors.electricBlue}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "18px",
                      fontFamily: NHIT_THEME.fonts.headline,
                      fontWeight: 800,
                      color: NHIT_THEME.colors.white,
                      letterSpacing: "0.5px",
                    }}
                  >
                    ELECTRICAL ENGINEERING
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: NHIT_THEME.colors.electricBlue,
                      letterSpacing: "1.5px",
                      fontWeight: 700,
                    }}
                  >
                    EVENING & FLEXIBLE SHIFT
                  </div>
                </div>
              </div>
              <div
                style={{
                  textAlign: "right",
                  paddingLeft: "16px",
                  borderLeft: "1px solid rgba(8,126,255,0.3)",
                }}
              >
                <span
                  style={{
                    fontSize: "28px",
                    fontFamily: NHIT_THEME.fonts.headline,
                    fontWeight: 900,
                    color: NHIT_THEME.colors.electricBlue,
                  }}
                >
                  30
                </span>
                <span
                  style={{
                    display: "block",
                    fontSize: "10px",
                    color: NHIT_THEME.colors.textMuted,
                    letterSpacing: "1px",
                    fontWeight: 700,
                  }}
                >
                  SEATS
                </span>
              </div>
            </div>

            {/* Right: Mechanical */}
            <div
              style={{
                flex: "1",
                maxWidth: "500px",
                transform: `translateX(${badgeXRight}px)`,
                opacity: badgeOpacityRight,
                backgroundColor: "rgba(255, 157, 50, 0.12)",
                border: "1.5px solid rgba(255, 157, 50, 0.45)",
                borderRadius: "10px",
                padding: "16px 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: "0 8px 30px rgba(255,157,50,0.18)",
                backdropFilter: "blur(6px)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "8px",
                    backgroundColor: "rgba(255, 157, 50, 0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: `1px solid ${NHIT_THEME.colors.industrialOrange}`,
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle
                      cx="12"
                      cy="12"
                      r="4"
                      stroke={NHIT_THEME.colors.industrialOrange}
                      strokeWidth="2"
                    />
                    <path
                      d="M12 2V5M12 19V22M2 12H5M19 12H22M4.9 4.9L7.1 7.1M16.9 16.9L19.1 19.1M4.9 19.1L7.1 16.9M16.9 7.1L19.1 4.9"
                      stroke={NHIT_THEME.colors.industrialOrange}
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "18px",
                      fontFamily: NHIT_THEME.fonts.headline,
                      fontWeight: 800,
                      color: NHIT_THEME.colors.white,
                      letterSpacing: "0.5px",
                    }}
                  >
                    MECHANICAL ENGINEERING
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: NHIT_THEME.colors.industrialOrange,
                      letterSpacing: "1.5px",
                      fontWeight: 700,
                    }}
                  >
                    PRACTICAL LAB-INTENSIVE
                  </div>
                </div>
              </div>
              <div
                style={{
                  textAlign: "right",
                  paddingLeft: "16px",
                  borderLeft: "1px solid rgba(255,157,50,0.3)",
                }}
              >
                <span
                  style={{
                    fontSize: "28px",
                    fontFamily: NHIT_THEME.fonts.headline,
                    fontWeight: 900,
                    color: NHIT_THEME.colors.industrialOrange,
                  }}
                >
                  30
                </span>
                <span
                  style={{
                    display: "block",
                    fontSize: "10px",
                    color: NHIT_THEME.colors.textMuted,
                    letterSpacing: "1px",
                    fontWeight: 700,
                  }}
                >
                  SEATS
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: High Impact Call to Action & Institutional Contact */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            transform: `translateY(${footerY}px) scale(${ctaScale})`,
            opacity: Math.min(ctaOpacity, footerOpacity),
          }}
        >
          {/* Main CTA Glow Banner */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "28px",
              background:
                "linear-gradient(90deg, rgba(8,126,255,0.25) 0%, rgba(255,157,50,0.25) 100%)",
              border: `2px solid ${NHIT_THEME.colors.industrialOrange}`,
              borderRadius: "50px",
              padding: "14px 44px",
              boxShadow: `0 0 35px rgba(255,157,50,${ctaPulse * 0.4})`,
              marginBottom: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: NHIT_THEME.colors.industrialOrange,
                  boxShadow: `0 0 10px ${NHIT_THEME.colors.industrialOrange}`,
                }}
              />
              <span
                style={{
                  fontSize: "18px",
                  fontFamily: NHIT_THEME.fonts.headline,
                  fontWeight: 900,
                  color: NHIT_THEME.colors.white,
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                }}
              >
                ENQUIRE NOW FOR ADMISSION 2026–27
              </span>
            </div>

            <div
              style={{
                width: "1px",
                height: "24px",
                backgroundColor: "rgba(255,255,255,0.3)",
              }}
            />

            <div
              style={{
                fontSize: "20px",
                fontFamily: NHIT_THEME.fonts.headline,
                fontWeight: 900,
                color: NHIT_THEME.colors.industrialOrange,
                letterSpacing: "2px",
              }}
            >
              WWW.NHIT.IN
            </div>
          </div>

          {/* Affiliation Memo & Tagline Footer */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              maxWidth: "1200px",
              borderTop: "1px solid rgba(255,255,255,0.15)",
              paddingTop: "10px",
              fontSize: "12px",
              color: NHIT_THEME.colors.textMuted,
              letterSpacing: "1px",
            }}
          >
            <div>
              <span style={{ color: NHIT_THEME.colors.white, fontWeight: 700 }}>
                Affiliation Memo:
              </span>{" "}
              WBSCTVESD/TED/2026-27/AFF/DET/WP/0004
            </div>

            <div
              style={{
                fontFamily: NHIT_THEME.fonts.headline,
                fontSize: "14px",
                fontWeight: 800,
                color: NHIT_THEME.colors.electricBlue,
                letterSpacing: "3px",
                textTransform: "uppercase",
              }}
            >
              “SHAPING ENGINEERS, BUILDING FUTURES.”
            </div>

            <div>
              <span style={{ color: NHIT_THEME.colors.white, fontWeight: 700 }}>
                Intake:
              </span>{" "}
              Total 60 Seats (30 EE + 30 ME)
            </div>
          </div>
        </div>
      </div>

      {/* Entrance Light Sweep */}
      <LightSweep
        progress={entrySweep}
        color={NHIT_THEME.colors.electricBlue}
        width={350}
        angle={25}
      />
    </AbsoluteFill>
  );
};
