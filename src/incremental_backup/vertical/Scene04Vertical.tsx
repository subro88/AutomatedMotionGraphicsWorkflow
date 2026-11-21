import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, Audio, staticFile } from "remotion";
import { THEME } from "../theme";
import { KineticSubtitleEngine } from "../components/KineticSubtitleEngine";
import {
  InteractiveScreenshotCard,
  ComponentSvgIcon,
} from "../components/VectorComponents";

export const Scene04Vertical: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ---------------------------------------------------------
  // PHASE CHOREOGRAPHY (Windows Server Backup Installation)
  // Phase 1: 0 - 221   Problem Question & Server Intro
  // Phase 2: 221 - 432 Server Manager Dialog & Prerequisite Check
  // Phase 3: 432 - 643 Cursor Action: Add Features & Install WSB
  // Phase 4: 643 - 780 Installation Success & Administrative Launch
  // ---------------------------------------------------------

  // Phase 1 Entrance
  const introSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 85 },
  });

  // Phase 2: Screenshot Window Entrance & Camera Zoom
  const windowSpring = spring({
    frame: frame - 180,
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  // Dynamic Camera Zoom towards Features node
  const targetZoom = interpolate(frame, [220, 320], [1.18, 1.48], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Mouse Cursor Movement & Click
  const cursorOpacity = interpolate(frame, [380, 410], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cursorProgress = interpolate(frame, [410, 480], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cursorX = 720 + (320 - 720) * Math.sin((cursorProgress * Math.PI) / 2);
  const cursorY = 560 + (310 - 560) * Math.sin((cursorProgress * Math.PI) / 2);

  // Click animation triggers at frame 485-505
  const isClicking = frame >= 485 && frame <= 505;
  const clickRippleProgress = frame >= 485 && frame <= 520 ? (frame - 485) / 35 : 0;

  // Spotlight Box around "Add Features" / "Windows Server Backup"
  const spotlightOpacity = frame >= 495
    ? interpolate(frame, [495, 520], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;

  // Installation Progress (fills from frame 530 to 640)
  const installProgress = interpolate(frame, [530, 630], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const isInstalled = frame >= 630;

  // Phase 4 Success Pill Entrance
  const successSpring = spring({
    frame: frame - 643,
    fps,
    config: { damping: 13, stiffness: 100 },
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
      <Audio src={staticFile("incremental_backup/scene4.wav")} />

      {/* Top Category Badge */}
      <div
        style={{
          padding: "10px 28px",
          borderRadius: "9999px",
          background: THEME.colors.blue,
          color: "#FFFFFF",
          fontSize: "15px",
          fontWeight: 800,
          letterSpacing: "0.1em",
          boxShadow: "0 8px 24px rgba(2, 132, 199, 0.32)",
          transform: `scale(${introSpring})`,
        }}
      >
        FEATURE SETUP • SERVER MANAGER
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
        <KineticSubtitleEngine sceneId="scene4" fontSize={54} layout="vertical" />
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
          transform: `scale(${windowSpring})`,
          opacity: windowSpring,
        }}
      >
        <InteractiveScreenshotCard
          imageName="screen_1.jpg"
          title="Server Manager • Initial Configuration"
          width={940}
          height={740}
          zoom={targetZoom}
          transformOrigin="35% 40%"
          cursorX={cursorX}
          cursorY={cursorY}
          cursorOpacity={cursorOpacity}
          isClicking={isClicking}
          clickRippleProgress={clickRippleProgress}
          spotlightRect={{ x: 180, y: 220, w: 580, h: 140 }}
          spotlightOpacity={spotlightOpacity}
        />

        {/* Phase 3 & 4: Progress Bar & Success Card */}
        {frame >= 510 && (
          <div
            style={{
              width: 940,
              background: "#FFFFFF",
              padding: "24px 34px",
              borderRadius: "28px",
              boxShadow: THEME.shadows.cardElevated,
              border: `2.5px solid ${isInstalled ? THEME.colors.green : THEME.colors.blue}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxSizing: "border-box",
              zIndex: 30,
              transform: `scale(${frame < 643 ? 1 : successSpring})`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "18px", flex: 1, marginRight: "24px" }}>
              <ComponentSvgIcon name={isInstalled ? "shield" : "gears"} size={48} />
              <div style={{ width: "100%" }}>
                <div style={{ fontSize: "20px", fontWeight: 800, color: THEME.colors.charcoal }}>
                  {isInstalled ? "Windows Server Backup Installed" : "Installing Server Backup Features..."}
                </div>
                {/* Visual Progress Bar */}
                <div
                  style={{
                    width: "100%",
                    height: 10,
                    background: "#E2E8F0",
                    borderRadius: "9999px",
                    overflow: "hidden",
                    marginTop: "10px",
                  }}
                >
                  <div
                    style={{
                      width: `${installProgress}%`,
                      height: "100%",
                      background: isInstalled ? THEME.colors.green : THEME.colors.blue,
                      transition: "width 0.1s linear",
                    }}
                  />
                </div>
              </div>
            </div>

            <div
              style={{
                background: isInstalled ? "#ECFDF5" : THEME.colors.blueLight,
                color: isInstalled ? THEME.colors.green : THEME.colors.blue,
                fontWeight: 800,
                fontSize: "14px",
                padding: "8px 18px",
                borderRadius: "9999px",
                whiteSpace: "nowrap",
                border: `1.5px solid ${isInstalled ? THEME.colors.green : THEME.colors.blue}`,
              }}
            >
              {isInstalled ? "✓ READY TO LAUNCH" : `${Math.round(installProgress)}%`}
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
          <span style={{ fontSize: "20px" }}>⚙️</span>
          <div>
            <div style={{ fontSize: "17px", fontWeight: 800, color: THEME.colors.charcoal }}>
              Administrative Feature Engine
            </div>
            <div style={{ fontSize: "13px", color: THEME.colors.charcoalMuted, fontWeight: 600 }}>
              Installs wbadmin.exe CLI and Windows Server Backup MMC snap-in
            </div>
          </div>
        </div>

        <div
          style={{
            padding: "6px 16px",
            borderRadius: "9999px",
            background: isInstalled ? "#ECFDF5" : THEME.colors.blueLight,
            color: isInstalled ? THEME.colors.green : THEME.colors.blue,
            fontSize: "13px",
            fontWeight: 800,
            letterSpacing: "0.06em",
          }}
        >
          {isInstalled ? "ENABLED" : "CONFIGURING"}
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
