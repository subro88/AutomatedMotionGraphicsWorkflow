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

const ELIGIBILITY_RULES = [
  {
    tag: "ROUTE 1",
    title: "10+2 SCIENCE",
    desc: "Passed 10+2 with applicable subjects (Physics, Math & Chemistry / Vocational).",
    highlight: false,
  },
  {
    tag: "ROUTE 2",
    title: "10+2 VOCATIONAL",
    desc: "Passed 10+2 Vocational examination in Engineering & Technology stream.",
    highlight: false,
  },
  {
    tag: "ROUTE 3",
    title: "CLASS 10 + 2-YEAR ITI",
    desc: "Passed 10th standard + continuous 2-year ITI qualification in appropriate trade.",
    highlight: false,
  },
  {
    tag: "MANDATORY",
    title: "1 YEAR FULL-TIME WORK EXPERIENCE",
    desc: "Active continuous employment in registered industrial enterprise near NHIT.",
    highlight: true,
  },
];

export const InfographicScene04Eligibility: React.FC<SceneProps> = ({ isVertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sweep = interpolate(frame, [0, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
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
          flexDirection: isVertical ? "column" : "row",
          alignItems: "center",
          justifyContent: isVertical ? "center" : "space-between",
          padding: isVertical ? "20px 24px 85px" : "30px 80px 85px",
          boxSizing: "border-box",
          gap: isVertical ? "16px" : "40px",
        }}
      >
        {/* Left Side: 4 Qualification Cards */}
        <div style={{ flex: 1.3, width: isVertical ? "100%" : "auto" }}>
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
            ADMISSION ELIGIBILITY CHECKLIST
          </div>

          <h1
            style={{
              margin: "0 0 16px",
              fontFamily: NHIT_FLYER_THEME.fonts.headline,
              fontWeight: 900,
              fontSize: isVertical ? "22px" : "34px",
              color: NHIT_FLYER_THEME.colors.white,
              textTransform: "uppercase",
            }}
          >
            ARE YOU ELIGIBLE TO ENROL?
          </h1>

          <div style={{ display: "flex", flexDirection: "column", gap: isVertical ? "8px" : "12px" }}>
            {ELIGIBILITY_RULES.map((rule, idx) => {
              const spr = spring({
                frame: Math.max(0, frame - (8 + idx * 8)),
                fps,
                config: { damping: 95, mass: 0.8 },
              });
              const x = interpolate(spr, [0, 1], [-30, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              const op = interpolate(spr, [0, 0.4], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });

              return (
                <div
                  key={idx}
                  style={{
                    transform: `translateX(${x}px)`,
                    opacity: op,
                    backgroundColor: rule.highlight ? "rgba(211, 47, 47, 0.2)" : "rgba(15, 23, 42, 0.95)",
                    border: rule.highlight
                      ? `2px solid ${NHIT_FLYER_THEME.colors.primaryRed}`
                      : "1px solid rgba(255, 255, 255, 0.15)",
                    borderLeft: `8px solid ${rule.highlight ? NHIT_FLYER_THEME.colors.goldAccent : NHIT_FLYER_THEME.colors.primaryRed}`,
                    borderRadius: "6px",
                    padding: isVertical ? "10px 14px" : "14px 20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.6)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        backgroundColor: rule.highlight ? NHIT_FLYER_THEME.colors.primaryRed : "rgba(255,255,255,0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#FFFFFF",
                        fontFamily: NHIT_FLYER_THEME.fonts.headline,
                        fontWeight: 900,
                        fontSize: "14px",
                      }}
                    >
                      ✓
                    </div>
                    <div>
                      <div
                        style={{
                          fontFamily: NHIT_FLYER_THEME.fonts.headline,
                          fontWeight: 900,
                          fontSize: isVertical ? "14px" : "18px",
                          color: rule.highlight ? NHIT_FLYER_THEME.colors.goldAccent : "#FFFFFF",
                        }}
                      >
                        {rule.title}
                      </div>
                      <div
                        style={{
                          fontFamily: NHIT_FLYER_THEME.fonts.body,
                          fontSize: isVertical ? "11px" : "13px",
                          color: NHIT_FLYER_THEME.colors.textMuted,
                          marginTop: "2px",
                        }}
                      >
                        {rule.desc}
                      </div>
                    </div>
                  </div>

                  <span
                    style={{
                      backgroundColor: rule.highlight ? NHIT_FLYER_THEME.colors.goldAccent : "rgba(255, 255, 255, 0.1)",
                      color: rule.highlight ? "#0B0F19" : "#FFFFFF",
                      fontFamily: NHIT_FLYER_THEME.fonts.headline,
                      fontWeight: 900,
                      fontSize: "10px",
                      padding: "4px 8px",
                      borderRadius: "3px",
                      letterSpacing: "1px",
                    }}
                  >
                    {rule.tag}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center Hub */}
        <div style={{ flex: isVertical ? "none" : 0.8, display: "flex", justifyContent: "center" }}>
          <CentralInfographicHub
            isVertical={isVertical}
            customMetricLabel="EXPERIENCE REQUIREMENT"
            customMetricValue="1 YEAR"
            showCampusImage={false}
          />
        </div>
      </div>

      <LightSweep progress={sweep} color={NHIT_FLYER_THEME.colors.primaryRed} width={340} angle={25} />
    </AbsoluteFill>
  );
};

