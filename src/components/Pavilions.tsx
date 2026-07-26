"use client";

import { Text } from "@react-three/drei";
import Pavilion from "./Pavilion";
import { DetailedHouse, Lighthouse, Windmill, TownHall, Fountain, StoneArena, HouseCluster } from "./Landmarks";

interface PavilionsProps {
  onSectionClick: (section: string, position?: [number, number, number]) => void;
  isLight?: boolean;
}

export default function Pavilions({ onSectionClick, isLight = false }: PavilionsProps) {
  return (
    <group>
      {/* 1. Town Plaza Pavilion (Peak Tier) */}
      <Pavilion
        position={[0, 6, 0]}
        label="Town Plaza"
        color="#38BDF8"
        onClick={onSectionClick}
      >
        <group position={[0, 0, 0]}>
          <TownHall position={[0, 0, -2]} isLight={isLight} />
          <Fountain position={[0, 0, 2]} isLight={isLight} />
        </group>
      </Pavilion>

      {/* 2. Arena Complex (Base Tier) */}
      <Pavilion
        position={[-12, 0, 8]}
        label="Arena Complex"
        color="#F43F5E"
        onClick={onSectionClick}
      >
        <StoneArena position={[0, 0, 0]} isLight={isLight} />
      </Pavilion>

      {/* 3. Project Workshops (Base Tier) */}
      <Pavilion
        position={[12, 0, 8]}
        label="Project Workshops"
        color="#10B981"
        onClick={onSectionClick}
      >
        <HouseCluster position={[0, 0, 0]} isLight={isLight} />
      </Pavilion>

      {/* 4. Knowledge Forge (Mid Tier) */}
      <Pavilion
        position={[-10, 2, -10]}
        label="Knowledge Forge"
        color="#F59E0B"
        onClick={onSectionClick}
      >
        <Windmill position={[0, 0, 0]} isLight={isLight} />
      </Pavilion>

      {/* 5. Creative Atelier (Mid Tier) */}
      <Pavilion
        position={[10, 2, -10]}
        label="Creative Atelier"
        color="#A855F7"
        onClick={onSectionClick}
      >
        <Lighthouse position={[0, 0, 0]} isLight={isLight} />
      </Pavilion>
    </group>
  );
}
