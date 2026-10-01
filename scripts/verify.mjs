#!/usr/bin/env node
/**
 * verify.mjs — deterministic, model-free audit of data/entries.json.
 *
 * Checks that need no network: schema, duplicate URLs, category ids, description
 * hygiene, archive flags, missing zh descriptions. Exits non-zero on ERROR-level
 * problems so it can gate a PR. Network checks (live stars, 404s) live in
 * refresh-stars.mjs / link-check.mjs because they need a token and are rate
 * limited.
 *
 *   node scripts/verify.mjs            # human output, exit 1 on errors
 *   node scripts/verify.mjs --json     # machine output
 *   node scripts/verify.mjs --strict   # also fail on warnings
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DATA = path.join(ROOT, 'data', 'entries.json');

const KNOWN_CATEGORIES = new Set([
  'start-here', 'official', 'coding-agents', 'routing', 'context', 'code-review',
  'browser', 'mobile', 'search-rag', 'safety', 'data-ops', 'apps', 'clients',
  'cli', 'benchmarks', 'open-models', 'games', 'finance', 'demos', 'articles',
]);

const REQUIRED = ['id', 'name', 'url', 'kind', 'description', 'category'];
const errors = [];
const warnings = [];
const notes = [];

const fail = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

if (!fs.existsSync(DATA)) {
  console.error('data/entries.json missing');
  process.exit(1);
}

let db;
try {
  db = JSON.parse(fs.readFileSync(DATA, 'utf8'));
} catch (e) {
  console.error(`data/entries.json is not valid JSON: ${e.message}`);
  process.exit(1);
}

const entries = db.entries;
if (!Array.isArray(entries) || !entries.length) fail('entries must be a non-empty array');

const byUrl = new Map();
const byId = new Set();
let archived = 0;
let missingZh = 0;
let zeroStars = 0;

for (const [i, e] of entries.entries()) {
  const at = `entries[${i}] ${e.id || e.name || '(unnamed)'}`;

  for (const k of REQUIRED) {
    if (!e[k]) fail(`${at}: missing required field "${k}"`);
  }
  if (!/^https:\/\//.test(e.url || '')) fail(`${at}: url must be https (${e.url})`);
  if (!KNOWN_CATEGORIES.has(e.category)) warn(`${at}: unknown category "${e.category}"`);
  if (e.id) {
    if (byId.has(e.id)) fail(`${at}: duplicate id "${e.id}"`);
    byId.add(e.id);
  }
  const urlKey = (e.url || '').toLowerCase().replace(/\/$/, '');
  if (byUrl.has(urlKey)) fail(`${at}: duplicate url, already listed as ${byUrl.get(urlKey)}`);
  else byUrl.set(urlKey, e.id || e.name);

  if (e.kind === 'repo') {
    if (!/^https:\/\/github\.com\/[^/]+\/[^/]+/.test(e.url)) fail(`${at}: kind=repo but url is not a github repo (${e.url})`);
    if (typeof e.stars !== 'number') fail(`${at}: kind=repo must have numeric stars (${e.stars})`);
    else if (e.stars === 0) zeroStars++;
  }
  if (e.kind === 'resource' && typeof e.stars === 'number') {
    warn(`${at}: kind=resource should not carry stars`);
  }

  const d = e.description || '';
  if (d.length < 20) warn(`${at}: description too short to be useful`);
  if (d.length > 240) warn(`${at}: description is ${d.length} chars; keep it to one sentence (<240)`);
  if (/^\s|\s$/.test(d)) warn(`${at}: description has leading/trailing whitespace`);
  if (/\bteh\b|\bdefinately\b|\brecieve\b/i.test(d)) warn(`${at}: description contains a likely typo`);
  if (/^https?:\/\//.test(d)) warn(`${at}: description starts with a URL, describe it instead`);
  if (!/[.!?)）]$/.test(d)) warn(`${at}: description should end with punctuation`);

  if (!e.descriptionZh) missingZh++;
  if (e.archived) archived++;
}

if (!/^\d{4}-\d{2}-\d{2}$/.test(db.updatedAt || '')) fail(`updatedAt must be YYYY-MM-DD, got "${db.updatedAt}"`);

const staleDays = db.updatedAt
  ? Math.floor((Date.now() - new Date(db.updatedAt).getTime()) / 86400000)
  : Infinity;
if (staleDays > 30) warn(`data is ${staleDays} days old; run scripts/refresh-stars.mjs`);

notes.push(`${entries.length} entries (${entries.filter((e) => e.kind === 'repo').length} repos, ${entries.filter((e) => e.kind === 'resource').length} resources)`);
notes.push(`${archived} archived, ${zeroStars} at 0 stars, ${missingZh} without a zh description`);

const out = {
  ok: errors.length === 0,
  errors,
  warnings,
  notes,
  counts: {
    entries: entries.length,
    repos: entries.filter((e) => e.kind === 'repo').length,
    resources: entries.filter((e) => e.kind === 'resource').length,
    missingZh,
    archived,
  },
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(out, null, 2));
} else {
  for (const n of notes) console.log(`· ${n}`);
  for (const w of warnings) console.log(`⚠ ${w}`);
  for (const e of errors) console.log(`✖ ${e}`);
  console.log(errors.length ? `\nFAIL — ${errors.length} error(s), ${warnings.length} warning(s)` : `PASS — 0 errors, ${warnings.length} warning(s)`);
}

if (errors.length) process.exit(1);
if (process.argv.includes('--strict') && warnings.length) process.exit(1);