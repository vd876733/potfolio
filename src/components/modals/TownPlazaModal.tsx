import { MapPin, FileDown } from "lucide-react";
import { SiGithub, SiLeetcode, SiHackerrank, SiCodechef } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa6";
import portfolioData from "@/data/portfolio.json";

export default function TownPlazaModal() {
  const { personal, codingStats } = portfolioData;

  const socialLinks = [
    { label: "GitHub", href: personal.social.github, icon: SiGithub },
    { label: "LinkedIn", href: personal.social.linkedin, icon: FaLinkedin },
    { label: "LeetCode", href: codingStats.leetcode.profileUrl, icon: SiLeetcode },
    { label: "HackerRank", href: codingStats.hackerrank.profileUrl, icon: SiHackerrank },
    { label: "CodeChef", href: codingStats.codechef.profileUrl, icon: SiCodechef },
  ];

  return (
    <div className="flex flex-col gap-6 p-2">
      {/* Profile Header & Avatar Layout (Side-by-side vertical rectangle layout) */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* Profile Photo - Big Vertical Rectangle */}
        <div className="relative shrink-0 w-full sm:w-auto flex justify-center">
          <img
            src="/profile-photo.jpg"
            alt={`${personal.firstName} ${personal.lastName}`}
            className="w-48 h-64 sm:w-56 sm:h-72 rounded-2xl object-cover shadow-xl border-2 border-sky-200 dark:border-slate-700 ring-2 ring-sky-300/30 transition-all hover:scale-[1.01]"
          />
        </div>

        {/* Info & Bio beside Image */}
        <div className="flex flex-col text-center sm:text-left justify-between gap-3 flex-1">
          <div>
            <h2 className="text-3xl font-space-grotesk font-bold text-slate-900 dark:text-white tracking-tight">
              {personal.firstName} {personal.lastName}
            </h2>
            <p className="text-sky-600 dark:text-sky-400 font-inter text-base font-semibold mt-0.5">
              {personal.title}
            </p>
          </div>

          {/* Location Badge */}
          <div className="flex items-center justify-center sm:justify-start gap-1.5 text-slate-600 dark:text-slate-300 text-sm font-inter font-medium">
            <MapPin className="w-4 h-4 text-sky-500 shrink-0" />
            <span>{personal.location}</span>
          </div>

          {/* Bio Paragraph */}
          <p className="text-slate-600 dark:text-slate-300 font-inter text-xs sm:text-sm leading-relaxed">
            {personal.bio}
          </p>
        </div>
      </div>

      {/* Coding & Social Brand Icon Buttons */}
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
        {socialLinks.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              title={item.label}
              className="p-3 bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-600 dark:bg-slate-800/80 dark:border-slate-700 dark:text-sky-400 dark:hover:bg-slate-800 rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-sm"
            >
              <Icon className="w-5 h-5" />
            </a>
          );
        })}
      </div>

      {/* Download Resume Button */}
      <a
        href={personal.resumeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2.5 w-full py-3.5 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl shadow-md hover:shadow-lg transition-all font-inter font-semibold text-sm tracking-wide active:scale-[0.99]"
      >
        <FileDown className="w-5 h-5" />
        <span>Download Resume</span>
      </a>
    </div>
  );
}
