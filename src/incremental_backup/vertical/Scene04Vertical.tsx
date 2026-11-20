import React from "react";
import { spring, useCurrentFrame, useVideoConfig, Audio, staticFile } from "remotion";
import { THEME } from "../theme";
import { KineticSubtitleEngine } from "../components/KineticSubtitleEngine";
import { AeroDialog3DWidget } from "../components/AeroDialog3DWidget";

export const Scene04Vertical: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = Math.min(100, Math.floor(spring({ frame: Math.max(0, frame - 180), fps, config: { damping: 18, stiffness: 60 } }) * 100));

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
      <Audio src={staticFile("incremental_backup/scene4.wav")} />

      <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
        <div
          style={{
            padding: "8px 22px",
            borderRadius: "9999px",
            background: THEME.colors.green,
            color: "#FFF",
            fontSize: "14px",
            fontWeight: 800,
            letterSpacing: "0.08em",
            boxShadow: `0 8px 20px ${THEME.colors.green}40`,
          }}
        >
          NATIVE FEATURE INSTALLATION
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
        Windows Server Backup
      </h1>

      {/* TOP 55% ZONE: SERVER MANAGER AERO WINDOW & INSTALL PROGRESS */}
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
          title="Server Manager - Add Features Wizard"
          width={600}
          selectedOption="faster"
          delay={20}
        />

        {/* Installation Progress Widget */}
        <div
          style={{
            width: "100%",
            maxWidth: 600,
            background: "#FFFFFF",
            borderRadius: "22px",
            padding: "20px 28px",
            boxShadow: THEME.shadows.card,
            border: `1px solid ${THEME.colors.border}`,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "14px", fontWeight: 700, color: THEME.colors.charcoal }}>
            <span>Installing: Windows Server Backup Features...</span>
            <span style={{ color: progress === 100 ? THEME.colors.green : THEME.colors.orange }}>{progress}%</span>
          </div>

          <div style={{ width: "100%", height: 12, borderRadius: "6px", background: "#E2E8F0", overflow: "hidden" }}>
            <div
              style={{
                width: "100%",
                height: "100%",
                background: progress === 100 ? THEME.colors.green : `linear-gradient(90deg, ${THEME.colors.orange}, #FB923C)`,
                transform: `scaleX(${progress / 100})`,
                transformOrigin: "left center",
              }}
            />
          </div>

          {progress === 100 && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "12px", color: THEME.colors.green, fontSize: "13px", fontWeight: 800 }}>
              <span>✅</span>
              <span>Windows Server Backup Features Installed Successfully</span>
            </div>
          )}
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
        <KineticSubtitleEngine sceneId="scene4" fontSize={60} layout="vertical" />
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
