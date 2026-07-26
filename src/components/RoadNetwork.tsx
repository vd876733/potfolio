"use client";

import * as THREE from 'three';

interface RoadNetworkProps {
  isLight?: boolean;
}

function StreetLamp({ position, isLight }: { position: [number, number, number], isLight: boolean }) {
  const poleColor = isLight ? "#64748b" : "#334155";
  const glowColor = "#fde047";

  return (
    <group position={position}>
      {/* Pole */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 3]} />
        <meshStandardMaterial color={poleColor} roughness={0.7} />
      </mesh>
      {/* Bulb */}
      <mesh position={[0, 3, 0]}>
        <sphereGeometry args={[0.2]} />
        <meshStandardMaterial 
          color={isLight ? "#ffffff" : glowColor} 
          emissive={isLight ? "#000000" : glowColor} 
          emissiveIntensity={isLight ? 0 : 2} 
          toneMapped={false}
        />
      </mesh>
      {/* Light Source */}
      {!isLight && (
        <pointLight position={[0, 2.8, 0]} color={glowColor} intensity={0.5} distance={10} />
      )}
    </group>
  );
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

      {/* Street Lamps */}
      <StreetLamp position={[-6, 0, 6]} isLight={isLight} />
      <StreetLamp position={[6, 0, 6]} isLight={isLight} />
      <StreetLamp position={[-6, 0, -6]} isLight={isLight} />
      <StreetLamp position={[6, 0, -6]} isLight={isLight} />
      <StreetLamp position={[-12, 0, 0]} isLight={isLight} />
      <StreetLamp position={[12, 0, 0]} isLight={isLight} />
      <StreetLamp position={[0, 0, 12]} isLight={isLight} />
      <StreetLamp position={[0, 0, -12]} isLight={isLight} />
    </group>
  );
}
