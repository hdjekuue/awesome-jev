import { launchCDP } from './lib/cdp.mjs';

// Diagnostic: at a given width, list every element whose box crosses the viewport,
// including pseudo-elements, and report the document's own scroll extent. Run
// against the deployed site, because that is what the Page workflow checks.
//
//   node scripts/_diag-overflow.mjs <url> [width]

const [, , target, w = '360'] = process.argv;
const session = await launchCDP();
const page = await session.newPage({ width: Number(w), height: 900 });

try {
  await page.setViewport({ width: Number(w), height: 900 });
  await page.goto(target, { wait: true, timeout: 45000 });

  const out = await page.evaluate(() => {
    const de = document.documentElement;
    const label = (el) => {
      const cls = (el.className || '').toString().trim().split(/\s+/)[0];
      return `${el.tagName.toLowerCase()}${cls ? `.${cls}` : ''}`;
    };
    // Three different measurements, because they disagree and the disagreement is
    // the clue: a rect that fits can still sit inside a parent whose layout box is
    // wider, and an element can scroll internally without moving the document.
    const byRect = [];
    const byOffset = [];
    const selfScroll = [];
    for (const el of document.querySelectorAll('body, body *')) {
      const r = el.getBoundingClientRect();
      const overRect = Math.round(r.right - de.clientWidth);
      if (r.width > 0 && overRect > 1) {
        byRect.push({ sel: label(el), over: overRect, w: Math.round(r.width), text: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 30) });
      }
      const overOffset = el.offsetWidth > 0 ? el.offsetLeft + el.offsetWidth - de.clientWidth : -999;
      if (overOffset > 1) {
        byOffset.push({ sel: label(el), over: overOffset, w: el.offsetWidth, text: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 30) });
      }
      if (el.scrollWidth > el.clientWidth + 1 && el.clientWidth > 0) {
        const cs = getComputedStyle(el);
        selfScroll.push({ sel: label(el), over: el.scrollWidth - el.clientWidth, ox: cs.overflowX, text: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 24) });
      }
    }
    byRect.sort((a, b) => b.over - a.over);
    byOffset.sort((a, b) => b.over - a.over);
    selfScroll.sort((a, b) => b.over - a.over);
    return {
      docScrollW: de.scrollWidth,
      docClientW: de.clientWidth,
      bodyScrollW: document.body.scrollWidth,
      bodyOffsetW: document.body.offsetWidth,
      htmlOffsetW: de.offsetWidth,
      byRect: byRect.slice(0, 8),
      byOffset: byOffset.slice(0, 8),
      selfScroll: selfScroll.slice(0, 8),
    };
  });

  console.log(`viewport ${w}px`);
  console.log(`  html scrollWidth=${out.docScrollW} clientWidth=${out.docClientW} offsetWidth=${out.htmlOffsetW}`);
  console.log(`  body scrollWidth=${out.bodyScrollW} offsetWidth=${out.bodyOffsetW}`);
  console.log(`\n  by getBoundingClientRect (>1px past the viewport):`);
  for (const r of out.byRect) console.log(`    +${String(r.over).padStart(4)}px  ${r.sel}  w=${r.w}  "${r.text}"`);
  if (!out.byRect.length) console.log('    (none)');
  console.log(`\n  by offsetLeft+offsetWidth:`);
  for (const r of out.byOffset) console.log(`    +${String(r.over).padStart(4)}px  ${r.sel}  w=${r.w}  "${r.text}"`);
  if (!out.byOffset.length) console.log('    (none)');
  console.log(`\n  elements that scroll internally (not the document's problem unless overflow is visible):`);
  for (const r of out.selfScroll) console.log(`    +${String(r.over).padStart(4)}px  ${r.sel}  overflow-x=${r.ox}  "${r.text}"`);
  if (!out.selfScroll.length) console.log('    (none)');
} finally {
  await page.close().catch(() => {});
  session.close();
}