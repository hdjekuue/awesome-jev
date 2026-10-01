/**
 * catalog.mjs — the shared vocabulary of the directory, in three languages.
 *
 * This is the site build's view of `scripts/lib/catalog.mjs`: the same category
 * ids, the same entry data, rendered for a browser instead of for Markdown
 * tables. Keeping one source for the ids means a category renamed in the README
 * generator is renamed here too, or `verify.mjs` fails.
 */

import fs from 'node:fs';
import path from 'node:path';

/**
 * Resolved from cwd, not from import.meta.url. Astro bundles this module into
 * docs/.prerender/chunks/, so import.meta.url points inside the build output
 * directory and any path derived from it resolves to docs/data/entries.json —
 * a file that does not exist and never will. cwd is the project root for both
 * `astro build` and `node scripts/*.mjs`.
 */
export const ROOT = process.cwd();
export const DATA_FILE = path.join(ROOT, 'data', 'entries.json');

export const OWNER = process.env.AWEJEV_OWNER || 'hdjekuue';
export const REPO_NAME = process.env.AWEJEV_REPO || 'awesome-jev';
export const REPO = `https://github.com/${OWNER}/${REPO_NAME}`;
export const SITE = `https://${OWNER}.github.io/${REPO_NAME}`;
export const BASE = `/${REPO_NAME}`;
export const DISCORD = 'https://discord.gg/typesafe';
export const DOCS = 'https://docs.typesafe.ai';
export const API = 'https://api.typesafe.ai/v1/systemone';

export const LANGS = ['en', 'zh', 'fr'];

export const LANG_META = {
  en: { label: 'English', native: 'English', ogLocale: 'en_US', hreflang: 'en', dir: 'ltr' },
  zh: { label: 'Chinese', native: '中文', ogLocale: 'zh_CN', hreflang: 'zh_CN', dir: 'ltr' },
  fr: { label: 'French', native: 'Français', ogLocale: 'fr_FR', hreflang: 'fr_FR', dir: 'ltr' },
};

export const PATH_FOR = { en: '/', zh: '/zh/', fr: '/fr/' };

/**
 * Categories, in decision-table order. `stamp` is the rule number printed in the
 * condition column — three digits, memorable enough to cite ("rule 214"), which
 * is how a decision table is actually referred to in the field.
 */
