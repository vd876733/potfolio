"use client";

import { useMemo, useRef } from "react";
import { Instances, Instance } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Whale, PirateShip, WoodenDock } from "./Landmarks";

interface PropsProps {
  isLight?: boolean;
}

export default function Props({ isLight = false }: PropsProps) {
  // Generate random positions for pine trees (higher elevations)
  const pineTrees = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 5 + Math.random() * 12; // Inner radiuses
      const y = radius > 8 ? 4 : 8;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const scale = 0.5 + Math.random() * 0.5;
      arr.push({ position: [x, y, z] as [number, number, number], scale });
    }
    return arr;
  }, []);

  // Generate random positions for palm trees (lower elevations / beaches)
  const palmTrees = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 30; i++) {
      // Focus on south, east, and west beach edges
      const angle = (Math.random() * Math.PI) + Math.PI / 2; // mostly front side
      const radius = 18 + Math.random() * 6; // Outer beach radius
      const y = 0;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const scale = 0.6 + Math.random() * 0.6;
      arr.push({ position: [x, y, z] as [number, number, number], scale });
    }
    return arr;
  }, []);

  const inlandRocks = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 8 + Math.random() * 10;
      const y = 4;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const scale = 0.3 + Math.random() * 0.7;
      const rotation = [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI] as [number, number, number];
      arr.push({ position: [x, y, z] as [number, number, number], scale, rotation });
    }
    return arr;
  }, []);

  const oceanRocks = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 25; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 28 + Math.random() * 20; // Scattered far out in the ocean
      const y = -3; // Partially submerged
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const scale = 1 + Math.random() * 2;
      const rotation = [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI] as [number, number, number];
      arr.push({ position: [x, y, z] as [number, number, number], scale, rotation });
    }
    return arr;
  }, []);

  const pineColor = isLight ? "#166534" : "#14532d";
  const palmLeafColor = isLight ? "#4ade80" : "#16a34a";
  const trunkColor = "#78350f";
  const rockColor = isLight ? "#94a3b8" : "#334155";
  const oceanRockColor = isLight ? "#475569" : "#1e293b";

  return (
    <group position={[0, -2, 0]}>
      {/* Pine Trees */}
      <Instances limit={100} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.4, 2, 8]} />
        <meshStandardMaterial color={trunkColor} roughness={0.9} />
        {pineTrees.map((props, i) => (
          <Instance key={`pine-trunk-${i}`} position={[props.position[0], props.position[1] + 1, props.position[2]]} scale={props.scale} />
        ))}
      </Instances>
      <Instances limit={100} castShadow receiveShadow>
        <coneGeometry args={[1.2, 3, 8]} />
        <meshStandardMaterial color={pineColor} roughness={0.8} />
        {pineTrees.map((props, i) => (
          <Instance key={`pine-leaves-${i}`} position={[props.position[0], props.position[1] + 3, props.position[2]]} scale={props.scale} />
        ))}
      </Instances>

      {/* Palm Trees */}
      {palmTrees.map((props, i) => (
        <PalmTree key={`palm-${i}`} position={props.position} scale={props.scale} leafColor={palmLeafColor} />
      ))}

      {/* Inland Rocks */}
      <Instances limit={100} castShadow receiveShadow>
        <dodecahedronGeometry args={[1]} />
        <meshStandardMaterial color={rockColor} roughness={0.9} />
        {inlandRocks.map((props, i) => (
          <Instance key={`rock-${i}`} position={props.position} scale={props.scale} rotation={props.rotation} />
        ))}
      </Instances>

      {/* Ocean Rocks */}
      <Instances limit={100} castShadow receiveShadow>
        <dodecahedronGeometry args={[1.5]} />
        <meshStandardMaterial color={oceanRockColor} roughness={1.0} />
        {oceanRocks.map((props, i) => (
          <Instance key={`ocean-rock-${i}`} position={props.position} scale={props.scale} rotation={props.rotation} />
        ))}
      </Instances>

      {/* Beach Kits */}
      <BeachKit position={[5, 0.1, 20]} isLight={isLight} />
      <BeachKit position={[-8, 0.1, 19]} isLight={isLight} rotation={[0, -Math.PI / 6, 0]} />
      <BeachKit position={[12, 0.1, 16]} isLight={isLight} rotation={[0, Math.PI / 4, 0]} />

      {/* Tropical Island Additions */}
      <Whale position={[-30, -2, 30]} isLight={isLight} />
      <WoodenDock position={[32, -2, 0]} isLight={isLight} />
      <PirateShip position={[32, -2.5, 4]} isLight={isLight} />

      {/* Boats */}
      <BobbingBoat position={[25, -2.5, 12]} />
      <BobbingBoat position={[-28, -2.5, -5]} scale={0.8} />
    </group>
  );
}

