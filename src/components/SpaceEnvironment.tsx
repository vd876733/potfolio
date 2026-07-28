"use client";

import { useMemo, useRef, useLayoutEffect, MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Float, Html } from "@react-three/drei";
import * as THREE from "three";

// Safe GLTF Loader helper with shadow support
function SpaceModel({
  path,
  position = [0, 0, 0],
  scale = 1,
  rotation = [0, 0, 0],
  normalize = false,
}: {
  path: string;
  position?: [number, number, number];
  scale?: number | [number, number, number];
  rotation?: [number, number, number];
  normalize?: boolean;
}) {
  const gltf = useGLTF(path);
  const sceneObj = Array.isArray(gltf) ? gltf[0].scene : gltf.scene;
  const clone = useMemo(() => {
    const cl = sceneObj.clone();

    if (normalize) {
      const box = new THREE.Box3().setFromObject(cl);
      const center = new THREE.Vector3();
      const size = new THREE.Vector3();
      box.getCenter(center);
      box.getSize(size);

      const maxDim = Math.max(size.x, size.y, size.z);
      if (maxDim > 0) {
        const normScale = 2.0 / maxDim;
        cl.scale.set(normScale, normScale, normScale);
        cl.position.sub(center.multiplyScalar(normScale));
      }
    }

    cl.traverse((child: THREE.Object3D) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return cl;
  }, [sceneObj, normalize]);

  return (
    <primitive
      object={clone}
      position={position}
      scale={scale}
      rotation={rotation}
    />
  );
}

// 1. Sun GLTF Model
export function SunGLTF() {
  const sunRef = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    if (sunRef.current) {
      sunRef.current.rotation.y += delta * 0.04;
    }
  });

  return (
    <group ref={sunRef} position={[0, 0, 0]}>
      <SpaceModel
        path="/space/Sun by Jarlan Perez - 3XZEucM6wC7.glb"
        scale={4.8}
      />
      <mesh>
        <sphereGeometry args={[5.8, 32, 32]} />
        <meshBasicMaterial
          color="#ffaa00"
          transparent
          opacity={0.4}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <pointLight intensity={40} color="#ffaa00" distance={280} decay={1} />
      <pointLight intensity={25} color="#ffffff" distance={180} decay={1} />
    </group>
  );
}

export { SunGLTF as Sun, SunGLTF as SolarSystem };

// 2. Orbit Ring Line
export function OrbitRing({ radius }: { radius: number }) {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <ringGeometry args={[radius - 0.15, radius + 0.15, 128]} />
      <meshBasicMaterial
        color="#38bdf8"
        transparent
        opacity={0.35}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// 3. Asteroid Belt
export function AsteroidBelt() {
  const groupRef = useRef<THREE.Group>(null!);

  const asteroids = useMemo(() => {
    const items = [];
    const count = 180;
    const minRadius = 38;
    const maxRadius = 44;

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.1;
      const radius = minRadius + Math.random() * (maxRadius - minRadius);
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = (Math.random() - 0.5) * 3;
      const scale = 0.25 + Math.random() * 0.55;
      const rot = [
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI,
      ] as [number, number, number];

      items.push({ x, y, z, scale, rot });
    }
    return items;
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {asteroids.map((ast, idx) => (
        <mesh
          key={idx}
          position={[ast.x, ast.y, ast.z]}
          rotation={ast.rot}
          scale={ast.scale}
        >
          <dodecahedronGeometry args={[0.8, 1]} />
          <meshStandardMaterial color="#64748b" roughness={0.9} />
        </mesh>
      ))}

      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <ringGeometry args={[38, 44, 128]} />
        <meshBasicMaterial
          color="#94a3b8"
          transparent
          opacity={0.12}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

// 3b. Spherical Asteroid Field — 6000 rocks scattered at GALACTIC distances
export function SphericalAsteroidField() {
  const meshRef  = useRef<THREE.InstancedMesh>(null!);
  const driftRef = useRef<THREE.Group>(null!);
  const COUNT    = 6000;

  // Build instance matrices — golden-angle sphere at galaxy-scale distances
  const { matrices, dummy } = useMemo(() => {
    const d    = new THREE.Object3D();
    const mats: THREE.Matrix4[] = [];

    for (let i = 0; i < COUNT; i++) {
      // Fibonacci sphere — perfect even coverage of all directions
      const y   = 1 - (i / (COUNT - 1)) * 2;            // -1 → +1
      const r   = Math.sqrt(Math.max(0, 1 - y * y));
      const phi = (i * 2.399963) % (Math.PI * 2);        // golden angle

      // Scatter from 300 to 1300 units — the galactic neighbourhood
      const dist = 300 + (i % 31) * 32.5;                // 300 – 1307 units

      d.position.set(
        dist * r * Math.cos(phi),
        dist * y,
        dist * r * Math.sin(phi),
      );

      // Deterministic initial orientation
      d.rotation.set(
        (i * 0.37) % (Math.PI * 2),
        (i * 0.61) % (Math.PI * 2),
        (i * 0.19) % (Math.PI * 2),
      );

      // Larger rocks so they're visible at galactic distances (2–8 units)
      const s = 2.0 + (i % 9) * 0.7;
      d.scale.setScalar(s);
      d.updateMatrix();
      mats.push(d.matrix.clone());
    }
    return { matrices: mats, dummy: d };
  }, []);

  // Upload to GPU once
  useLayoutEffect(() => {
    if (!meshRef.current) return;
    matrices.forEach((m, i) => meshRef.current.setMatrixAt(i, m));
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [matrices]);

  // Animate: just a slow whole-field drift rotation (no per-instance tumble at galactic range)
  useFrame((_, delta) => {
    if (driftRef.current) driftRef.current.rotation.y += delta * 0.002;
  });

  return (
    <group ref={driftRef}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]} frustumCulled={false}>
        <dodecahedronGeometry args={[0.9, 0]} />
        <meshStandardMaterial
          color="#6b7280"
          roughness={0.92}
          metalness={0.08}
          emissive="#1e1e2e"
          emissiveIntensity={0.15}
        />
      </instancedMesh>
    </group>
  );
}

// 4. Shooting Comets
export function ShootingComets() {
  const comet1 = useRef<THREE.Group>(null!);
  const comet2 = useRef<THREE.Group>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (comet1.current) {
      const speed = 10;
      const pos = (t * speed) % 250 - 125;
      comet1.current.position.set(pos, 45 - pos * 0.2, -40 + pos * 0.3);
    }
    if (comet2.current) {
      const speed = 8;
      const pos = ((t + 4) * speed) % 250 - 125;
      comet2.current.position.set(-pos, 50 - pos * 0.3, 30 - pos * 0.2);
    }
  });

  return (
    <group>
      <group ref={comet1}>
        <mesh>
          <sphereGeometry args={[0.6, 16, 16]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        <pointLight color="#38bdf8" intensity={4} distance={20} />
      </group>
      <group ref={comet2}>
        <mesh>
          <sphereGeometry args={[0.7, 16, 16]} />
          <meshBasicMaterial color="#f43f5e" />
        </mesh>
        <pointLight color="#f43f5e" intensity={4} distance={20} />
      </group>
    </group>
  );
}

// 4b. Shooting Stars — 25 streakers spread across the full sphere of space
const STAR_COLORS = [
  "#ffffff", "#e0f2fe", "#fef9c3", "#d8b4fe",
  "#bbf7d0", "#fecaca", "#bfdbfe", "#fed7aa",
];

interface StarDef {
  origin: THREE.Vector3;
  dir: THREE.Vector3;
  speed: number;
  range: number;
  phase: number;
  color: string;
  size: number;
  trailLen: number;
}

export function ShootingStars() {
  const groupRef = useRef<THREE.Group>(null!);

  // Build star definitions once (stable — no Math.random() in render)
  const stars = useMemo<StarDef[]>(() => {
    const list: StarDef[] = [];
    const count = 25;
    for (let i = 0; i < count; i++) {
      // Spread origins all over the sphere (radius 300–900)
      const theta = Math.acos(2 * (i / count) - 1);
      const phi   = (i * 2.399963) % (Math.PI * 2); // golden-angle spread
      const r     = 300 + (i % 7) * 90;
      const ox    = r * Math.sin(theta) * Math.cos(phi);
      const oy    = r * Math.sin(theta) * Math.sin(phi);
      const oz    = r * Math.cos(theta);

      // Direction: random-ish diagonal across the sphere
      const dx = Math.sin(phi + 1.1) * Math.cos(theta + 0.7);
      const dy = Math.cos(phi * 0.5 + i * 0.31);
      const dz = Math.sin(theta * 0.9 + i * 0.17);
      const dir = new THREE.Vector3(dx, dy, dz).normalize();

      list.push({
        origin: new THREE.Vector3(ox, oy, oz),
        dir,
        speed: 30 + (i % 8) * 15,     // Reduced speed: 30 – 135 units/sec
        range: 600 + (i % 5) * 120,     // wrap distance
        phase: (i / count) * 10,         // stagger start times
        color: STAR_COLORS[i % STAR_COLORS.length],
        size:  0.35 + (i % 4) * 0.15,
        trailLen: 18 + (i % 6) * 6,
      });
    }
    return list;
  }, []);

  // Refs for each star's group so we can mutate position directly
  const starRefs = useRef<(THREE.Group | null)[]>(
    Array.from({ length: 25 }, () => null)
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    stars.forEach((s, i) => {
      const g = starRefs.current[i];
      if (!g) return;
      const dist = ((t + s.phase) * s.speed) % s.range;
      g.position.set(
        s.origin.x + s.dir.x * dist,
        s.origin.y + s.dir.y * dist,
        s.origin.z + s.dir.z * dist,
      );
      // Orient the trail along the travel direction
      g.lookAt(
        g.position.x + s.dir.x,
        g.position.y + s.dir.y,
        g.position.z + s.dir.z,
      );
    });
  });

  return (
    <group ref={groupRef}>
      {stars.map((s, i) => (
        <group
          key={i}
          ref={(el) => { starRefs.current[i] = el; }}
        >
          {/* Glowing head */}
          <mesh>
            <sphereGeometry args={[s.size, 8, 8]} />
            <meshBasicMaterial color={s.color} />
          </mesh>

          {/* Tail — a thicker elongated box behind the head */}
          <mesh position={[0, 0, -s.trailLen / 2]}>
            <boxGeometry args={[s.size * 0.8, s.size * 0.8, s.trailLen]} />
            <meshBasicMaterial
              color={s.color}
              transparent
              opacity={0.45}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>

          {/* Soft point glow */}
          <pointLight color={s.color} intensity={2.5} distance={30} decay={2} />
        </group>
      ))}
    </group>
  );
}

