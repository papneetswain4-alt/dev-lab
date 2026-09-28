import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Layers, ArrowUpRight } from 'lucide-react';
import type { Topic } from '../../types/dsa';
import { AsciiImageTexture } from './AsciiImageTexture';

gsap.registerPlugin(ScrollTrigger);

interface TopicsCinematicSceneProps {
  topics: Topic[];
}

export const TopicsCinematicScene: React.FC<TopicsCinematicSceneProps> = ({ topics }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const matrixRef = useRef<HTMLDivElement>(null);
  const inspectorRef = useRef<HTMLDivElement>(null);
  const bridgeLineRef = useRef<HTMLDivElement>(null);

  const [activeTopicSlug, setActiveTopicSlug] = useState<string>(() => {
    return topics.length > 0 ? topics[0].slug : '';
  });

  // Sort topics by problem count descending
  const sortedTopics = useMemo(() => {
    return [...topics].sort((a, b) => b.problemCount - a.problemCount);
  }, [topics]);

  const activeTopic = useMemo(() => {
    return sortedTopics.find((t) => t.slug === activeTopicSlug) || sortedTopics[0];
  }, [sortedTopics, activeTopicSlug]);

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      // 1. Matrix Progressive Assembly on scroll
      gsap.fromTo(
        '.topic-matrix-node',
        { opacity: 0, scale: 0.9, y: 20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          stagger: 0.04,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: matrixRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // 2. Inspector panel appearance
      gsap.fromTo(
        inspectorRef.current,
        { opacity: 0, x: 30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: matrixRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // 3. TOPICS -> JOURNEY TRANSITION BRIDGE (KNOWLEDGE -> TIME)
      // As topics matrix scrolls through bottom:
      // topic nodes collapse, and ONE vertical line remains down the center to start the Journey timeline
      const bridgeTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.topics-journey-bridge',
          start: 'top 85%',
          end: 'bottom 40%',
          scrub: 1,
        },
      });

      bridgeTl
        .fromTo(
          '.bridge-label',
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.4 }
        )
        .fromTo(
          bridgeLineRef.current,
          { scaleY: 0 },
          { scaleY: 1, transformOrigin: 'top center', duration: 1, ease: 'none' }
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="topics"
      ref={containerRef}
      className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-36 scroll-mt-16"
    >
      {/* 1. CINEMATIC HEADLINE */}
      <div className="mb-16 sm:mb-20">
        <h2 className="font-sans font-light text-5xl sm:text-7xl md:text-8xl tracking-tight text-white uppercase leading-[0.92] max-w-4xl">
          From problems{' '}
          <br className="hidden sm:inline" />
          to{' '}
          <span className="font-italic-serif text-white/90 lowercase tracking-normal">
            patterns.
          </span>
        </h2>

        <p className="text-[#9a9a9a] text-sm sm:text-base md:text-lg max-w-2xl mt-8 font-sans font-light leading-relaxed">
          Algorithmic problems are variations of core invariants. Each solution reinforces a reusable mental model across memory layout, traversal strategies, and optimization bounds.
        </p>
      </div>

      {/* 2. KNOWLEDGE MAP & INTERACTIVE INSPECTION MATRIX */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Assembling Topic Matrix */}
        <div
          ref={matrixRef}
          className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3"
        >
          {sortedTopics.slice(0, 15).map((topic, index) => {
            const isSelected = activeTopic?.slug === topic.slug;
            return (
              <div
                key={topic.slug}
                onClick={() => setActiveTopicSlug(topic.slug)}
                className={`topic-matrix-node relative overflow-hidden group p-3.5 sm:p-4 rounded-xl border transition-all duration-300 cursor-pointer select-none flex flex-col justify-between min-h-[96px] ${
                  isSelected
                    ? 'bg-white/[0.09] border-white/50 shadow-[0_0_24px_rgba(255,255,255,0.08)] scale-[1.02] z-10'
                    : 'bg-black/50 border-white/10 hover:border-white/25 hover:bg-white/[0.02] opacity-80 hover:opacity-100'
                }`}
              >
                <AsciiImageTexture
                  texture={index % 2 === 0 ? 'texture-01' : 'texture-04'}
                  crop="center"
                  fade="corner-tr"
                  dotSpacing={5.8}
                  density={1.05}
                  detail={1.10}
                  opacity={isSelected ? 0.38 : 0.22}
                  hoverOpacity={0.46}
                />

                <div className="relative z-10 flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="font-mono text-[10px] text-[#6f6f6f]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span
                      className={`font-mono text-[10px] px-1.5 py-0.2 rounded ${
                        isSelected
                          ? 'bg-white text-black font-semibold'
                          : 'text-[#9a9a9a] bg-white/5'
                      }`}
                    >
                      {topic.problemCount}
                    </span>
                  </div>

                  <div className="flex items-end justify-between gap-2 mt-auto">
                    <h3
                      className={`font-sans text-xs sm:text-sm font-medium tracking-tight transition-colors line-clamp-1 ${
                        isSelected ? 'text-white font-semibold' : 'text-[#c0c0c0] group-hover:text-white'
                      }`}
                    >
                      {topic.name}
                    </h3>
                    <ArrowRight
                      size={11}
                      className={`shrink-0 transition-transform ${
                        isSelected
                          ? 'text-white translate-x-0.5'
                          : 'text-[#6f6f6f] group-hover:text-white group-hover:translate-x-0.5'
                      }`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Active Topic Detail Inspector (organically integrated) */}
        {activeTopic && (
          <div
            ref={inspectorRef}
            className="relative overflow-hidden group lg:col-span-4 cinematic-panel p-6 rounded-2xl border border-white/15 sticky top-24"
          >
            <AsciiImageTexture
              texture="texture-01"
              crop="top-right"
              fade="radial"
              dotSpacing={5.8}
              density={1.08}
              detail={1.15}
              contrast={1.38}
              opacity={0.36}
              hoverOpacity={0.60}
            />

            <div className="relative z-10">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2">
                  <Layers size={14} className="text-[#9a9a9a]" />
                  <span className="font-mono text-[11px] uppercase tracking-widest text-[#9a9a9a]">
                    ACTIVE PATTERN
                  </span>
                </div>
                <span className="font-mono text-xs text-white px-2 py-0.5 rounded bg-white/10 border border-white/15">
                  {activeTopic.problemCount} {activeTopic.problemCount === 1 ? 'Problem' : 'Problems'}
                </span>
              </div>

              <h3 className="font-sans text-2xl font-bold text-white tracking-tight mb-2">
                {activeTopic.name}
              </h3>

              <p className="text-xs text-[#9a9a9a] leading-relaxed mb-6 font-mono">
                Pattern invariant cataloged under {activeTopic.name}. All verified Java solutions indexed in the Dev.Lab repository.
              </p>

              {/* Linked problems preview */}
              <div className="space-y-2 mb-6 max-h-48 overflow-y-auto pr-1">
                <span className="text-[10px] font-mono tracking-widest uppercase text-[#6f6f6f] block mb-2">
                  LINKED PROBLEMS ({activeTopic.problems?.length || activeTopic.problemCount})
                </span>
                {activeTopic.problems?.slice(0, 5).map((pName) => (
                  <div
                    key={pName}
                    className="p-2 rounded bg-black/50 border border-white/5 text-[11px] font-mono text-[#c0c0c0] truncate flex items-center justify-between"
                  >
                    <span className="truncate">{pName}</span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
                <Link
                  to={`/topics/${activeTopic.slug}`}
                  className="metallic-btn-primary py-2 px-3 text-xs font-mono tracking-wider uppercase text-center flex items-center justify-center gap-1.5"
                >
                  <span>Explore {activeTopic.name} Details</span>
                  <ArrowRight size={13} />
                </Link>

                <Link
                  to={`/problems?topic=${encodeURIComponent(activeTopic.name)}`}
                  className="metallic-btn py-2 px-3 text-xs font-mono tracking-wider uppercase text-center flex items-center justify-center gap-1.5 text-[#9a9a9a] hover:text-white"
                >
                  <span>Filter In Archive</span>
                  <ArrowUpRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. TOPICS -> JOURNEY TRANSITION BRIDGE (KNOWLEDGE -> TIME)                 */}
      {/* Connecting coordinate lines collapse into ONE vertical timeline line       */}
      {/* ========================================================================= */}
      <div className="topics-journey-bridge w-full flex flex-col items-center pt-24 pb-8 select-none">
        <div className="bridge-label text-center mb-6">
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#6f6f6f] block mb-1">
            KNOWLEDGE &bull; TIME
          </span>
          <p className="font-sans text-xs text-[#9a9a9a]">
            Patterns synthesize into a chronological timeline
          </p>
        </div>

        {/* The Clean Center Line that concludes the knowledge section */}
        <div className="flex flex-col items-center">
          <div className="w-[1px] h-20 relative overflow-hidden bg-white/10">
            <div
              ref={bridgeLineRef}
              className="w-full h-full bg-gradient-to-b from-white via-white/80 to-white/30 shadow-[0_0_8px_white]"
            />
          </div>
          <span className="w-1.5 h-1.5 rounded-full bg-white/40 mt-1" />
        </div>
      </div>
    </section>
  );
};
