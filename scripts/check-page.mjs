#!/usr/bin/env node
/**
 * check-page.mjs — what a person actually does on the page, checked in a real
 * browser engine. The static checks cannot see any of this.
 *
 * Covers: the search island (typing, filtering, the empty state, Escape, ?q= deep
 * links, diacritic folding), accessibility basics the detector does not cover
 * (heading order, skip link target, duplicate ids, unlabelled inputs, tap target
 * size, clipped text), console errors, and horizontal overflow at seven widths.
 *
 *   node scripts/check-page.mjs [baseUrl]
 *
 * The browser is Kitesurf — Cloudflare's stateless engine on Workers, over the
 * Chrome DevTools Protocol at a no-sign-in playground endpoint. It is remote, so
 * it cannot reach localhost: the default base URL is the deployed site, and a
 * local run passes its own URL.
 *
 * Zero npm dependencies: scripts/lib/cdp.mjs is a plain WebSocket CDP client.
 */

import { launchCDP, KITESURF_WS } from './lib/cdp.mjs';

const BASE = process.argv[2] || 'https://hdjekuue.github.io/awesome-jev/';

const PAGES = [
  { name: 'en', path: '/' },
  { name: 'zh', path: '/zh/' },
  { name: 'fr', path: '/fr/' },
];

const WIDTHS = [360, 414, 600, 832, 1024, 1280, 1600];

