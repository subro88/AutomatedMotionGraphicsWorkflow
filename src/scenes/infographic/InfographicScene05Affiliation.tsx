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

export const InfographicScene05Affiliation: React.FC<SceneProps> = ({ isVertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sweep = interpolate(frame, [0, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const spr1 = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: { damping: 95, mass: 0.8 },
  });
  const spr2 = spring({
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
        <div style={{ textAlign: "center", maxWidth: "1000px" }}>
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
            GOVERNMENT ACCREDITATION & APPROVAL
          </div>
          <h1
            style={{
              margin: 0,
              fontFamily: NHIT_FLYER_THEME.fonts.headline,
              fontWeight: 900,
              fontSize: isVertical ? "22px" : "34px",
              color: NHIT_FLYER_THEME.colors.white,
              textTransform: "uppercase",
            }}
          >
            AFFILIATED TO WBSCT&VE&SD • APPROVED BY AICTE
          </h1>
        </div>

        {/* Center Layout: Dual Accreditation Plates + Hub */}
        <div
          style={{
            display: "flex",
            flexDirection: isVertical ? "column" : "row",
            alignItems: "center",
            justifyContent: "center",
            gap: isVertical ? "14px" : "30px",
            width: "100%",
            maxWidth: "1400px",
          }}
        >
          {/* Card 1: State Council */}
          <div
            style={{
              flex: 1,
              width: isVertical ? "100%" : "auto",
              backgroundColor: "rgba(15, 23, 42, 0.96)",
              border: `2px solid ${NHIT_FLYER_THEME.colors.primaryRed}`,
              borderLeft: `8px solid ${NHIT_FLYER_THEME.colors.primaryRed}`,
              borderRadius: "10px",
              padding: isVertical ? "16px 20px" : "24px 28px",
              boxShadow: "0 10px 35px rgba(0,0,0,0.85)",
              transform: `translateY(${interpolate(spr1, [0, 1], [30, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })}px)`,
              opacity: interpolate(spr1, [0, 0.4], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            <div
              style={{
                backgroundColor: "rgba(211, 47, 47, 0.2)",
                color: NHIT_FLYER_THEME.colors.brightRed,
                fontFamily: NHIT_FLYER_THEME.fonts.headline,
                fontWeight: 900,
                fontSize: "11px",
                display: "inline-block",
                padding: "3px 10px",
                borderRadius: "4px",
                marginBottom: "8px",
              }}
            >
              STATE APEX BODY
            </div>
            <h2
              style={{
                margin: "0 0 6px",
                fontFamily: NHIT_FLYER_THEME.fonts.headline,
                fontWeight: 900,
                fontSize: isVertical ? "18px" : "22px",
                color: "#FFFFFF",
              }}
            >
              WEST BENGAL STATE COUNCIL
            </h2>
            <div style={{ color: NHIT_FLYER_THEME.colors.textMuted, fontSize: "13px", lineHeight: 1.4 }}>
              Technical & Vocational Education and Skill Development
            </div>
            <div style={{ marginTop: "12px", borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: "10px", fontSize: "12px" }}>
              <span style={{ color: "#94A3B8" }}>Memo:</span>{" "}
              <strong style={{ color: "#FFFFFF", fontFamily: NHIT_FLYER_THEME.fonts.mono }}>
                WBSCTVESD/TED/2026-27/AFF/DET/WP/0004
              </strong>
            </div>
          </div>

          {/* Center Hub */}
          <CentralInfographicHub
            isVertical={isVertical}
            customMetricLabel="ACCREDITATION STATUS"
            customMetricValue="AICTE"
            showCampusImage={false}
          />

          {/* Card 2: AICTE Approval */}
          <div
            style={{
              flex: 1,
              width: isVertical ? "100%" : "auto",
              backgroundColor: "rgba(15, 23, 42, 0.96)",
              border: `2px solid ${NHIT_FLYER_THEME.colors.goldAccent}`,
              borderLeft: `8px solid ${NHIT_FLYER_THEME.colors.goldAccent}`,
              borderRadius: "10px",
              padding: isVertical ? "16px 20px" : "24px 28px",
              boxShadow: "0 10px 35px rgba(0,0,0,0.85)",
              transform: `translateY(${interpolate(spr2, [0, 1], [30, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })}px)`,
              opacity: interpolate(spr2, [0, 0.4], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            <div
              style={{
                backgroundColor: "rgba(255, 184, 0, 0.2)",
                color: NHIT_FLYER_THEME.colors.goldAccent,
                fontFamily: NHIT_FLYER_THEME.fonts.headline,
                fontWeight: 900,
                fontSize: "11px",
                display: "inline-block",
                padding: "3px 10px",
                borderRadius: "4px",
                marginBottom: "8px",
              }}
            >
              NATIONAL REGULATOR
            </div>
            <h2
              style={{
                margin: "0 0 6px",
                fontFamily: NHIT_FLYER_THEME.fonts.headline,
                fontWeight: 900,
                fontSize: isVertical ? "18px" : "22px",
                color: "#FFFFFF",
              }}
            >
              AICTE APPROVED INTAKE
            </h2>
            <div style={{ color: NHIT_FLYER_THEME.colors.textMuted, fontSize: "13px", lineHeight: 1.4 }}>
              Working Professionals Category for Academic Session 2026–27
            </div>
            <div style={{ marginTop: "12px", borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: "10px", fontSize: "12px" }}>
              <span style={{ color: "#94A3B8" }}>Approved Intake:</span>{" "}
              <strong style={{ color: NHIT_FLYER_THEME.colors.goldAccent }}>Total 60 Seats (30 EE + 30 ME)</strong>
            </div>
          </div>
        </div>

        {/* Bottom Slogan Banner */}
        <div
          style={{
            backgroundColor: "rgba(211, 47, 47, 0.25)",
            border: `2px solid ${NHIT_FLYER_THEME.colors.primaryRed}`,
            borderRadius: "50px",
            padding: isVertical ? "8px 20px" : "10px 36px",
            textAlign: "center",
          }}
        >
          <span
            style={{
              color: "#FFFFFF",
              fontFamily: NHIT_FLYER_THEME.fonts.headline,
              fontWeight: 900,
              fontSize: isVertical ? "13px" : "17px",
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            “DON'T STOP AT EXPERIENCE. ADD A QUALIFICATION TO YOUR SKILLS.”
          </span>
        </div>
      </div>

      <LightSweep progress={sweep} color={NHIT_FLYER_THEME.colors.primaryRed} width={340} angle={25} />
    </AbsoluteFill>
  );
};

