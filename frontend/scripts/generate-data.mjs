/**
 * DEV.LAB — Build-Time LeetHub Data Pipeline
 * 
 * READ-ONLY SCANNER:
 * Reads source data from ../problems/ (LeetHub Neo automated directory).
 * NEVER modifies, renames, deletes, or writes to ../problems/.
 * Generates typed data artifacts into frontend/src/generated/.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure paths are resolved reliably
const PROBLEMS_DIR = path.resolve(__dirname, '../../problems');
const OUTPUT_DIR = path.resolve(__dirname, '../src/generated');

if (!fs.existsSync(PROBLEMS_DIR)) {
  console.error(`[Error] Problems directory not found at: ${PROBLEMS_DIR}`);
  process.exit(1);
}

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log('='.repeat(60));
console.log('⚡ DEV.LAB — DATA INGESTION PIPELINE (READ-ONLY)');
console.log(`📁 Source directory : ${PROBLEMS_DIR}`);
console.log(`📦 Output directory : ${OUTPUT_DIR}`);
console.log('='.repeat(60));

// --- 1. PARSE TOPICS FROM problems/Topics/*/problems.json ---
console.log('\n[1/4] Scanning Topics directory...');
const topicsDir = path.join(PROBLEMS_DIR, 'Topics');
const topicIndexList = [];
const problemToTopicsMap = new Map(); // problemName -> Set<string> of topic names

