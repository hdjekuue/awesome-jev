#!/usr/bin/env node
/**
 * site/build.mjs — generates everything under docs/ from data/entries.json.
 *
 * Two audiences, one source of truth:
 *
 *   Humans  → docs/, docs/zh/, docs/fr/   trilingual HTML site
 *   Crawlers→ sitemap.xml, robots.txt, JSON-LD inside the HTML
 *   Models  → llms.txt, llms-full.txt, c/<section>.md, skill.md, projects.json
 *
 * The AI-readable artifacts are the point of "AIEO": a model asked "what is
 * built on Jev for context compaction?" can fetch one small file and get a
 * correct, citable answer instead of scraping a 400 KB README.
 *
 *   node site/build.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import {
  ROOT, SITE, SITE_BASE, REPO, DISCORD, DOCS,
  LANGS, LANG_META, CATEGORIES, PRIMITIVES,
  loadEntries, orderedCategories, desc, fmtStars, tags, totals, byCategory,
} from '../scripts/lib/catalog.mjs';

const OUT = path.join(ROOT, 'docs');

/* ------------------------------------------------------------------ utils */

const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const escAttr = esc;

/** GitHub-flavoured heading anchor, close enough for our own generated titles. */
const anchor = (s) => String(s)
  .toLowerCase()
  .replace(/[`*_~]/g, '')
  .replace(/[^\p{L}\p{N}\s-]/gu, '')
  .trim()
  .replace(/\s+/g, '-');

const PATH_FOR = { en: '/', zh: '/zh/', fr: '/fr/' };

const COPY = {
  en: {
    langSwitchLabel: 'Language',
    heroTagline: 'Everything is a Decision.',
    about: 'The definitive, self-updating directory of everything built on Jev — TypeSafe AI’s System One model, the first model that answers with typed judgments and calibrated probabilities instead of prose.',
    ctaStar: '⭐ Star on GitHub',
    ctaSubmit: 'Submit a project',
    ctaSource: 'Source data',
    stats: 'At a glance',
    directory: 'The directory',
    faqTitle: 'FAQ',
    curated: 'How this list is curated',
    curatedText: 'One data file, deterministic scripts and a free-AI reviewer. Stars and licenses refresh from the GitHub API on a schedule; every entry is link-checked before it ships. No API keys, no paid placement.',
    starMilestone: 'Milestone: 0 → 100 stars. As we get close, notable entries get pinned at the top.',
    share: 'Share',
    footerNote: 'Community-maintained. Not affiliated with TypeSafe AI.',
    entriesUnit: (n) => `${n} ${n === 1 ? 'entry' : 'entries'}`,
    langNames: { en: 'English', zh: '中文', fr: 'Français' },
    faq: [
      ['What exactly is Jev?', 'Jev is TypeSafe AI’s System One model. You send a state plus typed questions, and it returns typed answers with per-option probabilities and a confidence value.'],
      ['How is this different from asking an LLM to choose an option?', 'An LLM returns text you have to parse. Jev returns a typed choice plus a probability distribution, so you can set a threshold, unit-test the branch and log a number.'],
      ['Do I need a TypeSafe API key?', 'Only for the hosted API. The Open Models & Replicas category runs System One semantics on open weights.'],
      ['How do I get my project listed?', 'Open a pull request against data/entries.json, or add the jev topic to your repository and open an issue.'],
      ['Is this list affiliated with TypeSafe AI?', 'No. It is community-maintained. TypeSafe AI is linked because Jev is their model.'],
      ['Can I use this data in my own tool?', 'Yes. Everything here is CC0-1.0 public domain. Fetch projects.json or llms-full.txt.'],
    ],
  },
  zh: {
    langSwitchLabel: '语言',
    heroTagline: '万物皆决策。',
    about: '关于 Jev（TypeSafe AI 的 System One 模型）构建的一切——终极、持续自动更新的精选目录。Jev 是第一个直接返回类型化判断与校准概率、而不是自然语言的模型。',
    ctaStar: '⭐ 去点 Star',
    ctaSubmit: '提交项目',
    ctaSource: '源数据',
    stats: '数字概览',
    directory: '项目目录',
    faqTitle: '常见问题',
    curated: '这份清单是怎么打理的',
    curatedText: '一个数据文件 + 确定性脚本 + 一个免费 AI 评审员。星标与许可由 GitHub API 定时刷新，每条上线前都会做链接校验。无需 API key，没有付费置顶。',
    starMilestone: '里程碑：0 → 100 stars。接近时，受关注的条目会在首页置顶。',
    share: '分享',
    footerNote: '社区维护，与 TypeSafe AI 无隶属关系。',
    entriesUnit: (n) => `${n} 项`,
    langNames: { en: 'English', zh: '中文', fr: 'Français' },
    faq: [
      ['Jev 到底是什么？', 'TypeSafe AI 的 System One 模型：发一个 state 加类型化问题，回来的是带概率与置信度的类型化答案。'],
      ['比「让 LLM 选一个选项」强在哪？', 'LLM 返回的是要解析的文本；Jev 返回类型化的 choice 加概率分布，可以设阈值、写单测、记一个数字。'],
      ['必须用 TypeSafe 的 API key 吗？', '只有托管 API 需要。开源模型与复刻分类里有跑在开放权重上的 System One 语义。'],
      ['我的项目怎么才能被收录？', '给 data/entries.json 提个 PR，或者打上 jev 话题开 issue。'],
      ['这份清单和 TypeSafe AI 有关联吗？', '没有，是社区维护的。因为 Jev 是他们的模型，所以才有链接。'],
      ['我能在自己的工具里用这些数据吗？', '可以，全部内容为 CC0-1.0 公共领域。取 projects.json 或 llms-full.txt 即可。'],
    ],
  },
  fr: {
    langSwitchLabel: 'Langue',
    heroTagline: 'Tout est décision.',
    about: 'L’annuaire de référence, mis à jour automatiquement, de tout ce qui est construit sur Jev — le modèle System One de TypeSafe AI, le premier modèle qui répond par des jugements typés et des probabilités calibrées plutôt que par du texte.',
    ctaStar: '⭐ Star on GitHub',
    ctaSubmit: 'Proposer un projet',
    ctaSource: 'Données sources',
    stats: 'En bref',
    directory: 'L’annuaire',
    faqTitle: 'FAQ',
    curated: 'Comment cette liste est tenue',
    curatedText: 'Un fichier de données, des scripts déterministes et un relecteur IA gratuit. Étoiles et licences actualisées via l’API GitHub ; chaque entrée est vérifiée avant publication. Aucune clé d’API, aucun placement payant.',
    starMilestone: 'Objectif : 0 → 100 étoiles. À l’approche, les entrées notables seront épinglées en haut.',
    share: 'Partager',
    footerNote: 'Maintenu par la communauté. Sans affiliation avec TypeSafe AI.',
    entriesUnit: (n) => `${n} ${n === 1 ? 'entrée' : 'entrées'}`,
    langNames: { en: 'English', zh: '中文', fr: 'Français' },
    faq: [
      ['Qu’est-ce que Jev exactement ?', 'Le modèle System One de TypeSafe AI : on envoie un state et des questions typées, on reçoit des réponses typées avec probabilités et confiance.'],
      ['En quoi diffère-t-il de « demander à un LLM de choisir une option » ?', 'Un LLM renvoie du texte à parser. Jev renvoie un choice typé plus une distribution de probabilités : seuillable, testable, journalisable.'],
      ['Faut-il une clé API TypeSafe ?', 'Seulement pour l’API hébergée. La catégorie Modèles ouverts et répliques fait tourner la sémantique System One sur des poids ouverts.'],
      ['Comment faire référencer mon projet ?', 'Ouvrez une pull request sur data/entries.json, ou ajoutez le sujet jev et ouvrez une issue.'],
      ['Cette liste est-elle affiliée à TypeSafe AI ?', 'Non, elle est maintenue par la communauté. TypeSafe AI est lié parce que Jev est leur modèle.'],
      ['Puis-je utiliser ces données dans mon outil ?', 'Oui. Tout est en CC0-1.0, domaine public. Récupérez projects.json ou llms-full.txt.'],
    ],
  },
};

/* ------------------------------------------------------------------- SEO */

function keywords(lang) {
  const base = [
    'awesome', 'awesome list', 'Jev', 'jev', 'TypeSafe AI', 'System One', 'typesafe-ai',
    'AI decision model', 'calibrated probabilities', 'structured output', 'LLM evaluation',
    'agent harness', 'model router', 'tool gating', 'context compaction', 'LLM guardrails',
    'prompt injection detection', 'reranker', 'agent skills', 'MCP server', 'open models',
    'decision model', 'AI agents', 'open source AI',
  ];
  const zh = ['精选列表', 'Jev 教程', '大模型', '智能体', '模型路由', '上下文压缩', '安全护栏', '开源模型', '决策模型', '概率校准'];
  const fr = ['liste awesome', 'Jev tutoriel', 'IA', 'agents', 'routage de modèles', 'compaction de contexte', 'garde-fous IA', 'modèles ouverts', 'modèle de décision', 'probabilités calibrées'];
  if (lang === 'zh') return [...zh, ...base];
  if (lang === 'fr') return [...fr, ...base];
  return base;
}

function jsonLd(db, lang) {
  const c = COPY[lang];
  const cats = orderedCategories(db.entries);
  const repoItems = db.entries.filter((e) => e.kind === 'repo');
  const position = new Map(repoItems.map((e, i) => [e.url, i + 1]));
  const siteUrl = `${SITE}${PATH_FOR[lang]}`;

  const website = {
    '@type': 'WebSite',
    '@id': `${siteUrl}#website`,
    url: siteUrl,
    name: 'Awesome Jev',
    inLanguage: LANG_META[lang].ogLocale,
    description: c.about,
    publisher: { '@type': 'Organization', name: 'awesome-jev', url: REPO.replace('/awesome-jev', '') },
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE}/search?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };

  const collection = {
    '@type': 'CollectionPage',
    '@id': `${siteUrl}#collection`,
    url: siteUrl,
    name: 'Awesome Jev — the directory',
    description: c.about,
    inLanguage: LANG_META[lang].ogLocale,
    isPartOf: { '@id': `${siteUrl}#website` },
    about: { '@type': 'SoftwareApplication', name: 'Jev', applicationCategory: 'DeveloperApplication', operatingSystem: 'Any', description: 'TypeSafe AI System One decision model returning typed answers with calibrated probabilities.' },
  };

  const list = {
    '@type': 'ItemList',
    '@id': `${siteUrl}#list`,
    name: 'Projects built on Jev',
    description: `${db.entries.length} projects built on Jev (TypeSafe AI System One), across ${cats.length} categories.`,
    numberOfItems: repoItems.length,
    itemListOrder: 'https://schema.org/ItemListOrderDescending',
    itemListElement: repoItems.map((e) => ({
      '@type': 'ListItem',
      position: position.get(e.url),
      url: e.url,
      name: e.name,
      description: desc(e, lang),
    })),
  };

  const faq = {
    '@type': 'FAQPage',
    '@id': `${siteUrl}#faq`,
    mainEntity: c.faq.map(([q, a]) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  const primitives = {
    '@type': 'DefinedTermSet',
    '@id': `${siteUrl}#primitives`,
    name: 'Jev question primitives',
    hasDefinedTerm: PRIMITIVES.map((p) => ({
      '@type': 'DefinedTerm',
      name: p.name,
      description: `${p.question} → ${p.returns}`,
    })),
  };

  const breadcrumb = {
    '@type': 'BreadcrumbList',
    '@id': `${siteUrl}#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Awesome Jev', item: siteUrl },
      ...cats.map((cat, i) => ({
        '@type': 'ListItem',
        position: i + 2,
        name: cat[lang] || cat.en,
        item: `${siteUrl}#${anchor(cat[lang] || cat.en)}`,
      })),
    ],
  };

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [website, collection, list, faq, primitives, breadcrumb],
  });
}

