"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface BlackHoleProps {
  position?: [number, number, number];
  scale?: number;
}

export function BlackHole({
  position = [0, 15, -180],
  scale = 1.5,
}: BlackHoleProps) {
  const accretionDiskRef = useRef<THREE.Group>(null!);
  const lensTopRef = useRef<THREE.Group>(null!);
  const lensBottomRef = useRef<THREE.Group>(null!);
  const particlesRef = useRef<THREE.Points>(null!);

  // Swirling matter particle system (3,000 accretion dust particles)
  const particleCount = 3000;
  const [positions, colors] = useMemo(() => {
    const posArr = new Float32Array(particleCount * 3);
    const colArr = new Float32Array(particleCount * 3);

    const colorWhite = new THREE.Color("#ffffff");
    const colorGold = new THREE.Color("#ffd700");
    const colorOrange = new THREE.Color("#ff6b00");
    const colorRed = new THREE.Color("#d00000");

    for (let i = 0; i < particleCount; i++) {
      const r = 26 + Math.pow(Math.random(), 1.6) * 110;
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * (1.5 + (r / 110) * 6);

      posArr[i * 3] = Math.cos(angle) * r;
      posArr[i * 3 + 1] = height;
      posArr[i * 3 + 2] = Math.sin(angle) * r;

      const normR = (r - 26) / 110;
      let c: THREE.Color;
      if (normR < 0.15) {
        c = colorWhite.clone().lerp(colorGold, normR / 0.15);
      } else if (normR < 0.5) {
        c = colorGold.clone().lerp(colorOrange, (normR - 0.15) / 0.35);
      } else {
        c = colorOrange.clone().lerp(colorRed, (normR - 0.5) / 0.5);
      }

      colArr[i * 3] = c.r;
      colArr[i * 3 + 1] = c.g;
      colArr[i * 3 + 2] = c.b;
    }
    return [posArr, colArr];
  }, [particleCount]);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (accretionDiskRef.current) {
      accretionDiskRef.current.rotation.z = t * 0.08;
    }
    if (lensTopRef.current) {
      lensTopRef.current.rotation.z = -t * 0.04;
    }
    if (lensBottomRef.current) {
      lensBottomRef.current.rotation.z = t * 0.04;
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group position={position} scale={scale} rotation={[0.18, -0.25, 0.05]}>
      {/* 1. Event Horizon (Core): Solid Pitch-Black Sphere */}
      <mesh renderOrder={1}>
        <sphereGeometry args={[25, 64, 64]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Intense White Photon Sphere Rim */}
      <mesh rotation={[Math.PI / 2.15, 0, 0]} renderOrder={2}>
        <ringGeometry args={[25.1, 26.8, 128]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.95}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 2. Accretion Disk (Horizontal Glowing Rings with Fiery Gradient) */}
      <group ref={accretionDiskRef} rotation={[Math.PI / 2.15, 0, 0]}>
        {/* Inner Core Brightness (White/Gold) */}
        <mesh position={[0, 0, 0]}>
          <ringGeometry args={[26.5, 55, 128]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.9}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        {/* Inner Golden Yellow Ring */}
        <mesh position={[0, 0, 0.02]}>
          <ringGeometry args={[52, 90, 128]} />
          <meshBasicMaterial
            color="#ffd700"
            transparent
            opacity={0.75}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        {/* Fiery Orange Main Disk */}
        <mesh position={[0, 0, 0.05]}>
          <ringGeometry args={[88, 135, 128]} />
          <meshBasicMaterial
            color="#ff6b00"
            transparent
            opacity={0.55}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        {/* Outer Deep Red Accretion Glow */}
        <mesh position={[0, 0, 0.08]}>
          <ringGeometry args={[132, 175, 128]} />
          <meshBasicMaterial
            color="#b30000"
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      {/* 3. Gravitational Lensing Effect (Halo Arches Wrapping Core) */}
      {/* Top Lens Arch (Light bent over black hole core) */}
      <group ref={lensTopRef} rotation={[0, 0, Math.PI / 16]}>
        <mesh rotation={[-Math.PI / 4.5, 0, 0]}>
          <ringGeometry args={[26, 95, 128]} />
          <meshBasicMaterial
            color="#ffd700"
            transparent
            opacity={0.65}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        <mesh rotation={[-Math.PI / 4.5, 0, 0]} position={[0, 0, -0.05]}>
          <ringGeometry args={[92, 140, 128]} />
          <meshBasicMaterial
            color="#ff6b00"
            transparent
            opacity={0.45}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      {/* Bottom Lens Arch (Light bent under black hole core) */}
      <group ref={lensBottomRef} rotation={[0, 0, -Math.PI / 16]}>
        <mesh rotation={[Math.PI / 4.5, 0, 0]}>
          <ringGeometry args={[26, 95, 128]} />
          <meshBasicMaterial
            color="#ff6b00"
            transparent
            opacity={0.55}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      {/* 4. Swirling Matter Particle System */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={1.6}
          vertexColors
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Backside Corona Aura Glow */}
      <mesh>
        <sphereGeometry args={[40, 32, 32]} />
        <meshBasicMaterial
          color="#ff6b00"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

export default BlackHole;