// 4b. Mercury (Rocky, Cratered Planet)
export function MercuryPlanet({
  orbitRadius,
  size = 1.0,
  speed = 0.15,
  initialAngle = 0.5,
  children,
}: {
  orbitRadius: number;
  size?: number;
  speed?: number;
  initialAngle?: number;
  children?: React.ReactNode;
}) {
  const orbitGroupRef = useRef<THREE.Group>(null!);
  const meshRef = useRef<THREE.Mesh>(null!);

  const mercuryTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#737373";
      ctx.fillRect(0, 0, 512, 256);
      
      // Procedural Craters
      for (let i = 0; i < 600; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? "#525252" : "#8a8a8a";
        ctx.beginPath();
        ctx.arc(Math.random() * 512, Math.random() * 256, Math.random() * 6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime * speed + initialAngle;
    if (orbitGroupRef.current) {
      orbitGroupRef.current.position.x = Math.cos(t) * orbitRadius;
      orbitGroupRef.current.position.z = Math.sin(t) * orbitRadius;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group>
      <OrbitRing radius={orbitRadius} />

      <group ref={orbitGroupRef}>
        <mesh ref={meshRef}>
          <sphereGeometry args={[size, 64, 64]} />
          <meshStandardMaterial
            map={mercuryTexture || undefined}
            roughness={0.9}
            metalness={0.2}
          />
        </mesh>
        {children}
      </group>
    </group>
  );
}

// 4c. Venus (Hot, Cloudy, Yellow-Orange Planet)
export function VenusPlanet({
  orbitRadius,
  size = 1.0,
  speed = 0.12,
  initialAngle = 2.1,
  children,
}: {
  orbitRadius: number;
  size?: number;
  speed?: number;
  initialAngle?: number;
  children?: React.ReactNode;
}) {
  const orbitGroupRef = useRef<THREE.Group>(null!);
  const meshRef = useRef<THREE.Mesh>(null!);

  const venusTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Swirly/banded atmosphere
      const grad = ctx.createLinearGradient(0, 0, 0, 256);
      grad.addColorStop(0.0, "#d49a46");
      grad.addColorStop(0.2, "#e6b360");
      grad.addColorStop(0.4, "#cca35e");
      grad.addColorStop(0.6, "#f5cc7f");
      grad.addColorStop(0.8, "#d9aa55");
      grad.addColorStop(1.0, "#d49a46");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 256);

      // Add some subtle cloud bands
      ctx.fillStyle = "rgba(255, 230, 180, 0.15)";
      ctx.fillRect(0, 40, 512, 20);
      ctx.fillRect(0, 110, 512, 35);
      ctx.fillRect(0, 190, 512, 15);
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime * speed + initialAngle;
    if (orbitGroupRef.current) {
      orbitGroupRef.current.position.x = Math.cos(t) * orbitRadius;
      orbitGroupRef.current.position.z = Math.sin(t) * orbitRadius;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <group>
      <OrbitRing radius={orbitRadius} />

      <group ref={orbitGroupRef}>
        <mesh ref={meshRef}>
          <sphereGeometry args={[size, 64, 64]} />
          <meshStandardMaterial
            map={venusTexture || undefined}
            roughness={0.7}
            metalness={0.1}
          />
        </mesh>
        {children}
      </group>
    </group>
  );
}

// 4d. Earth (Blue Oceans, Green Continents, Clouds)
export function EarthPlanet({
  orbitRadius,
  size = 1.0,
  speed = 0.09,
  initialAngle = 4.2,
  children,
}: {
  orbitRadius: number;
  size?: number;
  speed?: number;
  initialAngle?: number;
  children?: React.ReactNode;
}) {
  const orbitGroupRef = useRef<THREE.Group>(null!);
  const meshRef = useRef<THREE.Mesh>(null!);
  const cloudRef = useRef<THREE.Mesh>(null!);
  const moonGroupRef = useRef<THREE.Group>(null!);

  const earthTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Oceans
      ctx.fillStyle = "#1e40af"; 
      ctx.fillRect(0, 0, 512, 256);

      // Procedural continents
      ctx.fillStyle = "#15803d"; 
      for (let i = 0; i < 60; i++) {
        ctx.beginPath();
        ctx.arc(
          Math.random() * 512, 
          Math.random() * 256, 
          Math.random() * 30 + 10, 
          0, 
          Math.PI * 2
        );
        ctx.fill();
      }
      
      // Ice caps
      ctx.fillStyle = "#f8fafc";
      ctx.fillRect(0, 0, 512, 20); // North pole
      ctx.fillRect(0, 236, 512, 20); // South pole
    }
    return new THREE.CanvasTexture(canvas);
  }, []);
  
  const cloudTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, 512, 256);
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      for (let i = 0; i < 150; i++) {
        ctx.beginPath();
        ctx.arc(
          Math.random() * 512, 
          Math.random() * 256, 
          Math.random() * 15, 
          0, 
          Math.PI * 2
        );
        ctx.fill();
      }
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  const moonTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#94a3b8";
      ctx.fillRect(0, 0, 256, 128);
      for (let i = 0; i < 200; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? "#64748b" : "#cbd5e1";
        ctx.beginPath();
        ctx.arc(Math.random() * 256, Math.random() * 128, Math.random() * 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime * speed + initialAngle;
    if (orbitGroupRef.current) {
      orbitGroupRef.current.position.x = Math.cos(t) * orbitRadius;
      orbitGroupRef.current.position.z = Math.sin(t) * orbitRadius;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4;
    }
    if (cloudRef.current) {
      cloudRef.current.rotation.y += delta * 0.5;
    }
    if (moonGroupRef.current) {
      moonGroupRef.current.rotation.y += delta * 0.8;
    }
  });

  return (
    <group>
      <OrbitRing radius={orbitRadius} />

      <group ref={orbitGroupRef}>
        <mesh ref={meshRef}>
          <sphereGeometry args={[size, 64, 64]} />
          <meshStandardMaterial
            map={earthTexture || undefined}
            roughness={0.8}
            metalness={0.2}
          />
        </mesh>
        <mesh ref={cloudRef} scale={1.02}>
          <sphereGeometry args={[size, 64, 64]} />
          <meshStandardMaterial
            map={cloudTexture || undefined}
            transparent
            opacity={0.8}
            depthWrite={false}
          />
        </mesh>
        {/* Glow */}
        <mesh scale={1.1}>
           <sphereGeometry args={[size, 32, 32]} />
           <meshBasicMaterial color="#38bdf8" transparent opacity={0.15} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
        
        {/* The Moon */}
        <group ref={moonGroupRef}>
          <mesh position={[size * 2.8, 0, 0]}>
            <sphereGeometry args={[size * 0.25, 32, 32]} />
            <meshStandardMaterial
              map={moonTexture || undefined}
              roughness={0.9}
              metalness={0.1}
            />
          </mesh>
        </group>

        {children}
      </group>
    </group>
  );
}

