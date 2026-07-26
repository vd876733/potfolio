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
  
  const grassColor = isLight ? "#3a7d44" : "#14532d"; // Updated realistic green grass
  const rockColor = isLight ? "#a8a29e" : "#292524";

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
      {/* Scaled Terrain */}
      <group scale={[2.2, 1.8, 2.2]}>
        {/* Tier 1 (Base & Beach) */}
        <group position={[0, -2, 0]}>
          {/* Grass */}
          <mesh position={[0, 2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <circleGeometry args={[26, 64]} />
            <meshStandardMaterial color={grassColor} roughness={1} metalness={0} />
          </mesh>
          {/* Sandy Beach Border */}
          <mesh position={[0, 2.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <ringGeometry args={[26, 30, 64]} />
            <meshStandardMaterial color="#fcd34d" roughness={0.9} />
          </mesh>
          {/* Rock Base */}
          <mesh receiveShadow castShadow>
            <cylinderGeometry args={[30, 24, 4, 64]} />
            <meshStandardMaterial color={rockColor} roughness={0.9} metalness={0.1} />
          </mesh>
        </group>

        {/* North-West Cliff (For Lighthouse) */}
        <group position={[-20, -2, -20]}>
          {/* Grass */}
          <mesh position={[0, 2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <circleGeometry args={[10, 32]} />
            <meshStandardMaterial color={grassColor} roughness={1} />
          </mesh>
          {/* Rock Base */}
          <mesh receiveShadow castShadow>
            <cylinderGeometry args={[10, 7, 4, 32]} />
            <meshStandardMaterial color={rockColor} roughness={0.9} metalness={0.1} />
          </mesh>
        </group>

        {/* Tier 2 (Middle) */}
        <group position={[0, 2, 0]}>
          <mesh position={[0, 2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <circleGeometry args={[18, 64]} />
            <meshStandardMaterial color={grassColor} roughness={1} metalness={0} />
          </mesh>
          <mesh receiveShadow castShadow>
            <cylinderGeometry args={[18, 22, 4, 64]} />
            <meshStandardMaterial color={rockColor} roughness={0.9} metalness={0.1} />
          </mesh>
        </group>

        {/* Tier 3 (Peak) */}
        <group position={[0, 6, 0]}>
          <mesh position={[0, 2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <circleGeometry args={[8, 64]} />
            <meshStandardMaterial color={grassColor} roughness={1} metalness={0} />
          </mesh>
          <mesh receiveShadow castShadow>
            <cylinderGeometry args={[8, 12, 4, 64]} />
            <meshStandardMaterial color={rockColor} roughness={0.9} metalness={0.1} />
          </mesh>
        </group>
      </group>
      
      {/* Elements on the Island */}
      {children}
    </group>
  );
}
