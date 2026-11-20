import React from "react";
import { spring, useCurrentFrame, useVideoConfig, Audio, staticFile } from "remotion";
import { THEME } from "../theme";
import { CanvaCard } from "../components/CanvaCard";
import { HeaderBanner } from "../components/HeaderBanner";

export const Scene09EndOfSupport: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Pulse animation for warning badge
  const pulse = Math.sin(frame * 0.08) * 0.04 + 1;

  // Staggered cards entrance
  const card1Spring = spring({ frame: Math.max(0, frame - 40), fps, config: THEME.springs.gentle });
  const card2Spring = spring({ frame: Math.max(0, frame - 160), fps, config: THEME.springs.gentle });
  const card3Spring = spring({ frame: Math.max(0, frame - 280), fps, config: THEME.springs.gentle });

  // Migration Arrow Flow (cycle frame)
  const cycle = (frame % 60) / 60;

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
      <Audio src={staticFile("incremental_backup/scene9.wav")} />

      <HeaderBanner
        category="Critical Lifecycle Advisory"
        title="Don't Ignore Security"
        subtitle="Windows Server 2008 and 2008 R2 reached End of Support on January 14, 2020."
      />

      {/* Top Banner: Prominent End of Support Timeline Badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: THEME.colors.white,
          borderRadius: "22px",
          padding: "18px 36px",
          boxShadow: THEME.shadows.card,
          border: `1px solid ${THEME.colors.border}`,
          marginBottom: "28px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              padding: "12px 20px",
              borderRadius: "16px",
              background: THEME.colors.redLight,
              border: `1px solid rgba(239, 68, 68, 0.3)`,
              transform: `scale(${pulse})`,
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span style={{ fontSize: "22px" }}>🛑</span>
            <span style={{ fontSize: "16px", fontWeight: 900, color: THEME.colors.red, letterSpacing: "0.04em" }}>
              END OF EXTENDED SUPPORT
            </span>
          </div>
          <div>
            <div style={{ fontSize: "26px", fontWeight: 800, color: THEME.colors.charcoal }}>
              January 14, 2020
            </div>
            <div style={{ fontSize: "14px", color: THEME.colors.charcoalMuted }}>
              Microsoft no longer provides security updates, hotfixes, or technical support.
            </div>
          </div>
        </div>

        {/* Migration path graphic */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
            background: THEME.colors.cream,
            padding: "10px 24px",
            borderRadius: "16px",
            border: `1px solid ${THEME.colors.border}`,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "20px" }}>🖥️</div>
            <div style={{ fontSize: "11px", fontWeight: 700, color: THEME.colors.charcoalMuted }}>Server 2008</div>
          </div>
          <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
            {[0, 1, 2].map((i) => {
              const op = (cycle + i * 0.33) % 1;
              return (
                <div
                  key={i}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: THEME.colors.orange,
                    opacity: op,
                  }}
                />
              );
            })}
            <span style={{ color: THEME.colors.orange, fontWeight: 900, fontSize: "18px" }}>→</span>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "20px" }}>☁️</div>
            <div style={{ fontSize: "11px", fontWeight: 700, color: THEME.colors.green }}>Modern Azure / 2025</div>
          </div>
        </div>
      </div>

      {/* 3 Pillars / Advisory Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1.2fr",
          gap: "24px",
        }}
      >
        {/* Card 1: No Security Updates */}
        <div style={{ opacity: card1Spring, transform: `translateY(${(1 - card1Spring) * 25}px)` }}>
          <CanvaCard
            style={{
              padding: "26px 28px",
              minHeight: 330,
              display: "flex",
              flexDirection: "column",
              background: "#FFFBFB",
              border: `1px solid rgba(239, 68, 68, 0.2)`,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "14px",
                background: THEME.colors.redLight,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                marginBottom: "16px",
              }}
            >
              🔒
            </div>

            <h3 style={{ ...THEME.typography.h3, fontSize: "20px", color: THEME.colors.charcoal, margin: "0 0 8px 0" }}>
              1. Security Updates
            </h3>

            <p style={{ fontSize: "14px", color: THEME.colors.charcoalMuted, lineHeight: 1.5, margin: 0 }}>
              Zero automatic patches for newly discovered CVE vulnerabilities, kernel exploits, or network stack bugs.
            </p>

            <div
              style={{
                marginTop: "auto",
                padding: "8px 12px",
                borderRadius: "8px",
                background: "rgba(239, 68, 68, 0.08)",
                fontSize: "12px",
                color: THEME.colors.red,
                fontWeight: 700,
              }}
            >
              High vulnerability exposure
            </div>
          </CanvaCard>
        </div>

        {/* Card 2: System Protection Risks */}
        <div style={{ opacity: card2Spring, transform: `translateY(${(1 - card2Spring) * 25}px)` }}>
          <CanvaCard
            style={{
              padding: "26px 28px",
              minHeight: 330,
              display: "flex",
              flexDirection: "column",
              background: "#FFFBF7",
              border: `1px solid rgba(244, 91, 22, 0.2)`,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "14px",
                background: THEME.colors.orangeLight,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                marginBottom: "16px",
              }}
            >
              🛡️
            </div>

            <h3 style={{ ...THEME.typography.h3, fontSize: "20px", color: THEME.colors.charcoal, margin: "0 0 8px 0" }}>
              2. System Protection
            </h3>

            <p style={{ fontSize: "14px", color: THEME.colors.charcoalMuted, lineHeight: 1.5, margin: 0 }}>
              Extreme threat of ransomware lateral movement, credential harvesting, and enterprise compliance failures (PCI-DSS, HIPAA).
            </p>

            <div
              style={{
                marginTop: "auto",
                padding: "8px 12px",
                borderRadius: "8px",
                background: THEME.colors.orangeLight,
                fontSize: "12px",
                color: THEME.colors.orange,
                fontWeight: 700,
              }}
            >
              Compliance & breach risks
            </div>
          </CanvaCard>
        </div>

        {/* Card 3: Recommended Action */}
        <div style={{ opacity: card3Spring, transform: `translateY(${(1 - card3Spring) * 25}px)` }}>
          <CanvaCard
            highlight
            style={{
              padding: "26px 28px",
              minHeight: 330,
              display: "flex",
              flexDirection: "column",
              background: "#F0FDF4",
              border: `1.5px solid ${THEME.colors.green}`,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "14px",
                background: THEME.colors.greenLight,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                marginBottom: "16px",
              }}
            >
              🚀
            </div>

            <h3 style={{ ...THEME.typography.h3, fontSize: "20px", color: THEME.colors.charcoal, margin: "0 0 8px 0" }}>
              3. Recommended Action
            </h3>

            <p style={{ fontSize: "14px", color: THEME.colors.charcoalMuted, lineHeight: 1.5, margin: "0 0 14px 0" }}>
              Migrate legacy business applications and active directory databases to modern environments:
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "auto" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 12px",
                  background: THEME.colors.white,
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: 700,
                  color: THEME.colors.charcoal,
                  border: `1px solid ${THEME.colors.border}`,
                }}
              >
                <span>🖥️</span>
                <span>Windows Server 2022 / 2025</span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 12px",
                  background: THEME.colors.white,
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: 700,
                  color: THEME.colors.charcoal,
                  border: `1px solid ${THEME.colors.border}`,
                }}
              >
                <span>☁️</span>
                <span>Microsoft Azure Cloud Infrastructure</span>
              </div>
            </div>
          </CanvaCard>
        </div>
      </div>

      {/* Bottom Golden Principle Strip */}
      <div
        style={{
          marginTop: "24px",
          background: THEME.colors.charcoal,
          borderRadius: "18px",
          padding: "16px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          boxShadow: "0 10px 30px rgba(41, 37, 36, 0.2)",
        }}
      >
        <span style={{ fontSize: "22px" }}>💡</span>
        <span
          style={{
            color: "#FFFFFF",
            fontSize: "17px",
            fontWeight: 700,
            letterSpacing: "0.02em",
          }}
        >
          "Backups protect data, but modern operating systems protect against attacks."
        </span>
      </div>
    </div>
  );
};
