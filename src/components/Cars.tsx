"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Car({ offset, color, speed, radius, yOffset }: { offset: number; color: string; speed: number; radius: number, yOffset: number }) {
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const time = clock.elapsedTime * speed + offset;
    
    // Position on circle
    const x = Math.cos(time) * radius;
    const z = Math.sin(time) * radius;
    group.current.position.set(x, yOffset, z);
    
    // Look ahead on the circle
    const nextT = time + (speed > 0 ? 0.05 : -0.05);
    const nextX = Math.cos(nextT) * radius;
    const nextZ = Math.sin(nextT) * radius;
    group.current.lookAt(nextX, yOffset, nextZ);
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
  const radius = 14.5;
  return (
    <group>
      {/* Inner Lane (Counter-Clockwise, speed > 0) */}
      <Car offset={0} color="#F43F5E" speed={0.4} radius={radius - 0.4} yOffset={0.02} />
      <Car offset={2.1} color="#38BDF8" speed={0.4} radius={radius - 0.4} yOffset={0.02} />
      <Car offset={4.2} color="#10B981" speed={0.4} radius={radius - 0.4} yOffset={0.02} />
      
      {/* Outer Lane (Clockwise, speed < 0) */}
      <Car offset={1.0} color="#F59E0B" speed={-0.35} radius={radius + 0.4} yOffset={0.02} />
      <Car offset={3.5} color="#A855F7" speed={-0.35} radius={radius + 0.4} yOffset={0.02} />
    </group>
  );
}
