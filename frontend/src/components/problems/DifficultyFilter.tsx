import React from 'react';
import type { Difficulty } from '../../types/dsa';

export type DifficultyFilterOption = 'All' | Difficulty;

interface DifficultyFilterProps {
  selected: DifficultyFilterOption;
  onChange: (difficulty: DifficultyFilterOption) => void;
  counts: {
    all: number;
    easy: number;
    medium: number;
    hard: number;
  };
}

export const DifficultyFilter: React.FC<DifficultyFilterProps> = ({
  selected,
  onChange,
  counts,
}) => {
  const options: { label: DifficultyFilterOption; count: number; colorClass: string }[] = [
    { label: 'All', count: counts.all, colorClass: 'text-foreground' },
    { label: 'Easy', count: counts.easy, colorClass: 'text-[#00B8A3]' },
    { label: 'Medium', count: counts.medium, colorClass: 'text-[#FFC01E]' },
    { label: 'Hard', count: counts.hard, colorClass: 'text-[#FF375F]' },
  ];

  return (
    <div className="flex items-center gap-1.5 p-1 rounded-xl liquid-glass border border-white/10 overflow-x-auto">
      {options.map((opt) => {
        const isActive = selected === opt.label;
        return (
          <button
            key={opt.label}
            type="button"
            onClick={() => onChange(opt.label)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap cursor-pointer ${
              isActive
                ? 'bg-white/15 text-foreground shadow-sm border border-white/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent'
            }`}
          >
            <span>{opt.label}</span>
            <span
              className={`font-mono text-xs px-1.5 py-0.2 rounded ${
                isActive ? 'bg-white/20 text-white' : 'bg-white/5 text-muted-foreground'
              }`}
            >
              {opt.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
