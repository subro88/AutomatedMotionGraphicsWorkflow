import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { THEME } from "../theme";

export interface StudioDesk3DEnvironmentProps {
  children?: React.ReactNode;
  zoomProgress?: number; // 0.0 = wide desk establishing shot, 1.0 = focused UI display
  showPeripherals?: boolean;
  delay?: number;
  style?: React.CSSProperties;
}

export const StudioDesk3DEnvironment: React.FC<StudioDesk3DEnvironmentProps> = ({
  children,
  zoomProgress,
  showPeripherals = true,
  delay = 0,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // If zoomProgress not explicitly provided, calculate smooth slow cinematic push
  const autoZoom = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 200, mass: 1, stiffness: 40 },
  });

  const zoom = zoomProgress !== undefined ? zoomProgress : Math.min(1, autoZoom * 0.45);

  // Dynamic 3D Camera Perspective Interpolation
  // Wide establishing shot: camera pulled back, higher tilt, desk and keyboard visible
  // Focused UI: camera dollies forward, desk recedes slightly, screen fills view
  const camTranslateZ = -120 + zoom * 260; // moves camera in
  const camTranslateY = -20 + zoom * 40;
  const camRotateX = 14 - zoom * 12; // levels out perspective as we zoom into screen
  const peripheralsOpacity = Math.max(0, 1 - zoom * 1.6);

  // Subtle natural camera breathing
  const breathY = Math.sin((frame + delay * 5) * 0.03) * 3;
  const breathX = Math.cos((frame + delay * 5) * 0.02) * 2;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(180deg, #FDFBF7 0%, #F5EFEB 100%)",
        perspective: "1400px",
        perspectiveOrigin: "50% 45%",
        ...style,
      }}
    >
      {/* Background Acoustic Slats / Studio Wall (AdōDesign style) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "70%",
          display: "flex",
          justifyContent: "space-between",
          opacity: 0.35,
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            style={{
              width: "2.8%",
              height: "100%",
              background: "linear-gradient(90deg, rgba(230,225,218,0.5) 0%, rgba(245,240,235,0.8) 100%)",
              borderRight: "1px solid rgba(210,205,198,0.4)",
            }}
          />
        ))}
      </div>

      {/* 3D World Container (Camera Gimbal) */}
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          transformStyle: "preserve-3d",
          transform: `translate3d(${breathX}px, ${camTranslateY + breathY}px, ${camTranslateZ}px) rotateX(${camRotateX}deg)`,
          transition: "transform 0.1s linear",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
        }}
      >
        {/* Physical Modern Studio Desk Surface */}
        <div
          style={{
            position: "absolute",
            bottom: "-140px",
            width: "160%",
            height: "560px",
            background: "linear-gradient(180deg, #FFFFFF 0%, #EDE8E2 40%, #DCD6CE 100%)",
            borderRadius: "48px 48px 0 0",
            transformStyle: "preserve-3d",
            transform: "rotateX(72deg) translateZ(-80px)",
            boxShadow:
              "0 -20px 60px rgba(41, 37, 36, 0.08), inset 0 2px 0 rgba(255, 255, 255, 0.9), inset 0 -6px 12px rgba(0, 0, 0, 0.04)",
            border: "1px solid rgba(220, 215, 208, 0.7)",
            zIndex: 1,
          }}
        >
          {/* Subtle Desk Bevel Highlight */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "6px",
              background: "linear-gradient(90deg, transparent 5%, #FFFFFF 50%, transparent 95%)",
              opacity: 0.9,
            }}
          />
        </div>

        {/* Ambient Workspace Shadow beneath the Display */}
        <div
          style={{
            position: "absolute",
            width: "820px",
            height: "240px",
            bottom: "80px",
            background: "radial-gradient(ellipse at center, rgba(41, 37, 36, 0.22) 0%, transparent 70%)",
            filter: "blur(28px)",
            transform: "rotateX(72deg) translateZ(-70px)",
            zIndex: 2,
          }}
        />

        {/* Desktop Monitor Stand Base */}
        <div
          style={{
            position: "absolute",
            bottom: "120px",
            width: "220px",
            height: "160px",
            background: "linear-gradient(135deg, #E2E8F0 0%, #CBD5E1 100%)",
            borderRadius: "18px",
            transform: "rotateX(68deg) translateZ(-60px)",
            boxShadow: "0 10px 25px rgba(0,0,0,0.14)",
            border: "1px solid rgba(255, 255, 255, 0.8)",
            zIndex: 3,
          }}
        />

        {/* Vertical Aluminum Stand Column */}
        <div
          style={{
            position: "absolute",
            bottom: "160px",
            width: "56px",
            height: "140px",
            background: "linear-gradient(90deg, #94A3B8 0%, #CBD5E1 45%, #F1F5F9 55%, #94A3B8 100%)",
            borderRadius: "8px",
            transform: "translateZ(-20px)",
            boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
            zIndex: 3,
          }}
        />

        {/* Active Stage & Screen Housing Area */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transformStyle: "preserve-3d",
            zIndex: 4,
          }}
        >
          {children}
        </div>

        {/* Studio Peripherals (Keyboard & Mouse) */}
        {showPeripherals && (
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "40px",
              opacity: peripheralsOpacity,
              transformStyle: "preserve-3d",
              transform: "rotateX(42deg) translateZ(40px)",
              pointerEvents: "none",
              zIndex: 6,
            }}
          >
            {/* White Chiclet Keyboard Mockup */}
            <div
              style={{
                width: "440px",
                height: "140px",
                borderRadius: "14px",
                background: "linear-gradient(145deg, #FFFFFF 0%, #F1F5F9 100%)",
                boxShadow: "0 15px 35px rgba(41, 37, 36, 0.12), inset 0 1px 2px #FFF",
                border: "1px solid #E2E8F0",
                padding: "10px 14px",
                display: "flex",
                flexDirection: "column",
                gap: "5px",
              }}
            >
              {/* Keyboard Rows */}
              {[14, 14, 13, 12, 6].map((keyCount, rowIdx) => (
                <div key={rowIdx} style={{ display: "flex", gap: "4px", height: "18px" }}>
                  {Array.from({ length: keyCount }).map((_, keyIdx) => (
                    <div
                      key={keyIdx}
                      style={{
                        flex: rowIdx === 4 && keyIdx === 2 ? 4 : 1, // Spacebar
                        height: "100%",
                        background: "#FFFFFF",
                        borderRadius: "3px",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
                        border: "0.5px solid #CBD5E1",
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>

            {/* Modern Wireless Mouse Mockup */}
            <div
              style={{
                width: "58px",
                height: "100px",
                borderRadius: "28px",
                background: "linear-gradient(145deg, #FFFFFF 0%, #E2E8F0 100%)",
                boxShadow: "0 12px 28px rgba(41, 37, 36, 0.14), inset 0 1px 2px #FFF",
                border: "1px solid #CBD5E1",
                position: "relative",
              }}
            >
              {/* Subtle Touch Divider Line */}
              <div
                style={{
                  position: "absolute",
                  top: "14px",
                  left: "50%",
                  width: "1px",
                  height: "26px",
                  background: "#CBD5E1",
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
