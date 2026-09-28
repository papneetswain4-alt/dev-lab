import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const WORDS = [
  { word: 'BUILD', subtitle: 'Structuring architectures and writing clean algorithms' },
  { word: 'SOLVE', subtitle: 'Tackling edge cases, complexity limits, and test inputs' },
  { word: 'LEARN', subtitle: 'Internalizing patterns, data structures, and invariants' },
  { word: 'REPEAT', subtitle: 'Unwavering daily consistency across the calendar' },
];

export const IdentityScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray<HTMLElement>('.identity-step');

      // Create a master scrubbed pinned timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=200%',
          pin: pinRef.current,
          scrub: 0.8,
          anticipatePin: 1,
        },
      });

      // Animate each word into focus and out
      words.forEach((el, i) => {
        if (i === 0) {
          tl.fromTo(
            el,
            { opacity: 0.2, scale: 0.95 },
            { opacity: 1, scale: 1, duration: 1 }
          );
        } else {
          // Fade previous step to subtle and bring current to 1
          tl.to(
            words[i - 1],
            { opacity: 0.15, scale: 0.95, filter: 'blur(2px)', duration: 0.8 },
            `step-${i}`
          ).fromTo(
            el,
            { opacity: 0.1, y: 30, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 1 },
            `step-${i}`
          );
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="identity"
      ref={containerRef}
      className="relative w-full min-h-screen select-none"
    >
      <div
        ref={pinRef}
        className="w-full h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center"
      >
        {/* Editorial Eyebrow */}
        <div className="mb-6 sm:mb-10">
          <h2 className="font-sans font-light text-2xl sm:text-3xl md:text-4xl text-white tracking-tight">
            A visual record of how I{' '}
            <span className="font-italic-serif text-white/90 lowercase">build, solve, and learn.</span>
          </h2>
        </div>

        {/* The Words: BUILD ↓ SOLVE ↓ LEARN ↓ REPEAT */}
        <div className="w-full flex flex-col items-center gap-4 sm:gap-6 my-auto max-w-3xl">
          {WORDS.map((item, idx) => (
            <div
              key={item.word}
              className="identity-step flex flex-col items-center transition-all duration-300"
            >
              <div className="flex items-center gap-4 sm:gap-8">
                <span className="font-sans text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight text-white uppercase">
                  {item.word}
                </span>
                {idx < WORDS.length - 1 && (
                  <span className="text-white/20 text-2xl hidden sm:inline">&darr;</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* System Philosophy Subtext */}
        <div className="mt-auto pb-8 sm:pb-12 text-[#6f6f6f] font-mono text-[11px] tracking-widest uppercase">
          Continuous Integration of Algorithmic Intuition
        </div>
      </div>
    </section>
  );
};
