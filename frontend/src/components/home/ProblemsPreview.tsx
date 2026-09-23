import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ProblemCard } from '../problems/ProblemCard';
import type { Problem } from '../../types/dsa';

interface ProblemsPreviewProps {
  problems: Problem[];
}

export const ProblemsPreview: React.FC<ProblemsPreviewProps> = ({ problems }) => {
  // Sort descending by ID to showcase the latest solved problems
  const recentProblems = [...problems]
    .sort((a, b) => b.id - a.id)
    .slice(0, 6);

  return (
    <section id="problems" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 scroll-mt-20">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="font-mono text-xs text-neon-accent tracking-widest uppercase">
              THE ARCHIVE
            </span>
            <span className="text-white/20">•</span>
            <span className="font-mono text-xs px-2.5 py-0.5 rounded-full liquid-glass text-muted-foreground border border-white/10">
              {problems.length} total solved
            </span>
          </div>

          <h2 className="font-display text-4xl sm:text-6xl text-foreground tracking-tight">
            Problems I've Solved.
          </h2>

          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mt-4 leading-relaxed font-body">
            A growing archive of problems, patterns, and solutions from my DSA
            journey. Here are a few recently conquered challenges.
          </p>
        </div>

        {/* Desktop Direct Link to Full Explorer */}
        <Link
          to="/problems"
          className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-neon-accent transition-colors group"
        >
          <span>Explore all {problems.length} problems</span>
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Recent Problems Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recentProblems.map((problem) => (
          <ProblemCard key={problem.slug} problem={problem} />
        ))}
      </div>

      {/* Bottom CTA for all screen sizes */}
      <div className="mt-12 text-center">
        <Link
          to="/problems"
          className="liquid-glass rounded-full px-8 py-4 text-sm font-medium tracking-wider text-foreground hover:scale-[1.03] active:scale-[0.98] transition-transform inline-flex items-center gap-2 group cursor-pointer"
        >
          <span>EXPLORE ALL PROBLEMS</span>
          <ArrowRight size={16} className="text-neon-accent group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
};
