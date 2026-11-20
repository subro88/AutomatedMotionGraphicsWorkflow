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

export const BroadcastScene05Affiliation: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sweep = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cardSpr1 = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 95, mass: 0.8 },
  });
  const cardSpr2 = spring({
    frame: Math.max(0, frame - 16),
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
      <BlueprintBackground gridOpacity={0.15} showTechnicalHUD={true} statusLabel="STATUTORY APPROVALS & AFFILIATION" />

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
          category="STATUTORY AFFILIATION & APPROVAL"
          categoryColor="#087EFF"
          title="AFFILIATED TO WBSCT&VE&SD • APPROVED BY AICTE"
          highlightWord="APPROVED"
          highlightColor="#FF9D32"
          subtitle="FULL GOVERNMENT RECOGNITION FOR ACADEMIC SESSION 2026–27"
          metaBadge="OFFICIAL CREDENTIALS"
          alignment="left"
        />

        {/* Dual Accreditation Authority Plates */}
        <div style={{ display: "flex", gap: "36px", width: "100%", marginTop: "14px" }}>
          {/* Card 1: State Council */}
          <div
            style={{
              flex: 1,
              backgroundColor: "rgba(3, 13, 26, 0.94)",
              border: "2px solid #087EFF",
              borderLeft: "10px solid #087EFF",
              borderRadius: "10px",
              padding: "28px 32px",
              boxShadow: "0 12px 35px rgba(8,126,255,0.2)",
              transform: `translateY(${interpolate(cardSpr1, [0, 1], [35, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })}px)`,
              opacity: interpolate(cardSpr1, [0, 0.4], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            <div
              style={{
                backgroundColor: "rgba(8, 126, 255, 0.25)",
                color: "#087EFF",
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 900,
                fontSize: "13px",
                display: "inline-block",
                padding: "4px 14px",
                borderRadius: "4px",
                letterSpacing: "1px",
                marginBottom: "12px",
              }}
            >
              AFFILIATING STATUTORY BODY
            </div>

            <h3
              style={{
                margin: "0 0 10px",
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 900,
                fontSize: "24px",
                color: "#FFFFFF",
                lineHeight: 1.25,
              }}
            >
              WEST BENGAL STATE COUNCIL
            </h3>
            <p
              style={{
                margin: "0 0 18px",
                fontFamily: "'Inter', sans-serif",
                fontSize: "15px",
                color: "#94A3B8",
                lineHeight: 1.4,
              }}
            >
              Technical & Vocational Education and Skill Development (WBSCT&VE&SD)
            </p>

            <div
              style={{
                borderTop: "1px solid rgba(8, 126, 255, 0.3)",
                paddingTop: "14px",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                fontSize: "14px",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              <div>
                <span style={{ color: "#64748B" }}>Order Memo:</span>{" "}
                <strong style={{ color: "#FFFFFF", fontFamily: "'JetBrains Mono', monospace" }}>
                  WBSCTVESD/TED/2026-27/AFF/DET/WP/0004
                </strong>
              </div>
              <div>
                <span style={{ color: "#64748B" }}>Affiliation Date:</span>{" "}
                <strong style={{ color: "#FFFFFF" }}>06 November 2026</strong>
              </div>
            </div>
          </div>

          {/* Card 2: AICTE Approval */}
          <div
            style={{
              flex: 1,
              backgroundColor: "rgba(3, 13, 26, 0.94)",
              border: "2px solid #FF9D32",
              borderLeft: "10px solid #FF9D32",
              borderRadius: "10px",
              padding: "28px 32px",
              boxShadow: "0 12px 35px rgba(255,157,50,0.2)",
              transform: `translateY(${interpolate(cardSpr2, [0, 1], [35, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })}px)`,
              opacity: interpolate(cardSpr2, [0, 0.4], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            <div
              style={{
                backgroundColor: "rgba(255, 157, 50, 0.25)",
                color: "#FF9D32",
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 900,
                fontSize: "13px",
                display: "inline-block",
                padding: "4px 14px",
                borderRadius: "4px",
                letterSpacing: "1px",
                marginBottom: "12px",
              }}
            >
              NATIONAL APEX REGULATOR
            </div>

            <h3
              style={{
                margin: "0 0 10px",
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 900,
                fontSize: "24px",
                color: "#FFFFFF",
                lineHeight: 1.25,
              }}
            >
              AICTE APPROVED INTAKE
            </h3>
            <p
              style={{
                margin: "0 0 18px",
                fontFamily: "'Inter', sans-serif",
                fontSize: "15px",
                color: "#94A3B8",
                lineHeight: 1.4,
              }}
            >
              All India Council for Technical Education Working Professionals Scheme
            </p>

            <div
              style={{
                borderTop: "1px solid rgba(255, 157, 50, 0.3)",
                paddingTop: "14px",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                fontSize: "14px",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              <div>
                <span style={{ color: "#64748B" }}>Total Approved Intake:</span>{" "}
                <strong style={{ color: "#FF9D32", fontSize: "16px" }}>60 Seats (30 EE + 30 ME)</strong>
              </div>
              <div>
                <span style={{ color: "#64748B" }}>Academic Session:</span>{" "}
                <strong style={{ color: "#FFFFFF" }}>2026–27 (Commencing Soon)</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <LightSweep progress={sweep} color="#087EFF" width={320} angle={25} />
    </AbsoluteFill>
  );
};

