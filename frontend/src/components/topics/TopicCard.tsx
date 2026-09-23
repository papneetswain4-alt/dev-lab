import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers } from 'lucide-react';
import type { Topic } from '../../types/dsa';

interface TopicCardProps {
  topic: Topic;
}

export const TopicCard: React.FC<TopicCardProps> = ({ topic }) => {
  return (
    <Link
      to={`/topics/${topic.slug}`}
      className="liquid-glass rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:border-white/25 group focus:outline-none focus-visible:ring-1 focus-visible:ring-neon-accent"
      aria-label={`Explore topic ${topic.name} with ${topic.problemCount} problems`}
    >
      <div>
        {/* Top meta row */}
        <div className="flex items-center justify-between gap-2 mb-5">
          <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-muted-foreground group-hover:text-neon-accent group-hover:border-neon-accent/30 transition-colors">
            <Layers size={18} />
          </div>
          <span className="font-mono text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-muted-foreground group-hover:text-foreground transition-colors">
            {topic.problemCount} {topic.problemCount === 1 ? 'problem' : 'problems'}
          </span>
        </div>

        {/* Topic Name */}
        <h3 className="font-sans text-xl sm:text-2xl font-bold tracking-tight text-foreground uppercase group-hover:text-neon-accent transition-colors duration-200">
          {topic.name}
        </h3>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-muted-foreground mt-2 font-body leading-relaxed">
          Problems using this pattern
        </p>
      </div>

      {/* Action footer */}
      <div className="flex items-center justify-between pt-5 mt-6 border-t border-white/5 text-xs font-mono tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">
        <span className="text-neon-accent font-semibold">EXPLORE</span>
        <ArrowRight size={14} className="text-neon-accent group-hover:translate-x-1.5 transition-transform" />
      </div>
    </Link>
  );
};
