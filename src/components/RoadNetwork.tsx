"use client";

import * as THREE from 'three';

interface RoadNetworkProps {
  isLight?: boolean;
}

export default function RoadNetwork({ isLight = false }: RoadNetworkProps) {
  const roadColor = isLight ? "#94a3b8" : "#1e293b";
  const markColor = isLight ? "#cbd5e1" : "#334155";

  return (
    <group position={[0, 0.02, 0]}>
      {/* Outer Ring Road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <torusGeometry args={[14.5, 1.2, 2, 64]} />
        <meshStandardMaterial color={roadColor} roughness={0.9} />
      </mesh>
      
      {/* Outer Ring Markings */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <torusGeometry args={[14.5, 0.05, 2, 64]} />
        <meshBasicMaterial color={markColor} />
      </mesh>

      {/* Cross Road 1 */}
      <mesh rotation={[-Math.PI / 2, 0, Math.PI / 4]} receiveShadow>
        <planeGeometry args={[2.4, 42]} />
        <meshStandardMaterial color={roadColor} roughness={0.9} />
      </mesh>
      
      {/* Cross Road 1 Markings */}
      <mesh rotation={[-Math.PI / 2, 0, Math.PI / 4]} position={[0, 0.01, 0]}>
        <planeGeometry args={[0.1, 42]} />
        <meshBasicMaterial color={markColor} />
      </mesh>

      {/* Cross Road 2 */}
      <mesh rotation={[-Math.PI / 2, 0, -Math.PI / 4]} receiveShadow>
        <planeGeometry args={[2.4, 42]} />
        <meshStandardMaterial color={roadColor} roughness={0.9} />
      </mesh>
      
      {/* Cross Road 2 Markings */}
      <mesh rotation={[-Math.PI / 2, 0, -Math.PI / 4]} position={[0, 0.01, 0]}>
        <planeGeometry args={[0.1, 42]} />
        <meshBasicMaterial color={markColor} />
      </mesh>

      {/* Center Circle Hub */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <cylinderGeometry args={[2.5, 2.5, 0.01, 32]} />
        <meshStandardMaterial color={roadColor} roughness={0.9} />
      </mesh>
    </group>
  );
}
