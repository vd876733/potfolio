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
      {/* Profile Header & Avatar Layout */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* Profile Photo Avatar */}
        <div className="relative shrink-0">
          <img
            src="/profile-photo.jpg"
            alt={`${personal.firstName} ${personal.lastName}`}
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover shadow-md border-4 border-sky-100 ring-2 ring-sky-300/40"
          />
        </div>

        {/* Info & Bio */}
        <div className="flex flex-col text-center sm:text-left gap-2">
          <div>
            <h2 className="text-3xl font-space-grotesk font-bold text-slate-900 dark:text-white tracking-tight">
              {personal.firstName} {personal.lastName}
            </h2>
            <p className="text-sky-600 dark:text-sky-400 font-inter text-base font-medium mt-0.5">
              {personal.title}
            </p>
          </div>

          {/* Location Badge */}
          <div className="flex items-center justify-center sm:justify-start gap-1.5 text-slate-600 dark:text-slate-300 text-sm font-inter">
            <MapPin className="w-4 h-4 text-sky-500" />
            <span className="font-medium">{personal.location}</span>
          </div>

          {/* Bio Paragraph */}
          <p className="text-slate-600 dark:text-slate-300 font-inter text-sm leading-relaxed mt-1">
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
