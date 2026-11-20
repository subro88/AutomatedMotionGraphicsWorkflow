import React from "react";
import { spring, useCurrentFrame, useVideoConfig, Audio, staticFile } from "remotion";
import { THEME } from "../theme";
import { CanvaCard } from "../components/CanvaCard";
import { HeaderBanner } from "../components/HeaderBanner";
import { FileBlockStack } from "../components/FileBlockStack";

export const Scene02WhatIsIncremental: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const days = [
    {
      day: "MONDAY",
      iconColor: THEME.colors.orange,
      label: "FULL BACKUP",
      sublabel: "10 Data Blocks (Baseline)",
      blocksCount: 10,
      badge: "INITIAL BASELINE",
      delay: 15,
    },
    {
      day: "TUESDAY",
      iconColor: THEME.colors.blue,
      label: "CHANGES ONLY",
      sublabel: "3 Changed Blocks",
      blocksCount: 3,
      badge: "DELTA: +3 BLOCKS",
      delay: 140,
    },
    {
      day: "WEDNESDAY",
      iconColor: THEME.colors.green,
      label: "CHANGES ONLY",
      sublabel: "2 Modified Blocks",
      blocksCount: 2,
      badge: "DELTA: +2 BLOCKS",
      delay: 260,
    },
    {
      day: "THURSDAY",
      iconColor: THEME.colors.purple,
      label: "CHANGES ONLY",
      sublabel: "4 New Blocks",
      blocksCount: 4,
      badge: "DELTA: +4 BLOCKS",
      delay: 380,
    },
  ];

  // Warning card entrance for chain dependency
  const warnSpring = spring({
    frame: Math.max(0, frame - 550),
    fps,
    config: THEME.springs.gentle,
  });

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
      <Audio src={staticFile("incremental_backup/scene2.wav")} />

      {/* Header */}
      <HeaderBanner
        category="Definition & Mechanics"
        title="What is Incremental Backup?"
        subtitle="Backing up only the changes made since the immediately previous backup."
      />

      {/* Horizontal 4-Day Timeline */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "24px",
          marginTop: "16px",
          position: "relative",
        }}
      >
        {days.map((d, idx) => (
          <CanvaCard
            key={idx}
            delay={d.delay}
            style={{
              padding: "24px 20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              minHeight: 330,
            }}
          >
            {/* Day Header with Calendar Icon */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "14px",
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "8px",
                  background: `${d.iconColor}15`,
                  color: d.iconColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                }}
              >
                📅
              </div>
              <span style={{ fontSize: "14px", fontWeight: 800, color: THEME.colors.charcoal }}>
                {d.day}
              </span>
            </div>

            {/* Data Blocks Stack */}
            <FileBlockStack
              count={d.blocksCount}
              color={d.iconColor}
              delay={d.delay + 10}
              label={d.label}
              sublabel={d.sublabel}
            />

            {/* Status Pill */}
            <div
              style={{
                marginTop: "auto",
                padding: "6px 12px",
                borderRadius: THEME.borderRadius.pill,
                background: `${d.iconColor}15`,
                color: d.iconColor,
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.04em",
              }}
            >
              {d.badge}
            </div>
          </CanvaCard>
        ))}
      </div>

      {/* Connecting Flow Arrows Indicator */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "18px",
          marginTop: "16px",
          color: THEME.colors.charcoalMuted,
          fontSize: "14px",
          fontWeight: 700,
        }}
      >
        <span>Monday (Base)</span>
        <span>→</span>
        <span>Tuesday (Δ1)</span>
        <span>→</span>
        <span>Wednesday (Δ2)</span>
        <span>→</span>
        <span>Thursday (Δ3)</span>
      </div>

      {/* Bottom Information Card: Chain Dependency Alert */}
      <div
        style={{
          marginTop: "20px",
          opacity: warnSpring,
          transform: `translateY(${(1 - warnSpring) * 20}px)`,
        }}
      >
        <CanvaCard
          style={{
            background: "linear-gradient(90deg, #FFFFFF 0%, #FEF2F2 100%)",
            border: `1.5px solid ${THEME.colors.red}44`,
            padding: "18px 28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span style={{ fontSize: "24px" }}>⚠️</span>
            <div>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 800,
                  color: THEME.colors.red,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                CRITICAL CHAIN DEPENDENCY
              </span>
              <p
                style={{
                  fontSize: "15px",
                  color: THEME.colors.charcoal,
                  fontWeight: 600,
                  margin: "2px 0 0 0",
                }}
              >
                Each incremental backup depends on every previous backup in the chain. If one link is missing or corrupt, full restoration fails.
              </p>
            </div>
          </div>
          <div
            style={{
              padding: "6px 14px",
              borderRadius: THEME.borderRadius.pill,
              background: THEME.colors.redLight,
              color: THEME.colors.red,
              fontSize: "12px",
              fontWeight: 700,
            }}
          >
            VERIFY INTEGRITY
          </div>
        </CanvaCard>
      </div>
    </div>
  );
};
