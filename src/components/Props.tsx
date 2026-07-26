"use client";

import { useMemo, useRef } from "react";
import { Instances, Instance } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface PropsProps {
  isLight?: boolean;
}

export default function Props({ isLight = false }: PropsProps) {
  // Generate random positions for trees and rocks on the tiered island
  const trees = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 60; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 5 + Math.random() * 20;
      let y = 0;
      if (radius > 18) y = 0;
      else if (radius > 8) y = 4;
      else y = 8;
      
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const scale = 0.5 + Math.random() * 0.8;
      arr.push({ position: [x, y, z] as [number, number, number], scale });
    }
    return arr;
  }, []);

  const rocks = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 8 + Math.random() * 18;
      let y = 0;
      if (radius > 18) y = 0;
      else if (radius > 8) y = 4;
      
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const scale = 0.3 + Math.random() * 0.7;
      const rotation = [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI] as [number, number, number];
      arr.push({ position: [x, y, z] as [number, number, number], scale, rotation });
    }
    return arr;
  }, []);

  const treeColor = isLight ? "#22c55e" : "#064e3b";
  const trunkColor = "#78350f";
  const rockColor = isLight ? "#94a3b8" : "#334155";

  return (
    <group position={[0, -2, 0]}>
      {/* Trees */}
      <Instances limit={100} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.4, 2, 8]} />
        <meshStandardMaterial color={trunkColor} roughness={0.9} />
        {trees.map((props, i) => (
          <Instance key={`trunk-${i}`} position={[props.position[0], props.position[1] + 1, props.position[2]]} scale={props.scale} />
        ))}
      </Instances>
      <Instances limit={100} castShadow receiveShadow>
        <coneGeometry args={[1.2, 3, 8]} />
        <meshStandardMaterial color={treeColor} roughness={0.8} />
        {trees.map((props, i) => (
          <Instance key={`leaves-${i}`} position={[props.position[0], props.position[1] + 3, props.position[2]]} scale={props.scale} />
        ))}
      </Instances>

      {/* Rocks */}
      <Instances limit={100} castShadow receiveShadow>
        <dodecahedronGeometry args={[1]} />
        <meshStandardMaterial color={rockColor} roughness={0.9} />
        {rocks.map((props, i) => (
          <Instance key={`rock-${i}`} position={props.position} scale={props.scale} rotation={props.rotation} />
        ))}
      </Instances>

      {/* Boats */}
      <BobbingBoat position={[25, -2.5, 10]} />
      <BobbingBoat position={[-28, -2.5, -5]} scale={0.8} />
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
