"use client";

import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { Whale, PirateShip, WoodenDock, Airplane, Airship, FantasyStable, OldBridge, BeachUmbrella, GrassPatch } from "./Landmarks";

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
      arr.push({ position: [x, y, z] as [number, number, number], scale, rotation });
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
    <group position={[0, -3.6, 0]}>
      {/* Pine Trees */}
      <group>
        {pineTrees.map((props, i) => (
          <GLBModel key={`pine-${i}`} path="/models/Pine by Quaternius - Zt62gceKXZ.glb" position={props.position} scale={props.scale * 0.5} />
        ))}
      </group>

      {/* Palm Trees */}
      <group>
        {palmTrees.map((props, i) => (
          <GLBModel key={`palm-${i}`} path="/models/Big Tree by 3Donimus - dNWh762PN-6.glb" position={props.position} scale={props.scale * 0.5} />
        ))}
      </group>

      {/* Inland Rocks */}
      <group>
        {inlandRocks.map((props, i) => (
          <GLBModel key={`irock-${i}`} path="/models/Rock by Quaternius - JmFMh7ztL9.glb" position={props.position} scale={props.scale * 2} rotation={props.rotation} />
        ))}
      </group>

      {/* Ocean Rocks */}
      <group>
        {oceanRocks.map((props, i) => (
          <GLBModel key={`orock-${i}`} path="/models/Rock by Quaternius - JmFMh7ztL9.glb" position={props.position} scale={props.scale * 3} rotation={props.rotation} />
        ))}
      </group>

      {/* Wooden Docks */}
      <WoodenDock position={[40, 4.1, 15]} isLight={isLight} />
      
      {/* Whale */}
      <Whale position={[-35, 4, 30]} isLight={isLight} />
      
      {/* Pirate Ship */}
      <PirateShip position={[48, 4, 15]} isLight={isLight} />

      {/* Central Village / Town Square */}
      <group position={[0, 10.85, 0]}>
        <GLBModel path="/models/Fantasy Inn by Quaternius - x3ZcGn3jr4.glb" position={[-3, 0, -4]} scale={1.5} rotation={[0, Math.PI / 4, 0]} />
        <GLBModel path="/models/Fantasy House by Quaternius - BH2XHWUNmF.glb" position={[5, 0, 1]} scale={1.2} rotation={[0, -Math.PI / 3, 0]} />
        <GLBModel path="/models/Fantasy House by Quaternius - BH2XHWUNmF.glb" position={[-1, 0, 6]} scale={1.2} rotation={[0, Math.PI, 0]} />
      </group>

      {/* Roadside Houses (Along the S-Curve) */}
      <group position={[-15, 6, 25]}>
        <GLBModel path="/models/House by Quaternius - vZ1CLbWmSx.glb" position={[0, 0, 0]} scale={0.5} rotation={[0, Math.PI / 4, 0]} />
        <GLBModel path="/models/Fantasy House by Quaternius - BH2XHWUNmF.glb" position={[8, -2, -10]} scale={1.2} rotation={[0, -Math.PI / 6, 0]} />
        <GLBModel path="/models/House by Quaternius - vZ1CLbWmSx.glb" position={[-5, 0, 15]} scale={0.5} rotation={[0, Math.PI / 2, 0]} />
      </group>

      {/* Grass Patches */}
      <group>
        {grassPatches.map((props, i) => (
          <GrassPatch key={`grass-${i}`} position={props.position} isLight={isLight} />
        ))}
      </group>

      {/* New Landmark Models */}
      <Airplane position={[0, 25, 0]} isLight={isLight} />
      <Airship position={[20, 35, -20]} isLight={isLight} />
      <FantasyStable position={[-5, 10.85, 8]} isLight={isLight} />
      <OldBridge position={[10, 4, 20]} isLight={isLight} />
      <BeachUmbrella position={[35, 4, 25]} isLight={isLight} />
      <BeachUmbrella position={[32, 4, 22]} isLight={isLight} />

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
