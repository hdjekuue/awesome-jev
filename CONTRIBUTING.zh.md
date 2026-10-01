# 参与 Awesome Jev 贡献

感谢你来收录你的项目。这份清单**由一个数据文件生成**，所以一次投稿比想象中更简单——而且会同时进入三种语言。

[English](CONTRIBUTING.md) · **中文** · [Français](CONTRIBUTING.fr.md)

## 60 秒版

1. Fork 并新建分支：`git checkout -b add-your-repo`
2. 在 `data/entries.json` 里加一个对象（见下方结构），三种语言都写
3. `node scripts/verify.mjs` —— 必须 0 error
4. `node scripts/build-readme.mjs && node site/build.mjs` —— 重新生成
5. 用模板开 PR，标题写 `Add owner/repo to Category`

就这些。README 表格、三种语言、网站与机器可读导出 CI 也会重新生成；第 4 步忘了也没关系，机器人会补。

## 为什么是数据文件

`README.md`、`README.zh.md`、`README.fr.md` 与 `docs/` 全部由 `data/entries.json` 在
`<!-- entries:start -->` 标记之间生成。手工改 README 表格意味着三种语言会慢慢互相矛盾——
这正是 awesome list 腐坏最常见的方式。请改数据。

## 结构说明

```jsonc
{
  "id": "owner--repo",              // slug：owner 与 repo 小写，中间用 "--"
  "name": "owner/repo",
  "url": "https://github.com/owner/repo",
  "kind": "repo",                   // "repo" | "resource"
  "description": "一句英文，20–240 字符。",
  "descriptionZh": "一句简体中文。",
  "descriptionFr": "Une phrase française.",
  "category": "coding-agents",
  "language": "TypeScript",
  "license": "MIT",
  "stars": 1234,                    // kind="repo" 填数字；resource 填 null
  "forks": 56,
  "topics": ["jev", "agent"],
  "official": false,
  "archived": false,
  "pushedAt": "2026-09-24",
  "intents": ["gate or approve tool calls before they run"]
}
```

### 分类

| id | 分类 |
| --- | --- |
| `start-here` | 🧭 入门与心智模型 |
| `official` | 🏛️ 官方 SDK 与框架支持 |
| `coding-agents` | 🤖 编码智能体 |
| `routing` | 🚦 路由与网关 |
| `context` | 🗜️ 上下文与压缩 |
| `code-review` | 🔍 代码评审与质量 |
| `browser` | 🌐 浏览器与计算机操作 |
| `mobile` | 📱 移动端与桌面自动化 |
| `search-rag` | 🔎 搜索、重排与 RAG |
| `safety` | 🛡️ 安全、审核与校验 |
| `data-ops` | 🗄️ 数据与运维 |
| `apps` | 📦 应用与扩展 |
| `clients` | 🧩 SDK 与社区客户端 |
| `cli` | ⌨️ 命令行 |
| `benchmarks` | 📊 基准、评测与校准 |
| `open-models` | 🧠 开源模型与复刻 |
| `games` | 🎮 游戏、机器人与仿真 |
| `finance` | 💹 金融与交易 |
| `demos` | 🎪 试验场与演示 |
| `articles` | 📰 文章与分享 |

### 描述规范

- 一句话，事实性，不要营销形容词（" blazing fast"、"革命性"）。
- 首字母大写，句末加句号。
- 三种语言里，产品名、仓库名、CLI 参数与 API 路径都保持拉丁字符不翻译。
- 说清它做什么；如果它的价值在延迟或依赖成本上，也写出来。
- 20–240 字符，超出范围 `verify.mjs` 会警告。

## 收录标准

1. **它真的调用 Jev。** 调用 System One 端点、官方 SDK，或是有文档的 System One 接口复刻。仅仅在列表里提到 Jev 不算。
2. **公开且可读。** 公开仓库，README 说清它做什么。
3. **能跑。** 不接受只有桩调用、没有实现的 demo。
4. **尚未被收录。** 一个仓库一条。
5. **不是归档仓库。**（已归档条目会保留，但标记 `archived: true`。）
6. **没有恶意行为。** 不收集凭据、不带混淆载荷、不在文档所述 API 之外偷偷回连。

## 提交之后会发生什么

| 阶段 | 运行什么 |
| --- | --- |
| `verify` | `node scripts/verify.mjs` —— 结构、重复项、分类、描述长度 |
| `site` | 重新生成 README、`docs/`、`llms.txt`、`projects.json` |
| `curator` | 一个**免费**模型核实仓库确实调用 Jev、检查重复，并写评审意见 |
| `gate` | 第二个独立的免费模型批准、要求修改或关闭 |

最后由维护者（或门控）合并。48 小时无人处理，可以在 PR 里友善地 ping 一下。

## 社区规则

- **每个 PR 只加一条。** 打包提交会被关闭，因为那样评审没法真正做。
- **举荐别人的项目永远欢迎**，不受下面的自荐频率限制。
- **自荐有频率上限。** 短时间内连续自荐自己的仓库会先收到友好提示，然后是提醒，再然后自动关闭。规则见 [`.github/curator-policy.yml`](.github/curator-policy.yml)。这是评审产能问题，与你是谁无关。

## 顺手点个 Star

给[这份清单](https://github.com/hdjekuue/awesome-jev)点 Star，是对这里所有项目最高杠杆的支持——它会提升清单里每一个项目的曝光。如果你的条目有用，请 Star 并分享：

[![X](https://img.shields.io/badge/分享%20-%20X-000000?style=flat-square&logo=x)](https://twitter.com/intent/tweet?text=Awesome%20Jev&url=https://github.com/hdjekuue/awesome-jev&hashtags=jev,typesafe,awesome)
[![Reddit](https://img.shields.io/badge/分享%20-%20Reddit-ff4500?style=flat-square&logo=reddit&logoColor=white)](https://www.reddit.com/submit?url=https://github.com/hdjekuue/awesome-jev)

## 许可

贡献内容以 [CC0-1.0](LICENSE) 接受。