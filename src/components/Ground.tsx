"use client";

import { Grid } from "@react-three/drei";

export default function Ground() {
  return (
    <group>
      <Grid
        position={[0, 0, 0]}
        args={[100, 100]}
        cellSize={1}
        cellThickness={1}
        cellColor="#2a2a2a"
        sectionSize={5}
        sectionThickness={1.5}
        sectionColor="#3a3a3a"
        fadeDistance={50}
        fadeStrength={1}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#1C1D21" roughness={0.8} metalness={0.2} />
      </mesh>
    </group>
  );
}
