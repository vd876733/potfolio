"use client";

import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface OceanProps {
  isLight?: boolean;
}

export default function Ocean({ isLight = false }: OceanProps) {
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
      <planeGeometry args={[4000, 4000, 1, 1]} />
      <meshStandardMaterial
        color={isLight ? "#00a8ff" : "#0088cc"}
        transparent={false}
        roughness={0.1}
        metalness={0.1}
      />
    </mesh>
  );
}
