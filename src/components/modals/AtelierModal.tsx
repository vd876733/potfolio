"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, X } from "lucide-react";
import portfolioData from "@/data/portfolio.json";

export default function AtelierModal() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { sketches } = portfolioData;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3 border-b border-slate-300 dark:border-white/10 pb-4">
        <Palette className="w-8 h-8 text-neon-accent" />
        <h2 className="text-2xl font-space-grotesk font-bold text-slate-900 dark:text-white">Creative Atelier</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {sketches.map((sketch) => (
          <motion.div
            key={sketch.id}
            layoutId={`sketch-${sketch.id}`}
            onClick={() => setSelectedImage(sketch.img)}
            className="cursor-pointer overflow-hidden rounded-xl border border-slate-200 dark:border-white/5 aspect-square"
          >
            <motion.img 
              src={sketch.img} 
              alt="Sketch" 
              className="object-cover w-full h-full"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-white/80 dark:bg-black/90 backdrop-blur-md cursor-pointer"
          >
            <motion.div
              layoutId={`sketch-${sketches.find(s => s.img === selectedImage)?.id}`}
              className="relative max-w-5xl w-full max-h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 p-2 text-slate-500 dark:text-white/50 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <img src={selectedImage} alt="Sketch Full" className="w-full max-h-[85vh] object-contain rounded-lg shadow-2xl border border-slate-300 dark:border-white/10" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
