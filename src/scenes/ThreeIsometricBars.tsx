import React, { useRef } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useCurrentFrame, interpolate } from "remotion";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface BarData {
  label: string;
  heightVal: number; // 1 to 5
  color: string;
}

const IsometricChartGroup: React.FC<{ bars: BarData[] }> = ({ bars }) => {
  const frame = useCurrentFrame();
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = -0.3 + Math.sin(frame * 0.015) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[0, -1.2, 0]} rotation={[0.45, -0.4, 0]}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[8, 12, 6]} intensity={1.8} />
      <pointLight position={[-6, 4, 4]} color="#00f2fe" intensity={1.2} />

      {/* Grid Floor */}
      <gridHelper args={[8, 12, 0x00f2fe, 0x1e2c4a]} position={[0, 0, 0]} />

      {/* 3D Isometric Columns */}
      {bars.map((b, i) => {
        const xPos = (i - (bars.length - 1) / 2) * 1.6;
        const progress = interpolate(frame, [10 + i * 8, 35 + i * 8], [0.1, b.heightVal], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <group key={i} position={[xPos, progress / 2, 0]}>
            <mesh>
              <boxGeometry args={[0.9, progress, 0.9]} />
              <meshStandardMaterial
                color={b.color}
                metalness={0.4}
                roughness={0.2}
                emissive={b.color}
                emissiveIntensity={0.25}
              />
            </mesh>
            {/* Top Cap Glow */}
            <mesh position={[0, progress / 2 + 0.02, 0]}>
              <boxGeometry args={[0.92, 0.04, 0.92]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

export const ThreeIsometricBarsScene: React.FC<{
  frame: number;
  fps: number;
  width: number;
  height: number;
  title?: string;
  metricLabel?: string;
  primaryColor?: string;
}> = ({
  width,
  height,
  title = "3D Quantitative Metrics",
  metricLabel = "Q3 Performance Velocity",
  primaryColor = "#00f2fe",
}) => {
  const bars: BarData[] = [
    { label: "Phase 1", heightVal: 1.8, color: "#38bdf8" },
    { label: "Phase 2", heightVal: 2.9, color: "#4facfe" },
    { label: "Phase 3", heightVal: 4.4, color: "#00f2fe" },
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden bg-[#060911]">
      <div className="absolute inset-0">
        <ThreeCanvas
          width={width}
          height={height}
          camera={{ position: [0, 2.5, 7], fov: 42 }}
        >
          <IsometricChartGroup bars={bars} />
        </ThreeCanvas>
      </div>

      <div className="absolute top-[8%] flex flex-col items-center text-center px-6 z-10 pointer-events-none">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-3 backdrop-blur-md">
          <span>📊</span>
          3D Spatial Bar Columns
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-wider drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
          {title}
        </h2>
        <p className="text-sm md:text-lg text-cyan-400 font-semibold mt-2 tracking-wide">
          {metricLabel}
        </p>
      </div>
    </div>
  );
};

