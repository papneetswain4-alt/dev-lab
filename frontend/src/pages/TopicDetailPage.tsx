import React, { useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Layers, Code2 } from 'lucide-react';
import { getTopicBySlug, getProblemsForTopic } from '../services/repository';
import { ProblemCard } from '../components/problems/ProblemCard';

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
        <div className="liquid-glass rounded-3xl p-10 sm:p-14 max-w-lg w-full border border-white/10">
          <span className="font-mono text-xs text-neon-accent uppercase tracking-widest block mb-3">
            404 NOT FOUND
          </span>
          <h1 className="font-display text-4xl text-foreground mb-4">
            Topic Not Found
          </h1>
          <p className="text-muted-foreground text-sm font-body mb-8 leading-relaxed">
            The requested topic could not be found in the archive. Check the topic name or explore all patterns.
          </p>
          <Link
            to="/topics"
            className="liquid-glass rounded-full px-8 py-3.5 text-sm font-medium text-foreground tracking-wider inline-flex items-center gap-2 hover:scale-[1.03] active:scale-[0.98] transition-transform cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>BACK TO TOPICS</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex-1 flex flex-col">
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb Navigation */}
        <nav className="mb-8" aria-label="Breadcrumb">
          <Link
            to="/topics"
            className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-neon-accent transition-colors group py-1.5 px-3 rounded-lg liquid-glass border border-white/5 hover:border-neon-accent/30"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span>BACK TO TOPICS</span>
          </Link>
        </nav>

        {/* Topic Header Card */}
        <header className="liquid-glass rounded-3xl p-6 sm:p-10 border border-white/10 mb-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2 text-xs font-mono text-neon-accent tracking-wider uppercase">
              <Layers size={14} />
              <span>ALGORITHM PATTERN</span>
            </div>
            <span className="font-mono text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-muted-foreground">
              {topic.problemCount} {topic.problemCount === 1 ? 'problem' : 'problems'}
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-foreground uppercase tracking-tight mb-4">
            {topic.name}
          </h1>

          <p className="text-muted-foreground text-sm sm:text-base font-body leading-relaxed max-w-2xl">
            All LeetCode challenges in DEV.LAB solved using {topic.name} techniques, patterns, and principles.
          </p>

          <div className="flex items-center gap-4 mt-8 pt-6 border-t border-white/10 text-xs font-mono text-muted-foreground">
            <div className="flex items-center gap-2">
              <Code2 size={14} className="text-neon-accent" />
              <span>Showing {problems.length} solved problems</span>
            </div>
          </div>
        </header>

        {/* Problems Grid */}
        <section aria-label={`${topic.name} Problems`}>
          <div className="flex items-center justify-between mb-6 px-1">
            <h2 className="font-mono text-xs uppercase tracking-widest text-foreground font-semibold">
              PROBLEMS IN THIS TOPIC
            </h2>
            <Link
              to={`/problems?topic=${encodeURIComponent(topic.name)}`}
              className="text-xs font-mono text-neon-accent hover:underline"
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
            <div className="liquid-glass rounded-2xl p-12 text-center border border-white/10">
              <p className="text-muted-foreground text-sm">
                No problems found specifically linked to this topic.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};
