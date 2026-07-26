"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { AnimatePresence } from "framer-motion";

import ModalWrapper from "@/components/modals/ModalWrapper";
import TownPlazaModal from "@/components/modals/TownPlazaModal";
import ArenaModal from "@/components/modals/ArenaModal";
import WorkshopModal from "@/components/modals/WorkshopModal";
import ForgeModal from "@/components/modals/ForgeModal";
import AtelierModal from "@/components/modals/AtelierModal";
import TopNav from "@/components/TopNav";
import Portfolio2D from "@/components/Portfolio2D";
import { useIsMobile } from "@/hooks/useIsMobile";

// Dynamically import the Scene to avoid SSR issues with Three.js
const Scene = dynamic(() => import("@/components/Scene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-obsidian z-0">
      <Loader2 className="w-8 h-8 text-white/50 animate-spin" />
    </div>
  ),
});

export default function Home() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"3D" | "2D">("3D");
  const isMobile = useIsMobile();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Determine the initial layout depending on the screen size
    if (!isInitialized) {
      if (window.innerWidth < 768) {
         setViewMode("2D");
      }
      setIsInitialized(true);
    }
  }, [isInitialized]);

  const handleNavClick = (section: string) => {
    if (viewMode === "3D") {
      setActiveSection(section);
    } else {
      const el = document.getElementById(section);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const renderModalContent = () => {
    switch (activeSection) {
      case "Town Plaza": return <TownPlazaModal />;
      case "Arena Complex": return <ArenaModal />;
      case "Project Workshops": return <WorkshopModal />;
      case "Knowledge Forge": return <ForgeModal />;
      case "Creative Atelier": return <AtelierModal />;
      default: return null;
    }
  };

  // Prevent flashing of wrong mode before initialization
  if (!isInitialized) {
    return <div className="w-full h-screen bg-slate-50 dark:bg-obsidian transition-colors duration-300" />;
  }

  return (
    <main className="relative w-full h-screen overflow-hidden bg-slate-50 dark:bg-obsidian transition-colors duration-300">
      <TopNav 
        onNavClick={handleNavClick} 
        viewMode={viewMode} 
        toggleViewMode={() => {
          setViewMode(prev => prev === "3D" ? "2D" : "3D");
          setActiveSection(null); // Clear active modal if switching modes
        }} 
      />

      {viewMode === "3D" ? (
        <>
          <Scene onSectionClick={setActiveSection} isMobile={isMobile} />

          <div className="absolute bottom-8 inset-x-0 z-10 pointer-events-none">
            <footer className="text-center text-sm font-inter text-white/40 tracking-wider">
              DRAG TO EXPLORE
            </footer>
          </div>

          <AnimatePresence>
            {activeSection && (
              <ModalWrapper onClose={() => setActiveSection(null)}>
                {renderModalContent()}
              </ModalWrapper>
            )}
          </AnimatePresence>
        </>
      ) : (
        <Portfolio2D />
      )}
    </main>
  );
}
