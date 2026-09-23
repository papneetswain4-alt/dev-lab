/**
 * DEV.LAB — Repository Data Access Service
 * 
 * Provides clean, type-safe query interfaces over the generated
 * LeetHub data artifacts. Keeps UI components decoupled from JSON files.
 */

import type {
  Summary,
  Problem,
  ProblemDetail,
  Topic,
} from '../types/dsa';

import rawSummary from '../generated/summary.json';
import rawProblemsIndex from '../generated/problems-index.json';
import rawProblemsDetail from '../generated/problems-detail.json';
import rawTopicsIndex from '../generated/topics-index.json';

// Strongly typed cached instances
const summary: Summary = rawSummary as Summary;
const problems: Problem[] = rawProblemsIndex as Problem[];
const problemsDetailMap: Record<string, ProblemDetail> = rawProblemsDetail as unknown as Record<string, ProblemDetail>;
const topics: Topic[] = rawTopicsIndex as Topic[];

/**
 * Returns overall LeetHub statistics, streaks, and activity days.
 */
export function getSummary(): Summary {
  return summary;
}

/**
 * Returns the full lightweight problem catalog for grids, search, and filters.
 */
export function getProblems(): Problem[] {
  return problems;
}

/**
 * Looks up a problem by its slug or problem name.
 * Returns full ProblemDetail including README description HTML, examples, constraints, and solutions.
 */
export function getProblemBySlug(slug: string): ProblemDetail | undefined {
  if (!slug) return undefined;
  
  // 1. Direct exact slug lookup
  if (problemsDetailMap[slug]) {
    return problemsDetailMap[slug];
  }

  // 2. Case-insensitive and URL-decoded lookup
  const decoded = decodeURIComponent(slug).trim().toLowerCase();
  if (problemsDetailMap[decoded]) {
    return problemsDetailMap[decoded];
  }

  // 3. Lookup by slug, folder name (problemName), or frontendId/numerical ID fallback
  const match = Object.values(problemsDetailMap).find(
    (p) =>
      p.slug.toLowerCase() === decoded ||
      p.problemName.toLowerCase() === decoded ||
      p.frontendId.toLowerCase() === decoded ||
      String(p.id) === decoded
  );

  return match;
}

/**
 * Returns all discovered DSA topics with problem counts and associations.
 */
export function getTopics(): Topic[] {
  return topics;
}

/**
 * Looks up a topic by its slug or name.
 */
export function getTopicBySlug(slugOrName: string): Topic | undefined {
  if (!slugOrName) return undefined;
  const normalized = decodeURIComponent(slugOrName).trim().toLowerCase();
  return topics.find(
    (t) =>
      t.slug.toLowerCase() === normalized ||
      t.name.toLowerCase() === normalized ||
      t.name.toLowerCase().replace(/\s+/g, '-') === normalized
  );
}

/**
 * Returns all problems associated with a specific topic (by name or slug).
 */
export function getProblemsByTopic(topicSlugOrName: string): Problem[] {
  if (!topicSlugOrName) return [];
  const normalized = topicSlugOrName.toLowerCase().trim();

  return problems.filter(p =>
    p.topics.some(
      t => t.toLowerCase() === normalized || t.toLowerCase().replace(/\s+/g, '-') === normalized
    )
  );
}

/**
 * Returns full Problem objects associated with a given Topic.
 */
export function getProblemsForTopic(topic: Topic): Problem[] {
  if (!topic) return [];
  const normalizedName = topic.name.toLowerCase();
  const normalizedSlug = topic.slug.toLowerCase();

  return problems.filter((p) => {
    if (topic.problems && topic.problems.includes(p.problemName)) {
      return true;
    }
    return p.topics.some(
      (t) =>
        t.toLowerCase() === normalizedName ||
        t.toLowerCase().replace(/\s+/g, '-') === normalizedSlug
    );
  });
}
