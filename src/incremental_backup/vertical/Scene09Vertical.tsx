import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, Audio, staticFile } from "remotion";
import { THEME } from "../theme";
import { KineticSubtitleEngine } from "../components/KineticSubtitleEngine";
import { CurvedSpline } from "../components/CurvedSpline";
import { ElevatedCard, ComponentSvgIcon } from "../components/VectorComponents";

export const Scene09Vertical: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ---------------------------------------------------------
  // PHASE CHOREOGRAPHY (End of Support & Security Advisory)
  // Phase 1: 0 - 223   Official End of Life (EOS January 14, 2020)
  // Phase 2: 223 - 453 Security Exposure & Compliance Risks
  // Phase 3: 453 - 629 Migration Architecture (Modern Windows Server)
  // Phase 4: 629 - 763 Core Rule: Backups != OS Security Updates
  // ---------------------------------------------------------

  // Phase 1 Entrance
  const introSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 85 },
  });

  // Phase 2: Risk Cards
  const risk1Spring = spring({ frame: frame - 225, fps, config: { damping: 13, stiffness: 100 } });
  const risk2Spring = spring({ frame: frame - 270, fps, config: { damping: 13, stiffness: 100 } });
  const risk3Spring = spring({ frame: frame - 315, fps, config: { damping: 13, stiffness: 100 } });
  const pulseAlert = frame >= 223 ? 0.5 + 0.5 * Math.sin((frame - 223) * 0.2) : 0;

  // Phase 3: Migration Roadmap
  const migrateSpring = spring({ frame: frame - 453, fps, config: { damping: 13, stiffness: 95 } });
  const migrateSpline = interpolate(frame, [465, 510], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Phase 4: Security Rule Card
  const ruleSpring = spring({ frame: frame - 629, fps, config: { damping: 14, stiffness: 100 } });

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
      <Audio src={staticFile("incremental_backup/scene9.wav")} />

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
        SECURITY ADVISORY • END OF SUPPORT
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
        <KineticSubtitleEngine sceneId="scene9" fontSize={54} layout="vertical" />
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
        {/* Hero Card: Official Microsoft End of Life Notice */}
        <div style={{ width: 940, transform: `scale(${introSpring})`, opacity: introSpring, zIndex: 10 }}>
          <ElevatedCard width={940} height={170} padding="22px 34px">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <span style={{ fontSize: "52px" }}>🛑</span>
                <div>
                  <div style={{ fontSize: "23px", fontWeight: 800, color: THEME.colors.charcoal }}>
                    Official End of Support: January 14, 2020
                  </div>
                  <div style={{ fontSize: "14px", color: THEME.colors.charcoalMuted, marginTop: "4px", fontWeight: 600 }}>
                    Microsoft has permanently ceased security updates and technical assistance
                  </div>
                </div>
              </div>
              <div
                style={{
                  background: "#FEE2E2",
                  color: "#DC2626",
                  fontWeight: 900,
                  fontSize: "16px",
                  padding: "10px 20px",
                  borderRadius: "14px",
                  border: "1.5px solid rgba(220, 38, 38, 0.3)",
                }}
              >
                UNSUPPORTED
              </div>
            </div>
          </ElevatedCard>
        </div>

        {/* Phase 2: Security Threat Triad (f: 223 - 453) */}
        {frame < 453 ? (
          <div style={{ width: 940, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", zIndex: 10 }}>
            {/* Risk 1 */}
            <div style={{ transform: `scale(${risk1Spring})`, opacity: risk1Spring }}>
              <ElevatedCard width="100%" height={210} padding="20px 16px">
                <div style={{ fontSize: "14px", fontWeight: 800, color: "#DC2626", marginBottom: "8px" }}>
                  ZERO PATCHES
                </div>
                <div style={{ fontSize: "18px", fontWeight: 800, color: THEME.colors.charcoal }}>
                  No Security Fixes
                </div>
                <div style={{ fontSize: "12px", color: THEME.colors.charcoalMuted, marginTop: "8px", fontWeight: 600 }}>
                  New CVE exploits remain open forever without hotfixes.
                </div>
              </ElevatedCard>
            </div>

            {/* Risk 2 */}
            <div style={{ transform: `scale(${risk2Spring})`, opacity: risk2Spring }}>
              <ElevatedCard width="100%" height={210} padding="20px 16px">
                <div style={{ fontSize: "14px", fontWeight: 800, color: "#DC2626", marginBottom: "8px" }}>
                  RANSOMWARE
                </div>
                <div style={{ fontSize: "18px", fontWeight: 800, color: THEME.colors.charcoal }}>
                  Exploit Vulnerable
                </div>
                <div style={{ fontSize: "12px", color: THEME.colors.charcoalMuted, marginTop: "8px", fontWeight: 600 }}>
                  Legacy SMB protocols exposed to automated network worm attacks.
                </div>
              </ElevatedCard>
            </div>

            {/* Risk 3 */}
            <div style={{ transform: `scale(${risk3Spring})`, opacity: risk3Spring }}>
              <ElevatedCard width="100%" height={210} padding="20px 16px">
                <div style={{ fontSize: "14px", fontWeight: 800, color: "#DC2626", marginBottom: "8px" }}>
                  COMPLIANCE
                </div>
                <div style={{ fontSize: "18px", fontWeight: 800, color: THEME.colors.charcoal }}>
                  Audit Failure
                </div>
                <div style={{ fontSize: "12px", color: THEME.colors.charcoalMuted, marginTop: "8px", fontWeight: 600 }}>
                  Fails HIPAA, PCI-DSS, and ISO 27001 regulatory certifications.
                </div>
              </ElevatedCard>
            </div>
          </div>
        ) : (
          /* Phase 3: Migration Architecture Card */
          <div
            style={{
              width: 940,
              transform: `scale(${migrateSpring})`,
              opacity: migrateSpring,
              zIndex: 10,
            }}
          >
            <ElevatedCard width={940} height={210} padding="24px 32px">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                  <ComponentSvgIcon name="server_blades" size={60} />
                  <div>
                    <div style={{ fontSize: "20px", fontWeight: 800, color: THEME.colors.charcoal }}>
                      Modernization Path: Windows Server 2022 / 2025
                    </div>
                    <div style={{ fontSize: "14px", color: THEME.colors.charcoalMuted, marginTop: "6px", fontWeight: 600 }}>
                      Migrate roles & data to modern supported platforms with VHDX, ReFS & Cloud Arc
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    background: "#ECFDF5",
                    color: THEME.colors.green,
                    fontWeight: 900,
                    fontSize: "14px",
                    padding: "8px 18px",
                    borderRadius: "9999px",
                    border: `1.5px solid ${THEME.colors.green}`,
                  }}
                >
                  MIGRATION PLAN
                </div>
              </div>
            </ElevatedCard>
          </div>
        )}

        {/* Phase 4 (f >= 629): Core Golden Security Principle */}
        {frame >= 629 && (
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
              transform: `scale(${ruleSpring})`,
              opacity: ruleSpring,
              zIndex: 25,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
              <ComponentSvgIcon name="shield" size={48} />
              <div>
                <div style={{ fontSize: "21px", fontWeight: 900, color: THEME.colors.charcoal }}>
                  Backups Are NOT a Substitute for OS Security Patches
                </div>
                <div style={{ fontSize: "14px", color: THEME.colors.charcoalMuted, fontWeight: 600, marginTop: "4px" }}>
                  Backups ensure data recovery • Operating system updates prevent initial breach
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
              DUAL DEFENSE
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
          <span style={{ fontSize: "20px" }}>⚠️</span>
          <div>
            <div style={{ fontSize: "17px", fontWeight: 800, color: THEME.colors.charcoal }}>
              Security Architecture Advisory
            </div>
            <div style={{ fontSize: "13px", color: THEME.colors.charcoalMuted, fontWeight: 600 }}>
              Isolate any legacy 2008 hosts behind zero-trust network boundaries
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
          SECURITY CRITICAL
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
