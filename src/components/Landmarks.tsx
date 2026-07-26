"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface LandmarkProps {
  position: [number, number, number];
  isLight?: boolean;
}

export function Lighthouse({ position, isLight = false }: LandmarkProps) {
  const beaconRef = useRef<THREE.Group>(null);
  const lightColor = "#fef08a";

  useFrame(({ clock }) => {
    if (beaconRef.current) {
      beaconRef.current.rotation.y = clock.elapsedTime * 2;
    }
  });

  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.2, 1.5, 1, 16]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      {/* Tower */}
      <mesh position={[0, 3.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.8, 1.2, 5, 16]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      {/* Stripes (Red) */}
      <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.95, 1.1, 1, 16]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
      <mesh position={[0, 4.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.82, 0.95, 1, 16]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
      {/* Top Deck */}
      <mesh position={[0, 6, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.2, 0.8, 0.2, 16]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      {/* Glass Room */}
      <mesh position={[0, 6.5, 0]}>
        <cylinderGeometry args={[0.7, 0.7, 0.8, 8]} />
        <meshPhysicalMaterial color="#ffffff" transmission={0.9} opacity={1} transparent roughness={0.1} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 7.2, 0]} castShadow receiveShadow>
        <coneGeometry args={[1, 0.6, 16]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>

      {/* Rotating Beacon */}
      <group ref={beaconRef} position={[0, 6.5, 0]}>
        <mesh position={[0, 0, 0.4]}>
          <boxGeometry args={[0.4, 0.4, 0.2]} />
          <meshStandardMaterial color={lightColor} emissive={lightColor} emissiveIntensity={isLight ? 0.5 : 2} toneMapped={false} />
        </mesh>
        {!isLight && <spotLight position={[0, 0, 0.2]} angle={0.4} penumbra={0.2} intensity={100} distance={50} color={lightColor} castShadow />}
      </group>
    </group>
  );
}

export function Windmill({ position, isLight = false }: LandmarkProps) {
  const bladesRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (bladesRef.current) {
      bladesRef.current.rotation.z = -clock.elapsedTime * 1.5;
    }
  });

  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1, 1.5, 3, 8]} />
        <meshStandardMaterial color="#d6d3d1" roughness={0.9} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 3.5, 0]} castShadow receiveShadow>
        <coneGeometry args={[1.2, 1, 8]} />
        <meshStandardMaterial color="#78350f" roughness={0.8} />
      </mesh>
      {/* Rotor Hub */}
      <mesh position={[0, 2.5, 1]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.5, 8]} />
        <meshStandardMaterial color="#44403c" />
      </mesh>

      {/* Blades */}
      <group ref={bladesRef} position={[0, 2.5, 1.2]}>
        {[0, 1, 2, 3].map((i) => (
          <group key={i} rotation={[0, 0, (Math.PI / 2) * i]}>
            <mesh position={[0, 1.2, 0]} castShadow>
              <boxGeometry args={[0.3, 2, 0.05]} />
              <meshStandardMaterial color="#fcd34d" roughness={0.6} />
            </mesh>
            {/* Blade arm */}
            <mesh position={[0, 1, 0]} castShadow>
              <boxGeometry args={[0.05, 2, 0.1]} />
              <meshStandardMaterial color="#44403c" />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

export function DetailedHouse({ position, isLight = false, color = "#38bdf8" }: LandmarkProps & { color?: string }) {
  const glowColor = "#fef08a";
  return (
    <group position={position}>
      {/* Main Body */}
      <mesh position={[0, 1, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 2, 2.4]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 2.6, 0]} rotation={[0, Math.PI / 4, 0]} castShadow receiveShadow>
        <coneGeometry args={[2.2, 1.2, 4]} />
        <meshStandardMaterial color="#334155" roughness={0.8} />
      </mesh>
      {/* Chimney */}
      <mesh position={[0.6, 2.8, -0.6]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 1.5, 0.4]} />
        <meshStandardMaterial color="#7f1d1d" roughness={0.9} />
      </mesh>
      {/* Door */}
      <mesh position={[0, 0.6, 1.21]}>
        <boxGeometry args={[0.6, 1.2, 0.05]} />
        <meshStandardMaterial color="#451a03" />
      </mesh>
      {/* Windows */}
      {[-0.6, 0.6].map((x, i) => (
        <mesh key={i} position={[x, 1.2, 1.21]}>
          <boxGeometry args={[0.5, 0.5, 0.05]} />
          <meshStandardMaterial 
            color={isLight ? "#94a3b8" : glowColor} 
            emissive={isLight ? "#000000" : glowColor} 
            emissiveIntensity={isLight ? 0 : 1.5} 
            toneMapped={false} 
          />
        </mesh>
      ))}
    </group>
  );
}

export function Fountain({ position, isLight = false }: LandmarkProps) {
  const waterRef = useRef<THREE.Mesh>(null);
  const waterColor = isLight ? "#38bdf8" : "#0284c7";

  useFrame(({ clock }) => {
    if (waterRef.current) {
      waterRef.current.position.y = 1.1 + Math.sin(clock.elapsedTime * 4) * 0.05;
    }
  });

  return (
    <group position={position}>
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2, 2, 1, 16]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.6, 0]} receiveShadow>
        <cylinderGeometry args={[1.8, 1.8, 1, 16]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.9} />
      </mesh>
      <mesh ref={waterRef} position={[0, 1.1, 0]}>
        <cylinderGeometry args={[1.75, 1.75, 0.1, 16]} />
        <meshStandardMaterial color={waterColor} transparent opacity={0.8} />
      </mesh>
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.4, 0.6, 2, 8]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
      </mesh>
      <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.5, 8, 8]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.7} />
      </mesh>
    </group>
  );
}

