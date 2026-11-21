import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, Audio, staticFile } from "remotion";
import { THEME } from "../theme";
import { KineticSubtitleEngine } from "../components/KineticSubtitleEngine";
import { CurvedSpline } from "../components/CurvedSpline";
import { ElevatedCard, ComponentSvgIcon } from "../components/VectorComponents";

export const Scene02Vertical: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ---------------------------------------------------------
  // PHASE CHOREOGRAPHY
  // Phase 1: 0 - 248    Intro Definition
  // Phase 2: 248 - 452  Monday Full Baseline (100 GB)
  // Phase 3: 452 - 573  Tuesday Delta (2.4 GB) + Spline 1
  // Phase 4: 573 - 706  Wednesday Delta (3.1 GB) + Spline 2
  // Phase 5: 706 - 791  Thursday Delta (1.8 GB) + Spline 3
  // Phase 6: 791 - 1115 Storage & Transfer Efficiency Metric
  // Phase 7: 1115 - 1510 Chain Dependency & Corruption Risk
  // ---------------------------------------------------------

  // Phase 1 Entrance
  const heroEntrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 85 },
  });

  // Phase 2: Monday Baseline Card Entrance
  const mondaySpring = spring({
    frame: frame - 248,
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  // Phase 3: Tuesday Delta Card Entrance + Spline 1
  const tuesdaySpring = spring({
    frame: frame - 452,
    fps,
    config: { damping: 13, stiffness: 100 },
  });
  const spline1Progress = interpolate(frame, [460, 500], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 4: Wednesday Delta Card Entrance + Spline 2
  const wednesdaySpring = spring({
    frame: frame - 573,
    fps,
    config: { damping: 13, stiffness: 100 },
  });
  const spline2Progress = interpolate(frame, [580, 620], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 5: Thursday Delta Card Entrance + Spline 3
  const thursdaySpring = spring({
    frame: frame - 706,
    fps,
    config: { damping: 13, stiffness: 100 },
  });
  const spline3Progress = interpolate(frame, [715, 755], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 6: Efficiency Callout Entrance
  const efficiencySpring = spring({
    frame: frame - 791,
    fps,
    config: { damping: 14, stiffness: 95 },
  });

  // Phase 7: Chain Risk Alert Spring & Broken State
  const riskSpring = spring({
    frame: frame - 1115,
    fps,
    config: { damping: 12, stiffness: 110 },
  });
  const isChainBroken = frame >= 1115;
  const breakPulse = isChainBroken ? 0.5 + 0.5 * Math.sin((frame - 1115) * 0.2) : 0;

  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        background: THEME.colors.cream,
        backgroundImage: "radial-gradient(rgba(41, 37, 36, 0.08) 1.2px, transparent 1.2px)",
        backgroundSize: "28px 28px",
        padding: "80px 70px 70px 70px",
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
        fontFamily: THEME.typography.fontFamily,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Audio src={staticFile("incremental_backup/scene2.wav")} />

      {/* Top Category Badge */}
      <div
        style={{
          padding: "10px 28px",
          borderRadius: "9999px",
          background: isChainBroken ? "#EF4444" : THEME.colors.blue,
          color: "#FFFFFF",
          fontSize: "15px",
          fontWeight: 800,
          letterSpacing: "0.1em",
          boxShadow: `0 8px 24px ${isChainBroken ? "rgba(239, 68, 68, 0.35)" : "rgba(2, 132, 199, 0.35)"}`,
          transform: `scale(${heroEntrance})`,
          transition: "background 0.3s ease",
        }}
      >
        {isChainBroken ? "CRITICAL RISK • CHAIN DEPENDENCY" : "STEP 01 • INCREMENTAL ARCHITECTURE"}
      </div>

      {/* Top Dynamic Kinetic Subtitle Phrase */}
      <div
        style={{
          marginTop: "16px",
          minHeight: "150px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <KineticSubtitleEngine sceneId="scene2" fontSize={54} layout="vertical" />
      </div>

      {/* Central Architecture Stage (940px wide, 1100px height) */}
      <div
        style={{
          width: 940,
          height: 1100,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "28px",
        }}
      >
        {/* Dynamic Curved Splines connecting days */}
        {frame >= 452 && (
          <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 5 }}>
            {/* Monday -> Tuesday */}
            <CurvedSpline
              x1={470}
              y1={240}
              x2={160}
              y2={440}
              curvature={-30}
              color={isChainBroken ? "#EF4444" : THEME.colors.green}
              lineWidth={5}
              frame={frame}
              drawProgress={spline1Progress}
            />
            {/* Tuesday -> Wednesday */}
            {frame >= 573 && (
              <CurvedSpline
                x1={280}
                y1={540}
                x2={380}
                y2={540}
                curvature={0}
                color={isChainBroken ? "#EF4444" : THEME.colors.orange}
                lineWidth={5}
                frame={frame}
                drawProgress={spline2Progress}
              />
            )}
            {/* Wednesday -> Thursday */}
            {frame >= 706 && (
              <CurvedSpline
                x1={560}
                y1={540}
                x2={660}
                y2={540}
                curvature={0}
                color={THEME.colors.blue}
                lineWidth={5}
                frame={frame}
                drawProgress={spline3Progress}
              />
            )}
          </div>
        )}

        {/* Day 0: Monday Full Backup Baseline Card (940px wide) */}
        <div
          style={{
            width: 940,
            transform: `scale(${frame < 248 ? heroEntrance : mondaySpring})`,
            opacity: frame < 248 ? heroEntrance : mondaySpring,
            zIndex: 10,
          }}
        >
          <ElevatedCard width={940} height={190} padding="24px 36px">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <ComponentSvgIcon name="server_tower" size={85} />
                <div>
                  <div style={{ fontSize: "24px", fontWeight: 800, color: THEME.colors.charcoal }}>
                    Monday: First Full Backup Baseline
                  </div>
                  <div style={{ fontSize: "15px", color: THEME.colors.charcoalMuted, marginTop: "6px", fontWeight: 600 }}>
                    Captures 100% of selected files, OS volumes & system state
                  </div>
                </div>
              </div>
              <div
                style={{
                  background: THEME.colors.blueLight,
                  color: THEME.colors.blue,
                  fontWeight: 800,
                  fontSize: "26px",
                  padding: "12px 24px",
                  borderRadius: "16px",
                  border: `1.5px solid ${THEME.colors.blue}40`,
                }}
              >
                100 GB
              </div>
            </div>
          </ElevatedCard>
        </div>

        {/* Row of 3 Daily Incremental Deltas (Tue, Wed, Thu) */}
        <div style={{ display: "flex", gap: "24px", width: "100%", justifyContent: "space-between", zIndex: 10 }}>
          {/* Tuesday Delta Card */}
          <div
            style={{
              flex: 1,
              transform: `scale(${tuesdaySpring})`,
              opacity: tuesdaySpring,
              boxShadow: isChainBroken ? `0 0 ${breakPulse * 30}px rgba(239, 68, 68, 0.6)` : "none",
              borderRadius: "28px",
              border: isChainBroken ? "3px solid #EF4444" : "none",
              transition: "border 0.2s ease",
            }}
          >
            <ElevatedCard width="100%" height={260} padding="24px 18px">
              <div style={{ fontSize: "15px", fontWeight: 800, color: isChainBroken ? "#EF4444" : THEME.colors.green, marginBottom: "8px" }}>
                {isChainBroken ? "⚠️ CORRUPTED DELTA" : "TUESDAY DELTA"}
              </div>
              <div style={{ fontSize: "38px", fontWeight: 800, color: isChainBroken ? "#DC2626" : THEME.colors.charcoal }}>
                2.4 GB
              </div>
              <div style={{ fontSize: "13px", color: THEME.colors.charcoalMuted, marginTop: "12px", textAlign: "center", fontWeight: 600 }}>
                {isChainBroken ? "Missing Sector #4092" : "Changes since Monday"}
              </div>
              <div
                style={{
                  marginTop: "14px",
                  padding: "6px 14px",
                  borderRadius: "9999px",
                  background: isChainBroken ? "#FEE2E2" : "#ECFDF5",
                  color: isChainBroken ? "#DC2626" : THEME.colors.green,
                  fontSize: "12px",
                  fontWeight: 800,
                }}
              >
                {isChainBroken ? "RESTORE BROKEN" : "✓ 97.6% SAVED"}
              </div>
            </ElevatedCard>
          </div>

          {/* Wednesday Delta Card */}
          <div
            style={{
              flex: 1,
              transform: `scale(${wednesdaySpring})`,
              opacity: wednesdaySpring,
              opacity: isChainBroken ? 0.5 : 1,
              transition: "opacity 0.3s ease",
            }}
          >
            <ElevatedCard width="100%" height={260} padding="24px 18px">
              <div style={{ fontSize: "15px", fontWeight: 800, color: THEME.colors.orange, marginBottom: "8px" }}>
                WEDNESDAY DELTA
              </div>
              <div style={{ fontSize: "38px", fontWeight: 800, color: THEME.colors.charcoal }}>
                3.1 GB
              </div>
              <div style={{ fontSize: "13px", color: THEME.colors.charcoalMuted, marginTop: "12px", textAlign: "center", fontWeight: 600 }}>
                Changes since Tuesday
              </div>
              <div
                style={{
                  marginTop: "14px",
                  padding: "6px 14px",
                  borderRadius: "9999px",
                  background: THEME.colors.orangeLight,
                  color: THEME.colors.orange,
                  fontSize: "12px",
                  fontWeight: 800,
                }}
              >
                {isChainBroken ? "UNREACHABLE" : "✓ 96.9% SAVED"}
              </div>
            </ElevatedCard>
          </div>

          {/* Thursday Delta Card */}
          <div
            style={{
              flex: 1,
              transform: `scale(${thursdaySpring})`,
              opacity: thursdaySpring,
              opacity: isChainBroken ? 0.5 : 1,
              transition: "opacity 0.3s ease",
            }}
          >
            <ElevatedCard width="100%" height={260} padding="24px 18px">
              <div style={{ fontSize: "15px", fontWeight: 800, color: THEME.colors.blue, marginBottom: "8px" }}>
                THURSDAY DELTA
              </div>
              <div style={{ fontSize: "38px", fontWeight: 800, color: THEME.colors.charcoal }}>
                1.8 GB
              </div>
              <div style={{ fontSize: "13px", color: THEME.colors.charcoalMuted, marginTop: "12px", textAlign: "center", fontWeight: 600 }}>
                Changes since Wednesday
              </div>
              <div
                style={{
                  marginTop: "14px",
                  padding: "6px 14px",
                  borderRadius: "9999px",
                  background: THEME.colors.blueLight,
                  color: THEME.colors.blue,
                  fontSize: "12px",
                  fontWeight: 800,
                }}
              >
                {isChainBroken ? "UNREACHABLE" : "✓ 98.2% SAVED"}
              </div>
            </ElevatedCard>
          </div>
        </div>

        {/* Phase 6: Efficiency Metrics Card */}
        {frame >= 791 && !isChainBroken && (
          <div
            style={{
              width: 940,
              background: "#FFFFFF",
              padding: "22px 36px",
              borderRadius: "28px",
              boxShadow: THEME.shadows.cardElevated,
              border: `2px solid ${THEME.colors.green}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxSizing: "border-box",
              transform: `scale(${efficiencySpring})`,
              opacity: efficiencySpring,
              zIndex: 20,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
              <ComponentSvgIcon name="shield" size={44} />
              <div>
                <div style={{ fontSize: "20px", fontWeight: 800, color: THEME.colors.charcoal }}>
                  Total 3-Day Backup: Only 7.3 GB Stored
                </div>
                <div style={{ fontSize: "14px", color: THEME.colors.charcoalMuted, fontWeight: 600, marginTop: "4px" }}>
                  Versus 300 GB if doing daily full backups (92.7 GB daily bandwidth saved)
                </div>
              </div>
            </div>
            <div
              style={{
                background: "#ECFDF5",
                color: THEME.colors.green,
                fontWeight: 900,
                fontSize: "18px",
                padding: "10px 20px",
                borderRadius: "16px",
                border: `1.5px solid ${THEME.colors.green}`,
              }}
            >
              ⚡ 93% STORAGE SAVED
            </div>
          </div>
        )}

        {/* Phase 7: Chain Risk Warning Card */}
        {isChainBroken && (
          <div
            style={{
              width: 940,
              background: "#FEF2F2",
              padding: "24px 36px",
              borderRadius: "28px",
              boxShadow: "0 12px 32px rgba(239, 68, 68, 0.35)",
              border: "3px solid #EF4444",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxSizing: "border-box",
              transform: `scale(${riskSpring})`,
              opacity: riskSpring,
              zIndex: 25,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
              <span style={{ fontSize: "36px" }}>⛓️💥</span>
              <div>
                <div style={{ fontSize: "21px", fontWeight: 900, color: "#DC2626" }}>
                  CRITICAL CHAIN DEPENDENCY
                </div>
                <div style={{ fontSize: "14px", color: "#7F1D1D", fontWeight: 700, marginTop: "4px" }}>
                  If ANY link in the incremental chain is corrupted, subsequent restores FAIL!
                </div>
              </div>
            </div>
            <div
              style={{
                background: "#EF4444",
                color: "#FFFFFF",
                fontWeight: 800,
                fontSize: "14px",
                padding: "10px 20px",
                borderRadius: "9999px",
                letterSpacing: "0.04em",
              }}
            >
              VERIFY REGULARLY
            </div>
          </div>
        )}
      </div>

      {/* Bottom Status Card */}
      <div
        style={{
          width: 940,
          background: "#FFFFFF",
          padding: "18px 32px",
          borderRadius: "24px",
          boxShadow: THEME.shadows.card,
          border: `1px solid ${THEME.colors.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <span style={{ fontSize: "20px" }}>⚡</span>
          <div>
            <div style={{ fontSize: "17px", fontWeight: 800, color: THEME.colors.charcoal }}>
              {isChainBroken ? "Chain Integrity Warning" : "Delta-Chain Engine"}
            </div>
            <div style={{ fontSize: "13px", color: THEME.colors.charcoalMuted, fontWeight: 600 }}>
              {isChainBroken
                ? "Every incremental depends sequentially on Monday baseline"
                : "Captures new/modified data points sequentially each day"}
            </div>
          </div>
        </div>

        <div
          style={{
            padding: "6px 16px",
            borderRadius: "9999px",
            background: isChainBroken ? "#FEE2E2" : "#ECFDF5",
            color: isChainBroken ? "#DC2626" : THEME.colors.green,
            fontSize: "13px",
            fontWeight: 800,
            letterSpacing: "0.06em",
            border: `1px solid ${isChainBroken ? "#DC2626" : THEME.colors.green}35`,
          }}
        >
          {isChainBroken ? "CHAIN BROKEN" : "CHAIN ACTIVE"}
        </div>
      </div>

      {/* Subtle brand watermark */}
      <div
        style={{
          fontSize: "16px",
          fontWeight: 700,
          color: THEME.colors.charcoalLight,
          letterSpacing: "0.08em",
        }}
      >
        tech-tutorial-series.io
      </div>
    </div>
  );
};
