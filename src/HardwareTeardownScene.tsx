import React, { useRef, useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

// Optional precomputed tracking json import
let precomputedTracking: any = null;
try {
  precomputedTracking = require("../out/tracking/screen_coords.json");
} catch {
  // Graceful fallback to real-time procedural projection
}

interface HardwareTeardownProps {
  aspectRatio?: "16:9" | "9:16";
  primaryColor?: string;
  accentColor?: string;
  transparentHudOnly?: boolean;
}

// ==============================================================================
// 3D PROCEDURAL SMARTPHONE ASSEMBLY COMPONENT
// ==============================================================================

const ExplodedSmartphone: React.FC<{
  explodeFactor: number;
  cameraPitch: number;
  cameraYaw: number;
  macroFocus: boolean;
}> = ({ explodeFactor, cameraPitch, cameraYaw, macroFocus }) => {
  const frame = useCurrentFrame();
  const groupRef = useRef<THREE.Group>(null);
  const busPulseRef = useRef<THREE.Mesh>(null);

  // Smooth rotation animation
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = (cameraYaw * Math.PI) / 180 + frame * 0.002;
      groupRef.current.rotation.x = (cameraPitch * Math.PI) / 180;
    }
    if (busPulseRef.current) {
      const pulse = (Math.sin(frame * 0.25) + 1.0) * 0.5;
      (busPulseRef.current.material as THREE.MeshBasicMaterial).opacity = 0.4 + pulse * 0.6;
    }
  });

  // Exploded translation vectors (in 3D scene units)
  const zDisplay = 1.4 * explodeFactor;
  const zGasket = 1.0 * explodeFactor;
  const zMotherboard = 0.5 * explodeFactor;
  const zSoC = (0.5 + 0.25) * explodeFactor;
  const zBattery = -0.4 * explodeFactor;
  const zCoil = -0.8 * explodeFactor;
  const zChassis = -1.1 * explodeFactor;

  return (
    <group ref={groupRef} scale={macroFocus ? [2.2, 2.2, 2.2] : [1.0, 1.0, 1.0]}>
      {/* Studio Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[8, 12, 10]} intensity={1.8} color="#ffffff" />
      <pointLight position={[-6, -8, -6]} intensity={1.2} color="#00e5ff" />
      <pointLight position={[6, -4, 8]} intensity={0.8} color="#ffb300" />

      {/* 1. FRONT CERAMIC SHIELD GLASS */}
      <mesh position={[0, 0, 0.12 + zDisplay]}>
        <boxGeometry args={[3.2, 6.8, 0.04]} />
        <meshPhysicalMaterial
          color="#d0e8ff"
          transmission={0.9}
          roughness={0.05}
          metalness={0.1}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* 2. LTPO OLED DISPLAY PANEL */}
      <mesh position={[0, 0, 0.08 + zDisplay]}>
        <boxGeometry args={[3.1, 6.7, 0.02]} />
        <meshStandardMaterial color="#05070a" roughness={0.15} metalness={0.8} />
      </mesh>

      {/* 3. IP68 ADHESIVE GASKET */}
      <mesh position={[0, 0, 0.04 + zGasket]}>
        <boxGeometry args={[3.18, 6.78, 0.02]} />
        <meshStandardMaterial color="#1a202c" roughness={0.8} wireframe />
      </mesh>

      {/* 4. MAIN LOGIC BOARD (FR4 High-Density Substrate) */}
      <group position={[0, 1.2, zMotherboard]}>
        <mesh>
          <boxGeometry args={[2.8, 2.8, 0.08]} />
          <meshStandardMaterial color="#0a1f14" roughness={0.4} metalness={0.2} />
        </mesh>

        {/* 3nm Silicon System-on-Chip (SoC) */}
        <mesh position={[-0.4, 0.2, 0.06 + (zSoC - zMotherboard)]}>
          <boxGeometry args={[0.9, 0.9, 0.06]} />
          <meshStandardMaterial
            color="#111827"
            roughness={0.08}
            metalness={0.95}
          />
        </mesh>

        {/* Unified LPDDR5X RAM Die */}
        <mesh position={[0.5, 0.2, 0.05 + (zSoC - zMotherboard)]}>
          <boxGeometry args={[0.7, 0.7, 0.05]} />
          <meshStandardMaterial color="#1f2937" roughness={0.15} metalness={0.85} />
        </mesh>

        {/* High-Speed Interconnect Bus (Glowing Trace) */}
        <mesh ref={busPulseRef} position={[0.05, 0.2, 0.06 + (zSoC - zMotherboard)]}>
          <boxGeometry args={[0.25, 0.08, 0.02]} />
          <meshBasicMaterial color="#00e5ff" transparent opacity={0.8} />
        </mesh>

        {/* 5G Modem RF IC */}
        <mesh position={[0.4, -0.7, 0.05]}>
          <boxGeometry args={[0.6, 0.5, 0.04]} />
          <meshStandardMaterial color="#374151" roughness={0.2} metalness={0.7} />
        </mesh>
      </group>

      {/* 5. HIGH-DENSITY LI-ION BATTERY PACK */}
      <mesh position={[0, -1.2, zBattery]}>
        <boxGeometry args={[2.8, 3.4, 0.24]} />
        <meshStandardMaterial color="#111315" roughness={0.35} metalness={0.4} />
      </mesh>

      {/* 6. WIRELESS CHARGING INDUCTION COIL */}
      <mesh position={[0, -1.0, zCoil]}>
        <ringGeometry args={[0.6, 1.1, 32]} />
        <meshStandardMaterial
          color="#c87d55"
          roughness={0.2}
          metalness={0.95}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 7. TRIPLE CAMERA MODULE */}
      <group position={[-0.8, 2.2, zMotherboard + 0.1]}>
        <mesh>
          <boxGeometry args={[1.2, 1.3, 0.22]} />
          <meshStandardMaterial color="#1e242d" roughness={0.2} metalness={0.85} />
        </mesh>
        {/* Lenses */}
        {[-0.3, 0.3].map((lx, idx) => (
          <mesh key={idx} position={[lx, 0.2, 0.12]}>
            <cylinderGeometry args={[0.22, 0.22, 0.06, 24]} />
            <meshPhysicalMaterial color="#0284c7" transmission={0.7} roughness={0.05} />
          </mesh>
        ))}
      </group>

      {/* 8. AEROSPACE TITANIUM CHASSIS FRAME */}
      <mesh position={[0, 0, zChassis]}>
        <boxGeometry args={[3.3, 7.0, 0.35]} />
        <meshStandardMaterial color="#262c36" roughness={0.25} metalness={0.92} />
      </mesh>
    </group>
  );
};