export function TownHall({ position, isLight = false }: LandmarkProps) {
  const glowColor = "#fef08a";
  return (
    <group position={position}>
      <mesh position={[0, 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[6, 4, 4]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.9} />
      </mesh>
      <mesh position={[0, 5, 0]} rotation={[0, Math.PI / 4, 0]} castShadow receiveShadow>
        <coneGeometry args={[5, 2, 4]} />
        <meshStandardMaterial color="#334155" roughness={0.9} />
      </mesh>
      <mesh position={[0, 6, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 4, 2]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
      </mesh>
      <mesh position={[0, 8.5, 0]} rotation={[0, Math.PI / 4, 0]} castShadow receiveShadow>
        <coneGeometry args={[1.8, 1.5, 4]} />
        <meshStandardMaterial color="#334155" roughness={0.9} />
      </mesh>
      <mesh position={[0, 6.5, 1.01]}>
        <circleGeometry args={[0.6, 16]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      <mesh position={[0, 6.5, 1.02]}>
        <boxGeometry args={[0.05, 0.4, 0.01]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      {[-1.5, 1.5].map((x, i) => (
        <mesh key={`win-${i}`} position={[x, 2, 2.01]}>
          <boxGeometry args={[1, 1.5, 0.05]} />
          <meshStandardMaterial 
            color={isLight ? "#94a3b8" : glowColor} 
            emissive={isLight ? "#000000" : glowColor} 
            emissiveIntensity={isLight ? 0 : 1.5} 
            toneMapped={false} 
          />
        </mesh>
      ))}
    </group>
  );
}

export function StoneArena({ position, isLight = false }: LandmarkProps) {
  return (
    <group position={position}>
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[5, 5.5, 1, 24]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[4, 4.5, 1, 24]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.9} />
      </mesh>
      <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[3, 3.5, 1, 24]} />
        <meshStandardMaterial color="#64748b" roughness={0.9} />
      </mesh>
      <mesh position={[0, 2.51, 0]} receiveShadow>
        <cylinderGeometry args={[2.5, 2.5, 1, 24]} />
        <meshStandardMaterial color="#1e293b" roughness={0.9} />
      </mesh>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const angle = (i / 8) * Math.PI * 2;
        const x = Math.cos(angle) * 2.8;
        const z = Math.sin(angle) * 2.8;
        return (
          <mesh key={`pillar-${i}`} position={[x, 4, z]} castShadow receiveShadow>
            <cylinderGeometry args={[0.2, 0.2, 2, 8]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.8} />
          </mesh>
        );
      })}
    </group>
  );
}

export function HouseCluster({ position, isLight = false }: LandmarkProps) {
  return (
    <group position={position}>
      <DetailedHouse position={[-2, 0, 1]} isLight={isLight} color="#f472b6" />
      <DetailedHouse position={[2, 0, 0]} isLight={isLight} color="#38bdf8" />
      <DetailedHouse position={[0, 0, -2]} isLight={isLight} color="#facc15" />
    </group>
  );
}

