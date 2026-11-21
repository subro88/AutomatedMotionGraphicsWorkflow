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

export const Scene06Vertical: React.FC = () => {
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
        }}
      >
        BACKUP WIZARD • DEDICATED STORAGE
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
        <KineticSubtitleEngine sceneId="scene6" fontSize={54} layout="vertical" />
      </div>

      {/* Central Visual Stage: IMMERSIVE (1040px height, 940px width) */}
      <div
        style={{
          width: 940,
          height: 1040,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          gap: "30px",
        }}
      >
        {/* Curved Spline connecting Wizard card to dedicated disk */}
        <CurvedSpline x1={470} y1={600} x2={470} y2={820} curvature={0} color={THEME.colors.orange} lineWidth={5} frame={frame} />

        {/* Schedule Wizard Screenshot Card (940px wide) */}
        <InteractiveScreenshotCard
          imageName="screen_1.jpg"
          title="Backup Schedule Wizard"
          width={940}
          height={620}
          zoom={1.12}
          cursorX={570}
          cursorY={520}
          isClicking={false}
          spotlightRect={{ x: 280, y: 175, w: 580, h: 110 }}
        />

        {/* Dedicated Hard Disk Node Card (940px wide) */}
        <ElevatedCard width={940} height={160} padding="20px 36px" style={{ border: `3px solid ${THEME.colors.orange}` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <ComponentSvgIcon name="hard_drive" size={80} />
              <div>
                <div style={{ fontSize: "22px", fontWeight: 800, color: THEME.colors.charcoal }}>
                  Target Storage: w2k8r2f DISK_01
                </div>
                <div style={{ fontSize: "15px", color: THEME.colors.charcoalMuted, fontWeight: 600, marginTop: "4px" }}>
                  Dedicated physical drive • Formatted & hidden from Explorer for VSS protection
                </div>
              </div>
            </div>
            <div
              style={{
                background: THEME.colors.orangeLight,
                color: THEME.colors.orange,
                fontWeight: 800,
                fontSize: "16px",
                padding: "10px 20px",
                borderRadius: "9999px",
                border: `1px solid ${THEME.colors.orange}`,
              }}
            >
              DAILY: 9:00 PM
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
