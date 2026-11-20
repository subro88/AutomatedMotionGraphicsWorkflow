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
import { ParticleSystem } from "../../components/nhit/ParticleSystem";

export const BroadcastScene06Urgency: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sweep = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const pulse = interpolate(
    Math.sin((frame / 20) * Math.PI * 2),
    [-1, 1],
    [0.85, 1.15],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const spr = spring({
    frame: Math.max(0, frame - 8),
    fps,
    config: { damping: 95, mass: 0.8 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#071B33",
        overflow: "hidden",
        fontFamily: "'Montserrat', 'Inter', sans-serif",
      }}
    >
      <BlueprintBackground gridOpacity={0.15} showTechnicalHUD={true} statusLabel="ADMISSION ALLOCATION ALERT" />
      <ParticleSystem count={35} seed={55} color="#FF9D32" speed={0.45} />

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
          category="ADMISSIONS CLOSING SOON • SESSION 2026–27"
          categoryColor="#FF9D32"
          title="DON'T STOP AT EXPERIENCE. ADD A QUALIFICATION."
          highlightWord="QUALIFICATION"
          highlightColor="#087EFF"
          subtitle="HURRY UP — STRICTLY LIMITED TO 60 APPROVED SEATS IN TOTAL"
          metaBadge="LIMITED INTAKE"
          alignment="left"
        />

        {/* High-Impact Alert Warning Box */}
        <div
          style={{
            backgroundColor: "rgba(3, 13, 26, 0.95)",
            border: "3px solid #FF9D32",
            borderLeft: "12px solid #FF9D32",
            borderRadius: "12px",
            padding: "30px 40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: `0 0 35px rgba(255,157,50,0.35)`,
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
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            {/* Pulsing Warning Beacon */}
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                backgroundColor: "rgba(255, 157, 50, 0.2)",
                border: "2px solid #FF9D32",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `scale(${pulse})`,
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L1 21H23L12 2Z"
                  stroke="#FF9D32"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 9V14"
                  stroke="#FF9D32"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle cx="12" cy="18" r="1.5" fill="#FF9D32" />
              </svg>
            </div>

            <div>
              <div
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 900,
                  fontSize: "26px",
                  color: "#FFFFFF",
                  letterSpacing: "0.5px",
                }}
              >
                APPLY EARLY TO SECURE YOUR SEAT
              </div>
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: "17px",
                  color: "#E2E8F0",
                  marginTop: "6px",
                }}
              >
                Seats are allotted on candidate eligibility and application priority under council norms.
              </div>
            </div>
          </div>

          {/* Seat Breakdown Counter Pill */}
          <div
            style={{
              backgroundColor: "rgba(255, 157, 50, 0.15)",
              border: "1px solid rgba(255, 157, 50, 0.4)",
              borderRadius: "8px",
              padding: "12px 24px",
              textAlign: "right",
            }}
          >
            <div style={{ color: "#FF9D32", fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: "32px", lineHeight: 1 }}>
              60 SEATS
            </div>
            <div style={{ color: "#94A3B8", fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "12px", marginTop: "4px" }}>
              30 Electrical + 30 Mechanical
            </div>
          </div>
        </div>
      </div>

      <LightSweep progress={sweep} color="#FF9D32" width={320} angle={25} />
    </AbsoluteFill>
  );
};

