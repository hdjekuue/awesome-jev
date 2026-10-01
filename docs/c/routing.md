# 118 · Routing & Gateways

> Per-turn model and tool selection, under a hard deadline.

10 entries. Part of [Awesome Jev](https://github.com/hdjekuue/awesome-jev) — refreshed 2026-10-01.

---

### BillionsBobby/JevRouter

- url: https://github.com/BillionsBobby/JevRouter
- description: Models, subagents, skills, MCP tools, and CLIs as one candidate set; Jev picks, the router enforces permissions and risk; reports 44 percent first-five tool-call hits against 24 for DeepSeek on Toolathlon.
- stars: 303
- language: TypeScript
- license: MIT
- pushed_at: 2026-09-26
- use_cases: gate or approve tool calls before they run; pick which skill or prompt to load; benchmark or calibrate Jev
- rule: 118

### vinilana/jev-gateway

- url: https://github.com/vinilana/jev-gateway
- description: Local gateway for Codex and Claude Code that sends the "which tool next" decision to Jev and everything else to your usual model.
- stars: 267
- language: TypeScript
- license: MIT
- pushed_at: 2026-09-25
- use_cases: gate or approve tool calls before they run; route requests through a gateway or proxy; compare Jev with an LLM
- rule: 118

### juspay/neurolink

- url: https://github.com/juspay/neurolink
- description: TypeScript AI SDK where decide, via Jev, is a peer of generate and stream: one typed-judgment call routes model choice, prunes context, and picks MCP tools.
- stars: 144
- language: TypeScript
- license: MIT
- pushed_at: 2026-09-30
- topics: ai, developer-tools, llm, mcp, model-context-protocol, agents
- use_cases: compact or prune agent context; route between models by task difficulty; gate or approve tool calls before they run
- rule: 118

### nidhi-singh02/agent-router

- url: https://github.com/nidhi-singh02/agent-router
- description: Picks Cursor, Claude Code, Codex, or OpenCode plus model and effort for a task, then launches it.
- stars: 99
- language: TypeScript
- license: MIT
- pushed_at: 2026-09-27
- topics: agents, ai, cli, coding, developer-tools, herdr
- use_cases: route between models by task difficulty; call Jev from the command line; review code or pull requests
- rule: 118

### yusukebe/hono-jev-router

- url: https://github.com/yusukebe/hono-jev-router
- description: Route HTTP requests by meaning in Hono.
- stars: 51
- language: TypeScript
- license: MIT
- pushed_at: 2026-09-18
- use_cases: benchmark or calibrate Jev; compare Jev with an LLM; review code or pull requests
- rule: 118

### xinyao27/jevonian

- url: https://github.com/xinyao27/jevonian
- description: Local OpenAI, Anthropic and Responses-compatible proxy that serves one Jev call per turn to pick both the model route and the thinking level, filtering candidates by context window and quota.
- stars: 16
- language: TypeScript
- license: AGPL-3.0
- pushed_at: 2026-09-29
- use_cases: route between models by task difficulty; route requests through a gateway or proxy; monitor or observe Jev usage and cost
- rule: 118

### prismhq/jev-router

- url: https://github.com/prismhq/jev-router
- description: LLM router on top of LiteLLM.
- stars: 15
- language: Python
- license: MIT
- pushed_at: 2026-09-17
- use_cases: route requests through a gateway or proxy; add Jev to a chat bot or Discord; compare Jev with an LLM
- rule: 118

### iamvatsalpatel/tiershift

- url: https://github.com/iamvatsalpatel/tiershift
- description: Shifts every LLM call to the cheapest model that can handle it, policy in YAML, decision in about 180 ms.
- stars: 4
- language: TypeScript
- license: MIT
- pushed_at: 2026-09-28
- topics: agents, cost-optimization, jev, llm, model-routing, typesafe
- use_cases: route between models by task difficulty; route requests through a gateway or proxy; monitor or observe Jev usage and cost
- rule: 118

### FirasSX914/Janus

- url: https://github.com/FirasSX914/Janus
- description: Measures on your data when Jev beats other models, then routes accordingly.
- stars: 3
- language: Python
- license: MIT
- pushed_at: 2026-09-18
- topics: benchmark, calibration, confidence, deepseek, jev, llm
- use_cases: benchmark or calibrate Jev; compare Jev with an LLM; judge or verify an agent's output
- rule: 118

### daviddl9/jev-router

- url: https://github.com/daviddl9/jev-router
- description: Jev picks the worker tier for each step in OMP and Pi, keeping planning and review on a strong model and bounded work on cheaper ones.
- stars: 0
- language: TypeScript
- license: NOASSERTION
- pushed_at: 2026-09-21
- use_cases: route between models by task difficulty; compact or prune agent context; judge or verify an agent's output
- rule: 118
