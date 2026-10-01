import fs from 'node:fs';
import { createRequire } from 'node:module';

// Captures a specific element or scroll offset, for inspecting one region of the
// page at readable scale. A full-page shot of 352 rows proves nothing about how
// a single row is set.
//
//   node scripts/shoot-region.mjs <url> <selector|offsetY> <outFile> [width] [height]

const require = createRequire(import.meta.url);
const puppeteer = require(process.env.PUPPETEER_PATH || 'puppeteer-core');

const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].find((p) => fs.existsSync(p));

const [, , target, sel, out, w = '1440', h = '900'] = process.argv;

async function main() {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--font-render-hinting=none', '--force-color-profile=srgb'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: Number(w), height: Number(h), deviceScaleFactor: 1 });
  await page.goto(target, { waitUntil: 'networkidle0', timeout: 60000 });
  await page.evaluate(() => document.fonts.ready);

  if (/^\d+$/.test(sel)) {
    await page.evaluate((y) => window.scrollTo(0, y), Number(sel));
  } else {
    const el = await page.$(sel);
    if (!el) {
      console.error(`selector not found: ${sel}`);
      process.exit(1);
    }
    await el.screenshot({ path: out });
    console.log(`captured ${sel} → ${out}`);
    await browser.close();
    return;
  }
  await new Promise((r) => setTimeout(r, 300));
  await page.screenshot({ path: out, fullPage: false });
  console.log(`captured scrollY=${sel} → ${out}`);
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});