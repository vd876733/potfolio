"use client";

import { useRef, useEffect, useState } from "react";
import { useTheme } from "next-themes";

// ---- Types ------------------------------------------------------------------
interface Pt { x: number; y: number }
interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
}

// ---- Config -----------------------------------------------------------------
const CELL       = 24;
const STEP_MS    = 120;
const FOOD_COUNT = 3;

// ---- Theme Colors -----------------------------------------------------------
const CLR = {
  dark: {
    bg:        "#05050f",
    grid:      "rgba(255,255,255,0.02)",
    gridLine:  "rgba(255,226,0,0.04)",
    snake:     "#ffe200",
    snakeGlow: "#ffe200",
    snakeHead: "#ffffff",
    food:      "#ffaa00",
    foodGlow:  "#ffaa00",
    trail:     "rgba(255,226,0,0.18)",
    burst:     "rgba(255,170,0,0.85)",
    hudText:   "#ffe200",
    hudSub:    "rgba(255,226,0,0.45)",
    hudBg:     "rgba(0,0,0,0.65)",
    hudBorder: "rgba(255,226,0,0.15)",
    hudCorner: "rgba(255,226,0,0.4)",
    divider:   "rgba(255,226,0,0.12)",
    bodyGrad: (t: number, alpha: number) => `rgba(${Math.floor(200 + 55 * t)},${Math.floor(160 + 80 * t)},${Math.floor(50 * t)},${alpha.toFixed(2)})`
  },
  light: {
    bg:        "#fdfbf7", // Warm Soft Cream
    grid:      "rgba(0,0,0,0.03)",
    gridLine:  "rgba(0,0,0,0.04)", // rgba(0,0,0,0.04) board grid background
    snake:     "#2563eb", // Royal Blue
    snakeGlow: "#2563eb",
    snakeHead: "#1e3a8a",
    food:      "#d97706", // Amber Gold
    foodGlow:  "#d97706",
    trail:     "rgba(37,99,235,0.15)",
    burst:     "rgba(217,119,6,0.85)",
    hudText:   "#0f172a", // Rich Slate
    hudSub:    "rgba(15,23,42,0.45)",
    hudBg:     "rgba(253,251,247,0.85)",
    hudBorder: "rgba(0,0,0,0.08)", // 1px solid rgba(0,0,0,0.08)
    hudCorner: "rgba(37,99,235,0.4)",
    divider:   "rgba(0,0,0,0.08)",
    bodyGrad: (t: number, alpha: number) => `rgba(${Math.floor(59 + 141 * (1 - t))},${Math.floor(130 + 100 * (1 - t))},${Math.floor(246 - 100 * (1 - t))},${alpha.toFixed(2)})`
  }
};

// ---- Helpers ----------------------------------------------------------------
const key = (p: Pt) => `${p.x},${p.y}`;
const eq  = (a: Pt, b: Pt) => a.x === b.x && a.y === b.y;
const DIRS: Pt[] = [
  { x:  0, y: -1 },
  { x:  0, y:  1 },
  { x: -1, y:  0 },
  { x:  1, y:  0 },
];

function bfs(start: Pt, goal: Pt, cols: number, rows: number, blocked: Set<string>): Pt[] | null {
  const queue: { pt: Pt; path: Pt[] }[] = [{ pt: start, path: [] }];
  const seen = new Set<string>([key(start)]);
  while (queue.length) {
    const item = queue.shift()!;
    for (const d of DIRS) {
      const nx = item.pt.x + d.x;
      const ny = item.pt.y + d.y;
      if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
      const nk = `${nx},${ny}`;
      if (seen.has(nk) || blocked.has(nk)) continue;
      const np = { x: nx, y: ny };
      const newPath = [...item.path, np];
      if (eq(np, goal)) return newPath;
      seen.add(nk);
      queue.push({ pt: np, path: newPath });
    }
  }
  return null;
}

