import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Flame, Trophy, Activity, ArrowRight, TrendingUp } from 'lucide-react';
import type { Summary } from '../../types/dsa';
import { ActivityHeatmap } from './ActivityHeatmap';

interface JourneySectionProps {
  summary: Summary;
  topicCount?: number;
}

export const JourneySection: React.FC<JourneySectionProps> = ({ summary, topicCount }) => {
  const allActivity = summary.activity || [];

  // Compute exact difficulty percentages for proportional visualization (prevent division by zero)
  const total = summary.total > 0 ? summary.total : 1;
  const easyPct = Math.round((summary.easy / total) * 100);
  const mediumPct = Math.round((summary.medium / total) * 100);
  const hardPct = Math.max(0, 100 - easyPct - mediumPct);

  return (
    <section
      id="journey"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 scroll-mt-20"
      aria-label="Problem Solving Journey"
    >
      {/* 1. SECTION INTRO & EDITORIAL TITLE */}
      <div className="mb-16 sm:mb-20 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-neon-accent mb-4">
          <Activity size={13} />
          <span>JOURNEY &bull; RECORD OF WORK</span>
        </div>

        <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl text-foreground tracking-tight">
          A record of consistency, problem by problem.
        </h2>

        <p className="text-muted-foreground text-base sm:text-lg mt-4 leading-relaxed font-body">
          Every algorithmic solution, optimization, and submission synced automatically from LeetCode into a single continuous personal archive.
        </p>
      </div>

      {/* 2. HERO METRICS & DIFFICULTY COMPOSITION */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-10 lg:p-12 border border-white/10 mb-14 sm:mb-18">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Total Problems Solved & Difficulty Distribution */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2 font-mono text-xs text-neon-accent uppercase tracking-wider">
                <Trophy size={14} />
                <span>OVERALL PROGRESS</span>
              </div>
              <div className="flex items-baseline gap-4 mb-2">
                <span className="font-display text-7xl sm:text-8xl text-foreground tracking-tight">
                  {summary.total}
                </span>
                <span className="font-mono text-xs sm:text-sm uppercase tracking-widest text-muted-foreground font-semibold">
                  PROBLEMS SOLVED
                </span>
              </div>
              <p className="text-muted-foreground text-xs sm:text-sm font-body max-w-md mb-8">
                Verified LeetCode solutions implemented in Java and cataloged {topicCount ? `across ${topicCount} algorithmic topics.` : 'across diverse algorithmic topics.'}
              </p>
            </div>

            {/* Proportional Difficulty Segmented Composition */}
            <div className="space-y-4 pt-6 border-t border-white/10">
              <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                <span className="uppercase tracking-wider">DIFFICULTY DISTRIBUTION</span>
                <span>{summary.total} TOTAL</span>
              </div>

              {/* Segmented bar */}
              <div
                className="w-full h-3.5 rounded-full overflow-hidden flex bg-white/5 border border-white/10 p-0.5 gap-0.5"
                role="progressbar"
                aria-label="Difficulty Breakdown"
                aria-valuenow={summary.total}
                aria-valuemin={0}
                aria-valuemax={summary.total}
              >
                <div
                  style={{ width: `${easyPct}%` }}
                  className="h-full rounded-sm bg-[#00B8A3] transition-all duration-500"
                  title={`Easy: ${summary.easy} (${easyPct}%)`}
                />
                <div
                  style={{ width: `${mediumPct}%` }}
                  className="h-full rounded-sm bg-[#FFC01E] transition-all duration-500"
                  title={`Medium: ${summary.medium} (${mediumPct}%)`}
                />
                <div
                  style={{ width: `${hardPct}%` }}
                  className="h-full rounded-sm bg-[#FF375F] transition-all duration-500"
                  title={`Hard: ${summary.hard} (${hardPct}%)`}
                />
              </div>

              {/* Exact breakdown legend */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-2 h-2 rounded-full bg-[#00B8A3]" />
                    <span className="font-mono text-[11px] text-[#00B8A3] uppercase tracking-wider font-semibold">
                      EASY
                    </span>
                  </div>
                  <div className="font-display text-2xl text-foreground">
                    {summary.easy}
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {easyPct}% of archive
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-2 h-2 rounded-full bg-[#FFC01E]" />
                    <span className="font-mono text-[11px] text-[#FFC01E] uppercase tracking-wider font-semibold">
                      MEDIUM
                    </span>
                  </div>
                  <div className="font-display text-2xl text-foreground">
                    {summary.medium}
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {mediumPct}% of archive
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-2 h-2 rounded-full bg-[#FF375F]" />
                    <span className="font-mono text-[11px] text-[#FF375F] uppercase tracking-wider font-semibold">
                      HARD
                    </span>
                  </div>
                  <div className="font-display text-2xl text-foreground">
                    {String(summary.hard).padStart(2, '0')}
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {hardPct}% of archive
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Streaks & Dedication Statistics */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 lg:border-l lg:border-white/10 lg:pl-10">
            {/* Current Streak */}
            <div className="liquid-glass rounded-2xl p-5 border border-white/5 flex items-center justify-between group hover:border-white/20 transition-colors">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground block mb-1">
                  CURRENT STREAK
                </span>
                <div className="font-display text-3xl sm:text-4xl text-foreground">
                  {summary.currentStreak} {summary.currentStreak === 1 ? 'DAY' : 'DAYS'}
                </div>
                <span className="font-mono text-[10px] text-neon-accent">
                  Active momentum
                </span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-neon-accent/10 border border-neon-accent/30 flex items-center justify-center text-neon-accent shrink-0">
                <Flame size={20} />
              </div>
            </div>

            {/* Best Streak */}
            <div className="liquid-glass rounded-2xl p-5 border border-white/5 flex items-center justify-between group hover:border-white/20 transition-colors">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground block mb-1">
                  BEST STREAK
                </span>
                <div className="font-display text-3xl sm:text-4xl text-foreground">
                  {summary.bestStreak} {summary.bestStreak === 1 ? 'DAY' : 'DAYS'}
                </div>
                <span className="font-mono text-[10px] text-[#FFC01E]">
                  Longest consecutive run
                </span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-[#FFC01E]/10 border border-[#FFC01E]/30 flex items-center justify-center text-[#FFC01E] shrink-0">
                <TrendingUp size={20} />
              </div>
            </div>

            {/* Active Days */}
            <div className="liquid-glass rounded-2xl p-5 border border-white/5 flex items-center justify-between group hover:border-white/20 transition-colors">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground block mb-1">
                  ACTIVE DAYS
                </span>
                <div className="font-display text-3xl sm:text-4xl text-foreground">
                  {summary.activeDays} DAYS
                </div>
                <span className="font-mono text-[10px] text-muted-foreground">
                  Total calendar days active
                </span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground shrink-0">
                <Calendar size={20} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. CINEMATIC ACTIVITY CONTRIBUTION HEATMAP */}
      <ActivityHeatmap
        activity={allActivity}
        activeDays={summary.activeDays}
        totalSolved={summary.total}
      />

      {/* 4. KEEP EXPLORING CONTINUATION CTA */}
      <div className="mt-16 text-center">
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground block mb-3">
          KEEP EXPLORING
        </span>
        <Link
          to="/problems"
          className="liquid-glass rounded-full px-8 py-4 text-sm font-medium tracking-wider text-foreground hover:scale-[1.03] active:scale-[0.98] transition-transform inline-flex items-center gap-2 group cursor-pointer border border-white/15"
        >
          <span>EXPLORE ALL PROBLEMS</span>
          <ArrowRight size={16} className="text-neon-accent group-hover:translate-x-1.5 transition-transform" />
        </Link>
      </div>
    </section>
  );
};
