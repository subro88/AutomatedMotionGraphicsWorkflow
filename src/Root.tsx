import React, { useEffect, useRef } from "react";
import { Composition, useCurrentFrame, useVideoConfig, Audio, staticFile } from "remotion";
import anime from "animejs";
import { MultiSceneDirector } from "./scenes/MultiSceneDirector";
import { StoryboardConfig } from "./scenes/types";
import { ThreeFloatingCoreScene } from "./scenes/ThreeFloatingCore";
import { ThreeIsometricBarsScene } from "./scenes/ThreeIsometricBars";
import { ThreeHologramCardScene } from "./scenes/ThreeHologramCard";
import { TaskFlowPromo } from "./scenes/TaskFlowPromo";
import { AudiogramScene } from "./scenes/templates/AudiogramScene";
import { CodeWalkthroughScene } from "./scenes/templates/CodeWalkthroughScene";
import { StargazerScene } from "./scenes/templates/StargazerScene";
import { TransparentOverlayScene } from "./scenes/templates/TransparentOverlayScene";
import { EffectsShowcaseScene } from "./scenes/templates/EffectsShowcaseScene";
import { NHITAdvertisement } from "./NHITAdvertisement";
import { NHITBroadcast45s } from "./NHITBroadcast45s";
import { NHITExtended70s } from "./NHITExtended70s";
import { NHITInfographic16x9 } from "./NHITInfographic16x9";
import { NHITInfographic9x16 } from "./NHITInfographic9x16";
import { ScalabilityMasterclass16x9 } from "./ScalabilityMasterclass16x9";
import { ScalabilityShorts9x16 } from "./ScalabilityShorts9x16";
import { GsapEngineeringMotion } from "./components/GsapEngineeringMotion";
import { HardwareTeardownScene } from "./HardwareTeardownScene";
import { DocumentaryHistoryScene } from "./DocumentaryHistoryScene";
import { PodcastStudioScene } from "./PodcastStudioScene";
import { AnimeScene } from "./components/anime/AnimeScene";
import { IncrementalBackupMaster } from "./incremental_backup/IncrementalBackupMaster";
import { Scene01Intro } from "./incremental_backup/scenes/Scene01Intro";
import { Scene02WhatIsIncremental } from "./incremental_backup/scenes/Scene02WhatIsIncremental";
import { Scene03IncrementalVsDiff } from "./incremental_backup/scenes/Scene03IncrementalVsDiff";
import { Scene04WindowsServerBackup } from "./incremental_backup/scenes/Scene04WindowsServerBackup";
import { Scene05ConfigurePerformance } from "./incremental_backup/scenes/Scene05ConfigurePerformance";
import { Scene06ScheduleBackup } from "./incremental_backup/scenes/Scene06ScheduleBackup";
import { Scene07AomeiBackupper } from "./incremental_backup/scenes/Scene07AomeiBackupper";
import { Scene08Limitations } from "./incremental_backup/scenes/Scene08Limitations";
import { Scene09EndOfSupport } from "./incremental_backup/scenes/Scene09EndOfSupport";
import { Scene10FinalSummary } from "./incremental_backup/scenes/Scene10FinalSummary";
import { IncrementalBackupVerticalMaster } from "./incremental_backup/vertical/IncrementalBackupVerticalMaster";
import { Scene01Vertical } from "./incremental_backup/vertical/Scene01Vertical";
import { Scene02Vertical } from "./incremental_backup/vertical/Scene02Vertical";
import { Scene03Vertical } from "./incremental_backup/vertical/Scene03Vertical";
import { Scene04Vertical } from "./incremental_backup/vertical/Scene04Vertical";
import { Scene05Vertical } from "./incremental_backup/vertical/Scene05Vertical";
import { Scene06Vertical } from "./incremental_backup/vertical/Scene06Vertical";
import { Scene07Vertical } from "./incremental_backup/vertical/Scene07Vertical";
import { Scene08Vertical } from "./incremental_backup/vertical/Scene08Vertical";
import { Scene09Vertical } from "./incremental_backup/vertical/Scene09Vertical";
import { Scene10Vertical } from "./incremental_backup/vertical/Scene10Vertical";

