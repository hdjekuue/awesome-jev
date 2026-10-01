/**
 * probe-kitesurf.mjs — check whether a CDP websocket endpoint actually works.
 *
 * A TCP connection proves nothing: an endpoint that completes the TLS and
 * WebSocket handshake but rejects every session is what "silently unusable" looks
 * like. This speaks real CDP and asks for a target list, so the answer is "can an
 * agent actually drive it".
 *
 * Usage: node probe-kitesurf.mjs [wss-url]
 *        defaults to the Kitesurf playground endpoint, which needs no account.
 */

import { launchCDP, KITESURF_WS } from './scripts/lib/cdp.mjs';

const url = process.argv[2] || process.env.KITESURF_WS || KITESURF_WS;

const started = Date.now();
let session;
try {
  session = await launchCDP({ ws: url, handshakeTimeout: 25000 });
} catch (e) {
  console.log(`FAIL  ${url}\n      ${e.message}`);
  process.exit(1);
}

try {
  console.log(`ok    ${url}`);
  console.log(`      browser: ${session.version}`);
  console.log(`      targets on connect: ${session.targetsOnConnect}`);

  // Prove it renders, not just answers metadata calls.
  const page = await session.newPage({ width: 1440, height: 900 });
  await page.goto('https://example.com/', { wait: true });
  const title = await page.evaluate(() => document.title);
  const shot = await page.screenshot();
  await page.close();

  console.log(`      rendered "${title}" and captured ${Math.round(shot.length / 1024)}KB screenshot`);
  console.log(`      round trip: ${Date.now() - started}ms`);
  session.close();
  process.exit(0);
} catch (e) {
  console.log(`FAIL  ${url}\n      CDP call failed: ${e.message}`);
  session.close();
  process.exit(1);
}