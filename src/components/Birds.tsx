"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Bird({ offset, color, radius, yOffset, speed }: { offset: number; color: string; radius: number, yOffset: number, speed: number }) {
  const group = useRef<THREE.Group>(null);
  const leftWing = useRef<THREE.Group>(null);
  const rightWing = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!group.current || !leftWing.current || !rightWing.current) return;
    const time = clock.elapsedTime * speed + offset;
    
    // Position on figure-8 or circle + vertical bobbing
    const x = Math.cos(time) * radius;
    const z = Math.sin(time) * radius;
    const y = yOffset + Math.sin(time * 2) * 1.5;
    group.current.position.set(x, y, z);
    
    // Look ahead
    const nextT = time + (speed > 0 ? 0.05 : -0.05);
    const nextX = Math.cos(nextT) * radius;
    const nextZ = Math.sin(nextT) * radius;
    const nextY = yOffset + Math.sin(nextT * 2) * 1.5;
    group.current.lookAt(nextX, nextY, nextZ);

    // Flap wings
    const flap = Math.sin(clock.elapsedTime * 15 + offset) * 0.6;
    leftWing.current.rotation.z = flap;
    rightWing.current.rotation.z = -flap;
  });

  return (
    <group ref={group}>
      {/* Body */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <coneGeometry args={[0.08, 0.4, 4]} />
        <meshStandardMaterial color={color} roughness={1} />
      </mesh>
      
      {/* Left Wing */}
      <group ref={leftWing} position={[-0.08, 0, 0]}>
        <mesh position={[-0.15, 0, 0]} rotation={[0, 0, -Math.PI / 8]} castShadow>
          <planeGeometry args={[0.3, 0.15]} />
          <meshStandardMaterial color={color} roughness={1} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Right Wing */}
      <group ref={rightWing} position={[0.08, 0, 0]}>
        <mesh position={[0.15, 0, 0]} rotation={[0, 0, Math.PI / 8]} castShadow>
          <planeGeometry args={[0.3, 0.15]} />
          <meshStandardMaterial color={color} roughness={1} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
}

interface BirdsProps {
  isLight?: boolean;
}

export default function Birds({ isLight = false }: BirdsProps) {
  const birdColor = isLight ? "#475569" : "#cbd5e1"; // slate-600 in light, slate-300 in dark
  const radius = 10;
  const yOffset = 15;

  return (
    <group>
      {/* Flock 1 */}
      <Bird offset={0} color={birdColor} radius={radius} yOffset={yOffset} speed={0.2} />
      <Bird offset={0.2} color={birdColor} radius={radius + 0.5} yOffset={yOffset + 0.5} speed={0.2} />
      <Bird offset={-0.1} color={birdColor} radius={radius - 0.5} yOffset={yOffset - 0.5} speed={0.2} />
      <Bird offset={0.3} color={birdColor} radius={radius + 1.0} yOffset={yOffset - 0.2} speed={0.2} />
      <Bird offset={0.1} color={birdColor} radius={radius - 0.8} yOffset={yOffset + 0.3} speed={0.2} />

      {/* Flock 2 (Opposite direction, wider) */}
      <Bird offset={3.1} color={birdColor} radius={18} yOffset={12} speed={-0.15} />
      <Bird offset={3.3} color={birdColor} radius={18.5} yOffset={12.5} speed={-0.15} />
      <Bird offset={3.0} color={birdColor} radius={17.5} yOffset={11.5} speed={-0.15} />
    </group>
  );
}
