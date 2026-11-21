import React from "react";
import { staticFile, Img } from "remotion";
import { THEME } from "../theme";

// --- AUTHENTIC COMPONENT.SVG ICON SPRITE ---
export const ComponentSvgIcon: React.FC<{
  name:
    | "server_rack"
    | "server_blades"
    | "server_tower"
    | "hard_drive"
    | "cloud"
    | "router"
    | "workstation"
    | "gears"
    | "shield"
    | "sync_arrows"
    | "laptop"
    | "tablet"
    | "smartphone"
    | "wrench_unit"
    | "ethernet_cable"
    | "folder";
  size?: number;
  style?: React.CSSProperties;
}> = ({ name, size = 180, style }) => {
  const actualName = name === "server_blades" ? "server_rack" : name;
  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        position: "relative",
        ...style,
      }}
    >
      <Img
        src={staticFile(`incremental_backup/svg/${actualName}.svg`)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.12))",
        }}
      />
    </div>
  );
};

// --- ELEVATED CONTAINER CARD ---
export const ElevatedCard: React.FC<{
  children: React.ReactNode;
  width?: number | string;
  height?: number | string;
  padding?: string | number;
  style?: React.CSSProperties;
}> = ({ children, width = "auto", height = "auto", padding = "24px", style }) => {
  return (
    <div
      style={{
        width,
        height,
        padding,
        background: "#FFFFFF",
        borderRadius: "28px",
        boxShadow: THEME.shadows.card,
        border: `1px solid ${THEME.colors.border}`,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        zIndex: 5,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// --- ENTERPRISE SERVER RACK (Powered by Component.svg + status lights) ---
export const ServerRackCard: React.FC<{
  frame?: number;
  label?: string;
  width?: number;
  height?: number;
}> = ({ frame = 0, label = "Primary Server Host", width = 420, height = 480 }) => {
  const isLedGreen = Math.sin(frame * 0.3) > 0;
  const isLedBlue = Math.cos(frame * 0.4) > 0;

  return (
    <ElevatedCard width={width} height={height} padding="28px 24px">
      {/* Authentic Component.svg Icon */}
      <div style={{ position: "relative", marginBottom: "16px" }}>
        <ComponentSvgIcon name="server_blades" size={220} />

        {/* Live Active LED overlays */}
        <div
          style={{
            position: "absolute",
            top: 24,
            right: 28,
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: isLedGreen ? THEME.colors.green : "#064E3B",
              boxShadow: isLedGreen ? `0 0 10px ${THEME.colors.green}` : "none",
            }}
          />
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: isLedBlue ? THEME.colors.blue : "#1E3A8A",
              boxShadow: isLedBlue ? `0 0 10px ${THEME.colors.blue}` : "none",
            }}
          />
        </div>
      </div>

      <div
        style={{
          fontWeight: 800,
          fontSize: "22px",
          color: THEME.colors.charcoal,
          letterSpacing: "-0.015em",
          textAlign: "center",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: "14px",
          color: THEME.colors.charcoalMuted,
          fontWeight: 600,
          marginTop: "4px",
        }}
      >
        WSB Administrative Host • 2008 R2
      </div>
    </ElevatedCard>
  );
};

// --- ROTATING HARD DRIVE PLATTER CARD (Powered by Component.svg) ---
export const HardDrivePlatterCard: React.FC<{
  frame?: number;
  label?: string;
  width?: number;
  height?: number;
}> = ({ frame = 0, label = "Dedicated Backup Disk", width = 420, height = 480 }) => {
  return (
    <ElevatedCard width={width} height={height} padding="28px 24px">
      <div style={{ position: "relative", marginBottom: "16px" }}>
        <ComponentSvgIcon name="hard_drive" size={220} />
      </div>

      <div
        style={{
          fontWeight: 800,
          fontSize: "22px",
          color: THEME.colors.charcoal,
          letterSpacing: "-0.015em",
          textAlign: "center",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: "14px",
          color: THEME.colors.charcoalMuted,
          fontWeight: 600,
          marginTop: "4px",
        }}
      >
        Target Pool • DISK_01 (VSS Managed)
      </div>
    </ElevatedCard>
  );
};

// --- INTERACTIVE SCREENSHOT CARD WITH ANIMATED CURSOR ---
export const InteractiveScreenshotCard: React.FC<{
  imageName: string;
  title: string;
  width?: number;
  height?: number;
  zoom?: number;
  transformOrigin?: string;
  cursorX?: number;
  cursorY?: number;
  cursorOpacity?: number;
  isClicking?: boolean;
  clickRippleProgress?: number;
  spotlightRect?: { x: number; y: number; w: number; h: number };
  spotlightOpacity?: number;
}> = ({
  imageName,
  title,
  width = 940,
  height = 720,
  zoom = 1.0,
  transformOrigin = "center center",
  cursorX = 460,
  cursorY = 320,
  cursorOpacity = 1.0,
  isClicking = false,
  clickRippleProgress = 0,
  spotlightRect,
  spotlightOpacity = 1.0,
}) => {
  return (
    <div
      style={{
        width,
        height,
        background: "#FFFFFF",
        borderRadius: "28px",
        boxShadow: THEME.shadows.cardElevated,
        border: `1px solid ${THEME.colors.border}`,
        boxSizing: "border-box",
        overflow: "hidden",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        zIndex: 10,
      }}
    >
      {/* Sleek Window Header Bar */}
      <div
        style={{
          height: 54,
          background: "#F8FAFC",
          borderBottom: "1px solid #E2E8F0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Traffic lights */}
          <div style={{ display: "flex", gap: "7px" }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#EF4444" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#F59E0B" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#10B981" }} />
          </div>
          <span
            style={{
              fontSize: "16px",
              fontWeight: 800,
              color: THEME.colors.charcoal,
              marginLeft: "10px",
              letterSpacing: "-0.01em",
            }}
          >
            {title}
          </span>
        </div>

        <span
          style={{
            fontSize: "13px",
            fontWeight: 800,
            color: THEME.colors.orange,
            background: THEME.colors.orangeLight,
            padding: "5px 14px",
            borderRadius: "9999px",
            letterSpacing: "0.06em",
          }}
        >
          WINDOWS SERVER 2008
        </span>
      </div>

      {/* Screenshot Content Viewport */}
      <div
        style={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
          background: "#1E293B",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: transformOrigin,
            transition: "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Img
            src={staticFile(`incremental_backup/${imageName}`)}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        </div>

        {/* Spotlight Focus Box */}
        {spotlightRect && spotlightOpacity > 0 && (
          <div
            style={{
              position: "absolute",
              left: spotlightRect.x,
              top: spotlightRect.y,
              width: spotlightRect.w,
              height: spotlightRect.h,
              border: `3.5px solid ${THEME.colors.orange}`,
              borderRadius: "10px",
              boxShadow: `0 0 28px ${THEME.colors.orange}, 0 0 0 9999px rgba(0, 0, 0, ${0.45 * spotlightOpacity})`,
              opacity: spotlightOpacity,
              pointerEvents: "none",
              transition: "opacity 0.25s ease",
            }}
          />
        )}

        {/* Animated Mouse Cursor */}
        {cursorOpacity > 0 && (
          <div
            style={{
              position: "absolute",
              left: cursorX,
              top: cursorY,
              pointerEvents: "none",
              zIndex: 20,
              opacity: cursorOpacity,
              transform: isClicking ? "scale(0.85)" : "scale(1)",
              transition: "transform 0.08s ease",
            }}
          >
            {/* Vector Pointer SVG */}
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 3L10.07 20.97L13.58 13.58L20.97 10.07L3 3Z"
                fill={THEME.colors.charcoal}
                stroke="#FFFFFF"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
            </svg>

            {/* Click Ripple Effect */}
            {(isClicking || clickRippleProgress > 0) && (
              <div
                style={{
                  position: "absolute",
                  left: -12 - clickRippleProgress * 20,
                  top: -12 - clickRippleProgress * 20,
                  width: 32 + clickRippleProgress * 40,
                  height: 32 + clickRippleProgress * 40,
                  borderRadius: "50%",
                  border: `3px solid ${THEME.colors.orange}`,
                  opacity: Math.max(0, 1 - clickRippleProgress),
                  pointerEvents: "none",
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