/* ------------------------------------------------------------------- CSS */

const CSS = `
:root{
  --bg:#0a0e14;--bg2:#0f1520;--card:#141b26;--border:#232c3b;--fg:#e6edf3;--muted:#8b949e;
  --accent:#4d9fff;--accent2:#7c5cff;--orange:#ff7a45;--green:#3fb950;--radius:12px;
  --maxw:1180px;
}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;scroll-padding-top:120px}
body{background:var(--bg);color:var(--fg);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Noto Sans SC","PingFang SC","Microsoft YaHei","Helvetica Neue",sans-serif;line-height:1.65;-webkit-font-smoothing:antialiased}
a{color:var(--accent);text-decoration:none}
a:hover{text-decoration:underline}
.wrap{max-width:var(--maxw);margin:0 auto;padding:0 20px}
code,.mono{font-family:"JetBrains Mono",ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:.9em}
header.nav{position:sticky;top:0;z-index:40;background:rgba(10,14,20,.9);backdrop-filter:blur(10px);border-bottom:1px solid var(--border)}
header.nav .row{display:flex;align-items:center;justify-content:space-between;height:60px}
.logo{font-weight:800;font-size:18px;color:var(--fg);letter-spacing:-.2px}
.logo b{color:var(--orange)}
.links a{color:var(--muted);font-size:14px;margin-left:16px}
.links a:hover,.links a.on{color:var(--fg)}
.hero{padding:64px 0 44px;text-align:center;background:radial-gradient(900px 340px at 50% -60px,rgba(124,92,255,.20),transparent),radial-gradient(700px 300px at 50% -20px,rgba(77,159,255,.14),transparent)}
.hero h1{font-size:clamp(30px,5.2vw,50px);letter-spacing:-1.2px;line-height:1.1}
.hero .tag{color:var(--orange);font-weight:700;margin:14px 0 18px;font-size:18px}
.hero p{color:var(--muted);max-width:760px;margin:0 auto;font-size:16px}
.btns{margin-top:26px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
.btn{display:inline-flex;align-items:center;gap:8px;padding:10px 20px;border-radius:10px;background:var(--card);border:1px solid var(--border);color:var(--fg);font-size:14px;font-weight:600}
.btn:hover{border-color:var(--accent);text-decoration:none;transform:translateY(-1px)}
.btn.pri{background:linear-gradient(135deg,var(--accent),var(--accent2));border-color:transparent;color:#fff}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:14px;margin-top:38px;text-align:left}
.stat{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:14px 16px}
.stat .n{font-size:24px;font-weight:800;color:var(--fg);letter-spacing:-.5px}
.stat .l{font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.6px;margin-top:2px}
.jump{margin-top:26px;display:flex;gap:8px;flex-wrap:wrap;justify-content:center}
.jump a{font-size:13px;padding:6px 13px;border-radius:20px;background:var(--card);border:1px solid var(--border);color:var(--muted)}
.jump a:hover{color:var(--fg);border-color:var(--accent);text-decoration:none}
section{padding:44px 0;border-bottom:1px solid var(--border)}
h2{font-size:24px;letter-spacing:-.3px;margin-bottom:6px}
.sub{color:var(--muted);font-size:14px;margin-bottom:20px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:14px}
.card{display:block;background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:16px 18px;color:var(--fg);transition:border-color .15s,transform .15s}
.card:hover{border-color:var(--accent);text-decoration:none;transform:translateY(-2px)}
.card h3{font-size:15px;margin-bottom:6px;word-break:break-word}
.card p{font-size:13.5px;color:var(--muted);margin-bottom:10px}
.card .meta{display:flex;gap:8px;align-items:center;flex-wrap:wrap;font-size:11.5px;color:var(--muted)}
.tagx{background:rgba(124,92,255,.14);color:#b9a9ff;border:1px solid rgba(124,92,255,.28);padding:1px 7px;border-radius:20px}
.tagx.o{background:rgba(63,185,80,.13);color:#7ee787;border-color:rgba(63,185,80,.28)}
.tagx.l{background:rgba(255,255,255,.05);border-color:var(--border)}
.stars{color:var(--orange);font-weight:700}
table{width:100%;border-collapse:collapse;font-size:14px}
th,td{text-align:left;padding:10px 12px;border-bottom:1px solid var(--border);vertical-align:top}
th{color:var(--muted);font-size:12px;text-transform:uppercase;letter-spacing:.6px}
details.raw{margin-top:10px}
details.raw summary{cursor:pointer;color:var(--muted);font-size:14px}
.faq{display:grid;gap:10px;max-width:820px}
.faq details{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px 16px}
.faq summary{cursor:pointer;font-weight:600;font-size:15px}
.faq p{color:var(--muted);font-size:14px;margin-top:8px}
.cta{margin:0 auto;max-width:820px;text-align:center;background:linear-gradient(135deg,rgba(77,159,255,.10),rgba(255,122,69,.10));border:1px solid var(--border);border-radius:16px;padding:26px}
.cta h3{margin-bottom:8px;font-size:20px}
.cta p{color:var(--muted);font-size:14.5px}
.cta .btns{margin-top:18px}
footer{padding:36px 0;color:var(--muted);font-size:13px;text-align:center}
footer a{color:var(--muted)}
@media(max-width:640px){.grid{grid-template-columns:1fr}.hero{padding:44px 0 30px}.links a{margin-left:10px;font-size:13px}}
`;

