import React from 'react';
import { ChevronDown } from 'lucide-react';

interface HeroSectionProps {
  onBeginJourney: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onBeginJourney }) => {
  return (
    <section className="relative min-h-[calc(100vh-90px)] w-full flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-16 sm:py-24 max-w-7xl mx-auto">
      {/* Subtle Accent Phrase */}
      <p className="font-accent text-neon-accent text-xl sm:text-2xl mb-4 tracking-wide select-none">
        one problem at a time
      </p>

      {/* Main Display Heading */}
      <h1 className="font-display text-5xl sm:text-7xl md:text-8xl leading-[0.95] tracking-[-2.46px] max-w-5xl mx-auto animate-fade-rise">
        <span className="text-foreground">Where </span>
        <span className="text-muted-foreground">logic</span>
        <br className="hidden sm:inline" />
        <span className="text-foreground"> meets </span>
        <span className="text-muted-foreground">persistence.</span>
      </h1>

      {/* Supporting Narrative */}
      <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mt-8 leading-relaxed font-body animate-fade-rise-delay">
        A visual record of every problem solved, pattern discovered, and
        solution written along my DSA journey.
      </p>

      {/* Hero CTA Button */}
      <div className="mt-12 animate-fade-rise-delay-2">
        <button
          onClick={onBeginJourney}
          className="liquid-glass rounded-full px-14 py-5 text-base tracking-wider text-foreground font-medium transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer inline-flex items-center gap-2 group"
        >
          <span>BEGIN JOURNEY</span>
          <ChevronDown
            size={18}
            className="text-neon-accent group-hover:translate-y-0.5 transition-transform"
          />
        </button>
      </div>

      {/* Subtle Scroll Cue */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-muted-foreground/50 text-xs tracking-widest font-mono uppercase flex items-center gap-1.5 select-none pointer-events-none">
        <span>Scroll to explore</span>
      </div>
    </section>
  );
};