// 4e. Mars (Rusty Red/Orange Planet)
export function MarsPlanet({
  orbitRadius,
  size = 1.0,
  speed = 0.07,
  initialAngle = 1.2,
  children,
}: {
  orbitRadius: number;
  size?: number;
  speed?: number;
  initialAngle?: number;
  children?: React.ReactNode;
}) {
  const orbitGroupRef = useRef<THREE.Group>(null!);
  const meshRef = useRef<THREE.Mesh>(null!);

  const marsTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Base rusty red
      ctx.fillStyle = "#9a3412"; 
      ctx.fillRect(0, 0, 512, 256);

      // Darker rocky patches
      ctx.fillStyle = "#7c2d12"; 
      for (let i = 0; i < 80; i++) {
        ctx.beginPath();
        ctx.arc(
          Math.random() * 512, 
          Math.random() * 256, 
          Math.random() * 20 + 5, 
          0, 
          Math.PI * 2
        );
        ctx.fill();
      }

      // Lighter sandy patches
      ctx.fillStyle = "#c2410c"; 
      for (let i = 0; i < 60; i++) {
        ctx.beginPath();
        ctx.arc(
          Math.random() * 512, 
          Math.random() * 256, 
          Math.random() * 15 + 5, 
          0, 
          Math.PI * 2
        );
        ctx.fill();
      }
      
      // Ice caps (small)
      ctx.fillStyle = "#f8fafc";
      ctx.fillRect(0, 0, 512, 10); // North pole
      ctx.fillRect(0, 246, 512, 10); // South pole
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime * speed + initialAngle;
    if (orbitGroupRef.current) {
      orbitGroupRef.current.position.x = Math.cos(t) * orbitRadius;
      orbitGroupRef.current.position.z = Math.sin(t) * orbitRadius;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <group>
      <OrbitRing radius={orbitRadius} />

      <group ref={orbitGroupRef}>
        <mesh ref={meshRef}>
          <sphereGeometry args={[size, 64, 64]} />
          <meshStandardMaterial
            map={marsTexture || undefined}
            roughness={0.85}
            metalness={0.1}
          />
        </mesh>
        {/* Glow */}
        <mesh scale={1.1}>
           <sphereGeometry args={[size, 32, 32]} />
           <meshBasicMaterial color="#f43f5e" transparent opacity={0.15} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
        {children}
      </group>
    </group>
  );
}

// 5. Jupiter Gas Giant with Bands & Red Spot
export function JupiterPlanet({
  orbitRadius,
  size = 5.2,
  speed = 0.04,
  initialAngle = 3.5,
  children,
}: {
  orbitRadius: number;
  size?: number;
  speed?: number;
  initialAngle?: number;
  children?: React.ReactNode;
}) {
  const orbitGroupRef = useRef<THREE.Group>(null!);
  const meshRef = useRef<THREE.Mesh>(null!);

  const jupiterTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const grad = ctx.createLinearGradient(0, 0, 0, 256);
      grad.addColorStop(0.0, "#d8ca9d");
      grad.addColorStop(0.15, "#b59b73");
      grad.addColorStop(0.3, "#e6d5ac");
      grad.addColorStop(0.45, "#8c6747");
      grad.addColorStop(0.55, "#d9ab7e");
      grad.addColorStop(0.7, "#734f35");
      grad.addColorStop(0.85, "#c4a77d");
      grad.addColorStop(1.0, "#d8ca9d");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 256);

      // Great Red Spot
      ctx.fillStyle = "#a83e2a";
      ctx.beginPath();
      ctx.ellipse(320, 175, 45, 25, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime * speed + initialAngle;
    if (orbitGroupRef.current) {
      orbitGroupRef.current.position.x = Math.cos(t) * orbitRadius;
      orbitGroupRef.current.position.z = Math.sin(t) * orbitRadius;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <>
      <OrbitRing radius={orbitRadius} />
      <group ref={orbitGroupRef}>
        <mesh ref={meshRef} castShadow receiveShadow>
          <sphereGeometry args={[size, 64, 64]} />
          {jupiterTexture ? (
            <meshStandardMaterial map={jupiterTexture} roughness={0.6} />
          ) : (
            <meshStandardMaterial color="#d8ca9d" roughness={0.6} />
          )}
        </mesh>

        {/* Atmosphere Glow */}
        <mesh>
          <sphereGeometry args={[size * 1.08, 32, 32]} />
          <meshBasicMaterial
            color="#fbbf24"
            transparent
            opacity={0.2}
            side={THREE.BackSide}
          />
        </mesh>
        {children}
      </group>
    </>
  );
}

// 6. GLTF / Custom Planet Base
interface GLTFPlanetProps {
  modelPath?: string;
  orbitRadius: number;
  scale?: number;
  speed: number;
  initialAngle?: number;
  color?: string;
  hasRings?: boolean;
  ringColor?: string;
  atmosphereColor?: string;
  children?: React.ReactNode;
}

export function GLTFPlanet({
  modelPath,
  orbitRadius,
  scale = 2.5,
  speed,
  initialAngle = 0,
  color,
  hasRings = false,
  ringColor = "#e2e8f0",
  atmosphereColor,
  children,
}: GLTFPlanetProps) {
  const orbitGroupRef = useRef<THREE.Group>(null!);
  const planetRef = useRef<THREE.Group>(null!);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime * speed + initialAngle;
    if (orbitGroupRef.current) {
      orbitGroupRef.current.position.x = Math.cos(t) * orbitRadius;
      orbitGroupRef.current.position.z = Math.sin(t) * orbitRadius;
    }
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <>
      <OrbitRing radius={orbitRadius} />
      <group ref={orbitGroupRef}>
        <group ref={planetRef}>
          {modelPath ? (
            <SpaceModel path={modelPath} scale={scale} normalize={true} />
          ) : (
            <mesh castShadow receiveShadow>
              <sphereGeometry args={[scale, 48, 48]} />
              <meshStandardMaterial color={color || "#38bdf8"} roughness={0.6} />
            </mesh>
          )}
        </group>

        {atmosphereColor && (
          <mesh>
            <sphereGeometry args={[scale * 1.12, 32, 32]} />
            <meshBasicMaterial
              color={atmosphereColor}
              transparent
              opacity={0.25}
              side={THREE.BackSide}
            />
          </mesh>
        )}

        {hasRings && (
          <mesh rotation={[Math.PI / 3, 0, Math.PI / 8]}>
            <ringGeometry args={[scale * 1.35, scale * 2.2, 64]} />
            <meshStandardMaterial
              color={ringColor}
              side={THREE.DoubleSide}
              transparent
              opacity={0.8}
            />
          </mesh>
        )}

        {children}
      </group>
    </>
  );
}

