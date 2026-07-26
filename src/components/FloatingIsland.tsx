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
  
  const grassColor = isLight ? "#4ade80" : "#064e3b";
  const rockColor = isLight ? "#a8a29e" : "#292524";

  useFrame(({ clock }) => {
    if (group.current) {
      group.current.position.y = Math.sin(clock.elapsedTime) * 0.5;
    }
  });

  return (
    <group ref={group}>
      {/* Island Base */}
      <group position={[0, -2.01, 0]}>
        {/* Top Grass */}
        <mesh position={[0, 2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[22, 64]} />
          <meshStandardMaterial color={grassColor} roughness={1} metalness={0} />
        </mesh>
        
        {/* Rocky Base */}
        <mesh receiveShadow castShadow>
          <cylinderGeometry args={[22, 18, 4, 64]} />
          <meshStandardMaterial color={rockColor} roughness={0.9} metalness={0.1} />
        </mesh>
      </group>
      
      {/* Elements on the Island */}
      {children}
    </group>
  );
}
