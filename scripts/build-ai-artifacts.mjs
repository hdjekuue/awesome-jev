#!/usr/bin/env node
/**
 * build-ai-artifacts.mjs — writes every machine-readable export the site promises.
 *
 * Runs before `astro build`, because Astro wipes and regenerates docs/. These are
 * not pages; they are contracts. skill.md and AGENTS.md tell agents to fetch
 * these exact URLs, so a missing one is a broken promise, not a missing feature.
 *
 *   node scripts/build-ai-artifacts.mjs
 *
 * Writes to docs/ (the Pages root) and mirrors the four top-level files at the
 * repository root, which is what raw.githubusercontent and `npx skills add` read.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  ROOT, load, CATEGORIES, CATEGORY_BY_ID, LANGS, PRIMITIVES,
  REPO, SITE, DISCORD, DOCS, desc, catLabel, fmtStars, stats,
} from '../src/lib/catalog.mjs';

const OUT = path.join(ROOT, 'docs');
const SECTIONS = path.join(OUT, 'c');

const { db, byCat, updated, entries } = load();
const s = stats(entries, updated);
const cats = CATEGORIES.filter((c) => (byCat.get(c.id) || []).length);

const ABOUT_EN =
  'Everything built on Jev — TypeSafe AI\'s System One model, the first model that answers with typed judgments and calibrated probabilities instead of prose. Generated from one data file in three languages, maintained by deterministic scripts and a free-AI reviewer.';

const ABOUT = {
  en: ABOUT_EN,
  zh: '关于 Jev（TypeSafe AI 的 System One 模型）构建的一切——第一个直接返回类型化判断与校准概率、而不是自然语言的模型。由同一个数据文件生成三种语言，由确定性脚本与一个免费 AI 评审员持续维护。',
  fr: 'Tout ce qui est construit sur Jev — le modèle System One de TypeSafe AI, le premier modèle qui répond par des jugements typés et des probabilités calibrées plutôt que par du texte. Généré depuis un seul fichier de données en trois langues, tenu par des scripts déterministes et un relecteur IA gratuit.',
};

function write(p, body) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, body, 'utf8');
  return body.length;
}

/* ------------------------------------------------------------- llms.txt */

function llmsTxt() {
  return [
    '# Awesome Jev',
    '',
    `> ${ABOUT_EN}`,
    '',
    `Canonical source: ${REPO}`,
    `Structured data: ${SITE}/projects.json`,
    `Full export: ${SITE}/llms-full.txt`,
    `Agent skill: ${SITE}/skill.md`,
    `One rule per page: ${SITE}/c/<slug>.md`,
    '',
    '## What this is',
    '',
    'A curated, automatically refreshed directory of projects built on Jev — the System One',
    'model from TypeSafe AI. Jev takes a state plus typed questions (choice / score / noul),',
    'evaluated in parallel, and returns typed answers with per-option probabilities and a',
    'confidence value. Entries are grouped by rule number, not by who made them.',
    '',
    '## When to use this list',
    '',
    'Use it when someone asks: what is built on Jev; what Jev SDKs exist for language X; how',
    'people route between models with Jev; how Jev is used for context compaction, tool gating,',
    'code review, browser automation, moderation, reranking or evals; whether there is an',
    'open-weight alternative to the Jev API.',
    '',
    '## Stats',
    '',
    `- entries: ${s.entries} (${s.repos} repositories, ${s.resources} resources)`,
    `- stars tracked: ${fmtStars(s.stars)}`,
    `- rules (categories): ${cats.length}`,
    `- languages covered: ${s.languages}`,
    `- last refresh: ${s.updated}`,
    '',
    '## Rules',
    '',
    ...cats.map(
      (c) =>
        `- [${String(c.stamp).padStart(3, '0')} · ${c.en}](${SITE}/c/${c.id}.md) — ${(byCat.get(c.id) || []).length} entries · ${c.blurb}`,
    ),
    '',
    '## Conventions for entries',
    '',
    '- Each entry is one public repository or one official page that calls the Jev / System One API.',
    '- Repo entries: name as `owner/repo`, stars and pushed_at refreshed from the GitHub API.',
    '- Star counts are a snapshot, not a ranking claim. Snapshot date: ' + s.updated + '.',
    '- Archived repositories are marked and kept for reference.',
    '',
  ].join('\n');
}

