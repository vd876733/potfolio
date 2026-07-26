"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { windingPath } from "./RoadNetwork";

function Car({ offset, color, speed }: { offset: number; color: string; speed: number }) {
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const time = (clock.elapsedTime * speed + offset) % 1;
    const t = time < 0 ? 1 + time : time;
    
    // Position on curve
    const pos = windingPath.getPointAt(t);
    group.current.position.copy(pos);
    
    // Look ahead on the curve
    const tangent = windingPath.getTangentAt(t).normalize();
    const nextPos = pos.clone().add(tangent);
    group.current.lookAt(nextPos);
  });

  return (
    <group ref={group}>
      {/* Car Body (Chassis) */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[1, 0.3, 2]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.7} />
      </mesh>
      {/* Cabin */}
      <mesh position={[0, 0.65, -0.2]} castShadow>
        <boxGeometry args={[0.9, 0.3, 1]} />
        <meshStandardMaterial color="#111111" roughness={0.1} metalness={0.9} />
      </mesh>
      
      {/* Wheels */}
      {[-0.55, 0.55].map((x, i) => (
        [-0.7, 0.7].map((z, j) => (
          <mesh key={`${i}-${j}`} position={[x, 0.2, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.2, 0.2, 0.1, 16]} />
            <meshStandardMaterial color="#111" roughness={0.9} />
          </mesh>
        ))
      ))}
      
      {/* Headlights */}
      <mesh position={[0.3, 0.4, 1.01]}>
        <planeGeometry args={[0.2, 0.1]} />
        <meshBasicMaterial color="#ffffcc" />
      </mesh>
      <mesh position={[-0.3, 0.4, 1.01]}>
        <planeGeometry args={[0.2, 0.1]} />
        <meshBasicMaterial color="#ffffcc" />
      </mesh>
      
      {/* Taillights */}
      <mesh position={[0.3, 0.4, -1.01]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[0.2, 0.1]} />
        <meshBasicMaterial color="#ff3333" />
      </mesh>
      <mesh position={[-0.3, 0.4, -1.01]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[0.2, 0.1]} />
        <meshBasicMaterial color="#ff3333" />
      </mesh>
    </group>
  );
}

export default function Cars() {
  return (
    <group position={[0, 1.5, 0]}>
      {/* Cars tracing the winding road */}
      <Car offset={0} color="#ef4444" speed={0.05} />    {/* Red */}
      <Car offset={0.3} color="#facc15" speed={0.06} />  {/* Yellow */}
      <Car offset={0.7} color="#ffffff" speed={0.04} />  {/* White */}
    </group>
  );
}
