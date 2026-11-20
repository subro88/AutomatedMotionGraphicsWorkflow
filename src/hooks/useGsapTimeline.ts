import { useLayoutEffect, useRef } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { gsap } from "gsap";

/**
 * useGsapTimeline: Deterministic GSAP Timeline Hook for Remotion.
 * 
 * Inspired by HyperFrames' agent-native frame-stepping architecture.
 * Rather than letting GSAP run on an unconstrained browser clock,
 * this hook freezes the timeline (paused: true) and explicitly seeks
 * to `frame / fps` on every discrete Remotion render cycle.
 * 
 * @param buildTimeline Callback function where animations are added to the timeline
 * @param deps Dependency array to re-build the timeline when props change
 * @returns Ref callback to attach to the container element
 */
export function useGsapTimeline<T extends HTMLElement = HTMLDivElement>(
  buildTimeline: (timeline: gsap.core.Timeline, container: T) => void,
  deps: React.DependencyList = []
) {
  const containerRef = useRef<T | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Initialize or rebuild timeline when dependencies change
  useLayoutEffect(() => {
    if (!containerRef.current) return;

    // Clean up previous timeline
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    // Create fresh paused GSAP timeline
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true, autoRemoveChildren: false });
      buildTimeline(tl, containerRef.current!);
      timelineRef.current = tl;
    }, containerRef);

    return () => {
      ctx.revert();
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, deps);

  // Deterministically seek to exact frame position on every render
  useLayoutEffect(() => {
    if (timelineRef.current) {
      const timeInSeconds = frame / fps;
      timelineRef.current.seek(timeInSeconds, false);
    }
  }, [frame, fps]);

  return containerRef;
}
