import React, { useMemo } from 'react';
import LogoLoop from './LogoLoop/LogoLoop';
import { 
  FaReact, 
  FaJs, 
  FaNodeJs, 
  FaPython, 
  FaDocker, 
  FaGithub, 
  FaGitAlt 
} from 'react-icons/fa';
import { 
  SiNextdotjs, 
  SiTypescript, 
  SiSpringboot, 
  SiPostgresql, 
  SiMongodb, 
  SiThreedotjs, 
  SiTailwindcss,
  SiFramer
} from 'react-icons/si';

export default function TechStack() {
  const techLogos = useMemo(() => [
    { name: 'React', node: <FaReact className="text-[#61dafb]" />, title: 'React' },
    { name: 'Next.js', node: <SiNextdotjs className="text-slate-900 dark:text-slate-100" />, title: 'Next.js' },
    { name: 'TypeScript', node: <SiTypescript className="text-[#3178c6] rounded" />, title: 'TypeScript' },
    { name: 'JavaScript', node: <FaJs className="text-[#f7df1e] bg-black rounded-sm" />, title: 'JavaScript' },
    { name: 'Node.js', node: <FaNodeJs className="text-[#339933]" />, title: 'Node.js' },
    { name: 'Spring Boot', node: <SiSpringboot className="text-[#6db33f]" />, title: 'Spring Boot' },
    { name: 'Python', node: <FaPython className="text-[#3776ab]" />, title: 'Python' },
    { name: 'Docker', node: <FaDocker className="text-[#2496ed]" />, title: 'Docker' },
    { name: 'PostgreSQL', node: <SiPostgresql className="text-[#4169e1]" />, title: 'PostgreSQL' },
    { name: 'MongoDB', node: <SiMongodb className="text-[#47a248]" />, title: 'MongoDB' },
    { name: 'Three.js', node: <SiThreedotjs className="text-slate-900 dark:text-slate-100" />, title: 'Three.js' },
    { name: 'Tailwind CSS', node: <SiTailwindcss className="text-[#06b6d4]" />, title: 'Tailwind CSS' },
    { name: 'Framer Motion', node: <SiFramer className="text-[#ff007f]" />, title: 'Framer Motion' },
    { name: 'Git', node: <FaGitAlt className="text-[#f05032]" />, title: 'Git' },
    { name: 'GitHub', node: <FaGithub className="text-slate-900 dark:text-slate-100" />, title: 'GitHub' }
  ], []);

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-1.5">
        <h3 className="text-slate-900 dark:text-white text-xl sm:text-2xl font-bold tracking-tight">
          Technologies & Tools
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base font-medium">
          A selection of tech stacks, frameworks, databases, and DevOps tools I use.
        </p>
      </div>

      <div className="relative py-4 overflow-hidden rounded-xl bg-slate-100/50 dark:bg-black/20 border border-slate-200/20 dark:border-white/5">
        <LogoLoop 
          logos={techLogos} 
          speed={40} 
          direction="left" 
          gap={48} 
          logoHeight={36} 
          pauseOnHover={true}
          scaleOnHover={true}
          fadeOut={true}
        />
      </div>
    </div>
  );
}
