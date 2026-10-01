import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

// Mirrors the "Entries added in this PR must ship all three languages" step of
// verify.yml so it can be exercised locally without opening a PR.
// 用一个真实的 diff 片段驱动同一段校验逻辑，避免只能在 PR 里才发现问题。

const diff = process.argv[2] ? fs.readFileSync(process.argv[2], 'utf8') : `
diff --git a/data/entries.json b/data/entries.json
@@
+    "name": "owner--repo",
+    "name": "second--repo",
+    "name": "third--repo",
+    "name": "fourth--repo",
`;

const added = [...diff.matchAll(/^\+\s*"name":\s*"([^"]+)"/gm)].map((m) => m[1]);
console.log('added entries detected:', added.length ? added.join(', ') : '(none)');

const d = JSON.parse(fs.readFileSync('data/entries.json', 'utf8'));
const known = new Set(d.entries.map((e) => e.name));

// A name in the diff that is not in the data file means the contributor added a row
// under a different key than the one `name:` claims, or the row is malformed. Passing
// silently here would let a half-written entry through.
const unknown = added.filter((n) => !known.has(n));
if (unknown.length) {
  for (const n of unknown) console.error(`::error file=data/entries.json::${n} appears in the diff but not in the parsed data — check the id/name pair`);
  process.exit(1);
}

const bad = d.entries.filter((e) => added.includes(e.name) && (!e.description || !e.descriptionZh || !e.descriptionFr));

if (bad.length) {
  for (const b of bad) {
    const missing = [!b.description && 'description', !b.descriptionZh && 'descriptionZh', !b.descriptionFr && 'descriptionFr']
      .filter(Boolean);
    console.error(`${b.name} is missing: ${missing.join(', ')}`);
  }
  console.error(`\n${bad.length} of ${added.length} new entries would be rejected.`);
  process.exit(1);
}
console.log(`all ${added.length} new entr(y/ies) have all three descriptions`);

// Also report how many of the *existing* entries the check would wave through,
// which is the honest measure of whether the backlog is draining.
const incomplete = d.entries.filter((e) => !e.description || !e.descriptionZh || !e.descriptionFr);
console.log(`\nrepo-wide: ${d.entries.length - incomplete.length}/${d.entries.length} fully translated`);