/* ------------------------------------------------------------------ HTML */

function renderSite(db, lang) {
  const c = COPY[lang];
  const m = LANG_META[lang];
  const t = totals(db.entries, db.updatedAt);
  const cats = orderedCategories(db.entries);
  const siteUrl = `${SITE}${PATH_FOR[lang]}`;
  const tpl = totals(db.entries, db.updatedAt);

  const alternates = LANGS.map((l) => `<link rel="alternate" hreflang="${LANG_META[l].ogLocale}" href="${SITE}${PATH_FOR[l]}">`).join('\n');

  const switcher = LANGS
    .map((l) => `<a href="${SITE}${PATH_FOR[l]}" class="${l === lang ? 'on' : ''}" hreflang="${LANG_META[l].ogLocale}"${l === lang ? ' aria-current="page"' : ''}>${c.langNames[l]}</a>`)
    .join('\n  ');

  const statsHtml = [
    [fmtStars(t.entries), lang === 'zh' ? '收录项目' : lang === 'fr' ? 'entrées' : 'entries'],
    [fmtStars(t.stars), lang === 'zh' ? '追踪 Stars' : lang === 'fr' ? 'étoiles suivies' : 'stars tracked'],
    [String(cats.length), lang === 'zh' ? '分类' : lang === 'fr' ? 'catégories' : 'categories'],
    [String(t.languages), lang === 'zh' ? '编程语言' : lang === 'fr' ? 'langages' : 'languages'],
    [String(LANGS.length), lang === 'zh' ? '文档语言' : lang === 'fr' ? 'langues de doc' : 'doc languages'],
    ['0', lang === 'zh' ? 'API key 需求' : lang === 'fr' ? 'clé d’API requise' : 'API keys needed'],
  ].map(([n, l]) => `<div class="stat"><div class="n">${esc(n)}</div><div class="l">${esc(l)}</div></div>`).join('\n');

  const jump = cats.map((cat) => `<a href="#${anchor(cat[lang] || cat.en)}">${esc(cat[lang] || cat.en)}</a>`).join('\n');

  const sections = cats.map((cat) => {
    const title = cat[lang] || cat.en;
    const blurb = lang === 'zh' ? cat.blurbZh : lang === 'fr' ? cat.blurbFr : cat.blurb;
    const cards = cat.items.map((e) => {
      const tg = tags(e);
      const badges = [
        e.official ? '<span class="tagx o">official</span>' : '',
        e.language ? `<span class="tagx l">${esc(e.language)}</span>` : '',
        e.license ? `<span class="tagx l">${esc(e.license)}</span>` : '',
        e.archived ? '<span class="tagx l">archived</span>' : '',
        e.stars !== null ? `<span class="stars">★ ${fmtStars(e.stars)}</span>` : '',
      ].filter(Boolean).join('\n      ');
      return `<a class="card" href="${escAttr(e.url)}" target="_blank" rel="noopener">
      <h3>${esc(e.name)}</h3>
      <p>${esc(desc(e, lang))}</p>
      <div class="meta">
      ${badges}
      </div>
    </a>`;
    }).join('\n');
    return `<section id="${anchor(title)}">
  <div class="wrap">
    <h2>${esc(title)}</h2>
    <p class="sub">${esc(blurb)} · ${c.entriesUnit(cat.items.length)}</p>
    <div class="grid">
${cards}
    </div>
  </div>
</section>`;
  }).join('\n');

  const faqHtml = c.faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('\n');

  const title = lang === 'zh'
    ? 'Awesome Jev — 万物皆决策 | Jev 生态项目精选目录'
    : lang === 'fr'
      ? 'Awesome Jev — Tout est décision | Annuaire des projets Jev'
      : 'Awesome Jev — Everything is a Decision | The directory of projects built on Jev';

  return `<!DOCTYPE html>
<html lang="${m.ogLocale}" dir="${m.dir}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${escAttr(c.about)}">
<meta name="keywords" content="${escAttr(keywords(lang).join(', '))}">
<meta name="author" content="awesome-jev">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
<meta name="theme-color" content="#0a0e14">
<link rel="canonical" href="${siteUrl}">
${alternates}
<link rel="alternate" hreflang="x-default" href="${SITE}/">
<link rel="icon" href="data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">⚡</text></svg>')}">
<link rel="alternate" type="application/json" href="${SITE}/projects.json" title="Awesome Jev structured data">
<link rel="alternate" type="text/plain" href="${SITE}/llms.txt" title="Awesome Jev for language models">
<link rel="alternate" type="text/markdown" href="${SITE}/skill.md" title="Awesome Jev agent skill">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Awesome Jev">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${escAttr(c.about)}">
<meta property="og:url" content="${siteUrl}">
<meta property="og:locale" content="${m.ogLocale}">
${LANGS.filter((l) => l !== lang).map((l) => `<meta property="og:locale:alternate" content="${LANG_META[l].ogLocale}">`).join('\n')}
<meta property="og:image" content="${SITE}/assets/og.svg">
<meta property="og:image:alt" content="Awesome Jev — ${fmtStars(tpl.entries)} projects built on Jev">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${escAttr(c.about)}">
<meta name="twitter:image" content="${SITE}/assets/og.svg">
<script type="application/ld+json">${jsonLd(db, lang)}</script>
<style>${CSS}</style>
</head>
<body>
<header class="nav">
  <div class="wrap row">
    <a class="logo" href="${SITE_BASE}/">Awesome <b>Jev</b></a>
    <nav class="links">
  ${switcher}
    </nav>
  </div>
</header>
<main>
<div class="hero">
  <div class="wrap">
    <h1>Awesome Jev</h1>
    <div class="tag">${esc(c.heroTagline)}</div>
    <p>${esc(c.about)}</p>
    <div class="btns">
      <a class="btn pri" href="${REPO}" target="_blank" rel="noopener">${esc(c.ctaStar)}</a>
      <a class="btn" href="${REPO}/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener">${esc(c.ctaSubmit)}</a>
      <a class="btn" href="${SITE}/projects.json" target="_blank" rel="noopener">${esc(c.ctaSource)}</a>
    </div>
    <div class="stats">
${statsHtml}
    </div>
    <div class="jump">
${jump}
    </div>
  </div>
</div>

<section id="about">
  <div class="wrap">
    <h2>${esc(c.stats)}</h2>
    <p class="sub">${esc(c.curatedText)}</p>
    <div class="cta">
      <h3>${esc(c.starMilestone)}</h3>
      <p>${esc(c.about)}</p>
      <div class="btns">
        <a class="btn pri" href="${REPO}" target="_blank" rel="noopener">${esc(c.ctaStar)}</a>
        <a class="btn" href="${REPO}/issues/new/choose" target="_blank" rel="noopener">${esc(c.ctaSubmit)}</a>
        <a class="btn" href="${DISCORD}" target="_blank" rel="noopener">Discord</a>
      </div>
    </div>
  </div>
</section>

${sections}

<section id="faq">
  <div class="wrap">
    <h2>${esc(c.faqTitle)}</h2>
    <p class="sub">${esc(c.curated)}</p>
    <div class="faq">
${faqHtml}
    </div>
  </div>
</section>
</main>
<footer>
  <div class="wrap">
    <p>${esc(c.footerNote)} ${esc(c.curatedText)}</p>
    <p><a href="${REPO}" target="_blank" rel="noopener">${REPO}</a> · <a href="${DOCS}" target="_blank" rel="noopener">TypeSafe docs</a> · ${esc(c.stats)}: ${esc(t.updated)}</p>
  </div>
</footer>
</body>
</html>
`;
}

