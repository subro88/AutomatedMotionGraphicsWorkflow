import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, Audio, staticFile } from "remotion";
import { THEME } from "../theme";
import { KineticSubtitleEngine } from "../components/KineticSubtitleEngine";
import { CurvedSpline } from "../components/CurvedSpline";
import { ElevatedCard, ComponentSvgIcon } from "../components/VectorComponents";

export const Scene03Vertical: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ---------------------------------------------------------
  // PHASE CHOREOGRAPHY (Incremental vs Differential)
  // Phase 1: 0 - 371    Full Baseline + Side-by-Side Setup
  // Phase 2: 371 - 625  Incremental Column Animation (Tue & Wed Deltas)
  // Phase 3: 625 - 808  Differential Column Animation (Cumulative Growth)
  // Phase 4: 808 - 948  Storage Footprint Comparison (Incremental Wins)
  // Phase 5: 948 - 1111 Restore Simplicity Comparison (Differential Wins)
  // ---------------------------------------------------------

  // Phase 1: Entrance
  const baselineSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 85 },
  });

  // Phase 2: Incremental items entrance
  const incTueSpring = spring({
    frame: frame - 371,
    fps,
    config: { damping: 13, stiffness: 100 },
  });
  const incWedSpring = spring({
    frame: frame - 502,
    fps,
    config: { damping: 13, stiffness: 100 },
  });
  const incSpline1Progress = interpolate(frame, [380, 420], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const incSpline2Progress = interpolate(frame, [510, 550], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Phase 3: Differential items entrance
  const diffTueSpring = spring({
    frame: frame - 625,
    fps,
    config: { damping: 13, stiffness: 100 },
  });
  const diffWedSpring = spring({
    frame: frame - 680,
    fps,
    config: { damping: 13, stiffness: 100 },
  });
  const diffSpline1Progress = interpolate(frame, [635, 675], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const diffSpline2Progress = interpolate(frame, [690, 730], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Phase 4 & 5: Comparison Metrics Card Entrance
  const metricSpring = spring({
    frame: frame - 808,
    fps,
    config: { damping: 14, stiffness: 95 },
  });

  const isRestoreFocus = frame >= 948;

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
      <Audio src={staticFile("incremental_backup/scene3.wav")} />

      {/* Top Category Badge */}
      <div
        style={{
          padding: "10px 28px",
          borderRadius: "9999px",
          background: THEME.colors.orange,
          color: "#FFFFFF",
          fontSize: "15px",
          fontWeight: 800,
          letterSpacing: "0.1em",
          boxShadow: "0 8px 24px rgba(244, 91, 22, 0.32)",
          transform: `scale(${baselineSpring})`,
        }}
      >
        COMPARISON • INCREMENTAL VS DIFFERENTIAL
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
        <KineticSubtitleEngine sceneId="scene3" fontSize={54} layout="vertical" />
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
          gap: "24px",
        }}
      >
        {/* Monday Full Baseline Card (Shared Anchor for Both) */}
        <div style={{ width: 940, transform: `scale(${baselineSpring})`, opacity: baselineSpring, zIndex: 10 }}>
          <ElevatedCard width={940} height={170} padding="20px 32px">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
                <ComponentSvgIcon name="server_tower" size={75} />
                <div>
                  <div style={{ fontSize: "22px", fontWeight: 800, color: THEME.colors.charcoal }}>
                    Monday Baseline: Full Backup (100 GB)
                  </div>
                  <div style={{ fontSize: "14px", color: THEME.colors.charcoalMuted, marginTop: "4px", fontWeight: 600 }}>
                    Both backup methods start from this exact same initial full snapshot
                  </div>
                </div>
              </div>
              <div
                style={{
                  background: THEME.colors.blueLight,
                  color: THEME.colors.blue,
                  fontWeight: 800,
                  fontSize: "20px",
                  padding: "8px 18px",
                  borderRadius: "14px",
                  border: `1.5px solid ${THEME.colors.blue}40`,
                }}
              >
                SHARED BASE
              </div>
            </div>
          </ElevatedCard>
        </div>

        {/* Side-by-Side Dual Column Comparison (940px wide) */}
        <div style={{ display: "flex", gap: "24px", width: "100%", justifyContent: "space-between", zIndex: 10 }}>
          {/* Column 1: INCREMENTAL (Green / Orange) */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px" }}>
            <div
              style={{
                background: "#FFFFFF",
                border: `2px solid ${THEME.colors.orange}`,
                borderRadius: "20px",
                padding: "12px 18px",
                textAlign: "center",
                fontWeight: 900,
                fontSize: "17px",
                color: THEME.colors.orange,
                boxShadow: THEME.shadows.card,
              }}
            >
              INCREMENTAL (Delta-Chain)
            </div>

            {/* Tuesday Incremental */}
            <div style={{ transform: `scale(${incTueSpring})`, opacity: incTueSpring }}>
              <ElevatedCard width="100%" height={150} padding="16px 20px">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 800, color: THEME.colors.green }}>TUESDAY DELTA</div>
                    <div style={{ fontSize: "28px", fontWeight: 900, color: THEME.colors.charcoal, marginTop: "4px" }}>2.4 GB</div>
                    <div style={{ fontSize: "12px", color: THEME.colors.charcoalMuted, fontWeight: 600 }}>Since Monday</div>
                  </div>
                  <div style={{ padding: "6px 12px", borderRadius: "8px", background: "#ECFDF5", color: THEME.colors.green, fontSize: "12px", fontWeight: 800 }}>
                    1 Link
                  </div>
                </div>
              </ElevatedCard>
            </div>

            {/* Wednesday Incremental */}
            <div style={{ transform: `scale(${incWedSpring})`, opacity: incWedSpring }}>
              <ElevatedCard width="100%" height={150} padding="16px 20px">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 800, color: THEME.colors.orange }}>WEDNESDAY DELTA</div>
                    <div style={{ fontSize: "28px", fontWeight: 900, color: THEME.colors.charcoal, marginTop: "4px" }}>3.1 GB</div>
                    <div style={{ fontSize: "12px", color: THEME.colors.charcoalMuted, fontWeight: 600 }}>Since Tuesday only</div>
                  </div>
                  <div style={{ padding: "6px 12px", borderRadius: "8px", background: THEME.colors.orangeLight, color: THEME.colors.orange, fontSize: "12px", fontWeight: 800 }}>
                    Smallest
                  </div>
                </div>
              </ElevatedCard>
            </div>
          </div>

          {/* Column 2: DIFFERENTIAL (Purple / Blue) */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px" }}>
            <div
              style={{
                background: "#FFFFFF",
                border: `2px solid ${THEME.colors.purple || "#8B5CF6"}`,
                borderRadius: "20px",
                padding: "12px 18px",
                textAlign: "center",
                fontWeight: 900,
                fontSize: "17px",
                color: THEME.colors.purple || "#8B5CF6",
                boxShadow: THEME.shadows.card,
              }}
            >
              DIFFERENTIAL (Cumulative)
            </div>

            {/* Tuesday Differential */}
            <div style={{ transform: `scale(${diffTueSpring})`, opacity: diffTueSpring }}>
              <ElevatedCard width="100%" height={150} padding="16px 20px">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 800, color: THEME.colors.blue }}>TUESDAY CUMULATIVE</div>
                    <div style={{ fontSize: "28px", fontWeight: 900, color: THEME.colors.charcoal, marginTop: "4px" }}>2.4 GB</div>
                    <div style={{ fontSize: "12px", color: THEME.colors.charcoalMuted, fontWeight: 600 }}>Since Monday Full</div>
                  </div>
                  <div style={{ padding: "6px 12px", borderRadius: "8px", background: THEME.colors.blueLight, color: THEME.colors.blue, fontSize: "12px", fontWeight: 800 }}>
                    Direct
                  </div>
                </div>
              </ElevatedCard>
            </div>

            {/* Wednesday Differential */}
            <div style={{ transform: `scale(${diffWedSpring})`, opacity: diffWedSpring }}>
              <ElevatedCard width="100%" height={150} padding="16px 20px">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 800, color: THEME.colors.purple || "#8B5CF6" }}>WEDNESDAY CUMULATIVE</div>
                    <div style={{ fontSize: "28px", fontWeight: 900, color: "#6D28D9", marginTop: "4px" }}>5.5 GB</div>
                    <div style={{ fontSize: "12px", color: THEME.colors.charcoalMuted, fontWeight: 600 }}>Includes Tue + Wed</div>
                  </div>
                  <div style={{ padding: "6px 12px", borderRadius: "8px", background: "#F3E8FF", color: "#7C3AED", fontSize: "12px", fontWeight: 800 }}>
                    Growing
                  </div>
                </div>
              </ElevatedCard>
            </div>
          </div>
        </div>

        {/* Dynamic Comparison Winner Card (f >= 808) */}
        {frame >= 808 && (
          <div
            style={{
              width: 940,
              background: "#FFFFFF",
              padding: "22px 34px",
              borderRadius: "28px",
              boxShadow: THEME.shadows.cardElevated,
              border: `2.5px solid ${isRestoreFocus ? THEME.colors.blue : THEME.colors.orange}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxSizing: "border-box",
              transform: `scale(${metricSpring})`,
              opacity: metricSpring,
              zIndex: 25,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
              <span style={{ fontSize: "36px" }}>{isRestoreFocus ? "⚡" : "💾"}</span>
              <div>
                <div style={{ fontSize: "20px", fontWeight: 900, color: THEME.colors.charcoal }}>
                  {isRestoreFocus
                    ? "Restore Simplicity: Differential Wins (2 Steps)"
                    : "Storage & Bandwidth: Incremental Wins (Fastest & Smallest)"}
                </div>
                <div style={{ fontSize: "14px", color: THEME.colors.charcoalMuted, fontWeight: 600, marginTop: "4px" }}>
                  {isRestoreFocus
                    ? "Differential restore requires ONLY: Monday Full + Wednesday Diff (1-step restore)"
                    : "Incremental copies only 3.1 GB on Wednesday vs 5.5 GB duplicate data in differential"}
                </div>
              </div>
            </div>

            <div
              style={{
                background: isRestoreFocus ? THEME.colors.blue : THEME.colors.orange,
                color: "#FFFFFF",
                fontWeight: 800,
                fontSize: "14px",
                padding: "8px 18px",
                borderRadius: "9999px",
                letterSpacing: "0.04em",
              }}
            >
              {isRestoreFocus ? "FASTER RESTORE" : "LESS STORAGE"}
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
          <span style={{ fontSize: "20px" }}>⚖️</span>
          <div>
            <div style={{ fontSize: "17px", fontWeight: 800, color: THEME.colors.charcoal }}>
              Trade-off Summary
            </div>
            <div style={{ fontSize: "13px", color: THEME.colors.charcoalMuted, fontWeight: 600 }}>
              Incremental = Minimum daily storage • Differential = Maximum restore speed
            </div>
          </div>
        </div>

        <div
          style={{
            padding: "6px 16px",
            borderRadius: "9999px",
            background: THEME.colors.orangeLight,
            color: THEME.colors.orange,
            fontSize: "13px",
            fontWeight: 800,
            letterSpacing: "0.06em",
          }}
        >
          ANALYSIS ACTIVE
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
