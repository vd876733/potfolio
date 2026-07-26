"use client";

import { useRef } from "react";
import * as THREE from "three";
import { MeshDistortMaterial } from "@react-three/drei";

interface OceanProps {
  isLight?: boolean;
}

export default function Ocean({ isLight = false }: OceanProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const waterColor = isLight ? "#00bcd4" : "#0369a1"; // Cyan for day, Deep Blue for night

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]} receiveShadow>
      <planeGeometry args={[3000, 3000, 64, 64]} />
      <MeshDistortMaterial
        color={waterColor}
        transparent
        opacity={isLight ? 0.8 : 0.9}
        roughness={0.1}
        metalness={0.1}
        distort={0.4} // strength of the distortion
        speed={1.5}   // speed of the distortion
      />
    </mesh>
  );
}
