# AGENTS.md — machine instructions for Awesome Jev

This file is the contract for coding agents working in or **reading** this repository.
It is also what `AGENTS.md`-aware agents look for before touching anything.

## What this repo is

A self-updating, trilingual directory of projects built on **Jev** — the System One model from
TypeSafe AI (state + typed questions in; typed answers with per-option probabilities and
confidence out).

## The one structural rule

**`data/entries.json` is the only hand-edited source of truth.**

| File | Who writes it |
| --- | --- |
| `data/entries.json` | humans and the curator — **hand-edited** |
| `README.md`, `README.zh.md`, `README.fr.md` | `scripts/build-readme.mjs` — **generated** between `<!-- entries:start -->` and `<!-- entries:end -->` |
| `docs/**`, `llms.txt`, `llms-full.txt`, `skill.md`, `projects.json` | `npm run build` — Astro then `scripts/build-ai-artifacts.mjs` — **generated** |

Never hand-edit a generated file. If a README row is wrong, fix the data and re-render.
This is what keeps English, 中文 and Français from drifting apart.

## Commands

```bash
node scripts/verify.mjs            # deterministic audit, no network, no model
node scripts/refresh-stars.mjs     # GitHub API refresh → re-renders README + site
node scripts/translate.mjs --lang zh,fr   # fill missing translations on free models
node scripts/curate.mjs            # free-AI health audit or PR triage → curator-report.md
node scripts/build-readme.mjs      # render the three READMEs (--check in CI)
npm run build                      # Astro → docs/ + machine-readable exports
node scripts/import-seed.mjs <projects.json>   # re-seed from a community CC0 dump
node scripts/run-checks.mjs --browser   # every check, static + browser
node scripts/check-workflows.mjs   # parse every workflow, flag block-scalar breakage
node scripts/check-links.mjs       # every link, anchor and asset resolves
node scripts/check-translations.mjs # exercise the per-entry translation gate
node scripts/check-contrast.mjs    # print the measured contrast of every ink
```

## Running the free-model tooling locally

`opencode.json` deliberately contains **no `provider` block**. opencode already ships
the `opencode` (Zen) provider pointing at `https://opencode.ai/zen/v1` with the public
key, and the `*-free` models need no credentials. Re-declaring the provider by hand —
baseUrl, `openai-completions` api, `x-opencode-*` headers — made every call fail with
`Invalid URL` on opencode 2.x.

```bash
# what is free right now
node scripts/translate.mjs --models

# one-off call with a different free model
opencode run --model opencode/<id> --agent curator < prompt.txt
```

The free endpoints are withdrawn and rate-limited without warning. `translate.mjs`
detects `Model unavailable` / 429 and stops the run rather than retrying hundreds of
times; re-run it and it resumes exactly where it stopped.

## The browser: Kitesurf

The curator needs a real browser, because verifying that a submitted project calls
the Jev / System One API often means reading a rendered page rather than a README. It
gets one over a URL:

```bash
node probe-kitesurf.mjs                       # does this endpoint answer real CDP?
node kitesurf-render.mjs <url>                # does it render, or paint blank?
node scripts/check-page.mjs <url>             # page behaviour, a11y, responsive
node scripts/shoot.mjs <url> <outDir>         # screenshots at 2 viewports × 3 languages
```

**Kitesurf** is Cloudflare's stateless browser engine running on Workers. It speaks
the Chrome DevTools Protocol from `wss://kitesurf.dev/devtools/browser` — no account,
no token, no local Chrome, no container, no Chromium process, and no state between
connections. `scripts/lib/cdp.mjs` is a ~200-line CDP client over Node's built-in
`WebSocket`, so the repo has **no browser npm dependency at all**; `npm audit` stays
clean and CI needs no browser install step.

`opencode.json` also registers Kitesurf as an MCP server (`chrome-devtools-mcp` over the
same endpoint), enabled by default, so a curator run can drive pages interactively.

That playground endpoint is the only one configured here, on purpose: it needs no
credentials, which is what lets an unattended free-model run use it. `KITESURF_WS`
overrides the address in the environment; leave it unset.

The engine is remote, so it cannot reach `localhost`. Point the page checks at the
deployed site, or at a tunnel.

## Checks

```bash
node scripts/run-checks.mjs            # static only, no network
node scripts/run-checks.mjs --browser  # + the browser half (network, no local browser)
```

Four dead-link bugs shipped before `check-links.mjs` and `check-page.mjs` existed. Run
the browser half before pushing anything that touches markup.

## Entry schema

```jsonc
{
  "id": "owner--repo",          // slug of owner/repo; stable, used by recategorisation
  "name": "owner/repo",         // what appears in the table
  "url": "https://github.com/owner/repo",
  "kind": "repo",               // "repo" | "resource" (docs page, article)
  "description": "…",           // English, one sentence, 20–240 chars
  "descriptionZh": "…",         // 简体中文, one sentence
  "descriptionFr": "…",         // Français, one sentence
  "category": "coding-agents",  // must be one of scripts/lib/catalog.mjs CATEGORIES
  "language": "TypeScript",
  "license": "MIT",
  "stars": 1234,                // number for kind=repo, null otherwise
  "forks": 56,
  "topics": ["jev", "agent"],
  "official": false,            // true only for typesafe-ai repos and typesafe.ai URLs
  "archived": false,
  "pushedAt": "2026-09-24",
  "intents": ["route between models by task difficulty"],
  "stale": true,                // optional, set by refresh-stars when a repo 404s
  "staleReason": "repo-not-found"
}
```

## Admission criteria

A project qualifies if **all** hold:

1. It calls the Jev / System One API, ships a documented replica of the System One
   interface, or is an official TypeSafe AI artefact.
2. It is public and has a README that says what it does.
3. It is not already listed (one entry per repository, one PR per entry).
4. It is not archived. Archived rows stay listed but are marked.
5. Nothing shady: no credential harvesting, no obfuscated payloads, nothing phoning home
   beyond the APIs it documents.

## Machine-readable endpoints

Published under `docs/` (GitHub Pages) and mirrored at the repository root:

| Endpoint | Use |
| --- | --- |
| `llms.txt` | index + section links, for a model deciding what to fetch |
| `llms-full.txt` | every entry as markdown with field bullets |
| `c/<slug>.md` | one category only, for a narrow question |
| `projects.json` | structured records, filter locally |
| `skill.md` | installable agent skill (`npx skills add hdjekuue/awesome-jev`) |

Staleness contract for consumers: star counts are a snapshot dated in
`meta.updatedAt`, never a quality claim.

## Automation

- The curator runs on **free** opencode Zen `*-free` models, no API key.
- Two-model gate: a draft PR is reviewed by a second, independent free model before merge.
- A PR that touches only `curator-report.md` is **never** auto-merged.
- If a free model or the network is down, the scripts degrade to deterministic reports.

## Attribution

Seed data is derived from a community `projects.json` dump published under CC0-1.0.
This repo's own content is also [CC0-1.0](LICENSE). Not affiliated with TypeSafe AI.