// 7. High Orbit Flying Spaceships (FLYING HIGH ABOVE THE PLANETS)
export function HighOrbitSpaceships() {
  const ship1Ref = useRef<THREE.Group>(null!);
  const ship2Ref = useRef<THREE.Group>(null!);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    if (ship1Ref.current) {
      const radius = 50;
      const speed = 0.2;
      ship1Ref.current.position.x = Math.cos(t * speed) * radius;
      ship1Ref.current.position.z = Math.sin(t * speed) * radius;
      ship1Ref.current.position.y = 26 + Math.sin(t * 0.5) * 4;
      ship1Ref.current.rotation.y = -t * speed + Math.PI / 2;
      ship1Ref.current.rotation.z = Math.sin(t * 0.5) * 0.15;
    }

    if (ship2Ref.current) {
      const radius = 65;
      const speed = 0.15;
      ship2Ref.current.position.x = Math.cos(-t * speed + 2) * radius;
      ship2Ref.current.position.z = Math.sin(-t * speed + 2) * radius;
      ship2Ref.current.position.y = 36 + Math.cos(t * 0.4) * 5;
      ship2Ref.current.rotation.y = t * speed - Math.PI / 2;
      ship2Ref.current.rotation.x = 0.1;
    }
  });

  return (
    <group>
      <group ref={ship1Ref} position={[50, 26, 0]}>
        <SpaceModel
          path="/space/Spaceship by Quaternius - VSxUAFhzbA.glb"
          scale={1.5}
        />
      </group>

      <group ref={ship2Ref} position={[-65, 36, 0]}>
        <SpaceModel
          path="/space/Spaceship by Quaternius - uCeLfsdmNP.glb"
          scale={1.8}
        />
      </group>
    </group>
  );
}

// 8. International Space Station (ISS)
export function ISSStation(props: any) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.08;
    }
  });

  return (
    <group ref={groupRef} {...props}>
      <SpaceModel
        path="/space/International Space Station by Poly by Google - d3Fq5H6ne8E.glb"
        scale={0.025}
      />
    </group>
  );
}

// 9. Floating Astronaut (Spacewalker)
export function Spacewalker(props: any) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
      groupRef.current.position.y += Math.sin(state.clock.elapsedTime * 1.5) * 0.02;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group ref={groupRef} {...props}>
        <SpaceModel
          path="/space/Astronaut by Poly by Google - dLHpzNdygsg.glb"
          scale={0.4}
        />
      </group>
    </Float>
  );
}

// 10. Interactive Waypoint Button
interface SpaceWaypointProps {
  label: string;
  color: string;
  onClick: (label: string, position?: [number, number, number]) => void;
  offsetY?: number;
}

export function SpaceWaypoint({
  label,
  color,
  onClick,
  offsetY = 3.5,
}: SpaceWaypointProps) {
  const groupRef = useRef<THREE.Group>(null!);

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (groupRef.current) {
      const worldPos = new THREE.Vector3();
      groupRef.current.getWorldPosition(worldPos);
      onClick(label, [worldPos.x, worldPos.y, worldPos.z]);
    } else {
      onClick(label);
    }
  };

  return (
    <group ref={groupRef} position={[0, offsetY, 0]}>
      <Html center distanceFactor={50} zIndexRange={[100, 0]}>
        <button
          onClick={handleClick}
          className="group relative px-4 py-2 rounded-full border border-cyan-400/50 bg-slate-950/90 hover:bg-cyan-950/90 text-cyan-300 text-xs sm:text-sm font-mono font-bold tracking-wider shadow-xl backdrop-blur-md transition-all hover:scale-110 active:scale-95 flex items-center gap-2 whitespace-nowrap cursor-pointer"
          style={{ boxShadow: `0 0 20px ${color}88` }}
        >
          <span
            className="w-2.5 h-2.5 rounded-full animate-ping"
            style={{ backgroundColor: color }}
          />
          <span>{label}</span>
        </button>
      </Html>
    </group>
  );
}

// 11. Supermassive Black Hole — Gargantua style matching reference image
export function SupermassiveBlackHole({
  position = [650, 110, -550],
  scale = 2.0,
}: {
  position?: [number, number, number];
  scale?: number;
}) {
  const innerDiskRef  = useRef<THREE.InstancedMesh>(null!);
  const midDiskRef    = useRef<THREE.InstancedMesh>(null!);
  const outerDiskRef  = useRef<THREE.InstancedMesh>(null!);
  const perpRingRef   = useRef<THREE.InstancedMesh>(null!);
  const diskGroupRef  = useRef<THREE.Group>(null!);
  const perpGroupRef  = useRef<THREE.Group>(null!);
  const rockRingRef   = useRef<THREE.Group>(null!);
  const rockMeshRef   = useRef<THREE.InstancedMesh>(null!);

  // ── Layer 1: Dense inner glow zone — 3000 bright yellow particles
  const innerCount = 3000;
  const innerData = useMemo(() => {
    const dummy = new THREE.Object3D();
    const matrices: THREE.Matrix4[] = [];
    const colors: THREE.Color[] = [];
    const yellow = new THREE.Color("#ffff00");
    for (let i = 0; i < innerCount; i++) {
      const r = 25 + Math.pow(Math.random(), 0.6) * 12; // Reduced radius
      const angle = Math.random() * Math.PI * 2;
      const h = (Math.random() - 0.5) * 1.0;
      dummy.position.set(Math.cos(angle) * r, h, Math.sin(angle) * r);
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      const s = 0.3 + Math.random() * 0.5;
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      matrices.push(dummy.matrix.clone());
      colors.push(yellow.clone());
    }
    return { matrices, colors };
  }, [innerCount]);

  // ── Layer 2: Mid accretion disk — 5000 pure yellow particles
  const midCount = 5000;
  const midData = useMemo(() => {
    const dummy = new THREE.Object3D();
    const matrices: THREE.Matrix4[] = [];
    const colors: THREE.Color[] = [];
    const yellow = new THREE.Color("#ffff00");
    for (let i = 0; i < midCount; i++) {
      const r = 38 + Math.pow(Math.random(), 0.75) * 32; // Reduced radius
      const angle = Math.random() * Math.PI * 2;
      const h = (Math.random() - 0.5) * 1.8;
      dummy.position.set(Math.cos(angle) * r, h, Math.sin(angle) * r);
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      const s = 0.4 + Math.random() * 0.8;
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      matrices.push(dummy.matrix.clone());
      colors.push(yellow.clone());
    }
    return { matrices, colors };
  }, [midCount]);

  // ── Layer 3: Outer ring — 4000 pure yellow particles (tighter radius)
  const outerCount = 4000;
  const outerData = useMemo(() => {
    const dummy = new THREE.Object3D();
    const matrices: THREE.Matrix4[] = [];
    const colors: THREE.Color[] = [];
    const yellow = new THREE.Color("#ffff00");
    for (let i = 0; i < outerCount; i++) {
      const r = 70 + Math.pow(Math.random(), 1.0) * 45; // Reduced radius
      const angle = Math.random() * Math.PI * 2;
      const h = (Math.random() - 0.5) * (2.5 + (r - 70) / 25);
      dummy.position.set(Math.cos(angle) * r, h, Math.sin(angle) * r);
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      const s = 0.5 + Math.random() * 1.0;
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      matrices.push(dummy.matrix.clone());
      colors.push(yellow.clone());
    }
    return { matrices, colors };
  }, [outerCount]);

  // ── Small perpendicular ring — 1800 pure yellow rocks standing vertical
  const perpCount = 1800;
  const perpData = useMemo(() => {
    const dummy = new THREE.Object3D();
    const matrices: THREE.Matrix4[] = [];
    const colors: THREE.Color[] = [];
    const yellow = new THREE.Color("#ffff00");
    for (let i = 0; i < perpCount; i++) {
      const r = 35 + Math.pow(Math.random(), 0.8) * 25; // Increased radius
      const angle = Math.random() * Math.PI * 2;
      const h = (Math.random() - 0.5) * 2.5;
      dummy.position.set(Math.cos(angle) * r, Math.sin(angle) * r, h);
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      const s = 0.3 + Math.random() * 0.6;
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      matrices.push(dummy.matrix.clone());
      colors.push(yellow.clone());
    }
    return { matrices, colors };
  }, [perpCount]);

  // ── Yellow/Gold Asteroid Rock Ring
  const rockCount = 180000;
  const rockData = useMemo(() => {
    const dummy = new THREE.Object3D();
    const matrices: THREE.Matrix4[] = [];
    const innerRadius = 25; // Reduced radius
    const outerRadius = 115; // Reduced radius
    for (let i = 0; i < rockCount; i++) {
      const r = innerRadius + Math.random() * (outerRadius - innerRadius);
      const angle = Math.random() * Math.PI * 2;
      const h = (Math.random() - 0.5) * 0.05;
      dummy.position.set(Math.cos(angle) * r, h, Math.sin(angle) * r);
      dummy.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );
      // 2% chance for a massive, thick boulder rock, otherwise regular chunks
      const s = Math.random() > 0.98 ? 3.0 + Math.random() * 4.0 : 0.8 + Math.random() * 2.5;
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      matrices.push(dummy.matrix.clone());
    }
    return matrices;
  }, [rockCount]);

  // Upload all instance data to GPU
  const uploadToMesh = (
    meshRef: MutableRefObject<THREE.InstancedMesh>,
    data: { matrices: THREE.Matrix4[]; colors: THREE.Color[] }
  ) => {
    if (!meshRef.current) return;
    data.matrices.forEach((mat, i) => {
      meshRef.current.setMatrixAt(i, mat);
      meshRef.current.setColorAt(i, data.colors[i]);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  };

  useLayoutEffect(() => uploadToMesh(innerDiskRef,  innerData),  [innerData]);
  useLayoutEffect(() => uploadToMesh(midDiskRef,    midData),    [midData]);
  useLayoutEffect(() => uploadToMesh(outerDiskRef,  outerData),  [outerData]);
  useLayoutEffect(() => uploadToMesh(perpRingRef,   perpData),   [perpData]);

  useLayoutEffect(() => {
    if (!rockMeshRef.current) return;
    rockData.forEach((mat, i) => {
      rockMeshRef.current.setMatrixAt(i, mat);
    });
    rockMeshRef.current.instanceMatrix.needsUpdate = true;
  }, [rockData]);

  // Slow orbital rotation
  useFrame((_, delta) => {
    if (diskGroupRef.current) diskGroupRef.current.rotation.y += delta * 0.04;
    if (perpGroupRef.current) perpGroupRef.current.rotation.z -= delta * 0.06;
    if (rockRingRef.current) rockRingRef.current.rotation.y += delta * 0.015;
  });

  return (
    <group position={position} scale={scale}>
      {/* Pitch-black event horizon sphere */}
      <mesh renderOrder={2}>
        <sphereGeometry args={[35, 64, 64]} />
        <meshBasicMaterial color="#000000" depthWrite />
      </mesh>

      {/* Horizontal crossing light band — Saturn-like torus over the equator */}
      <mesh rotation={[0, 0, 0.05]} renderOrder={3}>
        <torusGeometry args={[37, 2.5, 16, 120]} />
        <meshBasicMaterial color="#ffff00" transparent opacity={0.7} />
      </mesh>
      <mesh rotation={[0, 0, 0.05]} renderOrder={3}>
        <torusGeometry args={[37.5, 5, 16, 120]} />
        <meshBasicMaterial color="#ffff00" transparent opacity={0.4} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* All 3 disk layers rotate together */}
      <group ref={diskGroupRef}>
        {/* Inner bright glow zone */}
        <instancedMesh ref={innerDiskRef} args={[undefined, undefined, innerCount]}>
          <boxGeometry args={[0.7, 0.7, 0.7]} />
          <meshBasicMaterial vertexColors transparent opacity={0.6} blending={THREE.AdditiveBlending} />
        </instancedMesh>

        {/* Mid yellow-orange disk */}
        <instancedMesh ref={midDiskRef} args={[undefined, undefined, midCount]}>
          <boxGeometry args={[1.0, 1.0, 1.0]} />
          <meshBasicMaterial vertexColors transparent opacity={0.45} blending={THREE.AdditiveBlending} />
        </instancedMesh>

        {/* Outer sparse orange-red cloud */}
        <instancedMesh ref={outerDiskRef} args={[undefined, undefined, outerCount]}>
          <boxGeometry args={[1.2, 1.2, 1.2]} />
          <meshBasicMaterial vertexColors transparent opacity={0.3} blending={THREE.AdditiveBlending} />
        </instancedMesh>
      </group>

      {/* Small perpendicular ring — stands vertical (90° to the disk) */}
      <group ref={perpGroupRef} rotation={[Math.PI / 2, 0, 0]}>
        <instancedMesh ref={perpRingRef} args={[undefined, undefined, perpCount]}>
          <boxGeometry args={[0.8, 0.8, 0.8]} />
          <meshBasicMaterial vertexColors transparent opacity={0.65} blending={THREE.AdditiveBlending} />
        </instancedMesh>
      </group>

      {/* Yellow/Gold Rock Asteroid Ring */}
      <group ref={rockRingRef}>
        <instancedMesh ref={rockMeshRef} args={[undefined, undefined, rockCount]}>
          <icosahedronGeometry args={[0.25, 0]} />
          <meshStandardMaterial
            color="#FFFFEE"
            roughness={0.8}
            metalness={0.2}
            emissive="#FFFF00"
            emissiveIntensity={0.6}
          />
        </instancedMesh>
      </group>

      {/* Bright core glow light */}
      <pointLight color="#ffff00" intensity={4.5} distance={400} decay={1.3} />
    </group>
  );
}

