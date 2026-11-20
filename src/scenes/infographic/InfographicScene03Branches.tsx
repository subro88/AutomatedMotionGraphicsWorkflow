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

interface SceneProps {
  isVertical?: boolean;
}

export const InfographicScene03Branches: React.FC<SceneProps> = ({ isVertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sweep = interpolate(frame, [0, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cardSpr1 = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: { damping: 95, mass: 0.8 },
  });
  const cardSpr2 = spring({
    frame: Math.max(0, frame - 15),
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
          padding: isVertical ? "20px 24px 85px" : "30px 80px 85px",
          boxSizing: "border-box",
        }}
      >
        {/* Top Header Plate */}
        <div style={{ textAlign: "center", maxWidth: "900px" }}>
          <div
            style={{
              display: "inline-block",
              backgroundColor: NHIT_FLYER_THEME.colors.primaryRed,
              color: "#FFFFFF",
              fontFamily: NHIT_FLYER_THEME.fonts.headline,
              fontWeight: 900,
              fontSize: isVertical ? "12px" : "13px",
              padding: "5px 16px",
              borderRadius: "4px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginBottom: "8px",
            }}
          >
            WORKING PROFESSIONALS CATEGORY • 2026–27
          </div>
          <h1
            style={{
              margin: 0,
              fontFamily: NHIT_FLYER_THEME.fonts.headline,
              fontWeight: 900,
              fontSize: isVertical ? "24px" : "36px",
              color: NHIT_FLYER_THEME.colors.white,
              textTransform: "uppercase",
            }}
          >
            CHOOSE YOUR NEXT STEP
          </h1>
        </div>

        {/* Center Layout: Left Card + Center Hub + Right Card */}
        <div
          style={{
            display: "flex",
            flexDirection: isVertical ? "column" : "row",
            alignItems: "center",
            justifyContent: "center",
            gap: isVertical ? "16px" : "30px",
            width: "100%",
            maxWidth: "1400px",
          }}
        >
          {/* Card 1: Electrical */}
          <div
            style={{
              flex: 1,
              width: isVertical ? "100%" : "auto",
              backgroundColor: "rgba(15, 23, 42, 0.96)",
              border: `2px solid ${NHIT_FLYER_THEME.colors.primaryRed}`,
              borderTop: `6px solid ${NHIT_FLYER_THEME.colors.primaryRed}`,
              borderRadius: "10px",
              padding: isVertical ? "16px 20px" : "24px 28px",
              boxShadow: "0 10px 35px rgba(0,0,0,0.85)",
              transform: `translateX(${interpolate(cardSpr1, [0, 1], [isVertical ? 0 : -35, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })}px)`,
              opacity: interpolate(cardSpr1, [0, 0.4], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span
                style={{
                  backgroundColor: "rgba(211, 47, 47, 0.2)",
                  color: NHIT_FLYER_THEME.colors.brightRed,
                  fontFamily: NHIT_FLYER_THEME.fonts.headline,
                  fontWeight: 800,
                  fontSize: "11px",
                  padding: "4px 10px",
                  borderRadius: "4px",
                }}
              >
                BRANCH: ELECTRICAL
              </span>
              <div
                style={{
                  backgroundColor: NHIT_FLYER_THEME.colors.primaryRed,
                  color: "#FFFFFF",
                  fontFamily: NHIT_FLYER_THEME.fonts.headline,
                  fontWeight: 900,
                  fontSize: isVertical ? "16px" : "20px",
                  padding: "4px 14px",
                  borderRadius: "6px",
                }}
              >
                30 SEATS
              </div>
            </div>

            <h2
              style={{
                margin: "12px 0 6px",
                fontFamily: NHIT_FLYER_THEME.fonts.headline,
                fontWeight: 900,
                fontSize: isVertical ? "20px" : "26px",
                color: "#FFFFFF",
              }}
            >
              ELECTRICAL ENGINEERING
            </h2>
            <div style={{ color: NHIT_FLYER_THEME.colors.textMuted, fontSize: "14px", lineHeight: 1.4 }}>
              Power systems, industrial drive controls, automated PLC instrumentation, and grid distribution.
            </div>
          </div>

          {/* Center Hub */}
          <CentralInfographicHub
            isVertical={isVertical}
            activeBranch="both"
            customMetricLabel="APPROVED INTAKE"
            customMetricValue="60"
            showCampusImage={true}
          />

          {/* Card 2: Mechanical */}
          <div
            style={{
              flex: 1,
              width: isVertical ? "100%" : "auto",
              backgroundColor: "rgba(15, 23, 42, 0.96)",
              border: `2px solid ${NHIT_FLYER_THEME.colors.goldAccent}`,
              borderTop: `6px solid ${NHIT_FLYER_THEME.colors.goldAccent}`,
              borderRadius: "10px",
              padding: isVertical ? "16px 20px" : "24px 28px",
              boxShadow: "0 10px 35px rgba(0,0,0,0.85)",
              transform: `translateX(${interpolate(cardSpr2, [0, 1], [isVertical ? 0 : 35, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })}px)`,
              opacity: interpolate(cardSpr2, [0, 0.4], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span
                style={{
                  backgroundColor: "rgba(255, 184, 0, 0.2)",
                  color: NHIT_FLYER_THEME.colors.goldAccent,
                  fontFamily: NHIT_FLYER_THEME.fonts.headline,
                  fontWeight: 800,
                  fontSize: "11px",
                  padding: "4px 10px",
                  borderRadius: "4px",
                }}
              >
                BRANCH: MECHANICAL
              </span>
              <div
                style={{
                  backgroundColor: NHIT_FLYER_THEME.colors.goldAccent,
                  color: "#0B0F19",
                  fontFamily: NHIT_FLYER_THEME.fonts.headline,
                  fontWeight: 900,
                  fontSize: isVertical ? "16px" : "20px",
                  padding: "4px 14px",
                  borderRadius: "6px",
                }}
              >
                30 SEATS
              </div>
            </div>

            <h2
              style={{
                margin: "12px 0 6px",
                fontFamily: NHIT_FLYER_THEME.fonts.headline,
                fontWeight: 900,
                fontSize: isVertical ? "20px" : "26px",
                color: "#FFFFFF",
              }}
            >
              MECHANICAL ENGINEERING
            </h2>
            <div style={{ color: NHIT_FLYER_THEME.colors.textMuted, fontSize: "14px", lineHeight: 1.4 }}>
              CNC manufacturing, thermal engineering, robotics, CAD modeling, and industrial fabrication.
            </div>
          </div>
        </div>
      </div>

      <LightSweep progress={sweep} color={NHIT_FLYER_THEME.colors.primaryRed} width={340} angle={25} />
    </AbsoluteFill>
  );
};

