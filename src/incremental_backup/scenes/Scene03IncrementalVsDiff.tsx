import React from "react";
import { spring, useCurrentFrame, useVideoConfig, Audio, staticFile } from "remotion";
import { THEME } from "../theme";
import { CanvaCard } from "../components/CanvaCard";
import { HeaderBanner } from "../components/HeaderBanner";
import { FileBlockStack } from "../components/FileBlockStack";

export const Scene03IncrementalVsDiff: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        background: THEME.colors.cream,
        backgroundImage: `radial-gradient(${THEME.colors.charcoal} 0.75px, transparent 0.75px)`,
        backgroundSize: "28px 28px",
        padding: "50px 80px",
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
        fontFamily: THEME.typography.fontFamily,
      }}
    >
      <Audio src={staticFile("incremental_backup/scene3.wav")} />

      {/* Header */}
      <HeaderBanner
        category="Architecture Comparison"
        title="Incremental vs Differential"
        subtitle="Comparing data accumulation, storage footprint, and recovery speed."
      />

      {/* Two Large Comparison Panels */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "40px",
          marginTop: "16px",
        }}
      >
        {/* LEFT PANEL: INCREMENTAL BACKUP (Blue Accent) */}
        <CanvaCard
          delay={15}
          style={{
            borderTop: `6px solid ${THEME.colors.blue}`,
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            minHeight: 440,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 800,
                  color: THEME.colors.blue,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                METHOD A
              </span>
              <h2 style={{ ...THEME.typography.h2, fontSize: "28px", margin: "4px 0 0 0" }}>
                Incremental Backup
              </h2>
            </div>
            <span
              style={{
                padding: "6px 14px",
                borderRadius: THEME.borderRadius.pill,
                background: THEME.colors.blueLight,
                color: THEME.colors.blue,
                fontSize: "12px",
                fontWeight: 700,
              }}
            >
              Changes Since Last Backup
            </span>
          </div>

          {/* Stacks for Mon, Tue, Wed, Thu */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "12px",
              padding: "16px",
              background: "#FAFAF9",
              borderRadius: "18px",
            }}
          >
            <FileBlockStack count={6} color={THEME.colors.charcoal} label="Mon" sublabel="Full" delay={20} />
            <FileBlockStack count={3} color={THEME.colors.blue} label="Tue" sublabel="+3 Δ" delay={120} />
            <FileBlockStack count={2} color={THEME.colors.blue} label="Wed" sublabel="+2 Δ" delay={220} />
            <FileBlockStack count={4} color={THEME.colors.blue} label="Thu" sublabel="+4 Δ" delay={320} />
          </div>

          <div
            style={{
              marginTop: "auto",
              padding: "14px 20px",
              borderRadius: "14px",
              background: THEME.colors.blueLight,
              color: THEME.colors.blue,
              fontSize: "15px",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span>STORAGE ADVANTAGE</span>
            <span>⚡ Less Data Per Backup</span>
          </div>
        </CanvaCard>

        {/* RIGHT PANEL: DIFFERENTIAL BACKUP (Orange Accent) */}
        <CanvaCard
          delay={35}
          style={{
            borderTop: `6px solid ${THEME.colors.orange}`,
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            minHeight: 440,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 800,
                  color: THEME.colors.orange,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                METHOD B
              </span>
              <h2 style={{ ...THEME.typography.h2, fontSize: "28px", margin: "4px 0 0 0" }}>
                Differential Backup
              </h2>
            </div>
            <span
              style={{
                padding: "6px 14px",
                borderRadius: THEME.borderRadius.pill,
                background: THEME.colors.orangeLight,
                color: THEME.colors.orange,
                fontSize: "12px",
                fontWeight: 700,
              }}
            >
              Changes Since Last Full
            </span>
          </div>

          {/* Stacks for Mon, Tue, Wed, Thu (Growing cumulative delta) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "12px",
              padding: "16px",
              background: "#FAFAF9",
              borderRadius: "18px",
            }}
          >
            <FileBlockStack count={6} color={THEME.colors.charcoal} label="Mon" sublabel="Full" delay={40} />
            <FileBlockStack count={3} color={THEME.colors.orange} label="Tue" sublabel="3 Δ" delay={140} />
            <FileBlockStack count={5} color={THEME.colors.orange} label="Wed" sublabel="5 Δ (Tue+Wed)" delay={240} />
            <FileBlockStack count={9} color={THEME.colors.orange} label="Thu" sublabel="9 Δ (All Week)" delay={340} />
          </div>

          <div
            style={{
              marginTop: "auto",
              padding: "14px 20px",
              borderRadius: "14px",
              background: THEME.colors.orangeLight,
              color: THEME.colors.orange,
              fontSize: "15px",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span>RECOVERY ADVANTAGE</span>
            <span>🛡️ Simpler 2-Step Restore</span>
          </div>
        </CanvaCard>
      </div>

      {/* Summary Footer Strip */}
      <div
        style={{
          marginTop: "24px",
          display: "flex",
          justifyContent: "center",
          gap: "40px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "16px", fontWeight: 700, color: THEME.colors.charcoal }}>
          <span style={{ color: THEME.colors.blue }}>●</span>
          <span>Incremental: Minimal backup time & storage footprint</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "16px", fontWeight: 700, color: THEME.colors.charcoal }}>
          <span style={{ color: THEME.colors.orange }}>●</span>
          <span>Differential: Only requires Full + Latest Differential</span>
        </div>
      </div>
    </div>
  );
};
