import React, { useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SearchX, RotateCcw, LayoutGrid, List, ArrowRight, Code2, ExternalLink } from 'lucide-react';
import { ProblemCard } from '../components/problems/ProblemCard';
import { ProblemSearch } from '../components/problems/ProblemSearch';
import { DifficultyFilter, type DifficultyFilterOption } from '../components/problems/DifficultyFilter';
import { TopicFilter } from '../components/problems/TopicFilter';
import { ProblemSort, type SortOption } from '../components/problems/ProblemSort';
import { getProblems, getTopics } from '../services/repository';
import type { Problem } from '../types/dsa';

export const ProblemsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

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

    // 1. Search filter
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

  const getDifficultyBadge = (difficulty: Problem['difficulty']) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-[#00B8A3] border-[#00B8A3]/30 bg-[#00B8A3]/10';
      case 'Medium':
        return 'text-[#FFC01E] border-[#FFC01E]/30 bg-[#FFC01E]/10';
      case 'Hard':
        return 'text-[#FF375F] border-[#FF375F]/30 bg-[#FF375F]/10';
      default:
        return 'text-[#9a9a9a] border-white/10 bg-white/5';
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col">
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page Header */}
        <section className="mb-10 sm:mb-12">
          <div className="flex items-center gap-3 mb-3">
            <span className="font-mono text-xs text-[#9a9a9a] tracking-[0.25em] uppercase">
              THE ARCHIVE
            </span>
            <span className="text-white/20">&bull;</span>
            <span className="font-mono text-xs text-[#6f6f6f]">
              {allProblems.length} PROBLEMS
            </span>
          </div>

          <h1 className="font-sans font-light text-4xl sm:text-6xl text-white tracking-tight leading-[0.95] uppercase">
            Problems I've{' '}
            <span className="font-italic-serif text-white/90 lowercase">solved.</span>
          </h1>

          <p className="text-[#9a9a9a] text-sm sm:text-base max-w-2xl mt-4 font-sans font-light leading-relaxed">
            A growing personal library of algorithmic challenges, patterns, and Java implementations. Filter by pattern, difficulty, or search directly.
          </p>
        </section>

        {/* Explorer Controls */}
        <section className="cinematic-panel p-4 sm:p-6 mb-8 border border-white/10 space-y-4 rounded-2xl">
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

              {/* View Mode Toggle */}
              <div className="hidden sm:flex items-center rounded-lg bg-black/60 p-1 border border-white/10">
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded transition-colors ${
                    viewMode === 'table' ? 'bg-white/15 text-white' : 'text-[#6f6f6f] hover:text-white'
                  }`}
                  title="List view"
                  aria-label="List view"
                >
                  <List size={14} />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded transition-colors ${
                    viewMode === 'grid' ? 'bg-white/15 text-white' : 'text-[#6f6f6f] hover:text-white'
                  }`}
                  title="Grid view"
                  aria-label="Grid view"
                >
                  <LayoutGrid size={14} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Results Summary Bar */}
        <div className="flex items-center justify-between text-xs font-mono text-[#6f6f6f] mb-6 px-1">
          <div className="flex items-center gap-2">
            <span>
              SHOWING <strong className="text-white">{filteredProblems.length}</strong> OF{' '}
              <strong className="text-white">{allProblems.length}</strong> PROBLEMS
            </span>
            {hasActiveFilters && (
              <span className="text-white/80 text-[11px]">(FILTERED)</span>
            )}
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-1.5 text-xs text-[#9a9a9a] hover:text-white transition-colors py-1 px-2.5 rounded-lg border border-white/10 hover:border-white/30 cursor-pointer"
            >
              <RotateCcw size={12} />
              <span>Reset filters</span>
            </button>
          )}
        </div>

        {/* Problems Display */}
        {filteredProblems.length > 0 ? (
          viewMode === 'table' ? (
            <div className="cinematic-panel rounded-2xl border border-white/10 divide-y divide-white/5 overflow-hidden">
              {filteredProblems.map((p) => {
                const formattedId = `#${String(p.frontendId || p.id).padStart(4, '0')}`;
                return (
                  <div
                    key={p.slug}
                    className="group flex flex-col sm:flex-row sm:items-center justify-between py-3.5 px-4 sm:px-6 hover:bg-white/[0.03] transition-colors gap-2"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <span className="font-mono text-xs text-[#6f6f6f] shrink-0">
                        {formattedId}
                      </span>

                      <Link
                        to={`/problems/${p.slug}`}
                        className="font-sans text-sm sm:text-base font-medium text-white group-hover:text-white/80 transition-colors truncate"
                      >
                        {p.title}
                      </Link>

                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase tracking-wider shrink-0 ${getDifficultyBadge(
                          p.difficulty
                        )}`}
                      >
                        {p.difficulty}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 sm:self-auto pl-7 sm:pl-0">
                      <div className="hidden md:flex items-center gap-1.5">
                        {p.topics.slice(0, 2).map((t) => (
                          <span
                            key={t}
                            className="text-[10px] font-mono px-2 py-0.5 rounded border border-white/5 bg-white/[0.02] text-[#9a9a9a]"
                          >
                            {t}
                          </span>
                        ))}
                        {p.topics.length > 2 && (
                          <span className="text-[10px] font-mono text-[#6f6f6f]">
                            +{p.topics.length - 2}
                          </span>
                        )}
                      </div>

                      <span className="text-[11px] font-mono text-[#6f6f6f] flex items-center gap-1">
                        <Code2 size={12} className="opacity-70" />
                        <span>Java</span>
                      </span>

                      {p.leetcodeUrl && (
                        <a
                          href={p.leetcodeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#6f6f6f] hover:text-white p-1 transition-colors"
                          title="Open on LeetCode"
                        >
                          <ExternalLink size={12} />
                        </a>
                      )}

                      <Link
                        to={`/problems/${p.slug}`}
                        className="metallic-btn px-2.5 py-1 text-[11px] font-mono text-[#9a9a9a] group-hover:text-white inline-flex items-center gap-1"
                      >
                        <span>VIEW</span>
                        <ArrowRight size={10} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProblems.map((problem) => (
                <ProblemCard key={problem.slug} problem={problem} />
              ))}
            </div>
          )
        ) : (
          <section className="cinematic-panel rounded-2xl p-12 text-center border border-white/10 my-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 mb-4 text-[#6f6f6f]">
              <SearchX size={22} />
            </div>
            <h2 className="text-lg font-semibold text-white mb-2">
              No matching problems found.
            </h2>
            <p className="text-[#9a9a9a] text-sm max-w-md mx-auto mb-6">
              Try adjusting your search keywords, difficulty, or topic filter to explore other challenges.
            </p>
            <button
              onClick={handleClearFilters}
              className="metallic-btn px-6 py-2 text-xs font-mono tracking-wider text-white inline-flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw size={13} />
              <span>Reset all filters</span>
            </button>
          </section>
        )}
      </main>
    </div>
  );
};
