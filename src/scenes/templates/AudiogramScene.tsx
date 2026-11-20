import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Audio,
  staticFile,
} from "remotion";

export interface AudiogramProps {
  podcastTitle?: string;
  episodeNumber?: string;
  guestName?: string;
  speakerRole?: string;
  primaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  numBars?: number;
}

export const AudiogramScene: React.FC<AudiogramProps> = ({
  podcastTitle = "The Autonomous Media Revolution",
  episodeNumber = "EPISODE #42",
  guestName = "Dr. Christopher Vance",
  speakerRole = "VP of Generative Systems",
  primaryColor = "#0066FF",
  accentColor = "#00FF88",
  backgroundColor = "#0A0A0F",
  numBars = 48,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();

  const isVertical = height > width;
  const contentScale = isVertical ? 0.85 : 1.0;

  // Background audio
  const audioSrc = staticFile("taskflow_voice.wav");

  // Entrance spring
  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 90, mass: 0.6, stiffness: 120 },
  });

  // Pulse animation for avatar
  const pulseScale = 1 + Math.sin(frame * 0.12) * 0.04;

  // Waveform bars procedural frequency energy
  const bars = Array.from({ length: numBars }).map((_, i) => {
    // Spatial wave + temporal harmonics
    const harmonic1 = Math.sin(frame * 0.2 + i * 0.35);
    const harmonic2 = Math.cos(frame * 0.15 - i * 0.2);
    const harmonic3 = Math.sin(frame * 0.08 + i * 0.8);
    
    // Normalized amplitude (0.1 to 1.0)
    const rawAmp = (Math.abs(harmonic1 * 0.5 + harmonic2 * 0.3 + harmonic3 * 0.2) + 0.12);
    const amp = Math.min(1.0, Math.max(0.08, rawAmp));

    const barHeight = interpolate(amp, [0, 1], [8, isVertical ? 110 : 140], {
      extrapolateRight: "clamp",
      extrapolateLeft: "clamp",
    });

    return { height: barHeight, amp };
  });

  // Progress timecode
  const progressRatio = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const currentSec = Math.floor(frame / fps);
  const totalSec = Math.floor(durationInFrames / fps);
  const timeFormatted = `${String(Math.floor(currentSec / 60)).padStart(2, "0")}:${String(currentSec % 60).padStart(2, "0")} / ${String(Math.floor(totalSec / 60)).padStart(2, "0")}:${String(totalSec % 60).padStart(2, "0")}`;

  return (
    <div
      style={{
        width,
        height,
        backgroundColor,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        color: "#FFFFFF",
      }}
    >
      <Audio src={audioSrc} />

      {/* Ambient background glows */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${primaryColor}33 0%, transparent 70%)`,
          filter: "blur(60px)",
          top: "20%",
          left: isVertical ? "5%" : "20%",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accentColor}22 0%, transparent 70%)`,
          filter: "blur(60px)",
          bottom: "15%",
          right: isVertical ? "5%" : "20%",
          pointerEvents: "none",
        }}
      />

      {/* Main Container Card */}
      <div
        style={{
          width: isVertical ? "88%" : 1080,
          padding: isVertical ? "32px 24px" : "44px 52px",
          borderRadius: 32,
          backgroundColor: "rgba(18, 24, 40, 0.75)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          backdropFilter: "blur(24px)",
          boxShadow: `0 24px 70px rgba(0, 0, 0, 0.6), 0 0 30px ${primaryColor}22`,
          display: "flex",
          flexDirection: isVertical ? "column" : "row",
          alignItems: "center",
          gap: isVertical ? 32 : 48,
          transform: `scale(${contentScale * enterSpring})`,
          zIndex: 10,
        }}
      >
        {/* Left Column: Avatar & Episode Badge */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
          }}
        >
          {/* Avatar Ring */}
          <div
            style={{
              position: "relative",
              width: isVertical ? 160 : 200,
              height: isVertical ? 160 : 200,
              borderRadius: "50%",
              padding: 6,
              background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})`,
              boxShadow: `0 0 40px ${primaryColor}66`,
              transform: `scale(${pulseScale})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Inner Avatar Graphic */}
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                backgroundColor: "#0d1424",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                border: "2px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 6C13.66 6 15 7.34 15 9C15 10.66 13.66 12 12 12C10.34 12 9 10.66 9 9C9 7.34 10.34 6 12 6ZM12 20C9.5 20 7.29 18.92 5.8 17.2C6.72 15.68 9.24 14.8 12 14.8C14.76 14.8 17.28 15.68 18.2 17.2C16.71 18.92 14.5 20 12 20Z"
                  fill="url(#avatarGrad)"
                />
                <defs>
                  <linearGradient id="avatarGrad" x1="2" y1="2" x2="22" y2="22">
                    <stop stopColor={primaryColor} />
                    <stop offset="1" stopColor={accentColor} />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Episode Tag */}
          <div
            style={{
              marginTop: 18,
              padding: "4px 14px",
              borderRadius: 20,
              backgroundColor: `${accentColor}22`,
              border: `1px solid ${accentColor}66`,
              color: accentColor,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.1em",
            }}
          >
            {episodeNumber}
          </div>
        </div>

        {/* Right Column: Titles, Dynamic Waveform & Progress */}
        <div style={{ flex: 1, width: "100%", display: "flex", flexDirection: "column" }}>
          {/* Podcast Show Title */}
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              color: primaryColor,
              marginBottom: 4,
            }}
          >
            {podcastTitle}
          </div>

          {/* Speaker / Guest Name */}
          <h2
            style={{
              fontSize: isVertical ? 26 : 36,
              fontWeight: 800,
              margin: 0,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
            }}
          >
            {guestName}
          </h2>

          {/* Speaker Role */}
          <div
            style={{
              fontSize: 14,
              color: "rgba(255, 255, 255, 0.6)",
              marginTop: 4,
              marginBottom: 24,
            }}
          >
            {speakerRole}
          </div>

          {/* Dynamic Waveform Visualizer */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: isVertical ? 110 : 140,
              gap: 3,
              marginBottom: 24,
              padding: "0 4px",
            }}
          >
            {bars.map((b, idx) => (
              <div
                key={idx}
                style={{
                  flex: 1,
                  height: b.height,
                  borderRadius: 4,
                  background: `linear-gradient(180deg, ${accentColor}, ${primaryColor})`,
                  opacity: 0.35 + b.amp * 0.65,
                  boxShadow: b.amp > 0.6 ? `0 0 10px ${accentColor}88` : "none",
                  transformOrigin: "bottom center",
                }}
              />
            ))}
          </div>

          {/* Scrubber Progress Bar */}
          <div>
            <div
              style={{
                width: "100%",
                height: 6,
                borderRadius: 3,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                position: "relative",
                overflow: "hidden",
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: `${progressRatio * 100}%`,
                  background: `linear-gradient(90deg, ${primaryColor}, ${accentColor})`,
                  boxShadow: `0 0 12px ${accentColor}`,
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 12,
                fontFamily: "monospace",
                color: "rgba(255, 255, 255, 0.5)",
              }}
            >
              <span>{timeFormatted.split("/")[0].trim()}</span>
              <span>{timeFormatted.split("/")[1].trim()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

