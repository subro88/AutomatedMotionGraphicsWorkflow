import React from "react";
import { useCurrentFrame, Audio, staticFile } from "remotion";
import { THEME } from "../theme";
import { KineticSubtitleEngine } from "../components/KineticSubtitleEngine";
import { CurvedSpline } from "../components/CurvedSpline";
import { ElevatedCard, ComponentSvgIcon } from "../components/VectorComponents";

export const Scene10Vertical: React.FC = () => {
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
      <Audio src={staticFile("incremental_backup/scene10.wav")} />

      {/* Top Category Badge */}
      <div
        style={{
          padding: "10px 28px",
          borderRadius: "9999px",
          background: THEME.colors.green,
          color: "#FFFFFF",
          fontSize: "15px",
          fontWeight: 800,
          letterSpacing: "0.1em",
          boxShadow: `0 8px 24px ${THEME.colors.green}35`,
        }}
      >
        SUMMARY • PRODUCTION BEST PRACTICES
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
        <KineticSubtitleEngine sceneId="scene10" fontSize={54} layout="vertical" />
      </div>

      {/* Central Visual Stage: Production Checklist & Verification (940px width, 1040px height) */}
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
        {/* Animated Connecting Spline */}
        <CurvedSpline x1={470} y1={520} x2={470} y2={760} curvature={0} color={THEME.colors.green} frame={frame} lineWidth={5} />

        {/* 3-Step Production Checklist Card */}
        <ElevatedCard
          width={940}
          height={480}
          padding="32px 36px"
          style={{ border: `3px solid ${THEME.colors.green}` }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "18px", marginBottom: "24px" }}>
            <ComponentSvgIcon name="sync_arrows" size={54} />
            <div>
              <div style={{ fontSize: "24px", fontWeight: 800, color: THEME.colors.charcoal }}>
                Incremental Backup Checklist
              </div>
              <div style={{ fontSize: "15px", color: THEME.colors.charcoalMuted, fontWeight: 600, marginTop: "2px" }}>
                3 Essential verification steps for enterprise reliability
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%" }}>
            <div style={{ background: "#F0FDF4", padding: "16px 20px", borderRadius: "16px", border: "1.5px solid #BBF7D0", display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ background: THEME.colors.green, color: "#FFF", width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "16px" }}>✓</div>
              <div>
                <div style={{ fontSize: "17px", fontWeight: 800, color: THEME.colors.charcoal }}>Configure "Faster backup performance"</div>
                <div style={{ fontSize: "13px", color: THEME.colors.charcoalMuted, fontWeight: 600 }}>Enables native VSS block delta tracking for fast daily windows</div>
              </div>
            </div>

            <div style={{ background: "#F0FDF4", padding: "16px 20px", borderRadius: "16px", border: "1.5px solid #BBF7D0", display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ background: THEME.colors.green, color: "#FFF", width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "16px" }}>✓</div>
              <div>
                <div style={{ fontSize: "17px", fontWeight: 800, color: THEME.colors.charcoal }}>Use a Dedicated Physical Hard Disk</div>
                <div style={{ fontSize: "13px", color: THEME.colors.charcoalMuted, fontWeight: 600 }}>Formatted exclusively for VSS and hidden from Explorer drive letters</div>
              </div>
            </div>

            <div style={{ background: "#F0FDF4", padding: "16px 20px", borderRadius: "16px", border: "1.5px solid #BBF7D0", display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ background: THEME.colors.green, color: "#FFF", width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "16px" }}>✓</div>
              <div>
                <div style={{ fontSize: "17px", fontWeight: 800, color: THEME.colors.charcoal }}>Perform Regular Disaster Recovery Drills</div>
                <div style={{ fontSize: "13px", color: THEME.colors.charcoalMuted, fontWeight: 600 }}>A backup is only as good as its proven ability to restore</div>
              </div>
            </div>
          </div>
        </ElevatedCard>

        {/* Disaster Recovery Verification Golden Card (Bottom) */}
        <ElevatedCard
          width={940}
          height={160}
          padding="24px 36px"
          style={{ background: "#FFFBEB", border: `2.5px solid ${THEME.colors.yellow}` }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <ComponentSvgIcon name="shield" size={68} />
              <div>
                <div style={{ fontSize: "22px", fontWeight: 800, color: THEME.colors.charcoal }}>
                  Disaster Recovery Verified
                </div>
                <div style={{ fontSize: "15px", color: THEME.colors.charcoalMuted, fontWeight: 600, marginTop: "4px" }}>
                  Complete bare-metal recovery and file restore drills tested
                </div>
              </div>
            </div>
            <div
              style={{
                background: THEME.colors.yellow,
                color: THEME.colors.charcoal,
                fontWeight: 900,
                fontSize: "15px",
                padding: "10px 22px",
                borderRadius: "9999px",
              }}
            >
              100% READY
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
