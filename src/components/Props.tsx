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

<<<<<<< HEAD
      {/* Ocean Rocks */}
      <group>
        {oceanRocks.map((props, i) => (
          <GLBModel key={`orock-${i}`} path="/models/Rock by Quaternius - JmFMh7ztL9.glb" position={props.position} scale={props.scale * 3} rotation={props.rotation} />
=======
      {/* Diverse Ocean Rocks */}
      {oceanRocks.map((props, i) => (
        <mesh key={`ocean-rock-${i}`} position={props.position} scale={props.scale} rotation={props.rotation} castShadow receiveShadow>
          {props.type === 0 && <dodecahedronGeometry args={[1.5]} />}
          {props.type === 1 && <icosahedronGeometry args={[1.5, 0]} />}
          {props.type === 2 && <octahedronGeometry args={[1.5, 0]} />}
          <meshStandardMaterial color={oceanRockColor} roughness={1.0} />
        </mesh>
      ))}

      {/* Beach Kits */}
      <BeachKit position={[11, 0.18, 44]} isLight={isLight} />
      <BeachKit position={[-17.6, 0.18, 41.8]} isLight={isLight} rotation={[0, -Math.PI / 6, 0]} />
      <BeachKit position={[26.4, 0.18, 35.2]} isLight={isLight} rotation={[0, Math.PI / 4, 0]} />

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

      {/* Pointed Sea Rocks near Lighthouse (NW) and East Coast */}
      <group>
        <Instances limit={20} castShadow receiveShadow>
          <cylinderGeometry args={[0.1, 1.8, 8, 5]} />
          <meshStandardMaterial color={rockColor} roughness={0.95} />
          {/* Lighthouse area: ~[-50, -4, -50] */}
          {Array.from({ length: 3 }).map((_, i) => (
            <Instance key={`sea-rock-nw-${i}`} position={[-48 - Math.random() * 8, -2, -50 - Math.random() * 8]} rotation={[(Math.random() - 0.5) * 0.4, Math.random() * Math.PI, (Math.random() - 0.5) * 0.4]} scale={0.8 + Math.random() * 0.5} />
          ))}
          {/* East coast area: ~[55, -4, 10] */}
          {Array.from({ length: 3 }).map((_, i) => (
            <Instance key={`sea-rock-e-${i}`} position={[55 + Math.random() * 10, -2, 5 + Math.random() * 15]} rotation={[(Math.random() - 0.5) * 0.4, Math.random() * Math.PI, (Math.random() - 0.5) * 0.4]} scale={0.8 + Math.random() * 0.5} />
          ))}
        </Instances>
      </group>

      {/* Tropical Island Additions */}
      <Whale position={[-66, -3.6, 66]} isLight={isLight} />
      <WoodenDock position={[70.4, -3.6, 0]} isLight={isLight} />
      <PirateShip position={[70.4, -4.5, 8.8]} isLight={isLight} />

      {/* Boats */}
      <BobbingBoat position={[55, -4.5, 26.4]} />
      <BobbingBoat position={[-61.6, -4.5, -11]} scale={0.8} />
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
>>>>>>> e44fe917a82361e8c23dd776bf57783df098e3ff
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
