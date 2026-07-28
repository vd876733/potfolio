"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Star,
  Medal,
  ExternalLink,
  Flame,
  Award,
  TrendingUp,
  Globe,
  Flag,
  CheckCircle2,
  Calendar,
  Loader2,
  AlertTriangle,
  RotateCw
} from "lucide-react";
import portfolioData from "@/data/portfolio.json";

// Helper function to format date from ISO string to "Month Year" format
function formatDateString(isoString: string | undefined): string {
  if (!isoString) return "June 2026";
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "June 2026";
    const formatter = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" });
    return formatter.format(date);
  } catch (e) {
    return "June 2026";
  }
}

// Skeleton loaders for visual loading states
const LeetCodeSkeleton = () => (
  <div className="flex flex-col gap-6 w-full">
    {/* Grid Skeleton */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex flex-col gap-2 p-4 bg-slate-50 dark:bg-white/[0.01] border border-slate-200 dark:border-white/5 rounded-xl animate-pulse">
          <div className="h-3 w-16 bg-slate-200 dark:bg-white/10 rounded" />
          <div className="h-6 w-24 bg-slate-300 dark:bg-white/20 rounded mt-1" />
        </div>
      ))}
    </div>
    {/* Pills Skeleton */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-12 bg-slate-50 dark:bg-white/[0.01] border border-slate-200 dark:border-white/5 rounded-xl animate-pulse" />
      ))}
    </div>
    {/* Progress Bar Skeleton */}
    <div className="flex flex-col gap-3 bg-slate-50 dark:bg-white/[0.01] border border-slate-200 dark:border-white/5 p-4 rounded-xl">
      <div className="flex justify-between animate-pulse">
        <div className="h-3 w-24 bg-slate-200 dark:bg-white/10 rounded" />
        <div className="h-3 w-16 bg-slate-200 dark:bg-white/10 rounded" />
      </div>
      <div className="h-3 bg-slate-200 dark:bg-white/10 rounded-full animate-pulse" />
    </div>
    {/* Skills Skeleton */}
    <div className="flex flex-col gap-3">
      <div className="h-3 w-20 bg-slate-200 dark:bg-white/10 rounded animate-pulse" />
      <div className="flex flex-wrap gap-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-8 w-24 bg-slate-50 dark:bg-white/[0.01] border border-slate-200 dark:border-white/5 rounded-full animate-pulse" />
        ))}
      </div>
    </div>
  </div>
);

const CodeChefSkeleton = () => (
  <div className="flex flex-col gap-6 w-full">
    {/* Main Rating Card Skeleton */}
    <div className="flex flex-col sm:flex-row gap-5 p-5 bg-slate-50 dark:bg-white/[0.01] border border-slate-200 dark:border-white/5 rounded-2xl items-center justify-between animate-pulse">
      <div className="flex flex-col gap-2 items-center sm:items-start w-full sm:w-auto">
        <div className="h-3 w-24 bg-slate-200 dark:bg-white/10 rounded" />
        <div className="h-8 w-32 bg-slate-300 dark:bg-white/20 rounded mt-1" />
        <div className="h-4 w-28 bg-slate-200 dark:bg-white/10 rounded mt-2" />
      </div>
      <div className="h-8 w-20 bg-slate-200 dark:bg-white/15 rounded-xl" />
    </div>
    {/* Grid Skeleton */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex flex-col gap-2 p-4 bg-slate-50 dark:bg-white/[0.01] border border-slate-200 dark:border-white/5 rounded-xl animate-pulse">
          <div className="h-3 w-16 bg-slate-200 dark:bg-white/10 rounded" />
          <div className="h-6 w-24 bg-slate-300 dark:bg-white/20 rounded mt-1" />
        </div>
      ))}
    </div>
  </div>
);

