import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { THEME } from "../theme";

interface ServerIllustrationProps {
  delay?: number;
  highlightBackup?: boolean;
}

export const ServerIllustration: React.FC<ServerIllustrationProps> = ({
  delay = 10,
  highlightBackup = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: THEME.springs.gentle,
  });

  const pulse = (Math.sin(frame * 0.1) + 1) * 0.5;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "40px",
        opacity: entrance,
        transform: `scale(${0.9 + entrance * 0.1})`,
        position: "relative",
      }}
    >
      {/* 1. MAIN SERVER TOWER */}
      <div
        style={{
          width: 220,
          height: 310,
          background: "linear-gradient(180deg, #FFFFFF 0%, #F5F3EF 100%)",
          borderRadius: "24px",
          border: `1.5px solid ${THEME.colors.border}`,
          boxShadow: THEME.shadows.card,
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          position: "relative",
        }}
      >
        {/* Server Top Header / Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: `1px solid ${THEME.colors.border}`,
            paddingBottom: "10px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: THEME.colors.green,
                boxShadow: `0 0 8px ${THEME.colors.green}`,
              }}
            />
            <span style={{ fontSize: "11px", fontWeight: 700, color: THEME.colors.charcoal }}>
              SERVER 2008 R2
            </span>
          </div>
          <span style={{ fontSize: "10px", color: THEME.colors.charcoalLight, fontWeight: 600 }}>
            HOST-01
          </span>
        </div>

        {/* 3 Hot-Swap Drive Bays */}
        {[0, 1, 2].map((idx) => (
          <div
            key={idx}
            style={{
              height: 48,
              background: "#FFFFFF",
              borderRadius: "12px",
              border: `1px solid ${THEME.colors.border}`,
              padding: "0 12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "inset 0 1px 2px rgba(0,0,0,0.03)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: 6,
                  height: 24,
                  borderRadius: "3px",
                  background: idx === 0 ? THEME.colors.blue : THEME.colors.charcoalLight,
                }}
              />
              <span style={{ fontSize: "11px", fontWeight: 600, color: THEME.colors.charcoal }}>
                SAS BAY #{idx + 1}
              </span>
            </div>
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: idx === 0 ? THEME.colors.blue : THEME.colors.green,
                opacity: 0.4 + pulse * 0.6,
              }}
            />
          </div>
        ))}

        {/* Ventilation Grille & USB Bus */}
        <div
          style={{
            marginTop: "auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", gap: "4px" }}>
            {[1, 2, 3, 4, 5, 6].map((g) => (
              <div
                key={g}
                style={{
                  width: 3,
                  height: 16,
                  background: THEME.colors.border,
                  borderRadius: "2px",
                }}
              />
            ))}
          </div>
          <div
            style={{
              padding: "4px 8px",
              borderRadius: "6px",
              background: THEME.colors.blueLight,
              color: THEME.colors.blue,
              fontSize: "10px",
              fontWeight: 700,
            }}
          >
            BUS ACTIVE
          </div>
        </div>
      </div>

      {/* 2. CONNECTING DATA BRIDGE / CABLE */}
      <div
        style={{
          width: 60,
          height: 4,
          background: THEME.colors.border,
          position: "relative",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: THEME.colors.blue,
            boxShadow: `0 0 12px ${THEME.colors.blue}`,
            left: `${(frame * 2.5) % 60}px`,
          }}
        />
      </div>

      {/* 3. DEDICATED BACKUP HARD DRIVE */}
      <div
        style={{
          width: 170,
          height: 220,
          background: "linear-gradient(180deg, #FFFFFF 0%, #FAFAF9 100%)",
          borderRadius: "22px",
          border: highlightBackup
            ? `2px solid ${THEME.colors.green}`
            : `1.5px solid ${THEME.colors.border}`,
          boxShadow: highlightBackup
            ? "0 20px 45px -10px rgba(16, 185, 129, 0.25)"
            : THEME.shadows.card,
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          position: "relative",
        }}
      >
        {/* Drive Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: `1px solid ${THEME.colors.border}`,
            paddingBottom: "8px",
          }}
        >
          <span style={{ fontSize: "11px", fontWeight: 700, color: THEME.colors.charcoal }}>
            BACKUP DRIVE (E:)
          </span>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: THEME.colors.green,
              boxShadow: `0 0 6px ${THEME.colors.green}`,
            }}
          />
        </div>

        {/* Disk Platter Graphic */}
        <div
          style={{
            width: "100%",
            height: 90,
            borderRadius: "14px",
            background: "radial-gradient(circle at 50% 50%, #F5F3EF 0%, #E7E5E4 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Concentric Platter Rings */}
          <div
            style={{
              width: 65,
              height: 65,
              borderRadius: "50%",
              border: `2px dashed ${THEME.colors.blue}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `rotate(${frame * 1.5}deg)`,
            }}
          >
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: THEME.colors.white,
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              }}
            />
          </div>
        </div>

        {/* Capacity Indicator Bar */}
        <div style={{ marginTop: "auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "10px",
              color: THEME.colors.charcoalMuted,
              fontWeight: 600,
              marginBottom: "4px",
            }}
          >
            <span>DEDICATED DISK</span>
            <span style={{ color: THEME.colors.green, fontWeight: 700 }}>INCREMENTAL</span>
          </div>
          <div
            style={{
              width: "100%",
              height: 6,
              borderRadius: "3px",
              background: THEME.colors.border,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: "42%",
                height: "100%",
                background: THEME.colors.green,
                borderRadius: "3px",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
