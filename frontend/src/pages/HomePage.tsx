import React, { useMemo, useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HeroIdentityScene } from '../components/cinematic/HeroIdentityScene';
import { ProblemsCinematicScene } from '../components/cinematic/ProblemsCinematicScene';
import { TopicsCinematicScene } from '../components/cinematic/TopicsCinematicScene';
import { JourneyTimelineScene } from '../components/cinematic/JourneyTimelineScene';
import { ConsistencyScene } from '../components/cinematic/ConsistencyScene';
import { FinalCtaSection } from '../components/cinematic/FinalCtaSection';
import { getProblems, getTopics, getSummary } from '../services/repository';
import { scrollToTarget } from '../hooks/useLenis';

export const HomePage: React.FC = () => {
  // Load repository datasets from strongly-typed service
  const problems = useMemo(() => getProblems(), []);
  const topics = useMemo(() => getTopics(), []);
  const summary = useMemo(() => getSummary(), []);

  useEffect(() => {
    // Guarantee ScrollTrigger synchronizes with refreshed coordinate system
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  const handleExplore = () => {
    scrollToTarget('problems', { offset: -20 });
  };

  return (
    <div className="w-full flex-1 flex flex-col relative">
      {/* Chapters 01 & 02 — Hero Dispersion -> Central BUILD -> SOLVE -> LEARN -> REPEAT Pinned Sequence */}
      <HeroIdentityScene summary={summary} onExplore={handleExplore} />

      {/* Chapter 03 — Macro Number Shrink -> Problem Ticker -> Problems Grouping -> Explorer */}
      <ProblemsCinematicScene
        problems={problems}
        summary={summary}
        topics={topics}
      />

      {/* Chapter 04 — Assembling Topic Matrix -> Knowledge Map -> Knowledge-to-Time Bridge */}
      <TopicsCinematicScene topics={topics} />

      {/* Chapter 05 — Scroll-controlled Timeline -> Milestone Activation -> Time-to-Consistency Expansion */}
      <JourneyTimelineScene summary={summary} topicCount={topics.length} />

      {/* Chapter 06 — Scroll-scrubbed Counters -> Progressive Heatmap -> Archive Compression */}
      <ConsistencyScene summary={summary} />

      {/* Chapter 07 — DEV.LAB / ARCHIVE Technical Summary + Smooth Lenis Back to Top */}
      <FinalCtaSection />
    </div>
  );
};
