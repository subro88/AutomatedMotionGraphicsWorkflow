import React from "react";
import { spring, useCurrentFrame, useVideoConfig, Audio, staticFile } from "remotion";
import { THEME } from "../theme";
import { KineticSubtitleEngine } from "../components/KineticSubtitleEngine";
import { HardDrive3DWidget } from "../components/HardDrive3DWidget";

export const Scene07Vertical: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const features = [
    { title: "Multiple Backup Types", sub: "System, Disk, Partition, Files", icon: "📁", color: THEME.colors.orange, delay: 20 },
    { title: "Flexible Scheduling", sub: "Daily, Weekly, Monthly, USB Plug In", icon: "🗓️", color: THEME.colors.blue, delay: 140 },
    { title: "Universal Destinations", sub: "Local, External, NAS, Cloud", icon: "🌐", color: THEME.colors.green, delay: 260 },
    { title: "Incremental & Differential", sub: "Dual advanced backup schemes", icon: "⚡", color: THEME.colors.purple, delay: 380 },
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
      <Audio src={staticFile("incremental_backup/scene7.wav")} />

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
            boxShadow: "0 8px 20px rgba(244, 91, 22, 0.3)",
          }}
        >
          ALTERNATIVE SOLUTION
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
        AOMEI Backupper Server
      </h1>

      {/* TOP 55% ZONE: 4 FEATURE CARDS & 3D HARD DRIVE */}
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
                  padding: "14px 22px",
                  borderRadius: "20px",
                  background: "#FFFFFF",
                  border: `1.5px solid ${f.color}25`,
                  boxShadow: THEME.shadows.card,
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  transform: `translateY(${(1 - entrance) * 25}px) scale(${0.96 + entrance * 0.04})`,
                  opacity: entrance,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "14px",
                    background: `${f.color}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "22px",
                    flexShrink: 0,
                  }}
                >
                  {f.icon}
                </div>
                <div>
                  <div style={{ fontSize: "15px", fontWeight: 800, color: THEME.colors.charcoal }}>
                    {f.title}
                  </div>
                  <div style={{ fontSize: "12px", color: THEME.colors.charcoalMuted }}>
                    {f.sub}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <HardDrive3DWidget width={360} height={380} isWriting delay={350} />
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
        <KineticSubtitleEngine sceneId="scene7" fontSize={60} layout="vertical" />
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
