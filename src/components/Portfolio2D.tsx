"use client";

import { useTheme } from "next-themes";
import { useState, useEffect, useRef } from "react";
import TownPlazaModal from "./modals/TownPlazaModal";
import ArenaModal from "./modals/ArenaModal";
import WorkshopModal from "./modals/WorkshopModal";
import ForgeModal from "./modals/ForgeModal";
import AtelierModal from "./modals/AtelierModal";
import CursorGrid from "./CursorGrid";
import BorderGlow from "./BorderGlow";
import TechStack from "./TechStack";
import SplitText from "./SplitText/SplitText";

interface Portfolio2DProps {
  animationKey?: number;
}

export default function Portfolio2D({ animationKey = 0 }: Portfolio2DProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [heroKey, setHeroKey] = useState(0);
  const prevAnimKey = useRef(animationKey);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Re-trigger hero animation every time 2D mode is (re)activated
  useEffect(() => {
    if (animationKey !== prevAnimKey.current) {
      prevAnimKey.current = animationKey;
      setHeroKey((k) => k + 1);
    }
  }, [animationKey]);

  const isLight = mounted && theme === "light";
  const gridColor = isLight ? "#1e3a8a" : "#a78bfa";

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

          {/* ── Hero Welcome Banner (SplitText) ── */}
          <section className="w-full flex flex-col items-center justify-center text-center py-8 sm:py-12 gap-3">
            <div key={`greeting-${heroKey}`} className="overflow-hidden w-full">
              <SplitText
                key={`h1-${heroKey}`}
                text="Hello, Welcome!"
                tag="h1"
                splitType="chars"
                delay={60}
                duration={0.8}
                ease="power3.out"
                from={{ opacity: 0, y: 50, rotateX: -30 }}
                to={{ opacity: 1, y: 0, rotateX: 0 }}
                threshold={0}
                rootMargin="0px"
                textAlign="center"
                className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white font-space-grotesk w-full"
              />
            </div>
            <div key={`sub-${heroKey}`} className="overflow-hidden w-full">
              <SplitText
                key={`p-${heroKey}`}
                text="Explore my portfolio in 2D mode."
                tag="p"
                splitType="words"
                delay={80}
                duration={0.7}
                ease="power2.out"
                from={{ opacity: 0, y: 20 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0}
                rootMargin="0px"
                textAlign="center"
                className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-inter w-full"
              />
            </div>
          </section>

          <section id="Command Central" className="w-full">
            <TownPlazaModal />
          </section>

          <section className="w-full overflow-visible">
            <BorderGlow
              edgeSensitivity={30}
              glowColor={isLight ? "200 80 80" : "260 80 80"}
              backgroundColor={isLight ? "#faf6ee" : "#161322"}
              borderRadius={16}
              glowRadius={35}
              glowIntensity={0.8}
              coneSpread={25}
              colors={isLight ? ['#38bdf8', '#60a5fa', '#93c5fd'] : ['#c084fc', '#a78bfa', '#d8b4fe']}
              className="w-full text-slate-800 dark:text-[#e2e8f0] transition-colors duration-300"
            >
              <div className="p-6 sm:p-8 flex flex-col gap-6">
                <TechStack />
              </div>
            </BorderGlow>
          </section>

          <section id="Cyber Arena" className="w-full overflow-visible">
            <BorderGlow
              edgeSensitivity={30}
              glowColor={isLight ? "200 80 80" : "260 80 80"}
              backgroundColor={isLight ? "#faf6ee" : "#161322"}
              borderRadius={16}
              glowRadius={35}
              glowIntensity={0.8}
              coneSpread={25}
              colors={isLight ? ['#38bdf8', '#60a5fa', '#93c5fd'] : ['#c084fc', '#a78bfa', '#d8b4fe']}
              className="w-full text-slate-800 dark:text-[#e2e8f0] transition-colors duration-300"
            >
              <div className="p-6 sm:p-8 flex flex-col gap-6">
                <ArenaModal />
              </div>
            </BorderGlow>
          </section>

          <section id="Starship Hangar" className="w-full overflow-visible">
            <BorderGlow
              edgeSensitivity={30}
              glowColor={isLight ? "200 80 80" : "260 80 80"}
              backgroundColor={isLight ? "#faf6ee" : "#161322"}
              borderRadius={16}
              glowRadius={35}
              glowIntensity={0.8}
              coneSpread={25}
              colors={isLight ? ['#38bdf8', '#60a5fa', '#93c5fd'] : ['#c084fc', '#a78bfa', '#d8b4fe']}
              className="w-full text-slate-800 dark:text-[#e2e8f0] transition-colors duration-300"
            >
              <div className="p-6 sm:p-8 flex flex-col gap-6">
                <WorkshopModal />
              </div>
            </BorderGlow>
          </section>

          <section id="Quantum Forge" className="w-full overflow-visible">
            <BorderGlow
              edgeSensitivity={30}
              glowColor={isLight ? "200 80 80" : "260 80 80"}
              backgroundColor={isLight ? "#faf6ee" : "#161322"}
              borderRadius={16}
              glowRadius={35}
              glowIntensity={0.8}
              coneSpread={25}
              colors={isLight ? ['#38bdf8', '#60a5fa', '#93c5fd'] : ['#c084fc', '#a78bfa', '#d8b4fe']}
              className="w-full text-slate-800 dark:text-[#e2e8f0] transition-colors duration-300"
            >
              <div className="p-6 sm:p-8 flex flex-col gap-6">
                <ForgeModal />
              </div>
            </BorderGlow>
          </section>

          <section id="Starlight Gallery" className="w-full overflow-visible">
            <BorderGlow
              edgeSensitivity={30}
              glowColor={isLight ? "200 80 80" : "260 80 80"}
              backgroundColor={isLight ? "#faf6ee" : "#161322"}
              borderRadius={16}
              glowRadius={35}
              glowIntensity={0.8}
              coneSpread={25}
              colors={isLight ? ['#38bdf8', '#60a5fa', '#93c5fd'] : ['#c084fc', '#a78bfa', '#d8b4fe']}
              className="w-full text-slate-800 dark:text-[#e2e8f0] transition-colors duration-300"
            >
              <div className="p-6 sm:p-8 flex flex-col gap-6">
                <AtelierModal />
              </div>
            </BorderGlow>
          </section>
        </div>
      </div>
    </div>
  );
}
