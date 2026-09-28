import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flame, Trophy, Layers, GitCommit, Calendar } from 'lucide-react';
import type { Summary } from '../../types/dsa';
import { AsciiImageTexture } from './AsciiImageTexture';

gsap.registerPlugin(ScrollTrigger);

interface JourneyTimelineSceneProps {
  summary: Summary;
  topicCount: number;
}

interface Milestone {
  id: string;
  phase: string;
  title: string;
  date: string;
  metric: string;
  description: string;
  icon: React.ReactNode;
}

export const JourneyTimelineScene: React.FC<JourneyTimelineSceneProps> = ({
  summary,
  topicCount,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineWrapperRef = useRef<HTMLDivElement>(null);
  const trackLineRef = useRef<HTMLDivElement>(null);
  const horizontalExpandRef = useRef<HTMLDivElement>(null);

  const milestones: Milestone[] = [
    {
      id: 'm1',
      phase: '01 / INITIALIZATION',
      title: 'Repository Genesis',
      date: 'Late 2025',
      metric: '01 SOLVED',
      description:
        'Dev.Lab initialized. First LeetCode problem conquered and automated repository synchronization configured via LeetHub Neo.',
      icon: <GitCommit size={15} />,
    },
    {
      id: 'm2',
      phase: '02 / MOMENTUM',
      title: 'First Streak Unlocked',
      date: 'Consecutive Days',
      metric: `${summary.bestStreak} DAY STREAK`,
      description:
        `Continuous daily rhythm established, culminating in a verified ${summary.bestStreak}-day personal best consecutive solving streak.`,
      icon: <Flame size={15} />,
    },
    {
      id: 'm3',
      phase: '03 / EXPANSION',
      title: 'Taxonomy Maturation',
      date: 'Across Paradigms',
      metric: `${topicCount} TOPICS`,
      description:
        'Broadening horizons from basic linear scans into Two Pointers, Sliding Window, Dynamic Programming, and complex Tree/Graph structures.',
      icon: <Layers size={15} />,
    },
    {
      id: 'm4',
      phase: '04 / CONSISTENCY',
      title: 'Habit Formation',
      date: 'Quarterly Record',
      metric: `${summary.activeDays} ACTIVE DAYS`,
      description:
        `Proving consistency through ${summary.activeDays} distinct calendar dates with multi-problem dedicated study sessions.`,
      icon: <Calendar size={15} />,
    },
    {
      id: 'm5',
      phase: '05 / PRESENT ARCHIVE',
      title: 'Operational Maturity',
      date: 'Present Day',
      metric: `${summary.total} PROBLEMS`,
      description:
        `Total archive reaching ${summary.total} verified solutions (${summary.easy} Easy, ${summary.medium} Medium, ${summary.hard} Hard) with clean Java documentation.`,
      icon: <Trophy size={15} />,
    },
  ];

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      // 1. GENUINELY SCROLL-CONTROLLED VERTICAL LINE (scaleY: 0 -> 1)
      // Line starts at top of first milestone node inside the dedicated wrapper
      gsap.fromTo(
        trackLineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: 'top center',
          ease: 'none',
          scrollTrigger: {
            trigger: timelineWrapperRef.current,
            start: 'top 75%',
            end: 'bottom 85%',
            scrub: 0.8,
          },
        }
      );

      // 2. MILESTONE PROGRESSIVE ILLUMINATION (○ Inactive -> ● Active)
      milestones.forEach((m) => {
        const itemEl = document.querySelector(`.milestone-row-${m.id}`);
        const pinEl = document.querySelector(`.milestone-pin-${m.id}`);
        const cardEl = document.querySelector(`.milestone-card-${m.id}`);

        if (itemEl && pinEl && cardEl) {
          const mTl = gsap.timeline({
            scrollTrigger: {
              trigger: itemEl,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          });

          mTl
            .to(pinEl, {
              borderColor: 'rgba(255, 255, 255, 0.9)',
              backgroundColor: '#ffffff',
              boxShadow: '0 0 14px rgba(255, 255, 255, 0.8)',
              duration: 0.35,
            })
            .fromTo(
              cardEl,
              { opacity: 0, y: 22, filter: 'blur(3px)' },
              { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, ease: 'power2.out' },
              '-=0.15'
            );
        }
      });

      // 3. JOURNEY -> CONSISTENCY HORIZONTAL BASELINE EXPANSION
      const expandTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.journey-consistency-bridge',
          start: 'top 85%',
          end: 'bottom 45%',
          scrub: 0.9,
        },
      });

      expandTl
        .fromTo(
          '.bridge-now-node',
          { scale: 0.85, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.3 }
        )
        .fromTo(
          horizontalExpandRef.current,
          { scaleX: 0 },
          { scaleX: 1, transformOrigin: 'center center', duration: 0.9, ease: 'power2.out' }
        )
        .fromTo(
          '.bridge-consistency-label',
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.4 },
          '-=0.3'
        );
    }, containerRef);

    return () => ctx.revert();
  }, [milestones]);

  return (
    <section
      id="journey"
      ref={containerRef}
      className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-16 scroll-mt-16 select-none"
    >
      {/* 1. CINEMATIC HEADLINE (Independent normal flow block with deliberate editorial breathing room) */}
      <div className="relative text-center max-w-3xl mx-auto mb-20 sm:mb-28">
        <h2 className="font-sans font-light text-5xl sm:text-7xl md:text-8xl tracking-tight text-white uppercase leading-[0.92]">
          The{' '}
          <span className="font-italic-serif text-white/90 lowercase tracking-normal">
            journey.
          </span>
        </h2>

        <p className="text-[#9a9a9a] text-sm sm:text-base mt-4 font-sans font-light leading-relaxed max-w-xl mx-auto">
          From the initial commit to an evolving algorithmic library. Every step recorded in genuine chronological sequence.
        </p>
      </div>

      {/* 2. DEDICATED TIMELINE WRAPPER (Vertical line belongs strictly inside this wrapper) */}
      <div ref={timelineWrapperRef} className="relative">
        {/* Dynamic Continuous Track Line starting at the first milestone pin node and extending to terminal node */}
        <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 top-3 bottom-24 w-[1px] bg-white/10 pointer-events-none" />
        <div
          ref={trackLineRef}
          className="absolute left-4 sm:left-1/2 -translate-x-1/2 top-3 bottom-24 w-[1px] bg-gradient-to-b from-white via-white/90 to-white/30 shadow-[0_0_10px_rgba(255,255,255,0.7)] pointer-events-none"
        />

        {/* PROGRESSIVELY DRAWN VERTICAL TIMELINE MILESTONES */}
        <div className="relative space-y-16 sm:space-y-24">
          {milestones.map((m, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div
                key={m.id}
                className={`milestone-row-${m.id} relative flex flex-col sm:flex-row items-start ${
                  isEven ? 'sm:flex-row-reverse' : ''
                } gap-6 sm:gap-12 pl-10 sm:pl-0`}
              >
                {/* Center Node Pin (○ Inactive by default, illuminates to ● on scroll arrival) */}
                <div
                  className={`milestone-pin-${m.id} absolute left-4 sm:left-1/2 -translate-x-1/2 top-2 w-5 h-5 rounded-full bg-black border border-white/25 flex items-center justify-center z-10 transition-colors duration-300`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                </div>

                {/* Content Box (Reveals progressively) */}
                <div
                  className={`milestone-card-${m.id} relative overflow-hidden group w-full sm:w-[calc(50%-2rem)] cinematic-panel p-5 sm:p-7 rounded-2xl border border-white/10 opacity-0 ${
                    isEven ? 'sm:text-right' : 'sm:text-left'
                  }`}
                >
                  {/* Directional Progress Pattern: Texture 03 (Ink Splash) */}
                  <AsciiImageTexture
                    texture="texture-03"
                    crop={isEven ? 'top-right' : 'top-left'}
                    fade={isEven ? 'to-l' : 'to-r'}
                    dotSpacing={5.8}
                    density={1.10}
                    detail={1.25}
                    contrast={1.42}
                    opacity={0.36}
                    hoverOpacity={0.62}
                  />

                  <div className="relative z-10">
                    <div
                      className={`flex items-center gap-2 mb-2 ${
                        isEven ? 'sm:justify-end' : 'sm:justify-start'
                      }`}
                    >
                      <span className="font-mono text-[10px] text-[#6f6f6f] uppercase tracking-widest">
                        {m.phase}
                      </span>
                      <span className="text-white/20">&bull;</span>
                      <span className="font-mono text-[10px] text-[#9a9a9a]">{m.date}</span>
                    </div>

                    <h3 className="font-sans text-xl sm:text-2xl font-semibold text-white tracking-tight mb-2">
                      {m.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#9a9a9a] font-sans leading-relaxed mb-4">
                      {m.description}
                    </p>

                    <div
                      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded bg-white/[0.04] border border-white/10 text-xs font-mono text-white ${
                        isEven ? 'sm:float-right' : 'sm:float-left'
                      }`}
                    >
                      {m.icon}
                      <span>{m.metric}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* 3. JOURNEY -> CONSISTENCY TRANSITION BRIDGE (TIME -> CONSISTENCY)          */}
        {/* Line reaches NOW, then expands HORIZONTALLY into the contribution heatmap */}
        {/* ========================================================================= */}
        <div className="journey-consistency-bridge w-full flex flex-col items-center pt-20 pb-4 select-none">
          {/* Terminal "NOW" Node */}
          <div className="bridge-now-node flex items-center gap-2 mb-3 px-3 py-1 rounded-full border border-white/30 bg-black text-white font-mono text-xs shadow-[0_0_12px_rgba(255,255,255,0.35)]">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span>NOW &bull; LIVE ARCHIVE</span>
          </div>

          {/* Horizontal Baseline Expansion Line (scaleX: 0 -> 1) */}
          <div className="w-full max-w-3xl h-[1px] relative overflow-hidden my-3">
            <div
              ref={horizontalExpandRef}
              className="w-full h-full bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_10px_white]"
            />
          </div>

          {/* Editorial Subtitle */}
          <div className="bridge-consistency-label text-center mt-1">
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#6f6f6f] block mb-1">
              TIME &bull; CONSISTENCY
            </span>
            <p className="font-sans text-xs text-[#9a9a9a]">
              Timeline unfolds horizontally into the annual activity matrix
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
