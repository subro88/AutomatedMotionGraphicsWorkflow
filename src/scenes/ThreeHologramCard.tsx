import React, { useRef } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useCurrentFrame } from "remotion";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

const FloatingCardMesh: React.FC<{ primaryColor: string }> = ({ primaryColor }) => {
  const frame = useCurrentFrame();
  const cardRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (cardRef.current) {
      cardRef.current.rotation.y = Math.sin(frame * 0.02) * 0.35;
      cardRef.current.rotation.x = 0.1 + Math.cos(frame * 0.018) * 0.15;
      cardRef.current.position.y = Math.sin(frame * 0.03) * 0.2;
    }
  });

  return (
    <group ref={cardRef}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 8, 5]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-4, -2, 3]} intensity={1.2} color={primaryColor} />

      {/* Glass Body */}
      <mesh>
        <boxGeometry args={[3.8, 2.4, 0.08]} />
        <meshPhysicalMaterial
          color="#0c1322"
          transmission={0.65}
          opacity={0.85}
          transparent
          roughness={0.1}
          metalness={0.2}
          reflectivity={0.9}
        />
      </mesh>

      {/* Glowing Neon Border */}
      <mesh>
        <boxGeometry args={[3.86, 2.46, 0.06]} />
        <meshBasicMaterial color={primaryColor} wireframe />
      </mesh>

      {/* Decorative Core Sphere inside Card */}
      <mesh position={[1.2, 0, 0.1]}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#00f2fe"
          emissiveIntensity={0.8}
        />
      </mesh>
    </group>
  );
};

export const ThreeHologramCardScene: React.FC<{
  frame: number;
  fps: number;
  width: number;
  height: number;
  title?: string;
  subtitle?: string;
  primaryColor?: string;
}> = ({
  width,
  height,
  title = "3D Hologram Presentation",
  subtitle = "Spatial Glassmorphic Depth",
  primaryColor = "#00f2fe",
}) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden bg-[#060911]">
      <div className="absolute inset-0">
        <ThreeCanvas
          width={width}
          height={height}
          camera={{ position: [0, 0, 5], fov: 45 }}
        >
          <FloatingCardMesh primaryColor={primaryColor} />
        </ThreeCanvas>
      </div>

      <div className="absolute bottom-[10%] flex flex-col items-center text-center px-6 z-10 pointer-events-none">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-widest mb-3 backdrop-blur-md">
          <span>💎</span>
          3D Perspective Hologram
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-wider drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
          {title}
        </h2>
        <p className="text-sm md:text-lg text-cyan-400 font-semibold mt-2 tracking-wide">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

