"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import TownPlazaModal from "./modals/TownPlazaModal";
import ArenaModal from "./modals/ArenaModal";
import WorkshopModal from "./modals/WorkshopModal";
import ForgeModal from "./modals/ForgeModal";
import AtelierModal from "./modals/AtelierModal";
import CursorGrid from "./CursorGrid";

export default function Portfolio2D() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLight = mounted && theme === "light";
  const gridColor = isLight ? "#1e3a8a" : "#ffe200";

  return (
    <div className="relative w-full h-full bg-[#fdfbf7] dark:bg-obsidian text-slate-900 dark:text-white overflow-hidden transition-colors duration-300">
      {/* Interactive Cursor Grid Background */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-40 dark:opacity-60">
        <CursorGrid
          cellSize={64}
          color={gridColor}
          radius={130}
          falloff="smooth"
          holdTime={250}
          fadeDuration={600}
          lineWidth={1.0}
          maxOpacity={0.7}
          fillOpacity={0.04}
          gridOpacity={0.02}
          cellRadius={4}
          clickPulse={true}
          pulseSpeed={450}
        />
      </div>

      {/* Main scrolling content area */}
      <div className="relative z-10 w-full h-full overflow-y-auto pt-32 pb-24 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto flex flex-col gap-12 sm:gap-16">
          <section id="Command Central" className="w-full">
            <TownPlazaModal />
          </section>

          <section id="Cyber Arena" className="w-full bg-[#faf6ee] dark:bg-slate-900 text-slate-800 dark:text-slate-100 p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800 flex flex-col gap-6 transition-colors duration-300">
            <ArenaModal />
          </section>

          <section id="Starship Hangar" className="w-full bg-[#faf6ee] dark:bg-slate-900 text-slate-800 dark:text-slate-100 p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800 flex flex-col gap-6 transition-colors duration-300">
            <WorkshopModal />
          </section>

          <section id="Quantum Forge" className="w-full bg-[#faf6ee] dark:bg-slate-900 text-slate-800 dark:text-slate-100 p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800 flex flex-col gap-6 transition-colors duration-300">
            <ForgeModal />
          </section>

          <section id="Starlight Gallery" className="w-full bg-[#faf6ee] dark:bg-slate-900 text-slate-800 dark:text-slate-100 p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800 flex flex-col gap-6 transition-colors duration-300">
            <AtelierModal />
          </section>
        </div>
      </div>
    </div>
  );
}
