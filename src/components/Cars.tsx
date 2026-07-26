"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { windingPath } from "./RoadNetwork";

function Car({ offset, color, speed, type = "sedan" }: { offset: number; color: string; speed: number; type?: "sedan" | "taxi" | "convertible" | "hatchback" }) {
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

  const isHatchback = type === "hatchback";
  const isConvertible = type === "convertible";
  const isTaxi = type === "taxi";

  const chassisLength = isHatchback ? 1.6 : 2;
  const cabinLength = isHatchback ? 0.8 : 1;
  const cabinZ = isHatchback ? 0 : -0.2;

  return (
    <group ref={group}>
      {/* Car Body (Chassis) */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[1, 0.3, chassisLength]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.7} />
      </mesh>
      
      {/* Cabin */}
      {!isConvertible && (
        <mesh position={[0, 0.65, cabinZ]} castShadow>
          <boxGeometry args={[0.9, 0.3, cabinLength]} />
          <meshStandardMaterial color="#111111" roughness={0.1} metalness={0.9} />
        </mesh>
      )}

      {/* Taxi Sign */}
      {isTaxi && (
        <mesh position={[0, 0.85, cabinZ]} castShadow>
          <boxGeometry args={[0.4, 0.1, 0.2]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
        </mesh>
      )}
      
      {/* Wheels */}
      {[-0.55, 0.55].map((x, i) => (
        [-0.7, 0.7].map((z, j) => (
          <mesh key={`${i}-${j}`} position={[x, 0.2, z * (isHatchback ? 0.8 : 1)]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.2, 0.2, 0.1, 16]} />
            <meshStandardMaterial color="#111" roughness={0.9} />
          </mesh>
        ))
      ))}
      
      {/* Headlights */}
      <mesh position={[0.3, 0.4, chassisLength / 2 + 0.01]}>
        <planeGeometry args={[0.2, 0.1]} />
        <meshBasicMaterial color="#ffffcc" />
      </mesh>
      <mesh position={[-0.3, 0.4, chassisLength / 2 + 0.01]}>
        <planeGeometry args={[0.2, 0.1]} />
        <meshBasicMaterial color="#ffffcc" />
      </mesh>
      
      {/* Taillights */}
      <mesh position={[0.3, 0.4, -chassisLength / 2 - 0.01]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[0.2, 0.1]} />
        <meshBasicMaterial color="#ff3333" />
      </mesh>
      <mesh position={[-0.3, 0.4, -chassisLength / 2 - 0.01]} rotation={[0, Math.PI, 0]}>
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
      <Car offset={0} color="#facc15" speed={0.05} type="taxi" />       {/* Yellow Taxi */}
      <Car offset={0.25} color="#3b82f6" speed={0.06} type="sedan" />    {/* Blue Sedan */}
      <Car offset={0.5} color="#ef4444" speed={0.04} type="convertible" />{/* Red Convertible */}
      <Car offset={0.75} color="#a855f7" speed={0.055} type="hatchback" />{/* Purple Hatchback */}
    </group>
  );
}
