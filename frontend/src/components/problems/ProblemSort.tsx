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
          size={16}
          className="absolute left-3.5 text-muted-foreground pointer-events-none"
          aria-hidden="true"
        />
        <select
          value={selectedSort}
          onChange={(e) => onChange(e.target.value as SortOption)}
          aria-label="Sort problems"
          className="w-full appearance-none liquid-glass rounded-xl pl-9 pr-9 py-2.5 text-sm text-foreground bg-[#010828] border border-white/10 focus:border-neon-accent/60 focus:outline-none focus:ring-1 focus:ring-neon-accent/60 transition-all duration-200 cursor-pointer"
        >
          <option value="number-desc" className="bg-[#010828] text-foreground">
            Number: High to Low
          </option>
          <option value="number-asc" className="bg-[#010828] text-foreground">
            Number: Low to High
          </option>
          <option value="title-asc" className="bg-[#010828] text-foreground">
            Title: A to Z
          </option>
          <option value="title-desc" className="bg-[#010828] text-foreground">
            Title: Z to A
          </option>
          <option value="difficulty-desc" className="bg-[#010828] text-foreground">
            Difficulty: Hard to Easy
          </option>
          <option value="difficulty-asc" className="bg-[#010828] text-foreground">
            Difficulty: Easy to Hard
          </option>
        </select>
        <div className="absolute right-3.5 pointer-events-none text-muted-foreground text-xs">
          ▼
        </div>
      </div>
    </div>
  );
};