// Reusable helper function to build galaxy points data
export function createMiniGalaxy({
  count = 3000,
  branches = 6,
  radius = 120,
  colorCore = "#fff7ed",
  colorInner = "#ec4899",
  colorMid = "#8b5cf6",
  colorOuter = "#06b6d4"
}) {
  const posArr = new Float32Array(count * 3);
  const colArr = new Float32Array(count * 3);

  const cCore = new THREE.Color(colorCore);
  const cInner = new THREE.Color(colorInner);
  const cMid = new THREE.Color(colorMid);
  const cOuter = new THREE.Color(colorOuter);

  for (let i = 0; i < count; i++) {
    const r = Math.pow(Math.random(), 2) * radius;
    const armAngle = ((i % branches) / branches) * Math.PI * 2;
    const spinAngle = r * (0.012 * (120 / radius));
    const angle = armAngle + spinAngle + (Math.random() - 0.5) * 0.28;

    const randomY = (Math.random() - 0.5) * (15 * (radius / 120) * Math.exp(-r / (radius * 0.38)));

    posArr[i * 3] = Math.cos(angle) * r;
    posArr[i * 3 + 1] = randomY;
    posArr[i * 3 + 2] = Math.sin(angle) * r;

    const normR = r / radius;
    let c: THREE.Color;
    if (normR < 0.15) {
      c = cCore.clone().lerp(cInner, normR / 0.15);
    } else if (normR < 0.5) {
      c = cInner.clone().lerp(cMid, (normR - 0.15) / 0.35);
    } else {
      c = cMid.clone().lerp(cOuter, (normR - 0.5) / 0.5);
    }

    colArr[i * 3] = c.r;
    colArr[i * 3 + 1] = c.g;
    colArr[i * 3 + 2] = c.b;
  }
  return { positions: posArr, colors: colArr };
}

