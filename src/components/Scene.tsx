"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sky, ContactShadows, Stars } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import FloatingIsland from "./FloatingIsland";
import Pavilions from "./Pavilions";
import RoadNetwork from "./RoadNetwork";
import Props from "./Props";

interface SceneProps {
  onSectionClick: (section: string) => void;
  isMobile: boolean;
}

export default function Scene({ onSectionClick, isMobile }: SceneProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const controlsRef = useRef<any>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [target, setTarget] = useState<[number, number, number]>([0, 0, 0]);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const isLight = mounted && theme === "light";

  const handleSectionClick = (section: string, position?: [number, number, number]) => {
    setSelectedSection(section);
    onSectionClick(section);
    if (position) {
      setTarget(position);
    }
  };

  const handleResetView = () => {
    setSelectedSection(null);
    setTarget([0, 0, 0]);
  };

  return (
    <div className="w-full h-full absolute inset-0 z-0">
      <Canvas
        shadows
        camera={{ position: [30, 35, 45], fov: 45, near: 0.1, far: 1000 }}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
      >
        <color attach="background" args={["#00b4d8"]} />
        <fog attach="fog" args={["#00b4d8", 50, 300]} />
        
        <ambientLight intensity={1.2} color="#e0f7fa" />
        <hemisphereLight intensity={0.6} color="#ffffff" groundColor="#00a8ff" />
        
        <directionalLight
          position={[15, 25, 10]}
          intensity={2.5}
          color="#fff8e1"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-80}
          shadow-camera-right={80}
          shadow-camera-top={80}
          shadow-camera-bottom={-80}
          shadow-camera-near={0.1}
          shadow-camera-far={200}
          shadow-bias={-0.0001}
        />

        {/* Flat Ocean Plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
          <planeGeometry args={[4000, 4000, 1, 1]} />
          <meshStandardMaterial color="#0088cc" roughness={0.2} metalness={0.1} />
        </mesh>

        <FloatingIsland isLight={isLight}>
          <Props isLight={isLight} />
          <RoadNetwork isLight={isLight} />

          {/* The 5 Portfolio Sections */}
          <Pavilions onSectionClick={handleSectionClick} isLight={isLight} />
        </FloatingIsland>

        <OrbitControls
          ref={controlsRef}
          enableDamping={true}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={0}
          target={target}
        />

        <EffectComposer>
          <Bloom
            luminanceThreshold={1}
            mipmapBlur
            intensity={isMobile ? 0.75 : 1.5}
          />
        </EffectComposer>
      </Canvas>

      {/* Reset View Button */}
      {selectedSection && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <button
            onClick={handleResetView}
            className="px-6 py-3 bg-slate-900/80 hover:bg-slate-800 text-white dark:bg-white/90 dark:hover:bg-white dark:text-slate-900 rounded-full shadow-lg backdrop-blur-md transition-all font-medium text-sm border border-slate-700/50 dark:border-slate-300/50"
          >
            Reset View
          </button>
        </div>
      )}
    </div>
  );
}
