import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search, ExternalLink, ArrowRight, Code2, RotateCcw, Layers } from 'lucide-react';
import type { Problem, Summary, Topic } from '../../types/dsa';
import { AsciiImageTexture } from './AsciiImageTexture';
import type { TextureId } from '../../services/cardTextureCache';

gsap.registerPlugin(ScrollTrigger);

interface ProblemsCinematicSceneProps {
  problems: Problem[];
  summary: Summary;
  topics: Topic[];
}

export const ProblemsCinematicScene: React.FC<ProblemsCinematicSceneProps> = ({
  problems,
  summary,
  topics,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const macroStageRef = useRef<HTMLDivElement>(null);
  const macroNumberRef = useRef<HTMLDivElement>(null);
  const macroLabelRef = useRef<HTMLDivElement>(null);
  const breakdownRef = useRef<HTMLDivElement>(null);
  const distBarRef = useRef<HTMLDivElement>(null);
  const groupingRef = useRef<HTMLDivElement>(null);

  // Functional Explorer state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedTopic, setSelectedTopic] = useState<string>('');

  // Top recent items for ticker
  const topTickerProblems = useMemo(() => {
    return [...problems].sort((a, b) => b.id - a.id).slice(0, 16);
  }, [problems]);

  // Real representative groupings (Problems -> Patterns transition)
  const patternClusters = useMemo(() => {
    return [
      {
        pattern: 'Hash Table',
        description: 'Instant key lookup & frequency counts',
        problems: problems.filter((p) => p.topics.includes('Hash Table')).slice(0, 3),
      },
      {
        pattern: 'Two Pointers',
        description: 'Converging index sweeps on linear arrays',
        problems: problems.filter((p) => p.topics.includes('Two Pointers')).slice(0, 3),
      },
      {
        pattern: 'Binary Search',
        description: 'Logarithmic partition on monotonic ranges',
        problems: problems.filter((p) => p.topics.includes('Binary Search')).slice(0, 2),
      },
      {
        pattern: 'Sliding Window',
        description: 'Dynamic subarray boundaries with expansion & contraction',
        problems: problems.filter((p) => p.topics.includes('Sliding Window')).slice(0, 2),
      },
    ].filter((g) => g.problems.length > 0);
  }, [problems]);

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      // 1. MACRO NUMBER SHRINK & DATA EXPANSION PINNED TIMELINE
      // Number emerges from empty center left by REPEAT, scales down, docks into headline position
      const macroTl = gsap.timeline({
        scrollTrigger: {
          trigger: macroStageRef.current,
          start: 'top top',
          end: '+=160%',
          pin: true,
          scrub: 0.9,
          anticipatePin: 1,
        },
      });

      macroTl
        // 1. Macro number emerges from empty center, then smoothly scales down
        .fromTo(
          macroNumberRef.current,
          { scale: 2.6, opacity: 0, y: 40 },
          { scale: 2.2, opacity: 1, y: 15, duration: 0.5, ease: 'power2.out' },
          0
        )
        .to(
          macroNumberRef.current,
          { scale: 1, opacity: 1, y: 0, duration: 1.0, ease: 'power2.inOut' },
          0.5
        )
        // 2. Label reveals under the docked number
        .fromTo(
          macroLabelRef.current,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
          0.9
        )
        // 3. Breakdown pills emerge around it
        .fromTo(
          breakdownRef.current,
          { opacity: 0, y: 20, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power2.out' },
          1.1
        )
        // 4. Proportional distribution bar expands from 0 to full
        .fromTo(
          distBarRef.current,
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 1, duration: 0.7, transformOrigin: 'left center', ease: 'power2.out' },
          1.2
        );

      // 2. STRICTLY SCROLL-DRIVEN PROBLEM TICKER (scroll position -> ticker position)
      gsap.fromTo(
        '.scroll-ticker-track',
        { x: 0 },
        {
          x: -600,
          ease: 'none',
          scrollTrigger: {
            trigger: '.scroll-ticker-container',
            start: 'top 85%',
            end: 'bottom 15%',
            scrub: 1.1,
          },
        }
      );

      // 3. PROBLEMS -> PATTERNS CONVERGENCE ANIMATION
      // Individual problem items slide inward, and pattern pill lights up
      gsap.fromTo(
        '.cluster-problem-item',
        { x: -15, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: groupingRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        '.cluster-pattern-badge',
        { scale: 0.92, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          stagger: 0.1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: groupingRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Filter & sort logic for the integrated explorer
  const filteredProblems = useMemo(() => {
    let list = [...problems];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.problemName.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q) ||
          String(p.frontendId).toLowerCase().includes(q) ||
          String(p.id).includes(q)
      );
    }

    if (selectedDifficulty !== 'All') {
      list = list.filter((p) => p.difficulty === selectedDifficulty);
    }

    if (selectedTopic.trim()) {
      const topicNorm = selectedTopic.toLowerCase().trim();
      list = list.filter((p) =>
        p.topics.some(
          (t) =>
            t.toLowerCase() === topicNorm ||
            t.toLowerCase().replace(/\s+/g, '-') === topicNorm
        )
      );
    }

    return list.sort((a, b) => b.id - a.id);
  }, [problems, searchQuery, selectedDifficulty, selectedTopic]);

  const getDifficultyBadge = (difficulty: Problem['difficulty']) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-[#00B8A3] border-[#00B8A3]/30 bg-[#00B8A3]/10';
      case 'Medium':
        return 'text-[#FFC01E] border-[#FFC01E]/30 bg-[#FFC01E]/10';
      case 'Hard':
        return 'text-[#FF375F] border-[#FF375F]/30 bg-[#FF375F]/10';
      default:
        return 'text-[#9a9a9a] border-white/10 bg-white/5';
    }
  };

  const total = summary.total > 0 ? summary.total : 1;
  const easyPct = Math.round((summary.easy / total) * 100);
  const mediumPct = Math.round((summary.medium / total) * 100);
  const hardPct = Math.max(0, 100 - easyPct - mediumPct);

  return (
    <section id="problems" ref={containerRef} className="relative w-full scroll-mt-16">
      {/* ========================================================================= */}
      {/* 1. PINNED MACRO NUMBER SCENE: ONE NUMBER -> DATA -> DISTRIBUTION          */}
      {/* ========================================================================= */}
      <div ref={macroStageRef} className="w-full min-h-screen relative flex items-center justify-center select-none overflow-hidden">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
          {/* GIGANTIC MACRO NUMBER (Emerges then shrinks to docked position on scroll) */}
          <div
            ref={macroNumberRef}
            className="font-sans font-extrabold text-[22vw] sm:text-[16vw] text-white tracking-tighter leading-none transform-gpu opacity-0"
          >
            {summary.total}
          </div>

          {/* Label under the docked number */}
          <div ref={macroLabelRef} className="mt-2 mb-6">
            <h2 className="font-sans font-light text-2xl sm:text-4xl text-white tracking-tight uppercase">
              Problems{' '}
              <span className="font-italic-serif text-white lowercase">
                solved in archive.
              </span>
            </h2>
            <p className="text-[#9a9a9a] font-mono text-xs mt-2 max-w-md mx-auto">
              Traveling from high-level volume metrics into individual implementation details.
            </p>
          </div>

          {/* Difficulty breakdown tokens that appear around it */}
          <div
            ref={breakdownRef}
            className="flex items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-mono mb-6"
          >
            <div className="px-3.5 py-1.5 rounded-lg border border-[#00B8A3]/30 bg-[#00B8A3]/10 text-[#00B8A3] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00B8A3]" />
              <span>{summary.easy} EASY</span>
              <span className="text-[#00B8A3]/60 text-[10px]">({easyPct}%)</span>
            </div>

            <div className="px-3.5 py-1.5 rounded-lg border border-[#FFC01E]/30 bg-[#FFC01E]/10 text-[#FFC01E] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFC01E]" />
              <span>{summary.medium} MEDIUM</span>
              <span className="text-[#FFC01E]/60 text-[10px]">({mediumPct}%)</span>
            </div>

            <div className="px-3.5 py-1.5 rounded-lg border border-[#FF375F]/30 bg-[#FF375F]/10 text-[#FF375F] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF375F]" />
              <span>{summary.hard} HARD</span>
              <span className="text-[#FF375F]/60 text-[10px]">({hardPct}%)</span>
            </div>
          </div>

          {/* Proportional distribution bar that expands */}
          <div
            ref={distBarRef}
            className="w-full max-w-md h-2 rounded-full overflow-hidden flex bg-white/5 border border-white/10 gap-0.5 p-0.5"
          >
            <div style={{ width: `${easyPct}%` }} className="h-full bg-[#00B8A3] rounded-xs" />
            <div style={{ width: `${mediumPct}%` }} className="h-full bg-[#FFC01E] rounded-xs" />
            <div style={{ width: `${hardPct}%` }} className="h-full bg-[#FF375F] rounded-xs" />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. STRICTLY SCROLL-DRIVEN PROBLEM TICKER (Scroll forward -> moves forward)*/}
      {/* ========================================================================= */}
      <div className="scroll-ticker-container w-full overflow-hidden py-8 border-t border-b border-white/10 select-none bg-black/40">
        <div className="scroll-ticker-track flex gap-4 w-max px-4">
          {topTickerProblems.map((p) => (
            <div
              key={p.slug}
              className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.02] flex items-center gap-3.5 font-mono text-xs text-[#9a9a9a] shrink-0"
            >
              <span className="text-white/40">#{String(p.frontendId || p.id).padStart(4, '0')}</span>
              <span className="text-white font-sans font-medium">{p.title}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded border ${getDifficultyBadge(p.difficulty)}`}>
                {p.difficulty}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. PROBLEMS -> PATTERNS CONVERGENCE BRIDGE: PROBLEMS GROUP INTO TOPICS    */}
      {/* ========================================================================= */}
      <div ref={groupingRef} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 select-none">
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#9a9a9a] uppercase tracking-widest mb-3">
            <Layers size={13} />
            <span>TRANSITION &bull; PROBLEMS &rarr; PATTERNS</span>
          </div>
          <h3 className="font-sans font-light text-2xl sm:text-4xl text-white tracking-tight">
            Individual problems{' '}
            <span className="font-italic-serif text-white/90 lowercase">converge</span> into patterns.
          </h3>
          <p className="text-xs sm:text-sm text-[#6f6f6f] font-mono mt-2">
            Watch specific challenges synthesize into underlying algorithmic principles.
          </p>
        </div>

        {/* 4 Authentic Clusters demonstrating Problems -> Patterns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {patternClusters.map((cluster, idx) => {
            const textures: TextureId[] = ['texture-01', 'texture-02', 'texture-03', 'texture-04'];
            const textureChoice = textures[idx % 4];

            return (
              <div
                key={cluster.pattern}
                className="pattern-cluster-card relative overflow-hidden group cinematic-panel p-5 rounded-2xl border border-white/10 flex flex-col justify-between"
              >
                <AsciiImageTexture
                  texture={textureChoice}
                  crop="top-right"
                  fade="corner-tr"
                  dotSpacing={5.8}
                  density={1.08}
                  detail={1.15}
                  contrast={1.38}
                  opacity={0.34}
                  hoverOpacity={0.58}
                />

                <div className="relative z-10 flex flex-col justify-between h-full">
                  <div>
                    <span className="font-mono text-[10px] text-[#6f6f6f] uppercase tracking-wider block mb-3">
                      CONVERGING CHALLENGES
                    </span>
                    <div className="space-y-2 mb-6">
                      {cluster.problems.map((p) => (
                        <div
                          key={p.slug}
                          className="cluster-problem-item p-2 rounded bg-white/[0.02] border border-white/5 text-[11px] font-mono text-[#9a9a9a] truncate flex items-center justify-between"
                        >
                          <span className="truncate">{p.title}</span>
                          <span className="text-[9px] text-[#6f6f6f] ml-1 shrink-0">#{p.frontendId}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Emergent Pattern */}
                  <div className="cluster-pattern-badge pt-3 border-t border-white/10 flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[#6f6f6f] uppercase">&darr; PATTERN</span>
                      <span className="font-sans text-xs font-bold text-white uppercase tracking-wider">
                        {cluster.pattern}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#9a9a9a] line-clamp-1">
                      {cluster.description}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. FUNCTIONAL PROBLEM EXPLORER (High-density editorial list)              */}
      {/* ========================================================================= */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="cinematic-panel p-5 sm:p-8 rounded-2xl border border-white/10">
          {/* Controls Toolbar */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center pb-6 border-b border-white/10">
            {/* Search bar */}
            <div className="relative flex-1 max-w-md">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6f6f6f]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search archive by challenge name, number, or slug..."
                aria-label="Search problems"
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-black/60 border border-white/10 text-xs sm:text-sm text-white placeholder:text-[#6f6f6f] focus:outline-none focus:border-white/40 transition-colors font-mono"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Difficulty Filter Tabs */}
              <div className="flex items-center rounded-lg bg-black/60 p-1 border border-white/10">
                {(['All', 'Easy', 'Medium', 'Hard'] as const).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`px-3 py-1 rounded-md text-xs font-mono tracking-wider transition-all cursor-pointer ${
                      selectedDifficulty === diff
                        ? 'bg-white/15 text-white font-medium shadow-sm'
                        : 'text-[#9a9a9a] hover:text-white'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>

              {/* Topic Filter Dropdown */}
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                aria-label="Filter by Topic"
                className="px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-xs font-mono text-[#9a9a9a] focus:text-white focus:outline-none cursor-pointer"
              >
                <option value="">All Topics ({topics.length})</option>
                {topics.map((t) => (
                  <option key={t.slug} value={t.name}>
                    {t.name} ({t.problemCount})
                  </option>
                ))}
              </select>

              {/* Reset filter button if active */}
              {(searchQuery || selectedDifficulty !== 'All' || selectedTopic) && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedDifficulty('All');
                    setSelectedTopic('');
                  }}
                  className="p-1.5 rounded-lg text-[#9a9a9a] hover:text-white border border-white/10 hover:border-white/30 transition-colors"
                  title="Clear filters"
                >
                  <RotateCcw size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Results Counter Bar */}
          <div className="flex items-center justify-between text-[11px] font-mono text-[#6f6f6f] py-4">
            <span>
              SHOWING <strong className="text-white">{filteredProblems.length}</strong> OF{' '}
              <strong className="text-white">{problems.length}</strong> PROBLEMS
            </span>
            <Link
              to="/problems"
              className="text-[#9a9a9a] hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>Full Archive View</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          {/* High-density Editorial Table / List */}
          <div className="divide-y divide-white/5 border-t border-b border-white/5">
            {filteredProblems.slice(0, 10).map((p) => {
              const formattedId = `#${String(p.frontendId || p.id).padStart(4, '0')}`;
              return (
                <div
                  key={p.slug}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between py-3.5 px-3 rounded-lg hover:bg-white/[0.03] transition-colors gap-2"
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <span className="font-mono text-xs text-[#6f6f6f] group-hover:text-[#9a9a9a] transition-colors shrink-0">
                      {formattedId}
                    </span>

                    <Link
                      to={`/problems/${p.slug}`}
                      className="font-sans text-sm sm:text-base font-medium text-white group-hover:text-white/80 transition-colors truncate focus:outline-none"
                    >
                      {p.title}
                    </Link>

                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase tracking-wider shrink-0 ${getDifficultyBadge(
                        p.difficulty
                      )}`}
                    >
                      {p.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4 shrink-0 sm:self-auto pl-7 sm:pl-0">
                    <div className="hidden md:flex items-center gap-1.5">
                      {p.topics.slice(0, 2).map((t) => (
                        <span
                          key={t}
                          className="text-[10px] font-mono px-2 py-0.5 rounded border border-white/5 bg-white/[0.02] text-[#9a9a9a]"
                        >
                          {t}
                        </span>
                      ))}
                      {p.topics.length > 2 && (
                        <span className="text-[10px] font-mono text-[#6f6f6f]">
                          +{p.topics.length - 2}
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] font-mono text-[#6f6f6f] flex items-center gap-1">
                      <Code2 size={12} className="opacity-70" />
                      <span>Java</span>
                    </span>

                    {p.leetcodeUrl && (
                      <a
                        href={p.leetcodeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#6f6f6f] hover:text-white p-1 transition-colors"
                        title="Open on LeetCode"
                      >
                        <ExternalLink size={12} />
                      </a>
                    )}

                    <Link
                      to={`/problems/${p.slug}`}
                      className="metallic-btn px-2.5 py-1 text-[11px] font-mono text-[#9a9a9a] group-hover:text-white flex items-center gap-1"
                    >
                      <span>VIEW</span>
                      <ArrowRight size={10} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Action */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="font-mono text-xs text-[#6f6f6f]">
              Displaying 10 recent of {filteredProblems.length} filtered items
            </span>
            <Link
              to="/problems"
              className="metallic-btn-primary px-6 py-2.5 text-xs font-mono tracking-widest uppercase inline-flex items-center gap-2"
            >
              <span>Explore All {problems.length} Solutions</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
