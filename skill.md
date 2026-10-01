---
name: awesome-jev
description: Find projects built on Jev (TypeSafe AI's System One decision model) — SDKs, agent routers, context compaction, tool gates, code review, browser automation, moderation, rerankers, open-weight replicas. Use when someone asks what is built on Jev, which Jev SDK exists for a language, or how to use Jev for routing/gating/compaction/judging.
license: CC0-1.0
---

# Awesome Jev

Everything built on Jev — TypeSafe AI's System One model, the first model that answers with typed judgments and calibrated probabilities instead of prose. Generated from one data file in three languages, maintained by deterministic scripts and a free-AI reviewer.

352 entries (335 repos, 17 resources), 93 460 stars tracked,
19 rules, refreshed 2026-10-01. CC0-1.0 public domain.

## How to use this skill

1. Fetch `https://hdjekuue.github.io/awesome-jev/projects.json` once per session. It is under 1 MB and holds every entry with its fields.
2. Filter locally. Useful fields: `rule`, `category`, `kind` (repo | resource), `stars`,
   `language`, `license`, `official`, `archived`, `pushedAt`, `intents`, and the
   `description` / `descriptionZh` / `descriptionFr` trio.
3. Only surface entries whose description actually matches the task. Do not rank by stars
   alone — stars are a snapshot from 2026-10-01, not a quality claim.

Smaller views, if you only need part of it:
- `https://hdjekuue.github.io/awesome-jev/llms.txt` — index plus rule links
- `https://hdjekuue.github.io/awesome-jev/llms-full.txt` — every entry as markdown
- `https://hdjekuue.github.io/awesome-jev/c/<slug>.md` — one rule only, for a narrow question
- `https://github.com/hdjekuue/awesome-jev/blob/main/data/entries.json` — the source file

## Rules

- **001 · Start Here** (`start-here`): The spec sheet, the three primitives and the docs — read these before building. — 16
- **011 · Official SDKs & Framework Support** (`official`): Maintained by TypeSafe AI, plus the frameworks that ship Jev natively. — 7
- **104 · Coding Agents** (`coding-agents`): Routers, tool gates, reviewers, skills and MCP servers for agent harnesses. — 48
- **118 · Routing & Gateways** (`routing`): Per-turn model and tool selection, under a hard deadline. — 10
- **131 · Context & Compaction** (`context`): Decide what stays in the window before the model ever reads it. — 6
- **147 · Code Review & Quality** (`code-review`): Judges, linters, coverage gates and review dashboards. — 21
- **152 · Browser & Computer Use** (`browser`): Jev picks the operation and the DOM element; a small LLM only writes the text. — 14
- **158 · Mobile & Desktop Automation** (`mobile`): Driving phones, IM clients and native UIs without hooking or patching. — 4
- **163 · Search, Reranking & RAG** (`search-rag`): Query understanding, source selection, reranking and semantic SQL. — 13
- **179 · Safety, Moderation & Verification** (`safety`): Guardrails, prompt-injection checks, judges that abstain. — 14
- **185 · Data & Ops** (`data-ops`): Postgres extensions, semantic SQL and telemetry pipelines that call Jev. — 20
- **191 · Applications & Extensions** (`apps`): End-user tools people actually open every day. — 29
- **205 · SDKs & Community Clients** (`clients`): Unofficial clients for the languages without a first-party SDK. — 32
- **217 · Command Line** (`cli`): Call Jev from a shell, no SDK required. — 14
- **223 · Benchmarks, Evals & Calibration** (`benchmarks`): Measure it before you trust it. — 27
- **229 · Open Models & Replicas** (`open-models`): Run System One semantics without the vendor — on a 3090 if you like. — 41
- **236 · Games, Robotics & Simulation** (`games`): Decisions as game mechanics. — 19
- **242 · Finance & Trading** (`finance`): Scoring financial signals with calibrated probabilities. — 5
- **248 · Playgrounds & Demos** (`demos`): Try it in thirty seconds. — 12

## The three primitives

- `choice` — Pick one option from a list → choice · probabilities · confidence
- `score` — Rate the state against a rubric → score · probabilities · confidence
- `noul` — Is this statement true? → noul (0–1)

## Cautions

- A source check establishes that a project exists and says what it claims. It does not
  establish that it is production-ready, secure, fast, or open-source licensed — read the
  entry's own license and scope before recommending it.
- Some entries are unofficial clients or open-weight replicas of the System One interface,
  not TypeSafe AI products. Check `official: false`.
- Star counts drift. Cite the refresh date, not a bare number.
