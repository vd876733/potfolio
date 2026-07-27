"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export function GLBModel({ path, position = [0, 0, 0], scale = 1, rotation = [0, 0, 0] }: any) {
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

interface LandmarkProps {
  position: [number, number, number];
  isLight?: boolean;
}

export function Lighthouse({ position, isLight = false }: LandmarkProps) {
  return (
    <group position={position}>
      <GLBModel path="/models/Lighthouse scene by Poly by Google - 1O6BWfUB6ta.glb" scale={0.015} position={[0, -2, 0]} />
    </group>
  );
}

export function Windmill({ position, isLight = false }: LandmarkProps) {
  return (
    <group position={position}>
      <GLBModel path="/models/Castle by Quaternius - y15yE6kWLY.glb" scale={0.8} />
    </group>
  );
}

export function DetailedHouse({ position, isLight = false, color = "#38bdf8" }: LandmarkProps & { color?: string }) {
  return (
    <group position={position}>
      <GLBModel path="/models/Fantasy House by Quaternius - BH2XHWUNmF.glb" scale={1.5} />
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
      <mesh ref={waterRef} position={[0, 1.1, 0]}>
        <cylinderGeometry args={[1.75, 1.75, 0.1, 16]} />
        <meshStandardMaterial color={waterColor} transparent opacity={0.8} />
      </mesh>
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.4, 0.6, 2, 8]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
      </mesh>
    </group>
  );
}

export function TownHall({ position, isLight = false }: LandmarkProps) {
  return (
    <group position={position}>
      <GLBModel path="/models/Fantasy Inn by Quaternius - x3ZcGn3jr4.glb" scale={1.5} />
    </group>
  );
}

export function StoneArena({ position, isLight = false }: LandmarkProps) {
  return (
    <group position={position}>
      <GLBModel path="/models/Barracks by Quaternius - a1C1L8gJTX.glb" scale={1.2} />
    </group>
  );
}

export function StrawHut({ position, isLight = false }: LandmarkProps) {
  return (
    <group position={position}>
      <GLBModel path="/models/House by Quaternius - vZ1CLbWmSx.glb" scale={0.5} />
    </group>
  );
}

export function HouseCluster({ position, isLight = false }: LandmarkProps) {
  return (
    <group position={position}>
      <DetailedHouse position={[-3, 0, 1]} isLight={isLight} />
      <DetailedHouse position={[3, 0, 0]} isLight={isLight} />
      <StrawHut position={[-3, 0, -3]} isLight={isLight} />
      <StrawHut position={[3, 0, 3]} isLight={isLight} />
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
      <GLBModel path="/models/Mountain by Quaternius - XY4ej3Zg3I.glb" position={[0, -8, 0]} scale={2.5} />
      
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
  const whaleRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (whaleRef.current) {
      whaleRef.current.position.y = Math.sin(clock.elapsedTime * 1.5) * 0.2;
    }
  });

  return (
    <group position={position}>
      <group ref={whaleRef}>
        <mesh position={[0, 1, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[1.5, 2, 6, 12]} />
          <meshStandardMaterial color="#0284c7" roughness={0.7} />
        </mesh>
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
      <GLBModel path="/models/Ship by Quaternius - mEQj2wZ3GC.glb" position={[0, -0.5, 0]} scale={0.15} />
    </group>
  );
}

export function WoodenDock({ position, isLight = false }: LandmarkProps) {
  return (
    <group position={position}>
      <GLBModel path="/models/Dock Wide by Quaternius - XndOrGa7rN.glb" scale={1.5} rotation={[0, Math.PI / 2, 0]} />
    </group>
  );
}

export function TreasureChest({ position, isLight = false }: LandmarkProps) {
  return (
    <group position={position}>
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 1, 1]} />
        <meshStandardMaterial color="#8b5a2b" roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.25, 0]} rotation={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.5, 1.5, 16, 1, false, 0, Math.PI]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#a0522d" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.8, 0.51]}>
        <boxGeometry args={[0.2, 0.4, 0.1]} />
        <meshStandardMaterial color="#ffd700" />
      </mesh>
    </group>
  );
}

export function WoodenBarrel({ position, isLight = false }: LandmarkProps) {
  return (
    <group position={position}>
      <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.4, 1.2, 16]} />
        <meshStandardMaterial color="#a0522d" roughness={0.9} />
      </mesh>
      {[-0.4, 0.4].map((y, i) => (
        <mesh key={i} position={[0, 0.6 + y, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.51, 0.51, 0.1, 16]} />
          <meshStandardMaterial color="#000000" roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

export function Airplane({ position, isLight = false }: LandmarkProps) {
  const airplaneRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (airplaneRef.current) {
      airplaneRef.current.position.y = Math.sin(clock.elapsedTime * 2) * 0.5;
      airplaneRef.current.rotation.x = Math.sin(clock.elapsedTime) * 0.05;
      airplaneRef.current.rotation.z = Math.cos(clock.elapsedTime * 1.5) * 0.1;
    }
  });

  return (
    <group ref={airplaneRef} position={position}>
      <GLBModel path="/models/Airplane by Poly by Google - 8VysVKMXN2J.glb" scale={0.05} rotation={[0, -Math.PI / 2, 0]} />
    </group>
  );
}

export function Airship({ position, isLight = false }: LandmarkProps) {
  const airshipRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (airshipRef.current) {
      airshipRef.current.position.y = Math.sin(clock.elapsedTime * 0.8) * 1;
      airshipRef.current.rotation.y = clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={airshipRef} position={position}>
      <GLBModel path="/models/Airship by Poly by Google - cr7RPZ4RfGM.glb" scale={0.08} />
    </group>
  );
}

export function FantasyStable({ position, isLight = false }: LandmarkProps) {
  return (
    <group position={position}>
      <GLBModel path="/models/Fantasy Stable by Quaternius - qhNQSOGGbi.glb" scale={1.2} />
    </group>
  );
}

export function OldBridge({ position, isLight = false }: LandmarkProps) {
  return (
    <group position={position}>
      <GLBModel path="/models/Old Bridge by Lintufriikki - c6XnoUTQRsy.glb" scale={0.5} />
    </group>
  );
}

export function BeachUmbrella({ position, isLight = false }: LandmarkProps) {
  return (
    <group position={position}>
      <GLBModel path="/models/beach_umbrella.glb" scale={1.5} />
    </group>
  );
}

export function GrassPatch({ position, isLight = false }: LandmarkProps) {
  return (
    <group position={position}>
      <GLBModel path="/models/Grass by Quaternius - vUJjrRsFp4.glb" scale={2} />
    </group>
  );
}
