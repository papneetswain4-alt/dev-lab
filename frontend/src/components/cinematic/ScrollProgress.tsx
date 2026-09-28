import React, { useEffect, useState } from 'react';
import { scrollToTarget } from '../../hooks/useLenis';

interface Chapter {
  id: string;
  num: string;
  name: string;
}

const CHAPTERS: Chapter[] = [
  { id: 'hero', num: '01', name: 'INTRO' },
  { id: 'identity', num: '02', name: 'SYSTEM' },
  { id: 'problems', num: '03', name: 'PROBLEMS' },
  { id: 'topics', num: '04', name: 'PATTERNS' },
  { id: 'journey', num: '05', name: 'JOURNEY' },
  { id: 'consistency', num: '06', name: 'SIGNAL' },
  { id: 'archive', num: '07', name: 'ARCHIVE' },
];

export const ScrollProgress: React.FC = () => {
  const [activeChapter, setActiveChapter] = useState('hero');
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll <= 0) return;

      const currentScroll = window.scrollY;
      const progress = Math.min(1, Math.max(0, currentScroll / totalScroll));
      setScrollProgress(progress);

      // Determine active chapter with scroll window offset
      const scrollPos = currentScroll + window.innerHeight * 0.4;
      for (let i = CHAPTERS.length - 1; i >= 0; i--) {
        const el = document.getElementById(CHAPTERS[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveChapter(CHAPTERS[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToChapter = (id: string) => {
    scrollToTarget(id, { offset: -20 });
  };

  return (
    <aside
      aria-label="Chapter Timeline Navigator"
      className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-end gap-3 select-none pointer-events-auto"
    >
      {/* Chapters list */}
      <nav className="flex flex-col items-end gap-3" aria-label="Chapters">
        {CHAPTERS.map((ch) => {
          const isActive = activeChapter === ch.id;
          return (
            <button
              key={ch.id}
              onClick={() => handleScrollToChapter(ch.id)}
              className="group flex items-center gap-2.5 py-0.5 text-right focus:outline-none cursor-pointer"
              title={`${ch.num} ${ch.name}`}
            >
              {/* Chapter Name / Tooltip */}
              <span
                className={`font-mono text-[9px] tracking-widest transition-all duration-200 ${
                  isActive
                    ? 'text-white opacity-100 translate-x-0 font-medium'
                    : 'text-[#6f6f6f] opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-2'
                }`}
              >
                {ch.num} &bull; {ch.name}
              </span>

              {/* Minimal Notch with subtle brightness and tiny scale increase (no giant glow) */}
              <span
                className={`transition-all duration-200 rounded-full ${
                  isActive
                    ? 'w-4 h-[1.5px] bg-white scale-105'
                    : 'w-2 h-[1.5px] bg-white/20 group-hover:w-3 group-hover:bg-white/50'
                }`}
              />
            </button>
          );
        })}
      </nav>

      {/* Progress Track Line */}
      <div className="w-[1px] h-16 bg-white/10 relative mt-2 rounded-full overflow-hidden self-end mr-[3px]">
        <div
          className="absolute top-0 left-0 w-full bg-white transition-all duration-100"
          style={{ height: `${scrollProgress * 100}%` }}
        />
      </div>
    </aside>
  );
};
