"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Copy,
  Check,
  ExternalLink,
  Code2,
  Sparkles,
  Layers,
  Terminal,
  Cpu,
  Brain,
  Cloud,
  Database,
  Code,
  Zap,
  Star,
  Award,
  ChevronRight,
  BookOpen,
  FolderGit2
} from "lucide-react";
import {
  FaReact,
  FaJs,
  FaNodeJs,
  FaPython,
  FaDocker,
  FaGitAlt,
  FaJava,
  FaAws
} from "react-icons/fa";
import {
  SiNextdotjs,
  SiTypescript,
  SiSpringboot,
  SiPostgresql,
  SiMongodb,
  SiThreedotjs,
  SiTailwindcss,
  SiFramer,
  SiPytorch,
  SiTensorflow,
  SiKubernetes
} from "react-icons/si";

// ==========================================
// TYPES & INTERFACES
// ==========================================

export interface ProjectItem {
  name: string;
  description: string;
  techTags: string[];
  link?: string;
  github?: string;
}

export interface SkillDetail {
  id: string;
  name: string;
  category: "Frontend" | "Backend" | "AI/ML" | "DevOps" | string;
  proficiency: "Expert" | "Advanced" | "Proficient" | string;
  yearsOfExp: string;
  masteryPercentage: number;
  icon: React.ReactNode;
  brandColor: string;
  description: string;
  projects: ProjectItem[];
  codeSnippet: {
    filename: string;
    language: string;
    code: string;
  };
}

export interface KnowledgeForgeProps {
  initialSelectedSkill?: string | null;
  onSkillSelect?: (skillName: string) => void;
  className?: string;
}

// ==========================================
// SKILLS DATABASE & PRESETS
// ==========================================

