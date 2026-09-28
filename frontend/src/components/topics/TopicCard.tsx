import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers } from 'lucide-react';
import type { Topic } from '../../types/dsa';
import { AsciiImageTexture } from '../cinematic/AsciiImageTexture';

interface TopicCardProps {
  topic: Topic;
}

export const TopicCard: React.FC<TopicCardProps> = ({ topic }) => {
  const textureChoice = (topic.name.length % 2 === 0) ? 'texture-01' : 'texture-04';

  return (
    <Link
      to={`/topics/${topic.slug}`}
      className="relative cinematic-panel p-5 sm:p-6 rounded-2xl flex flex-col justify-between transition-all duration-300 hover:border-white/30 hover:-translate-y-0.5 group focus:outline-none overflow-hidden"
      aria-label={`Explore topic ${topic.name} with ${topic.problemCount} problems`}
    >
      {/* Decorative ASCII Halftone Texture */}
      <AsciiImageTexture
        texture={textureChoice}
        crop="center"
        fade="radial"
        dotSpacing={5.8}
        density={1.05}
        detail={1.15}
        contrast={1.35}
        opacity={0.35}
        hoverOpacity={0.60}
      />

      <div className="relative z-10">
        {/* Top meta row */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#9a9a9a] group-hover:text-white transition-colors">
            <Layers size={14} />
          </div>
          <span className="font-mono text-[11px] px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[#9a9a9a] group-hover:text-white transition-colors">
            {topic.problemCount} {topic.problemCount === 1 ? 'problem' : 'problems'}
          </span>
        </div>

        {/* Topic Name */}
        <h3 className="font-sans text-lg sm:text-xl font-semibold tracking-tight text-white group-hover:text-white/80 transition-colors duration-200">
          {topic.name}
        </h3>

        {/* Subtitle */}
        <p className="text-xs text-[#6f6f6f] mt-1.5 font-mono">
          Algorithmic pattern &amp; solutions
        </p>
      </div>

      {/* Action footer */}
      <div className="relative z-10 flex items-center justify-between pt-4 mt-6 border-t border-white/5 text-xs font-mono tracking-wider text-[#6f6f6f] group-hover:text-white transition-colors">
        <span>EXPLORE</span>
        <ArrowRight size={12} className="text-[#9a9a9a] group-hover:text-white group-hover:translate-x-1 transition-all" />
      </div>
    </Link>
  );
};
