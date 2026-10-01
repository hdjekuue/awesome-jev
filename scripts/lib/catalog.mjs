import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const DATA_FILE = path.join(ROOT, 'data', 'entries.json');

/**
 * Where this repo lives, and where it is published. Override with env vars when
 * forking or mirroring — canonical URLs, JSON-LD and the sitemap are all derived
 * from these, and a mismatch with reality is the fastest way to lose SEO.
 */
export const OWNER = process.env.AWEJEV_OWNER || 'hdjekuue';
export const REPO_NAME = process.env.AWEJEV_REPO || 'awesome-jev';
export const REPO = `https://github.com/${OWNER}/${REPO_NAME}`;
export const SITE = `https://${OWNER}.github.io/${REPO_NAME}`;
export const SITE_BASE = `/${REPO_NAME}`;
export const DISCORD = 'https://discord.gg/typesafe';
export const DOCS = 'https://docs.typesafe.ai';

/**
 * Category ids are stored on each entry in data/entries.json. This table only
 * controls ordering, headings and blurbs, in all three languages. An entry whose
 * id is not listed here still renders — after the known ones — so a typo can
 * never silently drop a project.
 */
export const CATEGORIES = [
  {
    id: 'start-here',
    en: '🧭 Start Here',
    zh: '🧭 入门与心智模型',
    fr: '🧭 Pour commencer',
    slug: 'start-here',
    blurb: 'The spec sheet, the three primitives and the docs — read these before building.',
    blurbZh: '规格表、三个原语与官方文档——动手前先读这些。',
    blurbFr: 'La fiche technique, les trois primitives et la documentation — à lire avant de construire quoi que ce soit.',
  },
  {
    id: 'official',
    en: '🏛️ Official SDKs & Framework Support',
    zh: '🏛️ 官方 SDK 与框架支持',
    fr: '🏛️ SDK officiels et support framework',
    slug: 'official',
    blurb: 'Maintained by TypeSafe AI, plus the frameworks that ship Jev natively.',
    blurbZh: 'TypeSafe AI 官方维护，以及原生集成 Jev 的框架。',
    blurbFr: 'Maintenus par TypeSafe AI, plus les frameworks qui intègrent Jev nativement.',
  },
  {
    id: 'coding-agents',
    en: '🤖 Coding Agents',
    zh: '🤖 编码智能体',
    fr: '🤖 Agents de code',
    slug: 'coding-agents',
    blurb: 'Routers, tool gates, reviewers, skills and MCP servers for agent harnesses.',
    blurbZh: '面向 agent harness 的路由、工具门控、评审、技能与 MCP 服务。',
    blurbFr: 'Routage, garde-fous d\'outils, relecteurs, skills et serveurs MCP pour les harnais d\'agents.',
  },
  {
    id: 'routing',
    en: '🚦 Routing & Gateways',
    zh: '🚦 路由与网关',
    fr: '🚦 Routage et passerelles',
    slug: 'routing',
    blurb: 'Per-turn model and tool selection, behind a hard deadline.',
    blurbZh: '在硬性超时内逐轮选择模型与工具。',
    blurbFr: 'Choix du modèle et des outils à chaque tour, sous une échéance stricte.',
  },
  {
    id: 'context',
    en: '🗜️ Context & Compaction',
    zh: '🗜️ 上下文与压缩',
    fr: '🗜️ Contexte et compaction',
    slug: 'context',
    blurb: 'Decide what stays in the window before the model ever reads it.',
    blurbZh: '在模型读到之前，先决定上下文里留下什么。',
    blurbFr: 'Décidez ce qui reste dans la fenêtre avant que le modèle ne le lise.',
  },
  {
    id: 'code-review',
    en: '🔍 Code Review & Quality',
    zh: '🔍 代码评审与质量',
    fr: '🔍 Relecture de code et qualité',
    slug: 'code-review',
    blurb: 'Judges, linters, coverage gates and review dashboards.',
    blurbZh: '判官、linter、覆盖率门控与评审看板。',
    blurbFr: 'Juges, linters, seuils de couverture et tableaux de bord de relecture.',
  },
  {
    id: 'browser',
    en: '🌐 Browser & Computer Use',
    zh: '🌐 浏览器与计算机操作',
    fr: '🌐 Navigation et contrôle d\'ordinateur',
    slug: 'browser',
    blurb: 'Jev picks the operation and the DOM element; a small LLM only writes the text.',
    blurbZh: 'Jev 选操作与 DOM 元素，小模型只负责写字。',
    blurbFr: 'Jev choisit l\'opération et l\'élément DOM ; un petit LLM n\'écrit que le texte.',
  },
  {
    id: 'mobile',
    en: '📱 Mobile & Desktop Automation',
    zh: '📱 移动端与桌面自动化',
    fr: '📱 Automatisation mobile et bureau',
    slug: 'mobile',
    blurb: 'Driving phones, IM clients and native UIs without hooking or patching.',
    blurbZh: '不 hook、不改包地驱动手机、IM 客户端与原生界面。',
    blurbFr: 'Piloter téléphones, clients de messagerie et interfaces natives sans patch ni hook.',
  },
  {
    id: 'search-rag',
    en: '🔎 Search, Reranking & RAG',
    zh: '🔎 搜索、重排与 RAG',
    fr: '🔎 Recherche, reranking et RAG',
    slug: 'search-rag',
    blurb: 'Query understanding, source selection, reranking and semantic SQL.',
    blurbZh: '查询理解、来源选择、重排与语义 SQL。',
    blurbFr: 'Compréhension de requête, sélection de sources, reranking et SQL sémantique.',
  },
  {
    id: 'safety',
    en: '🛡️ Safety, Moderation & Verification',
    zh: '🛡️ 安全、审核与校验',
    fr: '🛡️ Sûreté, modération et vérification',
    slug: 'safety',
    blurb: 'Guardrails, prompt-injection checks, judges that abstain.',
    blurbZh: '护栏、提示注入检测、可弃权的判官。',
    blurbFr: 'Garde-fous, détection d\'injection de prompt, juges qui savent s\'abstenir.',
  },
  {
    id: 'data-ops',
    en: '🗄️ Data & Ops',
    zh: '🗄️ 数据与运维',
    fr: '🗄️ Données et exploitation',
    slug: 'data-ops',
    blurb: 'Postgres extensions, semantic SQL and telemetry pipelines that call Jev.',
    blurbZh: '会调用 Jev 的 Postgres 扩展、语义 SQL 与遥测管道。',
    blurbFr: 'Extensions Postgres, SQL sémantique et pipelines de télémétrie qui appellent Jev.',
  },
  {
    id: 'apps',
    en: '📦 Applications & Extensions',
    zh: '📦 应用与扩展',
    fr: '📦 Applications et extensions',
    slug: 'apps',
    blurb: 'End-user tools people actually open every day.',
    blurbZh: '真正每天会打开的终端产品。',
    blurbFr: 'Des outils de bout en bout que les gens ouvrent vraiment chaque jour.',
  },
  {
    id: 'clients',
    en: '🧩 SDKs & Community Clients',
    zh: '🧩 SDK 与社区客户端',
    fr: '🧩 SDK et clients communautaires',
    slug: 'clients',
    blurb: 'Unofficial clients for the languages without a first-party SDK.',
    blurbZh: '官方 SDK 未覆盖语言的社区客户端。',
    blurbFr: 'Clients non officiels pour les langages sans SDK officiel.',
  },
  {
    id: 'cli',
    en: '⌨️ Command Line',
    zh: '⌨️ 命令行',
    fr: '⌨️ Ligne de commande',
    slug: 'cli',
    blurb: 'Call Jev from a shell, no SDK required.',
    blurbZh: '直接在终端里调用 Jev，无需 SDK。',
    blurbFr: 'Appeler Jev depuis un shell, sans SDK.',
  },
  {
    id: 'benchmarks',
    en: '📊 Benchmarks, Evals & Calibration',
    zh: '📊 基准、评测与校准',
    fr: '📊 Benchmarks, évaluations et calibration',
    slug: 'benchmarks',
    blurb: 'Measure it before you trust it.',
    blurbZh: '先度量，再信任。',
    blurbFr: 'Mesurez avant de faire confiance.',
  },
  {
    id: 'open-models',
    en: '🧠 Open Models & Replicas',
    zh: '🧠 开源模型与复刻',
    fr: '🧠 Modèles ouverts et répliques',
    slug: 'open-models',
    blurb: 'Run System One semantics without the vendor — on a 3090 if you like.',
    blurbZh: '不依赖厂商也能跑 System One 语义——一块 3090 就够。',
    blurbFr: 'Exécuter la sémantique System One sans le fournisseur — sur une 3090 si vous voulez.',
  },
  {
    id: 'games',
    en: '🎮 Games, Robotics & Simulation',
    zh: '🎮 游戏、机器人与仿真',
    fr: '🎮 Jeux, robotique et simulation',
    slug: 'games',
    blurb: 'Decisions as game mechanics.',
    blurbZh: '把决策做成游戏机制。',
    blurbFr: 'Les décisions comme mécanique de jeu.',
  },
  {
    id: 'finance',
    en: '💹 Finance & Trading',
    zh: '💹 金融与交易',
    fr: '💹 Finance et trading',
    slug: 'finance',
    blurb: 'Scoring financial signals with calibrated probabilities.',
    blurbZh: '用校准概率给金融信号打分。',
    blurbFr: 'Noter des signaux financiers avec des probabilités calibrées.',
  },
  {
    id: 'demos',
    en: '🎪 Playgrounds & Demos',
    zh: '🎪 试验场与演示',
    fr: '🎪 Terrains de jeu et démos',
    slug: 'demos',
    blurb: 'Try it in thirty seconds.',
    blurbZh: '30 秒跑起来。',
    blurbFr: 'Essayez en trente secondes.',
  },
  {
    id: 'articles',
    en: '📰 Articles & Talks',
    zh: '📰 文章与分享',
    fr: '📰 Articles et conférences',
    slug: 'articles',
    blurb: 'Background reading and recorded talks.',
    blurbZh: '延伸阅读与录制分享。',
    blurbFr: 'Lectures de fond et conférences enregistrées.',
  },
];