/* --------------------------------------------------- machine-readable set */

function renderLlmsTxt(db) {
  const t = totals(db.entries, db.updatedAt);
  const cats = orderedCategories(db.entries);
  return `# Awesome Jev

> ${COPY.en.about}

Canonical source: ${REPO}
Structured data: ${SITE}/projects.json
Full export: ${SITE}/llms-full.txt
Agent skill: ${SITE}/skill.md
One section per page: ${SITE}/c/<slug>.md

## What this is

A curated, automatically refreshed directory of projects built on Jev — the System One
model from TypeSafe AI. Jev takes a state plus typed questions (choice / score / noul),
evaluated in parallel, and returns typed answers with per-option probabilities and a
confidence value. Entries are grouped by what they are for, not by who made them.

## When to use this list

Use it when someone asks: what is built on Jev; what Jev SDKs exist for language X; how
people route between models with Jev; how Jev is used for context compaction, tool gating,
code review, browser automation, moderation, reranking or evals; whether there is an
open-weight alternative to the Jev API.

## Stats

- entries: ${t.entries} (${t.repos} repositories, ${t.resources} resources)
- stars tracked: ${fmtStars(t.stars)}
- categories: ${cats.length}
- languages covered: ${t.languages}
- last refresh: ${t.updated}

## Sections

${cats.map((c) => `- [${c.en}](${SITE}/c/${c.slug}.md) — ${c.items.length} entries · ${c.blurb}`).join('\n')}

## Conventions for entries

- Each entry is one public repository or one official page that calls the Jev / System One API.
- Repo entries: name as \`owner/repo\`, stars and pushedAt refreshed from the GitHub API.
- Star counts are a snapshot, not a ranking claim. Snapshot date: ${t.updated}.
- Archived repositories are marked and kept for reference.
`;
}

