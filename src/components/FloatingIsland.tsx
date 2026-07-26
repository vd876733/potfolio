"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface FloatingIslandProps {
  isLight?: boolean;
  children: React.ReactNode;
}

export default function FloatingIsland({ isLight = false, children }: FloatingIslandProps) {
  const group = useRef<THREE.Group>(null);
  
  const grassColor = isLight ? "#4ade80" : "#22c55e";
  const darkGrassColor = isLight ? "#22c55e" : "#16a34a";
  const sandColor = isLight ? "#fef08a" : "#eedc9a";
  const rockColor = isLight ? "#94a3b8" : "#64748b";

  useFrame(({ clock }) => {
    if (group.current) {
      const t = clock.elapsedTime;
      // Gentle vertical bobbing & slight rotation tilt
      group.current.position.y = Math.sin(t * 0.8) * 0.15;
      group.current.rotation.z = Math.sin(t * 0.5) * 0.01;
    }
  });

  return (
    <group ref={group}>
      {/* 1. Sandy Shore Base (South & Perimeter) */}
      <mesh position={[0, -0.5, 5]} castShadow receiveShadow>
        <cylinderGeometry args={[65, 50, 2, 64]} />
        <meshStandardMaterial color={sandColor} roughness={0.9} />
      </mesh>

      {/* 2. Main Lower Grass Base */}
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[52, 58, 2, 64]} />
        <meshStandardMaterial color={grassColor} roughness={0.9} />
      </mesh>

      {/* 3. Central Roundabout Plateau (Top Y = 10.85) */}
      <mesh position={[0, 6, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[18, 26, 9.7, 64]} />
        <meshStandardMaterial color={darkGrassColor} roughness={0.9} />
      </mesh>

      {/* S-Curve Slopes (Stepping down to the beach) */}
      <mesh position={[-8, 4, 20]} rotation={[0.2, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[25, 6, 20]} />
        <meshStandardMaterial color={grassColor} roughness={0.9} />
      </mesh>
      <mesh position={[8, 2.5, 35]} rotation={[0.1, -0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[30, 4, 25]} />
        <meshStandardMaterial color={grassColor} roughness={0.9} />
      </mesh>

      {/* 4. North Volcano Mountain (Top Y = 16) */}
      <group position={[0, 8, -30]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[8, 30, 16, 32]} />
          <meshStandardMaterial color="#5c4033" roughness={0.9} />
        </mesh>
        {/* Crater */}
        <mesh position={[0, 8.01, 0]} rotation={[-Math.PI/2, 0, 0]}>
          <circleGeometry args={[7, 32]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        <mesh position={[0, 8.05, 0]} rotation={[-Math.PI/2, 0, 0]}>
          <circleGeometry args={[5, 32]} />
          <meshStandardMaterial color="#ff3d00" emissive="#ff3d00" emissiveIntensity={2} toneMapped={false} />
        </mesh>
      </group>

      {/* 5. West Rocky Cliffs (Lighthouse area, Top Y = 14) */}
      <mesh position={[-25, 6.5, -20]} castShadow receiveShadow>
        <cylinderGeometry args={[12, 16, 15, 16]} />
        <meshStandardMaterial color={rockColor} roughness={0.95} />
      </mesh>
      {/* Jagged cliff faces */}
      <mesh position={[-32, 4, -15]} rotation={[0, 0, 0.2]} castShadow receiveShadow>
        <coneGeometry args={[10, 20, 8]} />
        <meshStandardMaterial color={rockColor} roughness={0.95} />
      </mesh>
      <mesh position={[-18, 4, -30]} rotation={[0, 0.5, -0.2]} castShadow receiveShadow>
        <coneGeometry args={[12, 22, 6]} />
        <meshStandardMaterial color={rockColor} roughness={0.95} />
      </mesh>

      {/* 6. East Pirate Cove Peninsula */}
      <mesh position={[40, 1.5, 15]} castShadow receiveShadow>
        <cylinderGeometry args={[20, 25, 2, 32]} />
        <meshStandardMaterial color={grassColor} roughness={0.9} />
      </mesh>

      {/* Elements on the Island (Props, Roads, Pavilions) */}
      <group position={[0, 0, 0]}>
        {children}
      </group>
    </group>
  );
}
