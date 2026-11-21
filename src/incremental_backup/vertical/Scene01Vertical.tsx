import React from "react";
import { useCurrentFrame, Audio, staticFile } from "remotion";
import { THEME } from "../theme";
import { KineticSubtitleEngine } from "../components/KineticSubtitleEngine";
import { CurvedSpline } from "../components/CurvedSpline";
import {
  ElevatedCard,
  ServerRackCard,
  HardDrivePlatterCard,
  ComponentSvgIcon,
} from "../components/VectorComponents";

export const Scene01Vertical: React.FC = () => {
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
      <Audio src={staticFile("incremental_backup/scene1.wav")} />

      {/* Top Category Badge */}
      <div
        style={{
          padding: "10px 28px",
          borderRadius: "9999px",
          background: THEME.colors.orange,
          color: "#FFFFFF",
          fontSize: "15px",
          fontWeight: 800,
          letterSpacing: "0.1em",
          boxShadow: "0 8px 24px rgba(244, 91, 22, 0.32)",
        }}
      >
        WINDOWS SERVER 2008 R2 • OVERVIEW
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
        <KineticSubtitleEngine sceneId="scene1" fontSize={56} layout="vertical" />
      </div>

      {/* Central Visual Stage: IMMERSIVE (1040px height, 940px width) */}
      <div
        style={{
          width: 940,
          height: 1040,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Dynamic Curved Spline with flowing glowing data packets */}
        <CurvedSpline
          x1={240}
          y1={300}
          x2={700}
          y2={740}
          curvature={110}
          color={THEME.colors.blue}
          lineWidth={6}
          frame={frame}
          packetCount={5}
        />

        {/* Server Rack Node from Component.svg (Top-Left) */}
        <div style={{ position: "absolute", left: 10, top: 40 }}>
          <ServerRackCard frame={frame} label="Primary Host Server" width={420} height={460} />
        </div>

        {/* Dedicated Hard Drive Node from Component.svg (Bottom-Right) */}
        <div style={{ position: "absolute", right: 10, bottom: 40 }}>
          <HardDrivePlatterCard frame={frame} label="Dedicated Backup Disk" width={420} height={460} />
        </div>

        {/* Central Sync Badge between Server & Platter */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            background: "#FFFFFF",
            padding: "16px 24px",
            borderRadius: "20px",
            boxShadow: THEME.shadows.cardElevated,
            border: `2px solid ${THEME.colors.blue}`,
            display: "flex",
            alignItems: "center",
            gap: "12px",
            zIndex: 15,
          }}
        >
          <ComponentSvgIcon name="sync_arrows" size={32} />
          <span style={{ fontSize: "16px", fontWeight: 800, color: THEME.colors.charcoal }}>
            Continuous Sync Loop
          </span>
        </div>
      </div>

      {/* Bottom Metric Pill: Fills lower canvas */}
      <div
        style={{
          width: 900,
          height: 120,
          background: "#FFFFFF",
          padding: "20px 36px",
          borderRadius: "28px",
          boxShadow: THEME.shadows.card,
          border: `1px solid ${THEME.colors.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxSizing: "border-box",
          marginBottom: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ fontSize: "32px" }}>⚡</span>
          <div>
            <div style={{ fontSize: "20px", fontWeight: 800, color: THEME.colors.charcoal }}>
              VSS Block-Level Delta Tracking Active
            </div>
            <div style={{ fontSize: "14px", color: THEME.colors.charcoalMuted, fontWeight: 600 }}>
              Captures changed clusters without duplicating full volume
            </div>
          </div>
        </div>
        <div
          style={{
            background: THEME.colors.greenLight,
            color: THEME.colors.green,
            fontWeight: 800,
            fontSize: "16px",
            padding: "8px 18px",
            borderRadius: "9999px",
          }}
        >
          ONLINE
        </div>
      </div>

      {/* Subtle brand / topic footer watermark */}
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
