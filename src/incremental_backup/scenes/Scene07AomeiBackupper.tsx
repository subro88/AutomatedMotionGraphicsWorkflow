import React from "react";
import { spring, useCurrentFrame, useVideoConfig, Audio, staticFile } from "remotion";
import { THEME } from "../theme";
import { CanvaCard } from "../components/CanvaCard";
import { HeaderBanner } from "../components/HeaderBanner";

export const Scene07AomeiBackupper: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const features = [
    {
      title: "Multiple Backup Types",
      subtitle: "System, Disk, Partition and File Backup",
      icon: "📁",
      color: THEME.colors.orange,
      badge: "Flexible Scope",
      delay: 30,
    },
    {
      title: "Flexible Scheduling",
      subtitle: "Daily, Weekly, Monthly, Event Trigger & USB Plug In",
      icon: "🗓️",
      color: THEME.colors.blue,
      badge: "Granular Timing",
      delay: 150,
    },
    {
      title: "Multiple Storage Destinations",
      subtitle: "Local Disk, External Drive, Network Share, NAS & Cloud",
      icon: "🌐",
      color: THEME.colors.green,
      badge: "Universal Targets",
      delay: 270,
    },
    {
      title: "Backup Management",
      subtitle: "Incremental and Differential Backup options",
      icon: "⚡",
      color: THEME.colors.purple,
      badge: "Dual Scheme",
      delay: 390,
    },
  ];

  const workflowSteps = [
    { label: "1. Select Backup", icon: "📋" },
    { label: "2. Choose Source", icon: "💽" },
    { label: "3. Select Destination", icon: "🎯" },
    { label: "4. Enable Schedule", icon: "⏰" },
    { label: "5. Start Backup", icon: "🚀" },
  ];

  // GUI Window entrance spring
  const guiSpring = spring({
    frame,
    fps,
    config: THEME.springs.gentle,
  });

  // Animated data blocks moving into drive (cyclical animation)
  const cycleFrame = (frame % 90) / 90;

  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        background: THEME.colors.cream,
        backgroundImage: `radial-gradient(${THEME.colors.charcoal} 0.75px, transparent 0.75px)`,
        backgroundSize: "28px 28px",
        padding: "45px 80px",
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
        fontFamily: THEME.typography.fontFamily,
      }}
    >
      <Audio src={staticFile("incremental_backup/scene7.wav")} />

      <HeaderBanner
        category="Alternative Solution"
        title="Method 2: AOMEI Backupper Server"
        subtitle="A versatile third-party alternative offering advanced scheduling, differential schemes, and cloud storage."
      />

      {/* Main Content Layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 1.3fr",
          gap: "36px",
          alignItems: "start",
        }}
      >
        {/* Left Column: Software UI Mockup Illustration */}
        <div
          style={{
            transform: `scale(${0.96 + guiSpring * 0.04}) translateY(${(1 - guiSpring) * 30}px)`,
            opacity: guiSpring,
          }}
        >
          <CanvaCard
            style={{
              padding: 0,
              borderRadius: "24px",
              boxShadow: "0 25px 60px -10px rgba(41, 37, 36, 0.12)",
              border: `1px solid ${THEME.colors.borderStrong}`,
              overflow: "hidden",
              background: "#F8FAFC",
            }}
          >
            {/* App Titlebar */}
            <div
              style={{
                height: 48,
                background: "linear-gradient(90deg, #1E293B 0%, #334155 100%)",
                display: "flex",
                alignItems: "center",
                padding: "0 18px",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "6px",
                    background: THEME.colors.orange,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    color: "#FFFFFF",
                    fontWeight: 900,
                  }}
                >
                  A
                </div>
                <span
                  style={{
                    color: "#F1F5F9",
                    fontSize: "13px",
                    fontWeight: 700,
                    letterSpacing: "0.02em",
                  }}
                >
                  AOMEI Backupper Server Edition
                </span>
              </div>
              <div style={{ display: "flex", gap: "6px" }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#64748B" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#64748B" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#EF4444" }} />
              </div>
            </div>

            {/* App Sidebar + Canvas */}
            <div style={{ display: "flex", minHeight: 390 }}>
              {/* Sidebar */}
              <div
                style={{
                  width: 140,
                  background: "#0F172A",
                  padding: "16px 10px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                {[
                  { label: "Home", active: false, icon: "🏠" },
                  { label: "Backup", active: true, icon: "🛡️" },
                  { label: "Sync", active: false, icon: "🔄" },
                  { label: "Restore", active: false, icon: "⏪" },
                  { label: "Clone", active: false, icon: "📋" },
                  { label: "Tools", active: false, icon: "⚙️" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: "8px 12px",
                      borderRadius: "10px",
                      background: item.active ? THEME.colors.orange : "transparent",
                      color: item.active ? "#FFFFFF" : "#94A3B8",
                      fontSize: "12px",
                      fontWeight: item.active ? 700 : 500,
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Main App Workspace */}
              <div style={{ flex: 1, padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#1E293B", marginBottom: "4px" }}>
                  Select Backup Type
                </div>

                {/* 4 Clickable Backup Options */}
                {[
                  { title: "System Backup", desc: "Back up Windows OS, boot partitions, and installed drivers", active: true },
                  { title: "Disk Backup", desc: "Back up entire hard disks or RAID arrays to an image", active: false },
                  { title: "Partition Backup", desc: "Back up selected dynamic or basic partitions", active: false },
                  { title: "File Backup", desc: "Back up individual enterprise folders and network shares", active: false },
                ].map((opt, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: opt.active ? "#EFF6FF" : "#FFFFFF",
                      border: opt.active ? `2px solid ${THEME.colors.blue}` : "1px solid #E2E8F0",
                      borderRadius: "12px",
                      padding: "12px 14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: opt.active ? THEME.colors.blue : "#334155" }}>
                        {opt.title}
                      </div>
                      <div style={{ fontSize: "11px", color: "#64748B", marginTop: "2px" }}>
                        {opt.desc}
                      </div>
                    </div>
                    {opt.active && (
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: 800,
                          background: THEME.colors.blue,
                          color: "#FFF",
                          padding: "3px 8px",
                          borderRadius: "9999px",
                        }}
                      >
                        SELECTED
                      </span>
                    )}
                  </div>
                ))}

                {/* Live Storage Target Indicator */}
                <div
                  style={{
                    marginTop: "auto",
                    padding: "10px 14px",
                    background: "#F1F5F9",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: "11px",
                    color: "#475569",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span>💾</span>
                    <span>Target: <strong>NAS / Dedicated Backup Volume</strong></span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", color: THEME.colors.green }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: THEME.colors.green }} />
                    <span style={{ fontWeight: 700 }}>Ready</span>
                  </div>
                </div>
              </div>
            </div>
          </CanvaCard>

          {/* Hard Drive Receiving Animated Data Blocks */}
          <div
            style={{
              marginTop: "16px",
              background: THEME.colors.white,
              borderRadius: "18px",
              padding: "14px 22px",
              boxShadow: THEME.shadows.soft,
              border: `1px solid ${THEME.colors.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "12px",
                  background: THEME.colors.orangeLight,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                }}
              >
                💽
              </div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: THEME.colors.charcoal }}>
                  Target Storage Stream
                </div>
                <div style={{ fontSize: "12px", color: THEME.colors.charcoalMuted }}>
                  Initial Full Backup followed by scheduled Incremental delta blocks
                </div>
              </div>
            </div>

            {/* Flowing Data Particle Animation */}
            <div
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
                background: THEME.colors.cream,
                padding: "8px 16px",
                borderRadius: "9999px",
                border: `1px solid ${THEME.colors.border}`,
              }}
            >
              {[0, 1, 2, 3].map((i) => {
                const pPos = (cycleFrame + i * 0.25) % 1;
                return (
                  <div
                    key={i}
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: "4px",
                      background: i === 0 ? THEME.colors.orange : THEME.colors.blue,
                      transform: `scale(${0.7 + pPos * 0.5})`,
                      opacity: 0.4 + pPos * 0.6,
                      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                    }}
                  />
                );
              })}
              <span style={{ fontSize: "11px", fontWeight: 700, color: THEME.colors.charcoal, marginLeft: "4px" }}>
                Writing Deltas...
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: 4 Rounded Feature Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {features.map((f, idx) => (
            <CanvaCard
              key={idx}
              delay={f.delay}
              style={{
                padding: "20px 24px",
                display: "flex",
                alignItems: "center",
                gap: "20px",
              }}
            >
              <div
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: "16px",
                  background: `${f.color}15`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "26px",
                  flexShrink: 0,
                  boxShadow: `0 4px 12px ${f.color}20`,
                }}
              >
                {f.icon}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                  <h3
                    style={{
                      ...THEME.typography.h3,
                      fontSize: "18px",
                      margin: 0,
                      color: THEME.colors.charcoal,
                    }}
                  >
                    {f.title}
                  </h3>
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: 800,
                      color: f.color,
                      background: `${f.color}15`,
                      padding: "2px 8px",
                      borderRadius: "9999px",
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                    }}
                  >
                    {f.badge}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: "14px",
                    color: THEME.colors.charcoalMuted,
                    margin: 0,
                    lineHeight: 1.4,
                  }}
                >
                  {f.subtitle}
                </p>
              </div>
            </CanvaCard>
          ))}

          {/* Key Rule Highlight Banner */}
          <CanvaCard
            delay={500}
            highlight
            style={{
              padding: "16px 24px",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              background: "#FFFBF7",
            }}
          >
            <span style={{ fontSize: "24px" }}>💡</span>
            <div>
              <div style={{ fontSize: "13px", fontWeight: 800, color: THEME.colors.orange, letterSpacing: "0.04em" }}>
                CRITICAL BACKUP RULE
              </div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: THEME.colors.charcoal, marginTop: "2px" }}>
                "The first backup creates a full backup. Subsequent backups can be incremental."
              </div>
            </div>
          </CanvaCard>
        </div>
      </div>

      {/* Bottom Horizontal Workflow Ribbon */}
      <div
        style={{
          marginTop: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: THEME.colors.white,
          borderRadius: "20px",
          padding: "14px 28px",
          boxShadow: THEME.shadows.soft,
          border: `1px solid ${THEME.colors.border}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <span style={{ fontSize: "12px", fontWeight: 800, color: THEME.colors.charcoalMuted, letterSpacing: "0.06em" }}>
            WORKFLOW:
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {workflowSteps.map((w, idx) => (
              <React.Fragment key={idx}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    background: THEME.colors.cream,
                    padding: "6px 14px",
                    borderRadius: "9999px",
                    fontSize: "12px",
                    fontWeight: 700,
                    color: THEME.colors.charcoal,
                    border: `1px solid ${THEME.colors.border}`,
                  }}
                >
                  <span>{w.icon}</span>
                  <span>{w.label}</span>
                </div>
                {idx < workflowSteps.length - 1 && (
                  <span style={{ color: THEME.colors.orange, fontWeight: 900, fontSize: "14px" }}>→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div style={{ fontSize: "11px", color: THEME.colors.charcoalLight, fontStyle: "italic" }}>
          Features and availability depend on the software edition.
        </div>
      </div>
    </div>
  );
};