export function Volcano({ position, isLight = false }: LandmarkProps) {
  const smokeRef = useRef<THREE.Group>(null);
  const particles = Array.from({ length: 20 });
  
  useFrame(({ clock }) => {
    if (smokeRef.current) {
      smokeRef.current.children.forEach((child, i) => {
        const meshChild = child as THREE.Mesh;
        const t = clock.elapsedTime + i * 0.5;
        meshChild.position.y = (t % 3) * 2;
        meshChild.position.x = Math.sin(t * 2) * 0.5 * (meshChild.position.y * 0.2);
        meshChild.position.z = Math.cos(t * 2.5) * 0.5 * (meshChild.position.y * 0.2);
        meshChild.scale.setScalar(Math.max(0.1, 1 - (meshChild.position.y / 6)));
        if (meshChild.material) {
          (meshChild.material as THREE.MeshStandardMaterial).opacity = Math.max(0, 1 - (meshChild.position.y / 6));
        }
      });
    }
  });

  return (
    <group position={position}>
      {/* Volcano Cone */}
      <mesh position={[0, 4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2, 8, 8, 32]} />
        <meshStandardMaterial color="#3f3f46" roughness={0.9} />
      </mesh>
      <mesh position={[0, 8.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.9, 16]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={2} toneMapped={false} />
      </mesh>
      {/* Smoke */}
      <group ref={smokeRef} position={[0, 8, 0]}>
        {particles.map((_, i) => (
          <mesh key={i}>
            <sphereGeometry args={[0.8, 8, 8]} />
            <meshStandardMaterial color={isLight ? "#94a3b8" : "#475569"} transparent opacity={0} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export function Whale({ position, isLight = false }: LandmarkProps) {
  const spoutRef = useRef<THREE.Group>(null);
  const whaleRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (spoutRef.current) {
      spoutRef.current.children.forEach((child, i) => {
        const t = clock.elapsedTime * 2 + i * 0.2;
        child.position.y = (t % 1) * 3;
        child.scale.setScalar(Math.max(0.1, 1 - child.position.y / 3));
      });
    }
    if (whaleRef.current) {
      whaleRef.current.position.y = Math.sin(clock.elapsedTime * 1.5) * 0.2;
    }
  });

  return (
    <group position={position}>
      <group ref={whaleRef}>
        {/* Whale Body */}
        <mesh position={[0, 1, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[1.5, 2, 6, 12]} />
          <meshStandardMaterial color="#0284c7" roughness={0.7} />
        </mesh>
        <mesh position={[4, 1, 0]} castShadow>
          <sphereGeometry args={[1.5, 12, 12]} />
          <meshStandardMaterial color="#0284c7" roughness={0.7} />
        </mesh>
        {/* Tail */}
        <mesh position={[-3, 1.5, 0]} rotation={[-Math.PI / 2, 0, -Math.PI / 6]} castShadow>
          <coneGeometry args={[1.5, 3, 4]} />
          <meshStandardMaterial color="#0284c7" roughness={0.7} />
        </mesh>
        {/* Spout */}
        <group ref={spoutRef} position={[3, 2, 0]}>
          {Array.from({ length: 10 }).map((_, i) => (
            <mesh key={i}>
              <sphereGeometry args={[0.3, 8, 8]} />
              <meshStandardMaterial color="#bae6fd" transparent opacity={0.6} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
}

export function PirateShip({ position, isLight = false }: LandmarkProps) {
  const shipRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (shipRef.current) {
      shipRef.current.rotation.z = Math.sin(clock.elapsedTime * 1.2) * 0.05;
      shipRef.current.rotation.x = Math.cos(clock.elapsedTime * 0.8) * 0.03;
    }
  });

  return (
    <group ref={shipRef} position={position}>
      {/* Hull */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <boxGeometry args={[4, 2, 8]} />
        <meshStandardMaterial color="#451a03" />
      </mesh>
      {/* Bow */}
      <mesh position={[0, 1.5, 5]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <coneGeometry args={[2, 4, 4]} />
        <meshStandardMaterial color="#451a03" />
      </mesh>
      {/* Mast */}
      <mesh position={[0, 5, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 8]} />
        <meshStandardMaterial color="#292524" />
      </mesh>
      {/* Sail */}
      <mesh position={[0, 5, 0.2]} castShadow>
        <planeGeometry args={[5, 5]} />
        <meshStandardMaterial color="#000000" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export function WoodenDock({ position, isLight = false }: LandmarkProps) {
  return (
    <group position={position}>
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[8, 0.2, 3]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
      {[-3, 3].map((x) => (
        [-1, 1].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 0.75, z]} castShadow>
            <cylinderGeometry args={[0.2, 0.2, 1.5]} />
            <meshStandardMaterial color="#451a03" />
          </mesh>
        ))
      ))}
    </group>
  );
}

export function TreasureChest({ position, isLight = false }: LandmarkProps) {
  const glowColor = "#facc15"; // Golden glow
  
  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 1, 1.5]} />
        <meshStandardMaterial color="#78350f" roughness={0.9} />
      </mesh>
      
      {/* Golden trim / lock */}
      <mesh position={[0, 0.5, 0.76]}>
        <boxGeometry args={[0.4, 0.4, 0.1]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Open Lid */}
      <mesh position={[0, 1.3, -0.6]} rotation={[-Math.PI / 4, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[1, 1, 2, 16, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color="#78350f" roughness={0.9} />
      </mesh>

      {/* Glowing Treasure Inside */}
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[1.8, 0.2, 1.3]} />
        <meshStandardMaterial 
          color={glowColor} 
          emissive={glowColor} 
          emissiveIntensity={2} 
          toneMapped={false} 
        />
      </mesh>
    </group>
  );
}

export function WoodenBarrel({ position, isLight = false }: LandmarkProps) {
  return (
    <group position={position}>
      <mesh position={[0, 1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.8, 0.8, 2, 12]} />
        <meshStandardMaterial color="#451a03" roughness={0.9} />
      </mesh>
      {/* Metal bands */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.82, 0.82, 0.1, 12]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.82, 0.82, 0.1, 12]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.4} />
      </mesh>
    </group>
  );
}
