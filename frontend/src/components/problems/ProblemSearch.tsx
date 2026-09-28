import React from 'react';
import { Search, X } from 'lucide-react';

interface ProblemSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export const ProblemSearch: React.FC<ProblemSearchProps> = ({ value, onChange }) => {
  return (
    <div className="relative w-full">
      <label htmlFor="problem-search" className="sr-only">
        Search problems
      </label>
      <div className="relative flex items-center">
        <Search
          size={16}
          className="absolute left-4 text-[#6f6f6f] pointer-events-none"
          aria-hidden="true"
        />
        <input
          id="problem-search"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search problems by name, number, or topic..."
          className="w-full rounded-xl pl-11 pr-10 py-3 text-xs sm:text-sm text-white placeholder:text-[#6f6f6f] bg-black/60 border border-white/10 focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all duration-200 font-mono"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute right-3 p-1 rounded-full text-[#9a9a9a] hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Clear search input"
          >
            <X size={15} />
          </button>
        )}
      </div>
    </div>
  );
};
