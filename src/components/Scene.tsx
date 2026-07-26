"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import Ground from "./Ground";
import Pavilions from "./Pavilions";
import RoadNetwork from "./RoadNetwork";
import Cars from "./Cars";
import Birds from "./Birds";

interface SceneProps {
  onSectionClick: (section: string) => void;
  isMobile: boolean;
}

export default function Scene({ onSectionClick, isMobile }: SceneProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const isLight = mounted && theme === "light";
  const bgColor = isLight ? "#f8fafc" : "#090d16";
  const ambientIntensity = isLight ? 0.7 : 0.4;
  const dirIntensity = isLight ? 2.5 : 1.5;

  return (
    <div className="w-full h-full absolute inset-0 z-0">
      <Canvas
        shadows
        orthographic
        camera={{ position: [25, 25, 25], zoom: 40, near: -100, far: 500 }}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
      >
        <color attach="background" args={[bgColor]} />
        <fog attach="fog" args={[bgColor, 30, 80]} />
        
        <ambientLight intensity={ambientIntensity} color="#ffffff" />
        
        <directionalLight
          position={[20, 30, 10]}
          castShadow
          intensity={dirIntensity}
          color="#ffffff"
          shadow-mapSize={isMobile ? [1024, 1024] : [2048, 2048]}
          shadow-camera-left={-40}
          shadow-camera-right={40}
          shadow-camera-top={40}
          shadow-camera-bottom={-40}
          shadow-bias={-0.0001}
        />

        <Ground isLight={isLight} />

        {/* Dynamic Scene Additions */}
        <RoadNetwork isLight={isLight} />
        <Cars />
        <Birds isLight={isLight} />

        {/* The 5 Portfolio Sections */}
        <Pavilions onSectionClick={onSectionClick} />

        <OrbitControls
          maxPolarAngle={Math.PI / 2 - 0.02}
          minPolarAngle={0}
          enableDamping
          dampingFactor={0.05}
          minZoom={10}
          maxZoom={100}
        />

        <EffectComposer>
          <Bloom
            luminanceThreshold={1}
            mipmapBlur
            intensity={isMobile ? 0.75 : 1.5}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
