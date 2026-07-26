"use client";

import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface OceanProps {
  isLight?: boolean;
}

export default function Ocean({ isLight = false }: OceanProps) {
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorNear: { value: new THREE.Color(isLight ? "#00a8ff" : "#0088cc") },
      uColorFar: { value: new THREE.Color(isLight ? "#0055a5" : "#002255") },
    }),
    [isLight]
  );

  useFrame((state) => {
    if (uniforms) {
      uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  const onBeforeCompile = (shader: any) => {
    shader.uniforms.uTime = uniforms.uTime;
    shader.uniforms.uColorNear = uniforms.uColorNear;
    shader.uniforms.uColorFar = uniforms.uColorFar;

    shader.vertexShader = shader.vertexShader.replace(
      '#include <common>',
      `
      #include <common>
      uniform float uTime;
      varying vec3 vWorldPosition;
      `
    );

    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      `
      #include <begin_vertex>
      
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      
      // Gentle wave motion
      float wave1 = sin(worldPos.x * 0.02 + uTime * 0.8) * 
                    cos(worldPos.z * 0.02 + uTime * 0.8) * 1.5;
                    
      float wave2 = sin(worldPos.x * 0.05 - uTime * 0.5) * 
                    cos(worldPos.z * 0.05 - uTime * 0.5) * 0.5;
                    
      transformed.z += wave1 + wave2; 
      
      worldPos = modelMatrix * vec4(transformed, 1.0);
      vWorldPosition = worldPos.xyz;
      `
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <common>',
      `
      #include <common>
      uniform vec3 uColorNear;
      uniform vec3 uColorFar;
      varying vec3 vWorldPosition;
      `
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <color_fragment>',
      `
      #include <color_fragment>
      
      // Distance from the center of the island
      float dist = length(vWorldPosition.xz);
      
      // Blend between turquoise near the beach and deep blue further away
      float blend = smoothstep(60.0, 300.0, dist);
      
      diffuseColor.rgb = mix(uColorNear, uColorFar, blend);
      `
    );
  };

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
      <planeGeometry args={[3000, 3000, 128, 128]} />
      <meshStandardMaterial
        ref={materialRef}
        transparent={true}
        opacity={0.85}
        roughness={0.1}
        metalness={0.1}
        onBeforeCompile={onBeforeCompile}
      />
    </mesh>
  );
}
