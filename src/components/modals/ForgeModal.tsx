"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Code, Database, Brain, Cloud, FileText } from "lucide-react";
import portfolioData from "@/data/portfolio.json";

interface Certificate {
  id?: string;
  title?: string;
  name?: string;
  issuer?: string;
  date?: string;
  score?: string;
  pdfUrl?: string;
  url?: string;
  link?: string;
  verificationUrl?: string;
}

const tabs = ["Technical Skills", "Certificates"];

export default function ForgeModal() {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const { skills } = portfolioData;
  const certificates = portfolioData.certificates as Certificate[];

  return (
    <div className="flex flex-col gap-6 min-h-[400px]">
      <div className="flex items-center gap-3 border-b border-slate-300 dark:border-white/10 pb-4">
        <BookOpen className="w-8 h-8 text-neon-accent" />
        <h2 className="text-2xl font-space-grotesk font-bold text-slate-900 dark:text-white">Knowledge Forge</h2>
      </div>

      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-lg font-inter font-medium text-sm transition-all ${
              activeTab === tab
                ? "bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white"
                : "text-slate-500 dark:text-white/50 hover:text-slate-900 dark:hover:text-white/80 hover:bg-slate-100 dark:hover:bg-white/5"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="relative flex-1">
        <AnimatePresence mode="wait">
          {activeTab === "Technical Skills" && (
            <motion.div
              key="skills"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 w-full grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {Object.entries(skills).map(([category, items]) => (
                <div key={category} className="p-4 bg-slate-50 dark:bg-black/20 rounded-xl border border-slate-200 dark:border-white/5">
                  <div className="flex items-center gap-2 mb-3">
                    {category === "Frontend" && <Code className="w-5 h-5 text-neon-accent" />}
                    {category === "Backend" && <Database className="w-5 h-5 text-neon-accent" />}
                    {category === "AI/ML" && <Brain className="w-5 h-5 text-neon-accent" />}
                    {category === "DevOps" && <Cloud className="w-5 h-5 text-neon-accent" />}
                    <h3 className="text-slate-900 dark:text-white font-bold font-space-grotesk">{category}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {items.map((skill) => (
                      <span key={skill} className="px-2 py-1 bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-700 dark:text-white/80 text-xs font-inter rounded-md">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === "Certificates" && (
            <motion.div
              key="certs"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 w-full grid grid-cols-1 md:grid-cols-2 gap-4 p-2 max-h-[600px] overflow-y-auto"
            >
              {certificates.map((cert, index) => (
                <div key={index} className="flex flex-col justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all">
                  <div>
                    <span className="text-xs font-semibold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider">{cert.issuer || "Certification"}</span>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1 mb-2">{cert.title || cert.name}</h4>
                    {cert.date && <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">{cert.date}</p>}
                  </div>

                  {/* PROMINENT ACTION BUTTON */}
                  <a
                    href={cert.pdfUrl || cert.url || cert.link || cert.verificationUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    View Certificate Document
                  </a>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
