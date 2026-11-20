import React from "react";
import { spring, useCurrentFrame, useVideoConfig, Audio, staticFile } from "remotion";
import { THEME } from "../theme";
import { KineticSubtitleEngine } from "../components/KineticSubtitleEngine";
import { DataFlowPipes } from "../components/DataFlowPipes";

export const Scene03Vertical: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const incSpring = spring({ frame: Math.max(0, frame - 20), fps, config: THEME.springs.gentle });
  const diffSpring = spring({ frame: Math.max(0, frame - 160), fps, config: THEME.springs.gentle });

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
      <Audio src={staticFile("incremental_backup/scene3.wav")} />

      {/* TOP 18%: PERMANENT STEP HEADER */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 10 }}>
        <div
          style={{
            padding: "8px 24px",
            borderRadius: "9999px",
            background: THEME.colors.orange,
            color: "#FFF",
            fontSize: "15px",
            fontWeight: 800,
            letterSpacing: "0.1em",
            boxShadow: `0 8px 24px rgba(244, 91, 22, 0.35)`,
            marginBottom: "14px",
          }}
        >
          STEP 02 • ARCHITECTURAL COMPARISON
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
          Incremental vs Differential
        </h1>

        <div style={{ fontSize: "17px", color: THEME.colors.charcoalMuted, fontWeight: 600 }}>
          Understanding how change-tracking determines backup size & restore speed
        </div>
      </div>

      {/* MIDDLE 62%: 3D SIDE-BY-SIDE PANELS WITH DUAL DATA FLOW PIPELINES */}
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
        {/* Incremental Panel (Blue Theme) */}
        <div
          style={{
            width: "100%",
            maxWidth: 880,
            padding: "26px 32px",
            borderRadius: "28px",
            background: "#FFFFFF",
            border: `2px solid ${THEME.colors.blue}`,
            boxShadow: "0 25px 60px -10px rgba(38, 133, 217, 0.16)",
            transform: `translateY(${(1 - incSpring) * 35}px) scale(${0.95 + incSpring * 0.05})`,
            opacity: incSpring,
            position: "relative",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "28px" }}>⚡</span>
              <div>
                <span style={{ fontSize: "20px", fontWeight: 900, color: THEME.colors.blue }}>
                  INCREMENTAL BACKUP
                </span>
                <div style={{ fontSize: "12px", color: THEME.colors.charcoalMuted, fontWeight: 600 }}>
                  Changes since the LAST backup only
                </div>
              </div>
            </div>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 800,
                background: "#EFF6FF",
                color: THEME.colors.blue,
                padding: "6px 14px",
                borderRadius: "9999px",
                border: `1px solid ${THEME.colors.blue}40`,
              }}
            >
              Smallest File Size
            </span>
          </div>

          {/* Visual Block Representation */}
          <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
            {[
              { day: "Mon", desc: "Full Image", count: "10 Blocks", bg: "#93C5FD", color: "#1E3A8A" },
              { day: "Tue", desc: "+3 Delta", count: "3 Blocks", bg: "#60A5FA", color: "#1E3A8A" },
              { day: "Wed", desc: "+2 Delta", count: "2 Blocks", bg: "#3B82F6", color: "#FFFFFF" },
              { day: "Thu", desc: "+4 Delta", count: "4 Blocks", bg: "#2563EB", color: "#FFFFFF" },
            ].map((col, idx) => (
              <div
                key={idx}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "16px",
                  background: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "12px", fontWeight: 800, color: THEME.colors.charcoalMuted }}>{col.day}</div>
                <div style={{ padding: "6px", margin: "6px 0", borderRadius: "8px", background: col.bg, color: col.color, fontSize: "12px", fontWeight: 900 }}>
                  {col.count}
                </div>
                <div style={{ fontSize: "11px", color: THEME.colors.charcoalMuted }}>{col.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Differential Panel (Orange Theme) */}
        <div
          style={{
            width: "100%",
            maxWidth: 880,
            padding: "26px 32px",
            borderRadius: "28px",
            background: "#FFFFFF",
            border: `2px solid ${THEME.colors.orange}`,
            boxShadow: "0 25px 60px -10px rgba(244, 91, 22, 0.16)",
            transform: `translateY(${(1 - diffSpring) * 35}px) scale(${0.95 + diffSpring * 0.05})`,
            opacity: diffSpring,
            position: "relative",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "28px" }}>📊</span>
              <div>
                <span style={{ fontSize: "20px", fontWeight: 900, color: THEME.colors.orange }}>
                  DIFFERENTIAL BACKUP
                </span>
                <div style={{ fontSize: "12px", color: THEME.colors.charcoalMuted, fontWeight: 600 }}>
                  All cumulative changes since the last FULL backup
                </div>
              </div>
            </div>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 800,
                background: "#FFF7ED",
                color: THEME.colors.orange,
                padding: "6px 14px",
                borderRadius: "9999px",
                border: `1px solid ${THEME.colors.orange}40`,
              }}
            >
              Growing Daily Size
            </span>
          </div>

          {/* Visual Block Representation Showing Growth Curve */}
          <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
            {[
              { day: "Mon", desc: "Full Image", count: "10 Blocks", bg: "#FDBA74", color: "#7C2D12" },
              { day: "Tue", desc: "+3 Delta", count: "3 Blocks", bg: "#FB923C", color: "#7C2D12" },
              { day: "Wed", desc: "+5 Cumul", count: "5 Blocks", bg: "#F97316", color: "#FFFFFF" },
              { day: "Thu", desc: "+9 Cumul", count: "9 Blocks", bg: "#EA580C", color: "#FFFFFF" },
            ].map((col, idx) => (
              <div
                key={idx}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "16px",
                  background: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "12px", fontWeight: 800, color: THEME.colors.charcoalMuted }}>{col.day}</div>
                <div style={{ padding: "6px", margin: "6px 0", borderRadius: "8px", background: col.bg, color: col.color, fontSize: "12px", fontWeight: 900 }}>
                  {col.count}
                </div>
                <div style={{ fontSize: "11px", color: THEME.colors.charcoalMuted }}>{col.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Bottom Formula Card */}
        <div
          style={{
            width: "100%",
            maxWidth: 880,
            padding: "16px 28px",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(12px)",
            borderRadius: "22px",
            boxShadow: THEME.shadows.card,
            border: `1.5px solid ${THEME.colors.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "20px" }}>🔵</span>
            <span style={{ fontSize: "14px", fontWeight: 800, color: THEME.colors.blue }}>
              Incremental = Minimum Storage Per Run
            </span>
          </div>
          <div style={{ height: 24, width: 1, background: "#CBD5E1" }} />
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "20px" }}>🟠</span>
            <span style={{ fontSize: "14px", fontWeight: 800, color: THEME.colors.orange }}>
              Differential = 2-Step Restore Chain
            </span>
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
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: THEME.colors.orange }} />
          <span style={{ fontSize: "12px", fontWeight: 800, color: THEME.colors.charcoalMuted, letterSpacing: "0.06em" }}>
            AUDIO SPOKEN TRANSCRIPT
          </span>
        </div>
        <KineticSubtitleEngine sceneId="scene3" fontSize={42} layout="vertical" />
      </div>
    </div>
  );
};
