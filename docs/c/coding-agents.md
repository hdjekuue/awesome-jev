# 104 · Coding Agents

> Routers, tool gates, reviewers, skills and MCP servers for agent harnesses.

48 entries. Part of [Awesome Jev](https://github.com/hdjekuue/awesome-jev) — refreshed 2026-10-01.

---

### nicobailon/pi-mcp-adapter

- url: https://github.com/nicobailon/pi-mcp-adapter
- description: Opt-in typed evaluation and semantic search over MCP tool results, behind a per-server data-egress allowlist.
- stars: 1 568
- language: TypeScript
- license: MIT
- pushed_at: 2026-09-30
- topics: ai, claude, coding-agent, extension, llm, mcp
- use_cases: compact or prune agent context; judge or verify an agent's output; route requests through a gateway or proxy
- rule: 104

### kerpopule/hermes-jev-skills

- url: https://github.com/kerpopule/hermes-jev-skills
- description: Hands an agent's small decisions to Jev: which model answers the turn, which skills to load, which passages matter, which turns survive compaction.
- stars: 918
- language: Python
- license: MIT
- pushed_at: 2026-09-29
- use_cases: compact or prune agent context; pick which skill or prompt to load; route between models by task difficulty
- rule: 104

### gargpratyush/jev-router

- url: https://github.com/gargpratyush/jev-router
- description: Routes each task to the cheapest Claude model that can handle it.
- stars: 499
- language: JavaScript
- license: MIT
- pushed_at: 2026-09-19
- use_cases: route between models by task difficulty; call Jev from the command line; learn how Jev works
- rule: 104

### jkudish/jev-mcp

- url: https://github.com/jkudish/jev-mcp
- description: The first MCP server for Jev, and still the most linked.
- stars: 464
- language: JavaScript
- license: MIT
- pushed_at: 2026-09-29
- use_cases: serve Jev over MCP to any agent; score or rank candidates in a pipeline; extract structured fields from text
- rule: 104

### notque/vexjoy-agent

- url: https://github.com/notque/vexjoy-agent
- description: Agent toolkit whose `/d` command picks the specialist agent, skill, and pipeline with one Jev call, plus an optional Jev auto-compact plugin.
- stars: 426
- language: Python
- license: MIT
- pushed_at: 2026-09-30
- topics: ai, ai-agents, ai-skills, claude, claude-code, ai-pipelines
- use_cases: gate or approve tool calls before they run; pick which skill or prompt to load; judge or verify an agent's output
- rule: 104

### TianyuCodings/JevHarness

- url: https://github.com/TianyuCodings/JevHarness
- description: Has an LLM write a task-specific harness that turns observations into Jev questions, then freezes it and improves it from rewards and full execution traces.
- stars: 400
- language: Python
- pushed_at: 2026-09-21
- use_cases: judge or verify an agent's output; benchmark or calibrate Jev; compare Jev with an LLM
- rule: 104

### itsmostafa/typesafe-mcp

- url: https://github.com/itsmostafa/typesafe-mcp
- description: Single-binary Go MCP server and CLI that exposes TypeSafe Jev judgments to Claude Desktop, Claude Code and Codex.
- stars: 337
- language: Go
- license: MIT
- pushed_at: 2026-09-30
- topics: mcp, mcp-tools
- use_cases: classify support tickets or messages; serve Jev over MCP to any agent; add Jev to a chat bot or Discord
- rule: 104

### miuuyy/Astra-Ares

- url: https://github.com/miuuyy/Astra-Ares
- description: Has Jev pick the reasoning effort and how long to hold it for a running Codex task, on a patched Codex CLI built from upstream source.
- stars: 293
- language: JavaScript
- license: MIT
- pushed_at: 2026-09-23
- use_cases: benchmark or calibrate Jev; review code or pull requests; learn how Jev works
- rule: 104

### 0xNatoshi/jev-codex-router

- url: https://github.com/0xNatoshi/jev-codex-router
- description: Picks model, thinking depth, and speed mode for every Codex turn.
- stars: 278
- language: JavaScript
- license: MIT
- archived: true
- pushed_at: 2026-09-22
- topics: ai, codex, jev, llm, macos, routing
- use_cases: route between models by task difficulty; benchmark or calibrate Jev; review code or pull requests
- rule: 104

### kitze/skillbox

- url: https://github.com/kitze/skillbox
- description: Self-hosted, versioned skills library served over MCP, with Jev recommending which skill to load.
- stars: 255
- language: TypeScript
- license: MIT
- pushed_at: 2026-09-19
- use_cases: pick which skill or prompt to load; serve Jev over MCP to any agent; run Jev on open models without the vendor
- rule: 104

### DevMortimer/pi-warden

- url: https://github.com/DevMortimer/pi-warden
- description: Guardrails that steer instead of interrupt: irreversible calls, off-task calls, stuck loops, unverified done claims, about 250 ms each.
- stars: 154
- language: TypeScript
- license: MIT
- pushed_at: 2026-09-29
- topics: guardrails, pi-extension, pi-package, typesafe, agent-guardrails
- use_cases: stop an agent from finishing early; judge or verify an agent's output; detect prompt injection or risky commands
- rule: 104

### y0usaf/pi-jev

- url: https://github.com/y0usaf/pi-jev
- description: A measured tool-call gate plus a `jev_ask` tool for typed answers inside Pi.
- stars: 151
- language: TypeScript
- license: MIT
- pushed_at: 2026-09-25
- topics: guardrails, jev, pi-extension, pi-package, typesafe
- use_cases: gate or approve tool calls before they run; judge or verify an agent's output; detect prompt injection or risky commands
- rule: 104

### dbreunig/building-with-jev-skill

- url: https://github.com/dbreunig/building-with-jev-skill
- description: Skill for writing and improving programs that call Jev.
- stars: 145
- pushed_at: 2026-09-17
- use_cases: score or rank candidates in a pipeline; add Jev to a chat bot or Discord; pick which skill or prompt to load
- rule: 104

### Dicklesworthstone/skillranker

- url: https://github.com/Dicklesworthstone/skillranker
- description: Rust CLI and hooks that rank installed skills for the next step using live session context, with abstention.
- stars: 125
- language: Rust
- license: NOASSERTION
- pushed_at: 2026-09-29
- topics: agent-skills, ai-agents, asupersync, claude-code, cli, developer-tools
- use_cases: pick which skill or prompt to load; benchmark or calibrate Jev; call Jev from the command line
- rule: 104

### devagrawal09/jev-code

- url: https://github.com/devagrawal09/jev-code
- description: Command-line toolkit that coding agents hand judgment-heavy work to, one typed Jev workflow per request.
- stars: 119
- language: TypeScript
- license: MIT
- pushed_at: 2026-09-19
- use_cases: judge or verify an agent's output; review code or pull requests; call Jev from the command line
- rule: 104

### devagrawal09/stanley-code

- url: https://github.com/devagrawal09/stanley-code
- description: Coding CLI where Jev routes a plain-language request to one deterministic workflow, and that workflow asks Jev fixed-choice questions about the evidence it gathered.
- stars: 119
- language: TypeScript
- license: MIT
- pushed_at: 2026-09-19
- use_cases: judge or verify an agent's output; review code or pull requests; call Jev from the command line
- rule: 104

### fabricioctelles/skills

- url: https://github.com/fabricioctelles/skills
- description: Agent-skill directory that can score subjective evaluation criteria with Jev.
- stars: 97
- language: Python
- license: Apache-2.0
- pushed_at: 2026-09-27
- topics: agentic-ai, agentic-skills, skills, steering, claude-code, claude-skills
- use_cases: judge or verify an agent's output; pick which skill or prompt to load; classify support tickets or messages
- rule: 104

### EliaAlberti/jev-rules

- url: https://github.com/EliaAlberti/jev-rules
- description: Scores your standing rules against each prompt and delivers only the ones that apply, once per session.
- stars: 63
- language: JavaScript
- license: MIT
- pushed_at: 2026-09-27
- use_cases: compact or prune agent context; learn how Jev works; pick which skill or prompt to load
- rule: 104

### TheoOliveira/pi-jev

- url: https://github.com/TheoOliveira/pi-jev
- description: Semantic tool routing and typed decisions as Pi tools.
- stars: 58
- language: TypeScript
- license: MIT
- pushed_at: 2026-09-24
- topics: jev, pi-coding-agent, pi-extension, pi-package, system-one, tool-routing
- use_cases: pick which skill or prompt to load; compact or prune agent context; judge or verify an agent's output
- rule: 104

### DevMortimer/pi-typesafe

- url: https://github.com/DevMortimer/pi-typesafe
- description: Batched evaluation tool, terminal playground, and a typed API for Pi extension authors.
- stars: 49
- language: TypeScript
- license: MIT
- pushed_at: 2026-09-30
- use_cases: monitor or observe Jev usage and cost; call Jev from the command line; benchmark or calibrate Jev
- rule: 104

### tacticocc/Jevbridge

- url: https://github.com/tacticocc/Jevbridge
- description: ACP and MCP adapter that pairs Jev with any LLM for computer use and typed decisions.
- stars: 46
- language: TypeScript
- license: MIT
- pushed_at: 2026-09-21
- topics: acp, agent, claude, computer-use, grok, jev
- use_cases: gate or approve tool calls before they run; run Jev on open models without the vendor; serve Jev over MCP to any agent
- rule: 104

### shantanugoel/ask-jev-skill

- url: https://github.com/shantanugoel/ask-jev-skill
- description: Lets Hermes and similar agents ask Jev directly.
- stars: 42
- language: Python
- license: MIT
- pushed_at: 2026-09-17
- use_cases: judge or verify an agent's output; score or rank candidates in a pipeline; compare Jev with an LLM
- rule: 104

### shitianfang/jev-use

- url: https://github.com/shitianfang/jev-use
- description: Hands the Claude Code, Codex and pi steps that need no text output to Jev, with a typed escalation contract for everything it should not decide.
- stars: 31
- language: JavaScript
- license: MIT
- pushed_at: 2026-09-22
- topics: agent, ai-agents, claude-code, claude-code-plugin, codex, jev
- use_cases: gate or approve tool calls before they run; compact or prune agent context; drive a browser or GUI with an agent
- rule: 104

### jomatsu/pi-jev-auto-mode

- url: https://github.com/jomatsu/pi-jev-auto-mode
- description: Auto-approves bash, write, and edit calls semantically and fails closed when it cannot decide.
- stars: 31
- language: TypeScript
- license: MIT
- pushed_at: 2026-09-24
- topics: auto-mode, coding-agent, guardrail, jev, permission, pi-coding-agent
- use_cases: gate or approve tool calls before they run; detect prompt injection or risky commands; benchmark or calibrate Jev
- rule: 104

### keeltrace/hermes-jev

- url: https://github.com/keeltrace/hermes-jev
- description: Typed decisions, ranking, verification, and an opt-in tool gate.
- stars: 31
- language: Python
- license: MIT
- pushed_at: 2026-09-28
- use_cases: gate or approve tool calls before they run; judge or verify an agent's output; run Jev on open models without the vendor
- rule: 104

### compozy/yoshi

- url: https://github.com/compozy/yoshi
- description: Context-pruning proxy for Claude Code and Codex, with the savings measured rather than claimed.
- stars: 27
- language: TypeScript
- license: MIT
- pushed_at: 2026-09-18
- topics: bun, claude-code, codex, context-window, jev, llm-proxy
- use_cases: compact or prune agent context; route requests through a gateway or proxy; benchmark or calibrate Jev
- rule: 104

### blakestone-x/jev-mcp

- url: https://github.com/blakestone-x/jev-mcp
- description: Classify, score, check, match, and screen, with confidence on every answer.
- stars: 26
- language: Python
- license: MIT
- pushed_at: 2026-09-16
- use_cases: serve Jev over MCP to any agent; judge or verify an agent's output; score or rank candidates in a pipeline
- rule: 104

### GodsBoy/jev-agent-skill-router

- url: https://github.com/GodsBoy/jev-agent-skill-router
- description: Confidence-aware skill routing with an abstain path.
- stars: 24
- language: Python
- license: MIT
- pushed_at: 2026-09-16
- topics: agentic-ai, ai-agents, hermes-agent, jev, python, skill-routing
- use_cases: pick which skill or prompt to load; judge or verify an agent's output; benchmark or calibrate Jev
- rule: 104

### Brainwires/jevwire

- url: https://github.com/Brainwires/jevwire
- description: MCP server, embeddable decision model, and an escalate-only plugin that can make the harness stricter but never looser.
- stars: 22
- language: TypeScript
- license: MIT
- pushed_at: 2026-09-21
- use_cases: gate or approve tool calls before they run; serve Jev over MCP to any agent; judge or verify an agent's output
- rule: 104

### valentynkit/jev-belay

- url: https://github.com/valentynkit/jev-belay
- description: Stop hook that blocks an unverified "done": reads the transcript for evidence and, only when files changed with no passing check since, spends one four-question Jev call; fails open on every error path.
- stars: 20
- language: JavaScript
- license: MIT
- pushed_at: 2026-09-20
- use_cases: judge or verify an agent's output; stop an agent from finishing early; benchmark or calibrate Jev
- rule: 104

### anpicasso/hermes-jev-approvals

- url: https://github.com/anpicasso/hermes-jev-approvals
- description: Approves, denies, or escalates flagged shell commands before they run; vendor-reported speedups.
- stars: 20
- language: Python
- license: MIT
- pushed_at: 2026-09-22
- use_cases: gate or approve tool calls before they run; detect prompt injection or risky commands; benchmark or calibrate Jev
- rule: 104

### mejiasd3v/pi-jev-router

- url: https://github.com/mejiasd3v/pi-jev-router
- description: Automatic model routing for Pi through the Vercel AI Gateway.
- stars: 16
- language: JavaScript
- license: MIT
- pushed_at: 2026-09-22
- use_cases: route requests through a gateway or proxy; route between models by task difficulty; call Jev from the command line
- rule: 104

### DECRUX9812/typesafe-skill-router

- url: https://github.com/DECRUX9812/typesafe-skill-router
- description: Names the one skill worth loading before the model call; stdlib only, about a tenth of a cent per turn.
- stars: 15
- language: Python
- license: MIT
- pushed_at: 2026-09-21
- topics: ai-agents, hermes-agent, hermes-plugin, llm-agents, plugin-catalog, prompt-caching
- use_cases: pick which skill or prompt to load; compact or prune agent context; review code or pull requests
- rule: 104

### kubet/azdaja

- url: https://github.com/kubet/azdaja
- description: Recursive language-model layer for Claude Code, Codex, Gemini and OpenCode that keeps sources local; Jev is an optional leaf for reranking, verification and semantic joins.
- stars: 14
- language: Python
- license: MIT
- pushed_at: 2026-09-21
- topics: agent-skills, jcode, recursive-language-models, rust, gemini-cli-extension, claude-code
- use_cases: judge or verify an agent's output; compact or prune agent context; extract structured fields from text
- rule: 104

### HyunjunJeon/pi-quiet-ask

- url: https://github.com/HyunjunJeon/pi-quiet-ask
- description: Jev as the Pi coding agent's quiet decision layer.
- stars: 12
- language: TypeScript
- license: MIT
- pushed_at: 2026-09-18
- use_cases: gate or approve tool calls before they run; judge or verify an agent's output; detect prompt injection or risky commands
- rule: 104

### harshwasan/pi-jev-sentinel

- url: https://github.com/harshwasan/pi-jev-sentinel
- description: Checks Pi tool calls, tool outputs, and replies for risky actions and prompt injection, with user approvals, context re-checks, secret scrubbing, and optional task pinning.
- stars: 11
- language: TypeScript
- license: MIT
- pushed_at: 2026-09-20
- use_cases: gate or approve tool calls before they run; detect prompt injection or risky commands; judge or verify an agent's output
- rule: 104

### 24601/Augustus

- url: https://github.com/24601/Augustus
- description: Skill for deciding where a typed judgment belongs at all and what stays in code; a companion to the official skill, not a replacement.
- stars: 11
- language: Python
- license: MIT
- pushed_at: 2026-09-28
- topics: agent-skills, agent-workflows, ai-agents, calibrated-confidence, claude-code, decision-systems
- use_cases: score or rank candidates in a pipeline; benchmark or calibrate Jev; rerank search results
- rule: 104

### adarshmishra07/jcm-router

- url: https://github.com/adarshmishra07/jcm-router
- description: Local proxy that picks model and effort per message and leaves the cached main chat alone.
- stars: 9
- language: TypeScript
- license: MIT
- pushed_at: 2026-09-17
- use_cases: route between models by task difficulty; route requests through a gateway or proxy; benchmark or calibrate Jev
- rule: 104

### AbdelStark/bicameral

- url: https://github.com/AbdelStark/bicameral
- description: Hybrid harness for Pi: an LLM writes the code, Jev reflexes gate every call as allow, confirm, block, warn, or steer.
- stars: 9
- language: TypeScript
- license: MIT
- pushed_at: 2026-09-16
- topics: harness-engineering, hybrid-machine-learning, machine-learning
- use_cases: gate or approve tool calls before they run; judge or verify an agent's output; detect prompt injection or risky commands
- rule: 104

### ajensenwaud/hermes-jev-plugin

- url: https://github.com/ajensenwaud/hermes-jev-plugin
- description: Four Hermes tools for atomic checks, routing, and rubric scoring; listed in the Hermes plugin catalog.
- stars: 8
- language: Python
- license: MIT
- pushed_at: 2026-09-19
- topics: ai-agents, decision-making, hermes, hermes-agent, jev, typesafe
- use_cases: judge or verify an agent's output; classify support tickets or messages; score or rank candidates in a pipeline
- rule: 104

### HyunjunJeon/jev-judgment

- url: https://github.com/HyunjunJeon/jev-judgment
- description: Sends a coding agent's closed judgments to Jev instead of the chat model.
- stars: 7
- language: Python
- license: MIT
- pushed_at: 2026-09-17
- use_cases: gate or approve tool calls before they run; judge or verify an agent's output; voice or realtime decisions
- rule: 104

### 3clyp50/a0-typesafe-ai

- url: https://github.com/3clyp50/a0-typesafe-ai
- description: Typed tools and probability cards for Agent Zero.
- stars: 6
- language: Python
- license: MIT
- pushed_at: 2026-09-17
- use_cases: judge or verify an agent's output; score or rank candidates in a pipeline; add Jev to a chat bot or Discord
- rule: 104

### bestagentkits/jev-skillful

- url: https://github.com/bestagentkits/jev-skillful
- description: Per-prompt router over skills, MCP servers, agents, and commands, and it measures whether the injection helped.
- stars: 5
- language: TypeScript
- license: MIT
- pushed_at: 2026-09-17
- topics: agent-tooling, ai-agents, claude-code, codex, coding-agents, developer-tools
- use_cases: compact or prune agent context; pick which skill or prompt to load; benchmark or calibrate Jev
- rule: 104

### noplan-inc/limpet

- url: https://github.com/noplan-inc/limpet
- description: A Stop hook that keeps the agent from stopping too early, judged against plain-language rules.
- stars: 5
- language: Python
- license: MIT
- pushed_at: 2026-09-17
- topics: ai-agents, claude-code, codex, hooks, jev
- use_cases: stop an agent from finishing early; judge or verify an agent's output; benchmark or calibrate Jev
- rule: 104

### suenot/codex-jev-router

- url: https://github.com/suenot/codex-jev-router
- description: Uses Jev to select the model and reasoning effort for Codex subagents, with confidence gates and a Sol fallback.
- stars: 5
- language: JavaScript
- license: MIT
- pushed_at: 2026-09-27
- use_cases: judge or verify an agent's output; compact or prune agent context; compare Jev with an LLM
- rule: 104

### legacybridge-tech/pi-typesafe-jev

- url: https://github.com/legacybridge-tech/pi-typesafe-jev
- description: Pi extension exposing Jev judgments as five Pi tools.
- stars: 4
- language: TypeScript
- license: NOASSERTION
- pushed_at: 2026-09-17
- use_cases: judge or verify an agent's output; score or rank candidates in a pipeline; classify support tickets or messages
- rule: 104

### BYK/jev-mcp

- url: https://github.com/BYK/jev-mcp
- description: Eval-first MCP server: prototype a question, map it over many items, then measure variants against labeled examples with a threshold sweep.
- stars: 4
- language: TypeScript
- license: MIT
- pushed_at: 2026-09-18
- use_cases: benchmark or calibrate Jev; judge or verify an agent's output; classify support tickets or messages
- rule: 104

### samtay32/jev-system-architect

- url: https://github.com/samtay32/jev-system-architect
- description: Finds the fuzzy judgment in a system and turns it into small Choice, Score, and Noul primitives.
- stars: 3
- license: MIT
- pushed_at: 2026-09-17
- use_cases: classify support tickets or messages; extract structured fields from text; score or rank candidates in a pipeline
- rule: 104
