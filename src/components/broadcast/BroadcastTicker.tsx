import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

interface BroadcastTickerProps {
  items?: string[];
  speed?: number;
}

const DEFAULT_ITEMS = [
  "⚡ ADMISSIONS OPEN 2026–27",
  "THE NEW HORIZONS INSTITUTE OF TECHNOLOGY, DURGAPUR",
  "DIPLOMA FOR WORKING PROFESSIONALS",
  "ELECTRICAL ENGINEERING: 30 SEATS",
  "MECHANICAL ENGINEERING: 30 SEATS",
  "APPROVED BY AICTE & AFFILIATED TO WBSCT&VE&SD",
  "MINIMUM 1 YEAR WORK EXPERIENCE REQUIRED",
  "HELPLINE: +91 98005 71423",
  "OFFICIAL PORTAL: WWW.NHIT.IN",
];

export const BroadcastTicker: React.FC<BroadcastTickerProps> = ({
  items = DEFAULT_ITEMS,
  speed = 2.5,
}) => {
  const frame = useCurrentFrame();

  const fullText = items.join("   •   ") + "   •   ";
  // Scrolling offset using frame
  const xOffset = -(frame * speed * 2) % 3500;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "56px",
        backgroundColor: "#030D1A",
        borderTop: "3px solid #087EFF",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        zIndex: 50,
        boxShadow: "0 -6px 20px rgba(0,0,0,0.8)",
      }}
    >
      {/* Left live indicator badge */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          backgroundColor: "#FF9D32",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "0 22px",
          zIndex: 60,
          boxShadow: "4px 0 16px rgba(0,0,0,0.6)",
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
            color: "#030D1A",
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 900,
            fontSize: "14px",
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
          paddingLeft: "190px",
        }}
      >
        <span
          style={{
            color: "#FFFFFF",
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 700,
            fontSize: "17px",
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
          backgroundColor: "#087EFF",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "0 26px",
          zIndex: 60,
          boxShadow: "-4px 0 16px rgba(0,0,0,0.6)",
        }}
      >
        <span
          style={{
            color: "#FFFFFF",
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 800,
            fontSize: "14px",
            letterSpacing: "1px",
          }}
        >
          CALL:
        </span>
        <span
          style={{
            color: "#FFFFFF",
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 900,
            fontSize: "18px",
            letterSpacing: "1.5px",
          }}
        >
          +91 98005 71423
        </span>
      </div>
    </div>
  );
};

