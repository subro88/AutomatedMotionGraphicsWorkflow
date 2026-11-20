import React, { useEffect, useRef } from "react";
import anime from "animejs";

interface KineticSceneProps {
  frame: number;
  fps: number;
  width: number;
  height: number;
  title?: string;
  subtitle?: string;
  primaryColor?: string;
  glowColor?: string;
  spectrumAmplitudes?: number[];
}

export const KineticScene: React.FC<KineticSceneProps> = ({
  frame,
  fps,
  width,
  height,
  title = "Kinetic Motion Graphics",
  subtitle = "Audio-Reactive Geometry Engine",
  primaryColor = "#00f2fe",
  glowColor = "rgba(0, 242, 254, 0.4)",
  spectrumAmplitudes = [],
}) => {
  const morphPathRef = useRef<SVGPathElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const barsGroupRef = useRef<SVGGElement>(null);

  const cx = width / 2;
  const cy = height / 2;
  const baseRadius = Math.min(width, height) * 0.16;

  const amps = spectrumAmplitudes.length > 0 ? spectrumAmplitudes : new Array(24).fill(0.08);
  const bassEnergy = amps.slice(0, 4).reduce((acc, val) => acc + val, 0) / 4;
  const pulseRadius = baseRadius + bassEnergy * 32;

  const pathCircle =
    "M 300,100 C 410,100 500,190 500,300 C 500,410 410,500 300,500 C 190,500 100,410 100,300 C 100,190 190,100 300,100 Z";
  const pathDiamond =
    "M 300,60 C 460,140 540,240 500,380 C 460,480 340,540 300,540 C 260,540 140,480 100,380 C 60,240 140,140 300,60 Z";

  useEffect(() => {
    if (!barsGroupRef.current || !ringRef.current || !morphPathRef.current) return;

    const rot = (frame / fps) * 25;
    anime.set(barsGroupRef.current, {
      rotate: `${rot}deg`,
      transformOrigin: `${cx}px ${cy}px`,
    });

    anime({
      targets: morphPathRef.current,
      d: [{ value: pathDiamond }, { value: pathCircle }],
      duration: 1200,
      easing: "easeInOutQuad",
      autoplay: false,
    }).seek(((frame % (fps * 2)) / (fps * 2)) * 1200);

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
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ filter: `drop-shadow(0 0 32px ${glowColor})`, position: "absolute", top: 0, left: 0 }}
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
          {amps.map((amp, i) => {
            const angleDeg = (i / amps.length) * 360;
            const angleRad = (angleDeg * Math.PI) / 180;
            const barLength = Math.max(8, amp * 180);

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

      {/* Floating Kinetic Overlay Header */}
      <div
        style={{
          position: "absolute",
          bottom: height * 0.12,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          maxWidth: width * 0.85,
          zIndex: 10,
        }}
      >
        <h2
          style={{
            fontSize: Math.min(width, height) * 0.052,
            fontWeight: 800,
            color: "#ffffff",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            textShadow: "0 4px 20px rgba(0,0,0,0.8)",
            margin: 0,
          }}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            style={{
              fontSize: Math.min(width, height) * 0.026,
              fontWeight: 500,
              color: primaryColor,
              marginTop: 8,
              letterSpacing: "0.04em",
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

