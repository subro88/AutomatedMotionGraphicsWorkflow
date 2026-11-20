import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BlueprintBackground } from "../../components/nhit/BlueprintBackground";
import { BroadcastBanner } from "../../components/broadcast/BroadcastBanner";
import { LightSweep } from "../../components/nhit/LightSweep";

const ELIGIBILITY_ITEMS = [
  {
    code: "01",
    title: "10+2 SCIENCE",
    desc: "Passed 10+2 examination with Physics, Mathematics & Chemistry or Technical subjects.",
    color: "#087EFF",
  },
  {
    code: "02",
    title: "10+2 VOCATIONAL",
    desc: "Passed 10+2 Vocational examination in Engineering & Technology specialization.",
    color: "#087EFF",
  },
  {
    code: "03",
    title: "CLASS 10 + 2-YEAR ITI",
    desc: "Passed 10th standard examination plus continuous 2-year ITI trade certificate.",
    color: "#087EFF",
  },
  {
    code: "REQUIRED",
    title: "MINIMUM 1 YEAR FULL-TIME WORK EXPERIENCE",
    desc: "Active employment in registered industrial organization within 50 KM of NHIT campus.",
    color: "#FF9D32",
    highlight: true,
  },
];

export const BroadcastScene04Eligibility: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sweep = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#071B33",
        overflow: "hidden",
        fontFamily: "'Montserrat', 'Inter', sans-serif",
      }}
    >
      <BlueprintBackground gridOpacity={0.15} showTechnicalHUD={true} statusLabel="ELIGIBILITY VERIFICATION CHECK" />

      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "40px 80px 80px",
          boxSizing: "border-box",
          justifyContent: "space-between",
        }}
      >
        <BroadcastBanner
          category="CANDIDATE ELIGIBILITY GUIDELINES"
          categoryColor="#FF9D32"
          title="ARE YOU ELIGIBLE TO ENROL?"
          highlightWord="ELIGIBLE"
          highlightColor="#087EFF"
          subtitle="ANY ONE ACADEMIC QUALIFICATION + 1 YEAR REGULAR INDUSTRY WORK EXPERIENCE"
          metaBadge="CRITERIA CHECK"
          alignment="left"
        />

        {/* 4 Staggered Solid Eligibility Plates */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", width: "100%" }}>
          {ELIGIBILITY_ITEMS.map((item, idx) => {
            const spr = spring({
              frame: Math.max(0, frame - (8 + idx * 6)),
              fps,
              config: { damping: 95, mass: 0.8 },
            });
            const x = interpolate(spr, [0, 1], [-40, 0], {
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
                  backgroundColor: item.highlight ? "rgba(255, 157, 50, 0.12)" : "rgba(3, 13, 26, 0.92)",
                  border: `2px solid ${item.color}`,
                  borderLeft: `10px solid ${item.color}`,
                  borderRadius: "8px",
                  padding: "14px 28px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  boxShadow: item.highlight ? "0 8px 30px rgba(255,157,50,0.25)" : "0 6px 20px rgba(0,0,0,0.6)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      backgroundColor: item.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: item.highlight ? "#030D1A" : "#FFFFFF",
                      fontFamily: "'Montserrat', sans-serif",
                      fontWeight: 900,
                      fontSize: "18px",
                    }}
                  >
                    ✓
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontWeight: 900,
                        fontSize: "20px",
                        color: "#FFFFFF",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {item.title}
                    </div>
                    <div
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 500,
                        fontSize: "14px",
                        color: item.highlight ? "#FBD38D" : "#94A3B8",
                        marginTop: "2px",
                      }}
                    >
                      {item.desc}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: item.highlight ? "#FF9D32" : "rgba(8, 126, 255, 0.2)",
                    color: item.highlight ? "#030D1A" : "#087EFF",
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 900,
                    fontSize: "12px",
                    padding: "6px 14px",
                    borderRadius: "4px",
                    letterSpacing: "1px",
                  }}
                >
                  {item.code}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <LightSweep progress={sweep} color="#FF9D32" width={320} angle={25} />
    </AbsoluteFill>
  );
};