// Reusable React Component for a Single Spiral Galaxy
export function MiniGalaxy({
  position = [0, 0, 0],
  scale = 1.0,
  rotation = [0, 0, 0] as any,
  count = 3000,
  branches = 6,
  radius = 120,
  colorCore = "#fff7ed",
  colorInner = "#ec4899",
  colorMid = "#8b5cf6",
  colorOuter = "#06b6d4",
  spinSpeed = 0.015,
}: {
  position?: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
  count?: number;
  branches?: number;
  radius?: number;
  colorCore?: string;
  colorInner?: string;
  colorMid?: string;
  colorOuter?: string;
  spinSpeed?: number;
}) {
  const galaxyRef = useRef<THREE.Group>(null!);

  const { positions, colors } = useMemo(() => {
    return createMiniGalaxy({ count, branches, radius, colorCore, colorInner, colorMid, colorOuter });
  }, [count, branches, radius, colorCore, colorInner, colorMid, colorOuter]);

  useFrame((_, delta) => {
    if (galaxyRef.current) {
      galaxyRef.current.rotation.y += delta * spinSpeed;
    }
  });

  return (
    <group position={position} scale={scale} rotation={rotation}>
      {/* Galactic Core Brightness */}
      <mesh>
        <sphereGeometry args={[radius * 0.08, 16, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
      </mesh>
      <mesh>
        <sphereGeometry args={[radius * 0.18, 16, 16]} />
        <meshBasicMaterial
          color={colorInner}
          transparent
          opacity={0.3}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Spiral Arms Star Cluster */}
      <group ref={galaxyRef}>
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[positions, 3]}
            />
            <bufferAttribute
              attach="attributes-color"
              args={[colors, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={radius * 0.014}
            vertexColors
            transparent
            opacity={0.8}
            blending={THREE.AdditiveBlending}
          />
        </points>
      </group>
    </group>
  );
}

// 6. Saturn (Gas Giant with Rings)
export function SaturnPlanet({
  orbitRadius,
  size = 4.2,
  speed = 0.03,
  initialAngle = 5.1,
  children,
}: {
  orbitRadius: number;
  size?: number;
  speed?: number;
  initialAngle?: number;
  children?: React.ReactNode;
}) {
  const orbitGroupRef = useRef<THREE.Group>(null!);
  const meshRef = useRef<THREE.Mesh>(null!);
  const ringRef = useRef<THREE.Mesh>(null!);

  const saturnTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const grad = ctx.createLinearGradient(0, 0, 0, 256);
      grad.addColorStop(0.0, "#d1b48c"); // Tan
      grad.addColorStop(0.2, "#e6cc98"); // Light yellow/tan
      grad.addColorStop(0.4, "#cda573"); // Darker tan
      grad.addColorStop(0.6, "#f4e0c4"); // Pale
      grad.addColorStop(0.8, "#cda573"); // Darker tan
      grad.addColorStop(1.0, "#d1b48c"); // Tan
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 256);
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  const ringTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 4;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const grad = ctx.createLinearGradient(0, 0, 256, 0);
      grad.addColorStop(0.0, "rgba(200, 180, 140, 0.0)");
      grad.addColorStop(0.1, "rgba(220, 200, 160, 0.8)");
      grad.addColorStop(0.3, "rgba(180, 150, 110, 0.6)");
      grad.addColorStop(0.5, "rgba(240, 220, 180, 0.9)");
      grad.addColorStop(0.7, "rgba(160, 130, 90, 0.4)");
      grad.addColorStop(0.9, "rgba(210, 190, 150, 0.7)");
      grad.addColorStop(1.0, "rgba(200, 180, 140, 0.0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 4);
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime * speed + initialAngle;
    if (orbitGroupRef.current) {
      orbitGroupRef.current.position.x = Math.cos(t) * orbitRadius;
      orbitGroupRef.current.position.z = Math.sin(t) * orbitRadius;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.3;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z -= delta * 0.1;
    }
  });

  return (
    <group>
      <OrbitRing radius={orbitRadius} />

      <group ref={orbitGroupRef}>
        {/* Planet */}
        <mesh ref={meshRef}>
          <sphereGeometry args={[size, 64, 64]} />
          <meshStandardMaterial
            map={saturnTexture || undefined}
            roughness={0.6}
            metalness={0.1}
          />
        </mesh>
        
        {/* Rings */}
        <mesh ref={ringRef} rotation={[Math.PI / 2.2, 0, 0]}>
          <ringGeometry args={[size * 1.3, size * 2.2, 64]} />
          <meshStandardMaterial
            map={ringTexture || undefined}
            side={THREE.DoubleSide}
            transparent
            opacity={0.9}
            roughness={0.5}
          />
        </mesh>

        {children}
      </group>
    </group>
  );
}

// 7. Uranus (Ice Giant with Vertical Rings)
export function UranusPlanet({
  orbitRadius,
  size = 3.2,
  speed = 0.02,
  initialAngle = 2.5,
  children,
}: {
  orbitRadius: number;
  size?: number;
  speed?: number;
  initialAngle?: number;
  children?: React.ReactNode;
}) {
  const orbitGroupRef = useRef<THREE.Group>(null!);
  const meshRef = useRef<THREE.Mesh>(null!);
  const ringRef = useRef<THREE.Mesh>(null!);

  const uranusTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const grad = ctx.createLinearGradient(0, 0, 0, 256);
      grad.addColorStop(0.0, "#a5f3fc"); // Cyan 200
      grad.addColorStop(0.5, "#67e8f9"); // Cyan 300
      grad.addColorStop(1.0, "#a5f3fc"); // Cyan 200
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 256);
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  const ringTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 4;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const grad = ctx.createLinearGradient(0, 0, 256, 0);
      grad.addColorStop(0.0, "rgba(255, 255, 255, 0.0)");
      grad.addColorStop(0.4, "rgba(255, 255, 255, 0.1)");
      grad.addColorStop(0.5, "rgba(255, 255, 255, 0.4)");
      grad.addColorStop(0.6, "rgba(255, 255, 255, 0.1)");
      grad.addColorStop(1.0, "rgba(255, 255, 255, 0.0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 4);
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime * speed + initialAngle;
    if (orbitGroupRef.current) {
      orbitGroupRef.current.position.x = Math.cos(t) * orbitRadius;
      orbitGroupRef.current.position.z = Math.sin(t) * orbitRadius;
    }
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.4;
    }
    if (ringRef.current) {
      ringRef.current.rotation.y -= delta * 0.2;
    }
  });

  return (
    <group>
      <OrbitRing radius={orbitRadius} />

      <group ref={orbitGroupRef}>
        {/* Planet */}
        <mesh ref={meshRef} rotation={[0, 0, Math.PI / 2]}>
          <sphereGeometry args={[size, 64, 64]} />
          <meshStandardMaterial
            map={uranusTexture || undefined}
            roughness={0.4}
            metalness={0.2}
          />
        </mesh>
        
        {/* Vertical Rings */}
        <mesh ref={ringRef} rotation={[0, Math.PI / 2, 0]}>
          <ringGeometry args={[size * 1.5, size * 1.8, 64]} />
          <meshStandardMaterial
            map={ringTexture || undefined}
            side={THREE.DoubleSide}
            transparent
            opacity={0.6}
            depthWrite={false}
          />
        </mesh>
        
        {/* Glow */}
        <mesh scale={1.05}>
           <sphereGeometry args={[size, 32, 32]} />
           <meshBasicMaterial color="#a5f3fc" transparent opacity={0.1} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>

        {children}
      </group>
    </group>
  );
}

// 8. Neptune (Deep Blue Ice/Gas Giant)
export function NeptunePlanet({
  orbitRadius,
  size = 3.0,
  speed = 0.015,
  initialAngle = 1.7,
  children,
}: {
  orbitRadius: number;
  size?: number;
  speed?: number;
  initialAngle?: number;
  children?: React.ReactNode;
}) {
  const orbitGroupRef = useRef<THREE.Group>(null!);
  const meshRef = useRef<THREE.Mesh>(null!);

  const neptuneTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Deep azure/blue gradient
      const grad = ctx.createLinearGradient(0, 0, 0, 256);
      grad.addColorStop(0.0, "#1e3a8a"); // Blue 900
      grad.addColorStop(0.3, "#1d4ed8"); // Blue 700
      grad.addColorStop(0.5, "#2563eb"); // Blue 600
      grad.addColorStop(0.7, "#1d4ed8"); // Blue 700
      grad.addColorStop(1.0, "#1e3a8a"); // Blue 900
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 256);

      // Faint high-altitude cloud streaks
      ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
      ctx.fillRect(0, 80, 512, 5);
      ctx.fillRect(0, 150, 512, 8);
      
      // A dark spot (like the Great Dark Spot)
      ctx.fillStyle = "#172554"; // Blue 950
      ctx.beginPath();
      ctx.ellipse(350, 130, 30, 15, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime * speed + initialAngle;
    if (orbitGroupRef.current) {
      orbitGroupRef.current.position.x = Math.cos(t) * orbitRadius;
      orbitGroupRef.current.position.z = Math.sin(t) * orbitRadius;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.35;
    }
  });

  return (
    <group>
      <OrbitRing radius={orbitRadius} />

      <group ref={orbitGroupRef}>
        <mesh ref={meshRef}>
          <sphereGeometry args={[size, 64, 64]} />
          <meshStandardMaterial
            map={neptuneTexture || undefined}
            roughness={0.5}
            metalness={0.1}
          />
        </mesh>
        
        {/* Glow */}
        <mesh scale={1.05}>
           <sphereGeometry args={[size, 32, 32]} />
           <meshBasicMaterial color="#3b82f6" transparent opacity={0.15} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>

        {children}
      </group>
    </group>
  );
}

