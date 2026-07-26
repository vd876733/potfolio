"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

interface PavilionProps {
  position: [number, number, number];
  label: string;
  color?: string;
  onClick: (label: string) => void;
  children: React.ReactNode;
}

export default function Pavilion({
  position,
  label,
  color = "#38BDF8",
  onClick,
  children,
}: PavilionProps) {
  const group = useRef<THREE.Group>(null);
  const coreMaterial = useRef<THREE.MeshStandardMaterial>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (!group.current) return;
    
    // Smoothly interpolate Y position for floating effect
    const targetY = hovered ? 0.2 : 0;
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, targetY, 0.1);

    // Smoothly interpolate glow intensity
    if (coreMaterial.current) {
      const targetIntensity = hovered ? 4 : 0.8;
      coreMaterial.current.emissiveIntensity = THREE.MathUtils.lerp(
        coreMaterial.current.emissiveIntensity,
        targetIntensity,
        0.1
      );
    }
  });

  return (
    <group position={position}>
      {/* Sleek Floating Label */}
      <Text
        position={[0, 4.5, 0]}
        fontSize={0.6}
        color={hovered ? "#ffffff" : "#a0a0a0"}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {label}
      </Text>

      {/* The Building Structure */}
      <group
        ref={group}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
        onClick={(e) => {
          e.stopPropagation();
          onClick(label);
        }}
      >
        {/* Custom architectural shell passed as children */}
        {children}

        {/* Internal Glowing Core */}
        <mesh position={[0, 1.5, 0]}>
          <boxGeometry args={[1, 2, 1]} />
          <meshStandardMaterial
            ref={coreMaterial}
            color={color}
            emissive={color}
            emissiveIntensity={0.8}
            toneMapped={false} // Important for bloom effect
          />
        </mesh>
      </group>
    </group>
  );
}