const HackerRankSkeleton = () => (
  <div className="flex flex-col gap-6 w-full">
    {/* Skill Badges Skeleton */}
    <div className="flex flex-col gap-4">
      <div className="h-3 w-20 bg-slate-200 dark:bg-white/10 rounded animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex flex-col gap-3 p-4 bg-slate-50 dark:bg-white/[0.01] border border-slate-200 dark:border-white/5 rounded-xl animate-pulse">
            <div className="flex justify-between items-center">
              <div className="h-8 w-8 bg-slate-200 dark:bg-white/10 rounded-lg" />
              <div className="h-5 w-10 bg-slate-200 dark:bg-white/15 rounded-full" />
            </div>
            <div className="h-4 w-24 bg-slate-300 dark:bg-white/20 rounded" />
            <div className="h-3 w-20 bg-slate-200 dark:bg-white/10 rounded mt-1" />
          </div>
        ))}
      </div>
    </div>
    {/* Certifications Skeleton */}
    <div className="flex flex-col gap-4">
      <div className="h-3 w-28 bg-slate-200 dark:bg-white/10 rounded animate-pulse" />
      <div className="flex flex-col gap-2.5 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-14 w-full bg-slate-50 dark:bg-white/[0.01] border border-slate-200 dark:border-white/5 rounded-xl" />
        ))}
      </div>
    </div>
  </div>
);


// Custom Brand SVGs
const LeetCodeLogo = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.043 12.046c-.013-.082-.026-.164-.044-.245a4.275 4.275 0 0 0-.256-.763 3.992 3.992 0 0 0-.58-.916 4.316 4.316 0 0 0-.79-.764l-9.75-9.75a4.133 4.133 0 0 0-5.837 0L2.83 1.554a4.133 4.133 0 0 0 0 5.837l9.75 9.75a4.133 4.133 0 0 0 5.837 0l1.944-1.944a4.133 4.133 0 0 0 0-5.837L10.61 3.597a1.378 1.378 0 0 0-1.948 0l-.974.974a1.378 1.378 0 0 0 0 1.948l6.818 6.818a1.378 1.378 0 0 1 0 1.948l-.974.974a1.378 1.378 0 0 1-1.948 0L4.766 9.44a1.378 1.378 0 0 0-1.948 0l-.974.974a1.378 1.378 0 0 0 0 1.948l6.818 6.818a4.133 4.133 0 0 0 5.837 0l6.818-6.818c.243-.243.435-.53.567-.847.13-.318.204-.658.219-1.003-.008-.153-.021-.305-.038-.456v-.012z"/>
  </svg>
);

const CodeChefLogo = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3a4.5 4.5 0 0 0-4.48 4.09 3.5 3.5 0 0 0-2.02 3.16 3.5 3.5 0 0 0 1 2.45v2.8a2.5 2.5 0 0 0 2.5 2.5h10a2.5 2.5 0 0 0 2.5-2.5v-2.8a3.5 3.5 0 0 0 1-2.45 3.5 3.5 0 0 0-2.02-3.16A4.5 4.5 0 0 0 12 3zm-3 15h6v1a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-1z" />
  </svg>
);

const HackerRankLogo = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2c5.522 0 10 4.477 10 10s-4.478 10-10 10S2 17.523 2 12 6.478 2 12 2zm3.308 5.692h-1.615v3.23h-3.385v-3.23H8.692v8.616h1.616v-3.385h3.385v3.385h1.615V7.692z" />
  </svg>
);

const tabs = [
  { id: "LeetCode", name: "LeetCode", icon: LeetCodeLogo, brandColor: "text-orange-400" },
  { id: "CodeChef", name: "CodeChef", icon: CodeChefLogo, brandColor: "text-[#D8A158]" },
  { id: "HackerRank", name: "HackerRank", icon: HackerRankLogo, brandColor: "text-emerald-400" }
] as const;

type TabId = (typeof tabs)[number]["id"];

// Standardized production-ready Mock Stats
const MOCK_STATS = {
  leetcode: {
    profileUrl: "https://leetcode.com/u/Varad_Max11/",
    globalRanking: "Top 5%",
    problemsSolved: "450+",
    acceptanceRate: "65.5%",
    activeStreak: "142 Days",
    easySolved: 180,
    easyTotal: 800,
    mediumSolved: 220,
    mediumTotal: 1600,
    hardSolved: 50,
    hardTotal: 700,
    topSkills: ["Dynamic Programming", "Graphs", "Trees"]
  },
  codechef: {
    profileUrl: "https://www.codechef.com/users/varad_11082005",
    rating: "1850",
    highestDivision: "Div 2",
    stars: 4,
    globalRank: "#1,200",
    countryRank: "#340",
    highestRating: "1,942"
  },
  hackerrank: {
    profileUrl: "https://www.hackerrank.com/profile/vd876733",
    badges: [
      { topic: "Problem Solving", stars: 5 },
      { topic: "Python", stars: 5 },
      { topic: "SQL", stars: 4 }
    ],
    verifiedCertifications: [
      { name: "Problem Solving (Intermediate)", date: "June 2026" },
      { name: "React (Basic)", date: "July 2026" },
      { name: "SQL (Advanced)", date: "July 2026" }
    ]
  }
};

