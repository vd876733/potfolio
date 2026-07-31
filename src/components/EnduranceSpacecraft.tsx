"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface EnduranceSpacecraftProps {
  position?: [number, number, number];
  scale?: number | [number, number, number];
  rotation?: [number, number, number];
  spinSpeed?: number;
}

export function EnduranceSpacecraft({
  position = [68, 46, 12],
  scale = 1.0,
  rotation = [Math.PI / 6, 0, 0],
  spinSpeed = 0.35,
}: EnduranceSpacecraftProps) {
  const shipGroupRef = useRef<THREE.Group>(null!);
  const ringSpinRef = useRef<THREE.Group>(null!);

  // Spin rotation around central axis (artificial gravity spin)
  useFrame((_, delta) => {
    if (ringSpinRef.current) {
      ringSpinRef.current.rotation.z += delta * spinSpeed;
    }
  });

  const MODULE_COUNT = 12;
  const RING_RADIUS = 18;

  // Generate 12 module definitions and connecting ring segments
  const modulesData = useMemo(() => {
    const items = [];
    for (let i = 0; i < MODULE_COUNT; i++) {
      const angle = (i / MODULE_COUNT) * Math.PI * 2;
      const x = Math.cos(angle) * RING_RADIUS;
      const y = Math.sin(angle) * RING_RADIUS;

      // Module rotation to align tangentially along the ring
      const modRotZ = angle + Math.PI / 2;

      // Alternate module type (habitat pod vs engine/cargo pod)
      const isEnginePod = i % 3 === 0;

      items.push({
        angle,
        x,
        y,
        modRotZ,
        isEnginePod,
        id: i,
      });
    }
    return items;
  }, []);

  return (
    <group position={position} scale={scale} rotation={rotation} ref={shipGroupRef}>
      {/* Spinning Ring & Hub Structure */}
      <group ref={ringSpinRef}>
        
        {/* 1. CENTRAL HUB / DOCKING SPINDLE */}
        <group position={[0, 0, 0]}>
          {/* Main Central Cylindrical Hub */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[2.8, 2.8, 4.2, 24]} />
            <meshStandardMaterial
              color="#e2e8f0"
              metalness={0.75}
              roughness={0.25}
            />
          </mesh>

          {/* Core Hub Dark Metallic Band */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[2.85, 2.85, 1.4, 24]} />
            <meshStandardMaterial
              color="#1e293b"
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>

          {/* Front Docking Airlock Ring */}
          <mesh position={[0, 0, 2.2]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[2.0, 0.35, 16, 32]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.3} />
          </mesh>

          {/* Back Sensor Spindle Mast */}
          <mesh position={[0, 0, -2.6]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.5, 0.3, 2.5, 16]} />
            <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.2} />
          </mesh>

          {/* Hub Navigation Light */}
          <mesh position={[0, 0, 2.5]}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
        </group>

        {/* 2. DOCKED RANGER / LANDER SHUTTLES (Inside Central Spindle Area) */}
        {[0, Math.PI].map((landAngle, idx) => (
          <group
            key={`lander-${idx}`}
            position={[Math.cos(landAngle) * 4.2, Math.sin(landAngle) * 4.2, 0]}
            rotation={[0, 0, landAngle + Math.PI / 2]}
          >
            {/* Wedge-shaped Ranger craft body */}
            <mesh position={[0, 0, 0]}>
              <coneGeometry args={[1.5, 4.0, 4]} />
              <meshStandardMaterial
                color="#cbd5e1"
                metalness={0.6}
                roughness={0.3}
              />
            </mesh>
            {/* Cockpit Glass */}
            <mesh position={[0, 0.8, 0.6]} scale={[0.8, 1.2, 0.4]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.9} />
            </mesh>
          </group>
        ))}

        {/* 3. RADIAL STRUCTURAL SPOKES (Connecting Hub to Ring at 0°, 90°, 180°, 270°) */}
        {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((spokeAngle, idx) => (
          <group key={`spoke-${idx}`} rotation={[0, 0, spokeAngle]}>
            {/* Main Spoke Tube */}
            <mesh position={[RING_RADIUS / 2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.55, 0.55, RING_RADIUS - 4, 16]} />
              <meshStandardMaterial
                color="#cbd5e1"
                metalness={0.7}
                roughness={0.3}
              />
            </mesh>
            {/* Spoke Structural Truss Support Bars */}
            <mesh position={[RING_RADIUS / 2, 0.4, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.2, 0.2, RING_RADIUS - 4, 12]} />
              <meshStandardMaterial color="#475569" metalness={0.8} />
            </mesh>
            <mesh position={[RING_RADIUS / 2, -0.4, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.2, 0.2, RING_RADIUS - 4, 12]} />
              <meshStandardMaterial color="#475569" metalness={0.8} />
            </mesh>
          </group>
        ))}

        {/* 4. MAIN CIRCULAR INTERCONNECTING TUBE RING */}
        <mesh rotation={[0, 0, 0]}>
          <torusGeometry args={[RING_RADIUS, 0.65, 16, 64]} />
          <meshStandardMaterial
            color="#94a3b8"
            metalness={0.75}
            roughness={0.25}
          />
        </mesh>

        {/* 5. THE 12 HABITAT & CARGO POD MODULES */}
        {modulesData.map((mod) => (
          <group
            key={`mod-${mod.id}`}
            position={[mod.x, mod.y, 0]}
            rotation={[0, 0, mod.modRotZ]}
          >
            {/* Module Main Armor Box */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[2.8, 2.2, 3.8]} />
              <meshStandardMaterial
                color="#f8fafc"
                metalness={0.5}
                roughness={0.3}
              />
            </mesh>

            {/* Front Metallic Facet Plate */}
            <mesh position={[0, 0, 1.95]}>
              <boxGeometry args={[2.4, 1.8, 0.15]} />
              <meshStandardMaterial
                color="#334155"
                metalness={0.85}
                roughness={0.2}
              />
            </mesh>

            {/* Outer Radiator / Dark Panel Insert (Facing outwards along radius) */}
            <mesh position={[1.42, 0, 0]}>
              <boxGeometry args={[0.1, 1.6, 2.8]} />
              <meshStandardMaterial
                color="#0f172a"
                metalness={0.9}
                roughness={0.1}
              />
            </mesh>

            {/* Solar Array Grid Rows on Outer Surface */}
            <mesh position={[1.48, 0, 0]}>
              <boxGeometry args={[0.02, 1.4, 2.4]} />
              <meshBasicMaterial color="#38bdf8" transparent opacity={0.6} />
            </mesh>

            {/* Inner Ring Docking Collar */}
            <mesh position={[-1.42, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.7, 0.7, 0.2, 16]} />
              <meshStandardMaterial color="#64748b" metalness={0.8} />
            </mesh>

            {/* Module Window Strip (Habitat pods) */}
            {!mod.isEnginePod && (
              <mesh position={[0, 1.12, 0]}>
                <boxGeometry args={[2.0, 0.05, 2.2]} />
                <meshBasicMaterial color="#fbbf24" />
              </mesh>
            )}

            {/* RCS Thruster Nozzle & Engine Glow (Engine Pods) */}
            {mod.isEnginePod && (
              <group position={[0, 0, -2.1]}>
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.6, 0.8, 0.6, 16]} />
                  <meshStandardMaterial color="#1e293b" metalness={0.9} />
                </mesh>
                {/* Engine Thruster Glow Cone */}
                <mesh position={[0, 0, -0.6]} rotation={[-Math.PI / 2, 0, 0]}>
                  <coneGeometry args={[0.7, 1.2, 16]} />
                  <meshBasicMaterial
                    color="#60a5fa"
                    transparent
                    opacity={0.85}
                    blending={THREE.AdditiveBlending}
                  />
                </mesh>
                <pointLight color="#38bdf8" intensity={4} distance={12} />
              </group>
            )}
          </group>
        ))}

        {/* 6. CORONA REFLECTION / LIGHTING LIGHTS ON HULL */}
        <pointLight position={[0, 0, 10]} color="#ffffff" intensity={8} distance={80} />
        <pointLight position={[0, 0, -10]} color="#fbbf24" intensity={6} distance={60} />
      </group>
    </group>
  );
}

export default EnduranceSpacecraft;
