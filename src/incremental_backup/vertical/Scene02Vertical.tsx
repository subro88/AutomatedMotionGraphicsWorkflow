import React from "react";
import { spring, useCurrentFrame, useVideoConfig, Audio, staticFile } from "remotion";
import { THEME } from "../theme";
import { HardDrive3DWidget } from "../components/HardDrive3DWidget";
import { KineticSubtitleEngine } from "../components/KineticSubtitleEngine";

export const Scene02Vertical: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const days = [
    { day: "MON", label: "Full Backup", blocks: 10, color: THEME.colors.orange, delay: 20 },
    { day: "TUE", label: "Changes Since Mon (+3)", blocks: 3, color: THEME.colors.blue, delay: 140 },
    { day: "WED", label: "Changes Since Tue (+2)", blocks: 2, color: THEME.colors.green, delay: 260 },
    { day: "THU", label: "Changes Since Wed (+4)", blocks: 4, color: THEME.colors.purple, delay: 380 },
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
      <Audio src={staticFile("incremental_backup/scene2.wav")} />

      {/* Top Badge */}
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
          CORE DEFINITION
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
        What is Incremental Backup?
      </h1>

      {/* TOP 55% ZONE: 4-DAY TIMELINE + 3D HARD DRIVE */}
      <div
        style={{
          height: 980,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
        }}
      >
        {/* 4 Staggered Daily Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%", maxWidth: 600 }}>
          {days.map((d, idx) => {
            const entrance = spring({
              frame: Math.max(0, frame - d.delay),
              fps,
              config: THEME.springs.gentle,
            });
            return (
              <div
                key={idx}
                style={{
                  padding: "16px 24px",
                  borderRadius: "20px",
                  background: "#FFFFFF",
                  boxShadow: THEME.shadows.card,
                  border: `1.5px solid ${d.color}30`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  transform: `translateY(${(1 - entrance) * 30}px) scale(${0.95 + entrance * 0.05})`,
                  opacity: entrance,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "14px",
                      background: `${d.color}15`,
                      color: d.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "15px",
                      fontWeight: 900,
                    }}
                  >
                    {d.day}
                  </div>
                  <div>
                    <div style={{ fontSize: "16px", fontWeight: 800, color: THEME.colors.charcoal }}>
                      {d.label}
                    </div>
                    <div style={{ fontSize: "12px", color: THEME.colors.charcoalMuted }}>
                      {idx === 0 ? "Initial Baseline Volume" : "Delta block capture only"}
                    </div>
                  </div>
                </div>

                {/* Blocks Count */}
                <div style={{ display: "flex", gap: "4px" }}>
                  {Array.from({ length: Math.min(6, d.blocks) }).map((_, bIdx) => (
                    <div
                      key={bIdx}
                      style={{
                        width: 14,
                        height: 22,
                        borderRadius: "4px",
                        background: d.color,
                        boxShadow: `0 2px 6px ${d.color}40`,
                      }}
                    />
                  ))}
                  {d.blocks > 6 && (
                    <span style={{ fontSize: "12px", fontWeight: 800, color: d.color, alignSelf: "center", marginLeft: 4 }}>
                      +4
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Floating 3D Hard Drive */}
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
        <KineticSubtitleEngine sceneId="scene2" fontSize={60} layout="vertical" />
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
