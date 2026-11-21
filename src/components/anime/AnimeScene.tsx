import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { AnimeSpeedLines } from "./AnimeSpeedLines";

interface AnimeSceneProps {
  title?: string;
  speaker?: string;
  dialogue?: string;
  keyframeImg?: string | null;
  isActionShot?: boolean;
}

export const AnimeScene: React.FC<AnimeSceneProps> = ({
  title = "EPISODE 01: THE INCREMENTAL PROTOCOL",
  speaker = "PROTAGONIST",
  dialogue = "The database is expanding at fifty gigabytes per hour. We need incremental snapshots now!",
  keyframeImg = null,
  isActionShot = true,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Cinematic Camera Zoom
  const cameraZoom = interpolate(frame, [0, 90], [1.0, 1.08], {
    extrapolateRight: "clamp",
  });

  // Entrance spring for dialogue card
  const cardSpring = spring({
    frame: frame - 15,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: "#05070E",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* 1. 3D NPR Background / Keyframe with Camera Push */}
      <div
        style={{
          width: "100%",
          height: "100%",
          transform: `scale(${cameraZoom})`,
          transformOrigin: "center center",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        {keyframeImg ? (
          <Img
            src={staticFile(keyframeImg)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "contrast(1.1) saturate(1.2)",
            }}
          />
        ) : (
          /* High-End Cyberpunk / Anime Neon Atmosphere */
          <div
            style={{
              width: "100%",
              height: "100%",
              background:
                "radial-gradient(ellipse at 50% 30%, #312E81 0%, #1E1B4B 45%, #05070E 85%)",
              position: "relative",
            }}
          >
            {/* Grid Horizon */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                width: "100%",
                height: "45%",
                backgroundImage:
                  "linear-gradient(rgba(244, 91, 22, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(244, 91, 22, 0.15) 1px, transparent 1px)",
                backgroundSize: "60px 40px",
                transform: "perspective(300px) rotateX(45deg)",
                transformOrigin: "bottom center",
              }}
            />
          </div>
        )}
      </div>

      {/* 2. Anime Radial Speed Lines (Triggered on Action Shots) */}
      {isActionShot && (
        <AnimeSpeedLines color="rgba(244, 91, 22, 0.4)" density={56} intensity={1.2} />
      )}

      {/* 3. Cinematic 2.39:1 Letterbox Bars */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: 100,
          background: "#000",
          zIndex: 30,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: 100,
          background: "#000",
          zIndex: 30,
        }}
      />

      {/* 4. Top Japanese / English Episode Header */}
      <div
        style={{
          position: "absolute",
          top: 115,
          left: 60,
          zIndex: 40,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span
          style={{
            background: "#F45B16",
            color: "#FFF",
            padding: "4px 12px",
            borderRadius: 4,
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: "0.15em",
          }}
        >
          ANIME CINEMATIC
        </span>
        <span
          style={{
            color: "rgba(255, 255, 255, 0.7)",
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          {title}
        </span>
      </div>

      {/* 5. Bottom Stylized Dialogue Card */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: "50%",
          transform: `translateX(-50%) translateY(${(1 - cardSpring) * 60}px)`,
          opacity: cardSpring,
          zIndex: 40,
          width: "85%",
          maxWidth: 1200,
          background: "rgba(9, 14, 26, 0.88)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(244, 91, 22, 0.4)",
          borderRadius: 16,
          padding: "24px 36px",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(244, 91, 22, 0.15)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 8,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "#F45B16",
            }}
          />
          <span
            style={{
              color: "#F45B16",
              fontWeight: 800,
              fontSize: 15,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            {speaker}
          </span>
        </div>

        <p
          style={{
            color: "#F1F5F9",
            fontSize: 26,
            fontWeight: 600,
            lineHeight: 1.45,
            margin: 0,
            textShadow: "0 2px 10px rgba(0,0,0,0.8)",
          }}
        >
          "{dialogue}"
        </p>
      </div>
    </div>
  );
};
