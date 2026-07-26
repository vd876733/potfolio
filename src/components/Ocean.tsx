"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface OceanProps {
  isLight?: boolean;
}

export default function Ocean({ isLight = false }: OceanProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const waterColor = isLight ? "#38bdf8" : "#020617";

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.position.y = -6 + Math.sin(clock.elapsedTime * 0.8) * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[1000, 1000]} />
      <meshStandardMaterial
        color={waterColor}
        transparent
        opacity={isLight ? 0.7 : 0.9}
        roughness={0.1}
        metalness={0.8}
      />
    </mesh>
  );
}
