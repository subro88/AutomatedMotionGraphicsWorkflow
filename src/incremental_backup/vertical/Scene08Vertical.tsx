import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, Audio, staticFile } from "remotion";
import { THEME } from "../theme";
import { KineticSubtitleEngine } from "../components/KineticSubtitleEngine";
import { ElevatedCard, ComponentSvgIcon } from "../components/VectorComponents";

export const Scene08Vertical: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ---------------------------------------------------------
  // PHASE CHOREOGRAPHY (Native 2008 R2 Limitations)
  // Phase 1: 0 - 374   Intro Warning & Restrictions
  // Phase 2: 374 - 590 2TB Volume Limit & Removable Media Block
  // Phase 3: 590 - 900 Network Share Overwrite Danger (Major Gotcha)
  // Phase 4: 900 - 1076 Lack of Differential Option
  // Phase 5: 1076 - 1217 Verification & Destination Best Practice
  // ---------------------------------------------------------

  // Phase 1 Entrance
  const introSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 85 },
  });

  // Phase 2: Limitations Cards
  const limit1Spring = spring({ frame: frame - 374, fps, config: { damping: 13, stiffness: 100 } });
  const limit2Spring = spring({ frame: frame - 470, fps, config: { damping: 13, stiffness: 100 } });

  // Phase 3: Network Share Overwrite Danger
  const overwriteSpring = spring({ frame: frame - 590, fps, config: { damping: 12, stiffness: 110 } });
  const overwritePulse = frame >= 590 ? 0.5 + 0.5 * Math.sin((frame - 590) * 0.2) : 0;

  // Phase 4: No Differential Card
  const noDiffSpring = spring({ frame: frame - 900, fps, config: { damping: 13, stiffness: 100 } });

  // Phase 5: Recommendation Card
  const recSpring = spring({ frame: frame - 1076, fps, config: { damping: 14, stiffness: 95 } });

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
          background: "#DC2626",
          color: "#FFFFFF",
          fontSize: "15px",
          fontWeight: 800,
          letterSpacing: "0.1em",
          boxShadow: "0 8px 24px rgba(220, 38, 38, 0.35)",
          transform: `scale(${introSpring})`,
        }}
      >
        CRITICAL RESTRICTIONS • NATIVE LIMITATIONS
      </div>

      {/* Top Dynamic Kinetic Subtitle Phrase */}
      <div
        style={{
          marginTop: "16px",
          minHeight: "150px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <KineticSubtitleEngine sceneId="scene8" fontSize={54} layout="vertical" />
      </div>

      {/* Central Architecture Stage (940px wide, 1100px height) */}
      <div
        style={{
          width: 940,
          height: 1100,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "24px",
        }}
      >
        {/* Hero Card: 2008 Native Engine Warnings */}
        <div style={{ width: 940, transform: `scale(${introSpring})`, opacity: introSpring, zIndex: 10 }}>
          <ElevatedCard width={940} height={170} padding="22px 34px">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <span style={{ fontSize: "52px" }}>⚠️</span>
                <div>
                  <div style={{ fontSize: "23px", fontWeight: 800, color: THEME.colors.charcoal }}>
                    Windows Server 2008 Built-in Constraints
                  </div>
                  <div style={{ fontSize: "14px", color: THEME.colors.charcoalMuted, marginTop: "4px", fontWeight: 600 }}>
                    Architecture restrictions you must account for before deploying production backups
                  </div>
                </div>
              </div>
              <div
                style={{
                  background: "#FEE2E2",
                  color: "#DC2626",
                  fontWeight: 800,
                  fontSize: "16px",
                  padding: "10px 20px",
                  borderRadius: "14px",
                  border: "1.5px solid rgba(220, 38, 38, 0.3)",
                }}
              >
                RESTRICTED
              </div>
            </div>
          </ElevatedCard>
        </div>

        {/* Phase 2: 2TB Volume & Removable Drive Restrictions */}
        <div style={{ width: 940, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", zIndex: 10 }}>
          {/* Restriction 1: 2TB Volume Size */}
          <div style={{ transform: `scale(${limit1Spring})`, opacity: limit1Spring }}>
            <ElevatedCard width="100%" height={210} padding="22px 24px">
              <div style={{ fontSize: "15px", fontWeight: 800, color: "#DC2626", marginBottom: "8px" }}>
                ❌ 2.0 TB VOLUME LIMIT
              </div>
              <div style={{ fontSize: "20px", fontWeight: 800, color: THEME.colors.charcoal }}>
                VHD Format Constraint
              </div>
              <div style={{ fontSize: "13px", color: THEME.colors.charcoalMuted, marginTop: "8px", fontWeight: 600 }}>
                WSB in 2008 uses legacy .VHD format, which cannot backup source volumes larger than 2040 GB.
              </div>
              <div style={{ marginTop: "12px", fontSize: "12px", fontWeight: 800, color: "#DC2626" }}>
                Fails on modern 4TB+ Disks
              </div>
            </ElevatedCard>
          </div>

          {/* Restriction 2: Removable Storage Block */}
          <div style={{ transform: `scale(${limit2Spring})`, opacity: limit2Spring }}>
            <ElevatedCard width="100%" height={210} padding="22px 24px">
              <div style={{ fontSize: "15px", fontWeight: 800, color: "#DC2626", marginBottom: "8px" }}>
                ❌ REMOVABLE MEDIA BLOCKED
              </div>
              <div style={{ fontSize: "20px", fontWeight: 800, color: THEME.colors.charcoal }}>
                No USB Flash Support
              </div>
              <div style={{ fontSize: "13px", color: THEME.colors.charcoalMuted, marginTop: "8px", fontWeight: 600 }}>
                Scheduled backups require dedicated fixed internal or external hard drives; thumb drives are rejected.
              </div>
              <div style={{ marginTop: "12px", fontSize: "12px", fontWeight: 800, color: "#DC2626" }}>
                Requires Fixed Disk Partition
              </div>
            </ElevatedCard>
          </div>
        </div>

        {/* Phase 3: Network Share Overwrite Danger (Major Gotcha) */}
        {frame >= 590 && (
          <div
            style={{
              width: 940,
              background: "#FEF2F2",
              padding: "24px 34px",
              borderRadius: "28px",
              boxShadow: `0 0 ${overwritePulse * 30}px rgba(239, 68, 68, 0.4)`,
              border: "3px solid #EF4444",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxSizing: "border-box",
              transform: `scale(${overwriteSpring})`,
              opacity: overwriteSpring,
              zIndex: 25,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
              <span style={{ fontSize: "40px" }}>🚨</span>
              <div>
                <div style={{ fontSize: "21px", fontWeight: 900, color: "#DC2626" }}>
                  NETWORK SHARE OVERWRITE HAZARD
                </div>
                <div style={{ fontSize: "14px", color: "#7F1D1D", fontWeight: 700, marginTop: "4px" }}>
                  Backing up to network share (NAS/SMB) ALWAYS overwrites previous backup! No incremental history retained!
                </div>
              </div>
            </div>

            <div
              style={{
                background: "#EF4444",
                color: "#FFFFFF",
                fontWeight: 800,
                fontSize: "14px",
                padding: "10px 20px",
                borderRadius: "9999px",
                whiteSpace: "nowrap",
                letterSpacing: "0.04em",
              }}
            >
              ONLY 1 VERSION
            </div>
          </div>
        )}

        {/* Phase 5 (f >= 1076): Recommended Best Practice */}
        {frame >= 1076 && (
          <div
            style={{
              width: 940,
              background: "#FFFFFF",
              padding: "20px 34px",
              borderRadius: "28px",
              boxShadow: THEME.shadows.cardElevated,
              border: `2px solid ${THEME.colors.green}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxSizing: "border-box",
              transform: `scale(${recSpring})`,
              opacity: recSpring,
              zIndex: 30,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <ComponentSvgIcon name="shield" size={42} />
              <div>
                <div style={{ fontSize: "19px", fontWeight: 800, color: THEME.colors.charcoal }}>
                  Best Practice: Dedicated Local Pool Disk
                </div>
                <div style={{ fontSize: "13px", color: THEME.colors.charcoalMuted, fontWeight: 600, marginTop: "2px" }}>
                  Dedicate an entire internal/external disk to WSB to enable multiple VSS shadow copy versions
                </div>
              </div>
            </div>

            <div
              style={{
                background: "#ECFDF5",
                color: THEME.colors.green,
                fontWeight: 900,
                fontSize: "13px",
                padding: "8px 16px",
                borderRadius: "9999px",
              }}
            >
              ✓ RECOMMENDED
            </div>
          </div>
        )}
      </div>

      {/* Bottom Status Card */}
      <div
        style={{
          width: 940,
          background: "#FFFFFF",
          padding: "18px 32px",
          borderRadius: "24px",
          boxShadow: THEME.shadows.card,
          border: `1px solid ${THEME.colors.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <span style={{ fontSize: "20px" }}>🔍</span>
          <div>
            <div style={{ fontSize: "17px", fontWeight: 800, color: THEME.colors.charcoal }}>
              Storage Verification Matrix
            </div>
            <div style={{ fontSize: "13px", color: THEME.colors.charcoalMuted, fontWeight: 600 }}>
              Verify destination compatibility before planning disaster recovery SLAs
            </div>
          </div>
        </div>

        <div
          style={{
            padding: "6px 16px",
            borderRadius: "9999px",
            background: "#FEE2E2",
            color: "#DC2626",
            fontSize: "13px",
            fontWeight: 800,
            letterSpacing: "0.06em",
          }}
        >
          COMPLIANCE
        </div>
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