function entryMarkdown(e, lang) {
  const bits = [
    `### ${e.name}`,
    '',
    `- url: ${e.url}`,
    `- description: ${desc(e, lang)}`,
  ];
  if (e.kind === 'repo') bits.push(`- stars: ${fmtStars(e.stars)}`);
  if (e.language) bits.push(`- language: ${e.language}`);
  if (e.license) bits.push(`- license: ${e.license}`);
  if (e.official) bits.push('- official: true');
  if (e.archived) bits.push('- archived: true');
  if (e.pushedAt) bits.push(`- pushed_at: ${e.pushedAt}`);
  if (e.topics?.length) bits.push(`- topics: ${e.topics.join(', ')}`);
  if (e.intents?.length) bits.push(`- use_cases: ${e.intents.join('; ')}`);
  bits.push('');
  return bits.join('\n');
}

function renderLlmsFull(db) {
  const t = totals(db.entries, db.updatedAt);
  const cats = orderedCategories(db.entries);
  const head = [
    `# Awesome Jev — full export`,
    '',
    `> ${COPY.en.about}`,
    '',
    `${t.entries} entries, ${fmtStars(t.stars)} stars, ${cats.length} categories, refreshed ${t.updated}.`,
    `Source: ${REPO}`,
    '',
    'Format: one H3 per entry, followed by a YAML-ish bullet list of fields.',
    '',
    '---',
    '',
  ].join('\n');
  const body = cats.map((c) => `## ${c.en}\n\n${c.blurb}\n\n${c.items.map((e) => entryMarkdown(e, 'en')).join('\n')}`).join('\n');
  return head + body + '\n';
}

