import fs from 'node:fs';

// Reports what actually ships in the built HTML: script blocks (inline vs
// external), stylesheet links, font preloads, and the size of each. The point is
// to prove the "zero client JS except search" claim rather than assert it.
//
//   node scripts/check-payload.mjs

const files = ['docs/index.html', 'docs/zh/index.html', 'docs/fr/index.html'];

for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)];
  const external = scripts.filter((s) => /src=/.test(s[1]));
  const inline = scripts.filter((s) => !/src=/.test(s[1]));
  const inlineBytes = inline.reduce((a, s) => a + s[2].length, 0);
  const styles = [...html.matchAll(/<link[^>]+rel="stylesheet"[^>]*>/g)];
  const preloads = [...html.matchAll(/<link[^>]+rel="preload"[^>]*as="font"[^>]*>/g)];
  const jsonLd = [...html.matchAll(/application\/ld\+json/g)].length;

  const entries = (html.match(/class="?entry[ "]/g) || []).length;
  const rules = (html.match(/class="?cat-stamp"?/g) || []).length;

  console.log(`\n${file}  (${(html.length / 1024).toFixed(0)} KB)`);
  console.log(`  scripts: ${external.length} external, ${inline.length} inline`);
  for (const s of inline) {
    const type = (s[1].match(/type="([^"]+)"/) || [])[1] || 'plain';
    console.log(`    inline ${type}: ${(s[2].length / 1024).toFixed(1)} KB`);
  }
  for (const s of external) console.log(`    external: ${(s[1].match(/src="([^"]+)"/) || [])[1]}`);
  console.log(`  stylesheets: ${styles.length} · font preloads: ${preloads.length} · JSON-LD blocks: ${jsonLd}`);
  console.log(`  rendered: ${entries} entry rows across ${rules} rules`);
}