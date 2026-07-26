"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface LandmarkProps {
  position: [number, number, number];
  isLight?: boolean;
}

export function Lighthouse({ position, isLight = false }: LandmarkProps) {
  const beaconRef = useRef<THREE.Group>(null);
  const lightColor = "#fef08a";

  useFrame(({ clock }) => {
    if (beaconRef.current) {
      beaconRef.current.rotation.y = clock.elapsedTime * 2;
    }
  });

  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.2, 1.5, 1, 16]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      {/* Tower */}
      <mesh position={[0, 3.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.8, 1.2, 5, 16]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      {/* Stripes (Red) */}
      <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.95, 1.1, 1, 16]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
      <mesh position={[0, 4.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.82, 0.95, 1, 16]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
      {/* Top Deck */}
      <mesh position={[0, 6, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.2, 0.8, 0.2, 16]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      {/* Glass Room */}
      <mesh position={[0, 6.5, 0]}>
        <cylinderGeometry args={[0.7, 0.7, 0.8, 8]} />
        <meshPhysicalMaterial color="#ffffff" transmission={0.9} opacity={1} transparent roughness={0.1} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 7.2, 0]} castShadow receiveShadow>
        <coneGeometry args={[1, 0.6, 16]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>

      {/* Rotating Beacon */}
      <group ref={beaconRef} position={[0, 6.5, 0]}>
        <mesh position={[0, 0, 0.4]}>
          <boxGeometry args={[0.4, 0.4, 0.2]} />
          <meshStandardMaterial color={lightColor} emissive={lightColor} emissiveIntensity={isLight ? 0.5 : 2} toneMapped={false} />
        </mesh>
        {!isLight && <spotLight position={[0, 0, 0.2]} angle={0.4} penumbra={0.2} intensity={100} distance={50} color={lightColor} castShadow />}
      </group>
    </group>
  );
}

export function Windmill({ position, isLight = false }: LandmarkProps) {
  const bladesRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (bladesRef.current) {
      bladesRef.current.rotation.z = -clock.elapsedTime * 1.5;
    }
  });

  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1, 1.5, 3, 8]} />
        <meshStandardMaterial color="#d6d3d1" roughness={0.9} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 3.5, 0]} castShadow receiveShadow>
        <coneGeometry args={[1.2, 1, 8]} />
        <meshStandardMaterial color="#78350f" roughness={0.8} />
      </mesh>
      {/* Rotor Hub */}
      <mesh position={[0, 2.5, 1]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.5, 8]} />
        <meshStandardMaterial color="#44403c" />
      </mesh>

      {/* Blades */}
      <group ref={bladesRef} position={[0, 2.5, 1.2]}>
        {[0, 1, 2, 3].map((i) => (
          <group key={i} rotation={[0, 0, (Math.PI / 2) * i]}>
            <mesh position={[0, 1.2, 0]} castShadow>
              <boxGeometry args={[0.3, 2, 0.05]} />
              <meshStandardMaterial color="#fcd34d" roughness={0.6} />
            </mesh>
            {/* Blade arm */}
            <mesh position={[0, 1, 0]} castShadow>
              <boxGeometry args={[0.05, 2, 0.1]} />
              <meshStandardMaterial color="#44403c" />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

export function DetailedHouse({ position, isLight = false, color = "#38bdf8" }: LandmarkProps & { color?: string }) {
  const glowColor = "#fef08a";
  return (
    <group position={position}>
      {/* Main Body */}
      <mesh position={[0, 1, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 2, 2.4]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 2.6, 0]} rotation={[0, Math.PI / 4, 0]} castShadow receiveShadow>
        <coneGeometry args={[2.2, 1.2, 4]} />
        <meshStandardMaterial color="#334155" roughness={0.8} />
      </mesh>
      {/* Chimney */}
      <mesh position={[0.6, 2.8, -0.6]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 1.5, 0.4]} />
        <meshStandardMaterial color="#7f1d1d" roughness={0.9} />
      </mesh>
      {/* Door */}
      <mesh position={[0, 0.6, 1.21]}>
        <boxGeometry args={[0.6, 1.2, 0.05]} />
        <meshStandardMaterial color="#451a03" />
      </mesh>
      {/* Windows */}
      {[-0.6, 0.6].map((x, i) => (
        <mesh key={i} position={[x, 1.2, 1.21]}>
          <boxGeometry args={[0.5, 0.5, 0.05]} />
          <meshStandardMaterial 
            color={isLight ? "#94a3b8" : glowColor} 
            emissive={isLight ? "#000000" : glowColor} 
            emissiveIntensity={isLight ? 0 : 1.5} 
            toneMapped={false} 
          />
        </mesh>
      ))}
    </group>
  );
}
