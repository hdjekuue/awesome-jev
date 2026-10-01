import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

// Downloads the latin (+latin-ext) subsets of the two faces this site uses and
// writes a self-hosted @font-face sheet. No runtime CDN request, so the page
// renders identically offline and in the Pages sandbox.
//
//   node scripts/fetch-fonts.mjs
//
// Run once. The woff2 files are committed; this script exists so the choice is
// auditable and reproducible rather than a mystery binary in the repo.

const TMP = path.join(process.env.TEMP || '/tmp', 'awesome-jev-fonts');
const OUT_DIR = path.join(process.cwd(), 'public', 'fonts');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

const FACES = [
  {
    id: 'archivo',
    family: 'Archivo',
    // css2 wants a range as `300..900` for a variable font; a bare `300 900` is a 400.
    axis: 'wght@300..900',
    weight: '300 900',
    styles: 'normal',
    subsets: ['latin', 'latin-ext'],
  },
  {
    id: 'dmmono',
    family: 'DM Mono',
    axis: 'wght@400',
    weight: '400',
    styles: 'normal',
    subsets: ['latin'],
  },
  {
    id: 'dmmono-medium',
    family: 'DM Mono',
    axis: 'wght@500',
    weight: '500',
    styles: 'normal',
    subsets: ['latin'],
  },
];

/** Google serves one @font-face per subset, each preceded by a `/* subset *\/` comment. */
function parseFaces(css) {
  const out = [];
  const re = /\/\*\s*([a-z0-9-]+)\s*\*\/\s*@font-face\s*\{([^}]+)\}/gi;
  let m;
  while ((m = re.exec(css))) {
    const subset = m[1];
    const body = m[2];
    const src = body.match(/url\((https:[^)]+\.woff2)\)/);
    if (!src) continue;
    out.push({ subset, url: src[1], body });
  }
  return out;
}

async function get(url, asBuffer = false) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return asBuffer ? Buffer.from(await res.arrayBuffer()) : res.text();
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.mkdirSync(TMP, { recursive: true });

  const cssParts = [
    '/* Self-hosted webfonts. No runtime CDN request: the page renders identically',
    ' * offline, in the Pages build sandbox, and behind a restrictive CSP.',
    ' * Fetched by scripts/fetch-fonts.mjs. Edit that script, not this file. */',
    '',
  ];

  for (const face of FACES) {
    const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(face.family).replace(/%20/g, '+')}:${face.axis}&display=swap`;
    const css = await get(url);
    fs.writeFileSync(path.join(TMP, `${face.id}.css`), css, 'utf8');

    const parsed = parseFaces(css);
    for (const subset of face.subsets) {
      const hit = parsed.find((p) => p.subset === subset);
      if (!hit) {
        console.warn(`[fonts] ${face.id}: subset "${subset}" not offered by Google, skipped`);
        continue;
      }
      const file = `${face.id}-${subset}.woff2`;
      const buf = await get(hit.url, true);
      fs.writeFileSync(path.join(OUT_DIR, file), buf);
      console.log(`[fonts] ${file}  ${(buf.length / 1024).toFixed(1)} KB`);

      cssParts.push(
        '@font-face {',
        `  font-family: '${face.family}';`,
        `  font-style: ${face.styles};`,
        `  font-weight: ${face.weight};`,
        '  font-display: swap;',
        `  src: url('/fonts/${file}') format('woff2');`,
        '}',
        '',
      );
    }
  }

  // Korean and the CJK range are intentionally not shipped: a full CJK face is
  // several megabytes and would dwarf the page. 简体中文 and Japanese fall back
  // to the reader's own system CJK face, which is the correct call for a
  // directory whose zh copy must render for readers who already have the font.
  fs.writeFileSync(path.join(OUT_DIR, 'fonts.css'), cssParts.join('\n'), 'utf8');
  console.log(`[fonts] wrote public/fonts/fonts.css (${cssParts.length} lines)`);
}

main().catch((e) => {
  console.error(`[fonts] ${e.message}`);
  process.exit(1);
});