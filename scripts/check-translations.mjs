import fs from 'node:fs';

// Exercises the per-entry translation gate that verify.yml runs on a pull
// request, without needing a real PR. Pass a diff file to test a specific diff;
// with no argument it verifies the shipped data instead.
//
//   node scripts/check-translations.mjs [diff-file]
//
// The default used to be a synthetic diff, which then failed by design once the
// gate learned to reject names the data file cannot resolve — so the "check"
// reported four errors that had nothing to do with the repo.

const diffArg = process.argv[2];
const diff = diffArg ? fs.readFileSync(diffArg, 'utf8') : '';

const d = JSON.parse(fs.readFileSync('data/entries.json', 'utf8'));

const incomplete = d.entries.filter((e) => !e.description || !e.descriptionZh || !e.descriptionFr);
const missingZh = d.entries.filter((e) => !e.descriptionZh);
const missingFr = d.entries.filter((e) => !e.descriptionFr);

console.log(`repo-wide: ${d.entries.length - incomplete.length}/${d.entries.length} fully translated`);
console.log(`  zh missing ${missingZh.length} · fr missing ${missingFr.length}`);

if (!diffArg) {
  if (incomplete.length) {
    console.error(`\n${incomplete.length} entr(y/ies) lack at least one translation:`);
    for (const e of incomplete.slice(0, 10)) {
      const missing = [!e.description && 'description', !e.descriptionZh && 'descriptionZh', !e.descriptionFr && 'descriptionFr'].filter(Boolean);
      console.error(`  ${e.name}: missing ${missing.join(', ')}`);
    }
    process.exit(1);
  }
  console.log('PASS — every entry ships all three descriptions');
  process.exit(0);
}

const added = [...diff.matchAll(/^\+\s*"name":\s*"([^"]+)"/gm)].map((m) => m[1]);
console.log(`\nadded entries detected: ${added.length ? added.join(', ') : '(none)'}`);

if (!added.length) {
  console.log('PASS — no entries added, nothing to gate');
  process.exit(0);
}

const known = new Set(d.entries.map((e) => e.name));
const unknown = added.filter((n) => !known.has(n));
for (const n of unknown) {
  console.error(`::error file=data/entries.json::${n} appears in the diff but not in the parsed data — check the id/name pair`);
}
const bad = d.entries.filter((e) => added.includes(e.name) && (!e.description || !e.descriptionZh || !e.descriptionFr));
for (const b of bad) {
  const missing = [!b.description && 'description', !b.descriptionZh && 'descriptionZh', !b.descriptionFr && 'descriptionFr'].filter(Boolean);
  console.error(`::error file=data/entries.json::${b.name} is missing ${missing.join(', ')}`);
}
if (unknown.length || bad.length) process.exit(1);
console.log(`PASS — all ${added.length} new entr(y/ies) have all three descriptions`);