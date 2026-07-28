import React, { useRef, useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { MapPin, FileDown } from "lucide-react";
import {
  SiGithub,
  SiLeetcode,
  SiHackerrank,
  SiCodechef,
} from "react-icons/si";
import { FaLinkedin as SiLinkedin } from "react-icons/fa";
import portfolioData from "@/data/portfolio.json";
import VariableProximity from "./VariableProximity";
import BorderGlow from "./BorderGlow";

export default function About() {
  const { personal, codingStats } = portfolioData;
  const containerRef = useRef(null);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLight = mounted && theme === "light";

  const socialLinks = [
    {
      name: "GitHub",
      url: personal?.social?.github || "https://github.com/vd876733",
      icon: SiGithub,
      hoverColor: "hover:text-[#24292e] dark:hover:text-white",
    },
    {
      name: "LinkedIn",
      url: personal?.social?.linkedin || "https://www.linkedin.com/in/varad-deshmukh-31173a374/",
      icon: SiLinkedin,
      hoverColor: "hover:text-[#0a66c2] dark:hover:text-[#38bdf8]",
    },
    {
      name: "LeetCode",
      url: codingStats?.leetcode?.profileUrl || "https://leetcode.com/u/Varad_Max11/",
      icon: SiLeetcode,
      hoverColor: "hover:text-[#ffa116] dark:hover:text-[#ffb74d]",
    },
    {
      name: "HackerRank",
      url: codingStats?.hackerrank?.profileUrl || "https://www.hackerrank.com/profile/vd876733",
      icon: SiHackerrank,
      hoverColor: "hover:text-[#2ec866] dark:hover:text-[#4ade80]",
    },
    {
      name: "CodeChef",
      url: codingStats?.codechef?.profileUrl || "https://www.codechef.com/users/varad_11082005",
      icon: SiCodechef,
      hoverColor: "hover:text-[#5b4638] dark:hover:text-[#d6c7b2]",
    },
  ];

  return (
    <BorderGlow
      edgeSensitivity={30}
      glowColor={isLight ? "200 80 80" : "260 80 80"}
      backgroundColor={isLight ? "#faf6ee" : "#161322"}
      borderRadius={16}
      glowRadius={35}
      glowIntensity={0.8}
      coneSpread={25}
      colors={isLight ? ['#38bdf8', '#60a5fa', '#93c5fd'] : ['#c084fc', '#a78bfa', '#d8b4fe']}
      className="w-full text-slate-800 dark:text-[#e2e8f0] transition-colors duration-300"
    >
      <div className="p-6 sm:p-8 flex flex-col gap-6">
        {/* Profile Avatar & Bio Layout */}
        <div className="flex flex-col sm:flex-row items-center sm:items-stretch gap-6 sm:gap-8">
          {/* Big Vertical Rectangle Image Avatar */}
          <div className="relative shrink-0 w-full sm:w-48 md:w-56 aspect-[3/4] rounded-2xl overflow-hidden shadow-md border border-slate-200/60 dark:border-purple-500/5 bg-[#faf6ee] dark:bg-charcoal">
            <img
              src="/profile-photo.jpg"
              alt={`${personal.firstName} ${personal.lastName}`}
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Text Details & Bio */}
          <div className="flex flex-col justify-between items-center sm:items-start text-center sm:text-left gap-3 flex-1">
            <div className="flex flex-col gap-1 w-full">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                {personal.firstName} {personal.lastName}
              </h2>
              <p className="text-sky-600 dark:text-sky-400 font-semibold text-base sm:text-lg">
                {personal.title}
              </p>

              {/* Location */}
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
                <MapPin className="w-4 h-4 text-sky-500 dark:text-sky-400 shrink-0" />
                <span>Pune, Maharashtra</span>
              </div>
            </div>

            {/* Interactive Variable Proximity Bio */}
            <div ref={containerRef} className="w-full text-center sm:text-left mt-2 sm:mt-0 select-none overflow-hidden">
              <VariableProximity
                label={personal.bio}
                fromFontVariationSettings="'wght' 300, 'opsz' 12"
                toFontVariationSettings="'wght' 900, 'opsz' 40"
                containerRef={containerRef}
                radius={120}
                falloff="linear"
                className="text-slate-700 dark:text-slate-200 leading-relaxed text-center sm:text-left block font-inter"
                style={{
                  fontSize: "clamp(0.875rem, 1.25vw, 1.1rem)",
                }}
              />
            </div>
          </div>
        </div>

        {/* Brand & Social Profiles Row */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-4 border-t border-slate-200 dark:border-white/5">
          {socialLinks.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.name}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                title={item.name}
                aria-label={item.name}
                className={`cursor-target p-3.5 bg-sky-50 dark:bg-slate-800/80 hover:bg-sky-100 dark:hover:bg-slate-700/80 border border-sky-100 dark:border-slate-700 text-sky-700 dark:text-sky-300 ${item.hoverColor} rounded-2xl transition-all duration-200 shadow-xs flex items-center justify-center group`}
              >
                <Icon className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
              </a>
            );
          })}
        </div>

        {/* Download Resume Button */}
        <a
          href={personal.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-target flex items-center justify-center gap-2.5 w-full py-3.5 px-6 bg-sky-50 dark:bg-sky-950/50 hover:bg-sky-100 dark:hover:bg-sky-900/60 border border-sky-200 dark:border-sky-800/60 text-sky-700 dark:text-sky-300 hover:text-sky-800 dark:hover:text-sky-200 font-semibold rounded-2xl transition-all duration-200 shadow-xs text-sm sm:text-base group"
        >
          <FileDown className="w-5 h-5 text-sky-600 dark:text-sky-400 transition-transform duration-200 group-hover:-translate-y-0.5" />
          <span>Download Resume</span>
        </a>
      </div>
    </BorderGlow>
  );
}
