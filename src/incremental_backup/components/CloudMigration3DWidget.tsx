import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { THEME } from "../theme";

interface CloudMigrationProps {
  delay?: number;
  style?: React.CSSProperties;
}

export const CloudMigration3DWidget: React.FC<CloudMigrationProps> = ({
  delay = 0,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: THEME.springs.gentle,
  });

  const float = Math.sin((frame + delay * 5) * 0.05) * 6;
  const cycle = (frame % 60) / 60;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "30px",
        perspective: "1200px",
        transform: `translateY(${float}px) scale(${entrance})`,
        opacity: entrance,
        ...style,
      }}
    >
      {/* Old Legacy Server 2008 Tower */}
      <div
        style={{
          width: 200,
          padding: "24px 18px",
          borderRadius: "24px",
          background: "#FFFFFF",
          border: `1.5px solid rgba(239, 68, 68, 0.3)`,
          boxShadow: "0 25px 60px -10px rgba(239, 68, 68, 0.15)",
          textAlign: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -12,
            right: 12,
            background: THEME.colors.red,
            color: "#FFF",
            fontSize: "10px",
            fontWeight: 900,
            padding: "3px 8px",
            borderRadius: "9999px",
            letterSpacing: "0.06em",
          }}
        >
          EOL 2020
        </div>
        <div style={{ fontSize: "48px", marginBottom: "8px" }}>🖥️</div>
        <div style={{ fontSize: "16px", fontWeight: 800, color: THEME.colors.charcoal }}>
          Windows Server 2008
        </div>
        <div style={{ fontSize: "12px", color: THEME.colors.red, fontWeight: 700, marginTop: "4px" }}>
          End of Support
        </div>
      </div>

      {/* Migration Particle Beam */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
        <span style={{ fontSize: "12px", fontWeight: 800, color: THEME.colors.orange, letterSpacing: "0.08em" }}>
          MIGRATION PATH
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          {[0, 1, 2, 3, 4].map((i) => {
            const op = (cycle + i * 0.2) % 1;
            return (
              <div
                key={i}
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: THEME.colors.orange,
                  transform: `scale(${0.7 + op * 0.6})`,
                  opacity: 0.3 + op * 0.7,
                  boxShadow: `0 0 10px ${THEME.colors.orange}`,
                }}
              />
            );
          })}
          <span style={{ color: THEME.colors.orange, fontWeight: 900, fontSize: "24px" }}>→</span>
        </div>
      </div>

      {/* Modern Cloud / Server 2025 Target */}
      <div
        style={{
          width: 220,
          padding: "24px 18px",
          borderRadius: "24px",
          background: "#FFFFFF",
          border: `1.5px solid ${THEME.colors.green}`,
          boxShadow: "0 25px 60px -10px rgba(16, 185, 129, 0.2)",
          textAlign: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -12,
            right: 12,
            background: THEME.colors.green,
            color: "#FFF",
            fontSize: "10px",
            fontWeight: 900,
            padding: "3px 8px",
            borderRadius: "9999px",
            letterSpacing: "0.06em",
          }}
        >
          SECURE
        </div>
        <div style={{ fontSize: "48px", marginBottom: "8px" }}>☁️</div>
        <div style={{ fontSize: "16px", fontWeight: 800, color: THEME.colors.charcoal }}>
          Azure & Server 2025
        </div>
        <div style={{ fontSize: "12px", color: THEME.colors.green, fontWeight: 700, marginTop: "4px" }}>
          Fully Patched & Protected
        </div>
      </div>
    </div>
  );
};
