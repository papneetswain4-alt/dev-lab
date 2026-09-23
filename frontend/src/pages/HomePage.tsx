import React, { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { HeroSection } from '../components/home/HeroSection';
import { ProblemsPreview } from '../components/home/ProblemsPreview';
import { TopicsPreview } from '../components/home/TopicsPreview';
import { JourneySection } from '../components/home/JourneySection';
import { GitHubSection } from '../components/home/GitHubSection';
import { HomeFooter } from '../components/home/HomeFooter';
import { getProblems, getTopics, getSummary } from '../services/repository';

export const HomePage: React.FC = () => {
  const location = useLocation();

  // Load static repository datasets from service
  const problems = useMemo(() => getProblems(), []);
  const topics = useMemo(() => getTopics(), []);
  const summary = useMemo(() => getSummary(), []);

  // Handle hash scrolling on navigation/load
  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.replace('#', '');
      const el = document.getElementById(targetId);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location.hash]);

  const handleBeginJourney = () => {
    const el = document.getElementById('problems');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col">
      {/* 1. Cinematic Hero */}
      <HeroSection onBeginJourney={handleBeginJourney} />

      {/* 2. Problems Preview (Curated 6 Recent Problems) */}
      <ProblemsPreview problems={problems} />

      {/* 3. Topics Preview (Core Patterns & Counts) */}
      <TopicsPreview topics={topics} />

      {/* 4. Journey Statistics & Activity Strip */}
      <JourneySection summary={summary} topicCount={topics.length} />

      {/* 5. Open Source & GitHub Repository */}
      <GitHubSection />

      {/* 6. Minimal Footer */}
      <HomeFooter />
    </div>
  );
};
