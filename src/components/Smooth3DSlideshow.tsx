"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Maximize2, Sparkles } from "lucide-react";
import { useTheme } from "next-themes";

export interface Slide {
  id?: string | number;
  title: string;
  image: string;
  artist?: string;
  medium?: string;
  year?: string;
  fullRes?: string;
  description?: string;
}

export interface Smooth3DSlideshowProps {
  slides?: Slide[];
  initialIndex?: number;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  className?: string;
}

const DEFAULT_SLIDES: Slide[] = [
  {
    id: 1,
    title: "Cybernetic Horizon",
    artist: "Aria Vance",
    medium: "Digital 3D Render",
    year: "2026",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop",
    fullRes: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=100&w=2400&auto=format&fit=crop",
    description: "An exploration of surreal neon landscapes in futuristic architecture."
  },
  {
    id: 2,
    title: "Abstract Quantum",
    artist: "Marcus Chen",
    medium: "Generative Art",
    year: "2025",
    image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1000&auto=format&fit=crop",
    fullRes: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=100&w=2400&auto=format&fit=crop",
    description: "Fluid particulate mechanics simulated with custom shaders."
  },
  {
    id: 3,
    title: "Neon Synthesis",
    artist: "Elena Rostova",
    medium: "Octane Render • Raytracing",
    year: "2026",
    image: "https://images.unsplash.com/photo-1614036417651-efe5912149d8?q=80&w=1000&auto=format&fit=crop",
    fullRes: "https://images.unsplash.com/photo-1614036417651-efe5912149d8?q=100&w=2400&auto=format&fit=crop",
    description: "Vibrant iridescent geometry interacting with ambient volumetric light."
  },
  {
    id: 4,
    title: "Prismatic Solitude",
    artist: "Kaelen Voss",
    medium: "Mixed Media 3D",
    year: "2024",
    image: "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?q=80&w=1000&auto=format&fit=crop",
    fullRes: "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?q=100&w=2400&auto=format&fit=crop",
    description: "Crystalline refractive shapes forming quiet spatial compositions."
  },
  {
    id: 5,
    title: "Chrono Echoes",
    artist: "Sora Takahashi",
    medium: "Procedural Canvas",
    year: "2025",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1000&auto=format&fit=crop",
    fullRes: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=100&w=2400&auto=format&fit=crop",
    description: "Mathematical chaos equations captured in static three-dimensional form."
  },
  {
    id: 6,
    title: "Hyperion Monolith",
    artist: "Aria Vance",
    medium: "Blender 3D",
    year: "2026",
    image: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=1000&auto=format&fit=crop",
    fullRes: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=100&w=2400&auto=format&fit=crop",
    description: "Monolithic metallic surfaces reflecting alien starscapes."
  }
];

