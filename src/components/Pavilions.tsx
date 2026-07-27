"use client";

import { Text } from "@react-three/drei";
import Pavilion from "./Pavilion";
import { DetailedHouse, Lighthouse, Windmill, TownHall, Fountain, StoneArena, HouseCluster, Volcano, TreasureChest, WoodenBarrel } from "./Landmarks";

interface PavilionsProps {
  onSectionClick: (section: string, position?: [number, number, number]) => void;
  isLight?: boolean;
}

export default function Pavilions({ onSectionClick, isLight = false }: PavilionsProps) {
  return (
    <group>
      {/* 1. Town Plaza Pavilion (Peak Roundabout Tier) */}
      <Pavilion
        position={[0, 10.6, -6]}
        label="Town Plaza"
        color="#EF4444"
        onClick={onSectionClick}
      >
        <group position={[0, 0, 0]}>
          <TownHall position={[0, 0, 0]} isLight={isLight} />
        </group>
      </Pavilion>

      {/* 2. Arena / Rock Compound (West Tier) */}
      <Pavilion
        position={[-24, 3.6, 4]}
        label="Arena Complex"
        color="#F43F5E"
        onClick={onSectionClick}
      >
        <group>
          <StoneArena position={[0, 0, 0]} isLight={isLight} />
          {/* Rock Ruins */}
          <mesh position={[-4, 0, -3]} rotation={[Math.PI / 4, 0, 0]} castShadow>
            <dodecahedronGeometry args={[1.5]} />
            <meshStandardMaterial color={isLight ? "#94a3b8" : "#334155"} />
          </mesh>
          <mesh position={[4, 0, 4]} rotation={[0, Math.PI / 3, 0]} castShadow>
            <dodecahedronGeometry args={[2]} />
            <meshStandardMaterial color={isLight ? "#94a3b8" : "#334155"} />
          </mesh>
        </group>
      </Pavilion>

      {/* 3. Knowledge Forge / Skills Village (Village Roadside) */}
      <Pavilion
        position={[14, 3.2, 32]}
        label="Knowledge Forge"
        color="#10B981"
        onClick={onSectionClick}
      >
        <HouseCluster position={[0, 0, 0]} isLight={isLight} />
      </Pavilion>

      {/* 4. Project Workshops (Northeast Treasure Cliff) */}
      <Pavilion
        position={[24, 13.6, -18]}
        label="Project Workshops"
        color="#F59E0B"
        onClick={onSectionClick}
      >
        <group>
          <Windmill position={[0, 0, 0]} isLight={isLight} />
          <WoodenBarrel position={[3, 0, -1]} isLight={isLight} />
          <WoodenBarrel position={[2, 0, -2]} isLight={isLight} />
        </group>
      </Pavilion>

      {/* 5. Creative Atelier (North-West Lighthouse Hill) */}
      <Pavilion
        position={[-25, 16.1, -22]}
        label="Creative Atelier"
        color="#A855F7"
        onClick={onSectionClick}
      >
        <Lighthouse position={[0, 0, 0]} isLight={isLight} />
      </Pavilion>
    </group>
  );
}
