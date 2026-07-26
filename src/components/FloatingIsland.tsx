"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface FloatingIslandProps {
  isLight?: boolean;
  children: React.ReactNode;
}

export default function FloatingIsland({ isLight = false, children }: FloatingIslandProps) {
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (group.current) {
      const t = clock.elapsedTime;
      // Gentle vertical bobbing & slight rotation tilt
      group.current.position.y = Math.sin(t * 0.8) * 0.15;
      group.current.rotation.z = Math.sin(t * 0.5) * 0.01;
    }
  });

  const terrainGeometry = useMemo(() => {
    const width = 60;
    const height = 60;
    const segments = 128;
    const geo = new THREE.PlaneGeometry(width, height, segments, segments);
    const pos = geo.attributes.position;
    
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      
      const u = x / (width / 2); // [-1, 1]
      const v = y / (height / 2); // [-1, 1]
      
      // Blobs for asymmetrical kidney shape
      // Wider south (v < 0), tapering to peak at north (v > 0)
      const d_south = Math.sqrt(Math.pow(u - 0.0, 2) + Math.pow(v + 0.3, 2)) / 0.65;
      const d_north = Math.sqrt(Math.pow(u + 0.2, 2) + Math.pow(v - 0.5, 2)) / 0.4;
      const d_mid = Math.sqrt(Math.pow(u + 0.1, 2) + Math.pow(v - 0.1, 2)) / 0.55;
      
      const D = Math.max(1 - d_south, 1 - d_north, 1 - d_mid);
      
      let z = -2; // Ocean floor depth
      
      if (D > 0) {
        let edgeProfile = D;
        
        // West cliffside (u < -0.05) vs East/South gentle slopes
        if (u < -0.05) {
          // Sharp jagged cliff drop-off
          edgeProfile = Math.pow(D, 0.15); 
        } else {
          // Gently sloping flat ground leading down to sea level
          edgeProfile = Math.pow(D, 0.8);
        }
        
        // Base terrain elevation
        let h = edgeProfile * 3;
        
        // Center Plateau (Mid-height flat area for the main village)
        const d_center = Math.sqrt(Math.pow(u + 0.05, 2) + Math.pow(v + 0.1, 2));
        const plateau = Math.max(0, 1 - d_center / 0.45);
        h = Math.max(h, Math.min(4, plateau * 15)); // Flattens at height 4
        
        // North Peak (Steep, tall volcanic crater hill)
        const peakMask = Math.max(0, 1 - d_north);
        let peakHeight = Math.pow(peakMask, 1.5) * 14; 
        
        // Volcanic crater dip at the very top
        const craterDip = 1.0 - 0.4 * Math.max(0, 1 - Math.pow(d_north / 0.15, 2)); 
        peakHeight *= craterDip;
        
        h = Math.max(h, peakHeight);
        
        // Jagged noise for cliffs and rocks
        const noise = (Math.sin(u * 31.4) * Math.cos(v * 43.1) * 0.15) + 
                      (Math.sin(u * 87.2 + v * 73.1) * 0.05) +
                      (Math.cos(u * 14.5 - v * 22.3) * 0.1);
        
        h += noise * (D > 0.05 ? 1 : D * 20); // Fade noise at coastline
        
        z = h;
      } else {
        z = -2 + D * 5; // Under water sloping
      }
      
      pos.setZ(i, z);
    }
    
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <group ref={group}>
      {/* Scaled Terrain */}
      <group scale={[2.2, 1.8, 2.2]}>
        <mesh geometry={terrainGeometry} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow castShadow>
          <meshStandardMaterial color="#6d4c41" roughness={0.9} />
        </mesh>
      </group>
      
      {/* Elements on the Island (Hidden for now to focus on silhouette) */}
      {/* {children} */}
    </group>
  );
}