function floodCount(start: Pt, cols: number, rows: number, blocked: Set<string>): number {
  const stack: Pt[] = [start];
  const seen = new Set<string>([key(start)]);
  let count = 0;
  while (stack.length) {
    const pt = stack.pop()!;
    count++;
    for (const d of DIRS) {
      const nx = pt.x + d.x;
      const ny = pt.y + d.y;
      if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
      const nk = `${nx},${ny}`;
      if (seen.has(nk) || blocked.has(nk)) continue;
      seen.add(nk);
      stack.push({ x: nx, y: ny });
    }
  }
  return count;
}

function pickMove(snake: Pt[], foods: Pt[], cols: number, rows: number): Pt {
  const head = snake[0];
  const bodySet = new Set(snake.map(key));

  const sorted = [...foods].sort(
    (a, b) =>
      Math.abs(a.x - head.x) + Math.abs(a.y - head.y) -
      (Math.abs(b.x - head.x) + Math.abs(b.y - head.y))
  );

  for (const food of sorted) {
    const path = bfs(head, food, cols, rows, bodySet);
    if (!path || path.length === 0) continue;
    const next = path[0];
    const futureSet = new Set([next, ...snake.slice(0, -1)].map(key));
    const room = floodCount(next, cols, rows, futureSet);
    if (room >= Math.max(snake.length, 4)) return next;
  }

  const options = DIRS
    .map((d) => ({ x: head.x + d.x, y: head.y + d.y }))
    .filter((n) => n.x >= 0 && n.y >= 0 && n.x < cols && n.y < rows && !bodySet.has(key(n)));

  if (!options.length) return head;

  const bodyNoTail = new Set(snake.slice(0, -1).map(key));
  return options.reduce((best, n) => {
    return floodCount(n, cols, rows, bodyNoTail) > floodCount(best, cols, rows, bodyNoTail) ? n : best;
  });
}

