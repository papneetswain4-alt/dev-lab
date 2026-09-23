export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Solution {
  language: string;
  filename: string;
  path: string;
  code: string;
}

export interface ProblemIndexItem {
  id: number;
  frontendId: string;
  title: string;
  slug: string;
  problemName: string;
  difficulty: Difficulty;
  topics: string[];
  leetcodeUrl: string;
  folderPath: string;
  solutionCount: number;
  languages: string[];
}

export type Problem = ProblemIndexItem;

export interface ProblemDetail extends ProblemIndexItem {
  readmePath: string;
  descriptionHtml: string;
  examples: string[];
  constraints: string[];
  solutions: Solution[];
}

export interface TopicIndexItem {
  name: string;
  slug: string;
  problemCount: number;
  problems: string[]; // problemNames e.g. "0001-two-sum"
}

export type Topic = TopicIndexItem;

export interface ActivityDay {
  date: string;
  count: number;
}

export interface TopTag {
  tag: string;
  count: number;
  coverage: string;
}

export interface SummaryData {
  total: number;
  easy: number;
  medium: number;
  hard: number;
  currentStreak: number;
  bestStreak: number;
  activeDays: number;
  activity: ActivityDay[];
  topTags: TopTag[];
  updatedAt: string;
}

export type Summary = SummaryData;
