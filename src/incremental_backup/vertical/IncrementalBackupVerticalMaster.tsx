import React from "react";
import { Series } from "remotion";
import { Scene01Vertical } from "./Scene01Vertical";
import { Scene02Vertical } from "./Scene02Vertical";
import { Scene03Vertical } from "./Scene03Vertical";
import { Scene04Vertical } from "./Scene04Vertical";
import { Scene05Vertical } from "./Scene05Vertical";
import { Scene06Vertical } from "./Scene06Vertical";
import { Scene07Vertical } from "./Scene07Vertical";
import { Scene08Vertical } from "./Scene08Vertical";
import { Scene09Vertical } from "./Scene09Vertical";
import { Scene10Vertical } from "./Scene10Vertical";

/**
 * 9:16 Vertical Master Sequence (1080x1920 @ 30 FPS)
 * Total Duration: 10,487 frames (~349.57s / ~5.83 min)
 * Inspired by reference video modern tech explainer format:
 * - Top 55%: Floating 3D B-Roll Hardware & UI Mockups with physical inertia
 * - Bottom 45%: Centered Punchy Kinetic Subtitles with word-by-word active pop
 */

export const IncrementalBackupVerticalMaster: React.FC = () => {
  return (
    <Series>
      <Series.Sequence durationInFrames={914}>
        <Scene01Vertical />
      </Series.Sequence>
      <Series.Sequence durationInFrames={1510}>
        <Scene02Vertical />
      </Series.Sequence>
      <Series.Sequence durationInFrames={1111}>
        <Scene03Vertical />
      </Series.Sequence>
      <Series.Sequence durationInFrames={780}>
        <Scene04Vertical />
      </Series.Sequence>
      <Series.Sequence durationInFrames={893}>
        <Scene05Vertical />
      </Series.Sequence>
      <Series.Sequence durationInFrames={1022}>
        <Scene06Vertical />
      </Series.Sequence>
      <Series.Sequence durationInFrames={1216}>
        <Scene07Vertical />
      </Series.Sequence>
      <Series.Sequence durationInFrames={1217}>
        <Scene08Vertical />
      </Series.Sequence>
      <Series.Sequence durationInFrames={763}>
        <Scene09Vertical />
      </Series.Sequence>
      <Series.Sequence durationInFrames={1061}>
        <Scene10Vertical />
      </Series.Sequence>
    </Series>
  );
};
