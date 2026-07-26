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
      {/* 1. Town Plaza Pavilion (Peak Tier) */}
      <Pavilion
        position={[0, 10.8, 0]}
        label="Town Plaza"
        color="#EF4444"
        onClick={onSectionClick}
      >
        <group position={[0, 0, 0]}>
          <TownHall position={[0, 0, 0]} isLight={isLight} />
        </group>
      </Pavilion>

      {/* 2. Arena / Rock Compound (Mid-West) */}
      <Pavilion
        position={[-30.8, 3.6, 8.8]}
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

      {/* 3. Knowledge Forge / Skills Village (Central Road) */}
      <Pavilion
        position={[22, 3.6, -22]}
        label="Knowledge Forge"
        color="#10B981"
        onClick={onSectionClick}
      >
        <HouseCluster position={[0, 0, 0]} isLight={isLight} />
      </Pavilion>

      {/* 4. Project Workshops (Northeast Plateau) */}
      <Pavilion
        position={[48.4, 0, -26.4]}
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

      {/* 5. Creative Atelier (North-West Cliff Base) */}
      <Pavilion
        position={[-44, 0, -44]}
        label="Creative Atelier"
        color="#A855F7"
        onClick={onSectionClick}
      >
        <Lighthouse position={[0, 0, 0]} isLight={isLight} />
      </Pavilion>
    </group>
  );
}
