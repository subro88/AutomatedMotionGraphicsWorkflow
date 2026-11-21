import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, Audio, staticFile } from "remotion";
import { THEME } from "../theme";
import { KineticSubtitleEngine } from "../components/KineticSubtitleEngine";
import { ElevatedCard, ComponentSvgIcon } from "../components/VectorComponents";

export const Scene10Vertical: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ---------------------------------------------------------
  // PHASE CHOREOGRAPHY (Final Master Summary & Outro)
  // Phase 1: 0 - 236   Core Summary: Delta Efficiency
  // Phase 2: 236 - 397 WSB Faster Backup Performance Recap
  // Phase 3: 397 - 584 Golden 3-2-1 Rule & Test Restores
  // Phase 4: 584 - 783 Philosophy: Restorability is Everything
  // Phase 5: 783 - 1061 Channel Outro & Call to Action (Like & Subscribe)
  // ---------------------------------------------------------

  // Phase 1 Entrance
  const introSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 85 },
  });

  // Phase 2: WSB recap
  const wsbRecapSpring = spring({ frame: frame - 236, fps, config: { damping: 13, stiffness: 100 } });

  // Phase 3: 3-2-1 Rule Card
  const rule321Spring = spring({ frame: frame - 397, fps, config: { damping: 13, stiffness: 100 } });

  // Phase 4: Philosophy Quote Card
  const quoteSpring = spring({ frame: frame - 584, fps, config: { damping: 14, stiffness: 95 } });

  // Phase 5: Outro Call to Action
  const outroSpring = spring({ frame: frame - 783, fps, config: { damping: 12, stiffness: 110 } });
  const subButtonScale = 1.0 + (frame >= 888 ? 0.06 * Math.sin((frame - 888) * 0.25) : 0);

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
          background: THEME.colors.orange,
          color: "#FFFFFF",
          fontSize: "15px",
          fontWeight: 800,
          letterSpacing: "0.1em",
          boxShadow: "0 8px 24px rgba(244, 91, 22, 0.32)",
          transform: `scale(${introSpring})`,
        }}
      >
        SUMMARY & OUTRO • BEST PRACTICES
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
        <KineticSubtitleEngine sceneId="scene10" fontSize={54} layout="vertical" />
      </div>

      {/* Central Stage (940px wide, 1100px height) */}
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
        {/* Phase 1 & 2: Core Summary Hero Card */}
        {frame < 397 && (
          <div style={{ width: 940, transform: `scale(${introSpring})`, opacity: introSpring, zIndex: 10 }}>
            <ElevatedCard width={940} height={210} padding="24px 34px">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                  <ComponentSvgIcon name="shield" size={68} />
                  <div>
                    <div style={{ fontSize: "22px", fontWeight: 800, color: THEME.colors.charcoal }}>
                      Incremental Backup Recap
                    </div>
                    <div style={{ fontSize: "14px", color: THEME.colors.charcoalMuted, marginTop: "6px", fontWeight: 600 }}>
                      Captures only sector-level deltas • 90% bandwidth saved • Fast backup windows
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    background: THEME.colors.orangeLight,
                    color: THEME.colors.orange,
                    fontWeight: 900,
                    fontSize: "18px",
                    padding: "10px 22px",
                    borderRadius: "14px",
                    border: `1.5px solid ${THEME.colors.orange}`,
                  }}
                >
                  ⚡ 90% SAVED
                </div>
              </div>
            </ElevatedCard>
          </div>
        )}

        {/* Phase 3: The Golden 3-2-1 Rule Card (f: 397 - 584) */}
        {frame >= 397 && frame < 584 && (
          <div
            style={{
              width: 940,
              display: "flex",
              flexDirection: "column",
              gap: "18px",
              transform: `scale(${rule321Spring})`,
              opacity: rule321Spring,
              zIndex: 10,
            }}
          >
            <div
              style={{
                background: "#FFFFFF",
                borderRadius: "28px",
                padding: "24px 34px",
                boxShadow: THEME.shadows.cardElevated,
                border: `2px solid ${THEME.colors.blue}`,
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <div style={{ fontSize: "22px", fontWeight: 900, color: THEME.colors.charcoal, textAlign: "center" }}>
                The Golden 3-2-1 Enterprise Backup Rule
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px" }}>
                <div style={{ background: "#EFF6FF", padding: "16px", borderRadius: "18px", textAlign: "center" }}>
                  <div style={{ fontSize: "32px", fontWeight: 900, color: THEME.colors.blue }}>3</div>
                  <div style={{ fontSize: "14px", fontWeight: 800, color: THEME.colors.charcoal, marginTop: "4px" }}>Copies of Data</div>
                  <div style={{ fontSize: "12px", color: THEME.colors.charcoalMuted }}>1 Primary + 2 Backups</div>
                </div>

                <div style={{ background: THEME.colors.orangeLight, padding: "16px", borderRadius: "18px", textAlign: "center" }}>
                  <div style={{ fontSize: "32px", fontWeight: 900, color: THEME.colors.orange }}>2</div>
                  <div style={{ fontSize: "14px", fontWeight: 800, color: THEME.colors.charcoal, marginTop: "4px" }}>Media Types</div>
                  <div style={{ fontSize: "12px", color: THEME.colors.charcoalMuted }}>Local Disk + NAS/Tape</div>
                </div>

                <div style={{ background: "#ECFDF5", padding: "16px", borderRadius: "18px", textAlign: "center" }}>
                  <div style={{ fontSize: "32px", fontWeight: 900, color: THEME.colors.green }}>1</div>
                  <div style={{ fontSize: "14px", fontWeight: 800, color: THEME.colors.charcoal, marginTop: "4px" }}>Offsite Copy</div>
                  <div style={{ fontSize: "12px", color: THEME.colors.charcoalMuted }}>Cloud or Remote Vault</div>
                </div>
              </div>
            </div>

            <div
              style={{
                background: "#ECFDF5",
                border: `2px solid ${THEME.colors.green}`,
                borderRadius: "20px",
                padding: "16px 26px",
                display: "flex",
                alignItems: "center",
                gap: "14px",
              }}
            >
              <ComponentSvgIcon name="shield" size={36} />
              <div style={{ fontSize: "16px", fontWeight: 800, color: THEME.colors.charcoal }}>
                Regular Test Restores: Verify your backup chain monthly to avoid disaster recovery failure!
              </div>
            </div>
          </div>
        )}

        {/* Phase 4: Core Philosophy Quote (f: 584 - 783) */}
        {frame >= 584 && frame < 783 && (
          <div
            style={{
              width: 940,
              background: "#FFFFFF",
              borderRadius: "28px",
              padding: "40px 36px",
              boxShadow: THEME.shadows.cardElevated,
              border: `2.5px solid ${THEME.colors.orange}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              transform: `scale(${quoteSpring})`,
              opacity: quoteSpring,
              zIndex: 10,
            }}
          >
            <span style={{ fontSize: "44px", marginBottom: "16px" }}>💡</span>
            <div style={{ fontSize: "32px", fontWeight: 900, color: THEME.colors.charcoal, lineHeight: 1.25 }}>
              "A backup is only as good as your ability to restore it."
            </div>
            <div style={{ fontSize: "17px", color: THEME.colors.charcoalMuted, fontWeight: 600, marginTop: "16px" }}>
              Creating backups is just half the equation — verifying recovery readiness is what saves your organization.
            </div>
          </div>
        )}

        {/* Phase 5 (f >= 783): Outro Call to Action */}
        {frame >= 783 && (
          <div
            style={{
              width: 940,
              background: "#FFFFFF",
              borderRadius: "32px",
              padding: "36px 36px",
              boxShadow: THEME.shadows.cardElevated,
              border: `2.5px solid ${THEME.colors.orange}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              transform: `scale(${outroSpring})`,
              opacity: outroSpring,
              zIndex: 10,
              gap: "24px",
            }}
          >
            <div style={{ fontSize: "30px", fontWeight: 900, color: THEME.colors.charcoal }}>
              Thank You for Watching!
            </div>
            <div style={{ fontSize: "16px", color: THEME.colors.charcoalMuted, fontWeight: 600, maxWidth: 650 }}>
              Stay tuned for deeper systems engineering, Windows administration, and enterprise disaster recovery tutorials.
            </div>

            {/* Subscribe & Like Actions */}
            <div style={{ display: "flex", gap: "20px", alignItems: "center", marginTop: "8px" }}>
              <div
                style={{
                  background: THEME.colors.orange,
                  color: "#FFFFFF",
                  fontWeight: 900,
                  fontSize: "18px",
                  padding: "14px 34px",
                  borderRadius: "9999px",
                  boxShadow: "0 10px 28px rgba(244, 91, 22, 0.4)",
                  transform: `scale(${subButtonScale})`,
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <span>🔔</span>
                <span>SUBSCRIBE</span>
              </div>

              <div
                style={{
                  background: "#F8FAFC",
                  color: THEME.colors.charcoal,
                  border: `2px solid #E2E8F0`,
                  fontWeight: 800,
                  fontSize: "18px",
                  padding: "14px 30px",
                  borderRadius: "9999px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <span>👍</span>
                <span>LIKE & SHARE</span>
              </div>
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
          <span style={{ fontSize: "20px" }}>🌟</span>
          <div>
            <div style={{ fontSize: "17px", fontWeight: 800, color: THEME.colors.charcoal }}>
              Tech Tutorial Series Complete
            </div>
            <div style={{ fontSize: "13px", color: THEME.colors.charcoalMuted, fontWeight: 600 }}>
              Windows Server 2008 R2 Incremental Backup Explainer
            </div>
          </div>
        </div>

        <div
          style={{
            padding: "6px 16px",
            borderRadius: "9999px",
            background: THEME.colors.orangeLight,
            color: THEME.colors.orange,
            fontSize: "13px",
            fontWeight: 800,
            letterSpacing: "0.06em",
          }}
        >
          COMPLETE
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
