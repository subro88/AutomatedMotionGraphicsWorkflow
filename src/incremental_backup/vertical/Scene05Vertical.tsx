import React from "react";
import { useCurrentFrame, Audio, staticFile } from "remotion";
import { THEME } from "../theme";
import { KineticSubtitleEngine } from "../components/KineticSubtitleEngine";
import { AeroDialog3DWidget } from "../components/AeroDialog3DWidget";

export const Scene05Vertical: React.FC = () => {
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
      <Audio src={staticFile("incremental_backup/scene5.wav")} />

      <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
        <div
          style={{
            padding: "8px 22px",
            borderRadius: "9999px",
            background: THEME.colors.orange,
            color: "#FFF",
            fontSize: "14px",
            fontWeight: 800,
            letterSpacing: "0.08em",
            boxShadow: `0 8px 20px rgba(244, 91, 22, 0.3)`,
          }}
        >
          CRITICAL STEP
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
        Configure Performance
      </h1>

      {/* TOP 55% ZONE: 3D AERO DIALOG SELECTING "FASTER BACKUP PERFORMANCE" */}
      <div
        style={{
          height: 980,
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AeroDialog3DWidget
          title="Optimize Backup Performance"
          width={620}
          selectedOption="faster"
          delay={20}
        />

        {/* Takeaway Card */}
        <div
          style={{
            width: "100%",
            maxWidth: 620,
            background: "#FFFBF7",
            borderRadius: "22px",
            padding: "18px 26px",
            border: `2px solid ${THEME.colors.orange}`,
            boxShadow: THEME.shadows.card,
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        >
          <span style={{ fontSize: "28px" }}>💡</span>
          <div>
            <div style={{ fontSize: "15px", fontWeight: 900, color: THEME.colors.orange }}>
              "FASTER BACKUP PERFORMANCE"
            </div>
            <div style={{ fontSize: "13px", color: THEME.colors.charcoal, fontWeight: 600 }}>
              Enables native VSS block-level incremental snapshot tracking.
            </div>
          </div>
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
        <KineticSubtitleEngine sceneId="scene5" fontSize={60} layout="vertical" />
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
