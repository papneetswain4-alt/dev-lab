import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers } from 'lucide-react';
import type { Topic } from '../../types/dsa';

interface TopicsPreviewProps {
  topics: Topic[];
}

export const TopicsPreview: React.FC<TopicsPreviewProps> = ({ topics }) => {
  // Sort topics by problem count descending to showcase primary focus areas
  const prominentTopics = [...topics]
    .sort((a, b) => b.problemCount - a.problemCount)
    .slice(0, 8);

  return (
    <section id="topics" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 scroll-mt-20">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="font-mono text-xs text-neon-accent tracking-widest uppercase">
              PATTERNS
            </span>
            <span className="text-white/20">•</span>
            <span className="font-mono text-xs px-2.5 py-0.5 rounded-full liquid-glass text-muted-foreground border border-white/10">
              {topics.length} core topics
            </span>
          </div>

          <h2 className="font-display text-4xl sm:text-6xl text-foreground tracking-tight">
            What I Keep Coming Back To.
          </h2>

          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mt-4 leading-relaxed font-body">
            The patterns, data structures, and algorithmic techniques that shape how I approach problem solving.
          </p>
        </div>

        {/* Desktop Direct Link */}
        <Link
          to="/topics"
          className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-neon-accent transition-colors group"
        >
          <span>View all topics</span>
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {prominentTopics.map((topic) => (
          <Link
            key={topic.slug}
            to={`/topics/${topic.slug}`}
            className="liquid-glass rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:border-white/25 group cursor-pointer"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-muted-foreground group-hover:text-neon-accent group-hover:border-neon-accent/30 transition-colors">
                  <Layers size={18} />
                </div>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-muted-foreground group-hover:text-foreground">
                  {topic.problemCount} {topic.problemCount === 1 ? 'problem' : 'problems'}
                </span>
              </div>

              <h3 className="font-sans text-lg font-semibold text-foreground group-hover:text-neon-accent transition-colors">
                {topic.name}
              </h3>
            </div>

            <div className="flex items-center justify-between pt-4 mt-6 border-t border-white/5 text-xs text-muted-foreground group-hover:text-foreground transition-colors">
              <span>Explore problems</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform text-neon-accent" />
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-12 text-center">
        <Link
          to="/topics"
          className="liquid-glass rounded-full px-8 py-4 text-sm font-medium tracking-wider text-foreground hover:scale-[1.03] active:scale-[0.98] transition-transform inline-flex items-center gap-2 group cursor-pointer"
        >
          <span>EXPLORE ALL TOPICS</span>
          <ArrowRight size={16} className="text-neon-accent group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
};
