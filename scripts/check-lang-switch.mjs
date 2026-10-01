#!/usr/bin/env node
/**
 * Checks the language switcher in the built HTML — statically, no browser, so CI
 * can run it.
 *
 * This exists because the switcher shipped broken: the template concatenated
 * BASE (`/awesome-jev`, no trailing slash) with the locale path, producing
 * `/awesome-jevzh/` and `/awesome-jevfr/`. English worked because it appended a
 * literal `/`, so the bug only showed on two of three links and no existing check
 * looked at the visible nav at all — check-parity asserted the hreflang <link>
 * elements, which were correct, not the anchors a person clicks.
 *
 * For each of the three pages it asserts, per anchor:
 *   - href resolves to the path that locale must live at
 *   - hreflang matches the locale
 *   - the lang attribute matches (CJK needs it for font and hyphenation selection)
 *   - aria-current="page" is on exactly one link, the one for this page
 *
 *   node scripts/check-lang-switch.mjs
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const BASE = process.env.AWEJEV_BASE || '/awesome-jev';

const LANGS = [
  { key: 'en', hreflang: 'en', path: '/' },
  { key: 'zh', hreflang: 'zh_CN', path: '/zh/' },
  { key: 'fr', hreflang: 'fr_FR', path: '/fr/' },
];

const PAGES = [
  { file: 'docs/index.html', lang: 'en' },
  { file: 'docs/zh/index.html', lang: 'zh' },
  { file: 'docs/fr/index.html', lang: 'fr' },
];

/** Resolves an href attribute against the site root, the way a browser would. */
function resolve(href) {
  if (/^https?:/i.test(href)) return new URL(href).pathname;
  const base = BASE.endsWith('/') ? BASE : `${BASE}/`;
  return new URL(href.replace(/^\//, ''), `https://example.invalid/${base}`).pathname;
}

let failures = 0;
const problems = [];

for (const page of PAGES) {
  const file = path.join(ROOT, page.file);
  if (!fs.existsSync(file)) {
    problems.push(`${page.file}: missing — run npm run build`);
    failures++;
    continue;
  }
  const html = fs.readFileSync(file, 'utf8');

  const nav = html.match(/<nav class="?langs"?[^>]*>([\s\S]*?)<\/nav>/);
  if (!nav) {
    problems.push(`${page.file}: no .langs nav rendered`);
    failures++;
    continue;
  }

  const anchors = [...nav[1].matchAll(/<a\s([^>]*)>/g)].map((m) => {
    const attrs = m[1];
    const get = (name) => (attrs.match(new RegExp(`${name}=["']?([^"'>\\s]+)`, 'i')) || [])[1];
    const current = /aria-current=["']?page/i.test(attrs);
    return {
      href: get('href'),
      hreflang: get('hreflang'),
      lang: get('lang'),
      current,
      text: (attrs.match(/>([\s\S]*?)</) || [])[1] || '',
    };
  });

  if (anchors.length !== LANGS.length) {
    problems.push(`${page.file}: expected ${LANGS.length} language links, found ${anchors.length}`);
    failures++;
    continue;
  }

  const seenCurrent = [];
  for (const a of anchors) {
    const spec = LANGS.find((l) => l.hreflang === a.hreflang);
    const label = (a.text || a.href || '?').trim().slice(0, 12);
    if (!spec) {
      problems.push(`${page.file}: link "${label}" has unknown hreflang "${a.hreflang}"`);
      failures++;
      continue;
    }
    const expected = `${BASE}${spec.path}`;
    const actual = resolve(a.href);
    if (actual !== expected) {
      problems.push(`${page.file}: "${label}" points at ${actual}, expected ${expected}`);
      failures++;
    }
    if (a.lang !== spec.hreflang) {
      problems.push(`${page.file}: "${label}" lang="${a.lang}", expected "${spec.hreflang}"`);
      failures++;
    }
    if (a.current) seenCurrent.push(spec.key);
    if (a.current && spec.key !== page.lang) {
      problems.push(`${page.file}: aria-current is on "${label}" but this is the ${page.lang} page`);
      failures++;
    }
  }

  if (seenCurrent.length !== 1) {
    problems.push(`${page.file}: ${seenCurrent.length} links carry aria-current, expected exactly 1`);
    failures++;
  }

  if (!problems.some((p) => p.startsWith(page.file))) {
    console.log(`${page.file}: all ${anchors.length} language links resolve correctly`);
  }
}

if (failures) {
  console.error(`\n${failures} problem(s):`);
  for (const p of problems) console.error(`  ${p}`);
  process.exit(1);
}
console.log('\nlanguage switcher correct on all three pages');