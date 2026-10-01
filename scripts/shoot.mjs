#!/usr/bin/env node
/**
 * shoot.mjs — captures the site at two viewports across all three languages.
 *
 * The browser is Kitesurf (Cloudflare's stateless engine on Workers) over a plain
 * WebSocket CDP client, so this runs anywhere with no Chrome installed — in CI,
 * in a container, on a machine that has never seen a browser. Zero npm
 * dependencies.
 *
 *   node scripts/shoot.mjs [baseUrl] [outDir]
 */

import fs from 'node:fs';
import path from 'node:path';
import { launchCDP, KITESURF_WS } from './lib/cdp.mjs';

const BASE = process.argv[2] || 'https://hdjekuue.github.io/awesome-jev/';
const OUT = process.argv[3] || '.impeccable/review';

const SHOTS = [
  { name: 'desktop', width: 1440, height: 900, deviceScaleFactor: 1 },
  { name: 'mobile', width: 390, height: 844, deviceScaleFactor: 2 },
];

const PAGES = [
  { name: 'en', path: '/' },
  { name: 'zh', path: '/zh/' },
  { name: 'fr', path: '/fr/' },
];

const url = (p) => (BASE.endsWith('/') ? BASE + p.replace(/^\//, '') : `${BASE}/${p.replace(/^\//, '')}`);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const session = await launchCDP();
  console.log(`browser: ${session.version} via ${KITESURF_WS}`);
  console.log(`base:    ${BASE}\n`);

  const report = [];

  for (const shot of SHOTS) {
    const page = await session.newPage(shot);

    for (const target of PAGES) {
      await page.setViewport(shot);
      await page.goto(url(target.path), { wait: true, timeout: 45000 });
      // Fonts must settle before capture, or the first paint is measured in the
      // fallback face — the failure mode a screenshot hides.
      await page.evaluate(() => document.fonts?.ready).catch(() => {});
      await wait(400);

      const file = path.join(OUT, `${target.name}-${shot.name}.png`);
      await page.screenshot({ path: file, fullPage: true });

      // The first viewport separately: a full-page shot of 352 rows is unreadable
      // once scaled down, and it is the only frame where a hierarchy mistake shows.
      const foldFile = path.join(OUT, `${target.name}-${shot.name}-fold.png`);
      await page.screenshot({ path: foldFile });

      const metrics = await page.evaluate(() => {
        const de = document.documentElement;
        const rows = document.querySelectorAll('.entry');
        return {
          lang: de.lang,
          title: document.title,
          docWidth: de.scrollWidth,
          clientWidth: de.clientWidth,
          horizontalOverflow: de.scrollWidth > de.clientWidth + 1,
          docHeight: de.scrollHeight,
          entryRows: rows.length,
          rules: document.querySelectorAll('[data-category]').length,
          fontFamilyUsed: getComputedStyle(document.body).fontFamily.split(',')[0].replace(/"/g, '').trim(),
          heroH1: document.querySelector('.hero h1')?.textContent?.trim().slice(0, 40) || null,
          consoleErrors: null,
        };
      });

      report.push({ ...target, ...shot, file, foldFile, metrics });
      console.log(
        `${target.name}/${shot.name}: ${(fs.statSync(file).size / 1024).toFixed(0)} KB · ` +
          `rows=${metrics.entryRows} · overflow=${metrics.horizontalOverflow ? `YES ${metrics.docWidth}>${metrics.clientWidth}` : 'no'} · ` +
          `font=${metrics.fontFamilyUsed} · h1="${metrics.heroH1}"` + (page.errors.length ? ` · ${page.errors.length} console error(s)` : ''),
      );
    }
    await page.close();
  }

  session.close();
  fs.writeFileSync(path.join(OUT, 'metrics.json'), JSON.stringify(report, null, 2));
  console.log(`\n${report.length * 2} captures → ${OUT}`);

  const anyOverflow = report.some((r) => r.metrics.horizontalOverflow);
  const anyErrors = report.some((r) => r.metrics.consoleErrors || false);
  if (anyOverflow) console.log('WARNING: horizontal overflow on at least one viewport');
  else console.log('no horizontal overflow at any viewport');
  if (anyErrors) console.log('WARNING: console errors were recorded — see metrics.json');

  process.exit(anyOverflow ? 1 : 0);
}

main().catch((e) => {
  console.error(`shoot: ${e.message || e}`);
  process.exit(1);
});