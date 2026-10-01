#!/usr/bin/env node
/**
 * build-readme.mjs — renders the directory tables into README.md / README.zh.md /
 * README.fr.md from data/entries.json.
 *
 * Prose outside the markers is never touched, so the marketing and explainer
 * copy stays hand-written while the directory itself stays generated. That split
 * is what lets the free-AI curator edit one JSON file and have all three
 * languages stay consistent.
 *
 *   node scripts/build-readme.mjs           # render
 *   node scripts/build-readme.mjs --check   # exit 1 if stale (for CI)
 */

import fs from 'node:fs';
import path from 'node:path';
import {
  ROOT, LANGS, CATEGORIES, orderedCategories, desc, fmtStars, tags, loadEntries, totals,
} from './lib/catalog.mjs';

const README_FOR = { en: 'README.md', zh: 'README.zh.md', fr: 'README.fr.md' };
const START = '<!-- entries:start -->';
const END = '<!-- entries:end -->';

const HEADER = {
  en: '| Project | Description | Lang / License | ⭐ | Pushed |',
  zh: '| 项目 | 说明 | 语言 / 许可 | ⭐ | 更新 |',
  fr: '| Projet | Description | Lang / Licence | ⭐ | Maj |',
};
const SEP = '| --- | --- | --- | --- | --- |';
const NONE = {
  en: '_Nothing here yet — be the first._',
  zh: '_这里还空着——来做第一个。_',
  fr: '_Rien ici pour l\'instant — soyez le premier._',
};
const COUNT_UNIT = { en: (n) => `${n} ${n === 1 ? 'entry' : 'entries'}`, zh: (n) => `${n} 项`, fr: (n) => `${n} ${n === 1 ? 'entrée' : 'entrées'}` };

function renderTable(items, lang) {
  if (!items.length) return NONE[lang] + '\n';
  const rows = items.map((e) => {
    const t = tags(e).join(' · ') || '—';
    return `| [${e.name}](${e.url}) | ${desc(e, lang)} | ${t} | ${fmtStars(e.stars)} | ${e.pushedAt || '—'} |`;
  });
  return [HEADER[lang], SEP, ...rows].join('\n') + '\n';
}

function renderBody(db, lang) {
  const t = totals(db.entries, db.updatedAt);
  const cats = orderedCategories(db.entries);
  const sections = cats.map((c) => {
    const title = c[lang] || c.en;
    const blurb = lang === 'zh' ? c.blurbZh : lang === 'fr' ? c.blurbFr : c.blurb;
    return `## ${title}\n\n${blurb} _(${COUNT_UNIT[lang](c.items.length)})_\n\n${renderTable(c.items, lang)}`;
  });

  const nav = [
    `<!-- ${t.entries} entries · ${t.repos} repos · ${fmtStars(t.stars)} stars · ${t.languages} languages · updated ${t.updated} -->`,
    '',
    ...CATEGORIES.filter((c) => cats.some((x) => x.id === c.id)).map((c) => `- [${c[lang] || c.en}](#${(c[lang] || c.en).toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, '').replace(/\s+/g, '-')}) — ${cats.find((x) => x.id === c.id).items.length}`),
    '',
    sections.join('\n'),
  ].join('\n');
  return nav;
}

function replaceBlock(text, body) {
  const s = text.indexOf(START);
  const e = text.indexOf(END);
  if (s === -1 || e === -1 || e < s) throw new Error(`markers not found — expected ${START} … ${END}`);
  return text.slice(0, s + START.length) + '\n\n' + body + '\n' + text.slice(e);
}

const check = process.argv.includes('--check');
const db = loadEntries();
const t = totals(db.entries, db.updatedAt);
const changed = [];

for (const lang of LANGS) {
  const file = path.join(ROOT, README_FOR[lang]);
  if (!fs.existsSync(file)) {
    if (!check) console.warn(`[readme] ${README_FOR[lang]} missing, skipped`);
    continue;
  }
  const before = fs.readFileSync(file, 'utf8');
  let after = replaceBlock(before, renderBody(db, lang));
  // Footer counters, in both scripts' wording.
  after = after
    .replace(/\*Star counts as of [\d-]+\.\*/, `*Star counts as of ${t.updated}.*`)
    .replace(/\*星标数截止 [\d-]+。\*/, `*星标数截止 ${t.updated}。*`)
    .replace(/\*Nombre d'étoiles au [\d-]+\.\*/, `*Nombre d'étoiles au ${t.updated}.*`);
  if (after !== before) {
    changed.push(README_FOR[lang]);
    if (!check) fs.writeFileSync(file, after, 'utf8');
  }
}

console.log(JSON.stringify({ totals: t, changed, check }, null, 2));
if (check && changed.length) {
  console.error(`\nStale generated block in: ${changed.join(', ')}\nRun: node scripts/build-readme.mjs`);
  process.exit(1);
}