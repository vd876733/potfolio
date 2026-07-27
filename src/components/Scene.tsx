"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useRef, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import SpacePavilions from "./SpacePavilions";

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
  const bgColor = isLight ? "#0f172a" : "#030712";

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
    <div className="w-full h-full absolute inset-0 z-0 bg-[#030712]">
      <Canvas
        shadows
        gl={{ antialias: true, preserveDrawingBuffer: true, alpha: true }}
        camera={{ position: [55, 40, 85], fov: 48, near: 0.1, far: 3500 }}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
      >
        {/* Deep Space Background & Fog */}
        <color attach="background" args={[bgColor]} />
        <fog attach="fog" args={[bgColor, 500, 3000]} />

        {/* Massive High-Volume Deep Space Starfields */}
        <Stars
          radius={600}
          depth={450}
          count={25000}
          factor={9}
          saturation={0.5}
          fade
          speed={1.8}
        />
        <Stars
          radius={1500}
          depth={800}
          count={20000}
          factor={7}
          saturation={0.2}
          fade
          speed={1.0}
        />

        {/* Space Lighting */}
        <ambientLight intensity={1.8} color="#e0f2fe" />
        <hemisphereLight intensity={1.0} color="#38bdf8" groundColor="#0f172a" />

        <directionalLight
          position={[40, 60, 30]}
          intensity={3.0}
          color="#fbbf24"
          castShadow
          shadow-mapSize={isMobile ? [1024, 1024] : [2048, 2048]}
          shadow-bias={-0.0001}
        />

        <pointLight position={[0, 0, 0]} intensity={5} color="#38bdf8" distance={100} />

        {/* Space Theme 3D Scene */}
        <Suspense fallback={null}>
          <SpacePavilions onSectionClick={handleSectionClick} />
        </Suspense>

        {/* Orbit Controls for 360 Space Exploration */}
        <OrbitControls
          ref={controlsRef}
          enableDamping={true}
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 1.4}
          minPolarAngle={Math.PI / 8}
          target={target}
          maxDistance={220}
          minDistance={10}
        />

        {/* Postprocessing Bloom Effect for Glowing Space Lights */}
        <EffectComposer multisampling={0}>
          <Bloom
            luminanceThreshold={0.8}
            mipmapBlur
            intensity={isMobile ? 0.8 : 1.6}
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
