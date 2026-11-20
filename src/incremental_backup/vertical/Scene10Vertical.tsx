import React from "react";
import { spring, useCurrentFrame, useVideoConfig, Audio, staticFile } from "remotion";
import { THEME } from "../theme";
import { KineticSubtitleEngine } from "../components/KineticSubtitleEngine";
import { HardDrive3DWidget } from "../components/HardDrive3DWidget";
import { DataFlowPipes } from "../components/DataFlowPipes";

export const Scene10Vertical: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const summaries = [
    { title: "Incremental Mode", sub: "Tracks changed blocks via VSS", icon: "⚡", color: THEME.colors.blue },
    { title: "Faster Performance", sub: "Essential WSB configuration toggle", icon: "🛠️", color: THEME.colors.orange },
    { title: "Dedicated Disks", sub: "Preserves full historical versions", icon: "💾", color: THEME.colors.green },
    { title: "Modernize OS", sub: "Migrate legacy Server 2008 to Azure", icon: "🛡️", color: THEME.colors.purple },
  ];

  const grandBanner = spring({ frame: Math.max(0, frame - 140), fps, config: THEME.springs.bouncy });

  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        background: THEME.colors.cream,
        backgroundImage: "radial-gradient(rgba(41, 37, 36, 0.07) 1.2px, transparent 1.2px)",
        backgroundSize: "28px 28px",
        padding: "50px 48px 40px 48px",
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
        fontFamily: THEME.typography.fontFamily,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Audio src={staticFile("incremental_backup/scene10.wav")} />

      {/* TOP 18%: PERMANENT STEP HEADER */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 10 }}>
        <div
          style={{
            padding: "8px 24px",
            borderRadius: "9999px",
            background: THEME.colors.orange,
            color: "#FFF",
            fontSize: "15px",
            fontWeight: 800,
            letterSpacing: "0.1em",
            boxShadow: `0 8px 24px rgba(244, 91, 22, 0.35)`,
            marginBottom: "14px",
          }}
        >
          FINAL CHECKLIST • BEST PRACTICES
        </div>

        <h1
          style={{
            ...THEME.typography.h1,
            fontSize: "44px",
            textAlign: "center",
            margin: "0 0 8px 0",
            color: THEME.colors.charcoal,
          }}
        >
          Let's Recap!
        </h1>

        <div style={{ fontSize: "17px", color: THEME.colors.charcoalMuted, fontWeight: 600 }}>
          The complete blueprint for reliable, high-speed incremental server backups
        </div>
      </div>

      {/* MIDDLE 62%: 4 SUMMARY CARDS + 3D HARD DRIVE WITH PERMANENT SAVED BADGE */}
      <div
        style={{
          height: 1100,
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 5,
        }}
      >
        {/* Glowing Green Pipeline */}
        <DataFlowPipes
          startX={260}
          startY={360}
          endX={760}
          endY={360}
          color={THEME.colors.green}
          lineWidth={5}
          speed={1.6}
          packetCount={5}
          isLatching={true}
          latchFrame={30}
          label="COMMITTED ARCHITECTURE"
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: 960,
            zIndex: 6,
          }}
        >
          {/* Left Column: 4 Summary Checklist Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "440px" }}>
            {summaries.map((s, idx) => (
              <div
                key={idx}
                style={{
                  padding: "16px 20px",
                  borderRadius: "20px",
                  background: "#FFFFFF",
                  border: `1.5px solid ${s.color}30`,
                  boxShadow: THEME.shadows.card,
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "14px",
                    background: `${s.color}15`,
                    fontSize: "22px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {s.icon}
                </div>
                <div>
                  <div style={{ fontSize: "15px", fontWeight: 800, color: THEME.colors.charcoal }}>
                    {s.title}
                  </div>
                  <div style={{ fontSize: "12px", color: THEME.colors.charcoalMuted, marginTop: "2px" }}>
                    {s.sub}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: 3D Dedicated SAS 15K Drive with Saved Badge */}
          <HardDrive3DWidget width={380} height={440} isWriting delay={20} showSavedBadge={true} />
        </div>

        {/* Grand Final Callout Card */}
        <div
          style={{
            width: "100%",
            maxWidth: 820,
            padding: "20px 28px",
            borderRadius: "24px",
            background: `linear-gradient(135deg, ${THEME.colors.orange} 0%, #EA580C 100%)`,
            color: "#FFFFFF",
            boxShadow: "0 25px 60px -10px rgba(244, 91, 22, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            transform: `scale(${0.92 + grandBanner * 0.08})`,
            opacity: grandBanner,
            zIndex: 6,
          }}
        >
          <div>
            <div style={{ fontSize: "18px", fontWeight: 900 }}>PRODUCTION READY BACKUPS</div>
            <div style={{ fontSize: "13px", opacity: 0.9, marginTop: "4px" }}>
              Configure "Faster Performance" on dedicated disks today!
            </div>
          </div>
          <div
            style={{
              padding: "10px 20px",
              borderRadius: "14px",
              background: "#FFFFFF",
              color: THEME.colors.orange,
              fontSize: "14px",
              fontWeight: 900,
            }}
          >
            ✓ COMPLETE
          </div>
        </div>
      </div>

      {/* BOTTOM 20%: LOWER-THIRD KINETIC WORD-BY-WORD ACTIVE POP SUBTITLES */}
      <div
        style={{
          height: 240,
          background: "#FFFFFF",
          borderRadius: "28px",
          boxShadow: "0 20px 50px -10px rgba(41, 37, 36, 0.12)",
          border: `1.5px solid ${THEME.colors.border}`,
          padding: "24px 32px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: THEME.colors.orange }} />
          <span style={{ fontSize: "12px", fontWeight: 800, color: THEME.colors.charcoalMuted, letterSpacing: "0.06em" }}>
            AUDIO SPOKEN TRANSCRIPT
          </span>
        </div>
        <KineticSubtitleEngine sceneId="scene10" fontSize={42} layout="vertical" />
      </div>
    </div>
  );
};