function placeFood(snake: Pt[], foods: Pt[], cols: number, rows: number): Pt {
  const occupied = new Set([...snake.map(key), ...foods.map(key)]);
  const free: Pt[] = [];
  for (let x = 0; x < cols; x++)
    for (let y = 0; y < rows; y++)
      if (!occupied.has(`${x},${y}`)) free.push({ x, y });
  return free[Math.floor(Math.random() * free.length)] ?? { x: 0, y: 0 };
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function glow(ctx: CanvasRenderingContext2D, color: string, blur: number, fn: () => void) {
  ctx.save();
  ctx.shadowColor = color;
  ctx.shadowBlur  = blur;
  fn();
  ctx.restore();
}

// ---- Component --------------------------------------------------------------
interface SnakeSidebarProps {
  width?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function SnakeSidebar({ width = 320, className = "", style = {} }: SnakeSidebarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = mounted && theme === "light" ? "light" : "dark";
  const colors = CLR[currentTheme];

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    let cols = 0, rows = 0, dpr = 1;
    let snake: Pt[] = [];
    let foods: Pt[] = [];
    let trail: (Pt & { age: number })[] = [];
    let particles: Particle[] = [];
    let score = 0, level = 1, stepTimer = 0, lastTime = 0, rafId = 0;

    function init() {
      const cx = Math.floor(cols / 2);
      const cy = Math.floor(rows / 2);
      snake = [{ x: cx, y: cy }, { x: cx, y: cy + 1 }, { x: cx, y: cy + 2 }];
      foods = [];
      trail = [];
      particles = [];
      for (let i = 0; i < FOOD_COUNT; i++) foods.push(placeFood(snake, foods, cols, rows));
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio ?? 1, 2);
      const rect = canvas.getBoundingClientRect();
      const w = Math.round(rect.width  * dpr);
      const h = Math.round(rect.height * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width  = w;
        canvas.height = h;
      }
      const pc = cols, pr = rows;
      cols = Math.floor(rect.width  / CELL);
      rows = Math.floor(rect.height / CELL);
      if (cols !== pc || rows !== pr) init();
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    function burst(bx: number, by: number) {
      for (let i = 0; i < 12; i++) {
        const ang = (Math.PI * 2 * i) / 12 + Math.random() * 0.5;
        const spd = 0.6 + Math.random() * 1.2;
        particles.push({ x: bx, y: by, vx: Math.cos(ang) * spd * CELL, vy: Math.sin(ang) * spd * CELL, life: 1, maxLife: 1 });
      }
    }

    function draw() {
      const W = canvas.width / dpr;
      const H = canvas.height / dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Background + grid
      ctx.fillStyle = colors.bg;
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = colors.grid;
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = colors.gridLine;
      ctx.lineWidth = 0.5;
      for (let x = 0; x <= cols; x++) {
        ctx.beginPath(); ctx.moveTo(x * CELL, 0); ctx.lineTo(x * CELL, H); ctx.stroke();
      }
      for (let y = 0; y <= rows; y++) {
        ctx.beginPath(); ctx.moveTo(0, y * CELL); ctx.lineTo(W, y * CELL); ctx.stroke();
      }

      // Trail
      for (const t of trail) {
        const alpha = Math.max(0, (1 - t.age / 12) * 0.18);
        const pad = CELL * 0.35;
        ctx.fillStyle = colors.trail.replace("0.18", alpha.toFixed(3)).replace("0.15", alpha.toFixed(3));
        ctx.fillRect(t.x * CELL + pad, t.y * CELL + pad, CELL - pad * 2, CELL - pad * 2);
      }

      // Food
      for (const f of foods) {
        const fx = f.x * CELL + CELL / 2;
        const fy = f.y * CELL + CELL / 2;
        const pulse = 0.85 + 0.15 * Math.sin(Date.now() * 0.006);
        const r = CELL * 0.32 * pulse;
        glow(ctx, colors.foodGlow, 16, () => {
          ctx.fillStyle = colors.food;
          ctx.beginPath(); ctx.arc(fx, fy, r, 0, Math.PI * 2); ctx.fill();
        });
        ctx.fillStyle = "#ffffff";
        ctx.beginPath(); ctx.arc(fx, fy, r * 0.35, 0, Math.PI * 2); ctx.fill();
      }

      // Snake body
      for (let i = snake.length - 1; i >= 1; i--) {
        const s = snake[i];
        const t = i / snake.length;
        const alpha = 0.4 + 0.6 * t;
        const pad = CELL * 0.12;
        glow(ctx, colors.snakeGlow, 8 * t, () => {
          ctx.fillStyle = colors.bodyGrad(t, alpha);
          roundRect(ctx, s.x * CELL + pad, s.y * CELL + pad, CELL - pad * 2, CELL - pad * 2, 5);
          ctx.fill();
        });
      }

      // Snake head
      if (snake.length > 0) {
        const h = snake[0];
        const pad = CELL * 0.08;
        glow(ctx, colors.snakeGlow, 20, () => {
          ctx.fillStyle = colors.snakeHead;
          roundRect(ctx, h.x * CELL + pad, h.y * CELL + pad, CELL - pad * 2, CELL - pad * 2, 6);
          ctx.fill();
        });
        // Eyes
        const prev = snake[1] ?? { x: h.x, y: h.y + 1 };
        const dx = h.x - prev.x, dy = h.y - prev.y;
        const eyeOffset = CELL * 0.22, eyeR = CELL * 0.1, fwd = CELL * 0.12;
        const cx2 = h.x * CELL + CELL / 2 + dx * fwd;
        const cy2 = h.y * CELL + CELL / 2 + dy * fwd;
        for (const side of [-1, 1] as const) {
          ctx.fillStyle = colors.bg;
          ctx.beginPath(); ctx.arc(cx2 + (-dy) * eyeOffset * side, cy2 + dx * eyeOffset * side, eyeR, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = colors.snake;
          ctx.beginPath(); ctx.arc(cx2 + (-dy) * eyeOffset * side, cy2 + dx * eyeOffset * side, eyeR * 0.5, 0, Math.PI * 2); ctx.fill();
        }
      }

      // Particles
      for (const p of particles) {
        const alpha = p.life / p.maxLife;
        ctx.fillStyle = colors.burst.replace("0.85", (alpha * 0.85).toFixed(2));
        ctx.beginPath(); ctx.arc(p.x, p.y, 2.5 * alpha, 0, Math.PI * 2); ctx.fill();
      }

      // HUD
      const hx = 12, hy = 12;
      ctx.fillStyle = colors.hudBg;
      roundRect(ctx, hx, hy, 144, 68, 8); ctx.fill();
      ctx.strokeStyle = colors.hudBorder; ctx.lineWidth = 1; ctx.stroke();
      ctx.textAlign = "left";
      ctx.font = "bold 10px 'Courier New', monospace";
      ctx.fillStyle = colors.hudSub;
      ctx.fillText("SCORE", hx + 10, hy + 20);
      ctx.font = "bold 20px 'Courier New', monospace";
      glow(ctx, colors.hudText, 8, () => {
        ctx.fillStyle = colors.hudText;
        ctx.fillText(String(score).padStart(6, "0"), hx + 10, hy + 42);
      });
      ctx.font = "bold 10px 'Courier New', monospace";
      ctx.fillStyle = colors.hudSub;
      ctx.fillText(`LVL ${level}   LEN ${snake.length}`, hx + 10, hy + 60);
      // Corner brackets
      ctx.strokeStyle = colors.hudCorner; ctx.lineWidth = 1.5;
      const L = 18;
      ctx.beginPath(); ctx.moveTo(hx, hy + L); ctx.lineTo(hx, hy); ctx.lineTo(hx + L, hy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(hx + 144 - L, hy); ctx.lineTo(hx + 144, hy); ctx.lineTo(hx + 144, hy + L); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(hx, hy + 68 - L); ctx.lineTo(hx, hy + 68); ctx.lineTo(hx + L, hy + 68); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(hx + 144 - L, hy + 68); ctx.lineTo(hx + 144, hy + 68); ctx.lineTo(hx + 144, hy + 68 - L); ctx.stroke();
    }

    function step() {
      if (cols <= 0 || rows <= 0 || !snake.length) return;
      const next = pickMove(snake, foods, cols, rows);

      trail.unshift({ ...snake[snake.length - 1], age: 0 });
      if (trail.length > snake.length + 6) trail.pop();
      trail.forEach((t) => t.age++);

      const ateIdx = foods.findIndex((f) => eq(f, next));
      if (ateIdx >= 0) {
        burst(next.x * CELL + CELL / 2, next.y * CELL + CELL / 2);
        snake = [next, ...snake];
        foods.splice(ateIdx, 1);
        foods.push(placeFood(snake, foods, cols, rows));
        score += 10 * level;
        level = Math.max(1, Math.floor(score / 100) + 1);
      } else {
        snake = [next, ...snake.slice(0, -1)];
      }

      const hk = key(snake[0]);
      if (snake.slice(1).some((s) => key(s) === hk)) {
        score = 0; level = 1; init();
      }
    }

    function loop(ts: number) {
      rafId = requestAnimationFrame(loop);
      const dt = ts - lastTime;
      lastTime = ts;
      stepTimer += dt;
      const interval = Math.max(60, STEP_MS - (level - 1) * 6);
      while (stepTimer >= interval) { step(); stepTimer -= interval; }
      const dtSec = dt / 1000;
      particles = particles
        .map((p) => ({ ...p, x: p.x + p.vx * dtSec, y: p.y + p.vy * dtSec, vx: p.vx * 0.9, vy: p.vy * 0.9, life: p.life - dtSec * 1.8 }))
        .filter((p) => p.life > 0);
      draw();
    }

    rafId = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(rafId); ro.disconnect(); };
  }, [colors, theme, mounted]);

  return (
    <aside
      style={{
        width,
        height: "100%",
        position: "relative",
        flexShrink: 0,
        overflow: "hidden",
        background: colors.bg,
        borderRight: `1px solid ${colors.divider}`,
        ...style,
      }}
      className={className}
    >
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: "100%", height: "100%", imageRendering: "pixelated" }}
      />
    </aside>
  );
}
