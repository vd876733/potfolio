import { ExternalLink, Code, Terminal } from "lucide-react";
import portfolioData from "@/data/portfolio.json";

export default function WorkshopModal() {
  const { projects } = portfolioData;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3 border-b border-slate-300 dark:border-white/10 pb-4">
        <Terminal className="w-8 h-8 text-neon-accent" />
        <h2 className="text-2xl font-space-grotesk font-bold text-slate-900 dark:text-white">Project Workshops</h2>
      </div>

      <div className="flex flex-col gap-6">
        {projects.map((project) => (
          <div key={project.id} className="p-6 bg-slate-50 dark:bg-black/20 rounded-xl border border-slate-200 dark:border-white/5 flex flex-col gap-4">
            <h3 className="text-xl font-space-grotesk font-bold text-slate-900 dark:text-white">{project.title}</h3>
            
            <div className="flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <span key={tech} className="px-3 py-1 bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-white/80 text-xs font-inter rounded-full">
                  {tech}
                </span>
              ))}
            </div>

            <p className="text-slate-600 dark:text-white/60 font-inter text-sm leading-relaxed">
              {project.description}
            </p>

            <div className="flex gap-4 mt-2">
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-3 bg-neon-accent/10 hover:bg-neon-accent/20 border border-neon-accent/20 text-neon-accent rounded-xl transition-all font-inter font-semibold text-sm">
                <ExternalLink className="w-4 h-4" />
                Live Preview
              </a>
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl transition-all font-inter font-semibold text-sm">
                <Code className="w-4 h-4" />
                GitHub Repo
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