function PalmTree({ position, scale = 1, leafColor }: { position: [number, number, number]; scale: number; leafColor: string }) {
  return (
    <group position={position} scale={scale}>
      {/* Curved Trunk */}
      <mesh position={[0, 1.5, 0]} rotation={[0, 0, 0.2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.15, 0.25, 3, 8]} />
        <meshStandardMaterial color="#78350f" roughness={0.9} />
      </mesh>
      {/* Fronds */}
      <group position={[0.3, 3, 0]}>
        {[0, 1, 2, 3, 4].map((i) => (
          <group key={i} rotation={[0, (Math.PI * 2 / 5) * i, -0.4]} position={[0, 0, 0]}>
            <mesh rotation={[0, 0, -Math.PI / 2]} castShadow>
              <coneGeometry args={[0.5, 2.5, 3]} />
              <meshStandardMaterial color={leafColor} roughness={0.7} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

function BeachKit({ position, isLight, rotation = [0, 0, 0] }: { position: [number, number, number]; isLight: boolean; rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Umbrella Pole */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 3]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      {/* Umbrella Top */}
      <mesh position={[0, 3, 0]} castShadow>
        <coneGeometry args={[2, 0.5, 12]} />
        <meshStandardMaterial color="#ef4444" roughness={0.9} />
      </mesh>
      <mesh position={[0, 3.01, 0]} castShadow>
        <coneGeometry args={[1.9, 0.51, 6]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>
      {/* Lounge Chair */}
      <group position={[1, 0.2, 0]} rotation={[0, -Math.PI / 4, 0]}>
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[1, 0.1, 0.5]} />
          <meshStandardMaterial color={isLight ? "#38bdf8" : "#0284c7"} />
        </mesh>
        <mesh position={[0.45, 0.3, 0]} rotation={[0, 0, 0.5]} castShadow>
          <boxGeometry args={[0.6, 0.1, 0.5]} />
          <meshStandardMaterial color={isLight ? "#38bdf8" : "#0284c7"} />
        </mesh>
      </group>
    </group>
  );
}

function BobbingBoat({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const boatRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (boatRef.current) {
      const t = state.clock.getElapsedTime();
      // Subtle rocking in water
      boatRef.current.position.y = position[1] + Math.sin(t * 1.5) * 0.08;
      boatRef.current.rotation.x = Math.sin(t * 1.2) * 0.05;
      boatRef.current.rotation.z = Math.cos(t * 1.0) * 0.04;
    }
  });

  return (
    <group ref={boatRef} position={position} scale={scale}>
      <mesh position={[0, -0.2, 0]} castShadow>
        <boxGeometry args={[1.5, 0.5, 3]} />
        <meshStandardMaterial color="#8b5a2b" roughness={0.8} />
      </mesh>
      <mesh position={[0, 1, 0.5]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 2]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      <mesh position={[0, 1, 0.5]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <planeGeometry args={[1.5, 1.8]} />
        <meshStandardMaterial color="#ffffff" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
