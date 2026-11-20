import React from "react";
import { useCurrentFrame, Audio, staticFile } from "remotion";
import { THEME } from "../theme";
import { HardDrive3DWidget } from "../components/HardDrive3DWidget";
import { VssDataBlockStream } from "../components/VssDataBlockStream";
import { KineticSubtitleEngine } from "../components/KineticSubtitleEngine";
import { DataFlowPipes } from "../components/DataFlowPipes";

export const Scene01Vertical: React.FC = () => {
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
      <Audio src={staticFile("incremental_backup/scene1.wav")} />

      {/* TOP 18%: PERMANENT STEP & TOPIC HEADER */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 10 }}>
        <div
          style={{
            padding: "8px 24px",
            borderRadius: "9999px",
            background: THEME.colors.orange,
            color: "#FFF",
            fontSize: "15px",
            fontWeight: 800,
            letterSpacing: "0.1em",
            boxShadow: "0 8px 24px rgba(244, 91, 22, 0.35)",
            marginBottom: "14px",
          }}
        >
          WINDOWS SERVER 2008 R2 • OVERVIEW
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
          Incremental Backup Architecture
        </h1>

        <div style={{ fontSize: "17px", color: THEME.colors.charcoalMuted, fontWeight: 600 }}>
          Backing up only what changes — without duplicating full systems
        </div>
      </div>

      {/* MIDDLE 62%: PROMINENT 3D B-ROLL & GLOWING DATA PIPELINES */}
      <div
        style={{
          height: 1100,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 5,
        }}
      >
        {/* Glowing Orange Data Flow Bus Cable */}
        <DataFlowPipes
          startX={300}
          startY={220}
          endX={740}
          endY={220}
          color={THEME.colors.orange}
          lineWidth={5}
          speed={1.5}
          packetCount={4}
          isLatching={true}
          latchFrame={35}
          label="VSS DELTA STREAM"
        />

        {/* 3D Hardware Arrangement */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: 920,
            zIndex: 6,
          }}
        >
          {/* Left: Production Server Node */}
          <div
            style={{
              width: 320,
              padding: "24px",
              background: "#FFFFFF",
              borderRadius: "28px",
              boxShadow: "0 25px 60px -10px rgba(41, 37, 36, 0.18)",
              border: `2px solid ${THEME.colors.border}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "52px", marginBottom: "12px" }}>🖥️</div>
            <div style={{ fontSize: "18px", fontWeight: 900, color: THEME.colors.charcoal, marginBottom: "6px" }}>
              Production Server
            </div>
            <div style={{ fontSize: "13px", color: THEME.colors.charcoalMuted, marginBottom: "16px" }}>
              Active Database & System Files
            </div>
            <div
              style={{
                padding: "6px 14px",
                borderRadius: "12px",
                background: "#FEF2F2",
                color: THEME.colors.red,
                fontSize: "12px",
                fontWeight: 800,
              }}
            >
              ● High Modification Rate
            </div>
          </div>

          {/* Right: SAS 15K 3000 RPM Dedicated Hard Drive */}
          <HardDrive3DWidget width={380} height={440} isWriting delay={10} showSavedBadge={frame > 45} />
        </div>

        {/* Middle Floating 3D Isometric Data Stream */}
        <div style={{ marginTop: "32px", zIndex: 6 }}>
          <VssDataBlockStream blockCount={5} isIncremental style={{ transform: "scale(1.15)" }} />
        </div>

        {/* Floating Core Question Dilemma Card */}
        <div
          style={{
            width: "100%",
            maxWidth: 780,
            marginTop: "28px",
            padding: "18px 28px",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(12px)",
            borderRadius: "24px",
            boxShadow: THEME.shadows.card,
            border: `2px solid ${THEME.colors.orange}`,
            display: "flex",
            alignItems: "center",
            gap: "16px",
            zIndex: 6,
          }}
        >
          <span style={{ fontSize: "36px" }}>❓</span>
          <div>
            <div style={{ fontSize: "16px", fontWeight: 900, color: THEME.colors.orange }}>
              THE CORE PROBLEM:
            </div>
            <div style={{ fontSize: "14px", color: THEME.colors.charcoal, fontWeight: 700, lineHeight: 1.4 }}>
              How can we back up changing data continuously without repeating full backups every single day?
            </div>
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
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: THEME.colors.orange }} />
          <span style={{ fontSize: "12px", fontWeight: 800, color: THEME.colors.charcoalMuted, letterSpacing: "0.06em" }}>
            AUDIO SPOKEN TRANSCRIPT
          </span>
        </div>
        <KineticSubtitleEngine sceneId="scene1" fontSize={42} layout="vertical" />
      </div>
    </div>
  );
};
