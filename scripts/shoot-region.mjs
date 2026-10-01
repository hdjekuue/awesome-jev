#!/usr/bin/env node
/**
 * shoot-region.mjs — capture one element or scroll offset at readable scale.
 *
 * A full-page shot of a 352-row directory proves nothing about how a single row
 * is set. This frames one region so spacing, rule weight and type can actually be
 * judged.
 *
 *   node scripts/shoot-region.mjs <url> <selector|scrollY> <outFile> [width] [height]
 */

import path from 'node:path';
import { launchCDP } from './lib/cdp.mjs';

const [, , target, sel, out, w = '1440', h = '900'] = process.argv;

if (!target || !sel || !out) {
  console.error('usage: node scripts/shoot-region.mjs <url> <selector|scrollY> <outFile> [width] [height]');
  process.exit(1);
}

const session = await launchCDP();
const page = await session.newPage({ width: Number(w), height: Number(h) });

try {
  await page.goto(target, { wait: true, timeout: 45000 });
  await page.evaluate(() => document.fonts?.ready).catch(() => {});
  await new Promise((r) => setTimeout(r, 350));

  if (/^\d+$/.test(sel)) {
    await page.evaluate((y) => window.scrollTo(0, y), Number(sel));
    await new Promise((r) => setTimeout(r, 350));
    await page.screenshot({ path: out });
    console.log(`captured scrollY=${sel} → ${path.basename(out)}`);
  } else {
    // Clip to the element's box rather than screenshotting the whole document,
    // so the region is at natural scale instead of being scaled down to fit.
    const box = await page.evaluate((selector) => {
      const el = document.querySelector(selector);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.left + window.scrollX, y: r.top + window.scrollY, width: r.width, height: r.height };
    }, sel);

    if (!box) {
      console.error(`selector not found: ${sel}`);
      process.exitCode = 1;
    } else {
      const buf = await page.screenshot({
        fullPage: true,
        clip: { x: box.x, y: box.y, width: box.width, height: Math.min(box.height, 4000), scale: 1 },
      });
      const fs = await import('node:fs');
      fs.mkdirSync(path.dirname(out) || '.', { recursive: true });
      fs.writeFileSync(out, buf);
      console.log(`captured ${sel} (${Math.round(box.width)}×${Math.round(box.height)}) → ${path.basename(out)} · ${Math.round(buf.length / 1024)}KB`);
    }
  }
} finally {
  await page.close().catch(() => {});
  session.close();
}