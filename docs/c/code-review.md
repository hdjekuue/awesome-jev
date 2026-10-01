# 147 · Code Review & Quality

> Judges, linters, coverage gates and review dashboards.

21 entries. Part of [Awesome Jev](https://github.com/hdjekuue/awesome-jev) — refreshed 2026-10-01.

---

### devagrawal09/jev-review

- url: https://github.com/devagrawal09/jev-review
- description: Staged code-review workflow with a local dashboard.
- stars: 643
- language: TypeScript
- license: MIT
- pushed_at: 2026-09-17
- topics: ai, code-review, jev, typesafe-ai, typescript
- use_cases: review code or pull requests; judge or verify an agent's output; learn how Jev works
- rule: 147

### thruwire/foreman

- url: https://github.com/thruwire/foreman
- description: Supervises a software factory of agents, with Jev making the go and no-go calls.
- stars: 619
- language: Python
- license: MIT
- pushed_at: 2026-09-28
- use_cases: judge or verify an agent's output; review code or pull requests; benchmark or calibrate Jev
- rule: 147

### lakeday-org/perch

- url: https://github.com/lakeday-org/perch
- description: Semantic linting: rules in plain language, each file judged by Jev, run locally or in CI.
- stars: 316
- language: JavaScript
- license: MIT
- pushed_at: 2026-09-30
- topics: ai, cli, code-quality, code-review, devtools, linter
- use_cases: review code or pull requests; call Jev from the command line; judge or verify an agent's output
- rule: 147

### NiazMorshed2007/jev-review

- url: https://github.com/NiazMorshed2007/jev-review
- description: Local-first MCP plugin for continuous quality review by coding agents.
- stars: 231
- language: TypeScript
- license: MIT
- pushed_at: 2026-09-17
- topics: agent-plugin, ai-agents, claude-code, code-review, codex, coding-agents
- use_cases: judge or verify an agent's output; serve Jev over MCP to any agent; review code or pull requests
- rule: 147

### supercorp-ai/supercov

- url: https://github.com/supercorp-ai/supercov
- description: Code quality and coverage signals for coding agents.
- stars: 141
- language: Rust
- license: MIT
- pushed_at: 2026-09-27
- topics: coverage, jev, typesafe, gemini-cli-extension, claude-code, code-coverage
- use_cases: judge or verify an agent's output; review code or pull requests; benchmark or calibrate Jev
- rule: 147

### kyu1204/jgrep

- url: https://github.com/kyu1204/jgrep
- description: `--diff` gates a PR in CI on a rule written in English, `--tests` lists the test files a diff can affect, and plain `jgrep` greps code by what it does; one Noul per chunk, 16 chunks per request.
- stars: 58
- language: TypeScript
- license: MIT
- pushed_at: 2026-09-30
- use_cases: review code or pull requests; call Jev from the command line; judge or verify an agent's output
- rule: 147

### Alurith/jeff

- url: https://github.com/Alurith/jeff
- description: Read-only Go CLI that checks files against coded rules such as hidden side effects and weak error handling.
- stars: 38
- language: Go
- license: Apache-2.0
- pushed_at: 2026-09-20
- topics: golang, jev
- use_cases: review code or pull requests; call Jev from the command line; judge or verify an agent's output
- rule: 147

### devanshbatham/commit-miner

- url: https://github.com/devanshbatham/commit-miner
- description: Classifies commit diffs and messages: bug fixes, security fixes with CWEs, change types.
- stars: 36
- language: Rust
- pushed_at: 2026-09-17
- use_cases: review code or pull requests; label data or build a dataset; judge or verify an agent's output
- rule: 147

### lukstei/slop-grader

- url: https://github.com/lukstei/slop-grader
- description: Grades text and markdown files for AI slop, grammar, and technical documentation quality, and guides an AI agent to auto-fix violations.
- stars: 32
- language: TypeScript
- license: MIT
- pushed_at: 2026-09-24
- topics: ai-agents, jev, no-ai-slop, system-one, ai-slop, ai-writing
- use_cases: judge or verify an agent's output; call Jev from the command line; compare Jev with an LLM
- rule: 147

### valentynkit/jev-commit

- url: https://github.com/valentynkit/jev-commit
- description: Pre-commit hook: one Jev call judges whether the commit message matches the staged diff, plus debug leftovers, unmentioned work, and a credential belt; warns except on a secret, which it blocks.
- stars: 13
- language: Python
- license: MIT
- pushed_at: 2026-09-19
- use_cases: judge or verify an agent's output; call Jev from the command line; compare Jev with an LLM
- rule: 147

### frostney/clean-code-review

- url: https://github.com/frostney/clean-code-review
- description: Every file in a PR judged against Clean Code rules, then reviewed by an LLM.
- stars: 12
- language: TypeScript
- license: MIT
- pushed_at: 2026-09-23
- topics: agents, ai, ai-gateway, ai-sdk, clean-code, code-quality
- use_cases: review code or pull requests; judge or verify an agent's output; compare Jev with an LLM
- rule: 147

### huntedman/JevLint

- url: https://github.com/huntedman/JevLint
- description: Configurable semantic linting with file-level Noul judgments.
- stars: 12
- language: TypeScript
- license: MIT
- pushed_at: 2026-09-20
- use_cases: judge or verify an agent's output; review code or pull requests; call Jev from the command line
- rule: 147

### doeixd/jev-pref

- url: https://github.com/doeixd/jev-pref
- description: Turns the preferences in your AGENTS.md into a linter that runs on code changes and reports back to the agent.
- stars: 11
- language: JavaScript
- license: MIT
- pushed_at: 2026-09-18
- topics: agent-skills, claude-code, code-review, jev, skills-sh, typesafe
- use_cases: judge or verify an agent's output; review code or pull requests; pick which skill or prompt to load
- rule: 147

### nozomi-koborinai/jev-spec

- url: https://github.com/nozomi-koborinai/jev-spec
- description: Checks the code against the requirements in a Markdown spec on every commit and fails the build when the two drift apart.
- stars: 11
- language: TypeScript
- license: MIT
- pushed_at: 2026-09-29
- topics: ai, jev, linter, typesafe-ai, typescript, agent-skills
- use_cases: call Jev from the command line; judge or verify an agent's output; review code or pull requests
- rule: 147

### HexyeDEV/JevPR

- url: https://github.com/HexyeDEV/JevPR
- description: GitHub App that asks Jev whether a pull request is safe to approve or needs a specialist, then maps the verdict to a check run.
- stars: 10
- language: Python
- license: Apache-2.0
- pushed_at: 2026-09-25
- topics: classification, jev, pull-requests, python
- use_cases: judge or verify an agent's output; review code or pull requests; route between models by task difficulty
- rule: 147

### stratonext/software-factory

- url: https://github.com/stratonext/software-factory
- description: Runs several coding agents locally with Jev as judge and orchestrator.
- stars: 9
- language: Python
- license: MIT
- pushed_at: 2026-09-30
- use_cases: judge or verify an agent's output; run Jev on open models without the vendor; benchmark or calibrate Jev
- rule: 147

### raihankhan-rk/diffjury

- url: https://github.com/raihankhan-rk/diffjury
- description: PR risk router and review coach.
- stars: 8
- language: TypeScript
- pushed_at: 2026-09-22
- use_cases: review code or pull requests; judge or verify an agent's output; compact or prune agent context
- rule: 147

### cephalization/jev-triage

- url: https://github.com/cephalization/jev-triage
- description: Pulls large repositories and triages their issues with typed Jev questions.
- stars: 5
- language: TypeScript
- license: MIT
- pushed_at: 2026-09-29
- use_cases: review code or pull requests; judge or verify an agent's output; voice or realtime decisions
- rule: 147

### Ramneet-Singh/jevopt

- url: https://github.com/Ramneet-Singh/jevopt
- description: C/C++ compiler driver that asks Jev whether to inline each discretionary call site, from the LLVM IR and the original source.
- stars: 4
- language: Python
- license: GPL-3.0
- pushed_at: 2026-09-21
- use_cases: benchmark or calibrate Jev; compare Jev with an LLM; judge or verify an agent's output
- rule: 147

### allebee/pytest-jev

- url: https://github.com/allebee/pytest-jev
- description: Pytest plugin that asks Jev whether plain-English claims about a test's text hold, all in one request, and fails the test with each claim's probability unless Jev is at least 80 percent sure.
- stars: 3
- language: Python
- license: MIT
- pushed_at: 2026-09-21
- topics: jev, llm, llm-evaluation, pytest, pytest-plugin, python
- use_cases: judge or verify an agent's output; compare Jev with an LLM; review code or pull requests
- rule: 147

### fatwang2/jev-review-action

- url: https://github.com/fatwang2/jev-review-action
- description: GitHub Action for submission review and PR classification with Jev, no text-generation model in the loop.
- stars: 2
- language: JavaScript
- license: MIT
- pushed_at: 2026-09-20
- topics: automation, awesome-list, classification, github-action, jev, pull-request
- use_cases: review code or pull requests; score or rank candidates in a pipeline; route requests through a gateway or proxy
- rule: 147
