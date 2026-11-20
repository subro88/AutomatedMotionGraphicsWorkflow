import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { THEME } from "../theme";

interface HardDrive3DProps {
  width?: number;
  height?: number;
  isWriting?: boolean;
  showSavedBadge?: boolean;
  style?: React.CSSProperties;
  delay?: number;
}

export const HardDrive3DWidget: React.FC<HardDrive3DProps> = ({
  width = 380,
  height = 440,
  isWriting = true,
  showSavedBadge = false,
  style = {},
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const entrance = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: THEME.springs.gentle,
  });

  // Kinematic floating physics inertia (subtle continuous 3D tilt)
  const floatY = Math.sin((frame + delay * 10) * 0.05) * 8;
  const tiltX = Math.cos((frame + delay * 10) * 0.04) * 4;
  const tiltY = Math.sin((frame + delay * 10) * 0.03) * 6;

  // Platter rotation angle (3000 RPM simulation)
  const platterAngle = (frame * 18) % 360;

  // Actuator arm sweep across tracks
  const armAngle = isWriting ? 18 + Math.sin(frame * 0.15) * 14 : 12;

  // Flashing activity LED
  const ledBlink = isWriting ? (Math.sin(frame * 0.4) > 0 ? 1 : 0.25) : 0.8;

  return (
    <div
      style={{
        width,
        height,
        position: "relative",
        perspective: "1200px",
        transform: `translateY(${floatY + (1 - entrance) * 50}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${entrance})`,
        opacity: entrance,
        transition: "transform 0.05s linear",
        ...style,
      }}
    >
      {/* Heavy 3D Ambient Drop Shadow (Matches Reference Video Elevated Card Feel) */}
      <div
        style={{
          position: "absolute",
          width: "88%",
          height: "82%",
          left: "6%",
          bottom: "-25px",
          background: "rgba(41, 37, 36, 0.28)",
          borderRadius: "32px",
          filter: "blur(34px)",
          transform: "rotateX(60deg) scale(0.95)",
          zIndex: 0,
        }}
      />

      {/* CNC Aluminum Hard Drive Chassis */}
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "28px",
          background: "linear-gradient(145deg, #F8FAFC 0%, #E2E8F0 100%)",
          border: "1.5px solid rgba(255, 255, 255, 0.8)",
          boxShadow:
            "0 25px 60px -12px rgba(41, 37, 36, 0.16), inset 0 2px 4px rgba(255, 255, 255, 0.9), inset 0 -2px 4px rgba(0, 0, 0, 0.06)",
          padding: "24px",
          boxSizing: "border-box",
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Top Header Bar / Brand Label */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: THEME.colors.green,
                opacity: ledBlink,
                boxShadow: `0 0 10px ${THEME.colors.green}`,
              }}
            />
            <span style={{ fontSize: "11px", fontWeight: 800, color: THEME.colors.charcoalMuted, letterSpacing: "0.08em" }}>
              ENTERPRISE SAS HDD 15K
            </span>
          </div>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 800,
              color: THEME.colors.orange,
              background: THEME.colors.orangeLight,
              padding: "2px 8px",
              borderRadius: "6px",
            }}
          >
            VSS TARGET
          </span>
        </div>

        {/* Circular Platter Well & Mechanical Internals */}
        <div
          style={{
            flex: 1,
            position: "relative",
            borderRadius: "20px",
            background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
            boxShadow: "inset 0 4px 12px rgba(0, 0, 0, 0.4)",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Spinning Mirror-Polished Platter */}
          <div
            style={{
              width: 220,
              height: 220,
              borderRadius: "50%",
              background: `conic-gradient(from ${platterAngle}deg, #94A3B8, #E2E8F0, #64748B, #CBD5E1, #94A3B8)`,
              boxShadow: "0 0 25px rgba(0, 0, 0, 0.5), inset 0 0 15px rgba(255, 255, 255, 0.3)",
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Concentric Track Grooves */}
            <div
              style={{
                width: 170,
                height: 170,
                borderRadius: "50%",
                border: "1px dashed rgba(255, 255, 255, 0.25)",
              }}
            />
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            />

            {/* Central Motor Spindle Clamp */}
            <div
              style={{
                position: "absolute",
                width: 50,
                height: 50,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #475569 0%, #1E293B 100%)",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.4)",
                border: "2px solid #94A3B8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#CBD5E1" }} />
            </div>
          </div>

          {/* Actuator Arm & Read/Write Magnetic Head */}
          <div
            style={{
              position: "absolute",
              right: 18,
              bottom: 24,
              width: 110,
              height: 18,
              background: "linear-gradient(90deg, #94A3B8 0%, #E2E8F0 100%)",
              borderRadius: "4px",
              transformOrigin: "right center",
              transform: `rotate(${armAngle}deg)`,
              boxShadow: "0 6px 14px rgba(0, 0, 0, 0.4)",
              transition: "transform 0.08s ease-out",
            }}
          >
            {/* Triangular Head Tip with Laser Optical Marker */}
            <div
              style={{
                position: "absolute",
                left: -10,
                top: 2,
                width: 14,
                height: 14,
                borderRadius: "2px",
                background: "#0F172A",
                border: `1.5px solid ${THEME.colors.orange}`,
              }}
            >
              {isWriting && (
                <div
                  style={{
                    position: "absolute",
                    top: 3,
                    left: 3,
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: THEME.colors.orange,
                    boxShadow: `0 0 8px ${THEME.colors.orange}`,
                  }}
                />
              )}
            </div>
          </div>

          {/* Pivot Base Bearing */}
          <div
            style={{
              position: "absolute",
              right: 12,
              bottom: 16,
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #64748B 0%, #334155 100%)",
              border: "2px solid #CBD5E1",
              boxShadow: "0 4px 8px rgba(0,0,0,0.4)",
            }}
          />
        </div>

        {/* Bottom Volume Label */}
        <div
          style={{
            marginTop: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "12px",
            color: THEME.colors.charcoalMuted,
          }}
        >
          <span>Volume: <strong>Backup Drive (E:)</strong></span>
          <span style={{ fontWeight: 700, color: THEME.colors.blue }}>1000 GB NTFS</span>
        </div>

        {/* Dynamic Latch / Saved Confirmation Badge */}
        {showSavedBadge && (
          <div
            style={{
              position: "absolute",
              top: "-18px",
              right: "20px",
              padding: "6px 14px",
              borderRadius: "20px",
              background: "#10B981",
              color: "#FFFFFF",
              fontSize: "12px",
              fontWeight: 800,
              boxShadow: "0 6px 18px rgba(16, 185, 129, 0.45)",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              zIndex: 10,
              animation: "bounce 0.5s ease",
            }}
          >
            <span>✓</span>
            <span>BACKUP SAVED</span>
          </div>
        )}
      </div>
    </div>
  );
};
