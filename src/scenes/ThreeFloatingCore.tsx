import React, { useRef } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface ThreeCoreProps {
  primaryColor?: string;
  glowColor?: string;
  bassEnergy?: number;
}

const CoreMesh: React.FC<ThreeCoreProps> = ({
  primaryColor = "#00f2fe",
  bassEnergy = 0.2,
}) => {
  const frame = useCurrentFrame();
  const meshRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x = frame * 0.02;
      meshRef.current.rotation.y = frame * 0.025;
      const s = 1.0 + bassEnergy * 0.35;
      meshRef.current.scale.set(s, s, s);
    }
    if (outerRef.current) {
      outerRef.current.rotation.x = -frame * 0.015;
      outerRef.current.rotation.z = frame * 0.018;
    }
  });

  return (
    <group>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color={primaryColor} />
      <pointLight position={[-10, -10, -10]} intensity={1.0} color="#4facfe" />

      {/* Inner Wireframe Torus Knot */}
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[1.4, 0.4, 100, 16]} />
        <meshStandardMaterial
          color={primaryColor}
          wireframe
          emissive={primaryColor}
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Outer Rotating Icosahedron Shell */}
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[2.5, 1]} />
        <meshStandardMaterial
          color="#38bdf8"
          wireframe
          transparent
          opacity={0.25}
        />
      </mesh>
    </group>
  );
};

export const ThreeFloatingCoreScene: React.FC<{
  frame: number;
  fps: number;
  width: number;
  height: number;
  title?: string;
  subtitle?: string;
  primaryColor?: string;
  spectrumAmplitudes?: number[];
}> = ({
  width,
  height,
  title = "3D Autonomous Tech Core",
  subtitle = "WebGL Accelerated Spatial Geometry",
  primaryColor = "#00f2fe",
  spectrumAmplitudes = [],
}) => {
  const amps = spectrumAmplitudes.length > 0 ? spectrumAmplitudes : new Array(24).fill(0.08);
  const bassEnergy = amps.slice(0, 4).reduce((acc, val) => acc + val, 0) / 4;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden bg-[#060911]">
      {/* 3D WebGL Canvas */}
      <div className="absolute inset-0">
        <ThreeCanvas
          width={width}
          height={height}
          camera={{ position: [0, 0, 6], fov: 45 }}
        >
          <CoreMesh primaryColor={primaryColor} bassEnergy={bassEnergy} />
        </ThreeCanvas>
      </div>

      {/* Floating Kinetic HUD Overlay */}
      <div className="absolute bottom-[10%] flex flex-col items-center text-center px-6 z-10 pointer-events-none">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-3 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00f2fe]" />
          3D WebGL Spatial Core
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-wider drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm md:text-lg text-cyan-400 font-medium mt-2 tracking-wide">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

