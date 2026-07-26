"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { ReactNode } from "react";

interface ModalWrapperProps {
  onClose: () => void;
  children: ReactNode;
}

export default function ModalWrapper({ onClose, children }: ModalWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/40 backdrop-blur-sm pointer-events-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto glass-panel border border-slate-700/50 rounded-2xl shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>
        {children}
      </motion.div>
    </motion.div>
  );
}
