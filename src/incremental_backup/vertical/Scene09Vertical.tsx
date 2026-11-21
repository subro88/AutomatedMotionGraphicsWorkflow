import React from "react";
import { useCurrentFrame, Audio, staticFile } from "remotion";
import { THEME } from "../theme";
import { KineticSubtitleEngine } from "../components/KineticSubtitleEngine";
import { CurvedSpline } from "../components/CurvedSpline";
import { ElevatedCard, ComponentSvgIcon } from "../components/VectorComponents";

export const Scene09Vertical: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        background: THEME.colors.cream,
        backgroundImage: "radial-gradient(rgba(41, 37, 36, 0.08) 1.2px, transparent 1.2px)",
        backgroundSize: "28px 28px",
        padding: "80px 70px 70px 70px",
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
        fontFamily: THEME.typography.fontFamily,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Audio src={staticFile("incremental_backup/scene9.wav")} />

      {/* Top Category Badge */}
      <div
        style={{
          padding: "10px 28px",
          borderRadius: "9999px",
          background: THEME.colors.red,
          color: "#FFFFFF",
          fontSize: "15px",
          fontWeight: 800,
          letterSpacing: "0.1em",
          boxShadow: `0 8px 24px ${THEME.colors.red}40`,
        }}
      >
        SECURITY ADVISORY • END OF LIFE WARNING
      </div>

      {/* Top Dynamic Kinetic Subtitle Phrase */}
      <div
        style={{
          marginTop: "20px",
          minHeight: "150px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <KineticSubtitleEngine sceneId="scene9" fontSize={54} layout="vertical" />
      </div>

      {/* Central Visual Stage: EOL Warning & Cloud Migration (940px width, 1040px height) */}
      <div
        style={{
          width: 940,
          height: 1040,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "32px",
        }}
      >
        {/* Dynamic Curved Splines connecting Server to Cloud Migration */}
        <CurvedSpline x1={470} y1={520} x2={470} y2={220} curvature={-40} color={THEME.colors.blue} frame={frame} lineWidth={6} />

        {/* Cloud Migration Target Node (Top) */}
        <ElevatedCard width={940} height={180} padding="24px 36px">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
              <ComponentSvgIcon name="cloud" size={80} />
              <div>
                <div style={{ fontSize: "24px", fontWeight: 800, color: THEME.colors.charcoal }}>
                  Recommended: Modern Windows Server or Azure
                </div>
                <div style={{ fontSize: "16px", color: THEME.colors.charcoalMuted, fontWeight: 600, marginTop: "6px" }}>
                  Migrate legacy 2008 workloads to Windows Server 2022 or Azure Virtual Machines
                </div>
              </div>
            </div>
            <div
              style={{
                background: THEME.colors.blueLight,
                color: THEME.colors.blue,
                fontWeight: 800,
                fontSize: "16px",
                padding: "10px 20px",
                borderRadius: "9999px",
              }}
            >
              UPGRADE NOW
            </div>
          </div>
        </ElevatedCard>

        {/* End of Life Warning Card (Middle) */}
        <ElevatedCard
          width={940}
          height={380}
          padding="32px 36px"
          style={{ background: "#FEF2F2", border: `3px solid ${THEME.colors.red}` }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "18px", marginBottom: "20px" }}>
            <ComponentSvgIcon name="shield" size={64} />
            <div>
              <div style={{ fontSize: "26px", fontWeight: 900, color: THEME.colors.red }}>
                MICROSOFT END OF LIFE REACHED
              </div>
              <div style={{ fontSize: "16px", color: "#991B1B", fontWeight: 700, marginTop: "4px" }}>
                Official Support Expired: January 14, 2020
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px", width: "100%" }}>
            <div style={{ background: "#FFFFFF", padding: "14px 20px", borderRadius: "14px", border: "1px solid #FECACA", display: "flex", alignItems: "center", gap: "14px" }}>
              <span style={{ color: THEME.colors.red, fontWeight: 900, fontSize: "18px" }}>✖</span>
              <span style={{ fontSize: "16px", fontWeight: 700, color: THEME.colors.charcoal }}>Zero Security Patches or Vulnerability Fixes</span>
            </div>
            <div style={{ background: "#FFFFFF", padding: "14px 20px", borderRadius: "14px", border: "1px solid #FECACA", display: "flex", alignItems: "center", gap: "14px" }}>
              <span style={{ color: THEME.colors.red, fontWeight: 900, fontSize: "18px" }}>✖</span>
              <span style={{ fontSize: "16px", fontWeight: 700, color: THEME.colors.charcoal }}>Critical Compliance & Regulatory Violations (PCI-DSS / HIPAA)</span>
            </div>
            <div style={{ background: "#FFFFFF", padding: "14px 20px", borderRadius: "14px", border: "1px solid #FECACA", display: "flex", alignItems: "center", gap: "14px" }}>
              <span style={{ color: THEME.colors.red, fontWeight: 900, fontSize: "18px" }}>✖</span>
              <span style={{ fontSize: "16px", fontWeight: 700, color: THEME.colors.charcoal }}>Severe Ransomware & Unpatched Kernel Exploit Exposure</span>
            </div>
          </div>
        </ElevatedCard>
      </div>

      {/* Subtle brand watermark */}
      <div
        style={{
          fontSize: "16px",
          fontWeight: 700,
          color: THEME.colors.charcoalLight,
          letterSpacing: "0.08em",
        }}
      >
        tech-tutorial-series.io
      </div>
    </div>
  );
};
