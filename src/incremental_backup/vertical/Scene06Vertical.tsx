import React from "react";
import { spring, useCurrentFrame, useVideoConfig, Audio, staticFile } from "remotion";
import { THEME } from "../theme";
import { KineticSubtitleEngine } from "../components/KineticSubtitleEngine";
import { HardDrive3DWidget } from "../components/HardDrive3DWidget";

export const Scene06Vertical: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const steps = [
    { num: "1", title: "Full Server", sub: "Recommended scope", icon: "🖥️", delay: 20 },
    { num: "2", title: "Daily Schedule", sub: "10:00 PM unattended", icon: "⏰", delay: 140 },
    { num: "3", title: "Dedicated Hard Disk", sub: "Exclusive VSS volume", icon: "💾", delay: 260 },
    { num: "4", title: "Confirm & Finish", sub: "Automatic execution", icon: "✅", delay: 380 },
  ];

  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        background: THEME.colors.cream,
        backgroundImage: `radial-gradient(${THEME.colors.charcoal} 0.75px, transparent 0.75px)`,
        backgroundSize: "28px 28px",
        padding: "60px 48px",
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
        fontFamily: THEME.typography.fontFamily,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Audio src={staticFile("incremental_backup/scene6.wav")} />

      <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
        <div
          style={{
            padding: "8px 22px",
            borderRadius: "9999px",
            background: THEME.colors.blue,
            color: "#FFF",
            fontSize: "14px",
            fontWeight: 800,
            letterSpacing: "0.08em",
            boxShadow: `0 8px 20px ${THEME.colors.blue}40`,
          }}
        >
          SCHEDULE WIZARD
        </div>
      </div>

      <h1
        style={{
          ...THEME.typography.h1,
          fontSize: "44px",
          textAlign: "center",
          margin: "0 0 24px 0",
          color: THEME.colors.charcoal,
        }}
      >
        Create a Backup Schedule
      </h1>

      {/* TOP 55% ZONE: 4 WIZARD STEPS + DEDICATED HARD DRIVE */}
      <div
        style={{
          height: 980,
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", maxWidth: 620 }}>
          {steps.map((s, idx) => {
            const entrance = spring({
              frame: Math.max(0, frame - s.delay),
              fps,
              config: THEME.springs.gentle,
            });
            return (
              <div
                key={idx}
                style={{
                  padding: "14px 20px",
                  borderRadius: "18px",
                  background: idx === 3 ? "#F0FDF4" : "#FFFFFF",
                  border: idx === 3 ? `2px solid ${THEME.colors.green}` : `1px solid ${THEME.colors.border}`,
                  boxShadow: THEME.shadows.card,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  transform: `translateY(${(1 - entrance) * 25}px) scale(${0.96 + entrance * 0.04})`,
                  opacity: entrance,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontSize: "24px" }}>{s.icon}</span>
                  <div>
                    <div style={{ fontSize: "15px", fontWeight: 800, color: THEME.colors.charcoal }}>
                      Step {s.num}: {s.title}
                    </div>
                    <div style={{ fontSize: "12px", color: THEME.colors.charcoalMuted }}>
                      {s.sub}
                    </div>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 800,
                    color: idx === 3 ? THEME.colors.green : THEME.colors.orange,
                    background: idx === 3 ? THEME.colors.greenLight : THEME.colors.orangeLight,
                    padding: "3px 8px",
                    borderRadius: "9999px",
                  }}
                >
                  CONFIGURED
                </span>
              </div>
            );
          })}
        </div>

        <HardDrive3DWidget width={360} height={380} isWriting delay={400} />
      </div>

      {/* BOTTOM 45% ZONE: KINETIC SUBTITLES */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: "80px",
        }}
      >
        <KineticSubtitleEngine sceneId="scene6" fontSize={60} layout="vertical" />
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "35px",
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: "14px",
          fontWeight: 700,
          color: THEME.colors.charcoalLight,
          letterSpacing: "0.12em",
        }}
      >
        techblock.io
      </div>
    </div>
  );
};
