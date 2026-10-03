<div align="center">

# Awesome Jev

# ⚡ Everything is a Decision.

**The definitive, self-updating directory of everything built on [Jev](https://typesafe.ai) — TypeSafe AI's System One model, the first model that answers with typed judgments and calibrated probabilities instead of prose.**

**[English](README.md) · [中文](README.zh.md) · [Français](README.fr.md)**

</div>

<p align="center">
  <a href="https://github.com/hdjekuue/awesome-jev"><img src="https://img.shields.io/github/stars/hdjekuue/awesome-jev?style=social" alt="GitHub stars"></a>
  <a href="https://github.com/hdjekuue/awesome-jev/fork"><img src="https://img.shields.io/github/forks/hdjekuue/awesome-jev?style=social" alt="GitHub forks"></a>
  <img src="https://img.shields.io/github/last-commit/hdjekuue/awesome-jev" alt="last commit">
  <a href="CONTRIBUTING.md"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs welcome"></a>
  <a href="https://github.com/topics/jev"><img src="https://img.shields.io/badge/topic-jev-ff7a45" alt="jev topic"></a>
  <img src="https://img.shields.io/badge/CC0-lightgrey.svg" alt="CC0">
</p>

<p align="center">
  <a href="https://typesafe.ai"><b>TypeSafe AI</b></a> ·
  <a href="https://docs.typesafe.ai"><b>Docs</b></a> ·
  <a href="https://vercel.com/ai-gateway/models/jev"><b>AI Gateway</b></a> ·
  <a href="https://discord.gg/typesafe"><b>Discord</b></a> ·
  <a href="https://github.com/topics/jev"><b><code>jev</code> topic</b></a> ·
  <a href="https://hdjekuue.github.io/awesome-jev/"><b>Website</b></a>
</p>

---

> ### ⭐ Star this list — it's how the next builder finds you
>
> Every entry below was added by a contributor who wanted their project found. GitHub ranks starred lists higher, and **a star is the single highest-leverage thing you can do for the projects listed here.**
>
> <a href="https://github.com/hdjekuue/awesome-jev"><img src="https://img.shields.io/github/stars/hdjekuue/awesome-jev?style=for-the-badge&label=%E2%AD%90%20Star%20%E2%AD%90" alt="Star on GitHub"></a>
>
> **Milestone: 0 → 100 stars.** As we get close, featured entries get pinned at the top of the README and the website. No pay-to-play, no quotas — just community signal about what's actually worth using.
>
> **Built something on Jev?** [Open a PR](CONTRIBUTING.md) (one entry per PR, 3 minutes). Add the [`jev` topic](https://github.com/topics/jev) to your repo and [open an issue](https://github.com/hdjekuue/awesome-jev/issues/new/choose) if you'd rather not — the AI curator will pick it up.

---

## 📖 Table of contents

- [What is Jev?](#what-is-jev) · [Why typed decisions](#why-typed-decisions-matter) · [The directory](#-the-directory) · [How it's curated](#-how-this-list-is-curated) · [FAQ](#-faq) · [Contributing](#-contributing) · [License](#-license)

---

## What is Jev?

Jev is TypeSafe AI's **System One** model. You hand it a `state` plus a set of **typed questions**, evaluated in parallel, and it returns typed answers with per-option probabilities and a confidence value. No prompt engineering, no regex over prose, no parsing failures at 3am.

```ts
import { choice, TypeSafeClient } from "@typesafe-ai/sdk";

const client = new TypeSafeClient();
const res = await client.systemOne({
  state: { document: "I was charged twice. Please fix this ASAP." },
  questions: {
    category: choice("What is this ticket about?", {
      billing: null,
      technical: null,
      other: null,
    }),
  },
});

console.log(res.answers.category.choice);        // "billing"
console.log(res.answers.category.probabilities); // { billing: 0.94, technical: 0.05, other: 0.01 }
```

| | |
| --- | --- |
| **Model** | `jev-latest` |
| **Endpoint** | `POST https://api.typesafe.ai/v1/systemone` |
| **Input** | a `state` + typed `questions`, evaluated in parallel |
| **Output** | typed answers, per-option probabilities, confidence |
| **Latency** | 70–500 ms end to end |
| **Pricing** | $0.042 / MTok input · **output is free** |
| **SDKs** | [JS/TS](https://github.com/typesafe-ai/typesafe-sdk-js) · [Python](https://github.com/typesafe-ai/typesafe-sdk-python) · [AI Gateway](https://vercel.com/ai-gateway/models/jev) · 30+ community clients below |

### The three primitives

| Primitive | You ask | You get back |
| --- | --- | --- |
| **`choice`** | Pick one option from a list | `choice`, `probabilities`, `confidence` |
| **`score`** | Rate the state against a rubric | `score`, `probabilities`, `confidence` |
| **`noul`** | Is this statement true? | `noul` (0–1) |

## Why typed decisions matter

An agent loop is not one hard question — it is **hundreds of small ones**. Which model for this turn? Is this tool call safe? Which skill do I load? Is this context still relevant? Is the answer good enough to stop? Every existing answer is a string you have to parse, and every parse is a place to fail.

Jev turns those into calls you can **threshold, audit, test and bill**:

```ts
// The whole guard, and you can unit-test it.
if (res.answers.risk.choice === "block" && res.answers.risk.confidence > 0.8) {
  return deny("blocked by risk judge");
}
```

That is why the ecosystem above is not a toy list: it is routers that cut inference cost, gates that stop bad tool calls, compaction passes that keep the window clean, judges that catch slop, and guardrails for prompt injection — all in the 70–500 ms budget.

## 📊 By the numbers

| | |
| --- | --- |
| **350+** projects catalogued, refreshed automatically from the GitHub API |
| **90k+** stars tracked across listed repositories |
| **20** categories, from official SDKs to open-model replicas |
| **3** languages — English, 中文, Français |
| **1** data file, so every language can never drift apart |
| **0** API keys — the maintainer AI runs on free open-source models |

## 🔍 Find what you need, fast

- **I want a language SDK** → [🧩 SDKs & Community Clients](#-sdks--community-clients)
- **I want to route between models or agents** → [🚦 Routing & Gateways](#-routing--gateways)
- **I want my agent to use less context** → [🗜️ Context & Compaction](#%EF%B8%8F-context--compaction)
- **I want a browser or computer-use agent** → [🌐 Browser & Computer Use](#%EF%B8%8F-browser--computer-use)
- **I want safety / moderation** → [🛡️ Safety, Moderation & Verification](#%EF%B8%8F-safety-moderation--verification)
- **I want to run it without TypeSafe's API** → [🧠 Open Models & Replicas](#-open-models--replicas)
- **I want to know if it's any good** → [📊 Benchmarks, Evals & Calibration](#-benchmarks-evals--calibration)
- **I'm just starting** → [🧭 Start Here](#-start-here)

> 🤖 **Working with an AI agent?** This list is published as machine-readable data, not just prose. Fetch [`llms.txt`](https://hdjekuue.github.io/awesome-jev/llms.txt) for the index, [`llms-full.txt`](https://hdjekuue.github.io/awesome-jev/llms-full.txt) for every entry as markdown, [`projects.json`](https://hdjekuue.github.io/awesome-jev/projects.json) for structured records, or add it as a skill with [`npx skills add hdjekuue/awesome-jev`](https://skills.sh/hdjekuue/awesome-jev). See [AGENTS.md](AGENTS.md).

---

## 🗂️ The directory

Everything below is generated from [`data/entries.json`](data/entries.json). Stars, licenses and push dates refresh on a schedule via GitHub Actions — a stale row gets corrected on the next run, and every entry is link-checked before it ships.

<!-- entries:start -->

<!-- 352 entries · 335 repos · 93,460 stars · 21 languages · updated 2026-10-03 -->

- [🧭 Start Here](#-start-here) — 16
- [🏛️ Official SDKs & Framework Support](#-official-sdks-framework-support) — 7
- [🤖 Coding Agents](#-coding-agents) — 48
- [🚦 Routing & Gateways](#-routing-gateways) — 10
- [🗜️ Context & Compaction](#-context-compaction) — 6
- [🔍 Code Review & Quality](#-code-review-quality) — 21
- [🌐 Browser & Computer Use](#-browser-computer-use) — 14
- [📱 Mobile & Desktop Automation](#-mobile-desktop-automation) — 4
- [🔎 Search, Reranking & RAG](#-search-reranking-rag) — 13
- [🛡️ Safety, Moderation & Verification](#-safety-moderation-verification) — 14
- [🗄️ Data & Ops](#-data-ops) — 20
- [📦 Applications & Extensions](#-applications-extensions) — 29
- [🧩 SDKs & Community Clients](#-sdks-community-clients) — 32
- [⌨️ Command Line](#-command-line) — 14
- [📊 Benchmarks, Evals & Calibration](#-benchmarks-evals-calibration) — 27
- [🧠 Open Models & Replicas](#-open-models-replicas) — 41
- [🎮 Games, Robotics & Simulation](#-games-robotics-simulation) — 19
- [💹 Finance & Trading](#-finance-trading) — 5
- [🎪 Playgrounds & Demos](#-playgrounds-demos) — 12

## 🧭 Start Here

The spec sheet, the three primitives and the docs — read these before building. _(16 entries)_

| Project | Description | Lang / License | ⭐ | Pushed |
| --- | --- | --- | --- | --- |
| [Introduction](https://docs.typesafe.ai/introduction) | The mental model in two pages: state plus typed questions in, typed answers with probabilities out. | official | — | — |
| [Quick start](https://docs.typesafe.ai/introduction/quickstart) | First request in Python, TypeScript, or curl. | official | — | — |
| [Primitives](https://docs.typesafe.ai/primitives) | Choice, Score, and Noul, and when each one fits. | official | — | — |
| [State](https://docs.typesafe.ai/concepts/state) | How to package what Jev judges, and why less is more. | official | — | — |
| [API reference](https://docs.typesafe.ai/api) | The request and response contract. | official | — | — |
| [Models](https://docs.typesafe.ai/models) | Aliases, current version, price, and rate limits. | official | — | — |
| [Model jaggedness: jev-1.13](https://docs.typesafe.ai/model-jaggedness/jev-1.13) | Known failure modes, straight from the vendor. | official | — | — |
| [System One](https://docs.typesafe.ai/concepts/system-one) | What the category means and how it differs from a chat model. | official | — | — |
| [How to build with System One](https://docs.typesafe.ai/concepts/how-to-build-with-system-one) | Decompose a judgment into atomic questions and keep the control flow in code. | official | — | — |
| [Confidence](https://docs.typesafe.ai/confidence) | What the confidence field means and how to turn it into act, review, or fall back. | official | — | — |
| [Patterns](https://docs.typesafe.ai/patterns) | Speculative fan-out, confidence routing, composite scoring, intent routing. | official | — | — |
| [Use-case map](https://docs.typesafe.ai/concepts/use-case-map) | The vendor's own catalogue of where Jev fits and where it does not. | official | — | — |
| [Cookbooks](https://docs.typesafe.ai/cookbooks/parallel_questions) | Worked recipes, starting with batching many questions into one request; the sidebar has the rest. | official | — | — |
| [Workflow evals](https://evals.typesafe.ai/) | The vendor's benchmark on four workflows, with the caveats printed on the page. | official | — | — |
| [llms.txt](https://docs.typesafe.ai/llms.txt) | Every documentation page as plain Markdown, for feeding to an agent. | official | — | — |
| [Console](https://console.typesafe.ai/) | Waitlist, API keys, and usage. | official | — | — |

## 🏛️ Official SDKs & Framework Support

Maintained by TypeSafe AI, plus the frameworks that ship Jev natively. _(7 entries)_

| Project | Description | Lang / License | ⭐ | Pushed |
| --- | --- | --- | --- | --- |
| [vercel/eve](https://github.com/vercel/eve) | Vercel's agent framework; Jev is the typed judge in its evaluate step. | typescript · apache-2.0 | 5,418 | 2026-09-30 |
| [typesafe-ai/skills](https://github.com/typesafe-ai/skills) | Agent skills for designing questions, building workflows, and evaluating them. | official · mit | 2,469 | 2026-09-12 |
| [vercel-labs/ai-cli](https://github.com/vercel-labs/ai-cli) | The Vercel AI SDK in your terminal, with an evaluate path that runs on Jev. | typescript | 817 | 2026-09-30 |
| [typesafe-ai/system-one-adapter-python](https://github.com/typesafe-ai/system-one-adapter-python) | Same `TypeSafeClient` interface backed by an LLM API, so you can compare Jev against a chat model on identical questions. | official · python · mit | 363 | 2026-09-22 |
| [typesafe-ai/typesafe-sdk-js](https://github.com/typesafe-ai/typesafe-sdk-js) | TypeScript and JavaScript client with answer types inferred from your questions. | official · typescript · mit | 259 | 2026-09-15 |
| [typesafe-ai/typesafe-sdk-python](https://github.com/typesafe-ai/typesafe-sdk-python) | Python client, sync and async. | official · python · mit | 256 | 2026-09-26 |
| [Agent skill](https://docs.typesafe.ai/agent-skill) | How to install the official skill in Claude Code, Cursor, and friends. | official | — | — |

## 🤖 Coding Agents

Routers, tool gates, reviewers, skills and MCP servers for agent harnesses. _(48 entries)_

| Project | Description | Lang / License | ⭐ | Pushed |
| --- | --- | --- | --- | --- |
| [nicobailon/pi-mcp-adapter](https://github.com/nicobailon/pi-mcp-adapter) | Opt-in typed evaluation and semantic search over MCP tool results, behind a per-server data-egress allowlist. | typescript · mit | 1,568 | 2026-09-30 |
| [kerpopule/hermes-jev-skills](https://github.com/kerpopule/hermes-jev-skills) | Hands an agent's small decisions to Jev: which model answers the turn, which skills to load, which passages matter, which turns survive compaction. | python · mit | 918 | 2026-09-29 |
| [gargpratyush/jev-router](https://github.com/gargpratyush/jev-router) | Routes each task to the cheapest Claude model that can handle it. | javascript · mit | 499 | 2026-09-19 |
| [jkudish/jev-mcp](https://github.com/jkudish/jev-mcp) | The first MCP server for Jev, and still the most linked. | javascript · mit | 464 | 2026-09-29 |
| [notque/vexjoy-agent](https://github.com/notque/vexjoy-agent) | Agent toolkit whose `/d` command picks the specialist agent, skill, and pipeline with one Jev call, plus an optional Jev auto-compact plugin. | python · mit | 426 | 2026-09-30 |
| [TianyuCodings/JevHarness](https://github.com/TianyuCodings/JevHarness) | Has an LLM write a task-specific harness that turns observations into Jev questions, then freezes it and improves it from rewards and full execution traces. | python | 400 | 2026-09-21 |
| [itsmostafa/typesafe-mcp](https://github.com/itsmostafa/typesafe-mcp) | Single-binary Go MCP server and CLI that exposes TypeSafe Jev judgments to Claude Desktop, Claude Code and Codex. | go · mit | 337 | 2026-09-30 |
| [miuuyy/Astra-Ares](https://github.com/miuuyy/Astra-Ares) | Has Jev pick the reasoning effort and how long to hold it for a running Codex task, on a patched Codex CLI built from upstream source. | javascript · mit | 293 | 2026-09-23 |
| [0xNatoshi/jev-codex-router](https://github.com/0xNatoshi/jev-codex-router) | Picks model, thinking depth, and speed mode for every Codex turn. | javascript · mit · archived | 278 | 2026-09-22 |
| [kitze/skillbox](https://github.com/kitze/skillbox) | Self-hosted, versioned skills library served over MCP, with Jev recommending which skill to load. | typescript · mit | 255 | 2026-09-19 |
| [DevMortimer/pi-warden](https://github.com/DevMortimer/pi-warden) | Guardrails that steer instead of interrupt: irreversible calls, off-task calls, stuck loops, unverified done claims, about 250 ms each. | typescript · mit | 154 | 2026-09-29 |
| [y0usaf/pi-jev](https://github.com/y0usaf/pi-jev) | A measured tool-call gate plus a `jev_ask` tool for typed answers inside Pi. | typescript · mit | 151 | 2026-09-25 |
| [dbreunig/building-with-jev-skill](https://github.com/dbreunig/building-with-jev-skill) | Skill for writing and improving programs that call Jev. | — | 145 | 2026-09-17 |
| [Dicklesworthstone/skillranker](https://github.com/Dicklesworthstone/skillranker) | Rust CLI and hooks that rank installed skills for the next step using live session context, with abstention. | rust · noassertion | 125 | 2026-09-29 |
| [devagrawal09/jev-code](https://github.com/devagrawal09/jev-code) | Command-line toolkit that coding agents hand judgment-heavy work to, one typed Jev workflow per request. | typescript · mit | 119 | 2026-09-19 |
| [devagrawal09/stanley-code](https://github.com/devagrawal09/stanley-code) | Coding CLI where Jev routes a plain-language request to one deterministic workflow, and that workflow asks Jev fixed-choice questions about the evidence it gathered. | typescript · mit | 119 | 2026-09-19 |
| [fabricioctelles/skills](https://github.com/fabricioctelles/skills) | Agent-skill directory that can score subjective evaluation criteria with Jev. | python · apache-2.0 | 97 | 2026-09-27 |
| [EliaAlberti/jev-rules](https://github.com/EliaAlberti/jev-rules) | Scores your standing rules against each prompt and delivers only the ones that apply, once per session. | javascript · mit | 63 | 2026-09-27 |
| [TheoOliveira/pi-jev](https://github.com/TheoOliveira/pi-jev) | Semantic tool routing and typed decisions as Pi tools. | typescript · mit | 58 | 2026-09-24 |
| [DevMortimer/pi-typesafe](https://github.com/DevMortimer/pi-typesafe) | Batched evaluation tool, terminal playground, and a typed API for Pi extension authors. | typescript · mit | 49 | 2026-09-30 |
| [tacticocc/Jevbridge](https://github.com/tacticocc/Jevbridge) | ACP and MCP adapter that pairs Jev with any LLM for computer use and typed decisions. | typescript · mit | 46 | 2026-09-21 |
| [shantanugoel/ask-jev-skill](https://github.com/shantanugoel/ask-jev-skill) | Lets Hermes and similar agents ask Jev directly. | python · mit | 42 | 2026-09-17 |
| [shitianfang/jev-use](https://github.com/shitianfang/jev-use) | Hands the Claude Code, Codex and pi steps that need no text output to Jev, with a typed escalation contract for everything it should not decide. | javascript · mit | 31 | 2026-09-22 |
| [jomatsu/pi-jev-auto-mode](https://github.com/jomatsu/pi-jev-auto-mode) | Auto-approves bash, write, and edit calls semantically and fails closed when it cannot decide. | typescript · mit | 31 | 2026-09-24 |
| [keeltrace/hermes-jev](https://github.com/keeltrace/hermes-jev) | Typed decisions, ranking, verification, and an opt-in tool gate. | python · mit | 31 | 2026-09-28 |
| [compozy/yoshi](https://github.com/compozy/yoshi) | Context-pruning proxy for Claude Code and Codex, with the savings measured rather than claimed. | typescript · mit | 27 | 2026-09-18 |
| [blakestone-x/jev-mcp](https://github.com/blakestone-x/jev-mcp) | Classify, score, check, match, and screen, with confidence on every answer. | python · mit | 26 | 2026-09-16 |
| [GodsBoy/jev-agent-skill-router](https://github.com/GodsBoy/jev-agent-skill-router) | Confidence-aware skill routing with an abstain path. | python · mit | 24 | 2026-09-16 |
| [Brainwires/jevwire](https://github.com/Brainwires/jevwire) | MCP server, embeddable decision model, and an escalate-only plugin that can make the harness stricter but never looser. | typescript · mit | 22 | 2026-09-21 |
| [valentynkit/jev-belay](https://github.com/valentynkit/jev-belay) | Stop hook that blocks an unverified "done": reads the transcript for evidence and, only when files changed with no passing check since, spends one four-question Jev call; fails open on every error path. | javascript · mit | 20 | 2026-09-20 |
| [anpicasso/hermes-jev-approvals](https://github.com/anpicasso/hermes-jev-approvals) | Approves, denies, or escalates flagged shell commands before they run; vendor-reported speedups. | python · mit | 20 | 2026-09-22 |
| [mejiasd3v/pi-jev-router](https://github.com/mejiasd3v/pi-jev-router) | Automatic model routing for Pi through the Vercel AI Gateway. | javascript · mit | 16 | 2026-09-22 |
| [DECRUX9812/typesafe-skill-router](https://github.com/DECRUX9812/typesafe-skill-router) | Names the one skill worth loading before the model call; stdlib only, about a tenth of a cent per turn. | python · mit | 15 | 2026-09-21 |
| [kubet/azdaja](https://github.com/kubet/azdaja) | Recursive language-model layer for Claude Code, Codex, Gemini and OpenCode that keeps sources local; Jev is an optional leaf for reranking, verification and semantic joins. | python · mit | 14 | 2026-09-21 |
| [HyunjunJeon/pi-quiet-ask](https://github.com/HyunjunJeon/pi-quiet-ask) | Jev as the Pi coding agent's quiet decision layer. | typescript · mit | 12 | 2026-09-18 |
| [harshwasan/pi-jev-sentinel](https://github.com/harshwasan/pi-jev-sentinel) | Checks Pi tool calls, tool outputs, and replies for risky actions and prompt injection, with user approvals, context re-checks, secret scrubbing, and optional task pinning. | typescript · mit | 11 | 2026-09-20 |
| [24601/Augustus](https://github.com/24601/Augustus) | Skill for deciding where a typed judgment belongs at all and what stays in code; a companion to the official skill, not a replacement. | python · mit | 11 | 2026-09-28 |
| [adarshmishra07/jcm-router](https://github.com/adarshmishra07/jcm-router) | Local proxy that picks model and effort per message and leaves the cached main chat alone. | typescript · mit | 9 | 2026-09-17 |
| [AbdelStark/bicameral](https://github.com/AbdelStark/bicameral) | Hybrid harness for Pi: an LLM writes the code, Jev reflexes gate every call as allow, confirm, block, warn, or steer. | typescript · mit | 9 | 2026-09-16 |
| [ajensenwaud/hermes-jev-plugin](https://github.com/ajensenwaud/hermes-jev-plugin) | Four Hermes tools for atomic checks, routing, and rubric scoring; listed in the Hermes plugin catalog. | python · mit | 8 | 2026-09-19 |
| [HyunjunJeon/jev-judgment](https://github.com/HyunjunJeon/jev-judgment) | Sends a coding agent's closed judgments to Jev instead of the chat model. | python · mit | 7 | 2026-09-17 |
| [3clyp50/a0-typesafe-ai](https://github.com/3clyp50/a0-typesafe-ai) | Typed tools and probability cards for Agent Zero. | python · mit | 6 | 2026-09-17 |
| [bestagentkits/jev-skillful](https://github.com/bestagentkits/jev-skillful) | Per-prompt router over skills, MCP servers, agents, and commands, and it measures whether the injection helped. | typescript · mit | 5 | 2026-09-17 |
| [noplan-inc/limpet](https://github.com/noplan-inc/limpet) | A Stop hook that keeps the agent from stopping too early, judged against plain-language rules. | python · mit | 5 | 2026-09-17 |
| [suenot/codex-jev-router](https://github.com/suenot/codex-jev-router) | Uses Jev to select the model and reasoning effort for Codex subagents, with confidence gates and a Sol fallback. | javascript · mit | 5 | 2026-09-27 |
| [legacybridge-tech/pi-typesafe-jev](https://github.com/legacybridge-tech/pi-typesafe-jev) | Pi extension exposing Jev judgments as five Pi tools. | typescript · noassertion | 4 | 2026-09-17 |
| [BYK/jev-mcp](https://github.com/BYK/jev-mcp) | Eval-first MCP server: prototype a question, map it over many items, then measure variants against labeled examples with a threshold sweep. | typescript · mit | 4 | 2026-09-18 |
| [samtay32/jev-system-architect](https://github.com/samtay32/jev-system-architect) | Finds the fuzzy judgment in a system and turns it into small Choice, Score, and Noul primitives. | mit | 3 | 2026-09-17 |

## 🚦 Routing & Gateways

Per-turn model and tool selection, behind a hard deadline. _(10 entries)_

| Project | Description | Lang / License | ⭐ | Pushed |
| --- | --- | --- | --- | --- |
| [BillionsBobby/JevRouter](https://github.com/BillionsBobby/JevRouter) | Models, subagents, skills, MCP tools, and CLIs as one candidate set; Jev picks, the router enforces permissions and risk; reports 44 percent first-five tool-call hits against 24 for DeepSeek on Toolathlon. | typescript · mit | 303 | 2026-09-26 |
| [vinilana/jev-gateway](https://github.com/vinilana/jev-gateway) | Local gateway for Codex and Claude Code that sends the "which tool next" decision to Jev and everything else to your usual model. | typescript · mit | 267 | 2026-09-25 |
| [juspay/neurolink](https://github.com/juspay/neurolink) | TypeScript AI SDK where decide, via Jev, is a peer of generate and stream: one typed-judgment call routes model choice, prunes context, and picks MCP tools. | typescript · mit | 144 | 2026-09-30 |
| [nidhi-singh02/agent-router](https://github.com/nidhi-singh02/agent-router) | Picks Cursor, Claude Code, Codex, or OpenCode plus model and effort for a task, then launches it. | typescript · mit | 99 | 2026-09-27 |
| [yusukebe/hono-jev-router](https://github.com/yusukebe/hono-jev-router) | Route HTTP requests by meaning in Hono. | typescript · mit | 51 | 2026-09-18 |
| [xinyao27/jevonian](https://github.com/xinyao27/jevonian) | Local OpenAI, Anthropic and Responses-compatible proxy that serves one Jev call per turn to pick both the model route and the thinking level, filtering candidates by context window and quota. | typescript · agpl-3.0 | 16 | 2026-09-29 |
| [prismhq/jev-router](https://github.com/prismhq/jev-router) | LLM router on top of LiteLLM. | python · mit | 15 | 2026-09-17 |
| [iamvatsalpatel/tiershift](https://github.com/iamvatsalpatel/tiershift) | Shifts every LLM call to the cheapest model that can handle it, policy in YAML, decision in about 180 ms. | typescript · mit | 4 | 2026-09-28 |
| [FirasSX914/Janus](https://github.com/FirasSX914/Janus) | Measures on your data when Jev beats other models, then routes accordingly. | python · mit | 3 | 2026-09-18 |
| [daviddl9/jev-router](https://github.com/daviddl9/jev-router) | Jev picks the worker tier for each step in OMP and Pi, keeping planning and review on a strong model and bounded work on cheaper ones. | typescript · noassertion | 0 | 2026-09-21 |

## 🗜️ Context & Compaction

Decide what stays in the window before the model ever reads it. _(6 entries)_

| Project | Description | Lang / License | ⭐ | Pushed |
| --- | --- | --- | --- | --- |
| [tamaratran/fast-jev-compaction](https://github.com/tamaratran/fast-jev-compaction) | Replaces the compaction summary with Jev decisions: every tool call and result scored in one request, stale ones dropped, everything kept stays verbatim. | typescript · mit | 7,225 | 2026-09-18 |
| [tamaratran/jev-pruner](https://github.com/tamaratran/jev-pruner) | Trims long Bash output with Jev after the command runs and before the model sees it; short output, errors, and structured formats pass untouched. | typescript · mit | 153 | 2026-09-30 |
| [GhalebDweikat/winnow](https://github.com/GhalebDweikat/winnow) | Judges every tool result before it enters context, so the window fills slower instead of being cleaned later. | python · mit | 100 | 2026-09-30 |
| [IAmUnbounded/save-token-jev-clean](https://github.com/IAmUnbounded/save-token-jev-clean) | Compaction that asks Jev which tool calls still matter and keeps the rest verbatim, with adapters for Claude Code, Codex, OpenCode, and raw API transcripts. | typescript · mit | 76 | 2026-09-18 |
| [joelhooks/pi-fast-jev-compaction](https://github.com/joelhooks/pi-fast-jev-compaction) | The verbatim compaction idea, ported to Pi. | typescript · mit | 14 | 2026-09-18 |
| [Nyarlathoteppppp/pi-heed](https://github.com/Nyarlathoteppppp/pi-heed) | Checks every side-effecting tool call against what you said earlier in the session, so "review only" still holds after compaction. | typescript · mit | 11 | 2026-09-19 |

## 🔍 Code Review & Quality

Judges, linters, coverage gates and review dashboards. _(21 entries)_

| Project | Description | Lang / License | ⭐ | Pushed |
| --- | --- | --- | --- | --- |
| [devagrawal09/jev-review](https://github.com/devagrawal09/jev-review) | Staged code-review workflow with a local dashboard. | typescript · mit | 643 | 2026-09-17 |
| [thruwire/foreman](https://github.com/thruwire/foreman) | Supervises a software factory of agents, with Jev making the go and no-go calls. | python · mit | 619 | 2026-09-28 |
| [lakeday-org/perch](https://github.com/lakeday-org/perch) | Semantic linting: rules in plain language, each file judged by Jev, run locally or in CI. | javascript · mit | 316 | 2026-09-30 |
| [NiazMorshed2007/jev-review](https://github.com/NiazMorshed2007/jev-review) | Local-first MCP plugin for continuous quality review by coding agents. | typescript · mit | 231 | 2026-09-17 |
| [supercorp-ai/supercov](https://github.com/supercorp-ai/supercov) | Code quality and coverage signals for coding agents. | rust · mit | 141 | 2026-09-27 |
| [kyu1204/jgrep](https://github.com/kyu1204/jgrep) | `--diff` gates a PR in CI on a rule written in English, `--tests` lists the test files a diff can affect, and plain `jgrep` greps code by what it does; one Noul per chunk, 16 chunks per request. | typescript · mit | 58 | 2026-09-30 |
| [Alurith/jeff](https://github.com/Alurith/jeff) | Read-only Go CLI that checks files against coded rules such as hidden side effects and weak error handling. | go · apache-2.0 | 38 | 2026-09-20 |
| [devanshbatham/commit-miner](https://github.com/devanshbatham/commit-miner) | Classifies commit diffs and messages: bug fixes, security fixes with CWEs, change types. | rust | 36 | 2026-09-17 |
| [lukstei/slop-grader](https://github.com/lukstei/slop-grader) | Grades text and markdown files for AI slop, grammar, and technical documentation quality, and guides an AI agent to auto-fix violations. | typescript · mit | 32 | 2026-09-24 |
| [valentynkit/jev-commit](https://github.com/valentynkit/jev-commit) | Pre-commit hook: one Jev call judges whether the commit message matches the staged diff, plus debug leftovers, unmentioned work, and a credential belt; warns except on a secret, which it blocks. | python · mit | 13 | 2026-09-19 |
| [frostney/clean-code-review](https://github.com/frostney/clean-code-review) | Every file in a PR judged against Clean Code rules, then reviewed by an LLM. | typescript · mit | 12 | 2026-09-23 |
| [huntedman/JevLint](https://github.com/huntedman/JevLint) | Configurable semantic linting with file-level Noul judgments. | typescript · mit | 12 | 2026-09-20 |
| [doeixd/jev-pref](https://github.com/doeixd/jev-pref) | Turns the preferences in your AGENTS.md into a linter that runs on code changes and reports back to the agent. | javascript · mit | 11 | 2026-09-18 |
| [nozomi-koborinai/jev-spec](https://github.com/nozomi-koborinai/jev-spec) | Checks the code against the requirements in a Markdown spec on every commit and fails the build when the two drift apart. | typescript · mit | 11 | 2026-09-29 |
| [HexyeDEV/JevPR](https://github.com/HexyeDEV/JevPR) | GitHub App that asks Jev whether a pull request is safe to approve or needs a specialist, then maps the verdict to a check run. | python · apache-2.0 | 10 | 2026-09-25 |
| [stratonext/software-factory](https://github.com/stratonext/software-factory) | Runs several coding agents locally with Jev as judge and orchestrator. | python · mit | 9 | 2026-09-30 |
| [raihankhan-rk/diffjury](https://github.com/raihankhan-rk/diffjury) | PR risk router and review coach. | typescript | 8 | 2026-09-22 |
| [cephalization/jev-triage](https://github.com/cephalization/jev-triage) | Pulls large repositories and triages their issues with typed Jev questions. | typescript · mit | 5 | 2026-09-29 |
| [Ramneet-Singh/jevopt](https://github.com/Ramneet-Singh/jevopt) | C/C++ compiler driver that asks Jev whether to inline each discretionary call site, from the LLVM IR and the original source. | python · gpl-3.0 | 4 | 2026-09-21 |
| [allebee/pytest-jev](https://github.com/allebee/pytest-jev) | Pytest plugin that asks Jev whether plain-English claims about a test's text hold, all in one request, and fails the test with each claim's probability unless Jev is at least 80 percent sure. | python · mit | 3 | 2026-09-21 |
| [fatwang2/jev-review-action](https://github.com/fatwang2/jev-review-action) | GitHub Action for submission review and PR classification with Jev, no text-generation model in the loop. | javascript · mit | 2 | 2026-09-20 |

## 🌐 Browser & Computer Use

Jev picks the operation and the DOM element; a small LLM only writes the text. _(14 entries)_

| Project | Description | Lang / License | ⭐ | Pushed |
| --- | --- | --- | --- | --- |
| [browser-use/jev-ultrafast](https://github.com/browser-use/jev-ultrafast) | One request picks both the operation and the target element from an indexed DOM table; a small LLM only writes typed text. Zürich to London booked in 7.1 seconds. | python · mit | 21,495 | 2026-09-30 |
| [awlevin/typesafe-computer-use](https://github.com/awlevin/typesafe-computer-use) | OCR the screen, classify the next action, click; about $0.0002 a step on macOS. | python · mit | 1,097 | 2026-09-29 |
| [wy-coliney/jev-browser-use](https://github.com/wy-coliney/jev-browser-use) | Codex skill and plugin where Jev handles navigation, clicks, and scrolling and Codex keeps typing and verification; reports browser steps 5 to 10 times faster. | javascript · mit | 707 | 2026-09-23 |
| [Sac-Y/Jev-cu](https://github.com/Sac-Y/Jev-cu) | Codex computer use where Jev picks the element, action, completion, and risk from on-screen text, no screenshots sent; Chinese readme. | javascript · mit | 613 | 2026-09-22 |
| [moritzkremb/jev-voice-browser](https://github.com/moritzkremb/jev-voice-browser) | Intent and target decided per spoken word in about 300 ms, often before the sentence ends. | javascript · mit | 371 | 2026-09-21 |
| [jkudish/jev-browser](https://github.com/jkudish/jev-browser) | The first community browser agent on Jev, with a demo GIF. | javascript · mit | 297 | 2026-09-29 |
| [YUTA-fywoo/jev-gui-delegate](https://github.com/YUTA-fywoo/jev-gui-delegate) | Runs a delegated GUI task for Codex through the real Chrome session or Windows UI Automation, with Jev picking the control at each step. | python | 131 | 2026-09-27 |
| [socai-io/jev-social](https://github.com/socai-io/jev-social) | Lets Jev choose each read-only social research step while socai runs it in a real Chrome session and streams inspectable Instagram, TikTok, or LinkedIn evidence into a report. | javascript · mit | 128 | 2026-09-30 |
| [savka777/jev-use](https://github.com/savka777/jev-use) | Voice and typed computer use for macOS: Jev picks the next on-screen action from the Accessibility tree, with no screenshots. | swift · mit | 112 | 2026-09-21 |
| [Ying-Kai-Liao/jev-browser](https://github.com/Ying-Kai-Liao/jev-browser) | An LLM plans, Jev decides; library, CLI, and MCP server. | javascript · mit | 94 | 2026-09-29 |
| [hqman/JevScout](https://github.com/hqman/JevScout) | Job-hunting skill that drives Chrome over CDP and has Jev score every link and listing. | python | 38 | 2026-09-18 |
| [romaluev/jev-ego](https://github.com/romaluev/jev-ego) | Browser agent that spends one Jev request per step to pick the action. | typescript · noassertion | 17 | 2026-09-17 |
| [tontoko/jev-browser](https://github.com/tontoko/jev-browser) | One grounded Jev and Playwright core behind a typed SDK, a persistent CLI, and an MCP server. | javascript · apache-2.0 | 11 | 2026-09-30 |
| [imanshu03/jev-browser-use](https://github.com/imanshu03/jev-browser-use) | Runs browser tasks from a plain-language instruction over CDP or Vercel's agent-browser, with Jev selecting operations and targets and code checking confidence before it acts. | typescript | 0 | 2026-09-27 |

## 📱 Mobile & Desktop Automation

Driving phones, IM clients and native UIs without hooking or patching. _(4 entries)_

| Project | Description | Lang / License | ⭐ | Pushed |
| --- | --- | --- | --- | --- |
| [droidrun/mobile-jev](https://github.com/droidrun/mobile-jev) | The same loop on a real Android phone; nine Uber actions in 21 seconds in the demo. | javascript · mit | 426 | 2026-09-17 |
| [ainame/swift-typesafe](https://github.com/ainame/swift-typesafe) | Swift 6.4 SDK following the Python SDK's API, on Apple platforms and Linux. | swift · mit | 16 | 2026-09-23 |
| [friedjof/jev-mobile](https://github.com/friedjof/jev-mobile) | Android sub-agent over USB running observe, normalize, decide, mutate, verify, with Jev deciding. | python · mit | 8 | 2026-09-18 |
| [xinwang-nwpu/jev-mobile](https://github.com/xinwang-nwpu/jev-mobile) | Android automation where one Jev request picks both the action and the target element from the accessibility tree, executed over ADB. | python · mit | 3 | 2026-09-21 |

## 🔎 Search, Reranking & RAG

Query understanding, source selection, reranking and semantic SQL. _(13 entries)_

| Project | Description | Lang / License | ⭐ | Pushed |
| --- | --- | --- | --- | --- |
| [superagents-lab/jev-search](https://github.com/superagents-lab/jev-search) | Source selection, query understanding, and relevance ranking for web search. | typescript · mit | 493 | 2026-09-20 |
| [jexp/neo4jev](https://github.com/jexp/neo4jev) | Walks a Neo4j graph by classifying neighbouring relationships. | jupyter notebook · mit | 154 | 2026-09-18 |
| [uehaj/jev-semgrep](https://github.com/uehaj/jev-semgrep) | Greps by meaning instead of by regex: every line gets a probability from Jev, and meanings combine with AND, OR, and NOT. | javascript · noassertion | 145 | 2026-09-30 |
| [ellipsis-dev/blink](https://github.com/ellipsis-dev/blink) | Codebase search where Jev scores the candidates. | typescript | 93 | 2026-09-16 |
| [kbhuw/jev-sift](https://github.com/kbhuw/jev-sift) | MCP tool that scores a batch of files, URLs, or snippets for relevance so the agent opens only what matters. | javascript | 48 | 2026-09-18 |
| [hev/reranker](https://github.com/hev/reranker) | Jev as a calibrated reranker: one call, up to 30 documents, a probability per document. | python · apache-2.0 | 15 | 2026-09-17 |
| [reachjalil/jev-tree](https://github.com/reachjalil/jev-tree) | Recursive choice over a taxonomy, past the 255-option cap. | typescript · mit | 10 | 2026-09-18 |
| [WiktorB2004/llama-index-jev](https://github.com/WiktorB2004/llama-index-jev) | LlamaIndex reranker and router, cheaper than an LLM judge. | python · mit | 9 | 2026-09-25 |
| [kylemclaren/jev-search](https://github.com/kylemclaren/jev-search) | A shadcn/ui registry block: keyword hits on the first keystroke, re-ranked by Jev a moment later, and keyword order stands if the call fails. | typescript · mit | 9 | 2026-09-23 |
| [AkashPriyadarshii/jev-scout](https://github.com/AkashPriyadarshii/jev-scout) | Rust CLI and MCP server that finds real, maintained repos and crates for a plain-language request, with Jev scoring the candidates. | rust · mit | 6 | 2026-09-30 |
| [kylemclaren/jevpdf](https://github.com/kylemclaren/jevpdf) | Searches a PDF by meaning in the browser: pdf.js extracts the lines locally, Jev answers one Noul per line in batches of 16, and matching lines light up page by page, ranked by probability. | typescript · mit | 5 | 2026-09-23 |
| [mttrbrts/jev-folio-recursive-classifier](https://github.com/mttrbrts/jev-folio-recursive-classifier) | Classifies OCR'd legal agreements through the FOLIO Document Types ontology with recursive Jev Choices, beam search, confidence-gated leaf stopping, and context-length benchmarking. | python · apache-2.0 | 1 | 2026-09-19 |
| [liou666/senseek](https://github.com/liou666/senseek) | Browser extension that searches the page you are reading by meaning, in a Ctrl+F style box, with your own key and no backend. | javascript | 0 | 2026-09-21 |

## 🛡️ Safety, Moderation & Verification

Guardrails, prompt-injection checks, judges that abstain. _(14 entries)_

| Project | Description | Lang / License | ⭐ | Pushed |
| --- | --- | --- | --- | --- |
| [leepokai/jev-guard](https://github.com/leepokai/jev-guard) | Auto mode for Claude Code, Codex, Cursor, Gemini CLI, Pi, and OpenCode: risk-scores each tool call as deny, ask, or allow and flags prompt injection in results. | javascript · mit | 48 | 2026-09-28 |
| [brainstormity/Jev-Moderation-Bot](https://github.com/brainstormity/Jev-Moderation-Bot) | Chat moderation with editable rules. | python · mit | 48 | 2026-09-22 |
| [DanRWilloughby/snifftest](https://github.com/DanRWilloughby/snifftest) | Prose linter for AI writing tells: countable rules plus one judgment model. | typescript · mit | 34 | 2026-09-18 |
| [luantak/is-malicious](https://github.com/luantak/is-malicious) | Scans a codebase for hidden or data-stealing behavior before you run it; a clean report is not proof, and it says so. | typescript · mit | 33 | 2026-09-23 |
| [MarissaFamularo/citation-verifier](https://github.com/MarissaFamularo/citation-verifier) | Does the cited paper support the sentence citing it? Claude finds the quote, Jev scores it, a human decides. | javascript · mit | 11 | 2026-09-17 |
| [scale-venture-partners/riff](https://github.com/scale-venture-partners/riff) | Ruff-style rule codes for writing. | python · mit | 7 | 2026-09-29 |
| [caiovicentino/jev-shield](https://github.com/caiovicentino/jev-shield) | Semantic MCP firewall that screens every tool call, result, and description; reports 94 percent block recall at about $0.00002 a check. | javascript · mit | 4 | 2026-09-17 |
| [noelzappy/tripwire](https://github.com/noelzappy/tripwire) | AI SDK middleware and proxy that runs seven Jev checks on every LLM response before the user sees it; no accuracy numbers yet, and it says so. | typescript · mit | 4 | 2026-09-18 |
| [teyhouse/jev-secret-detection](https://github.com/teyhouse/jev-secret-detection) | Measures how well Jev spots real credentials in file snippets, with the hard config-shaped cases scored separately. | python | 3 | 2026-09-18 |
| [santos-sanz/jev-audio-beeper](https://github.com/santos-sanz/jev-audio-beeper) | Low-latency audio censorship proof of concept: Jev typed decisions drive ffmpeg. | typescript | 3 | 2026-09-17 |
| [asfarsadewa/human-compiler](https://github.com/asfarsadewa/human-compiler) | Paste text, get diagnostics, like a compiler for prose. | typescript · mit | 2 | 2026-09-17 |
| [DansiDanutz/fake-real-jev](https://github.com/DansiDanutz/fake-real-jev) | Checks claims against cited excerpts with Jev in an English and Romanian fact-checking site, with a public integration example and a closed-source full application. | javascript · mit | 1 | 2026-09-26 |
| [paulgoodchild/SkillsCheck](https://github.com/paulgoodchild/SkillsCheck) | Sends an agent skill's text to Jev before installation and returns a verdict with category scores, without loading the skill into the agent's context; the submitted text is not redacted for secrets. | javascript | 0 | 2026-09-21 |
| [hteariH/stopspam-jev-bot](https://github.com/hteariH/stopspam-jev-bot) | Telegram bot that removes spam and scam messages from group chats on calibrated-confidence classification. | python | 0 | 2026-09-21 |

## 🗄️ Data & Ops

Postgres extensions, semantic SQL and telemetry pipelines that call Jev. _(20 entries)_

| Project | Description | Lang / License | ⭐ | Pushed |
| --- | --- | --- | --- | --- |
| [kyotofin/tax-doc-classifier](https://github.com/kyotofin/tax-doc-classifier) | One request per page picks among 261 IRS forms and seven page kinds; reports 100 percent on its corpus at $0.001 a page, 34 times cheaper than the LLM pipeline it replaced. | typescript · apache-2.0 | 484 | 2026-09-29 |
| [realZachi/pg-jev](https://github.com/realZachi/pg-jev) | PostgreSQL extension that answers plain-language questions about your tables. | shell · noassertion | 381 | 2026-09-18 |
| [AgriciDaniel/jev-seo](https://github.com/AgriciDaniel/jev-seo) | Crawls a site, checks it against 52 SEO rules, has Jev judge every page, and writes PDF, spreadsheet, and Markdown reports. | python · mit | 266 | 2026-09-22 |
| [AkashPriyadarshii/jev-curate](https://github.com/AkashPriyadarshii/jev-curate) | Sifts Parquet and JSONL training data at more than 1,500 rows a second. | rust · mit | 92 | 2026-09-30 |
| [giuliosmall/pg_typesafe](https://github.com/giuliosmall/pg_typesafe) | Pre-alpha PostgreSQL extension for categorical classification with Jev. | c · mit | 88 | 2026-09-24 |
| [AboveColin/HA-Jev](https://github.com/AboveColin/HA-Jev) | Home Assistant integration: ask a question about your house, get a probability, choice, or score as an entity. | python · mit | 69 | 2026-09-30 |
| [choxos/jev-reviewer](https://github.com/choxos/jev-reviewer) | Asks a clinical trial report for systematic-review data by voice, text, or a questions file; every answer is a verbatim quote with its file and place. | javascript · mit | 38 | 2026-09-19 |
| [chenmingtang830/jevgraph](https://github.com/chenmingtang830/jevgraph) | Parses PDF, DOCX, PPTX, or text locally, then asks Jev one closed-set relation question per candidate entity pair and exports a graph with per-edge probabilities and page evidence to JSON, CSV, or Neo4j. | python · apache-2.0 | 31 | 2026-09-20 |
| [colliber/duckdb-jev](https://github.com/colliber/duckdb-jev) | DuckDB extension that asks a question of every row and returns a real SQL type. | c++ · mit | 28 | 2026-09-18 |
| [chopratejas/invalidate](https://github.com/chopratejas/invalidate) | Gives every stored agent memory a lease and asks Jev whether new evidence ends it; [live demo](https://invalidate-playground.vercel.app). | python · apache-2.0 | 23 | 2026-09-21 |
| [reachjalil/jevlogs](https://github.com/reachjalil/jevlogs) | Scores OpenTelemetry log signal before paying for LLM analysis. | javascript · mit | 17 | 2026-09-22 |
| [kylemclaren/jevql](https://github.com/kylemclaren/jevql) | Semantic SQL for PostgreSQL, with Jev answering the predicates. | go · mit | 15 | 2026-09-19 |
| [collapseindex/jev-ultralightspeed](https://github.com/collapseindex/jev-ultralightspeed) | Packs 32 items into one request for bulk classification and calibrates the confidence cut that sends the least-sure rows to a person, reporting 533 items a second at 89.2 percent agreement with human labels. | python · noassertion | 12 | 2026-09-22 |
| [keltokhy/jlink](https://github.com/keltokhy/jlink) | Links records across two datasets from a match rule written in plain English, from Python, the shell, Stata, or R, and reports F1 0.73 against 0.69 for tuned string matching on NBER patent assignees to Compustat. | python · mit | 7 | 2026-09-28 |
| [EugeneBoondock/jevsql](https://github.com/EugeneBoondock/jevsql) | SQL with natural-language predicates over SQLite: filter, rank, and classify rows by meaning, batched and cost-guarded. | javascript · mit | 6 | 2026-09-19 |
| [Foadsf/jev-for-engineers](https://github.com/Foadsf/jev-for-engineers) | Eight small examples from mechanical and electrical engineering: CAD routing, FEM triage, DFM screening, BOM alignment. | python · mit | 6 | 2026-09-16 |
| [Query-farm/vgi-typesafe](https://github.com/Query-farm/vgi-typesafe) | DuckDB worker that exposes choice, noul, and score as lateral-joinable table functions in SQL. | python · mit | 5 | 2026-09-19 |
| [mgaitan/sqlite-jev](https://github.com/mgaitan/sqlite-jev) | Adds Jev Noul, Choice, and Score judgments to SQLite through a loadable C extension and Python wrapper, with scalar functions and batched virtual-table queries. | c | 4 | 2026-09-18 |
| [opaielsheikh/typesafe-migration-guard](https://github.com/opaielsheikh/typesafe-migration-guard) | Reviews database migrations for safety before they run. | typescript | 3 | 2026-09-17 |
| [ddfeyes/jev-mode](https://github.com/ddfeyes/jev-mode) | Ticket triage and file tagging on a typed-judgment model; reports 78 percent fewer tokens and 96.1 percent accuracy against a 93.7 percent baseline. | python · mit | 3 | 2026-09-18 |

## 📦 Applications & Extensions

End-user tools people actually open every day. _(29 entries)_

| Project | Description | Lang / License | ⭐ | Pushed |
| --- | --- | --- | --- | --- |
| [anishfn/shapeshift](https://github.com/anishfn/shapeshift) | Turns one text box into the matching card as you type, judged by a single parallel Jev call, with a keyword fallback when no key is set. | typescript · mit | 752 | 2026-09-23 |
| [kitze/unclutter](https://github.com/kitze/unclutter) | Browser extension that removes page clutter with reusable template rules. | typescript · mit | 341 | 2026-09-18 |
| [FerryCorleone/crush-monitor](https://github.com/FerryCorleone/crush-monitor) | Reads a chat log locally and labels every message with the three likeliest of twelve emotions and thirty-five intents. | typescript · mit | 262 | 2026-09-25 |
| [monteduro/killmyidea](https://github.com/monteduro/killmyidea) | Describe your startup idea; Jev says kill it, fix it, or ship it. | typescript | 244 | 2026-09-24 |
| [usenotra/notra](https://github.com/usenotra/notra) | Turns work into content, with Jev deciding what is worth posting. | typescript · agpl-3.0 | 226 | 2026-09-30 |
| [wquguru/dasheng](https://github.com/wquguru/dasheng) | Read English aloud and see it scored: streaming ASR listens, Jev judges word by word, and the total is arithmetic in code. | javascript | 144 | 2026-09-20 |
| [trungdq88/youtube-sponsor-detection](https://github.com/trungdq88/youtube-sponsor-detection) | Chrome extension that finds sponsor reads from the transcript or live audio and jumps past them; code owns every timestamp, under a cent an hour in transcript mode. | javascript | 109 | 2026-09-18 |
| [kevinbadi/jev-voice](https://github.com/kevinbadi/jev-voice) | Talk to macOS: local whisper.cpp transcribes, one fan-out Jev call picks the action and its typed arguments, and code runs it. | python · mit | 106 | 2026-09-23 |
| [w3cj/jev-chat](https://github.com/w3cj/jev-chat) | Chat-shaped command bar where Jev picks the tool, the arguments, and the reply shape, and code builds the answer from the tools' own data, so no model writes the text. | typescript · mit | 105 | 2026-09-18 |
| [ChetasLua/jevmeter](https://github.com/ChetasLua/jevmeter) | Puts a live meter on any video: every sentence scored on five questions, rendered as a 16:9 edit, a whole debate for about two cents. | python · mit | 103 | 2026-09-17 |
| [fazlerocks/jevmail](https://github.com/fazlerocks/jevmail) | Read-only Gmail triage: three Jev questions per message sort it into one of five trays with an urgency score. | typescript · mit | 92 | 2026-09-19 |
| [realZachi/typesafe-adblock](https://github.com/realZachi/typesafe-adblock) | Chrome extension that asks "is this element an ad?" per DOM node; a toy, and it says so. | javascript · mit | 88 | 2026-09-17 |
| [AkashPriyadarshii/jev-seo](https://github.com/AkashPriyadarshii/jev-seo) | Rust CLI and MCP server for SEO and GEO checks over DuckDuckGo results, scored by Jev. | rust · mit | 86 | 2026-09-30 |
| [RafalWilinski/vibecheck](https://github.com/RafalWilinski/vibecheck) | Vibe-check your X post before you hit publish. | javascript | 49 | 2026-09-20 |
| [parth-kp/jev-mail-classifier](https://github.com/parth-kp/jev-mail-classifier) | Config-driven inbox classification that tags, moves, flags, and notifies, through TypeSafe directly or OpenRouter. | python · mit | 19 | 2026-09-20 |
| [kevthetech143/super-jev](https://github.com/kevthetech143/super-jev) | Small harness connecting evidence, Jev judgments, permitted actions, and verified outcomes. | python · mit | 14 | 2026-09-30 |
| [manifoldor/xtags](https://github.com/manifoldor/xtags) | Labels every post in your X timeline with what it wants you to do. | javascript · mit | 12 | 2026-09-27 |
| [gtaras7/typesafe-jev](https://github.com/gtaras7/typesafe-jev) | Jev experiments starting with a local CV-screening workbench, each with its own measured results. | typescript · mit | 10 | 2026-09-27 |
| [harshil1712/slidepilot](https://github.com/harshil1712/slidepilot) | Voice-driven auto-advance for Slidev on Cloudflare Agents. | typescript · mit | 9 | 2026-09-22 |
| [valentynkit/jev.nvim](https://github.com/valentynkit/jev.nvim) | Neovim plugin: ask the buffer a plain-language question, Treesitter splits it into functions, Jev scores each one, and the answers land in quickfix ranked by probability. | lua · mit | 9 | 2026-09-19 |
| [andrelandgraf/safer-with-jev](https://github.com/andrelandgraf/safer-with-jev) | Neon Function proxy for the Neon AI Gateway with Jev routing in front. | typescript | 6 | 2026-09-18 |
| [valentynkit/jev-skip](https://github.com/valentynkit/jev-skip) | Browser extension that reads the caption track and paints a per-segment sponsor probability on the seek bar, with no crowd database. | typescript · mit | 6 | 2026-09-19 |
| [chris-wozniczek/jev-voice-control](https://github.com/chris-wozniczek/jev-voice-control) | Menu-bar Swift app turning spoken commands into Jev typed decisions and macOS actions. | swift · mit | 5 | 2026-09-21 |
| [hellogumbo/should-ai-kill-us-all](https://github.com/hellogumbo/should-ai-kill-us-all) | Asks Jev the question every ten minutes, using the actual headlines. | javascript · cc0-1.0 | 4 | 2026-09-18 |
| [sriganesh/jevibe-check](https://github.com/sriganesh/jevibe-check) | Live tone labels for Bluesky posts and drafts. | javascript · mit | 3 | 2026-09-17 |
| [phureewat29/jev-got](https://github.com/phureewat29/jev-got) | Game of Thrones roleplay where a story model writes each scene and Jev answers five typed questions that drive the header, soundtrack, art, and next prompt. | typescript | 3 | 2026-09-19 |
| [hazlema/jev-riffs](https://github.com/hazlema/jev-riffs) | Mines repeating motifs from a MIDI melody, scores every candidate in one batched Jev call, and highlights and plays the winner on a piano roll; on an orchestral Swan Lake the top motif is the swan theme. | typescript · mit | 3 | 2026-09-25 |
| [thenewpotato/privacy-facts](https://github.com/thenewpotato/privacy-facts) | Turns privacy policies into nutrition-style labels with plain-language answers, Jev confidence scores, and suggested source clauses. | javascript · mit | 2 | 2026-09-18 |
| [0xShin0221/openpoke-meets-jev](https://github.com/0xShin0221/openpoke-meets-jev) | OpenPoke fork that moves email screening, a tool-call guardrail, and search reranking onto Jev, with an A/B against the Sonnet call it replaced and an adversarial run on the injection gate. | python · mit | 1 | 2026-09-20 |

## 🧩 SDKs & Community Clients

Unofficial clients for the languages without a first-party SDK. _(32 entries)_

| Project | Description | Lang / License | ⭐ | Pushed |
| --- | --- | --- | --- | --- |
| [pithings/advocaat](https://github.com/pithings/advocaat) | Small TypeScript client for asking questions about your own data. | typescript · mit | 97 | 2026-09-18 |
| [milvus-io/milvus-model](https://github.com/milvus-io/milvus-model) | Reranker package whose Jev adapter sends every candidate document as a Noul question in one request, sorts by the returned probabilities, and keeps original indices; shipped in the v0.3.4 release. | python · apache-2.0 | 61 | 2026-09-23 |
| [obie/ruby_decision_model](https://github.com/obie/ruby_decision_model) | Ruby client for decision models with OpenRouter and TypeSafe providers behind one interface, stdlib only. | ruby · mit | 52 | 2026-09-18 |
| [dannote/jev](https://github.com/dannote/jev) | Elixir client built for OTP: reply to Jev from a GenServer and pattern match on the answer. | elixir · mit | 35 | 2026-09-26 |
| [kieranklaassen/ruby_llm-typesafe](https://github.com/kieranklaassen/ruby_llm-typesafe) | TypeSafe as a structured-output provider for RubyLLM 2. | ruby · mit | 19 | 2026-09-29 |
| [Twister915/typesafe-ai](https://github.com/Twister915/typesafe-ai) | Rust client with async and blocking backends and observable retries. | rust · apache-2.0 | 14 | 2026-09-16 |
| [saibimajdi/typesafeai-dotnet-sdk](https://github.com/saibimajdi/typesafeai-dotnet-sdk) | Community .NET SDK with typed Noul, Choice, and Score questions. | c# · mit | 13 | 2026-09-29 |
| [Premo-Cloud/typesafe-sdk-java](https://github.com/Premo-Cloud/typesafe-sdk-java) | Unofficial Java client for the TypeSafe System One API, calling Choice, Score and Noul questions over HTTP. | java · mit | 11 | 2026-09-25 |
| [pambrose/jev4k](https://github.com/pambrose/jev4k) | Kotlin DSL and client. | kotlin · apache-2.0 | 11 | 2026-09-28 |
| [Tangerg/typesafe-sdk-go](https://github.com/Tangerg/typesafe-sdk-go) | Go SDK with no third-party dependencies. | go · mit | 10 | 2026-09-19 |
| [jomatsu/zod-jev](https://github.com/jomatsu/zod-jev) | Zod 4 schemas with semantic rules: shape checks stay in Zod, meaning checks go to Jev in one request and come back as Zod issues. | typescript · mit | 9 | 2026-09-17 |
| [joshmn/typesafe-sdk](https://github.com/joshmn/typesafe-sdk) | Unofficial Ruby client for the TypeSafe AI API, returning typed answers with probabilities instead of parsed prose. | ruby · mit | 8 | 2026-09-26 |
| [inanna-malick/jev-dsl](https://github.com/inanna-malick/jev-dsl) | Haskell DSL with typed packets and inferred answer types. | haskell · mit | 8 | 2026-09-18 |
| [gilljon/typesafe-ai-rs](https://github.com/gilljon/typesafe-ai-rs) | Independent async and blocking Rust SDK. | rust · mit | 7 | 2026-09-17 |
| [Gaurav-Gosain/jev-go](https://github.com/Gaurav-Gosain/jev-go) | Go client that returns typed judgments and probabilities. | go · mit | 6 | 2026-09-16 |
| [jamesward/zio-typesafe-ai](https://github.com/jamesward/zio-typesafe-ai) | Scala client on ZIO. | scala · apache-2.0 | 6 | 2026-09-23 |
| [Stumble/jev-go](https://github.com/Stumble/jev-go) | Community Go SDK for TypeSafe Jev / System One, covering typed Choice, Score and Noul questions. | go · mit | 6 | 2026-09-18 |
| [nshkrdotcom/typesafe_sdk](https://github.com/nshkrdotcom/typesafe_sdk) | Elixir port of the TypeScript AI SDK with a TypeSafe provider. | elixir · mit | 6 | 2026-09-20 |
| [alterhq/typesafe-sdk-swift](https://github.com/alterhq/typesafe-sdk-swift) | Unofficial Swift SDK for the TypeSafe AI API, wrapping typed questions and answers in Swift types. | swift · mit | 5 | 2026-09-15 |
| [zhirschtritt/typesafe-go](https://github.com/zhirschtritt/typesafe-go) | Idiomatic Go SDK for the TypeSafe API. | go · mit | 4 | 2026-09-29 |
| [Butochnikov/laravel-typesafe-jev](https://github.com/Butochnikov/laravel-typesafe-jev) | Laravel integration with typed responses, async requests, and testing fakes. | php · mit | 4 | 2026-09-17 |
| [Hawxy/TypeSafeAI.Net](https://github.com/Hawxy/TypeSafeAI.Net) | Unofficial .NET SDK for the TypeSafe AI platform, usable from any .NET application. | c# · apache-2.0 | 4 | 2026-09-19 |
| [mateonunez/jod](https://github.com/mateonunez/jod) | Zod-style schemas over Jev: validate the state locally, then project typed answers. | typescript · mit | 4 | 2026-09-17 |
| [GenieRobot/typesafe-ai-rails](https://github.com/GenieRobot/typesafe-ai-rails) | Rails integration built on the community Ruby gem. | ruby · mit | 4 | 2026-09-16 |
| [steven-shoemaker/hunch](https://github.com/steven-shoemaker/hunch) | Turns Choice, Score, and Noul questions into Python functions over lists and DataFrames, with deduplication, caching, escalation of unsure rows to an LLM held to the same labels, and a TypeScript port on npm as hunch-jev. | python · mit | 4 | 2026-09-22 |
| [AboveColin/jevclient](https://github.com/AboveColin/jevclient) | Async Python client, probabilities and choices out, no prose to parse. | python · mit | 3 | 2026-09-21 |
| [Butochnikov/typesafe-sdk-php](https://github.com/Butochnikov/typesafe-sdk-php) | PHP client with sync calls, Guzzle promises, and PSR-3 logging. | php · mit | 3 | 2026-09-17 |
| [AbdelStark/s1-rs](https://github.com/AbdelStark/s1-rs) | Turns Rust enums and structs into Choice, Score, and Noul questions with compile-time-checked, confidence-gated answers. | rust · mit | 2 | 2026-09-16 |
| [AbdelStark/typesafe-rs](https://github.com/AbdelStark/typesafe-rs) | Latency-first Rust client, on crates.io. | rust · mit | 2 | 2026-09-16 |
| [DomMonte/n8n-nodes-typesafe-ai](https://github.com/DomMonte/n8n-nodes-typesafe-ai) | n8n community node for yes/no, choice, and score questions. | typescript · mit | 1 | 2026-09-21 |
| [kunobi-ninja/kunobi-jev](https://github.com/kunobi-ninja/kunobi-jev) | Rust client for the System One API. | rust · apache-2.0 | 1 | 2026-09-24 |
| [bariskisir/JevSharp](https://github.com/bariskisir/JevSharp) | .NET 10 SDK for Jev decisions through TypeSafe, OpenRouter, Vercel AI Gateway, and compatible endpoints. | c# · mit | 0 | 2026-09-24 |

## ⌨️ Command Line

Call Jev from a shell, no SDK required. _(14 entries)_

| Project | Description | Lang / License | ⭐ | Pushed |
| --- | --- | --- | --- | --- |
| [dzhng/jevgrep](https://github.com/dzhng/jevgrep) | Finds the files, declarations, and verbatim excerpts a coding agent needs by asking Jev which declarations answer a plain-language question about the repo. | typescript · mit | 1,853 | 2026-09-29 |
| [dorkitude/webctl](https://github.com/dorkitude/webctl) | Searches the web for an agent and has Jev score and dedupe results and page chunks, so only the relevant text reaches the model. | go · mit | 150 | 2026-09-23 |
| [keltokhy/jgrep](https://github.com/keltokhy/jgrep) | Prints the lines that fit a plain-English description, streaming from `tail -f` under a spend cap, and reports F1 0.91 on SMS spam against 0.72 for a keyword grep. | python · mit | 132 | 2026-09-28 |
| [mrnugget/jev-shell-history](https://github.com/mrnugget/jev-shell-history) | Fish-style zsh history suggestions, ranked by Jev. | typescript | 116 | 2026-09-18 |
| [sharziki/semdecide](https://github.com/sharziki/semdecide) | Typed semantic decisions for Unix pipelines and CI. | python · mit | 74 | 2026-09-16 |
| [shiftynick/jev-axi](https://github.com/shiftynick/jev-axi) | Shell verbs for agents and humans: pick, rate, check, rank, triage, guard. | typescript · mit | 26 | 2026-09-24 |
| [Nasrallah-AL/jev-cli](https://github.com/Nasrallah-AL/jev-cli) | npm CLI with the key in the OS keychain; typed judgments from the shell. | typescript · mit | 23 | 2026-09-27 |
| [tumf/jev-cli](https://github.com/tumf/jev-cli) | Dependency-free Python CLI wrapping Choice, Score, and Noul. | python · mit | 14 | 2026-09-23 |
| [cristianoliveira/jeq](https://github.com/cristianoliveira/jeq) | Pipes and composes Jev judgments over JSON and NDJSON with map, reduce, rank, and rate, then applies policy through an explicit offline gate. | go · mit | 10 | 2026-09-27 |
| [sufianetaouil/every](https://github.com/sufianetaouil/every) | Ask a yes/no question of every function in a codebase; grep whose pattern is a question. | python · mit | 8 | 2026-09-17 |
| [y0usaf/typesafe-cli](https://github.com/y0usaf/typesafe-cli) | Noul, choice, and score answers as numbers from the shell. | typescript · mit | 5 | 2026-09-19 |
| [jtsang4/jev-cli](https://github.com/jtsang4/jev-cli) | Typed questions in, structured JSON answers out. | typescript · mit | 4 | 2026-09-18 |
| [jexp/watfile](https://github.com/jexp/watfile) | Sorts PDFs and text files into category folders, one Jev Choice per document, with a local Laya backend as the alternative. | python | 2 | 2026-09-21 |
| [allebee/jevgrep](https://github.com/allebee/jevgrep) | Filters log lines and other text streams by meaning, one Noul per line in micro-batches, streaming from `tail -f` with grep's flags and exit codes. | python · mit | 1 | 2026-09-21 |

## 📊 Benchmarks, Evals & Calibration

Measure it before you trust it. _(27 entries)_

| Project | Description | Lang / License | ⭐ | Pushed |
| --- | --- | --- | --- | --- |
| [sutro-sh/jev-align](https://github.com/sutro-sh/jev-align) | Finds the examples a Jev function is least sure about, asks you to label them, and improves the function with GEPA. | python · apache-2.0 | 301 | 2026-09-20 |
| [fstandhartinger/jevbench](https://github.com/fstandhartinger/jevbench) | Benchmark for Jev-class decision models: bounded rubric in, typed answer with a probability per option out, with cascade and committee experiments reported separately. | python · mit | 186 | 2026-09-29 |
| [vinilana/jev-eval-agent](https://github.com/vinilana/jev-eval-agent) | Personal-assistant agent with 100 mocked tools, measuring how many steps a Jev-gated agent needs. | html | 107 | 2026-09-17 |
| [openlayer-ai/jevals](https://github.com/openlayer-ai/jevals) | Runs a trace's agent, quality, and security evals as one batch of typed Jev questions instead of separate LLM-judge calls. | python · mit | 97 | 2026-09-24 |
| [pinecone-io/cultivar](https://github.com/pinecone-io/cultivar) | Pinecone's skill-testing CLI, with a Jev grading backend it reports at about 30 times cheaper than the LLM grader. | python · mit | 41 | 2026-09-18 |
| [AbdelStark/jev-benchmarks](https://github.com/AbdelStark/jev-benchmarks) | Probability-aware evaluation for typed decision models: calibration, selective risk, latency, reproducible. | python · apache-2.0 | 21 | 2026-09-17 |
| [AntonioCoppe/jev-harness](https://github.com/AntonioCoppe/jev-harness) | Confidence gates, shadow mode, recipes, and evals; reports Claude CLI at 48.9 s against Jev at 1.3 s on the same row-filter job. | typescript · mit | 16 | 2026-09-25 |
| [abhixhek/jevcal](https://github.com/abhixhek/jevcal) | Stop guessing thresholds: calibrate, threshold, and drift-check against an LLM teacher. | python · mit | 11 | 2026-09-18 |
| [jmanhype/jev-dspy-lab](https://github.com/jmanhype/jev-dspy-lab) | Reproducible calibration and selective-risk benchmarks for Jev decisions in DSPy. | python · mit | 11 | 2026-09-20 |
| [zhuyansen/jev-search-rerank-eval](https://github.com/zhuyansen/jev-search-rerank-eval) | Does a Jev rerank beat embedding search? 9,831 graded pairs, with the judge-circularity bias measured. | python · mit | 10 | 2026-09-18 |
| [anessbelbati/jev-rerank-bench](https://github.com/anessbelbati/jev-rerank-bench) | Jev against Cohere Rerank, ZeroEntropy, and a chat baseline on 14 datasets, raw responses included. | python · mit | 9 | 2026-09-25 |
| [anisselbd/jev-phishing-bench](https://github.com/anisselbd/jev-phishing-bench) | Jev against Claude Haiku on 2,000 phishing emails: accuracy, calibration, latency, cost. | python | 8 | 2026-09-19 |
| [mahlernim/jev-korean-benchmark](https://github.com/mahlernim/jev-korean-benchmark) | Korean understanding and medical text, with runtime and cost evidence. | python | 7 | 2026-09-17 |
| [wondertwins/jev-benchmark](https://github.com/wondertwins/jev-benchmark) | Two benchmarks, chess and predator identification, one inside Jev's lane and one outside, both with results. | python · mit | 7 | 2026-09-16 |
| [Gaurav-Gosain/jev-sec-bench](https://github.com/Gaurav-Gosain/jev-sec-bench) | Blind benchmarks for prompt injection and vulnerable-code detection. | go · mit | 4 | 2026-09-16 |
| [TokenTrim/jev-agent-failure-benchmark](https://github.com/TokenTrim/jev-agent-failure-benchmark) | Jev against a strong LLM on the Who and When agent-failure-attribution benchmark. | python · apache-2.0 | 4 | 2026-09-17 |
| [RINNECODER/jev-behavior-study](https://github.com/RINNECODER/jev-behavior-study) | Controlled prompt experiments on jev-1.13.0, raw results and offline verification. | python · mit | 4 | 2026-09-17 |
| [chenmingtang830/jevarena](https://github.com/chenmingtang830/jevarena) | Hosted arena that puts Jev against an opponent judge you connect and takes your vote before revealing which was which, with latency, cost provenance, and self-reported confidence; a vote records preference, not verified correctness. | typescript · apache-2.0 | 4 | 2026-09-20 |
| [bitnovus/jev-spam-eval](https://github.com/bitnovus/jev-spam-eval) | Zero-shot spam filtering with Noul questions against TF-IDF baselines. | jupyter notebook · mit | 3 | 2026-09-18 |
| [PistachioAIHQ/jev-synergy-screening](https://github.com/PistachioAIHQ/jev-synergy-screening) | Choice and Noul questions scored against ASReview SYNERGY gold labels for abstract screening. | python | 3 | 2026-09-16 |
| [jgridifier/jev-research-eval](https://github.com/jgridifier/jev-research-eval) | Reproducible harness over a pinned jev-ultrafast commit, with baseline and stress suites. | html · noassertion | 3 | 2026-09-17 |
| [HackSing/jev-report](https://github.com/HackSing/jev-report) | Independent Chinese research report: 52 pages, 50 reproducible tests, 143 traceable data rows. | python · mit | 2 | 2026-09-17 |
| [hegargarcia/jev-playground](https://github.com/hegargarcia/jev-playground) | Jev against other models in games with explicit states, legal actions, and a measurable outcome. | typescript | 2 | 2026-09-17 |
| [yodablocks/jev-orderby-bench](https://github.com/yodablocks/jev-orderby-bench) | Measures whether ORDER BY over a Jev probability is defensible: pairwise inversion, ordinality against a human grade, calibration and wording invariants under a pre-registered gate. | python · mit | 1 | 2026-09-20 |
| [4esv/jev-eval](https://github.com/4esv/jev-eval) | Jev against GPT-5.6 Terra on three labeled tasks: equal on the easy ones, 6.7 points lower on 77-way routing, 5 times faster, 41 to 50 times cheaper. | python | 1 | 2026-09-23 |
| [themsquared/jev-benchmark](https://github.com/themsquared/jev-benchmark) | Tool-call risk classification with the run-to-run variance reported; every wrong answer came with hedged confidence. | python · apache-2.0 | 1 | 2026-09-24 |
| [blowxian/jev-fanout-bench](https://github.com/blowxian/jev-fanout-bench) | Measures what a Jev request is billed and how its answers hold up under batching, translation, and rewording, from 3,455 billed requests with public raw logs. | python · mit | 0 | 2026-09-28 |

## 🧠 Open Models & Replicas

Run System One semantics without the vendor — on a 3090 if you like. _(41 entries)_

| Project | Description | Lang / License | ⭐ | Pushed |
| --- | --- | --- | --- | --- |
| [jaredpalmer/kev](https://github.com/jaredpalmer/kev) | LoRA adapter and readout head on Qwen2.5-0.5B that answers many typed questions in one prefill; trains in under two hours on a MacBook, held-out ECE 0.065, speaks the TypeSafe wire format. | python · apache-2.0 | 7,998 | 2026-09-30 |
| [TheoLeeCJ/SemIf](https://github.com/TheoLeeCJ/SemIf) | Semantic ifs from open models on a single 3090; the most starred independent replica, formerly openjev. | python · mit | 4,604 | 2026-09-23 |
| [TianyuCodings/NanoJev](https://github.com/TianyuCodings/NanoJev) | 0.6B replica with parallel decisions, dynamic candidates, and an end-to-end training pipeline. | python · mit | 2,445 | 2026-09-21 |
| [vinnylarouge/jevlike](https://github.com/vinnylarouge/jevlike) | Open option scorer that reads candidate logits instead of generating JSON. | python · mit | 1,335 | 2026-09-16 |
| [ollaya-dev/ollaya](https://github.com/ollaya-dev/ollaya) | Pulls and serves open decision models such as Laya, kev, and JevK5 behind a TypeSafe-compatible local endpoint, the way Ollama serves LLMs. | rust · apache-2.0 | 1,011 | 2026-09-29 |
| [Mapika/decider](https://github.com/Mapika/decider) | One-pass typed decisions fine-tuned from Qwen3.5-2B. | python · apache-2.0 | 988 | 2026-09-30 |
| [nokia-applied-research/AnyJev](https://github.com/nokia-applied-research/AnyJev) | Turns an open Hugging Face model into a calibrated decision endpoint served through vLLM, with no fine-tuning at the first two levels. | python · apache-2.0 | 981 | 2026-09-28 |
| [wfzyx/von](https://github.com/wfzyx/von) | Non-autoregressive open decision model reporting under 15 ms locally, as a drop-in alternative to Jev. | python · apache-2.0 | 781 | 2026-09-30 |
| [Rizzo-AI-Academy/rizzo-flow](https://github.com/Rizzo-AI-Academy/rizzo-flow) | Local-first take on the System One idea: unstructured state in, typed probabilistic decisions out, without generating a token. | python · apache-2.0 | 763 | 2026-09-25 |
| [featherless-ai/simple-jev](https://github.com/featherless-ai/simple-jev) | Reads next-token logits from any Hugging Face model for choice, rubric, and support questions; public demo API with no key. | python · apache-2.0 | 575 | 2026-09-30 |
| [Liuziyu77/Valen](https://github.com/Liuziyu77/Valen) | Multimodal decision model on Qwen3.5 that scores candidates against images and video as well as text, with training code and open weights. | python · apache-2.0 | 551 | 2026-09-30 |
| [razorback16/openjev](https://github.com/razorback16/openjev) | Jev-compatible decision server on DiffusionGemma 26B through vLLM, images included, hosted free on [Codiv](https://codiv.ai). | python · apache-2.0 | 541 | 2026-09-29 |
| [Yinsongxu/LLM2Jev](https://github.com/Yinsongxu/LLM2Jev) | Adapts local language models to runtime-defined Choice, Score, and Noul questions and returns typed answers with probabilities. | python · apache-2.0 | 377 | 2026-09-26 |
| [ekzhang/openjev-sglang](https://github.com/ekzhang/openjev-sglang) | Jev-compatible API endpoint on SGLang, prefill only. | python | 336 | 2026-09-25 |
| [malevrigns/agent-jev](https://github.com/malevrigns/agent-jev) | Decision model on Qwen3-0.6B that answers without decoding tokens, reports 79.25 percent top-1 on the public Typed Decisions benchmark. | python · apache-2.0 | 328 | 2026-09-23 |
| [hr98w/jev-visual](https://github.com/hr98w/jev-visual) | Educational visual-inference variant on Apple Silicon: shared context, direct candidate scoring. | python · mit | 303 | 2026-09-21 |
| [Heman10x-NGU/openJev-verdict-2.0](https://github.com/Heman10x-NGU/openJev-verdict-2.0) | Non-autoregressive 151M decision engine with a WebGPU browser runtime, reporting 77.1 percent top-1 and 1.44 percent calibration error on its own benchmark. | python · noassertion | 293 | 2026-09-20 |
| [logan-markewich/jeff](https://github.com/logan-markewich/jeff) | Self-hosted System One API on the 400M GLiFormer, with benchmarks that say where it trails Jev. | python · mit | 273 | 2026-09-20 |
| [togethercomputer/tev1](https://github.com/togethercomputer/tev1) | Data recipe and training code that fine-tune Qwen3.5-4B into an open-weight decision model on Together AI. | python · mit | 177 | 2026-09-24 |
| [kshetrajna12/reflex](https://github.com/kshetrajna12/reflex) | Small open decision model on Qwen3.5: state plus typed questions to calibrated probabilities. | python · mit | 160 | 2026-09-27 |
| [allebee/jevk5](https://github.com/allebee/jevk5) | Qwen3.5 replica with distilled LoRA weights, ranked second of 76 systems and first among open ones on JevBench v1.4. | python · apache-2.0 | 126 | 2026-09-28 |
| [daseinlabs/open-jev](https://github.com/daseinlabs/open-jev) | Prefills once and scores every option in one padded pass on Gemma 3 4B with MLX; plays Doom from the terminal in the demo. | python · mit | 121 | 2026-09-30 |
| [mmastrac/djev](https://github.com/mmastrac/djev) | Serves `/v1/systemone` on DiffusionGemma by reading typed answers and text spans off a seeded, pinned canvas, with no generation. | python · apache-2.0 | 111 | 2026-09-24 |
| [Heman10x-NGU/Verdict-open-jev](https://github.com/Heman10x-NGU/Verdict-open-jev) | Non-autoregressive decision engine on ModernBERT with calibrated uncertainty and an in-browser WebGPU playground. | python · noassertion | 110 | 2026-09-28 |
| [zwliJay/jev-forge](https://github.com/zwliJay/jev-forge) | End-to-end stack for auditable data construction, Qwen3.5-0.8B training, fixed Mind2Web and OOD evaluation, local serving, and a preliminary RLCD baseline. | python · noassertion | 94 | 2026-09-23 |
| [kikoncuo/jevfire](https://github.com/kikoncuo/jevfire) | Parallel decisions for CUDA LLMs through a vLLM API, with game-agent examples and benchmarks. | javascript · mit | 72 | 2026-09-18 |
| [bnsd55/jevmlx](https://github.com/bnsd55/jevmlx) | Parallel constrained decisions for any MLX model on Apple Silicon, one forward pass. | python · mit | 69 | 2026-09-25 |
| [r-ms/mini-jev](https://github.com/r-ms/mini-jev) | Preregistered experiment on a frozen Qwen3-4B: read the option letter's logits, skip the JSON. | python · mit | 58 | 2026-09-18 |
| [ikermoel/open-alternative-jev](https://github.com/ikermoel/open-alternative-jev) | Typed, calibrated decisions from any open-weights model in one forward pass, on Hugging Face and vLLM. | python · apache-2.0 | 57 | 2026-09-25 |
| [zhengxuyu/litjev](https://github.com/zhengxuyu/litjev) | Turns any off-the-shelf LLM into a Jev-style decision layer. | python · apache-2.0 | 46 | 2026-09-21 |
| [OmniJev/PlayJev](https://github.com/OmniJev/PlayJev) | Plays ten browser games from the frame alone on a fine-tuned Qwen3.5-0.8B, one forward pass per move, open weights and a browser demo. | javascript · apache-2.0 | 45 | 2026-09-24 |
| [JoshuaSP/open-jev](https://github.com/JoshuaSP/open-jev) | Typed JSON inference with DiffusionGemma, benchmarked against Jev. | python · mit | 43 | 2026-09-16 |
| [iammrduncan/typesafe-ai-benchmark](https://github.com/iammrduncan/typesafe-ai-benchmark) | LLM gateway that mimics the TypeSafe response shape, useful as a stand-in while you wait for a key. | typescript · mit | 40 | 2026-09-19 |
| [mithalouni/system-one-open](https://github.com/mithalouni/system-one-open) | Typed calibrated decisions in one forward pass on Gemma 4 E2B and Gemma 3 270M. | python · noassertion | 38 | 2026-09-17 |
| [zhihz/openjev](https://github.com/zhihz/openjev) | Bilingual local decisions from context, questions, and candidate answers. | python · noassertion | 35 | 2026-09-16 |
| [rorshopping/jev-on-a-laptop](https://github.com/rorshopping/jev-on-a-laptop) | Study of Jev-style decisions on stock 1.5B to 8B models on a laptop, with a Hugging Face demo. | python · noassertion | 25 | 2026-09-17 |
| [olanotolu/jevbetter](https://github.com/olanotolu/jevbetter) | A stronger one-pass scorer with a head-to-head benchmark against the jevlike starter design. | python · mit | 16 | 2026-09-16 |
| [genai-craft/openvons](https://github.com/genai-craft/openvons) | Open decision layer answering a finite option set with probabilities split into execute, confirm, and reject. Independent replica, not TypeSafe weights. | python · noassertion | 14 | 2026-09-21 |
| [amithgc/local-jev](https://github.com/amithgc/local-jev) | Offline server wire-compatible with the System One endpoint, checked against the official SDK; reports 80.5 percent on JevBench's public items against 86.6 percent published for the hosted API. | python · mit | 13 | 2026-09-21 |
| [David-Lolly/Jev-Compatible](https://github.com/David-Lolly/Jev-Compatible) | Gateway that turns an existing SGLang or vLLM deployment into a Jev-compatible decision service by scoring candidate tokens, with no training and no model changes. | python | 6 | 2026-09-21 |
| [metask-ai/metask-jev](https://github.com/metask-ai/metask-jev) | Open-weight typed-decision models on Qwen3.5 with calibrated per-option probabilities in one forward pass; reports 80.1 percent on JevBench against 75.3 for Jev 1.13. | python | 2 | 2026-09-22 |

## 🎮 Games, Robotics & Simulation

Decisions as game mechanics. _(19 entries)_

| Project | Description | Lang / License | ⭐ | Pushed |
| --- | --- | --- | --- | --- |
| [rmalde/minecraft-agent](https://github.com/rmalde/minecraft-agent) | Kills the dragon on a vanilla server with a frontier model planning and Jev selecting every player action; the logged run took 131 Jev decisions and 35 planner calls. | javascript | 569 | 2026-09-20 |
| [fhshaik/typesafe-mario](https://github.com/fhshaik/typesafe-mario) | Plays Super Mario Bros. from structured emulator state; Jev picks the NES controller input directly. | python | 422 | 2026-09-16 |
| [FBddcz/embodied-jev](https://github.com/FBddcz/embodied-jev) | Browser workbench for embodied experiments in MuJoCo where every robot step is a visible Jev decision, backed by a local model or a cloud API. | python · mit | 250 | 2026-09-22 |
| [rokbenko/quackd](https://github.com/rokbenko/quackd) | Command line for LLM-piloted robots across seven bodies, with an optional Jev stepper that picks among calls without ever writing a joint angle. | python · apache-2.0 | 245 | 2026-09-30 |
| [RomanSlack/jev-drone](https://github.com/RomanSlack/jev-drone) | Camera-only drone in MuJoCo with Jev in the loop at 2.5 Hz. | python · mit | 229 | 2026-09-24 |
| [standardagents/jevpilot](https://github.com/standardagents/jevpilot) | Three.js driving simulator where Jev picks steering and speed from sampled paths up to four times a second; [drive it](https://jevpilot.standardagents.ai). | javascript | 203 | 2026-09-17 |
| [emrickgarrett/OneVOneJev](https://github.com/emrickgarrett/OneVOneJev) | 1v1 quickscope arena in Three.js. | typescript | 41 | 2026-09-18 |
| [phyous/tsai-sc](https://github.com/phyous/tsai-sc) | Plays the original StarCraft shareware through keyboard and mouse, action probabilities recorded. | python · mit | 28 | 2026-09-16 |
| [lukaske/jev-doom-agent](https://github.com/lukaske/jev-doom-agent) | Browser-native Doom agent with structured spatial state and live decision telemetry. | typescript | 28 | 2026-09-17 |
| [sorrycc/typesafe-snake](https://github.com/sorrycc/typesafe-snake) | One Choice per tick; legal moves and facts generated in code. | typescript | 24 | 2026-09-17 |
| [vinilana/live-jev](https://github.com/vinilana/live-jev) | Top-down car in the browser sending four typed questions every 200 ms, with confidence-gated overrides in code. | javascript | 21 | 2026-09-18 |
| [TarunTomar122/jev-askable-arm](https://github.com/TarunTomar122/jev-askable-arm) | Zero-shot English goals on a simulated Franka arm; Jev chains hardcoded primitives. | python · mit | 12 | 2026-09-17 |
| [valentynkit/jev-plays-pokemon-red](https://github.com/valentynkit/jev-plays-pokemon-red) | Pokemon Red on PyBoy: code owns the route and the arithmetic, Jev picks only at branches, and every battle turn logs a faint prediction scored by Brier against what the RAM says. | python · mit | 10 | 2026-09-19 |
| [AbdelStark/heist-one](https://github.com/AbdelStark/heist-one) | Stealth game where Jev makes the guards' judgments and deterministic code owns the world. | typescript · mit | 9 | 2026-09-17 |
| [anxkhn/JevPlaysPokemon](https://github.com/anxkhn/JevPlaysPokemon) | Generation 3 Pokémon through Showdown and a real FireRed ROM. | html · gpl-3.0 | 7 | 2026-09-18 |
| [vishxrad/clashroyale-jev](https://github.com/vishxrad/clashroyale-jev) | Plays Clash Royale with Jev choosing cards and placements from Qwen battlefield vision and local OpenCV hand and elixir recognition. | python | 4 | 2026-09-22 |
| [phyous/tsai-civ2](https://github.com/phyous/tsai-civ2) | Civilization II in a browser, full-game harness, live action probabilities. | python · noassertion | 3 | 2026-09-18 |
| [siroccomask/snake-jev](https://github.com/siroccomask/snake-jev) | Snake controlled by parallel Jev assessments, one API call per tick. | python · mit | 3 | 2026-09-19 |
| [hazlema/jev-connect4](https://github.com/hazlema/jev-connect4) | Connect Four with nine swappable query strategies for one model, every answer graded against engine ground truth in a live inspector. | typescript · mit | 1 | 2026-09-21 |

## 💹 Finance & Trading

Scoring financial signals with calibrated probabilities. _(5 entries)_

| Project | Description | Lang / License | ⭐ | Pushed |
| --- | --- | --- | --- | --- |
| [jarrodwatts/jev-trader](https://github.com/jarrodwatts/jev-trader) | One trade decision every Monad block, on Kuru MON-USDC, about 300 ms each. | typescript · mit | 2,695 | 2026-09-17 |
| [imikerussell/beebots](https://github.com/imikerussell/beebots) | Runs three Jev-driven trading bots against OKX perpetuals with a live dashboard, paper trading by default and real money behind explicit flags. | typescript · mit | 180 | 2026-09-27 |
| [aowang-ai/jev-trade](https://github.com/aowang-ai/jev-trade) | Live Jev trader on Hyperliquid. | typescript · noassertion | 171 | 2026-09-21 |
| [zadescoxp/Jev-Trades](https://github.com/zadescoxp/Jev-Trades) | Crypto trading bot with backtesting. | python · apache-2.0 | 37 | 2026-09-25 |
| [justinhe16/trade-jev](https://github.com/justinhe16/trade-jev) | Backtests Jev as a buy, sell, or hold trader on NQ order-book data. | python · mit | 11 | 2026-09-17 |

## 🎪 Playgrounds & Demos

Try it in thirty seconds. _(12 entries)_

| Project | Description | Lang / License | ⭐ | Pushed |
| --- | --- | --- | --- | --- |
| [dabit3/jev-experiments](https://github.com/dabit3/jev-experiments) | Nader Dabit's grab bag of small Jev experiments. | typescript | 397 | 2026-09-21 |
| [TypeSafeAI/typesafe-playground](https://github.com/TypeSafeAI/typesafe-playground) | 110 use cases, games, and model challenges with editable prompts and A/B comparisons; a community org, not the vendor, formerly under BunsDev. | typescript · mit | 22 | 2026-09-28 |
| [kavehmz/typesafe-playground](https://github.com/kavehmz/typesafe-playground) | From support routing to a 3D driving simulation with visible sensor inputs. | javascript | 14 | 2026-09-29 |
| [GiesN/typesafe-jev-workflow](https://github.com/GiesN/typesafe-jev-workflow) | LangGraph demo that sends a mocked email to Jev and routes on the typed Choice it returns. | python | 12 | 2026-09-16 |
| [lbotinelly/jev-little-airways](https://github.com/lbotinelly/jev-little-airways) | Show-and-tell capability study for Jev. | html · mit | 7 | 2026-09-17 |
| [haseeb-heaven/jev-system-one](https://github.com/haseeb-heaven/jev-system-one) | Terminal interface where OpenAI answers and Jev separately scores relevance, reliability, and quality. | python · mit | 6 | 2026-09-17 |
| [markjaquith/typesafe-ai-playground](https://github.com/markjaquith/typesafe-ai-playground) | Rust CLI playground for experiments around Jev. | rust · mit | 5 | 2026-09-22 |
| [replynodes/jev-web-analyzer](https://github.com/replynodes/jev-web-analyzer) | Turns a SaaS landing page into Markdown and asks Jev ten bounded Choice questions about what a first-time visitor understands, shown as a founder teardown. | typescript · apache-2.0 | 5 | 2026-09-28 |
| [wustep/jev-playground](https://github.com/wustep/jev-playground) | Can a System One model steer a music composition through typed classify, score, and pick decisions alone. | typescript | 2 | 2026-09-26 |
| [willprout/magic-8-ball](https://github.com/willprout/magic-8-ball) | Ask a question, one choice over twenty answers picks the reply and shows the click-to-answer latency; [live demo](https://willprout.github.io/magic-8-ball/). | typescript | 1 | 2026-09-18 |
| [bud-ro/jev-demos](https://github.com/bud-ro/jev-demos) | Demos built to test what Jev is good at. | dart | 1 | 2026-09-18 |
| [rishi-raj-jain/hn-thread-judge](https://github.com/rishi-raj-jain/hn-thread-judge) | Reads the most-discussed Hacker News threads comment by comment with Jev and reduces each one to a single verdict, served live from Postgres. | typescript | 0 | 2026-09-21 |

<!-- entries:end -->

---

## 🧭 How this list is curated

This is not a hand-typed list that rots in six months. It is **one data file, deterministic scripts, and a free-AI reviewer**:

| Stage | Command | What it does |
| --- | --- | --- |
| **Seed** | `node scripts/import-seed.mjs <projects.json>` | Imports a community CC0 dump into `data/entries.json`. Run manually when re-seeding. |
| **Verify** | `node scripts/verify.mjs` | Schema, duplicate URLs, category ids, description hygiene. Pure Node, no model, no network. |
| **Refresh** | `node scripts/refresh-stars.mjs` | Bulk star/license/archive refresh via the GitHub API, then regenerates README and site. |
| **Translate** | `node scripts/translate.mjs` | Fills 中文 and Français descriptions using **free** opencode models. Idempotent, crash-safe. |
| **Review** | `node scripts/curate.mjs` | A free model reviews new submissions and runs the periodic health audit, writing a report for a gate. |
| **Render** | `node scripts/build-readme.mjs`, `site/build.mjs` | Regenerate all three READMEs, the website, and the machine-readable exports. |

**Free AI, no API key, ever.** The curator runs on [opencode Zen](https://opencode.ai/zen)'s public `*-free` models, discovered live from `/zen/v1/models` with a static fallback list. If the network or the model is unavailable it degrades to a deterministic report rather than failing. It never pushes to `main`, never auto-approves a human PR, and never invents a star count.

**Two-model gate.** New entries are drafted by one free model and reviewed by a second, independent free model before anything merges. A report-only change is never auto-merged — it has to touch the data file.

---

## ❓ FAQ

**What exactly is Jev?** A System One model from TypeSafe AI: you send a state plus typed questions, it returns typed answers with probabilities and confidence.

**How is it different from asking an LLM to pick an option?** An LLM returns text you must parse. Jev returns a typed `choice` plus a probability distribution, so you can set a threshold, unit-test the branch, and log a number.

**Do I need a TypeSafe API key?** Only for the hosted API. The [Open Models & Replicas](#-open-models--replicas) category has System One semantics running on open weights.

**How do I get my project listed?** Open a PR against `data/entries.json`, or add the `jev` topic and open an issue. See [CONTRIBUTING.md](CONTRIBUTING.md).

**Is this list affiliated with TypeSafe AI?** No. It is community-maintained. TypeSafe AI is linked because Jev is their model.

**How fresh is the star count?** Refreshed on a schedule by GitHub Actions; the footer carries the exact date.

**Can I use this data in my own tool?** Yes — CC0-1.0, public domain. Fetch [`projects.json`](https://hdjekuue.github.io/awesome-jev/projects.json) or `llms-full.txt` and go.

---

---

## ⭐ Star History & Community Growth

<!-- star-history:start -->
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/star-history/star-history-dark.svg">
  <img alt="Star history" src="assets/star-history/star-history-light.svg">
</picture>
<!-- star-history:end -->

> **Community momentum:** as this list approaches 100 stars, notable entries *may* be pinned at the top of the README and the website — no pay-to-play, no quotas, just a signal about what the community actually values. [Star on GitHub](https://github.com/hdjekuue/awesome-jev) · [Join the TypeSafe Discord](https://discord.gg/typesafe)

<sub>Chart is self-hosted via GitHub Action (`narayann7/star-history-action`) and refreshes every 6h. Previously used `api.star-history.com/svg`, disabled due to the [GitHub stargazers API restriction](https://star-history.com/blog/github-stargazer-api-restriction).</sub>

## 📣 Spread the word

One share is worth ten stars for the builders below.

[![Share on X](https://img.shields.io/badge/Share%20-%20X-000000?style=for-the-badge&logo=x)](https://twitter.com/intent/tweet?text=Awesome%20Jev%20%E2%80%94%20everything%20built%20on%20Jev%2C%20TypeSafe%20AI's%20System%20One%20model.%20Typed%20decisions%2C%20calibrated%20probabilities%2C%20350%2B%20projects%2C%20self-updating.&url=https://github.com/hdjekuue/awesome-jev&hashtags=jev,typesafe,aiagents,llm,awesome)
[![Share on Reddit](https://img.shields.io/badge/Share%20-%20Reddit-ff4500?style=for-the-badge&logo=reddit&logoColor=white)](https://www.reddit.com/submit?url=https://github.com/hdjekuue/awesome-jev&title=Awesome%20Jev%20%E2%80%94%20everything%20built%20on%20Jev)
[![Share on LinkedIn](https://img.shields.io/badge/Share%20-%20LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/sharing/share-offsite/?url=https://github.com/hdjekuue/awesome-jev)

## 📮 Contributing

Found something built on Jev that is missing, or a row that is out of date? **One entry per PR, three minutes of work, merged fast.** Read [CONTRIBUTING.md](CONTRIBUTING.md) (or [中文](CONTRIBUTING.zh.md) / [Français](CONTRIBUTING.fr.md)) for the exact format and the merge checklist.

<sub>Star counts as of 2026-10-01. This list is continuously updated — see "How this list is curated" above.</sub>

## 📄 License

[CC0-1.0](LICENSE) — public domain. Use it freely, in any language, with or without attribution.