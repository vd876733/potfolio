"use client";

import {
  SolarSystem,
  ISSStation,
  Spacewalker,
  Spaceships,
  SpaceWaypoint,
} from "./SpaceEnvironment";

interface SpacePavilionsProps {
  onSectionClick: (section: string, position?: [number, number, number]) => void;
}

export default function SpacePavilions({ onSectionClick }: SpacePavilionsProps) {
  return (
    <group>
      {/* Central Solar System */}
      <SolarSystem position={[0, 0, 0]} />

      {/* Spaceships Cruising in Orbit */}
      <Spaceships />

      {/* 1. Town Plaza / Command Central (About) */}
      <SpaceWaypoint
        position={[0, 6, -10]}
        label="Town Plaza"
        color="#38BDF8"
        onClick={onSectionClick}
      >
        <Spacewalker position={[0, 2, 0]} />
      </SpaceWaypoint>

      {/* 2. Arena Complex / Stats Outpost */}
      <SpaceWaypoint
        position={[-22, 2, 8]}
        label="Arena Complex"
        color="#F43F5E"
        onClick={onSectionClick}
      >
        <ISSStation position={[0, 3, 0]} />
      </SpaceWaypoint>

      {/* 3. Project Workshops / Space Hangar */}
      <SpaceWaypoint
        position={[22, 8, -15]}
        label="Project Workshops"
        color="#F59E0B"
        onClick={onSectionClick}
      />

      {/* 4. Knowledge Forge / AI & Skills Core */}
      <SpaceWaypoint
        position={[16, 0, 24]}
        label="Knowledge Forge"
        color="#10B981"
        onClick={onSectionClick}
      />

      {/* 5. Creative Atelier / Starlight Gallery */}
      <SpaceWaypoint
        position={[-24, 12, -20]}
        label="Creative Atelier"
        color="#A855F7"
        onClick={onSectionClick}
      />
    </group>
  );
}
