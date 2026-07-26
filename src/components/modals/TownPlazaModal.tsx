import { MapPin, Code, Briefcase, MessageCircle, FileDown } from "lucide-react";
import portfolioData from "@/data/portfolio.json";

export default function TownPlazaModal() {
  const { personal } = portfolioData;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-3xl font-space-grotesk font-bold text-white tracking-tight">
          {personal.firstName} {personal.lastName}
        </h2>
        <p className="text-neon-accent font-inter text-lg mt-1 font-medium">{personal.title}</p>
      </div>

      <div className="flex items-center gap-2 text-white/60 font-inter">
        <MapPin className="w-4 h-4" />
        <span>{personal.location}</span>
      </div>

      <p className="text-white/80 font-inter leading-relaxed">
        {personal.bio}
      </p>

      <div className="flex gap-4 mt-2">
        <a href={personal.social.github} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-white">
          <Code className="w-5 h-5" />
        </a>
        <a href={personal.social.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-white">
          <Briefcase className="w-5 h-5" />
        </a>
        <a href={personal.social.twitter} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-white">
          <MessageCircle className="w-5 h-5" />
        </a>
      </div>

      <a href={personal.resumeUrl} target="_blank" rel="noopener noreferrer" className="mt-4 flex items-center justify-center gap-2 w-full py-4 bg-neon-accent/10 hover:bg-neon-accent/20 border border-neon-accent/20 text-neon-accent rounded-xl transition-all font-inter font-semibold tracking-wide">
        <FileDown className="w-5 h-5" />
        Download Resume
      </a>
    </div>
  );
}
