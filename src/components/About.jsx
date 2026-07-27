import React from "react";
import { MapPin, FileDown } from "lucide-react";
import {
  SiGithub,
  SiLeetcode,
  SiHackerrank,
  SiCodechef,
} from "react-icons/si";
import { FaLinkedin as SiLinkedin } from "react-icons/fa";
import portfolioData from "@/data/portfolio.json";

export default function About() {
  const { personal, codingStats } = portfolioData;

  const socialLinks = [
    {
      name: "GitHub",
      url: personal?.social?.github || "https://github.com/vd876733",
      icon: SiGithub,
      hoverColor: "hover:text-[#24292e]",
    },
    {
      name: "LinkedIn",
      url: personal?.social?.linkedin || "https://www.linkedin.com/in/varad-deshmukh-31173a374/",
      icon: SiLinkedin,
      hoverColor: "hover:text-[#0a66c2]",
    },
    {
      name: "LeetCode",
      url: codingStats?.leetcode?.profileUrl || "https://leetcode.com/u/Varad_Max11/",
      icon: SiLeetcode,
      hoverColor: "hover:text-[#ffa116]",
    },
    {
      name: "HackerRank",
      url: codingStats?.hackerrank?.profileUrl || "https://www.hackerrank.com/profile/vd876733",
      icon: SiHackerrank,
      hoverColor: "hover:text-[#2ec866]",
    },
    {
      name: "CodeChef",
      url: codingStats?.codechef?.profileUrl || "https://www.codechef.com/users/varad_11082005",
      icon: SiCodechef,
      hoverColor: "hover:text-[#5b4638]",
    },
  ];

  return (
    <div className="w-full bg-white text-slate-800 p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-6">
      {/* Profile Avatar & Bio Layout */}
      <div className="flex flex-col sm:flex-row items-center sm:items-stretch gap-6 sm:gap-8">
        {/* Big Vertical Rectangle Image Avatar */}
        <div className="relative shrink-0 w-full sm:w-48 md:w-56 aspect-[3/4] rounded-2xl overflow-hidden shadow-md border-2 border-sky-100">
          <img
            src="/profile-photo.jpg"
            alt={`${personal.firstName} ${personal.lastName}`}
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Text Details & Bio */}
        <div className="flex flex-col justify-between items-center sm:items-start text-center sm:text-left gap-3 flex-1">
          <div className="flex flex-col gap-1 w-full">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {personal.firstName} {personal.lastName}
            </h2>
            <p className="text-sky-600 font-semibold text-base sm:text-lg">
              {personal.title}
            </p>

            {/* Location */}
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-slate-500 text-sm font-medium mt-1">
              <MapPin className="w-4 h-4 text-sky-500 shrink-0" />
              <span>Pune, Maharashtra</span>
            </div>
          </div>

          {/* Bio Text */}
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-2 sm:mt-0">
            {personal.bio}
          </p>
        </div>
      </div>

      {/* Brand & Social Profiles Row */}
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-4 border-t border-slate-100">
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
              className={`p-3.5 bg-sky-50 hover:bg-sky-100 border border-sky-100 text-sky-700 ${item.hoverColor} rounded-2xl transition-all duration-200 shadow-xs flex items-center justify-center group`}
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
        className="flex items-center justify-center gap-2.5 w-full py-3.5 px-6 bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-700 hover:text-sky-800 font-semibold rounded-2xl transition-all duration-200 shadow-xs text-sm sm:text-base group"
      >
        <FileDown className="w-5 h-5 text-sky-600 transition-transform duration-200 group-hover:-translate-y-0.5" />
        <span>Download Resume</span>
      </a>
    </div>
  );
}
