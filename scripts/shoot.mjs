import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

// Captures the two viewports the craft floor requires, from a running dev or
// preview server, in one batched round. Desktop 1440 and mobile 390, full page.
//
//   node scripts/shoot.mjs <baseUrl> [outDir]

const require = createRequire(import.meta.url);
const puppeteer = require(process.env.PUPPETEER_PATH || 'puppeteer-core');

const BASE = process.argv[2] || 'http://localhost:4321/awesome-jev/';
const OUT = process.argv[3] || '.impeccable/review';

const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].find((p) => fs.existsSync(p));

if (!CHROME) {
  console.error('no Chrome or Edge binary found');
  process.exit(1);
}

const SHOTS = [
  { name: 'desktop', width: 1440, height: 900, dsf: 1 },
  { name: 'mobile', width: 390, height: 844, dsf: 2 },
];

const PAGES = [
  { name: 'en', path: '/' },
  { name: 'zh', path: '/zh/' },
  { name: 'fr', path: '/fr/' },
];

// BASE is the site root including the Astro base path, so a target path is
// appended to it. Using `new URL('/', BASE)` would silently drop /awesome-jev
// and capture the 404 page — which renders, reports no rows, and looks "fine".
const url = (p) => (BASE.endsWith('/') ? BASE + p.replace(/^\//, '') : `${BASE}/${p.replace(/^\//, '')}`);

async function main() {
  fs.mkdirSync(OUT, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none', '--force-color-profile=srgb'],
  });

  const report = [];

  for (const shot of SHOTS) {
    const page = await browser.newPage();
    await page.setViewport({ width: shot.width, height: shot.height, deviceScaleFactor: shot.dsf });

    for (const target of PAGES) {
      await page.goto(url(target.path), { waitUntil: 'networkidle0', timeout: 60000 });
      // Fonts must be settled before capture or the first paint is measured in the
      // fallback face, which is the failure mode a screenshot hides.
      await page.evaluate(() => document.fonts.ready);
      await new Promise((r) => setTimeout(r, 350));

      const file = path.join(OUT, `${target.name}-${shot.name}.png`);
      await page.screenshot({ path: file, fullPage: true });

      // A full-page shot of a 352-row directory is unreadable when scaled down,
      // so the first viewport is captured separately. That is the frame the
      // direction contract actually describes, and the only one where a
      // hierarchy mistake is visible.
      const foldFile = path.join(OUT, `${target.name}-${shot.name}-fold.png`);
      await page.screenshot({ path: foldFile, fullPage: false });

      const metrics = await page.evaluate(() => {
        const de = document.documentElement;
        const rows = Array.from(document.querySelectorAll('.entry'));
        const overflow = de.scrollWidth > de.clientWidth + 1;
        return {
          lang: de.lang,
          title: document.title.slice(0, 70),
          docWidth: de.scrollWidth,
          clientWidth: de.clientWidth,
          horizontalOverflow: overflow,
          docHeight: de.scrollHeight,
          entryRows: rows.length,
          rules: document.querySelectorAll('[data-category]').length,
          fontFamilyUsed: getComputedStyle(document.body).fontFamily.split(',')[0],
          heroH1: document.querySelector('.hero h1')?.textContent?.trim().slice(0, 40) || null,
          firstEntry: rows[0]?.textContent?.replace(/\s+/g, ' ').trim().slice(0, 60) || null,
        };
      });

      report.push({ ...target, ...shot, file, metrics });
      console.log(
        `${target.name}/${shot.name}: ${(fs.statSync(file).size / 1024).toFixed(0)} KB · ` +
          `rows=${metrics.entryRows} · overflow=${metrics.horizontalOverflow ? 'YES ' + metrics.docWidth + '>' + metrics.clientWidth : 'no'} · ` +
          `font=${metrics.fontFamilyUsed} · h1="${metrics.heroH1}"`,
      );
    }
    await page.close();
  }

  await browser.close();
  fs.writeFileSync(path.join(OUT, 'metrics.json'), JSON.stringify(report, null, 2));
  console.log(`\n${report.length} captures → ${OUT}`);

  const anyOverflow = report.some((r) => r.metrics.horizontalOverflow);
  console.log(anyOverflow ? 'WARNING: horizontal overflow on at least one viewport' : 'no horizontal overflow at any viewport');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});