import React from "react";
import { spring, useCurrentFrame, useVideoConfig, Audio, staticFile } from "remotion";
import { THEME } from "../theme";
import { CanvaCard } from "../components/CanvaCard";
import { HeaderBanner } from "../components/HeaderBanner";
import { WindowsServerDialog } from "../components/WindowsServerDialog";
import { KineticSubtitleEngine } from "../components/KineticSubtitleEngine";

export const Scene05ConfigurePerformance: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Selection animation on option 2 (Faster)
  const isSelected = frame >= 120;
  const selectSpring = spring({
    frame: Math.max(0, frame - 120),
    fps,
    config: THEME.springs.bouncy,
  });

  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        background: THEME.colors.cream,
        backgroundImage: `radial-gradient(${THEME.colors.charcoal} 0.75px, transparent 0.75px)`,
        backgroundSize: "28px 28px",
        padding: "50px 80px",
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
        fontFamily: THEME.typography.fontFamily,
      }}
    >
      <Audio src={staticFile("incremental_backup/scene5.wav")} />

      <HeaderBanner
        category="Optimization & Performance"
        title="Configure Performance Settings"
        subtitle="Unlocking block-level incremental backup inside Windows Server Backup."
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          gap: "40px",
          marginTop: "16px",
          alignItems: "center",
        }}
      >
        {/* Left: Performance Options Dialog */}
        <WindowsServerDialog title="Optimize Backup Performance" width={740} height={470}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <p style={{ fontSize: "14px", color: THEME.colors.charcoalMuted, margin: 0 }}>
              Specify the performance options for scheduled backups. You can configure incremental backup behavior for all volumes or customize by volume.
            </p>

            {/* Option 1: Normal */}
            <div
              style={{
                padding: "16px 20px",
                borderRadius: "14px",
                border: `1.5px solid ${THEME.colors.border}`,
                background: "#FAFAF9",
                display: "flex",
                alignItems: "flex-start",
                gap: "14px",
              }}
            >
              <input type="radio" checked={!isSelected} readOnly style={{ marginTop: "4px" }} />
              <div>
                <div style={{ fontSize: "15px", fontWeight: 700, color: THEME.colors.charcoal }}>
                  Normal backup performance
                </div>
                <div style={{ fontSize: "12px", color: THEME.colors.charcoalMuted, marginTop: "2px" }}>
                  Performs a full backup each time. Requires longer backup windows and higher data transfer.
                </div>
              </div>
            </div>

            {/* Option 2: FASTER (THE HERO INCREMENTAL OPTION) */}
            <div
              style={{
                padding: "18px 22px",
                borderRadius: "16px",
                border: isSelected
                  ? `2.5px solid ${THEME.colors.orange}`
                  : `1.5px solid ${THEME.colors.border}`,
                background: isSelected ? THEME.colors.orangeLight : "#FAFAF9",
                boxShadow: isSelected
                  ? "0 10px 25px rgba(244, 91, 22, 0.18)"
                  : "none",
                display: "flex",
                alignItems: "flex-start",
                gap: "14px",
                transform: `scale(${isSelected ? 1.02 : 1.0})`,
                transition: "all 0.3s ease",
              }}
            >
              <input
                type="radio"
                checked={isSelected}
                readOnly
                style={{ marginTop: "4px", accentColor: THEME.colors.orange }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ fontSize: "16px", fontWeight: 800, color: THEME.colors.charcoal }}>
                    Faster backup performance
                  </div>
                  {isSelected && (
                    <span
                      style={{
                        padding: "3px 8px",
                        borderRadius: THEME.borderRadius.pill,
                        background: THEME.colors.orange,
                        color: "#FFFFFF",
                        fontSize: "10px",
                        fontWeight: 800,
                      }}
                    >
                      SELECTED
                    </span>
                  )}
                </div>
                <div style={{ fontSize: "13px", color: THEME.colors.charcoal, marginTop: "4px", fontWeight: 600 }}>
                  Enables block-level incremental backup. After the initial full backup, only changed data blocks are written.
                </div>
              </div>
            </div>

            {/* Option 3: Custom */}
            <div
              style={{
                padding: "16px 20px",
                borderRadius: "14px",
                border: `1.5px solid ${THEME.colors.border}`,
                background: "#FAFAF9",
                display: "flex",
                alignItems: "flex-start",
                gap: "14px",
              }}
            >
              <input type="radio" checked={false} readOnly style={{ marginTop: "4px" }} />
              <div>
                <div style={{ fontSize: "15px", fontWeight: 700, color: THEME.colors.charcoal }}>
                  Custom
                </div>
                <div style={{ fontSize: "12px", color: THEME.colors.charcoalMuted, marginTop: "2px" }}>
                  Configure performance settings individually for specific system volumes.
                </div>
              </div>
            </div>
          </div>
        </WindowsServerDialog>

        {/* Right: Explanatory Breakdown Card */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <CanvaCard delay={30} highlight={isSelected}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "10px",
                  background: THEME.colors.green,
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 900,
                  fontSize: "18px",
                }}
              >
                ⚡
              </div>
              <div>
                <span style={{ fontSize: "11px", fontWeight: 800, color: THEME.colors.green, textTransform: "uppercase" }}>
                  KEY EQUIVALENCE
                </span>
                <h3 style={{ ...THEME.typography.h3, fontSize: "20px", margin: 0 }}>
                  Faster Performance = Incremental
                </h3>
              </div>
            </div>
            <p style={{ ...THEME.typography.body, fontSize: "15px", margin: "0 0 14px 0" }}>
              Windows Server 2008 uses Volume Shadow Copy Service (VSS) to track modified clusters. Selecting <b>Faster backup performance</b> instructs the engine to transfer only changed blocks to the dedicated backup volume.
            </p>
            <div
              style={{
                padding: "10px 16px",
                borderRadius: "12px",
                background: THEME.colors.greenLight,
                color: THEME.colors.green,
                fontSize: "13px",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>✓</span>
              <span>Dramatically shortens daily backup windows</span>
            </div>
          </CanvaCard>

          <CanvaCard delay={50} style={{ padding: "20px 24px" }}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: THEME.colors.charcoal, marginBottom: "6px" }}>
              Action Panel Location:
            </div>
            <div style={{ fontSize: "14px", color: THEME.colors.orange, fontWeight: 700 }}>
              Windows Server Backup → Actions Panel → Configure Performance Settings...
            </div>
          </CanvaCard>
        </div>
      </div>

      {/* Dynamic Kinetic Subtitle Engine */}
      <KineticSubtitleEngine
        sceneId="scene5"
        fontSize={36}
        layout="landscape"
        style={{
          position: "absolute",
          bottom: "16px",
          left: 0,
          right: 0,
          zIndex: 10,
        }}
      />
    </div>
  );
};
