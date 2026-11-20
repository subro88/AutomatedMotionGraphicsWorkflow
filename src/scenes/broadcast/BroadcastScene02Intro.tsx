import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BlueprintBackground } from "../../components/nhit/BlueprintBackground";
import { LogoPlaceholder } from "../../components/nhit/LogoPlaceholder";
import { BroadcastBanner } from "../../components/broadcast/BroadcastBanner";
import { LightSweep } from "../../components/nhit/LightSweep";
import { ParticleSystem } from "../../components/nhit/ParticleSystem";
import { CircuitAnimation } from "../../components/nhit/CircuitAnimation";

export const BroadcastScene02Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sweep = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const logoSpr = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: { damping: 95, mass: 0.8 },
  });
  const logoScale = interpolate(logoSpr, [0, 1], [0.65, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const logoOpacity = interpolate(logoSpr, [0, 0.4], [0, 1], {
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
      <BlueprintBackground gridOpacity={0.16} showTechnicalHUD={true} statusLabel="INSTITUTIONAL IDENTITY REVEAL" />
      <ParticleSystem count={30} seed={12} color="#087EFF" speed={0.4} />

      {/* Background Circuit Traces */}
      <div style={{ position: "absolute", top: -30, right: -40, opacity: 0.25, pointerEvents: "none" }}>
        <CircuitAnimation width={650} height={350} color="#087EFF" speed={0.6} />
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "50px 80px 80px",
          boxSizing: "border-box",
          gap: "28px",
        }}
      >
        {/* Institutional Logo Reticle */}
        <div
          style={{
            transform: `scale(${logoScale})`,
            opacity: logoOpacity,
            position: "relative",
          }}
        >
          <LogoPlaceholder size={135} />
          {/* Animated Tech Compass Ring */}
          <svg
            style={{
              position: "absolute",
              top: -15,
              left: -15,
              width: 165,
              height: 165,
              transform: `rotate(${frame * 0.9}deg)`,
              pointerEvents: "none",
            }}
          >
            <circle
              cx="82.5"
              cy="82.5"
              r="76"
              fill="none"
              stroke="#087EFF"
              strokeWidth="2"
              strokeDasharray="20 14 6 14"
              opacity={0.7}
            />
          </svg>
        </div>

        {/* High-Contrast Centered Broadcast Banner */}
        <div style={{ width: "100%", maxWidth: "1250px" }}>
          <BroadcastBanner
            category="PREMIER TECHNICAL INSTITUTION • DURGAPUR"
            categoryColor="#FF9D32"
            title="THE NEW HORIZONS INSTITUTE OF TECHNOLOGY"
            highlightWord="TECHNOLOGY"
            highlightColor="#087EFF"
            subtitle="YOUR OPPORTUNITY TO ADVANCE THROUGH TECHNICAL EDUCATION"
            metaBadge="CAMPUS: DURGAPUR, WB"
            alignment="center"
          />
        </div>

        {/* Bottom Tagline Plate */}
        <div
          style={{
            backgroundColor: "rgba(3, 13, 26, 0.9)",
            border: "2px solid #087EFF",
            borderRadius: "40px",
            padding: "10px 36px",
            boxShadow: "0 6px 25px rgba(8,126,255,0.25)",
            opacity: interpolate(frame, [20, 35], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <span
            style={{
              color: "#FFFFFF",
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 800,
              fontSize: "16px",
              letterSpacing: "4px",
              textTransform: "uppercase",
            }}
          >
            “SHAPING ENGINEERS, BUILDING FUTURES.”
          </span>
        </div>
      </div>

      <LightSweep progress={sweep} color="#FF9D32" width={320} angle={25} />
    </AbsoluteFill>
  );
};