export const CATEGORY_IDS = new Set(CATEGORIES.map((c) => c.id));

export const LANGS = ['en', 'zh', 'fr'];

export const LANG_META = {
  en: { label: 'English', native: 'English', ogLocale: 'en_US', dir: 'ltr' },
  zh: { label: 'Chinese', native: '中文', ogLocale: 'zh_CN', dir: 'ltr' },
  fr: { label: 'French', native: 'Français', ogLocale: 'fr_FR', dir: 'ltr' },
};

/** The three primitives, used by the README intro, the site and the FAQ schema. */
export const PRIMITIVES = [
  { name: 'choice', question: 'Pick one option from a list', returns: 'choice, probabilities, confidence', returnsZh: 'choice、probabilities、confidence', returnsFr: 'choice, probabilities, confidence' },
  { name: 'score', question: 'Rate the state against a rubric', returns: 'score, probabilities, confidence', returnsZh: 'score、probabilities、confidence', returnsFr: 'score, probabilities, confidence' },
  { name: 'noul', question: 'Is this statement true?', returns: 'noul (0–1)', returnsZh: 'noul（0–1）', returnsFr: 'noul (0–1)' },
];

export function loadEntries() {
  if (!fs.existsSync(DATA_FILE)) {
    throw new Error(`missing ${path.relative(ROOT, DATA_FILE)} — run scripts/import-seed.mjs first`);
  }
  const db = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  const seen = new Set();
  for (const e of db.entries) {
    if (!e.category) e.category = 'articles';
    const key = e.url.toLowerCase().replace(/\/$/, '');
    if (seen.has(key)) throw new Error(`duplicate url in data/entries.json: ${e.url}`);
    seen.add(key);
  }
  db.entries.sort((a, b) => (b.stars ?? -1) - (a.stars ?? -1));
  return db;
}

