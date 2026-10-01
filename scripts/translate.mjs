#!/usr/bin/env node
/**
 * translate.mjs — fills in `descriptionZh` and `descriptionFr` for every entry in
 * data/entries.json, using only FREE opencode Zen models (no API key).
 *
 * Why this exists: an awesome list that exists in three languages ranks in three
 * markets and is quotable by models answering in any of them. Human translation
 * does not scale to hundreds of rows; this does.
 *
 * Design constraints:
 *  - Idempotent: already-translated entries are skipped, so re-runs are cheap.
 *  - Crash-safe: writes after every batch, so a timeout never loses work.
 *  - Honest: never invents a project. It only rewrites a description that
 *    already exists, in a different language. If a model returns garbage the
 *    batch validator rejects it and the row stays untranslated.
 *  - Fallback: `--dry-run` prints what would be sent without calling a model.
 *
 * Usage:
 *   node scripts/translate.mjs --lang fr          # translate missing fr
 *   node scripts/translate.mjs --lang zh,fr
 *   node scripts/translate.mjs --limit 40        # first 40 missing, for a smoke test
 *   node scripts/translate.mjs --batch 12
 *   node scripts/translate.mjs --models          # list the free models that will be tried
 *   node scripts/translate.mjs --dry-run
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DATA = path.join(ROOT, 'data', 'entries.json');
const ZEN_MODELS_URL = 'https://opencode.ai/zen/v1/models';

// Latest-first. Live discovery prepends whatever Zen is currently serving for free.
const STATIC_FREE_FALLBACK = [
  'muse-spark-1.3-contributor-free',
  'muse-spark-1.2-contributor-free',
  'deepseek-v4-flash-free',
  'mimo-v2.6-flash-free',
  'mimo-v2.5-free',
  'nemotron-3-ultra-free',
  'space-bunny-free',
  'longcat-2.5-preview-free',
  'ling-3.0-flash-fin-free',
];

const LANG_SPEC = {
  zh: {
    label: 'Simplified Chinese',
    field: 'descriptionZh',
    rules: [
      'Use Simplified Chinese (简体中文).',
      'Keep the original tone: plain and factual, one sentence.',
      'Keep every product name, repo name, CLI flag and API path in Latin script — do not translate identifiers.',
      'Do not add commentary, quotes, or a trailing translator note.',
    ],
  },
  fr: {
    label: 'French',
    field: 'descriptionFr',
    rules: [
      'Write in natural, technical French.',
      'Keep the original tone: plain and factual, one sentence.',
      'Keep every product name, repo name, CLI flag and API path in Latin script — do not translate identifiers.',
      'Do not add commentary, quotes, or a trailing translator note.',
    ],
  },
};

function parseArgs() {
  const a = process.argv.slice(2);
  const out = { langs: ['zh', 'fr'], limit: Infinity, batch: 10, dry: false, list: false };
  for (let i = 0; i < a.length; i++) {
    if (a[i] === '--lang') out.langs = a[++i].split(',').map((s) => s.trim()).filter(Boolean);
    else if (a[i] === '--limit') out.limit = parseInt(a[++i], 10);
    else if (a[i] === '--batch') out.batch = Math.max(1, parseInt(a[++i], 10));
    else if (a[i] === '--dry-run') out.dry = true;
    else if (a[i] === '--models') out.list = true;
  }
  return out;
}

async function fetchFreeModels() {
  try {
    const res = await fetch(ZEN_MODELS_URL, {
      headers: {
        'x-opencode-client': 'cli',
        'x-opencode-session': `ses_${Math.random().toString(16).slice(2, 26)}`,
        'x-opencode-project': 'global',
      },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const free = (data.data || [])
      .filter((m) => /free/.test(m.id || '') || (m.pricing && m.pricing.input === 0 && m.pricing.output === 0))
      .map((m) => (m.id || '').replace(/^opencode\//, ''))
      .filter(Boolean);
    if (free.length) return free;
  } catch (e) {
    console.warn(`live free-model discovery failed (${e.message}); using static fallback`);
  }
  return STATIC_FREE_FALLBACK;
}

// `opencode` is a .cmd/.ps1 shim on Windows, and Node cannot spawn those without
// a shell — but a shell mangles stdin and the `<`/`>`/`&` in descriptions. So we
// resolve the real .exe that sits behind the shim and spawn it directly.
let OPENCODE_BIN = 'opencode';
let OPENCODE_ARGS = [];
let OPENCODE_SHELL = false;

async function resolveOpencode() {
  if (process.platform !== 'win32') {
    OPENCODE_BIN = 'opencode';
    return;
  }
  const roots = [
    process.env.APPDATA && path.join(process.env.APPDATA, 'npm'),
    process.env.npm_config_prefix && path.join(process.env.npm_config_prefix, 'node_modules', '@opencode', 'cli', 'bin'),
    process.env.ProgramFiles && path.join(process.env.ProgramFiles, 'nodejs', 'node_modules', '@opencode', 'cli', 'bin'),
  ].filter(Boolean);
  for (const r of roots) {
    const exe = path.join(r, 'opencode.exe');
    const alt = path.join(r, 'node_modules', '@opencode', 'cli', 'bin', 'opencode.exe');
    for (const c of [exe, alt]) {
      if (fs.existsSync(c)) { OPENCODE_BIN = c; return; }
    }
  }
  // Fall back to the .cmd shim behind a shell; stdin still works there.
  OPENCODE_BIN = 'opencode.cmd';
  OPENCODE_SHELL = true;
}

/**
 * The prompt goes in over stdin, not argv. Descriptions contain `<`, `>`, `&`
 * and quotes, which a shell would mangle on Windows and which collide with the
 * argument parser elsewhere. stdin keeps the payload byte-exact.
 */
