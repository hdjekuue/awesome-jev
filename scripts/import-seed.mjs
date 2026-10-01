#!/usr/bin/env node
/**
 * import-seed.mjs — one-off seed builder.
 * Reads a community projects.json dump (CC0) and emits data/entries.json in this
 * repo's canonical schema. Kept in-repo so the seed is reproducible and auditable.
 *
 * Usage: node scripts/import-seed.mjs <projects.json>
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'data', 'entries.json');

const src = process.argv[2];
if (!src) {
  console.error('usage: node scripts/import-seed.mjs <projects.json>');
  process.exit(1);
}
const raw = JSON.parse(fs.readFileSync(src, 'utf8'));
const entries = raw.entries || raw.projects || [];

// Upstream section name -> this repo's category id.
const CATEGORY = {
  'Start here': 'start-here',
  'Jev on one screen': 'start-here',
  'Know before you build': 'start-here',
  'Official SDKs and framework support': 'official',
  'Coding agents': 'coding-agents',
  'Browser and computer use': 'browser',
  'Open models and replicas': 'open-models',
  'Code review and quality': 'code-review',
  'Routing and gateways': 'routing',
  'Search, reranking and RAG': 'search-rag',
  'Data and ops': 'data-ops',
  'Safety, moderation and verification': 'safety',
  'Applications and extensions': 'apps',
  'Games, robotics and simulation': 'games',
  'Finance and trading': 'finance',
  'Benchmarks, evals and calibration': 'benchmarks',
  'Playgrounds and demos': 'demos',
  'Command line': 'cli',
  'Community clients': 'clients',
  'Articles and talks': 'articles',
};

// Hand-curated zh descriptions for the entries a newcomer meets first.
const DESC_ZH = {
  'typesafe-ai': 'TypeSafe AI 官网、waitlist 与产品总览',
  'typesafe-sdk-js': '官方 TypeScript/JavaScript 客户端，答案类型由问题自动推导（npm install @typesafe-ai/sdk）',
  'typesafe-sdk-python': '官方同步 + 异步 Python 客户端（pip install typesafe-sdk）',
  'system-one-adapter-python': '官方 TypeSafeClient 替代实现，底层走 OpenAI/Anthropic 等 LLM，用来和对话模型做 Jev 对照实验',
  'skills': '官方 agent skill：原语、模式与评测写法',
  'introduction': '两页讲清心智模型：state + typed questions 进，typed answers + probabilities 出',
  'quickstart': '从一个 API key 走到第一个类型化决策的最短路径',
  'primitives': 'Choice、Score、Noul 三种问题类型各自返回什么',
  'patterns': '投机式 fan-out、置信度门控路由、组合打分、意图路由',
  'api': 'POST /v1/systemone 的请求与响应契约',
  'cookbooks': '可复现配方：并行提问、重排、护栏、引用校验、抽取、层次化分类',
  'playground': '在浏览器里粘贴 state、加问题、看类型化答案',
  'evals': 'System One 工作流的公开评测方法与逐模型结果',
  'jev-1.13': '当前公开模型 Jev 1.13 已知失败模式（官方自述）',
  'smart-home': '官方投机式 fan-out 交互演示：一次调用多问，代码只留相关答案',
  'introducing-system-one-models-and-jev': '发布文：架构、RLCD 训练、定价、Doom 与 Wikiracing 演示、FAQ',
  'manifesto': '为软件而生的机器原生智能，而不是为对话而生',
  'discord': 'TypeSafe 官方 Discord',
  'typesafe-ai-x': '@typesafeai — 产品与研究更新',
  'jencode': 'Jev 编码示例',
  'understanding-jev': '理解 Jev 的工作方式',
  'structure': 'System One 的内部结构',
  'how-jev-works': 'Jev 内部工作原理解析',
  'system-one-adapter-python-npm': 'System One 适配器（npm 视角）',
};

function slug(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function pickLang(e) {
  return e.github?.language || e.languageHint || null;
}

function pickLicense(e) {
  return e.github?.license || null;
}

const out = [];
const seen = new Set();

for (const e of entries) {
  const url = e.url || '';
  const gh = e.github;
  const isRepo = url.startsWith('https://github.com/');
  // Keep GitHub repos + official docs/resources; drop bare live sites and threads
  // that duplicate a repo, and drop anything already listed.
  if (!gh && !/^https:\/\/(docs|console|evals|typesafe)\.typesafe\.ai/.test(url)) continue;
  const key = gh ? `${e.owner}/${e.repo}`.toLowerCase() : url;
  if (seen.has(key)) continue;
  seen.add(key);

  const name = gh ? `${e.owner}/${e.repo}` : e.name;
  out.push({
    id: gh ? `${slug(e.owner)}--${slug(e.repo)}` : slug(e.name) || slug(url),
    name,
    url,
    kind: gh ? 'repo' : 'resource',
    description: (e.description || '').replace(/\s+/g, ' ').trim(),
    descriptionZh: DESC_ZH[e.id] || DESC_ZH[name] || null,
    category: CATEGORY[e.section] || 'articles',
    upstreamSection: e.section || null,
    language: pickLang(e),
    license: pickLicense(e),
    stars: gh?.stars ?? null,
    forks: gh?.forks ?? null,
    topics: (gh?.topics || []).slice(0, 6),
    official: /^https:\/\//.test(url) && /typesafe\.ai/.test(url) ? true : !!gh && e.owner === 'typesafe-ai',
    archived: gh?.archived ?? false,
    pushedAt: gh?.pushedAt ? gh.pushedAt.slice(0, 10) : null,
    intents: e.jev?.intents
      ? Object.entries(e.jev.intents)
          .filter(([, v]) => v >= 0.45)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([k]) => k)
      : [],
    firstSeen: e.firstSeen || null,
    source: e.url,
  });
}

out.sort((a, b) => (b.stars ?? -1) - (a.stars ?? -1));

const counts = {};
for (const e of out) counts[e.category] = (counts[e.category] || 0) + 1;

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify({ version: 1, updatedAt: new Date().toISOString().slice(0, 10), entries: out }, null, 2) + '\n');
console.log(`wrote ${out.length} entries -> ${path.relative(ROOT, OUT)}`);
console.log(counts);