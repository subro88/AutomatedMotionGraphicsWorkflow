import React from "react";
import { spring, useCurrentFrame, useVideoConfig, Audio, staticFile } from "remotion";
import { THEME } from "../theme";
import { CanvaCard } from "../components/CanvaCard";
import { HeaderBanner } from "../components/HeaderBanner";

export const Scene08Limitations: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const limitations = [
    {
      title: "Scheduling Rigidity",
      icon: "⏰",
      color: THEME.colors.orange,
      badge: "No Weekly / Monthly",
      desc: "Windows Server Backup only supports scheduling once a day or multiple times a day. Custom weekly or monthly intervals cannot be natively configured.",
      impact: "Requires manual task scheduler scripts for weekly routines.",
      delay: 30,
    },
    {
      title: "2TB Volume Size Limit",
      icon: "⚠️",
      color: THEME.colors.red,
      badge: "2TB Hard Limit",
      desc: "Windows Server 2008 Backup uses the legacy VHD file format for volume snapshots. Any enterprise volume larger than 2040 GB fails to back up.",
      impact: "Cannot protect large modern multi-terabyte arrays.",
      delay: 150,
    },
    {
      title: "No Tape or Optical Media",
      icon: "📼",
      color: THEME.colors.charcoal,
      badge: "No Tape Drives",
      desc: "Unlike earlier Windows NTBackup versions, Server 2008 removed all support for magnetic tape drives and direct optical burning (CD/DVD/Blu-ray).",
      impact: "Restricts physical off-site archiving strategies.",
      delay: 270,
    },
    {
      title: "Network Share Single Copy",
      icon: "🌐",
      color: THEME.colors.blue,
      badge: "Overwrites History",
      desc: "When targeting a remote network share (SMB / NAS folder), Windows Server Backup keeps only ONE backup version. Each subsequent backup overwrites the previous.",
      impact: "No point-in-time version history over the network.",
      delay: 390,
    },
  ];

  // Bottom banner entrance
  const bannerSpring = spring({
    frame: Math.max(0, frame - 500),
    fps,
    config: THEME.springs.gentle,
  });

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
      <Audio src={staticFile("incremental_backup/scene8.wav")} />

      <HeaderBanner
        category="Critical Architecture Notice"
        title="Important Limitations"
        subtitle="Key constraints and missing features you must account for when using Windows Server Backup in Server 2008."
      />

      {/* 2x2 Grid of Limitation Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "28px",
          marginTop: "10px",
        }}
      >
        {limitations.map((lim, idx) => (
          <CanvaCard
            key={idx}
            delay={lim.delay}
            style={{
              padding: "28px 32px",
              display: "flex",
              flexDirection: "column",
              border: `1px solid ${lim.color === THEME.colors.red ? "rgba(239, 68, 68, 0.25)" : THEME.colors.border}`,
              background: lim.color === THEME.colors.red ? "#FFFDFD" : THEME.colors.white,
            }}
          >
            {/* Top Row: Icon + Title + Badge */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "14px",
                    background: `${lim.color}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "24px",
                    flexShrink: 0,
                  }}
                >
                  {lim.icon}
                </div>
                <h3
                  style={{
                    ...THEME.typography.h3,
                    fontSize: "22px",
                    margin: 0,
                    color: THEME.colors.charcoal,
                  }}
                >
                  {lim.title}
                </h3>
              </div>

              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 800,
                  color: lim.color,
                  background: `${lim.color}15`,
                  padding: "4px 12px",
                  borderRadius: "9999px",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                {lim.badge}
              </span>
            </div>

            {/* Description */}
            <p
              style={{
                fontSize: "15px",
                color: THEME.colors.charcoalMuted,
                lineHeight: 1.5,
                margin: "0 0 16px 0",
              }}
            >
              {lim.desc}
            </p>

            {/* Impact Pill */}
            <div
              style={{
                marginTop: "auto",
                padding: "8px 14px",
                borderRadius: "10px",
                background: THEME.colors.cream,
                border: `1px solid ${THEME.colors.border}`,
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "12px",
                color: THEME.colors.charcoal,
                fontWeight: 600,
              }}
            >
              <span style={{ color: lim.color, fontWeight: 900 }}>•</span>
              <span>{lim.impact}</span>
            </div>
          </CanvaCard>
        ))}
      </div>

      {/* Bottom Differential Missing Strip */}
      <div
        style={{
          marginTop: "26px",
          transform: `scale(${0.96 + bannerSpring * 0.04}) translateY(${(1 - bannerSpring) * 20}px)`,
          opacity: bannerSpring,
        }}
      >
        <CanvaCard
          highlight
          style={{
            padding: "18px 30px",
            background: "#FFFBF5",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderRadius: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "12px",
                background: THEME.colors.orangeLight,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
              }}
            >
              🔍
            </div>
            <div>
              <div style={{ fontSize: "12px", fontWeight: 800, color: THEME.colors.orange, letterSpacing: "0.06em" }}>
                ARCHITECTURAL NOTE
              </div>
              <div style={{ fontSize: "16px", fontWeight: 700, color: THEME.colors.charcoal, marginTop: "2px" }}>
                "Windows Server Backup in Server 2008 lacks Differential backup capability."
              </div>
            </div>
          </div>

          <div
            style={{
              fontSize: "13px",
              color: THEME.colors.charcoalMuted,
              fontWeight: 500,
              maxWidth: 400,
              textAlign: "right",
            }}
          >
            All multi-version schedules operate under the Incremental VSS snapshot model.
          </div>
        </CanvaCard>
      </div>
    </div>
  );
};