// 9. Pluto (Dwarf Planet with Heart-shaped Glacier)
export function PlutoPlanet({
  orbitRadius,
  size = 0.8,
  speed = 0.008,
  initialAngle = 0.5,
  children,
}: {
  orbitRadius: number;
  size?: number;
  speed?: number;
  initialAngle?: number;
  children?: React.ReactNode;
}) {
  const orbitGroupRef = useRef<THREE.Group>(null!);
  const meshRef = useRef<THREE.Mesh>(null!);

  const plutoTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Base rocky/icy tan color
      ctx.fillStyle = "#a89f91";
      ctx.fillRect(0, 0, 512, 256);

      // Darker reddish/brown region (Cthulhu Macula)
      ctx.fillStyle = "#5c4033";
      ctx.beginPath();
      ctx.ellipse(150, 150, 80, 40, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // The Heart (Tombaugh Regio) - bright icy white/tan
      ctx.fillStyle = "#f3eada";
      ctx.beginPath();
      ctx.moveTo(300, 100);
      ctx.bezierCurveTo(300, 70, 250, 70, 250, 100);
      ctx.bezierCurveTo(250, 70, 200, 70, 200, 100);
      ctx.bezierCurveTo(200, 140, 250, 170, 250, 190);
      ctx.bezierCurveTo(250, 170, 300, 140, 300, 100);
      ctx.fill();
      
      // Procedural craters
      for (let i = 0; i < 100; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.15)";
        ctx.beginPath();
        ctx.arc(Math.random() * 512, Math.random() * 256, Math.random() * 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime * speed + initialAngle;
    if (orbitGroupRef.current) {
      orbitGroupRef.current.position.x = Math.cos(t) * orbitRadius;
      orbitGroupRef.current.position.z = Math.sin(t) * orbitRadius;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group>
      <OrbitRing radius={orbitRadius} />

      <group ref={orbitGroupRef}>
        <mesh ref={meshRef}>
          <sphereGeometry args={[size, 64, 64]} />
          <meshStandardMaterial
            map={plutoTexture || undefined}
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>
        {children}
      </group>
    </group>
  );
}

// 7. Background Galaxy (Pink / Purple Spiral) Galaxy (Refactored wrapper)
export function BackgroundGalaxy({
  position = [-650, 120, -600],
  scale = 2.5,
}: {
  position?: [number, number, number];
  scale?: number;
}) {
  return (
    <MiniGalaxy
      position={position}
      scale={scale}
      rotation={[Math.PI / 3, -Math.PI / 6, 0]}
      count={25000}
      branches={12}
      radius={320}
      spinSpeed={0.015}
    />
  );
}

// 12b. Giant Tricolor Spiral Galaxy — green / red / white
export function GiantTricolorGalaxy({
  position = [200, -180, -1400],
  scale = 1.0,
}: {
  position?: [number, number, number];
  scale?: number;
}) {
  const galaxyRef   = useRef<THREE.Group>(null!);
  const coreRef     = useRef<THREE.Group>(null!);

  const STAR_COUNT  = 30_000;
  const BRANCHES    = 10;
  const RADIUS      = 550;

  const { positions, colors } = useMemo(() => {
    const posArr = new Float32Array(STAR_COUNT * 3);
    const colArr = new Float32Array(STAR_COUNT * 3);

    // Colour stops: brilliant green core → fiery red arms → pure white fringe
    const cGreen  = new THREE.Color("#00ff88");
    const cRed    = new THREE.Color("#ff2244");
    const cOrange = new THREE.Color("#ff6600");
    const cWhite  = new THREE.Color("#ffffff");

    for (let i = 0; i < STAR_COUNT; i++) {
      const r         = Math.pow(Math.random(), 1.6) * RADIUS;
      const armAngle  = ((i % BRANCHES) / BRANCHES) * Math.PI * 2;
      const spinAngle = r * 0.009;
      const scatter   = (Math.random() - 0.5) * 0.35;
      const angle     = armAngle + spinAngle + scatter;

      // Height profile: flat disk with slight bulge at core
      const h = (Math.random() - 0.5) * 28 * Math.exp(-r / (RADIUS * 0.35));

      posArr[i * 3]     = Math.cos(angle) * r;
      posArr[i * 3 + 1] = h;
      posArr[i * 3 + 2] = Math.sin(angle) * r;

      // Colour zones
      const n = r / RADIUS;          // 0 = core, 1 = edge
      let c: THREE.Color;
      if (n < 0.15) {
        c = cGreen.clone().lerp(cGreen, n / 0.15);
      } else if (n < 0.45) {
        c = cGreen.clone().lerp(cRed, (n - 0.15) / 0.30);
      } else if (n < 0.75) {
        c = cRed.clone().lerp(cOrange, (n - 0.45) / 0.30);
      } else {
        c = cOrange.clone().lerp(cWhite, (n - 0.75) / 0.25);
      }

      colArr[i * 3]     = c.r;
      colArr[i * 3 + 1] = c.g;
      colArr[i * 3 + 2] = c.b;
    }
    return { positions: posArr, colors: colArr };
  }, []);

  useFrame((_, delta) => {
    if (galaxyRef.current) galaxyRef.current.rotation.y += delta * 0.008;
    if (coreRef.current)   coreRef.current.rotation.y   += delta * 0.025;
  });

  return (
    <group position={position} scale={scale} rotation={[Math.PI / 5, -Math.PI / 6, 0.3]}>
      {/* Glowing core */}
      <mesh>
        <sphereGeometry args={[RADIUS * 0.045, 20, 20]} />
        <meshBasicMaterial color="#aaffcc" transparent opacity={0.95} />
      </mesh>
      <mesh>
        <sphereGeometry args={[RADIUS * 0.12, 20, 20]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={0.18} side={THREE.BackSide} />
      </mesh>

      {/* Slowly spinning core glow group */}
      <group ref={coreRef}>
        <pointLight color="#00ff88" intensity={6} distance={800} decay={1.4} />
      </group>

      {/* Spiral arms star field */}
      <group ref={galaxyRef}>
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[positions, 3]} />
            <bufferAttribute attach="attributes-color"    args={[colors, 3]} />
          </bufferGeometry>
          <pointsMaterial
            size={RADIUS * 0.007}
            vertexColors
            transparent
            opacity={0.85}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
      </group>
    </group>
  );
}

// Multiple background mini galaxies component — distributed over the FULL sphere of space
export function MultipleBackgroundGalaxies() {
  const galaxies = useMemo(() => {
    const palettes = [
      { core: "#fff7ed", inner: "#ec4899", mid: "#8b5cf6", outer: "#06b6d4" },
      { core: "#fffbeb", inner: "#f59e0b", mid: "#ef4444", outer: "#ec4899" },
      { core: "#f0fdf4", inner: "#10b981", mid: "#06b6d4", outer: "#3b82f6" },
      { core: "#faf5ff", inner: "#a855f7", mid: "#ec4899", outer: "#6366f1" },
      { core: "#fff1f2", inner: "#f43f5e", mid: "#fb923c", outer: "#fbbf24" },
      { core: "#ecfeff", inner: "#22d3ee", mid: "#818cf8", outer: "#c084fc" },
      { core: "#fefce8", inner: "#eab308", mid: "#f97316", outer: "#ec4899" },
      { core: "#f0f9ff", inner: "#38bdf8", mid: "#a78bfa", outer: "#f472b6" },
      // Green galaxy palette
      { core: "#f0fdf4", inner: "#4ade80", mid: "#22c55e", outer: "#86efac" },
    ];

    // 24 galaxies: deliberately placed all around the full sphere
    const placements: Array<[number, number, number]> = [
      // --- Near black hole region ---
      [1100,  200, -900],
      [ 300,  -80, -1200],
      [ 900,  400, -300],
      // --- Opposite side (near/behind solar system) ---
      [-800,  150,  500],
      [-600, -200,  700],
      [-1100,  50,  200],
      // --- Above the whole scene ---
      [ 100,  900, -400],
      [-300,  750,  600],
      [ 700, 1100,  100],
      // --- Below the whole scene ---
      [ 200, -800,  300],
      [-400, -700, -500],
      [ 800, -900, -200],
      // --- Far +Z side ---
      [  50,  100, 1100],
      [ 500, -300,  950],
      [-200,  500, 1300],
      // --- Far -Z side ---
      [-100,  200, -1200],
      [ 400, -400, -1000],
      [-700,  300, -800],
      // --- Deep diagonal corners ---
      [1200, -300,  700],
      [-900,  600, -700],
      [ 600,  800,  900],
      [-1000,-500,  600],
      [ 350, -600, -900],
      [-500,  900, -100],
      // --- Green galaxy ---
      [-200, -300, -1100],
    ];

    return placements.map((pos, i) => {
      // Last entry always uses the green palette
      const isGreen = i === placements.length - 1;
      const p = isGreen ? palettes[palettes.length - 1] : palettes[i % (palettes.length - 1)];
      return {
        id: i,
        position: pos as [number, number, number],
        scale: isGreen ? 0.26 : 0.14 + (i % 5) * 0.03,
        rotation: [
          Math.PI * ((i * 0.37) % 2),
          Math.PI * ((i * 0.61) % 2),
          Math.PI * ((i * 0.19) % 2),
        ] as [number, number, number],
        count: isGreen ? 6000 : 2500 + (i % 4) * 1000,
        branches: isGreen ? 8 : 4 + (i % 5),
        radius: isGreen ? 150 : 90 + (i % 5) * 15,
        colorCore: p.core,
        colorInner: p.inner,
        colorMid: p.mid,
        colorOuter: p.outer,
        spinSpeed: isGreen ? 0.018 : 0.007 + (i % 8) * 0.001,
      };
    });
  }, []);

  return (
    <>
      {galaxies.map((g) => (
        <MiniGalaxy
          key={g.id}
          position={g.position}
          scale={g.scale}
          rotation={g.rotation}
          count={g.count}
          branches={g.branches}
          radius={g.radius}
          colorCore={g.colorCore}
          colorInner={g.colorInner}
          colorMid={g.colorMid}
          colorOuter={g.colorOuter}
          spinSpeed={g.spinSpeed}
        />
      ))}
    </>
  );
}


// 13. Distant Asteroid Field
export function DistantAsteroidField() {
  const pointsRef = useRef<THREE.Points>(null!);
  const count = 15000;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const minRadius = 850;
    const maxRadius = 1650;

    const colorOptions = [
      new THREE.Color("#888888"),
      new THREE.Color("#aaaaaa"),
      new THREE.Color("#667788"),
      new THREE.Color("#778899"),
    ];

    for (let i = 0; i < count; i++) {
      const r = minRadius + Math.random() * (maxRadius - minRadius);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
      cols[i * 3] = color.r;
      cols[i * 3 + 1] = color.g;
      cols[i * 3 + 2] = color.b;
    }
    return [pos, cols];
  }, [count]);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.018; // ~0.0003 rad per frame at 60fps
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={4.5}
        vertexColors
        transparent
        opacity={0.7}
        depthWrite={false}
      />
    </points>
  );
}

