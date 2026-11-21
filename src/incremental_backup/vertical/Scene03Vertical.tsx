import React from "react";
import { useCurrentFrame, Audio, staticFile } from "remotion";
import { THEME } from "../theme";
import { KineticSubtitleEngine } from "../components/KineticSubtitleEngine";
import { CurvedSpline } from "../components/CurvedSpline";
import { ElevatedCard, ComponentSvgIcon } from "../components/VectorComponents";

export const Scene03Vertical: React.FC = () => {
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
      <Audio src={staticFile("incremental_backup/scene3.wav")} />

      {/* Top Category Badge */}
      <div
        style={{
          padding: "10px 28px",
          borderRadius: "9999px",
          background: THEME.colors.purple,
          color: "#FFFFFF",
          fontSize: "15px",
          fontWeight: 800,
          letterSpacing: "0.1em",
          boxShadow: `0 8px 24px ${THEME.colors.purple}35`,
        }}
      >
        STRATEGY COMPARISON • INCREMENTAL VS DIFFERENTIAL
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
        <KineticSubtitleEngine sceneId="scene3" fontSize={54} layout="vertical" />
      </div>

      {/* Central Visual Stage: Dual Comparison Columns (940px width, 1040px height) */}
      <div
        style={{
          width: 940,
          height: 1040,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "30px",
        }}
      >
        {/* Animated Connecting Splines */}
        <CurvedSpline x1={240} y1={420} x2={470} y2={640} curvature={-40} color={THEME.colors.green} frame={frame} lineWidth={5} />
        <CurvedSpline x1={700} y1={420} x2={470} y2={640} curvature={40} color={THEME.colors.purple} frame={frame} lineWidth={5} />

        {/* Dual Side-by-Side Comparison Cards */}
        <div style={{ display: "flex", gap: "28px", width: "100%", justifyContent: "space-between", zIndex: 10 }}>
          {/* Left Column: INCREMENTAL BACKUP */}
          <ElevatedCard
            width={450}
            height={480}
            padding="28px 24px"
            style={{ border: `3px solid ${THEME.colors.green}` }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
              <ComponentSvgIcon name="gears" size={54} />
              <div>
                <div style={{ fontSize: "20px", fontWeight: 800, color: THEME.colors.green }}>
                  INCREMENTAL
                </div>
                <div style={{ fontSize: "13px", color: THEME.colors.charcoalMuted, fontWeight: 600 }}>
                  Since last backup only
                </div>
              </div>
            </div>

            {/* Daily Sequence Bars */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%", marginTop: "8px" }}>
              <div style={{ background: "#F1F5F9", padding: "12px 18px", borderRadius: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 800, fontSize: "15px", color: THEME.colors.charcoal }}>Mon (Delta 1)</span>
                <span style={{ fontWeight: 900, fontSize: "18px", color: THEME.colors.green }}>+2 GB</span>
              </div>
              <div style={{ background: "#F1F5F9", padding: "12px 18px", borderRadius: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 800, fontSize: "15px", color: THEME.colors.charcoal }}>Tue (Delta 2)</span>
                <span style={{ fontWeight: 900, fontSize: "18px", color: THEME.colors.green }}>+1 GB</span>
              </div>
              <div style={{ background: "#F1F5F9", padding: "12px 18px", borderRadius: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 800, fontSize: "15px", color: THEME.colors.charcoal }}>Wed (Delta 3)</span>
                <span style={{ fontWeight: 900, fontSize: "18px", color: THEME.colors.green }}>+3 GB</span>
              </div>
            </div>

            <div style={{ marginTop: "20px", padding: "10px 16px", borderRadius: "12px", background: "#DCFCE7", color: "#166534", fontWeight: 800, fontSize: "14px", textAlign: "center", width: "100%" }}>
              FASTEST BACKUP WINDOW
            </div>
          </ElevatedCard>

          {/* Right Column: DIFFERENTIAL BACKUP */}
          <ElevatedCard
            width={450}
            height={480}
            padding="28px 24px"
            style={{ border: `2px solid ${THEME.colors.border}` }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
              <ComponentSvgIcon name="folder" size={54} />
              <div>
                <div style={{ fontSize: "20px", fontWeight: 800, color: THEME.colors.purple }}>
                  DIFFERENTIAL
                </div>
                <div style={{ fontSize: "13px", color: THEME.colors.charcoalMuted, fontWeight: 600 }}>
                  Cumulative since full backup
                </div>
              </div>
            </div>

            {/* Daily Cumulative Sequence Bars */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%", marginTop: "8px" }}>
              <div style={{ background: "#F8FAFC", padding: "12px 18px", borderRadius: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 800, fontSize: "15px", color: THEME.colors.charcoal }}>Mon (Delta 1)</span>
                <span style={{ fontWeight: 800, fontSize: "18px", color: THEME.colors.purple }}>+2 GB</span>
              </div>
              <div style={{ background: "#F8FAFC", padding: "12px 18px", borderRadius: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 800, fontSize: "15px", color: THEME.colors.charcoal }}>Tue (Delta 1+2)</span>
                <span style={{ fontWeight: 800, fontSize: "18px", color: THEME.colors.purple }}>+3 GB</span>
              </div>
              <div style={{ background: "#F8FAFC", padding: "12px 18px", borderRadius: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 800, fontSize: "15px", color: THEME.colors.charcoal }}>Wed (Delta 1+2+3)</span>
                <span style={{ fontWeight: 800, fontSize: "18px", color: THEME.colors.purple }}>+6 GB</span>
              </div>
            </div>

            <div style={{ marginTop: "20px", padding: "10px 16px", borderRadius: "12px", background: "#F3E8FF", color: "#6B21A8", fontWeight: 800, fontSize: "14px", textAlign: "center", width: "100%" }}>
              GROWS LARGER EACH DAY
            </div>
          </ElevatedCard>
        </div>

        {/* Trade-Off Comparison Summary Banner (940px wide) */}
        <ElevatedCard width={940} height={150} padding="22px 36px">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <ComponentSvgIcon name="sync_arrows" size={56} />
              <div>
                <div style={{ fontSize: "22px", fontWeight: 800, color: THEME.colors.charcoal }}>
                  Architectural Trade-Off Summary
                </div>
                <div style={{ fontSize: "15px", color: THEME.colors.charcoalMuted, fontWeight: 600, marginTop: "4px" }}>
                  Incremental optimizes for daily backup speed; Differential optimizes for restore simplicity.
                </div>
              </div>
            </div>
            <div
              style={{
                background: THEME.colors.orange,
                color: "#FFFFFF",
                fontWeight: 800,
                fontSize: "15px",
                padding: "10px 22px",
                borderRadius: "9999px",
              }}
            >
              KEY TAKEAWAY
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