/* --------------------------------------------------------- llms-full.txt */

function entryMarkdown(e) {
  const lines = [`### ${e.name}`, '', `- url: ${e.url}`, `- description: ${e.description}`];
  if (e.kind === 'repo') lines.push(`- stars: ${fmtStars(e.stars)}`);
  if (e.language) lines.push(`- language: ${e.language}`);
  if (e.license) lines.push(`- license: ${e.license}`);
  if (e.official) lines.push('- official: true');
  if (e.archived) lines.push('- archived: true');
  if (e.pushedAt) lines.push(`- pushed_at: ${e.pushedAt}`);
  if (e.topics?.length) lines.push(`- topics: ${e.topics.join(', ')}`);
  if (e.intents?.length) lines.push(`- use_cases: ${e.intents.join('; ')}`);
  lines.push(`- rule: ${CATEGORY_BY_ID.get(e.category)?.stamp || e.category}`);
  lines.push('');
  return lines.join('\n');
}

function llmsFull() {
  return [
    '# Awesome Jev — full export',
    '',
    `> ${ABOUT_EN}`,
    '',
    `${s.entries} entries, ${fmtStars(s.stars)} stars, ${cats.length} rules, refreshed ${s.updated}.`,
    `Source: ${REPO}`,
    '',
    'Format: one H3 per entry, followed by a field list.',
    '',
    '---',
    '',
    ...cats.flatMap((c) => [
      `## ${String(c.stamp).padStart(3, '0')} · ${c.en}`,
      '',
      c.blurb,
      '',
      ...(byCat.get(c.id) || []).map(entryMarkdown),
    ]),
  ].join('\n');
}

function sectionMarkdown(c) {
  const items = byCat.get(c.id) || [];
  return [
    `# ${String(c.stamp).padStart(3, '0')} · ${c.en}`,
    '',
    `> ${c.blurb}`,
    '',
    `${items.length} entries. Part of [Awesome Jev](${REPO}) — refreshed ${s.updated}.`,
    '',
    '---',
    '',
    ...items.map(entryMarkdown),
  ].join('\n');
}

/* ------------------------------------------------------------ skill.md */

function skillMd() {
  return [
    '---',
    'name: awesome-jev',
    'description: Find projects built on Jev (TypeSafe AI\'s System One decision model) — SDKs, agent routers, context compaction, tool gates, code review, browser automation, moderation, rerankers, open-weight replicas. Use when someone asks what is built on Jev, which Jev SDK exists for a language, or how to use Jev for routing/gating/compaction/judging.',
    'license: CC0-1.0',
    '---',
    '',
    '# Awesome Jev',
    '',
    ABOUT_EN,
    '',
    `${s.entries} entries (${s.repos} repos, ${s.resources} resources), ${fmtStars(s.stars)} stars tracked,`,
    `${cats.length} rules, refreshed ${s.updated}. CC0-1.0 public domain.`,
    '',
    '## How to use this skill',
    '',
    `1. Fetch \`${SITE}/projects.json\` once per session. It is under 1 MB and holds every entry with its fields.`,
    '2. Filter locally. Useful fields: `rule`, `category`, `kind` (repo | resource), `stars`,',
    '   `language`, `license`, `official`, `archived`, `pushedAt`, `intents`, and the',
    '   `description` / `descriptionZh` / `descriptionFr` trio.',
    '3. Only surface entries whose description actually matches the task. Do not rank by stars',
    `   alone — stars are a snapshot from ${s.updated}, not a quality claim.`,
    '',
    'Smaller views, if you only need part of it:',
    `- \`${SITE}/llms.txt\` — index plus rule links`,
    `- \`${SITE}/llms-full.txt\` — every entry as markdown`,
    `- \`${SITE}/c/<slug>.md\` — one rule only, for a narrow question`,
    `- \`${REPO}/blob/main/data/entries.json\` — the source file`,
    '',
    '## Rules',
    '',
    ...cats.map((c) => `- **${String(c.stamp).padStart(3, '0')} · ${c.en}** (\`${c.id}\`): ${c.blurb} — ${(byCat.get(c.id) || []).length}`),
    '',
    '## The three primitives',
    '',
    ...PRIMITIVES.map((p) => `- \`${p.name}\` — ${p.q.en} → ${p.r.en}`),
    '',
    '## Cautions',
    '',
    '- A source check establishes that a project exists and says what it claims. It does not',
    '  establish that it is production-ready, secure, fast, or open-source licensed — read the',
    "  entry's own license and scope before recommending it.",
    '- Some entries are unofficial clients or open-weight replicas of the System One interface,',
    '  not TypeSafe AI products. Check `official: false`.',
    '- Star counts drift. Cite the refresh date, not a bare number.',
    '',
  ].join('\n');
}

