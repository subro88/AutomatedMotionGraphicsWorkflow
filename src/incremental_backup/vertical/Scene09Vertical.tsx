import React from "react";
import { useCurrentFrame, Audio, staticFile } from "remotion";
import { THEME } from "../theme";
import { KineticSubtitleEngine } from "../components/KineticSubtitleEngine";
import { CloudMigration3DWidget } from "../components/CloudMigration3DWidget";
import { DataFlowPipes } from "../components/DataFlowPipes";

export const Scene09Vertical: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        background: THEME.colors.cream,
        backgroundImage: "radial-gradient(rgba(41, 37, 36, 0.07) 1.2px, transparent 1.2px)",
        backgroundSize: "28px 28px",
        padding: "50px 48px 40px 48px",
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
        fontFamily: THEME.typography.fontFamily,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Audio src={staticFile("incremental_backup/scene9.wav")} />

      {/* TOP 18%: PERMANENT STEP HEADER */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 10 }}>
        <div
          style={{
            padding: "8px 24px",
            borderRadius: "9999px",
            background: THEME.colors.red,
            color: "#FFF",
            fontSize: "15px",
            fontWeight: 800,
            letterSpacing: "0.1em",
            boxShadow: `0 8px 24px rgba(239, 68, 68, 0.35)`,
            marginBottom: "14px",
          }}
        >
          LIFECYCLE SECURITY ADVISORY
        </div>

        <h1
          style={{
            ...THEME.typography.h1,
            fontSize: "44px",
            textAlign: "center",
            margin: "0 0 8px 0",
            color: THEME.colors.charcoal,
          }}
        >
          Don't Ignore Security
        </h1>

        <div style={{ fontSize: "17px", color: THEME.colors.charcoalMuted, fontWeight: 600 }}>
          Server 2008 is End-of-Life — backup without security leaves data vulnerable
        </div>
      </div>

      {/* MIDDLE 62%: EOL BADGE + 3D CLOUD MIGRATION BEAM + DATA FLOW PIPELINE */}
      <div
        style={{
          height: 1100,
          display: "flex",
          flexDirection: "column",
          gap: "28px",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 5,
        }}
      >
        {/* Glowing Purple Cloud Migration Pipe */}
        <DataFlowPipes
          startX={260}
          startY={360}
          endX={760}
          endY={360}
          color={THEME.colors.purple}
          lineWidth={5}
          speed={1.6}
          packetCount={5}
          isLatching={true}
          latchFrame={40}
          label="MIGRATION PIPELINE"
        />

        {/* EOL January 14, 2020 Badge */}
        <div
          style={{
            padding: "20px 32px",
            borderRadius: "24px",
            background: "#FFFFFF",
            border: `2px solid ${THEME.colors.red}`,
            boxShadow: THEME.shadows.card,
            textAlign: "center",
            width: "100%",
            maxWidth: 780,
            zIndex: 6,
          }}
        >
          <div style={{ fontSize: "14px", fontWeight: 800, color: THEME.colors.red, letterSpacing: "0.08em" }}>
            OFFICIAL END OF EXTENDED SUPPORT
          </div>
          <div style={{ fontSize: "36px", fontWeight: 900, color: THEME.colors.charcoal, margin: "6px 0" }}>
            January 14, 2020
          </div>
          <div style={{ fontSize: "14px", color: THEME.colors.charcoalMuted, fontWeight: 600 }}>
            Zero regular security updates. Running backups on an unpatched OS cannot protect against modern ransomware.
          </div>
        </div>

        {/* 3D Cloud Migration Widget (Server 2008 EOL -> Modern Azure) */}
        <CloudMigration3DWidget delay={60} style={{ width: "100%", maxWidth: 840, zIndex: 6 }} />

        {/* Modernization Path Card */}
        <div
          style={{
            width: "100%",
            maxWidth: 780,
            padding: "16px 26px",
            borderRadius: "20px",
            background: "#EFF6FF",
            border: `1.5px solid ${THEME.colors.blue}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 6,
          }}
        >
          <span style={{ fontSize: "13px", fontWeight: 800, color: THEME.colors.blue }}>RECOMMENDED PATH:</span>
          {["Windows Server 2022 / 2025", "Microsoft Azure IaaS", "Azure Backup"].map((t, i) => (
            <span
              key={i}
              style={{
                padding: "6px 14px",
                borderRadius: "10px",
                background: "#FFFFFF",
                color: THEME.colors.charcoal,
                fontSize: "12px",
                fontWeight: 700,
                border: "1px solid #BFDBFE",
              }}
            >
              ✓ {t}
            </span>
          ))}
        </div>
      </div>

      {/* BOTTOM 20%: LOWER-THIRD KINETIC WORD-BY-WORD ACTIVE POP SUBTITLES */}
      <div
        style={{
          height: 240,
          background: "#FFFFFF",
          borderRadius: "28px",
          boxShadow: "0 20px 50px -10px rgba(41, 37, 36, 0.12)",
          border: `1.5px solid ${THEME.colors.border}`,
          padding: "24px 32px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: THEME.colors.red }} />
          <span style={{ fontSize: "12px", fontWeight: 800, color: THEME.colors.charcoalMuted, letterSpacing: "0.06em" }}>
            AUDIO SPOKEN TRANSCRIPT
          </span>
        </div>
        <KineticSubtitleEngine sceneId="scene9" fontSize={42} layout="vertical" />
      </div>
    </div>
  );
};
