import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchX, RotateCcw } from 'lucide-react';
import { ProblemCard } from '../components/problems/ProblemCard';
import { ProblemSearch } from '../components/problems/ProblemSearch';
import { DifficultyFilter, type DifficultyFilterOption } from '../components/problems/DifficultyFilter';
import { TopicFilter } from '../components/problems/TopicFilter';
import { ProblemSort, type SortOption } from '../components/problems/ProblemSort';
import { getProblems, getTopics } from '../services/repository';
import type { Problem } from '../types/dsa';

export const ProblemsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Load static repository datasets
  const allProblems = useMemo(() => getProblems(), []);
  const allTopics = useMemo(() => getTopics(), []);

  // Read URL query params with defaults
  const searchQuery = searchParams.get('search') || '';
  const selectedDifficulty = (searchParams.get('difficulty') as DifficultyFilterOption) || 'All';
  const selectedTopic = searchParams.get('topic') || '';
  const selectedSort = (searchParams.get('sort') as SortOption) || 'number-desc';

  // Helper to update query params cleanly
  const updateQueryParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (!value || value === 'All' || (key === 'sort' && value === 'number-desc')) {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams, { replace: true });
  };

  const handleSearchChange = (val: string) => updateQueryParam('search', val);
  const handleDifficultyChange = (val: DifficultyFilterOption) => updateQueryParam('difficulty', val);
  const handleTopicChange = (val: string) => updateQueryParam('topic', val);
  const handleSortChange = (val: SortOption) => updateQueryParam('sort', val);

  const handleClearFilters = () => {
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  // Dynamic difficulty counts based on the whole dataset
  const difficultyCounts = useMemo(() => {
    return {
      all: allProblems.length,
      easy: allProblems.filter((p) => p.difficulty === 'Easy').length,
      medium: allProblems.filter((p) => p.difficulty === 'Medium').length,
      hard: allProblems.filter((p) => p.difficulty === 'Hard').length,
    };
  }, [allProblems]);

  // Combined deterministic filter & sort pipeline
  const filteredProblems = useMemo(() => {
    let result = [...allProblems];

    // 1. Search filter: matches title, problem name, ID/frontendId, or slug
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.problemName.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q) ||
          String(p.frontendId).toLowerCase().includes(q) ||
          String(p.id).includes(q)
      );
    }

    // 2. Difficulty filter
    if (selectedDifficulty !== 'All') {
      result = result.filter((p) => p.difficulty === selectedDifficulty);
    }

    // 3. Topic filter
    if (selectedTopic.trim()) {
      const topicNorm = selectedTopic.toLowerCase().trim();
      result = result.filter((p) =>
        p.topics.some(
          (t) =>
            t.toLowerCase() === topicNorm ||
            t.toLowerCase().replace(/\s+/g, '-') === topicNorm
        )
      );
    }

    // 4. Sorting
    result.sort((a, b) => {
      switch (selectedSort) {
        case 'number-desc':
          return b.id - a.id;
        case 'number-asc':
          return a.id - b.id;
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        case 'difficulty-desc': {
          const rank: Record<Problem['difficulty'], number> = { Hard: 3, Medium: 2, Easy: 1 };
          return rank[b.difficulty] - rank[a.difficulty] || b.id - a.id;
        }
        case 'difficulty-asc': {
          const rank: Record<Problem['difficulty'], number> = { Easy: 1, Medium: 2, Hard: 3 };
          return rank[a.difficulty] - rank[b.difficulty] || a.id - b.id;
        }
        default:
          return b.id - a.id;
      }
    });

    return result;
  }, [allProblems, searchQuery, selectedDifficulty, selectedTopic, selectedSort]);

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    selectedDifficulty !== 'All' ||
    Boolean(selectedTopic.trim());

  return (
    <div className="w-full flex-1 flex flex-col">
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* Page Header */}
        <section className="mb-10 animate-fade-rise">
          <div className="flex items-center gap-3 mb-3">
            <span className="font-mono text-xs text-neon-accent tracking-widest uppercase">
              THE ARCHIVE
            </span>
            <span className="text-white/20">•</span>
            <span className="font-mono text-xs px-2.5 py-0.5 rounded-full liquid-glass text-muted-foreground border border-white/10">
              {allProblems.length} problems
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl text-foreground tracking-tight">
            Problems I've Solved.
          </h1>

          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mt-4 leading-relaxed font-body">
            A growing collection of problems, patterns, and solutions from my DSA
            journey. Filter by topic, difficulty, or search for a specific challenge.
          </p>
        </section>

        {/* Explorer Controls */}
        <section className="liquid-glass rounded-2xl p-4 sm:p-6 mb-8 border border-white/10 space-y-4">
          {/* Top row: Search input */}
          <div className="w-full">
            <ProblemSearch value={searchQuery} onChange={handleSearchChange} />
          </div>

          {/* Bottom row: Filters & Sorting */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-1">
            <DifficultyFilter
              selected={selectedDifficulty}
              onChange={handleDifficultyChange}
              counts={difficultyCounts}
            />

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <TopicFilter
                topics={allTopics}
                selectedTopic={selectedTopic}
                onChange={handleTopicChange}
              />
              <ProblemSort
                selectedSort={selectedSort}
                onChange={handleSortChange}
              />
            </div>
          </div>
        </section>

        {/* Results Summary Bar */}
        <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground mb-6 px-1">
          <div className="flex items-center gap-2">
            <span>
              Showing <strong className="text-foreground font-mono">{filteredProblems.length}</strong> of{' '}
              <strong className="text-foreground font-mono">{allProblems.length}</strong> problems
            </span>
            {hasActiveFilters && (
              <span className="text-neon-accent text-xs">(Filtered)</span>
            )}
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-neon-accent transition-colors py-1 px-2.5 rounded-lg liquid-glass border border-white/10 hover:border-neon-accent/30 cursor-pointer"
            >
              <RotateCcw size={12} />
              <span>Clear filters</span>
            </button>
          )}
        </div>

        {/* Problems Grid / Empty State */}
        {filteredProblems.length > 0 ? (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProblems.map((problem) => (
              <ProblemCard key={problem.slug} problem={problem} />
            ))}
          </section>
        ) : (
          <section className="liquid-glass rounded-2xl p-12 text-center border border-white/10 my-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/5 border border-white/10 mb-4 text-muted-foreground">
              <SearchX size={26} />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Nothing matched your search.
            </h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
              Try adjusting your query, difficulty selection, or topic filter to explore other problems in the archive.
            </p>
            <button
              onClick={handleClearFilters}
              className="liquid-glass rounded-full px-6 py-2.5 text-sm tracking-wide text-foreground font-medium transition-transform hover:scale-[1.03] active:scale-[0.98] inline-flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw size={14} />
              <span>Reset all filters</span>
            </button>
          </section>
        )}
      </main>
    </div>
  );
};
