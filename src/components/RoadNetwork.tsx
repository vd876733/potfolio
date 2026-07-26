"use client";

import * as THREE from 'three';
import { Tube, Line } from '@react-three/drei';
import { useMemo } from 'react';

export interface RoadNetworkProps {
  isLight?: boolean;
}

// Export the path so Cars.tsx can animate along it
export const windingPath = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, -2, 22),       // Start at base edge
  new THREE.Vector3(15, -1, 15),      // Winding up base
  new THREE.Vector3(18, 0, 0),        // Base right
  new THREE.Vector3(10, 1.5, -15),    // Up to mid tier
  new THREE.Vector3(-10, 2, -10),     // Around mid tier (Knowledge Forge)
  new THREE.Vector3(-15, 3.5, 5),     // Winding up to peak
  new THREE.Vector3(0, 6.2, 8),       // Arriving at peak
  new THREE.Vector3(5, 6.2, 0),       // Peak circle
  new THREE.Vector3(0, 6.2, -5),      // Peak circle
  new THREE.Vector3(-5, 6.2, 0),      // Peak circle
  new THREE.Vector3(0, 6.2, 8),       // Close peak loop
], false, 'catmullrom', 0.5);

function StreetLamp({ position, isLight }: { position: [number, number, number], isLight: boolean }) {
  const poleColor = isLight ? "#64748b" : "#334155";
  const glowColor = "#fde047";

  return (
    <group position={position}>
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 3]} />
        <meshStandardMaterial color={poleColor} roughness={0.7} />
      </mesh>
      <mesh position={[0, 3, 0]}>
        <sphereGeometry args={[0.2]} />
        <meshStandardMaterial 
          color={isLight ? "#ffffff" : glowColor} 
          emissive={isLight ? "#000000" : glowColor} 
          emissiveIntensity={isLight ? 0 : 2} 
          toneMapped={false}
        />
      </mesh>
      {!isLight && (
        <pointLight position={[0, 2.8, 0]} color={glowColor} intensity={0.5} distance={10} />
      )}
    </group>
  );
}

export default function RoadNetwork({ isLight = false }: RoadNetworkProps) {
  const roadColor = isLight ? "#94a3b8" : "#2c3e50"; // Dark asphalt road

  // Create points for the yellow central line, elevated slightly above the tube
  const centerLinePoints = useMemo(() => {
    const pts = windingPath.getPoints(200);
    return pts.map(p => new THREE.Vector3(p.x, p.y + 1.22, p.z));
  }, []);

  return (
    <group position={[0, 0.1, 0]}>
      {/* Winding Road */}
      <Tube args={[windingPath, 100, 1.2, 8, false]} receiveShadow castShadow>
        <meshStandardMaterial color={roadColor} roughness={0.9} />
      </Tube>

      {/* Yellow Central Line */}
      <Line
        points={centerLinePoints}
        color="#eab308"
        lineWidth={2}
        dashed={true}
        dashScale={5}
        dashSize={1.5}
        dashOffset={0}
      />

      {/* Street Lamps along the path */}
      <StreetLamp position={[13, -1, 14]} isLight={isLight} />
      <StreetLamp position={[10, 1.5, -13]} isLight={isLight} />
      <StreetLamp position={[-8, 2, -8]} isLight={isLight} />
      <StreetLamp position={[-13, 3.5, 4]} isLight={isLight} />
      <StreetLamp position={[0, 6.2, 6]} isLight={isLight} />
      <StreetLamp position={[0, 6.2, -3]} isLight={isLight} />
    </group>
  );
}
