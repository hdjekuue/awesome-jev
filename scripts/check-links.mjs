#!/usr/bin/env node
/**
 * check-links.mjs — every internal reference in the built site must resolve to a
 * file that exists, and every same-document anchor must have a target.
 *
 * Two real bugs got through to production because no check looked at what a
 * person clicks:
 *   - the language switcher pointed at /awesome-jevzh/ (BASE had no trailing
 *     slash), so 中文 and Français 404'd from every page;
 *   - the intent rail interpolated `r.id` where the field is `r.to`, so all
 *     eight rows linked to `#undefined`.
 *
 * This walks all three pages and fails on either, plus dead `#anchors`, missing
 * assets, and hreflang/path disagreement.
 *
 *   node scripts/check-links.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { ROOT, BASE, LANGS, LANG_META, PATH_FOR } from '../src/lib/catalog.mjs';
import { anchors, assetRefs, ids, resolvePath, fragment, stripTags } from './lib/html.mjs';

const DOCS = path.join(ROOT, 'docs');

const PAGES = [
  { rel: 'index.html', urlPath: '/', lang: 'en' },
  { rel: 'zh/index.html', urlPath: '/zh/', lang: 'zh' },
  { rel: 'fr/index.html', urlPath: '/fr/', lang: 'fr' },
];

const problems = [];
const note = (page, kind, detail) => problems.push({ page, kind, detail });

/** Maps a served path to the file that must exist in docs/. */
function fileFor(pathname) {
  const rel = pathname.startsWith(BASE) ? pathname.slice(BASE.length) : null;
  if (rel === null) return { error: `path escapes the site base (${BASE})` };
  const clean = rel.replace(/^\/+/, '');
  if (clean === '') return path.join(DOCS, 'index.html');
  if (clean.endsWith('/')) return path.join(DOCS, clean, 'index.html');
  return path.join(DOCS, clean);
}

const exists = (p) => fs.existsSync(p) && fs.statSync(p).size > 0;

const checked = { pages: 0, links: 0, assets: 0, anchors: 0 };

