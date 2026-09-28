import React from 'react';
import { ArrowUpRight, Terminal, GitBranch, FolderGit2, ArrowUp } from 'lucide-react';
import { scrollToTarget } from '../../hooks/useLenis';
import { AsciiImageTexture } from './AsciiImageTexture';

export const FinalCtaSection: React.FC = () => {
  const handleScrollToTop = () => {
    scrollToTarget(0, { duration: 1.4 });
  };

  return (
    <footer id="archive" className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 sm:pb-24 select-none">
      {/* 1. ARCHIVE / TECHNICAL SYSTEM SUMMARY CARD */}
      <div className="relative overflow-hidden group cinematic-panel p-8 sm:p-14 rounded-3xl border border-white/15 mb-16">
        {/* Large abstract texture: Texture 04 (Marbled Swirl) */}
        <AsciiImageTexture
          texture="texture-04"
          crop="center"
          fade="radial"
          dotSpacing={5.8}
          density={1.10}
          detail={1.20}
          contrast={1.38}
          opacity={0.38}
          hoverOpacity={0.62}
        />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-xl">


            <h2 className="font-sans font-light text-4xl sm:text-5xl md:text-6xl text-white tracking-tight leading-[0.95] uppercase">
              The code{' '}
              <span className="font-italic-serif text-white/90 lowercase tracking-normal">
                behind
              </span>{' '}
              the journey.
            </h2>

            <p className="text-[#9a9a9a] text-sm sm:text-base mt-4 font-sans font-light leading-relaxed">
              Every solved challenge, unit test pattern, and complexity breakdown in DEV.LAB is version-controlled and synchronized directly from LeetCode into GitHub.
            </p>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-6 text-xs font-mono text-[#6f6f6f]">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/[0.03] border border-white/10 text-white font-mono">
                <Terminal size={12} className="opacity-80" />
                <span>JAVA 21</span>
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/[0.03] border border-white/10 text-white font-mono">
                <GitBranch size={12} className="opacity-80" />
                <span>GITHUB</span>
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/[0.03] border border-white/10 text-white font-mono">
                <FolderGit2 size={12} className="opacity-80" />
                <span>LEETHUB NEO</span>
              </span>
            </div>
          </div>

          {/* Call to Action Button */}
          <div className="shrink-0 w-full sm:w-auto">
            <a
              href="https://github.com/papneetswain4-alt/dev-lab"
              target="_blank"
              rel="noopener noreferrer"
              className="metallic-btn-primary w-full sm:w-auto px-8 py-4 text-xs font-mono tracking-widest uppercase inline-flex items-center justify-center gap-2"
            >
              <span>Inspect On GitHub</span>
              <ArrowUpRight size={15} />
            </a>
          </div>
        </div>
      </div>

      {/* 2. MINIMAL SYSTEM FOOTER & SMOOTH LENIS BACK TO TOP */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-white/10 text-xs font-mono text-[#6f6f6f]">
        <div className="flex items-center gap-3">
          <span className="font-bold text-white tracking-widest">DEV.LAB</span>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={handleScrollToTop}
            className="flex items-center gap-1.5 text-[#9a9a9a] hover:text-white transition-colors cursor-pointer group"
          >
            <span>BACK TO TOP</span>
            <ArrowUp size={13} className="group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
};
