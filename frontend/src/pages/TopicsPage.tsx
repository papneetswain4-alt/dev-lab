import React, { useState, useMemo } from 'react';
import { Search, X, SlidersHorizontal, Layers, ArrowUpDown } from 'lucide-react';
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
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Page Header */}
        <header className="mb-12 sm:mb-16 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-neon-accent mb-4">
            <Layers size={13} />
            <span>PATTERNS &bull; {allTopics.length} ARCHIVED</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-foreground tracking-tight mb-4">
            What I Keep Coming Back To.
          </h1>

          <p className="text-muted-foreground text-sm sm:text-base font-body leading-relaxed">
            The patterns and concepts that shape how I approach problems. Explore the archive by core algorithm paradigms and data structures.
          </p>
        </header>

        {/* Search & Sort Controls */}
        <section aria-label="Topic Filters" className="mb-8">
          <div className="liquid-glass rounded-2xl p-4 sm:p-5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics..."
                aria-label="Search topics"
                className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-neon-accent/50 focus:ring-1 focus:ring-neon-accent/50 transition-all font-sans"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  aria-label="Clear topic search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
                <SlidersHorizontal size={14} />
                <span className="hidden sm:inline">SORT:</span>
              </div>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  aria-label="Sort topics"
                  className="appearance-none rounded-xl bg-white/[0.04] border border-white/10 pl-3 pr-8 py-2.5 text-xs font-mono text-foreground focus:outline-none focus:border-neon-accent/50 focus:ring-1 focus:ring-neon-accent/50 cursor-pointer"
                >
                  <option value="count-desc" className="bg-[#020B2D] text-foreground">
                    Problems: High to Low
                  </option>
                  <option value="count-asc" className="bg-[#020B2D] text-foreground">
                    Problems: Low to High
                  </option>
                  <option value="name-asc" className="bg-[#020B2D] text-foreground">
                    Topic Name: A to Z
                  </option>
                  <option value="name-desc" className="bg-[#020B2D] text-foreground">
                    Topic Name: Z to A
                  </option>
                </select>
                <ArrowUpDown
                  size={12}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Result Summary */}
        <div className="flex items-center justify-between px-1 mb-6 text-xs font-mono text-muted-foreground">
          <span>
            SHOWING {filteredTopics.length} OF {allTopics.length} TOPICS
          </span>
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="text-neon-accent hover:underline cursor-pointer"
            >
              Reset filter
            </button>
          )}
        </div>

        {/* Topic Grid or Empty State */}
        {filteredTopics.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTopics.map((topic) => (
              <TopicCard key={topic.slug} topic={topic} />
            ))}
          </div>
        ) : (
          <div className="liquid-glass rounded-3xl p-12 sm:p-16 text-center border border-white/10 max-w-lg mx-auto my-8">
            <span className="font-mono text-xs text-neon-accent uppercase tracking-widest block mb-2">
              NO MATCHES
            </span>
            <h2 className="font-display text-2xl sm:text-3xl text-foreground mb-3">
              No topics found.
            </h2>
            <p className="text-muted-foreground text-sm font-body mb-6">
              Try a different keyword or clear your search to browse all patterns.
            </p>
            <button
              type="button"
              onClick={handleClearSearch}
              className="liquid-glass rounded-full px-6 py-2.5 text-xs font-mono tracking-wider text-foreground hover:scale-105 active:scale-95 transition-all border border-white/15"
            >
              CLEAR SEARCH
            </button>
          </div>
        )}
      </main>
    </div>
  );
};
