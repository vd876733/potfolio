"use client";

import { useMemo } from "react";
import { useGLTF, Instances, Instance } from "@react-three/drei";
import * as THREE from "three";
import { Whale, PirateShip, WoodenDock, Airplane, Airship, FantasyStable, OldBridge, BeachUmbrella, GrassPatch, Lighthouse, TreasureChest, WoodenBarrel } from "./Landmarks";

function GLBModel({ path, position = [0, 0, 0], scale = 1, rotation = [0, 0, 0] }: { path: string; position?: any; scale?: any; rotation?: any }) {
  const gltf = useGLTF(path);
  const scene = Array.isArray(gltf) ? gltf[0].scene : gltf.scene;
  const clone = useMemo(() => scene.clone(), [scene]);
  
  useMemo(() => {
    clone.traverse((child: THREE.Object3D) => {
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
    for (let i = 0; i < 15; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = (25 + Math.random() * 15) * 2.2;
      const y = -1;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const scale = 1.5 + Math.random() * 2;
      const rotation = [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI] as [number, number, number];
      const type = Math.floor(Math.random() * 3); // 0, 1, 2 for diverse rock shapes
      arr.push({ position: [x, y, z] as [number, number, number], scale, rotation, type });
    }
    return arr;
  }, []);

  const grassPatches = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = (4 + Math.random() * 15) * 2.2;
      const y = radius > 17.6 ? 7.2 : 14.4;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      arr.push({ position: [x, y, z] as [number, number, number] });
    }
    return arr;
  }, []);


  return (
    <group position={[0, 0, 0]}>
      {/* Pine Trees on upper hills */}
      <group>
        {pineTrees.map((props, i) => (
          <GLBModel key={`pine-${i}`} path="/models/Pine by Quaternius - Zt62gceKXZ.glb" position={props.position} scale={props.scale * 0.5} />
        ))}
      </group>

      {/* Palm Trees along beaches */}
      <group>
        {palmTrees.map((props, i) => (
          <GLBModel key={`palm-${i}`} path="/models/Big Tree by 3Donimus - dNWh762PN-6.glb" position={props.position} scale={props.scale * 0.5} />
        ))}
      </group>

      {/* Inland Rocks */}
      <group>
        {inlandRocks.map((props, i) => (
          <GLBModel key={`irock-${i}`} path="/models/Rock by Quaternius - JmFMh7ztL9.glb" position={props.position} scale={props.scale * 1.5} rotation={props.rotation} />
        ))}
      </group>

      {/* Diverse Ocean Rocks around island */}
      {oceanRocks.map((props, i) => (
        <mesh key={`ocean-rock-${i}`} position={props.position} scale={props.scale} rotation={props.rotation} castShadow receiveShadow>
          {props.type === 0 && <dodecahedronGeometry args={[1.5]} />}
          {props.type === 1 && <icosahedronGeometry args={[1.5, 0]} />}
          {props.type === 2 && <octahedronGeometry args={[1.5, 0]} />}
          <meshStandardMaterial color={isLight ? "#94a3b8" : "#475569"} roughness={1.0} />
        </mesh>
      ))}

      {/* West Cliff Rocks - Tall gray rock pillars hugging the steep west cliffside */}
      <group position={[-28, 2, 0]}>
        <Instances limit={20} castShadow receiveShadow>
          <cylinderGeometry args={[0.5, 1.5, 1, 6]} />
          <meshStandardMaterial color="#616161" roughness={0.9} />
          {Array.from({ length: 8 }).map((_, i) => {
            const x = Math.sin(i * 1.5) * 3 + Math.random() * 1.5;
            const z = Math.cos(i * 1.2) * 10 + Math.random() * 1.5;
            const scaleY = 10 + Math.random() * 8;
            const rotY = Math.random() * Math.PI;
            return <Instance key={`west-cliff-rock-${i}`} position={[x, scaleY / 2 - 2, z]} scale={[1 + Math.random(), scaleY, 1 + Math.random()]} rotation={[0, rotY, 0]} />;
          })}
        </Instances>
      </group>

      {/* Pointed Sea Rocks near Lighthouse (NW) and East Coast */}
      <group>
        <Instances limit={20} castShadow receiveShadow>
          <cylinderGeometry args={[0.1, 1.8, 8, 5]} />
          <meshStandardMaterial color={isLight ? "#94a3b8" : "#475569"} roughness={0.95} />
          {/* Lighthouse area: ~[-35, -1, -30] */}
          {Array.from({ length: 3 }).map((_, i) => (
            <Instance key={`sea-rock-nw-${i}`} position={[-35 - Math.random() * 5, -1, -28 - Math.random() * 5]} rotation={[(Math.random() - 0.5) * 0.4, Math.random() * Math.PI, (Math.random() - 0.5) * 0.4]} scale={0.8 + Math.random() * 0.5} />
          ))}
          {/* East coast area: ~[36, -1, 10] */}
          {Array.from({ length: 3 }).map((_, i) => (
            <Instance key={`sea-rock-e-${i}`} position={[36 + Math.random() * 5, -1, 5 + Math.random() * 10]} rotation={[(Math.random() - 0.5) * 0.4, Math.random() * Math.PI, (Math.random() - 0.5) * 0.4]} scale={0.8 + Math.random() * 0.5} />
          ))}
        </Instances>
      </group>

      {/* 1. Lighthouse on North-West Hill */}
      <Lighthouse position={[-25, 16.1, -22]} isLight={isLight} />

      {/* 2. Treasure Corner on North-East Hill */}
      <group position={[24, 13.6, -18]}>
        <TreasureChest position={[0, 0, 0]} isLight={isLight} />
        <WoodenBarrel position={[-2, 0, 1]} isLight={isLight} />
        <WoodenBarrel position={[-1, 0, 2]} isLight={isLight} />
      </group>

      {/* 3. Tropical Island Water & Dock Additions */}
      <Whale position={[-34, -0.5, 30]} isLight={isLight} />
      <WoodenDock position={[32, 0.2, 16]} isLight={isLight} />
      <PirateShip position={[35, 0, 18]} isLight={isLight} />

      {/* 4. Central Village / Town Square inside Roundabout */}
      <group position={[0, 10.6, -6]}>
        <GLBModel path="/models/Fantasy Inn by Quaternius - x3ZcGn3jr4.glb" position={[-2, 0, -2]} scale={1.2} rotation={[0, Math.PI / 4, 0]} />
        <GLBModel path="/models/Fantasy House by Quaternius - BH2XHWUNmF.glb" position={[3, 0, 1]} scale={1.0} rotation={[0, -Math.PI / 3, 0]} />
      </group>

      {/* 5. Roadside Houses (Along the S-Curve) */}
      <group position={[-10, 8.2, 12]}>
        <GLBModel path="/models/House by Quaternius - vZ1CLbWmSx.glb" position={[0, 0, 0]} scale={0.5} rotation={[0, Math.PI / 4, 0]} />
      </group>
      <group position={[2, 5.5, 22]}>
        <GLBModel path="/models/Fantasy House by Quaternius - BH2XHWUNmF.glb" position={[3, 0, 0]} scale={1.0} rotation={[0, -Math.PI / 6, 0]} />
        <GLBModel path="/models/House by Quaternius - vZ1CLbWmSx.glb" position={[-4, 0, 2]} scale={0.5} rotation={[0, Math.PI / 2, 0]} />
      </group>
      <group position={[14, 3.2, 32]}>
        <GLBModel path="/models/Fantasy House by Quaternius - BH2XHWUNmF.glb" position={[-3, 0, -2]} scale={1.0} rotation={[0, Math.PI / 3, 0]} />
      </group>

      {/* Grass Patches */}
      <group>
        {grassPatches.map((props, i) => (
          <GrassPatch key={`grass-${i}`} position={props.position} isLight={isLight} />
        ))}
      </group>

      {/* Airborne Vehicles & Bridges */}
      <Airplane position={[0, 26, 0]} isLight={isLight} />
      <Airship position={[15, 32, -15]} isLight={isLight} />
      <FantasyStable position={[-4, 10.6, 2]} isLight={isLight} />
      <OldBridge position={[8, 3.5, 18]} isLight={isLight} />
      
      {/* Beach Umbrellas on South Beach */}
      <BeachUmbrella position={[6, 0.4, 40]} isLight={isLight} />
      <BeachUmbrella position={[-8, 0.4, 38]} isLight={isLight} />
      <BeachUmbrella position={[14, 0.4, 36]} isLight={isLight} />

      {/* Boats in sea */}
      <GLBModel path="/models/ship.glb" position={[28, -0.5, 24]} scale={0.15} />
      <GLBModel path="/models/ship.glb" position={[-32, -0.5, -8]} scale={0.14} />

    </group>
  );
}

useGLTF.preload("/models/Pine by Quaternius - Zt62gceKXZ.glb");
useGLTF.preload("/models/Big Tree by 3Donimus - dNWh762PN-6.glb");
useGLTF.preload("/models/Rock by Quaternius - JmFMh7ztL9.glb");
useGLTF.preload("/models/Fantasy Inn by Quaternius - x3ZcGn3jr4.glb");
useGLTF.preload("/models/Fantasy House by Quaternius - BH2XHWUNmF.glb");
useGLTF.preload("/models/House by Quaternius - vZ1CLbWmSx.glb");
useGLTF.preload("/models/Airplane by Poly by Google - 8VysVKMXN2J.glb");
useGLTF.preload("/models/Airship by Poly by Google - cr7RPZ4RfGM.glb");
useGLTF.preload("/models/Fantasy Stable by Quaternius - qhNQSOGGbi.glb");
useGLTF.preload("/models/Old Bridge by Lintufriikki - c6XnoUTQRsy.glb");
useGLTF.preload("/models/beach_umbrella.glb");
useGLTF.preload("/models/Grass by Quaternius - vUJjrRsFp4.glb");
