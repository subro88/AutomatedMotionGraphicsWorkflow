import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BlueprintBackground } from "../../components/nhit/BlueprintBackground";
import { LogoPlaceholder } from "../../components/nhit/LogoPlaceholder";
import { BroadcastBanner } from "../../components/broadcast/BroadcastBanner";
import { LightSweep } from "../../components/nhit/LightSweep";
import { ParticleSystem } from "../../components/nhit/ParticleSystem";

export const BroadcastScene07CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sweep = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const logoSpr = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: { damping: 95, mass: 0.8 },
  });
  const ctaSpr = spring({
    frame: Math.max(0, frame - 15),
    fps,
    config: { damping: 95, mass: 0.85 },
  });

  const ctaPulse = interpolate(
    Math.sin((frame / 20) * Math.PI * 2),
    [-1, 1],
    [0.98, 1.02],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#071B33",
        overflow: "hidden",
        fontFamily: "'Montserrat', 'Inter', sans-serif",
      }}
    >
      <BlueprintBackground gridOpacity={0.16} showTechnicalHUD={true} statusLabel="DIRECT ADMISSION CONTACT DESK" />
      <ParticleSystem count={30} seed={99} color="#087EFF" speed={0.4} />
      <ParticleSystem count={20} seed={88} color="#FF9D32" speed={0.4} />

      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "36px 80px 75px",
          boxSizing: "border-box",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Top Header Plate with Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "24px", width: "100%", maxWidth: "1350px" }}>
          <div
            style={{
              transform: `scale(${interpolate(logoSpr, [0, 1], [0.7, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })})`,
              opacity: interpolate(logoSpr, [0, 0.4], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            <LogoPlaceholder size={95} />
          </div>

          <div style={{ flex: 1 }}>
            <BroadcastBanner
              category="ADMISSIONS OPEN • ACADEMIC SESSION 2026–27"
              categoryColor="#087EFF"
              title="YOUR EXPERIENCE. YOUR QUALIFICATION. YOUR FUTURE."
              highlightWord="FUTURE"
              highlightColor="#FF9D32"
              subtitle="THE NEW HORIZONS INSTITUTE OF TECHNOLOGY — DURGAPUR, WEST BENGAL"
              metaBadge="APPLY TODAY"
              alignment="left"
            />
          </div>
        </div>

        {/* Center High-Impact Contact & Action Box */}
        <div
          style={{
            width: "100%",
            maxWidth: "1350px",
            backgroundColor: "rgba(3, 13, 26, 0.95)",
            border: "3px solid #087EFF",
            borderTop: "8px solid #FF9D32",
            borderRadius: "14px",
            padding: "28px 45px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 16px 50px rgba(0,0,0,0.85), 0 0 35px rgba(8,126,255,0.25)",
            transform: `scale(${interpolate(ctaSpr, [0, 1], [0.94, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }) * ctaPulse})`,
            opacity: interpolate(ctaSpr, [0, 0.4], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {/* Phone Contact Block */}
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "12px",
                backgroundColor: "#087EFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 20px rgba(8,126,255,0.4)",
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
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
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 800,
                  fontSize: "13px",
                  color: "#94A3B8",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                }}
              >
                ADMISSION HELPLINE
              </div>
              <div
                style={{
                  fontFamily: "'Montserrat', 'Arial Black', sans-serif",
                  fontWeight: 900,
                  fontSize: "36px",
                  color: "#FF9D32",
                  letterSpacing: "1.5px",
                  lineHeight: 1.1,
                }}
              >
                +91 98005 71423
              </div>
            </div>
          </div>

          <div style={{ width: "2px", height: "60px", backgroundColor: "rgba(255,255,255,0.2)" }} />

          {/* Website Portal Block */}
          <div>
            <div
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 800,
                fontSize: "13px",
                color: "#94A3B8",
                letterSpacing: "2px",
                textTransform: "uppercase",
              }}
            >
              OFFICIAL APPLICATION PORTAL
            </div>
            <div
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 900,
                fontSize: "34px",
                color: "#087EFF",
                letterSpacing: "2px",
                lineHeight: 1.1,
              }}
            >
              WWW.NHIT.IN
            </div>
          </div>

          <div style={{ width: "2px", height: "60px", backgroundColor: "rgba(255,255,255,0.2)" }} />

          {/* Quick Enquire Button */}
          <div
            style={{
              backgroundColor: "#FF9D32",
              color: "#030D1A",
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 900,
              fontSize: "16px",
              padding: "16px 32px",
              borderRadius: "50px",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              boxShadow: "0 6px 20px rgba(255,157,50,0.4)",
            }}
          >
            ENQUIRE NOW
          </div>
        </div>

        {/* Footer Institutional Tagline */}
        <div
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 800,
            fontSize: "15px",
            color: "#94A3B8",
            letterSpacing: "3px",
            textTransform: "uppercase",
          }}
        >
          NHIT DURGAPUR — “SHAPING ENGINEERS, BUILDING FUTURES.”
        </div>
      </div>

      <LightSweep progress={sweep} color="#087EFF" width={320} angle={25} />
    </AbsoluteFill>
  );
};

