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
import { AsciiImageTexture } from '../components/cinematic/AsciiImageTexture';
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
        return 'text-[#9a9a9a] bg-white/5 border-white/10';
    }
  };

  // Graceful Not-Found State
  if (!problem) {
    return (
      <div className="w-full flex-1 flex flex-col items-center justify-center px-4 py-24 text-center">
        <div className="cinematic-panel rounded-3xl p-10 sm:p-14 max-w-lg w-full border border-white/10">
          <span className="font-mono text-xs text-[#9a9a9a] uppercase tracking-widest block mb-3">
            404 NOT FOUND
          </span>
          <h1 className="font-sans text-3xl text-white mb-4">
            Problem Not Found
          </h1>
          <p className="text-[#9a9a9a] text-xs font-mono mb-8 leading-relaxed">
            The requested problem could not be found in the DEV.LAB archive.
          </p>
          <Link
            to="/problems"
            className="metallic-btn-primary px-8 py-3 text-xs font-mono tracking-wider uppercase inline-flex items-center gap-2"
          >
            <ArrowLeft size={14} />
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
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* 1. BACK TO PROBLEMS */}
        <nav className="mb-6" aria-label="Breadcrumb">
          <Link
            to="/problems"
            className="inline-flex items-center gap-2 text-xs font-mono text-[#9a9a9a] hover:text-white transition-colors group py-1.5 px-3 rounded-lg border border-white/10 hover:border-white/30"
          >
            <ArrowLeft size={13} className="group-hover:-translate-x-1 transition-transform" />
            <span>BACK TO PROBLEMS</span>
          </Link>
        </nav>

        {/* 2. PROBLEM HEADER */}
        <header className="relative overflow-hidden group cinematic-panel rounded-3xl p-6 sm:p-10 border border-white/10 mb-8">
          <AsciiImageTexture
            texture="texture-01"
            crop="top-right"
            fade="corner-tr"
            dotSpacing={5.8}
            density={1.08}
            detail={1.15}
            contrast={1.38}
            opacity={0.34}
            hoverOpacity={0.58}
          />

          <div className="relative z-10">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <span className="font-mono text-xs text-[#6f6f6f]">
                {formattedId}
              </span>
              <span
                className={`text-[10px] font-mono px-2.5 py-0.5 rounded border uppercase tracking-wider ${getDifficultyBadge(
                  problem.difficulty
                )}`}
              >
                {problem.difficulty}
              </span>
            </div>

            <h1 className="font-sans font-light text-3xl sm:text-5xl text-white tracking-tight mb-6">
              {problem.title}
            </h1>

            {/* Topics tags */}
            {problem.topics && problem.topics.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-8">
                {problem.topics.map((topic) => (
                  <span
                    key={topic}
                    className="text-[11px] font-mono px-2.5 py-1 rounded border border-white/10 bg-white/[0.02] text-[#9a9a9a]"
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
                  className="metallic-btn px-4 py-2 text-xs font-mono tracking-wider text-white inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>OPEN ON LEETCODE</span>
                  <ExternalLink size={12} className="opacity-70" />
                </a>
              )}

              <a
                href={githubSourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="metallic-btn px-4 py-2 text-xs font-mono tracking-wider text-white inline-flex items-center gap-2 cursor-pointer"
              >
                <FolderGit2 size={13} className="opacity-70" />
                <span>VIEW SOURCE</span>
                <ExternalLink size={12} className="opacity-70" />
              </a>
            </div>
          </div>
        </header>

        {/* 3. PROBLEM DESCRIPTION */}
        <section className="cinematic-panel rounded-3xl p-6 sm:p-10 border border-white/10 mb-8">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/10">
            <BookOpen size={16} className="text-white/80" />
            <h2 className="font-mono text-xs uppercase tracking-widest text-[#9a9a9a]">
              PROBLEM DESCRIPTION
            </h2>
          </div>

          {/* Problem Statement Rendered HTML */}
          <div
            className="problem-description text-[#d4d4d4] font-sans text-sm sm:text-base leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{
              __html: problem.descriptionHtml || '<p class="text-[#6f6f6f] italic">No description available.</p>',
            }}
          />
        </section>

        {/* 4. EXAMPLES */}
        {problem.examples && problem.examples.length > 0 && (
          <section className="cinematic-panel rounded-3xl p-6 sm:p-10 border border-white/10 mb-8">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/10">
              <CheckCircle2 size={16} className="text-white/80" />
              <h2 className="font-mono text-xs uppercase tracking-widest text-[#9a9a9a]">
                EXAMPLES ({problem.examples.length})
              </h2>
            </div>

            <div className="space-y-4">
              {problem.examples.map((exampleHtml, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl p-5 bg-white/[0.02] border border-white/5 font-mono text-xs sm:text-sm leading-relaxed"
                >
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[#9a9a9a] mb-3">
                    Example {idx + 1}
                  </div>
                  <div
                    className="problem-example text-white/90 whitespace-pre-wrap space-y-1.5"
                    dangerouslySetInnerHTML={{ __html: exampleHtml }}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. CONSTRAINTS */}
        {problem.constraints && problem.constraints.length > 0 && (
          <section className="cinematic-panel rounded-3xl p-6 sm:p-10 border border-white/10 mb-8">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/10">
              <ListOrdered size={16} className="text-white/80" />
              <h2 className="font-mono text-xs uppercase tracking-widest text-[#9a9a9a]">
                CONSTRAINTS
              </h2>
            </div>

            <ul className="space-y-2.5 font-mono text-xs sm:text-sm text-[#d4d4d4]">
              {problem.constraints.map((constraintHtml, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-[#6f6f6f] select-none mt-0.5">&bull;</span>
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
            <Code2 size={16} className="text-white/80" />
            <h2 className="font-mono text-xs uppercase tracking-widest text-[#9a9a9a]">
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
                className="cinematic-panel rounded-2xl p-5 border border-white/10 hover:border-white/25 transition-all duration-200 group flex flex-col justify-between"
              >
                <span className="font-mono text-[11px] text-[#6f6f6f] uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
                  PREVIOUS PROBLEM
                </span>
                <span className="font-sans font-medium text-white group-hover:text-white/80 transition-colors line-clamp-1">
                  #{prevProblem.frontendId} {prevProblem.title}
                </span>
              </Link>
            ) : (
              <div className="hidden sm:block" />
            )}

            {nextProblem ? (
              <Link
                to={`/problems/${nextProblem.slug}`}
                className="cinematic-panel rounded-2xl p-5 border border-white/10 hover:border-white/25 transition-all duration-200 group flex flex-col justify-between text-right sm:items-end"
              >
                <span className="font-mono text-[11px] text-[#6f6f6f] uppercase tracking-wider flex items-center gap-1.5 mb-2 self-end">
                  <span>NEXT PROBLEM</span>
                  <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="font-sans font-medium text-white group-hover:text-white/80 transition-colors line-clamp-1">
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
