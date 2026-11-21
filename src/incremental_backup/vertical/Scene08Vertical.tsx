import React from "react";
import { useCurrentFrame, Audio, staticFile } from "remotion";
import { THEME } from "../theme";
import { KineticSubtitleEngine } from "../components/KineticSubtitleEngine";
import { CurvedSpline } from "../components/CurvedSpline";
import { ElevatedCard, ComponentSvgIcon } from "../components/VectorComponents";

export const Scene08Vertical: React.FC = () => {
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
      <Audio src={staticFile("incremental_backup/scene8.wav")} />

      {/* Top Category Badge */}
      <div
        style={{
          padding: "10px 28px",
          borderRadius: "9999px",
          background: THEME.colors.charcoal,
          color: "#FFFFFF",
          fontSize: "15px",
          fontWeight: 800,
          letterSpacing: "0.1em",
          boxShadow: "0 8px 24px rgba(41, 37, 36, 0.25)",
        }}
      >
        TECHNICAL ARCHITECTURE • VSS ENGINE & OVERHEAD
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
        <KineticSubtitleEngine sceneId="scene8" fontSize={54} layout="vertical" />
      </div>

      {/* Central Visual Stage: VSS Mechanics & I/O Pipeline (940px width, 1040px height) */}
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
        {/* Dynamic Curved Splines showing Copy-on-Write flow */}
        <CurvedSpline x1={240} y1={280} x2={470} y2={560} curvature={-30} color={THEME.colors.orange} frame={frame} lineWidth={5} />
        <CurvedSpline x1={700} y1={280} x2={470} y2={560} curvature={30} color={THEME.colors.blue} frame={frame} lineWidth={5} />

        {/* Top Split: Source Volume vs Shadow Storage */}
        <div style={{ display: "flex", gap: "28px", width: "100%", justifyContent: "space-between", zIndex: 10 }}>
          {/* Source Volume */}
          <ElevatedCard width={450} height={280} padding="24px 24px">
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "14px" }}>
              <ComponentSvgIcon name="server_tower" size={60} />
              <div>
                <div style={{ fontSize: "20px", fontWeight: 800, color: THEME.colors.charcoal }}>
                  Live Volume (C:\)
                </div>
                <div style={{ fontSize: "13px", color: THEME.colors.charcoalMuted, fontWeight: 600 }}>
                  Active writes & applications
                </div>
              </div>
            </div>
            <div style={{ fontSize: "14px", color: THEME.colors.charcoalMuted, lineHeight: 1.4, fontWeight: 600 }}>
              Writes are intercepted by VSS filter driver. Original blocks are preserved before being overwritten.
            </div>
            <div style={{ marginTop: "16px", background: "#EFF6FF", color: THEME.colors.blue, padding: "8px 14px", borderRadius: "10px", fontWeight: 800, fontSize: "13px", textAlign: "center" }}>
              COPY-ON-WRITE DRIVER
            </div>
          </ElevatedCard>

          {/* Shadow Storage */}
          <ElevatedCard width={450} height={280} padding="24px 24px">
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "14px" }}>
              <ComponentSvgIcon name="wrench_unit" size={60} />
              <div>
                <div style={{ fontSize: "20px", fontWeight: 800, color: THEME.colors.charcoal }}>
                  Diff Area (Shadow Copy)
                </div>
                <div style={{ fontSize: "13px", color: THEME.colors.charcoalMuted, fontWeight: 600 }}>
                  Historical delta repository
                </div>
              </div>
            </div>
            <div style={{ fontSize: "14px", color: THEME.colors.charcoalMuted, lineHeight: 1.4, fontWeight: 600 }}>
              Allocates 10%–15% disk space for holding historical volume blocks. Older diffs automatically age out.
            </div>
            <div style={{ marginTop: "16px", background: "#FEF3C7", color: "#B45309", padding: "8px 14px", borderRadius: "10px", fontWeight: 800, fontSize: "13px", textAlign: "center" }}>
              10-15% DIFF OVERHEAD
            </div>
          </ElevatedCard>
        </div>

        {/* Central Engine Hub Card */}
        <ElevatedCard width={940} height={220} padding="24px 36px" style={{ border: `3px solid ${THEME.colors.orange}` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
              <ComponentSvgIcon name="gears" size={72} />
              <div>
                <div style={{ fontSize: "22px", fontWeight: 800, color: THEME.colors.charcoal }}>
                  I/O Performance Trade-Off
                </div>
                <div style={{ fontSize: "15px", color: THEME.colors.charcoalMuted, fontWeight: 600, marginTop: "6px" }}>
                  Active incremental tracking consumes slight write I/O penalty during heavy database operations.
                </div>
              </div>
            </div>
            <div
              style={{
                background: THEME.colors.orangeLight,
                color: THEME.colors.orange,
                fontWeight: 800,
                fontSize: "15px",
                padding: "10px 20px",
                borderRadius: "9999px",
                border: `1px solid ${THEME.colors.orange}`,
              }}
            >
              MONITOR I/O
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
