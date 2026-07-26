"use client";

import * as THREE from 'three';
import { Line } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export interface RoadNetworkProps {
  isLight?: boolean;
}

// 1. Roundabout (upper central plateau)
const roundaboutCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 10.85, 8),
  new THREE.Vector3(8, 10.85, 0),
  new THREE.Vector3(0, 10.85, -8),
  new THREE.Vector3(-8, 10.85, 0),
], true, 'catmullrom', 0.5);

// 2. S-Curve Main Road (Roundabout down to South Beach)
const mainRoadCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 10.85, 8),
  new THREE.Vector3(-12, 8.1, 18),
  new THREE.Vector3(0, 6.3, 28),
  new THREE.Vector3(12, 3.2, 38),
  new THREE.Vector3(10, 0.2, 48),
], false, 'catmullrom', 0.5);

// 3. Side Loop (Fork to west rock ruins)
const sideRoadCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-12, 8.1, 18),
  new THREE.Vector3(-22, 5.5, 14),
  new THREE.Vector3(-28, 3.6, 9),
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
    group.current.position.y += 0.4; // Sit on top of the flat road

    const lookAtPos = position.clone().add(tangent);
    lookAtPos.y += 0.4;
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

function FlatRoad({ curve, roadColor, steps = 100 }: { curve: THREE.CatmullRomCurve3, roadColor: string, steps?: number }) {
  const roadShape = useMemo(() => {
    const shape = new THREE.Shape();
    const width = 2.5; // Total road width 5
    shape.moveTo(-width, 0);
    shape.lineTo(width, 0);
    shape.lineTo(width, 0.05);
    shape.lineTo(-width, 0.05);
    shape.lineTo(-width, 0);
    return shape;
  }, []);

  const extrudeSettings = useMemo(() => ({
    steps: steps,
    extrudePath: curve,
    bevelEnabled: false,
  }), [curve, steps]);

  return (
    <mesh receiveShadow castShadow>
      <extrudeGeometry args={[roadShape, extrudeSettings]} />
      <meshStandardMaterial 
        color={roadColor} 
        roughness={0.9} 
        polygonOffset 
        polygonOffsetFactor={-1}
        polygonOffsetUnits={-1}
      />
    </mesh>
  );
}

export default function RoadNetwork({ isLight = false }: RoadNetworkProps) {
  const roadColor = "#2c3e50"; // Dark asphalt road

  // Create points for the yellow central line
  const getElevatedPoints = (curve: THREE.CatmullRomCurve3, points: number) => {
    return curve.getPoints(points).map(p => new THREE.Vector3(p.x, p.y + 0.15, p.z));
  };

  const roundaboutLines = useMemo(() => getElevatedPoints(roundaboutCurve, 100), []);
  const mainRoadLines = useMemo(() => getElevatedPoints(mainRoadCurve, 100), []);
  const sideRoadLines = useMemo(() => getElevatedPoints(sideRoadCurve, 50), []);

  return (
    <group position={[0, 0.1, 0]}>
      {/* Asphalt Roads */}
      <FlatRoad curve={roundaboutCurve} roadColor={roadColor} steps={100} />
      <FlatRoad curve={mainRoadCurve} roadColor={roadColor} steps={100} />
      <FlatRoad curve={sideRoadCurve} roadColor={roadColor} steps={50} />

      {/* Yellow Central Lines */}
      {[roundaboutLines, mainRoadLines, sideRoadLines].map((pts, i) => (
        <Line
          key={i}
          points={pts}
          color="#eab308"
          lineWidth={2}
          dashed={true}
          dashScale={5}
          dashSize={1.5}
          dashOffset={0}
          polygonOffset
          polygonOffsetFactor={-2}
          polygonOffsetUnits={-2}
        />
      ))}

      {/* Street Lamps along the path */}
      <StreetLamp position={[10, 0.2, 45]} isLight={isLight} />
      <StreetLamp position={[-12, 8.1, 15]} isLight={isLight} />
      <StreetLamp position={[0, 6.3, 28]} isLight={isLight} />
      <StreetLamp position={[-25, 4.5, 12]} isLight={isLight} />
      <StreetLamp position={[0, 10.85, 11]} isLight={isLight} />
      <StreetLamp position={[0, 10.85, -11]} isLight={isLight} />
      
      {/* Traffic */}
      <MovingCar curve={mainRoadCurve} color="#eab308" offset={0} speed={0.03} />
      <MovingCar curve={mainRoadCurve} color="#3b82f6" offset={0.5} speed={0.04} />
      <MovingCar curve={roundaboutCurve} color="#ef4444" offset={0.2} speed={0.035} />
      <MovingCar curve={sideRoadCurve} color="#10b981" offset={0.1} speed={0.04} />
    </group>
  );
}
