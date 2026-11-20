import React from "react";
import { spring, useCurrentFrame, useVideoConfig, Audio, staticFile } from "remotion";
import { THEME } from "../theme";
import { KineticSubtitleEngine } from "../components/KineticSubtitleEngine";

export const Scene08Vertical: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const limitations = [
    { title: "Scheduling Rigidity", icon: "⏰", desc: "No native weekly or monthly schedules.", delay: 20 },
    { title: "2TB Volume Size Limit", icon: "⚠️", desc: "VHD legacy format cannot back up >2040 GB.", delay: 140 },
    { title: "No Tape / Optical Media", icon: "📼", desc: "Tape drives & CD/DVD support removed.", delay: 260 },
    { title: "Network Single Copy", icon: "🌐", desc: "Remote shares overwrite previous versions.", delay: 380 },
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
      <Audio src={staticFile("incremental_backup/scene8.wav")} />

      <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
        <div
          style={{
            padding: "8px 22px",
            borderRadius: "9999px",
            background: THEME.colors.red,
            color: "#FFF",
            fontSize: "14px",
            fontWeight: 800,
            letterSpacing: "0.08em",
            boxShadow: `0 8px 20px rgba(239, 68, 68, 0.35)`,
          }}
        >
          CRITICAL ARCHITECTURE CONSTRAINTS
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
        Important Limitations
      </h1>

      {/* TOP 55% ZONE: 4 LIMITATION CARDS + WARNING BANNER */}
      <div
        style={{
          height: 980,
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", width: "100%", maxWidth: 620 }}>
          {limitations.map((lim, idx) => {
            const entrance = spring({
              frame: Math.max(0, frame - lim.delay),
              fps,
              config: THEME.springs.gentle,
            });
            return (
              <div
                key={idx}
                style={{
                  padding: "20px 16px",
                  borderRadius: "20px",
                  background: "#FFFFFF",
                  border: `1.5px solid rgba(239, 68, 68, 0.25)`,
                  boxShadow: THEME.shadows.card,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  transform: `translateY(${(1 - entrance) * 25}px) scale(${0.96 + entrance * 0.04})`,
                  opacity: entrance,
                }}
              >
                <span style={{ fontSize: "32px", marginBottom: "8px" }}>{lim.icon}</span>
                <div style={{ fontSize: "14px", fontWeight: 800, color: THEME.colors.charcoal, marginBottom: "4px" }}>
                  {lim.title}
                </div>
                <div style={{ fontSize: "11px", color: THEME.colors.charcoalMuted, lineHeight: 1.4 }}>
                  {lim.desc}
                </div>
              </div>
            );
          })}
        </div>

        {/* Missing Differential Banner */}
        <div
          style={{
            width: "100%",
            maxWidth: 620,
            padding: "16px 24px",
            background: "#FFFBF7",
            borderRadius: "20px",
            border: `2px solid ${THEME.colors.orange}`,
            boxShadow: THEME.shadows.card,
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        >
          <span style={{ fontSize: "28px" }}>🔍</span>
          <div>
            <div style={{ fontSize: "12px", fontWeight: 800, color: THEME.colors.orange }}>ARCHITECTURAL NOTE</div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: THEME.colors.charcoal, marginTop: "2px" }}>
              "Server 2008 Backup lacks Differential backup capability."
            </div>
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
        <KineticSubtitleEngine sceneId="scene8" fontSize={60} layout="vertical" />
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
