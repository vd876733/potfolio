"use client";

import { useMemo, useRef } from "react";
import { Instances, Instance } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { Whale, PirateShip, WoodenDock } from "./Landmarks";

function GLBModel({ path, position = [0, 0, 0], scale = 1, rotation = [0, 0, 0] }: any) {
  const { scene } = useGLTF(path);
  const clone = useMemo(() => scene.clone(), [scene]);
  
  useMemo(() => {
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [clone]);

  return <primitive object={clone} position={position} scale={scale} rotation={rotation} />;
}

interface PropsProps {
  isLight?: boolean;
}

export default function Props({ isLight = false }: PropsProps) {
  // Generate random positions for pine trees (higher elevations)
  const pineTrees = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = (5 + Math.random() * 12) * 2.2; // Inner radiuses
      const y = radius > 17.6 ? 7.2 : 14.4;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const scale = 0.5 + Math.random() * 0.5;
      arr.push({ position: [x, y, z] as [number, number, number], scale });
    }
    return arr;
  }, []);

  // Generate random positions for palm trees (lower elevations / beaches)
  const palmTrees = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 30; i++) {
      // Focus on south, east, and west beach edges
      const angle = (Math.random() * Math.PI) + Math.PI / 2; // mostly front side
      const radius = (18 + Math.random() * 6) * 2.2; // Outer beach radius
      const y = 0;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const scale = 0.6 + Math.random() * 0.6;
      arr.push({ position: [x, y, z] as [number, number, number], scale });
    }
    return arr;
  }, []);

  const inlandRocks = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = (8 + Math.random() * 10) * 2.2;
      const y = 7.2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const scale = 0.3 + Math.random() * 0.7;
      const rotation = [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI] as [number, number, number];
      arr.push({ position: [x, y, z] as [number, number, number], scale, rotation });
    }
    return arr;
  }, []);

  const oceanRocks = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 25; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = (28 + Math.random() * 20) * 2.2; // Scattered far out in the ocean
      const y = -5.4; // Partially submerged
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const scale = 1 + Math.random() * 2;
      const rotation = [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI] as [number, number, number];
      const type = Math.floor(Math.random() * 3); // 0, 1, 2 for diverse rock shapes
      arr.push({ position: [x, y, z] as [number, number, number], scale, rotation, type });
    }
    return arr;
  }, []);

  const pineColor = isLight ? "#166534" : "#14532d";
  const palmLeafColor = isLight ? "#4ade80" : "#16a34a";
  const trunkColor = "#78350f";
  const rockColor = isLight ? "#94a3b8" : "#334155";
  const oceanRockColor = isLight ? "#475569" : "#1e293b";

  return (
    <group position={[0, -3.6, 0]}>
      {/* Pine Trees */}
      <group>
        {pineTrees.map((props, i) => (
          <GLBModel key={`pine-${i}`} path="/models/tree.glb" position={props.position} scale={props.scale * 0.4} />
        ))}
      </group>

      {/* Palm Trees */}
      {palmTrees.map((props, i) => (
        <PalmTree key={`palm-${i}`} position={props.position} scale={props.scale} leafColor={palmLeafColor} />
      ))}

      {/* Inland Rocks */}
      <Instances limit={100} castShadow receiveShadow>
        <dodecahedronGeometry args={[1]} />
        <meshStandardMaterial color={rockColor} roughness={0.9} />
        {inlandRocks.map((props, i) => (
          <Instance key={`rock-${i}`} position={props.position} scale={props.scale} rotation={props.rotation} />
        ))}
      </Instances>

      {/* Diverse Ocean Rocks */}
      {oceanRocks.map((props, i) => (
        <mesh key={`ocean-rock-${i}`} position={props.position} scale={props.scale} rotation={props.rotation} castShadow receiveShadow>
          {props.type === 0 && <dodecahedronGeometry args={[1.5]} />}
          {props.type === 1 && <icosahedronGeometry args={[1.5, 0]} />}
          {props.type === 2 && <octahedronGeometry args={[1.5, 0]} />}
          <meshStandardMaterial color={oceanRockColor} roughness={1.0} />
        </mesh>
      ))}

      {/* Beach Kits (Moved) */}

      {/* West Cliff Rocks - Tall gray rock pillars hugging the steep west cliffside */}
      <group position={[-55, -2, 0]}>
        <Instances limit={20} castShadow receiveShadow>
          <cylinderGeometry args={[0.5, 1.5, 1, 6]} />
          <meshStandardMaterial color="#616161" roughness={0.9} />
          {Array.from({ length: 8 }).map((_, i) => {
            const x = Math.sin(i * 1.5) * 5 + Math.random() * 2;
            const z = Math.cos(i * 1.2) * 15 + Math.random() * 2;
            const scaleY = 15 + Math.random() * 10;
            const rotY = Math.random() * Math.PI;
            return <Instance key={`west-cliff-rock-${i}`} position={[x, scaleY / 2 - 2, z]} scale={[1 + Math.random(), scaleY, 1 + Math.random()]} rotation={[0, rotY, 0]} />;
          })}
        </Instances>
      </group>

      {/* Pointed Sea Rocks (Offshore Open Water) */}
      <group position={[0, 3.6, 0]}>
        <Instances limit={20} castShadow receiveShadow>
          <cylinderGeometry args={[0.2, 2.5, 12, 5]} />
          <meshStandardMaterial color={rockColor} roughness={0.95} />
          {Array.from({ length: 15 }).map((_, i) => {
            const angle = (Math.random() * Math.PI * 2);
            const radius = 60 + Math.random() * 30; // Far out in the water
            return (
              <Instance 
                key={`sea-rock-offshore-${i}`} 
                position={[Math.cos(angle) * radius, -2, Math.sin(angle) * radius]} 
                rotation={[(Math.random() - 0.5) * 0.4, Math.random() * Math.PI, (Math.random() - 0.5) * 0.4]} 
                scale={0.8 + Math.random() * 1.5} 
              />
            );
          })}
        </Instances>
      </group>

      {/* We shift Y by +3.6 to counteract the parent group's -3.6 offset and match absolute road coordinates */}
      <group position={[0, 3.6, 0]}>
        
        {/* Hero Props (Moved to normalized Y space) */}
        <Whale position={[-35, 0.5, 35]} isLight={isLight} />
        
        <WoodenDock position={[40, 0, 15]} isLight={isLight} />
        <PirateShip position={[42, -1, 20]} isLight={isLight} />
        
        {/* Beach & Resort (South Side) */}
        <BeachKit position={[12, 0.5, 46]} isLight={isLight} umbrellaColor="#ef4444" />
        <BeachKit position={[4, 0.5, 48]} isLight={isLight} umbrellaColor="#eab308" rotation={[0, -Math.PI / 6, 0]} />
        <BeachKit position={[20, 0.5, 38]} isLight={isLight} umbrellaColor="#ef4444" rotation={[0, Math.PI / 4, 0]} />
        
        {/* Beach Shacks */}
        <BeachShack position={[8, 0.5, 52]} rotation={[0, -0.2, 0]} />
        <BeachShack position={[22, 0.5, 42]} rotation={[0, 0.5, 0]} />

        {/* Boats */}
        <BobbingBoat position={[25, -0.5, 26]} />
        <BobbingBoat position={[-30, -0.5, -11]} scale={0.8} />

        {/* Town Center (Inside Roundabout) */}
        <Fountain position={[0, 10.85, 0]} />
        {townCenterHouses.map((h, i) => (
          <House key={`town-house-${i}`} position={h.position as [number, number, number]} rotation={h.rotation as [number, number, number]} roofColor={h.roofColor} />
        ))}

        {/* Hillside & Coastal Village */}
        {villageHouses.map((h, i) => (
          <House key={`village-house-${i}`} position={h.position as [number, number, number]} rotation={h.rotation as [number, number, number]} roofColor={h.roofColor} />
        ))}

        {/* Lighthouse Peak (Upper-Left West Cliff) */}
        <Lighthouse position={[-25, 14, -20]} />

        {/* Volcano Smoke */}
        <VolcanoSmoke position={[0, 16, -30]} />
      </group>
    </group>
  );
}
function PalmTree({ position, scale = 1, leafColor }: { position: [number, number, number]; scale: number; leafColor: string }) {
  return (
    <group position={position} scale={scale}>
      {/* Curved Trunk */}
      <mesh position={[0, 1.5, 0]} rotation={[0, 0, 0.2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.15, 0.25, 3, 8]} />
        <meshStandardMaterial color="#78350f" roughness={0.9} />
      </mesh>
      {/* Fronds */}
      <group position={[0.3, 3, 0]}>
        {[0, 1, 2, 3, 4].map((i) => (
          <group key={i} rotation={[0, (Math.PI * 2 / 5) * i, -0.4]} position={[0, 0, 0]}>
            <mesh rotation={[0, 0, -Math.PI / 2]} castShadow>
              <coneGeometry args={[0.5, 2.5, 3]} />
              <meshStandardMaterial color={leafColor} roughness={0.7} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

function BeachKit({ position, isLight, rotation = [0, 0, 0], umbrellaColor = "#ef4444" }: { position: [number, number, number]; isLight: boolean; rotation?: [number, number, number]; umbrellaColor?: string }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Umbrella Pole */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 3]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      {/* Umbrella Top */}
      <mesh position={[0, 3, 0]} castShadow>
        <coneGeometry args={[2, 0.5, 12]} />
        <meshStandardMaterial color={umbrellaColor} roughness={0.9} />
      </mesh>
      <mesh position={[0, 3.01, 0]} castShadow>
        <coneGeometry args={[1.9, 0.51, 6]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>
      {/* Lounge Chair */}
      <group position={[1, 0.2, 0]} rotation={[0, -Math.PI / 4, 0]}>
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[1, 0.1, 0.5]} />
          <meshStandardMaterial color={isLight ? "#38bdf8" : "#0284c7"} />
        </mesh>
        <mesh position={[0.45, 0.3, 0]} rotation={[0, 0, 0.5]} castShadow>
          <boxGeometry args={[0.6, 0.1, 0.5]} />
          <meshStandardMaterial color={isLight ? "#38bdf8" : "#0284c7"} />
        </mesh>
      </group>
    </group>
  );
}

function BeachShack({ position, rotation = [0, 0, 0] }: { position: [number, number, number], rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Base/Floor */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 0.5, 3]} />
        <meshStandardMaterial color="#d4a373" roughness={0.9} />
      </mesh>
      {/* Walls */}
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 2, 2.5]} />
        <meshStandardMaterial color="#fefae0" roughness={0.9} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 3, 0]} rotation={[0, Math.PI / 4, 0]} castShadow receiveShadow>
        <coneGeometry args={[2.6, 1.5, 4]} />
        <meshStandardMaterial color="#e9edc9" roughness={1.0} />
      </mesh>
      {/* Window */}
      <mesh position={[0, 1.5, 1.26]} castShadow>
        <boxGeometry args={[1.2, 0.8, 0.1]} />
        <meshStandardMaterial color="#0284c7" roughness={0.2} metalness={0.8} />
      </mesh>
    </group>
  );
}

