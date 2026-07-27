"use client";

import {
  SunGLTF,
  GLTFPlanet,
  JupiterPlanet,
  AsteroidBelt,
  ShootingComets,
  HighOrbitSpaceships,
  Spacewalker,
  ISSStation,
  SpaceWaypoint,
} from "./SpaceEnvironment";

interface SpacePavilionsProps {
  onSectionClick: (section: string, position?: [number, number, number]) => void;
}

export default function SpacePavilions({ onSectionClick }: SpacePavilionsProps) {
  return (
    <group>
      {/* 1. Sun GLTF (Sun by Jarlan Perez) */}
      <SunGLTF />

      {/* Asteroid Belt */}
      <AsteroidBelt />

      {/* Dynamic Shooting Comets */}
      <ShootingComets />

      {/* High Orbit Flying Spaceships (FLYING HIGH ABOVE THE PLANETS) */}
      <HighOrbitSpaceships />

      {/* 2. Mercury */}
      <GLTFPlanet
        modelPath="/space/Planet by Quaternius - IVnmauIgWX.glb"
        orbitRadius={12}
        scale={1.3}
        speed={0.15}
        initialAngle={0.5}
      />

      {/* 3. Venus */}
      <GLTFPlanet
        modelPath="/space/Planet by Quaternius - IVnmauIgWX.glb"
        orbitRadius={18}
        scale={1.9}
        speed={0.12}
        initialAngle={2.1}
      />

      {/* 4. Earth GLTF (Command Central / About Section) */}
      <GLTFPlanet
        modelPath="/space/Earth by Poly by Google - 1I5ip-3VOfv.glb"
        orbitRadius={26}
        scale={3.2}
        speed={0.09}
        initialAngle={4.2}
      >
        {/* Floating Astronaut near Earth */}
        <Spacewalker position={[3.8, 1.8, 0]} />

        {/* Command Central Waypoint */}
        <SpaceWaypoint
          label="Command Central"
          color="#38BDF8"
          offsetY={5.0}
          onClick={onSectionClick}
        />
      </GLTFPlanet>

      {/* 5. Mars GLTF (Cyber Arena Section) */}
      <GLTFPlanet
        modelPath="/space/Mars by Jarlan Perez - 8sNKYRTUFAe.glb"
        orbitRadius={34}
        scale={2.8}
        speed={0.07}
        initialAngle={1.2}
      >
        {/* ISS Station near Mars */}
        <ISSStation position={[3.2, 2.0, 0]} />

        {/* Cyber Arena Waypoint */}
        <SpaceWaypoint
          label="Cyber Arena"
          color="#F43F5E"
          offsetY={4.5}
          onClick={onSectionClick}
        />
      </GLTFPlanet>

      {/* 6. Jupiter Gas Giant with Bands & Red Spot (Starship Hangar Section) */}
      <JupiterPlanet
        orbitRadius={48}
        size={5.2}
        speed={0.04}
        initialAngle={3.5}
      >
        {/* Starship Hangar Waypoint */}
        <SpaceWaypoint
          label="Starship Hangar"
          color="#F59E0B"
          offsetY={7.5}
          onClick={onSectionClick}
        />
      </JupiterPlanet>

      {/* 7. Saturn GLTF (Quantum Forge Section) */}
      <GLTFPlanet
        modelPath="/space/Saturn by Jarlan Perez - b-y9HDTsu7q.glb"
        orbitRadius={64}
        scale={4.8}
        speed={0.03}
        initialAngle={0.8}
      >
        {/* Quantum Forge Waypoint */}
        <SpaceWaypoint
          label="Quantum Forge"
          color="#10B981"
          offsetY={7.0}
          onClick={onSectionClick}
        />
      </GLTFPlanet>

      {/* 8. Uranus */}
      <GLTFPlanet
        modelPath="/space/Planet by Quaternius - IVnmauIgWX.glb"
        orbitRadius={78}
        scale={3.5}
        speed={0.02}
        initialAngle={2.8}
      />

      {/* 9. Neptune GLTF (Starlight Gallery Section) */}
      <GLTFPlanet
        modelPath="/space/Neptune by Poly by Google - fxLCXXDYUwC.glb"
        orbitRadius={92}
        scale={3.8}
        speed={0.015}
        initialAngle={5.1}
      >
        {/* Starlight Gallery Waypoint */}
        <SpaceWaypoint
          label="Starlight Gallery"
          color="#A855F7"
          offsetY={6.0}
          onClick={onSectionClick}
        />
      </GLTFPlanet>
    </group>
  );
}
