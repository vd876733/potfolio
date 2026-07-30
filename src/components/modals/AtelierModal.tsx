"use client";

import { Palette } from "lucide-react";
import portfolioData from "@/data/portfolio.json";
import Smooth3DSlideshow, { Slide } from "@/components/Smooth3DSlideshow";

export default function AtelierModal() {
  const { sketches } = portfolioData;

  const gallerySlides: Slide[] = sketches.map((s, idx) => ({
    id: s.id ?? idx + 1,
    title: (s as any).title || `Artwork ${idx + 1}`,
    image: (s as any).image || (s as any).img,
    fullRes: (s as any).fullRes || (s as any).image || (s as any).img,
    artist: (s as any).artist || "Varad Deshmukh",
    medium: (s as any).medium || "3D Digital Concept",
    year: (s as any).year || "2026",
    description: (s as any).description || "Creative 3D visual concept and artwork study."
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-slate-300 dark:border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <Palette className="w-8 h-8 text-neon-accent" />
          <h2 className="text-2xl font-space-grotesk font-bold text-slate-900 dark:text-white">
            Creative Atelier & Artwork Gallery
          </h2>
        </div>
        <span className="text-xs font-mono text-slate-500 dark:text-white/40 hidden sm:inline-block">
          Interactive 3D View
        </span>
      </div>

      <div className="w-full">
        <Smooth3DSlideshow slides={gallerySlides} />
      </div>
    </div>
  );
}
