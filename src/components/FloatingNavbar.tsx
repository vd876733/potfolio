"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Monitor, Map, Sun, Moon } from "lucide-react";

interface FloatingNavbarProps {
  onNavClick?: (section: string) => void;
  viewMode?: "3D" | "2D";
  toggleViewMode?: () => void;
}

const navItems = [
  { id: "Town Plaza", label: "About" },
  { id: "Arena Complex", label: "Stats" },
  { id: "Project Workshops", label: "Projects" },
  { id: "Knowledge Forge", label: "Skills" },
  { id: "Creative Atelier", label: "Gallery" },
];

export default function FloatingNavbar({
  onNavClick,
  viewMode = "3D",
  toggleViewMode,
}: FloatingNavbarProps) {
  const [activeTab, setActiveTab] = useState<string>("Town Plaza");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll listener to update active tab based on section in view
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (const item of navItems) {
        const element = document.getElementById(item.id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;

          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveTab(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleTabClick = (sectionId: string) => {
    setActiveTab(sectionId);
    if (onNavClick) {
      onNavClick(sectionId);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header className="fixed top-6 left-0 right-0 z-50 px-4 flex justify-center pointer-events-none">
      <nav className="max-w-4xl mx-auto w-full rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 shadow-lg px-5 py-2.5 flex items-center justify-between pointer-events-auto transition-all">
        
        {/* Left Section: Brand */}
        <div className="flex items-center gap-3">
          {/* Avatar Badge */}
          <div className="w-8 h-8 rounded-full bg-sky-500/10 text-sky-500 font-mono font-bold text-xs flex items-center justify-center border border-sky-500/20 shrink-0">
            VD
          </div>
          {/* Brand Name */}
          <span className="font-space-grotesk font-bold text-sm tracking-wider uppercase text-slate-900 dark:text-white select-none">
            VARAD <span className="text-sky-500">DESHMUKH</span>
          </span>
        </div>

        {/* Center Section: Navigation Links with Active Sliding Pill (Framer Motion) */}
        <div className="hidden md:flex items-center gap-1 relative font-inter text-xs sm:text-sm font-medium">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`relative px-4 py-1.5 rounded-full transition-colors ${
                  isActive
                    ? "text-sky-600 dark:text-sky-400 font-semibold"
                    : "text-slate-600 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400"
                }`}
              >
                {/* Active Sliding Background Pill */}
                {isActive && (
                  <motion.div
                    layoutId="activePill"
                    className="absolute inset-0 bg-sky-500/10 dark:bg-sky-500/20 rounded-full -z-10 border border-sky-500/20"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Right Section: Action Toggles */}
        <div className="flex items-center gap-3">
          {/* 3D / 2D View Switcher */}
          {toggleViewMode && (
            <button
              onClick={toggleViewMode}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-xs font-inter font-medium text-slate-800 dark:text-slate-200 transition-all active:scale-95 shadow-sm"
              title="Toggle View Mode"
            >
              {viewMode === "3D" ? (
                <>
                  <Monitor className="w-4 h-4 text-sky-500" />
                  <span>2D Mode</span>
                </>
              ) : (
                <>
                  <Map className="w-4 h-4 text-sky-500" />
                  <span>3D Map</span>
                </>
              )}
            </button>
          )}

          {/* Dark Mode Switcher */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 flex items-center justify-center text-slate-700 dark:text-slate-200 transition-all active:scale-95 shadow-sm"
              title="Toggle Theme"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-sky-500" />
              )}
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
