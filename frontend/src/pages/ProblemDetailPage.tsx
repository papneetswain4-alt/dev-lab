import React, { useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ExternalLink,
  ArrowRight,
  FolderGit2,
  BookOpen,
  Code2,
  CheckCircle2,
  ListOrdered,
} from 'lucide-react';
import { getProblemBySlug, getProblems } from '../services/repository';
import { CodeViewer } from '../components/problems/CodeViewer';
import type { Problem } from '../types/dsa';

export const ProblemDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  // Scroll to top on slug change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [slug]);

  // Lookup the specific problem by slug
  const problem = useMemo(() => {
    if (!slug) return undefined;
    return getProblemBySlug(slug);
  }, [slug]);

  // Load the full catalog to find neighboring problems
  const allProblems = useMemo(() => getProblems(), []);

  // Compute previous and next problem based on catalog order
  const { prevProblem, nextProblem } = useMemo(() => {
    if (!problem) return { prevProblem: undefined, nextProblem: undefined };
    const currentIndex = allProblems.findIndex((p) => p.slug === problem.slug);
    if (currentIndex === -1) return { prevProblem: undefined, nextProblem: undefined };

    return {
      prevProblem: currentIndex > 0 ? allProblems[currentIndex - 1] : undefined,
      nextProblem: currentIndex < allProblems.length - 1 ? allProblems[currentIndex + 1] : undefined,
    };
  }, [allProblems, problem]);

  const getDifficultyBadge = (difficulty: Problem['difficulty']) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-[#00B8A3] bg-[#00B8A3]/10 border-[#00B8A3]/30';
      case 'Medium':
        return 'text-[#FFC01E] bg-[#FFC01E]/10 border-[#FFC01E]/30';
      case 'Hard':
        return 'text-[#FF375F] bg-[#FF375F]/10 border-[#FF375F]/30';
      default:
        return 'text-muted-foreground bg-white/5 border-white/10';
    }
  };

  // Graceful Not-Found State
  if (!problem) {
    return (
      <div className="w-full flex-1 flex flex-col items-center justify-center px-4 py-24 text-center">
        <div className="liquid-glass rounded-3xl p-10 sm:p-14 max-w-lg w-full border border-white/10">
          <span className="font-mono text-xs text-neon-accent uppercase tracking-widest block mb-3">
            404 NOT FOUND
          </span>
          <h1 className="font-display text-4xl text-foreground mb-4">
            Problem Not Found
          </h1>
          <p className="text-muted-foreground text-sm font-body mb-8 leading-relaxed">
            The requested problem could not be found in the DEV.LAB archive. It
            may have a different slug or has not been synced yet.
          </p>
          <Link
            to="/problems"
            className="liquid-glass rounded-full px-8 py-3.5 text-sm font-medium text-foreground tracking-wider inline-flex items-center gap-2 hover:scale-[1.03] active:scale-[0.98] transition-transform cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>BACK TO PROBLEMS</span>
          </Link>
        </div>
      </div>
    );
  }

  const formattedId = `#${String(problem.frontendId || problem.id).padStart(4, '0')}`;
  const githubSourceUrl = `https://github.com/papneetswain4-alt/dev-lab/tree/main/${problem.folderPath}`;

  return (
    <div className="w-full flex-1 flex flex-col">
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* 1. BACK TO PROBLEMS */}
        <nav className="mb-8" aria-label="Breadcrumb">
          <Link
            to="/problems"
            className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-neon-accent transition-colors group py-1.5 px-3 rounded-lg liquid-glass border border-white/5 hover:border-neon-accent/30"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span>BACK TO PROBLEMS</span>
          </Link>
        </nav>

        {/* 2. PROBLEM HEADER */}
        <header className="liquid-glass rounded-3xl p-6 sm:p-10 border border-white/10 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <span className="font-mono text-sm tracking-wider text-muted-foreground">
              {formattedId}
            </span>
            <span
              className={`text-xs px-3 py-1 rounded-full font-medium border uppercase tracking-wider ${getDifficultyBadge(
                problem.difficulty
              )}`}
            >
              {problem.difficulty}
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl text-foreground tracking-tight mb-6">
            {problem.title}
          </h1>

          {/* Topics tags */}
          {problem.topics && problem.topics.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-8">
              {problem.topics.map((topic) => (
                <span
                  key={topic}
                  className="text-xs px-3 py-1 rounded-md bg-white/[0.03] border border-white/10 text-muted-foreground"
                >
                  {topic}
                </span>
              ))}
            </div>
          )}

          {/* External Action Links */}
          <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-white/10">
            {problem.leetcodeUrl && (
              <a
                href={problem.leetcodeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="liquid-glass rounded-full px-5 py-2.5 text-xs font-mono tracking-wider text-foreground hover:text-neon-accent hover:border-neon-accent/40 border border-white/10 inline-flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>OPEN ON LEETCODE</span>
                <ExternalLink size={13} />
              </a>
            )}

            <a
              href={githubSourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="liquid-glass rounded-full px-5 py-2.5 text-xs font-mono tracking-wider text-foreground hover:text-white hover:border-white/30 border border-white/10 inline-flex items-center gap-2 transition-all cursor-pointer"
            >
              <FolderGit2 size={13} />
              <span>VIEW SOURCE</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </header>

        {/* 3. PROBLEM DESCRIPTION */}
        <section className="liquid-glass rounded-3xl p-6 sm:p-10 border border-white/10 mb-8">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/10">
            <BookOpen size={18} className="text-neon-accent" />
            <h2 className="font-mono text-xs uppercase tracking-widest text-foreground font-semibold">
              PROBLEM DESCRIPTION
            </h2>
          </div>

          {/* Problem Statement Rendered HTML */}
          <div
            className="problem-description text-foreground/90 font-body text-sm sm:text-base leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{
              __html: problem.descriptionHtml || '<p class="text-muted-foreground italic">No description available.</p>',
            }}
          />
        </section>

        {/* 4. EXAMPLES */}
        {problem.examples && problem.examples.length > 0 && (
          <section className="liquid-glass rounded-3xl p-6 sm:p-10 border border-white/10 mb-8">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/10">
              <CheckCircle2 size={18} className="text-neon-accent" />
              <h2 className="font-mono text-xs uppercase tracking-widest text-foreground font-semibold">
                EXAMPLES ({problem.examples.length})
              </h2>
            </div>

            <div className="space-y-4">
              {problem.examples.map((exampleHtml, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl p-5 bg-white/[0.02] border border-white/5 font-mono text-xs sm:text-sm leading-relaxed"
                >
                  <div className="text-xs font-mono uppercase tracking-wider text-neon-accent mb-3 font-semibold">
                    Example {idx + 1}
                  </div>
                  <div
                    className="problem-example text-foreground/90 whitespace-pre-wrap space-y-1.5"
                    dangerouslySetInnerHTML={{ __html: exampleHtml }}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. CONSTRAINTS */}
        {problem.constraints && problem.constraints.length > 0 && (
          <section className="liquid-glass rounded-3xl p-6 sm:p-10 border border-white/10 mb-8">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/10">
              <ListOrdered size={18} className="text-neon-accent" />
              <h2 className="font-mono text-xs uppercase tracking-widest text-foreground font-semibold">
                CONSTRAINTS
              </h2>
            </div>

            <ul className="space-y-3 font-mono text-xs sm:text-sm text-foreground/85">
              {problem.constraints.map((constraintHtml, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-neon-accent select-none mt-0.5 font-bold">•</span>
                  <div
                    className="problem-constraint flex-1 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: constraintHtml }}
                  />
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 6. JAVA SOLUTION */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4 px-1">
            <Code2 size={18} className="text-neon-accent" />
            <h2 className="font-mono text-xs uppercase tracking-widest text-foreground font-semibold">
              JAVA SOLUTION ({problem.solutions?.length ?? 0})
            </h2>
          </div>

          <CodeViewer solutions={problem.solutions || []} />
        </section>

        {/* 7. PREVIOUS / NEXT */}
        <nav aria-label="Neighboring Problems" className="pt-6 border-t border-white/10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prevProblem ? (
              <Link
                to={`/problems/${prevProblem.slug}`}
                className="liquid-glass rounded-2xl p-5 border border-white/10 hover:border-white/25 transition-all duration-200 group flex flex-col justify-between"
              >
                <span className="font-mono text-[11px] text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
                  PREVIOUS PROBLEM
                </span>
                <span className="font-sans font-semibold text-foreground group-hover:text-neon-accent transition-colors line-clamp-1">
                  #{prevProblem.frontendId} {prevProblem.title}
                </span>
              </Link>
            ) : (
              <div className="hidden sm:block" />
            )}

            {nextProblem ? (
              <Link
                to={`/problems/${nextProblem.slug}`}
                className="liquid-glass rounded-2xl p-5 border border-white/10 hover:border-white/25 transition-all duration-200 group flex flex-col justify-between text-right sm:items-end"
              >
                <span className="font-mono text-[11px] text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-2 self-end">
                  <span>NEXT PROBLEM</span>
                  <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="font-sans font-semibold text-foreground group-hover:text-neon-accent transition-colors line-clamp-1">
                  #{nextProblem.frontendId} {nextProblem.title}
                </span>
              </Link>
            ) : (
              <div className="hidden sm:block" />
            )}
          </div>
        </nav>
      </main>
    </div>
  );
};
