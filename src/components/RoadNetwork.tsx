"use client";

import * as THREE from 'three';
import { Line } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export interface RoadNetworkProps {
  isLight?: boolean;
}

const PLATEAU_Y = 10.85;

// S-Curve Main Road (Roundabout down to South Beach)
const mainRoadCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, PLATEAU_Y, 12),
  new THREE.Vector3(-12, 8.1, 20),
  new THREE.Vector3(0, 6.3, 30),
  new THREE.Vector3(12, 3.2, 40),
  new THREE.Vector3(8, 0.2, 50),
], false, 'catmullrom', 0.5);

function FlatRoad({ curve, roadColor, steps = 100 }: { curve: THREE.CatmullRomCurve3, roadColor: string, steps?: number }) {
  const roadShape = useMemo(() => {
    const shape = new THREE.Shape();
    const width = 3; // 2-lane road
    shape.moveTo(-width, 0);
    shape.lineTo(width, 0);
    shape.lineTo(width, 0.05); // slight thickness
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
      />
    </mesh>
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
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.8, 2.5]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.0, -0.2]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.6, 1.2]} />
        <meshStandardMaterial color="#334155" roughness={0.3} />
      </mesh>
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
  const roadColor = "#333333"; // Dark asphalt
  const roundaboutRadiusInner = 8;
  const roundaboutRadiusOuter = 14;

  // Create points for the main road central line, elevated slightly to prevent z-fighting
  const mainRoadLines = useMemo(() => {
    return mainRoadCurve.getPoints(100).map(p => new THREE.Vector3(p.x, p.y + 0.08, p.z));
  }, []);

  return (
    <group>
      {/* --- Central Roundabout --- */}
      <group position={[0, PLATEAU_Y + 0.01, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <ringGeometry args={[roundaboutRadiusInner, roundaboutRadiusOuter, 64]} />
          <meshStandardMaterial color={roadColor} roughness={0.9} />
        </mesh>

        {/* White Dashed Center Line for Roundabout */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <ringGeometry args={[10.9, 11.1, 64]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
        </mesh>
      </group>

      {/* --- Main Highway S-Curve --- */}
      <FlatRoad curve={mainRoadCurve} roadColor={roadColor} steps={150} />

      {/* Yellow Double-Lines (Main Road) */}
      <Line
        points={mainRoadLines}
        color="#eab308"
        lineWidth={3}
        dashed={true}
        dashScale={10}
        dashSize={2}
        dashOffset={0}
      />

      {/* Traffic */}
      <MovingCar curve={mainRoadCurve} color="#eab308" offset={0} speed={0.03} />
      <MovingCar curve={mainRoadCurve} color="#3b82f6" offset={0.5} speed={0.04} />
      
      {/* Roundabout Traffic */}
      <MovingCarCircular radius={11.5} y={PLATEAU_Y + 0.05} color="#ef4444" offset={0} speed={0.5} />
    </group>
  );
}

function MovingCarCircular({ radius, y, color, offset, speed = 1 }: { radius: number; y: number; color: string; offset: number; speed?: number }) {
  const group = useRef<THREE.Group>(null);
  const progress = useRef(offset);

  useFrame((state, delta) => {
    if (!group.current) return;
    progress.current += speed * delta;
    const angle = progress.current;
    
    // Position
    group.current.position.x = Math.cos(angle) * radius;
    group.current.position.y = y;
    group.current.position.z = Math.sin(angle) * radius;
    
    // Rotation (tangent to circle). Angle is counter-clockwise, so tangent is angle + PI/2.
    // Wait, let's just make it drive forward!
    group.current.rotation.y = -angle;
  });

  return (
    <group ref={group}>
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[1.5, 0.6, 0.8]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      <mesh position={[-0.2, 0.8, 0]} castShadow>
        <boxGeometry args={[0.8, 0.5, 0.7]} />
        <meshStandardMaterial color="#334155" roughness={0.2} metalness={0.8} />
      </mesh>
    </group>
  );
}
