import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BlueprintBackground } from "../../components/nhit/BlueprintBackground";
import { MechanicalGears } from "../../components/nhit/MechanicalGears";
import { CircuitAnimation } from "../../components/nhit/CircuitAnimation";
import { BroadcastBanner } from "../../components/broadcast/BroadcastBanner";
import { LightSweep } from "../../components/nhit/LightSweep";

export const BroadcastScene03Branches: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sweep = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cardSprLeft = spring({
    frame: Math.max(0, frame - 8),
    fps,
    config: { damping: 95, mass: 0.8 },
  });
  const cardSprRight = spring({
    frame: Math.max(0, frame - 14),
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
      <BlueprintBackground gridOpacity={0.15} showTechnicalHUD={true} statusLabel="PROGRAMME SELECTION MATRIX" />

      {/* Main Broadcast Layout */}
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
        {/* Top Header Plate */}
        <BroadcastBanner
          category="APPROVED DIPLOMA PROGRAMMES • 2026–27"
          categoryColor="#087EFF"
          title="ELECTRICAL OR MECHANICAL ENGINEERING"
          highlightWord="ENGINEERING"
          highlightColor="#FF9D32"
          subtitle="SPECIALLY OFFERED UNDER WORKING PROFESSIONALS CATEGORY"
          metaBadge="AICTE APPROVED"
          alignment="left"
        />

        {/* Dual Branch High-Contrast Cards */}
        <div
          style={{
            display: "flex",
            gap: "36px",
            width: "100%",
            marginTop: "16px",
          }}
        >
          {/* Left: Electrical Engineering Card */}
          <div
            style={{
              flex: 1,
              backgroundColor: "rgba(3, 13, 26, 0.94)",
              border: "2px solid #087EFF",
              borderTop: "8px solid #087EFF",
              borderRadius: "10px",
              padding: "26px 32px",
              boxShadow: "0 14px 40px rgba(8,126,255,0.25)",
              transform: `translateX(${interpolate(cardSprLeft, [0, 1], [-50, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })}px)`,
              opacity: interpolate(cardSprLeft, [0, 0.4], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Subtle Circuit Background */}
            <div style={{ position: "absolute", bottom: -20, right: -20, opacity: 0.15, pointerEvents: "none" }}>
              <CircuitAnimation width={320} height={200} color="#087EFF" speed={0.8} />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div>
                <span
                  style={{
                    backgroundColor: "rgba(8, 126, 255, 0.25)",
                    color: "#087EFF",
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 800,
                    fontSize: "12px",
                    padding: "4px 12px",
                    borderRadius: "4px",
                    letterSpacing: "1px",
                  }}
                >
                  BRANCH CODE: EE-WP
                </span>
                <h2
                  style={{
                    margin: "8px 0 0",
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 900,
                    fontSize: "30px",
                    color: "#FFFFFF",
                    letterSpacing: "0.5px",
                  }}
                >
                  ELECTRICAL ENGINEERING
                </h2>
              </div>

              {/* 30 Seats Badge */}
              <div
                style={{
                  backgroundColor: "#087EFF",
                  color: "#FFFFFF",
                  padding: "10px 18px",
                  borderRadius: "8px",
                  textAlign: "center",
                  boxShadow: "0 4px 15px rgba(8,126,255,0.4)",
                }}
              >
                <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: "28px", lineHeight: 1 }}>
                  30
                </div>
                <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: "10px", letterSpacing: "1px" }}>
                  SEATS
                </div>
              </div>
            </div>

            {/* Curriculum Highlights */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "14px" }}>
              {["Power Systems & Smart Grid Technology", "Industrial Control Panels & PLC", "Flexible Shift & Practical Lab Sessions"].map((item, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#087EFF" }} />
                  <span style={{ color: "#E2E8F0", fontFamily: "'Inter', sans-serif", fontSize: "16px", fontWeight: 600 }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Mechanical Engineering Card */}
          <div
            style={{
              flex: 1,
              backgroundColor: "rgba(3, 13, 26, 0.94)",
              border: "2px solid #FF9D32",
              borderTop: "8px solid #FF9D32",
              borderRadius: "10px",
              padding: "26px 32px",
              boxShadow: "0 14px 40px rgba(255,157,50,0.25)",
              transform: `translateX(${interpolate(cardSprRight, [0, 1], [50, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })}px)`,
              opacity: interpolate(cardSprRight, [0, 0.4], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Subtle Gear Background */}
            <div style={{ position: "absolute", bottom: -20, right: -20, opacity: 0.18, pointerEvents: "none" }}>
              <MechanicalGears size={180} baseSpeed={0.4} color="#FF9D32" />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div>
                <span
                  style={{
                    backgroundColor: "rgba(255, 157, 50, 0.25)",
                    color: "#FF9D32",
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 800,
                    fontSize: "12px",
                    padding: "4px 12px",
                    borderRadius: "4px",
                    letterSpacing: "1px",
                  }}
                >
                  BRANCH CODE: ME-WP
                </span>
                <h2
                  style={{
                    margin: "8px 0 0",
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 900,
                    fontSize: "30px",
                    color: "#FFFFFF",
                    letterSpacing: "0.5px",
                  }}
                >
                  MECHANICAL ENGINEERING
                </h2>
              </div>

              {/* 30 Seats Badge */}
              <div
                style={{
                  backgroundColor: "#FF9D32",
                  color: "#030D1A",
                  padding: "10px 18px",
                  borderRadius: "8px",
                  textAlign: "center",
                  boxShadow: "0 4px 15px rgba(255,157,50,0.4)",
                }}
              >
                <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: "28px", lineHeight: 1 }}>
                  30
                </div>
                <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: "10px", letterSpacing: "1px" }}>
                  SEATS
                </div>
              </div>
            </div>

            {/* Curriculum Highlights */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "14px" }}>
              {["CNC Programming & Advanced Machine Tools", "Thermodynamics, Fluid Mechanics & CAD/CAM", "Hands-on Industry Production Workshop"].map((item, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#FF9D32" }} />
                  <span style={{ color: "#E2E8F0", fontFamily: "'Inter', sans-serif", fontSize: "16px", fontWeight: 600 }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <LightSweep progress={sweep} color="#087EFF" width={320} angle={25} />
    </AbsoluteFill>
  );
};

