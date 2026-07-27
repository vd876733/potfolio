"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Float, Html } from "@react-three/drei";
import * as THREE from "three";

// Safe GLTF Loader helper
function SpaceModel({
  path,
  position = [0, 0, 0],
  scale = 1,
  rotation = [0, 0, 0],
}: {
  path: string;
  position?: [number, number, number];
  scale?: number | [number, number, number];
  rotation?: [number, number, number];
}) {
  const gltf = useGLTF(path);
  const sceneObj = Array.isArray(gltf) ? gltf[0].scene : gltf.scene;
  const clone = useMemo(() => sceneObj.clone(), [sceneObj]);

  return (
    <primitive
      object={clone}
      position={position}
      scale={scale}
      rotation={rotation}
    />
  );
}

// 1. Central Solar System Component
export function SolarSystem(props: any) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group ref={groupRef} {...props}>
      <SpaceModel
        path="/space/Solar System by Jarlan Perez - 8hnnpNiQMmy.glb"
        scale={2.5}
      />
    </group>
  );
}

// 2. International Space Station (ISS)
export function ISSStation(props: any) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.08;
      groupRef.current.rotation.z += delta * 0.02;
    }
  });

  return (
    <group ref={groupRef} {...props}>
      <SpaceModel
        path="/space/International Space Station by Poly by Google - d3Fq5H6ne8E.glb"
        scale={0.015}
      />
    </group>
  );
}

// 3. Floating Astronaut
export function Spacewalker(props: any) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
      groupRef.current.position.y += Math.sin(state.clock.elapsedTime * 1.5) * 0.01;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group ref={groupRef} {...props}>
        <SpaceModel
          path="/space/Astronaut by Poly by Google - dLHpzNdygsg.glb"
          scale={1.8}
        />
      </group>
    </Float>
  );
}

// 4. Spaceships
export function Spaceships() {
  const ship1Ref = useRef<THREE.Group>(null!);
  const ship2Ref = useRef<THREE.Group>(null!);

  useFrame((state, delta) => {
    if (ship1Ref.current) {
      ship1Ref.current.rotation.y += delta * 0.3;
      ship1Ref.current.position.x = 22 + Math.cos(state.clock.elapsedTime * 0.5) * 3;
      ship1Ref.current.position.z = 18 + Math.sin(state.clock.elapsedTime * 0.5) * 3;
    }
    if (ship2Ref.current) {
      ship2Ref.current.rotation.y -= delta * 0.2;
      ship2Ref.current.position.y = 10 + Math.sin(state.clock.elapsedTime * 0.8) * 2;
    }
  });

  return (
    <group>
      <group ref={ship1Ref} position={[22, -4, 18]}>
        <SpaceModel
          path="/space/Spaceship by Quaternius - VSxUAFhzbA.glb"
          scale={1.2}
          rotation={[0.2, Math.PI / 4, 0]}
        />
      </group>

      <group ref={ship2Ref} position={[-20, 10, -18]}>
        <SpaceModel
          path="/space/Spaceship by Quaternius - uCeLfsdmNP.glb"
          scale={1.5}
          rotation={[-0.1, -Math.PI / 3, 0.2]}
        />
      </group>
    </group>
  );
}

// 5. Interactive Space Outpost Teleporters (Section Pavilions)
interface SpaceWaypointProps {
  position: [number, number, number];
  label: string;
  color: string;
  onClick: (label: string, position?: [number, number, number]) => void;
  children?: React.ReactNode;
}

export function SpaceWaypoint({
  position,
  label,
  color,
  onClick,
  children,
}: SpaceWaypointProps) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25;
    }
  });

  return (
    <group position={position}>
      {/* Teleporter Base Platform */}
      <group ref={groupRef} onClick={(e) => { e.stopPropagation(); onClick(label, position); }}>
        <SpaceModel
          path="/space/Turret Teleporter by Quaternius - aNhGga1jGX.glb"
          scale={2.2}
        />
      </group>

      {/* Children Model (if any) */}
      <group position={[0, 1.5, 0]}>
        {children}
      </group>

      {/* Glowing Orbit Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.2, 0]}>
        <ringGeometry args={[2.8, 3.1, 32]} />
        <meshBasicMaterial color={color} side={THREE.DoubleSide} transparent opacity={0.6} />
      </mesh>

      {/* HTML Floating Space Tag */}
      <Html
        position={[0, 4.5, 0]}
        center
        distanceFactor={40}
        zIndexRange={[100, 0]}
      >
        <button
          onClick={() => onClick(label, position)}
          className="group relative px-4 py-2 rounded-full border border-cyan-400/40 bg-slate-900/90 hover:bg-cyan-950/90 text-cyan-300 text-xs font-mono font-bold tracking-wider shadow-lg backdrop-blur-md transition-all hover:scale-110 active:scale-95 flex items-center gap-2 whitespace-nowrap cursor-pointer"
          style={{ boxShadow: `0 0 15px ${color}66` }}
        >
          <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: color }} />
          <span>{label}</span>
        </button>
      </Html>
    </group>
  );
}

// Preload Space Models
useGLTF.preload("/space/Solar System by Jarlan Perez - 8hnnpNiQMmy.glb");
useGLTF.preload("/space/Astronaut by Poly by Google - dLHpzNdygsg.glb");
useGLTF.preload("/space/International Space Station by Poly by Google - d3Fq5H6ne8E.glb");
useGLTF.preload("/space/Spaceship by Quaternius - VSxUAFhzbA.glb");
useGLTF.preload("/space/Spaceship by Quaternius - uCeLfsdmNP.glb");
useGLTF.preload("/space/Turret Teleporter by Quaternius - aNhGga1jGX.glb");