function BobbingBoat({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const boatRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (boatRef.current) {
      const t = state.clock.getElapsedTime();
      // Subtle rocking in water
      boatRef.current.position.y = position[1] + Math.sin(t * 1.5) * 0.08;
      boatRef.current.rotation.x = Math.sin(t * 1.2) * 0.05;
      boatRef.current.rotation.z = Math.cos(t * 1.0) * 0.04;
    }
  });

  return (
    <group ref={boatRef} position={position} scale={scale}>
      <mesh position={[0, -0.2, 0]} castShadow>
        <boxGeometry args={[1.5, 0.5, 3]} />
        <meshStandardMaterial color="#8b5a2b" roughness={0.8} />
      </mesh>
      <mesh position={[0, 1, 0.5]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 2]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      <mesh position={[0, 1, 0.5]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <planeGeometry args={[1.5, 1.8]} />
        <meshStandardMaterial color="#ffffff" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// --- New Components ---

const townCenterHouses = [
  { position: [-3.5, 10.85, -3.5], rotation: [0, Math.PI / 4, 0], roofColor: "#ef4444" },
  { position: [3.5, 10.85, -3.5], rotation: [0, -Math.PI / 4, 0], roofColor: "#06b6d4" },
  { position: [-3.5, 10.85, 3.5], rotation: [0, 3 * Math.PI / 4, 0], roofColor: "#eab308" },
  { position: [3.5, 10.85, 3.5], rotation: [0, -3 * Math.PI / 4, 0], roofColor: "#d946ef" },
];

const villageHouses = [
  { position: [-9, 8.1, 14], rotation: [0, 0.5, 0], roofColor: "#ef4444" },
  { position: [-16, 8.1, 23], rotation: [0, -0.5, 0], roofColor: "#06b6d4" },
  { position: [-5, 6.3, 26], rotation: [0, 1, 0], roofColor: "#eab308" },
  { position: [6, 6.3, 33], rotation: [0, -1.2, 0], roofColor: "#d946ef" },
  { position: [17, 3.2, 35], rotation: [0, -0.8, 0], roofColor: "#ef4444" },
  { position: [6, 3.2, 42], rotation: [0, 0.4, 0], roofColor: "#06b6d4" },
  { position: [16, 0.2, 48], rotation: [0, -0.2, 0], roofColor: "#eab308" },
  { position: [2, 0.2, 46], rotation: [0, 0.6, 0], roofColor: "#d946ef" },
];

function House({ position, rotation = [0, 0, 0], roofColor, scale = 1 }: { position: [number, number, number], rotation?: [number, number, number], roofColor: string, scale?: number }) {
  return <GLBModel path="/models/house.glb" position={position} rotation={rotation} scale={scale * 0.25} />;
}

function Fountain({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Base Pool */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2, 2, 0.4, 16]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.7} />
      </mesh>
      {/* Water */}
      <mesh position={[0, 0.3, 0]} receiveShadow>
        <cylinderGeometry args={[1.8, 1.8, 0.4, 16]} />
        <meshStandardMaterial color="#38bdf8" roughness={0.1} transparent opacity={0.8} />
      </mesh>
      {/* Center Pillar */}
      <mesh position={[0, 1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.5, 2, 8]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
      </mesh>
      <mesh position={[0, 2, 0]} castShadow>
        <sphereGeometry args={[0.4, 8, 8]} />
        <meshStandardMaterial color="#38bdf8" />
      </mesh>
    </group>
  );
}

function Lighthouse({ position, rotation = [0, 0, 0] }: { position: [number, number, number], rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Base */}
      <mesh position={[0, 4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.5, 2.5, 8, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.2, 2.5, 2, 16]} />
        <meshStandardMaterial color="#ef4444" roughness={0.9} />
      </mesh>
      <mesh position={[0, 5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.7, 1.9, 2, 16]} />
        <meshStandardMaterial color="#ef4444" roughness={0.9} />
      </mesh>
      
      {/* Top Deck */}
      <mesh position={[0, 8.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2, 2, 0.4, 16]} />
        <meshStandardMaterial color="#334155" roughness={0.8} />
      </mesh>
      
      {/* Light Glass */}
      <mesh position={[0, 9.2, 0]} castShadow>
        <cylinderGeometry args={[1.2, 1.2, 1.6, 16]} />
        <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={2} transparent opacity={0.8} toneMapped={false} />
      </mesh>
      
      {/* Roof */}
      <mesh position={[0, 10.5, 0]} castShadow receiveShadow>
        <coneGeometry args={[1.8, 1, 16]} />
        <meshStandardMaterial color="#ef4444" roughness={0.7} />
      </mesh>
      
      {/* The Light Beams */}
      <pointLight position={[0, 9.2, 0]} intensity={4} color="#fef08a" distance={100} />
    </group>
  );
}

function VolcanoSmoke({ position }: { position: [number, number, number] }) {
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (group.current) {
      group.current.children.forEach((child, i) => {
        const t = clock.elapsedTime + i * 0.8;
        child.position.y = (t % 5) * 2;
        child.position.x = Math.sin(t * 1.5) * (child.position.y * 0.3);
        child.position.z = Math.cos(t * 1.2) * (child.position.y * 0.3);
        
        const scale = Math.max(0.2, 1.5 - (child.position.y / 10));
        child.scale.setScalar(scale);
        
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          (mesh.material as THREE.MeshStandardMaterial).opacity = Math.max(0, 0.6 * (1 - child.position.y / 10));
        }
      });
    }
  });

  return (
    <group ref={group} position={position}>
      {Array.from({ length: 15 }).map((_, i) => (
        <mesh key={`smoke-${i}`}>
          <sphereGeometry args={[1, 12, 12]} />
          <meshStandardMaterial color="#f5f5f5" transparent opacity={0.6} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}
