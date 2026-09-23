import React from 'react';
import { Tag } from 'lucide-react';
import type { Topic } from '../../types/dsa';

interface TopicFilterProps {
  topics: Topic[];
  selectedTopic: string; // topic name or slug
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
          size={16}
          className="absolute left-3.5 text-muted-foreground pointer-events-none"
          aria-hidden="true"
        />
        <select
          value={selectedTopic}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Filter by Topic"
          className="w-full appearance-none liquid-glass rounded-xl pl-9 pr-9 py-2.5 text-sm text-foreground bg-[#010828] border border-white/10 focus:border-neon-accent/60 focus:outline-none focus:ring-1 focus:ring-neon-accent/60 transition-all duration-200 cursor-pointer"
        >
          <option value="" className="bg-[#010828] text-foreground">
            All Topics ({topics.reduce((acc, t) => acc + t.problemCount, 0)})
          </option>
          {topics.map((topic) => (
            <option
              key={topic.slug}
              value={topic.name}
              className="bg-[#010828] text-foreground"
            >
              {topic.name} ({topic.problemCount})
            </option>
          ))}
        </select>
        <div className="absolute right-3.5 pointer-events-none text-muted-foreground text-xs">
          ▼
        </div>
      </div>
    </div>
  );
};
