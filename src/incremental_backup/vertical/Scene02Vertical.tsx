import React from "react";
import { useCurrentFrame, Audio, staticFile } from "remotion";
import { THEME } from "../theme";
import { KineticSubtitleEngine } from "../components/KineticSubtitleEngine";
import { CurvedSpline } from "../components/CurvedSpline";
import { ElevatedCard, ComponentSvgIcon } from "../components/VectorComponents";

export const Scene02Vertical: React.FC = () => {
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
      <Audio src={staticFile("incremental_backup/scene2.wav")} />

      {/* Top Category Badge */}
      <div
        style={{
          padding: "10px 28px",
          borderRadius: "9999px",
          background: THEME.colors.blue,
          color: "#FFFFFF",
          fontSize: "15px",
          fontWeight: 800,
          letterSpacing: "0.1em",
          boxShadow: `0 8px 24px ${THEME.colors.blue}35`,
        }}
      >
        STEP 01 • INCREMENTAL ARCHITECTURE
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
        <KineticSubtitleEngine sceneId="scene2" fontSize={54} layout="vertical" />
      </div>

      {/* Central Architecture Stage: IMMERSIVE (1040px height, 940px width) */}
      <div
        style={{
          width: 940,
          height: 1040,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "36px",
        }}
      >
        {/* Curved Splines connecting Full Backup to Deltas */}
        <CurvedSpline x1={470} y1={230} x2={160} y2={450} curvature={-50} color={THEME.colors.green} frame={frame} lineWidth={5} />
        <CurvedSpline x1={470} y1={230} x2={470} y2={450} curvature={0} color={THEME.colors.orange} frame={frame} lineWidth={5} />
        <CurvedSpline x1={470} y1={230} x2={780} y2={450} curvature={50} color={THEME.colors.blue} frame={frame} lineWidth={5} />

        {/* Day 0: Full Backup Base Container (940px wide) */}
        <ElevatedCard width={940} height={180} padding="24px 36px">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <ComponentSvgIcon name="server_tower" size={90} />
              <div>
                <div style={{ fontSize: "24px", fontWeight: 800, color: THEME.colors.charcoal }}>
                  Sunday Baseline: Full Backup
                </div>
                <div style={{ fontSize: "16px", color: THEME.colors.charcoalMuted, marginTop: "6px", fontWeight: 600 }}>
                  Complete OS, System State & Volume Snapshot (C:\ + System Reserved)
                </div>
              </div>
            </div>
            <div
              style={{
                background: THEME.colors.blueLight,
                color: THEME.colors.blue,
                fontWeight: 800,
                fontSize: "24px",
                padding: "12px 24px",
                borderRadius: "16px",
              }}
            >
              100 GB
            </div>
          </div>
        </ElevatedCard>

        {/* Row of 3 Daily Incremental Deltas (940px total span) */}
        <div style={{ display: "flex", gap: "28px", width: "100%", justifyContent: "space-between", zIndex: 10 }}>
          {/* Day 1 Delta */}
          <ElevatedCard width={290} height={250} padding="24px 20px">
            <div style={{ fontSize: "16px", fontWeight: 800, color: THEME.colors.green, marginBottom: "10px" }}>
              MONDAY DELTA
            </div>
            <div style={{ fontSize: "40px", fontWeight: 800, color: THEME.colors.charcoal }}>
              2.4 GB
            </div>
            <div style={{ fontSize: "14px", color: THEME.colors.charcoalMuted, marginTop: "12px", textAlign: "center", fontWeight: 600 }}>
              Changed blocks only since Sunday
            </div>
          </ElevatedCard>

          {/* Day 2 Delta */}
          <ElevatedCard width={290} height={250} padding="24px 20px" style={{ border: `3px solid ${THEME.colors.orange}` }}>
            <div style={{ fontSize: "16px", fontWeight: 800, color: THEME.colors.orange, marginBottom: "10px" }}>
              TUESDAY DELTA
            </div>
            <div style={{ fontSize: "40px", fontWeight: 800, color: THEME.colors.charcoal }}>
              1.1 GB
            </div>
            <div style={{ fontSize: "14px", color: THEME.colors.charcoalMuted, marginTop: "12px", textAlign: "center", fontWeight: 600 }}>
              Changed blocks only since Monday
            </div>
          </ElevatedCard>

          {/* Day 3 Delta */}
          <ElevatedCard width={290} height={250} padding="24px 20px">
            <div style={{ fontSize: "16px", fontWeight: 800, color: THEME.colors.blue, marginBottom: "10px" }}>
              WEDNESDAY DELTA
            </div>
            <div style={{ fontSize: "40px", fontWeight: 800, color: THEME.colors.charcoal }}>
              3.0 GB
            </div>
            <div style={{ fontSize: "14px", color: THEME.colors.charcoalMuted, marginTop: "12px", textAlign: "center", fontWeight: 600 }}>
              Changed blocks only since Tuesday
            </div>
          </ElevatedCard>
        </div>

        {/* Dynamic Metric Card (940px wide) */}
        <ElevatedCard width={940} height={140} padding="20px 36px" style={{ background: "#ECFDF5", border: "2px solid #A7F3D0" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
              <span style={{ fontSize: "36px" }}>⚡</span>
              <div>
                <div style={{ fontSize: "22px", fontWeight: 800, color: "#065F46" }}>
                  90% Storage Space Saved Every Week
                </div>
                <div style={{ fontSize: "15px", color: "#047857", fontWeight: 600, marginTop: "4px" }}>
                  Fast delta transfer without duplicating 100 GB base image
                </div>
              </div>
            </div>
            <div style={{ fontSize: "26px", fontWeight: 800, color: "#059669" }}>
              SUB-MINUTE
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
