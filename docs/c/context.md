# 🗜️ Context & Compaction

> Decide what stays in the window before the model ever reads it.

6 entries. Part of [Awesome Jev](https://github.com/awesome-jev/awesome-jev) — refreshed 2026-10-01.

---
### tamaratran/fast-jev-compaction

- url: https://github.com/tamaratran/fast-jev-compaction
- description: Replaces the compaction summary with Jev decisions: every tool call and result scored in one request, stale ones dropped, everything kept stays verbatim.
- stars: 7,225
- language: TypeScript
- license: MIT
- pushed_at: 2026-09-18
- use_cases: compact or prune agent context; judge or verify an agent's output; benchmark or calibrate Jev

### tamaratran/jev-pruner

- url: https://github.com/tamaratran/jev-pruner
- description: Trims long Bash output with Jev after the command runs and before the model sees it; short output, errors, and structured formats pass untouched.
- stars: 153
- language: TypeScript
- license: MIT
- pushed_at: 2026-09-30
- use_cases: compact or prune agent context; judge or verify an agent's output; review code or pull requests

### GhalebDweikat/winnow

- url: https://github.com/GhalebDweikat/winnow
- description: Judges every tool result before it enters context, so the window fills slower instead of being cleaned later.
- stars: 100
- language: Python
- license: MIT
- pushed_at: 2026-09-30
- topics: claude-code, claude-code-plugin, context-management, jev, llm-agents, typesafe
- use_cases: compact or prune agent context; judge or verify an agent's output; compare Jev with an LLM

### IAmUnbounded/save-token-jev-clean

- url: https://github.com/IAmUnbounded/save-token-jev-clean
- description: Compaction that asks Jev which tool calls still matter and keeps the rest verbatim, with adapters for Claude Code, Codex, OpenCode, and raw API transcripts.
- stars: 76
- language: TypeScript
- license: MIT
- pushed_at: 2026-09-18
- use_cases: compact or prune agent context; judge or verify an agent's output; run Jev on open models without the vendor

### joelhooks/pi-fast-jev-compaction

- url: https://github.com/joelhooks/pi-fast-jev-compaction
- description: The verbatim compaction idea, ported to Pi.
- stars: 14
- language: TypeScript
- license: MIT
- pushed_at: 2026-09-18
- use_cases: compact or prune agent context; benchmark or calibrate Jev; compare Jev with an LLM

### Nyarlathoteppppp/pi-heed

- url: https://github.com/Nyarlathoteppppp/pi-heed
- description: Checks every side-effecting tool call against what you said earlier in the session, so "review only" still holds after compaction.
- stars: 11
- language: TypeScript
- license: MIT
- pushed_at: 2026-09-19
- topics: ai-agents, coding-agent, guardrails, jev, pi-coding-agent, pi-package
- use_cases: gate or approve tool calls before they run; compact or prune agent context; judge or verify an agent's output
