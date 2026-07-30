"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import {
  ExternalLink,
  CheckCircle2,
  Zap,
  Code2,
  BarChart2,
  Cpu,
  Layers,
  Play,
  Sparkles,
  Terminal,
  ShieldCheck,
  Check,
  Copy,
  Clock,
  Database,
  Flame,
} from "lucide-react";

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

export interface FeaturedProjectCardProps {
  title?: string;
  tagline?: string;
  liveUrl?: string;
  githubUrl?: string;
  stats?: {
    problemsSolved?: string;
    multiLanguage?: string;
    executionSpeed?: string;
  };
  compact?: boolean;
  className?: string;
}

const TECH_STACK = [
  {
    name: "React",
    icon: Code2,
    color: "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-800/50",
  },
  {
    name: "Node.js",
    icon: Terminal,
    color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/50",
  },
  {
    name: "Monaco Editor",
    icon: Sparkles,
    color: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800/50",
  },
  {
    name: "Docker",
    icon: Layers,
    color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/50",
  },
  {
    name: "C++",
    icon: Cpu,
    color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/50",
  },
];

const FEATURES = [
  {
    icon: Code2,
    title: "Monaco Code Editor",
    description: "IntelliSense & auto-completion IDE.",
  },
  {
    icon: Zap,
    title: "Instant Execution",
    description: "Sub-200ms isolated Docker sandbox.",
  },
  {
    icon: BarChart2,
    title: "Complexity Profiler",
    description: "Automated Big-O space & time analysis.",
  },
  {
    icon: ShieldCheck,
    title: "Multi-Language",
    description: "C++, Python, JS, Java & Rust support.",
  },
];

const CODE_SNIPPET = `// Problem: Two Sum (LeetCode #1)
#include <vector>
#include <unordered_map>

class Solution {
public:
    std::vector<int> twoSum(std::vector<int>& nums, int target) {
        std::unordered_map<int, int> map;
        for (int i = 0; i < nums.size(); ++i) {
            int comp = target - nums[i];
            if (map.count(comp)) return {map[comp], i};
            map[nums[i]] = i;
        }
        return {};
    }
};`;

