import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, Audio, staticFile } from "remotion";
import { THEME } from "../theme";
import { KineticSubtitleEngine } from "../components/KineticSubtitleEngine";
import {
  InteractiveScreenshotCard,
  ComponentSvgIcon,
} from "../components/VectorComponents";

export const Scene05Vertical: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ---------------------------------------------------------
  // PHASE CHOREOGRAPHY (Continuous Spatial Canvas & Camera Zoom)
  // Phase 1: 0 - 148   Window Overview
  // Phase 2: 148 - 235 Macro Camera Zoom (1.25x -> 1.62x) into Options + Cursor Path
  // Phase 3: 235 - 317 Cursor Click + Spotlight Latch on "Faster backup performance"
  // Phase 4: 317 - 560 VSS Shield Engine & 64KB Block Tracking Callout
  // Phase 5: 560 - 691 Smooth pull-back to 1.25x to inspect Normal & Custom alternatives
  // Phase 6: 691 - 893 Volume Selection & Final Configuration Summary
  // ---------------------------------------------------------

  // --- Window Card Entrance Spring ---
  const windowEntrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  // --- Virtual Camera Zoom & Pan ---
  let targetZoom = 1.22;
  let targetOrigin = "center 38%";

  if (frame < 148) {
    targetZoom = 1.22;
    targetOrigin = "center 38%";
  } else if (frame >= 148 && frame < 560) {
    const zoomProgress = interpolate(frame, [148, 225], [1.22, 1.62], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    targetZoom = zoomProgress;
    targetOrigin = "28% 34%";
  } else if (frame >= 560 && frame < 691) {
    targetZoom = interpolate(frame, [560, 610], [1.62, 1.25], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    targetOrigin = "34% 40%";
  } else {
    targetZoom = interpolate(frame, [691, 740], [1.25, 1.20], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    targetOrigin = "center 40%";
  }

  // --- Animated Mouse Cursor Position & State ---
  const cursorOpacity = interpolate(frame, [155, 175], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cursorProgress = interpolate(frame, [170, 248], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Smooth Bezier-like curve for cursor path
  const cursorStartX = 720;
  const cursorStartY = 540;
  const cursorTargetX = 205;
  const cursorTargetY = 275;

  const cursorX = cursorStartX + (cursorTargetX - cursorStartX) * Math.sin((cursorProgress * Math.PI) / 2);
  const cursorY = cursorStartY + (cursorTargetY - cursorStartY) * Math.sin((cursorProgress * Math.PI) / 2);

  // Click animation triggers at frame 255-275
  const isClicking = frame >= 255 && frame <= 275;
  const clickRippleProgress = frame >= 255 && frame <= 285
    ? (frame - 255) / 30
    : 0;

  // Spotlight Box around "Faster backup performance"
  const spotlightOpacity = frame >= 268
    ? interpolate(frame, [268, 285], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }) * (frame > 560 ? interpolate(frame, [560, 595], [1, 0.2], { extrapolateRight: "clamp" }) : 1)
    : 0;

  // Phase 4: VSS Shield Callout Card Entrance
  const vssCardSpring = spring({
    frame: frame - 317,
    fps,
    config: { damping: 13, stiffness: 100 },
  });

  // Phase 6: Volume Checklist Pill Entrance
  const checklistSpring = spring({
    frame: frame - 691,
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
      <Audio src={staticFile("incremental_backup/scene5.wav")} />

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
          transform: `scale(${windowEntrance})`,
        }}
      >
        OPTIMIZE PERFORMANCE • SETTINGS
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
        <KineticSubtitleEngine sceneId="scene5" fontSize={54} layout="vertical" />
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
          transform: `scale(${windowEntrance})`,
          opacity: windowEntrance,
        }}
      >
        <InteractiveScreenshotCard
          imageName="screen_3.jpg"
          title="Optimize Backup Performance"
          width={940}
          height={760}
          zoom={targetZoom}
          transformOrigin={targetOrigin}
          cursorX={cursorX}
          cursorY={cursorY}
          cursorOpacity={cursorOpacity}
          isClicking={isClicking}
          clickRippleProgress={clickRippleProgress}
          spotlightRect={{ x: 130, y: 200, w: 680, h: 120 }}
          spotlightOpacity={spotlightOpacity}
        />

        {/* Phase 4 (f >= 317): VSS Engine Callout Card */}
        {frame >= 317 && frame < 691 && (
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
              transform: `translateY(${(1 - vssCardSpring) * 60}px) scale(${vssCardSpring})`,
              opacity: vssCardSpring,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
              <ComponentSvgIcon name="shield" size={48} />
              <div>
                <div style={{ fontSize: "21px", fontWeight: 800, color: THEME.colors.charcoal }}>
                  VSS Incremental Engine Active
                </div>
                <div style={{ fontSize: "14px", color: THEME.colors.charcoalMuted, fontWeight: 600, marginTop: "4px" }}>
                  Block-level change tracking • Only delta 64KB clusters written
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" }}>
              <div
                style={{
                  background: THEME.colors.orange,
                  color: "#FFFFFF",
                  fontWeight: 800,
                  fontSize: "14px",
                  padding: "6px 16px",
                  borderRadius: "9999px",
                  letterSpacing: "0.04em",
                }}
              >
                FAST INCREMENTAL
              </div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: THEME.colors.green }}>
                ⚡ 95% Network I/O Saved
              </div>
            </div>
          </div>
        )}

        {/* Phase 6 (f >= 691): Volume Configuration Card */}
        {frame >= 691 && (
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
              transform: `translateY(${(1 - checklistSpring) * 50}px) scale(${checklistSpring})`,
              opacity: checklistSpring,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
              <ComponentSvgIcon name="hard_drive" size={48} />
              <div>
                <div style={{ fontSize: "21px", fontWeight: 800, color: THEME.colors.charcoal }}>
                  Volumes & Destination Configured
                </div>
                <div style={{ fontSize: "14px", color: THEME.colors.charcoalMuted, fontWeight: 600, marginTop: "4px" }}>
                  Source: C: (OS) + D: (Data) • Target: Dedicated Backup Pool
                </div>
              </div>
            </div>

            <div
              style={{
                background: "#EFF6FF",
                color: THEME.colors.blue,
                fontWeight: 800,
                fontSize: "14px",
                padding: "8px 18px",
                borderRadius: "9999px",
                border: `1.5px solid ${THEME.colors.blue}`,
              }}
            >
              ✓ READY TO EXECUTE
            </div>
          </div>
        )}
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
