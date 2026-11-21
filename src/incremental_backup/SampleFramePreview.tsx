import React from "react";
import { THEME } from "./theme";
import { KineticPhrase } from "./components/KineticPhrase";
import { CurvedSpline } from "./components/CurvedSpline";
import {
  ElevatedCard,
  ServerRackCard,
  HardDrivePlatterCard,
  InteractiveScreenshotCard,
  ComponentSvgIcon,
} from "./components/VectorComponents";

// Base canvas wrapper with warm cream background, micro-dot grid, and strict safe zones
const CanvasBase: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
        }}
      >
        WINDOWS SERVER 2008 R2
      </div>

      {children}

      {/* Subtle brand / topic footer watermark matching reference video */}
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

// =========================================================================
// SAMPLE FRAME 1: Scene 1 Intro (Authentic Component.svg Server -> Platter)
// =========================================================================
export const SampleFrame1Scene01: React.FC = () => {
  return (
    <CanvasBase>
      {/* Kinetic Phrase: ENLARGED (58px) */}
      <div style={{ marginTop: "24px" }}>
        <KineticPhrase
          text="Welcome back to our tech tutorial series on Windows Server"
          boldWords={["tech", "tutorial", "series", "Windows", "Server"]}
          highlightWord="tutorial"
          fontSize={58}
        />
      </div>

      {/* Central Visual Stage: IMMERSIVE (1040px height, 940px width) */}
      <div
        style={{
          width: 940,
          height: 1040,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Dynamic Curved Spline with flowing glowing data packets */}
        <CurvedSpline
          x1={240}
          y1={300}
          x2={700}
          y2={740}
          curvature={110}
          color={THEME.colors.blue}
          lineWidth={6}
          frame={45}
          packetCount={5}
        />

        {/* Server Rack Node from Component.svg (Top-Left) */}
        <div style={{ position: "absolute", left: 10, top: 40 }}>
          <ServerRackCard frame={45} label="Primary Host Server" width={420} height={460} />
        </div>

        {/* Dedicated Hard Drive Node from Component.svg (Bottom-Right) */}
        <div style={{ position: "absolute", right: 10, bottom: 40 }}>
          <HardDrivePlatterCard frame={45} label="Dedicated Backup Disk" width={420} height={460} />
        </div>

        {/* Central Sync Badge between Server & Platter */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            background: "#FFFFFF",
            padding: "16px 24px",
            borderRadius: "20px",
            boxShadow: THEME.shadows.cardElevated,
            border: `2px solid ${THEME.colors.blue}`,
            display: "flex",
            alignItems: "center",
            gap: "12px",
            zIndex: 15,
          }}
        >
          <ComponentSvgIcon name="sync_arrows" size={32} />
          <span style={{ fontSize: "16px", fontWeight: 800, color: THEME.colors.charcoal }}>
            Continuous Sync Loop
          </span>
        </div>
      </div>

      {/* Bottom Metric Pill: Fills lower canvas */}
      <div
        style={{
          width: 900,
          height: 120,
          background: "#FFFFFF",
          padding: "20px 36px",
          borderRadius: "28px",
          boxShadow: THEME.shadows.card,
          border: `1px solid ${THEME.colors.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxSizing: "border-box",
          marginBottom: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ fontSize: "32px" }}>⚡</span>
          <div>
            <div style={{ fontSize: "20px", fontWeight: 800, color: THEME.colors.charcoal }}>
              VSS Block-Level Delta Tracking Active
            </div>
            <div style={{ fontSize: "14px", color: THEME.colors.charcoalMuted, fontWeight: 600 }}>
              Captures changed clusters without duplicating full volume
            </div>
          </div>
        </div>
        <div
          style={{
            background: THEME.colors.greenLight,
            color: THEME.colors.green,
            fontWeight: 800,
            fontSize: "16px",
            padding: "8px 18px",
            borderRadius: "9999px",
          }}
        >
          ONLINE
        </div>
      </div>
    </CanvasBase>
  );
};

// =========================================================================
// SAMPLE FRAME 2: Scene 2 Incremental Architecture (Full vs Daily Deltas)
// =========================================================================
export const SampleFrame2Scene02: React.FC = () => {
  return (
    <CanvasBase>
      {/* Kinetic Phrase: ENLARGED (56px) */}
      <div style={{ marginTop: "24px" }}>
        <KineticPhrase
          text="On Monday the system only backs up the files changed on Monday"
          boldWords={["Monday", "system", "only", "backs", "files", "changed"]}
          highlightWord="changed"
          fontSize={56}
        />
      </div>

      {/* Central Architecture Stage: IMMERSIVE (1040px height, 940px width) */}
      <div
        style={{
          width: 940,
          height: 1040,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "36px",
        }}
      >
        {/* Curved Splines connecting Full Backup to Deltas */}
        <CurvedSpline x1={470} y1={230} x2={160} y2={450} curvature={-50} color={THEME.colors.green} frame={30} lineWidth={5} />
        <CurvedSpline x1={470} y1={230} x2={470} y2={450} curvature={0} color={THEME.colors.orange} frame={30} lineWidth={5} />
        <CurvedSpline x1={470} y1={230} x2={780} y2={450} curvature={50} color={THEME.colors.blue} frame={30} lineWidth={5} />

        {/* Day 0: Full Backup Base Container (940px wide) */}
        <ElevatedCard width={940} height={180} padding="24px 36px">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <ComponentSvgIcon name="server_tower" size={90} />
              <div>
                <div style={{ fontSize: "24px", fontWeight: 800, color: THEME.colors.charcoal }}>
                  Sunday Baseline: Full Backup
                </div>
                <div style={{ fontSize: "16px", color: THEME.colors.charcoalMuted, marginTop: "6px", fontWeight: 600 }}>
                  Complete OS, System State & Volume Snapshot (C:\ + System Reserved)
                </div>
              </div>
            </div>
            <div
              style={{
                background: THEME.colors.blueLight,
                color: THEME.colors.blue,
                fontWeight: 800,
                fontSize: "24px",
                padding: "12px 24px",
                borderRadius: "16px",
              }}
            >
              100 GB
            </div>
          </div>
        </ElevatedCard>

        {/* Row of 3 Daily Incremental Deltas (940px total span) */}
        <div style={{ display: "flex", gap: "28px", width: "100%", justifyContent: "space-between", zIndex: 10 }}>
          {/* Day 1 Delta */}
          <ElevatedCard width={290} height={250} padding="24px 20px">
            <div style={{ fontSize: "16px", fontWeight: 800, color: THEME.colors.green, marginBottom: "10px" }}>
              MONDAY DELTA
            </div>
            <div style={{ fontSize: "40px", fontWeight: 800, color: THEME.colors.charcoal }}>
              2.4 GB
            </div>
            <div style={{ fontSize: "14px", color: THEME.colors.charcoalMuted, marginTop: "12px", textAlign: "center", fontWeight: 600 }}>
              Changed blocks only since Sunday
            </div>
          </ElevatedCard>

          {/* Day 2 Delta */}
          <ElevatedCard width={290} height={250} padding="24px 20px" style={{ border: `3px solid ${THEME.colors.orange}` }}>
            <div style={{ fontSize: "16px", fontWeight: 800, color: THEME.colors.orange, marginBottom: "10px" }}>
              TUESDAY DELTA
            </div>
            <div style={{ fontSize: "40px", fontWeight: 800, color: THEME.colors.charcoal }}>
              1.1 GB
            </div>
            <div style={{ fontSize: "14px", color: THEME.colors.charcoalMuted, marginTop: "12px", textAlign: "center", fontWeight: 600 }}>
              Changed blocks only since Monday
            </div>
          </ElevatedCard>

          {/* Day 3 Delta */}
          <ElevatedCard width={290} height={250} padding="24px 20px">
            <div style={{ fontSize: "16px", fontWeight: 800, color: THEME.colors.blue, marginBottom: "10px" }}>
              WEDNESDAY DELTA
            </div>
            <div style={{ fontSize: "40px", fontWeight: 800, color: THEME.colors.charcoal }}>
              3.0 GB
            </div>
            <div style={{ fontSize: "14px", color: THEME.colors.charcoalMuted, marginTop: "12px", textAlign: "center", fontWeight: 600 }}>
              Changed blocks only since Tuesday
            </div>
          </ElevatedCard>
        </div>

        {/* Dynamic Metric Card (940px wide) */}
        <ElevatedCard width={940} height={140} padding="20px 36px" style={{ background: "#ECFDF5", border: "2px solid #A7F3D0" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
              <span style={{ fontSize: "36px" }}>⚡</span>
              <div>
                <div style={{ fontSize: "22px", fontWeight: 800, color: "#065F46" }}>
                  90% Storage Space Saved Every Week
                </div>
                <div style={{ fontSize: "15px", color: "#047857", fontWeight: 600, marginTop: "4px" }}>
                  Fast delta transfer without duplicating 100 GB base image
                </div>
              </div>
            </div>
            <div style={{ fontSize: "26px", fontWeight: 800, color: "#059669" }}>
              SUB-MINUTE
            </div>
          </div>
        </ElevatedCard>
      </div>

      <div style={{ height: "20px" }} />
    </CanvasBase>
  );
};

// =========================================================================
// SAMPLE FRAME 3: Scene 5 Performance Settings (Spotlight & Cursor Click)
// =========================================================================
export const SampleFrame3Scene05: React.FC = () => {
  return (
    <CanvasBase>
      {/* Kinetic Phrase: ENLARGED (56px) */}
      <div style={{ marginTop: "24px" }}>
        <KineticPhrase
          text="Select Faster backup performance to activate incremental backups"
          boldWords={["Select", "Faster", "backup", "performance", "activate", "incremental"]}
          highlightWord="Faster"
          fontSize={56}
        />
      </div>

      {/* Central Interactive Screenshot Stage: 940px Wide */}
      <div
        style={{
          width: 940,
          height: 1040,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          gap: "28px",
        }}
      >
        <InteractiveScreenshotCard
          imageName="screen_3.jpg"
          title="Optimize Backup Performance"
          width={940}
          height={740}
          zoom={1.22}
          cursorX={510}
          cursorY={360}
          isClicking={true}
          spotlightRect={{ x: 100, y: 240, w: 740, h: 115 }}
        />

        {/* Feature Explainer Pill floating below (940px wide) */}
        <div
          style={{
            width: 940,
            background: "#FFFFFF",
            padding: "20px 36px",
            borderRadius: "28px",
            boxShadow: THEME.shadows.cardElevated,
            border: `2.5px solid ${THEME.colors.orange}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxSizing: "border-box",
            zIndex: 30,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <ComponentSvgIcon name="shield" size={38} />
            <div>
              <div style={{ fontSize: "18px", fontWeight: 800, color: THEME.colors.charcoal }}>
                VSS Incremental Engine Active
              </div>
              <div style={{ fontSize: "14px", color: THEME.colors.charcoalMuted, fontWeight: 600 }}>
                Tracks block changes in real-time with Volume Shadow Copy Service
              </div>
            </div>
          </div>
          <div
            style={{
              background: THEME.colors.orange,
              color: "#FFFFFF",
              fontWeight: 800,
              fontSize: "15px",
              padding: "8px 18px",
              borderRadius: "9999px",
            }}
          >
            RECOMMENDED
          </div>
        </div>
      </div>

      <div style={{ height: "20px" }} />
    </CanvasBase>
  );
};

// =========================================================================
// SAMPLE FRAME 4: Scene 6 Backup Schedule & Dedicated Disk
// =========================================================================
export const SampleFrame4Scene06: React.FC = () => {
  return (
    <CanvasBase>
      {/* Kinetic Phrase: ENLARGED (56px) */}
      <div style={{ marginTop: "24px" }}>
        <KineticPhrase
          text="Windows Server 2008 requires a dedicated hard disk for scheduled backups"
          boldWords={["requires", "dedicated", "hard", "disk", "scheduled", "backups"]}
          highlightWord="dedicated"
          fontSize={56}
        />
      </div>

      {/* Central Visual Stage: IMMERSIVE (1040px height, 940px width) */}
      <div
        style={{
          width: 940,
          height: 1040,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          gap: "30px",
        }}
      >
        {/* Curved Spline connecting Wizard card to dedicated disk */}
        <CurvedSpline x1={470} y1={600} x2={470} y2={820} curvature={0} color={THEME.colors.orange} lineWidth={5} frame={20} />

        {/* Schedule Wizard Screenshot Card (940px wide) */}
        <InteractiveScreenshotCard
          imageName="screen_1.jpg"
          title="Backup Schedule Wizard"
          width={940}
          height={620}
          zoom={1.12}
          cursorX={570}
          cursorY={520}
          isClicking={false}
          spotlightRect={{ x: 280, y: 175, w: 580, h: 110 }}
        />

        {/* Dedicated Hard Disk Node Card (940px wide) */}
        <ElevatedCard width={940} height={160} padding="20px 36px" style={{ border: `3px solid ${THEME.colors.orange}` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <ComponentSvgIcon name="hard_drive" size={80} />
              <div>
                <div style={{ fontSize: "22px", fontWeight: 800, color: THEME.colors.charcoal }}>
                  Target Storage: w2k8r2f DISK_01
                </div>
                <div style={{ fontSize: "15px", color: THEME.colors.charcoalMuted, fontWeight: 600, marginTop: "4px" }}>
                  Dedicated physical drive • Formatted & hidden from Explorer for VSS protection
                </div>
              </div>
            </div>
            <div
              style={{
                background: THEME.colors.orangeLight,
                color: THEME.colors.orange,
                fontWeight: 800,
                fontSize: "16px",
                padding: "10px 20px",
                borderRadius: "9999px",
                border: `1px solid ${THEME.colors.orange}`,
              }}
            >
              DAILY: 9:00 PM
            </div>
          </div>
        </ElevatedCard>
      </div>

      <div style={{ height: "20px" }} />
    </CanvasBase>
  );
};
