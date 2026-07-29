"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Code, Database, Brain, Cloud, FileText } from "lucide-react";
import portfolioData from "@/data/portfolio.json";
import AnimatedList from "@/components/AnimatedList/AnimatedList";
import OptionWheel from "@/components/OptionWheel/OptionWheel";
import { useIsMobile } from "@/hooks/useIsMobile";

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
  const [selectedCertIndex, setSelectedCertIndex] = useState(0);
  const isMobile = useIsMobile();
  const { skills } = portfolioData;
  const certificates = portfolioData.certificates as Certificate[];

  // Helper to truncate titles for OptionWheel display
  const truncateTitle = (title: string, maxLength: number = 32) => {
    if (title.length <= maxLength) return title;
    return title.slice(0, maxLength) + "...";
  };

  const certTitles = certificates.map((cert) => truncateTitle(cert.title || cert.name || "", isMobile ? 26 : 32));

  return (
    <div className="flex flex-col gap-6 min-h-[480px]">
      <div className="flex items-center gap-3 border-b border-slate-300 dark:border-white/10 pb-4">
        <BookOpen className="w-8 h-8 text-neon-accent" />
        <h2 className="text-2xl font-space-grotesk font-bold text-slate-900 dark:text-white">Knowledge Forge</h2>
      </div>

      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`cursor-target flex-1 py-2 rounded-lg font-inter font-medium text-sm transition-all ${
              activeTab === tab
                ? "bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white"
                : "text-slate-500 dark:text-white/50 hover:text-slate-900 dark:hover:text-white/80 hover:bg-slate-100 dark:hover:bg-white/5"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="relative flex-1 min-h-[380px] md:min-h-[400px]">
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
              className="absolute inset-0 w-full grid grid-cols-1 md:grid-cols-5 gap-6"
            >
              {/* Left Side: OptionWheel Selector */}
              <div className="md:col-span-2 relative h-[180px] md:h-full border border-slate-200 dark:border-white/5 rounded-xl bg-slate-50/55 dark:bg-black/15 flex flex-col justify-center overflow-hidden">
                <OptionWheel
                  items={certTitles}
                  defaultSelected={selectedCertIndex}
                  onChange={(index) => setSelectedCertIndex(index)}
                  textColor="var(--wheel-text-color)"
                  activeColor="var(--wheel-active-color)"
                  side="left"
                  fontSize={isMobile ? 1.0 : 1.2}
                  spacing={isMobile ? 1.5 : 1.7}
                  curve={isMobile ? 0.6 : 0.8}
                  tilt={isMobile ? 4 : 5}
                  blur={1.5}
                  fade={0.3}
                  minOpacity={0.15}
                  smoothing={250}
                  inset={isMobile ? 20 : 30}
                  loop={false}
                  draggable={true}
                />
                <div className="absolute bottom-2 inset-x-0 text-[10px] text-center text-slate-400 dark:text-white/30 uppercase tracking-widest pointer-events-none font-medium select-none">
                  Drag or Scroll Wheel
                </div>
              </div>

              {/* Right Side: Details Card */}
              <div className="md:col-span-3 flex flex-col justify-between p-6 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-xl min-h-[180px] md:h-full overflow-y-auto">
                <AnimatePresence mode="wait">
                  {certificates[selectedCertIndex] && (
                    <motion.div
                      key={selectedCertIndex}
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      transition={{ duration: 0.15 }}
                      className="flex flex-col justify-between h-full w-full gap-4"
                    >
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                            {certificates[selectedCertIndex].issuer || "Certification"}
                          </span>
                          {certificates[selectedCertIndex].score && (
                            <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full">
                              Score: {certificates[selectedCertIndex].score}
                            </span>
                          )}
                        </div>
                        <h4 className="text-base md:text-lg font-bold font-space-grotesk text-slate-900 dark:text-white leading-snug">
                          {certificates[selectedCertIndex].title || certificates[selectedCertIndex].name}
                        </h4>
                        {certificates[selectedCertIndex].date && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-inter">
                            Earned: {certificates[selectedCertIndex].date}
                          </p>
                        )}
                        {certificates[selectedCertIndex].id && (
                          <p className="text-[10px] text-slate-400 dark:text-white/30 font-mono tracking-tight mt-1">
                            Credential ID: {certificates[selectedCertIndex].id}
                          </p>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-2 mt-auto">
                        <a
                          href={certificates[selectedCertIndex].pdfUrl || certificates[selectedCertIndex].url || certificates[selectedCertIndex].link || certificates[selectedCertIndex].verificationUrl || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="cursor-target flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white font-medium text-xs rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm"
                        >
                          <FileText className="w-4 h-4" />
                          View Certificate Document
                        </a>

                        {certificates[selectedCertIndex].verificationUrl && (
                          <a
                            href={certificates[selectedCertIndex].verificationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="cursor-target py-2.5 px-4 bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-800 dark:text-white font-medium text-xs rounded-lg flex items-center justify-center gap-2 transition-all"
                          >
                            Verify Credential
                          </a>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
