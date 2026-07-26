"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sky, ContactShadows } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import FloatingIsland from "./FloatingIsland";
import Ocean from "./Ocean";
import Pavilions from "./Pavilions";
import RoadNetwork from "./RoadNetwork";
import Cars from "./Cars";
import Birds from "./Birds";
import Props from "./Props";

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
  const bgColor = isLight ? "#87ceeb" : "#090d16";

  return (
    <div className="w-full h-full absolute inset-0 z-0">
      <Canvas
        shadows
        orthographic
        camera={{ position: [25, 25, 25], zoom: 40, near: -100, far: 500 }}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
      >
        {isLight ? (
          <Sky distance={450000} sunPosition={[10, 20, 15]} inclination={0} azimuth={0.25} />
        ) : (
          <color attach="background" args={[bgColor]} />
        )}
        
        <ambientLight intensity={isLight ? 1.2 : 0.4} color="#ffffff" />
        
        <directionalLight
          position={[10, 20, 15]}
          castShadow
          intensity={isLight ? 2.0 : 1.0}
          color="#ffffff"
          shadow-mapSize={isMobile ? [1024, 1024] : [2048, 2048]}
          shadow-camera-left={-40}
          shadow-camera-right={40}
          shadow-camera-top={40}
          shadow-camera-bottom={-40}
          shadow-bias={-0.0001}
        />

        <ContactShadows
          position={[0, -2.05, 0]}
          opacity={0.6}
          scale={50}
          blur={1.5}
          far={10}
        />

        <Ocean isLight={isLight} />

        <FloatingIsland isLight={isLight}>
          {/* Environment Props (Trees and Rocks) */}
          <Props isLight={isLight} />

          {/* Dynamic Scene Additions */}
          <RoadNetwork isLight={isLight} />
          <Cars />
          <Birds isLight={isLight} />

          {/* The 5 Portfolio Sections */}
          <Pavilions onSectionClick={onSectionClick} isLight={isLight} />
        </FloatingIsland>

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
