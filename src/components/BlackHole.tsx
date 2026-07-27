"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface BlackHoleProps {
  position?: [number, number, number];
  scale?: number;
}

export default function BlackHole({
  position = [350, -90, -650],
  scale = 0.4,
}: BlackHoleProps) {
  const diskRef = useRef<THREE.Group>(null!);
  const lensingRef = useRef<THREE.Group>(null!);
  const particleSwarmRef = useRef<THREE.Points>(null!);

  // 1. Fiery Accretion Gradient Texture
  const accretionTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const grad = ctx.createLinearGradient(0, 0, 512, 0);
      grad.addColorStop(0.0, "rgba(255, 255, 255, 1.0)"); // Core White Hot
      grad.addColorStop(0.15, "rgba(255, 215, 0, 0.95)"); // Golden Yellow (#ffd700)
      grad.addColorStop(0.45, "rgba(255, 107, 0, 0.85)"); // Fiery Orange (#ff6b00)
      grad.addColorStop(0.75, "rgba(180, 20, 0, 0.4)");   // Deep Crimson Red
      grad.addColorStop(1.0, "rgba(0, 0, 0, 0.0)");       // Outer Edge Void

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 64);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }, []);

  // 2. High-Density Swirling Accretion Particles
  const particleCount = 6000;
  const [particlePositions, particleColors] = useMemo(() => {
    const posArr = new Float32Array(particleCount * 3);
    const colArr = new Float32Array(particleCount * 3);

    const cWhite = new THREE.Color("#ffffff");
    const cGold = new THREE.Color("#ffd700");
    const cOrange = new THREE.Color("#ff6b00");
    const cRed = new THREE.Color("#b41400");

    for (let i = 0; i < particleCount; i++) {
      const radius = 65 + Math.pow(Math.random(), 1.5) * 140;
      const angle = Math.random() * Math.PI * 2;
      const spreadY = (Math.random() - 0.5) * (radius * 0.04);

      posArr[i * 3] = Math.cos(angle) * radius;
      posArr[i * 3 + 1] = spreadY;
      posArr[i * 3 + 2] = Math.sin(angle) * radius;

      const normR = (radius - 65) / 140;
      let c: THREE.Color;
      if (normR < 0.2) {
        c = cWhite.clone().lerp(cGold, normR / 0.2);
      } else if (normR < 0.6) {
        c = cGold.clone().lerp(cOrange, (normR - 0.2) / 0.4);
      } else {
        c = cOrange.clone().lerp(cRed, (normR - 0.6) / 0.4);
      }

      colArr[i * 3] = c.r;
      colArr[i * 3 + 1] = c.g;
      colArr[i * 3 + 2] = c.b;
    }

    return [posArr, colArr];
  }, [particleCount]);

  // 3. Smooth Z-axis and Y-axis Rotations for Swirling Matter
  useFrame((_, delta) => {
    if (diskRef.current) {
      diskRef.current.rotation.z += delta * 0.08;
    }
    if (lensingRef.current) {
      lensingRef.current.rotation.x += delta * 0.03;
    }
    if (particleSwarmRef.current) {
      particleSwarmRef.current.rotation.y += delta * 0.12;
    }
  });

  return (
    <group position={position} scale={scale} renderOrder={-10}>
      {/* ========================================================= */}
      {/* 1. EVENT HORIZON CORE (Absolute Void Black Hole)           */}
      {/* ========================================================= */}
      <mesh>
        <sphereGeometry args={[55, 64, 64]} />
        <meshBasicMaterial color="#000000" depthTest={true} depthWrite={true} />
      </mesh>

      {/* Intense Inner Photon Ring Glow */}
      <mesh>
        <sphereGeometry args={[57.5, 64, 64]} />
        <meshBasicMaterial
          color="#ffd700"
          transparent
          opacity={0.85}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthTest={true}
          depthWrite={false}
        />
      </mesh>

      {/* Gravitational Outer Halo Sphere */}
      <mesh>
        <sphereGeometry args={[68, 64, 64]} />
        <meshBasicMaterial
          color="#ff6b00"
          transparent
          opacity={0.2}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthTest={true}
          depthWrite={false}
        />
      </mesh>

      {/* ========================================================= */}
      {/* 2. MAIN ACCRETION DISK (Fiery Horizontal Ring)             */}
      {/* ========================================================= */}
      <group ref={diskRef} rotation={[Math.PI / 7, 0, Math.PI / 12]}>
        {/* Main Swirling Gradient Ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[58, 200, 128]} />
          {accretionTexture ? (
            <meshBasicMaterial
              map={accretionTexture}
              side={THREE.DoubleSide}
              transparent
              opacity={0.92}
              blending={THREE.AdditiveBlending}
              depthTest={true}
              depthWrite={false}
            />
          ) : (
            <meshBasicMaterial
              color="#ff6b00"
              side={THREE.DoubleSide}
              transparent
              opacity={0.85}
              blending={THREE.AdditiveBlending}
              depthTest={true}
              depthWrite={false}
            />
          )}
        </mesh>

        {/* Secondary Bright Core Ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[56, 110, 128]} />
          <meshBasicMaterial
            color="#ffd700"
            side={THREE.DoubleSide}
            transparent
            opacity={0.75}
            blending={THREE.AdditiveBlending}
            depthTest={true}
            depthWrite={false}
          />
        </mesh>

        {/* Swirling Particle Accretion Swarm */}
        <points ref={particleSwarmRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[particlePositions, 3]}
            />
            <bufferAttribute
              attach="attributes-color"
              args={[particleColors, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={3.5}
            vertexColors
            transparent
            opacity={0.9}
            blending={THREE.AdditiveBlending}
            depthTest={true}
            depthWrite={false}
          />
        </points>
      </group>

      {/* ========================================================= */}
      {/* 3. GRAVITATIONAL LENSING HALO (Iconic Interstellar Vertical Arch) */}
      {/* ========================================================= */}
      <group ref={lensingRef} rotation={[Math.PI / 2.2, Math.PI / 8, 0]}>
        {/* Gravitational Warped Light Lensing Ring (Vertical/Slanted Arch) */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[57, 170, 128]} />
          {accretionTexture ? (
            <meshBasicMaterial
              map={accretionTexture}
              side={THREE.DoubleSide}
              transparent
              opacity={0.65}
              blending={THREE.AdditiveBlending}
              depthTest={true}
              depthWrite={false}
            />
          ) : (
            <meshBasicMaterial
              color="#ff6b00"
              side={THREE.DoubleSide}
              transparent
              opacity={0.6}
              blending={THREE.AdditiveBlending}
              depthTest={true}
              depthWrite={false}
            />
          )}
        </mesh>
      </group>
    </group>
  );
}
