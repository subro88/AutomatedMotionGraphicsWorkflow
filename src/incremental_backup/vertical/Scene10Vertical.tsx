import React from "react";
import { spring, useCurrentFrame, useVideoConfig, Audio, staticFile } from "remotion";
import { THEME } from "../theme";
import { KineticSubtitleEngine } from "../components/KineticSubtitleEngine";

export const Scene10Vertical: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const summaries = [
    { title: "Incremental Backup", sub: "Backs up only changes since last run", icon: "⚡", color: THEME.colors.blue },
    { title: "WSB Performance", sub: "Set 'Faster Backup Performance'", icon: "🛠️", color: THEME.colors.orange },
    { title: "Dedicated Disk", sub: "Dedicated target drive recommended", icon: "💾", color: THEME.colors.green },
    { title: "Data Security", sub: "Migrate away from legacy Server 2008", icon: "🛡️", color: THEME.colors.purple },
  ];

  const grandBanner = spring({ frame: Math.max(0, frame - 160), fps, config: THEME.springs.bouncy });

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
      <Audio src={staticFile("incremental_backup/scene10.wav")} />

      <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
        <div
          style={{
            padding: "8px 22px",
            borderRadius: "9999px",
            background: THEME.colors.orange,
            color: "#FFF",
            fontSize: "14px",
            fontWeight: 800,
            letterSpacing: "0.08em",
            boxShadow: `0 8px 20px rgba(244, 91, 22, 0.3)`,
          }}
        >
          FINAL RECAP
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
        Let's Recap!
      </h1>

      {/* TOP 55% ZONE: 4 SUMMARY CARDS + CALLOUT BANNER */}
      <div
        style={{
          height: 980,
          display: "flex",
          flexDirection: "column",
          gap: "18px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", width: "100%", maxWidth: 620 }}>
          {summaries.map((s, idx) => (
            <div
              key={idx}
              style={{
                padding: "20px 18px",
                borderRadius: "20px",
                background: "#FFFFFF",
                border: `1.5px solid ${s.color}25`,
                boxShadow: THEME.shadows.card,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <span style={{ fontSize: "30px", marginBottom: "6px" }}>{s.icon}</span>
              <div style={{ fontSize: "14px", fontWeight: 800, color: THEME.colors.charcoal, marginBottom: "2px" }}>
                {s.title}
              </div>
              <div style={{ fontSize: "11px", color: THEME.colors.charcoalMuted, lineHeight: 1.3 }}>
                {s.sub}
              </div>
            </div>
          ))}
        </div>

        {/* Grand Callout Banner */}
        <div
          style={{
            width: "100%",
            maxWidth: 620,
            background: `linear-gradient(135deg, ${THEME.colors.orange} 0%, #D84315 100%)`,
            borderRadius: "24px",
            padding: "22px 28px",
            textAlign: "center",
            boxShadow: "0 20px 50px rgba(244, 91, 22, 0.35)",
            transform: `scale(${0.92 + grandBanner * 0.08})`,
            opacity: grandBanner,
          }}
        >
          <div style={{ fontSize: "32px", marginBottom: "6px" }}>🛡️</div>
          <div style={{ color: "#FFFFFF", fontSize: "22px", fontWeight: 900, letterSpacing: "0.04em" }}>
            PROTECT YOUR DATA. PLAN YOUR BACKUPS.
          </div>
          <div style={{ color: "rgba(255, 255, 255, 0.85)", fontSize: "13px", marginTop: "4px" }}>
            Automated incremental backups ensure fast disaster recovery and business continuity.
          </div>
        </div>
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
        <KineticSubtitleEngine sceneId="scene10" fontSize={60} layout="vertical" />
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
