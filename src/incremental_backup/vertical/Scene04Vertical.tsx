import React from "react";
import { useCurrentFrame, Audio, staticFile } from "remotion";
import { THEME } from "../theme";
import { KineticSubtitleEngine } from "../components/KineticSubtitleEngine";
import { CurvedSpline } from "../components/CurvedSpline";
import { ElevatedCard, ComponentSvgIcon } from "../components/VectorComponents";

export const Scene04Vertical: React.FC = () => {
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
      <Audio src={staticFile("incremental_backup/scene4.wav")} />

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
        CONFIGURATION • WINDOWS SERVER BACKUP
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
        <KineticSubtitleEngine sceneId="scene4" fontSize={54} layout="vertical" />
      </div>

      {/* Central Visual Stage: MMC Console & Network Topology (940px width, 1040px height) */}
      <div
        style={{
          width: 940,
          height: 1040,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "32px",
        }}
      >
        {/* Dynamic Curved Spline connecting Admin Console to Server Host */}
        <CurvedSpline
          x1={470}
          y1={280}
          x2={470}
          y2={540}
          curvature={0}
          color={THEME.colors.blue}
          lineWidth={6}
          frame={frame}
          packetCount={4}
        />

        {/* Admin Workstation Node (Top) */}
        <ElevatedCard width={940} height={200} padding="24px 36px">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
              <ComponentSvgIcon name="workstation" size={100} />
              <div>
                <div style={{ fontSize: "24px", fontWeight: 800, color: THEME.colors.charcoal }}>
                  Administrative Console • MMC Snap-in
                </div>
                <div style={{ fontSize: "16px", color: THEME.colors.charcoalMuted, fontWeight: 600, marginTop: "6px" }}>
                  Server Manager $\to$ Tools $\to$ Windows Server Backup (`wbadmin.msc`)
                </div>
              </div>
            </div>
            <div
              style={{
                background: THEME.colors.blueLight,
                color: THEME.colors.blue,
                fontWeight: 800,
                fontSize: "16px",
                padding: "10px 20px",
                borderRadius: "9999px",
              }}
            >
              WBADMIN
            </div>
          </div>
        </ElevatedCard>

        {/* Action Panel: Two Modes Breakdown */}
        <div style={{ display: "flex", gap: "28px", width: "100%", justifyContent: "space-between", zIndex: 10 }}>
          {/* Action 1: Backup Schedule */}
          <ElevatedCard
            width={450}
            height={260}
            padding="24px 24px"
            style={{ border: `3px solid ${THEME.colors.orange}` }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
              <span style={{ fontSize: "30px" }}>📅</span>
              <div style={{ fontSize: "20px", fontWeight: 800, color: THEME.colors.charcoal }}>
                Backup Schedule
              </div>
            </div>
            <div style={{ fontSize: "15px", color: THEME.colors.charcoalMuted, fontWeight: 600, lineHeight: 1.4 }}>
              Automated daily backup schedule. Unlocks VSS incremental performance tracking to dedicated target disks.
            </div>
            <div style={{ marginTop: "16px", background: THEME.colors.orangeLight, color: THEME.colors.orange, padding: "8px 14px", borderRadius: "10px", fontWeight: 800, fontSize: "13px", textAlign: "center" }}>
              SUPPORTS INCREMENTAL
            </div>
          </ElevatedCard>

          {/* Action 2: Backup Once */}
          <ElevatedCard width={450} height={260} padding="24px 24px">
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
              <span style={{ fontSize: "30px" }}>⚡</span>
              <div style={{ fontSize: "20px", fontWeight: 800, color: THEME.colors.charcoal }}>
                Backup Once
              </div>
            </div>
            <div style={{ fontSize: "15px", color: THEME.colors.charcoalMuted, fontWeight: 600, lineHeight: 1.4 }}>
              Ad-hoc manual one-time backup. Typically creates full copies or system state snapshots without scheduled delta chaining.
            </div>
            <div style={{ marginTop: "16px", background: "#F1F5F9", color: "#64748B", padding: "8px 14px", borderRadius: "10px", fontWeight: 800, fontSize: "13px", textAlign: "center" }}>
              ONE-TIME MANUAL RUN
            </div>
          </ElevatedCard>
        </div>

        {/* RJ45 Network Cable Connection Bar */}
        <ElevatedCard width={940} height={140} padding="20px 36px">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <ComponentSvgIcon name="ethernet_cable" size={70} />
              <div>
                <div style={{ fontSize: "20px", fontWeight: 800, color: THEME.colors.charcoal }}>
                  Integrated VSS Block Service
                </div>
                <div style={{ fontSize: "14px", color: THEME.colors.charcoalMuted, fontWeight: 600, marginTop: "4px" }}>
                  Requires no third-party agents; built directly into Windows Server 2008 R2 kernel
                </div>
              </div>
            </div>
            <div style={{ fontSize: "18px", fontWeight: 900, color: THEME.colors.green }}>
              NATIVE ENGINE
            </div>
          </div>
        </ElevatedCard>
      </div>

      {/* Subtle brand watermark */}
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
