import React from "react";
import { spring, useCurrentFrame, useVideoConfig, Audio, staticFile } from "remotion";
import { THEME } from "../theme";
import { CanvaCard } from "../components/CanvaCard";
import { HeaderBanner } from "../components/HeaderBanner";

export const Scene10FinalSummary: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const summaries = [
    {
      title: "Incremental Backup",
      badge: "Efficiency Core",
      color: THEME.colors.blue,
      icon: "⚡",
      points: [
        "Saves only changes since the last backup",
        "Dramatically reduces backup runtime",
        "Conserves enterprise disk space",
      ],
      delay: 20,
    },
    {
      title: "Windows Server Backup",
      badge: "Native Tool",
      color: THEME.colors.orange,
      icon: "🛠️",
      points: [
        "Built-in feature in Server 2008 R2",
        "Configure 'Faster Backup Performance'",
        "Requires manual feature installation",
      ],
      delay: 140,
    },
    {
      title: "Scheduled Backup",
      badge: "Automation",
      color: THEME.colors.green,
      icon: "⏰",
      points: [
        "Dedicated target hard drive recommended",
        "Automated daily snapshot generation",
        "Maintains VSS point-in-time recovery",
      ],
      delay: 260,
    },
    {
      title: "Data Security",
      badge: "Resilience",
      color: THEME.colors.purple,
      icon: "🛡️",
      points: [
        "Verify backup integrity periodically",
        "Test full server disaster recovery",
        "Migrate off deprecated Server 2008 platforms",
      ],
      delay: 380,
    },
  ];

  // Final Banner Scale Entrance
  const bannerEntrance = spring({
    frame: Math.max(0, frame - 500),
    fps,
    config: THEME.springs.bouncy,
  });

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
      <Audio src={staticFile("incremental_backup/scene10.wav")} />

      <HeaderBanner
        category="Comprehensive Overview"
        title="Let's Recap!"
        subtitle="Key takeaways for architecting and executing reliable incremental backups in Windows Server 2008."
      />

      {/* 2x2 Grid of Summary Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px",
          marginTop: "10px",
        }}
      >
        {summaries.map((s, idx) => (
          <CanvaCard
            key={idx}
            delay={s.delay}
            style={{
              padding: "24px 28px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "14px",
                    background: `${s.color}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "22px",
                  }}
                >
                  {s.icon}
                </div>
                <h3
                  style={{
                    ...THEME.typography.h3,
                    fontSize: "20px",
                    margin: 0,
                    color: THEME.colors.charcoal,
                  }}
                >
                  {s.title}
                </h3>
              </div>

              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 800,
                  color: s.color,
                  background: `${s.color}15`,
                  padding: "4px 10px",
                  borderRadius: "9999px",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                {s.badge}
              </span>
            </div>

            {/* Bullet points */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}>
              {s.points.map((pt, pIdx) => (
                <div
                  key={pIdx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontSize: "14px",
                    color: THEME.colors.charcoalMuted,
                  }}
                >
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: s.color,
                      flexShrink: 0,
                    }}
                  />
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </CanvaCard>
        ))}
      </div>

      {/* Grand Bottom Banner */}
      <div
        style={{
          marginTop: "26px",
          transform: `scale(${0.92 + bannerEntrance * 0.08})`,
          opacity: bannerEntrance,
        }}
      >
        <div
          style={{
            background: `linear-gradient(135deg, ${THEME.colors.orange} 0%, #D84315 100%)`,
            borderRadius: "22px",
            padding: "22px 36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 20px 50px rgba(244, 91, 22, 0.35)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "16px",
                background: "rgba(255, 255, 255, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px",
              }}
            >
              🛡️
            </div>
            <div>
              <div
                style={{
                  color: "#FFFFFF",
                  fontSize: "24px",
                  fontWeight: 900,
                  letterSpacing: "0.04em",
                }}
              >
                PROTECT YOUR DATA. PLAN YOUR BACKUPS.
              </div>
              <div
                style={{
                  color: "rgba(255, 255, 255, 0.85)",
                  fontSize: "14px",
                  fontWeight: 500,
                  marginTop: "2px",
                }}
              >
                An automated incremental backup schedule ensures rapid disaster recovery and business continuity.
              </div>
            </div>
          </div>

          <div
            style={{
              padding: "10px 22px",
              borderRadius: "12px",
              background: "#FFFFFF",
              color: THEME.colors.orange,
              fontSize: "14px",
              fontWeight: 800,
              letterSpacing: "0.05em",
              boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
            }}
          >
            COMPLETE GUIDE
          </div>
        </div>
      </div>
    </div>
  );
};
