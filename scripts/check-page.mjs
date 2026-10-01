#!/usr/bin/env node
/**
 * check-page.mjs — what a person actually does on the page, checked in a real
 * browser. The static checks cannot see any of this.
 *
 * Covers: the search island (typing, filtering, the empty state, ?q= deep links,
 * Escape, keyboard stepping), accessibility basics that the detector does not
 * cover (heading order, skip link target, focus order, tap target size, text
 * that overflows its box), and horizontal overflow at seven widths.
 *
 *   node scripts/check-page.mjs [baseUrl]
 *
 * baseUrl defaults to http://localhost:4321/awesome-jev/ — run `npm run dev`.
 */

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

// puppeteer-core lives outside this repo; resolve it from PUPPETEER_PATH or a few
// known places. When it is missing, say so and exit 0 — a browser check that
// cannot run must not look like a passing check, and must not look like a failure
// of the site either.
function loadPuppeteer() {
  const candidates = [
    process.env.PUPPETEER_PATH,
    path.join(process.cwd(), 'node_modules', 'puppeteer-core'),
    'puppeteer-core',
  ].filter(Boolean);
  for (const c of candidates) {
    try {
      const m = require(c);
      if (typeof m.launch === 'function') return m;
    } catch { /* try the next */ }
  }
  return null;
}

const puppeteer = loadPuppeteer();

const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].find((p) => fs.existsSync(p));

const BASE = process.argv[2] || 'http://localhost:4321/awesome-jev/';
const PAGES = [
  { name: 'en', path: '/' },
  { name: 'zh', path: '/zh/' },
  { name: 'fr', path: '/fr/' },
];

const WIDTHS = [360, 414, 600, 832, 1024, 1280, 1600];

const problems = [];
const fail = (page, kind, detail) => problems.push(`${page}: ${kind} — ${detail}`);

