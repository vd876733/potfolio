"use client";

import React, { useRef, useMemo, useLayoutEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface BlackHoleProps {
  position?: [number, number, number];
  scale?: number;
}

export function BlackHole({
  position = [90, -10, -180],
  scale = 0.38,
}: BlackHoleProps) {
  const diskRef = useRef<THREE.Group>(null!);
  const rocksRef = useRef<THREE.InstancedMesh>(null!);
  const lensTopRef = useRef<THREE.Group>(null!);
  const lensBottomRef = useRef<THREE.Group>(null!);

  // Swirling Rocky Accretion Ring (3,500 very tiny yellow-orange space rocks)
  const rockCount = 3500;
  const rockData = useMemo(() => {
    const dummy = new THREE.Object3D();
    const matrices: THREE.Matrix4[] = [];
    const colors: THREE.Color[] = [];

    const colorWhiteGold = new THREE.Color("#fff5b3");
    const colorYellow = new THREE.Color("#ffd700");
    const colorOrange = new THREE.Color("#ff8c00");
    const colorHotOrange = new THREE.Color("#ff4500");
    const colorDeepRed = new THREE.Color("#c9184a");

    for (let i = 0; i < rockCount; i++) {
      // Orbital radius from 41 to 215
      const r = 41 + Math.pow(Math.random(), 1.5) * 174;
      const angle = Math.random() * Math.PI * 2;
      // Very thin disk vertical dispersion
      const height = (Math.random() - 0.5) * (1.2 + (r / 215) * 5);

      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;

      // Very tiny rock scale
      const rockScale = 0.12 + Math.random() * 0.38;

      dummy.position.set(x, height, z);
      dummy.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      dummy.scale.set(rockScale, rockScale * (0.8 + Math.random() * 0.5), rockScale);
      dummy.updateMatrix();

      const normR = (r - 41) / 174;
      let c: THREE.Color;
      if (normR < 0.12) {
        c = colorWhiteGold.clone().lerp(colorYellow, normR / 0.12);
      } else if (normR < 0.45) {
        c = colorYellow.clone().lerp(colorOrange, (normR - 0.12) / 0.33);
      } else if (normR < 0.75) {
        c = colorOrange.clone().lerp(colorHotOrange, (normR - 0.45) / 0.3);
      } else {
        c = colorHotOrange.clone().lerp(colorDeepRed, (normR - 0.75) / 0.25);
      }

      matrices.push(dummy.matrix.clone());
      colors.push(c);
    }
    return { matrices, colors };
  }, [rockCount]);

  useLayoutEffect(() => {
    if (!rocksRef.current) return;
    rockData.matrices.forEach((mat, i) => {
      rocksRef.current.setMatrixAt(i, mat);
      rocksRef.current.setColorAt(i, rockData.colors[i]);
    });
    rocksRef.current.instanceMatrix.needsUpdate = true;
    if (rocksRef.current.instanceColor) {
      rocksRef.current.instanceColor.needsUpdate = true;
    }
  }, [rockData]);

  useFrame((_, delta) => {
    // Swirling motion of accretion disk & tiny rocky debris
    if (diskRef.current) {
      diskRef.current.rotation.z += delta * 0.08;
    }
    if (rocksRef.current) {
      rocksRef.current.rotation.y += delta * 0.06;
    }
    if (lensTopRef.current) {
      lensTopRef.current.rotation.z -= delta * 0.04;
    }
    if (lensBottomRef.current) {
      lensBottomRef.current.rotation.z += delta * 0.04;
    }
  });

  return (
    <group position={position} scale={scale} rotation={[0.18, -0.25, 0.05]} renderOrder={-5}>
      {/* 1. Event Horizon (Void): Non-reflective pitch-black singularity core */}
      <mesh renderOrder={-5}>
        <sphereGeometry args={[40, 64, 64]} />
        <meshBasicMaterial color="#000000" depthWrite={true} />
      </mesh>

      {/* 2. Photon Ring: Thin glowing white/gold edge */}
      <mesh rotation={[Math.PI / 2.15, 0, 0]} renderOrder={-5}>
        <ringGeometry args={[40.1, 42.5, 128]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.95}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* 3. Instanced Very Tiny Yellow-Orange Space Rocks Accretion Ring */}
      <instancedMesh
        ref={rocksRef}
        args={[undefined, undefined, rockCount]}
        renderOrder={-5}
        rotation={[Math.PI / 2.15, 0, 0]}
      >
        <dodecahedronGeometry args={[0.35, 1]} />
        <meshStandardMaterial
          roughness={0.5}
          metalness={0.2}
          emissive="#ff5500"
          emissiveIntensity={0.8}
        />
      </instancedMesh>

      {/* 4. Glowing Plasma Base Accretion Disk */}
      <group ref={diskRef} rotation={[Math.PI / 2.15, 0, 0]}>
        {/* Hot Core Brightness */}
        <mesh position={[0, 0, 0]} renderOrder={-5}>
          <ringGeometry args={[42.5, 85, 128]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.85}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Vibrant Golden Yellow Ring */}
        <mesh position={[0, 0, 0.02]} renderOrder={-5}>
          <ringGeometry args={[82, 145, 128]} />
          <meshBasicMaterial
            color="#ffd700"
            transparent
            opacity={0.7}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Fiery Deep Orange Outer Glow */}
        <mesh position={[0, 0, 0.05]} renderOrder={-5}>
          <ringGeometry args={[140, 210, 128]} />
          <meshBasicMaterial
            color="#ff4500"
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* 5. Gravitational Lensing Halos (Upper & Lower Warped Vertical Arches) */}
      <group ref={lensTopRef} rotation={[0, 0, Math.PI / 16]}>
        <mesh rotation={[-Math.PI / 4.2, 0, 0]} renderOrder={-5}>
          <ringGeometry args={[41, 145, 128]} />
          <meshBasicMaterial
            color="#ffd700"
            transparent
            opacity={0.65}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>

      <group ref={lensBottomRef} rotation={[0, 0, -Math.PI / 16]}>
        <mesh rotation={[Math.PI / 4.2, 0, 0]} renderOrder={-5}>
          <ringGeometry args={[41, 145, 128]} />
          <meshBasicMaterial
            color="#ff4500"
            transparent
            opacity={0.55}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* 6. Soft Backside Corona Aura Glow */}
      <mesh renderOrder={-5}>
        <sphereGeometry args={[65, 32, 32]} />
        <meshBasicMaterial
          color="#ff4500"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <pointLight color="#ff8c00" intensity={18} distance={500} decay={1} />
    </group>
  );
}

export default BlackHole;