export default function Smooth3DSlideshow({
  slides = DEFAULT_SLIDES,
  initialIndex = 0,
  autoPlay = false,
  autoPlayInterval = 5000,
  className = ""
}: Smooth3DSlideshowProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLight = mounted && theme === "light";
  const totalSlides = slides.length;

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Handle Card Click logic:
  // 1. If clicking an INACTIVE card, bring it to center.
  // 2. If clicking the ALREADY ACTIVE center card, open high-res lightbox modal.
  const handleCardClick = (index: number) => {
    if (index !== activeIndex) {
      setActiveIndex(index);
    } else {
      setIsLightboxOpen(true);
    }
  };

  // Keyboard navigation & Esc key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLightboxOpen) {
        if (e.key === "Escape") setIsLightboxOpen(false);
        if (e.key === "ArrowRight") handleNext();
        if (e.key === "ArrowLeft") handlePrev();
        return;
      }

      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, handleNext, handlePrev]);

  // Optional Autoplay
  useEffect(() => {
    if (!autoPlay || isLightboxOpen || totalSlides <= 1) return;
    const timer = setInterval(() => {
      handleNext();
    }, autoPlayInterval);
    return () => clearInterval(timer);
  }, [autoPlay, autoPlayInterval, isLightboxOpen, totalSlides, handleNext]);

  // Helper to determine offset relative to active card (-2, -1, 0, 1, 2)
  const getCardOffset = (index: number) => {
    let diff = index - activeIndex;

    if (diff > totalSlides / 2) {
      diff -= totalSlides;
    } else if (diff < -totalSlides / 2) {
      diff += totalSlides;
    }
    return diff;
  };

  const activeSlide = slides[activeIndex];

  return (
    <div
      className={`relative w-full min-h-[520px] sm:min-h-[600px] flex flex-col items-center justify-center overflow-hidden py-10 select-none transition-colors duration-500 ${className}`}
    >
      {/* Dynamic Ambient Background Glow matching active theme */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-700">
        <div
          className={`w-[450px] h-[300px] rounded-full blur-3xl transition-all duration-700 animate-pulse ${
            isLight
              ? "bg-gradient-to-tr from-sky-200 via-indigo-200 to-purple-300 opacity-60"
              : "bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 opacity-30"
          }`}
        />
      </div>

      {/* 3D Carousel Track */}
      <div 
        className="relative w-full max-w-5xl h-[380px] sm:h-[440px] flex items-center justify-center"
        style={{ perspective: "1200px" }}
      >
        {slides.map((slide, index) => {
          const offset = getCardOffset(index);
          const isActive = offset === 0;

          // Performance Optimization: eager loading for active & adjacent cards
          const isAdjacent = Math.abs(offset) <= 1;
          const imageLoadingStrategy = isAdjacent ? "eager" : "lazy";

          // Calculate 3D transformations
          const absOffset = Math.abs(offset);
          const isVisible = absOffset <= 2;

          if (!isVisible) return null;

          const translateX = offset * 220;
          const translateZ = -absOffset * 160;
          const rotateY = offset * -18;
          const scale = isActive ? 1 : Math.max(0.72, 1 - absOffset * 0.15);
          const opacity = isActive ? 1 : Math.max(0.45, 1 - absOffset * 0.35);
          const zIndex = 30 - absOffset * 10;

          // Subtitle text for medium • year
          const subtitleParts = [slide.medium, slide.year].filter(Boolean);
          const subtitleText = subtitleParts.join(" • ");

          // Artwork index formatting e.g. "01 / 06"
          const artworkIndexTag = `${String(index + 1).padStart(2, "0")} / ${String(totalSlides).padStart(2, "0")}`;

          return (
            <motion.div
              key={slide.id ?? index}
              onClick={() => handleCardClick(index)}
              initial={false}
              animate={{
                x: translateX,
                z: translateZ,
                rotateY: rotateY,
                scale: scale,
                opacity: opacity,
              }}
              transition={{
                duration: 0.5,
                ease: [0.25, 1, 0.5, 1],
              }}
              style={{
                zIndex,
                transformStyle: "preserve-3d",
              }}
              className={`absolute top-0 w-[270px] sm:w-[320px] md:w-[360px] h-[360px] sm:h-[420px] rounded-2xl overflow-hidden cursor-pointer shadow-2xl border transition-all duration-500 ${
                isActive
                  ? isLight
                    ? "border-slate-300 shadow-slate-400/30 ring-2 ring-indigo-500/20"
                    : "border-white/40 shadow-indigo-500/30 ring-2 ring-purple-400/20"
                  : isLight
                    ? "border-slate-200/80 grayscale-[25%] hover:grayscale-0 hover:border-slate-400"
                    : "border-white/10 grayscale-[30%] hover:grayscale-0 hover:border-white/30"
              }`}
            >
              {/* Card Image & Overlay Container */}
              <div
                className={`relative w-full h-full group transition-colors duration-500 ${
                  isLight ? "bg-slate-100" : "bg-slate-900"
                }`}
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  loading={imageLoadingStrategy}
                  className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-700 ease-out"
                />

                {/* Glassmorphic tag on top-right corner of ACTIVE card (Theme Reactive) */}
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: -5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className={`absolute top-3.5 right-3.5 px-3 py-1 text-[11px] sm:text-xs font-mono font-semibold tracking-wider rounded-full backdrop-blur-md border shadow-lg z-20 flex items-center gap-1.5 transition-colors duration-500 ${
                      isLight
                        ? "bg-white/85 border-slate-300/80 text-slate-800 shadow-slate-400/20"
                        : "bg-slate-900/75 border-white/20 text-white shadow-black/40"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {artworkIndexTag}
                  </motion.div>
                )}

                {/* Active card click-to-expand badge */}
                {isActive && (
                  <div
                    className={`absolute top-3.5 left-3.5 px-2.5 py-1 text-[10px] sm:text-xs font-medium rounded-full backdrop-blur-md border opacity-0 group-hover:opacity-100 transition-all duration-200 z-20 flex items-center gap-1 ${
                      isLight
                        ? "bg-slate-900/70 border-slate-700 text-white"
                        : "bg-white/20 border-white/30 text-white"
                    }`}
                  >
                    <Maximize2 className="w-3 h-3" />
                    <span>Expand</span>
                  </div>
                )}

                {/* Gradient Overlay for card text readability (Theme Reactive) */}
                <div
                  className={`absolute inset-0 z-10 transition-all duration-500 ${
                    isLight
                      ? "bg-gradient-to-t from-white/95 via-white/40 to-transparent"
                      : "bg-gradient-to-t from-black/90 via-black/35 to-transparent"
                  }`}
                />

                {/* Enhanced Artwork Card UI: Title in bold, followed by medium • year subtitle */}
                <div className="absolute bottom-0 inset-x-0 p-5 z-20 text-left flex flex-col justify-end">
                  <h3
                    className={`text-lg sm:text-xl font-bold tracking-tight transition-colors duration-500 line-clamp-1 ${
                      isLight ? "text-slate-900 drop-shadow-sm" : "text-white drop-shadow-md"
                    }`}
                  >
                    {slide.title}
                  </h3>

                  {subtitleText && (
                    <p
                      className={`text-xs sm:text-sm font-medium tracking-wide mt-1 flex items-center gap-2 transition-colors duration-500 ${
                        isLight ? "text-indigo-700" : "text-slate-300/90"
                      }`}
                    >
                      <span>{subtitleText}</span>
                    </p>
                  )}

                  {slide.artist && (
                    <p
                      className={`text-[11px] sm:text-xs font-sans mt-0.5 transition-colors duration-500 ${
                        isLight ? "text-slate-500" : "text-white/60"
                      }`}
                    >
                      by {slide.artist}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Navigation Controls (Theme Reactive) */}
      <div className="relative z-30 flex items-center justify-between w-full max-w-xs sm:max-w-md mt-6 px-4">
        {/* Prev Button */}
        <button
          onClick={handlePrev}
          aria-label="Previous slide"
          className={`p-3 rounded-full backdrop-blur-md border shadow-lg transition-all transform hover:scale-105 active:scale-95 ${
            isLight
              ? "bg-white/80 hover:bg-white border-slate-300 text-slate-800 shadow-slate-300/50"
              : "bg-white/10 hover:bg-white/20 border-white/15 text-white shadow-black/40"
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Indicator Dots */}
        <div className="flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === activeIndex
                  ? isLight
                    ? "w-7 bg-slate-900 shadow-md"
                    : "w-7 bg-white shadow-md shadow-white/30"
                  : isLight
                    ? "w-2 bg-slate-300 hover:bg-slate-400"
                    : "w-2 bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          aria-label="Next slide"
          className={`p-3 rounded-full backdrop-blur-md border shadow-lg transition-all transform hover:scale-105 active:scale-95 ${
            isLight
              ? "bg-white/80 hover:bg-white border-slate-300 text-slate-800 shadow-slate-300/50"
              : "bg-white/10 hover:bg-white/20 border-white/15 text-white shadow-black/40"
          }`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Lightbox Modal Overlay (Theme Reactive) */}
      <AnimatePresence>
        {isLightboxOpen && activeSlide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLightboxOpen(false)}
            className={`fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 backdrop-blur-xl cursor-zoom-out transition-colors duration-500 ${
              isLight ? "bg-slate-900/60" : "bg-black/90"
            }`}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className={`relative max-w-6xl w-full max-h-[90vh] flex flex-col items-center justify-center cursor-default rounded-2xl border overflow-hidden shadow-2xl transition-colors duration-500 ${
                isLight
                  ? "bg-white border-slate-200 text-slate-900 shadow-slate-900/20"
                  : "bg-slate-950/90 border-white/15 text-white shadow-black/80"
              }`}
            >
              {/* Header Bar */}
              <div
                className={`w-full flex items-center justify-between px-6 py-4 border-b backdrop-blur-md z-10 transition-colors duration-500 ${
                  isLight
                    ? "bg-slate-50/90 border-slate-200 text-slate-900"
                    : "bg-slate-900/50 border-white/10 text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2.5 py-1 text-xs font-mono font-medium rounded-full border transition-colors duration-500 ${
                      isLight
                        ? "bg-slate-200/80 border-slate-300 text-slate-800"
                        : "bg-white/10 border-white/15 text-white/90"
                    }`}
                  >
                    {String(activeIndex + 1).padStart(2, "0")} / {String(totalSlides).padStart(2, "0")}
                  </span>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold leading-snug">
                      {activeSlide.title}
                    </h2>
                    {activeSlide.artist && (
                      <p className={`text-xs ${isLight ? "text-slate-500" : "text-white/60"}`}>
                        by {activeSlide.artist}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setIsLightboxOpen(false)}
                  aria-label="Close Lightbox"
                  className={`p-2 rounded-full transition-colors border ${
                    isLight
                      ? "text-slate-600 hover:text-slate-900 bg-slate-200/60 hover:bg-slate-200 border-slate-300"
                      : "text-white/70 hover:text-white bg-white/5 hover:bg-white/15 border-white/10"
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Full-Res Image Viewer */}
              <div
                className={`relative w-full flex-1 flex items-center justify-center p-4 min-h-[350px] sm:min-h-[500px] max-h-[72vh] overflow-hidden transition-colors duration-500 ${
                  isLight ? "bg-slate-100" : "bg-black/40"
                }`}
              >
                <img
                  src={activeSlide.fullRes || activeSlide.image}
                  alt={activeSlide.title}
                  loading="eager"
                  className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl select-none"
                />

                {/* Lightbox Nav Arrows */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                  className={`absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full backdrop-blur-md border transition-all hover:scale-110 ${
                    isLight
                      ? "bg-white/80 hover:bg-white border-slate-300 text-slate-800 shadow-lg"
                      : "bg-black/50 hover:bg-black/80 border-white/20 text-white"
                  }`}
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full backdrop-blur-md border transition-all hover:scale-110 ${
                    isLight
                      ? "bg-white/80 hover:bg-white border-slate-300 text-slate-800 shadow-lg"
                      : "bg-black/50 hover:bg-black/80 border-white/20 text-white"
                  }`}
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Artwork Info Footer */}
              <div
                className={`w-full px-6 py-4 border-t backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs transition-colors duration-500 ${
                  isLight
                    ? "bg-slate-50/90 border-slate-200 text-slate-700"
                    : "bg-slate-900/60 border-white/10 text-white/80"
                }`}
              >
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  {[activeSlide.medium, activeSlide.year].filter(Boolean).length > 0 && (
                    <div
                      className={`flex items-center gap-1.5 font-semibold ${
                        isLight ? "text-indigo-600" : "text-indigo-300"
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{[activeSlide.medium, activeSlide.year].filter(Boolean).join(" • ")}</span>
                    </div>
                  )}
                  {activeSlide.description && (
                    <span className={`italic line-clamp-1 ${isLight ? "text-slate-500" : "text-white/70"}`}>
                      {activeSlide.description}
                    </span>
                  )}
                </div>

                <div className={isLight ? "text-slate-400 text-[11px]" : "text-white/50 text-[11px]"}>
                  Press{" "}
                  <kbd
                    className={`px-1.5 py-0.5 rounded border font-mono ${
                      isLight
                        ? "bg-slate-200 border-slate-300 text-slate-700"
                        : "bg-white/10 border-white/20 text-white/80"
                    }`}
                  >
                    Esc
                  </kbd>{" "}
                  to exit lightbox
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