if (fs.existsSync(topicsDir)) {
  const topicFolders = fs.readdirSync(topicsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  for (const topicSlug of topicFolders) {
    const topicJsonPath = path.join(topicsDir, topicSlug, 'problems.json');
    if (fs.existsSync(topicJsonPath)) {
      try {
        const rawContent = fs.readFileSync(topicJsonPath, 'utf8');
        const data = JSON.parse(rawContent);
        const topicName = data.topic?.name || topicSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        const problems = data.problems || [];

        const problemNames = [];
        for (const p of problems) {
          const pName = p.problemName || p.folderPath?.replace(/^problems\//, '').replace(/\/$/, '') || p.slug;
          if (pName) {
            problemNames.push(pName);
            if (!problemToTopicsMap.has(pName)) {
              problemToTopicsMap.set(pName, new Set());
            }
            problemToTopicsMap.get(pName).add(topicName);
          }
        }

        topicIndexList.push({
          name: topicName,
          slug: topicSlug,
          problemCount: problemNames.length,
          problems: problemNames,
        });
      } catch (err) {
        console.warn(`[Warning] Could not parse topic JSON for ${topicSlug}:`, err.message);
      }
    }
  }
}

// Sort topics alphabetically
topicIndexList.sort((a, b) => a.name.localeCompare(b.name));
console.log(`✓ Discovered ${topicIndexList.length} topics from problems/Topics/`);

// --- 2. PARSE PROBLEMS DIRECTORY (0001-two-sum, etc.) ---
console.log('\n[2/4] Scanning Problems directory...');
const problemFolders = fs.readdirSync(PROBLEMS_DIR, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory() && /^\d{4}-/.test(dirent.name))
  .map(dirent => dirent.name)
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

console.log(`✓ Discovered ${problemFolders.length} problem directories`);

const problemsIndex = [];
const problemsDetailMap = {};

function detectLanguage(extension) {
  switch (extension.toLowerCase()) {
    case '.java': return 'Java';
    case '.py': return 'Python';
    case '.cpp':
    case '.cc':
    case '.cxx': return 'C++';
    case '.c': return 'C';
    case '.ts': return 'TypeScript';
    case '.js': return 'JavaScript';
    case '.go': return 'Go';
    case '.rs': return 'Rust';
    case '.kt': return 'Kotlin';
    case '.cs': return 'C#';
    default: return extension.replace('.', '').toUpperCase();
  }
}

function titleCaseSlug(slug) {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

for (const dirName of problemFolders) {
  const problemFolderAbs = path.join(PROBLEMS_DIR, dirName);
  const numericId = parseInt(dirName.slice(0, 4), 10);
  const slugFromDir = dirName.slice(5);

  let frontendId = String(numericId);
  let title = titleCaseSlug(slugFromDir);
  let slug = slugFromDir;
  let difficulty = 'Medium';
  let leetcodeUrl = `https://leetcode.com/problems/${slugFromDir}/`;
  let descriptionHtml = '';
  let examples = [];
  let constraints = [];

  // Read README.md
  const readmePath = path.join(problemFolderAbs, 'README.md');
  const readmeRelativePath = `problems/${dirName}/README.md`;

  if (fs.existsSync(readmePath)) {
    const readmeContent = fs.readFileSync(readmePath, 'utf8');

    // Parse header: <h2><a href="https://leetcode.com/problems/two-sum/">1. Two Sum</a></h2><h3>Easy</h3><hr>
    const headerRegex = /<h2><a\s+href="([^"]+)">\s*(\d+)\.\s*([^<]+)<\/a><\/h2>\s*<h3>\s*([^<]+)\s*<\/h3>/i;
    const headerMatch = readmeContent.match(headerRegex);

    if (headerMatch) {
      leetcodeUrl = headerMatch[1].trim();
      frontendId = headerMatch[2].trim();
      title = headerMatch[3].trim();
      const rawDifficulty = headerMatch[4].trim();
      if (['Easy', 'Medium', 'Hard'].includes(rawDifficulty)) {
        difficulty = rawDifficulty;
      }
    }

    // Extract Description (content after <hr>)
    const hrIndex = readmeContent.indexOf('<hr>');
    if (hrIndex !== -1) {
      descriptionHtml = readmeContent.slice(hrIndex + 4).trim();
    } else {
      descriptionHtml = readmeContent.trim();
    }

    // Extract Examples
    const exampleRegex = /<strong class="example">Example \d+:<\/strong>[\s\S]*?<pre>([\s\S]*?)<\/pre>/gi;
    let match;
    while ((match = exampleRegex.exec(descriptionHtml)) !== null) {
      examples.push(match[1].trim());
    }

    // Extract Constraints
    const constraintsRegex = /<strong>Constraints:<\/strong>[\s\S]*?<ul>([\s\S]*?)<\/ul>/i;
    const constraintsMatch = descriptionHtml.match(constraintsRegex);
    if (constraintsMatch) {
      const liMatches = constraintsMatch[1].match(/<li>(.*?)<\/li>/gi);
      if (liMatches) {
        constraints = liMatches.map(li => li.replace(/<\/?li>/gi, '').trim());
      }
    }
  }

  // Scan Solution files in problem directory
  const filesInDir = fs.readdirSync(problemFolderAbs);
  const solutions = [];
  const knownExtensions = ['.java', '.py', '.cpp', '.cc', '.c', '.ts', '.js', '.go', '.rs', '.kt', '.cs'];

  for (const file of filesInDir) {
    const ext = path.extname(file);
    if (knownExtensions.includes(ext.toLowerCase())) {
      const solutionFilePath = path.join(problemFolderAbs, file);
      try {
        const codeContent = fs.readFileSync(solutionFilePath, 'utf8');
        solutions.push({
          language: detectLanguage(ext),
          filename: file,
          path: `problems/${dirName}/${file}`,
          code: codeContent,
        });
      } catch (err) {
        console.warn(`[Warning] Could not read solution file ${file}:`, err.message);
      }
    }
  }

  // Associate topics
  const topicSet = problemToTopicsMap.get(dirName) || new Set();
  const topics = Array.from(topicSet).sort();

  const languages = Array.from(new Set(solutions.map(s => s.language)));

  const indexItem = {
    id: numericId,
    frontendId,
    title,
    slug,
    problemName: dirName,
    difficulty,
    topics,
    leetcodeUrl,
    folderPath: `problems/${dirName}/`,
    solutionCount: solutions.length,
    languages,
  };

  const detailItem = {
    ...indexItem,
    readmePath: readmeRelativePath,
    descriptionHtml,
    examples,
    constraints,
    solutions,
  };

  problemsIndex.push(indexItem);
  problemsDetailMap[slug] = detailItem;
}

// --- 3. PARSE SUMMARY & ACTIVITY (problems/README.md) ---
console.log('\n[3/4] Parsing LeetHub global summary...');
let summaryTotal = problemsIndex.length;
let summaryEasy = problemsIndex.filter(p => p.difficulty === 'Easy').length;
let summaryMedium = problemsIndex.filter(p => p.difficulty === 'Medium').length;
let summaryHard = problemsIndex.filter(p => p.difficulty === 'Hard').length;
let currentStreak = 0;
let bestStreak = 0;
let activeDays = 0;
const activityLog = [];
const topTags = [];

const globalReadmePath = path.join(PROBLEMS_DIR, 'README.md');
if (fs.existsSync(globalReadmePath)) {
  const content = fs.readFileSync(globalReadmePath, 'utf8');

  // Match Summary Table: | Total Solved | Easy | Medium | Hard | \n | ---: | ... | \n | 40 | 20 | 18 | 2 |
  const summaryTableMatch = content.match(/\|\s*Total Solved\s*\|\s*Easy\s*\|\s*Medium\s*\|\s*Hard\s*\|\s*\n\s*\|[^\n]+\|\s*\n\s*\|\s*(\d+)\s*\|\s*(\d+)\s*\|\s*(\d+)\s*\|\s*(\d+)\s*\|/i);
  if (summaryTableMatch) {
    const readmeTotal = parseInt(summaryTableMatch[1], 10);
    const readmeEasy = parseInt(summaryTableMatch[2], 10);
    const readmeMed = parseInt(summaryTableMatch[3], 10);
    const readmeHard = parseInt(summaryTableMatch[4], 10);

    // Consistency check between README summary and actual scanned directories
    if (readmeTotal !== summaryTotal) {
      console.warn(`[Discrepancy] README lists ${readmeTotal} total problems, but ${summaryTotal} directories were discovered. Discovered directories will be the source of truth.`);
    }

    summaryTotal = readmeTotal;
    summaryEasy = readmeEasy;
    summaryMedium = readmeMed;
    summaryHard = readmeHard;
  }

  // Match Streak Table: | Current Streak | Best Streak | Active Days |
  const streakMatch = content.match(/\|\s*Current Streak\s*\|\s*Best Streak\s*\|\s*Active Days\s*\|\s*\n\s*\|[^\n]+\|\s*\n\s*\|\s*(\d+)[^|]*\|\s*(\d+)[^|]*\|\s*(\d+)\s*\|/i);
  if (streakMatch) {
    currentStreak = parseInt(streakMatch[1], 10);
    bestStreak = parseInt(streakMatch[2], 10);
    activeDays = parseInt(streakMatch[3], 10);
  }

  // Match Activity Table: | Date | Problems |
  const activityMatches = content.matchAll(/\|\s*(\d{4}-\d{2}-\d{2})\s*\|\s*(\d+)\s*\|/g);
  for (const match of activityMatches) {
    activityLog.push({
      date: match[1],
      count: parseInt(match[2], 10),
    });
  }

  // Match Top Tags Table: | Tag | Problems | Coverage |
  const topTagsSection = content.match(/## Top Tags[\s\S]*?\|[^\n]+\|(\s*\n[\s\S]*?)##/i);
  if (topTagsSection) {
    const rows = topTagsSection[1].matchAll(/\|\s*([^|\n]+?)\s*\|\s*(\d+)\s*\|\s*([^|\n]+?)\s*\|/g);
    for (const row of rows) {
      const tag = row[1].trim();
      if (tag !== 'Tag' && !tag.includes('---')) {
        topTags.push({
          tag,
          count: parseInt(row[2], 10),
          coverage: row[3].trim(),
        });
      }
    }
  }
}

const summaryData = {
  total: summaryTotal,
  easy: summaryEasy,
  medium: summaryMedium,
  hard: summaryHard,
  currentStreak,
  bestStreak,
  activeDays,
  activity: activityLog,
  topTags,
  updatedAt: new Date().toISOString(),
};

// --- 4. WRITE GENERATED ARTIFACTS ---
console.log('\n[4/4] Writing generated JSON artifacts...');

const writeArtifact = (filename, data) => {
  const filePath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  const sizeKb = (fs.statSync(filePath).size / 1024).toFixed(2);
  console.log(`✓ ${filename.padEnd(22)} (${sizeKb} KB) -> ${filePath}`);
};

writeArtifact('summary.json', summaryData);
writeArtifact('problems-index.json', problemsIndex);
writeArtifact('problems-detail.json', problemsDetailMap);
writeArtifact('topics-index.json', topicIndexList);

console.log('\n' + '='.repeat(60));
console.log('🎉 DATA INGESTION COMPLETE');
console.log(`• Total Problems Scanned : ${problemsIndex.length}`);
console.log(`  - Easy   : ${summaryEasy}`);
console.log(`  - Medium : ${summaryMedium}`);
console.log(`  - Hard   : ${summaryHard}`);
console.log(`• Total Topics Scanned   : ${topicIndexList.length}`);
console.log(`• Activity Days Logged   : ${activityLog.length}`);
console.log('='.repeat(60));