// Preload GLTF Space Models
// 16. Milky Way Band
export function MilkyWay() {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const COUNT = 40000;

  const { matrices, colors } = useMemo(() => {
    const mats: THREE.Matrix4[] = [];
    const cols: THREE.Color[] = [];
    const dummy = new THREE.Object3D();
    
    // Mix of ethereal milky way colors
    const palette = ["#d8b4fe", "#818cf8", "#fbcfe8", "#ffffff", "#c7d2fe", "#fde047", "#38bdf8"];
    
    for (let i = 0; i < COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 600 + Math.random() * 600; // 600 to 1200 distance
      
      // Focus particles tightly around the central plane, with some spread
      // A power function creates a dense core and sparse edges, adjusting power and multiplier for a moderate thickness
      const spread = (Math.random() - 0.5) * 2; // -1 to 1
      const spreadY = Math.sign(spread) * Math.pow(Math.abs(spread), 2.5) * 280; 
      
      const finalRadius = radius + (Math.random() - 0.5) * 200;
      
      dummy.position.set(
        Math.cos(angle) * finalRadius,
        spreadY,
        Math.sin(angle) * finalRadius
      );
      
      dummy.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      const size = Math.random() * 2.0 + 0.5;
      dummy.scale.setScalar(size);
      dummy.updateMatrix();
      
      mats.push(dummy.matrix.clone());
      
      // Assign random color from palette
      cols.push(new THREE.Color(palette[Math.floor(Math.random() * palette.length)]));
    }
    return { matrices: mats, colors: cols };
  }, []);

  useLayoutEffect(() => {
    if (!meshRef.current) return;
    matrices.forEach((m, i) => meshRef.current.setMatrixAt(i, m));
    colors.forEach((c, i) => meshRef.current.setColorAt(i, c));
    
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  }, [matrices, colors]);

  // Rotate the entire band so it sits diagonally in the sky
  return (
    <group rotation={[Math.PI / 3.5, 0, Math.PI / 5]}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]} frustumCulled={false}>
        <sphereGeometry args={[1, 4, 4]} />
        <meshBasicMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.65} 
          blending={THREE.AdditiveBlending} 
          depthWrite={false} 
        />
      </instancedMesh>
    </group>
  );
}

// 12c. Medium Galaxy at the bottom of the solar system
export function BottomGalaxy({
  position = [0, -450, 0],
  scale = 1.2,
}: {
  position?: [number, number, number];
  scale?: any;
}) {
  return (
    <MiniGalaxy
      position={position}
      scale={[2.2 * (scale as number), 1.2 * (scale as number), 0.7 * (scale as number)] as any}
      rotation={[-Math.PI / 2.5, 0, Math.PI / 4]}
      count={24000}
      branches={24}
      radius={200}
      colorCore="#fef08a"
      colorInner="#f97316"
      colorMid="#eab308"
      colorOuter="#3b82f6"
      spinSpeed={0.02}
    />
  );
}

// 12d. Red Nebula
export function RedNebula({
  position = [0, 0, 0],
  scale = 1.0,
}: {
  position?: [number, number, number];
  scale?: number;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const COUNT = 18000;

  const { matrices, colors } = useMemo(() => {
    const mats: THREE.Matrix4[] = [];
    const cols: THREE.Color[] = [];
    const dummy = new THREE.Object3D();
    
    // Deep reds, magentas, and bright whites for stars
    const palette = ["#be123c", "#e11d48", "#f43f5e", "#86198f", "#d946ef", "#ffffff", "#fda4af"];
    
    for (let i = 0; i < COUNT; i++) {
      // Create 3 main clumps/nodes
      const clump = Math.floor(Math.random() * 3);
      let cx = 0, cy = 0, cz = 0;
      if (clump === 0) { cx = -80; cy = 40; cz = 0; }
      if (clump === 1) { cx = 50; cy = -60; cz = 30; }
      if (clump === 2) { cx = 20; cy = 80; cz = -20; }
      
      const r = Math.random() * 80 + Math.random() * 50;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      
      const x = cx + r * Math.sin(phi) * Math.cos(theta);
      const y = cy + r * Math.sin(phi) * Math.sin(theta);
      const z = cz + r * Math.cos(phi);

      dummy.position.set(x, y, z);
      const s = Math.random() * 2.0 + 0.5;
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      mats.push(dummy.matrix.clone());

      cols.push(new THREE.Color(palette[Math.floor(Math.random() * palette.length)]));
    }
    return { matrices: mats, colors: cols };
  }, []);

  useLayoutEffect(() => {
    if (!meshRef.current) return;
    matrices.forEach((m, i) => meshRef.current.setMatrixAt(i, m));
    colors.forEach((c, i) => meshRef.current.setColorAt(i, c));
    
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  }, [matrices, colors]);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.01;
      meshRef.current.rotation.z += delta * 0.005;
    }
  });

  return (
    <group position={position} scale={scale}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]} frustumCulled={false}>
        <sphereGeometry args={[2.5, 4, 4]} />
        <meshBasicMaterial vertexColors transparent opacity={0.85} blending={THREE.AdditiveBlending} depthWrite={false} />
      </instancedMesh>
    </group>
  );
}

useGLTF.preload("/space/Sun by Jarlan Perez - 3XZEucM6wC7.glb");
useGLTF.preload("/space/Black hole by Poly by Google - bUEMVxbw9Zr.glb");
useGLTF.preload("/space/Mars by Jarlan Perez - 8sNKYRTUFAe.glb");
useGLTF.preload("/space/Saturn by Jarlan Perez - b-y9HDTsu7q.glb");
useGLTF.preload("/space/Neptune by Poly by Google - fxLCXXDYUwC.glb");
useGLTF.preload("/space/Planet by Quaternius - IVnmauIgWX.glb");
useGLTF.preload("/space/Astronaut by Poly by Google - dLHpzNdygsg.glb");
useGLTF.preload("/space/International Space Station by Poly by Google - d3Fq5H6ne8E.glb");
useGLTF.preload("/space/Spaceship by Quaternius - VSxUAFhzbA.glb");
useGLTF.preload("/space/Spaceship by Quaternius - uCeLfsdmNP.glb");