// ==============================================================================
// 2D TECHNICAL HUD & CALLOUT OVERLAY LAYER
// ==============================================================================

const TechnicalHUDOverlay: React.FC<{
  currentScene: any;
  frame: number;
  width: number;
  height: number;
}> = ({ currentScene, frame, width, height }) => {
  const callouts = currentScene.callouts || [];

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        fontFamily: "'Inter', 'Segoe UI', -apple-system, sans-serif",
      }}
    >
      {/* Top Header & Breadcrumb Bar */}
      <div
        style={{
          position: "absolute",
          top: 36,
          left: 48,
          right: 48,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          borderBottom: "1px solid rgba(0, 229, 255, 0.25)",
          paddingBottom: 16,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 12,
              letterSpacing: "0.22em",
              color: "#00E5FF",
              fontWeight: 700,
              textTransform: "uppercase",
              marginBottom: 4,
            }}
          >
            🔬 HARDWARE TEARDOWN • {currentScene.archetype?.replace(/_/g, " ").toUpperCase()}
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.02em" }}>
            {currentScene.title}
          </div>
          <div style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)", marginTop: 2 }}>
            {currentScene.subtitle}
          </div>
        </div>

        {/* Telemetry / Frame Badge */}
        <div
          style={{
            background: "rgba(0, 229, 255, 0.08)",
            border: "1px solid rgba(0, 229, 255, 0.3)",
            borderRadius: 6,
            padding: "8px 16px",
            textAlign: "right",
          }}
        >
          <div style={{ fontSize: 11, color: "#00E5FF", letterSpacing: "0.15em" }}>TELEMETRY</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#FFFFFF", fontFamily: "monospace" }}>
            Z-EXPLODE: {(currentScene.explodeFactor * 100).toFixed(0)}%
          </div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>
            FRAME: {frame.toString().padStart(4, "0")} / 0900
          </div>
        </div>
      </div>

      {/* SVG Callout Leader Lines & Bracket Cards */}
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {callouts.map((c: any, idx: number) => {
          // Dynamic anchored positions
          const isLeft = idx % 2 === 0;
          const cardX = isLeft ? 120 : width - 360;
          const cardY = 280 + idx * 240;
          const anchorX = isLeft ? width * 0.44 : width * 0.56;
          const anchorY = 460 + (idx === 0 ? -60 : 80);

          return (
            <g key={c.id}>
              {/* Leader Line */}
              <polyline
                points={`${anchorX},${anchorY} ${isLeft ? anchorX - 80 : anchorX + 80},${cardY + 30} ${cardX + (isLeft ? 240 : 0)},${cardY + 30}`}
                fill="none"
                stroke="#00E5FF"
                strokeWidth="1.5"
                strokeDasharray="4 3"
                opacity="0.8"
                filter="url(#glow)"
              />
              {/* Anchor Target Reticle */}
              <circle cx={anchorX} cy={anchorY} r="4" fill="#00E5FF" filter="url(#glow)" />
              <circle cx={anchorX} cy={anchorY} r="8" fill="none" stroke="#00E5FF" strokeWidth="1" opacity="0.6" />
            </g>
          );
        })}
      </svg>

      {/* Callout Cards HTML */}
      {callouts.map((c: any, idx: number) => {
        const isLeft = idx % 2 === 0;
        const cardX = isLeft ? 120 : width - 360;
        const cardY = 280 + idx * 240;

        return (
          <div
            key={c.id}
            style={{
              position: "absolute",
              top: cardY,
              left: cardX,
              width: 240,
              background: "rgba(6, 12, 22, 0.85)",
              border: "1px solid rgba(0, 229, 255, 0.4)",
              borderRadius: 8,
              padding: "12px 16px",
              boxShadow: "0 8px 32px rgba(0, 229, 255, 0.15)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div
              style={{
                fontSize: 10,
                letterSpacing: "0.18em",
                color: "#FFB300",
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              SPECIFICATION
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#FFFFFF", marginTop: 2 }}>
              {c.label}
            </div>
            <div style={{ fontSize: 13, color: "#00E5FF", marginTop: 4, fontWeight: 500 }}>
              {c.spec}
            </div>
          </div>
        );
      })}

      {/* Bottom Technical Grid & Scale Bar */}
      <div
        style={{
          position: "absolute",
          bottom: 32,
          left: 48,
          right: 48,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid rgba(255, 255, 255, 0.12)",
          paddingTop: 12,
          fontSize: 11,
          color: "rgba(255, 255, 255, 0.5)",
          letterSpacing: "0.1em",
        }}
      >
        <div>BRANCH EDUCATION MOTION PIPELINE • SYSTEM VOLUMETRIC SCAN</div>
        <div style={{ display: "flex", gap: 24 }}>
          <span>OPTICS: 55mm MACRO</span>
          <span>SENSOR: 36mm FULL-FRAME</span>
          <span>RESOLVE TIMELINE: 3-STEM FAIRLIGHT</span>
        </div>
      </div>
    </div>
  );
};

// ==============================================================================
// MASTER EXPORT COMPOSITION
// ==============================================================================

export const HardwareTeardownScene: React.FC<HardwareTeardownProps> = ({
  aspectRatio = "16:9",
  primaryColor = "#00E5FF",
  accentColor = "#FFB300",
  transparentHudOnly = false,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  // Load storyboard scenes
  const storyboard = useMemo(() => {
    try {
      return require("./data/hardware_teardown_storyboard.json");
    } catch {
      return { scenes: [] };
    }
  }, []);

  const scenes = storyboard.scenes || [];

  // Determine current active scene
  const currentScene = useMemo(() => {
    if (!scenes.length) return { title: "Hardware Teardown", explodeFactor: 0.5 };
    for (const s of scenes) {
      if (frame >= s.startFrame && frame < s.startFrame + s.durationInFrames) {
        return s;
      }
    }
    return scenes[scenes.length - 1];
  }, [frame, scenes]);

  // Smooth explode factor interpolation
  const explodeFactor = currentScene.explodeFactor ?? 0.5;
  const cameraPitch = currentScene.cameraPitch ?? 30;
  const cameraYaw = currentScene.cameraYaw ?? 0;
  const macroFocus = currentScene.archetype === "macro_silicon_zoom";

  return (
    <div
      style={{
        width,
        height,
        background: transparentHudOnly
          ? "transparent"
          : "radial-gradient(circle at 50% 50%, #0d1522 0%, #05080e 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* 3D WebGL Canvas (Omitted when rendering pure HUD overlay for DaVinci Track 2) */}
      {!transparentHudOnly && (
        <ThreeCanvas
          width={width}
          height={height}
          camera={{
            fov: 35,
            position: [0, 0, currentScene.cameraDistance ? currentScene.cameraDistance / 24 : 12],
          }}
        >
          <ExplodedSmartphone
            explodeFactor={explodeFactor}
            cameraPitch={cameraPitch}
            cameraYaw={cameraYaw}
            macroFocus={macroFocus}
          />
        </ThreeCanvas>
      )}

      {/* 2D Technical HUD Overlay */}
      <TechnicalHUDOverlay
        currentScene={currentScene}
        frame={frame}
        width={width}
        height={height}
      />
    </div>
  );
};
