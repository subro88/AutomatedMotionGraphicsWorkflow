import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { THEME } from "../theme";

export interface CylinderCarousel3DProps {
  items: React.ReactNode[];
  radius?: number; // Virtual cylinder radius in px (default ~420px)
  activeIndex?: number; // Currently focused card index
  rotationSpeed?: number; // Speed of continuous auto-rotation if activeIndex unset
  tiltX?: number; // Subtle vertical pitch tilt
  delay?: number;
  style?: React.CSSProperties;
}

export const CylinderCarousel3D: React.FC<CylinderCarousel3DProps> = ({
  items,
  radius = 420,
  activeIndex,
  rotationSpeed = 0.5,
  tiltX = -6,
  delay = 0,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: THEME.springs.gentle,
  });

  const count = items.length;
  const angleStep = 360 / Math.max(1, count);

  // Compute rotation angle
  let currentRotation = 0;
  if (activeIndex !== undefined) {
    const targetAngle = -activeIndex * angleStep;
    const rotSpring = spring({
      frame: Math.max(0, frame - delay),
      fps,
      config: THEME.springs.gentle,
    });
    currentRotation = rotSpring * targetAngle;
  } else {
    currentRotation = (frame * rotationSpeed) % 360;
  }

  // Kinematic subtle floating inertia
  const floatY = Math.sin((frame + delay * 10) * 0.04) * 6;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        perspective: "1400px",
        perspectiveOrigin: "50% 50%",
        transform: `translateY(${floatY + (1 - entrance) * 60}px) scale(${entrance})`,
        opacity: entrance,
        ...style,
      }}
    >
      {/* 3D Ambient Floor Shadow */}
      <div
        style={{
          position: "absolute",
          width: radius * 1.8,
          height: radius * 0.6,
          bottom: "-40px",
          background: "radial-gradient(ellipse at center, rgba(41, 37, 36, 0.2) 0%, transparent 70%)",
          filter: "blur(32px)",
          transform: "rotateX(75deg)",
          zIndex: 0,
        }}
      />

      {/* 3D Cylindrical Ring Container */}
      <div
        style={{
          width: 0,
          height: 0,
          position: "relative",
          transformStyle: "preserve-3d",
          transform: `rotateX(${tiltX}deg) rotateY(${currentRotation}deg)`,
          transition: "transform 0.05s linear",
          zIndex: 1,
        }}
      >
        {items.map((item, idx) => {
          const itemAngle = idx * angleStep;
          // Calculate relative angle to viewer (0 deg is facing front)
          const relativeAngle = ((itemAngle + currentRotation) % 360 + 360) % 360;
          // Normalized angle distance from front (-180 to 180)
          const angleDist = relativeAngle > 180 ? 360 - relativeAngle : relativeAngle;

          // Depth cues: cards facing front are brighter and fully opaque; back cards recede
          const isFront = angleDist < 85;
          const opacity = Math.max(0.25, Math.cos((angleDist * Math.PI) / 180) * 0.95 + 0.05);
          const brightness = Math.max(0.65, 1 - (angleDist / 180) * 0.4);

          return (
            <div
              key={idx}
              style={{
                position: "absolute",
                left: "-200px", // Centers typical ~400px card
                top: "-140px",
                transformStyle: "preserve-3d",
                transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                opacity,
                filter: `brightness(${brightness})`,
                transition: "opacity 0.2s ease, filter 0.2s ease",
                pointerEvents: isFront ? "auto" : "none",
                zIndex: isFront ? 10 : 2,
              }}
            >
              {item}
            </div>
          );
        })}
      </div>
    </div>
  );
};
