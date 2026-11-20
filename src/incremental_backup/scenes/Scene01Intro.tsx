import React from "react";
import { spring, useCurrentFrame, useVideoConfig, Audio, staticFile } from "remotion";
import { THEME } from "../theme";
import { CanvaCard } from "../components/CanvaCard";
import { HeaderBanner } from "../components/HeaderBanner";
import { ServerIllustration } from "../components/ServerIllustration";
import { KineticSubtitleEngine } from "../components/KineticSubtitleEngine";

export const Scene01Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Floating File Cards on Left (staggered entrance)
  const files = [
    { title: "Important Files", count: "10,000+ Docs", color: THEME.colors.orange, icon: "📄" },
    { title: "Business Data", count: "Daily Transactions", color: THEME.colors.blue, icon: "📊" },
    { title: "Server Database", count: "SQL / Active Directory", color: THEME.colors.green, icon: "🗄️" },
  ];

  // Question Card Entrance
  const qSpring = spring({
    frame: Math.max(0, frame - 160),
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
        padding: "60px 80px",
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
        fontFamily: THEME.typography.fontFamily,
      }}
    >
      <Audio src={staticFile("incremental_backup/scene1.wav")} />

      {/* Top Header */}
      <HeaderBanner
        category="Windows Server 2008 / 2008 R2"
        title="INCREMENTAL BACKUP"
        subtitle="Protecting Changing Enterprise Data Without Repeated Redundancy"
      />

      {/* Two-Column Composition */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.1fr",
          gap: "50px",
          alignItems: "center",
          marginTop: "10px",
        }}
      >
        {/* Left Column: 3 Floating File Cards & Question Card */}
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {files.map((f, idx) => (
              <CanvaCard
                key={idx}
                delay={20 + idx * 25}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px 24px",
                  borderRadius: "20px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "12px",
                      background: `${f.color}15`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "20px",
                    }}
                  >
                    {f.icon}
                  </div>
                  <div>
                    <h3 style={{ ...THEME.typography.h3, fontSize: "19px", margin: "0 0 2px 0" }}>
                      {f.title}
                    </h3>
                    <span style={{ fontSize: "13px", color: THEME.colors.charcoalMuted, fontWeight: 600 }}>
                      {f.count}
                    </span>
                  </div>
                </div>
                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: THEME.borderRadius.pill,
                    background: `${f.color}15`,
                    color: f.color,
                    fontSize: "11px",
                    fontWeight: 700,
                  }}
                >
                  EXPANDING
                </span>
              </CanvaCard>
            ))}
          </div>

          {/* Large Question Card (Enters last) */}
          <CanvaCard
            delay={150}
            highlight
            style={{
              background: "linear-gradient(135deg, #FFFFFF 0%, #FFF7ED 100%)",
              padding: "26px 30px",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  background: THEME.colors.orange,
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 900,
                  fontSize: "20px",
                  flexShrink: 0,
                  boxShadow: "0 4px 12px rgba(244, 91, 22, 0.3)",
                }}
              >
                ?
              </div>
              <div>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 800,
                    color: THEME.colors.orange,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  THE CORE CHALLENGE
                </span>
                <p
                  style={{
                    ...THEME.typography.h2,
                    fontSize: "23px",
                    lineHeight: 1.3,
                    margin: "6px 0 0 0",
                    color: THEME.colors.charcoal,
                  }}
                >
                  How can we back up changing data without repeatedly backing up everything?
                </p>
              </div>
            </div>
          </CanvaCard>
        </div>

        {/* Right Column: Server & Backup Hard Drive Illustration with Traveling Data */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
          }}
        >
          <ServerIllustration delay={15} highlightBackup />
        </div>
      </div>

      {/* Dynamic Kinetic Subtitle Engine */}
      <KineticSubtitleEngine
        sceneId="scene1"
        fontSize={38}
        layout="landscape"
        style={{
          position: "absolute",
          bottom: "22px",
          left: 0,
          right: 0,
          zIndex: 10,
        }}
      />
    </div>
  );
};
