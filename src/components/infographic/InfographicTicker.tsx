import React from "react";
import { useCurrentFrame } from "remotion";
import { NHIT_FLYER_THEME } from "../../styles/nhitFlyerTheme";

interface InfographicTickerProps {
  isVertical?: boolean;
}

const TICKER_ITEMS = [
  "⚡ ADMISSIONS OPEN 2026–27",
  "THE NEW HORIZONS INSTITUTE OF TECHNOLOGY, DURGAPUR",
  "DIPLOMA FOR WORKING PROFESSIONALS",
  "ELECTRICAL: 30 SEATS | MECHANICAL: 30 SEATS",
  "APPROVED BY AICTE • AFFILIATED TO WBSCT&VE&SD",
  "MINIMUM 1 YEAR INDUSTRIAL WORK EXPERIENCE",
  "ADMISSION HELPLINE: +91 98005 71423",
  "OFFICIAL PORTAL: WWW.NHIT.IN",
];

export const InfographicTicker: React.FC<InfographicTickerProps> = ({
  isVertical = false,
}) => {
  const frame = useCurrentFrame();

  const fullText = TICKER_ITEMS.join("   •   ") + "   •   ";
  const xOffset = -(frame * (isVertical ? 2.8 : 2.2)) % 3800;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: isVertical ? "74px" : "56px",
        backgroundColor: "#0A0E17",
        borderTop: `3px solid ${NHIT_FLYER_THEME.colors.primaryRed}`,
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        zIndex: 50,
        boxShadow: "0 -6px 25px rgba(0,0,0,0.85)",
      }}
    >
      {/* Left Red Live Indicator Badge */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          backgroundColor: NHIT_FLYER_THEME.colors.primaryRed,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: isVertical ? "0 18px" : "0 24px",
          zIndex: 60,
          boxShadow: "4px 0 16px rgba(0,0,0,0.7)",
        }}
      >
        <div
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            backgroundColor: "#FFFFFF",
            boxShadow: "0 0 10px #FFFFFF",
          }}
        />
        <span
          style={{
            color: "#FFFFFF",
            fontFamily: NHIT_FLYER_THEME.fonts.headline,
            fontWeight: 900,
            fontSize: isVertical ? "15px" : "13px",
            letterSpacing: "1.5px",
          }}
        >
          ADMISSIONS
        </span>
      </div>

      {/* Marquee Ticker Track */}
      <div
        style={{
          display: "flex",
          whiteSpace: "nowrap",
          transform: `translateX(${xOffset}px)`,
          paddingLeft: isVertical ? "170px" : "210px",
        }}
      >
        <span
          style={{
            color: "#FFFFFF",
            fontFamily: NHIT_FLYER_THEME.fonts.headline,
            fontWeight: 700,
            fontSize: isVertical ? "17px" : "16px",
            letterSpacing: "1px",
          }}
        >
          {fullText.repeat(4)}
        </span>
      </div>

      {/* Right Urgent Contact Box */}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          backgroundColor: NHIT_FLYER_THEME.colors.goldAccent,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: isVertical ? "0 18px" : "0 24px",
          zIndex: 60,
          boxShadow: "-4px 0 16px rgba(0,0,0,0.7)",
        }}
      >
        <span
          style={{
            color: "#0B0F19",
            fontFamily: NHIT_FLYER_THEME.fonts.headline,
            fontWeight: 900,
            fontSize: isVertical ? "14px" : "13px",
            letterSpacing: "1px",
          }}
        >
          CALL:
        </span>
        <span
          style={{
            color: "#0B0F19",
            fontFamily: NHIT_FLYER_THEME.fonts.headline,
            fontWeight: 900,
            fontSize: isVertical ? "17px" : "16px",
            letterSpacing: "1px",
          }}
        >
          +91 98005 71423
        </span>
      </div>
    </div>
  );
};

