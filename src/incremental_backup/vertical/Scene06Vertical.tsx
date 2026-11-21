import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, Audio, staticFile } from "remotion";
import { THEME } from "../theme";
import { KineticSubtitleEngine } from "../components/KineticSubtitleEngine";
import {
  InteractiveScreenshotCard,
  ComponentSvgIcon,
} from "../components/VectorComponents";

export const Scene06Vertical: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ---------------------------------------------------------
  // PHASE CHOREOGRAPHY (Backup Schedule Wizard & Automation)
  // Phase 1: 0 - 161   Action Panel & Wizard Launch
  // Phase 2: 161 - 380 Scope Selection: Full Server vs Custom
  // Phase 3: 380 - 557 Scheduling: Once a Day vs Multi-time
  // Phase 4: 557 - 790 Dedicated Disk Selection (DISK_01) & Finish
  // Phase 5: 790 - 1022 Scheduled Task Active & Baseline Confirmation
  // ---------------------------------------------------------

  // Phase 1 Entrance
  const introSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 85 },
  });

  // Dynamic Camera Zoom & Origin
  let targetZoom = 1.20;
  let targetOrigin = "center 38%";

  if (frame < 161) {
    targetZoom = 1.20;
    targetOrigin = "center 38%";
  } else if (frame >= 161 && frame < 557) {
    targetZoom = interpolate(frame, [161, 230], [1.20, 1.55], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    targetOrigin = "30% 36%";
  } else {
    targetZoom = interpolate(frame, [557, 610], [1.55, 1.22], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    targetOrigin = "center 40%";
  }

  // Cursor movements
  const cursorOpacity = interpolate(frame, [170, 195], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cursorProgress = interpolate(frame, [195, 260], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cursorX = 700 + (220 - 700) * Math.sin((cursorProgress * Math.PI) / 2);
  const cursorY = 540 + (280 - 540) * Math.sin((cursorProgress * Math.PI) / 2);

  const isClicking = frame >= 265 && frame <= 285;
  const clickRippleProgress = frame >= 265 && frame <= 295 ? (frame - 265) / 30 : 0;

  // Spotlight Box
  const spotlightOpacity = frame >= 275
    ? interpolate(frame, [275, 295], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) *
      (frame > 557 ? interpolate(frame, [557, 580], [1, 0.2], { extrapolateRight: "clamp" }) : 1)
    : 0;

  // Phase 3 & 4 Cards
  const scheduleCardSpring = spring({
    frame: frame - 380,
    fps,
    config: { damping: 13, stiffness: 100 },
  });

  const diskCardSpring = spring({
    frame: frame - 557,
    fps,
    config: { damping: 13, stiffness: 100 },
  });

  const activeTaskSpring = spring({
    frame: frame - 790,
    fps,
    config: { damping: 14, stiffness: 95 },
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
      <Audio src={staticFile("incremental_backup/scene6.wav")} />

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
          transform: `scale(${introSpring})`,
        }}
      >
        AUTOMATION • SCHEDULE BACKUP WIZARD
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
        <KineticSubtitleEngine sceneId="scene6" fontSize={54} layout="vertical" />
      </div>

      {/* Central Interactive Screenshot Stage: 940px Wide */}
      <div
        style={{
          width: 940,
          height: 1100,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          gap: "24px",
          transform: `scale(${introSpring})`,
        }}
      >
        <InteractiveScreenshotCard
          imageName="screen_2.jpg"
          title="Backup Schedule Wizard • Scope & Time"
          width={940}
          height={740}
          zoom={targetZoom}
          transformOrigin={targetOrigin}
          cursorX={cursorX}
          cursorY={cursorY}
          cursorOpacity={cursorOpacity}
          isClicking={isClicking}
          clickRippleProgress={clickRippleProgress}
          spotlightRect={{ x: 140, y: 210, w: 660, h: 120 }}
          spotlightOpacity={spotlightOpacity}
        />

        {/* Phase 3 (f: 380 - 557): Schedule Timing Card */}
        {frame >= 380 && frame < 557 && (
          <div
            style={{
              width: 940,
              background: "#FFFFFF",
              padding: "24px 34px",
              borderRadius: "28px",
              boxShadow: THEME.shadows.cardElevated,
              border: `2.5px solid ${THEME.colors.orange}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxSizing: "border-box",
              zIndex: 30,
              transform: `scale(${scheduleCardSpring})`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
              <ComponentSvgIcon name="gears" size={48} />
              <div>
                <div style={{ fontSize: "21px", fontWeight: 800, color: THEME.colors.charcoal }}>
                  Schedule Frequency: Daily Automated
                </div>
                <div style={{ fontSize: "14px", color: THEME.colors.charcoalMuted, fontWeight: 600, marginTop: "4px" }}>
                  Configured: Daily at 21:00 (Off-peak hours for minimum server load)
                </div>
              </div>
            </div>

            <div
              style={{
                background: THEME.colors.orangeLight,
                color: THEME.colors.orange,
                fontWeight: 800,
                fontSize: "14px",
                padding: "8px 18px",
                borderRadius: "9999px",
                border: `1.5px solid ${THEME.colors.orange}`,
              }}
            >
              21:00 DAILY
            </div>
          </div>
        )}

        {/* Phase 4 (f: 557 - 790): Dedicated Disk Target Card */}
        {frame >= 557 && frame < 790 && (
          <div
            style={{
              width: 940,
              background: "#FFFFFF",
              padding: "24px 34px",
              borderRadius: "28px",
              boxShadow: THEME.shadows.cardElevated,
              border: `2.5px solid ${THEME.colors.blue}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxSizing: "border-box",
              zIndex: 30,
              transform: `scale(${diskCardSpring})`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
              <ComponentSvgIcon name="hard_drive" size={48} />
              <div>
                <div style={{ fontSize: "21px", fontWeight: 800, color: THEME.colors.charcoal }}>
                  Dedicated Target: Backup Disk 01 (1.0 TB)
                </div>
                <div style={{ fontSize: "14px", color: THEME.colors.charcoalMuted, fontWeight: 600, marginTop: "4px" }}>
                  Volume formatted exclusively for Windows Server Backup VSS snapshots
                </div>
              </div>
            </div>

            <div
              style={{
                background: THEME.colors.blueLight,
                color: THEME.colors.blue,
                fontWeight: 800,
                fontSize: "14px",
                padding: "8px 18px",
                borderRadius: "9999px",
                border: `1.5px solid ${THEME.colors.blue}`,
              }}
            >
              DEDICATED DISK
            </div>
          </div>
        )}

        {/* Phase 5 (f >= 790): Task Configured Confirmation Card */}
        {frame >= 790 && (
          <div
            style={{
              width: 940,
              background: "#FFFFFF",
              padding: "24px 34px",
              borderRadius: "28px",
              boxShadow: THEME.shadows.cardElevated,
              border: `2.5px solid ${THEME.colors.green}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxSizing: "border-box",
              zIndex: 30,
              transform: `scale(${activeTaskSpring})`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
              <ComponentSvgIcon name="shield" size={48} />
              <div>
                <div style={{ fontSize: "21px", fontWeight: 800, color: THEME.colors.charcoal }}>
                  Scheduled Backup Task Active
                </div>
                <div style={{ fontSize: "14px", color: THEME.colors.charcoalMuted, fontWeight: 600, marginTop: "4px" }}>
                  First run establishes baseline • Subsequent runs capture 64KB block deltas
                </div>
              </div>
            </div>

            <div
              style={{
                background: "#ECFDF5",
                color: THEME.colors.green,
                fontWeight: 900,
                fontSize: "14px",
                padding: "8px 18px",
                borderRadius: "9999px",
                border: `1.5px solid ${THEME.colors.green}`,
              }}
            >
              ✓ AUTOMATION ACTIVE
            </div>
          </div>
        )}
      </div>

      {/* Bottom Status Card */}
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
          <span style={{ fontSize: "20px" }}>⏰</span>
          <div>
            <div style={{ fontSize: "17px", fontWeight: 800, color: THEME.colors.charcoal }}>
              Windows Task Scheduler Integration
            </div>
            <div style={{ fontSize: "13px", color: THEME.colors.charcoalMuted, fontWeight: 600 }}>
              Automatic execution via built-in SYSTEM background service
            </div>
          </div>
        </div>

        <div
          style={{
            padding: "6px 16px",
            borderRadius: "9999px",
            background: "#ECFDF5",
            color: THEME.colors.green,
            fontSize: "13px",
            fontWeight: 800,
            letterSpacing: "0.06em",
          }}
        >
          SCHEDULED
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
