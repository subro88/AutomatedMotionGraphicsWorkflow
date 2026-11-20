import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  AbsoluteFill,
} from "remotion";
import { NHIT_THEME } from "../../styles/nhitTheme";
import { BlueprintBackground } from "../../components/nhit/BlueprintBackground";
import { ParticleSystem } from "../../components/nhit/ParticleSystem";

interface EligibilityCardProps {
  title: string;
  subtitle: string;
  badge: string;
  isOrange?: boolean;
  delay: number;
  highlightStat?: string;
}

const EligibilityCard: React.FC<EligibilityCardProps> = ({
  title,
  subtitle,
  badge,
  isOrange = false,
  delay,
  highlightStat,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const spr = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 100, mass: 0.8 },
  });

  const translateY = interpolate(spr, [0, 1], [40, 0]);
  const opacity = interpolate(spr, [0, 0.4], [0, 1]);
  const scale = interpolate(spr, [0, 1], [0.85, 1.0]);

  const checkSpr = spring({
    frame: Math.max(0, frame - delay - 10),
    fps,
    config: { damping: 90, mass: 0.7 },
  });
  const checkScale = interpolate(checkSpr, [0, 1], [0, 1]);

  const borderColor = isOrange
    ? NHIT_THEME.colors.industrialOrange
    : NHIT_THEME.colors.electricBlue;
  const shadowColor = isOrange
    ? NHIT_THEME.colors.industrialOrangeGlow
    : NHIT_THEME.colors.electricBlueGlow;

  return (
    <div
      style={{
        flex: 1,
        minWidth: 260,
        backgroundColor: NHIT_THEME.colors.bgCard,
        border: `2px solid ${borderColor}`,
        borderRadius: 14,
        padding: "24px 20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 16px ${shadowColor}`,
        transform: `translateY(${translateY}px) scale(${scale})`,
        opacity,
        position: "relative",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Category Badge & Checkmark */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 14,
        }}
      >
        <span
          style={{
            fontFamily: NHIT_THEME.fonts.mono,
            fontSize: 11,
            fontWeight: "bold",
            color: borderColor,
            letterSpacing: "0.15em",
          }}
        >
          {badge}
        </span>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            backgroundColor: borderColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${checkScale})`,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M 5 12 L 10 17 L 19 7"
              stroke="#041122"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Main Title */}
      <div>
        <h3
          style={{
            margin: "0 0 8px 0",
            fontFamily: NHIT_THEME.fonts.headline,
            fontSize: 26,
            fontWeight: 900,
            color: NHIT_THEME.colors.white,
            letterSpacing: "0.02em",
          }}
        >
          {title}
        </h3>

        {/* Highlight Stat (for 1 YEAR EXP) */}
        {highlightStat && (
          <div
            style={{
              margin: "6px 0 10px 0",
              display: "inline-block",
              padding: "4px 12px",
              borderRadius: 6,
              backgroundColor: "rgba(255, 157, 50, 0.2)",
              border: `1px solid ${NHIT_THEME.colors.industrialOrange}`,
              fontFamily: NHIT_THEME.fonts.headline,
              fontSize: 18,
              fontWeight: 900,
              color: NHIT_THEME.colors.industrialOrange,
            }}
          >
            {highlightStat}
          </div>
        )}

        <p
          style={{
            margin: 0,
            fontFamily: NHIT_THEME.fonts.body,
            fontSize: 13,
            color: NHIT_THEME.colors.textMuted,
            lineHeight: 1.45,
          }}
        >
          {subtitle}
        </p>
      </div>

      {/* Verification footer tag */}
      <div
        style={{
          marginTop: 18,
          paddingTop: 10,
          borderTop: "1px solid rgba(255,255,255,0.08)",
          fontFamily: NHIT_THEME.fonts.mono,
          fontSize: 10,
          color: NHIT_THEME.colors.textSubtle,
        }}
      >
        ELIGIBILITY VERIFIED &bull; AICTE NORMS
      </div>
    </div>
  );
};

export const Scene04Eligibility: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Headline Entrance (Frame 5-30)
  const headSpr = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: { damping: 100, mass: 0.8 },
  });
  const headY = interpolate(headSpr, [0, 1], [-30, 0]);
  const headOp = interpolate(headSpr, [0, 0.4], [0, 1]);

  // 50KM Radial Ring Animation
  const ringProgress = interpolate(frame, [45, 95], [0, 360], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Transition Out: Cards collapse towards center (Frames 130-150)
  const exitSpr = spring({
    frame: Math.max(0, frame - 130),
    fps,
    config: { damping: 95, mass: 0.85 },
  });
  const collapseScale = interpolate(exitSpr, [0, 1], [1, 0.05]);
  const collapseOpacity = interpolate(exitSpr, [0, 0.8], [1, 0]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: NHIT_THEME.colors.bgNavy,
        overflow: "hidden",
      }}
    >
      <BlueprintBackground pulseGlow />
      <ParticleSystem count={25} />

      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "40px 80px 30px 80px",
          transform: `scale(${collapseScale})`,
          opacity: collapseOpacity,
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Top Header */}
        <div
          style={{
            transform: `translateY(${headY}px)`,
            opacity: headOp,
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "4px 18px",
              borderRadius: 20,
              backgroundColor: "rgba(8, 126, 255, 0.15)",
              border: `1px solid ${NHIT_THEME.colors.electricBlue}`,
              fontFamily: NHIT_THEME.fonts.mono,
              fontSize: 12,
              fontWeight: "bold",
              color: NHIT_THEME.colors.electricBlue,
              letterSpacing: "0.2em",
              marginBottom: 8,
            }}
          >
            ADMISSION ELIGIBILITY CRITERIA // 2026–27
          </div>

          <h1
            style={{
              margin: 0,
              fontFamily: NHIT_THEME.fonts.headline,
              fontSize: 52,
              fontWeight: 900,
              color: NHIT_THEME.colors.white,
              letterSpacing: "0.02em",
              textTransform: "uppercase",
            }}
          >
            ARE YOU <span style={{ color: NHIT_THEME.colors.industrialOrange }}>ELIGIBLE?</span>
          </h1>
        </div>

        {/* 4 Eligibility Cards Grid */}
        <div
          style={{
            display: "flex",
            gap: 20,
            width: "100%",
            margin: "15px 0",
          }}
        >
          <EligibilityCard
            title="10+2 SCIENCE"
            subtitle="Passed with the applicable qualifying science and mathematics subjects."
            badge="ROUTE A"
            delay={15}
          />

          <EligibilityCard
            title="10+2 VOCATIONAL"
            subtitle="Passed with an appropriate Technical Vocational subject stream."
            badge="ROUTE B"
            delay={25}
          />

          <EligibilityCard
            title="CLASS 10 + ITI"
            subtitle="Two-year continuous ITI qualification in an appropriate engineering trade."
            badge="ROUTE C"
            delay={35}
          />

          <EligibilityCard
            title="WORK EXPERIENCE"
            highlightStat="MIN. 1 YEAR REGULAR EXP."
            subtitle="Full-time regular employment in a registered industrial organization."
            badge="MANDATORY CRITERIA"
            isOrange
            delay={45}
          />
        </div>

        {/* Bottom Radial 50 KM Distance Ring & Legal Notice */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "14px 28px",
            backgroundColor: "rgba(7, 27, 51, 0.8)",
            borderRadius: 12,
            border: `1.5px solid rgba(8, 126, 255, 0.35)`,
          }}
        >
          {/* 50 KM Radar Indicator */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ position: "relative", width: 50, height: 50 }}>
              <svg width="50" height="50" viewBox="0 0 50 50">
                <circle cx="25" cy="25" r="21" fill="none" stroke="#163860" strokeWidth="3" />
                <circle
                  cx="25"
                  cy="25"
                  r="21"
                  fill="none"
                  stroke={NHIT_THEME.colors.industrialOrange}
                  strokeWidth="3.5"
                  strokeDasharray="132"
                  strokeDashoffset={132 - (132 * ringProgress) / 360}
                  strokeLinecap="round"
                  transform="rotate(-90 25 25)"
                />
                <circle cx="25" cy="25" r="4" fill="#FFFFFF" />
              </svg>
            </div>
            <div>
              <div
                style={{
                  fontFamily: NHIT_THEME.fonts.headline,
                  fontSize: 16,
                  fontWeight: 900,
                  color: NHIT_THEME.colors.industrialOrange,
                }}
              >
                LOCATION REQUIREMENT: WITHIN 50 KM
              </div>
              <div
                style={{
                  fontFamily: NHIT_THEME.fonts.body,
                  fontSize: 12,
                  color: NHIT_THEME.colors.textMuted,
                }}
              >
                Eligible workplace located within a 50 KM radial distance of NHIT Durgapur campus.
              </div>
            </div>
          </div>

          {/* Legal Notice Text */}
          <div
            style={{
              maxWidth: 620,
              textAlign: "right",
              fontFamily: NHIT_THEME.fonts.mono,
              fontSize: 10,
              color: NHIT_THEME.colors.textSubtle,
              lineHeight: 1.4,
            }}
          >
            *Summary description of AICTE Working Professional &amp; lateral-entry eligibility routes.
            Final eligibility is subject to verification under applicable Council notification.
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

