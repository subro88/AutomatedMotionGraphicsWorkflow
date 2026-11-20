import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { NHIT_FLYER_THEME } from "../../styles/nhitFlyerTheme";
import { CentralInfographicHub } from "../../components/infographic/CentralInfographicHub";
import { LightSweep } from "../../components/nhit/LightSweep";

interface SceneProps {
  isVertical?: boolean;
}

export const InfographicScene02Campus: React.FC<SceneProps> = ({ isVertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sweep = interpolate(frame, [0, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const spr = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: { damping: 95, mass: 0.8 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: NHIT_FLYER_THEME.colors.bgDark,
        overflow: "hidden",
        fontFamily: NHIT_FLYER_THEME.fonts.body,
      }}
    >
      {/* Background Campus Photo with Deep Contrast Vignette */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          opacity: 0.22,
          overflow: "hidden",
        }}
      >
        <Img
          src={staticFile("nhit_assets/college_campus.jpg")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "contrast(1.2) brightness(0.6)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(circle at center, transparent 30%, #0B0F19 85%)",
          }}
        />
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: isVertical ? "column" : "row",
          alignItems: "center",
          justifyContent: isVertical ? "center" : "space-between",
          padding: isVertical ? "20px 30px 90px" : "40px 90px 90px",
          boxSizing: "border-box",
          gap: isVertical ? "24px" : "40px",
        }}
      >
        {/* Left Side: Institution Introduction Card */}
        <div
          style={{
            flex: isVertical ? "none" : 1.2,
            width: isVertical ? "100%" : "auto",
            transform: `translateY(${interpolate(spr, [0, 1], [30, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })}px)`,
            opacity: interpolate(spr, [0, 0.4], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {/* Logo Plate */}
          <div
            style={{
              display: "inline-block",
              backgroundColor: "#FFFFFF",
              padding: "10px 20px",
              borderRadius: "8px",
              boxShadow: "0 6px 20px rgba(0,0,0,0.6)",
              marginBottom: "16px",
            }}
          >
            <Img
              src={staticFile("nhit_assets/brand_logo.png")}
              style={{
                height: isVertical ? "40px" : "55px",
                objectFit: "contain",
              }}
            />
          </div>

          <div
            style={{
              backgroundColor: "rgba(15, 23, 42, 0.96)",
              border: `2px solid ${NHIT_FLYER_THEME.colors.primaryRed}`,
              borderLeft: `10px solid ${NHIT_FLYER_THEME.colors.primaryRed}`,
              borderRadius: "10px",
              padding: isVertical ? "20px" : "28px 36px",
              boxShadow: "0 14px 45px rgba(0,0,0,0.85)",
            }}
          >
            <div
              style={{
                color: NHIT_FLYER_THEME.colors.goldAccent,
                fontFamily: NHIT_FLYER_THEME.fonts.headline,
                fontWeight: 900,
                fontSize: isVertical ? "12px" : "14px",
                letterSpacing: "3px",
                textTransform: "uppercase",
                marginBottom: "6px",
              }}
            >
              PREMIER TECHNICAL CAMPUS • DURGAPUR
            </div>

            <h1
              style={{
                margin: 0,
                fontFamily: NHIT_FLYER_THEME.fonts.headline,
                fontWeight: 900,
                fontSize: isVertical ? "26px" : "38px",
                lineHeight: 1.2,
                color: NHIT_FLYER_THEME.colors.white,
                textTransform: "uppercase",
              }}
            >
              INTRODUCING NHIT DURGAPUR
            </h1>

            <div
              style={{
                marginTop: "12px",
                color: "#FFFFFF",
                fontFamily: NHIT_FLYER_THEME.fonts.headline,
                fontWeight: 700,
                fontSize: isVertical ? "16px" : "20px",
                lineHeight: 1.3,
              }}
            >
              Your opportunity to advance through{" "}
              <span style={{ color: NHIT_FLYER_THEME.colors.primaryRed, fontWeight: 900 }}>
                technical education
              </span>.
            </div>

            <div
              style={{
                marginTop: "16px",
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              {["Full Council Affiliation", "Flexible Working Shifts", "State-of-the-Art Labs"].map((badge, idx) => (
                <span
                  key={idx}
                  style={{
                    backgroundColor: "rgba(211, 47, 47, 0.15)",
                    border: "1px solid #D32F2F",
                    color: "#FFFFFF",
                    fontFamily: NHIT_FLYER_THEME.fonts.headline,
                    fontSize: "12px",
                    fontWeight: 700,
                    padding: "5px 12px",
                    borderRadius: "4px",
                  }}
                >
                  ✓ {badge}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Center / Right: Central Infographic Hub */}
        <div
          style={{
            flex: isVertical ? "none" : 0.9,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CentralInfographicHub
            isVertical={isVertical}
            customMetricLabel="CAMPUS ESTABLISHED"
            customMetricValue="NHIT"
            showCampusImage={false}
          />
        </div>
      </div>

      <LightSweep progress={sweep} color={NHIT_FLYER_THEME.colors.goldAccent} width={340} angle={25} />
    </AbsoluteFill>
  );
};

