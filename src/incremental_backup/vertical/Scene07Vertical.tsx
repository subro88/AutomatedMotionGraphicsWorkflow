import React from "react";
import { spring, useCurrentFrame, useVideoConfig, Audio, staticFile } from "remotion";
import { THEME } from "../theme";
import { KineticSubtitleEngine } from "../components/KineticSubtitleEngine";
import { HardDrive3DWidget } from "../components/HardDrive3DWidget";
import { DataFlowPipes } from "../components/DataFlowPipes";

export const Scene07Vertical: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const features = [
    { title: "Multiple Backup Types", sub: "System, Disk, Partition, Files", icon: "📁", color: THEME.colors.orange, delay: 20 },
    { title: "Flexible Scheduling", sub: "Daily, Weekly, Monthly, USB Plug In", icon: "🗓️", color: THEME.colors.blue, delay: 110 },
    { title: "Universal Destinations", sub: "Local, External, NAS, Cloud", icon: "🌐", color: THEME.colors.green, delay: 200 },
    { title: "Incremental & Differential", sub: "Dual advanced backup schemes", icon: "⚡", color: THEME.colors.purple, delay: 290 },
  ];

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
      <Audio src={staticFile("incremental_backup/scene7.wav")} />

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
            boxShadow: "0 8px 24px rgba(244, 91, 22, 0.35)",
            marginBottom: "14px",
          }}
        >
          METHOD 2 • THIRD-PARTY SUITE
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
          AOMEI Backupper Server
        </h1>

        <div style={{ fontSize: "17px", color: THEME.colors.charcoalMuted, fontWeight: 600 }}>
          Modern GUI alternative with flexible targets and automated retention cleanup
        </div>
      </div>

      {/* MIDDLE 62%: 4 FEATURE CARDS + MULTI-DESTINATION DATA FLOW PIPES */}
      <div
        style={{
          height: 1100,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 5,
        }}
      >
        {/* Glowing Orange Data Flow Bus Cable */}
        <DataFlowPipes
          startX={260}
          startY={360}
          endX={760}
          endY={360}
          color={THEME.colors.orange}
          lineWidth={5}
          speed={1.6}
          packetCount={5}
          isLatching={true}
          latchFrame={35}
          label="MULTI-DESTINATION STREAM"
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
          {/* Left Column: 4 Feature Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", width: "440px" }}>
            {features.map((f, idx) => {
              const entrance = spring({
                frame: Math.max(0, frame - f.delay),
                fps,
                config: THEME.springs.gentle,
              });

              return (
                <div
                  key={idx}
                  style={{
                    padding: "16px 20px",
                    borderRadius: "20px",
                    background: "#FFFFFF",
                    border: `1.5px solid ${f.color}30`,
                    boxShadow: THEME.shadows.card,
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    transform: `translateX(${(1 - entrance) * -40}px) scale(${0.96 + entrance * 0.04})`,
                    opacity: entrance,
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "14px",
                      background: `${f.color}15`,
                      fontSize: "22px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {f.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: "15px", fontWeight: 800, color: THEME.colors.charcoal }}>
                      {f.title}
                    </div>
                    <div style={{ fontSize: "12px", color: THEME.colors.charcoalMuted, marginTop: "2px" }}>
                      {f.sub}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: 3D SAS 15K Enterprise Hard Drive */}
          <HardDrive3DWidget width={380} height={440} isWriting delay={20} showSavedBadge={frame > 50} />
        </div>

        {/* Universal Destination Badges Bar */}
        <div
          style={{
            width: "100%",
            maxWidth: 820,
            marginTop: "28px",
            padding: "14px 24px",
            borderRadius: "20px",
            background: "#FFFFFF",
            boxShadow: THEME.shadows.card,
            border: `1.5px solid ${THEME.colors.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 6,
          }}
        >
          <span style={{ fontSize: "13px", fontWeight: 800, color: THEME.colors.charcoalMuted }}>SUPPORTED TARGETS:</span>
          {["Local Disk", "External USB", "NAS / Share", "Cloud Storage"].map((t, i) => (
            <span
              key={i}
              style={{
                padding: "6px 14px",
                borderRadius: "10px",
                background: "#F1F5F9",
                color: THEME.colors.charcoal,
                fontSize: "12px",
                fontWeight: 700,
              }}
            >
              {t}
            </span>
          ))}
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
        <KineticSubtitleEngine sceneId="scene7" fontSize={42} layout="vertical" />
      </div>
    </div>
  );
};