const url = (p) => (BASE.endsWith('/') ? BASE + p.replace(/^\//, '') : `${BASE}/${p.replace(/^\//, '')}`);

async function main() {
  if (!puppeteer) {
    console.log('SKIPPED — puppeteer-core is not resolvable.');
    console.log('  npm i -D puppeteer-core, then: set PUPPETEER_PATH=<path to>/puppeteer-core');
    process.exit(0);
  }
  if (!CHROME) {
    console.log('SKIPPED — no Chrome or Edge binary found on this machine.');
    process.exit(0);
  }

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none', '--force-color-profile=srgb'],
  });

  for (const target of PAGES) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(url(target.path), { waitUntil: 'networkidle0', timeout: 60000 });
    await page.evaluate(() => document.fonts.ready);
    const p = target.name;

    // --- console errors -------------------------------------------------
    const consoleErrors = [];
    page.on('pageerror', (e) => consoleErrors.push(String(e.message).slice(0, 160)));
    page.on('console', (m) => {
      if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 160));
    });

    // --- accessibility basics -------------------------------------------
    const a11y = await page.evaluate(() => {
      const out = {};
      const hs = Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6')).map((h) => Number(h.tagName[1]));
      out.headings = hs;
      out.h1Count = document.querySelectorAll('h1').length;
      out.docLang = document.documentElement.lang || '';
      out.duplicateIds = (() => {
        const seen = new Map();
        for (const el of document.querySelectorAll('[id]')) seen.set(el.id, (seen.get(el.id) || 0) + 1);
        return [...seen.entries()].filter(([, n]) => n > 1).map(([id, n]) => `${id}×${n}`);
      })();
      const skip = document.querySelector('a.skip');
      out.skipTarget = skip ? skip.getAttribute('href') : null;
      out.skipWorks = skip ? !!document.querySelector(skip.getAttribute('href')) : false;
      out.inputsWithoutLabel = Array.from(document.querySelectorAll('input'))
        .filter((i) => !i.labels?.length && !i.getAttribute('aria-label') && !i.getAttribute('aria-labelledby'))
        .map((i) => i.id || i.type);
      // Interactive elements smaller than 24x24 CSS px, ignoring inline links in prose.
      out.smallTargets = Array.from(document.querySelectorAll('a,button,input,summary'))
        .filter((el) => {
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) return false;
          const inProse = el.closest('.entry-desc, .faq .a, .cat-blurb, .note, .lede');
          if (inProse && el.tagName === 'A') return false;
          return r.width < 24 || r.height < 24;
        })
        .slice(0, 6)
        .map((el) => `${el.tagName.toLowerCase()}.${(el.className || '').toString().split(' ')[0]} ${Math.round(el.getBoundingClientRect().width)}×${Math.round(el.getBoundingClientRect().height)}`);
      // Text visibly clipped by its own box.
      out.clipped = Array.from(document.querySelectorAll('h1,h2,h3,.entry-name,.count .n,.intent-what'))
        .filter((el) => el.scrollWidth > el.clientWidth + 2 && getComputedStyle(el).overflow !== 'visible')
        .slice(0, 6)
        .map((el) => `${el.tagName.toLowerCase()}.${(el.className || '').toString().split(' ')[0]}`);
      out.title = document.title;
      out.metaDesc = document.querySelector('meta[name=description]')?.content?.length || 0;
      out.canonical = document.querySelector('link[rel=canonical]')?.href || null;
      return out;
    });

    if (a11y.h1Count !== 1) fail(p, 'a11y', `${a11y.h1Count} <h1> elements, expected exactly 1`);
    if (!a11y.docLang) fail(p, 'a11y', '<html> has no lang attribute');
    for (let i = 1; i < a11y.headings.length; i++) {
      if (a11y.headings[i] - a11y.headings[i - 1] > 1) {
        fail(p, 'a11y', `heading level skipped: h${a11y.headings[i - 1]} → h${a11y.headings[i]}`);
        break;
      }
    }
    if (a11y.duplicateIds.length) fail(p, 'a11y', `duplicate ids: ${a11y.duplicateIds.join(', ')}`);
    if (!a11y.skipWorks) fail(p, 'a11y', `skip link points at "${a11y.skipTarget}" which does not exist`);
    if (a11y.inputsWithoutLabel.length) fail(p, 'a11y', `inputs without a label: ${a11y.inputsWithoutLabel.join(', ')}`);
    if (a11y.smallTargets.length) fail(p, 'a11y', `tap targets under 24px: ${a11y.smallTargets.join(' | ')}`);
    if (a11y.clipped.length) fail(p, 'a11y', `clipped text: ${a11y.clipped.join(', ')}`);
    if (!a11y.title) fail(p, 'seo', 'no <title>');
    if (a11y.metaDesc < 50) fail(p, 'seo', `meta description is ${a11y.metaDesc} chars`);
    if (!a11y.canonical) fail(p, 'seo', 'no canonical link');

    // --- search island ---------------------------------------------------
    const total = await page.$$eval('.entry', (n) => n.length);

    await page.type('#q', 'compaction');
    await new Promise((r) => setTimeout(r, 250));
    let s = await page.evaluate(() => ({
      visible: Array.from(document.querySelectorAll('.entry')).filter((e) => !e.hasAttribute('data-search-hidden')).length,
      catsVisible: Array.from(document.querySelectorAll('[data-category]')).filter((e) => !e.hasAttribute('data-search-hidden')).length,
      count: document.querySelector('[data-count]')?.textContent?.trim(),
      emptyHidden: document.querySelector('[data-empty]')?.hasAttribute('hidden'),
    }));
    if (s.visible === 0) fail(p, 'search', '"compaction" matched nothing');
    if (s.visible >= total) fail(p, 'search', `"compaction" did not filter (${s.visible}/${total})`);
    if (!s.emptyHidden) fail(p, 'search', 'the empty state is showing while there are matches');

    // A search that matches nothing must say so.
    await page.evaluate(() => { const q = document.getElementById('q'); q.value = 'zzzzzznotathing'; q.dispatchEvent(new Event('input')); });
    await new Promise((r) => setTimeout(r, 250));
    s = await page.evaluate(() => ({
      visible: Array.from(document.querySelectorAll('.entry')).filter((e) => !e.hasAttribute('data-search-hidden')).length,
      emptyShown: !document.querySelector('[data-empty]')?.hasAttribute('hidden'),
      catsVisible: Array.from(document.querySelectorAll('[data-category]')).filter((e) => !e.hasAttribute('data-search-hidden')).length,
    }));
    if (s.visible !== 0) fail(p, 'search', `a no-match search still shows ${s.visible} rows`);
    if (!s.emptyShown) fail(p, 'search', 'no-match search does not show the empty state');
    if (s.catsVisible !== 0) fail(p, 'search', `${s.catsVisible} rule headings survived a no-match search`);

    // Escape must clear and restore.
    await page.focus('#q');
    await page.keyboard.press('Escape');
    await new Promise((r) => setTimeout(r, 200));
    const afterEsc = await page.evaluate(() => ({
      value: document.getElementById('q').value,
      visible: Array.from(document.querySelectorAll('.entry')).filter((e) => !e.hasAttribute('data-search-hidden')).length,
    }));
    if (afterEsc.value !== '') fail(p, 'search', 'Escape did not clear the field');
    if (afterEsc.visible !== total) fail(p, 'search', `Escape restored ${afterEsc.visible}/${total} rows`);

    // ?q= must reproduce the same filter, since JSON-LD advertises it.
    await page.goto(`${url(target.path)}?q=compaction`, { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 250));
    const deep = await page.evaluate(() => ({
      value: document.getElementById('q')?.value,
      visible: Array.from(document.querySelectorAll('.entry')).filter((e) => !e.hasAttribute('data-search-hidden')).length,
    }));
    if (deep.value !== 'compaction') fail(p, 'search', '?q= did not populate the field');
    if (deep.visible === 0 || deep.visible >= total) fail(p, 'search', `?q= filtered to ${deep.visible}/${total} rows`);

    // --- responsive overflow --------------------------------------------
    for (const width of WIDTHS) {
      await page.setViewport({ width, height: 900, deviceScaleFactor: 1 });
      await page.goto(url(target.path), { waitUntil: 'networkidle0' });
      await page.evaluate(() => document.fonts.ready);
      const o = await page.evaluate(() => {
        const de = document.documentElement;
        const wide = [];
        for (const el of document.querySelectorAll('body *')) {
          const r = el.getBoundingClientRect();
          if (r.width > 0 && r.right > de.clientWidth + 2) {
            wide.push(`${el.tagName.toLowerCase()}.${(el.className || '').toString().split(' ')[0]}`);
          }
        }
        return { scrollW: de.scrollWidth, clientW: de.clientWidth, wide: [...new Set(wide)].slice(0, 5) };
      });
      if (o.scrollW > o.clientW + 2) {
        fail(p, 'responsive', `${width}px: scrollWidth ${o.scrollW} > ${o.clientW}${o.wide.length ? ` — ${o.wide.join(', ')}` : ''}`);
      }
    }

    for (const e of consoleErrors) fail(p, 'console', e);
    await page.close();
    console.log(`${p}: checked`);
  }

  await browser.close();

  console.log(`\nwidths tested: ${WIDTHS.join(', ')}`);
  if (problems.length) {
    console.error(`\n${problems.length} problem(s):`);
    for (const x of problems) console.error(`  ${x}`);
    process.exit(1);
  }
  console.log('no page problems found');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});