import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Code2, ArrowRight } from 'lucide-react';
import type { Problem } from '../../types/dsa';
import { AsciiImageTexture } from '../cinematic/AsciiImageTexture';

interface ProblemCardProps {
  problem: Problem;
}

export const ProblemCard: React.FC<ProblemCardProps> = ({ problem }) => {
  const getDifficultyBadge = (difficulty: Problem['difficulty']) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-[#00B8A3] bg-[#00B8A3]/10 border-[#00B8A3]/25';
      case 'Medium':
        return 'text-[#FFC01E] bg-[#FFC01E]/10 border-[#FFC01E]/25';
      case 'Hard':
        return 'text-[#FF375F] bg-[#FF375F]/10 border-[#FF375F]/25';
      default:
        return 'text-[#9a9a9a] bg-white/5 border-white/10';
    }
  };

  const displayedTopics = (problem.topics || []).slice(0, 3);
  const remainingTopicsCount = (problem.topics || []).length - displayedTopics.length;
  const formattedId = `#${String(problem.frontendId || problem.id).padStart(4, '0')}`;
  const textureChoice = (Number(problem.frontendId || problem.id) % 2 === 0) ? 'texture-01' : 'texture-02';

  return (
    <article className="relative cinematic-panel p-5 sm:p-6 rounded-2xl flex flex-col justify-between transition-all duration-300 hover:border-white/30 hover:-translate-y-0.5 group overflow-hidden">
      {/* Decorative ASCII Halftone Texture */}
      <AsciiImageTexture
        texture={textureChoice}
        crop="center"
        fade="corner-tr"
        dotSpacing={5.8}
        density={1.05}
        detail={1.15}
        contrast={1.38}
        opacity={0.36}
        hoverOpacity={0.62}
      />

      {/* Main card content link */}
      <Link
        to={`/problems/${problem.slug}`}
        className="relative z-10 flex-1 flex flex-col focus:outline-none rounded-xl text-left"
        aria-label={`View details for ${problem.title}`}
      >
        {/* Header row: ID & Difficulty badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="font-mono text-xs text-[#6f6f6f] group-hover:text-[#9a9a9a] transition-colors">
            {formattedId}
          </span>
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase tracking-wider ${getDifficultyBadge(
              problem.difficulty
            )}`}
          >
            {problem.difficulty}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-sans text-lg font-semibold text-white group-hover:text-white/80 transition-colors line-clamp-2 leading-snug">
          {problem.title}
        </h3>

        {/* Topics tags */}
        {displayedTopics.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mt-4">
            {displayedTopics.map((topic) => (
              <span
                key={topic}
                className="text-[10px] font-mono px-2 py-0.5 rounded border border-white/5 bg-white/[0.02] text-[#9a9a9a] group-hover:border-white/15 transition-colors"
              >
                {topic}
              </span>
            ))}
            {remainingTopicsCount > 0 && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-white/5 bg-white/[0.01] text-[#6f6f6f]">
                +{remainingTopicsCount}
              </span>
            )}
          </div>
        )}
      </Link>

      {/* Footer */}
      <div className="relative z-10 flex items-center justify-between pt-4 mt-5 border-t border-white/5 text-xs font-mono text-[#6f6f6f]">
        <Link
          to={`/problems/${problem.slug}`}
          className="flex items-center gap-1.5 hover:text-white transition-colors py-1"
        >
          <Code2 size={13} className="opacity-70" />
          <span>Java Solution</span>
        </Link>

        <div className="flex items-center gap-3">
          {problem.leetcodeUrl && (
            <a
              href={problem.leetcodeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#6f6f6f] hover:text-white transition-colors p-1"
              aria-label={`View ${problem.title} on LeetCode`}
              title="Open on LeetCode"
            >
              <ExternalLink size={12} />
            </a>
          )}

          <Link
            to={`/problems/${problem.slug}`}
            className="metallic-btn px-2 py-0.5 text-[10px] text-[#9a9a9a] group-hover:text-white inline-flex items-center gap-1"
          >
            <span>VIEW</span>
            <ArrowRight size={10} />
          </Link>
        </div>
      </div>
    </article>
  );
};
