import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, Audio, staticFile } from "remotion";
import { THEME } from "../theme";
import { KineticSubtitleEngine } from "../components/KineticSubtitleEngine";
import { CurvedSpline } from "../components/CurvedSpline";
import { ElevatedCard, ComponentSvgIcon } from "../components/VectorComponents";

export const Scene07Vertical: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ---------------------------------------------------------
  // PHASE CHOREOGRAPHY (Third-Party Alternative - AOMEI Backupper)
  // Phase 1: 0 - 229   Method 2 Intro Hero Card
  // Phase 2: 229 - 425 4 Backup Types Matrix (System, Disk, Partition, File)
  // Phase 3: 425 - 603 Scheduling Automation (Daily, Weekly, Monthly)
  // Phase 4: 603 - 945 Multi-Destination Storage Hub (NAS, Network Share, Cloud)
  // Phase 5: 945 - 1216 Storage & Performance Efficiency Result
  // ---------------------------------------------------------

  // Phase 1 Entrance
  const heroSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 85 },
  });

  // Phase 2: 4 Backup Types Grid
  const type1Spring = spring({ frame: frame - 230, fps, config: { damping: 13, stiffness: 100 } });
  const type2Spring = spring({ frame: frame - 265, fps, config: { damping: 13, stiffness: 100 } });
  const type3Spring = spring({ frame: frame - 300, fps, config: { damping: 13, stiffness: 100 } });
  const type4Spring = spring({ frame: frame - 335, fps, config: { damping: 13, stiffness: 100 } });

  // Phase 3: Schedule Card
  const schedSpring = spring({ frame: frame - 425, fps, config: { damping: 14, stiffness: 95 } });

  // Phase 4: Storage Destinations
  const destSpring = spring({ frame: frame - 603, fps, config: { damping: 14, stiffness: 95 } });
  const destSplineProgress = interpolate(frame, [615, 665], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Phase 5: Summary Card
  const summarySpring = spring({ frame: frame - 945, fps, config: { damping: 13, stiffness: 100 } });

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
      <Audio src={staticFile("incremental_backup/scene7.wav")} />

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
          boxShadow: "0 8px 24px rgba(2, 132, 199, 0.32)",
          transform: `scale(${heroSpring})`,
        }}
      >
        METHOD 02 • THIRD-PARTY ENTERPRISE SOLUTION
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
        <KineticSubtitleEngine sceneId="scene7" fontSize={54} layout="vertical" />
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
        {/* Hero Card: Enterprise Solution Overview */}
        <div style={{ width: 940, transform: `scale(${heroSpring})`, opacity: heroSpring, zIndex: 10 }}>
          <ElevatedCard width={940} height={170} padding="22px 34px">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <ComponentSvgIcon name="server_blades" size={80} />
                <div>
                  <div style={{ fontSize: "23px", fontWeight: 800, color: THEME.colors.charcoal }}>
                    Modern Server Backup Suite (e.g. AOMEI)
                  </div>
                  <div style={{ fontSize: "14px", color: THEME.colors.charcoalMuted, marginTop: "4px", fontWeight: 600 }}>
                    Overcomes native 2008 limitations with advanced incremental & differential engines
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
                  borderRadius: "14px",
                  border: `1.5px solid ${THEME.colors.blue}40`,
                }}
              >
                FEATURE RICH
              </div>
            </div>
          </ElevatedCard>
        </div>

        {/* Phase 2: 4 Backup Types (2x2 Grid) */}
        {frame < 603 ? (
          <div style={{ width: 940, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", zIndex: 10 }}>
            {/* System Backup */}
            <div style={{ transform: `scale(${type1Spring})`, opacity: type1Spring }}>
              <ElevatedCard width="100%" height={170} padding="20px 24px">
                <div style={{ display: "flex", alignItems: "center", gap: "14px", width: "100%" }}>
                  <ComponentSvgIcon name="server_tower" size={44} />
                  <div>
                    <div style={{ fontSize: "18px", fontWeight: 800, color: THEME.colors.charcoal }}>System Backup</div>
                    <div style={{ fontSize: "13px", color: THEME.colors.charcoalMuted, marginTop: "4px" }}>OS, boot, drivers & system state</div>
                  </div>
                </div>
              </ElevatedCard>
            </div>

            {/* Disk Backup */}
            <div style={{ transform: `scale(${type2Spring})`, opacity: type2Spring }}>
              <ElevatedCard width="100%" height={170} padding="20px 24px">
                <div style={{ display: "flex", alignItems: "center", gap: "14px", width: "100%" }}>
                  <ComponentSvgIcon name="hard_drive" size={44} />
                  <div>
                    <div style={{ fontSize: "18px", fontWeight: 800, color: THEME.colors.charcoal }}>Disk Backup</div>
                    <div style={{ fontSize: "13px", color: THEME.colors.charcoalMuted, marginTop: "4px" }}>Full drive cloning & bare metal</div>
                  </div>
                </div>
              </ElevatedCard>
            </div>

            {/* Partition Backup */}
            <div style={{ transform: `scale(${type3Spring})`, opacity: type3Spring }}>
              <ElevatedCard width="100%" height={170} padding="20px 24px">
                <div style={{ display: "flex", alignItems: "center", gap: "14px", width: "100%" }}>
                  <ComponentSvgIcon name="gears" size={44} />
                  <div>
                    <div style={{ fontSize: "18px", fontWeight: 800, color: THEME.colors.charcoal }}>Partition Backup</div>
                    <div style={{ fontSize: "13px", color: THEME.colors.charcoalMuted, marginTop: "4px" }}>Individual volumes (C:, D:, SQL)</div>
                  </div>
                </div>
              </ElevatedCard>
            </div>

            {/* File Backup */}
            <div style={{ transform: `scale(${type4Spring})`, opacity: type4Spring }}>
              <ElevatedCard width="100%" height={170} padding="20px 24px">
                <div style={{ display: "flex", alignItems: "center", gap: "14px", width: "100%" }}>
                  <ComponentSvgIcon name="workstation" size={44} />
                  <div>
                    <div style={{ fontSize: "18px", fontWeight: 800, color: THEME.colors.charcoal }}>File Backup</div>
                    <div style={{ fontSize: "13px", color: THEME.colors.charcoalMuted, marginTop: "4px" }}>Granular files, documents & shared folders</div>
                  </div>
                </div>
              </ElevatedCard>
            </div>
          </div>
        ) : (
          /* Phase 4: Multi-Destination Storage Hub */
          <div
            style={{
              width: 940,
              display: "flex",
              flexDirection: "column",
              gap: "18px",
              transform: `scale(${destSpring})`,
              opacity: destSpring,
              zIndex: 10,
            }}
          >
            {/* Storage Destinations Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
              {/* Local & USB */}
              <ElevatedCard width="100%" height={180} padding="20px 16px">
                <ComponentSvgIcon name="hard_drive" size={46} />
                <div style={{ fontSize: "17px", fontWeight: 800, color: THEME.colors.charcoal, marginTop: "8px", textAlign: "center" }}>
                  Local & External
                </div>
                <div style={{ fontSize: "12px", color: THEME.colors.charcoalMuted, textAlign: "center", marginTop: "4px" }}>
                  Internal SATA, USB 3.0 HDD
                </div>
              </ElevatedCard>

              {/* NAS & Network Shares */}
              <ElevatedCard width="100%" height={180} padding="20px 16px">
                <ComponentSvgIcon name="router" size={46} />
                <div style={{ fontSize: "17px", fontWeight: 800, color: THEME.colors.blue, marginTop: "8px", textAlign: "center" }}>
                  NAS & Network Share
                </div>
                <div style={{ fontSize: "12px", color: THEME.colors.charcoalMuted, textAlign: "center", marginTop: "4px" }}>
                  SMB / CIFS (Full Incrementals!)
                </div>
              </ElevatedCard>

              {/* Cloud Storage */}
              <ElevatedCard width="100%" height={180} padding="20px 16px">
                <ComponentSvgIcon name="cloud" size={46} />
                <div style={{ fontSize: "17px", fontWeight: 800, color: THEME.colors.orange, marginTop: "8px", textAlign: "center" }}>
                  Cloud Storage
                </div>
                <div style={{ fontSize: "12px", color: THEME.colors.charcoalMuted, textAlign: "center", marginTop: "4px" }}>
                  Azure Blob, AWS S3, Offsite
                </div>
              </ElevatedCard>
            </div>

            {/* Overcoming WSB Limitation Callout */}
            <div
              style={{
                background: "#ECFDF5",
                border: `2px solid ${THEME.colors.green}`,
                borderRadius: "20px",
                padding: "16px 26px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <ComponentSvgIcon name="shield" size={36} />
                <div>
                  <div style={{ fontSize: "17px", fontWeight: 800, color: THEME.colors.charcoal }}>
                    Key Benefit: Network Share Incremental Support
                  </div>
                  <div style={{ fontSize: "13px", color: THEME.colors.charcoalMuted, fontWeight: 600 }}>
                    Unlike native 2008 WSB, retains complete version history on network folders
                  </div>
                </div>
              </div>
              <div style={{ color: THEME.colors.green, fontWeight: 900, fontSize: "15px" }}>
                ✓ NO OVERWRITE
              </div>
            </div>
          </div>
        )}

        {/* Phase 5 (f >= 945): Storage & Performance Efficiency Result */}
        {frame >= 945 && (
          <div
            style={{
              width: 940,
              background: "#FFFFFF",
              padding: "24px 34px",
              borderRadius: "28px",
              boxShadow: THEME.shadows.cardElevated,
              border: `2.5px solid ${THEME.colors.orange}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxSizing: "border-box",
              transform: `scale(${summarySpring})`,
              opacity: summarySpring,
              zIndex: 30,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
              <ComponentSvgIcon name="shield" size={48} />
              <div>
                <div style={{ fontSize: "21px", fontWeight: 800, color: THEME.colors.charcoal }}>
                  Full Baseline + Smart Differential / Incremental Engine
                </div>
                <div style={{ fontSize: "14px", color: THEME.colors.charcoalMuted, fontWeight: 600, marginTop: "4px" }}>
                  Automated retention policies delete oldest backups to prevent disk overflow
                </div>
              </div>
            </div>

            <div
              style={{
                background: THEME.colors.orangeLight,
                color: THEME.colors.orange,
                fontWeight: 800,
                fontSize: "14px",
                padding: "8px 18px",
                borderRadius: "9999px",
                border: `1.5px solid ${THEME.colors.orange}`,
              }}
            >
              AUTO-CLEANUP
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
          <span style={{ fontSize: "20px" }}>🛡️</span>
          <div>
            <div style={{ fontSize: "17px", fontWeight: 800, color: THEME.colors.charcoal }}>
              Modern Server Backup Protocols
            </div>
            <div style={{ fontSize: "13px", color: THEME.colors.charcoalMuted, fontWeight: 600 }}>
              Full VSS integration, military AES-256 encryption & email notifications
            </div>
          </div>
        </div>

        <div
          style={{
            padding: "6px 16px",
            borderRadius: "9999px",
            background: THEME.colors.blueLight,
            color: THEME.colors.blue,
            fontSize: "13px",
            fontWeight: 800,
            letterSpacing: "0.06em",
          }}
        >
          ENTERPRISE
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
