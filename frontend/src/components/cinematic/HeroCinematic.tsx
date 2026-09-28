import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, Terminal } from 'lucide-react';
import type { Summary } from '../../types/dsa';

gsap.registerPlugin(ScrollTrigger);

interface HeroCinematicProps {
  summary: Summary;
  onExplore: () => void;
}

export const HeroCinematic: React.FC<HeroCinematicProps> = ({ summary, onExplore }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      // 1. Initial staged entrance animation on load
      const tlIntro = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tlIntro
        .fromTo(
          eyebrowRef.current,
          { opacity: 0, y: -16 },
          { opacity: 1, y: 0, duration: 1, delay: 0.1 }
        )
        .fromTo(
          '.hero-line',
          { opacity: 0, y: 40, filter: 'blur(8px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.2, stagger: 0.15 },
          '-=0.7'
        )
        .fromTo(
          subtextRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1 },
          '-=0.8'
        )
        .fromTo(
          metricsRef.current,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 1 },
          '-=0.8'
        )
        .fromTo(
          scrollCueRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.8 },
          '-=0.5'
        );

      // 2. Scroll-driven cinematic transformation (SCRUB = TIMELINE)
      // As user scrolls down, typography scales, separates spatially, and drifts into depth
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      scrollTl
        .to(headlineRef.current, {
          y: -120,
          scale: 0.94,
          opacity: 0.25,
          filter: 'blur(6px)',
          ease: 'none',
        })
        .to(
          subtextRef.current,
          {
            y: -80,
            opacity: 0,
            filter: 'blur(4px)',
            ease: 'none',
          },
          0
        )
        .to(
          metricsRef.current,
          {
            y: -60,
            opacity: 0.1,
            ease: 'none',
          },
          0
        )
        .to(
          scrollCueRef.current,
          {
            opacity: 0,
            y: 20,
            ease: 'none',
          },
          0
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-[92vh] sm:min-h-screen w-full flex flex-col items-center justify-between text-center px-4 sm:px-6 lg:px-8 pt-20 pb-12 max-w-6xl mx-auto select-none"
    >
      {/* Small Eyebrow */}
      <div
        ref={eyebrowRef}
        className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md text-[11px] font-mono tracking-widest text-[#9a9a9a] uppercase mt-4 sm:mt-8"
      >
        <Terminal size={12} className="text-white/80" />
        <span>DEV.LAB / SYSTEM 01</span>
        <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse" />
      </div>

      {/* Hero Headline - Editorial Typography */}
      <div className="my-auto py-8 sm:py-12 max-w-5xl">
        <h1
          ref={headlineRef}
          className="text-white font-sans font-light tracking-[-0.03em] leading-[0.92] text-5xl sm:text-7xl md:text-8xl lg:text-9xl uppercase"
        >
          <div className="hero-line block overflow-hidden">
            <span className="block">THE</span>
          </div>
          <div className="hero-line block overflow-hidden">
            <span className="block font-italic-serif text-white font-normal lowercase tracking-normal">
              code
            </span>
          </div>
          <div className="hero-line block overflow-hidden">
            <span className="block">BECOMES</span>
          </div>
          <div className="hero-line block overflow-hidden">
            <span className="block font-italic-serif text-white font-normal lowercase tracking-normal">
              the story.
            </span>
          </div>
        </h1>

        {/* Supporting Editorial Statement */}
        <p
          ref={subtextRef}
          className="text-[#9a9a9a] text-sm sm:text-base md:text-lg max-w-xl mx-auto mt-8 sm:mt-10 font-sans font-light leading-relaxed px-4"
        >
          A cinematic operating system recording every algorithmic challenge conquered, pattern discovered, and Java solution written.
        </p>

        {/* Live Metrics Composed Harmoniously (No cards, pure editorial composition) */}
        <div
          ref={metricsRef}
          className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs font-mono text-[#6f6f6f] border-t border-white/10 pt-6 max-w-2xl mx-auto"
        >
          <div className="flex items-baseline gap-2">
            <span className="text-white text-lg sm:text-xl font-sans font-medium">
              {summary.total}+
            </span>
            <span className="tracking-widest uppercase">PROBLEMS SOLVED</span>
          </div>

          <span className="text-white/20 hidden sm:inline">&bull;</span>

          <div className="flex items-baseline gap-2">
            <span className="text-white text-lg sm:text-xl font-sans font-medium">
              {summary.activeDays}
            </span>
            <span className="tracking-widest uppercase">ACTIVE DAYS</span>
          </div>

          <span className="text-white/20 hidden sm:inline">&bull;</span>

          <div className="flex items-baseline gap-2">
            <span className="text-white text-lg sm:text-xl font-sans font-medium">
              {summary.bestStreak} DAY
            </span>
            <span className="tracking-widest uppercase">BEST STREAK</span>
          </div>
        </div>
      </div>

      {/* Bottom Scroll Indicator Cue */}
      <div
        ref={scrollCueRef}
        className="flex flex-col items-center gap-2 cursor-pointer pb-4 group"
        onClick={onExplore}
      >
        <span className="font-mono text-[10px] tracking-[0.25em] text-[#6f6f6f] uppercase group-hover:text-white transition-colors">
          SCROLL TO ENTER SYSTEM
        </span>
        <div className="w-7 h-7 rounded-full border border-white/15 flex items-center justify-center text-[#9a9a9a] group-hover:text-white group-hover:border-white/40 transition-all">
          <ArrowDown size={13} className="animate-bounce" />
        </div>
      </div>
    </section>
  );
};
