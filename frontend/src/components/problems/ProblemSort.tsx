import React from 'react';
import { ArrowUpDown } from 'lucide-react';

export type SortOption =
  | 'number-desc'
  | 'number-asc'
  | 'title-asc'
  | 'title-desc'
  | 'difficulty-desc'
  | 'difficulty-asc';

interface ProblemSortProps {
  selectedSort: SortOption;
  onChange: (sort: SortOption) => void;
}

export const ProblemSort: React.FC<ProblemSortProps> = ({
  selectedSort,
  onChange,
}) => {
  return (
    <div className="relative min-w-[190px] w-full sm:w-auto">
      <div className="relative flex items-center">
        <ArrowUpDown
          size={14}
          className="absolute left-3.5 text-[#6f6f6f] pointer-events-none"
          aria-hidden="true"
        />
        <select
          value={selectedSort}
          onChange={(e) => onChange(e.target.value as SortOption)}
          aria-label="Sort problems"
          className="w-full appearance-none rounded-xl pl-9 pr-9 py-2 text-xs font-mono text-white bg-black/60 border border-white/10 focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all duration-200 cursor-pointer"
        >
          <option value="number-desc" className="bg-[#0a0a0a] text-white">
            Number: High to Low
          </option>
          <option value="number-asc" className="bg-[#0a0a0a] text-white">
            Number: Low to High
          </option>
          <option value="title-asc" className="bg-[#0a0a0a] text-white">
            Title: A to Z
          </option>
          <option value="title-desc" className="bg-[#0a0a0a] text-white">
            Title: Z to A
          </option>
          <option value="difficulty-desc" className="bg-[#0a0a0a] text-white">
            Difficulty: Hard to Easy
          </option>
          <option value="difficulty-asc" className="bg-[#0a0a0a] text-white">
            Difficulty: Easy to Hard
          </option>
        </select>
        <div className="absolute right-3.5 pointer-events-none text-[#6f6f6f] text-[10px]">
          ▼
        </div>
      </div>
    </div>
  );
};
