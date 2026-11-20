import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BlueprintBackground } from "../../components/nhit/BlueprintBackground";
import { TechnicianFigure } from "../../components/nhit/TechnicianFigure";
import { BroadcastBanner } from "../../components/broadcast/BroadcastBanner";
import { LightSweep } from "../../components/nhit/LightSweep";
import { ParticleSystem } from "../../components/nhit/ParticleSystem";

export const BroadcastScene01Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance sweep
  const sweep = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Technician entrance spring
  const techSpr = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: { damping: 95, mass: 0.85 },
  });
  const techScale = interpolate(techSpr, [0, 1], [0.85, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const techOpacity = interpolate(techSpr, [0, 0.4], [0, 1], {
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
      <BlueprintBackground gridOpacity={0.15} showTechnicalHUD={true} statusLabel="CAREER ADVANCEMENT INITIATIVE" />
      <ParticleSystem count={25} seed={42} color="#087EFF" speed={0.4} />
      <ParticleSystem count={18} seed={77} color="#FF9D32" speed={0.3} />

      {/* Main Broadcast Container */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          height: "100%",
          display: "flex",
          padding: "60px 80px 80px",
          boxSizing: "border-box",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Left Side: Broadcast Banner Content */}
        <div style={{ flex: 1.3, zIndex: 20 }}>
          <BroadcastBanner
            category="CAREER OPPORTUNITY • 2026–27"
            categoryColor="#087EFF"
            title="YOU HAVE THE EXPERIENCE. YOU HAVE THE SKILLS."
            highlightWord="SKILLS"
            highlightColor="#FF9D32"
            subtitle="NOW TAKE YOUR CAREER TO THE NEXT LEVEL"
            metaBadge="WORKING PROFESSIONALS"
            alignment="left"
          />

          {/* Secondary Sub-Callout Plate */}
          <div
            style={{
              marginTop: "24px",
              backgroundColor: "rgba(7, 27, 51, 0.9)",
              borderLeft: "6px solid #FF9D32",
              padding: "16px 24px",
              borderRadius: "0 6px 6px 0",
              maxWidth: "760px",
              boxShadow: "0 8px 30px rgba(0,0,0,0.6)",
              opacity: interpolate(frame, [15, 30], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              transform: `translateY(${interpolate(frame, [15, 30], [20, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })}px)`,
            }}
          >
            <span
              style={{
                color: "#FFFFFF",
                fontFamily: "'Inter', sans-serif",
                fontSize: "19px",
                fontWeight: 600,
                lineHeight: 1.4,
              }}
            >
              Transform your industry field experience into an{" "}
              <strong style={{ color: "#FF9D32" }}>
                AICTE & State Council Approved Diploma Qualification
              </strong>.
            </span>
          </div>
        </div>

        {/* Right Side: Interactive Technician Graphic Console */}
        <div
          style={{
            flex: 0.9,
            display: "flex",
            justifyContent: "center",
            transform: `scale(${techScale})`,
            opacity: techOpacity,
          }}
        >
          <div
            style={{
              padding: "20px",
              backgroundColor: "rgba(3, 13, 26, 0.8)",
              borderRadius: "16px",
              border: "1px solid rgba(8, 126, 255, 0.35)",
              boxShadow: "0 12px 40px rgba(0,0,0,0.8)",
            }}
          >
            <TechnicianFigure />
          </div>
        </div>
      </div>

      <LightSweep progress={sweep} color="#087EFF" width={320} angle={25} />
    </AbsoluteFill>
  );
};

