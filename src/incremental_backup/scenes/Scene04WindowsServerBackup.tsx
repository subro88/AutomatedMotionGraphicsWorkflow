import React from "react";
import { spring, useCurrentFrame, useVideoConfig, Audio, staticFile, interpolate } from "remotion";
import { THEME } from "../theme";
import { CanvaCard } from "../components/CanvaCard";
import { HeaderBanner } from "../components/HeaderBanner";
import { WindowsServerDialog } from "../components/WindowsServerDialog";

export const Scene04WindowsServerBackup: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Navigation steps
  const navSteps = [
    { title: "Server Manager", desc: "Open administrative dashboard" },
    { title: "Features", desc: "Select server capabilities" },
    { title: "Add Features", desc: "Launch installation wizard" },
    { title: "Windows Server Backup Features", desc: "Check backup tools & command line" },
  ];

  // Active step highlights as frame progresses
  const currentStep = frame < 120 ? 0 : frame < 240 ? 1 : frame < 360 ? 2 : 3;

  // Progress Bar Animation (from frame 380 to 520)
  const progressRaw = interpolate(frame, [380, 520], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const isInstalled = frame >= 520;

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
      <Audio src={staticFile("incremental_backup/scene4.wav")} />

      <HeaderBanner
        category="Native Operating System Utility"
        title="Method 1: Windows Server Backup"
        subtitle="Installing the built-in block-level backup feature in Windows Server 2008 / 2008 R2."
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "40px",
          marginTop: "16px",
          alignItems: "center",
        }}
      >
        {/* Left Column: Interactive Wizard / Navigation Path */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <CanvaCard delay={15} style={{ padding: "26px 30px" }}>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 800,
                color: THEME.colors.orange,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              INSTALLATION WORKFLOW
            </span>
            <h3 style={{ ...THEME.typography.h3, fontSize: "22px", margin: "6px 0 16px 0" }}>
              Add Features Wizard
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {navSteps.map((s, idx) => {
                const isActive = currentStep === idx;
                const isDone = currentStep > idx;

                return (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      padding: "12px 18px",
                      borderRadius: "14px",
                      background: isActive
                        ? THEME.colors.orangeLight
                        : isDone
                        ? THEME.colors.greenLight
                        : "transparent",
                      border: isActive
                        ? `1.5px solid ${THEME.colors.orange}`
                        : `1px solid ${THEME.colors.border}`,
                      transition: "all 0.3s ease",
                    }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: isActive
                          ? THEME.colors.orange
                          : isDone
                          ? THEME.colors.green
                          : THEME.colors.charcoalLight,
                        color: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                        fontWeight: 700,
                      }}
                    >
                      {isDone ? "✓" : idx + 1}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: "15px",
                          fontWeight: 700,
                          color: isActive
                            ? THEME.colors.orange
                            : isDone
                            ? THEME.colors.green
                            : THEME.colors.charcoal,
                        }}
                      >
                        {s.title}
                      </div>
                      <div style={{ fontSize: "12px", color: THEME.colors.charcoalMuted }}>
                        {s.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CanvaCard>

          {/* Installation Progress & Confirmation Bar */}
          <CanvaCard delay={40} style={{ padding: "20px 28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "13px", fontWeight: 700, color: THEME.colors.charcoal }}>
                Installation Progress
              </span>
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 800,
                  color: isInstalled ? THEME.colors.green : THEME.colors.orange,
                }}
              >
                {Math.round(progressRaw)}%
              </span>
            </div>

            <div
              style={{
                width: "100%",
                height: 10,
                borderRadius: "5px",
                background: THEME.colors.border,
                overflow: "hidden",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  width: `${progressRaw}%`,
                  height: "100%",
                  background: isInstalled ? THEME.colors.green : THEME.colors.orange,
                  borderRadius: "5px",
                }}
              />
            </div>

            {isInstalled && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  color: THEME.colors.green,
                  fontSize: "14px",
                  fontWeight: 800,
                }}
              >
                <span>✓</span>
                <span>Windows Server Backup Features Installed Successfully</span>
              </div>
            )}
          </CanvaCard>
        </div>

        {/* Right Column: Windows Server 2008 Server Manager Interface Graphic */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <WindowsServerDialog title="Server Manager - Windows Server 2008 R2" width={680} height={460}>
            <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: "20px", height: "100%" }}>
              {/* Tree view on left */}
              <div
                style={{
                  borderRight: `1px solid ${THEME.colors.border}`,
                  paddingRight: "14px",
                  fontSize: "13px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  color: THEME.colors.charcoal,
                }}
              >
                <div style={{ fontWeight: 700 }}>Server Manager</div>
                <div style={{ paddingLeft: "10px", color: THEME.colors.charcoalMuted }}>Roles</div>
                <div
                  style={{
                    paddingLeft: "10px",
                    fontWeight: 700,
                    color: THEME.colors.orange,
                    background: THEME.colors.orangeLight,
                    padding: "4px 8px",
                    borderRadius: "6px",
                  }}
                >
                  ▶ Features (Selected)
                </div>
                <div style={{ paddingLeft: "10px", color: THEME.colors.charcoalMuted }}>Diagnostics</div>
                <div style={{ paddingLeft: "10px", color: THEME.colors.charcoalMuted }}>Configuration</div>
                <div style={{ paddingLeft: "10px", color: THEME.colors.charcoalMuted }}>Storage</div>
              </div>

              {/* Main Features Panel on right */}
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div style={{ fontSize: "14px", fontWeight: 800, color: THEME.colors.charcoal }}>
                  Features Summary
                </div>
                <div
                  style={{
                    background: "#FAFAF9",
                    padding: "16px",
                    borderRadius: "12px",
                    border: `1px solid ${THEME.colors.border}`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <input type="checkbox" checked readOnly style={{ accentColor: THEME.colors.orange }} />
                    <span style={{ fontSize: "13px", fontWeight: 700 }}>
                      Windows Server Backup Features
                    </span>
                  </div>
                  <p style={{ fontSize: "12px", color: THEME.colors.charcoalMuted, margin: 0, paddingLeft: "24px" }}>
                    Provides backup and recovery capabilities for your Windows Server operating system, files, folders, and volumes.
                  </p>
                </div>

                <div
                  style={{
                    marginTop: "auto",
                    padding: "12px 18px",
                    background: THEME.colors.blueLight,
                    borderRadius: "12px",
                    color: THEME.colors.blue,
                    fontSize: "12px",
                    fontWeight: 700,
                  }}
                >
                  Located in: Administrative Tools → Windows Server Backup
                </div>
              </div>
            </div>
          </WindowsServerDialog>
        </div>
      </div>
    </div>
  );
};
