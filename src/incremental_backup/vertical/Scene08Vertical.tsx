import React from "react";
import { spring, useCurrentFrame, useVideoConfig, Audio, staticFile } from "remotion";
import { THEME } from "../theme";
import { KineticSubtitleEngine } from "../components/KineticSubtitleEngine";
import { DataFlowPipes } from "../components/DataFlowPipes";

export const Scene08Vertical: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const limitations = [
    { title: "Scheduling Rigidity", icon: "⏰", desc: "No native weekly or monthly schedules.", delay: 20 },
    { title: "2TB Volume Size Limit", icon: "⚠️", desc: "Legacy VHD format cannot exceed 2040 GB.", delay: 110 },
    { title: "No Tape / Optical Support", icon: "📼", desc: "Tape drives and DVD media removed.", delay: 200 },
    { title: "Network Single Copy", icon: "🌐", desc: "Remote shares overwrite previous versions.", delay: 290 },
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
      <Audio src={staticFile("incremental_backup/scene8.wav")} />

      {/* TOP 18%: PERMANENT STEP HEADER */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 10 }}>
        <div
          style={{
            padding: "8px 24px",
            borderRadius: "9999px",
            background: THEME.colors.red,
            color: "#FFF",
            fontSize: "15px",
            fontWeight: 800,
            letterSpacing: "0.1em",
            boxShadow: `0 8px 24px rgba(239, 68, 68, 0.35)`,
            marginBottom: "14px",
          }}
        >
          CRITICAL ARCHITECTURE CONSTRAINTS
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
          Critical Limitations
        </h1>

        <div style={{ fontSize: "17px", color: THEME.colors.charcoalMuted, fontWeight: 600 }}>
          Why network shares break incremental history in Windows Server 2008
        </div>
      </div>

      {/* MIDDLE 62%: NETWORK OVERWRITE HAZARD VS DEDICATED DISK + 4 LIMITATION CARDS */}
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
        {/* Red Hazard Pipe for Network Share Overwrite */}
        <DataFlowPipes
          startX={260}
          startY={300}
          endX={760}
          endY={300}
          color={THEME.colors.red}
          lineWidth={5}
          speed={1.8}
          packetCount={4}
          isLatching={false}
          label="OVERWRITE HAZARD"
        />

        {/* High-Impact Visual Comparison Card */}
        <div
          style={{
            width: "100%",
            maxWidth: 880,
            padding: "24px 28px",
            borderRadius: "26px",
            background: "#FFFFFF",
            border: `2.5px solid ${THEME.colors.red}`,
            boxShadow: "0 25px 60px -10px rgba(239, 68, 68, 0.2)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            zIndex: 6,
          }}
        >
          {/* Left: Dedicated Hard Drive (Recommended) */}
          <div
            style={{
              flex: 1,
              padding: "18px",
              borderRadius: "20px",
              background: "#F0FDF4",
              border: `1.5px solid ${THEME.colors.green}`,
              textAlign: "center",
            }}
          >
            <span style={{ fontSize: "32px" }}>💾</span>
            <div style={{ fontSize: "16px", fontWeight: 900, color: THEME.colors.green, margin: "6px 0 2px 0" }}>
              Dedicated Hard Disk
            </div>
            <div style={{ fontSize: "12px", color: THEME.colors.charcoalMuted, fontWeight: 700 }}>
              Full VSS Incremental History Retained
            </div>
            <div
              style={{
                marginTop: "10px",
                padding: "4px 10px",
                borderRadius: "8px",
                background: THEME.colors.green,
                color: "#FFFFFF",
                fontSize: "11px",
                fontWeight: 800,
                display: "inline-block",
              }}
            >
              ✓ RECOMMENDED
            </div>
          </div>

          <div style={{ fontSize: "24px", fontWeight: 900, color: THEME.colors.charcoalMuted }}>VS</div>

          {/* Right: Network Shared Folder (Hazard) */}
          <div
            style={{
              flex: 1,
              padding: "18px",
              borderRadius: "20px",
              background: "#FEF2F2",
              border: `1.5px solid ${THEME.colors.red}`,
              textAlign: "center",
            }}
          >
            <span style={{ fontSize: "32px" }}>🌐</span>
            <div style={{ fontSize: "16px", fontWeight: 900, color: THEME.colors.red, margin: "6px 0 2px 0" }}>
              Network Shared Folder
            </div>
            <div style={{ fontSize: "12px", color: THEME.colors.charcoalMuted, fontWeight: 700 }}>
              Overwrites Single Copy — Zero History!
            </div>
            <div
              style={{
                marginTop: "10px",
                padding: "4px 10px",
                borderRadius: "8px",
                background: THEME.colors.red,
                color: "#FFFFFF",
                fontSize: "11px",
                fontWeight: 800,
                display: "inline-block",
              }}
            >
              ✕ DATA LOSS RISK
            </div>
          </div>
        </div>

        {/* 4 Architectural Constraint Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", width: "100%", maxWidth: 880, zIndex: 6 }}>
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
                  padding: "18px 20px",
                  borderRadius: "20px",
                  background: "#FFFFFF",
                  border: `1.5px solid rgba(239, 68, 68, 0.25)`,
                  boxShadow: THEME.shadows.card,
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  transform: `translateY(${(1 - entrance) * 20}px) scale(${0.96 + entrance * 0.04})`,
                  opacity: entrance,
                }}
              >
                <span style={{ fontSize: "28px" }}>{lim.icon}</span>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 800, color: THEME.colors.charcoal }}>
                    {lim.title}
                  </div>
                  <div style={{ fontSize: "12px", color: THEME.colors.charcoalMuted, marginTop: "2px" }}>
                    {lim.desc}
                  </div>
                </div>
              </div>
            );
          })}
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
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: THEME.colors.red }} />
          <span style={{ fontSize: "12px", fontWeight: 800, color: THEME.colors.charcoalMuted, letterSpacing: "0.06em" }}>
            AUDIO SPOKEN TRANSCRIPT
          </span>
        </div>
        <KineticSubtitleEngine sceneId="scene8" fontSize={42} layout="vertical" />
      </div>
    </div>
  );
};
