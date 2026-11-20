import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { THEME } from "../theme";

interface WindowsServerDialogProps {
  title: string;
  width?: number;
  height?: number;
  delay?: number;
  children: React.ReactNode;
}

export const WindowsServerDialog: React.FC<WindowsServerDialogProps> = ({
  title,
  width = 680,
  height = 420,
  delay = 5,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: THEME.springs.gentle,
  });

  return (
    <div
      style={{
        width,
        height,
        background: "#FFFFFF",
        borderRadius: "18px",
        border: `1px solid ${THEME.colors.border}`,
        boxShadow: "0 25px 60px -15px rgba(41, 37, 36, 0.12), 0 0 0 1px rgba(0,0,0,0.04)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        opacity: entrance,
        transform: `perspective(1000px) translateY(${(1 - entrance) * 30}px) scale(${0.96 + entrance * 0.04})`,
      }}
    >
      {/* Windows Server 2008 Aero-Style Clean Title Bar */}
      <div
        style={{
          height: 38,
          background: "linear-gradient(180deg, #F8F7F4 0%, #ECEAE5 100%)",
          borderBottom: `1px solid ${THEME.colors.border}`,
          padding: "0 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          userSelect: "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Windows Server Icon */}
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: "4px",
              background: THEME.colors.blue,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1.5px",
              }}
            >
              <div style={{ background: "#FFFFFF", borderRadius: "1px" }} />
              <div style={{ background: "#FFFFFF", borderRadius: "1px" }} />
              <div style={{ background: "#FFFFFF", borderRadius: "1px" }} />
              <div style={{ background: "#FFFFFF", borderRadius: "1px" }} />
            </div>
          </div>
          <span style={{ fontSize: "12px", fontWeight: 700, color: THEME.colors.charcoal }}>
            {title}
          </span>
        </div>

        {/* Window Controls (Minimize, Maximize, Close) */}
        <div style={{ display: "flex", gap: "6px" }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#D6D3D1",
            }}
          />
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#D6D3D1",
            }}
          />
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#F87171",
            }}
          />
        </div>
      </div>

      {/* Dialog Body Content */}
      <div
        style={{
          flex: 1,
          padding: "24px 28px",
          background: "#FFFFFF",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {children}
      </div>
    </div>
  );
};