interface MasterProps {
  baseRadius: number;
  maxBarHeight: number;
  primaryColor: string;
  glowColor: string;
  spectrumData: {
    fps: number;
    numBars: number;
    totalFrames: number;
    frames: number[][];
  };
}

export const HybridKineticScene: React.FC<MasterProps> = ({
  baseRadius,
  maxBarHeight,
  primaryColor,
  glowColor,
  spectrumData,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const morphPathRef = useRef<SVGPathElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const barsGroupRef = useRef<SVGGElement>(null);

  const cx = width / 2;
  const cy = height / 2;

  const currentAmplitudes =
    spectrumData?.frames?.[frame] || new Array(spectrumData?.numBars || 24).fill(0.05);

  const bassEnergy =
    currentAmplitudes.slice(0, 4).reduce((acc, val) => acc + val, 0) / 4;
  const pulseRadius = baseRadius + bassEnergy * 32;

  const pathCircle =
    "M 300,100 C 410,100 500,190 500,300 C 500,410 410,500 300,500 C 190,500 100,410 100,300 C 100,190 190,100 300,100 Z";
  const pathDiamond =
    "M 300,60 C 460,140 540,240 500,380 C 460,480 340,540 300,540 C 260,540 140,480 100,380 C 60,240 140,140 300,60 Z";

  useEffect(() => {
    if (!barsGroupRef.current || !ringRef.current || !morphPathRef.current) return;

    // Continuous radial rotation driven by Remotion frame counter
    const rot = (frame / fps) * 22;
    anime.set(barsGroupRef.current, {
      rotate: `${rot}deg`,
      transformOrigin: `${cx}px ${cy}px`,
    });

    // Deterministic geometric path morph scrub
    anime({
      targets: morphPathRef.current,
      d: [{ value: pathDiamond }, { value: pathCircle }],
      duration: 1200,
      easing: "easeInOutQuad",
      autoplay: false,
    }).seek(((frame % (fps * 2)) / (fps * 2)) * 1200);

    // Core pulse seek
    anime({
      targets: ringRef.current,
      r: pulseRadius,
      duration: 1000 / fps,
      easing: "easeOutQuad",
      autoplay: false,
    }).seek((frame / fps) * 1000);
  }, [frame, fps, cx, cy, pulseRadius]);

  return (
    <div
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        backgroundColor: "#060911",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Audio src={staticFile("audio.mp3")} />

      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ filter: `drop-shadow(0 0 24px ${glowColor})` }}
      >
        <circle
          ref={ringRef}
          cx={cx}
          cy={cy}
          r={pulseRadius}
          fill="#0c1322"
          stroke={primaryColor}
          strokeWidth="4"
        />

        <g transform={`translate(${cx - 300}, ${cy - 300})`}>
          <path
            ref={morphPathRef}
            d={pathCircle}
            fill="none"
            stroke="#ffffff"
            strokeWidth="3"
            opacity={0.35 + bassEnergy * 0.65}
          />
        </g>

        <g ref={barsGroupRef}>
          {currentAmplitudes.map((amp, i) => {
            const angleDeg = (i / spectrumData.numBars) * 360;
            const angleRad = (angleDeg * Math.PI) / 180;
            const barLength = Math.max(8, amp * maxBarHeight);

            const x1 = cx + baseRadius * Math.cos(angleRad);
            const y1 = cy + baseRadius * Math.sin(angleRad);
            const x2 = cx + (baseRadius + barLength) * Math.cos(angleRad);
            const y2 = cy + (baseRadius + barLength) * Math.sin(angleRad);

            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={primaryColor}
                strokeWidth="5"
                strokeLinecap="round"
                opacity={0.4 + amp * 0.6}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export const RemotionRoot: React.FC = () => {
  const dummySpectrum = {
    fps: 30,
    numBars: 24,
    totalFrames: 900,
    frames: [],
  };

  const defaultStoryboard: StoryboardConfig = {
    fps: 30,
    totalDurationInFrames: 900,
    scenes: [
      {
        id: "scene_1",
        type: "kinetic",
        startFrame: 0,
        durationInFrames: 300,
        title: "Autonomous Motion Workstation",
        subtitle: "AI-Powered Generative Video Deck",
        primaryColor: "#00f2fe",
      },
      {
        id: "scene_2",
        type: "corporate_slide",
        startFrame: 300,
        durationInFrames: 300,
        title: "Strategic Velocity & Precision",
        subtitle: "Zero-Touch Pipeline Deployment",
        category: "Enterprise Scale",
        bullets: [
          "Faster-Whisper GPU-accelerated word alignment",
          "Deterministic Anime.js geometric morphing",
          "Automated DaVinci Resolve timeline delivery",
        ],
        primaryColor: "#00f2fe",
      },
      {
        id: "scene_3",
        type: "infographic",
        startFrame: 600,
        durationInFrames: 300,
        title: "Performance & Rendering Acceleration",
        metricValue: "+142%",
        metricLabel: "Throughput Multiplier",
        chartBars: [
          { label: "Manual Timeline Assembly", value: 25 },
          { label: "Scripted Automation", value: 65 },
          { label: "Antigravity Autonomous Workstation", value: 98 },
        ],
        primaryColor: "#00f2fe",
      },
    ],
  };

  return (
    <>
      {/* Standalone Kinetic Compositions */}
      <Composition
        id="Master-16x9"
        component={HybridKineticScene}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          baseRadius: 160,
          maxBarHeight: 210,
          primaryColor: "#00f2fe",
          glowColor: "rgba(0, 242, 254, 0.4)",
          spectrumData: dummySpectrum,
        }}
      />
      <Composition
        id="Master-9x16"
        component={HybridKineticScene}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          baseRadius: 200,
          maxBarHeight: 260,
          primaryColor: "#00f2fe",
          glowColor: "rgba(0, 242, 254, 0.4)",
          spectrumData: dummySpectrum,
        }}
      />

      {/* Multi-Scene Compositions (Motion Graphics, Corporate Slides, Infographics) */}
      <Composition
        id="MultiSceneDeck-16x9"
        component={MultiSceneDirector}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          storyboard: defaultStoryboard,
          spectrumData: dummySpectrum,
        }}
      />
      <Composition
        id="MultiSceneDeck-9x16"
        component={MultiSceneDirector}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          storyboard: defaultStoryboard,
          spectrumData: dummySpectrum,
        }}
      />

      {/* 3D WebGL Three.js Compositions */}
      <Composition
        id="ThreeCore-16x9"
        component={ThreeFloatingCoreScene}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          frame: 0,
          fps: 30,
          width: 1920,
          height: 1080,
          title: "3D Autonomous Tech Core",
          subtitle: "WebGL Accelerated Spatial Geometry",
          primaryColor: "#00f2fe",
          spectrumAmplitudes: [],
        }}
      />
      <Composition
        id="ThreeCore-9x16"
        component={ThreeFloatingCoreScene}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          frame: 0,
          fps: 30,
          width: 1080,
          height: 1920,
          title: "3D Autonomous Tech Core",
          subtitle: "WebGL Accelerated Spatial Geometry",
          primaryColor: "#00f2fe",
          spectrumAmplitudes: [],
        }}
      />
      <Composition
        id="ThreeBars-16x9"
        component={ThreeIsometricBarsScene}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          frame: 0,
          fps: 30,
          width: 1920,
          height: 1080,
          title: "3D Quantitative Metrics",
          metricLabel: "Q3 Performance Velocity",
          primaryColor: "#00f2fe",
        }}
      />
      <Composition
        id="ThreeBars-9x16"
        component={ThreeIsometricBarsScene}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          frame: 0,
          fps: 30,
          width: 1080,
          height: 1920,
          title: "3D Quantitative Metrics",
          metricLabel: "Q3 Performance Velocity",
          primaryColor: "#00f2fe",
        }}
      />
      <Composition
        id="ThreeHologram-16x9"
        component={ThreeHologramCardScene}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          frame: 0,
          fps: 30,
          width: 1920,
          height: 1080,
          title: "3D Hologram Presentation",
          subtitle: "Spatial Glassmorphic Depth",
          primaryColor: "#00f2fe",
        }}
      />
      <Composition
        id="ThreeHologram-9x16"
        component={ThreeHologramCardScene}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          frame: 0,
          fps: 30,
          width: 1080,
          height: 1920,
          title: "3D Hologram Presentation",
          subtitle: "Spatial Glassmorphic Depth",
          primaryColor: "#00f2fe",
        }}
      />
      <Composition
        id="Hardware-Teardown-16x9"
        component={HardwareTeardownScene}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          aspectRatio: "16:9",
          primaryColor: "#00E5FF",
          accentColor: "#FFB300",
          transparentHudOnly: false,
        }}
      />
      <Composition
        id="Hardware-Teardown-HUD-16x9"
        component={HardwareTeardownScene}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          aspectRatio: "16:9",
          primaryColor: "#00E5FF",
          accentColor: "#FFB300",
          transparentHudOnly: true,
        }}
      />
      <Composition
        id="Hardware-Teardown-9x16"
        component={HardwareTeardownScene}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          aspectRatio: "9:16",
          primaryColor: "#00E5FF",
          accentColor: "#FFB300",
          transparentHudOnly: false,
        }}
      />
      <Composition
        id="Hardware-Teardown-HUD-9x16"
        component={HardwareTeardownScene}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          aspectRatio: "9:16",
          primaryColor: "#00E5FF",
          accentColor: "#FFB300",
          transparentHudOnly: true,
        }}
      />
      {/* Genre 3: Documentary, History & Cartoon Animation */}
      <Composition
        id="Documentary-16x9"
        component={DocumentaryHistoryScene}
        durationInFrames={450}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          aspectRatio: "16:9",
          primaryColor: "#eab308",
          accentColor: "#dc2626",
        }}
      />
      <Composition
        id="Documentary-9x16"
        component={DocumentaryHistoryScene}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          aspectRatio: "9:16",
          primaryColor: "#eab308",
          accentColor: "#dc2626",
        }}
      />
      {/* Genre 4: Podcast, Video Podcasts & Audiograms */}
      <Composition
        id="Podcast-16x9"
        component={PodcastStudioScene}
        durationInFrames={450}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          aspectRatio: "16:9",
          primaryColor: "#00e5ff",
          accentColor: "#f59e0b",
        }}
      />
      <Composition
        id="Podcast-9x16"
        component={PodcastStudioScene}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          aspectRatio: "9:16",
          primaryColor: "#00e5ff",
          accentColor: "#f59e0b",
        }}
      />
      <Composition
        id="TaskFlow-16x9"
        component={TaskFlowPromo}
        durationInFrames={600}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          primaryColor: "#0066FF",
          secondaryColor: "#8B5CF6",
          accentColor: "#00FF88",
          backgroundColor: "#0A0A0F",
        }}
      />
      <Composition
        id="TaskFlow-9x16"
        component={TaskFlowPromo}
        durationInFrames={600}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          primaryColor: "#0066FF",
          secondaryColor: "#8B5CF6",
          accentColor: "#00FF88",
          backgroundColor: "#0A0A0F",
        }}
      />
      {/* ------------------------------------------------------------- */}
      {/* REMOTION TEMPLATES CATALOG EXPANSIONS                         */}
      {/* ------------------------------------------------------------- */}
      {/* 1. Audiogram / Podcast Waveform */}
      <Composition
        id="Audiogram-16x9"
        component={AudiogramScene}
        durationInFrames={450}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          podcastTitle: "The Autonomous Media Revolution",
          episodeNumber: "EPISODE #42",
          guestName: "Dr. Christopher Vance",
          speakerRole: "VP of Generative Systems",
          primaryColor: "#0066FF",
          accentColor: "#00FF88",
          backgroundColor: "#0A0A0F",
        }}
      />
      <Composition
        id="Audiogram-9x16"
        component={AudiogramScene}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          podcastTitle: "The Autonomous Media Revolution",
          episodeNumber: "EPISODE #42",
          guestName: "Dr. Christopher Vance",
          speakerRole: "VP of Generative Systems",
          primaryColor: "#0066FF",
          accentColor: "#00FF88",
          backgroundColor: "#0A0A0F",
        }}
      />

      {/* 2. Code Walkthrough / Code Hike */}
      <Composition
        id="CodeWalkthrough-16x9"
        component={CodeWalkthroughScene}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          fileName: "motion_pipeline.ts",
          focusLineStart: 4,
          focusLineEnd: 7,
          language: "TypeScript",
          primaryColor: "#0066FF",
          accentColor: "#00FF88",
          backgroundColor: "#0A0A0F",
        }}
      />
      <Composition
        id="CodeWalkthrough-9x16"
        component={CodeWalkthroughScene}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          fileName: "motion_pipeline.ts",
          focusLineStart: 4,
          focusLineEnd: 7,
          language: "TypeScript",
          primaryColor: "#0066FF",
          accentColor: "#00FF88",
          backgroundColor: "#0A0A0F",
        }}
      />

      {/* 3. GitHub Stargazer Milestone */}
      <Composition
        id="Stargazer-16x9"
        component={StargazerScene}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          repoName: "antigravity / motion-graphics-pipeline",
          targetStars: 12500,
          milestoneTitle: "10,000 GITHUB STARS CELEBRATION",
          primaryColor: "#0066FF",
          accentColor: "#FFD700",
          backgroundColor: "#0A0A0F",
        }}
      />
      <Composition
        id="Stargazer-9x16"
        component={StargazerScene}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          repoName: "antigravity / motion-graphics-pipeline",
          targetStars: 12500,
          milestoneTitle: "10,000 GITHUB STARS CELEBRATION",
          primaryColor: "#0066FF",
          accentColor: "#FFD700",
          backgroundColor: "#0A0A0F",
        }}
      />

      {/* 4. Transparent Alpha Overlays (Lower-Third, Corner Badge, Callouts) */}
      <Composition
        id="Overlay-16x9"
        component={TransparentOverlayScene}
        durationInFrames={450}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          overlayMode: "full_sequence",
          speakerName: "Christopher Vance",
          speakerRole: "AI Video Systems Architect • @chris_vance",
          badgeText: "🔔 SUBSCRIBE • Join 50K Creators",
          calloutTitle: "10x Render Acceleration",
          calloutSubtitle: "NVIDIA NVENC Gen 7 • 0.2s Frame Latency",
          primaryColor: "#0066FF",
          accentColor: "#00FF88",
        }}
      />
      <Composition
        id="Overlay-9x16"
        component={TransparentOverlayScene}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          overlayMode: "full_sequence",
          speakerName: "Christopher Vance",
          speakerRole: "AI Video Systems Architect • @chris_vance",
          badgeText: "🔔 SUBSCRIBE • Join 50K Creators",
          calloutTitle: "10x Render Acceleration",
          calloutSubtitle: "NVIDIA NVENC Gen 7 • 0.2s Frame Latency",
          primaryColor: "#0066FF",
          accentColor: "#00FF88",
        }}
      />
      {/* 5. Shader Effects Showcase (@remotion/effects) */}
      <Composition
        id="EffectsShowcase-16x9"
        component={EffectsShowcaseScene}
        durationInFrames={450}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          primaryColor: "#0066FF",
          secondaryColor: "#8B5CF6",
          accentColor: "#00FF88",
          backgroundColor: "#0A0A0F",
          blurRadius: 24,
          duotoneThreshold: 0.5,
          pixelBlockSize: 16,
          title: "Remotion Shader Effects Engine",
        }}
      />
      <Composition
        id="EffectsShowcase-9x16"
        component={EffectsShowcaseScene}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          primaryColor: "#0066FF",
          secondaryColor: "#8B5CF6",
          accentColor: "#00FF88",
          backgroundColor: "#0A0A0F",
          blurRadius: 24,
          duotoneThreshold: 0.5,
          pixelBlockSize: 16,
          title: "Remotion Shader Effects Engine",
        }}
      />

      {/* 6. NHIT Durgapur Admission Campaign 2026-27 (30s / 900 frames @ 30 FPS, 1920x1080) */}
      <Composition
        id="NHITAdvertisement"
        component={NHITAdvertisement}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          enableAudio: true,
        }}
      />
      <Composition
        id="NHIT-Working-Professionals-Admission-2026-27"
        component={NHITAdvertisement}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          enableAudio: true,
        }}
      />

      {/* 7. NHIT Indian Female Voiceover Broadcast Ad (45s / 1350 frames @ 30 FPS, 1920x1080) */}
      <Composition
        id="NHIT-Broadcast-45s"
        component={NHITBroadcast45s}
        durationInFrames={1350}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          enableAudio: true,
        }}
      />

      {/* 8. NHIT Indian Female Voiceover Extended Ad (70s / 2100 frames @ 30 FPS, 1920x1080) */}
      <Composition
        id="NHIT-Extended-70s"
        component={NHITExtended70s}
        durationInFrames={2100}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          enableAudio: true,
        }}
      />

      {/* 9. NHIT High-Impact Infographic Ad - 16:9 Landscape (84.7s / 2541 frames @ 30 FPS, 1920x1080) */}
      <Composition
        id="NHIT-Infographic-16x9"
        component={NHITInfographic16x9}
        durationInFrames={2541}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          enableAudio: true,
        }}
      />

      {/* 10. NHIT High-Impact Infographic Ad - 9:16 Vertical Reels/Shorts (84.7s / 2541 frames @ 30 FPS, 1080x1920) */}
      <Composition
        id="NHIT-Infographic-9x16"
        component={NHITInfographic9x16}
        durationInFrames={2541}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          enableAudio: true,
        }}
      />

      {/* 11. TechNHIT Scalability Masterclass - 16:9 Landscape (128s / 3840 frames @ 30 FPS, 1920x1080) */}
      <Composition
        id="Scalability-Masterclass-16x9"
        component={ScalabilityMasterclass16x9}
        durationInFrames={3840}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          enableAudio: true,
        }}
      />

      {/* 12. TechNHIT Scalability Shorts - 9:16 Vertical (56s / 1680 frames @ 30 FPS, 1080x1920) */}
      <Composition
        id="Scalability-Shorts-9x16"
        component={ScalabilityShorts9x16}
        durationInFrames={1680}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          enableAudio: true,
        }}
      />

      {/* 13. GSAP HyperFrames-Style Kinetic Engineering Motion - 16:9 Landscape (15s / 450 frames @ 30 FPS, 1920x1080) */}
      <Composition
        id="GsapMotion-16x9"
        component={GsapEngineeringMotion}
        durationInFrames={450}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          aspectRatio: "16:9",
          primaryColor: "#087EFF",
          secondaryColor: "#071B33",
          accentColor: "#FF9D32",
          headline: "YOU HAVE THE EXPERIENCE.",
          tagline: "NOW GET THE QUALIFICATION."
        }}
      />

      {/* 14. GSAP HyperFrames-Style Kinetic Engineering Motion - 9:16 Vertical Reels/Shorts (15s / 450 frames @ 30 FPS, 1080x1920) */}
      <Composition
        id="GsapMotion-9x16"
        component={GsapEngineeringMotion}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          aspectRatio: "9:16",
          primaryColor: "#087EFF",
          secondaryColor: "#071B33",
          accentColor: "#FF9D32",
          headline: "YOU HAVE THE EXPERIENCE.",
          tagline: "NOW GET THE QUALIFICATION."
        }}
      />

      {/* =========================================================================
          15. INCREMENTAL BACKUP IN WINDOWS SERVER 2008 (CANVA-STYLE MASTERCLASS)
          Full 10-Scene Master Educational Explainer Video (1920x1080 @ 30 FPS)
          ========================================================================= */}
      <Composition
        id="Incremental-Backup-Master-16x9"
        component={IncrementalBackupMaster}
        durationInFrames={10487}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Individual Modular Scenes for Fine-Grained Preview & Testing */}
      <Composition
        id="Incremental-Scene01"
        component={Scene01Intro}
        durationInFrames={914}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Incremental-Scene02"
        component={Scene02WhatIsIncremental}
        durationInFrames={1510}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Incremental-Scene03"
        component={Scene03IncrementalVsDiff}
        durationInFrames={1111}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Incremental-Scene04"
        component={Scene04WindowsServerBackup}
        durationInFrames={780}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Incremental-Scene05"
        component={Scene05ConfigurePerformance}
        durationInFrames={893}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Incremental-Scene06"
        component={Scene06ScheduleBackup}
        durationInFrames={1022}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Incremental-Scene07"
        component={Scene07AomeiBackupper}
        durationInFrames={1216}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Incremental-Scene08"
        component={Scene08Limitations}
        durationInFrames={1217}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Incremental-Scene09"
        component={Scene09EndOfSupport}
        durationInFrames={763}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Incremental-Scene10"
        component={Scene10FinalSummary}
        durationInFrames={1061}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* =========================================================================
          16. INCREMENTAL BACKUP VERTICAL SHORTS (9:16 - 1080x1920 @ 30 FPS)
          Insiderforce / Reels / TikTok Kinetic Typography & 3D B-Roll Edition
          ========================================================================= */}
      <Composition
        id="Incremental-Backup-Vertical-Master-9x16"
        component={IncrementalBackupVerticalMaster}
        durationInFrames={10487}
        fps={30}
        width={1080}
        height={1920}
      />

      <Composition
        id="Incremental-Vertical-Scene01"
        component={Scene01Vertical}
        durationInFrames={914}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Incremental-Vertical-Scene02"
        component={Scene02Vertical}
        durationInFrames={1510}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Incremental-Vertical-Scene03"
        component={Scene03Vertical}
        durationInFrames={1111}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Incremental-Vertical-Scene04"
        component={Scene04Vertical}
        durationInFrames={780}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Incremental-Vertical-Scene05"
        component={Scene05Vertical}
        durationInFrames={893}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Incremental-Vertical-Scene06"
        component={Scene06Vertical}
        durationInFrames={1022}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Incremental-Vertical-Scene07"
        component={Scene07Vertical}
        durationInFrames={1216}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Incremental-Vertical-Scene08"
        component={Scene08Vertical}
        durationInFrames={1217}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Incremental-Vertical-Scene09"
        component={Scene09Vertical}
        durationInFrames={763}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Incremental-Vertical-Scene10"
        component={Scene10Vertical}
        durationInFrames={1061}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AnimeShowcase-16x9"
        component={AnimeScene}
        durationInFrames={180}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: "EPISODE 01: THE INCREMENTAL PROTOCOL",
          speaker: "PROTAGONIST",
          dialogue: "The main database is expanding at fifty gigabytes per hour. We need incremental snapshots now!",
          isActionShot: true,
        }}
      />
    </>
  );
};

