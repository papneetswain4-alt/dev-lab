import React, { useState, useMemo } from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { getTopics } from '../services/repository';
import { TopicCard } from '../components/topics/TopicCard';

type SortOption = 'count-desc' | 'count-asc' | 'name-asc' | 'name-desc';

export const TopicsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('count-desc');

  // Load all topics dynamically from repository
  const allTopics = useMemo(() => getTopics(), []);

  // Filter topics based on search query
  const filteredTopics = useMemo(() => {
    let result = allTopics;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.slug.toLowerCase().includes(q)
      );
    }

    // Apply sorting
    return [...result].sort((a, b) => {
      switch (sortBy) {
        case 'count-desc':
          return b.problemCount - a.problemCount || a.name.localeCompare(b.name);
        case 'count-asc':
          return a.problemCount - b.problemCount || a.name.localeCompare(b.name);
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });
  }, [allTopics, searchQuery, sortBy]);

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="w-full flex-1 flex flex-col">
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page Header */}
        <header className="mb-10 sm:mb-14">
          <div className="flex items-center gap-3 mb-3">
            <span className="font-mono text-xs text-[#9a9a9a] tracking-[0.25em] uppercase">
              THE TAXONOMY
            </span>
            <span className="text-white/20">&bull;</span>
            <span className="font-mono text-xs text-[#6f6f6f]">
              {allTopics.length} PATTERNS
            </span>
          </div>

          <h1 className="font-sans font-light text-4xl sm:text-6xl text-white tracking-tight leading-[0.95] uppercase mb-4">
            Algorithm{' '}
            <span className="font-italic-serif text-white/90 lowercase">paradigms.</span>
          </h1>

          <p className="text-[#9a9a9a] text-sm sm:text-base font-sans font-light leading-relaxed max-w-2xl">
            The core structures and invariants that form the foundation of algorithmic problem solving. Browse the verified archive by topic.
          </p>
        </header>

        {/* Search & Sort Controls */}
        <section aria-label="Topic Filters" className="mb-8">
          <div className="cinematic-panel rounded-2xl p-4 sm:p-5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6f6f6f] pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics by name..."
                aria-label="Search topics"
                className="w-full pl-10 pr-9 py-2 rounded-xl bg-black/60 border border-white/10 text-xs sm:text-sm text-white placeholder:text-[#6f6f6f] focus:outline-none focus:border-white/40 font-mono transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  aria-label="Clear topic search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6f6f6f] hover:text-white transition-colors p-1"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <div className="flex items-center gap-1.5 text-xs font-mono text-[#6f6f6f]">
                <SlidersHorizontal size={13} />
                <span className="hidden sm:inline">SORT:</span>
              </div>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  aria-label="Sort topics"
                  className="appearance-none rounded-xl bg-black/60 border border-white/10 pl-3 pr-8 py-2 text-xs font-mono text-white focus:outline-none focus:border-white/40 cursor-pointer"
                >
                  <option value="count-desc" className="bg-[#0a0a0a] text-white">
                    Problems: High to Low
                  </option>
                  <option value="count-asc" className="bg-[#0a0a0a] text-white">
                    Problems: Low to High
                  </option>
                  <option value="name-asc" className="bg-[#0a0a0a] text-white">
                    Topic Name: A to Z
                  </option>
                  <option value="name-desc" className="bg-[#0a0a0a] text-white">
                    Topic Name: Z to A
                  </option>
                </select>
                <ArrowUpDown
                  size={12}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6f6f6f] pointer-events-none"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Result Summary */}
        <div className="flex items-center justify-between px-1 mb-6 text-xs font-mono text-[#6f6f6f]">
          <span>
            SHOWING {filteredTopics.length} OF {allTopics.length} TOPICS
          </span>
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="text-[#9a9a9a] hover:text-white cursor-pointer"
            >
              Reset search
            </button>
          )}
        </div>

        {/* Topic Grid or Empty State */}
        {filteredTopics.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {filteredTopics.map((topic) => (
              <TopicCard key={topic.slug} topic={topic} />
            ))}
          </div>
        ) : (
          <div className="cinematic-panel rounded-3xl p-12 text-center border border-white/10 max-w-lg mx-auto my-8">
            <span className="font-mono text-xs text-[#9a9a9a] uppercase tracking-widest block mb-2">
              NO MATCHES
            </span>
            <h2 className="font-sans text-2xl text-white mb-3">
              No topics found.
            </h2>
            <p className="text-[#9a9a9a] text-xs font-mono mb-6">
              Try a different keyword or reset your filter.
            </p>
            <button
              type="button"
              onClick={handleClearSearch}
              className="metallic-btn px-6 py-2 text-xs font-mono tracking-wider text-white"
            >
              CLEAR SEARCH
            </button>
          </div>
        )}
      </main>
    </div>
  );
};
