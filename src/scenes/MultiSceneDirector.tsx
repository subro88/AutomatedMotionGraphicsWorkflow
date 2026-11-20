import React from "react";
import { useCurrentFrame, useVideoConfig, Audio, staticFile, interpolate, spring } from "remotion";
import { StoryboardConfig } from "./types";
import { KineticScene } from "./KineticScene";
import { CorporateSlideScene } from "./CorporateSlideScene";
import { InfographicScene } from "./InfographicScene";
import { ThreeFloatingCoreScene } from "./ThreeFloatingCore";
import { ThreeIsometricBarsScene } from "./ThreeIsometricBars";
import { ThreeHologramCardScene } from "./ThreeHologramCard";

interface DirectorProps {
  storyboard: StoryboardConfig;
  spectrumData?: {
    fps: number;
    numBars: number;
    totalFrames: number;
    frames: number[][];
  };
}

export const MultiSceneDirector: React.FC<DirectorProps> = ({
  storyboard,
  spectrumData,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const scenes = storyboard?.scenes || [];
  
  // Find current active scene
  let currentScene = scenes[0];
  let localFrame = frame;

  for (let i = 0; i < scenes.length; i++) {
    const s = scenes[i];
    const end = s.startFrame + s.durationInFrames;
    if (frame >= s.startFrame && frame < end) {
      currentScene = s;
      localFrame = frame - s.startFrame;
      break;
    }
  }

  // Fallback if past end
  if (!currentScene && scenes.length > 0) {
    currentScene = scenes[scenes.length - 1];
    localFrame = frame - currentScene.startFrame;
  }

  // Dynamic Camera Zoom Pulse from Bass Energy
  const currentAmplitudes =
    spectrumData?.frames?.[frame] || new Array(24).fill(0.05);
  const bassEnergy =
    currentAmplitudes.slice(0, 4).reduce((acc, val) => acc + val, 0) / 4;
  const beatScale = 1.0 + bassEnergy * 0.035;

  // Scene transition slide/wipe spring
  const transitionSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 14, mass: 0.75 },
  });

  const slideY = interpolate(transitionSpring, [0, 1], [40, 0]);
  const sceneOpacity = interpolate(localFrame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        backgroundColor: "#060911",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Audio src={staticFile("audio.mp3")} />

      {/* Main Render Viewport with Beat Zoom */}
      <div
        style={{
          width: "100%",
          height: "100%",
          transform: `scale(${beatScale}) translateY(${slideY}px)`,
          opacity: sceneOpacity,
          transformOrigin: "center center",
          transition: "transform 0.05s ease-out",
        }}
      >
        {currentScene?.type === "kinetic" && (
          <KineticScene
            frame={localFrame}
            fps={fps}
            width={width}
            height={height}
            title={currentScene.title}
            subtitle={currentScene.subtitle}
            primaryColor={currentScene.primaryColor || "#00f2fe"}
            glowColor={currentScene.glowColor || "rgba(0, 242, 254, 0.4)"}
            spectrumAmplitudes={currentAmplitudes}
          />
        )}

        {currentScene?.type === "corporate_slide" && (
          <CorporateSlideScene
            frame={localFrame}
            fps={fps}
            width={width}
            height={height}
            title={currentScene.title}
            subtitle={currentScene.subtitle}
            category={currentScene.category || "Executive Brief"}
            bullets={currentScene.bullets}
            primaryColor={currentScene.primaryColor || "#00f2fe"}
          />
        )}

        {currentScene?.type === "infographic" && (
          <InfographicScene
            frame={localFrame}
            fps={fps}
            width={width}
            height={height}
            title={currentScene.title}
            metricValue={currentScene.metricValue || "+142%"}
            metricLabel={currentScene.metricLabel || "Performance Surge"}
            chartBars={currentScene.chartBars}
            primaryColor={currentScene.primaryColor || "#00f2fe"}
          />
        )}

        {currentScene?.type === "three_core" && (
          <ThreeFloatingCoreScene
            frame={localFrame}
            fps={fps}
            width={width}
            height={height}
            title={currentScene.title}
            subtitle={currentScene.subtitle}
            primaryColor={currentScene.primaryColor || "#00f2fe"}
            spectrumAmplitudes={currentAmplitudes}
          />
        )}

        {currentScene?.type === "three_bars" && (
          <ThreeIsometricBarsScene
            frame={localFrame}
            fps={fps}
            width={width}
            height={height}
            title={currentScene.title}
            metricLabel={currentScene.metricLabel || "Quantitative Surge"}
            primaryColor={currentScene.primaryColor || "#00f2fe"}
          />
        )}

        {currentScene?.type === "three_hologram" && (
          <ThreeHologramCardScene
            frame={localFrame}
            fps={fps}
            width={width}
            height={height}
            title={currentScene.title}
            subtitle={currentScene.subtitle}
            primaryColor={currentScene.primaryColor || "#00f2fe"}
          />
        )}
      </div>
    </div>
  );
};

