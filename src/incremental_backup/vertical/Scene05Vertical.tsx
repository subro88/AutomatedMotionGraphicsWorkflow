import React from "react";
import { useCurrentFrame, Audio, staticFile } from "remotion";
import { THEME } from "../theme";
import { KineticSubtitleEngine } from "../components/KineticSubtitleEngine";
import { AeroDialog3DWidget } from "../components/AeroDialog3DWidget";
import { DataFlowPipes } from "../components/DataFlowPipes";

export const Scene05Vertical: React.FC = () => {
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
      <Audio src={staticFile("incremental_backup/scene5.wav")} />

      {/* TOP 18%: PERMANENT STEP HEADER */}
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
            boxShadow: `0 8px 24px rgba(244, 91, 22, 0.35)`,
            marginBottom: "14px",
          }}
        >
          CRITICAL SETTING • PERFORMANCE
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
          Configure Performance
        </h1>

        <div style={{ fontSize: "17px", color: THEME.colors.charcoalMuted, fontWeight: 600 }}>
          Switching from full volume copy to VSS block-level incremental mode
        </div>
      </div>

      {/* MIDDLE 62%: 3D AERO DIALOG + GLOWING VSS PIPELINE + TAKEAWAY */}
      <div
        style={{
          height: 1100,
          display: "flex",
          flexDirection: "column",
          gap: "26px",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 5,
        }}
      >
        {/* Glowing Orange Bus Cable */}
        <DataFlowPipes
          startX={240}
          startY={360}
          endX={840}
          endY={360}
          color={THEME.colors.orange}
          lineWidth={5}
          speed={1.6}
          packetCount={5}
          isLatching={frame > 45}
          latchFrame={45}
          label="VSS BLOCK TRACKER"
        />

        {/* 3D Aero Glass Dialog Simulation with Cursor Hover & Click */}
        <AeroDialog3DWidget
          title="Optimize Backup Performance"
          width={680}
          selectedOption="faster"
          delay={15}
        />

        {/* Takeaway Card with High Impact Visual Metaphor */}
        <div
          style={{
            width: "100%",
            maxWidth: 680,
            background: "#FFFBF7",
            borderRadius: "24px",
            padding: "22px 30px",
            border: `2.5px solid ${THEME.colors.orange}`,
            boxShadow: THEME.shadows.card,
            display: "flex",
            alignItems: "center",
            gap: "18px",
            zIndex: 6,
          }}
        >
          <span style={{ fontSize: "36px" }}>💡</span>
          <div>
            <div style={{ fontSize: "16px", fontWeight: 900, color: THEME.colors.orange, marginBottom: "4px" }}>
              "FASTER BACKUP PERFORMANCE" = INCREMENTAL MODE
            </div>
            <div style={{ fontSize: "13px", color: THEME.colors.charcoal, fontWeight: 700, lineHeight: 1.4 }}>
              Forces Windows Server 2008 to track block-level modifications in Volume Shadow Copy, avoiding repeated full disk transfers.
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
        <KineticSubtitleEngine sceneId="scene5" fontSize={42} layout="vertical" />
      </div>
    </div>
  );
};