function runModel(model, prompt, timeoutMs) {
  return new Promise((resolve) => {
    const child = spawn(OPENCODE_BIN, [...OPENCODE_ARGS, 'run', '--model', `opencode/${model}`, '--agent', 'build'], {
      cwd: ROOT,
      env: { ...process.env, OPENCODE_API_KEY: process.env.OPENCODE_API_KEY || 'public' },
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: OPENCODE_SHELL,
    });
    let out = '';
    let err = '';
    const timer = setTimeout(() => { child.kill(); resolve({ out, err: 'timeout' }); }, timeoutMs);
    child.stdout.on('data', (d) => { out += d.toString(); });
    child.stderr.on('data', (d) => { err += d.toString(); });
    child.on('error', (e) => { clearTimeout(timer); resolve({ out: '', err: e.message }); });
    child.on('close', (code) => { clearTimeout(timer); resolve({ out, err: code === 0 ? '' : err }); });
    child.stdin.on('error', () => { /* the model may close stdin early; output is what matters */ });
    child.stdin.end(prompt, 'utf8');
  });
}

/** Free models get withdrawn or rate-limited; recognise that so we stop early. */
const isUnavailable = (err) =>
  /model unavailable|rate.?limit|429|invalid url|not found|unauthorized|401|503|overloaded/i.test(err || '');

/**
 * Prompt shape: strict JSON only, one object per input id. JSON out (not
 * markdown, not a table) because a table would need per-line parsing and a
 * stray line would desynchronize every row after it.
 */
function buildPrompt(items, spec) {
  const rules = spec.rules.map((r) => `- ${r}`).join('\n');
  return [
    'You are a technical translator for an open-source directory.',
    `Translate each item's "desc" into ${spec.label}.`,
    '',
    'Rules:',
    rules,
    '- Keep the same one-sentence shape; do not merge or split items.',
    '- Return ONLY a JSON array, no prose, no code fence.',
    '- Each object: {"id": <same id>, "text": <translation>}',
    '',
    JSON.stringify(items, null, 0),
  ].join('\n');
}

function parseJsonArray(raw) {
  // Strip ANSI colour codes opencode emits around its own chrome.
  const clean = raw.replace(/\x1b\[[0-9;]*[A-Za-z]/g, '');
  const start = clean.indexOf('[');
  const end = clean.lastIndexOf(']');
  if (start === -1 || end <= start) return null;
  const slice = clean.slice(start, end + 1);
  try {
    const v = JSON.parse(slice);
    return Array.isArray(v) ? v : null;
  } catch {
    // Free models sometimes emit trailing commas or smart quotes; repair the
    // common cases rather than throwing the whole batch away.
    try {
      const repaired = slice
        .replace(/,\s*([\]}])/g, '$1')
        .replace(/[“”]/g, '"')
        .replace(/[‘’]/g, "'");
      const v = JSON.parse(repaired);
      return Array.isArray(v) ? v : null;
    } catch {
      return null;
    }
  }
}

