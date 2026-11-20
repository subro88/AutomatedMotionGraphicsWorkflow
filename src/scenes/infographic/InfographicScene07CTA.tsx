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
import { ParticleSystem } from "../../components/nhit/ParticleSystem";

interface SceneProps {
  isVertical?: boolean;
}

export const InfographicScene07CTA: React.FC<SceneProps> = ({ isVertical = false }) => {
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

  const pulse = interpolate(
    Math.sin((frame / 20) * Math.PI * 2),
    [-1, 1],
    [0.98, 1.02],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: NHIT_FLYER_THEME.colors.bgDark,
        overflow: "hidden",
        fontFamily: NHIT_FLYER_THEME.fonts.body,
      }}
    >
      <ParticleSystem count={isVertical ? 25 : 40} seed={88} color={NHIT_FLYER_THEME.colors.primaryRed} speed={0.4} />

      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          padding: isVertical ? "16px 20px 85px" : "24px 80px 85px",
          boxSizing: "border-box",
        }}
      >
        {/* Top Header Plate with Brand Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
            transform: `translateY(${interpolate(spr, [0, 1], [-25, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })}px)`,
            opacity: interpolate(spr, [0, 0.4], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <div
            style={{
              backgroundColor: "#FFFFFF",
              padding: isVertical ? "8px 16px" : "10px 24px",
              borderRadius: "8px",
              boxShadow: "0 6px 20px rgba(0,0,0,0.6)",
            }}
          >
            <Img
              src={staticFile("nhit_assets/brand_logo.png")}
              style={{
                height: isVertical ? "38px" : "50px",
                objectFit: "contain",
              }}
            />
          </div>
        </div>

        {/* Center Section: Core Punchline + Hub */}
        <div
          style={{
            display: "flex",
            flexDirection: isVertical ? "column" : "row",
            alignItems: "center",
            justifyContent: "center",
            gap: isVertical ? "16px" : "40px",
            width: "100%",
            maxWidth: "1350px",
          }}
        >
          {/* Main Hero Punchline Card */}
          <div
            style={{
              flex: 1.2,
              backgroundColor: "rgba(15, 23, 42, 0.96)",
              border: `2px solid ${NHIT_FLYER_THEME.colors.primaryRed}`,
              borderLeft: `10px solid ${NHIT_FLYER_THEME.colors.primaryRed}`,
              borderRadius: "10px",
              padding: isVertical ? "18px" : "28px 36px",
              boxShadow: "0 14px 45px rgba(0,0,0,0.85)",
            }}
          >
            <div
              style={{
                color: NHIT_FLYER_THEME.colors.goldAccent,
                fontFamily: NHIT_FLYER_THEME.fonts.headline,
                fontWeight: 900,
                fontSize: isVertical ? "12px" : "13px",
                letterSpacing: "3px",
                textTransform: "uppercase",
                marginBottom: "6px",
              }}
            >
              ADMISSIONS OPEN • ACADEMIC SESSION 2026–27
            </div>

            <h1
              style={{
                margin: 0,
                fontFamily: NHIT_FLYER_THEME.fonts.headline,
                fontWeight: 900,
                fontSize: isVertical ? "24px" : "38px",
                lineHeight: 1.15,
                color: NHIT_FLYER_THEME.colors.white,
                textTransform: "uppercase",
              }}
            >
              YOUR EXPERIENCE.{" "}
              <span style={{ color: NHIT_FLYER_THEME.colors.primaryRed }}>
                YOUR QUALIFICATION.
              </span>{" "}
              <span style={{ color: NHIT_FLYER_THEME.colors.goldAccent }}>
                YOUR FUTURE.
              </span>
            </h1>

            <p
              style={{
                margin: "10px 0 0",
                fontFamily: NHIT_FLYER_THEME.fonts.body,
                fontSize: isVertical ? "13px" : "16px",
                color: NHIT_FLYER_THEME.colors.textMuted,
                lineHeight: 1.4,
              }}
            >
              The New Horizons Institute of Technology, Durgapur. Shape your professional engineering career today.
            </p>
          </div>

          {/* Central Hub */}
          <div style={{ flex: isVertical ? "none" : 0.8, display: "flex", justifyContent: "center" }}>
            <CentralInfographicHub
              isVertical={isVertical}
              customMetricLabel="ENQUIRE TODAY"
              customMetricValue="2026"
              showCampusImage={true}
            />
          </div>
        </div>

        {/* Bottom Section: Direct Helpline & Website Action Card */}
        <div
          style={{
            width: "100%",
            maxWidth: "1350px",
            backgroundColor: "rgba(11, 15, 25, 0.98)",
            border: `3px solid ${NHIT_FLYER_THEME.colors.primaryRed}`,
            borderTop: `6px solid ${NHIT_FLYER_THEME.colors.goldAccent}`,
            borderRadius: "12px",
            padding: isVertical ? "14px 20px" : "18px 40px",
            display: "flex",
            flexDirection: isVertical ? "column" : "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: isVertical ? "10px" : "20px",
            boxShadow: `0 0 35px rgba(211, 47, 47, 0.35)`,
            transform: `scale(${pulse})`,
          }}
        >
          {/* Helpline */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: isVertical ? "40px" : "50px",
                height: isVertical ? "40px" : "50px",
                borderRadius: "10px",
                backgroundColor: NHIT_FLYER_THEME.colors.primaryRed,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4741 21.8325 20.7293C21.7209 20.9845 21.5573 21.2137 21.3521 21.4019C21.1468 21.5901 20.9046 21.733 20.6407 21.8215C20.3767 21.91 20.0969 21.9421 19.82 21.915C16.7428 21.5807 13.787 20.5287 11.19 18.84C8.77382 17.2917 6.70828 15.2262 5.16 12.81C3.46571 10.2031 2.41341 7.23594 2.085 4.15C2.05794 3.87353 2.08985 3.59416 2.17866 3.33062C2.26747 3.06708 2.41113 2.82528 2.59998 2.62083C2.78883 2.41638 3.01859 2.25389 3.27419 2.14364C3.52978 2.03339 3.80556 1.97787 4.084 1.9806H7.084C7.57398 1.97577 8.04791 2.15243 8.41375 2.47648C8.77959 2.80053 9.01103 3.24921 9.063 3.735C9.16016 4.64687 9.38268 5.54343 9.724 6.402C9.86603 6.75841 9.89748 7.15065 9.81446 7.52599C9.73144 7.90133 9.53755 8.24278 9.257 8.504L7.986 9.775C9.40455 12.269 11.456 14.3204 13.95 15.739L15.221 14.468C15.4822 14.1874 15.8237 13.9936 16.199 13.9105C16.5743 13.8275 16.9666 13.859 17.323 14.001C18.1816 14.3423 19.0781 14.5648 19.99 14.662C20.4815 14.7145 20.9351 14.9501 21.2605 15.3217C21.5859 15.6933 21.7597 16.1738 21.748 16.668L22 16.92Z"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <div
                style={{
                  fontFamily: NHIT_FLYER_THEME.fonts.headline,
                  fontWeight: 800,
                  fontSize: "11px",
                  color: "#94A3B8",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                ADMISSION HELPLINE
              </div>
              <div
                style={{
                  fontFamily: NHIT_FLYER_THEME.fonts.headline,
                  fontWeight: 900,
                  fontSize: isVertical ? "26px" : "32px",
                  color: NHIT_FLYER_THEME.colors.goldAccent,
                  letterSpacing: "1px",
                  lineHeight: 1.1,
                }}
              >
                +91 98005 71423
              </div>
            </div>
          </div>

          {!isVertical && <div style={{ width: "2px", height: "50px", backgroundColor: "rgba(255,255,255,0.2)" }} />}

          {/* Website Portal */}
          <div style={{ textAlign: isVertical ? "center" : "left" }}>
            <div
              style={{
                fontFamily: NHIT_FLYER_THEME.fonts.headline,
                fontWeight: 800,
                fontSize: "11px",
                color: "#94A3B8",
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              OFFICIAL APPLICATION PORTAL
            </div>
            <div
              style={{
                fontFamily: NHIT_FLYER_THEME.fonts.headline,
                fontWeight: 900,
                fontSize: isVertical ? "24px" : "30px",
                color: "#FFFFFF",
                letterSpacing: "1px",
                lineHeight: 1.1,
              }}
            >
              WWW.NHIT.IN
            </div>
          </div>

          {!isVertical && <div style={{ width: "2px", height: "50px", backgroundColor: "rgba(255,255,255,0.2)" }} />}

          {/* Quick Enquire Button */}
          <div
            style={{
              backgroundColor: NHIT_FLYER_THEME.colors.primaryRed,
              color: "#FFFFFF",
              fontFamily: NHIT_FLYER_THEME.fonts.headline,
              fontWeight: 900,
              fontSize: isVertical ? "13px" : "15px",
              padding: isVertical ? "10px 24px" : "14px 28px",
              borderRadius: "50px",
              letterSpacing: "1px",
              textTransform: "uppercase",
              boxShadow: "0 6px 20px rgba(211, 47, 47, 0.4)",
            }}
          >
            ENQUIRE NOW
          </div>
        </div>
      </div>

      <LightSweep progress={sweep} color={NHIT_FLYER_THEME.colors.primaryRed} width={340} angle={25} />
    </AbsoluteFill>
  );
};

