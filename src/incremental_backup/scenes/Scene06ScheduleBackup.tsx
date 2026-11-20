import React from "react";
import { spring, useCurrentFrame, useVideoConfig, Audio, staticFile } from "remotion";
import { THEME } from "../theme";
import { CanvaCard } from "../components/CanvaCard";
import { HeaderBanner } from "../components/HeaderBanner";
import { KineticSubtitleEngine } from "../components/KineticSubtitleEngine";

export const Scene06ScheduleBackup: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const wizardSteps = [
    {
      step: "STEP 1",
      title: "Backup Configuration",
      choice: "Full Server (Recommended)",
      icon: "🖥️",
      delay: 20,
    },
    {
      step: "STEP 2",
      title: "Backup Schedule",
      choice: "Daily at 10:00 PM (Once a day)",
      icon: "⏰",
      delay: 140,
    },
    {
      step: "STEP 3",
      title: "Destination Type",
      choice: "Dedicated Backup Hard Disk",
      icon: "💾",
      delay: 260,
    },
    {
      step: "STEP 4",
      title: "Select Destination",
      choice: "Disk 1 - 1000 GB (Show All Disks)",
      icon: "🎯",
      delay: 380,
    },
    {
      step: "STEP 5",
      title: "Confirmation & Finish",
      choice: "Task Configured Successfully",
      icon: "✅",
      delay: 500,
    },
  ];

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
      <Audio src={staticFile("incremental_backup/scene6.wav")} />

      <HeaderBanner
        category="Automated Scheduling Wizard"
        title="Create a Backup Schedule"
        subtitle="Step-by-step configuration wizard for scheduled unattended incremental backups."
      />

      {/* 5-Step Horizontal Wizard Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "18px",
          marginTop: "20px",
        }}
      >
        {wizardSteps.map((s, idx) => (
          <CanvaCard
            key={idx}
            delay={s.delay}
            highlight={idx === 4}
            style={{
              padding: "24px 18px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              minHeight: 350,
            }}
          >
            {/* Step Badge */}
            <span
              style={{
                fontSize: "11px",
                fontWeight: 800,
                color: idx === 4 ? THEME.colors.green : THEME.colors.orange,
                letterSpacing: "0.08em",
                marginBottom: "12px",
              }}
            >
              {s.step}
            </span>

            {/* Icon Circle */}
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "16px",
                background: idx === 4 ? THEME.colors.greenLight : THEME.colors.orangeLight,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                marginBottom: "16px",
              }}
            >
              {s.icon}
            </div>

            <h3
              style={{
                ...THEME.typography.h3,
                fontSize: "16px",
                margin: "0 0 10px 0",
                color: THEME.colors.charcoal,
              }}
            >
              {s.title}
            </h3>

            <p
              style={{
                fontSize: "13px",
                color: THEME.colors.charcoalMuted,
                lineHeight: 1.4,
                margin: 0,
              }}
            >
              {s.choice}
            </p>

            <div
              style={{
                marginTop: "auto",
                width: "100%",
                padding: "6px 0",
                borderRadius: "8px",
                background: idx === 4 ? THEME.colors.green : THEME.colors.orange,
                color: "#FFFFFF",
                fontSize: "11px",
                fontWeight: 700,
              }}
            >
              {idx === 4 ? "COMPLETE" : "CONFIGURED"}
            </div>
          </CanvaCard>
        ))}
      </div>

      {/* Confirmation Banner at Bottom */}
      <div style={{ marginTop: "30px" }}>
        <CanvaCard
          delay={520}
          style={{
            background: "linear-gradient(90deg, #FFFFFF 0%, #F0FDF4 100%)",
            border: `1.5px solid ${THEME.colors.green}55`,
            padding: "20px 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span style={{ fontSize: "28px" }}>🎉</span>
            <div>
              <span style={{ fontSize: "12px", fontWeight: 800, color: THEME.colors.green, textTransform: "uppercase" }}>
                AUTOMATION ACTIVE
              </span>
              <div style={{ fontSize: "18px", fontWeight: 800, color: THEME.colors.charcoal, marginTop: "2px" }}>
                BACKUP TASK CONFIGURED & SCHEDULED
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "20px", fontSize: "14px", fontWeight: 700, color: THEME.colors.charcoalMuted }}>
            <span>Scope: Full Server</span>
            <span>•</span>
            <span>Target: Dedicated Disk</span>
            <span>•</span>
            <span style={{ color: THEME.colors.green }}>Baseline Established</span>
          </div>
        </CanvaCard>
      </div>

      {/* Dynamic Kinetic Subtitle Engine */}
      <KineticSubtitleEngine
        sceneId="scene6"
        fontSize={36}
        layout="landscape"
        style={{
          position: "absolute",
          bottom: "16px",
          left: 0,
          right: 0,
          zIndex: 10,
        }}
      />
    </div>
  );
};
