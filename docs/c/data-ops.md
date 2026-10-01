# 185 · Data & Ops

> Postgres extensions, semantic SQL and telemetry pipelines that call Jev.

20 entries. Part of [Awesome Jev](https://github.com/hdjekuue/awesome-jev) — refreshed 2026-10-01.

---

### kyotofin/tax-doc-classifier

- url: https://github.com/kyotofin/tax-doc-classifier
- description: One request per page picks among 261 IRS forms and seven page kinds; reports 100 percent on its corpus at $0.001 a page, 34 times cheaper than the LLM pipeline it replaced.
- stars: 484
- language: TypeScript
- license: Apache-2.0
- pushed_at: 2026-09-29
- use_cases: compare Jev with an LLM; review code or pull requests; label data or build a dataset
- rule: 185

### realZachi/pg-jev

- url: https://github.com/realZachi/pg-jev
- description: PostgreSQL extension that answers plain-language questions about your tables.
- stars: 381
- language: Shell
- license: NOASSERTION
- pushed_at: 2026-09-18
- use_cases: run Jev inside a database or SQL; score or rank candidates in a pipeline; classify support tickets or messages
- rule: 185

### AgriciDaniel/jev-seo

- url: https://github.com/AgriciDaniel/jev-seo
- description: Crawls a site, checks it against 52 SEO rules, has Jev judge every page, and writes PDF, spreadsheet, and Markdown reports.
- stars: 266
- language: Python
- license: MIT
- pushed_at: 2026-09-22
- use_cases: call Jev from the command line; judge or verify an agent's output; benchmark or calibrate Jev
- rule: 185

### AkashPriyadarshii/jev-curate

- url: https://github.com/AkashPriyadarshii/jev-curate
- description: Sifts Parquet and JSONL training data at more than 1,500 rows a second.
- stars: 92
- language: Rust
- license: MIT
- pushed_at: 2026-09-30
- topics: arrow, cli, data-cleaning, data-engineering, dataset-curation, eval-harness
- use_cases: label data or build a dataset; benchmark or calibrate Jev; score or rank candidates in a pipeline
- rule: 185

### giuliosmall/pg_typesafe

- url: https://github.com/giuliosmall/pg_typesafe
- description: Pre-alpha PostgreSQL extension for categorical classification with Jev.
- stars: 88
- language: C
- license: MIT
- pushed_at: 2026-09-24
- use_cases: run Jev inside a database or SQL; score or rank candidates in a pipeline; label data or build a dataset
- rule: 185

### AboveColin/HA-Jev

- url: https://github.com/AboveColin/HA-Jev
- description: Home Assistant integration: ask a question about your house, get a probability, choice, or score as an entity.
- stars: 69
- language: Python
- license: MIT
- pushed_at: 2026-09-30
- topics: ai, custom-components, hacs, home-assistant, home-automation, homeassistant
- use_cases: voice or realtime decisions; monitor or observe Jev usage and cost; review code or pull requests
- rule: 185

### choxos/jev-reviewer

- url: https://github.com/choxos/jev-reviewer
- description: Asks a clinical trial report for systematic-review data by voice, text, or a questions file; every answer is a verbatim quote with its file and place.
- stars: 38
- language: JavaScript
- license: MIT
- pushed_at: 2026-09-19
- topics: clinical-trials, data-extraction, evidence-synthesis, jev, meta-analysis, pdf
- use_cases: judge or verify an agent's output; extract structured fields from text; compare Jev with an LLM
- rule: 185

### chenmingtang830/jevgraph

- url: https://github.com/chenmingtang830/jevgraph
- description: Parses PDF, DOCX, PPTX, or text locally, then asks Jev one closed-set relation question per candidate entity pair and exports a graph with per-edge probabilities and page evidence to JSON, CSV, or Neo4j.
- stars: 31
- language: Python
- license: Apache-2.0
- pushed_at: 2026-09-20
- topics: information-extraction, jev, knowledge-graph, llm, python, relation-extraction
- use_cases: judge or verify an agent's output; benchmark or calibrate Jev; compare Jev with an LLM
- rule: 185

### colliber/duckdb-jev

- url: https://github.com/colliber/duckdb-jev
- description: DuckDB extension that asks a question of every row and returns a real SQL type.
- stars: 28
- language: C++
- license: MIT
- pushed_at: 2026-09-18
- use_cases: run Jev inside a database or SQL; extract structured fields from text; label data or build a dataset
- rule: 185

### chopratejas/invalidate

- url: https://github.com/chopratejas/invalidate
- description: Gives every stored agent memory a lease and asks Jev whether new evidence ends it; [live demo](https://invalidate-playground.vercel.app).
- stars: 23
- language: Python
- license: Apache-2.0
- pushed_at: 2026-09-21
- use_cases: compact or prune agent context; judge or verify an agent's output; add Jev to a chat bot or Discord
- rule: 185

### reachjalil/jevlogs

- url: https://github.com/reachjalil/jevlogs
- description: Scores OpenTelemetry log signal before paying for LLM analysis.
- stars: 17
- language: JavaScript
- license: MIT
- pushed_at: 2026-09-22
- use_cases: monitor or observe Jev usage and cost; compare Jev with an LLM; benchmark or calibrate Jev
- rule: 185

### kylemclaren/jevql

- url: https://github.com/kylemclaren/jevql
- description: Semantic SQL for PostgreSQL, with Jev answering the predicates.
- stars: 15
- language: Go
- license: MIT
- pushed_at: 2026-09-19
- topics: jev, postgres
- use_cases: call Jev from the command line; call Jev from a language SDK; serve Jev over MCP to any agent
- rule: 185

### collapseindex/jev-ultralightspeed

- url: https://github.com/collapseindex/jev-ultralightspeed
- description: Packs 32 items into one request for bulk classification and calibrates the confidence cut that sends the least-sure rows to a person, reporting 533 items a second at 89.2 percent agreement with human labels.
- stars: 12
- language: Python
- license: NOASSERTION
- pushed_at: 2026-09-22
- topics: batching, classification, http2, jev, llm, throughput
- use_cases: benchmark or calibrate Jev; classify support tickets or messages; label data or build a dataset
- rule: 185

### keltokhy/jlink

- url: https://github.com/keltokhy/jlink
- description: Links records across two datasets from a match rule written in plain English, from Python, the shell, Stata, or R, and reports F1 0.73 against 0.69 for tuned string matching on NBER patent assignees to Compustat.
- stars: 7
- language: Python
- license: MIT
- pushed_at: 2026-09-28
- topics: economics, entity-resolution, fuzzy-matching, jev, record-linkage, stata
- use_cases: benchmark or calibrate Jev; judge or verify an agent's output; call Jev from the command line
- rule: 185

### EugeneBoondock/jevsql

- url: https://github.com/EugeneBoondock/jevsql
- description: SQL with natural-language predicates over SQLite: filter, rank, and classify rows by meaning, batched and cost-guarded.
- stars: 6
- language: JavaScript
- license: MIT
- pushed_at: 2026-09-19
- topics: ai, jev, llm, semantic-search, sql, sqlite
- use_cases: judge or verify an agent's output; rerank search results; score or rank candidates in a pipeline
- rule: 185

### Foadsf/jev-for-engineers

- url: https://github.com/Foadsf/jev-for-engineers
- description: Eight small examples from mechanical and electrical engineering: CAD routing, FEM triage, DFM screening, BOM alignment.
- stars: 6
- language: Python
- license: MIT
- pushed_at: 2026-09-16
- topics: cad, cae, calibrated-confidence, classification, jev, llm
- use_cases: extract structured fields from text; benchmark or calibrate Jev; learn how Jev works
- rule: 185

### Query-farm/vgi-typesafe

- url: https://github.com/Query-farm/vgi-typesafe
- description: DuckDB worker that exposes choice, noul, and score as lateral-joinable table functions in SQL.
- stars: 5
- language: Python
- license: MIT
- pushed_at: 2026-09-19
- topics: ai, apache-arrow, arrow, classification, data-engineering, duckdb
- use_cases: score or rank candidates in a pipeline; classify support tickets or messages; label data or build a dataset
- rule: 185

### mgaitan/sqlite-jev

- url: https://github.com/mgaitan/sqlite-jev
- description: Adds Jev Noul, Choice, and Score judgments to SQLite through a loadable C extension and Python wrapper, with scalar functions and batched virtual-table queries.
- stars: 4
- language: C
- pushed_at: 2026-09-18
- use_cases: run Jev inside a database or SQL; label data or build a dataset; classify support tickets or messages
- rule: 185

### opaielsheikh/typesafe-migration-guard

- url: https://github.com/opaielsheikh/typesafe-migration-guard
- description: Reviews database migrations for safety before they run.
- stars: 3
- language: TypeScript
- pushed_at: 2026-09-17
- use_cases: review code or pull requests; judge or verify an agent's output; gate or approve tool calls before they run
- rule: 185

### ddfeyes/jev-mode

- url: https://github.com/ddfeyes/jev-mode
- description: Ticket triage and file tagging on a typed-judgment model; reports 78 percent fewer tokens and 96.1 percent accuracy against a 93.7 percent baseline.
- stars: 3
- language: Python
- license: MIT
- pushed_at: 2026-09-18
- topics: agents, ai, classification, cli, jev, llm
- use_cases: compact or prune agent context; classify support tickets or messages; compare Jev with an LLM
- rule: 185
