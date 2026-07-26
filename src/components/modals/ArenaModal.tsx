"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Star, Medal, ExternalLink } from "lucide-react";
import portfolioData from "@/data/portfolio.json";

const tabs = ["LeetCode", "CodeChef", "HackerRank"];

export default function ArenaModal() {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const { codingStats } = portfolioData;

  return (
    <div className="flex flex-col gap-6 min-h-[350px]">
      <div className="flex items-center gap-3 border-b border-slate-300 dark:border-white/10 pb-4">
        <Trophy className="w-8 h-8 text-neon-accent" />
        <h2 className="text-2xl font-space-grotesk font-bold text-slate-900 dark:text-white">Coding Arena</h2>
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
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 w-full"
          >
            {activeTab === "LeetCode" && (
              <div className="flex flex-col gap-4 p-6 bg-slate-50 dark:bg-black/20 rounded-xl border border-slate-200 dark:border-white/5">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-white/60 font-inter">Global Ranking</span>
                  <span className="text-slate-900 dark:text-white font-bold font-space-grotesk text-xl">{codingStats.leetcode.globalRanking}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-white/60 font-inter">Problems Solved</span>
                  <span className="text-neon-accent font-bold font-space-grotesk text-xl">{codingStats.leetcode.problemsSolved}</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full mt-4 overflow-hidden">
                  <div className="h-full bg-neon-accent transition-all duration-1000" style={{ width: `${codingStats.leetcode.progressPercentage}%` }} />
                </div>
                <a href={codingStats.leetcode.profileUrl} target="_blank" rel="noopener noreferrer" className="mt-2 flex items-center justify-center gap-2 py-3 bg-neon-accent/10 hover:bg-neon-accent/20 border border-neon-accent/20 text-neon-accent rounded-xl transition-all font-inter font-semibold text-sm">
                  <ExternalLink className="w-4 h-4" />
                  View LeetCode Profile
                </a>
              </div>
            )}
            
            {activeTab === "CodeChef" && (
              <div className="flex flex-col gap-4 p-6 bg-slate-50 dark:bg-black/20 rounded-xl border border-slate-200 dark:border-white/5">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-white/60 font-inter">Current Rating</span>
                  <span className="text-slate-900 dark:text-white font-bold font-space-grotesk text-xl">{codingStats.codechef.rating}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-white/60 font-inter">Highest Division</span>
                  <span className="text-neon-accent font-bold font-space-grotesk text-xl">{codingStats.codechef.highestDivision}</span>
                </div>
                <div className="flex items-center gap-1 mt-4">
                  <span className="text-slate-600 dark:text-white/60 font-inter mr-2">Stars:</span>
                  {[...Array(codingStats.codechef.stars)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <a href={codingStats.codechef.profileUrl} target="_blank" rel="noopener noreferrer" className="mt-2 flex items-center justify-center gap-2 py-3 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl transition-all font-inter font-semibold text-sm">
                  <ExternalLink className="w-4 h-4" />
                  View CodeChef Profile
                </a>
              </div>
            )}
            
            {activeTab === "HackerRank" && (
              <div className="flex flex-col gap-6 p-6 bg-slate-50 dark:bg-black/20 rounded-xl border border-slate-200 dark:border-white/5">
                <div className="flex flex-col gap-6">
                  {codingStats.hackerrank.badges.map((badge, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <Medal className={`w-12 h-12 ${idx === 0 ? 'text-yellow-400' : 'text-gray-300'}`} />
                      <div>
                        <h3 className="text-slate-900 dark:text-white font-bold font-space-grotesk text-lg">{badge.topic}</h3>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(badge.stars)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-neon-accent fill-neon-accent" />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <a href={codingStats.hackerrank.profileUrl} target="_blank" rel="noopener noreferrer" className="mt-2 flex items-center justify-center gap-2 py-3 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl transition-all font-inter font-semibold text-sm">
                  <ExternalLink className="w-4 h-4" />
                  View HackerRank Profile
                </a>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