const SKILLS_DATABASE: Record<string, SkillDetail> = {
  React: {
    id: "react",
    name: "React",
    category: "Frontend",
    proficiency: "Expert",
    yearsOfExp: "4+ Years",
    masteryPercentage: 95,
    icon: <FaReact className="w-6 h-6 text-[#61dafb]" />,
    brandColor: "#61dafb",
    description: "Component-driven UI architecture, custom hooks, state optimization, Concurrent React 19, and Server Components.",
    projects: [
      {
        name: "3rd I Studio - Styling OS",
        description: "Mobile-first ERP logistics portal with drag-and-drop prop mood boards and pre-signed assets uploading.",
        techTags: ["React 19", "Next.js", "Tailwind CSS"],
        link: "https://3rd-i-studio.vercel.app/dashboard",
        github: "https://github.com/vd876733/3rd_i_studio"
      },
      {
        name: "3D Interactive Portfolio",
        description: "An immersive web portfolio built with React 19, Three.js canvas integration, and fluid Framer Motion transitions.",
        techTags: ["React 19", "Three.js", "Tailwind CSS"],
        github: "https://github.com/vd876733"
      },
      {
        name: "IT Helpdesk Ticket System",
        description: "Enterprise ticket tracking dashboard featuring real-time optimistic state updates and custom workflow hooks.",
        techTags: ["React", "Spring Boot", "Tailwind"],
        link: "https://it-helpdesk-ticket-system-psi.vercel.app/"
      },
      {
        name: "Expense Tracker Pro",
        description: "Full-stack financial ledger with custom charting components and memoized calculation pipelines.",
        techTags: ["React", "Java", "Tailwind CSS"]
      }
    ],
    codeSnippet: {
      filename: "useSkillState.ts",
      language: "typescript",
      code: `import { useState, useTransition, useCallback } from "react";

export function useSkillState<T>(initialData: T) {
  const [data, setData] = useState<T>(initialData);
  const [isPending, startTransition] = useTransition();

  const updateSkill = useCallback((nextData: Partial<T>) => {
    startTransition(() => {
      setData((prev) => ({ ...prev, ...nextData }));
    });
  }, []);

  return { data, updateSkill, isPending };
}`
    }
  },
  "Next.js": {
    id: "nextjs",
    name: "Next.js",
    category: "Frontend",
    proficiency: "Advanced",
    yearsOfExp: "3+ Years",
    masteryPercentage: 90,
    icon: <SiNextdotjs className="w-6 h-6 text-slate-900 dark:text-white" />,
    brandColor: "#a855f7",
    description: "App Router architecture, Server Actions, Partial Prerendering (PPR), Edge API routes, and SSG/ISR caching.",
    projects: [
      {
        name: "3rd I Studio - Styling OS",
        description: "Mobile-first interior design studio ERP featuring a barcode scan-to-pack module and PWA offline fallback caching.",
        techTags: ["Next.js", "Prisma", "Serwist", "PWA"],
        link: "https://3rd-i-studio.vercel.app/dashboard",
        github: "https://github.com/vd876733/3rd_i_studio"
      },
      {
        name: "Architectural 3D Web App",
        description: "Next.js 16 app router portfolio with server-rendered metadata and client-side webGL viewports.",
        techTags: ["Next.js", "R3F", "TypeScript"]
      },
      {
        name: "High-Performance Documentation Portal",
        description: "MDX-powered documentation platform with static route generation and dynamic search indexing.",
        techTags: ["Next.js", "Tailwind", "MDX"]
      }
    ],
    codeSnippet: {
      filename: "route.ts",
      language: "typescript",
      code: `import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || "All";

  return NextResponse.json({
    status: 200,
    timestamp: new Date().toISOString(),
    skills: ["React", "Next.js", "Three.js", "PyTorch"]
  });
}`
    }
  },
  "Three.js": {
    id: "threejs",
    name: "Three.js",
    category: "Frontend",
    proficiency: "Advanced",
    yearsOfExp: "2+ Years",
    masteryPercentage: 85,
    icon: <SiThreedotjs className="w-6 h-6 text-slate-900 dark:text-white" />,
    brandColor: "#a855f7",
    description: "3D scene graph orchestration, GLSL shaders, post-processing bloom, lighting, and WebGL optimization.",
    projects: [
      {
        name: "Space Pavilion & Celestial Canvas",
        description: "Procedural starfields, interactive 3D pavilion structures, and custom raymarched shaders.",
        techTags: ["Three.js", "GLSL", "React"]
      },
      {
        name: "Rubik's Cube 3D Simulator",
        description: "Interactive 3D puzzle simulator featuring custom quaternion rotations and hit testing.",
        techTags: ["Three.js", "TypeScript", "HTML5"]
      }
    ],
    codeSnippet: {
      filename: "SceneInit.ts",
      language: "typescript",
      code: `import * as THREE from "three";

export function createGlowingMesh() {
  const geometry = new THREE.IcosahedronGeometry(1.5, 4);
  const material = new THREE.MeshStandardMaterial({
    color: 0x8b5cf6,
    roughness: 0.2,
    metalness: 0.8,
    wireframe: true
  });
  return new THREE.Mesh(geometry, material);
}`
    }
  },
  "Tailwind CSS": {
    id: "tailwindcss",
    name: "Tailwind CSS",
    category: "Frontend",
    proficiency: "Expert",
    yearsOfExp: "4+ Years",
    masteryPercentage: 98,
    icon: <SiTailwindcss className="w-6 h-6 text-[#06b6d4]" />,
    brandColor: "#06b6d4",
    description: "Utility-first design systems, custom color token mapping, dark mode themes, and responsive CSS architectures.",
    projects: [
      {
        name: "3rd I Studio - Styling OS UI",
        description: "Mobile-responsive ERP dashboard styled with custom brand palettes and flexible grid layouts.",
        techTags: ["Tailwind CSS", "React", "Mobile-First"],
        link: "https://3rd-i-studio.vercel.app/dashboard",
        github: "https://github.com/vd876733/3rd_i_studio"
      },
      {
        name: "Knowledge Forge UI System",
        description: "Dark purple glowing glassmorphism theme components with dynamic backdrop blurs.",
        techTags: ["Tailwind", "CSS Grid", "React"]
      },
      {
        name: "Cyberpunk Portfolio Design",
        description: "Full responsive portfolio interface with custom neon glow utilities.",
        techTags: ["Tailwind", "Framer Motion"]
      }
    ],
    codeSnippet: {
      filename: "SkillChip.tsx",
      language: "html",
      code: `<div className="relative px-4 py-2 bg-[#0f0d19]/90 border border-purple-500/20 rounded-xl backdrop-blur-md hover:border-purple-500/60 hover:shadow-[0_0_20px_rgba(168,85,247,0.35)] transition-all duration-300">
  <span className="text-sm font-medium text-slate-200">Interactive Chip</span>
</div>`
    }
  },
  "Framer Motion": {
    id: "framermotion",
    name: "Framer Motion",
    category: "Frontend",
    proficiency: "Advanced",
    yearsOfExp: "3+ Years",
    masteryPercentage: 90,
    icon: <SiFramer className="w-6 h-6 text-[#ff007f]" />,
    brandColor: "#ff007f",
    description: "Spring physics animations, layout ID morphing, slide-over modal drawers, and keyframe gesture responses.",
    projects: [
      {
        name: "Interactive Detail Drawer",
        description: "Fluid slide-in drawer with backdrop opacity blur and spring physics transition curves.",
        techTags: ["Framer Motion", "React", "TypeScript"]
      },
      {
        name: "3D OptionWheel Carousel",
        description: "Drag-driven radial list selector with smooth velocity dampening and inertia physics.",
        techTags: ["Framer Motion", "React"]
      }
    ],
    codeSnippet: {
      filename: "DrawerMotion.tsx",
      language: "typescript",
      code: `import { motion } from "framer-motion";

export const drawerVariants = {
  hidden: { x: "100%", opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 28 }
  },
  exit: { x: "100%", opacity: 0, transition: { duration: 0.25 } }
};`
    }
  },
  TypeScript: {
    id: "typescript",
    name: "TypeScript",
    category: "Frontend",
    proficiency: "Expert",
    yearsOfExp: "4+ Years",
    masteryPercentage: 95,
    icon: <SiTypescript className="w-6 h-6 text-[#3178c6]" />,
    brandColor: "#3178c6",
    description: "Strict static typing, conditional types, mapped types, generics, and compile-time type safety.",
    projects: [
      {
        name: "3rd I Studio - Styling OS",
        description: "Type-safe interactive mood board compositor implementing dynamic scaling, rotations, and layer sequencing.",
        techTags: ["TypeScript", "Next.js", "React"],
        link: "https://3rd-i-studio.vercel.app/dashboard",
        github: "https://github.com/vd876733/3rd_i_studio"
      },
      {
        name: "Type-Safe State Machine",
        description: "Discriminated union-based event emitter and reducer engine for state management.",
        techTags: ["TypeScript", "Design Patterns"]
      },
      {
        name: "Rubik's Cube Spatial Model",
        description: "Full matrix transform type definitions for 3D Rubik's cube rotation solver.",
        techTags: ["TypeScript", "Algorithms"]
      }
    ],
    codeSnippet: {
      filename: "types.ts",
      language: "typescript",
      code: `export type Proficiency = "Expert" | "Advanced" | "Proficient";

export interface SkillDetail {
  id: string;
  name: string;
  masteryPercentage: number;
  proficiency: Proficiency;
  projects: ReadonlyArray<{ name: string; description: string }>;
}`
    }
  },
  JavaScript: {
    id: "javascript",
    name: "JavaScript",
    category: "Frontend",
    proficiency: "Expert",
    yearsOfExp: "4+ Years",
    masteryPercentage: 94,
    icon: <FaJs className="w-6 h-6 text-[#f7df1e]" />,
    brandColor: "#f7df1e",
    description: "ES6+ asynchronous patterns, Event Loop mechanics, DOM manipulation, closures, and Web APIs.",
    projects: [
      {
        name: "Canvas Particle Engine",
        description: "High-fps interactive particle system running on 2D HTML5 canvas.",
        techTags: ["JavaScript", "HTML5 Canvas"]
      }
    ],
    codeSnippet: {
      filename: "memoize.js",
      language: "javascript",
      code: `const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};`
    }
  },
  "Node.js": {
    id: "nodejs",
    name: "Node.js",
    category: "Backend",
    proficiency: "Advanced",
    yearsOfExp: "3+ Years",
    masteryPercentage: 88,
    icon: <FaNodeJs className="w-6 h-6 text-[#339933]" />,
    brandColor: "#339933",
    description: "Event-driven asynchronous microservices, RESTful APIs, stream handling, and npm package tooling.",
    projects: [
      {
        name: "High-Throughput API Gateway",
        description: "Scalable backend gateway with request routing, rate limiting, and JWT authentication.",
        techTags: ["Node.js", "Express", "Redis"]
      }
    ],
    codeSnippet: {
      filename: "server.js",
      language: "javascript",
      code: `import http from "node:http";

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ status: "healthy", timestamp: Date.now() }));
});

server.listen(8080, () => console.log("Server listening on 8080"));`
    }
  },
  "Spring Boot": {
    id: "springboot",
    name: "Spring Boot",
    category: "Backend",
    proficiency: "Advanced",
    yearsOfExp: "3+ Years",
    masteryPercentage: 88,
    icon: <SiSpringboot className="w-6 h-6 text-[#6db33f]" />,
    brandColor: "#6db33f",
    description: "Enterprise Java backend services, Spring Security, JPA/Hibernate ORM, and REST controller microservices.",
    projects: [
      {
        name: "Expense Tracker Backend",
        description: "Robust Spring Boot application with relational PostgreSQL storage and JWT token management.",
        techTags: ["Spring Boot", "Java", "PostgreSQL"]
      },
      {
        name: "Redis Rate Limiter",
        description: "Sliding window rate limiting implementation for distributed Spring API routes.",
        techTags: ["Spring Boot", "Redis", "Java"]
      }
    ],
    codeSnippet: {
      filename: "TicketController.java",
      language: "java",
      code: `@RestController
@RequestMapping("/api/v1/tickets")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @GetMapping
    public ResponseEntity<List<Ticket>> getAllTickets() {
        return ResponseEntity.ok(ticketService.findAllActive());
    }
}`
    }
  },
  Java: {
    id: "java",
    name: "Java",
    category: "Backend",
    proficiency: "Expert",
    yearsOfExp: "4+ Years",
    masteryPercentage: 92,
    icon: <FaJava className="w-6 h-6 text-[#e51f24]" />,
    brandColor: "#e51f24",
    description: "Object-oriented software design, multithreading, Data Structures & Algorithms, and JVM tuning.",
    projects: [
      {
        name: "Visual Indoor Positioning System",
        description: "Spatial localization engine computing indoor coordinates from visual data feeds.",
        techTags: ["Java", "Algorithms", "Data Structures"]
      }
    ],
    codeSnippet: {
      filename: "PositionEngine.java",
      language: "java",
      code: `public record NodeCoordinate(double x, double y, double z) {
    public double distanceTo(NodeCoordinate target) {
        double dx = this.x - target.x();
        double dy = this.y - target.y();
        double dz = this.z - target.z();
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
}`
    }
  },
  PostgreSQL: {
    id: "postgresql",
    name: "PostgreSQL",
    category: "Backend",
    proficiency: "Advanced",
    yearsOfExp: "3+ Years",
    masteryPercentage: 85,
    icon: <SiPostgresql className="w-6 h-6 text-[#4169e1]" />,
    brandColor: "#4169e1",
    description: "Relational database schema modeling, CTE queries, index optimization, and ACID transaction safety.",
    projects: [
      {
        name: "Helpdesk Analytics Database",
        description: "Optimized relational tables storing ticket workflows with trigger-driven audit logs.",
        techTags: ["PostgreSQL", "SQL", "Spring Boot"]
      }
    ],
    codeSnippet: {
      filename: "query.sql",
      language: "sql",
      code: `SELECT 
    c.category_name,
    COUNT(t.id) AS total_tickets,
    AVG(EXTRACT(EPOCH FROM (t.resolved_at - t.created_at))/3600)::NUMERIC(10,2) AS avg_hours
FROM tickets t
JOIN categories c ON t.category_id = c.id
GROUP BY c.category_name
ORDER BY total_tickets DESC;`
    }
  },
  MongoDB: {
    id: "mongodb",
    name: "MongoDB",
    category: "Backend",
    proficiency: "Proficient",
    yearsOfExp: "2+ Years",
    masteryPercentage: 80,
    icon: <SiMongodb className="w-6 h-6 text-[#47a248]" />,
    brandColor: "#47a248",
    description: "NoSQL document store, aggregation pipelines, schema-less indexing, and flexible data modeling.",
    projects: [
      {
        name: "NLP Code Analyzer Store",
        description: "Unstructured document storage storing parsed AST trees and source code analysis metrics.",
        techTags: ["MongoDB", "Python", "FastAPI"]
      }
    ],
    codeSnippet: {
      filename: "aggregation.js",
      language: "javascript",
      code: `db.analysis_logs.aggregate([
  { $match: { status: "processed" } },
  { $group: { _id: "$language", avgScore: { $avg: "$complexityScore" } } },
  { $sort: { avgScore: -1 } }
]);`
    }
  },
  Python: {
    id: "python",
    name: "Python",
    category: "AI/ML",
    proficiency: "Expert",
    yearsOfExp: "4+ Years",
    masteryPercentage: 94,
    icon: <FaPython className="w-6 h-6 text-[#3776ab]" />,
    brandColor: "#3776ab",
    description: "Data processing pipelines, scientific computing, PyTorch/TensorFlow deep learning, and FastAPI microservices.",
    projects: [
      {
        name: "NexusFlow Ingestion Engine",
        description: "High-throughput asynchronous ETL data pipeline processing massive structured datasets.",
        techTags: ["Python", "Asyncio", "ETL"]
      },
      {
        name: "NLP Code Analyzer",
        description: "Semantic source code analysis tool powered by fine-tuned Hugging Face transformer models.",
        techTags: ["Python", "Hugging Face", "NLP"]
      }
    ],
    codeSnippet: {
      filename: "ingest.py",
      language: "python",
      code: `import asyncio
from typing import List, Dict, Any

async def process_data_batch(items: List[Dict[str, Any]]) -> List[float]:
    tasks = [asyncio.create_task(compute_embedding(item)) for item in items]
    results = await asyncio.gather(*tasks)
    return results`
    }
  },
  PyTorch: {
    id: "pytorch",
    name: "PyTorch",
    category: "AI/ML",
    proficiency: "Advanced",
    yearsOfExp: "2+ Years",
    masteryPercentage: 86,
    icon: <SiPytorch className="w-6 h-6 text-[#ee4c2c]" />,
    brandColor: "#ee4c2c",
    description: "Neural network architectures, custom Autograd modules, CUDA acceleration, and NLP transformer models.",
    projects: [
      {
        name: "ASL Fingerspelling Model",
        description: "Deep Convolutional Neural Network trained for real-time American Sign Language recognition.",
        techTags: ["PyTorch", "Computer Vision", "Python"]
      },
      {
        name: "BERT Intent Classifier",
        description: "Fine-tuned BERT model for automated classification and routing of support tickets.",
        techTags: ["PyTorch", "BERT", "Hugging Face"]
      }
    ],
    codeSnippet: {
      filename: "model.py",
      language: "python",
      code: `import torch
import torch.nn as nn

class SkillEncoder(nn.Module):
    def __init__(self, in_features: int, hidden_dim: int):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(in_features, hidden_dim),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(hidden_dim, 64)
        )
    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.net(x)`
    }
  },
  TensorFlow: {
    id: "tensorflow",
    name: "TensorFlow",
    category: "AI/ML",
    proficiency: "Proficient",
    yearsOfExp: "2+ Years",
    masteryPercentage: 80,
    icon: <SiTensorflow className="w-6 h-6 text-[#ff6f00]" />,
    brandColor: "#ff6f00",
    description: "Keras sequential pipelines, model quantization for edge devices, and CNN computer vision models.",
    projects: [
      {
        name: "Computer Vision Edge Model",
        description: "Quantized TFLite model optimized for mobile and web camera gesture detection.",
        techTags: ["TensorFlow", "OpenCV", "Python"]
      }
    ],
    codeSnippet: {
      filename: "keras_model.py",
      language: "python",
      code: `import tensorflow as tf

model = tf.keras.Sequential([
    tf.keras.layers.Dense(128, activation='relu', input_shape=(64,)),
    tf.keras.layers.Dropout(0.3),
    tf.keras.layers.Dense(10, activation='softmax')
])
model.compile(optimizer='adam', loss='categorical_crossentropy')`
    }
  },
  "OpenAI API": {
    id: "openai",
    name: "OpenAI API",
    category: "AI/ML",
    proficiency: "Advanced",
    yearsOfExp: "2+ Years",
    masteryPercentage: 88,
    icon: <Sparkles className="w-6 h-6 text-[#10a37f]" />,
    brandColor: "#10a37f",
    description: "LLM prompt engineering, function calling, vector embeddings, and RAG agent pipelines.",
    projects: [
      {
        name: "Smart Code Review Agent",
        description: "Automated PR feedback tool leveraging OpenAI function calling to analyze syntax and security.",
        techTags: ["OpenAI API", "Node.js", "TypeScript"]
      }
    ],
    codeSnippet: {
      filename: "aiAgent.ts",
      language: "typescript",
      code: `import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function analyzeCodeSnippet(code: string) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: \`Review code: \${code}\` }]
  });
  return completion.choices[0].message.content;
}`
    }
  },
  Docker: {
    id: "docker",
    name: "Docker",
    category: "DevOps",
    proficiency: "Advanced",
    yearsOfExp: "3+ Years",
    masteryPercentage: 88,
    icon: <FaDocker className="w-6 h-6 text-[#2496ed]" />,
    brandColor: "#2496ed",
    description: "Containerization, multi-stage Dockerfiles, Docker Compose service orchestration, and image optimization.",
    projects: [
      {
        name: "Microservices Container Mesh",
        description: "Multi-container environment running Spring Boot, PostgreSQL, Redis, and Next.js.",
        techTags: ["Docker", "Docker Compose", "DevOps"]
      }
    ],
    codeSnippet: {
      filename: "Dockerfile",
      language: "dockerfile",
      code: `FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/out /usr/share/nginx/html
EXPOSE 80`
    }
  },
  Kubernetes: {
    id: "kubernetes",
    name: "Kubernetes",
    category: "DevOps",
    proficiency: "Proficient",
    yearsOfExp: "2+ Years",
    masteryPercentage: 78,
    icon: <SiKubernetes className="w-6 h-6 text-[#326ce5]" />,
    brandColor: "#326ce5",
    description: "Container orchestration, Pod management, ingress controllers, and horizontal pod auto-scaling.",
    projects: [
      {
        name: "Auto-Scaling Microservice Cluster",
        description: "Minikube deployment featuring automated scaling based on CPU and memory load targets.",
        techTags: ["Kubernetes", "Docker", "Yaml"]
      }
    ],
    codeSnippet: {
      filename: "deployment.yaml",
      language: "yaml",
      code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: knowledge-forge-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: forge
  template:
    metadata:
      labels:
        app: forge
    spec:
      containers:
      - name: web
        image: forge/web:v1.0
        ports:
        - containerPort: 3000`
    }
  },
  AWS: {
    id: "aws",
    name: "AWS",
    category: "DevOps",
    proficiency: "Proficient",
    yearsOfExp: "2+ Years",
    masteryPercentage: 80,
    icon: <FaAws className="w-6 h-6 text-[#ff9900]" />,
    brandColor: "#ff9900",
    description: "S3 static web hosting, CloudFront CDNs, EC2 instances, and Lambda serverless micro-functions.",
    projects: [
      {
        name: "Cloud Pipeline Infrastructure",
        description: "S3 and CloudFront deployment pipeline with automated SSL certificates and edge caching.",
        techTags: ["AWS S3", "CloudFront", "DevOps"]
      }
    ],
    codeSnippet: {
      filename: "awsS3.ts",
      language: "typescript",
      code: `import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({ region: "us-east-1" });

export async function uploadAsset(key: string, body: Buffer) {
  return await s3.send(new PutObjectCommand({
    Bucket: "portfolio-assets",
    Key: key,
    Body: body
  }));
}`
    }
  },
  "CI/CD": {
    id: "cicd",
    name: "CI/CD",
    category: "DevOps",
    proficiency: "Advanced",
    yearsOfExp: "3+ Years",
    masteryPercentage: 88,
    icon: <FaGitAlt className="w-6 h-6 text-[#f05032]" />,
    brandColor: "#f05032",
    description: "GitHub Actions automation, automated test execution, lint checks, and seamless continuous deployment.",
    projects: [
      {
        name: "GitHub Actions Build Pipeline",
        description: "Automated workflow validating TypeScript, running test suites, and deploying to production.",
        techTags: ["GitHub Actions", "CI/CD", "Vercel"]
      }
    ],
    codeSnippet: {
      filename: "deploy.yml",
      language: "yaml",
      code: `name: Build and Verify
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npm run build`
    }
  }
};

// Fallback helper generator for any missing skill tags
function getSkillDetail(skillName: string): SkillDetail {
  if (SKILLS_DATABASE[skillName]) {
    return SKILLS_DATABASE[skillName];
  }

  // Dynamic fallback for custom skills
  const cleanId = skillName.toLowerCase().replace(/[^a-z0-0]/g, "");
  return {
    id: cleanId,
    name: skillName,
    category: "Technical Skill",
    proficiency: "Advanced",
    yearsOfExp: "2+ Years",
    masteryPercentage: 85,
    icon: <Cpu className="w-6 h-6 text-purple-400" />,
    brandColor: "#a855f7",
    description: `Hands-on expertise and practical application using ${skillName} in production and portfolio projects.`,
    projects: [
      {
        name: `${skillName} Integration Project`,
        description: `Implemented ${skillName} to optimize software architecture and build scalable solutions.`,
        techTags: [skillName, "Full Stack", "TypeScript"]
      }
    ],
    codeSnippet: {
      filename: `${cleanId}_example.ts`,
      language: "typescript",
      code: `// ${skillName} Usage Example
export function execute${skillName.replace(/[^a-zA-Z0-9]/g, "")}() {
  console.log("Executing ${skillName} pipeline...");
  return { status: "Success", skill: "${skillName}" };
}`
    }
  };
}

// Default skill categories if not provided
const CATEGORIES: Record<string, string[]> = {
  Frontend: ["React", "Next.js", "Three.js", "Tailwind CSS", "Framer Motion", "TypeScript", "JavaScript"],
  Backend: ["Node.js", "Spring Boot", "Java", "PostgreSQL", "MongoDB"],
  "AI/ML": ["Python", "PyTorch", "TensorFlow", "OpenAI API"],
  DevOps: ["Docker", "Kubernetes", "AWS", "CI/CD"]
};

// ==========================================
// CODE HIGHLIGHTING HELPER COMPONENT
// ==========================================

function CodeHighlight({ code, language }: { code: string; language: string }) {
  const lines = useMemo(() => code.split("\n"), [code]);

  // Syntax colorizer helper
  const renderLine = (line: string, index: number) => {
    // Basic regex highlights for code snippets
    if (line.trim().startsWith("//") || line.trim().startsWith("#")) {
      return <span key={index} className="text-slate-500 italic">{line}</span>;
    }

    const words = line.split(/(\s+|[(){}[\].,;:="`'])/);
    const keywords = new Set([
      "import", "export", "from", "function", "const", "let", "var", "return",
      "async", "await", "default", "class", "extends", "interface", "type",
      "public", "private", "protected", "new", "select", "from", "where", "join",
      "group", "by", "order", "on", "as", "runs-on", "uses", "with", "jobs",
      "name", "spec", "apiVersion", "kind", "metadata"
    ]);

    return (
      <span key={index}>
        {words.map((word, wIdx) => {
          if (keywords.has(word.trim())) {
            return <span key={wIdx} className="text-purple-400 font-semibold">{word}</span>;
          }
          if (/^".*"$|^'.*'$|^`.*`$/.test(word.trim())) {
            return <span key={wIdx} className="text-emerald-400">{word}</span>;
          }
          if (/^\d+$/.test(word.trim()) || word.trim() === "true" || word.trim() === "false") {
            return <span key={wIdx} className="text-amber-400">{word}</span>;
          }
          if (/^[A-Z][a-zA-Z0-9_]*$/.test(word.trim())) {
            return <span key={wIdx} className="text-cyan-300 font-medium">{word}</span>;
          }
          return <span key={wIdx} className="text-slate-200">{word}</span>;
        })}
      </span>
    );
  };

  return (
    <div className="font-mono text-xs leading-relaxed overflow-x-auto">
      <table className="w-full border-collapse">
        <tbody>
          {lines.map((line, idx) => (
            <tr key={idx} className="hover:bg-white/[0.03]">
              <td className="w-8 select-none text-right pr-4 text-slate-600 text-[11px] font-mono border-r border-white/5 align-top">
                {idx + 1}
              </td>
              <td className="pl-4 whitespace-pre text-slate-200 align-top">
                {renderLine(line, idx)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ==========================================
// MAIN KNOWLEDGE FORGE COMPONENT
// ==========================================

export default function KnowledgeForge({
  initialSelectedSkill = null,
  onSkillSelect,
  className = ""
}: KnowledgeForgeProps) {
  const [selectedSkillName, setSelectedSkillName] = useState<string | null>(initialSelectedSkill);
  const [copied, setCopied] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("All");

  // Retrieve skill detail object when selected
  const selectedSkill = useMemo(() => {
    if (!selectedSkillName) return null;
    return getSkillDetail(selectedSkillName);
  }, [selectedSkillName]);

  // Open drawer handler
  const handleSkillClick = (skillName: string) => {
    setSelectedSkillName(skillName);
    if (onSkillSelect) {
      onSkillSelect(skillName);
    }
  };

  // Close drawer handler
  const handleClose = useCallback(() => {
    setSelectedSkillName(null);
  }, []);

  // Keyboard accessibility (ESC key listener)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedSkillName) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedSkillName, handleClose]);

  // Prevent background body scroll when drawer is open
  useEffect(() => {
    if (selectedSkillName) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedSkillName]);

  // Copy code snippet to clipboard
  const handleCopyCode = () => {
    if (!selectedSkill) return;
    navigator.clipboard.writeText(selectedSkill.codeSnippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Category Icon helper
  const getCategoryIcon = (catName: string) => {
    switch (catName) {
      case "Frontend":
        return <Code className="w-5 h-5 text-indigo-400" />;
      case "Backend":
        return <Database className="w-5 h-5 text-purple-400" />;
      case "AI/ML":
        return <Brain className="w-5 h-5 text-pink-400" />;
      case "DevOps":
        return <Cloud className="w-5 h-5 text-cyan-400" />;
      default:
        return <Zap className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className={`w-full text-slate-900 dark:text-slate-100 ${className}`}>
      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {["All", ...Object.keys(CATEGORIES)].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategoryFilter(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 border ${
              activeCategoryFilter === cat
                ? "bg-purple-600/20 dark:bg-purple-600/30 border-purple-500 text-purple-700 dark:text-purple-300 font-semibold shadow-[0_0_12px_rgba(168,85,247,0.25)]"
                : "bg-slate-100 dark:bg-[#131022] border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800/60"
            }`}
          >
            {cat !== "All" && getCategoryIcon(cat)}
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Skill Categories & Interactive Chips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(CATEGORIES)
          .filter(([categoryName]) => activeCategoryFilter === "All" || activeCategoryFilter === categoryName)
          .map(([categoryName, skillList]) => (
            <div
              key={categoryName}
              className="p-5 rounded-2xl bg-slate-50/90 dark:bg-[#0f0d19]/90 border border-slate-200 dark:border-purple-500/15 shadow-md dark:shadow-xl backdrop-blur-xl relative overflow-hidden group hover:border-purple-400/40 dark:hover:border-purple-500/30 transition-all duration-300"
            >
              {/* Subtle ambient corner gradient */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 dark:bg-purple-600/5 rounded-full blur-2xl pointer-events-none group-hover:bg-purple-500/10 dark:group-hover:bg-purple-600/10 transition-all" />

              {/* Category Header */}
              <div className="flex items-center justify-between mb-4 border-b border-slate-200 dark:border-white/5 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-slate-200/60 dark:bg-white/5 border border-slate-300/60 dark:border-white/10">
                    {getCategoryIcon(categoryName)}
                  </div>
                  <h3 className="text-base font-bold tracking-tight text-slate-900 dark:text-white font-space-grotesk">
                    {categoryName}
                  </h3>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20 font-semibold">
                  {skillList.length} Skills
                </span>
              </div>

              {/* Interactive Skill Chips Grid */}
              <div className="flex flex-wrap gap-2.5">
                {skillList.map((skillName) => {
                  const detail = getSkillDetail(skillName);
                  const isSelected = selectedSkillName === skillName;

                  return (
                    <motion.button
                      key={skillName}
                      onClick={() => handleSkillClick(skillName)}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.96 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      aria-label={`Open details for ${skillName}`}
                      className={`cursor-pointer group/chip relative px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-all duration-300 border ${
                        isSelected
                          ? "bg-purple-600/20 dark:bg-purple-600/40 border-purple-500 dark:border-purple-400 text-purple-900 dark:text-white shadow-[0_0_20px_rgba(168,85,247,0.3)] ring-1 ring-purple-400/50 font-bold"
                          : "bg-white dark:bg-[#17132b]/80 border-slate-200 dark:border-purple-500/20 text-slate-700 dark:text-slate-200 hover:border-purple-400/60 dark:hover:border-purple-500/60 hover:shadow-md dark:hover:shadow-[0_0_18px_rgba(168,85,247,0.35)] hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      {/* Icon with subtle hover pulse */}
                      <span className="transition-transform group-hover/chip:scale-110">
                        {detail.icon}
                      </span>

                      {/* Skill Title */}
                      <span className="font-inter tracking-wide">{skillName}</span>

                      {/* Subtle Glow Dot */}
                      <span
                        className="w-1.5 h-1.5 rounded-full opacity-60 group-hover/chip:opacity-100 transition-opacity"
                        style={{ backgroundColor: detail.brandColor || "#a855f7" }}
                      />
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ))}
      </div>

      {/* Slide-over Drawer / Modal Overlay */}
      <AnimatePresence>
        {selectedSkill && (
          <div className="relative z-50">
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={handleClose}
              className="fixed inset-0 bg-slate-900/40 dark:bg-[#08060f]/80 backdrop-blur-md z-40 cursor-pointer"
              aria-hidden="true"
            />

            {/* Slide-In Drawer Panel */}
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              role="dialog"
              aria-modal="true"
              aria-label={`${selectedSkill.name} Skill Details`}
              className="fixed top-0 right-0 bottom-0 z-50 h-full w-full max-w-xl sm:w-[500px] md:w-[560px] lg:w-[600px] bg-white dark:bg-[#0f0d19] border-l border-slate-200 dark:border-purple-500/20 shadow-2xl flex flex-col overflow-hidden text-slate-900 dark:text-white"
            >
              {/* Drawer Ambient Header Gradient */}
              <div
                className="absolute top-0 inset-x-0 h-40 opacity-20 pointer-events-none bg-gradient-to-b from-purple-500 to-transparent"
                style={{
                  background: `radial-gradient(circle at 80% 20%, ${selectedSkill.brandColor}33 0%, transparent 70%)`
                }}
              />

              {/* Sticky Top Bar */}
              <div className="relative z-10 flex items-center justify-between p-6 border-b border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#0f0d19]/90 backdrop-blur-md">
                <div className="flex items-center gap-3.5">
                  <div
                    className="p-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-inner flex items-center justify-center"
                    style={{ boxShadow: `0 0 15px ${selectedSkill.brandColor}33` }}
                  >
                    {selectedSkill.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white font-space-grotesk">
                        {selectedSkill.name}
                      </h2>
                      <span className="px-2.5 py-0.5 text-[10px] font-mono rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/30 font-semibold">
                        {selectedSkill.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Technical Competency & Experience</p>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={handleClose}
                  aria-label="Close drawer"
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/15 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Scrollable Body Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                {/* Overview Description */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-inter">
                  {selectedSkill.description}
                </div>

                {/* Proficiency & Years of Experience Bar */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-purple-500/20 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Proficiency & Experience
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-700 dark:text-purple-300 font-semibold border border-purple-500/30">
                        {selectedSkill.proficiency}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 font-mono">
                        • {selectedSkill.yearsOfExp}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar Container */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
                      <span>Skill Mastery</span>
                      <span className="text-purple-700 dark:text-purple-300 font-bold">{selectedSkill.masteryPercentage}%</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-950 overflow-hidden p-0.5 border border-slate-300/50 dark:border-white/5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedSkill.masteryPercentage}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 shadow-[0_0_12px_rgba(168,85,247,0.6)]"
                      />
                    </div>
                  </div>
                </div>

                {/* Key Projects Built */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    <FolderGit2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Key Projects Built ({selectedSkill.projects.length})</span>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {selectedSkill.projects.map((proj, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 hover:border-purple-400/40 dark:hover:border-purple-500/30 transition-all group/proj"
                      >
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white font-space-grotesk group-hover/proj:text-purple-600 dark:group-hover/proj:text-purple-300 transition-colors">
                            {proj.name}
                          </h4>
                          {(proj.link || proj.github) && (
                            <a
                              href={proj.link || proj.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white p-1 rounded-md hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                              title="View Project"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                          {proj.description}
                        </p>

                        {/* Project Tech Tags */}
                        <div className="flex flex-wrap gap-1.5">
                          {proj.techTags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 text-[10px] font-mono rounded-md bg-slate-200/70 dark:bg-white/5 border border-slate-300/70 dark:border-white/10 text-slate-700 dark:text-slate-300 font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Code Snippet Box */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      <Terminal className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Code Snippet / Sample Usage</span>
                    </div>

                    {/* Copy Code Button */}
                    <button
                      onClick={handleCopyCode}
                      className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/15 border border-slate-300 dark:border-white/10 transition-all cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Code Editor Container */}
                  <div className="rounded-xl bg-[#090710] border border-purple-500/20 overflow-hidden shadow-2xl">
                    {/* Top Editor Bar */}
                    <div className="flex items-center justify-between px-4 py-2.5 bg-black/40 border-b border-white/5 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
                        <span className="ml-2 text-slate-400 font-mono text-[11px]">
                          {selectedSkill.codeSnippet.filename}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-purple-400 uppercase">
                        {selectedSkill.codeSnippet.language}
                      </span>
                    </div>

                    {/* Syntax Highlighted Code Box */}
                    <div className="p-4">
                      <CodeHighlight
                        code={selectedSkill.codeSnippet.code}
                        language={selectedSkill.codeSnippet.language}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0f0d19] flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-mono">ESC to close</span>
                <button
                  onClick={handleClose}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium transition-all shadow-md cursor-pointer"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
