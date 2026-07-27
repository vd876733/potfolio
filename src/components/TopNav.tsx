"use client";

import { Monitor, Layers } from "lucide-react";
import portfolioData from "@/data/portfolio.json";
import { ThemeToggle } from "./ThemeToggle";

interface TopNavProps {
  onNavClick: (section: string) => void;
  viewMode: "3D" | "2D";
  toggleViewMode: () => void;
}

const navLinks = [
  { label: "About", section: "Town Plaza" },
  { label: "Stats", section: "Arena Complex" },
  { label: "Projects", section: "Project Workshops" },
  { label: "Skills", section: "Knowledge Forge" },
  { label: "Gallery", section: "Creative Atelier" },
];

export default function TopNav({ onNavClick, viewMode, toggleViewMode }: TopNavProps) {
  const { personal } = portfolioData;

  return (
    <div className="fixed top-0 inset-x-0 z-40 p-4 sm:p-8 pointer-events-none">
      <nav className="glass-panel w-full max-w-7xl mx-auto rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4 pointer-events-auto border border-slate-200 dark:border-white/5 shadow-xl bg-white/80 dark:bg-obsidian/60">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-neon-accent/10 border border-neon-accent/20 flex items-center justify-center">
            <Layers className="w-4 h-4 text-neon-accent" />
          </div>
          <h1 className="text-xl font-space-grotesk font-bold tracking-widest text-slate-900 dark:text-white uppercase hidden sm:block">
            {personal.firstName}<span className="text-neon-accent">{personal.lastName}</span>
          </h1>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => onNavClick(link.section)}
              className="text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white text-xs sm:text-sm font-inter transition-colors"
            >
              {link.label}
            </button>
          ))}

          <div className="h-6 w-px bg-slate-200 dark:bg-white/10 hidden sm:block mx-2" />

          <button
            onClick={toggleViewMode}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-300 dark:border-white/10 rounded-lg transition-colors text-slate-900 dark:text-white text-xs sm:text-sm font-inter font-medium"
          >
            <Monitor className="w-4 h-4 text-neon-accent" />
            {viewMode === "3D" ? "2D Mode" : "3D Map"}
          </button>

          <ThemeToggle />
        </div>
      </nav>
    </div>
  );
}