export default function ArenaModal() {
  const [activeTab, setActiveTab] = useState<TabId>("LeetCode");

  // State mapping for dynamic fetches
  const [stats, setStats] = useState(() => {
    const apiStats = portfolioData?.codingStats as any;
    if (!apiStats) return MOCK_STATS;

    return {
      leetcode: {
        ...MOCK_STATS.leetcode,
        profileUrl: apiStats.leetcode?.profileUrl || MOCK_STATS.leetcode.profileUrl,
        globalRanking: apiStats.leetcode?.globalRanking || MOCK_STATS.leetcode.globalRanking,
        problemsSolved: apiStats.leetcode?.problemsSolved || MOCK_STATS.leetcode.problemsSolved,
        acceptanceRate: apiStats.leetcode?.acceptanceRate || MOCK_STATS.leetcode.acceptanceRate,
        activeStreak: apiStats.leetcode?.activeStreak || MOCK_STATS.leetcode.activeStreak,
        easySolved: apiStats.leetcode?.easySolved ?? MOCK_STATS.leetcode.easySolved,
        easyTotal: apiStats.leetcode?.easyTotal ?? MOCK_STATS.leetcode.easyTotal,
        mediumSolved: apiStats.leetcode?.mediumSolved ?? MOCK_STATS.leetcode.mediumSolved,
        mediumTotal: apiStats.leetcode?.mediumTotal ?? MOCK_STATS.leetcode.mediumTotal,
        hardSolved: apiStats.leetcode?.hardSolved ?? MOCK_STATS.leetcode.hardSolved,
        hardTotal: apiStats.leetcode?.hardTotal ?? MOCK_STATS.leetcode.hardTotal,
        topSkills: apiStats.leetcode?.topSkills || MOCK_STATS.leetcode.topSkills,
      },
      codechef: {
        ...MOCK_STATS.codechef,
        profileUrl: apiStats.codechef?.profileUrl || MOCK_STATS.codechef.profileUrl,
        rating: apiStats.codechef?.rating || MOCK_STATS.codechef.rating,
        highestDivision: apiStats.codechef?.highestDivision || MOCK_STATS.codechef.highestDivision,
        stars: apiStats.codechef?.stars ?? MOCK_STATS.codechef.stars,
        globalRank: apiStats.codechef?.globalRank || MOCK_STATS.codechef.globalRank,
        countryRank: apiStats.codechef?.countryRank || MOCK_STATS.codechef.countryRank,
        highestRating: apiStats.codechef?.highestRating || MOCK_STATS.codechef.highestRating,
      },
      hackerrank: {
        ...MOCK_STATS.hackerrank,
        profileUrl: apiStats.hackerrank?.profileUrl || MOCK_STATS.hackerrank.profileUrl,
        badges: apiStats.hackerrank?.badges || MOCK_STATS.hackerrank.badges,
        verifiedCertifications: apiStats.hackerrank?.verifiedCertifications || MOCK_STATS.hackerrank.verifiedCertifications,
      }
    };
  });

  const [loading, setLoading] = useState<{ LeetCode: boolean; CodeChef: boolean; HackerRank: boolean }>({
    LeetCode: true,
    CodeChef: true,
    HackerRank: true
  });

  const [errors, setErrors] = useState<{ LeetCode: boolean; CodeChef: boolean; HackerRank: boolean }>({
    LeetCode: false,
    CodeChef: false,
    HackerRank: false
  });

  const fetchAllStats = async (isMounted = true) => {
    setLoading({ LeetCode: true, CodeChef: true, HackerRank: true });
    setErrors({ LeetCode: false, CodeChef: false, HackerRank: false });

    // LeetCode fetching
    (async () => {
      let data = null;
      // 1. Alfa LeetCode API
      try {
        const res = await fetch("https://alfa-leetcode-api.onrender.com/Varad_Max11/solved");
        if (res.ok) {
          const json = await res.json();
          if (json && typeof json.solvedProblem === "number") {
            data = {
              problemsSolved: String(json.solvedProblem),
              easySolved: json.easySolved,
              mediumSolved: json.mediumSolved,
              hardSolved: json.hardSolved,
            };
          }
        }
      } catch (e) {
        console.warn("LeetCode primary endpoint failed:", e);
      }

      // 2. LeetCode Stats API Heroku
      if (!data) {
        try {
          const res = await fetch("https://leetcode-stats-api.herokuapp.com/Varad_Max11");
          if (res.ok) {
            const json = await res.json();
            if (json && json.status === "success") {
              data = {
                globalRanking: json.ranking ? `#${json.ranking.toLocaleString()}` : undefined,
                problemsSolved: json.totalSolved ? `${json.totalSolved}` : undefined,
                acceptanceRate: json.acceptanceRate ? `${json.acceptanceRate}%` : undefined,
                easySolved: json.easySolved,
                easyTotal: json.totalEasy,
                mediumSolved: json.mediumSolved,
                mediumTotal: json.totalMedium,
                hardSolved: json.hardSolved,
                hardTotal: json.totalHard,
              };
            }
          }
        } catch (e) {
          console.warn("LeetCode secondary endpoint failed:", e);
        }
      }

      // 3. GraphQL direct fallback via corsproxy.io
      if (!data) {
        try {
          const query = `query getUserProfile($username: String!) { matchedUser(username: $username) { submitStats { acSubmissionNum { difficulty count } } profile { ranking } } }`;
          const url = 'https://corsproxy.io/?' + encodeURIComponent('https://leetcode.com/graphql');
          const res = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              query,
              variables: { username: "Varad_Max11" }
            })
          });
          if (res.ok) {
            const json = await res.json();
            const submitStats = json?.data?.matchedUser?.submitStats?.acSubmissionNum || [];
            const allStats = submitStats.find((s: any) => s.difficulty === "All");
            const easyStats = submitStats.find((s: any) => s.difficulty === "Easy");
            const mediumStats = submitStats.find((s: any) => s.difficulty === "Medium");
            const hardStats = submitStats.find((s: any) => s.difficulty === "Hard");
            const ranking = json?.data?.matchedUser?.profile?.ranking;

            if (allStats || ranking) {
              data = {
                globalRanking: ranking ? `#${ranking.toLocaleString()}` : undefined,
                problemsSolved: allStats ? `${allStats.count}` : undefined,
                easySolved: easyStats ? easyStats.count : undefined,
                mediumSolved: mediumStats ? mediumStats.count : undefined,
                hardSolved: hardStats ? hardStats.count : undefined,
              };
            }
          }
        } catch (e) {
          console.warn("LeetCode GraphQL fallback failed:", e);
        }
      }

      if (data && isMounted) {
        setStats(prev => ({
          ...prev,
          leetcode: {
            ...prev.leetcode,
            ...Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== undefined))
          }
        }));
        setErrors(prev => ({ ...prev, LeetCode: false }));
      } else {
        if (isMounted) setErrors(prev => ({ ...prev, LeetCode: true }));
      }
      if (isMounted) setLoading(prev => ({ ...prev, LeetCode: false }));
    })();

    // CodeChef fetching
    (async () => {
      let data = null;
      let isServerError = false;
      try {
        const res = await fetch("/api/codechef?username=varad_11082005");
        if (res.ok) {
          const json = await res.json();
          const rating = json.rating || json.currentRating;
          if (rating) {
            data = {
              rating: String(rating),
              stars: json.stars ? (typeof json.stars === 'string' ? parseInt(json.stars.replace(/\D/g, "")) : json.stars) : undefined,
              globalRank: json.globalRank ? String(json.globalRank) : undefined,
              countryRank: json.countryRank ? String(json.countryRank) : undefined,
              highestRating: json.highestRating ? String(json.highestRating) : undefined
            };
          }
        } else if (res.status >= 500) {
          isServerError = true;
        }
      } catch (e) {
        console.warn("CodeChef API route fetch failed:", e);
      }

      if (data && isMounted) {
        setStats(prev => ({
          ...prev,
          codechef: {
            ...prev.codechef,
            rating: data.rating ? String(data.rating) : prev.codechef.rating,
            stars: data.stars ?? prev.codechef.stars,
            highestRating: data.highestRating ? String(data.highestRating) : prev.codechef.highestRating,
            globalRank: data.globalRank ? (data.globalRank.startsWith('#') ? data.globalRank : `#${data.globalRank}`) : prev.codechef.globalRank,
            countryRank: data.countryRank ? (data.countryRank.startsWith('#') ? data.countryRank : `#${data.countryRank}`) : prev.codechef.countryRank,
          }
        }));
        setErrors(prev => ({ ...prev, CodeChef: false }));
      } else {
        if (isMounted && isServerError) setErrors(prev => ({ ...prev, CodeChef: true }));
      }
      if (isMounted) setLoading(prev => ({ ...prev, CodeChef: false }));
    })();

    // HackerRank fetching
    (async () => {
      let data = null;
      let isServerError = false;
      try {
        const url = "/api/hackerrank?username=vd876733";
        const res = await fetch(url);
        if (res.ok) {
          const json = await res.json();
          if (json && json.model) {
            data = json.model;
          }
        } else if (res.status >= 500) {
          isServerError = true;
        }
      } catch (e) {
        console.warn("HackerRank endpoint failed:", e);
      }

      if (data && isMounted) {
        const badges = (data.badges || []).map((b: any) => ({
          topic: b.badge_name,
          stars: b.stars,
        }));
        const verifiedCertifications = (data.certifications || [])
          .filter((c: any) => c.status === "APPROVED")
          .map((c: any) => ({
            name: c.certification_name,
            date: formatDateString(c.completed_at),
          }));

        setStats(prev => ({
          ...prev,
          hackerrank: {
            ...prev.hackerrank,
            badges: badges.length > 0 ? badges : prev.hackerrank.badges,
            verifiedCertifications: verifiedCertifications.length > 0 ? verifiedCertifications : prev.hackerrank.verifiedCertifications,
          }
        }));
        setErrors(prev => ({ ...prev, HackerRank: false }));
      } else {
        if (isMounted && isServerError) setErrors(prev => ({ ...prev, HackerRank: true }));
      }
      if (isMounted) setLoading(prev => ({ ...prev, HackerRank: false }));
    })();
  };

  useEffect(() => {
    let isMounted = true;
    fetchAllStats(isMounted);
    return () => {
      isMounted = false;
    };
  }, []);

  const leetcode = stats.leetcode;
  const codechef = stats.codechef;
  const hackerrank = stats.hackerrank;

  const isTabLoading = activeTab === "LeetCode" ? loading.LeetCode : activeTab === "CodeChef" ? loading.CodeChef : loading.HackerRank;
  const isTabError = activeTab === "LeetCode" ? errors.LeetCode : activeTab === "CodeChef" ? errors.CodeChef : errors.HackerRank;


  // Compute profile action details depending on the active tab
  const getActionProps = () => {
    switch (activeTab) {
      case "LeetCode":
        return {
          label: "View LeetCode Profile",
          url: leetcode.profileUrl
        };
      case "CodeChef":
        return {
          label: "View CodeChef Profile",
          url: codechef.profileUrl
        };
      case "HackerRank":
        return {
          label: "View HackerRank Profile",
          url: hackerrank.profileUrl
        };
    }
  };

  const actionProps = getActionProps();

  return (
    <div className="w-full text-slate-900 dark:text-white flex flex-col gap-6 relative transition-all duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/5 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-xl border border-purple-500/20">
            <Trophy className="w-7 h-7 text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.3)]" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-space-grotesk font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              Coding Arena
            </h2>
            <p className="text-xs text-slate-500 dark:text-white/40 font-inter mt-0.5">Competitive Programming Showcase</p>
          </div>
        </div>

        {/* Pulsing Sync Badge & Refresh Stats Button */}
        <div className="flex items-center gap-3 self-start sm:self-center">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <span className="relative flex h-2 w-2">
              <motion.span
                animate={{ scale: [1, 1.8, 1], opacity: [0.7, 0, 0.7] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
              />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[10px] sm:text-xs font-space-grotesk font-semibold text-emerald-400 tracking-wider uppercase">
              Live Synced
            </span>
          </div>

          <button
            onClick={() => fetchAllStats()}
            disabled={Object.values(loading).some(Boolean)}
            className="cursor-target p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.02] dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/10 hover:border-purple-500/30 dark:hover:border-purple-500/30 rounded-lg text-slate-500 hover:text-purple-600 dark:text-white/50 dark:hover:text-purple-300 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center"
            title="Refresh Stats"
          >
            <RotateCw
              className={`w-3.5 h-3.5 ${
                Object.values(loading).some(Boolean)
                  ? "animate-spin text-purple-400"
                  : "group-hover:rotate-180 transition-transform duration-500"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Navigation Tabs (Step 4 glassmorphic switches & purple hover transitions) */}
      <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-xl relative">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`cursor-target relative flex items-center justify-center gap-2 py-3 px-1 sm:px-3 rounded-lg font-space-grotesk font-bold text-xs sm:text-sm transition-all duration-300 z-10 cursor-pointer ${
                isActive 
                  ? "text-purple-600 dark:text-purple-400"
                  : "text-slate-500 hover:text-purple-600 dark:text-white/40 dark:hover:text-purple-300"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 bg-purple-500/10 border border-purple-500/20 rounded-lg -z-10 shadow-lg"
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                />
              )}
              <Icon className={`w-4.5 h-4.5 ${isActive ? tab.brandColor : "text-slate-550 dark:text-white/40 group-hover:text-purple-500 dark:group-hover:text-purple-300"}`} />
              <span className="hidden sm:inline">{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Tab Content Container */}
      <div className="relative min-h-[300px] flex flex-col justify-between">
        <AnimatePresence mode="wait">
          {isTabLoading ? (
            <motion.div
              key={`${activeTab}-skeleton`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full flex flex-col gap-6"
            >
              {activeTab === "LeetCode" && <LeetCodeSkeleton />}
              {activeTab === "CodeChef" && <CodeChefSkeleton />}
              {activeTab === "HackerRank" && <HackerRankSkeleton />}
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="w-full h-full flex flex-col gap-6"
            >
              {/* Fallback API Alert banner if API calls are offline or rate-limited */}
              {isTabError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2.5 p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-400 font-inter"
                >
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>Sync limit reached or API offline. Displaying cached backup statistics.</span>
                </motion.div>
              )}

              {/* LeetCode Content */}
              {activeTab === "LeetCode" && (
                <div className="flex flex-col gap-6">
                  {/* Primary Metrics Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: "Global Rank", value: leetcode.globalRanking, icon: Globe, color: "text-blue-400" },
                      { label: "Total Solved", value: leetcode.problemsSolved, icon: Award, color: "text-yellow-400" },
                      { label: "Acceptance Rate", value: leetcode.acceptanceRate, icon: TrendingUp, color: "text-purple-400" },
                      { label: "Active Streak", value: `🔥 ${leetcode.activeStreak}`, icon: Flame, color: "text-orange-500" },
                    ].map((stat, i) => {
                      const StatIcon = stat.icon;
                      return (
                        <div key={i} className="flex flex-col gap-1 p-4 bg-slate-50 dark:bg-white/[0.01] border border-slate-200 dark:border-white/5 rounded-xl hover:border-purple-500/20 hover:bg-purple-500/[0.02] dark:hover:bg-purple-500/[0.02] transition-all duration-300">
                          <div className="flex justify-between items-center text-slate-400 dark:text-white/40">
                            <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider font-inter">{stat.label}</span>
                            <StatIcon className={`w-4 h-4 ${stat.color}`} />
                          </div>
                          <span className="text-lg sm:text-xl font-bold font-space-grotesk mt-1 text-slate-900 dark:text-white tracking-tight">
                            {stat.value}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Difficulty Breakdown Pills */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { type: "Easy", solved: leetcode.easySolved, total: leetcode.easyTotal, color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", progressColor: "bg-emerald-500" },
                      { type: "Medium", solved: leetcode.mediumSolved, total: leetcode.mediumTotal, color: "bg-amber-500/10 text-amber-400 border-amber-500/20", progressColor: "bg-amber-500" },
                      { type: "Hard", solved: leetcode.hardSolved, total: leetcode.hardTotal, color: "bg-rose-500/10 text-rose-400 border-rose-500/20", progressColor: "bg-rose-500" }
                    ].map((diff, i) => (
                      <div key={i} className={`flex items-center justify-between p-3.5 rounded-xl border ${diff.color}`}>
                        <div className="flex items-center gap-2.5">
                          <span className={`w-2 h-2 rounded-full ${diff.progressColor} animate-pulse`} />
                          <span className="font-space-grotesk font-bold text-sm">{diff.type}</span>
                        </div>
                        <span className="font-mono font-bold text-sm tracking-wide">
                          {diff.solved} <span className="text-slate-400 dark:text-white/35 text-xs font-normal">/ {diff.total}</span>
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Multi-Segmented Progress Bar */}
                  <div className="flex flex-col gap-2.5 bg-slate-50 dark:bg-white/[0.01] border border-slate-200 dark:border-white/5 p-4 rounded-xl">
                    <div className="flex justify-between items-center text-xs text-slate-500 dark:text-white/50 font-inter">
                      <span>Solve Distribution</span>
                      <span className="font-mono text-slate-700 dark:text-white/70">
                        {leetcode.easySolved + leetcode.mediumSolved + leetcode.hardSolved} Solved
                      </span>
                    </div>
                    
                    {/* Progress Bar Track */}
                    <div className="h-3 w-full bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden flex gap-[2px]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(leetcode.easySolved / (leetcode.easySolved + leetcode.mediumSolved + leetcode.hardSolved)) * 100}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full bg-emerald-500 rounded-l-full"
                      />
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(leetcode.mediumSolved / (leetcode.easySolved + leetcode.mediumSolved + leetcode.hardSolved)) * 100}%` }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                        className="h-full bg-amber-500"
                      />
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(leetcode.hardSolved / (leetcode.easySolved + leetcode.mediumSolved + leetcode.hardSolved)) * 100}%` }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                        className="h-full bg-rose-500 rounded-r-full"
                      />
                    </div>
                    
                    {/* Legend */}
                    <div className="flex gap-4 mt-1 text-[10px] sm:text-xs text-slate-500 dark:text-white/40 font-inter">
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-1.5 bg-emerald-500 rounded-full" /> Easy ({(leetcode.easySolved / (leetcode.easySolved + leetcode.mediumSolved + leetcode.hardSolved) * 100).toFixed(0)}%)</span>
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-1.5 bg-amber-500 rounded-full" /> Medium ({(leetcode.mediumSolved / (leetcode.easySolved + leetcode.mediumSolved + leetcode.hardSolved) * 100).toFixed(0)}%)</span>
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-1.5 bg-rose-500 rounded-full" /> Hard ({(leetcode.hardSolved / (leetcode.easySolved + leetcode.mediumSolved + leetcode.hardSolved) * 100).toFixed(0)}%)</span>
                    </div>
                  </div>

                  {/* Top Skills Section */}
                  <div className="flex flex-col gap-2.5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-white/40 font-inter">Top Skill Tags</span>
                    <div className="flex flex-wrap gap-2">
                      {leetcode.topSkills.map((skill: string, idx: number) => (
                        <motion.span
                          key={idx}
                          whileHover={{ scale: 1.03, backgroundColor: "rgba(168,85,247,0.08)", borderColor: "rgba(168,85,247,0.3)" }}
                          className="px-3.5 py-1.5 bg-slate-50 dark:bg-white/[0.01] border border-slate-200 dark:border-white/5 text-slate-700 dark:text-white/80 hover:text-slate-900 dark:hover:text-white rounded-full text-xs font-semibold font-space-grotesk cursor-default transition-all duration-300"
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* CodeChef Content */}
              {activeTab === "CodeChef" && (
                <div className="flex flex-col gap-6">
                  {/* Main Rating Card */}
                  <div className="flex flex-col sm:flex-row gap-5 p-5 bg-slate-50 dark:bg-white/[0.01] border border-slate-200 dark:border-white/5 rounded-2xl items-center justify-between">
                    <div className="flex flex-col gap-1 items-center sm:items-start text-center sm:text-left">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-white/40 font-inter">Current Rating</span>
                      <div className="flex items-baseline gap-2.5 mt-1.5">
                        <span className="text-3xl sm:text-4xl font-extrabold font-space-grotesk text-slate-900 dark:text-white tracking-tight">
                          {codechef.rating}
                        </span>
                        <span className="text-sm font-semibold text-[#D8A158] font-space-grotesk uppercase tracking-wider">
                          {codechef.stars}★ ({codechef.highestDivision})
                        </span>
                      </div>
                      {/* Glowing Stars Display */}
                      <div className="flex items-center gap-1 mt-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < codechef.stars
                                ? "text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]"
                                : "text-slate-200 dark:text-white/10"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="px-4 py-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl text-xs font-bold font-space-grotesk tracking-wide uppercase">
                      {codechef.highestDivision}
                    </div>
                  </div>

                  {/* Secondary Stats Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { label: "Global Rank", value: codechef.globalRank, icon: Globe, color: "text-[#D8A158]" },
                      { label: "Country Rank", value: codechef.countryRank, icon: Flag, color: "text-blue-400" },
                      { label: "Highest Rating", value: codechef.highestRating, icon: TrendingUp, color: "text-emerald-400" }
                    ].map((stat, idx) => {
                      const StatIcon = stat.icon;
                      return (
                        <div key={idx} className="flex flex-col gap-1 p-4 bg-slate-50 dark:bg-white/[0.01] border border-slate-200 dark:border-white/5 rounded-xl hover:border-purple-500/20 hover:bg-purple-500/[0.02] dark:hover:bg-purple-500/[0.02] transition-all duration-300">
                          <div className="flex justify-between items-center text-slate-400 dark:text-white/40">
                            <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider font-inter">{stat.label}</span>
                            <StatIcon className={`w-4 h-4 ${stat.color}`} />
                          </div>
                          <span className="text-lg font-bold font-space-grotesk text-slate-900 dark:text-white mt-1">
                            {stat.value}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* HackerRank Content */}
              {activeTab === "HackerRank" && (
                <div className="flex flex-col gap-6">
                  
                  {/* Skill Badges Title */}
                  <div className="flex flex-col gap-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-white/40 font-inter">Skill Badges</span>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {hackerrank.badges.map((badge: any, idx: number) => (
                        <motion.div
                          key={idx}
                          whileHover={{ y: -4, backgroundColor: "rgba(168,85,247,0.02)", borderColor: "rgba(168,85,247,0.2)" }}
                          className="flex flex-col gap-2.5 p-4 bg-slate-50 dark:bg-white/[0.01] border border-slate-200 dark:border-white/5 rounded-xl transition-all duration-300"
                        >
                          <div className="flex items-center justify-between">
                            <div className="p-1.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                              <Medal className="w-5 h-5 text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.3)]" />
                            </div>
                            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-space-grotesk">
                              {badge.stars}★
                            </span>
                          </div>
                          <div>
                            <h4 className="font-space-grotesk font-bold text-sm text-slate-900 dark:text-white">{badge.topic}</h4>
                            <div className="flex gap-0.5 mt-1.5">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3.5 h-3.5 ${
                                    i < badge.stars ? "text-emerald-400 fill-emerald-400" : "text-slate-200 dark:text-white/10"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Verified Certifications Section */}
                  <div className="flex flex-col gap-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-white/40 font-inter">Verified Certifications</span>
                    
                    <div className="flex flex-col gap-2.5">
                      {hackerrank.verifiedCertifications.map((cert: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-white/[0.01] border border-slate-200 dark:border-white/5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/[0.02] hover:border-purple-500/20 dark:hover:border-purple-500/20 transition-all duration-300"
                        >
                          <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                              <span className="font-space-grotesk font-bold text-sm text-slate-900 dark:text-white">{cert.name}</span>
                              <span className="hidden sm:inline text-slate-300 dark:text-white/20">|</span>
                              <span className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-white/40 font-inter">
                                <Calendar className="w-3.5 h-3.5" />
                                {cert.date}
                              </span>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full uppercase tracking-wider font-space-grotesk">
                            Verified
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Dynamic Action Button at the bottom of the card (Step 3) */}
      <div className="border-t border-slate-200 dark:border-white/5 pt-5">
        <a
          href={actionProps.url}
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-target flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#a855f7]/5 to-[#06b6d4]/5 dark:from-[#a855f7]/10 dark:to-[#06b6d4]/10 hover:from-[#a855f7]/10 hover:to-[#06b6d4]/10 dark:hover:from-[#a855f7]/20 dark:hover:to-[#06b6d4]/20 border border-purple-500/10 dark:border-purple-500/20 hover:border-cyan-500/20 dark:hover:border-cyan-500/40 text-purple-600 dark:text-purple-300 hover:text-cyan-600 dark:hover:text-cyan-300 rounded-xl transition-all duration-300 font-space-grotesk font-bold text-sm w-full cursor-pointer hover:scale-[1.01] shadow-[0_0_20px_rgba(168,85,247,0.02)] dark:shadow-[0_0_20px_rgba(168,85,247,0.05)]"
        >
          <span className="mr-0.5 font-sans">↗</span>
          {actionProps.label}
        </a>
      </div>

    </div>
  );
}