function renderSectionMarkdown(db, cat) {
  const head = [
    `# ${cat.en}`,
    '',
    `> ${cat.blurb}`,
    '',
    `${cat.items.length} entries. Part of [Awesome Jev](${REPO}) — refreshed ${db.updatedAt}.`,
    '',
    '---',
    '',
  ].join('\n');
  return head + cat.items.map((e) => entryMarkdown(e, 'en')).join('\n');
}

function renderSkill(db) {
  const t = totals(db.entries, db.updatedAt);
  return `---
name: awesome-jev
description: Find projects built on Jev (TypeSafe AI's System One decision model) — SDKs, agent routers, context compaction, tool gates, code review, browser automation, moderation, rerankers, open-weight replicas. Use when someone asks what is built on Jev, which Jev SDK exists for a language, or how to use Jev for routing/gating/compaction/judging.
license: CC0-1.0
---

# Awesome Jev

${COPY.en.about}

${t.entries} entries (${t.repos} repos, ${t.resources} resources), ${fmtStars(t.stars)} stars tracked,
${orderedCategories(db.entries).length} categories, refreshed ${t.updated}. CC0-1.0 public domain.

## How to use this skill

1. Fetch \`${SITE}/projects.json\` once per session. It is well under 1 MB and holds every
   entry with its fields.
2. Filter locally. Useful fields: \`category\`, \`kind\` (repo | resource), \`stars\`,
   \`language\`, \`license\`, \`official\`, \`archived\`, \`pushedAt\`, \`intents\`, and the
   \`description\` / \`descriptionZh\` / \`descriptionFr\` trio.
3. Only surface entries whose description actually matches the task. Do not rank by stars
   alone — stars are a snapshot from ${t.updated}, not a quality claim.

Smaller views, if you only need part of it:
- \`${SITE}/llms.txt\` — index plus section links
- \`${SITE}/llms-full.txt\` — every entry as markdown
- \`${SITE}/c/<slug>.md\` — one section only
- ${REPO}/data/entries.json — the source file

## Sections

${orderedCategories(db.entries).map((c) => `- **${c.en}** (\`${c.slug}\`): ${c.blurb} — ${c.items.length}`).join('\n')}

