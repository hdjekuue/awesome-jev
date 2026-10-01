/**
 * kitesurf-render.mjs — prove the endpoint returns real content, not a blank paint.
 *
 * A CDP endpoint that completes the handshake and answers metadata calls can
 * still render nothing, which is worse than a hard failure: the agent believes it
 * fetched the page. This checks the actual bytes an agent would consume — the
 * document text and a screenshot.
 *
 * Usage: node kitesurf-render.mjs <url> [wss-url]
 *
 * This is the script the curator runs against a submitted project's page when the
 * evidence that it calls Jev lives in the rendered site rather than the README.
 */

import { launchCDP, KITESURF_WS } from './scripts/lib/cdp.mjs';

const [, , target, wsArg] = process.argv;
if (!target) {
  console.error('usage: node kitesurf-render.mjs <url> [wss-url]');
  process.exit(1);
}
const ws = wsArg || process.env.KITESURF_WS || KITESURF_WS;

const session = await launchCDP({ ws, handshakeTimeout: 25000 });
const page = await session.newPage({ width: 1440, height: 900 });

try {
  await page.goto(target, { wait: true, timeout: 40000 });
} catch (e) {
  console.log(`url:    ${target}`);
  console.log(`result: navigation failed — ${e.message}`);
  await page.close();
  session.close();
  process.exit(1);
}

// Poll for real text rather than trusting a single sample: a page can paint empty
// and fill in a moment later, and the difference is exactly what this catches.
let text = '';
for (let i = 0; i < 10; i++) {
  text = (await page.evaluate(() => document.body?.innerText || '')) || '';
  if (text.trim().length > 40) break;
  await new Promise((r) => setTimeout(r, 1200));
}

const shot = await page.screenshot();
const info = await page.evaluate(() => ({
  title: document.title,
  lang: document.documentElement.lang || null,
  h1: Array.from(document.querySelectorAll('h1')).map((h) => h.textContent.trim()),
  links: document.querySelectorAll('a[href]').length,
  // The question the curator actually has to answer about a submitted project.
  mentionsJev: /type-?safe|system ?one|systemone|jev\b/i.test(document.body?.innerText || ''),
}));

console.log(`url:    ${target}`);
console.log(`engine: ${session.version} via ${ws}`);
console.log(`title:  ${JSON.stringify(info.title)}`);
console.log(`text:   ${text.trim().length} chars`);
console.log(`shot:   ${Math.round(shot.length / 1024)}KB · h1=${JSON.stringify(info.h1)} · links=${info.links}`);
console.log(`jev:    ${info.mentionsJev ? 'mentioned on the page' : 'not mentioned on the page'}`);
console.log(`sample: ${JSON.stringify(text.trim().slice(0, 200))}`);

const ok = text.trim().length > 200 && shot.length > 3000;
console.log(ok ? '\nRESULT: renders real content' : '\nRESULT: blank or near-blank paint');

await page.close();
session.close();
process.exit(ok ? 0 : 1);