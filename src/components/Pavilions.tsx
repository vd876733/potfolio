"use client";

import { Text } from "@react-three/drei";
import Pavilion from "./Pavilion";

interface PavilionsProps {
  onSectionClick: (section: string) => void;
  isLight?: boolean;
}

export default function Pavilions({ onSectionClick, isLight = false }: PavilionsProps) {
  const glassMaterial = (
    <meshPhysicalMaterial
      color={isLight ? "#e2e8f0" : "#111111"}
      emissive={isLight ? "#000000" : "#38bdf8"}
      emissiveIntensity={isLight ? 0 : 0.5}
      metalness={0.8}
      roughness={0.1}
      transmission={isLight ? 0.9 : 0.2}
      ior={1.5}
      thickness={1}
      transparent
      opacity={isLight ? 0.9 : 1}
    />
  );

  const frameMaterial = (
    <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.4} />
  );

  return (
    <group>
      {/* 1. Town Plaza Pavilion (Center) */}
      <Pavilion
        position={[0, 0, 0]}
        label="Town Plaza"
        color="#38BDF8" // Neon Blue
        onClick={onSectionClick}
      >
        <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[3, 3, 3]} />
          {glassMaterial}
        </mesh>
        <mesh position={[0, 1.5, 0]}>
          <boxGeometry args={[3.1, 3.1, 3.1]} />
          <meshBasicMaterial color="#333333" wireframe />
        </mesh>
      </Pavilion>

      {/* 2. Arena Complex (Left Front) */}
      <Pavilion
        position={[-12, 0, 8]}
        label="Arena Complex"
        color="#F43F5E" // Neon Rose
        onClick={onSectionClick}
      >
        <mesh position={[0, 1, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[3, 4, 2, 8]} />
          {glassMaterial}
        </mesh>
        <mesh position={[0, 2, 0]} castShadow receiveShadow>
          <torusGeometry args={[3.2, 0.2, 8, 24]} />
          {frameMaterial}
        </mesh>
      </Pavilion>

      {/* 3. Project Workshops (Right Front) */}
      <Pavilion
        position={[12, 0, 8]}
        label="Project Workshops"
        color="#10B981" // Neon Emerald
        onClick={onSectionClick}
      >
        <group>
          {/* Workshop 1 */}
          <mesh position={[-1.5, 1.25, -1.5]} castShadow receiveShadow>
            <boxGeometry args={[2, 2.5, 2]} />
            {glassMaterial}
          </mesh>
          {/* Workshop 2 */}
          <mesh position={[1.5, 1.75, -1]} castShadow receiveShadow>
            <boxGeometry args={[2.5, 3.5, 2]} />
            {glassMaterial}
          </mesh>
          {/* Workshop 3 */}
          <mesh position={[0, 1, 1.5]} castShadow receiveShadow>
            <boxGeometry args={[3, 2, 2]} />
            {glassMaterial}
          </mesh>
        </group>
      </Pavilion>

      {/* 4. Knowledge Forge (Left Back) */}
      <Pavilion
        position={[-10, 0, -10]}
        label="Knowledge Forge"
        color="#F59E0B" // Neon Amber
        onClick={onSectionClick}
      >
        <mesh position={[0, 3, 0]} castShadow receiveShadow>
          <boxGeometry args={[2, 6, 2]} />
          {glassMaterial}
        </mesh>
        <mesh position={[0, 3, 0]}>
          <boxGeometry args={[2.1, 6.1, 2.1]} />
          <meshBasicMaterial color="#444444" wireframe />
        </mesh>
      </Pavilion>

      {/* 5. Creative Atelier (Right Back) */}
      <Pavilion
        position={[10, 0, -10]}
        label="Creative Atelier"
        color="#A855F7" // Neon Purple
        onClick={onSectionClick}
      >
        <mesh position={[0, 1.5, 0]} rotation={[0.2, 0.4, 0.1]} castShadow receiveShadow>
          <octahedronGeometry args={[3]} />
          {glassMaterial}
        </mesh>
        <mesh position={[0, 1.5, 0]} rotation={[0.2, 0.4, 0.1]}>
          <octahedronGeometry args={[3.1]} />
          <meshBasicMaterial color="#555555" wireframe />
        </mesh>
      </Pavilion>
    </group>
  );
}
