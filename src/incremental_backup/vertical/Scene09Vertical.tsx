import React from "react";
import { useCurrentFrame, Audio, staticFile } from "remotion";
import { THEME } from "../theme";
import { KineticSubtitleEngine } from "../components/KineticSubtitleEngine";
import { CloudMigration3DWidget } from "../components/CloudMigration3DWidget";

export const Scene09Vertical: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        background: THEME.colors.cream,
        backgroundImage: `radial-gradient(${THEME.colors.charcoal} 0.75px, transparent 0.75px)`,
        backgroundSize: "28px 28px",
        padding: "60px 48px",
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
        fontFamily: THEME.typography.fontFamily,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Audio src={staticFile("incremental_backup/scene9.wav")} />

      <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
        <div
          style={{
            padding: "8px 22px",
            borderRadius: "9999px",
            background: THEME.colors.red,
            color: "#FFF",
            fontSize: "14px",
            fontWeight: 800,
            letterSpacing: "0.08em",
            boxShadow: `0 8px 20px rgba(239, 68, 68, 0.35)`,
          }}
        >
          LIFECYCLE SECURITY ADVISORY
        </div>
      </div>

      <h1
        style={{
          ...THEME.typography.h1,
          fontSize: "44px",
          textAlign: "center",
          margin: "0 0 24px 0",
          color: THEME.colors.charcoal,
        }}
      >
        Don't Ignore Security
      </h1>

      {/* TOP 55% ZONE: EOL CALENDAR BADGE + CLOUD MIGRATION PATH */}
      <div
        style={{
          height: 980,
          display: "flex",
          flexDirection: "column",
          gap: "28px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Jan 14 2020 Badge */}
        <div
          style={{
            padding: "16px 28px",
            borderRadius: "20px",
            background: "#FFFFFF",
            border: `2px solid ${THEME.colors.red}`,
            boxShadow: THEME.shadows.card,
            textAlign: "center",
            width: "100%",
            maxWidth: 600,
          }}
        >
          <div style={{ fontSize: "14px", fontWeight: 800, color: THEME.colors.red, letterSpacing: "0.06em" }}>
            END OF EXTENDED SUPPORT
          </div>
          <div style={{ fontSize: "28px", fontWeight: 900, color: THEME.colors.charcoal, margin: "4px 0" }}>
            January 14, 2020
          </div>
          <div style={{ fontSize: "13px", color: THEME.colors.charcoalMuted }}>
            Zero regular security updates, leaving systems exposed to ransomware.
          </div>
        </div>

        {/* Cloud Migration 3D Widget */}
        <CloudMigration3DWidget delay={100} style={{ width: "100%", maxWidth: 620 }} />

        {/* Core Principle Banner */}
        <div
          style={{
            width: "100%",
            maxWidth: 600,
            background: THEME.colors.charcoal,
            borderRadius: "18px",
            padding: "14px 22px",
            textAlign: "center",
            color: "#FFF",
            fontSize: "14px",
            fontWeight: 700,
            boxShadow: "0 10px 30px rgba(41, 37, 36, 0.25)",
          }}
        >
          "Backups protect data, but modern OS protects against attacks."
        </div>
      </div>

      {/* BOTTOM 45% ZONE: KINETIC SUBTITLES */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: "80px",
        }}
      >
        <KineticSubtitleEngine sceneId="scene9" fontSize={60} layout="vertical" />
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "35px",
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: "14px",
          fontWeight: 700,
          color: THEME.colors.charcoalLight,
          letterSpacing: "0.12em",
        }}
      >
        techblock.io
      </div>
    </div>
  );
};
