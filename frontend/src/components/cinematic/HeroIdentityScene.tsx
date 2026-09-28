import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown } from 'lucide-react';
import type { Summary } from '../../types/dsa';
import { asciiMorphProgress, resetAsciiMorphProgress } from '../../services/asciiBackgroundController';

gsap.registerPlugin(ScrollTrigger);

interface HeroIdentitySceneProps {
  summary: Summary;
  onExplore: () => void;
}

export const HeroIdentityScene: React.FC<HeroIdentitySceneProps> = ({ summary: _summary, onExplore }) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const pinContainerRef = useRef<HTMLDivElement>(null);

  // Hero refs
  const heroGroupRef = useRef<HTMLDivElement>(null);
  const theRef = useRef<HTMLSpanElement>(null);
  const codeRef = useRef<HTMLSpanElement>(null);
  const becomesRef = useRef<HTMLSpanElement>(null);
  const storyRef = useRef<HTMLSpanElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);

  // Identity refs (occupying the exact same center space)
  const identityGroupRef = useRef<HTMLDivElement>(null);
  const buildWordRef = useRef<HTMLDivElement>(null);
  const solveWordRef = useRef<HTMLDivElement>(null);
  const learnWordRef = useRef<HTMLDivElement>(null);
  const repeatWordRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      // 1. Initial entrance animation for the Hero on first load
      const introTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      introTl
        .fromTo(
          [theRef.current, codeRef.current, becomesRef.current, storyRef.current],
          { opacity: 0, y: 35, filter: 'blur(6px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.0, stagger: 0.1, delay: 0.1 }
        )
        .fromTo(
          scrollCueRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.6 },
          '-=0.4'
        );

      // 2. Master Pinned Scrub Timeline: Hero -> Dispersal -> Center Clears -> BUILD -> SOLVE -> LEARN -> REPEAT -> Return to SPACE
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: stageRef.current,
          start: 'top top',
          end: '+=380%',
          pin: pinContainerRef.current,
          scrub: 0.9,
          anticipatePin: 1,
        },
      });

      // TIMELINE MAP (0 to 10 total timeline duration):
      // 0.0 -> 1.8: Hero disperses and completely clears out
      masterTl
        .fromTo(theRef.current, { y: 0, opacity: 1 }, { y: -180, opacity: 0, ease: 'power2.inOut', duration: 1.6 }, 0)
        .fromTo(codeRef.current, { scale: 1, opacity: 1, filter: 'blur(0px)' }, { scale: 1.35, opacity: 0, filter: 'blur(6px)', ease: 'power2.inOut', duration: 1.6 }, 0)
        .fromTo(becomesRef.current, { x: 0, opacity: 1 }, { x: 220, opacity: 0, ease: 'power2.inOut', duration: 1.6 }, 0)
        .fromTo(storyRef.current, { y: 0, opacity: 1 }, { y: 180, opacity: 0, ease: 'power2.inOut', duration: 1.6 }, 0)
        .fromTo(scrollCueRef.current, { opacity: 1, y: 0 }, { opacity: 0, y: 20, ease: 'power2.inOut', duration: 1 }, 0)
        .fromTo(heroGroupRef.current, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.3 }, 1.7);

      // 3. Scroll-Controlled Live Dot ASCII Morph Sequence
      // 0.0 -> 1.6: SPACE (Hero atmosphere)
      // 1.6 -> 2.6: SPACE -> FLOWER (As BUILD emerges)
      // 3.4 -> 4.4: FLOWER -> PERSON (As SOLVE emerges)
      // 5.1 -> 6.1: PERSON -> WATER (As LEARN emerges)
      // 6.8 -> 7.8: WATER -> LANDSCAPE (As REPEAT emerges)
      // 7.8 -> 8.6: LANDSCAPE (Living mountain presence during REPEAT)
      // 8.6 -> 9.6: LANDSCAPE -> SPACE (Smoothly returns to persistent SPACE default as REPEAT dissolves)
      masterTl
        .to(asciiMorphProgress, { current: 1.0, duration: 1.0, ease: 'power1.inOut' }, 1.6)
        .to(asciiMorphProgress, { current: 2.0, duration: 1.0, ease: 'power1.inOut' }, 3.4)
        .to(asciiMorphProgress, { current: 3.0, duration: 1.0, ease: 'power1.inOut' }, 5.1)
        .to(asciiMorphProgress, { current: 4.0, duration: 1.0, ease: 'power1.inOut' }, 6.8)
        .to(asciiMorphProgress, { current: 5.0, duration: 1.0, ease: 'power1.inOut' }, 8.6);

      // 1.8 -> 2.3: Pure Empty Center (No overlap!)
      masterTl.to(identityGroupRef.current, { autoAlpha: 1, duration: 0.3 }, 2.0);

      // 2.3 -> 3.8: BUILD emerges in center, then dissolves
      masterTl
        .fromTo(
          buildWordRef.current,
          { opacity: 0, scale: 0.88, filter: 'blur(6px)', letterSpacing: '0.04em' },
          { opacity: 1, scale: 1, filter: 'blur(0px)', letterSpacing: '0.12em', duration: 0.7, ease: 'power2.out' },
          2.3
        )
        .to(
          buildWordRef.current,
          { opacity: 0, scale: 1.12, filter: 'blur(6px)', letterSpacing: '0.18em', duration: 0.5, ease: 'power2.in' },
          3.6
        );

      // 4.0 -> 5.5: SOLVE emerges in center, then dissolves
      masterTl
        .fromTo(
          solveWordRef.current,
          { opacity: 0, scale: 0.88, filter: 'blur(6px)', letterSpacing: '0.04em' },
          { opacity: 1, scale: 1, filter: 'blur(0px)', letterSpacing: '0.12em', duration: 0.7, ease: 'power2.out' },
          4.0
        )
        .to(
          solveWordRef.current,
          { opacity: 0, scale: 1.12, filter: 'blur(6px)', letterSpacing: '0.18em', duration: 0.5, ease: 'power2.in' },
          5.3
        );

      // 5.7 -> 7.2: LEARN emerges in center, then dissolves
      masterTl
        .fromTo(
          learnWordRef.current,
          { opacity: 0, scale: 0.88, filter: 'blur(6px)', letterSpacing: '0.04em' },
          { opacity: 1, scale: 1, filter: 'blur(0px)', letterSpacing: '0.12em', duration: 0.7, ease: 'power2.out' },
          5.7
        )
        .to(
          learnWordRef.current,
          { opacity: 0, scale: 1.12, filter: 'blur(6px)', letterSpacing: '0.18em', duration: 0.5, ease: 'power2.in' },
          7.0
        );

      // 7.4 -> 8.9: REPEAT emerges in center
      masterTl
        .fromTo(
          repeatWordRef.current,
          { opacity: 0, scale: 0.88, filter: 'blur(6px)', letterSpacing: '0.04em' },
          { opacity: 1, scale: 1, filter: 'blur(0px)', letterSpacing: '0.12em', duration: 0.7, ease: 'power2.out' },
          7.4
        );

      // 8.9 -> 10.0: REPEAT breaks apart and clears the stage before Chapter 03
      masterTl
        .to(
          repeatWordRef.current,
          {
            opacity: 0,
            scale: 1.25,
            letterSpacing: '0.35em',
            filter: 'blur(8px)',
            duration: 0.9,
            ease: 'power2.in',
          },
          8.9
        )
        .to(identityGroupRef.current, { autoAlpha: 0, duration: 0.2 }, 9.8);
    }, stageRef);

    return () => {
      ctx.revert();
      resetAsciiMorphProgress();
    };
  }, []);

  return (
    <div id="hero" ref={stageRef} className="relative w-full">
      {/* Pinned Viewport Container — True 100svh starting at top 0 */}
      <div
        ref={pinContainerRef}
        className="w-full h-[100svh] min-h-[100svh] relative flex items-center justify-center overflow-hidden select-none"
      >
        {/* ========================================================================= */}
        {/* 1. HERO VIEWPORT LAYER                                                    */}
        {/* ========================================================================= */}
        <div
          ref={heroGroupRef}
          className="absolute inset-0 w-full h-full flex flex-col items-center justify-between text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto z-10 select-none pb-4 sm:pb-6"
        >
          {/* Top spacer for navbar clearance */}
          <div className="w-full h-12 sm:h-16 shrink-0" />

          {/* Center Zone: Hero Editorial Display Headline */}
          <div className="flex-1 flex flex-col justify-center items-center w-full max-w-5xl px-2 sm:px-4 min-h-0">
            <h1 className="hero-headline text-white font-sans font-light uppercase max-w-5xl mx-auto">
              <span ref={theRef} className="block overflow-visible transform-gpu py-0.5">
                THE
              </span>
              <span
                ref={codeRef}
                className="block font-italic-serif text-white font-normal lowercase tracking-normal transform-gpu py-0.5 text-[1.08em]"
              >
                code
              </span>
              <span ref={becomesRef} className="block overflow-visible transform-gpu py-0.5">
                BECOMES
              </span>
              <span
                ref={storyRef}
                className="block font-italic-serif text-white font-normal lowercase tracking-normal transform-gpu py-0.5 text-[1.08em] whitespace-nowrap"
              >
                the story.
              </span>
            </h1>
          </div>

          {/* Bottom Zone: Anchored Scroll Cue */}
          <div className="w-full flex justify-center shrink-0">
            <div
              ref={scrollCueRef}
              className="flex flex-col items-center gap-1.5 cursor-pointer group"
              onClick={onExplore}
            >
              <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.25em] text-[#8a8a8a] uppercase group-hover:text-white transition-colors">
                SCROLL TO CONTROL TIMELINE
              </span>
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-white/20 flex items-center justify-center text-white/70 group-hover:text-white group-hover:border-white/50 transition-all">
                <ArrowDown size={12} className="animate-bounce" />
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. IDENTITY TRANSFORMATION LAYER (Occupying the EXACT same visual center)  */}
        {/* ========================================================================= */}
        <div
          id="identity"
          ref={identityGroupRef}
          className="absolute inset-0 w-full h-full flex items-center justify-center text-center px-4 pointer-events-none opacity-0 z-20"
        >
          {/* Central Word Morph Stage (Single unified container) */}
          <div className="relative w-full max-w-4xl h-44 sm:h-56 md:h-64 flex items-center justify-center min-h-0">
            {/* 1. BUILD */}
            <div
              ref={buildWordRef}
              className="absolute inset-0 flex items-center justify-center opacity-0 transform-gpu"
            >
              <span className="font-sans text-6xl sm:text-8xl md:text-9xl font-bold tracking-tight text-white uppercase">
                BUILD
              </span>
            </div>

            {/* 2. SOLVE */}
            <div
              ref={solveWordRef}
              className="absolute inset-0 flex items-center justify-center opacity-0 transform-gpu"
            >
              <span className="font-sans text-6xl sm:text-8xl md:text-9xl font-bold tracking-tight text-white uppercase">
                SOLVE
              </span>
            </div>

            {/* 3. LEARN */}
            <div
              ref={learnWordRef}
              className="absolute inset-0 flex items-center justify-center opacity-0 transform-gpu"
            >
              <span className="font-sans text-6xl sm:text-8xl md:text-9xl font-bold tracking-tight text-white uppercase">
                LEARN
              </span>
            </div>

            {/* 4. REPEAT */}
            <div
              ref={repeatWordRef}
              className="absolute inset-0 flex items-center justify-center opacity-0 transform-gpu"
            >
              <span className="font-sans text-6xl sm:text-8xl md:text-9xl font-bold tracking-tight text-white uppercase">
                REPEAT
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
