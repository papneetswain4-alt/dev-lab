import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Code2 } from 'lucide-react';
import type { Problem } from '../../types/dsa';

interface ProblemCardProps {
  problem: Problem;
}

export const ProblemCard: React.FC<ProblemCardProps> = ({ problem }) => {
  const getDifficultyBadge = (difficulty: Problem['difficulty']) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-[#00B8A3] bg-[#00B8A3]/10 border-[#00B8A3]/30';
      case 'Medium':
        return 'text-[#FFC01E] bg-[#FFC01E]/10 border-[#FFC01E]/30';
      case 'Hard':
        return 'text-[#FF375F] bg-[#FF375F]/10 border-[#FF375F]/30';
      default:
        return 'text-muted-foreground bg-white/5 border-white/10';
    }
  };

  const displayedTopics = (problem.topics || []).slice(0, 3);
  const remainingTopicsCount = (problem.topics || []).length - displayedTopics.length;
  const formattedId = `#${String(problem.frontendId || problem.id).padStart(4, '0')}`;

  return (
    <article className="liquid-glass rounded-2xl p-6 h-full flex flex-col justify-between transition-all duration-300 hover:scale-[1.015] hover:border-white/20 group">
      {/* Main card content link (No nested anchor tags) */}
      <Link
        to={`/problems/${problem.slug}`}
        className="flex-1 flex flex-col focus:outline-none focus-visible:ring-1 focus-visible:ring-neon-accent rounded-xl text-left"
        aria-label={`View details for ${problem.title}`}
      >
        {/* Header row: ID & Difficulty badge */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="font-mono text-xs tracking-wider text-muted-foreground group-hover:text-foreground/90 transition-colors">
            {formattedId}
          </span>
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full font-medium border uppercase tracking-wider ${getDifficultyBadge(
              problem.difficulty
            )}`}
          >
            {problem.difficulty}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-sans text-xl font-semibold text-foreground group-hover:text-neon-accent transition-colors duration-200 line-clamp-2">
          {problem.title}
        </h3>

        {/* Topics tags */}
        {displayedTopics.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mt-4">
            {displayedTopics.map((topic) => (
              <span
                key={topic}
                className="text-xs px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/10 text-muted-foreground group-hover:border-white/20 transition-colors"
              >
                {topic}
              </span>
            ))}
            {remainingTopicsCount > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-md bg-white/[0.02] border border-white/5 text-muted-foreground/70 font-mono">
                +{remainingTopicsCount}
              </span>
            )}
          </div>
        )}
      </Link>

      {/* Footer (completely outside main Link) */}
      <div className="flex items-center justify-between pt-5 mt-6 border-t border-white/5 text-xs text-muted-foreground">
        <Link
          to={`/problems/${problem.slug}`}
          className="flex items-center gap-1.5 hover:text-foreground transition-colors py-1 focus:outline-none focus:ring-1 focus:ring-neon-accent rounded"
        >
          <Code2 size={14} className="text-neon-accent/80" />
          <span>{problem.languages?.join(', ') || 'Java'}</span>
        </Link>

        {problem.leetcodeUrl && (
          <a
            href={problem.leetcodeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors p-1 -m-1 rounded focus:outline-none focus:ring-1 focus:ring-neon-accent cursor-pointer"
            aria-label={`View ${problem.title} on LeetCode`}
          >
            <span>LeetCode</span>
            <ExternalLink size={12} />
          </a>
        )}
      </div>
    </article>
  );
};
