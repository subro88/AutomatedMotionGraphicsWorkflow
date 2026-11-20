import React from "react";
import { spring, useCurrentFrame, useVideoConfig, Audio, staticFile } from "remotion";
import { THEME } from "../theme";
import { HardDrive3DWidget } from "../components/HardDrive3DWidget";
import { KineticSubtitleEngine } from "../components/KineticSubtitleEngine";
import { DataFlowPipes } from "../components/DataFlowPipes";

export const Scene02Vertical: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const days = [
    { day: "MON", label: "Full Backup", blocks: 10, color: THEME.colors.orange, isFull: true, delay: 15 },
    { day: "TUE", label: "+3 Changed Blocks", blocks: 3, color: THEME.colors.blue, isFull: false, delay: 110 },
    { day: "WED", label: "+2 Changed Blocks", blocks: 2, color: THEME.colors.green, isFull: false, delay: 200 },
    { day: "THU", label: "+4 Changed Blocks", blocks: 4, color: THEME.colors.purple, isFull: false, delay: 290 },
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
      <Audio src={staticFile("incremental_backup/scene2.wav")} />

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
          STEP 01 • THE INCREMENTAL TIMELINE
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
          What is Incremental Backup?
        </h1>

        <div style={{ fontSize: "17px", color: THEME.colors.charcoalMuted, fontWeight: 600 }}>
          Backing up only the changes since the immediately previous backup
        </div>
      </div>

      {/* MIDDLE 62%: 4-DAY TIMELINE CARDS + GLOWING PIPES + 3D HARD DRIVE */}
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
        {/* Animated Data Pipeline streaming from Active Day to Hard Drive */}
        <DataFlowPipes
          startX={260}
          startY={360}
          endX={760}
          endY={360}
          color={THEME.colors.blue}
          lineWidth={5}
          speed={1.6}
          packetCount={5}
          isLatching={true}
          latchFrame={40}
          label="DELTA STREAM"
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
          {/* Left Column: 4 Daily Staggered Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", width: "420px" }}>
            {days.map((d, idx) => {
              const entrance = spring({
                frame: Math.max(0, frame - d.delay),
                fps,
                config: THEME.springs.gentle,
              });
              const isActive = frame >= d.delay && (idx === days.length - 1 || frame < days[idx + 1].delay);

              return (
                <div
                  key={idx}
                  style={{
                    padding: "16px 20px",
                    borderRadius: "22px",
                    background: "#FFFFFF",
                    boxShadow: isActive ? "0 18px 45px -8px rgba(38, 133, 217, 0.25)" : THEME.shadows.card,
                    border: isActive ? `2.5px solid ${d.color}` : `1.5px solid ${THEME.colors.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    transform: `translateX(${(1 - entrance) * -40}px) scale(${0.96 + entrance * 0.04})`,
                    opacity: entrance,
                    transition: "border 0.2s ease, box-shadow 0.2s ease",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: "14px",
                        background: `${d.color}15`,
                        color: d.color,
                        fontSize: "14px",
                        fontWeight: 900,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {d.day}
                    </div>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: 800, color: THEME.colors.charcoal }}>
                        {d.label}
                      </div>
                      <div style={{ fontSize: "11px", color: THEME.colors.charcoalMuted }}>
                        {d.isFull ? "Base Volume Image" : "Delta sectors only"}
                      </div>
                    </div>
                  </div>

                  {/* Block Indicator Badges */}
                  <div
                    style={{
                      padding: "5px 12px",
                      borderRadius: "10px",
                      background: d.color,
                      color: "#FFFFFF",
                      fontSize: "12px",
                      fontWeight: 800,
                    }}
                  >
                    {d.blocks} blocks
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: 3D SAS 15K Enterprise Hard Drive */}
          <HardDrive3DWidget width={380} height={440} isWriting delay={20} showSavedBadge={frame > 60} />
        </div>

        {/* Dynamic Timeline Progression Summary */}
        <div
          style={{
            width: "100%",
            maxWidth: 820,
            marginTop: "28px",
            padding: "16px 26px",
            borderRadius: "22px",
            background: "#EFF6FF",
            border: `2px solid ${THEME.colors.blue}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            zIndex: 6,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "12px", color: THEME.colors.charcoalMuted, fontWeight: 700 }}>STORAGE SAVED</div>
            <div style={{ fontSize: "22px", fontWeight: 900, color: THEME.colors.blue }}>~78% Less Disk</div>
          </div>
          <div style={{ width: 1, height: 36, background: "#BFDBFE" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "12px", color: THEME.colors.charcoalMuted, fontWeight: 700 }}>BACKUP DURATION</div>
            <div style={{ fontSize: "22px", fontWeight: 900, color: THEME.colors.green }}>5 Min vs 2 Hours</div>
          </div>
          <div style={{ width: 1, height: 36, background: "#BFDBFE" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "12px", color: THEME.colors.charcoalMuted, fontWeight: 700 }}>DEPENDENCY</div>
            <div style={{ fontSize: "22px", fontWeight: 900, color: THEME.colors.orange }}>Chained Sequence</div>
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
        <KineticSubtitleEngine sceneId="scene2" fontSize={42} layout="vertical" />
      </div>
    </div>
  );
};
