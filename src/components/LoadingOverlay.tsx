"use client";

import { useEffect, useState } from "react";
import { Grid } from "ldrs/react";
import "ldrs/react/Grid.css";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingOverlayProps {
  /** Controls visibility of the loading screen overlay */
  isLoading?: boolean;
  /** Custom text displayed beneath the loading spinner */
  caption?: string;
}

export default function LoadingOverlay({
  isLoading = true,
  caption = "Loading 3D World...",
}: LoadingOverlayProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/95 dark:bg-obsidian/95 backdrop-blur-md select-none"
        >
          <div className="flex flex-col items-center justify-center gap-6 p-8 rounded-2xl bg-slate-900/40 border border-slate-800/40 shadow-2xl">
            {/* ldrs Grid Spinner */}
            <div className="relative flex items-center justify-center">
              <Grid size="60" speed="1.5" color="#0ea5e9" />
            </div>

            {/* Loading Caption in Monospace Typography */}
            <div className="flex flex-col items-center gap-1.5 text-center">
              <span className="font-mono text-sm tracking-widest text-sky-400 font-semibold uppercase animate-pulse">
                {caption}
              </span>
              <span className="font-mono text-xs text-slate-400/80 tracking-wider">
                Initializing 3D Canvas & Assets
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