/** A translation is acceptable if it is text, roughly the right size, and not a copy of the input. */
function acceptable(text, source) {
  if (typeof text !== 'string') return false;
  const t = text.trim().replace(/^["']|["']$/g, '');
  if (t.length < 8 || t.length > 400) return false;
  if (/^(n\/a|none|null|error|failed|unable)/i.test(t)) return false;
  if (t.length > 12 && t.toLowerCase() === source.trim().toLowerCase()) return false;
  return true;
}

async function main() {
  await resolveOpencode();
  const opts = parseArgs();
  const models = await fetchFreeModels();

  if (opts.list) {
    console.log(JSON.stringify({ models }, null, 2));
    return;
  }

  const db = JSON.parse(fs.readFileSync(DATA, 'utf8'));
  const specs = opts.langs.map((l) => LANG_SPEC[l]).filter(Boolean);
  const unknown = opts.langs.filter((l) => !LANG_SPEC[l]);
  if (unknown.length) {
    console.error(`unsupported language(s): ${unknown.join(', ')} (supported: ${Object.keys(LANG_SPEC).join(', ')})`);
    process.exit(1);
  }

  const todo = [];
  for (const spec of specs) {
    for (const e of db.entries) {
      if (!e.description) continue;
      if (!e[spec.field]) todo.push({ entry: e, spec });
    }
  }
  const budget = Math.min(todo.length, opts.limit);

  console.log(`[translate] ${db.entries.length} entries · ${todo.length} translation jobs available · processing ${budget}`);
  console.log(`[translate] free models: ${models.slice(0, 6).join(', ')}${models.length > 6 ? ' …' : ''}`);

  if (opts.dry) {
    for (const t of todo.slice(0, 3)) {
      console.log(`\n--- would send (${t.spec.label}) ---`);
      console.log(buildPrompt([{ id: t.entry.id, desc: t.entry.description }], t.spec));
    }
    return;
  }
  if (!budget) {
    console.log('[translate] nothing to do');
    return;
  }

  const queue = todo.slice(0, budget);
  let done = 0;
  let filled = 0;
  let failed = 0;
  let currentModel = 0;

  for (let i = 0; i < queue.length; i += opts.batch) {
    const slice = queue.slice(i, i + opts.batch);
    // One batch may span languages only if we group; keep it homogeneous so the
    // prompt stays unambiguous.
    const byLang = new Map();
    for (const t of slice) {
      if (!byLang.has(t.spec.label)) byLang.set(t.spec.label, []);
      byLang.get(t.spec.label).push(t);
    }

for (const [label, group] of byLang) {
      const spec = group[0].spec;
      const payload = group.map((t) => ({ id: t.entry.id, desc: t.entry.description }));
      let parsed = null;
      let unavailable = 0;

      for (let attempt = 0; attempt < Math.min(3, models.length) && !parsed; attempt++) {
        const model = models[(currentModel + attempt) % models.length];
        const { out, err } = await runModel(model, buildPrompt(payload, spec), 180000);
        const arr = parseJsonArray(out);
        if (arr && arr.length === payload.length) {
          parsed = arr;
          currentModel = (currentModel + attempt) % models.length;
        } else if (isUnavailable(err)) {
          unavailable++;
          console.warn(`[translate] ${model} unavailable: ${(err || '').trim().split('\n').pop()}`);
        } else if (arr) {
          console.warn(`[translate] ${model} returned ${arr.length}/${payload.length} items, retrying`);
        } else {
          console.warn(`[translate] ${model} produced no parsable JSON, retrying`);
        }
        if (!parsed) await sleep(attempt === 0 ? 2500 : 8000);
      }

      // Every free model is withdrawn or throttled. Stop now rather than burning
      // hundreds of doomed calls — the next run resumes exactly where this left off.
      if (unavailable >= Math.min(3, models.length)) {
        console.warn('\n[translate] every free model is unavailable or rate-limited right now.');
        console.warn('[translate] stopping. Nothing is lost — re-run later, or wait for the weekly Translate workflow.');
        break;
      }

      if (!parsed) {
        failed += group.length;
        console.warn(`[translate] giving up on ${group.length} ${label} item(s) this batch`);
      } else {
        const byId = new Map(parsed.map((o) => [o && o.id, o && o.text]));
        for (const t of group) {
          const text = byId.get(t.entry.id);
          if (acceptable(text, t.entry.description)) {
            t.entry[spec.field] = text.trim().replace(/^["']|["']$/g, '');
            filled++;
          } else {
            failed++;
          }
        }
      }
      done += group.length;
      db.updatedAt = new Date().toISOString().slice(0, 10);
      fs.writeFileSync(DATA, JSON.stringify(db, null, 2) + '\n', 'utf8');
      const pct = Math.round((done / budget) * 100);
      console.log(`[translate] ${done}/${budget} (${pct}%) · filled ${filled} · failed ${failed}`);
    }
  }

  console.log(`\n[translate] done — filled ${filled}, failed ${failed}. Re-run to retry only what is still missing.`);
}

main().catch((e) => { console.error(e); process.exit(1); });