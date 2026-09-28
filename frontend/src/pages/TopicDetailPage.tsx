import React, { useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Layers, Code2 } from 'lucide-react';
import { getTopicBySlug, getProblemsForTopic } from '../services/repository';
import { ProblemCard } from '../components/problems/ProblemCard';
import { AsciiImageTexture } from '../components/cinematic/AsciiImageTexture';

export const TopicDetailPage: React.FC = () => {
  const { topic: topicSlug } = useParams<{ topic: string }>();

  // Scroll to top on topic change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [topicSlug]);

  // Lookup topic from repository service
  const topic = useMemo(() => {
    if (!topicSlug) return undefined;
    return getTopicBySlug(topicSlug);
  }, [topicSlug]);

  // Resolve problems associated with this topic
  const problems = useMemo(() => {
    if (!topic) return [];
    return getProblemsForTopic(topic);
  }, [topic]);

  // 404 Topic Not Found state
  if (!topic) {
    return (
      <div className="w-full flex-1 flex flex-col items-center justify-center px-4 py-24 text-center">
        <div className="cinematic-panel rounded-3xl p-10 sm:p-14 max-w-lg w-full border border-white/10">
          <span className="font-mono text-xs text-[#9a9a9a] uppercase tracking-widest block mb-3">
            404 NOT FOUND
          </span>
          <h1 className="font-sans text-3xl text-white mb-4">
            Topic Not Found
          </h1>
          <p className="text-[#9a9a9a] text-xs font-mono mb-8 leading-relaxed">
            The requested topic could not be found in the archive. Check the topic name or explore all patterns.
          </p>
          <Link
            to="/topics"
            className="metallic-btn-primary px-8 py-3 text-xs font-mono tracking-wider uppercase inline-flex items-center gap-2"
          >
            <ArrowLeft size={14} />
            <span>BACK TO TOPICS</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex-1 flex flex-col">
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6" aria-label="Breadcrumb">
          <Link
            to="/topics"
            className="inline-flex items-center gap-2 text-xs font-mono text-[#9a9a9a] hover:text-white transition-colors group py-1.5 px-3 rounded-lg border border-white/10 hover:border-white/30"
          >
            <ArrowLeft size={13} className="group-hover:-translate-x-1 transition-transform" />
            <span>BACK TO TOPICS</span>
          </Link>
        </nav>

        {/* Topic Header Card */}
        <header className="relative overflow-hidden group cinematic-panel rounded-3xl p-6 sm:p-10 border border-white/10 mb-10">
          <AsciiImageTexture
            texture="texture-04"
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
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2 text-xs font-mono text-[#9a9a9a] tracking-wider uppercase">
                <Layers size={14} />
                <span>ALGORITHM PATTERN</span>
              </div>
              <span className="font-mono text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#9a9a9a]">
                {topic.problemCount} {topic.problemCount === 1 ? 'problem' : 'problems'}
              </span>
            </div>

            <h1 className="font-sans font-light text-4xl sm:text-5xl lg:text-6xl text-white uppercase tracking-tight mb-4">
              {topic.name}
            </h1>

            <p className="text-[#9a9a9a] text-sm sm:text-base font-sans font-light leading-relaxed max-w-2xl">
              All LeetCode challenges in DEV.LAB solved using {topic.name} techniques, patterns, and principles.
            </p>

            <div className="flex items-center gap-4 mt-8 pt-6 border-t border-white/10 text-xs font-mono text-[#6f6f6f]">
              <div className="flex items-center gap-2">
                <Code2 size={13} className="opacity-70" />
                <span>Showing {problems.length} verified solutions</span>
              </div>
            </div>
          </div>
        </header>

        {/* Problems Grid */}
        <section aria-label={`${topic.name} Problems`}>
          <div className="flex items-center justify-between mb-6 px-1">
            <h2 className="font-mono text-xs uppercase tracking-widest text-[#9a9a9a]">
              PROBLEMS IN THIS TOPIC
            </h2>
            <Link
              to={`/problems?topic=${encodeURIComponent(topic.name)}`}
              className="text-xs font-mono text-white/80 hover:text-white hover:underline"
            >
              Open in Problems Explorer &rarr;
            </Link>
          </div>

          {problems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {problems.map((problem) => (
                <ProblemCard key={problem.slug} problem={problem} />
              ))}
            </div>
          ) : (
            <div className="cinematic-panel rounded-2xl p-12 text-center border border-white/10">
              <p className="text-[#9a9a9a] text-xs font-mono">
                No problems found specifically linked to this topic.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};
