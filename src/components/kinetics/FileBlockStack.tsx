import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { THEME } from "../theme";

interface FileBlockStackProps {
  count: number;
  totalCap?: number;
  color?: string;
  label?: string;
  sublabel?: string;
  delay?: number;
  stagger?: number;
  isIncrementalDiff?: boolean;
}

export const FileBlockStack: React.FC<FileBlockStackProps> = ({
  count,
  totalCap = 10,
  color = THEME.colors.blue,
  label,
  sublabel,
  delay = 0,
  stagger = 3,
  isIncrementalDiff = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const blocks = Array.from({ length: count }, (_, i) => i);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "6px",
      }}
    >
      {/* 3D Data Block Grid / Stack */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "6px",
          width: 140,
          minHeight: 110,
          padding: "10px",
          background: "rgba(41, 37, 36, 0.03)",
          borderRadius: "16px",
          border: `1px dashed ${THEME.colors.border}`,
          alignContent: "flex-end",
        }}
      >
        {blocks.map((idx) => {
          const itemSpring = spring({
            frame: Math.max(0, frame - delay - idx * stagger),
            fps,
            config: THEME.springs.bouncy,
          });

          return (
            <div
              key={idx}
              style={{
                width: 28,
                height: 28,
                borderRadius: "8px",
                background: color,
                boxShadow: `0 4px 10px ${color}44`,
                border: "1px solid rgba(255, 255, 255, 0.4)",
                transform: `scale(${itemSpring}) translateY(${(1 - itemSpring) * 15}px)`,
                opacity: itemSpring,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                fontSize: "10px",
                fontWeight: 700,
              }}
            >
              {idx + 1}
            </div>
          );
        })}
      </div>

      {label && (
        <span
          style={{
            fontSize: "13px",
            fontWeight: 800,
            color: THEME.colors.charcoal,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            marginTop: "4px",
          }}
        >
          {label}
        </span>
      )}

      {sublabel && (
        <span
          style={{
            fontSize: "12px",
            fontWeight: 600,
            color: color,
            textAlign: "center",
          }}
        >
          {sublabel}
        </span>
      )}
    </div>
  );
};
