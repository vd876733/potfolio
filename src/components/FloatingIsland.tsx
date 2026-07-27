"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface FloatingIslandProps {
  isLight?: boolean;
  children: React.ReactNode;
}

export default function FloatingIsland({ isLight = false, children }: FloatingIslandProps) {
  const group = useRef<THREE.Group>(null);

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
        
        {/* Base Landmass - Main South Body */}
        <mesh position={[0, 0.5, 2]} receiveShadow castShadow>
          <cylinderGeometry args={[12, 11, 1.5, 64]} />
          <meshStandardMaterial color="#6d4c41" roughness={0.9} />
        </mesh>
        {/* Beach for South Body */}
        <mesh position={[0, -0.27, 2]} receiveShadow castShadow>
          <cylinderGeometry args={[12.5, 12.5, 0.4, 64]} />
          <meshStandardMaterial color="#eedc9a" roughness={0.9} />
        </mesh>
        
        {/* Base Landmass - North Extension */}
        <mesh position={[2, 0.5, -6]} receiveShadow castShadow>
          <cylinderGeometry args={[8, 7, 1.5, 64]} />
          <meshStandardMaterial color="#6d4c41" roughness={0.9} />
        </mesh>
        {/* Beach for North Extension */}
        <mesh position={[2, -0.27, -6]} receiveShadow castShadow>
          <cylinderGeometry args={[8.5, 8.5, 0.4, 64]} />
          <meshStandardMaterial color="#eedc9a" roughness={0.9} />
        </mesh>
        
        {/* Central Plateau (Town Square Roundabout) */}
        <mesh position={[-2, 1.75, -2]} receiveShadow castShadow>
          <cylinderGeometry args={[6, 7, 1.5, 32]} />
          <meshStandardMaterial color="#6d4c41" roughness={0.9} />
        </mesh>
        
        {/* Volcano Peak (Top North) */}
        <mesh position={[0, 4.0, -8]} receiveShadow castShadow>
          {/* Tapered cylinder: top radius, bottom radius, height, radial segments */}
          <cylinderGeometry args={[1.5, 5, 6, 32]} />
          <meshStandardMaterial color="#6d4c41" roughness={0.9} />
        </mesh>
        
        {/* Hollow Crater circle (dark inside) */}
        <mesh position={[0, 7.01, -8]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.2, 32]} />
          <meshBasicMaterial color="#3e2723" />
        </mesh>
        
      </group>
      
      {/* Elements on the Island */}
      <group position={[0, 0, 0]}>
        {children}
      </group>
    </group>
  );
}
