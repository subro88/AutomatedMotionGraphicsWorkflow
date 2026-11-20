import React from "react";
import { spring, useCurrentFrame, useVideoConfig, Audio, staticFile } from "remotion";
import { THEME } from "../theme";
import { KineticSubtitleEngine } from "../components/KineticSubtitleEngine";
import { HardDrive3DWidget } from "../components/HardDrive3DWidget";
import { DataFlowPipes } from "../components/DataFlowPipes";

export const Scene06Vertical: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const steps = [
    { num: "1", title: "Full Server", sub: "Recommended backup scope", icon: "🖥️", delay: 20 },
    { num: "2", title: "Daily Schedule", sub: "10:00 PM unattended execution", icon: "⏰", delay: 110 },
    { num: "3", title: "Dedicated Hard Disk", sub: "Exclusive VSS shadow volume", icon: "💾", delay: 200 },
    { num: "4", title: "Confirm & Finish", sub: "Automated schedule active", icon: "✅", delay: 290 },
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
      <Audio src={staticFile("incremental_backup/scene6.wav")} />

      {/* TOP 18%: PERMANENT STEP HEADER */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 10 }}>
        <div
          style={{
            padding: "8px 24px",
            borderRadius: "9999px",
            background: THEME.colors.blue,
            color: "#FFF",
            fontSize: "15px",
            fontWeight: 800,
            letterSpacing: "0.1em",
            boxShadow: `0 8px 24px ${THEME.colors.blue}40`,
            marginBottom: "14px",
          }}
        >
          STEP 03 • AUTOMATION WIZARD
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
          Create a Backup Schedule
        </h1>

        <div style={{ fontSize: "17px", color: THEME.colors.charcoalMuted, fontWeight: 600 }}>
          Configuring daily unattended incremental jobs on dedicated target disks
        </div>
      </div>

      {/* MIDDLE 62%: 4 WIZARD STEPS + GLOWING GREEN PIPELINE + 3D HARD DRIVE */}
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
        {/* Glowing Green Automation Pipeline */}
        <DataFlowPipes
          startX={260}
          startY={360}
          endX={760}
          endY={360}
          color={THEME.colors.green}
          lineWidth={5}
          speed={1.6}
          packetCount={5}
          isLatching={frame > 120}
          latchFrame={120}
          label="SCHEDULE COMMITTED"
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
          {/* Left Column: 4 Staggered Wizard Steps */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", width: "420px" }}>
            {steps.map((s, idx) => {
              const entrance = spring({
                frame: Math.max(0, frame - s.delay),
                fps,
                config: THEME.springs.gentle,
              });
              const isFinished = idx === 3 && frame >= s.delay;

              return (
                <div
                  key={idx}
                  style={{
                    padding: "16px 20px",
                    borderRadius: "20px",
                    background: isFinished ? "#F0FDF4" : "#FFFFFF",
                    border: isFinished ? `2.5px solid ${THEME.colors.green}` : `1.5px solid ${THEME.colors.border}`,
                    boxShadow: isFinished ? "0 18px 45px -8px rgba(16, 185, 129, 0.25)" : THEME.shadows.card,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    transform: `translateX(${(1 - entrance) * -40}px) scale(${0.96 + entrance * 0.04})`,
                    opacity: entrance,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "12px",
                        background: isFinished ? "#DCFCE7" : "#F1F5F9",
                        color: isFinished ? THEME.colors.green : THEME.colors.charcoal,
                        fontSize: "16px",
                        fontWeight: 900,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {s.num}
                    </div>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: 800, color: THEME.colors.charcoal }}>
                        {s.title}
                      </div>
                      <div style={{ fontSize: "11px", color: THEME.colors.charcoalMuted }}>
                        {s.sub}
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: "22px" }}>{s.icon}</span>
                </div>
              );
            })}
          </div>

          {/* Right Column: 3D Dedicated SAS 15K Hard Drive */}
          <HardDrive3DWidget width={380} height={440} isWriting delay={25} showSavedBadge={frame > 140} />
        </div>

        {/* Wizard Confirmation Banner */}
        <div
          style={{
            width: "100%",
            maxWidth: 820,
            marginTop: "28px",
            padding: "16px 26px",
            borderRadius: "22px",
            background: "#F0FDF4",
            border: `2px solid ${THEME.colors.green}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            zIndex: 6,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>✅</span>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 900, color: THEME.colors.green }}>
                TASK CONFIGURED
              </div>
              <div style={{ fontSize: "12px", color: THEME.colors.charcoalMuted }}>
                Windows Server Backup daemon runs every day at 10:00 PM
              </div>
            </div>
          </div>
          <div
            style={{
              padding: "6px 14px",
              borderRadius: "12px",
              background: THEME.colors.green,
              color: "#FFFFFF",
              fontSize: "12px",
              fontWeight: 800,
            }}
          >
            ACTIVE DAEMON
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
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: THEME.colors.blue }} />
          <span style={{ fontSize: "12px", fontWeight: 800, color: THEME.colors.charcoalMuted, letterSpacing: "0.06em" }}>
            AUDIO SPOKEN TRANSCRIPT
          </span>
        </div>
        <KineticSubtitleEngine sceneId="scene6" fontSize={42} layout="vertical" />
      </div>
    </div>
  );
};
