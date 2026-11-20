import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { NHIT_FLYER_THEME } from "../../styles/nhitFlyerTheme";
import { CentralInfographicHub } from "../../components/infographic/CentralInfographicHub";
import { LightSweep } from "../../components/nhit/LightSweep";
import { ParticleSystem } from "../../components/nhit/ParticleSystem";

interface SceneProps {
  isVertical?: boolean;
}

export const InfographicScene01Hook: React.FC<SceneProps> = ({ isVertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sweep = interpolate(frame, [0, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cardSpr = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: { damping: 95, mass: 0.8 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: NHIT_FLYER_THEME.colors.bgDark,
        overflow: "hidden",
        fontFamily: NHIT_FLYER_THEME.fonts.body,
      }}
    >
      {/* Background Ambience */}
      <ParticleSystem count={isVertical ? 20 : 35} seed={11} color={NHIT_FLYER_THEME.colors.primaryRed} speed={0.4} />

      {/* Main Responsive Grid Layout */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: isVertical ? "column" : "row",
          alignItems: "center",
          justifyContent: isVertical ? "center" : "space-between",
          padding: isVertical ? "20px 30px 90px" : "40px 90px 90px",
          boxSizing: "border-box",
          gap: isVertical ? "24px" : "40px",
        }}
      >
        {/* Left Side: Bold High-Contrast Text Plate */}
        <div
          style={{
            flex: isVertical ? "none" : 1.2,
            width: isVertical ? "100%" : "auto",
            transform: `translateX(${interpolate(cardSpr, [0, 1], [isVertical ? 0 : -40, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })}px)`,
            opacity: interpolate(cardSpr, [0, 0.4], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {/* Top Red Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: NHIT_FLYER_THEME.colors.primaryRed,
              color: "#FFFFFF",
              fontFamily: NHIT_FLYER_THEME.fonts.headline,
              fontWeight: 900,
              fontSize: isVertical ? "12px" : "14px",
              padding: "6px 16px",
              borderRadius: "4px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginBottom: "14px",
            }}
          >
            CAREER UPGRADE • 2026–27
          </div>

          {/* Solid Charcoal / Black Card */}
          <div
            style={{
              backgroundColor: "rgba(15, 23, 42, 0.96)",
              border: `2px solid ${NHIT_FLYER_THEME.colors.primaryRed}`,
              borderLeft: `10px solid ${NHIT_FLYER_THEME.colors.primaryRed}`,
              borderRadius: "10px",
              padding: isVertical ? "20px" : "30px 36px",
              boxShadow: "0 14px 45px rgba(0,0,0,0.85)",
            }}
          >
            <h1
              style={{
                margin: 0,
                fontFamily: NHIT_FLYER_THEME.fonts.headline,
                fontWeight: 900,
                fontSize: isVertical ? "28px" : "42px",
                lineHeight: 1.2,
                color: NHIT_FLYER_THEME.colors.white,
                textTransform: "uppercase",
              }}
            >
              YOU HAVE THE EXPERIENCE.{" "}
              <span style={{ color: NHIT_FLYER_THEME.colors.goldAccent }}>
                YOU HAVE THE SKILLS.
              </span>
            </h1>

            <div
              style={{
                marginTop: "16px",
                display: "inline-block",
                backgroundColor: "rgba(211, 47, 47, 0.2)",
                border: "1px solid #D32F2F",
                color: "#FFFFFF",
                fontFamily: NHIT_FLYER_THEME.fonts.headline,
                fontWeight: 800,
                fontSize: isVertical ? "15px" : "22px",
                padding: "8px 18px",
                borderRadius: "6px",
                letterSpacing: "0.5px",
              }}
            >
              NOW TAKE YOUR CAREER TO THE NEXT LEVEL!
            </div>

            <p
              style={{
                margin: "14px 0 0",
                fontFamily: NHIT_FLYER_THEME.fonts.body,
                fontSize: isVertical ? "14px" : "17px",
                color: NHIT_FLYER_THEME.colors.textMuted,
                lineHeight: 1.5,
              }}
            >
              Convert your practical on-the-job mastery into a government-recognized{" "}
              <strong style={{ color: "#FFFFFF" }}>AICTE & State Council Approved Diploma in Engineering</strong>.
            </p>
          </div>
        </div>

        {/* Center / Right: Dynamic Central Infographic Hub */}
        <div
          style={{
            flex: isVertical ? "none" : 0.9,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CentralInfographicHub
            isVertical={isVertical}
            customMetricLabel="EXPERIENCE TO DIPLOMA"
            customMetricValue="LEVEL UP"
            showCampusImage={true}
          />
        </div>
      </div>

      <LightSweep progress={sweep} color={NHIT_FLYER_THEME.colors.primaryRed} width={340} angle={25} />
    </AbsoluteFill>
  );
};

