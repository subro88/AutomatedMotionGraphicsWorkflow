import React from "react";
import { spring, useCurrentFrame, useVideoConfig, Audio, staticFile } from "remotion";
import { THEME } from "../theme";
import { KineticSubtitleEngine } from "../components/KineticSubtitleEngine";
import { VssDataBlockStream } from "../components/VssDataBlockStream";

export const Scene03Vertical: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const incSpring = spring({ frame: Math.max(0, frame - 20), fps, config: THEME.springs.gentle });
  const diffSpring = spring({ frame: Math.max(0, frame - 160), fps, config: THEME.springs.gentle });

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
      <Audio src={staticFile("incremental_backup/scene3.wav")} />

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
          CRUCIAL ARCHITECTURAL COMPARISON
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
        Incremental vs Differential
      </h1>

      {/* TOP 55% ZONE: 3D DUAL COMPARISON CARDS */}
      <div
        style={{
          height: 980,
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Incremental Panel (Blue) */}
        <div
          style={{
            width: "100%",
            maxWidth: 620,
            padding: "24px",
            borderRadius: "24px",
            background: "#FFFFFF",
            border: `2px solid ${THEME.colors.blue}`,
            boxShadow: "0 25px 60px -10px rgba(38, 133, 217, 0.15)",
            transform: `translateY(${(1 - incSpring) * 35}px) scale(${0.94 + incSpring * 0.06})`,
            opacity: incSpring,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "24px" }}>⚡</span>
              <span style={{ fontSize: "18px", fontWeight: 800, color: THEME.colors.blue }}>
                INCREMENTAL BACKUP
              </span>
            </div>
            <span style={{ fontSize: "12px", fontWeight: 800, background: THEME.colors.blueLight, color: THEME.colors.blue, padding: "3px 10px", borderRadius: "9999px" }}>
              Changes Since LAST Backup
            </span>
          </div>

          <div style={{ fontSize: "13px", color: THEME.colors.charcoalMuted, marginBottom: "12px" }}>
            Tue: 3 blocks • Wed: 2 blocks • Thu: 4 blocks
          </div>

          <div style={{ padding: "8px 12px", background: THEME.colors.cream, borderRadius: "10px", fontSize: "13px", fontWeight: 700, color: THEME.colors.charcoal }}>
            ✅ Result: Minimum storage usage & fastest backup time
          </div>
        </div>

        {/* Differential Panel (Orange) */}
        <div
          style={{
            width: "100%",
            maxWidth: 620,
            padding: "24px",
            borderRadius: "24px",
            background: "#FFFFFF",
            border: `2px solid ${THEME.colors.orange}`,
            boxShadow: "0 25px 60px -10px rgba(244, 91, 22, 0.15)",
            transform: `translateY(${(1 - diffSpring) * 35}px) scale(${0.94 + diffSpring * 0.06})`,
            opacity: diffSpring,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "24px" }}>📈</span>
              <span style={{ fontSize: "18px", fontWeight: 800, color: THEME.colors.orange }}>
                DIFFERENTIAL BACKUP
              </span>
            </div>
            <span style={{ fontSize: "12px", fontWeight: 800, background: THEME.colors.orangeLight, color: THEME.colors.orange, padding: "3px 10px", borderRadius: "9999px" }}>
              Changes Since FULL Backup
            </span>
          </div>

          <div style={{ fontSize: "13px", color: THEME.colors.charcoalMuted, marginBottom: "12px" }}>
            Tue: 3 blocks • Wed: 5 blocks • Thu: 9 cumulative blocks
          </div>

          <div style={{ padding: "8px 12px", background: THEME.colors.cream, borderRadius: "10px", fontSize: "13px", fontWeight: 700, color: THEME.colors.charcoal }}>
            ℹ️ Result: Larger storage growth over time, simpler restore
          </div>
        </div>

        <VssDataBlockStream blockCount={5} isIncremental style={{ transform: "scale(1.05)" }} />
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
        <KineticSubtitleEngine sceneId="scene3" fontSize={60} layout="vertical" />
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