for (const page of PAGES) {
  const file = path.join(DOCS, page.rel);
  if (!fs.existsSync(file)) {
    note(page.rel, 'missing-page', `${page.rel} was not built`);
    continue;
  }
  const html = fs.readFileSync(file, 'utf8');
  checked.pages++;

  const docIds = ids(html);

  // Duplicate ids break every fragment link that targets them.
  for (const [id, count] of docIds) {
    if (count > 1) note(page.rel, 'duplicate-id', `id="${id}" appears ${count} times`);
  }

  // --- anchors ---------------------------------------------------------
  for (const a of anchors(html)) {
    if (!a.href) {
      note(page.rel, 'anchor-no-href', `anchor "${a.text.slice(0, 40)}" has no href`);
      continue;
    }

    // A literal "undefined" in a built URL is always a template bug.
    if (/undefined/.test(a.href)) {
      note(page.rel, 'undefined-href', `anchor "${a.text.slice(0, 40)}" href="${a.href}"`);
      continue;
    }

    if (/^(https?:)?\/\//i.test(a.href)) {
      const path = new URL(a.href).pathname;
      // Cross-origin links to our own canonical host must still resolve on disk.
      if (a.href.includes('hdjekuue.github.io') || a.href.includes('example.invalid')) {
        if (!exists(fileFor(path))) note(page.rel, 'dead-link', `${a.href}`);
      }
      continue;
    }
    if (/^(mailto|tel|javascript):/i.test(a.href)) continue;

    checked.links++;
    const target = resolvePath(a.href, page.urlPath);

    if (fragment(a.href)) {
      const frag = fragment(a.href);
      if (target === page.urlPath && frag) {
        checked.anchors++;
        if (frag !== 'top' && !docIds.has(frag)) {
          note(page.rel, 'dead-anchor', `#${frag} (from "${a.text.slice(0, 40)}") has no target on this page`);
        }
        continue;
      }
    }

    if (target === null) continue;
    const resolvedFile = fileFor(target);
    if (!exists(resolvedFile)) {
      note(page.rel, 'dead-link', `${a.href} → ${path.relative(DOCS, resolvedFile) || target} (from "${a.text.slice(0, 40)}")`);
    }
  }

  // --- language switcher, asserted explicitly ---------------------------
  const nav = html.match(/<nav class="?langs"?[^>]*>([\s\S]*?)<\/nav>/);
  if (!nav) {
    note(page.rel, 'no-lang-switch', 'the .langs nav did not render');
  } else {
    const langLinks = [...nav[1].matchAll(/<a\b([^>]*)>/g)].map((m) => {
      const src = m[1];
      const get = (n) => (src.match(new RegExp(`(?:^|\\s)${n}="([^"]*)"`, 'i')) || [])[1];
      return {
        href: get('href'),
        hreflang: get('hreflang'),
        lang: get('lang'),
        current: /aria-current="page"/i.test(src),
      };
    });
    if (langLinks.length !== LANGS.length) {
      note(page.rel, 'lang-count', `expected ${LANGS.length} language links, found ${langLinks.length}`);
    }
    let currents = 0;
    for (const l of langLinks) {
      const spec = LANGS.find((x) => LANG_META[x].hreflang === l.hreflang);
      if (!spec) {
        note(page.rel, 'lang-hreflang', `unknown hreflang "${l.hreflang}"`);
        continue;
      }
      const want = `${BASE}${PATH_FOR[spec]}`;
      if (l.href !== want) note(page.rel, 'lang-path', `"${l.hreflang}" href="${l.href}", expected "${want}"`);
      if (l.lang !== LANG_META[spec].hreflang) note(page.rel, 'lang-attr', `"${l.hreflang}" lang="${l.lang}"`);
      if (l.current) {
        currents++;
        if (spec !== page.lang) note(page.rel, 'lang-current', `aria-current on ${spec} but page is ${page.lang}`);
      }
    }
    if (currents !== 1) note(page.rel, 'lang-current-count', `${currents} links carry aria-current, expected 1`);
  }

  // --- assets ----------------------------------------------------------
  for (const a of assetRefs(html)) {
    if (/^(https?:)?\/\//i.test(a.href) || /^(data|mailto):/i.test(a.href)) continue;
    checked.assets++;
    const target = resolvePath(a.href, page.urlPath);
    if (target === null) continue;
    const f = fileFor(target);
    if (!exists(f)) note(page.rel, 'missing-asset', `${a.rel} ${a.href}`);
  }

  // --- hreflang <link> set ---------------------------------------------
  const alts = [...html.matchAll(/<link[^>]+rel="?alternate"?[^>]*>/gi)].map((m) => m[0]);
  for (const need of ['en', 'zh_CN', 'fr_FR', 'x-default']) {
    if (!alts.some((t) => new RegExp(`hreflang="${need}"`).test(t))) {
      note(page.rel, 'missing-hreflang', `no <link rel=alternate hreflang="${need}">`);
    }
  }
}

/** Machine-readable exports must agree with the built pages. */
if (exists(path.join(DOCS, 'projects.json'))) {
  const pj = JSON.parse(fs.readFileSync(path.join(DOCS, 'projects.json'), 'utf8'));
  const html = fs.readFileSync(path.join(DOCS, 'index.html'), 'utf8');
  const rendered = (html.match(/class="?entry[ "]/g) || []).length;
  if (pj.entries.length !== rendered) {
    note('projects.json', 'count-mismatch', `${pj.entries.length} entries in JSON, ${rendered} rendered on the page`);
  }
  for (const id of ['llms.txt', 'llms-full.txt', 'skill.md', 'sitemap.xml', 'robots.txt']) {
    if (!exists(path.join(DOCS, id))) note('docs', 'missing-export', id);
  }
  // The skill and llms.txt must not promise an endpoint that does not exist.
  for (const f of ['llms.txt', 'skill.md']) {
    const text = fs.readFileSync(path.join(DOCS, f), 'utf8');
    for (const m of text.matchAll(/\$\{SITE\}\/[A-Za-z0-9_\/<>.·-]+/g)) {
      note(f, 'unresolved-template', m[0]);
    }
  }
}

console.log(`checked ${checked.pages} page(s): ${checked.links} internal links, ${checked.anchors} same-page anchors, ${checked.assets} asset refs`);

if (problems.length) {
  const byKind = {};
  for (const p of problems) (byKind[p.kind] ||= []).push(p);
  console.error(`\n${problems.length} problem(s):\n`);
  for (const [kind, list] of Object.entries(byKind)) {
    console.error(`  ${list.length}× ${kind}`);
    for (const p of list.slice(0, 8)) console.error(`      ${p.page}: ${p.detail}`);
    if (list.length > 8) console.error(`      … ${list.length - 8} more`);
  }
  process.exit(1);
}
console.log('no dead links, dead anchors, missing assets or hreflang gaps');