"use client";

import * as THREE from 'three';
import { Tube, Line } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export interface RoadNetworkProps {
  isLight?: boolean;
}

// The path for the road curve
const windingPath = new THREE.CatmullRomCurve3([
  // Roundabout (Peak)
  new THREE.Vector3(0, 11.16, 13.2),
  new THREE.Vector3(11, 11.16, 0),
  new THREE.Vector3(0, 11.16, -11),
  new THREE.Vector3(-11, 11.16, 0),
  
  // S-Curve descending
  new THREE.Vector3(-17.6, 8.1, 17.6),
  new THREE.Vector3(0, 6.3, 26.4),
  new THREE.Vector3(26.4, 4.5, 8.8),
  new THREE.Vector3(22, 2.7, -26.4),
  new THREE.Vector3(-26.4, 0.9, -26.4),
  
  // Perimeter Loop (Beach/Base)
  new THREE.Vector3(-48.4, -3.42, -11),
  new THREE.Vector3(-33, -3.42, 39.6),
  new THREE.Vector3(0, -3.42, 52.8),
  new THREE.Vector3(39.6, -3.42, 33),
  new THREE.Vector3(52.8, -3.42, 0),
  new THREE.Vector3(33, -3.42, -33),
  
  // Ascending back to roundabout
  new THREE.Vector3(11, 1.8, -33),
  new THREE.Vector3(0, 5.4, -22),
  new THREE.Vector3(-6.6, 8.1, -11),
], true, 'catmullrom', 0.5);

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

function MovingCar({ curve, color, offset, speed = 0.05 }: { curve: THREE.CatmullRomCurve3; color: string; offset: number; speed?: number }) {
  const group = useRef<THREE.Group>(null);
  const progress = useRef(offset);

  useFrame((state, delta) => {
    if (!group.current) return;
    progress.current += speed * delta;
    if (progress.current > 1) progress.current = 0;

    const position = curve.getPointAt(progress.current);
    const tangent = curve.getTangentAt(progress.current).normalize();

    group.current.position.copy(position);
    group.current.position.y += 2.64; // Sit on top of tube

    const lookAtPos = position.clone().add(tangent);
    lookAtPos.y += 2.64;
    group.current.lookAt(lookAtPos);
  });

  return (
    <group ref={group}>
      {/* Car Body */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.8, 2.5]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {/* Cabin */}
      <mesh position={[0, 1.0, -0.2]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.6, 1.2]} />
        <meshStandardMaterial color="#334155" roughness={0.3} />
      </mesh>
      {/* Headlights */}
      <mesh position={[0.5, 0.4, 1.26]}>
        <boxGeometry args={[0.3, 0.2, 0.05]} />
        <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={2} toneMapped={false} />
      </mesh>
      <mesh position={[-0.5, 0.4, 1.26]}>
        <boxGeometry args={[0.3, 0.2, 0.05]} />
        <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={2} toneMapped={false} />
      </mesh>
    </group>
  );
}

export default function RoadNetwork({ isLight = false }: RoadNetworkProps) {
  const roadColor = isLight ? "#2c3e50" : "#1e293b"; // Dark asphalt road

  // Create points for the yellow central line, elevated slightly above the tube
  const centerLinePoints = useMemo(() => {
    const pts = windingPath.getPoints(200);
    return pts.map(p => new THREE.Vector3(p.x, p.y + 2.66, p.z));
  }, []);

  return (
    <group position={[0, 0.1, 0]}>
      {/* Winding Road */}
      <Tube args={[windingPath, 100, 2.64, 8, false]} receiveShadow castShadow>
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
      <StreetLamp position={[28.6, -1.8, 30.8]} isLight={isLight} />
      <StreetLamp position={[22, 2.7, -28.6]} isLight={isLight} />
      <StreetLamp position={[-17.6, 3.6, -17.6]} isLight={isLight} />
      <StreetLamp position={[-28.6, 6.3, 8.8]} isLight={isLight} />
      <StreetLamp position={[0, 11.16, 13.2]} isLight={isLight} />
      <StreetLamp position={[0, 11.16, -6.6]} isLight={isLight} />
      
      {/* Traffic */}
      <MovingCar curve={windingPath} color="#eab308" offset={0} speed={0.03} />
      <MovingCar curve={windingPath} color="#3b82f6" offset={0.3} speed={0.04} />
      <MovingCar curve={windingPath} color="#ef4444" offset={0.7} speed={0.035} />
    </group>
  );
}