/* -------------------------------------------------------- projects.json */

function projectsJson() {
  const catMeta = {};
  for (const c of cats) {
    catMeta[c.id] = {
      stamp: c.stamp,
      title: { en: c.en, zh: c.zh, fr: c.fr },
      slug: c.id,
      blurb: c.blurb,
      count: (byCat.get(c.id) || []).length,
    };
  }
  return JSON.stringify(
    {
      meta: {
        name: 'Awesome Jev',
        description: ABOUT_EN,
        canonical: REPO,
        site: `${SITE}/`,
        license: 'CC0-1.0',
        languages: LANGS,
        descriptions: { en: ABOUT.en, zh: ABOUT.zh, fr: ABOUT.fr },
        updatedAt: s.updated,
        counts: s,
        categories: catMeta,
        endpoints: {
          source: `${REPO}/blob/main/data/entries.json`,
          llms: `${SITE}/llms.txt`,
          llmsFull: `${SITE}/llms-full.txt`,
          skill: `${SITE}/skill.md`,
          section: `${SITE}/c/<slug>.md`,
          api: 'POST https://api.typesafe.ai/v1/systemone',
        },
        primitives: PRIMITIVES.map((p) => ({ name: p.name, question: p.q.en, returns: p.r.en })),
      },
      entries: entries.map((e) => ({
        id: e.id,
        name: e.name,
        url: e.url,
        kind: e.kind,
        category: e.category,
        rule: CATEGORY_BY_ID.get(e.category)?.stamp || null,
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
    },
    null,
    2,
  );
}

/* ------------------------------------------------------- sitemap, robots */

const anchorOf = (str) =>
  String(str)
    .toLowerCase()
    .replace(/[`*_~]/g, '')
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-');

function sitemap() {
  const urls = [
    { loc: `${SITE}/`, pri: '1.0', freq: 'daily' },
    { loc: `${SITE}/zh/`, pri: '0.9', freq: 'daily' },
    { loc: `${SITE}/fr/`, pri: '0.9', freq: 'daily' },
    ...cats.map((c) => ({ loc: `${SITE}/#${c.id}`, pri: '0.7', freq: 'weekly' })),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${s.updated}</lastmod>
    <changefreq>${u.freq}</changefreq>
    <priority>${u.pri}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${SITE}/"/>
    <xhtml:link rel="alternate" hreflang="zh_CN" href="${SITE}/zh/"/>
    <xhtml:link rel="alternate" hreflang="fr_FR" href="${SITE}/fr/"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}/"/>
  </url>`,
  )
  .join('\n')}
</urlset>
`;
}

function robots() {
  return [
    'User-agent: *',
    'Allow: /',
    '',
    '# AI crawlers and model fetches are explicitly welcome — that is the point.',
    ...['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended', 'anthropic-ai', 'Claude-User', 'cohere-ai'].map(
      (bot) => `User-agent: ${bot}\nAllow: /`,
    ),
    '',
    `Sitemap: ${SITE}/sitemap.xml`,
    '',
  ].join('\n');
}

/* ------------------------------------------------------------------- OG */

function ogSvg() {
  const top = entries
    .filter((e) => e.kind === 'repo' && e.stars)
    .slice(0, 3)
    .map((e, i) => `<text x="70" y="${404 + i * 34}" font-family="DM Mono, monospace" font-size="21" fill="#4a4841">${String(e.name).replace(/&/g, '&amp;').replace(/</g, '&lt;')} · ★${fmtStars(e.stars)}</text>`)
    .join('\n');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#fbfaf6"/>
  <rect x="0" y="0" width="1200" height="8" fill="#14130f"/>
  <rect x="0" y="286" width="1200" height="2" fill="#14130f"/>
  <rect x="0" y="286" width="1200" height="112" fill="none"/>
  <text x="70" y="196" font-family="Archivo, Helvetica, Arial, sans-serif" font-size="86" font-weight="700" fill="#14130f" letter-spacing="-3">Awesome Jev</text>
  <text x="70" y="252" font-family="DM Mono, monospace" font-size="24" fill="#7d7a70" letter-spacing="2">EVERYTHING IS A DECISION.</text>
  <g stroke="#7d7a70" stroke-width="1">
    <line x1="70" y1="316" x2="1130" y2="316"/>
    <line x1="70" y1="348" x2="1130" y2="348"/>
    <line x1="70" y1="380" x2="1130" y2="380"/>
  </g>
  <g stroke="#14130f" stroke-width="1">
    <line x1="70" y1="316" x2="70" y2="380"/>
    <line x1="880" y1="316" x2="880" y2="380"/>
    <line x1="990" y1="316" x2="990" y2="380"/>
    <line x1="1130" y1="316" x2="1130" y2="380"/>
  </g>
  <text x="70" y="339" font-family="DM Mono, monospace" font-size="15" fill="#7d7a70">RULE</text>
  <text x="380" y="339" font-family="DM Mono, monospace" font-size="15" fill="#7d7a70">PROJECT</text>
  <text x="1000" y="339" font-family="DM Mono, monospace" font-size="15" fill="#7d7a70">★</text>
  ${top}
  <rect x="880" y="316" width="110" height="64" fill="#b3261e"/>
  <text x="935" y="356" text-anchor="middle" font-family="DM Mono, monospace" font-size="20" fill="#fbfaf6" font-weight="500">0.94</text>
  <text x="70" y="470" font-family="Archivo, Helvetica, Arial, sans-serif" font-size="27" font-weight="600" fill="#14130f">${s.entries} projects · ${fmtStars(s.stars)} stars · ${cats.length} rules</text>
  <text x="70" y="512" font-family="DM Mono, monospace" font-size="21" fill="#4a4841">Typed judgments. Calibrated probabilities. No prose to parse.</text>
  <rect x="70" y="546" width="1200" y="0" fill="none"/>
  <line x1="70" y1="546" x2="1130" y2="546" stroke="#14130f" stroke-width="3"/>
  <text x="70" y="586" font-family="DM Mono, monospace" font-size="19" fill="#7d7a70">EN · 中文 · FRANÇAIS — generated from one data file</text>
</svg>
`;
}

/* ------------------------------------------------------------------ main */

function main() {
  const written = {};
  fs.mkdirSync(SECTIONS, { recursive: true });

  written['docs/llms.txt'] = write(path.join(OUT, 'llms.txt'), llmsTxt());
  written['docs/llms-full.txt'] = write(path.join(OUT, 'llms-full.txt'), llmsFull());
  written['docs/skill.md'] = write(path.join(OUT, 'skill.md'), skillMd());
  written['docs/projects.json'] = write(path.join(OUT, 'projects.json'), projectsJson());
  written['docs/sitemap.xml'] = write(path.join(OUT, 'sitemap.xml'), sitemap());
  written['docs/robots.txt'] = write(path.join(OUT, 'robots.txt'), robots());

  for (const c of cats) {
    written[`docs/c/${c.id}.md`] = write(path.join(SECTIONS, `${c.id}.md`), sectionMarkdown(c));
  }

  fs.mkdirSync(path.join(OUT, 'assets'), { recursive: true });
  written['docs/assets/og.svg'] = write(path.join(OUT, 'assets', 'og.svg'), ogSvg());

  // Mirrored at the repository root: this is what raw.githubusercontent.com serves
  // and what `npx skills add` reads.
  for (const [name, body] of [
    ['llms.txt', llmsTxt()],
    ['llms-full.txt', llmsFull()],
    ['skill.md', skillMd()],
    ['projects.json', projectsJson()],
  ]) {
    written[name] = write(path.join(ROOT, name), body);
  }

  console.log(
    JSON.stringify(
      {
        entries: s.entries,
        stars: s.stars,
        rules: cats.length,
        files: Object.keys(written).length,
        updated: s.updated,
      },
      null,
      2,
    ),
  );
}

main();