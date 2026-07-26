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

  const { terrainGeo, beachGeo } = useMemo(() => {
    const width = 60;
    const height = 60;
    const segments = 128;
    const tGeo = new THREE.PlaneGeometry(width, height, segments, segments);
    const bGeo = new THREE.PlaneGeometry(width, height, segments, segments);
    const tPos = tGeo.attributes.position;
    const bPos = bGeo.attributes.position;
    
    for (let i = 0; i < tPos.count; i++) {
      const x = tPos.getX(i);
      const y = tPos.getY(i);
      
      const u = x / (width / 2); // [-1, 1]
      const v = y / (height / 2); // [-1, 1]
      
      // Blobs for asymmetrical kidney shape
      const d_south = Math.sqrt(Math.pow(u - 0.0, 2) + Math.pow(v + 0.3, 2)) / 0.65;
      const d_north = Math.sqrt(Math.pow(u + 0.2, 2) + Math.pow(v - 0.5, 2)) / 0.4;
      const d_mid = Math.sqrt(Math.pow(u + 0.1, 2) + Math.pow(v - 0.1, 2)) / 0.55;
      
      let D = Math.max(1 - d_south, 1 - d_north, 1 - d_mid);
      
      // Carve Coastal Inlets (Bays)
      // Southwest Bay
      const bay_sw = Math.sqrt(Math.pow(u + 0.3, 2) + Math.pow(v + 0.45, 2)) / 0.25;
      // East Dock Inlet
      const bay_e = Math.sqrt(Math.pow(u - 0.4, 2) + Math.pow(v - 0.1, 2)) / 0.2;
      
      D -= Math.max(0, 1 - bay_sw) * 0.5;
      D -= Math.max(0, 1 - bay_e) * 0.5;
      
      let z = -2; // Ocean floor depth
      let baseH = -2;
      
      if (D > 0) {
        let h = 0;
        
        // --- 1. North Volcano Peak ---
        const peakMask = Math.max(0, 1 - d_north);
        let peakHeight = Math.pow(peakMask, 1.5) * 16; 
        const craterDip = 1.0 - 0.5 * Math.max(0, 1 - Math.pow(d_north / 0.12, 2)); 
        peakHeight *= craterDip;
        h = Math.max(h, peakHeight);
        
        // --- 2. Central Roundabout Plateau ---
        const d_center = Math.sqrt(Math.pow(u + 0.05, 2) + Math.pow(v + 0.1, 2));
        const terraceMask = Math.max(0, 1 - d_center / 0.35); 
        const centralTerrace = Math.pow(terraceMask, 0.2) * 5; 
        h = Math.max(h, centralTerrace);
        
        // --- 3. S-Curve Slope ---
        let sCurve = 0;
        if (v < -0.05 && u > -0.2 && u < 0.3) {
            const t = Math.min(1, Math.max(0, (-0.05 - v) / 0.5)); 
            sCurve = 5 - t * 3.8; 
            
            const curveCenterU = Math.sin(v * Math.PI) * 0.15;
            const distToCurve = Math.abs(u - curveCenterU);
            const sCurveMask = Math.max(0, 1 - distToCurve / 0.25);
            sCurve *= Math.pow(sCurveMask, 0.5); 
        }
        h = Math.max(h, sCurve);

        // --- 4 & 5. West Cliffside & South/East Lowlands ---
        let edgeProfile = 0;
        if (u < -0.05) {
          // West cliff: sharp jagged sheer drop-off, small taper at base
          let cliffD = Math.max(0, D - 0.02);
          edgeProfile = Math.pow(cliffD, 0.15) * 4; 
        } else {
          // South & East Lowlands: flush with water (local z = 1.11)
          let shoreRise = Math.min(1.0, D / 0.1); 
          edgeProfile = Math.pow(shoreRise, 0.5) * 1.2; 
          edgeProfile += D * 1.5; 
        }
        h = Math.max(h, edgeProfile);
        
        baseH = h;
        
        // Jagged noise
        const noise = (Math.sin(u * 31.4) * Math.cos(v * 43.1) * 0.15) + 
                      (Math.sin(u * 87.2 + v * 73.1) * 0.05) +
                      (Math.cos(u * 14.5 - v * 22.3) * 0.1);
        
        // Smooth out plateaus and shelves so buildings can sit flat
        let plateauFlatness = 1.0;
        if (h > 4.5 && h < 5.2) plateauFlatness = 0.1; // Central terrace
        if (h > 1.1 && h < 1.6) plateauFlatness = 0.3; // Lowland shelves
        
        h += noise * (D > 0.05 ? 1 : D * 20) * plateauFlatness; 
        
        z = h;
      } else {
        z = -2 + D * 5; 
        baseH = z;
      }
      
      tPos.setZ(i, z);
      
      // Compute Sand Factor
      let sandFactor = 0;
      let sandMinZ = 0.5; // Starts underwater
      let sandMaxZ = 1.4; // Ends just above water level (1.11)
      
      // East/South wider
      sandMaxZ += Math.max(0, u) * 0.4;
      sandMaxZ += Math.max(0, -v) * 0.4;
      
      // West thinner / tapered
      if (u < -0.05) {
        sandMaxZ = 1.2; 
      }
      
      if (baseH >= sandMinZ && baseH <= sandMaxZ) {
        sandFactor = 1.0;
      }
      
      // Properly initialize userData and sandFactors array
      if (!(tGeo as any).userData) {
        (tGeo as any).userData = {};
      }
      if (!(tGeo as any).userData.sandFactors) {
        (tGeo as any).userData.sandFactors = [];
      }
      
      (tGeo as any).userData.sandFactors[i] = sandFactor;
    }
    
    tGeo.computeVertexNormals();

    // Extract triangles for the beach
    const indices = tGeo.index!.array;
    const beachIndices = [];
    const sandFactors = (tGeo as any).userData.sandFactors;
    
    for (let i = 0; i < indices.length; i += 3) {
      const a = indices[i];
      const b = indices[i+1];
      const c = indices[i+2];
      
      if (sandFactors[a] > 0 || sandFactors[b] > 0 || sandFactors[c] > 0) {
        beachIndices.push(a, b, c);
      }
    }
    
    bGeo.setIndex(beachIndices);
    // Copy the positions and normals from the terrain
    bGeo.setAttribute('position', tGeo.attributes.position);
    bGeo.setAttribute('normal', tGeo.attributes.normal);
    
    return { terrainGeo: tGeo, beachGeo: bGeo };
  }, []);

  return (
    <group ref={group}>
      {/* Scaled Terrain */}
      <group scale={[2.2, 1.8, 2.2]}>
        <mesh geometry={terrainGeo} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow castShadow>
          <meshStandardMaterial color="#6d4c41" roughness={0.9} />
        </mesh>
        
        <mesh geometry={beachGeo} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow castShadow>
          <meshStandardMaterial 
            color="#eedc9a" 
            roughness={0.9} 
            polygonOffset 
            polygonOffsetFactor={-1} 
            polygonOffsetUnits={-1} 
          />
        </mesh>
      </group>
      
      {/* Elements on the Island (Hidden for now to focus on silhouette) */}
      {/* {children} */}
    </group>
  );
}
