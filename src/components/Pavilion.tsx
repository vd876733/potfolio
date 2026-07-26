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
  const textRef = useRef<any>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (!group.current) return;
    
    // Smoothly interpolate Y position for floating effect
    const targetY = hovered ? 0.4 : 0;
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, targetY, 0.1);

    if (textRef.current) {
      const targetScale = hovered ? 1.1 : 1.0;
      textRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.15);
      
      // Floating animation for text
      textRef.current.position.y = 9.5 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group position={position}>
      {/* Sleek Floating Label */}
      <Text
        ref={textRef}
        position={[0, 9.5, 0]}
        fontSize={0.8}
        color={hovered ? "#ffffff" : "#cbd5e1"}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.04}
        outlineColor="#0f172a"
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
      </group>
    </group>
  );
}
