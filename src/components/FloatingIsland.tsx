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
      group.current.position.y = Math.sin(t * 0.8) * 0.12;
      group.current.rotation.z = Math.sin(t * 0.5) * 0.008;
    }
  });

  return (
    <group ref={group}>
      {/* Organic Terrain Base & Elevation Geometry */}
      <group position={[0, 0, 0]}>
        
        {/* 1. LEVEL 0: Deep Rock Underside & Organic Golden Beaches */}
        {/* Deep Rock Underside Skirt */}
        <mesh position={[0, -2.5, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[42, 28, 5, 64]} />
          <meshStandardMaterial color="#44403c" roughness={0.95} />
        </mesh>

        {/* Outer Sandy Beach - Main South Peninsula */}
        <mesh position={[2, 0.05, 10]} receiveShadow castShadow>
          <cylinderGeometry args={[38, 40, 0.5, 64]} />
          <meshStandardMaterial color="#fef08a" roughness={0.9} />
        </mesh>
        {/* Outer Sandy Beach - South West Whale Cove */}
        <mesh position={[-18, 0.05, 22]} receiveShadow castShadow>
          <cylinderGeometry args={[18, 20, 0.5, 32]} />
          <meshStandardMaterial color="#fef08a" roughness={0.9} />
        </mesh>
        {/* Outer Sandy Beach - South East Resort Shore */}
        <mesh position={[18, 0.05, 24]} receiveShadow castShadow>
          <cylinderGeometry args={[16, 18, 0.5, 32]} />
          <meshStandardMaterial color="#fef08a" roughness={0.9} />
        </mesh>
        
        {/* 2. LEVEL 1: Cliff Faces & Main Village Green Ground */}
        {/* Perimeter Rocky Cliff Skirt (Light Tan/Gray Cliff Wall) */}
        <mesh position={[0, 1.0, 2]} receiveShadow castShadow>
          <cylinderGeometry args={[36, 38, 1.8, 64]} />
          <meshStandardMaterial color="#a8a29e" roughness={0.9} />
        </mesh>
        {/* Lush Green Village Ground */}
        <mesh position={[0, 1.9, 2]} receiveShadow castShadow>
          <cylinderGeometry args={[35, 36, 0.3, 64]} />
          <meshStandardMaterial color={isLight ? "#4ade80" : "#22c55e"} roughness={0.8} />
        </mesh>

        {/* 3. LEVEL 2: S-Curve Mid-Slope Terraces */}
        {/* Mid Cliff Wall */}
        <mesh position={[0, 4.0, -2]} receiveShadow castShadow>
          <cylinderGeometry args={[26, 28, 4.0, 48]} />
          <meshStandardMaterial color="#874d36" roughness={0.9} />
        </mesh>
        {/* Mid Terrace Green Grass Top */}
        <mesh position={[0, 6.05, -2]} receiveShadow castShadow>
          <cylinderGeometry args={[25.5, 26, 0.3, 48]} />
          <meshStandardMaterial color={isLight ? "#34d399" : "#16a34a"} roughness={0.8} />
        </mesh>

        {/* 4. LEVEL 3: Upper Central Roundabout Plateau */}
        {/* Roundabout Cliff Base */}
        <mesh position={[0, 8.5, -8]} receiveShadow castShadow>
          <cylinderGeometry args={[16, 18, 4.5, 48]} />
          <meshStandardMaterial color="#78716c" roughness={0.9} />
        </mesh>
        {/* Roundabout Grass Top */}
        <mesh position={[0, 10.8, -8]} receiveShadow castShadow>
          <cylinderGeometry args={[15.5, 16, 0.3, 48]} />
          <meshStandardMaterial color={isLight ? "#4ade80" : "#15803d"} roughness={0.8} />
        </mesh>

        {/* 5. LEVEL 4: NORTH VOLCANO PEAK */}
        {/* Volcano Mountain Base & Slopes */}
        <mesh position={[0, 15.0, -32]} receiveShadow castShadow>
          <cylinderGeometry args={[5, 18, 12, 32]} />
          <meshStandardMaterial color="#6d4c41" roughness={0.95} />
        </mesh>
        {/* Volcano Terracotta Ridge Details */}
        <mesh position={[0, 17.0, -32]} receiveShadow castShadow>
          <cylinderGeometry args={[6.5, 14, 8, 32]} />
          <meshStandardMaterial color="#874d36" roughness={0.9} />
        </mesh>
        {/* Glowing Lava Crater Rim */}
        <mesh position={[0, 21.01, -32]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[4.2, 32]} />
          <meshStandardMaterial color="#ff3d00" emissive="#ff3d00" emissiveIntensity={3} toneMapped={false} />
        </mesh>
        {/* Inner Lava Pool */}
        <mesh position={[0, 20.5, -32]}>
          <cylinderGeometry args={[3.8, 3.8, 0.5, 32]} />
          <meshStandardMaterial color="#dc2626" emissive="#ef4444" emissiveIntensity={2} />
        </mesh>

        {/* Volcano Smoke Clouds around Crater Rim */}
        <group position={[0, 22.5, -32]}>
          {[
            [-3.5, 0, -2, 1.8],
            [3.5, 0.5, 1, 2.2],
            [0, 1.2, 3.2, 2.0],
            [-2.0, 1.5, 2.0, 1.5],
            [2.5, 1.8, -2.5, 1.7],
          ].map(([x, y, z, r], i) => (
            <mesh key={`vcloud-${i}`} position={[x as number, y as number, z as number]} castShadow>
              <sphereGeometry args={[r as number, 16, 16]} />
              <meshStandardMaterial color="#ffffff" roughness={0.4} />
            </mesh>
          ))}
        </group>

        {/* 6. NORTH-WEST LIGHTHOUSE HILL */}
        <mesh position={[-25, 11.0, -22]} receiveShadow castShadow>
          <cylinderGeometry args={[8, 12, 9, 32]} />
          <meshStandardMaterial color="#78716c" roughness={0.9} />
        </mesh>
        <mesh position={[-25, 15.6, -22]} receiveShadow castShadow>
          <cylinderGeometry args={[7.5, 8.2, 0.4, 32]} />
          <meshStandardMaterial color={isLight ? "#4ade80" : "#22c55e"} roughness={0.8} />
        </mesh>

        {/* 7. NORTH-EAST TREASURE CLIFF */}
        <mesh position={[24, 9.5, -18]} receiveShadow castShadow>
          <cylinderGeometry args={[7, 10, 7, 32]} />
          <meshStandardMaterial color="#78716c" roughness={0.9} />
        </mesh>
        <mesh position={[24, 13.1, -18]} receiveShadow castShadow>
          <cylinderGeometry args={[6.5, 7.2, 0.4, 32]} />
          <meshStandardMaterial color={isLight ? "#4ade80" : "#22c55e"} roughness={0.8} />
        </mesh>

        {/* 8. CARVED STONE STAIRCASES (Connecting Levels) */}
        {/* Stairs from Lower Village to S-Curve Slope */}
        <group position={[-12, 3.5, 16]} rotation={[0, 0.4, 0]}>
          {Array.from({ length: 6 }).map((_, i) => (
            <mesh key={`st1-${i}`} position={[0, i * 0.4, -i * 0.6]} castShadow receiveShadow>
              <boxGeometry args={[3, 0.4, 0.8]} />
              <meshStandardMaterial color="#d6d3d1" roughness={0.8} />
            </mesh>
          ))}
        </group>
        {/* Stairs from S-Curve to Lighthouse Hill */}
        <group position={[-20, 10.0, -14]} rotation={[0, -0.6, 0]}>
          {Array.from({ length: 8 }).map((_, i) => (
            <mesh key={`st2-${i}`} position={[0, i * 0.5, -i * 0.6]} castShadow receiveShadow>
              <boxGeometry args={[2.5, 0.4, 0.8]} />
              <meshStandardMaterial color="#d6d3d1" roughness={0.8} />
            </mesh>
          ))}
        </group>

      </group>
      
      {/* Elements & Props on the Island */}
      <group position={[0, 0, 0]}>
        {children}
      </group>
    </group>
  );
}
