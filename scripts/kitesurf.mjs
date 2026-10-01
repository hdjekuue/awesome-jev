#!/usr/bin/env node
/**
 * kitesurf.mjs — drives a page through Kitesurf, Cloudflare's stateless browser
 * engine running on Workers.
 *
 * Why this exists in a repo about Jev: the curator's job is to check that a
 * submitted repository genuinely calls the Jev / System One API, and half the
 * time the evidence is in a rendered page rather than in the README text. Doing
 * that with a local Chromium means the automation only runs on a machine that
 * happens to have Chrome at a known path, which is why it usually does not run.
 * Kitesurf speaks the Chrome DevTools Protocol from a URL, needs no account on its
 * playground endpoint, and returns DOM, console, network and screenshots.
 *
 * It also removes a dependency, not just a path: no container, no Chromium
 * process, no ~300 MB download, and no state between runs — each connection is a
 * fresh browser, which is the right default for auditing someone else's page.
 *
 *   node scripts/kitesurf.mjs <url> [--shot out.png] [--html] [--console] [--json]
 *   node scripts/kitesurf.mjs https://example.com --json
 *
 * Set KITESURF_WS to point at Browser Run instead of the shared playground.
 */

import fs from 'node:fs';
import { launchBrowser, closeBrowser, newPage } from './lib/browser.mjs';

const KITESURF_WS = process.env.KITESURF_WS || 'wss://kitesurf.dev/devtools/browser';
const NO_SIGNIN = KITESURF_WS === 'wss://kitesurf.dev/devtools/browser';

const args = process.argv.slice(2);
const url = args.find((a) => !a.startsWith('--'));
if (!url) {
  console.error('usage: node scripts/kitesurf.mjs <url> [--shot file] [--html] [--console] [--json]');
  process.exit(1);
}
const flag = (n) => args.includes(`--${n}`);
const value = (n) => {
  const i = args.indexOf(`--${n}`);
  return i === -1 ? null : args[i + 1];
};

const WAIT = value('wait') || 'networkidle0';

async function main() {
  const session = await launchBrowser({ engine: 'kitesurf' });
  const { page, errors } = await newPage(session, {
    width: parseInt(value('width') || '1440', 10),
    height: parseInt(value('height') || '900', 10),
  });

  const started = Date.now();
  const response = await page.goto(url, { waitUntil: WAIT, timeout: 60000 }).catch((e) => ({ error: e.message }));
  // puppeteer's HTTPResponse keeps `status` as a private field behind a getter,
  // so reading it as a property prints the accessor instead of the code.
  const status = (() => {
    try {
      return typeof response?.status === 'function' ? response.status() : response?.status ?? null;
    } catch {
      return null;
    }
  })();

  const info = await page.evaluate(() => {
    const text = (sel) => document.querySelector(sel)?.textContent?.replace(/\s+/g, ' ').trim() || null;
    return {
      title: document.title,
      lang: document.documentElement.lang || null,
      canonical: document.querySelector('link[rel=canonical]')?.href || null,
      description: document.querySelector('meta[name=description]')?.content || null,
      h1: Array.from(document.querySelectorAll('h1')).map((h) => h.textContent.trim()),
      headings: document.querySelectorAll('h1,h2,h3,h4').length,
      links: document.querySelectorAll('a[href]').length,
      anchors: Array.from(document.querySelectorAll('a[href^="#"]')).map((a) => a.getAttribute('href')),
      hasJev: /type-safe|type\.safe|systemone|system one|hev\b|\bjev\b/i.test(document.body.innerText),
      bodyStart: document.body.innerText.replace(/\s+/g, ' ').slice(0, 900),
    };
  });

  // Which anchors would actually resolve — the check that catches dead links.
  const resolved = await page.evaluate(() => {
    const ids = new Set(Array.from(document.querySelectorAll('[id]')).map((e) => e.id));
    return Array.from(document.querySelectorAll('a[href^="#"]'))
      .map((a) => a.getAttribute('href'))
      .filter((h) => h && h !== '#' && !ids.has(h.slice(1)));
  });

  const out = {
    url,
    engine: session.engine,
    browser: session.version,
    status,
    error: response?.error ?? null,
    ms: Date.now() - started,
    ...info,
    deadAnchors: [...new Set(resolved)],
    consoleErrors: errors,
  };

  const shot = value('shot');
  if (shot) {
    fs.mkdirSync(shot.replace(/[/\\][^/\\]+$/, ''), { recursive: true });
    await page.screenshot({ path: shot, fullPage: flag('full') });
    out.screenshot = shot;
  }

  const html = value('html');
  if (html) {
    fs.writeFileSync(html, await page.content(), 'utf8');
    out.html = html;
  }

  await page.close();
  await closeBrowser(session);

  if (flag('json')) {
    console.log(JSON.stringify(out, null, 2));
    return;
  }

  const f = flag('console');
  console.log(`${out.title || '(no title)'}  [${out.browser}]  ${out.status ?? 'ERR'} in ${out.ms}ms`);
  console.log(`  lang=${out.lang || '—'}  headings=${out.headings}  links=${out.links}  mentions Jev=${out.hasJev ? 'yes' : 'no'}`);
  if (out.canonical) console.log(`  canonical: ${out.canonical}`);
  if (out.h1.length) console.log(`  h1: ${JSON.stringify(out.h1)}`);
  if (out.deadAnchors.length) console.log(`  dead anchors (${out.deadAnchors.length}): ${out.deadAnchors.slice(0, 10).join(' ')}`);
  if (f && out.consoleErrors.length) console.log(`  console errors: ${out.consoleErrors.slice(0, 5).join(' | ')}`);
  console.log(`\n  ${NO_SIGNIN ? 'playground endpoint (shared, no sign-in)' : 'Browser Run endpoint (account attached)'}`);
  console.log(`  text: ${out.bodyStart.slice(0, 300)}…`);
}

main().catch((e) => {
  console.error(`kitesurf: ${e.message || e}`);
  process.exit(1);
});