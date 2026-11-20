import React from "react";
import { useCurrentFrame } from "remotion";
import { THEME } from "../theme";

interface VssDataBlockStreamProps {
  blockCount?: number;
  isIncremental?: boolean;
  style?: React.CSSProperties;
}

export const VssDataBlockStream: React.FC<VssDataBlockStreamProps> = ({
  blockCount = 5,
  isIncremental = true,
  style = {},
}) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "14px",
        position: "relative",
        padding: "12px 24px",
        background: THEME.colors.white,
        borderRadius: "9999px",
        boxShadow: THEME.shadows.card,
        border: `1px solid ${THEME.colors.border}`,
        ...style,
      }}
    >
      <span style={{ fontSize: "12px", fontWeight: 800, color: THEME.colors.charcoal, letterSpacing: "0.06em" }}>
        VSS STREAM:
      </span>

      {/* Render Animated Flying Data Cubes */}
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        {Array.from({ length: blockCount }).map((_, idx) => {
          const cycleOffset = ((frame * 0.04 + idx * 0.2) % 1);
          const blockColor =
            isIncremental && idx > 0 ? THEME.colors.blue : THEME.colors.orange;

          return (
            <div
              key={idx}
              style={{
                width: 24,
                height: 24,
                borderRadius: "6px",
                background: blockColor,
                boxShadow: `0 4px 12px ${blockColor}40`,
                transform: `scale(${0.8 + cycleOffset * 0.4}) rotate(${cycleOffset * 30}deg)`,
                opacity: 0.4 + cycleOffset * 0.6,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFF",
                fontSize: "10px",
                fontWeight: 900,
              }}
            >
              {idx + 1}
            </div>
          );
        })}
      </div>

      <span
        style={{
          fontSize: "11px",
          fontWeight: 800,
          color: isIncremental ? THEME.colors.blue : THEME.colors.orange,
          background: isIncremental ? THEME.colors.blueLight : THEME.colors.orangeLight,
          padding: "3px 10px",
          borderRadius: "9999px",
        }}
      >
        {isIncremental ? "DELTA BLOCKS ONLY" : "FULL DATA STREAM"}
      </span>
    </div>
  );
};
