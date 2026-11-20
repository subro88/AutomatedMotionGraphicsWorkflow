import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { NHIT_FLYER_THEME } from "../../styles/nhitFlyerTheme";

interface CentralHubProps {
  isVertical?: boolean;
  activeBranch?: "both" | "electrical" | "mechanical";
  customMetricLabel?: string;
  customMetricValue?: string;
  showCampusImage?: boolean;
}

export const CentralInfographicHub: React.FC<CentralHubProps> = ({
  isVertical = false,
  activeBranch = "both",
  customMetricLabel,
  customMetricValue,
  showCampusImage = true,
}) => {
  const frame = useCurrentFrame();

  // Rotation for outer HUD reticles
  const rot1 = (frame * 0.8) % 360;
  const rot2 = (-frame * 0.5) % 360;

  // Pulse effect
  const pulse = interpolate(
    Math.sin((frame / 20) * Math.PI * 2),
    [-1, 1],
    [0.97, 1.03],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const size = isVertical ? 320 : 380;

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Outer Rotating HUD Reticle Ring 1 */}
      <svg
        style={{
          position: "absolute",
          width: size,
          height: size,
          transform: `rotate(${rot1}deg)`,
          pointerEvents: "none",
        }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 8}
          fill="none"
          stroke={NHIT_FLYER_THEME.colors.primaryRed}
          strokeWidth="2"
          strokeDasharray="24 16 8 16"
          opacity={0.65}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 20}
          fill="none"
          stroke={NHIT_FLYER_THEME.colors.goldAccent}
          strokeWidth="1.5"
          strokeDasharray="12 24"
          opacity={0.5}
        />
      </svg>

      {/* Inner Counter-Rotating Reticle Ring 2 */}
      <svg
        style={{
          position: "absolute",
          width: size,
          height: size,
          transform: `rotate(${rot2}deg)`,
          pointerEvents: "none",
        }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 32}
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="1"
          strokeDasharray="4 16"
          opacity={0.4}
        />
      </svg>

      {/* Solid High-Contrast Central Content Card */}
      <div
        style={{
          position: "relative",
          width: size - 80,
          height: size - 80,
          borderRadius: "50%",
          backgroundColor: "rgba(11, 15, 25, 0.96)",
          border: `3px solid ${NHIT_FLYER_THEME.colors.primaryRed}`,
          boxShadow: `0 0 45px rgba(211, 47, 47, 0.35), inset 0 0 25px rgba(0,0,0,0.9)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          transform: `scale(${pulse})`,
        }}
      >
        {/* Subtle Campus Photo Backdrop with Blend */}
        {showCampusImage && (
          <Img
            src={staticFile("nhit_assets/college_campus.jpg")}
            style={{
              position: "absolute",
              width: "140%",
              height: "140%",
              objectFit: "cover",
              opacity: 0.18,
              filter: "contrast(1.2) brightness(0.8)",
              pointerEvents: "none",
            }}
          />
        )}

        {/* Central Metric Content */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            textAlign: "center",
            padding: "10px",
          }}
        >
          <div
            style={{
              fontSize: isVertical ? "11px" : "12px",
              fontFamily: NHIT_FLYER_THEME.fonts.headline,
              color: NHIT_FLYER_THEME.colors.goldAccent,
              fontWeight: 800,
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginBottom: "2px",
            }}
          >
            {customMetricLabel || "APPROVED INTAKE"}
          </div>

          <div
            style={{
              fontSize: isVertical ? "46px" : "56px",
              fontFamily: NHIT_FLYER_THEME.fonts.headline,
              color: NHIT_FLYER_THEME.colors.white,
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: "1px",
              textShadow: "0 4px 18px rgba(0,0,0,0.9)",
            }}
          >
            {customMetricValue || "60"}
          </div>

          <div
            style={{
              fontSize: isVertical ? "11px" : "12px",
              fontFamily: NHIT_FLYER_THEME.fonts.headline,
              color: NHIT_FLYER_THEME.colors.white,
              fontWeight: 800,
              letterSpacing: "3px",
              textTransform: "uppercase",
              marginTop: "4px",
            }}
          >
            TOTAL SEATS
          </div>

          {/* Dual Seat Breakdown Pill */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              marginTop: "8px",
              backgroundColor: "rgba(211, 47, 47, 0.25)",
              border: `1px solid ${NHIT_FLYER_THEME.colors.primaryRed}`,
              borderRadius: "20px",
              padding: "4px 12px",
            }}
          >
            <span
              style={{
                fontSize: "10px",
                fontFamily: NHIT_FLYER_THEME.fonts.headline,
                color: activeBranch === "mechanical" ? NHIT_FLYER_THEME.colors.textMuted : "#FFFFFF",
                fontWeight: 800,
              }}
            >
              EE: 30
            </span>
            <span style={{ color: NHIT_FLYER_THEME.colors.goldAccent, fontSize: "10px" }}>•</span>
            <span
              style={{
                fontSize: "10px",
                fontFamily: NHIT_FLYER_THEME.fonts.headline,
                color: activeBranch === "electrical" ? NHIT_FLYER_THEME.colors.textMuted : "#FFFFFF",
                fontWeight: 800,
              }}
            >
              ME: 30
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

