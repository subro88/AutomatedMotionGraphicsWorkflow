import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { THEME } from "../theme";

interface AeroDialog3DProps {
  title?: string;
  width?: number;
  selectedOption?: "normal" | "faster" | "custom";
  delay?: number;
  style?: React.CSSProperties;
}

export const AeroDialog3DWidget: React.FC<AeroDialog3DProps> = ({
  title = "Optimize Backup Performance",
  width = 540,
  selectedOption = "faster",
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

  // Kinematic floating inertia
  const floatY = Math.sin((frame + delay * 8) * 0.045) * 6;
  const tiltX = Math.cos((frame + delay * 8) * 0.04) * 3;
  const tiltY = Math.sin((frame + delay * 8) * 0.035) * 4;

  // Animated cursor clicking
  const cursorSpring = spring({
    frame: Math.max(0, frame - delay - 30),
    fps,
    config: THEME.springs.bouncy,
  });

  const cursorX = 80 + cursorSpring * 120;
  const cursorY = 160 + cursorSpring * 38;

  return (
    <div
      style={{
        width,
        position: "relative",
        perspective: "1200px",
        transform: `translateY(${floatY + (1 - entrance) * 40}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${entrance})`,
        opacity: entrance,
        ...style,
      }}
    >
      {/* Deep Soft Drop Shadow */}
      <div
        style={{
          position: "absolute",
          width: "92%",
          height: "85%",
          left: "4%",
          bottom: "-20px",
          background: "rgba(41, 37, 36, 0.22)",
          borderRadius: "28px",
          filter: "blur(30px)",
          transform: "rotateX(55deg)",
          zIndex: 0,
        }}
      />

      {/* Aero Glass Window Container */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          borderRadius: "18px",
          background: "#FFFFFF",
          border: "1px solid rgba(255, 255, 255, 0.9)",
          boxShadow:
            "0 30px 70px -15px rgba(41, 37, 36, 0.2), 0 0 0 1px rgba(41, 37, 36, 0.08)",
          overflow: "hidden",
        }}
      >
        {/* Authentic Windows Server 2008 R2 Aero Glass Titlebar */}
        <div
          style={{
            height: 42,
            background: "linear-gradient(180deg, #B5D2EE 0%, #76A6D6 50%, #5E94CB 51%, #88B9E6 100%)",
            borderBottom: "1px solid #487299",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 14px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "16px" }}>⚙️</span>
            <span
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "#1E293B",
                textShadow: "0 1px 1px rgba(255, 255, 255, 0.8)",
              }}
            >
              {title}
            </span>
          </div>

          {/* Window Control Buttons */}
          <div style={{ display: "flex", gap: "4px" }}>
            <div style={{ width: 22, height: 18, background: "rgba(255, 255, 255, 0.4)", borderRadius: "3px" }} />
            <div style={{ width: 22, height: 18, background: "rgba(255, 255, 255, 0.4)", borderRadius: "3px" }} />
            <div
              style={{
                width: 28,
                height: 18,
                background: "linear-gradient(180deg, #E66 0%, #C33 100%)",
                borderRadius: "3px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFF",
                fontSize: "11px",
                fontWeight: 900,
              }}
            >
              ✕
            </div>
          </div>
        </div>

        {/* Dialog Body */}
        <div style={{ padding: "24px 26px", background: "#F8FAFC" }}>
          <div style={{ fontSize: "13px", color: THEME.colors.charcoal, fontWeight: 600, marginBottom: "16px" }}>
            Select how Windows Server Backup handles daily backup operations:
          </div>

          {/* 3 Radio Options */}
          {[
            {
              id: "normal",
              title: "Normal backup performance",
              desc: "Always perform a full backup. Takes longer and uses full network bandwidth.",
            },
            {
              id: "faster",
              title: "Faster backup performance (Recommended)",
              desc: "Perform incremental backups. Tracks changed blocks via VSS snapshot technology.",
            },
            {
              id: "custom",
              title: "Custom",
              desc: "Configure different backup performance settings for individual volumes.",
            },
          ].map((opt) => {
            const isSelected = selectedOption === opt.id;
            return (
              <div
                key={opt.id}
                style={{
                  padding: "12px 16px",
                  borderRadius: "12px",
                  background: isSelected ? "#EFF6FF" : "#FFFFFF",
                  border: isSelected ? `2px solid ${THEME.colors.orange}` : "1px solid #E2E8F0",
                  marginBottom: "10px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  transition: "all 0.2s ease",
                  boxShadow: isSelected ? "0 4px 14px rgba(244, 91, 22, 0.15)" : "none",
                }}
              >
                {/* Radio Button */}
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    border: `2px solid ${isSelected ? THEME.colors.orange : "#94A3B8"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: "2px",
                    flexShrink: 0,
                  }}
                >
                  {isSelected && (
                    <div style={{ width: 9, height: 9, borderRadius: "50%", background: THEME.colors.orange }} />
                  )}
                </div>

                <div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: isSelected ? 800 : 600,
                      color: isSelected ? THEME.colors.orange : THEME.colors.charcoal,
                    }}
                  >
                    {opt.title}
                  </div>
                  <div style={{ fontSize: "12px", color: THEME.colors.charcoalMuted, marginTop: "2px" }}>
                    {opt.desc}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Footer Action Buttons */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "18px" }}>
            <div
              style={{
                padding: "8px 24px",
                borderRadius: "8px",
                background: THEME.colors.orange,
                color: "#FFFFFF",
                fontSize: "13px",
                fontWeight: 800,
                boxShadow: "0 4px 12px rgba(244, 91, 22, 0.25)",
              }}
            >
              OK
            </div>
            <div
              style={{
                padding: "8px 18px",
                borderRadius: "8px",
                background: "#E2E8F0",
                color: THEME.colors.charcoal,
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              Cancel
            </div>
          </div>
        </div>
      </div>

      {/* Floating Animated Cursor Indicator */}
      <div
        style={{
          position: "absolute",
          left: cursorX,
          top: cursorY,
          pointerEvents: "none",
          zIndex: 10,
          filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.3))",
          transform: `scale(${0.9 + (Math.sin(frame * 0.2) > 0.8 ? 0.2 : 0)})`,
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M5.5 3.2L18.5 13.8L12.2 14.5L15.8 21.2L12.8 22.8L9.2 16.1L5.5 19.8V3.2Z"
            fill="#FFFFFF"
            stroke="#1E293B"
            strokeWidth="1.5"
          />
        </svg>
      </div>
    </div>
  );
};
