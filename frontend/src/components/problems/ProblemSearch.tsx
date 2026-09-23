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
          size={18}
          className="absolute left-4 text-muted-foreground pointer-events-none"
          aria-hidden="true"
        />
        <input
          id="problem-search"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search problems by name, number, or slug..."
          className="w-full liquid-glass rounded-xl pl-11 pr-10 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 border border-white/10 focus:border-neon-accent/60 focus:outline-none focus:ring-1 focus:ring-neon-accent/60 transition-all duration-200"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute right-3 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
            aria-label="Clear search input"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};
