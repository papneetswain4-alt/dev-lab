import React from 'react';
import { ExternalLink, GitBranch, Terminal } from 'lucide-react';

export const GitHubSection: React.FC = () => {
  return (
    <section id="github" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 scroll-mt-20">
      <div className="liquid-glass rounded-3xl p-8 sm:p-14 border border-white/10 relative overflow-hidden text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-2xl">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
            <span className="font-mono text-xs text-neon-accent tracking-widest uppercase">
              OPEN SOURCE
            </span>
            <span className="text-white/20">•</span>
            <span className="font-mono text-xs text-muted-foreground">
              automated via LeetHub Neo
            </span>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl text-foreground tracking-tight">
            The Code Behind the Journey.
          </h2>

          <p className="text-muted-foreground text-base sm:text-lg mt-4 leading-relaxed font-body">
            Every solution, test pattern, and topic breakdown in this repository is
            automatically synced directly from LeetCode. Explore the raw commits,
            Java source implementations, and topic playbooks.
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-6 text-xs font-mono text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Terminal size={14} className="text-neon-accent" />
              <span>Java 21</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <GitBranch size={14} className="text-neon-accent" />
              <span>Main Branch</span>
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <div>
          <a
            href="https://github.com/papneetswain4-alt/dev-lab"
            target="_blank"
            rel="noopener noreferrer"
            className="liquid-glass rounded-full px-8 py-4 text-sm font-medium tracking-wider text-foreground hover:scale-[1.03] active:scale-[0.98] transition-transform inline-flex items-center gap-2 group cursor-pointer border border-white/20"
          >
            <span>VIEW GITHUB REPO</span>
            <ExternalLink size={16} className="text-neon-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
};
