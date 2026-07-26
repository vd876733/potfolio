"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { CameraControls, Sky, ContactShadows, Stars } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import FloatingIsland from "./FloatingIsland";
import Ocean from "./Ocean";
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
  const cameraControlsRef = useRef<CameraControls>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const isLight = mounted && theme === "light";
  const bgColor = isLight ? "#87ceeb" : "#090d16";

  const handleSectionClick = (section: string, position?: [number, number, number]) => {
    setSelectedSection(section);
    onSectionClick(section);
    
    if (position && cameraControlsRef.current) {
      cameraControlsRef.current.setLookAt(
        position[0] + 15, position[1] + 15, position[2] + 15, // eye
        position[0], position[1], position[2],             // target
        true
      );
    }
  };

  const handleResetView = () => {
    setSelectedSection(null);
    if (cameraControlsRef.current) {
      cameraControlsRef.current.setLookAt(0, 35, 45, 0, 0, 0, true);
    }
  };

  return (
    <div className="w-full h-full absolute inset-0 z-0">
      <Canvas
        shadows
        camera={{ position: [0, 35, 45], fov: 45, near: 0.1, far: 1000 }}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
      >
        {isLight ? (
          <Sky distance={450000} sunPosition={[10, 20, 15]} inclination={0} azimuth={0.25} />
        ) : (
          <>
            <color attach="background" args={[bgColor]} />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          </>
        )}
        
        <ambientLight intensity={isLight ? 1.0 : 0.2} color={isLight ? "#e0f7fa" : "#60a5fa"} />
        
        <directionalLight
          position={isLight ? [30, 40, 20] : [-10, 20, -15]}
          castShadow
          intensity={isLight ? 2.2 : 0.5}
          color={isLight ? "#fff4e0" : "#93c5fd"}
          shadow-mapSize={isMobile ? [1024, 1024] : [2048, 2048]}
          shadow-camera-left={-40}
          shadow-camera-right={40}
          shadow-camera-top={40}
          shadow-camera-bottom={-40}
          shadow-bias={-0.0001}
        />

        <ContactShadows
          position={[0, -0.1, 0]}
          opacity={0.6}
          scale={100}
          blur={2}
          far={10}
        />

        <Ocean isLight={isLight} />

        <FloatingIsland isLight={isLight}>
          <Props isLight={isLight} />
          <RoadNetwork isLight={isLight} />

          {/* The 5 Portfolio Sections */}
          <Pavilions onSectionClick={handleSectionClick} isLight={isLight} />
        </FloatingIsland>

        <CameraControls
          ref={cameraControlsRef}
          maxPolarAngle={Math.PI / 2 - 0.02}
          minPolarAngle={0}
          dollyToCursor={true}
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
