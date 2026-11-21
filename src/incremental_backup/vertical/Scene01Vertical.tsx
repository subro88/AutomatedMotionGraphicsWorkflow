import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, Audio, staticFile } from "remotion";
import { THEME } from "../theme";
import { KineticSubtitleEngine } from "../components/KineticSubtitleEngine";
import { CurvedSpline } from "../components/CurvedSpline";
import {
  ServerRackCard,
  HardDrivePlatterCard,
  ComponentSvgIcon,
} from "../components/VectorComponents";

export const Scene01Vertical: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ---------------------------------------------------------
  // PHASE CHOREOGRAPHY (Continuous Spatial Canvas)
  // Phase 1 (f: 0-220): Business Server Intro (Center Stage)
  // Phase 2 (f: 220-440): Daily File Growth Burst (Floating Cards)
  // Phase 3 (f: 440-730): Full Backup Burden Warning (Pulsing Bottleneck)
  // Phase 4 (f: 730-914): Dedicated Disk Enters + Progressive Spline Draw
  // ---------------------------------------------------------

  // --- Phase 1: Server Entrance ---
  const serverEntrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 85 },
  });

  // --- Phase 2: File Growth Burst Cards ---
  const badge1Spring = spring({
    frame: frame - 235,
    fps,
    config: { damping: 12, stiffness: 100 },
  });
  const badge2Spring = spring({
    frame: frame - 280,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  // --- Phase 3: Burden / Warning Pulse ---
  const burdenAlertSpring = spring({
    frame: frame - 450,
    fps,
    config: { damping: 13, stiffness: 95 },
  });
  const burdenGlowPulse = frame >= 440 && frame < 730
    ? 0.5 + 0.5 * Math.sin((frame - 440) * 0.15)
    : 0;

  // --- Phase 4: Spatial Morph ---
  // Server shifts from Center (0, 0) -> Up-Left (-200, -180) and scales to 0.86
  const morphProgress = interpolate(frame, [725, 785], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const serverX = interpolate(morphProgress, [0, 1], [0, -200]);
  const serverY = interpolate(morphProgress, [0, 1], [0, -180]);
  const serverScale = interpolate(morphProgress, [0, 1], [1.0, 0.86]);

  // Dedicated Disk Entrance from bottom-right
  const diskSpring = spring({
    frame: frame - 735,
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  // Spline Drawing Progress (f: 760 -> 810)
  const splineDrawProgress = interpolate(frame, [760, 810], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Sync Loop Badge Entrance
  const syncBadgeSpring = spring({
    frame: frame - 795,
    fps,
    config: { damping: 12, stiffness: 120 },
  });

  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        background: THEME.colors.cream,
        backgroundImage: "radial-gradient(rgba(41, 37, 36, 0.08) 1.2px, transparent 1.2px)",
        backgroundSize: "28px 28px",
        padding: "80px 70px 70px 70px",
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
        fontFamily: THEME.typography.fontFamily,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Audio src={staticFile("incremental_backup/scene1.wav")} />

      {/* Top Category Badge */}
      <div
        style={{
          padding: "10px 28px",
          borderRadius: "9999px",
          background: THEME.colors.orange,
          color: "#FFFFFF",
          fontSize: "15px",
          fontWeight: 800,
          letterSpacing: "0.1em",
          boxShadow: "0 8px 24px rgba(244, 91, 22, 0.32)",
          transform: `scale(${serverEntrance})`,
        }}
      >
        WINDOWS SERVER 2008 R2 • OVERVIEW
      </div>

      {/* Top Dynamic Kinetic Subtitle Phrase */}
      <div
        style={{
          marginTop: "16px",
          minHeight: "150px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <KineticSubtitleEngine sceneId="scene1" fontSize={54} layout="vertical" />
      </div>

      {/* Central Spatial Stage (940px wide, 1100px height) */}
      <div
        style={{
          width: 940,
          height: 1100,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Phase 4: Dynamic Progressive Spline connecting Server right edge to Disk top edge */}
        {frame >= 745 && (
          <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 30 }}>
            <CurvedSpline
              x1={420}
              y1={320}
              x2={670}
              y2={570}
              curvature={-50}
              color={THEME.colors.blue}
              lineWidth={6}
              frame={frame}
              drawProgress={splineDrawProgress}
            />
          </div>
        )}

        {/* Phase 4: Continuous Sync Loop Badge at Spline Arc */}
        {frame >= 785 && (
          <div
            style={{
              position: "absolute",
              left: 545,
              top: 420,
              transform: `translate(-50%, -50%) scale(${syncBadgeSpring})`,
              background: "#FFFFFF",
              border: `2px solid ${THEME.colors.blue}`,
              borderRadius: "9999px",
              padding: "10px 22px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              boxShadow: "0 8px 24px rgba(2, 132, 199, 0.28)",
              zIndex: 35,
            }}
          >
            <div style={{ transform: `rotate(${frame * 4}deg)` }}>
              <ComponentSvgIcon name="sync_arrows" size={26} />
            </div>
            <span style={{ fontSize: "15px", fontWeight: 800, color: THEME.colors.blue }}>
              Continuous Sync Loop
            </span>
          </div>
        )}

        {/* Primary Server Rack (Morphs position in Phase 4) */}
        <div
          style={{
            position: "absolute",
            left: 240,
            top: 290,
            transform: `translate(${serverX}px, ${serverY}px) scale(${serverScale * serverEntrance})`,
            zIndex: 20,
            transition: "box-shadow 0.3s ease",
            boxShadow:
              burdenGlowPulse > 0
                ? `0 0 ${burdenGlowPulse * 45}px rgba(239, 68, 68, ${0.45 * burdenGlowPulse})`
                : "none",
            borderRadius: "28px",
          }}
        >
          <ServerRackCard frame={frame} label="Primary Host Server" width={460} height={520} />

          {/* Phase 3 Warning Banner over Server */}
          {frame >= 440 && frame < 730 && (
            <div
              style={{
                position: "absolute",
                top: -30,
                left: "50%",
                transform: `translateX(-50%) scale(${burdenAlertSpring})`,
                background: "#FEF2F2",
                border: "2.5px solid #EF4444",
                borderRadius: "16px",
                padding: "10px 22px",
                boxShadow: "0 10px 28px rgba(239, 68, 68, 0.35)",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                whiteSpace: "nowrap",
                zIndex: 35,
              }}
            >
              <span style={{ fontSize: "20px" }}>⚠️</span>
              <div>
                <div style={{ fontSize: "15px", fontWeight: 900, color: "#DC2626" }}>
                  FULL BACKUP BOTTLENECK
                </div>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#7F1D1D" }}>
                  8+ Hours Duration • Severe Network Congestion
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Phase 2: Floating File Growth Badges */}
        {frame >= 220 && frame < 725 && (
          <>
            {/* Left Badge: +5,400 New Documents */}
            <div
              style={{
                position: "absolute",
                left: 10,
                top: 250,
                transform: `scale(${badge1Spring})`,
                opacity: badge1Spring,
                background: "#FFFFFF",
                border: `2px solid ${THEME.colors.blue}`,
                borderRadius: "20px",
                padding: "14px 22px",
                boxShadow: THEME.shadows.cardElevated,
                display: "flex",
                alignItems: "center",
                gap: "14px",
                zIndex: 25,
              }}
            >
              <ComponentSvgIcon name="workstation" size={38} />
              <div>
                <div style={{ fontSize: "16px", fontWeight: 800, color: THEME.colors.charcoal }}>
                  +5,400 New Documents
                </div>
                <div style={{ fontSize: "12px", color: THEME.colors.charcoalMuted, fontWeight: 600 }}>
                  Active daily corporate files
                </div>
              </div>
            </div>

            {/* Right Badge: Database Delta */}
            <div
              style={{
                position: "absolute",
                right: 10,
                top: 540,
                transform: `scale(${badge2Spring})`,
                opacity: badge2Spring,
                background: "#FFFFFF",
                border: `2px solid ${THEME.colors.orange}`,
                borderRadius: "20px",
                padding: "14px 22px",
                boxShadow: THEME.shadows.cardElevated,
                display: "flex",
                alignItems: "center",
                gap: "14px",
                zIndex: 25,
              }}
            >
              <ComponentSvgIcon name="gears" size={38} />
              <div>
                <div style={{ fontSize: "16px", fontWeight: 800, color: THEME.colors.charcoal }}>
                  Database Growth
                </div>
                <div style={{ fontSize: "12px", color: THEME.colors.orange, fontWeight: 700 }}>
                  +18 GB Daily Changed Records
                </div>
              </div>
            </div>
          </>
        )}

        {/* Phase 4: Dedicated Backup Disk Card (Bottom-Right) */}
        {frame >= 730 && (
          <div
            style={{
              position: "absolute",
              right: 10,
              bottom: 60,
              transform: `scale(${diskSpring * 0.88})`,
              opacity: diskSpring,
              zIndex: 20,
            }}
          >
            <HardDrivePlatterCard label="Dedicated Backup Disk" width={440} height={480} frame={frame} />
          </div>
        )}
      </div>

      {/* Bottom Status Card (Always visible, adapts to phase) */}
      <div
        style={{
          width: 940,
          background: "#FFFFFF",
          padding: "18px 32px",
          borderRadius: "24px",
          boxShadow: THEME.shadows.card,
          border: `1px solid ${THEME.colors.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <span style={{ fontSize: "20px" }}>⚡</span>
          <div>
            <div style={{ fontSize: "17px", fontWeight: 800, color: THEME.colors.charcoal }}>
              {frame < 730
                ? "Windows Server 2008 R2 Workload"
                : "VSS Block-Level Delta Tracking Active"}
            </div>
            <div style={{ fontSize: "13px", color: THEME.colors.charcoalMuted, fontWeight: 600 }}>
              {frame < 730
                ? "Active transactional workloads generating continuous daily deltas"
                : "Captures changed clusters without duplicating full volume"}
            </div>
          </div>
        </div>

        <div
          style={{
            padding: "6px 16px",
            borderRadius: "9999px",
            background: frame < 440 ? "#ECFDF5" : frame < 730 ? "#FEF2F2" : "#EFF6FF",
            color: frame < 440 ? THEME.colors.green : frame < 730 ? "#DC2626" : THEME.colors.blue,
            fontSize: "13px",
            fontWeight: 800,
            letterSpacing: "0.06em",
            border: `1px solid ${
              frame < 440 ? THEME.colors.green : frame < 730 ? "#DC2626" : THEME.colors.blue
            }35`,
          }}
        >
          {frame < 440 ? "ONLINE" : frame < 730 ? "BURDEN" : "OPTIMIZED"}
        </div>
      </div>

      {/* Subtle brand watermark */}
      <div
        style={{
          fontSize: "16px",
          fontWeight: 700,
          color: THEME.colors.charcoalLight,
          letterSpacing: "0.08em",
        }}
      >
        tech-tutorial-series.io
      </div>
    </div>
  );
};