## The three primitives

${PRIMITIVES.map((p) => `- \`${p.name}\` — ${p.question} → ${p.returns}`).join('\n')}

## Cautions

- A source check establishes that a project exists and says what it claims. It does not
  establish that it is production-ready, secure, fast, or open-source licensed — read the
  entry's own license and scope before recommending it.
- Some entries are unofficial clients or open-weight replicas of the System One interface,
  not TypeSafe AI products. Check \`official: false\`.
- Star counts drift. Cite the refresh date, not a bare number.
`;
}

function renderProjectsJson(db) {
  const cats = orderedCategories(db.entries);
  const catMeta = {};
  for (const c of cats) catMeta[c.id] = { title: c.en, slug: c.slug, blurb: c.blurb, count: c.items.length };
  return JSON.stringify({
    meta: {
      name: 'Awesome Jev',
      description: COPY.en.about,
      canonical: REPO,
      site: `${SITE}/`,
      license: 'CC0-1.0',
      languages: LANGS,
      updatedAt: db.updatedAt,
      counts: totals(db.entries, db.updatedAt),
      categories: catMeta,
      endpoints: {
        source: `${REPO}/blob/main/data/entries.json`,
        llms: `${SITE}/llms.txt`,
        llmsFull: `${SITE}/llms-full.txt`,
        skill: `${SITE}/skill.md`,
        section: `${SITE}/c/<slug>.md`,
        api: 'POST https://api.typesafe.ai/v1/systemone',
      },
      primitives: PRIMITIVES.map((p) => ({ name: p.name, question: p.question, returns: p.returns })),
    },
    entries: db.entries.map((e) => ({
      id: e.id,
      name: e.name,
      url: e.url,
      kind: e.kind,
      category: e.category,
      description: e.description,
      descriptionZh: e.descriptionZh || null,
      descriptionFr: e.descriptionFr || null,
      language: e.language,
      license: e.license,
      stars: e.stars,
      forks: e.forks,
      topics: e.topics,
      official: !!e.official,
      archived: !!e.archived,
      pushedAt: e.pushedAt,
      intents: e.intents,
    })),
  }, null, 2);
}

