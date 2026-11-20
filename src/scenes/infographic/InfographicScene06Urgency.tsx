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

export const InfographicScene06Urgency: React.FC<SceneProps> = ({ isVertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sweep = interpolate(frame, [0, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const pulse = interpolate(
    Math.sin((frame / 15) * Math.PI * 2),
    [-1, 1],
    [0.92, 1.08],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const spr = spring({
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
      <ParticleSystem count={isVertical ? 25 : 40} seed={99} color={NHIT_FLYER_THEME.colors.primaryRed} speed={0.5} />

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
          padding: isVertical ? "20px 24px 85px" : "30px 80px 85px",
          boxSizing: "border-box",
          gap: isVertical ? "16px" : "40px",
        }}
      >
        {/* Left Side: High Urgency Banner Card */}
        <div
          style={{
            flex: 1.3,
            width: isVertical ? "100%" : "auto",
            transform: `scale(${interpolate(spr, [0, 1], [0.92, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })})`,
            opacity: interpolate(spr, [0, 0.4], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {/* Urgent Warning Beacon Pill */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              backgroundColor: NHIT_FLYER_THEME.colors.primaryRed,
              color: "#FFFFFF",
              fontFamily: NHIT_FLYER_THEME.fonts.headline,
              fontWeight: 900,
              fontSize: isVertical ? "12px" : "14px",
              padding: "6px 16px",
              borderRadius: "4px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              boxShadow: "0 0 20px rgba(211, 47, 47, 0.6)",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: "#FFFFFF",
                transform: `scale(${pulse})`,
              }}
            />
            LIMITED ADMISSION CAPACITY
          </div>

          <div
            style={{
              backgroundColor: "rgba(15, 23, 42, 0.96)",
              border: `3px solid ${NHIT_FLYER_THEME.colors.primaryRed}`,
              borderLeft: `12px solid ${NHIT_FLYER_THEME.colors.primaryRed}`,
              borderRadius: "10px",
              padding: isVertical ? "20px" : "30px 36px",
              boxShadow: "0 14px 45px rgba(211, 47, 47, 0.25)",
            }}
          >
            <h1
              style={{
                margin: 0,
                fontFamily: NHIT_FLYER_THEME.fonts.headline,
                fontWeight: 900,
                fontSize: isVertical ? "26px" : "40px",
                lineHeight: 1.15,
                color: NHIT_FLYER_THEME.colors.white,
                textTransform: "uppercase",
              }}
            >
              HURRY UP — LIMITED SEATS CAPACITY!
            </h1>

            <div
              style={{
                marginTop: "14px",
                color: NHIT_FLYER_THEME.colors.goldAccent,
                fontFamily: NHIT_FLYER_THEME.fonts.headline,
                fontWeight: 800,
                fontSize: isVertical ? "16px" : "22px",
              }}
            >
              ONLY 60 SEATS INTAKE ACROSS DURGAPUR REGION
            </div>

            <p
              style={{
                margin: "12px 0 0",
                fontFamily: NHIT_FLYER_THEME.fonts.body,
                fontSize: isVertical ? "14px" : "17px",
                color: NHIT_FLYER_THEME.colors.textMuted,
                lineHeight: 1.5,
              }}
            >
              NHIT brings you an exclusive opportunity to strengthen your technical qualifications without leaving your job. Apply immediately before seats fill.
            </p>
          </div>
        </div>

        {/* Center Hub */}
        <div style={{ flex: isVertical ? "none" : 0.8, display: "flex", justifyContent: "center" }}>
          <CentralInfographicHub
            isVertical={isVertical}
            customMetricLabel="SEATS ALLOCATED"
            customMetricValue="60"
            showCampusImage={false}
          />
        </div>
      </div>

      <LightSweep progress={sweep} color={NHIT_FLYER_THEME.colors.goldAccent} width={340} angle={25} />
    </AbsoluteFill>
  );
};