const problems = [];
const fail = (page, kind, detail) => problems.push(`${page}: ${kind} — ${detail}`);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const url = (p) => (BASE.endsWith('/') ? BASE + p.replace(/^\//, '') : `${BASE}/${p.replace(/^\//, '')}`);

async function main() {
  const session = await launchCDP();
  console.log(`browser: ${session.version} via ${KITESURF_WS}`);
  console.log(`base:    ${BASE}\n`);

  for (const target of PAGES) {
    const page = await session.newPage({ width: 1440, height: 900 });
    const p = target.name;

    await page.goto(url(target.path), { wait: true, timeout: 45000 });
    await wait(400);

    // --- accessibility basics -------------------------------------------
    const a = await page.evaluate(() => {
      const hs = Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6')).map((h) => Number(h.tagName[1]));
      const seen = new Map();
      for (const el of document.querySelectorAll('[id]')) seen.set(el.id, (seen.get(el.id) || 0) + 1);
      const skip = document.querySelector('a.skip');
      return {
        headings: hs,
        h1Count: document.querySelectorAll('h1').length,
        docLang: document.documentElement.lang || '',
        duplicateIds: [...seen.entries()].filter(([, n]) => n > 1).map(([id, n]) => `${id}×${n}`),
        skipHref: skip ? skip.getAttribute('href') : null,
        skipWorks: skip ? !!document.querySelector(skip.getAttribute('href')) : false,
        inputsWithoutLabel: Array.from(document.querySelectorAll('input'))
          .filter((i) => !i.labels?.length && !i.getAttribute('aria-label') && !i.getAttribute('aria-labelledby'))
          .map((i) => i.id || i.type),
        smallTargets: Array.from(document.querySelectorAll('a,button,input,summary'))
          .filter((el) => {
            const r = el.getBoundingClientRect();
            if (r.width === 0 || r.height === 0) return false;
            const inProse = el.closest('.entry-desc, .faq .a, .cat-blurb, .note, .lede');
            if (inProse && el.tagName === 'A') return false;
            return r.width < 24 || r.height < 24;
          })
          .slice(0, 6)
          .map((el) => {
            const r = el.getBoundingClientRect();
            return `${el.tagName.toLowerCase()}.${(el.className || '').toString().split(' ')[0]} ${Math.round(r.width)}×${Math.round(r.height)}`;
          }),
        clipped: Array.from(document.querySelectorAll('h1,h2,h3,.entry-name,.count .n,.intent-what'))
          .filter((el) => el.scrollWidth > el.clientWidth + 2 && getComputedStyle(el).overflow !== 'visible')
          .slice(0, 6)
          .map((el) => `${el.tagName.toLowerCase()}.${(el.className || '').toString().split(' ')[0]}`),
        title: document.title,
        metaDesc: (document.querySelector('meta[name=description]')?.content || '').length,
        canonical: document.querySelector('link[rel=canonical]')?.href || null,
        font: getComputedStyle(document.body).fontFamily.split(',')[0].replace(/"/g, '').trim(),
        totalRows: document.querySelectorAll('.entry').length,
        hasSearch: !!document.getElementById('q'),
      };
    });

    if (a.h1Count !== 1) fail(p, 'a11y', `${a.h1Count} <h1> elements, expected exactly 1`);
    if (!a.docLang) fail(p, 'a11y', '<html> has no lang attribute');
    for (let i = 1; i < a.headings.length; i++) {
      if (a.headings[i] - a.headings[i - 1] > 1) {
        fail(p, 'a11y', `heading level skipped: h${a.headings[i - 1]} → h${a.headings[i]}`);
        break;
      }
    }
    if (a.duplicateIds.length) fail(p, 'a11y', `duplicate ids: ${a.duplicateIds.join(', ')}`);
    if (!a.skipWorks) fail(p, 'a11y', `skip link points at "${a.skipHref}" which does not exist`);
    if (a.inputsWithoutLabel.length) fail(p, 'a11y', `inputs without a label: ${a.inputsWithoutLabel.join(', ')}`);
    if (a.smallTargets.length) fail(p, 'a11y', `tap targets under 24px: ${a.smallTargets.join(' | ')}`);
    if (a.clipped.length) fail(p, 'a11y', `clipped text: ${a.clipped.join(', ')}`);
    if (!a.title) fail(p, 'seo', 'no <title>');
    if (a.metaDesc < 50) fail(p, 'seo', `meta description is ${a.metaDesc} chars`);
    if (!a.canonical) fail(p, 'seo', 'no canonical link');
    if (a.font !== 'Archivo') fail(p, 'fonts', `body is in "${a.font}", expected Archivo — the self-hosted face did not load`);

    // --- search island ---------------------------------------------------
    if (!a.hasSearch) {
      fail(p, 'search', 'the search input did not render');
      await page.close();
      continue;
    }

    const total = a.totalRows;
    const visibleRows = () => page.evaluate(() => Array.from(document.querySelectorAll('.entry')).filter((e) => !e.hasAttribute('data-search-hidden')).length);
    const visibleCats = () => page.evaluate(() => Array.from(document.querySelectorAll('[data-category]')).filter((e) => !e.hasAttribute('data-search-hidden')).length);

    await page.setValue('#q', 'compaction');
    await wait(350);
    let n = await visibleRows();
    let cats = await visibleCats();
    if (n === 0) fail(p, 'search', '"compaction" matched nothing');
    if (n >= total) fail(p, 'search', `"compaction" did not filter (${n}/${total})`);
    if (cats === 0) fail(p, 'search', 'a matching search removed every rule heading');
    const emptyEarly = await page.evaluate(() => !document.querySelector('[data-empty]')?.hasAttribute('hidden'));
    if (emptyEarly) fail(p, 'search', 'the empty state shows while there are matches');

    await page.setValue('#q', 'zzzzzznotathing');
    await wait(350);
    n = await visibleRows();
    cats = await visibleCats();
    const emptyShown = await page.evaluate(() => !document.querySelector('[data-empty]')?.hasAttribute('hidden'));
    if (n !== 0) fail(p, 'search', `a no-match search still shows ${n} rows`);
    if (!emptyShown) fail(p, 'search', 'no-match search does not show the empty state');
    if (cats !== 0) fail(p, 'search', `${cats} rule headings survived a no-match search`);

    await page.press('Escape');
    await wait(350);
    const esc = await page.evaluate(() => ({
      value: document.getElementById('q').value,
      visible: Array.from(document.querySelectorAll('.entry')).filter((e) => !e.hasAttribute('data-search-hidden')).length,
    }));
    if (esc.value !== '') fail(p, 'search', 'Escape did not clear the field');
    if (esc.visible !== total) fail(p, 'search', `Escape restored ${esc.visible}/${total} rows`);

    // Diacritics must fold so "reseau" finds "réseau". The expectation is computed
    // independently here; reusing the page's own helper would agree with the bug.
    await page.setValue('#q', 'reseau');
    await wait(350);
    const folded = await visibleRows();
    const expectedFolded = await page.evaluate(() => {
      const f = (s) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
      return Array.from(document.querySelectorAll('.entry')).filter((e) => f(e.dataset.search || '').includes('reseau')).length;
    });
    if (folded !== expectedFolded) {
      fail(p, 'search', `diacritic folding is wrong: "reseau" showed ${folded} rows, expected ${expectedFolded}`);
    }

    await page.goto(`${url(target.path)}?q=compaction`, { wait: true, timeout: 45000 });
    await wait(500);
    const deep = await page.evaluate(() => ({
      value: document.getElementById('q')?.value,
      visible: Array.from(document.querySelectorAll('.entry')).filter((e) => !e.hasAttribute('data-search-hidden')).length,
    }));
    if (deep.value !== 'compaction') fail(p, 'search', '?q= did not populate the field');
    if (deep.visible === 0 || deep.visible >= total) fail(p, 'search', `?q= filtered to ${deep.visible}/${total} rows`);

    // --- responsive overflow --------------------------------------------
    for (const width of WIDTHS) {
      await page.setViewport({ width, height: 900 });
      await page.goto(url(target.path), { wait: true, timeout: 45000 });
      await wait(250);
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

    for (const e of page.errors) fail(p, 'console', e);

    await page.close();
    console.log(`  ${p}: checked (${total} rows, ${a.font})`);
  }

  session.close();

  console.log(`\nwidths tested: ${WIDTHS.join(', ')}`);
  if (problems.length) {
    console.error(`\n${problems.length} problem(s):`);
    for (const x of problems) console.error(`  ${x}`);
    process.exit(1);
  }
  console.log('no page problems found');
}

main().catch((e) => {
  console.error(`check-page: ${e.message || e}`);
  process.exit(1);
});