import React from "react";
import { spring, useCurrentFrame, useVideoConfig, Audio, staticFile } from "remotion";
import { THEME } from "../theme";
import { KineticSubtitleEngine } from "../components/KineticSubtitleEngine";
import { AeroDialog3DWidget } from "../components/AeroDialog3DWidget";
import { DataFlowPipes } from "../components/DataFlowPipes";

export const Scene04Vertical: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = Math.min(
    100,
    Math.floor(
      spring({
        frame: Math.max(0, frame - 160),
        fps,
        config: { damping: 18, stiffness: 60 },
      }) * 100
    )
  );

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
      <Audio src={staticFile("incremental_backup/scene4.wav")} />

      {/* TOP 18%: PERMANENT STEP HEADER */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 10 }}>
        <div
          style={{
            padding: "8px 24px",
            borderRadius: "9999px",
            background: THEME.colors.green,
            color: "#FFF",
            fontSize: "15px",
            fontWeight: 800,
            letterSpacing: "0.1em",
            boxShadow: `0 8px 24px ${THEME.colors.green}40`,
            marginBottom: "14px",
          }}
        >
          METHOD 1 • SERVER MANAGER
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
          Install Windows Server Backup
        </h1>

        <div style={{ fontSize: "17px", color: THEME.colors.charcoalMuted, fontWeight: 600 }}>
          Server Manager ➔ Features ➔ Add Features ➔ Windows Server Backup
        </div>
      </div>

      {/* MIDDLE 62%: 3D AERO WINDOW + DATA FLOW PIPELINE + PROGRESS */}
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
        {/* Glowing Green Feature Installation Pipe */}
        <DataFlowPipes
          startX={240}
          startY={110}
          endX={840}
          endY={110}
          color={THEME.colors.green}
          lineWidth={5}
          speed={1.5}
          packetCount={4}
          isLatching={progress === 100}
          latchFrame={220}
          label="FEATURE REGISTRATION"
        />

        {/* 3D Aero Glass Dialog Simulation */}
        <AeroDialog3DWidget
          title="Server Manager - Add Features Wizard"
          width={680}
          selectedOption="faster"
          delay={20}
        />

        {/* Real-time 0-100% Progress Bar Widget */}
        <div
          style={{
            width: "100%",
            maxWidth: 680,
            background: "#FFFFFF",
            borderRadius: "24px",
            padding: "24px 32px",
            boxShadow: THEME.shadows.card,
            border: `1.5px solid ${THEME.colors.border}`,
            zIndex: 6,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "14px",
              fontSize: "15px",
              fontWeight: 800,
              color: THEME.colors.charcoal,
            }}
          >
            <span>Windows Server Backup Features</span>
            <span
              style={{
                fontSize: "14px",
                fontWeight: 900,
                color: progress === 100 ? THEME.colors.green : THEME.colors.orange,
              }}
            >
              {progress === 100 ? "✓ INSTALLED" : `${progress}%`}
            </span>
          </div>

          {/* GPU Accelerated ScaleX Progress Bar (Zero Layout Reflow) */}
          <div style={{ width: "100%", height: 14, borderRadius: "7px", background: "#E2E8F0", overflow: "hidden" }}>
            <div
              style={{
                width: "100%",
                height: "100%",
                background:
                  progress === 100
                    ? "linear-gradient(90deg, #10B981 0%, #059669 100%)"
                    : "linear-gradient(90deg, #F45B16 0%, #EA580C 100%)",
                borderRadius: "7px",
                transform: `scaleX(${progress / 100})`,
                transformOrigin: "left center",
              }}
            />
          </div>

          <div
            style={{
              marginTop: "14px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "12px",
              color: THEME.colors.charcoalMuted,
            }}
          >
            <span>Component: wbadmin.exe & GUI Console</span>
            <span style={{ fontWeight: 700, color: THEME.colors.green }}>VSS Writer Ready</span>
          </div>
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
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: THEME.colors.green }} />
          <span style={{ fontSize: "12px", fontWeight: 800, color: THEME.colors.charcoalMuted, letterSpacing: "0.06em" }}>
            AUDIO SPOKEN TRANSCRIPT
          </span>
        </div>
        <KineticSubtitleEngine sceneId="scene4" fontSize={42} layout="vertical" />
      </div>
    </div>
  );
};
