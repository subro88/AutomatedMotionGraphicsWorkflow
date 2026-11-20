import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { subtitlesData } from "../subtitles";
import { THEME } from "./theme";

interface WordItem {
  word: string;
  start: number;
  end: number;
  startFrame: number;
  endFrame: number;
  isKeyword: boolean;
  accentColor: string;
}

interface ChunkItem {
  chunkIndex: number;
  startFrame: number;
  endFrame: number;
  text: string;
  words: WordItem[];
}

interface KineticSubtitleProps {
  sceneId: string; // e.g. "scene1", "scene2"
  fontSize?: number;
  layout?: "vertical" | "landscape";
  style?: React.CSSProperties;
}

export const KineticSubtitleEngine: React.FC<KineticSubtitleProps> = ({
  sceneId,
  fontSize = 62,
  layout = "vertical",
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneInfo = (subtitlesData as Record<string, { chunks: ChunkItem[] }>)[sceneId];
  if (!sceneInfo || !sceneInfo.chunks || sceneInfo.chunks.length === 0) {
    return null;
  }

  // Find the active chunk for the current frame
  let activeChunk = sceneInfo.chunks.find(
    (c, i) =>
      frame >= c.startFrame - 2 &&
      (frame <= c.endFrame + 12 ||
        (i === sceneInfo.chunks.length - 1 && frame >= c.startFrame))
  );

  // Fallback to latest chunk that has started if between pauses, avoiding blank flashes
  if (!activeChunk) {
    const pastChunks = sceneInfo.chunks.filter((c) => frame >= c.startFrame);
    if (pastChunks.length > 0) {
      activeChunk = pastChunks[pastChunks.length - 1];
    } else {
      activeChunk = sceneInfo.chunks[0];
    }
  }

  // Chunk entrance spring
  const chunkEntrance = spring({
    frame: Math.max(0, frame - activeChunk.startFrame),
    fps,
    config: { damping: 14, mass: 0.5, stiffness: 180 },
  });

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        gap: layout === "vertical" ? "14px 18px" : "10px 14px",
        padding: layout === "vertical" ? "0 40px" : "0 20px",
        maxWidth: layout === "vertical" ? 920 : 780,
        margin: "0 auto",
        textAlign: "center",
        transform: `scale(${0.92 + chunkEntrance * 0.08})`,
        opacity: Math.min(1, chunkEntrance * 1.5),
        ...style,
      }}
    >
      {activeChunk.words.map((w, wIdx) => {
        const isSpoken = frame >= w.startFrame;
        const isCurrent = frame >= w.startFrame && frame <= w.endFrame + 3;

        // Word pop spring animation
        const wordSpring = spring({
          frame: Math.max(0, frame - w.startFrame),
          fps,
          config: { damping: 11, mass: 0.45, stiffness: 220 },
        });

        // Determine styling based on state
        let textColor = "#A1A1AA"; // default upcoming muted grey
        let fontWeight = 600;
        let scale = 0.95;

        if (isCurrent) {
          textColor = w.isKeyword ? w.accentColor : "#18181B";
          fontWeight = 900;
          scale = 0.95 + wordSpring * 0.18; // Pop punch!
        } else if (isSpoken) {
          textColor = "#27272A"; // Spoken past word
          fontWeight = 700;
          scale = 1.0;
        }

        return (
          <span
            key={wIdx}
            style={{
              fontSize: `${fontSize}px`,
              lineHeight: 1.15,
              fontWeight,
              color: textColor,
              display: "inline-block",
              transform: `scale(${scale})`,
              transformOrigin: "center center",
              transition: "color 0.1s ease",
              letterSpacing: "-0.03em",
              fontFamily: THEME.typography.fontFamily,
              textShadow: isCurrent && w.isKeyword ? `0 4px 18px ${w.accentColor}35` : "none",
            }}
          >
            {w.word}
          </span>
        );
      })}
    </div>
  );
};
