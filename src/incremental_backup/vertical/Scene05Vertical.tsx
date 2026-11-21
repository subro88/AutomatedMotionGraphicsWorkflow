import React from "react";
import { useCurrentFrame, Audio, staticFile } from "remotion";
import { THEME } from "../theme";
import { KineticSubtitleEngine } from "../components/KineticSubtitleEngine";
import {
  InteractiveScreenshotCard,
  ComponentSvgIcon,
} from "../components/VectorComponents";

export const Scene05Vertical: React.FC = () => {
  const frame = useCurrentFrame();

  // Mouse cursor moves and clicks at frame 35
  const isClicking = frame >= 30 && frame <= 75;
  const cursorX = Math.min(510, 300 + frame * 6);
  const cursorY = Math.min(360, 260 + frame * 3);

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
        }}
      >
        OPTIMIZE PERFORMANCE • SETTINGS
      </div>

      {/* Top Dynamic Kinetic Subtitle Phrase */}
      <div
        style={{
          marginTop: "20px",
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
          height: 1040,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          gap: "28px",
        }}
      >
        <InteractiveScreenshotCard
          imageName="screen_3.jpg"
          title="Optimize Backup Performance"
          width={940}
          height={740}
          zoom={1.22}
          cursorX={cursorX}
          cursorY={cursorY}
          isClicking={isClicking}
          spotlightRect={{ x: 100, y: 240, w: 740, h: 115 }}
        />

        {/* Feature Explainer Pill floating below (940px wide) */}
        <div
          style={{
            width: 940,
            background: "#FFFFFF",
            padding: "20px 36px",
            borderRadius: "28px",
            boxShadow: THEME.shadows.cardElevated,
            border: `2.5px solid ${THEME.colors.orange}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxSizing: "border-box",
            zIndex: 30,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <ComponentSvgIcon name="shield" size={42} />
            <div>
              <div style={{ fontSize: "19px", fontWeight: 800, color: THEME.colors.charcoal }}>
                VSS Incremental Engine Active
              </div>
              <div style={{ fontSize: "14px", color: THEME.colors.charcoalMuted, fontWeight: 600, marginTop: "2px" }}>
                Tracks block changes in real-time with Volume Shadow Copy Service
              </div>
            </div>
          </div>
          <div
            style={{
              background: THEME.colors.orange,
              color: "#FFFFFF",
              fontWeight: 800,
              fontSize: "15px",
              padding: "8px 18px",
              borderRadius: "9999px",
            }}
          >
            RECOMMENDED
          </div>
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