export default function FeaturedProjectCard({
  title = "DSA LeetCode Platform",
  tagline = "An enterprise online judge & algorithmic environment with containerized sandboxes and real-time Big-O complexity profiling.",
  liveUrl = "https://dsa-leetcode.example.com",
  githubUrl = "https://github.com",
  stats = {
    problemsSolved: "100+ Solved",
    multiLanguage: "Multi-Language",
    executionSpeed: "< 200ms Speed",
  },
  compact = true,
  className = "",
}: FeaturedProjectCardProps) {
  const [activeTab, setActiveTab] = useState<"editor" | "results" | "complexity">("editor");
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [copied, setCopied] = useState(false);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRunCode = () => {
    setIsRunning(true);
    setHasRun(false);
    setTimeout(() => {
      setIsRunning(false);
      setHasRun(true);
      setActiveTab("results");
    }, 1000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(CODE_SNIPPET);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2 }}
      className={`relative w-full max-w-4xl mx-auto rounded-xl overflow-hidden shadow-lg dark:shadow-xl transition-all duration-300 bg-white dark:bg-[#0b0914] border border-slate-200 dark:border-[#1e1b2e] ${className}`}
    >
      {/* Top glowing accent line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-purple-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />

      {/* Outer Card Content Container */}
      <div className="relative z-10 p-4 sm:p-6 flex flex-col gap-5">
        
        {/* Main 2-Column Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          {/* LEFT COLUMN: Project Details & Features */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
            
            <div className="space-y-3">
              {/* Badges & Live Status */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                  <Sparkles className="w-3 h-3" />
                  Featured Project
                </span>
                
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                  Live Application
                </span>
              </div>

              {/* Title & Tagline */}
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-purple-900 dark:from-white dark:via-slate-100 dark:to-purple-200 bg-clip-text text-transparent">
                    {title}
                  </span>
                </h2>
                <p className="mt-1.5 text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                  {tagline}
                </p>
              </div>

              {/* Key Feature Highlights Grid */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                {FEATURES.map((feat, idx) => {
                  const Icon = feat.icon;
                  return (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.01 }}
                      className="p-2 rounded-lg bg-slate-50/90 dark:bg-[#141024]/80 border border-slate-200/80 dark:border-[#26203d] hover:border-purple-400/40 dark:hover:border-purple-500/30 transition-colors"
                    >
                      <div className="flex items-start gap-2">
                        <div className="p-1 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5">
                          <Icon className="w-3 h-3" />
                        </div>
                        <div>
                          <h4 className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-none">{feat.title}</h4>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-tight">{feat.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Tech Stack Tags */}
              <div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {TECH_STACK.map((tech) => {
                    const TechIcon = tech.icon;
                    return (
                      <span
                        key={tech.name}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border ${tech.color}`}
                      >
                        <TechIcon className="w-3 h-3" />
                        {tech.name}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* CTAs Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 pt-3 border-t border-slate-200 dark:border-[#1e1b2e]">
              <motion.a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative group overflow-hidden rounded-lg px-4 py-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-slate-950 font-bold text-xs shadow-md hover:shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  Try Live Platform
                  <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </motion.a>

              <motion.a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 dark:bg-[#141024] dark:hover:bg-[#1c1733] dark:text-slate-300 dark:hover:text-white border border-slate-300 dark:border-[#2a2444] font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                View Code
              </motion.a>
            </div>

          </div>

          {/* RIGHT COLUMN: Compact Styled Mock UI / IDE Preview */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="relative flex-1 rounded-xl bg-[#0d0918] border border-[#231e38] shadow-lg overflow-hidden flex flex-col">
              
              {/* IDE Header Bar */}
              <div className="px-3 py-2 bg-[#130f24] border-b border-[#231e38] flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 bg-[#0b0816] px-2 py-0.5 rounded border border-[#231e38]">
                    two_sum.cpp
                  </span>
                </div>

                <div className="flex items-center bg-[#0b0816] p-0.5 rounded border border-[#231e38] text-[10px]">
                  <button
                    onClick={() => setActiveTab("editor")}
                    className={`px-2 py-0.5 rounded transition-colors ${
                      activeTab === "editor"
                        ? "bg-purple-600 text-white font-semibold"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Code
                  </button>
                  <button
                    onClick={() => setActiveTab("results")}
                    className={`px-2 py-0.5 rounded transition-colors flex items-center gap-1 ${
                      activeTab === "results"
                        ? "bg-purple-600 text-white font-semibold"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Results
                    {hasRun && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                  </button>
                  <button
                    onClick={() => setActiveTab("complexity")}
                    className={`px-2 py-0.5 rounded transition-colors ${
                      activeTab === "complexity"
                        ? "bg-purple-600 text-white font-semibold"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Analysis
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleCopyCode}
                    title="Copy Snippet"
                    className="p-1 rounded text-slate-400 hover:text-white bg-[#0b0816] border border-[#231e38] transition-colors"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>

                  <button
                    onClick={handleRunCode}
                    disabled={isRunning}
                    className="px-2.5 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[10px] flex items-center gap-1 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isRunning ? (
                      <span className="w-2.5 h-2.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Play className="w-2.5 h-2.5 fill-slate-950" />
                        Run
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* IDE Body Tabs */}
              <div className="relative flex-1 p-3 overflow-x-auto min-h-[190px] font-mono text-[10.5px] leading-relaxed flex flex-col justify-between">
                <AnimatePresence mode="wait">
                  {/* TAB 1: CODE EDITOR */}
                  {activeTab === "editor" && (
                    <motion.div
                      key="editor"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="space-y-1 text-slate-300"
                    >
                      <div className="flex items-start gap-3">
                        <div className="select-none text-slate-600 text-right font-mono pr-2 border-r border-slate-800/60 text-[10px]">
                          {Array.from({ length: 11 }).map((_, i) => (
                            <div key={i}>{i + 1}</div>
                          ))}
                        </div>
                        <pre className="overflow-x-auto text-slate-300 font-mono text-[10.5px] leading-5">
                          <code>
                            <span className="text-purple-400">#include</span>{" "}
                            <span className="text-emerald-300">&lt;vector&gt;</span>
                            {"\n"}
                            <span className="text-purple-400">#include</span>{" "}
                            <span className="text-emerald-300">&lt;unordered_map&gt;</span>
                            {"\n\n"}
                            <span className="text-blue-400">class</span>{" "}
                            <span className="text-amber-300">Solution</span> {"{\n"}
                            <span className="text-blue-400">public:</span>
                            {"\n"}    <span className="text-blue-300">vector</span>&lt;<span className="text-blue-400">int</span>&gt;{" "}
                            <span className="text-yellow-300">twoSum</span>(
                            <span className="text-blue-300">vector</span>&lt;<span className="text-blue-400">int</span>&gt;&amp; nums, <span className="text-blue-400">int</span> target) {"{\n"}
                            {"        "}unordered_map&lt;<span className="text-blue-400">int</span>, <span className="text-blue-400">int</span>&gt; map;
                            {"\n"}        <span className="text-purple-400">for</span> (<span className="text-blue-400">int</span> i = 0; i &lt; nums.size(); ++i) {"{\n"}
                            {"            "}<span className="text-blue-400">int</span> comp = target - nums[i];
                            {"\n"}            <span className="text-purple-400">if</span> (map.count(comp)) <span className="text-purple-400">return</span> {"{map[comp], i};"}
                            {"\n"}            map[nums[i]] = i;
                            {"\n"}        {"}"}
                            {"\n"}        <span className="text-purple-400">return</span> {"{};"}
                            {"\n"}    {"}"}
                            {"\n"}
                            {"};"}
                          </code>
                        </pre>
                      </div>
                    </motion.div>
                  )}

                  {/* TAB 2: TEST RESULTS / SUBMISSION */}
                  {activeTab === "results" && (
                    <motion.div
                      key="results"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="space-y-2.5"
                    >
                      <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <div>
                            <h4 className="text-xs font-bold text-emerald-400">Accepted</h4>
                            <p className="text-[10px] text-slate-400">57/57 Testcases Passed</p>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                          200 OK
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 rounded-lg bg-[#141024] border border-[#251e3b]">
                          <div className="flex items-center gap-1 text-slate-400 text-[10px]">
                            <Clock className="w-3 h-3 text-cyan-400" />
                            Runtime
                          </div>
                          <p className="text-xs font-bold text-white font-mono mt-0.5">4 ms</p>
                          <p className="text-[9px] text-emerald-400">Beats 98.4%</p>
                        </div>

                        <div className="p-2 rounded-lg bg-[#141024] border border-[#251e3b]">
                          <div className="flex items-center gap-1 text-slate-400 text-[10px]">
                            <Database className="w-3 h-3 text-purple-400" />
                            Memory
                          </div>
                          <p className="text-xs font-bold text-white font-mono mt-0.5">10.2 MB</p>
                          <p className="text-[9px] text-emerald-400">Beats 94.1%</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* TAB 3: COMPLEXITY ANALYZER */}
                  {activeTab === "complexity" && (
                    <motion.div
                      key="complexity"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="space-y-2.5"
                    >
                      <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-purple-300 font-semibold text-[11px]">
                          <Flame className="w-3.5 h-3.5 text-purple-400" />
                          Big-O Result
                        </div>
                        <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">
                          Optimal
                        </span>
                      </div>

                      <div className="space-y-2 text-[10px]">
                        <div>
                          <div className="flex justify-between mb-0.5">
                            <span className="text-slate-300">Time Complexity</span>
                            <span className="font-mono font-bold text-cyan-400">O(N)</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-[#18132b] overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full w-[85%]" />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between mb-0.5">
                            <span className="text-slate-300">Space Complexity</span>
                            <span className="font-mono font-bold text-purple-400">O(N)</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-[#18132b] overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full w-[70%]" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* IDE Footer Info */}
              <div className="px-3 py-1 bg-[#0b0816] border-t border-[#1e1a30] flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  Sandbox: active
                </span>
                <span>Ubuntu 24.04</span>
              </div>

            </div>
          </div>

        </div>

        {/* BOTTOM METRICS / ANIMATED STATS BAR */}
        <div className="pt-3 border-t border-slate-200 dark:border-[#1e1b2e] grid grid-cols-3 gap-2.5">
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#130f24]/60 border border-slate-200 dark:border-[#241e38] flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white font-mono leading-none">{stats.problemsSolved}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">DSA Suite</p>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#130f24]/60 border border-slate-200 dark:border-[#241e38] flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 shrink-0">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white font-mono leading-none">{stats.multiLanguage}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">C++, Python, JS</p>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#130f24]/60 border border-slate-200 dark:border-[#241e38] flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <p className="text-base font-bold text-slate-900 dark:text-white font-mono leading-none">{stats.executionSpeed}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Sub-second</p>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
