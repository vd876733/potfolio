"use client";

import { Html } from "@react-three/drei";
import {
  SunGLTF,
  GLTFPlanet,
  JupiterPlanet,
  AsteroidBelt,
  SphericalAsteroidField,
  ShootingComets,
  ShootingStars,
  HighOrbitSpaceships,
  Spacewalker,
  ISSStation,
  SpaceWaypoint,
  SupermassiveBlackHole,
  BackgroundGalaxy,
  GiantTricolorGalaxy,
  MultipleBackgroundGalaxies,
  DistantAsteroidField,
} from "./SpaceEnvironment";
import Orb from "./Orb";

interface SpacePavilionsProps {
  onSectionClick: (section: string, position?: [number, number, number]) => void;
}

export default function SpacePavilions({ onSectionClick }: SpacePavilionsProps) {
  return (
    <group>
      {/* 2x Supermassive Black Hole & Cosmic Spiral Galaxy Deep in Background */}
      <SupermassiveBlackHole position={[650, 110, -550]} scale={2.0} />
      <BackgroundGalaxy position={[-650, 120, -600]} scale={1.5} />
      <GiantTricolorGalaxy position={[-200, 180, 1400]} scale={[1.8, 1.0, 0.55] as any} />
      <MultipleBackgroundGalaxies />
      <DistantAsteroidField />

      {/* Cosmic Orb — floating galaxy orb above the solar system */}
      <Html position={[0, 38, -55]} center transform occlude={false} style={{ pointerEvents: "none" }}>
        <Orb
          size={220}
          archetype="spiral"
          background="#00000000"
          palette={{
            anchor: "#4433ff",
            colorA: "#22ddff",
            colorB: "#8833ff",
            colorC: "#ff44aa",
          }}
          speed={45}
          spin={49}
          lens
          lensAmount={100}
        />
      </Html>

      {/* 1. Sun GLTF (Sun by Jarlan Perez) */}
      <SunGLTF />

      {/* Asteroid Belt around Sun */}
      <AsteroidBelt />

      {/* Spherical Asteroid Field — rocks spread across the full space sphere */}
      <SphericalAsteroidField />

      {/* Dynamic Shooting Comets */}
      <ShootingComets />

      {/* Shooting Stars — spread across the full sphere of space */}
      <ShootingStars />

      {/* High Orbit Flying Spaceships (FLYING HIGH ABOVE THE PLANETS) */}
      <HighOrbitSpaceships />

      {/* 1. Mercury (1st planet from Sun) */}
      <GLTFPlanet
        modelPath="/space/Planet by Quaternius - IVnmauIgWX.glb"
        orbitRadius={12}
        scale={1.3}
        speed={0.15}
        initialAngle={0.5}
      />

      {/* 2. Venus (2nd planet from Sun) */}
      <GLTFPlanet
        modelPath="/space/Planet by Quaternius - IVnmauIgWX.glb"
        orbitRadius={18}
        scale={1.9}
        speed={0.12}
        initialAngle={2.1}
      />

      {/* 3. Command Central / About Section */}
      <GLTFPlanet
        modelPath="/space/Planet by Quaternius - IVnmauIgWX.glb"
        orbitRadius={26}
        scale={2.2}
        speed={0.09}
        initialAngle={4.2}
        atmosphereColor="#38bdf8"
      >
        {/* Floating Astronaut near Command Central */}
        <Spacewalker position={[2.5, 1.4, 0]} />

        {/* Command Central Waypoint */}
        <SpaceWaypoint
          label="Command Central"
          color="#38BDF8"
          offsetY={3.8}
          onClick={onSectionClick}
        />
      </GLTFPlanet>

      {/* 4. Mars GLTF (Cyber Arena Section) */}
      <GLTFPlanet
        modelPath="/space/Mars by Jarlan Perez - 8sNKYRTUFAe.glb"
        orbitRadius={34}
        scale={2.8}
        speed={0.07}
        initialAngle={1.2}
        atmosphereColor="#f43f5e"
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

      {/* 5. Jupiter Gas Giant with Bands & Red Spot (Starship Hangar Section) */}
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

      {/* 6. Saturn GLTF (Quantum Forge Section) */}
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

      {/* 7. Uranus */}
      <GLTFPlanet
        modelPath="/space/Planet by Quaternius - IVnmauIgWX.glb"
        orbitRadius={78}
        scale={3.5}
        speed={0.02}
        initialAngle={2.8}
      />

      {/* 8. Neptune GLTF (Starlight Gallery Section) */}
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
