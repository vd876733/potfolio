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
          opacity={0.25}
          side={THREE.BackSide}
        />
      </mesh>
      <pointLight intensity={25} color="#ffaa00" distance={220} decay={1} />
      <pointLight intensity={15} color="#ffffff" distance={140} decay={1} />
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

// 4. Shooting Comets
export function ShootingComets() {
  const comet1 = useRef<THREE.Group>(null!);
  const comet2 = useRef<THREE.Group>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (comet1.current) {
      const speed = 25;
      const pos = (t * speed) % 250 - 125;
      comet1.current.position.set(pos, 45 - pos * 0.2, -40 + pos * 0.3);
    }
    if (comet2.current) {
      const speed = 20;
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

  // ── Layer 1: Dense inner glow zone — 1500 bright yellow particles
  const innerCount = 1500;
  const innerData = useMemo(() => {
    const dummy = new THREE.Object3D();
    const matrices: THREE.Matrix4[] = [];
    const colors: THREE.Color[] = [];
    const yellow = new THREE.Color("#ffff00");
    for (let i = 0; i < innerCount; i++) {
      const r = 38 + Math.pow(Math.random(), 0.6) * 17;
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

  // ── Layer 2: Mid accretion disk — 2500 pure yellow particles
  const midCount = 2500;
  const midData = useMemo(() => {
    const dummy = new THREE.Object3D();
    const matrices: THREE.Matrix4[] = [];
    const colors: THREE.Color[] = [];
    const yellow = new THREE.Color("#ffff00");
    for (let i = 0; i < midCount; i++) {
      const r = 56 + Math.pow(Math.random(), 0.75) * 54;
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

  // ── Layer 3: Outer ring — 2000 pure yellow particles (tighter radius)
  const outerCount = 2000;
  const outerData = useMemo(() => {
    const dummy = new THREE.Object3D();
    const matrices: THREE.Matrix4[] = [];
    const colors: THREE.Color[] = [];
    const yellow = new THREE.Color("#ffff00");
    for (let i = 0; i < outerCount; i++) {
      const r = 110 + Math.pow(Math.random(), 1.0) * 60;
      const angle = Math.random() * Math.PI * 2;
      const h = (Math.random() - 0.5) * (2.5 + (r - 110) / 25);
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

  // ── Small perpendicular ring — 900 pure yellow rocks standing vertical
  const perpCount = 900;
  const perpData = useMemo(() => {
    const dummy = new THREE.Object3D();
    const matrices: THREE.Matrix4[] = [];
    const colors: THREE.Color[] = [];
    const yellow = new THREE.Color("#ffff00");
    for (let i = 0; i < perpCount; i++) {
      const r = 38 + Math.pow(Math.random(), 0.8) * 27;
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

  // Slow orbital rotation
  useFrame((_, delta) => {
    if (diskGroupRef.current) diskGroupRef.current.rotation.y += delta * 0.04;
    if (perpGroupRef.current) perpGroupRef.current.rotation.z -= delta * 0.06;
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
        <meshBasicMaterial color="#ffffff" transparent opacity={0.7} />
      </mesh>
      <mesh rotation={[0, 0, 0.05]} renderOrder={3}>
        <torusGeometry args={[37.5, 5, 16, 120]} />
        <meshBasicMaterial color="#ffe566" transparent opacity={0.4} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* All 3 disk layers rotate together */}
      <group ref={diskGroupRef}>
        {/* Inner bright glow zone */}
        <instancedMesh ref={innerDiskRef} args={[undefined, undefined, innerCount]}>
          <boxGeometry args={[0.7, 0.7, 0.7]} />
          <meshBasicMaterial vertexColors transparent opacity={1.0} blending={THREE.AdditiveBlending} />
        </instancedMesh>

        {/* Mid yellow-orange disk */}
        <instancedMesh ref={midDiskRef} args={[undefined, undefined, midCount]}>
          <boxGeometry args={[1.0, 1.0, 1.0]} />
          <meshBasicMaterial vertexColors transparent opacity={0.92} blending={THREE.AdditiveBlending} />
        </instancedMesh>

        {/* Outer sparse orange-red cloud */}
        <instancedMesh ref={outerDiskRef} args={[undefined, undefined, outerCount]}>
          <boxGeometry args={[1.2, 1.2, 1.2]} />
          <meshBasicMaterial vertexColors transparent opacity={0.78} blending={THREE.AdditiveBlending} />
        </instancedMesh>
      </group>

      {/* Small perpendicular ring — stands vertical (90° to the disk) */}
      <group ref={perpGroupRef} rotation={[Math.PI / 2, 0, 0]}>
        <instancedMesh ref={perpRingRef} args={[undefined, undefined, perpCount]}>
          <boxGeometry args={[0.8, 0.8, 0.8]} />
          <meshBasicMaterial vertexColors transparent opacity={0.88} blending={THREE.AdditiveBlending} />
        </instancedMesh>
      </group>

      {/* Bright core glow light */}
      <pointLight color="#ffcc44" intensity={8} distance={500} decay={1.2} />
    </group>
  );
}

// 12. Giant Background Spiral Galaxy
export function BackgroundGalaxy({
  position = [-650, 120, -600],
  scale = 1.5,
}: {
  position?: [number, number, number];
  scale?: number;
}) {
  const galaxyRef = useRef<THREE.Group>(null!);

  const particleCount = 14000;
  const [positions, colors] = useMemo(() => {
    const posArr = new Float32Array(particleCount * 3);
    const colArr = new Float32Array(particleCount * 3);

    const arms = 8;
    const colorCore = new THREE.Color("#fff7ed");   // Bright Cream
    const colorInner = new THREE.Color("#ec4899");  // Bright Pink
    const colorMid = new THREE.Color("#8b5cf6");    // Electric Purple
    const colorOuter = new THREE.Color("#06b6d4");  // Cyan

    for (let i = 0; i < particleCount; i++) {
      const r = Math.pow(Math.random(), 2) * 320;
      const armAngle = ((i % arms) / arms) * Math.PI * 2;
      const spinAngle = r * 0.012;
      const angle = armAngle + spinAngle + (Math.random() - 0.5) * 0.35;

      const randomY = (Math.random() - 0.5) * (30 * Math.exp(-r / 120));

      posArr[i * 3] = Math.cos(angle) * r;
      posArr[i * 3 + 1] = randomY;
      posArr[i * 3 + 2] = Math.sin(angle) * r;

      const normR = r / 320;
      let c: THREE.Color;
      if (normR < 0.15) {
        c = colorCore.clone().lerp(colorInner, normR / 0.15);
      } else if (normR < 0.5) {
        c = colorInner.clone().lerp(colorMid, (normR - 0.15) / 0.35);
      } else {
        c = colorMid.clone().lerp(colorOuter, (normR - 0.5) / 0.5);
      }

      colArr[i * 3] = c.r;
      colArr[i * 3 + 1] = c.g;
      colArr[i * 3 + 2] = c.b;
    }
    return [posArr, colArr];
  }, [particleCount]);

  useFrame((_, delta) => {
    if (galaxyRef.current) {
      galaxyRef.current.rotation.y += delta * 0.015;
    }
  });

  return (
    <group position={position} scale={scale} rotation={[Math.PI / 3, -Math.PI / 6, 0]}>
      {/* Galactic Core Brightness */}
      <mesh>
        <sphereGeometry args={[25, 32, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
      </mesh>
      <mesh>
        <sphereGeometry args={[55, 32, 32]} />
        <meshBasicMaterial
          color="#ec4899"
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
            size={2.8}
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

// Preload GLTF Space Models
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
