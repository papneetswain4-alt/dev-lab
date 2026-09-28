import React from 'react';
import { Tag } from 'lucide-react';
import type { Topic } from '../../types/dsa';

interface TopicFilterProps {
  topics: Topic[];
  selectedTopic: string;
  onChange: (topic: string) => void;
}

export const TopicFilter: React.FC<TopicFilterProps> = ({
  topics,
  selectedTopic,
  onChange,
}) => {
  return (
    <div className="relative min-w-[180px] w-full sm:w-auto">
      <div className="relative flex items-center">
        <Tag
          size={14}
          className="absolute left-3.5 text-[#6f6f6f] pointer-events-none"
          aria-hidden="true"
        />
        <select
          value={selectedTopic}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Filter by Topic"
          className="w-full appearance-none rounded-xl pl-9 pr-9 py-2 text-xs font-mono text-white bg-black/60 border border-white/10 focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all duration-200 cursor-pointer"
        >
          <option value="" className="bg-[#0a0a0a] text-white">
            All Topics ({topics.length})
          </option>
          {topics.map((topic) => (
            <option
              key={topic.slug}
              value={topic.name}
              className="bg-[#0a0a0a] text-white"
            >
              {topic.name} ({topic.problemCount})
            </option>
          ))}
        </select>
        <div className="absolute right-3.5 pointer-events-none text-[#6f6f6f] text-[10px]">
          ▼
        </div>
      </div>
    </div>
  );
};
