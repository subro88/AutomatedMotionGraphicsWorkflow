import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Audio,
  staticFile,
} from "remotion";

export interface TaskFlowPromoProps {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  brandName?: string;
  tagline?: string;
  chaosHeadlineBad?: string;
  chaosHeadlineGood?: string;
  aiBadgeText?: string;
  focusScore?: number;
  statPill1?: string;
  statPill2?: string;
  statPill3?: string;
  ctaButtonText?: string;
  ctaButtonUrl?: string;
  springDamping?: number;
  springMass?: number;
  particleCount?: number;
  glowIntensity?: number;
}

export const TaskFlowPromo: React.FC<TaskFlowPromoProps> = ({
  primaryColor = "#0066FF",
  secondaryColor = "#8B5CF6",
  accentColor = "#00FF88",
  backgroundColor = "#0A0A0F",
  brandName = "TaskFlow",
  tagline = "Get Things Done. Effortlessly.",
  chaosHeadlineBad = "Scattered Tasks. Lost Momentum.",
  chaosHeadlineGood = "From Endless Chaos... to Absolute Clarity.",
  aiBadgeText = "+3.4 Hours Saved Today",
  focusScore = 94.8,
  statPill1 = "48 Tasks Crushed",
  statPill2 = "10x Faster",
  statPill3 = "Top 1% Global",
  ctaButtonText = "Start Free Trial",
  ctaButtonUrl = "taskflow.app",
  springDamping = 100,
  springMass = 0.5,
  particleCount = 20,
  glowIntensity = 1.0,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const isVertical = height > width;
  const contentScale = isVertical ? 0.8 : 1.0;

  // Global Audio Track (Voice Box Narration & Electronic Beat)
  // Audio file generated via Voice Box: public/taskflow_voice.wav
  const audioSrc = staticFile("taskflow_voice.wav");

  // =========================================================================
  // SCENE 1: EXPLOSIVE LOGO REVEAL (Frames 0-90 | 0-3s)
  // =========================================================================
  const s1Active = frame < 95;
  const s1Progress = interpolate(frame, [0, 90], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Spring scale: 0 -> 1.5 -> 1.0 with damping
  const logoScaleRaw = spring({
    frame: frame - 8,
    fps,
    config: { damping: springDamping, mass: springMass, stiffness: 120 },
  });
  const logoScale = interpolate(logoScaleRaw, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // 360 degree rotation entry
  const logoRotation = interpolate(frame, [8, 48], [0, 360], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Particle radial burst system
  const s1Particles = Array.from({ length: Math.max(5, particleCount) }).map((_, i) => {
    const angle = (i * Math.PI * 2) / Math.max(5, particleCount);
    const distance = interpolate(frame, [15, 60], [0, isVertical ? 240 : 360], {
      extrapolateRight: "clamp",
      extrapolateLeft: "clamp",
    });
    const pOpacity = interpolate(frame, [15, 35, 65], [0, 1, 0], {
      extrapolateRight: "clamp",
      extrapolateLeft: "clamp",
    });
    const pSize = interpolate(frame, [15, 60], [14, 3], {
      extrapolateRight: "clamp",
      extrapolateLeft: "clamp",
    });
    const colors = [primaryColor, secondaryColor, accentColor, "#FFFFFF"];
    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      opacity: pOpacity,
      size: pSize,
      color: colors[i % colors.length],
    };
  });

  // Brand text spring entry
  const s1TextScale = spring({
    frame: frame - 28,
    fps,
    config: { damping: 90, mass: 0.6, stiffness: 110 },
  });
  const s1TaglineOpacity = interpolate(frame, [42, 60], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Scene 1 exit fade
  const s1ExitOpacity = interpolate(frame, [82, 92], [1, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // =========================================================================
  // SCENE 2: CHAOS TO CLARITY (Frames 90-210 | 3-7s)
  // =========================================================================
  const s2Active = frame >= 85 && frame < 215;
  const s2Frame = frame - 90;

  // Scene 2 general opacity
  const s2Opacity = interpolate(
    frame,
    [88, 96, 202, 212],
    [0, 1, 1, 0],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  // Shockwave ring at s2Frame = 35 (frame 125)
  const shockwaveScale = interpolate(s2Frame, [35, 75], [0.1, 4.5], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const shockwaveOpacity = interpolate(
    s2Frame,
    [35, 45, 75],
    [0, 0.85, 0],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  // Cards state: 0 = chaotic, 1 = snapped into clean grid
  const snapSpring = spring({
    frame: s2Frame - 38,
    fps,
    config: { damping: 95, mass: 0.7, stiffness: 130 },
  });

  // 6 Task cards data
  const chaosCards = [
    {
      title: "Quarterly Revenue Deck",
      badBadge: "🔴 OVERDUE",
      goodBadge: "✓ AUTO-SCHEDULED",
      time: "2.5h",
      chaosX: -260,
      chaosY: -140,
      chaosRot: -14,
      gridCol: 0,
      gridRow: 0,
    },
    {
      title: "28 Unread Slack Threads",
      badBadge: "⚠️ BLOCKED",
      goodBadge: "✓ AI SUMMARIZED",
      time: "45m",
      chaosX: 280,
      chaosY: -180,
      chaosRot: 16,
      gridCol: 1,
      gridRow: 0,
    },
    {
      title: "Meeting Conflict (2:00 PM)",
      badBadge: "⏰ OVERLAP",
      goodBadge: "✓ RESOLVED",
      time: "1.0h",
      chaosX: -320,
      chaosY: 90,
      chaosRot: -8,
      gridCol: 2,
      gridRow: 0,
    },
    {
      title: "Critical Bug in Auth Flow",
      badBadge: "🔥 P0 BLOCKER",
      goodBadge: "✓ DELEGATED",
      time: "1.5h",
      chaosX: 310,
      chaosY: 120,
      chaosRot: 12,
      gridCol: 0,
      gridRow: 1,
    },
    {
      title: "Product Roadmap V3",
      badBadge: "⏳ DELAYED",
      goodBadge: "✓ PROTECTED FOCUS",
      time: "3.0h",
      chaosX: -90,
      chaosY: -220,
      chaosRot: 7,
      gridCol: 1,
      gridRow: 1,
    },
    {
      title: "Sprint Retrospective",
      badBadge: "📋 PENDING",
      goodBadge: "✓ OPTIMIZED",
      time: "30m",
      chaosX: 80,
      chaosY: 210,
      chaosRot: -15,
      gridCol: 2,
      gridRow: 1,
    },
  ];

  // =========================================================================
  // SCENE 3: AI AUTO-SCHEDULER (Frames 210-360 | 7-12s)
  // =========================================================================
  const s3Active = frame >= 205 && frame < 365;
  const s3Frame = frame - 210;

  const s3Opacity = interpolate(
    frame,
    [208, 218, 352, 362],
    [0, 1, 1, 0],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  // AI Scanner line beam sweeping vertically down
  const scanBeamY = interpolate(s3Frame, [20, 85], [-50, 420], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const scanBeamOpacity = interpolate(s3Frame, [18, 28, 80, 90], [0, 0.9, 0.9, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Timeline slots flying into place with spring damping: 100
  const slotSpring1 = spring({
    frame: s3Frame - 12,
    fps,
    config: { damping: 100, mass: 0.5 },
  });
  const slotSpring2 = spring({
    frame: s3Frame - 22,
    fps,
    config: { damping: 100, mass: 0.5 },
  });
  const slotSpring3 = spring({
    frame: s3Frame - 32,
    fps,
    config: { damping: 100, mass: 0.5 },
  });

  // AI Floating badge bounce
  const aiBadgeScale = spring({
    frame: s3Frame - 58,
    fps,
    config: { damping: 90, mass: 0.6, stiffness: 140 },
  });

  // =========================================================================
  // SCENE 4: SPOTIFY WRAPPED-STYLE METRICS (Frames 360-480 | 12-16s)
  // =========================================================================
  const s4Active = frame >= 355 && frame < 485;
  const s4Frame = frame - 360;

  const s4Opacity = interpolate(
    frame,
    [358, 368, 472, 482],
    [0, 1, 1, 0],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  // Digital counter 0% -> focusScore
  const focusCounter = interpolate(s4Frame, [12, 65], [0, focusScore], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Radial progress ring
  const circleCircumference = 2 * Math.PI * 140; // ~879.6
  const strokeOffset = interpolate(
    s4Frame,
    [12, 65],
    [circleCircumference, circleCircumference * (1 - focusScore / 100)],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  // 3 Staggered Stat Pills (Simultaneous bouncy springs with damping: 110)
  const pillSpring1 = spring({
    frame: s4Frame - 20,
    fps,
    config: { damping: 110, mass: 0.5 },
  });
  const pillSpring2 = spring({
    frame: s4Frame - 30,
    fps,
    config: { damping: 110, mass: 0.5 },
  });
  const pillSpring3 = spring({
    frame: s4Frame - 40,
    fps,
    config: { damping: 110, mass: 0.5 },
  });

  // Celebration floating confetti/sparkle system
  const s4Sparks = Array.from({ length: 24 }).map((_, i) => {
    const seedX = Math.sin(i * 1.7) * 480;
    const speed = 1.2 + (i % 5) * 0.4;
    const yOffset = interpolate(s4Frame, [10, 110], [200, -350 * speed], {
      extrapolateRight: "clamp",
      extrapolateLeft: "clamp",
    });
    const sparkOpacity = interpolate(s4Frame, [10, 35, 95, 115], [0, 0.9, 0.9, 0], {
      extrapolateRight: "clamp",
      extrapolateLeft: "clamp",
    });
    const size = 4 + (i % 4) * 3;
    const color = i % 2 === 0 ? accentColor : (i % 3 === 0 ? primaryColor : secondaryColor);
    return { x: seedX, y: yOffset, opacity: sparkOpacity, size, color };
  });

  // =========================================================================
  // SCENE 5: GRAND FINALE & HERO CALL-TO-ACTION (Frames 480-600 | 16-20s)
  // =========================================================================
  const s5Active = frame >= 475;
  const s5Frame = frame - 480;

  const s5Opacity = interpolate(frame, [478, 490], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // 3D Pullback scale & tilt
  const heroCardScale = spring({
    frame: s5Frame - 5,
    fps,
    config: { damping: 95, mass: 0.8 },
  });

  // Brand Name punch
  const s5TitleScale = spring({
    frame: s5Frame - 15,
    fps,
    config: { damping: 90, mass: 0.5, stiffness: 120 },
  });

  // Tagline spring
  const s5TaglineSpring = spring({
    frame: s5Frame - 28,
    fps,
    config: { damping: 100, mass: 0.6 },
  });

  // CTA Button spring
  const ctaButtonSpring = spring({
    frame: s5Frame - 40,
    fps,
    config: { damping: 90, mass: 0.5, stiffness: 140 },
  });

  // Sheen sweep across button
  const sheenTranslate = interpolate(s5Frame, [55, 105], [-120, 240], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <div
      style={{
        width,
        height,
        backgroundColor,
        position: "relative",
        overflow: "hidden",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        color: "#FFFFFF",
      }}
    >
      {/* Background Audio */}
      <Audio src={audioSrc} />

      {/* Global Ambient Glow & Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 80% 60% at 50% 40%, rgba(0, 102, 255, 0.18), transparent 70%), radial-gradient(ellipse 60% 50% at 80% 80%, rgba(139, 92, 246, 0.14), transparent 60%)`,
          pointerEvents: "none",
        }}
      />

      {/* =================================================================== */}
      {/* SCENE 1: EXPLOSIVE LOGO REVEAL                                      */}
      {/* =================================================================== */}
      {s1Active && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            opacity: s1ExitOpacity,
            transform: `scale(${contentScale})`,
          }}
        >
          {/* Radial Pulse */}
          <div
            style={{
              position: "absolute",
              width: 480,
              height: 480,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${primaryColor}44 0%, transparent 70%)`,
              filter: "blur(40px)",
              transform: `scale(${1 + Math.sin(frame * 0.15) * 0.15})`,
            }}
          />

          {/* Particle Burst System */}
          <div style={{ position: "absolute", width: 0, height: 0 }}>
            {s1Particles.map((p, idx) => (
              <div
                key={idx}
                style={{
                  position: "absolute",
                  left: p.x - p.size / 2,
                  top: p.y - p.size / 2,
                  width: p.size,
                  height: p.size,
                  borderRadius: "50%",
                  backgroundColor: p.color,
                  opacity: p.opacity,
                  boxShadow: `0 0 16px ${p.color}`,
                }}
              />
            ))}
          </div>

          {/* Hero Checkmark Badge */}
          <div
            style={{
              width: 140,
              height: 140,
              borderRadius: 36,
              background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
              boxShadow: `0 0 60px ${primaryColor}99, 0 20px 40px rgba(0,0,0,0.6)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${logoScale}) rotate(${logoRotation}deg)`,
              border: "2px solid rgba(255, 255, 255, 0.4)",
              marginBottom: 32,
              zIndex: 10,
            }}
          >
            <svg width="72" height="72" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 13L9 17L19 7"
                stroke="#FFFFFF"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Brand Name */}
          <h1
            style={{
              fontSize: isVertical ? 64 : 84,
              fontWeight: 900,
              letterSpacing: "-0.04em",
              margin: 0,
              background: `linear-gradient(180deg, #FFFFFF 30%, ${primaryColor} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              transform: `scale(${s1TextScale})`,
              textShadow: `0 0 ${40 * glowIntensity}px ${primaryColor}66`,
              zIndex: 10,
            }}
          >
            {brandName}
          </h1>

          {/* Tagline */}
          <p
            style={{
              fontSize: isVertical ? 24 : 32,
              fontWeight: 500,
              color: "rgba(255, 255, 255, 0.8)",
              margin: "12px 0 0 0",
              opacity: s1TaglineOpacity,
              letterSpacing: "-0.01em",
              zIndex: 10,
            }}
          >
            {tagline}
          </p>
        </div>
      )}

      {/* =================================================================== */}
      {/* SCENE 2: CHAOS TO CLARITY                                           */}
      {/* =================================================================== */}
      {s2Active && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            opacity: s2Opacity,
            transform: `scale(${contentScale})`,
          }}
        >
          {/* Shockwave Expand */}
          <div
            style={{
              position: "absolute",
              width: 300,
              height: 300,
              borderRadius: "50%",
              border: `4px solid ${accentColor}`,
              boxShadow: `0 0 40px ${accentColor}`,
              transform: `scale(${shockwaveScale})`,
              opacity: shockwaveOpacity,
              pointerEvents: "none",
            }}
          />

          {/* Section Kinetic Header */}
          <div style={{ textAlign: "center", marginBottom: 36, zIndex: 10 }}>
            <span
              style={{
                fontSize: 14,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                color: s2Frame > 40 ? accentColor : "#FF3B30",
                transition: "color 0.3s",
              }}
            >
              {s2Frame > 40 ? "⚡ Smart Synchronization" : "⚠️ Workflow Breakdown"}
            </span>
            <h2
              style={{
                fontSize: isVertical ? 42 : 54,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                margin: "8px 0 0 0",
              }}
            >
              {s2Frame > 40 ? (
                <span style={{ color: accentColor }}>{chaosHeadlineGood}</span>
              ) : (
                <span style={{ color: "#FF3B30" }}>{chaosHeadlineBad}</span>
              )}
            </h2>
          </div>

          {/* Cards Container */}
          <div
            style={{
              position: "relative",
              width: isVertical ? 380 : 980,
              height: isVertical ? 600 : 360,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {chaosCards.map((card, idx) => {
              // Grid positions (3 columns x 2 rows in 16:9, or 2 cols x 3 rows in 9:16)
              const targetX = isVertical
                ? (idx % 2 === 0 ? -95 : 95)
                : (card.gridCol - 1) * 320;
              const targetY = isVertical
                ? (Math.floor(idx / 2) - 1) * 160
                : (card.gridRow === 0 ? -80 : 80);

              const curX = interpolate(snapSpring, [0, 1], [card.chaosX, targetX], {
                extrapolateRight: "clamp",
                extrapolateLeft: "clamp",
              });
              const curY = interpolate(snapSpring, [0, 1], [card.chaosY, targetY], {
                extrapolateRight: "clamp",
                extrapolateLeft: "clamp",
              });
              const curRot = interpolate(snapSpring, [0, 1], [card.chaosRot, 0], {
                extrapolateRight: "clamp",
                extrapolateLeft: "clamp",
              });

              const isResolved = s2Frame > 42;

              return (
                <div
                  key={idx}
                  style={{
                    position: "absolute",
                    width: isVertical ? 180 : 290,
                    padding: isVertical ? "14px 12px" : "18px 20px",
                    borderRadius: 20,
                    backgroundColor: isResolved
                      ? "rgba(10, 20, 35, 0.75)"
                      : "rgba(35, 15, 20, 0.75)",
                    border: `1.5px solid ${
                      isResolved
                        ? "rgba(0, 255, 136, 0.4)"
                        : "rgba(255, 59, 48, 0.4)"
                    }`,
                    backdropFilter: "blur(18px)",
                    boxShadow: isResolved
                      ? "0 10px 30px rgba(0, 255, 136, 0.15)"
                      : "0 10px 30px rgba(255, 59, 48, 0.2)",
                    transform: `translate(${curX}px, ${curY}px) rotate(${curRot}deg)`,
                    transition: "border 0.2s, background-color 0.2s",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "3px 8px",
                        borderRadius: 12,
                        backgroundColor: isResolved
                          ? "rgba(0, 255, 136, 0.2)"
                          : "rgba(255, 59, 48, 0.2)",
                        color: isResolved ? accentColor : "#FF453A",
                        letterSpacing: "0.02em",
                      }}
                    >
                      {isResolved ? card.goodBadge : card.badBadge}
                    </span>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                      {card.time}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: isVertical ? 13 : 15,
                      fontWeight: 600,
                      color: "#FFFFFF",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {card.title}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* SCENE 3: AI AUTO-SCHEDULER                                          */}
      {/* =================================================================== */}
      {s3Active && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            opacity: s3Opacity,
            transform: `scale(${contentScale})`,
          }}
        >
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 32, zIndex: 10 }}>
            <span
              style={{
                fontSize: 14,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                color: secondaryColor,
              }}
            >
              Autonomous Scheduling
            </span>
            <h2
              style={{
                fontSize: isVertical ? 40 : 54,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                margin: "8px 0 0 0",
              }}
            >
              Zero Overlaps. <span style={{ color: secondaryColor }}>Perfect Execution.</span>
            </h2>
          </div>

          {/* Timeline Board Mockup */}
          <div
            style={{
              position: "relative",
              width: isVertical ? 380 : 860,
              height: isVertical ? 540 : 380,
              borderRadius: 28,
              backgroundColor: "rgba(15, 15, 25, 0.8)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              backdropFilter: "blur(20px)",
              padding: 24,
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.6)",
              overflow: "hidden",
            }}
          >
            {/* Laser Scan Line */}
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: scanBeamY,
                height: 3,
                background: `linear-gradient(90deg, transparent, ${secondaryColor}, ${primaryColor}, transparent)`,
                boxShadow: `0 0 24px ${secondaryColor}, 0 0 12px ${primaryColor}`,
                opacity: scanBeamOpacity,
                zIndex: 20,
              }}
            />

            {/* Time Marker Ticks */}
            {["09:00 AM", "11:30 AM", "02:00 PM", "04:30 PM"].map((t, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  height: isVertical ? 85 : 65,
                  borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    fontFamily: "monospace",
                    color: "rgba(255, 255, 255, 0.4)",
                    width: 75,
                  }}
                >
                  {t}
                </span>
                <div
                  style={{
                    flex: 1,
                    height: 1,
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                  }}
                />
              </div>
            ))}

            {/* Auto-Optimized Floating Task Blocks */}
            {/* Block 1 */}
            <div
              style={{
                position: "absolute",
                left: isVertical ? 90 : 120,
                top: 32,
                right: 24,
                height: 60,
                borderRadius: 16,
                background: `linear-gradient(135deg, ${primaryColor}33, ${primaryColor}11)`,
                border: `1.5px solid ${primaryColor}88`,
                padding: "12px 18px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                transform: `translateX(${(1 - slotSpring1) * 300}px)`,
                boxShadow: `0 8px 24px ${primaryColor}33`,
              }}
            >
              <div>
                <div style={{ fontSize: 11, color: primaryColor, fontWeight: 700 }}>
                  DEEP WORK SESSION
                </div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>
                  Architect Neural Pipeline V2
                </div>
              </div>
              <div
                style={{
                  fontSize: 12,
                  padding: "4px 10px",
                  borderRadius: 10,
                  backgroundColor: `${primaryColor}44`,
                  color: "#FFFFFF",
                  fontWeight: 600,
                }}
              >
                Locked ⚡
              </div>
            </div>

            {/* Block 2 */}
            <div
              style={{
                position: "absolute",
                left: isVertical ? 90 : 120,
                top: isVertical ? 120 : 105,
                right: 24,
                height: 60,
                borderRadius: 16,
                background: `linear-gradient(135deg, ${secondaryColor}33, ${secondaryColor}11)`,
                border: `1.5px solid ${secondaryColor}88`,
                padding: "12px 18px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                transform: `translateX(${(1 - slotSpring2) * 300}px)`,
                boxShadow: `0 8px 24px ${secondaryColor}33`,
              }}
            >
              <div>
                <div style={{ fontSize: 11, color: secondaryColor, fontWeight: 700 }}>
                  SYNCHRONIZED SPRINT
                </div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>
                  Global Executive Strategy Sync
                </div>
              </div>
              <div
                style={{
                  fontSize: 12,
                  padding: "4px 10px",
                  borderRadius: 10,
                  backgroundColor: `${secondaryColor}44`,
                  color: "#FFFFFF",
                  fontWeight: 600,
                }}
              >
                Zero Conflict
              </div>
            </div>

            {/* Block 3 */}
            <div
              style={{
                position: "absolute",
                left: isVertical ? 90 : 120,
                top: isVertical ? 210 : 180,
                right: 24,
                height: 60,
                borderRadius: 16,
                background: `linear-gradient(135deg, ${accentColor}33, ${accentColor}11)`,
                border: `1.5px solid ${accentColor}88`,
                padding: "12px 18px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                transform: `translateX(${(1 - slotSpring3) * 300}px)`,
                boxShadow: `0 8px 24px ${accentColor}33`,
              }}
            >
              <div>
                <div style={{ fontSize: 11, color: accentColor, fontWeight: 700 }}>
                  HIGH-LEVERAGE SPRINT
                </div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>
                  Motion Graphics Engine Release
                </div>
              </div>
              <div
                style={{
                  fontSize: 12,
                  padding: "4px 10px",
                  borderRadius: 10,
                  backgroundColor: `${accentColor}44`,
                  color: "#FFFFFF",
                  fontWeight: 600,
                }}
              >
                100% On Time
              </div>
            </div>

            {/* AI Optimization Banner Pill */}
            <div
              style={{
                position: "absolute",
                bottom: 20,
                left: 24,
                right: 24,
                padding: "14px 20px",
                borderRadius: 18,
                background: `linear-gradient(90deg, ${secondaryColor}dd, ${primaryColor}dd)`,
                boxShadow: `0 10px 30px ${secondaryColor}66`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                transform: `scale(${aiBadgeScale})`,
                zIndex: 30,
              }}
            >
              <span style={{ fontSize: 20 }}>✨</span>
              <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: "0.01em" }}>
                AI Schedule Optimization: <b>{aiBadgeText}</b>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* SCENE 4: SPOTIFY WRAPPED-STYLE METRICS                               */}
      {/* =================================================================== */}
      {s4Active && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            opacity: s4Opacity,
            transform: `scale(${contentScale})`,
          }}
        >
          {/* Confetti & Sparkles */}
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            {s4Sparks.map((sp, idx) => (
              <div
                key={idx}
                style={{
                  position: "absolute",
                  left: width / 2 + sp.x,
                  top: height / 2 + sp.y,
                  width: sp.size,
                  height: sp.size,
                  backgroundColor: sp.color,
                  borderRadius: "50%",
                  boxShadow: `0 0 14px ${sp.color}`,
                  opacity: sp.opacity,
                }}
              />
            ))}
          </div>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 28, zIndex: 10 }}>
            <span
              style={{
                fontSize: 14,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                color: accentColor,
              }}
            >
              Your Productivity Wrapped
            </span>
            <h2
              style={{
                fontSize: isVertical ? 42 : 56,
                fontWeight: 900,
                letterSpacing: "-0.03em",
                margin: "8px 0 0 0",
              }}
            >
              Unmatched Momentum.
            </h2>
          </div>

          {/* Radial Ring Gauge */}
          <div
            style={{
              position: "relative",
              width: 320,
              height: 320,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 32,
              zIndex: 10,
            }}
          >
            <svg width="320" height="320" viewBox="0 0 320 320">
              {/* Background Track */}
              <circle
                cx="160"
                cy="160"
                r="140"
                fill="none"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="18"
              />
              {/* Active Neon Green Gauge */}
              <circle
                cx="160"
                cy="160"
                r="140"
                fill="none"
                stroke={accentColor}
                strokeWidth="18"
                strokeDasharray={circleCircumference}
                strokeDashoffset={strokeOffset}
                strokeLinecap="round"
                transform="rotate(-90 160 160)"
                style={{
                  filter: `drop-shadow(0 0 16px ${accentColor})`,
                }}
              />
            </svg>

            {/* Numerical Center Ticker */}
            <div
              style={{
                position: "absolute",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  fontSize: 64,
                  fontWeight: 900,
                  letterSpacing: "-0.04em",
                  color: "#FFFFFF",
                  fontVariantNumeric: "tabular-nums",
                  textShadow: `0 0 30px ${accentColor}88`,
                }}
              >
                {focusCounter.toFixed(1)}%
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  color: accentColor,
                  textTransform: "uppercase",
                  marginTop: -4,
                }}
              >
                Deep Focus Score
              </div>
            </div>
          </div>

          {/* Staggered Floating Stat Pills */}
          <div
            style={{
              display: "flex",
              flexDirection: isVertical ? "column" : "row",
              gap: 16,
              zIndex: 10,
            }}
          >
            <div
              style={{
                padding: "14px 24px",
                borderRadius: 20,
                backgroundColor: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(14px)",
                display: "flex",
                alignItems: "center",
                gap: 12,
                transform: `scale(${pillSpring1})`,
                boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
              }}
            >
              <span style={{ fontSize: 22 }}>🔥</span>
              <div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>Tasks Completed</div>
                <div style={{ fontSize: 17, fontWeight: 700 }}>{statPill1}</div>
              </div>
            </div>

            <div
              style={{
                padding: "14px 24px",
                borderRadius: 20,
                backgroundColor: "rgba(255, 255, 255, 0.06)",
                border: `1px solid ${primaryColor}66`,
                backdropFilter: "blur(14px)",
                display: "flex",
                alignItems: "center",
                gap: 12,
                transform: `scale(${pillSpring2})`,
                boxShadow: `0 10px 25px ${primaryColor}33`,
              }}
            >
              <span style={{ fontSize: 22 }}>⚡</span>
              <div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>Velocity Multiplier</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: primaryColor }}>{statPill2}</div>
              </div>
            </div>

            <div
              style={{
                padding: "14px 24px",
                borderRadius: 20,
                backgroundColor: "rgba(255, 255, 255, 0.06)",
                border: `1px solid ${accentColor}66`,
                backdropFilter: "blur(14px)",
                display: "flex",
                alignItems: "center",
                gap: 12,
                transform: `scale(${pillSpring3})`,
                boxShadow: `0 10px 25px ${accentColor}33`,
              }}
            >
              <span style={{ fontSize: 22 }}>🎯</span>
              <div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>Delivery Reliability</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: accentColor }}>{statPill3}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* SCENE 5: GRAND FINALE & HERO CALL-TO-ACTION                         */}
      {/* =================================================================== */}
      {s5Active && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            opacity: s5Opacity,
            transform: `scale(${contentScale})`,
          }}
        >
          {/* Apple-style Perspective Pullback Card Backglow */}
          <div
            style={{
              position: "absolute",
              width: isVertical ? 420 : 880,
              height: isVertical ? 580 : 440,
              borderRadius: 36,
              background: `radial-gradient(circle at 50% 30%, ${primaryColor}44 0%, ${secondaryColor}22 50%, transparent 80%)`,
              filter: "blur(50px)",
              transform: `scale(${heroCardScale})`,
              pointerEvents: "none",
            }}
          />

          {/* Logo Mark */}
          <div
            style={{
              width: 100,
              height: 100,
              borderRadius: 26,
              background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
              boxShadow: `0 0 50px ${primaryColor}aa`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${s5TitleScale})`,
              border: "2px solid rgba(255, 255, 255, 0.5)",
              marginBottom: 24,
              zIndex: 10,
            }}
          >
            <svg width="52" height="52" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 13L9 17L19 7"
                stroke="#FFFFFF"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Brand Headline */}
          <h1
            style={{
              fontSize: isVertical ? 60 : 80,
              fontWeight: 900,
              letterSpacing: "-0.04em",
              margin: 0,
              background: `linear-gradient(180deg, #FFFFFF 40%, ${primaryColor} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              transform: `scale(${s5TitleScale})`,
              textShadow: `0 0 ${50 * glowIntensity}px ${primaryColor}88`,
              zIndex: 10,
            }}
          >
            {brandName}
          </h1>

          {/* Tagline */}
          <p
            style={{
              fontSize: isVertical ? 26 : 34,
              fontWeight: 500,
              color: "rgba(255, 255, 255, 0.9)",
              margin: "12px 0 36px 0",
              transform: `scale(${s5TaglineSpring})`,
              letterSpacing: "-0.01em",
              zIndex: 10,
              textAlign: "center",
            }}
          >
            {tagline}
          </p>

          {/* Hero Call-to-Action Pill Button */}
          <div
            style={{
              position: "relative",
              padding: isVertical ? "18px 36px" : "22px 54px",
              borderRadius: 40,
              background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
              border: `2px solid ${accentColor}`,
              boxShadow: `0 0 ${40 * glowIntensity}px ${primaryColor}aa, 0 10px 30px rgba(0, 0, 0, 0.6)`,
              transform: `scale(${ctaButtonSpring})`,
              overflow: "hidden",
              zIndex: 10,
            }}
          >
            {/* Glossy Sheen Sweep */}
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                width: 80,
                background:
                  "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent)",
                transform: `translateX(${sheenTranslate}px) skewX(-25deg)`,
                pointerEvents: "none",
              }}
            />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                fontSize: isVertical ? 20 : 24,
                fontWeight: 800,
                color: "#FFFFFF",
                letterSpacing: "-0.01em",
              }}
            >
              <span>{ctaButtonText}</span>
              <span style={{ color: accentColor }}>→</span>
              <span style={{ opacity: 0.75, fontWeight: 500, fontSize: isVertical ? 16 : 18 }}>
                {ctaButtonUrl}
              </span>
            </div>
          </div>

          {/* Micro Footer */}
          <div
            style={{
              fontSize: 13,
              color: "rgba(255, 255, 255, 0.4)",
              letterSpacing: "0.04em",
              marginTop: 20,
              zIndex: 10,
            }}
          >
            No Credit Card Required • Instant Cloud Sync • macOS & Windows
          </div>
        </div>
      )}
    </div>
  );
};