export const CATEGORIES = [
  { id: 'start-here', stamp: '001', en: 'Start Here', zh: '入门与心智模型', fr: 'Pour commencer',
    blurb: 'The spec sheet, the three primitives and the docs — read these before building.',
    blurbZh: '规格表、三个原语与官方文档——动手前先读这些。',
    blurbFr: 'La fiche technique, les trois primitives et la documentation — à lire avant de construire quoi que ce soit.' },
  { id: 'official', stamp: '011', en: 'Official SDKs & Framework Support', zh: '官方 SDK 与框架支持', fr: 'SDK officiels et support framework',
    blurb: 'Maintained by TypeSafe AI, plus the frameworks that ship Jev natively.',
    blurbZh: 'TypeSafe AI 官方维护，以及原生集成 Jev 的框架。',
    blurbFr: 'Maintenus par TypeSafe AI, plus les frameworks qui intègrent Jev nativement.' },
  { id: 'coding-agents', stamp: '104', en: 'Coding Agents', zh: '编码智能体', fr: 'Agents de code',
    blurb: 'Routers, tool gates, reviewers, skills and MCP servers for agent harnesses.',
    blurbZh: '面向 agent harness 的路由、工具门控、评审、技能与 MCP 服务。',
    blurbFr: 'Routage, garde-fous d\'outils, relecteurs, skills et serveurs MCP pour les harnais d\'agents.' },
  { id: 'routing', stamp: '118', en: 'Routing & Gateways', zh: '路由与网关', fr: 'Routage et passerelles',
    blurb: 'Per-turn model and tool selection, under a hard deadline.',
    blurbZh: '在硬性超时内逐轮选择模型与工具。',
    blurbFr: 'Choix du modèle et des outils à chaque tour, sous une échéance stricte.' },
  { id: 'context', stamp: '131', en: 'Context & Compaction', zh: '上下文与压缩', fr: 'Contexte et compaction',
    blurb: 'Decide what stays in the window before the model ever reads it.',
    blurbZh: '在模型读到之前，先决定上下文里留下什么。',
    blurbFr: 'Décidez ce qui reste dans la fenêtre avant que le modèle ne le lise.' },
  { id: 'code-review', stamp: '147', en: 'Code Review & Quality', zh: '代码评审与质量', fr: 'Relecture de code et qualité',
    blurb: 'Judges, linters, coverage gates and review dashboards.',
    blurbZh: '判官、linter、覆盖率门控与评审看板。',
    blurbFr: 'Juges, linters, seuils de couverture et tableaux de bord de relecture.' },
  { id: 'browser', stamp: '152', en: 'Browser & Computer Use', zh: '浏览器与计算机操作', fr: 'Navigation et contrôle d\'ordinateur',
    blurb: 'Jev picks the operation and the DOM element; a small LLM only writes the text.',
    blurbZh: 'Jev 选操作与 DOM 元素，小模型只负责写字。',
    blurbFr: 'Jev choisit l\'opération et l\'élément DOM ; un petit LLM n\'écrit que le texte.' },
  { id: 'mobile', stamp: '158', en: 'Mobile & Desktop Automation', zh: '移动端与桌面自动化', fr: 'Automatisation mobile et bureau',
    blurb: 'Driving phones, IM clients and native UIs without hooking or patching.',
    blurbZh: '不 hook、不改包地驱动手机、IM 客户端与原生界面。',
    blurbFr: 'Piloter téléphones, clients de messagerie et interfaces natives sans patch ni hook.' },
  { id: 'search-rag', stamp: '163', en: 'Search, Reranking & RAG', zh: '搜索、重排与 RAG', fr: 'Recherche, reranking et RAG',
    blurb: 'Query understanding, source selection, reranking and semantic SQL.',
    blurbZh: '查询理解、来源选择、重排与语义 SQL。',
    blurbFr: 'Compréhension de requête, sélection de sources, reranking et SQL sémantique.' },
  { id: 'safety', stamp: '179', en: 'Safety, Moderation & Verification', zh: '安全、审核与校验', fr: 'Sûreté, modération et vérification',
    blurb: 'Guardrails, prompt-injection checks, judges that abstain.',
    blurbZh: '护栏、提示注入检测、可弃权的判官。',
    blurbFr: 'Garde-fous, détection d\'injection de prompt, juges qui savent s\'abstenir.' },
  { id: 'data-ops', stamp: '185', en: 'Data & Ops', zh: '数据与运维', fr: 'Données et exploitation',
    blurb: 'Postgres extensions, semantic SQL and telemetry pipelines that call Jev.',
    blurbZh: '会调用 Jev 的 Postgres 扩展、语义 SQL 与遥测管道。',
    blurbFr: 'Extensions Postgres, SQL sémantique et pipelines de télémétrie qui appellent Jev.' },
  { id: 'apps', stamp: '191', en: 'Applications & Extensions', zh: '应用与扩展', fr: 'Applications et extensions',
    blurb: 'End-user tools people actually open every day.',
    blurbZh: '真正每天会打开的终端产品。',
    blurbFr: 'Des outils de bout en bout que les gens ouvrent vraiment chaque jour.' },
  { id: 'clients', stamp: '205', en: 'SDKs & Community Clients', zh: 'SDK 与社区客户端', fr: 'SDK et clients communautaires',
    blurb: 'Unofficial clients for the languages without a first-party SDK.',
    blurbZh: '官方 SDK 未覆盖语言的社区客户端。',
    blurbFr: 'Clients non officiels pour les langages sans SDK officiel.' },
  { id: 'cli', stamp: '217', en: 'Command Line', zh: '命令行', fr: 'Ligne de commande',
    blurb: 'Call Jev from a shell, no SDK required.',
    blurbZh: '直接在终端里调用 Jev，无需 SDK。',
    blurbFr: 'Appeler Jev depuis un shell, sans SDK.' },
  { id: 'benchmarks', stamp: '223', en: 'Benchmarks, Evals & Calibration', zh: '基准、评测与校准', fr: 'Benchmarks, évaluations et calibration',
    blurb: 'Measure it before you trust it.',
    blurbZh: '先度量，再信任。',
    blurbFr: 'Mesurez avant de faire confiance.' },
  { id: 'open-models', stamp: '229', en: 'Open Models & Replicas', zh: '开源模型与复刻', fr: 'Modèles ouverts et répliques',
    blurb: 'Run System One semantics without the vendor — on a 3090 if you like.',
    blurbZh: '不依赖厂商也能跑 System One 语义——一块 3090 就够。',
    blurbFr: 'Exécuter la sémantique System One sans le fournisseur — sur une 3090 si vous voulez.' },
  { id: 'games', stamp: '236', en: 'Games, Robotics & Simulation', zh: '游戏、机器人与仿真', fr: 'Jeux, robotique et simulation',
    blurb: 'Decisions as game mechanics.',
    blurbZh: '把决策做成游戏机制。',
    blurbFr: 'Les décisions comme mécanique de jeu.' },
  { id: 'finance', stamp: '242', en: 'Finance & Trading', zh: '金融与交易', fr: 'Finance et trading',
    blurb: 'Scoring financial signals with calibrated probabilities.',
    blurbZh: '用校准概率给金融信号打分。',
    blurbFr: 'Noter des signaux financiers avec des probabilités calibrées.' },
  { id: 'demos', stamp: '248', en: 'Playgrounds & Demos', zh: '试验场与演示', fr: 'Terrains de jeu et démos',
    blurb: 'Try it in thirty seconds.',
    blurbZh: '30 秒跑起来。',
    blurbFr: 'Essayez en trente secondes.' },
  { id: 'articles', stamp: '253', en: 'Articles & Talks', zh: '文章与分享', fr: 'Articles et conférences',
    blurb: 'Background reading and recorded talks.',
    blurbZh: '延伸阅读与录制分享。',
    blurbFr: 'Lectures de fond et conférences enregistrées.' },
];

