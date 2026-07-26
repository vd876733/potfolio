"use client";

import { Grid } from "@react-three/drei";

interface GroundProps {
  isLight?: boolean;
}

export default function Ground({ isLight = false }: GroundProps) {
  const cellColor = isLight ? "#cbd5e1" : "#2a2a2a";
  const sectionColor = isLight ? "#94a3b8" : "#3a3a3a";
  const planeColor = isLight ? "#e2e8f0" : "#1C1D21";

  return (
    <group>
      <Grid
        position={[0, 0, 0]}
        args={[100, 100]}
        cellSize={1}
        cellThickness={1}
        cellColor={cellColor}
        sectionSize={5}
        sectionThickness={1.5}
        sectionColor={sectionColor}
        fadeDistance={50}
        fadeStrength={1}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color={planeColor} roughness={0.8} metalness={0.2} />
      </mesh>
    </group>
  );
}
