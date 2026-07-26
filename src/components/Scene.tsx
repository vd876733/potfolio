"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import Ground from "./Ground";
import Pavilions from "./Pavilions";

interface SceneProps {
  onSectionClick: (section: string) => void;
  isMobile: boolean;
}

export default function Scene({ onSectionClick, isMobile }: SceneProps) {
  return (
    <div className="w-full h-full absolute inset-0 z-0">
      <Canvas
        shadows
        orthographic
        camera={{ position: [25, 25, 25], zoom: 40, near: -100, far: 500 }}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
      >
        <color attach="background" args={["#0B0C0E"]} />
        <fog attach="fog" args={["#0B0C0E", 30, 80]} />
        
        <ambientLight intensity={0.4} color="#ffffff" />
        
        <directionalLight
          position={[20, 30, 10]}
          castShadow
          intensity={1.5}
          color="#ffffff"
          shadow-mapSize={isMobile ? [1024, 1024] : [2048, 2048]}
          shadow-camera-left={-40}
          shadow-camera-right={40}
          shadow-camera-top={40}
          shadow-camera-bottom={-40}
          shadow-bias={-0.0001}
        />

        <Ground />

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