export const CATEGORY_BY_ID = new Map(CATEGORIES.map((c) => [c.id, c]));

export const PRIMITIVES = [
  {
    name: 'choice',
    q: { en: 'Pick one option from a list', zh: '从列表中选一个', fr: 'Choisir une option dans une liste' },
    r: { en: 'choice · probabilities · confidence', zh: 'choice · probabilities · confidence', fr: 'choice · probabilities · confidence' },
    marks: ['billing', 'technical', 'other'],
  },
  {
    name: 'score',
    q: { en: 'Rate the state against a rubric', zh: '按评分标准给状态打分', fr: 'Noter l\'état selon une grille' },
    r: { en: 'score · probabilities · confidence', zh: 'score · probabilities · confidence', fr: 'score · probabilities · confidence' },
    marks: ['poor', 'fair', 'good', 'excellent'],
  },
  {
    name: 'noul',
    q: { en: 'Is this statement true?', zh: '这句话是真的吗？', fr: 'Cette affirmation est-elle vraie ?' },
    r: { en: 'noul (0–1)', zh: 'noul（0–1）', fr: 'noul (0–1)' },
    marks: ['is a chargeback', 'mentions a court', 'signed by a minor'],
  },
];

export function load() {
  const db = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  const byCat = new Map(CATEGORIES.map((c) => [c.id, []]));
  const orphans = [];
  for (const e of db.entries) {
    (byCat.get(e.category) ?? orphans).push(e);
  }
  for (const list of byCat.values()) list.sort((a, b) => (b.stars ?? -1) - (a.stars ?? -1));
  orphans.sort((a, b) => (b.stars ?? -1) - (a.stars ?? -1));
  return { db, byCat, orphans, updated: db.updatedAt, entries: db.entries };
}

export function stats(entries, updated) {
  const live = entries.filter((e) => !e.archived);
  return {
    entries: entries.length,
    repos: entries.filter((e) => e.kind === 'repo').length,
    resources: entries.filter((e) => e.kind === 'resource').length,
    stars: live.reduce((a, e) => a + (e.stars || 0), 0),
    languages: new Set(entries.map((e) => e.language).filter(Boolean)).size,
    categories: CATEGORIES.length,
    official: entries.filter((e) => e.official).length,
    updated,
  };
}

export function desc(e, lang) {
  if (lang === 'zh') return e.descriptionZh || e.description;
  if (lang === 'fr') return e.descriptionFr || e.description;
  return e.description;
}

export function catLabel(c, lang) {
  return c[lang] || c.en;
}

export function catBlurb(c, lang) {
  return lang === 'zh' ? c.blurbZh : lang === 'fr' ? c.blurbFr : c.blurb;
}

export function fmtStars(n) {
  if (n === null || n === undefined) return '—';
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

/**
 * Star magnitude as a 0–3 weight class. Magnitude lands on type weight and rule
 * weight, never on hue — the decision-table discipline from the direction.
 */
export function weightClass(n) {
  if (n === null || n === undefined) return 'w0';
  if (n >= 3000) return 'w3';
  if (n >= 500) return 'w2';
  if (n >= 50) return 'w1';
  return 'w0';
}