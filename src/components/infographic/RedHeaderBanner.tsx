import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { NHIT_FLYER_THEME } from "../../styles/nhitFlyerTheme";

interface RedHeaderProps {
  isVertical?: boolean;
  categoryText?: string;
  sessionText?: string;
}

export const RedHeaderBanner: React.FC<RedHeaderProps> = ({
  isVertical = false,
  categoryText = "DIPLOMA ENGINEERING FOR WORKING PROFESSIONALS",
  sessionText = "ACADEMIC SESSION 2026–27",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const spr = spring({
    frame,
    fps,
    config: { damping: 95, mass: 0.8 },
  });

  const translateY = interpolate(spr, [0, 1], [-30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(spr, [0, 0.4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        transform: `translateY(${translateY}px)`,
        opacity,
        width: "100%",
        display: "flex",
        flexDirection: isVertical ? "column" : "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: isVertical ? "12px" : "24px",
        backgroundColor: "rgba(11, 15, 25, 0.94)",
        borderBottom: `3px solid ${NHIT_FLYER_THEME.colors.primaryRed}`,
        padding: isVertical ? "16px 20px" : "14px 40px",
        boxSizing: "border-box",
        boxShadow: "0 8px 30px rgba(0,0,0,0.85)",
        zIndex: 40,
      }}
    >
      {/* Official Brand Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <Img
          src={staticFile("nhit_assets/round_logo.png")}
          style={{
            width: isVertical ? "50px" : "60px",
            height: isVertical ? "50px" : "60px",
            objectFit: "contain",
            filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.6))",
          }}
        />
        <div>
          <h1
            style={{
              margin: 0,
              fontFamily: NHIT_FLYER_THEME.fonts.headline,
              fontWeight: 900,
              fontSize: isVertical ? "17px" : "22px",
              color: NHIT_FLYER_THEME.colors.white,
              letterSpacing: "1px",
              lineHeight: 1.15,
              textTransform: "uppercase",
            }}
          >
            THE NEW HORIZONS INSTITUTE OF TECHNOLOGY
          </h1>
          <div
            style={{
              fontFamily: NHIT_FLYER_THEME.fonts.headline,
              fontSize: isVertical ? "11px" : "12px",
              color: NHIT_FLYER_THEME.colors.goldAccent,
              fontWeight: 800,
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginTop: "2px",
            }}
          >
            DURGAPUR, WEST BENGAL • APPROVED BY AICTE & WBSCT&VE&SD
          </div>
        </div>
      </div>

      {/* Red Category Ribbon */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <div
          style={{
            backgroundColor: NHIT_FLYER_THEME.colors.primaryRed,
            color: "#FFFFFF",
            fontFamily: NHIT_FLYER_THEME.fonts.headline,
            fontWeight: 900,
            fontSize: isVertical ? "12px" : "13px",
            padding: isVertical ? "6px 14px" : "7px 18px",
            borderRadius: "4px",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            boxShadow: "0 4px 15px rgba(211, 47, 47, 0.4)",
          }}
        >
          {categoryText}
        </div>
        <div
          style={{
            backgroundColor: "rgba(255, 184, 0, 0.15)",
            border: `1px solid ${NHIT_FLYER_THEME.colors.goldAccent}`,
            color: NHIT_FLYER_THEME.colors.goldAccent,
            fontFamily: NHIT_FLYER_THEME.fonts.headline,
            fontWeight: 800,
            fontSize: isVertical ? "11px" : "12px",
            padding: isVertical ? "5px 10px" : "6px 14px",
            borderRadius: "4px",
            letterSpacing: "1px",
          }}
        >
          {sessionText}
        </div>
      </div>
    </div>
  );
};