export function byCategory(entries) {
  const m = {};
  for (const e of entries) (m[e.category] ||= []).push(e);
  for (const k of Object.keys(m)) m[k].sort((a, b) => (b.stars ?? -1) - (a.stars ?? -1));
  return m;
}

/** Known categories that actually have entries, then any unknown ids, so nothing is hidden. */
export function orderedCategories(entries) {
  const m = byCategory(entries);
  const known = CATEGORIES.filter((c) => m[c.id]?.length);
  const extras = Object.keys(m)
    .filter((id) => !CATEGORY_IDS.has(id))
    .sort()
    .map((id) => ({ id, slug: id, en: id, zh: id, fr: id, blurb: '', blurbZh: '', blurbFr: '' }));
  return [...known, ...extras].map((c) => ({ ...c, items: m[c.id] || [] }));
}

export function desc(e, lang) {
  if (lang === 'zh') return e.descriptionZh || e.description;
  if (lang === 'fr') return e.descriptionFr || e.description;
  return e.description;
}

export function fmtStars(n) {
  if (n === null || n === undefined) return '—';
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function tags(e) {
  const bits = [];
  if (e.official) bits.push('official');
  if (e.language) bits.push(e.language.toLowerCase());
  if (e.license) bits.push(String(e.license).toLowerCase());
  if (e.archived) bits.push('archived');
  return bits;
}

export function totals(entries, updatedAt) {
  const live = entries.filter((e) => !e.archived);
  return {
    entries: entries.length,
    repos: entries.filter((e) => e.kind === 'repo').length,
    resources: entries.filter((e) => e.kind === 'resource').length,
    stars: live.reduce((a, e) => a + (e.stars || 0), 0),
    languages: new Set(entries.map((e) => e.language).filter(Boolean)).size,
    updated: updatedAt,
  };
}

export function isOpen(e) {
  return e.kind === 'repo' && e.stars !== null;
}