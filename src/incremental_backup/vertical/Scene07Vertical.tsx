import React from "react";
import { useCurrentFrame, Audio, staticFile } from "remotion";
import { THEME } from "../theme";
import { KineticSubtitleEngine } from "../components/KineticSubtitleEngine";
import { CurvedSpline } from "../components/CurvedSpline";
import {
  ElevatedCard,
  InteractiveScreenshotCard,
  ComponentSvgIcon,
} from "../components/VectorComponents";

export const Scene07Vertical: React.FC = () => {
  const frame = useCurrentFrame();

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
      <Audio src={staticFile("incremental_backup/scene7.wav")} />

      {/* Top Category Badge */}
      <div
        style={{
          padding: "10px 28px",
          borderRadius: "9999px",
          background: THEME.colors.red,
          color: "#FFFFFF",
          fontSize: "15px",
          fontWeight: 800,
          letterSpacing: "0.1em",
          boxShadow: `0 8px 24px ${THEME.colors.red}35`,
        }}
      >
        DISK SELECTION • FORMATTING WARNING
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
        <KineticSubtitleEngine sceneId="scene7" fontSize={54} layout="vertical" />
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
        {/* Destination Disk Screenshot (940px wide) */}
        <InteractiveScreenshotCard
          imageName="screen_2.jpg"
          title="Select Destination Disk"
          width={940}
          height={680}
          zoom={1.18}
          cursorX={460}
          cursorY={380}
          isClicking={frame > 40 && frame < 80}
          spotlightRect={{ x: 120, y: 190, w: 700, h: 140 }}
        />

        {/* Security / Explorer Warning Callout (940px wide) */}
        <ElevatedCard
          width={940}
          height={180}
          padding="24px 36px"
          style={{ background: "#FEF2F2", border: `2.5px solid ${THEME.colors.red}` }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <ComponentSvgIcon name="shield" size={60} />
              <div>
                <div style={{ fontSize: "22px", fontWeight: 800, color: THEME.colors.red }}>
                  Dedicated Disk Hidden from Windows Explorer
                </div>
                <div style={{ fontSize: "15px", color: "#991B1B", fontWeight: 600, marginTop: "4px" }}>
                  The disk is formatted for VSS delta storage and drive letter is unmounted to prevent tampering
                </div>
              </div>
            </div>
            <div
              style={{
                background: THEME.colors.red,
                color: "#FFFFFF",
                fontWeight: 800,
                fontSize: "15px",
                padding: "10px 20px",
                borderRadius: "9999px",
              }}
            >
              PROTECTED
            </div>
          </div>
        </ElevatedCard>
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
