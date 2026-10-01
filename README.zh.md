<div align="center">

# Awesome Jev

# ⚡ 万物皆决策。

**关于 [Jev](https://typesafe.ai)（TypeSafe AI 的 System One 模型）构建的一切——终极、持续自动更新的精选目录。Jev 是第一个直接返回类型化判断与校准概率、而不是自然语言的模型。**

**[English](README.md) · [中文](README.zh.md) · [Français](README.fr.md)**

</div>

<p align="center">
  <a href="https://github.com/hdjekuue/awesome-jev"><img src="https://img.shields.io/github/stars/hdjekuue/awesome-jev?style=social" alt="GitHub stars"></a>
  <a href="https://github.com/hdjekuue/awesome-jev/fork"><img src="https://img.shields.io/github/forks/hdjekuue/awesome-jev?style=social" alt="GitHub forks"></a>
  <img src="https://img.shields.io/github/last-commit/hdjekuue/awesome-jev" alt="last commit">
  <a href="CONTRIBUTING.zh.md"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs welcome"></a>
  <a href="https://github.com/topics/jev"><img src="https://img.shields.io/badge/topic-jev-ff7a45" alt="jev topic"></a>
  <img src="https://img.shields.io/badge/CC0-lightgrey.svg" alt="CC0">
</p>

<p align="center">
  <a href="https://typesafe.ai"><b>TypeSafe AI</b></a> ·
  <a href="https://docs.typesafe.ai"><b>官方文档</b></a> ·
  <a href="https://vercel.com/ai-gateway/models/jev"><b>AI Gateway</b></a> ·
  <a href="https://discord.gg/typesafe"><b>Discord</b></a> ·
  <a href="https://github.com/topics/jev"><b><code>jev</code> 话题</b></a> ·
  <a href="https://hdjekuue.github.io/awesome-jev/zh/"><b>网站</b></a>
</p>

---

> ### ⭐ 给这份清单点个 Star——这是下一位构建者找到你的方式
>
> 下面每一个条目，都是某位希望自己项目被看见的贡献者加进来的。GitHub 会优先推荐有 Star 的清单，而**一个 Star 是你能为这些项目做的、杠杆率最高的动作。**
>
> <a href="https://github.com/hdjekuue/awesome-jev"><img src="https://img.shields.io/github/stars/hdjekuue/awesome-jev?style=for-the-badge&label=%E2%AD%90%20Star%20%E2%AD%90" alt="Star on GitHub"></a>
>
> **里程碑：0 → 100 stars。** 接近时，被关注的条目会在 README 与站点首页置顶展示。不收费、不设配额——只是社区对「什么真的值得用」的信号。
>
> **你做了基于 Jev 的东西？** [提个 PR](CONTRIBUTING.zh.md)（每个 PR 一条，三分钟）。也可以给仓库打上 [`jev` 话题](https://github.com/topics/jev) 再[开个 issue](https://github.com/hdjekuue/awesome-jev/issues/new/choose)，AI 策展机器人会自动接手。

---

## 📖 目录

- [Jev 是什么](#jev-是什么) · [为什么需要类型化决策](#为什么需要类型化决策) · [项目目录](#-项目目录) · [怎么打理的](#-这份清单是怎么打理的) · [常见问题](#-常见问题) · [参与贡献](#-参与贡献) · [许可](#-许可)

---

## Jev 是什么？

Jev 是 TypeSafe AI 的 **System One** 模型。你给它一个 `state` 加上若干条**类型化问题**（并行求值），它返回带每个选项概率与置信度的类型化答案。不用写提示词、不用正则抠文本、不用在凌晨三点排查解析失败。

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
| **模型** | `jev-latest` |
| **端点** | `POST https://api.typesafe.ai/v1/systemone` |
| **输入** | 一个 `state` + 类型化 `questions`，并行求值 |
| **输出** | 类型化答案、每个选项的概率、置信度 |
| **延迟** | 端到端 70–500 ms |
| **定价** | 输入 $0.042 / MTok · **输出免费** |
| **SDK** | [JS/TS](https://github.com/typesafe-ai/typesafe-sdk-js) · [Python](https://github.com/typesafe-ai/typesafe-sdk-python) · [AI Gateway](https://vercel.com/ai-gateway/models/jev) · 下方 30+ 个社区客户端 |

### 三个原语

| 原语 | 你问什么 | 你拿回什么 |
| --- | --- | --- |
| **`choice`** | 从列表中选一个 | `choice`、`probabilities`、`confidence` |
| **`score`** | 按评分标准给状态打分 | `score`、`probabilities`、`confidence` |
| **`noul`** | 这句话是真的吗？ | `noul`（0–1） |

## 为什么需要类型化决策

一个 agent 循环里没有一个难题，而是**成百上千个小决策**：这一轮用哪个模型？这次工具调用安不安全？该加载哪个技能？上下文还有用吗？答案够不够好可以收尾？以往的做法是让模型返回字符串再自己去解析，而每一次解析都是一个可能出错的地方。

Jev 把这些变成**可设阈值、可审计、可测试、可计费**的调用：

```ts
// 整条护栏就这么几行，而且你可以写单元测试。
if (res.answers.risk.choice === "block" && res.answers.risk.confidence > 0.8) {
  return deny("blocked by risk judge");
}
```

所以上面这个生态不是玩具清单：它是在 70–500 ms 预算内**降低推理成本的路由、拦住危险工具调用的门控、保持窗口干净的压缩器、抓 slop 的判官，以及提示注入护栏**。

## 📊 数字概览

| | |
| --- | --- |
| **350+** 个项目，通过 GitHub API 自动刷新 |
| 追踪到的 **90k+** stars |
| **20** 个分类，从官方 SDK 到开源复刻 |
| **3** 种语言——English、中文、Français |
| **1** 个数据文件，保证三种语言永不脱节 |
| **0** 个 API key——维护用 AI 全部跑在免费开源模型上 |

## 🔍 快速定位

- **我想要某种语言的 SDK** → [🧩 SDK 与社区客户端](#-sdk-与社区客户端)
- **我想在模型/agent 之间做路由** → [🚦 路由与网关](#-路由与网关)
- **我想让 agent 少用点上下文** → [🗜️ 上下文与压缩](#%EF%B8%8F-上下文与压缩)
- **我想要浏览器/计算机操作 agent** → [🌐 浏览器与计算机操作](#%EF%B8%8F-浏览器与计算机操作)
- **我要安全/内容审核** → [🛡️ 安全、审核与校验](#%EF%B8%8F-安全审核与校验)
- **我想不依赖 TypeSafe API 也能跑** → [🧠 开源模型与复刻](#-开源模型与复刻)
- **我想知道它到底好不好用** → [📊 基准、评测与校准](#-基准评测与校准)
- **我刚起步** → [🧭 入门与心智模型](#-入门与心智模型)

> 🤖 **正在用 AI agent？** 这份清单以机器可读数据发布，不只是散文。取 [`llms.txt`](https://hdjekuue.github.io/awesome-jev/llms.txt) 看索引、[`llms-full.txt`](https://hdjekuue.github.io/awesome-jev/llms-full.txt) 拿全部条目的 markdown、[`projects.json`](https://hdjekuue.github.io/awesome-jev/projects.json) 取结构化记录，或用 [`npx skills add hdjekuue/awesome-jev`](https://skills.sh/hdjekuue/awesome-jev) 把它加成技能。详见 [AGENTS.md](AGENTS.md)。

---

## 🗂️ 项目目录

以下内容全部由 [`data/entries.json`](data/entries.json) 生成。星标、许可与更新时间由 GitHub Actions 定时刷新——过期的行下一轮就会被修正，且每条上线前都会做链接校验。

<!-- entries:start -->

<!-- 352 entries · 335 repos · 93,460 stars · 21 languages · updated 2026-10-01 -->

- [🧭 入门与心智模型](#-入门与心智模型) — 16
- [🏛️ 官方 SDK 与框架支持](#-官方-sdk-与框架支持) — 7
- [🤖 编码智能体](#-编码智能体) — 48
- [🚦 路由与网关](#-路由与网关) — 10
- [🗜️ 上下文与压缩](#-上下文与压缩) — 6
- [🔍 代码评审与质量](#-代码评审与质量) — 21
- [🌐 浏览器与计算机操作](#-浏览器与计算机操作) — 14
- [📱 移动端与桌面自动化](#-移动端与桌面自动化) — 4
- [🔎 搜索、重排与 RAG](#-搜索重排与-rag) — 13
- [🛡️ 安全、审核与校验](#-安全审核与校验) — 14
- [🗄️ 数据与运维](#-数据与运维) — 20
- [📦 应用与扩展](#-应用与扩展) — 29
- [🧩 SDK 与社区客户端](#-sdk-与社区客户端) — 32
- [⌨️ 命令行](#-命令行) — 14
- [📊 基准、评测与校准](#-基准评测与校准) — 27
- [🧠 开源模型与复刻](#-开源模型与复刻) — 41
- [🎮 游戏、机器人与仿真](#-游戏机器人与仿真) — 19
- [💹 金融与交易](#-金融与交易) — 5
- [🎪 试验场与演示](#-试验场与演示) — 12

## 🧭 入门与心智模型

规格表、三个原语与官方文档——动手前先读这些。 _(16 项)_

| 项目 | 说明 | 语言 / 许可 | ⭐ | 更新 |
| --- | --- | --- | --- | --- |
| [Introduction](https://docs.typesafe.ai/introduction) | 两页讲清心智模型：state + typed questions 进，typed answers + probabilities 出 | official | — | — |
| [Quick start](https://docs.typesafe.ai/introduction/quickstart) | First request in Python, TypeScript, or curl. | official | — | — |
| [Primitives](https://docs.typesafe.ai/primitives) | Choice、Score、Noul 三种问题类型各自返回什么 | official | — | — |
| [State](https://docs.typesafe.ai/concepts/state) | How to package what Jev judges, and why less is more. | official | — | — |
| [API reference](https://docs.typesafe.ai/api) | The request and response contract. | official | — | — |
| [Models](https://docs.typesafe.ai/models) | Aliases, current version, price, and rate limits. | official | — | — |
| [Model jaggedness: jev-1.13](https://docs.typesafe.ai/model-jaggedness/jev-1.13) | Known failure modes, straight from the vendor. | official | — | — |
| [System One](https://docs.typesafe.ai/concepts/system-one) | What the category means and how it differs from a chat model. | official | — | — |
| [How to build with System One](https://docs.typesafe.ai/concepts/how-to-build-with-system-one) | Decompose a judgment into atomic questions and keep the control flow in code. | official | — | — |
| [Confidence](https://docs.typesafe.ai/confidence) | What the confidence field means and how to turn it into act, review, or fall back. | official | — | — |
| [Patterns](https://docs.typesafe.ai/patterns) | 投机式 fan-out、置信度门控路由、组合打分、意图路由 | official | — | — |
| [Use-case map](https://docs.typesafe.ai/concepts/use-case-map) | The vendor's own catalogue of where Jev fits and where it does not. | official | — | — |
| [Cookbooks](https://docs.typesafe.ai/cookbooks/parallel_questions) | 可复现配方：并行提问、重排、护栏、引用校验、抽取、层次化分类 | official | — | — |
| [Workflow evals](https://evals.typesafe.ai/) | The vendor's benchmark on four workflows, with the caveats printed on the page. | official | — | — |
| [llms.txt](https://docs.typesafe.ai/llms.txt) | Every documentation page as plain Markdown, for feeding to an agent. | official | — | — |
| [Console](https://console.typesafe.ai/) | Waitlist, API keys, and usage. | official | — | — |

## 🏛️ 官方 SDK 与框架支持

TypeSafe AI 官方维护，以及原生集成 Jev 的框架。 _(7 项)_

| 项目 | 说明 | 语言 / 许可 | ⭐ | 更新 |
| --- | --- | --- | --- | --- |
| [vercel/eve](https://github.com/vercel/eve) | Vercel 的智能体框架，Jev 在其 evaluate 步骤中担任类型化评判器。 | typescript · apache-2.0 | 5,418 | 2026-09-30 |
| [typesafe-ai/skills](https://github.com/typesafe-ai/skills) | 用于设计问题、构建工作流并对其进行评估的智能体技能。 | official · mit | 2,469 | 2026-09-12 |
| [vercel-labs/ai-cli](https://github.com/vercel-labs/ai-cli) | 在终端中使用的 Vercel AI SDK，其 evaluate 路径运行于 Jev 之上。 | typescript | 817 | 2026-09-30 |
| [typesafe-ai/system-one-adapter-python](https://github.com/typesafe-ai/system-one-adapter-python) | 官方 TypeSafeClient 替代实现，底层走 OpenAI/Anthropic 等 LLM，用来和对话模型做 Jev 对照实验 | official · python · mit | 363 | 2026-09-22 |
| [typesafe-ai/typesafe-sdk-js](https://github.com/typesafe-ai/typesafe-sdk-js) | 官方 TypeScript/JavaScript 客户端，答案类型由问题自动推导（npm install @typesafe-ai/sdk） | official · typescript · mit | 259 | 2026-09-15 |
| [typesafe-ai/typesafe-sdk-python](https://github.com/typesafe-ai/typesafe-sdk-python) | 官方同步 + 异步 Python 客户端（pip install typesafe-sdk） | official · python · mit | 256 | 2026-09-26 |
| [Agent skill](https://docs.typesafe.ai/agent-skill) | How to install the official skill in Claude Code, Cursor, and friends. | official | — | — |

## 🤖 编码智能体

面向 agent harness 的路由、工具门控、评审、技能与 MCP 服务。 _(48 项)_

| 项目 | 说明 | 语言 / 许可 | ⭐ | 更新 |
| --- | --- | --- | --- | --- |
| [nicobailon/pi-mcp-adapter](https://github.com/nicobailon/pi-mcp-adapter) | 针对 MCP 工具结果提供可选的类型化评估与语义搜索，并受按服务器配置的数据外发白名单保护。 | typescript · mit | 1,568 | 2026-09-30 |
| [kerpopule/hermes-jev-skills](https://github.com/kerpopule/hermes-jev-skills) | 将智能体的小决策交给 Jev：哪个模型回答本轮、加载哪些 skills、哪些段落重要、哪些轮次在压缩后保留。 | python · mit | 918 | 2026-09-29 |
| [gargpratyush/jev-router](https://github.com/gargpratyush/jev-router) | 将每个任务路由到能处理它的最便宜的 Claude 模型。 | javascript · mit | 499 | 2026-09-19 |
| [jkudish/jev-mcp](https://github.com/jkudish/jev-mcp) | 首个面向 Jev 的 MCP 服务器，至今仍是被链接最多的。 | javascript · mit | 464 | 2026-09-29 |
| [notque/vexjoy-agent](https://github.com/notque/vexjoy-agent) | 智能体工具包，其 `/d` 命令通过一次 Jev 调用选择专家智能体、skill 和 pipeline，并附带可选的 Jev auto-compact 插件。 | python · mit | 426 | 2026-09-30 |
| [TianyuCodings/JevHarness](https://github.com/TianyuCodings/JevHarness) | 让 LLM 编写任务专用的 harness，将观测转化为 Jev 问题，然后将其冻结，并根据奖励和完整执行轨迹进行改进。 | python | 400 | 2026-09-21 |
| [itsmostafa/typesafe-mcp](https://github.com/itsmostafa/typesafe-mcp) | Go MCP 连接器。 | go · mit | 337 | 2026-09-30 |
| [miuuyy/Astra-Ares](https://github.com/miuuyy/Astra-Ares) | 让 Jev 为正在运行的 Codex 任务选择推理强度及保持时长，基于上游源码构建的补丁版 Codex CLI 运行。 | javascript · mit | 293 | 2026-09-23 |
| [0xNatoshi/jev-codex-router](https://github.com/0xNatoshi/jev-codex-router) | 为每一轮 Codex 对话选择模型、思考深度和速度模式。 | javascript · mit · archived | 278 | 2026-09-22 |
| [kitze/skillbox](https://github.com/kitze/skillbox) | 通过 MCP 提供的自托管版本化技能库，由 Jev 推荐加载哪个技能。 | typescript · mit | 255 | 2026-09-19 |
| [DevMortimer/pi-warden](https://github.com/DevMortimer/pi-warden) | 引导而非打断的护栏：针对不可逆调用、偏离任务调用、卡死循环和未经验证的完成声明，每次约 250 ms。 | typescript · mit | 154 | 2026-09-29 |
| [y0usaf/pi-jev](https://github.com/y0usaf/pi-jev) | 在 Pi 内部提供计量式工具调用门控和用于类型化回答的 `jev_ask` 工具。 | typescript · mit | 151 | 2026-09-25 |
| [dbreunig/building-with-jev-skill](https://github.com/dbreunig/building-with-jev-skill) | 用于编写和改进调用 Jev 的程序的 Skill。 | — | 145 | 2026-09-17 |
| [Dicklesworthstone/skillranker](https://github.com/Dicklesworthstone/skillranker) | 使用实时会话上下文为下一步骤对已安装的 skills 进行排名的 Rust CLI 和 hooks，支持弃权。 | rust · noassertion | 125 | 2026-09-29 |
| [devagrawal09/jev-code](https://github.com/devagrawal09/jev-code) | 编码智能体将重判断工作交给它的命令行工具包，每次请求对应一个带类型的 Jev 工作流。 | typescript · mit | 119 | 2026-09-19 |
| [devagrawal09/stanley-code](https://github.com/devagrawal09/stanley-code) | 编码 CLI，其中 Jev 将自然语言请求路由到一个确定性工作流，该工作流就其收集的证据向 Jev 提固定选项问题。 | typescript · mit | 119 | 2026-09-19 |
| [fabricioctelles/skills](https://github.com/fabricioctelles/skills) | 可使用 Jev 为主观评估标准打分的 agent-skill 目录。 | python · apache-2.0 | 97 | 2026-09-27 |
| [EliaAlberti/jev-rules](https://github.com/EliaAlberti/jev-rules) | 针对每个提示为常驻规则评分，每会话仅交付适用的规则。 | javascript · mit | 63 | 2026-09-27 |
| [TheoOliveira/pi-jev](https://github.com/TheoOliveira/pi-jev) | 作为 Pi tools 的语义工具路由和类型化决策。 | typescript · mit | 58 | 2026-09-24 |
| [DevMortimer/pi-typesafe](https://github.com/DevMortimer/pi-typesafe) | 面向 Pi 扩展作者的批量评估工具、终端试验场和类型化 API。 | typescript · mit | 49 | 2026-09-30 |
| [tacticocc/Jevbridge](https://github.com/tacticocc/Jevbridge) | 将 Jev 与任意 LLM 配对以实现计算机操作和类型化决策的 ACP 和 MCP 适配器。 | typescript · mit | 46 | 2026-09-21 |
| [shantanugoel/ask-jev-skill](https://github.com/shantanugoel/ask-jev-skill) | 让 Hermes 及类似智能体直接向 Jev 提问。 | python · mit | 42 | 2026-09-17 |
| [shitianfang/jev-use](https://github.com/shitianfang/jev-use) | 将无需文本输出的 Claude Code、Codex 和 pi 步骤交给 Jev，并为其不应决定的所有事项提供类型化升级契约。 | javascript · mit | 31 | 2026-09-22 |
| [jomatsu/pi-jev-auto-mode](https://github.com/jomatsu/pi-jev-auto-mode) | 对 bash、write 和 edit 调用进行语义自动批准，在无法判断时默认拒绝。 | typescript · mit | 31 | 2026-09-24 |
| [keeltrace/hermes-jev](https://github.com/keeltrace/hermes-jev) | 类型化决策、排序、验证和 opt-in 工具门控。 | python · mit | 31 | 2026-09-28 |
| [compozy/yoshi](https://github.com/compozy/yoshi) | 面向 Claude Code 和 Codex 的上下文裁剪代理，其节省效果经过实测而非宣称。 | typescript · mit | 27 | 2026-09-18 |
| [blakestone-x/jev-mcp](https://github.com/blakestone-x/jev-mcp) | 分类、评分、检查、匹配和筛选，每个答案都附带置信度。 | python · mit | 26 | 2026-09-16 |
| [GodsBoy/jev-agent-skill-router](https://github.com/GodsBoy/jev-agent-skill-router) | 具有弃权路径的置信度感知技能路由。 | python · mit | 24 | 2026-09-16 |
| [Brainwires/jevwire](https://github.com/Brainwires/jevwire) | MCP server、可嵌入决策模型和仅升级插件，该插件只能使 harness 更严格而绝不放宽。 | typescript · mit | 22 | 2026-09-21 |
| [valentynkit/jev-belay](https://github.com/valentynkit/jev-belay) | 拦截未经证实的 done 的 stop hook：读取 transcript 寻找证据，仅在文件已更改且之后无通过检查时，才花费一次四问题 Jev 调用；在所有错误路径上均失败放行。 | javascript · mit | 20 | 2026-09-20 |
| [anpicasso/hermes-jev-approvals](https://github.com/anpicasso/hermes-jev-approvals) | 在标记的 shell 命令运行前批准、拒绝或升级处理；加速效果由厂商报告。 | python · mit | 20 | 2026-09-22 |
| [mejiasd3v/pi-jev-router](https://github.com/mejiasd3v/pi-jev-router) | 通过 Vercel AI Gateway 为 Pi 提供自动模型路由。 | javascript · mit | 16 | 2026-09-22 |
| [DECRUX9812/typesafe-skill-router](https://github.com/DECRUX9812/typesafe-skill-router) | 在模型调用前命名唯一值得加载的 skill，仅使用 stdlib，每轮约十分之一美分。 | python · mit | 15 | 2026-09-21 |
| [kubet/azdaja](https://github.com/kubet/azdaja) | 适用于 Claude Code、Codex、Gemini 和 OpenCode 的递归语言模型层，将完整源保留在本地评估器中；Jev 是用于重排、验证、分类和语义连接的可选叶子节点，采用带预算、可设检查点的批处理。 | python · mit | 14 | 2026-09-21 |
| [HyunjunJeon/pi-quiet-ask](https://github.com/HyunjunJeon/pi-quiet-ask) | 作为 Pi 编程智能体静默决策层的 Jev。 | typescript · mit | 12 | 2026-09-18 |
| [harshwasan/pi-jev-sentinel](https://github.com/harshwasan/pi-jev-sentinel) | 检查Pi工具调用、工具输出和回复中的风险操作与提示注入，支持用户审批、上下文复查、密钥擦除和可选任务固定。 | typescript · mit | 11 | 2026-09-20 |
| [24601/Augustus](https://github.com/24601/Augustus) | 用于决定类型化判断应放在何处以及哪些内容应保留在代码中的Skill，是官方Skill的补充而非替代。 | python · mit | 11 | 2026-09-28 |
| [adarshmishra07/jcm-router](https://github.com/adarshmishra07/jcm-router) | 按消息挑选模型和 effort 且不干扰缓存的主聊天的本地代理。 | typescript · mit | 9 | 2026-09-17 |
| [AbdelStark/bicameral](https://github.com/AbdelStark/bicameral) | 适用于 Pi 的混合框架：由 LLM 编写代码，Jev reflexes 将每个调用判定为 allow、confirm、block、warn 或 steer。 | typescript · mit | 9 | 2026-09-16 |
| [ajensenwaud/hermes-jev-plugin](https://github.com/ajensenwaud/hermes-jev-plugin) | 四个 Hermes 工具，用于原子检查、路由和按评分标准打分；已收录于 Hermes 插件目录。 | python · mit | 8 | 2026-09-19 |
| [HyunjunJeon/jev-judgment](https://github.com/HyunjunJeon/jev-judgment) | 将编码代理的封闭判断发送给 Jev 而非聊天模型。 | python · mit | 7 | 2026-09-17 |
| [3clyp50/a0-typesafe-ai](https://github.com/3clyp50/a0-typesafe-ai) | 为 Agent Zero 提供类型化工具和概率卡片。 | python · mit | 6 | 2026-09-17 |
| [bestagentkits/jev-skillful](https://github.com/bestagentkits/jev-skillful) | 针对 skills、MCP servers、agents 和 commands 的按提示路由，并衡量注入是否有帮助。 | typescript · mit | 5 | 2026-09-17 |
| [noplan-inc/limpet](https://github.com/noplan-inc/limpet) | 一个根据自然语言规则进行判断、防止 agent 过早停止的 Stop hook。 | python · mit | 5 | 2026-09-17 |
| [suenot/codex-jev-router](https://github.com/suenot/codex-jev-router) | 使用 Jev 为 Codex subagents 选择模型和推理强度，并设有置信度门槛和 Sol fallback。 | javascript · mit | 5 | 2026-09-27 |
| [legacybridge-tech/pi-typesafe-jev](https://github.com/legacybridge-tech/pi-typesafe-jev) | 将 Jev 判断作为五个 Pi tools 暴露的 Pi extension。 | typescript · noassertion | 4 | 2026-09-17 |
| [BYK/jev-mcp](https://github.com/BYK/jev-mcp) | Eval 优先的 MCP 服务器：先设计问题原型，将其映射到多个条目，再通过阈值扫描对照标注样本评估不同变体。 | typescript · mit | 4 | 2026-09-18 |
| [samtay32/jev-system-architect](https://github.com/samtay32/jev-system-architect) | 找出系统中的模糊判断，并将其转化为小型的 Choice、Score 和 Noul 原语。 | mit | 3 | 2026-09-17 |

## 🚦 路由与网关

在硬性超时内逐轮选择模型与工具。 _(10 项)_

| 项目 | 说明 | 语言 / 许可 | ⭐ | 更新 |
| --- | --- | --- | --- | --- |
| [BillionsBobby/JevRouter](https://github.com/BillionsBobby/JevRouter) | 将模型、子代理、技能、MCP 工具和 CLI 作为统一候选集，由 Jev 选择，路由器执行权限和风险控制，在 Toolathlon 上前五次工具调用命中率为 44%，DeepSeek 为 24%。 | typescript · mit | 303 | 2026-09-26 |
| [vinilana/jev-gateway](https://github.com/vinilana/jev-gateway) | 面向 Codex 和 Claude Code 的本地网关，将 which tool next 决策发送给 Jev，其余部分发送给常用模型。 | typescript · mit | 267 | 2026-09-25 |
| [juspay/neurolink](https://github.com/juspay/neurolink) | TypeScript AI SDK，其中经由 Jev 的 decide 与 generate 和 stream 并列：一次类型化判断调用负责路由模型选择、裁剪上下文并挑选 MCP 工具。 | typescript · mit | 144 | 2026-09-30 |
| [nidhi-singh02/agent-router](https://github.com/nidhi-singh02/agent-router) | 为任务挑选 Cursor、Claude Code、Codex 或 OpenCode 以及模型和 effort，然后启动它。 | typescript · mit | 99 | 2026-09-27 |
| [yusukebe/hono-jev-router](https://github.com/yusukebe/hono-jev-router) | 在 Hono 中按语义路由 HTTP 请求。 | typescript · mit | 51 | 2026-09-18 |
| [xinyao27/jevonian](https://github.com/xinyao27/jevonian) | 本地 OpenAI、Anthropic 和 Responses 兼容代理，每轮为其虚拟模型 jevonian/auto 发起一次 Jev 调用以确定模型路由和思考级别，代码优先按协议、上下文窗口、effort 下限和已用配额窗口过滤候选，固定模型或显式路由则完全跳过 Jev。 | typescript · agpl-3.0 | 16 | 2026-09-29 |
| [prismhq/jev-router](https://github.com/prismhq/jev-router) | 构建于 LiteLLM 之上的 LLM 路由器。 | python · mit | 15 | 2026-09-17 |
| [iamvatsalpatel/tiershift](https://github.com/iamvatsalpatel/tiershift) | 将每个 LLM 调用转移到能处理它的最便宜模型，策略用 YAML 配置，决策耗时约 180 ms。 | typescript · mit | 4 | 2026-09-28 |
| [FirasSX914/Janus](https://github.com/FirasSX914/Janus) | 在你的数据上衡量 Jev 何时优于其他模型，然后据此路由。 | python · mit | 3 | 2026-09-18 |
| [daviddl9/jev-router](https://github.com/daviddl9/jev-router) | Jev picks the worker tier for each step in OMP and Pi, keeping planning and review on a strong model and bounded work on cheaper ones. | typescript · noassertion | 0 | 2026-09-21 |

## 🗜️ 上下文与压缩

在模型读到之前，先决定上下文里留下什么。 _(6 项)_

| 项目 | 说明 | 语言 / 许可 | ⭐ | 更新 |
| --- | --- | --- | --- | --- |
| [tamaratran/fast-jev-compaction](https://github.com/tamaratran/fast-jev-compaction) | 以 Jev 决策替代压缩摘要：所有工具调用与结果在单次请求中打分，过期内容被丢弃，保留内容保持原文不变。 | typescript · mit | 7,225 | 2026-09-18 |
| [tamaratran/jev-pruner](https://github.com/tamaratran/jev-pruner) | 在命令运行后、模型可见之前，用 Jev 裁剪冗长的 Bash 输出；简短输出、错误和结构化格式原样通过。 | typescript · mit | 153 | 2026-09-30 |
| [GhalebDweikat/winnow](https://github.com/GhalebDweikat/winnow) | 在每个工具结果进入上下文之前对其进行评判，从而减缓窗口填充速度，而无需事后清理。 | python · mit | 100 | 2026-09-30 |
| [IAmUnbounded/save-token-jev-clean](https://github.com/IAmUnbounded/save-token-jev-clean) | 询问 Jev 哪些工具调用仍然重要并逐字保留其余内容的压缩处理，附带适用于 Claude Code、Codex、OpenCode 和原始 API 转录的适配器。 | typescript · mit | 76 | 2026-09-18 |
| [joelhooks/pi-fast-jev-compaction](https://github.com/joelhooks/pi-fast-jev-compaction) | 逐字压缩方案，移植到 Pi。 | typescript · mit | 14 | 2026-09-18 |
| [Nyarlathoteppppp/pi-heed](https://github.com/Nyarlathoteppppp/pi-heed) | 根据会话早期的发言检查每个有副作用的工具调用，以便在压缩后review only仍然成立。 | typescript · mit | 11 | 2026-09-19 |

## 🔍 代码评审与质量

判官、linter、覆盖率门控与评审看板。 _(21 项)_

| 项目 | 说明 | 语言 / 许可 | ⭐ | 更新 |
| --- | --- | --- | --- | --- |
| [devagrawal09/jev-review](https://github.com/devagrawal09/jev-review) | 带本地仪表盘的分阶段代码审查工作流。 | typescript · mit | 643 | 2026-09-17 |
| [thruwire/foreman](https://github.com/thruwire/foreman) | 监管由智能体组成的软件工厂，由 Jev 做出放行与否决决策。 | python · mit | 619 | 2026-09-28 |
| [lakeday-org/perch](https://github.com/lakeday-org/perch) | 语义 lint：以自然语言编写规则，每个文件由 Jev 判定，可在本地或 CI 中运行。 | javascript · mit | 316 | 2026-09-30 |
| [NiazMorshed2007/jev-review](https://github.com/NiazMorshed2007/jev-review) | 本地优先的 MCP 插件，供编码智能体进行持续质量审查。 | typescript · mit | 231 | 2026-09-17 |
| [supercorp-ai/supercov](https://github.com/supercorp-ai/supercov) | 为编程智能体提供代码质量与覆盖率信号。 | rust · mit | 141 | 2026-09-27 |
| [kyu1204/jgrep](https://github.com/kyu1204/jgrep) | --diff 根据英文编写的规则在 CI 中拦截 PR，--tests 列出 diff 可能影响的测试文件，纯 jgrep 按功能搜索代码；每个数据块一个 Noul，每请求 16 个数据块。 | typescript · mit | 58 | 2026-09-30 |
| [Alurith/jeff](https://github.com/Alurith/jeff) | 只读的 Go CLI，可依据隐藏副作用和薄弱错误处理等编码规则检查文件。 | go · apache-2.0 | 38 | 2026-09-20 |
| [devanshbatham/commit-miner](https://github.com/devanshbatham/commit-miner) | 对 commit diff 和提交信息进行分类：错误修复、带 CWE 的安全修复、变更类型。 | rust | 36 | 2026-09-17 |
| [lukstei/slop-grader](https://github.com/lukstei/slop-grader) | 针对 AI slop、语法和技术文档质量为文本和 markdown 文件评分，并指导 AI 智能体自动修复违规项。 | typescript · mit | 32 | 2026-09-24 |
| [valentynkit/jev-commit](https://github.com/valentynkit/jev-commit) | 预提交钩子：一次 Jev 调用判断提交信息是否与暂存 diff 相符，并检查调试残留、未提及的工作和凭证带；一般仅警告，发现密钥则阻止提交。 | python · mit | 13 | 2026-09-19 |
| [frostney/clean-code-review](https://github.com/frostney/clean-code-review) | 根据 Clean Code 规则评判 PR 中的每个文件，再由 LLM 复审。 | typescript · mit | 12 | 2026-09-23 |
| [huntedman/JevLint](https://github.com/huntedman/JevLint) | 可配置的语义 lint，带文件级 Noul 判定。 | typescript · mit | 12 | 2026-09-20 |
| [doeixd/jev-pref](https://github.com/doeixd/jev-pref) | 将AGENTS.md中的偏好转换为在代码变更上运行并向智能体回报告的linter。 | javascript · mit | 11 | 2026-09-18 |
| [nozomi-koborinai/jev-spec](https://github.com/nozomi-koborinai/jev-spec) | 在每次提交时根据Markdown规范检查代码，并在两者偏离时使构建失败。 | typescript · mit | 11 | 2026-09-29 |
| [HexyeDEV/JevPR](https://github.com/HexyeDEV/JevPR) | GitHub App，会向 Jev 询问拉取请求可安全批准还是需要专家处理，然后将裁决映射为 check run。 | python · apache-2.0 | 10 | 2026-09-25 |
| [stratonext/software-factory](https://github.com/stratonext/software-factory) | 在本地运行多个编码智能体，由 Jev 担任评判与编排。 | python · mit | 9 | 2026-09-30 |
| [raihankhan-rk/diffjury](https://github.com/raihankhan-rk/diffjury) | PR 风险路由与评审教练。 | typescript | 8 | 2026-09-22 |
| [cephalization/jev-triage](https://github.com/cephalization/jev-triage) | 拉取大型仓库并使用类型化 Jev questions 对其 issues 进行分类。 | typescript · mit | 5 | 2026-09-29 |
| [Ramneet-Singh/jevopt](https://github.com/Ramneet-Singh/jevopt) | C/C++ 编译器驱动，根据 LLVM IR 和原始源码让 Jev 判断每个可选调用点是否内联。 | python · gpl-3.0 | 4 | 2026-09-21 |
| [allebee/pytest-jev](https://github.com/allebee/pytest-jev) | Pytest 插件，通过单次请求询问 Jev 关于测试文本的纯英文断言是否成立，除非 Jev 的确信度至少为 80%，否则以每个断言的概率使测试失败。 | python · mit | 3 | 2026-09-21 |
| [fatwang2/jev-review-action](https://github.com/fatwang2/jev-review-action) | GitHub Action for submission review and PR classification with Jev, no text-generation model in the loop. | javascript · mit | 2 | 2026-09-20 |

## 🌐 浏览器与计算机操作

Jev 选操作与 DOM 元素，小模型只负责写字。 _(14 项)_

| 项目 | 说明 | 语言 / 许可 | ⭐ | 更新 |
| --- | --- | --- | --- | --- |
| [browser-use/jev-ultrafast](https://github.com/browser-use/jev-ultrafast) | 单次请求从索引化 DOM 表中同时选定操作和目标元素，小型 LLM 仅填写类型化文本，苏黎世至伦敦的预订在 7.1 秒内完成。 | python · mit | 21,495 | 2026-09-30 |
| [awlevin/typesafe-computer-use](https://github.com/awlevin/typesafe-computer-use) | 对屏幕执行 OCR，分类下一步操作并点击，在 macOS 上每步约 $0.0002。 | python · mit | 1,097 | 2026-09-29 |
| [wy-coliney/jev-browser-use](https://github.com/wy-coliney/jev-browser-use) | Codex skill 与插件，由 Jev 处理导航、点击和滚动，Codex 负责输入与验证，报告称浏览器步骤快 5 到 10 倍。 | javascript · mit | 707 | 2026-09-23 |
| [Sac-Y/Jev-cu](https://github.com/Sac-Y/Jev-cu) | Codex 计算机操作，Jev 仅依据屏幕文本选择元素、动作、完成度与风险，不发送截图，附中文 readme。 | javascript · mit | 613 | 2026-09-22 |
| [moritzkremb/jev-voice-browser](https://github.com/moritzkremb/jev-voice-browser) | 约 300 ms 内逐词判定意图和目标，通常在句子结束前完成。 | javascript · mit | 371 | 2026-09-21 |
| [jkudish/jev-browser](https://github.com/jkudish/jev-browser) | Jev 上首个社区浏览器代理，附演示 GIF。 | javascript · mit | 297 | 2026-09-29 |
| [YUTA-fywoo/jev-gui-delegate](https://github.com/YUTA-fywoo/jev-gui-delegate) | 通过真实 Chrome 会话或 Windows UI Automation 为 Codex 运行委派式 GUI 任务，每一步由 Jev 选择控件。 | python | 131 | 2026-09-27 |
| [socai-io/jev-social](https://github.com/socai-io/jev-social) | 让 Jev 选择每个只读社交研究步骤，同时 socai 在真实 Chrome 会话中执行，并将可审查的 Instagram、TikTok 或 LinkedIn 证据流式汇入报告。 | javascript · mit | 128 | 2026-09-30 |
| [savka777/jev-use](https://github.com/savka777/jev-use) | 面向 macOS 的语音与键入计算机操作：Jev 从 Accessibility tree 中选择下一个屏幕操作，无需截图。 | swift · mit | 112 | 2026-09-21 |
| [Ying-Kai-Liao/jev-browser](https://github.com/Ying-Kai-Liao/jev-browser) | 由 LLM 规划、Jev 决策；提供库、CLI 和 MCP server。 | javascript · mit | 94 | 2026-09-29 |
| [hqman/JevScout](https://github.com/hqman/JevScout) | 通过 CDP 驱动 Chrome 并让 Jev 为每个链接和职位信息打分的求职技能。 | python | 38 | 2026-09-18 |
| [romaluev/jev-ego](https://github.com/romaluev/jev-ego) | 每个步骤消耗一次 Jev 请求以选择操作的浏览器代理。 | typescript · noassertion | 17 | 2026-09-17 |
| [tontoko/jev-browser](https://github.com/tontoko/jev-browser) | 在类型化SDK、持久化CLI和MCP服务器背后的统一的有依据Jev和Playwright核心。 | javascript · apache-2.0 | 11 | 2026-09-30 |
| [imanshu03/jev-browser-use](https://github.com/imanshu03/jev-browser-use) | Runs browser tasks from a plain-language instruction over CDP or Vercel's agent-browser, with Jev selecting operations and targets and code checking confidence before it acts. | typescript | 0 | 2026-09-27 |

## 📱 移动端与桌面自动化

不 hook、不改包地驱动手机、IM 客户端与原生界面。 _(4 项)_

| 项目 | 说明 | 语言 / 许可 | ⭐ | 更新 |
| --- | --- | --- | --- | --- |
| [droidrun/mobile-jev](https://github.com/droidrun/mobile-jev) | 在真机 Android 手机上运行相同循环；演示中 21 秒内完成九个 Uber 操作。 | javascript · mit | 426 | 2026-09-17 |
| [ainame/swift-typesafe](https://github.com/ainame/swift-typesafe) | 在 Apple 平台和 Linux 上遵循 Python SDK 的 API 的 Swift 6.4 SDK。 | swift · mit | 16 | 2026-09-23 |
| [friedjof/jev-mobile](https://github.com/friedjof/jev-mobile) | 通过 USB 运行的 Android 子智能体，依次执行 observe、normalize、decide、mutate、verify，并由 Jev 进行决策。 | python · mit | 8 | 2026-09-18 |
| [xinwang-nwpu/jev-mobile](https://github.com/xinwang-nwpu/jev-mobile) | Android 自动化，其中单个 Jev 请求同时从无障碍树中选择操作和目标元素，并通过 ADB 执行。 | python · mit | 3 | 2026-09-21 |

## 🔎 搜索、重排与 RAG

查询理解、来源选择、重排与语义 SQL。 _(13 项)_

| 项目 | 说明 | 语言 / 许可 | ⭐ | 更新 |
| --- | --- | --- | --- | --- |
| [superagents-lab/jev-search](https://github.com/superagents-lab/jev-search) | 用于网络搜索的来源选择、查询理解和相关性排序。 | typescript · mit | 493 | 2026-09-20 |
| [jexp/neo4jev](https://github.com/jexp/neo4jev) | 通过分类相邻关系遍历 Neo4j 图谱。 | jupyter notebook · mit | 154 | 2026-09-18 |
| [uehaj/jev-semgrep](https://github.com/uehaj/jev-semgrep) | 按语义而非正则进行 grep：每一行都从 Jev 获得一个概率，语义可通过 AND、OR 和 NOT 组合。 | javascript · noassertion | 145 | 2026-09-30 |
| [ellipsis-dev/blink](https://github.com/ellipsis-dev/blink) | 由 Jev 为候选项打分的代码库搜索。 | typescript | 93 | 2026-09-16 |
| [kbhuw/jev-sift](https://github.com/kbhuw/jev-sift) | 对一批文件、URL 或片段的相关性打分的 MCP 工具，让智能体只打开重要的内容。 | javascript | 48 | 2026-09-18 |
| [hev/reranker](https://github.com/hev/reranker) | 作为经校准的重排器的 Jev：单次调用，最多 30 个文档，每个文档一个概率。 | python · apache-2.0 | 15 | 2026-09-17 |
| [reachjalil/jev-tree](https://github.com/reachjalil/jev-tree) | 在分类体系上做递归选择，突破 255-option 上限。 | typescript · mit | 10 | 2026-09-18 |
| [WiktorB2004/llama-index-jev](https://github.com/WiktorB2004/llama-index-jev) | LlamaIndex 重排器和路由器，比 LLM 评判更便宜。 | python · mit | 9 | 2026-09-25 |
| [kylemclaren/jev-search](https://github.com/kylemclaren/jev-search) | 一个 shadcn/ui 注册块：首次按键即显示关键词命中，稍后由 Jev 重新排序，若调用失败则保留关键词顺序。 | typescript · mit | 9 | 2026-09-23 |
| [AkashPriyadarshii/jev-scout](https://github.com/AkashPriyadarshii/jev-scout) | 为自然语言请求查找真实可维护的 repo 和 crate 的 Rust CLI 和 MCP 服务器，由 Jev 对候选结果评分。 | rust · mit | 6 | 2026-09-30 |
| [kylemclaren/jevpdf](https://github.com/kylemclaren/jevpdf) | 在浏览器中按语义搜索 PDF：pdf.js 在本地提取文本行，Jev 以每批 16 行的方式逐行回答一个 Noul，匹配行按概率排名逐页高亮显示。 | typescript · mit | 5 | 2026-09-23 |
| [mttrbrts/jev-folio-recursive-classifier](https://github.com/mttrbrts/jev-folio-recursive-classifier) | Classifies OCR'd legal agreements through the FOLIO Document Types ontology with recursive Jev Choices, beam search, confidence-gated leaf stopping, and context-length benchmarking. | python · apache-2.0 | 1 | 2026-09-19 |
| [liou666/senseek](https://github.com/liou666/senseek) | Browser extension that searches the page you are reading by meaning, in a Ctrl+F style box, with your own key and no backend. | javascript | 0 | 2026-09-21 |

## 🛡️ 安全、审核与校验

护栏、提示注入检测、可弃权的判官。 _(14 项)_

| 项目 | 说明 | 语言 / 许可 | ⭐ | 更新 |
| --- | --- | --- | --- | --- |
| [leepokai/jev-guard](https://github.com/leepokai/jev-guard) | 适用于 Claude Code、Codex、Cursor、Gemini CLI、Pi 和 OpenCode 的自动模式：将每次工具调用风险评分为 deny、ask 或 allow，并标记结果中的 prompt injection。 | javascript · mit | 48 | 2026-09-28 |
| [brainstormity/Jev-Moderation-Bot](https://github.com/brainstormity/Jev-Moderation-Bot) | 带可编辑规则的聊天审核。 | python · mit | 48 | 2026-09-22 |
| [DanRWilloughby/snifftest](https://github.com/DanRWilloughby/snifftest) | 针对 AI 写作痕迹的散文检查器：可数规则加一个判断模型。 | typescript · mit | 34 | 2026-09-18 |
| [luantak/is-malicious](https://github.com/luantak/is-malicious) | 在运行前扫描代码库中的隐藏行为或数据窃取行为；干净的报告并非证明，它对此有明确说明。 | typescript · mit | 33 | 2026-09-23 |
| [MarissaFamularo/citation-verifier](https://github.com/MarissaFamularo/citation-verifier) | 被引论文是否支持引用它的句子？Claude查找引文，Jev评分，由人工决定。 | javascript · mit | 11 | 2026-09-17 |
| [scale-venture-partners/riff](https://github.com/scale-venture-partners/riff) | 用于写作的 Ruff 风格规则代码。 | python · mit | 7 | 2026-09-29 |
| [caiovicentino/jev-shield](https://github.com/caiovicentino/jev-shield) | 筛查每次工具调用、结果和描述的语义 MCP 防火墙；拦截召回率为 94%，每次检查费用约 $0.00002。 | javascript · mit | 4 | 2026-09-17 |
| [noelzappy/tripwire](https://github.com/noelzappy/tripwire) | 在用户看到每个 LLM 响应之前运行七项 Jev 检查的 AI SDK 中间件和代理；暂无准确率数据，并已如实说明。 | typescript · mit | 4 | 2026-09-18 |
| [teyhouse/jev-secret-detection](https://github.com/teyhouse/jev-secret-detection) | 衡量 Jev 在文件片段中发现真实凭证的能力，其中难以区分的 config 形态用例单独评分。 | python | 3 | 2026-09-18 |
| [santos-sanz/jev-audio-beeper](https://github.com/santos-sanz/jev-audio-beeper) | 低延迟音频审查概念验证：Jev 类型化决策驱动 ffmpeg。 | typescript | 3 | 2026-09-17 |
| [asfarsadewa/human-compiler](https://github.com/asfarsadewa/human-compiler) | Paste text, get diagnostics, like a compiler for prose. | typescript · mit | 2 | 2026-09-17 |
| [DansiDanutz/fake-real-jev](https://github.com/DansiDanutz/fake-real-jev) | Checks claims against cited excerpts with Jev in an English and Romanian fact-checking site, with a public integration example and a closed-source full application. | javascript · mit | 1 | 2026-09-26 |
| [paulgoodchild/SkillsCheck](https://github.com/paulgoodchild/SkillsCheck) | Sends an agent skill's text to Jev before installation and returns a verdict with category scores, without loading the skill into the agent's context; the submitted text is not redacted for secrets. | javascript | 0 | 2026-09-21 |
| [hteariH/stopspam-jev-bot](https://github.com/hteariH/stopspam-jev-bot) | Telegram bot that removes spam and scam messages from group chats on calibrated-confidence classification. | python | 0 | 2026-09-21 |

## 🗄️ 数据与运维

会调用 Jev 的 Postgres 扩展、语义 SQL 与遥测管道。 _(20 项)_

| 项目 | 说明 | 语言 / 许可 | ⭐ | 更新 |
| --- | --- | --- | --- | --- |
| [kyotofin/tax-doc-classifier](https://github.com/kyotofin/tax-doc-classifier) | 每页一次请求，在 261 种 IRS 表格和七种页面类型中选择；在其语料上报告 100% 准确率，每页 $0.001，比其取代的 LLM 流水线便宜 34 倍。 | typescript · apache-2.0 | 484 | 2026-09-29 |
| [realZachi/pg-jev](https://github.com/realZachi/pg-jev) | 回答关于数据表的自然语言问题的 PostgreSQL 扩展。 | shell · noassertion | 381 | 2026-09-18 |
| [AgriciDaniel/jev-seo](https://github.com/AgriciDaniel/jev-seo) | 抓取网站并依据 52 条 SEO 规则检查，由 Jev 评估每个页面，并生成 PDF、电子表格和 Markdown 报告。 | python · mit | 266 | 2026-09-22 |
| [AkashPriyadarshii/jev-curate](https://github.com/AkashPriyadarshii/jev-curate) | 以每秒超过 1,500 行的速度筛选 Parquet 和 JSONL 训练数据。 | rust · mit | 92 | 2026-09-30 |
| [giuliosmall/pg_typesafe](https://github.com/giuliosmall/pg_typesafe) | 使用 Jev 进行分类的 pre-alpha PostgreSQL 扩展。 | c · mit | 88 | 2026-09-24 |
| [AboveColin/HA-Jev](https://github.com/AboveColin/HA-Jev) | Home Assistant 集成：询问有关房屋的问题，以实体形式获取概率、选项或评分。 | python · mit | 69 | 2026-09-30 |
| [choxos/jev-reviewer](https://github.com/choxos/jev-reviewer) | 通过语音、文本或 questions file 向临床试验报告索取系统评价数据；每个答案都是附带文件和位置的逐字引用。 | javascript · mit | 38 | 2026-09-19 |
| [chenmingtang830/jevgraph](https://github.com/chenmingtang830/jevgraph) | 在本地解析 PDF、DOCX、PPTX 或文本，然后针对每个候选实体对向 Jev 提出一个封闭集关系问题，并将带有每条边概率和页面证据的图谱导出为 JSON、CSV 或 Neo4j。 | python · apache-2.0 | 31 | 2026-09-20 |
| [colliber/duckdb-jev](https://github.com/colliber/duckdb-jev) | 向每一行提问并返回真实 SQL 类型的 DuckDB 扩展。 | c++ · mit | 28 | 2026-09-18 |
| [chopratejas/invalidate](https://github.com/chopratejas/invalidate) | 为每条存储的智能体记忆设置租约，并询问 Jev 新证据是否结束该租约；[live demo](https://invalidate-playground.vercel.app)。 | python · apache-2.0 | 23 | 2026-09-21 |
| [reachjalil/jevlogs](https://github.com/reachjalil/jevlogs) | 在为 LLM 分析付费之前对 OpenTelemetry 日志信号进行评分。 | javascript · mit | 17 | 2026-09-22 |
| [kylemclaren/jevql](https://github.com/kylemclaren/jevql) | 面向 PostgreSQL 的语义 SQL，由 Jev 回答谓词。 | go · mit | 15 | 2026-09-19 |
| [collapseindex/jev-ultralightspeed](https://github.com/collapseindex/jev-ultralightspeed) | 将32个条目打包进单次请求进行批量分类，并校准置信度阈值以将最不确定的行转交人工处理，报告称每秒处理533个条目，与人工标注的一致率为89.2%。 | python · noassertion | 12 | 2026-09-22 |
| [keltokhy/jlink](https://github.com/keltokhy/jlink) | 用纯英语编写的匹配规则，从 Python、shell、Stata 或 R 链接两个数据集的记录，并在 NBER 专利受让人与 Compustat 上报告 F1 为 0.73，对调优字符串匹配的 0.69。 | python · mit | 7 | 2026-09-28 |
| [EugeneBoondock/jevsql](https://github.com/EugeneBoondock/jevsql) | 在 SQLite 上支持自然语言谓词的 SQL，按语义过滤、排序和分类行数据，采用批量处理并带有成本保护。 | javascript · mit | 6 | 2026-09-19 |
| [Foadsf/jev-for-engineers](https://github.com/Foadsf/jev-for-engineers) | 来自机械与电气工程的八个小示例：CAD 布线、FEM 分诊、DFM 筛查、BOM 对齐。 | python · mit | 6 | 2026-09-16 |
| [Query-farm/vgi-typesafe](https://github.com/Query-farm/vgi-typesafe) | 将 choice、noul 和 score 作为可在 SQL 中横向连接的表函数暴露的 DuckDB worker。 | python · mit | 5 | 2026-09-19 |
| [mgaitan/sqlite-jev](https://github.com/mgaitan/sqlite-jev) | 通过可加载的 C 扩展和 Python 封装器为 SQLite 添加 Jev Noul、Choice 和 Score 判断，支持标量函数和批量虚拟表查询。 | c | 4 | 2026-09-18 |
| [opaielsheikh/typesafe-migration-guard](https://github.com/opaielsheikh/typesafe-migration-guard) | 在数据库迁移运行前审查其安全性。 | typescript | 3 | 2026-09-17 |
| [ddfeyes/jev-mode](https://github.com/ddfeyes/jev-mode) | 基于类型化判断模型的工单分诊和文件打标；报告 tokens 减少 78%，准确率为 96.1%，基线为 93.7%。 | python · mit | 3 | 2026-09-18 |

## 📦 应用与扩展

真正每天会打开的终端产品。 _(29 项)_

| 项目 | 说明 | 语言 / 许可 | ⭐ | 更新 |
| --- | --- | --- | --- | --- |
| [anishfn/shapeshift](https://github.com/anishfn/shapeshift) | 在输入时将单个文本框转为匹配卡片，由一次并行 Jev 调用判定，未设置 key 时回退到关键词。 | typescript · mit | 752 | 2026-09-23 |
| [kitze/unclutter](https://github.com/kitze/unclutter) | 使用可复用模板规则清除页面杂乱内容的浏览器扩展。 | typescript · mit | 341 | 2026-09-18 |
| [FerryCorleone/crush-monitor](https://github.com/FerryCorleone/crush-monitor) | 在本地读取聊天记录，并为每条消息标注十二种情绪和三十五种意图中最可能的三个。 | typescript · mit | 262 | 2026-09-25 |
| [monteduro/killmyidea](https://github.com/monteduro/killmyidea) | 描述你的创业想法；Jev 会判断该扼杀、修正还是发布。 | typescript | 244 | 2026-09-24 |
| [usenotra/notra](https://github.com/usenotra/notra) | 将工作转化为内容，由 Jev 决定值得发布的内容。 | typescript · agpl-3.0 | 226 | 2026-09-30 |
| [wquguru/dasheng](https://github.com/wquguru/dasheng) | 朗读英语并查看评分：流式 ASR 负责聆听，Jev 逐词评判，总分由代码中的算术计算得出。 | javascript | 144 | 2026-09-20 |
| [trungdq88/youtube-sponsor-detection](https://github.com/trungdq88/youtube-sponsor-detection) | Chrome 扩展，从字幕文本或实时音频中查找赞助口播并跳过；代码掌控所有时间戳，转录模式下每小时不到一美分。 | javascript | 109 | 2026-09-18 |
| [kevinbadi/jev-voice](https://github.com/kevinbadi/jev-voice) | 与 macOS 对话：本地 whisper.cpp 转录，一次扇出的 Jev 调用选择操作及其带类型的参数，代码负责执行。 | python · mit | 106 | 2026-09-23 |
| [w3cj/jev-chat](https://github.com/w3cj/jev-chat) | 聊天形态的命令栏，其中 Jev 选择工具、参数和回复形状，代码根据工具自身数据构建答案，因此没有模型撰写文本。 | typescript · mit | 105 | 2026-09-18 |
| [ChetasLua/jevmeter](https://github.com/ChetasLua/jevmeter) | 为任意视频加上实时仪表：每句话按五个问题打分，渲染为 16:9 剪辑，一场完整辩论约两美分。 | python · mit | 103 | 2026-09-17 |
| [fazlerocks/jevmail](https://github.com/fazlerocks/jevmail) | 只读 Gmail 分拣，每条消息经三个 Jev 问题分入五个托盘之一并给出紧急度评分。 | typescript · mit | 92 | 2026-09-19 |
| [realZachi/typesafe-adblock](https://github.com/realZachi/typesafe-adblock) | 按每个 DOM 节点询问 is this element an ad 的 Chrome 扩展，这只是个玩具，它自己也是这么说的。 | javascript · mit | 88 | 2026-09-17 |
| [AkashPriyadarshii/jev-seo](https://github.com/AkashPriyadarshii/jev-seo) | 基于 DuckDuckGo 结果进行 SEO 和 GEO 检查的 Rust CLI 和 MCP server，由 Jev 评分。 | rust · mit | 86 | 2026-09-30 |
| [RafalWilinski/vibecheck](https://github.com/RafalWilinski/vibecheck) | 在点击发布前对你的 X 帖子进行 vibe-check。 | javascript | 49 | 2026-09-20 |
| [parth-kp/jev-mail-classifier](https://github.com/parth-kp/jev-mail-classifier) | 配置驱动的收件箱分类，可打标签、移动、标记和通知，经由 TypeSafe 直接处理或经由 OpenRouter 处理。 | python · mit | 19 | 2026-09-20 |
| [kevthetech143/super-jev](https://github.com/kevthetech143/super-jev) | 连接证据、Jev 判定、许可操作和已验证结果的小型工具框架。 | python · mit | 14 | 2026-09-30 |
| [manifoldor/xtags](https://github.com/manifoldor/xtags) | 为你X时间线中的每篇帖子标注它想让你做什么。 | javascript · mit | 12 | 2026-09-27 |
| [gtaras7/typesafe-jev](https://github.com/gtaras7/typesafe-jev) | Jev 实验，从本地 CV-screening 工作台起步，每个实验均附带各自的实测结果。 | typescript · mit | 10 | 2026-09-27 |
| [harshil1712/slidepilot](https://github.com/harshil1712/slidepilot) | 为 Cloudflare Agents 上运行的 Slidev 提供语音驱动的自动翻页。 | typescript · mit | 9 | 2026-09-22 |
| [valentynkit/jev.nvim](https://github.com/valentynkit/jev.nvim) | Neovim 插件：用自然语言向缓冲区提问，Treesitter 将其拆分为函数，Jev 为每个函数打分，答案按概率排序后进入 quickfix。 | lua · mit | 9 | 2026-09-19 |
| [andrelandgraf/safer-with-jev](https://github.com/andrelandgraf/safer-with-jev) | 带有 Jev 路由前置的 Neon AI Gateway 用 Neon Function 代理。 | typescript | 6 | 2026-09-18 |
| [valentynkit/jev-skip](https://github.com/valentynkit/jev-skip) | 读取字幕轨道并在片头结束前在进度条上绘制每段赞助概率的浏览器扩展，无需众包数据库；在 23 个视频上以每个视频 $0.0008 的成本捕获了 SponsorBlock 77% 的赞助秒数。 | typescript · mit | 6 | 2026-09-19 |
| [chris-wozniczek/jev-voice-control](https://github.com/chris-wozniczek/jev-voice-control) | 将语音命令转换为 Jev 类型化决策和 macOS 操作的菜单栏 Swift 应用。 | swift · mit | 5 | 2026-09-21 |
| [hellogumbo/should-ai-kill-us-all](https://github.com/hellogumbo/should-ai-kill-us-all) | 每十分钟使用真实头条新闻向 Jev 提出该问题。 | javascript · cc0-1.0 | 4 | 2026-09-18 |
| [sriganesh/jevibe-check](https://github.com/sriganesh/jevibe-check) | 为 Bluesky 帖子和草稿提供实时语气标签。 | javascript · mit | 3 | 2026-09-17 |
| [phureewat29/jev-got](https://github.com/phureewat29/jev-got) | Game of Thrones 角色扮演，故事模型编写每个场景，Jev 回答五个类型化问题以驱动标题、配乐、插画和下一个提示。 | typescript | 3 | 2026-09-19 |
| [hazlema/jev-riffs](https://github.com/hazlema/jev-riffs) | 从 MIDI 旋律中挖掘重复动机，在一次批量 Jev 调用中为每个候选评分，并在钢琴卷帘上高亮并播放优胜者；在管弦乐 Swan Lake 中，排名第一的动机是天鹅主题。 | typescript · mit | 3 | 2026-09-25 |
| [thenewpotato/privacy-facts](https://github.com/thenewpotato/privacy-facts) | Turns privacy policies into nutrition-style labels with plain-language answers, Jev confidence scores, and suggested source clauses. | javascript · mit | 2 | 2026-09-18 |
| [0xShin0221/openpoke-meets-jev](https://github.com/0xShin0221/openpoke-meets-jev) | OpenPoke fork that moves email screening, a tool-call guardrail, and search reranking onto Jev, with an A/B against the Sonnet call it replaced and an adversarial run on the injection gate. | python · mit | 1 | 2026-09-20 |

## 🧩 SDK 与社区客户端

官方 SDK 未覆盖语言的社区客户端。 _(32 项)_

| 项目 | 说明 | 语言 / 许可 | ⭐ | 更新 |
| --- | --- | --- | --- | --- |
| [pithings/advocaat](https://github.com/pithings/advocaat) | 用于询问自有数据的小型 TypeScript 客户端。 | typescript · mit | 97 | 2026-09-18 |
| [milvus-io/milvus-model](https://github.com/milvus-io/milvus-model) | Reranker 软件包，其 Jev adapter 在一次请求中将每个候选文档作为 Noul question 发送，按返回概率排序并保留原始索引；随 v0.3.4 版本发布。 | python · apache-2.0 | 61 | 2026-09-23 |
| [obie/ruby_decision_model](https://github.com/obie/ruby_decision_model) | 通过统一接口支持 OpenRouter 和 TypeSafe 提供商的 Ruby 决策模型客户端，仅使用标准库。 | ruby · mit | 52 | 2026-09-18 |
| [dannote/jev](https://github.com/dannote/jev) | 为 OTP 构建的 Elixir 客户端：从 GenServer 回复 Jev 并对答案进行模式匹配。 | elixir · mit | 35 | 2026-09-26 |
| [kieranklaassen/ruby_llm-typesafe](https://github.com/kieranklaassen/ruby_llm-typesafe) | 作为 RubyLLM 2 结构化输出提供者的 TypeSafe。 | ruby · mit | 19 | 2026-09-29 |
| [Twister915/typesafe-ai](https://github.com/Twister915/typesafe-ai) | TypeSafe AI 官网、waitlist 与产品总览 | rust · apache-2.0 | 14 | 2026-09-16 |
| [saibimajdi/typesafeai-dotnet-sdk](https://github.com/saibimajdi/typesafeai-dotnet-sdk) | 提供类型化 Noul、Choice 和 Score 问答的社区 .NET SDK。 | c# · mit | 13 | 2026-09-29 |
| [Premo-Cloud/typesafe-sdk-java](https://github.com/Premo-Cloud/typesafe-sdk-java) | Java 客户端。 | java · mit | 11 | 2026-09-25 |
| [pambrose/jev4k](https://github.com/pambrose/jev4k) | Kotlin DSL 和客户端。 | kotlin · apache-2.0 | 11 | 2026-09-28 |
| [Tangerg/typesafe-sdk-go](https://github.com/Tangerg/typesafe-sdk-go) | 无第三方依赖的 Go SDK。 | go · mit | 10 | 2026-09-19 |
| [jomatsu/zod-jev](https://github.com/jomatsu/zod-jev) | 带语义规则的 Zod 4 模式：形状检查保留在 Zod 中，含义检查通过一次请求发送给 Jev 并作为 Zod issues 返回。 | typescript · mit | 9 | 2026-09-17 |
| [joshmn/typesafe-sdk](https://github.com/joshmn/typesafe-sdk) | Ruby 客户端。 | ruby · mit | 8 | 2026-09-26 |
| [inanna-malick/jev-dsl](https://github.com/inanna-malick/jev-dsl) | 带类型化数据包和推断答案类型的 Haskell DSL。 | haskell · mit | 8 | 2026-09-18 |
| [gilljon/typesafe-ai-rs](https://github.com/gilljon/typesafe-ai-rs) | 独立的异步和阻塞式 Rust SDK。 | rust · mit | 7 | 2026-09-17 |
| [Gaurav-Gosain/jev-go](https://github.com/Gaurav-Gosain/jev-go) | 返回类型化判断和概率的 Go 客户端。 | go · mit | 6 | 2026-09-16 |
| [jamesward/zio-typesafe-ai](https://github.com/jamesward/zio-typesafe-ai) | 基于 ZIO 的 Scala 客户端。 | scala · apache-2.0 | 6 | 2026-09-23 |
| [Stumble/jev-go](https://github.com/Stumble/jev-go) | 适用于 Jev 的 Go 客户端。 | go · mit | 6 | 2026-09-18 |
| [nshkrdotcom/typesafe_sdk](https://github.com/nshkrdotcom/typesafe_sdk) | 带有 TypeSafe provider 的 TypeScript AI SDK 的 Elixir 移植版。 | elixir · mit | 6 | 2026-09-20 |
| [alterhq/typesafe-sdk-swift](https://github.com/alterhq/typesafe-sdk-swift) | Swift 客户端。 | swift · mit | 5 | 2026-09-15 |
| [zhirschtritt/typesafe-go](https://github.com/zhirschtritt/typesafe-go) | 面向 TypeSafe API 的惯用 Go SDK。 | go · mit | 4 | 2026-09-29 |
| [Butochnikov/laravel-typesafe-jev](https://github.com/Butochnikov/laravel-typesafe-jev) | 集成 Laravel，提供类型化响应、异步请求和测试替身。 | php · mit | 4 | 2026-09-17 |
| [Hawxy/TypeSafeAI.Net](https://github.com/Hawxy/TypeSafeAI.Net) | .NET SDK。 | c# · apache-2.0 | 4 | 2026-09-19 |
| [mateonunez/jod](https://github.com/mateonunez/jod) | 基于 Jev 的 Zod 风格 schema，先在本地验证状态，再投射类型化答案。 | typescript · mit | 4 | 2026-09-17 |
| [GenieRobot/typesafe-ai-rails](https://github.com/GenieRobot/typesafe-ai-rails) | 基于社区 Ruby gem 构建的 Rails 集成。 | ruby · mit | 4 | 2026-09-16 |
| [steven-shoemaker/hunch](https://github.com/steven-shoemaker/hunch) | 将 Choice、Score 和 Noul 问题转换为处理列表和 DataFrames 的 Python 函数，支持去重、缓存、将不确定行升级到受相同标签约束的 LLM，并在 npm 上提供 TypeScript 移植版 hunch-jev。 | python · mit | 4 | 2026-09-22 |
| [AboveColin/jevclient](https://github.com/AboveColin/jevclient) | 异步 Python 客户端，直接输出概率和选项，无需解析文本。 | python · mit | 3 | 2026-09-21 |
| [Butochnikov/typesafe-sdk-php](https://github.com/Butochnikov/typesafe-sdk-php) | PHP client with sync calls, Guzzle promises, and PSR-3 logging. | php · mit | 3 | 2026-09-17 |
| [AbdelStark/s1-rs](https://github.com/AbdelStark/s1-rs) | Turns Rust enums and structs into Choice, Score, and Noul questions with compile-time-checked, confidence-gated answers. | rust · mit | 2 | 2026-09-16 |
| [AbdelStark/typesafe-rs](https://github.com/AbdelStark/typesafe-rs) | Latency-first Rust client, on crates.io. | rust · mit | 2 | 2026-09-16 |
| [DomMonte/n8n-nodes-typesafe-ai](https://github.com/DomMonte/n8n-nodes-typesafe-ai) | n8n community node for yes/no, choice, and score questions. | typescript · mit | 1 | 2026-09-21 |
| [kunobi-ninja/kunobi-jev](https://github.com/kunobi-ninja/kunobi-jev) | Rust client for the System One API. | rust · apache-2.0 | 1 | 2026-09-24 |
| [bariskisir/JevSharp](https://github.com/bariskisir/JevSharp) | .NET 10 SDK for Jev decisions through TypeSafe, OpenRouter, Vercel AI Gateway, and compatible endpoints. | c# · mit | 0 | 2026-09-24 |

## ⌨️ 命令行

直接在终端里调用 Jev，无需 SDK。 _(14 项)_

| 项目 | 说明 | 语言 / 许可 | ⭐ | 更新 |
| --- | --- | --- | --- | --- |
| [dzhng/jevgrep](https://github.com/dzhng/jevgrep) | 通过询问 Jev 哪些声明能回答关于该仓库的自然语言问题，为编码智能体找到所需的文件、声明和原文摘录。 | typescript · mit | 1,853 | 2026-09-29 |
| [dorkitude/webctl](https://github.com/dorkitude/webctl) | 为智能体搜索网络，并对结果和页面分块进行 Jev 评分与去重，因此只有相关文本会传给模型。 | go · mit | 150 | 2026-09-23 |
| [keltokhy/jgrep](https://github.com/keltokhy/jgrep) | 打印符合纯英语描述的行，在支出上限下从 `tail -f` 流式读取，并在 SMS 垃圾短信上报告 F1 为 0.91，而关键词 grep 为 0.72。 | python · mit | 132 | 2026-09-28 |
| [mrnugget/jev-shell-history](https://github.com/mrnugget/jev-shell-history) | Fish 风格的 zsh 历史建议，按 Jev 排序。 | typescript | 116 | 2026-09-18 |
| [sharziki/semdecide](https://github.com/sharziki/semdecide) | 面向 Unix 管道和 CI 的类型化语义决策。 | python · mit | 74 | 2026-09-16 |
| [shiftynick/jev-axi](https://github.com/shiftynick/jev-axi) | 面向智能体和人类的 shell 动词：pick、rate、check、rank、triage、guard。 | typescript · mit | 26 | 2026-09-24 |
| [Nasrallah-AL/jev-cli](https://github.com/Nasrallah-AL/jev-cli) | 将密钥存于 OS keychain 的 npm CLI；通过 shell 输出类型化判断。 | typescript · mit | 23 | 2026-09-27 |
| [tumf/jev-cli](https://github.com/tumf/jev-cli) | 无依赖的 Python CLI，封装 Choice、Score 和 Noul。 | python · mit | 14 | 2026-09-23 |
| [cristianoliveira/jeq](https://github.com/cristianoliveira/jeq) | 通过 map、reduce、rank 和 rate 在 JSON 和 NDJSON 上管道化并组合 Jev 判断，再经显式 offline gate 应用策略。 | go · mit | 10 | 2026-09-27 |
| [sufianetaouil/every](https://github.com/sufianetaouil/every) | 向代码库中每个函数询问是否问题；模式为问题的 grep。 | python · mit | 8 | 2026-09-17 |
| [y0usaf/typesafe-cli](https://github.com/y0usaf/typesafe-cli) | 从 shell 以数字形式返回 Noul、choice 和 score 答案。 | typescript · mit | 5 | 2026-09-19 |
| [jtsang4/jev-cli](https://github.com/jtsang4/jev-cli) | 输入类型化问题，输出结构化 JSON 答案。 | typescript · mit | 4 | 2026-09-18 |
| [jexp/watfile](https://github.com/jexp/watfile) | Sorts PDFs and text files into category folders, one Jev Choice per document, with a local Laya backend as the alternative. | python | 2 | 2026-09-21 |
| [allebee/jevgrep](https://github.com/allebee/jevgrep) | Filters log lines and other text streams by meaning, one Noul per line in micro-batches, streaming from `tail -f` with grep's flags and exit codes. | python · mit | 1 | 2026-09-21 |

## 📊 基准、评测与校准

先度量，再信任。 _(27 项)_

| 项目 | 说明 | 语言 / 许可 | ⭐ | 更新 |
| --- | --- | --- | --- | --- |
| [sutro-sh/jev-align](https://github.com/sutro-sh/jev-align) | 找出 Jev 函数最不确定的样本，请你标注，并用 GEPA 改进该函数。 | python · apache-2.0 | 301 | 2026-09-20 |
| [fstandhartinger/jevbench](https://github.com/fstandhartinger/jevbench) | 面向 Jev 级决策模型的基准测试：输入有界评分标准，输出带每个选项概率的类型化答案，级联和委员会实验分别报告。 | python · mit | 186 | 2026-09-29 |
| [vinilana/jev-eval-agent](https://github.com/vinilana/jev-eval-agent) | 带 100 个模拟工具的个人助理智能体，用于测量经 Jev 门控的智能体所需步数。 | html | 107 | 2026-09-17 |
| [openlayer-ai/jevals](https://github.com/openlayer-ai/jevals) | 将某个 trace 的 agent、质量和安全评估作为一批类型化 Jev 问题运行，而非单独的 LLM-judge 调用。 | python · mit | 97 | 2026-09-24 |
| [pinecone-io/cultivar](https://github.com/pinecone-io/cultivar) | Pinecone 的技能测试 CLI，搭配 Jev 评分后端，据称比 LLM grader 便宜约 30 倍。 | python · mit | 41 | 2026-09-18 |
| [AbdelStark/jev-benchmarks](https://github.com/AbdelStark/jev-benchmarks) | 面向类型化决策模型的概率感知评估：校准、选择性风险、延迟，可复现。 | python · apache-2.0 | 21 | 2026-09-17 |
| [AntonioCoppe/jev-harness](https://github.com/AntonioCoppe/jev-harness) | 提供置信度门控、影子模式、配方和评测，在相同行过滤任务上报告 Claude CLI 为 48.9 s，Jev 为 1.3 s。 | typescript · mit | 16 | 2026-09-25 |
| [abhixhek/jevcal](https://github.com/abhixhek/jevcal) | 停止猜测阈值：对照 LLM teacher 进行校准、阈值划分和漂移检查。 | python · mit | 11 | 2026-09-18 |
| [jmanhype/jev-dspy-lab](https://github.com/jmanhype/jev-dspy-lab) | 面向 DSPy 中 Jev 决策的可复现校准和选择性风险基准测试。 | python · mit | 11 | 2026-09-20 |
| [zhuyansen/jev-search-rerank-eval](https://github.com/zhuyansen/jev-search-rerank-eval) | 用 9,831 个评分样本并测得 judge-circularity 偏差，来验证 Jev rerank 是否优于 embedding search。 | python · mit | 10 | 2026-09-18 |
| [anessbelbati/jev-rerank-bench](https://github.com/anessbelbati/jev-rerank-bench) | 在 14 个数据集上将 Jev 与 Cohere Rerank、ZeroEntropy 和 chat 基线对比，并包含原始响应。 | python · mit | 9 | 2026-09-25 |
| [anisselbd/jev-phishing-bench](https://github.com/anisselbd/jev-phishing-bench) | 在 2,000 封钓鱼邮件上对比 Jev 与 Claude Haiku：准确率、校准、延迟、成本。 | python | 8 | 2026-09-19 |
| [mahlernim/jev-korean-benchmark](https://github.com/mahlernim/jev-korean-benchmark) | 韩语理解和医疗文本，附运行时和成本证据。 | python | 7 | 2026-09-17 |
| [wondertwins/jev-benchmark](https://github.com/wondertwins/jev-benchmark) | 两个基准测试，象棋和捕食者识别，一个在 Jev 擅长范围内，一个在外，均附结果。 | python · mit | 7 | 2026-09-16 |
| [Gaurav-Gosain/jev-sec-bench](https://github.com/Gaurav-Gosain/jev-sec-bench) | 针对提示注入和易受攻击代码检测的盲测基准。 | go · mit | 4 | 2026-09-16 |
| [TokenTrim/jev-agent-failure-benchmark](https://github.com/TokenTrim/jev-agent-failure-benchmark) | 在 Who and When 智能体失败归因基准上对比 Jev 与强 LLM 的表现。 | python · apache-2.0 | 4 | 2026-09-17 |
| [RINNECODER/jev-behavior-study](https://github.com/RINNECODER/jev-behavior-study) | 在 jev-1.13.0 上进行的受控提示实验，包含原始结果和离线验证。 | python · mit | 4 | 2026-09-17 |
| [chenmingtang830/jevarena](https://github.com/chenmingtang830/jevarena) | 将 Jev 与你接入的对手裁判进行对比的托管竞技场，在揭晓身份前收集你的投票，并提供延迟、成本来源和自报告置信度；投票仅记录偏好，而非验证后的正确性。 | typescript · apache-2.0 | 4 | 2026-09-20 |
| [bitnovus/jev-spam-eval](https://github.com/bitnovus/jev-spam-eval) | 使用 Noul 问题进行零样本垃圾邮件过滤，并与 TF-IDF 基线对比。 | jupyter notebook · mit | 3 | 2026-09-18 |
| [PistachioAIHQ/jev-synergy-screening](https://github.com/PistachioAIHQ/jev-synergy-screening) | 使用 Choice 和 Noul 问题按 ASReview SYNERGY 金标进行摘要筛选评分。 | python | 3 | 2026-09-16 |
| [jgridifier/jev-research-eval](https://github.com/jgridifier/jev-research-eval) | 基于固定 jev-ultrafast 提交的可复现测试框架，包含基线和压力测试套件。 | html · noassertion | 3 | 2026-09-17 |
| [HackSing/jev-report](https://github.com/HackSing/jev-report) | Independent Chinese research report: 52 pages, 50 reproducible tests, 143 traceable data rows. | python · mit | 2 | 2026-09-17 |
| [hegargarcia/jev-playground](https://github.com/hegargarcia/jev-playground) | Jev against other models in games with explicit states, legal actions, and a measurable outcome. | typescript | 2 | 2026-09-17 |
| [yodablocks/jev-orderby-bench](https://github.com/yodablocks/jev-orderby-bench) | Measures whether ORDER BY over a Jev probability is defensible: pairwise inversion, Score ordinality against a human grade, calibration, and wording invariants under a pre-registered gate; passes on 20 Newsgroups topics, fails four of six conditions on Amazon ESCI product relevance, and shows that a 40-row batched state through a DuckDB extension fails the ranking gate one row per request passes. | python · mit | 1 | 2026-09-20 |
| [4esv/jev-eval](https://github.com/4esv/jev-eval) | Jev against GPT-5.6 Terra on three labeled tasks: equal on the easy ones, 6.7 points lower on 77-way routing, 5 times faster, 41 to 50 times cheaper. | python | 1 | 2026-09-23 |
| [themsquared/jev-benchmark](https://github.com/themsquared/jev-benchmark) | Tool-call risk classification with the run-to-run variance reported; every wrong answer came with hedged confidence. | python · apache-2.0 | 1 | 2026-09-24 |
| [blowxian/jev-fanout-bench](https://github.com/blowxian/jev-fanout-bench) | Measures what a Jev request is billed and how its answers hold up under batching, translation, and rewording, from 3,455 billed requests with public raw logs. | python · mit | 0 | 2026-09-28 |

## 🧠 开源模型与复刻

不依赖厂商也能跑 System One 语义——一块 3090 就够。 _(41 项)_

| 项目 | 说明 | 语言 / 许可 | ⭐ | 更新 |
| --- | --- | --- | --- | --- |
| [jaredpalmer/kev](https://github.com/jaredpalmer/kev) | 基于 Qwen2.5-0.5B 的 LoRA 适配器与读出头，可在单次 prefill 中回答多个类型化问题，在 MacBook 上不到两小时即可完成训练，留出集 ECE 为 0.065，支持 TypeSafe 线路格式。 | python · apache-2.0 | 7,998 | 2026-09-30 |
| [TheoLeeCJ/SemIf](https://github.com/TheoLeeCJ/SemIf) | 在单张 3090 上用开放模型实现语义 if，星标最多的独立复刻版本，曾名为 openjev。 | python · mit | 4,604 | 2026-09-23 |
| [TianyuCodings/NanoJev](https://github.com/TianyuCodings/NanoJev) | 支持并行决策、动态候选和端到端训练流水线的 0.6B 复刻版本。 | python · mit | 2,445 | 2026-09-21 |
| [vinnylarouge/jevlike](https://github.com/vinnylarouge/jevlike) | 读取候选 logits 而非生成 JSON 的开放选项评分器。 | python · mit | 1,335 | 2026-09-16 |
| [ollaya-dev/ollaya](https://github.com/ollaya-dev/ollaya) | 以 Ollama 提供 LLMs 服务的方式，在 TypeSafe 兼容的本地端点后拉取并提供 Laya、kev 和 JevK5 等开放决策模型。 | rust · apache-2.0 | 1,011 | 2026-09-29 |
| [Mapika/decider](https://github.com/Mapika/decider) | 从 Qwen3.5-2B 微调而来的单遍类型化决策。 | python · apache-2.0 | 988 | 2026-09-30 |
| [nokia-applied-research/AnyJev](https://github.com/nokia-applied-research/AnyJev) | 将开放的 Hugging Face 模型转变为经由 vLLM 提供的校准决策端点，前两个层级无需微调。 | python · apache-2.0 | 981 | 2026-09-28 |
| [wfzyx/von](https://github.com/wfzyx/von) | 非自回归开放决策模型，本地延迟低于 15 ms，可作为 Jev 的直接替代品。 | python · apache-2.0 | 781 | 2026-09-30 |
| [Rizzo-AI-Academy/rizzo-flow](https://github.com/Rizzo-AI-Academy/rizzo-flow) | 本地优先的 System One 理念实践：输入非结构化状态，输出类型化概率决策，全程不生成 token。 | python · apache-2.0 | 763 | 2026-09-25 |
| [featherless-ai/simple-jev](https://github.com/featherless-ai/simple-jev) | 从任意 Hugging Face 模型读取 next-token logits，用于 choice、rubric 和 support 问题；公共演示 API，无需密钥。 | python · apache-2.0 | 575 | 2026-09-30 |
| [Liuziyu77/Valen](https://github.com/Liuziyu77/Valen) | 基于 Qwen3.5 的多模态决策模型，结合图像、视频和文本对候选进行评分，并提供训练代码和开放权重。 | python · apache-2.0 | 551 | 2026-09-30 |
| [razorback16/openjev](https://github.com/razorback16/openjev) | 基于 DiffusionGemma 26B、经由 vLLM 的 Jev 兼容决策服务器，包含图像，免费托管在 [Codiv](https://codiv.ai)。 | python · apache-2.0 | 541 | 2026-09-29 |
| [Yinsongxu/LLM2Jev](https://github.com/Yinsongxu/LLM2Jev) | 使本地语言模型适配运行时定义的 Choice、Score 和 Noul 问题，并返回带概率的类型化答案。 | python · apache-2.0 | 377 | 2026-09-26 |
| [ekzhang/openjev-sglang](https://github.com/ekzhang/openjev-sglang) | SGLang 上仅支持 prefill 的 Jev 兼容 API 端点。 | python | 336 | 2026-09-25 |
| [malevrigns/agent-jev](https://github.com/malevrigns/agent-jev) | 基于 Qwen3-0.6B、无需解码词元即可作答的决策模型，在公开 Typed Decisions 基准上 top-1 准确率为 79.25%。 | python · apache-2.0 | 328 | 2026-09-23 |
| [hr98w/jev-visual](https://github.com/hr98w/jev-visual) | 面向 Apple Silicon 的教学用视觉推理变体：共享上下文，直接对候选评分。 | python · mit | 303 | 2026-09-21 |
| [Heman10x-NGU/openJev-verdict-2.0](https://github.com/Heman10x-NGU/openJev-verdict-2.0) | 非自回归 151M 决策引擎，带 WebGPU 浏览器运行时，在自有基准上报告 77.1% top-1 和 1.44% 校准误差。 | python · noassertion | 293 | 2026-09-20 |
| [logan-markewich/jeff](https://github.com/logan-markewich/jeff) | 基于 400M GLiFormer 的自托管 System One API，附说明其在何处落后于 Jev 的基准测试。 | python · mit | 273 | 2026-09-20 |
| [togethercomputer/tev1](https://github.com/togethercomputer/tev1) | 在 Together AI 上将 Qwen3.5-4B 微调为开放权重决策模型的数据配方和训练代码。 | python · mit | 177 | 2026-09-24 |
| [kshetrajna12/reflex](https://github.com/kshetrajna12/reflex) | 基于 Qwen3.5 的小型开放决策模型：状态加类型化问题输出校准概率。 | python · mit | 160 | 2026-09-27 |
| [allebee/jevk5](https://github.com/allebee/jevk5) | 具有蒸馏 LoRA 权重的 Qwen3.5 复制品，在 JevBench v1.4 上 76 个系统中排名第二，在开放系统中排名第一。 | python · apache-2.0 | 126 | 2026-09-28 |
| [daseinlabs/open-jev](https://github.com/daseinlabs/open-jev) | 一次预填充并在 Gemma 3 4B 上用 MLX 以单次填充前向为每个选项打分；演示中从终端运行 Doom。 | python · mit | 121 | 2026-09-30 |
| [mmastrac/djev](https://github.com/mmastrac/djev) | 在 DiffusionGemma 上提供 `/v1/systemone` 服务，通过从固定种子的置顶画布读取带类型的答案和文本片段实现，无需生成。 | python · apache-2.0 | 111 | 2026-09-24 |
| [Heman10x-NGU/Verdict-open-jev](https://github.com/Heman10x-NGU/Verdict-open-jev) | 基于 ModernBERT 的非自回归决策引擎，具有校准的不确定性和浏览器内 WebGPU 演练场。 | python · noassertion | 110 | 2026-09-28 |
| [zwliJay/jev-forge](https://github.com/zwliJay/jev-forge) | 用于可审计数据构建、Qwen3.5-0.8B 训练、固定的 Mind2Web 和 OOD 评估、本地服务以及初步 RLCD 基线的端到端技术栈。 | python · noassertion | 94 | 2026-09-23 |
| [kikoncuo/jevfire](https://github.com/kikoncuo/jevfire) | 通过 vLLM API 为 CUDA LLM 提供并行决策，附带游戏智能体示例和基准测试。 | javascript · mit | 72 | 2026-09-18 |
| [bnsd55/jevmlx](https://github.com/bnsd55/jevmlx) | 在 Apple Silicon 上为任意 MLX 模型提供并行约束决策，仅需一次前向传播。 | python · mit | 69 | 2026-09-25 |
| [r-ms/mini-jev](https://github.com/r-ms/mini-jev) | 在冻结的 Qwen3-4B 上进行的预注册实验：读取选项字母的 logits，跳过 JSON。 | python · mit | 58 | 2026-09-18 |
| [ikermoel/open-alternative-jev](https://github.com/ikermoel/open-alternative-jev) | 一次前向传播即可从任意 open-weights 模型获得类型化、校准的决策，支持 Hugging Face 和 vLLM。 | python · apache-2.0 | 57 | 2026-09-25 |
| [zhengxuyu/litjev](https://github.com/zhengxuyu/litjev) | 将任意现成 LLM 转变为 Jev 风格决策层。 | python · apache-2.0 | 46 | 2026-09-21 |
| [OmniJev/PlayJev](https://github.com/OmniJev/PlayJev) | 在微调的 Qwen3.5-0.8B 上仅凭画面玩十款浏览器游戏，每步一次前向推理，开放权重并提供浏览器演示。 | javascript · apache-2.0 | 45 | 2026-09-24 |
| [JoshuaSP/open-jev](https://github.com/JoshuaSP/open-jev) | 使用 DiffusionGemma 的类型化 JSON 推理，已针对 Jev 进行基准测试。 | python · mit | 43 | 2026-09-16 |
| [iammrduncan/typesafe-ai-benchmark](https://github.com/iammrduncan/typesafe-ai-benchmark) | 模仿 TypeSafe 响应结构的 LLM 网关，可在等待密钥期间用作替代。 | typescript · mit | 40 | 2026-09-19 |
| [mithalouni/system-one-open](https://github.com/mithalouni/system-one-open) | 在 Gemma 4 E2B 和 Gemma 3 270M 上通过单次前向传播输出类型化校准决策。 | python · noassertion | 38 | 2026-09-17 |
| [zhihz/openjev](https://github.com/zhihz/openjev) | 基于上下文、问题和候选答案的双语本地决策。 | python · noassertion | 35 | 2026-09-16 |
| [rorshopping/jev-on-a-laptop](https://github.com/rorshopping/jev-on-a-laptop) | 在笔记本电脑上对原生 1.5B 至 8B 模型中 Jev 式决策的研究，附带 Hugging Face 演示。 | python · noassertion | 25 | 2026-09-17 |
| [olanotolu/jevbetter](https://github.com/olanotolu/jevbetter) | 更强的一遍式评分器，附带与 jevlike 起始设计直接对比的基准测试。 | python · mit | 16 | 2026-09-16 |
| [genai-craft/openvons](https://github.com/genai-craft/openvons) | 用概率回答有限选项集的开放决策层，概率分为 execute、confirm 和 reject。独立复刻，而非 TypeSafe 权重。 | python · noassertion | 14 | 2026-09-21 |
| [amithgc/local-jev](https://github.com/amithgc/local-jev) | 与 System One endpoint 线路兼容的离线服务器，已对照官方 SDK 验证；在 JevBench 公开条目上得分为 80.5%，托管 API 公布的分数为 86.6%。 | python · mit | 13 | 2026-09-21 |
| [David-Lolly/Jev-Compatible](https://github.com/David-Lolly/Jev-Compatible) | 通过对候选 token 评分，将现有 SGLang 或 vLLM 部署转换为 Jev 兼容决策服务的网关，无需训练且无需更改模型。 | python | 6 | 2026-09-21 |
| [metask-ai/metask-jev](https://github.com/metask-ai/metask-jev) | Open-weight typed-decision models on Qwen3.5 with calibrated per-option probabilities in one forward pass; reports 80.1 percent on JevBench against 75.3 for Jev 1.13. | python | 2 | 2026-09-22 |

## 🎮 游戏、机器人与仿真

把决策做成游戏机制。 _(19 项)_

| 项目 | 说明 | 语言 / 许可 | ⭐ | 更新 |
| --- | --- | --- | --- | --- |
| [rmalde/minecraft-agent](https://github.com/rmalde/minecraft-agent) | 在原版服务器上击杀末影龙，由 frontier 模型规划并由 Jev 选择每个玩家动作；记录的一次运行共用了 131 次 Jev 决策和 35 次规划器调用。 | javascript | 569 | 2026-09-20 |
| [fhshaik/typesafe-mario](https://github.com/fhshaik/typesafe-mario) | 基于结构化模拟器状态游玩 Super Mario Bros.；由 Jev 直接选择 NES 手柄输入。 | python | 422 | 2026-09-16 |
| [FBddcz/embodied-jev](https://github.com/FBddcz/embodied-jev) | 面向 MuJoCo 中具身实验的浏览器工作台，每个机器人步骤都是可见的 Jev 决策，由本地模型或云端 API 支持。 | python · mit | 250 | 2026-09-22 |
| [rokbenko/quackd](https://github.com/rokbenko/quackd) | 面向七种机身的 LLM 驾驶机器人的命令行工具，带可选 Jev stepper，可在调用之间选择且从不直接写入关节角度。 | python · apache-2.0 | 245 | 2026-09-30 |
| [RomanSlack/jev-drone](https://github.com/RomanSlack/jev-drone) | 在 MuJoCo 中仅使用摄像头的无人机，Jev 以 2.5 Hz 参与闭环。 | python · mit | 229 | 2026-09-24 |
| [standardagents/jevpilot](https://github.com/standardagents/jevpilot) | Three.js 驾驶模拟器，Jev 每秒最多四次从采样路径中选择转向和速度；[drive it](https://jevpilot.standardagents.ai)。 | javascript | 203 | 2026-09-17 |
| [emrickgarrett/OneVOneJev](https://github.com/emrickgarrett/OneVOneJev) | Three.js 中的 1v1 quickscope 竞技场。 | typescript | 41 | 2026-09-18 |
| [phyous/tsai-sc](https://github.com/phyous/tsai-sc) | 通过键盘和鼠标游玩原版 StarCraft 共享软件，并记录动作概率。 | python · mit | 28 | 2026-09-16 |
| [lukaske/jev-doom-agent](https://github.com/lukaske/jev-doom-agent) | 具有结构化空间状态和实时决策遥测的浏览器原生 Doom 智能体。 | typescript | 28 | 2026-09-17 |
| [sorrycc/typesafe-snake](https://github.com/sorrycc/typesafe-snake) | 每个 tick 一个 Choice；合法走位和事实均在代码中生成。 | typescript | 24 | 2026-09-17 |
| [vinilana/live-jev](https://github.com/vinilana/live-jev) | 在浏览器中运行的俯视视角赛车，每 200 ms 发送四个类型化问题，并在代码中实现基于置信度的覆盖。 | javascript | 21 | 2026-09-18 |
| [TarunTomar122/jev-askable-arm](https://github.com/TarunTomar122/jev-askable-arm) | 在模拟Franka机械臂上实现零样本英文目标，Jev串联硬编码原语。 | python · mit | 12 | 2026-09-17 |
| [valentynkit/jev-plays-pokemon-red](https://github.com/valentynkit/jev-plays-pokemon-red) | 在 PyBoy 上运行 Pokemon Red：代码掌控路线和数值计算，Jev 仅在分支处做选择，每个战斗回合都记录 faint prediction 并用 Brier 对照 RAM 数据评分。 | python · mit | 10 | 2026-09-19 |
| [AbdelStark/heist-one](https://github.com/AbdelStark/heist-one) | 潜行游戏，其中 Jev 负责守卫的判断，确定性代码掌管世界。 | typescript · mit | 9 | 2026-09-17 |
| [anxkhn/JevPlaysPokemon](https://github.com/anxkhn/JevPlaysPokemon) | 通过 Showdown 和真实 FireRed ROM 的 Generation 3 Pokémon。 | html · gpl-3.0 | 7 | 2026-09-18 |
| [vishxrad/clashroyale-jev](https://github.com/vishxrad/clashroyale-jev) | 用 Jev 根据 Qwen 战场视觉和本地 OpenCV 手牌与圣水识别选择卡牌和放置位置来玩 Clash Royale。 | python | 4 | 2026-09-22 |
| [phyous/tsai-civ2](https://github.com/phyous/tsai-civ2) | 在浏览器中运行的 Civilization II，完整游戏测试框架，实时动作概率。 | python · noassertion | 3 | 2026-09-18 |
| [siroccomask/snake-jev](https://github.com/siroccomask/snake-jev) | 由并行 Jev 评估控制的 Snake，每个 tick 一次 API 调用。 | python · mit | 3 | 2026-09-19 |
| [hazlema/jev-connect4](https://github.com/hazlema/jev-connect4) | Connect Four with nine swappable query strategies for the same model, every answer graded against engine ground truth in a live inspector, and a match runner that plays 100 games a minute: representation changes alone moved the win rate 52 points. | typescript · mit | 1 | 2026-09-21 |

## 💹 金融与交易

用校准概率给金融信号打分。 _(5 项)_

| 项目 | 说明 | 语言 / 许可 | ⭐ | 更新 |
| --- | --- | --- | --- | --- |
| [jarrodwatts/jev-trader](https://github.com/jarrodwatts/jev-trader) | 每个 Monad 区块做出一次交易决策，在 Kuru MON-USDC 上执行，每次约 300 ms。 | typescript · mit | 2,695 | 2026-09-17 |
| [imikerussell/beebots](https://github.com/imikerussell/beebots) | 针对 OKX 永续合约运行三个 Jev 驱动的交易机器人并提供实时仪表盘，默认模拟交易，真实资金交易需显式标志。 | typescript · mit | 180 | 2026-09-27 |
| [aowang-ai/jev-trade](https://github.com/aowang-ai/jev-trade) | 在 Hyperliquid 上运行的实时 Jev 交易员。 | typescript · noassertion | 171 | 2026-09-21 |
| [zadescoxp/Jev-Trades](https://github.com/zadescoxp/Jev-Trades) | 带回测功能的加密交易机器人。 | python · apache-2.0 | 37 | 2026-09-25 |
| [justinhe16/trade-jev](https://github.com/justinhe16/trade-jev) | 在NQ订单簿数据上对作为买入、卖出或持有交易者的Jev进行回测。 | python · mit | 11 | 2026-09-17 |

## 🎪 试验场与演示

30 秒跑起来。 _(12 项)_

| 项目 | 说明 | 语言 / 许可 | ⭐ | 更新 |
| --- | --- | --- | --- | --- |
| [dabit3/jev-experiments](https://github.com/dabit3/jev-experiments) | Nader Dabit 的小型 Jev 实验合集。 | typescript | 397 | 2026-09-21 |
| [TypeSafeAI/typesafe-playground](https://github.com/TypeSafeAI/typesafe-playground) | 包含 110 个用例、游戏和模型挑战，支持可编辑提示词和 A/B 对比；为社区组织而非厂商，曾隶属于 BunsDev。 | typescript · mit | 22 | 2026-09-28 |
| [kavehmz/typesafe-playground](https://github.com/kavehmz/typesafe-playground) | 从支持路由到具有可见传感器输入的 3D 驾驶模拟。 | javascript | 14 | 2026-09-29 |
| [GiesN/typesafe-jev-workflow](https://github.com/GiesN/typesafe-jev-workflow) | 将模拟邮件发送给Jev并根据其返回的类型化Choice进行路由的LangGraph演示。 | python | 12 | 2026-09-16 |
| [lbotinelly/jev-little-airways](https://github.com/lbotinelly/jev-little-airways) | 针对 Jev 的展示性能力研究。 | html · mit | 7 | 2026-09-17 |
| [haseeb-heaven/jev-system-one](https://github.com/haseeb-heaven/jev-system-one) | 由 OpenAI 回答、Jev 分别对相关性、可靠性和质量评分的终端界面。 | python · mit | 6 | 2026-09-17 |
| [markjaquith/typesafe-ai-playground](https://github.com/markjaquith/typesafe-ai-playground) | 用于围绕 Jev 进行实验的 Rust CLI playground。 | rust · mit | 5 | 2026-09-22 |
| [replynodes/jev-web-analyzer](https://github.com/replynodes/jev-web-analyzer) | 将 SaaS 落地页转换为 Markdown，并向 Jev 提出十个有界 Choice 问题以了解首次访问者的理解情况，以创始人拆解形式呈现。 | typescript · apache-2.0 | 5 | 2026-09-28 |
| [wustep/jev-playground](https://github.com/wustep/jev-playground) | Can a System One model steer a music composition through typed classify, score, and pick decisions alone. | typescript | 2 | 2026-09-26 |
| [willprout/magic-8-ball](https://github.com/willprout/magic-8-ball) | Ask a question, one choice over twenty answers picks the reply and shows the click-to-answer latency; [live demo](https://willprout.github.io/magic-8-ball/). | typescript | 1 | 2026-09-18 |
| [bud-ro/jev-demos](https://github.com/bud-ro/jev-demos) | Demos built to test what Jev is good at. | dart | 1 | 2026-09-18 |
| [rishi-raj-jain/hn-thread-judge](https://github.com/rishi-raj-jain/hn-thread-judge) | Reads the most-discussed Hacker News threads comment by comment with Jev and reduces each one to a single verdict, served live from Postgres. | typescript | 0 | 2026-09-21 |

<!-- entries:end -->

---

## 🧭 这份清单是怎么打理的

这不是一份半年就发臭的手工清单，而是**一个数据文件 + 确定性脚本 + 一个免费 AI 评审员**：

| 阶段 | 命令 | 做什么 |
| --- | --- | --- |
| **种子** | `node scripts/import-seed.mjs <projects.json>` | 把社区 CC0 数据导入 `data/entries.json`。仅在重新播种时手动执行。 |
| **校验** | `node scripts/verify.mjs` | 结构、重复 URL、分类 id、描述规范。纯 Node，不用模型、不联网。 |
| **刷新** | `node scripts/refresh-stars.mjs` | 通过 GitHub API 批量刷新星标/许可/归档状态，然后重生成 README 与站点。 |
| **翻译** | `node scripts/translate.mjs` | 用**免费**的 opencode 模型补齐中文与法文描述。幂等、可断点续跑。 |
| **评审** | `node scripts/curate.mjs` | 免费模型审阅新投稿并做周期性健康审计，产出报告交给门控。 |
| **渲染** | `node scripts/build-readme.mjs`、`site/build.mjs` | 重新生成三份 README、站点与机器可读导出。 |

**免费 AI，永远不需要 API key。** 策展器跑在 [opencode Zen](https://opencode.ai/zen) 的公开 `*-free` 模型上，从 `/zen/v1/models` 实时发现并保留静态兜底列表。网络或模型不可用时退化为确定性报告而不是直接失败。它永远不会直推 `main`、永远不会自动批准人工 PR、绝不编造星标数。

**双模型门控。** 新条目由一个免费模型起草，再由第二个独立的免费模型复核才允许合入。只改报告的 PR 永不自动合入——必须动到数据文件。

---

## ❓ 常见问题

**Jev 到底是什么？** TypeSafe AI 的 System One 模型：发一个 state 加类型化问题，回来的是带概率与置信度的类型化答案。

**比「让 LLM 选一个选项」强在哪？** LLM 返回的是要解析的文本；Jev 返回类型化的 `choice` 加概率分布，可以设阈值、写单测、记一个数字。

**必须用 TypeSafe 的 API key 吗？** 只有托管 API 需要。 [开源模型与复刻](#-开源模型与复刻)分类里有跑在开放权重上的 System One 语义实现。

**我的项目怎么才能被收录？** 给 `data/entries.json` 提个 PR，或者打上 `jev` 话题开 issue。见 [CONTRIBUTING.zh.md](CONTRIBUTING.zh.md)。

**这份清单和 TypeSafe AI 有关联吗？** 没有，是社区维护的。因为 Jev 是他们的模型，所以才有链接。

**星标数有多新？** 由 GitHub Actions 定时刷新，页脚有确切日期。

**我能在自己的工具里用这些数据吗？** 可以——CC0-1.0，公共领域。取 [`projects.json`](https://hdjekuue.github.io/awesome-jev/projects.json) 或 `llms-full.txt` 直接用。

---

## 📣 帮忙传播

一次分享，对下面这些构建者来说抵十个 Star。

[![Share on X](https://img.shields.io/badge/%E5%88%86%E4%BA%AB%20-%20X-000000?style=for-the-badge&logo=x)](https://twitter.com/intent/tweet?text=Awesome%20Jev%20%E2%80%94%20%E5%85%B3%E4%BA%8E%20Jev%20%E6%9E%84%E5%BB%BA%E7%9A%84%E4%B8%80%E5%88%87%E3%80%82%E7%B1%BB%E5%9E%8B%E5%8C%96%E5%86%B3%E7%AD%96%EF%BC%8C%E6%A0%A1%E5%87%86%E6%A6%82%E7%8E%87%EF%BC%8C350%2B%20%E4%B8%AA%E9%A1%B9%E7%9B%AE%EF%BC%8C%E8%87%AA%E5%8A%A8%E6%9B%B4%E6%96%B0%E3%80%82&url=https://github.com/hdjekuue/awesome-jev&hashtags=jev,typesafe,aiagents,awesome)
[![Share on Reddit](https://img.shields.io/badge/%E5%88%86%E4%BA%AB%20-%20Reddit-ff4500?style=for-the-badge&logo=reddit&logoColor=white)](https://www.reddit.com/submit?url=https://github.com/hdjekuue/awesome-jev&title=Awesome%20Jev%20%E2%80%94%20everything%20built%20on%20Jev)
[![Share on LinkedIn](https://img.shields.io/badge/%E5%88%86%E4%BA%AB%20-%20LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/sharing/share-offsite/?url=https://github.com/hdjekuue/awesome-jev)

## 📮 参与贡献

发现漏掉的 Jev 项目，或看到某一行过期了？**每个 PR 一条，三分钟完成，合并很快。** 格式与合入检查清单见 [CONTRIBUTING.zh.md](CONTRIBUTING.zh.md)（[English](CONTRIBUTING.md) / [Français](CONTRIBUTING.fr.md)）。

<sub>星标数截止 2026-10-01。本清单持续更新——机制见上文「这份清单是怎么打理的」。</sub>

## 📄 许可

[CC0-1.0](LICENSE) —— 公共领域。任意语言、随意使用，署名与否皆可。