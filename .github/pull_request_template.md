<!-- Thanks for contributing to Awesome Jev! Fill this in — well-formed PRs merge fast. -->
<!-- 感谢投稿！请填写此模板——规范的 PR 合并更快。 -->
<!-- Merci de remplir ce modèle — une PR bien remplie est fusionnée rapidement. -->

## Project / 项目 / Projet

| Field | Value |
| --- | --- |
| **Repo** | `owner/repo` → https://github.com/owner/repo |
| **Category** | `coding-agents` — see the table in [CONTRIBUTING.md](CONTRIBUTING.md) |
| **Stars (verified)** | <!-- `gh api repos/owner/repo --jq .stargazers_count` --> |
| **License** | <!-- e.g. MIT / Apache-2.0 --> |
| **Language** | <!-- e.g. TypeScript --> |

## Entry to add / 需要添加的条目 / Entrée à ajouter

<!-- Paste the exact JSON object you added to data/entries.json. -->

```json
{
  "id": "owner--repo",
  "name": "owner/repo",
  "url": "https://github.com/owner/repo",
  "kind": "repo",
  "description": "One English sentence.",
  "descriptionZh": "一句简体中文。",
  "descriptionFr": "Une phrase française.",
  "category": "coding-agents",
  "language": "TypeScript",
  "license": "MIT",
  "stars": 0,
  "forks": 0,
  "topics": ["jev"],
  "official": false,
  "archived": false,
  "pushedAt": "2026-09-24",
  "intents": []
}
```

## Why it qualifies / 为什么符合收录标准 / Pourquoi elle est admissible

<!--
Answer all three with evidence from the repo, not adjectives:
1. Does it call Jev / System One? Which endpoint, SDK, or replica?
2. Is it public, with a README that says what it does, and does it actually run?
3. Is it not already listed? (search data/entries.json)
-->

## Checklist / 检查清单

- [ ] Title is `Add owner/repo to Category` / `docs: add owner/repo to Category`
- [ ] One entry per PR, and the repo is not already in `data/entries.json`
- [ ] `description`, `descriptionZh` and `descriptionFr` are all present, one sentence each
- [ ] `category` is one of the ids in [CONTRIBUTING.md](CONTRIBUTING.md)
- [ ] Star count taken from `gh api`, not copied from a badge
- [ ] `node scripts/verify.mjs` exits 0
- [ ] `node scripts/build-readme.mjs && node site/build.mjs` run (CI also does this)
- [ ] Added the [`jev`](https://github.com/topics/jev) topic to your repo
- [ ] Starred [this list](https://github.com/hdjekuue/awesome-jev) ⭐ and shared it
      ([X](https://twitter.com/intent/tweet?text=Awesome%20Jev&url=https://github.com/hdjekuue/awesome-jev&hashtags=jev,typesafe,awesome) ·
      [Reddit](https://www.reddit.com/submit?url=https://github.com/hdjekuue/awesome-jev))

## Screenshot or demo / 截图或演示 / Capture ou démo

<!-- Drag in a GIF or screenshot for UI projects. Delete this section otherwise. -->

## Notes / 备注 / Remarques

<!-- Anything a reviewer should know: roadmap, maturity, why this category. -->

---

> 💡 A line like *"Listed in [Awesome Jev](https://github.com/hdjekuue/awesome-jev) — star if useful"* at the
> bottom of your README helps both sides. If nobody reviews within 48h, feel free to leave a friendly ping.