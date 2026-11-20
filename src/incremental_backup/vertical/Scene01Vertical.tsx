import React from "react";
import { useCurrentFrame, Audio, staticFile } from "remotion";
import { THEME } from "../theme";
import { ServerIllustration } from "../components/ServerIllustration";
import { HardDrive3DWidget } from "../components/HardDrive3DWidget";
import { VssDataBlockStream } from "../components/VssDataBlockStream";
import { KineticSubtitleEngine } from "../components/KineticSubtitleEngine";

export const Scene01Vertical: React.FC = () => {
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
      <Audio src={staticFile("incremental_backup/scene1.wav")} />

      {/* Top Category Badge */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
        <div
          style={{
            padding: "8px 22px",
            borderRadius: "9999px",
            background: THEME.colors.orange,
            color: "#FFF",
            fontSize: "14px",
            fontWeight: 800,
            letterSpacing: "0.08em",
            boxShadow: "0 8px 20px rgba(244, 91, 22, 0.3)",
          }}
        >
          WINDOWS SERVER 2008 R2
        </div>
      </div>

      {/* Title */}
      <h1
        style={{
          ...THEME.typography.h1,
          fontSize: "46px",
          textAlign: "center",
          margin: "0 0 30px 0",
          color: THEME.colors.charcoal,
        }}
      >
        Incremental Backup
      </h1>

      {/* TOP 55% ZONE: 3D B-ROLL & KINEMATICS */}
      <div
        style={{
          height: 960,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          gap: "24px",
        }}
      >
        {/* Floating Mechanical Hard Drive Widget */}
        <HardDrive3DWidget width={420} height={460} isWriting delay={10} />

        {/* Animated Data Block Stream */}
        <VssDataBlockStream blockCount={5} isIncremental style={{ transform: "scale(1.1)" }} />

        {/* Floating Server Summary Card */}
        <div
          style={{
            padding: "16px 28px",
            background: "#FFFFFF",
            borderRadius: "20px",
            boxShadow: THEME.shadows.card,
            border: `1px solid ${THEME.colors.border}`,
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        >
          <span style={{ fontSize: "28px" }}>🖥️</span>
          <div>
            <div style={{ fontSize: "15px", fontWeight: 800, color: THEME.colors.charcoal }}>
              Active Server Volume: D:\Data
            </div>
            <div style={{ fontSize: "12px", color: THEME.colors.charcoalMuted }}>
              Backing up changed sectors without repeating full volumes
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM 45% ZONE: HIGH-VELOCITY KINETIC SUBTITLES */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          paddingBottom: "80px",
        }}
      >
        <KineticSubtitleEngine sceneId="scene1" fontSize={64} layout="vertical" />
      </div>

      {/* Footer Branding Watermark */}
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
