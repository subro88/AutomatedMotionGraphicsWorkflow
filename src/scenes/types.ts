export type SceneType =
  | "kinetic"
  | "corporate_slide"
  | "infographic"
  | "three_core"
  | "three_bars"
  | "three_hologram";

export interface ChartBarItem {
  label: string;
  value: number; // percentage 0-100
}

export interface SceneItem {
  id: string;
  type: SceneType;
  startFrame: number;
  durationInFrames: number;
  title: string;
  subtitle?: string;
  category?: string;
  bullets?: string[];
  metricValue?: string;
  metricLabel?: string;
  chartBars?: ChartBarItem[];
  primaryColor?: string;
  glowColor?: string;
}

export interface StoryboardConfig {
  fps: number;
  totalDurationInFrames: number;
  scenes: SceneItem[];
}