function renderSitemap(db) {
  const t = totals(db.entries, db.updatedAt);
  const cats = orderedCategories(db.entries);
  const urls = [
    { loc: `${SITE}/`, pri: '1.0', freq: 'daily' },
    { loc: `${SITE}/zh/`, pri: '0.9', freq: 'daily' },
    { loc: `${SITE}/fr/`, pri: '0.9', freq: 'daily' },
    ...cats.map((c) => ({ loc: `${SITE}/#${anchor(c.en)}`, pri: '0.7', freq: 'weekly' })),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.map((u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${t.updated}</lastmod>
    <changefreq>${u.freq}</changefreq>
    <priority>${u.pri}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${SITE}/"/>
    <xhtml:link rel="alternate" hreflang="zh_CN" href="${SITE}/zh/"/>
    <xhtml:link rel="alternate" hreflang="fr_FR" href="${SITE}/fr/"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}/"/>
  </url>`).join('\n')}
</urlset>
`;
}

const OG_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0a0e14"/>
      <stop offset="100%" stop-color="#141b26"/>
    </linearGradient>
    <linearGradient id="ac" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#4d9fff"/>
      <stop offset="100%" stop-color="#7c5cff"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <circle cx="600" cy="120" r="340" fill="rgba(124,92,255,.18)"/>
  <circle cx="600" cy="60" r="240" fill="rgba(77,159,255,.14)"/>
  <text x="600" y="286" text-anchor="middle" font-family="Inter,Segoe UI,Helvetica,Arial,sans-serif" font-size="82" font-weight="800" fill="#e6edf3">Awesome <tspan fill="#ff7a45">Jev</tspan></text>
  <text x="600" y="352" text-anchor="middle" font-family="Inter,Segoe UI,Helvetica,Arial,sans-serif" font-size="34" font-weight="600" fill="#ff7a45">Everything is a Decision.</text>
  <text x="600" y="404" text-anchor="middle" font-family="Inter,Segoe UI,Helvetica,Arial,sans-serif" font-size="22" fill="#8b949e">Everything built on Jev — TypeSafe AI&#39;s System One model</text>
  <rect x="330" y="440" width="540" height="60" rx="30" fill="url(#ac)"/>
  <text x="600" y="478" text-anchor="middle" font-family="Inter,Segoe UI,Helvetica,Arial,sans-serif" font-size="24" font-weight="700" fill="#ffffff">ENTRIES · STARS · 3 LANGUAGES · SELF-UPDATING</text>
</svg>
`;

/* ------------------------------------------------------------------ main */

function main() {
  const db = loadEntries();
  const t = totals(db.entries, db.updatedAt);
  const cats = orderedCategories(db.entries);
  fs.rmSync(OUT, { recursive: true, force: true });

  // Human-facing pages
  fs.mkdirSync(path.join(OUT, 'zh'), { recursive: true });
  fs.mkdirSync(path.join(OUT, 'fr'), { recursive: true });
  fs.writeFileSync(path.join(OUT, 'index.html'), renderSite(db, 'en'));
  fs.writeFileSync(path.join(OUT, 'zh', 'index.html'), renderSite(db, 'zh'));
  fs.writeFileSync(path.join(OUT, 'fr', 'index.html'), renderSite(db, 'fr'));
  fs.writeFileSync(path.join(OUT, '.nojekyll'), '');

  // Machine-facing artifacts
  fs.mkdirSync(path.join(OUT, 'c'), { recursive: true });
  fs.writeFileSync(path.join(OUT, 'llms.txt'), renderLlmsTxt(db));
  fs.writeFileSync(path.join(OUT, 'llms-full.txt'), renderLlmsFull(db));
  fs.writeFileSync(path.join(OUT, 'skill.md'), renderSkill(db));
  fs.writeFileSync(path.join(OUT, 'projects.json'), renderProjectsJson(db));
  fs.writeFileSync(path.join(OUT, 'sitemap.xml'), renderSitemap(db));
  fs.writeFileSync(path.join(OUT, 'robots.txt'), [
    'User-agent: *',
    'Allow: /',
    '',
    '# AI crawlers and model fetches are explicitly welcome — that is the point.',
    'User-agent: GPTBot',
    'Allow: /',
    'User-agent: ClaudeBot',
    'Allow: /',
    'User-agent: PerplexityBot',
    'Allow: /',
    'User-agent: Google-Extended',
    'Allow: /',
    'User-agent: anthropic-ai',
    'Allow: /',
    '',
    `Sitemap: ${SITE}/sitemap.xml`,
    '',
  ].join('\n'));
  for (const c of cats) {
    fs.writeFileSync(path.join(OUT, 'c', `${c.slug}.md`), renderSectionMarkdown(db, c));
  }

  // OG image
  const assets = path.join(OUT, 'assets');
  fs.mkdirSync(assets, { recursive: true });
  fs.writeFileSync(path.join(assets, 'og.svg'), OG_SVG);

  // Also expose the machine artifacts at the repo root, so `npx skills add` and
  // raw.githubusercontent fetches find them without going through Pages.
  for (const [name, body] of [
    ['llms.txt', renderLlmsTxt(db)],
    ['llms-full.txt', renderLlmsFull(db)],
    ['skill.md', renderSkill(db)],
    ['projects.json', renderProjectsJson(db)],
  ]) {
    fs.writeFileSync(path.join(ROOT, name), body, 'utf8');
  }

  const sizes = {};
  for (const f of ['llms.txt', 'llms-full.txt', 'skill.md', 'projects.json', 'index.html', 'zh/index.html', 'fr/index.html']) {
    sizes[f] = Math.round(fs.statSync(path.join(OUT, f)).size / 1024) + ' KB';
  }

  console.log(JSON.stringify({
    entries: t.entries,
    repos: t.repos,
    stars: t.stars,
    categories: cats.length,
    pages: LANGS.length,
    sectionPages: cats.length,
    updated: t.updated,
    sizes,
  }, null, 2));
}

main();