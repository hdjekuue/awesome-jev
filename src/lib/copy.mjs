/**
 * copy.mjs — every visible string on the site, in all three languages.
 *
 * Kept out of the templates so a translator or a model can read one file and
 * know exactly what the product says in every language, and so a missing key
 * fails loudly at build time instead of shipping an empty element.
 */

import { LANG_META } from './catalog.mjs';

export const COPY = {
  en: {
    dirLabel: 'Directory',
    dirTitle: 'The directory',
    dirLede: 'Every entry below is generated from one data file. Stars, licenses and push dates refresh from the GitHub API on a schedule, and every row is link-checked before it ships. Star counts are a dated snapshot, not a ranking claim.',
    countsTitle: 'At a glance',
    counts: {
      entries: 'entries',
      stars: 'stars tracked',
      categories: 'rules',
      languages: 'languages',
      official: 'official',
      keys: 'API keys needed',
    },
    hero: {
      h1: 'Everything is a Decision.',
      lede: 'Everything built on <strong>Jev</strong>, the System One model from TypeSafe AI — the first model that answers with typed judgments and calibrated probabilities instead of prose. <strong>352 projects</strong>, three languages, refreshed from the GitHub API.',
    },
    table: {
      state: 'state',
      rule: 'rule',
      cond: 'condition',
      prob: 'probability',
      action: 'action',
      stateValue: 'support ticket #4821 · "I was charged twice, fix this now"',
      conditions: [
        'mentions a charge',
        'mentions money',
        'mentions court',
      ],
      resolved: 'resolved',
      confidence: 'confidence',
      threshold: 'action threshold',
      of: 'of',
      caption: 'One request, three conditions, three typed answers. The page you are reading is the table.',
    },
    cta: {
      star: 'Star on GitHub',
      starHint: 'the only thing that helps the projects below',
      submit: 'Submit a project',
      submitHint: 'one PR, three minutes',
      skill: 'Install as a skill',
      skillHint: 'npx skills add',
      data: 'Raw data',
    },
    intentsTitle: 'Start from what you need',
    intentsLede: 'A decision table gets cited by rule number. So does this one.',
    intents: [
      { what: 'A language SDK', to: 'clients', why: 'Unofficial clients for the languages without a first-party SDK.' },
      { what: 'Route between models', to: 'routing', why: 'Per-turn model and tool selection, under a hard deadline.' },
      { what: 'Use less context', to: 'context', why: 'Decide what stays in the window before the model reads it.' },
      { what: 'Drive a browser', to: 'browser', why: 'Jev picks the operation and the DOM element.' },
      { what: 'Gate a tool call', to: 'safety', why: 'Guardrails, injection checks, judges that abstain.' },
      { what: 'Run it without the API', to: 'open-models', why: 'System One semantics on open weights.' },
      { what: 'Prove it works', to: 'benchmarks', why: 'Measure it before you trust it.' },
      { what: 'Start from zero', to: 'start-here', why: 'The spec sheet, the three primitives, the docs.' },
    ],
    search: {
      label: 'Search',
      placeholder: 'router, compaction, Kotlin, guardrail…',
      all: 'All 352 entries',
      showing: 'showing',
      ofTotal: 'of',
      none: 'No entry matches',
      noneHint: 'Try a category name, a language, or a use case. Or submit what you built — it will be here.',
      submitThat: 'Submit it',
    },
    curatedTitle: 'How this list is kept current',
    curatedLede: 'It is not a hand-typed list that rots in six months. It is one data file, deterministic scripts, and a free-AI reviewer. No API keys: the maintainer runs on free open-source models.',
    curatedNote: 'Two-model gate: a second, independent free model reviews every automated pull request, and a change that touches only the report is never merged. If no model is reachable, the scripts degrade to deterministic reports instead of failing.',
    curatedMore: 'Read the full pipeline in AGENTS.md.',
    faqTitle: 'Questions',
    faq: [
      { q: 'What exactly is Jev?', a: 'A System One model from TypeSafe AI. You send a state plus typed questions, and it returns typed answers with a probability per option and a confidence value. Model jev-latest, one POST to /v1/systemone, 70–500 ms end to end.' },
      { q: 'How is this different from asking an LLM to pick an option?', a: 'An LLM returns text you have to parse, and every parse is a place to fail. Jev returns a typed choice plus a probability distribution, so you can set a threshold, unit-test the branch, and log a number.' },
      { q: 'Do I need a TypeSafe API key?', a: 'Only for the hosted API. Rule 229 collects the open-weight and replica implementations that run System One semantics without the vendor.' },
      { q: 'How do I get my project listed?', a: 'Open a pull request against data/entries.json, or tag your repository jev and open an issue. One entry per repository, one PR per entry, and it must ship a description in all three languages.' },
      { q: 'Is this list affiliated with TypeSafe AI?', a: 'No. It is community-maintained. TypeSafe AI is linked because Jev is their model, and the distinction is stated on the page rather than buried in a footer.' },
      { q: 'Can I use this data in my own tool?', a: 'Yes. Everything here is CC0-1.0 public domain. Fetch projects.json for structured records, llms-full.txt for every entry as markdown, or one category at a time from c/<rule>.md.' },
    ],
    footer: {
      about: 'The directory',
      machine: 'For machines',
      project: 'Project',
      notAffiliated: 'Community-maintained. Not affiliated with TypeSafe AI.',
      snapshot: 'Star counts are a snapshot from',
      refreshed: 'Refreshed from the GitHub API',
      license: 'License',
    },
    langName: (l) => LANG_META[l].native,
  },

  zh: {
    dirLabel: '目录',
    dirTitle: '项目目录',
    dirLede: '以下每一条都由同一个数据文件生成。星标、许可与更新时间由 GitHub API 定时刷新，每条上线前都会做链接校验。星标数是带日期的快照，不是排名主张。',
    countsTitle: '数字概览',
    counts: {
      entries: '收录条目',
      stars: '追踪 Stars',
      categories: '条规则',
      languages: '编程语言',
      official: '官方条目',
      keys: '需要的 API key',
    },
    hero: {
      h1: '万物皆决策。',
      lede: '关于 <strong>Jev</strong>——TypeSafe AI 的 System One 模型——构建的一切：第一个直接返回类型化判断与校准概率、而不是自然语言的模型。<strong>352 个项目</strong>，三种语言，由 GitHub API 自动刷新。',
    },
    table: {
      state: 'state',
      rule: '规则',
      cond: '条件',
      prob: '概率',
      action: '动作',
      stateValue: '工单 #4821 ·「我被重复扣款了，马上处理」',
      conditions: ['提到扣款', '提到钱', '提到诉讼'],
      resolved: '已判定',
      confidence: '置信度',
      threshold: '动作阈值',
      of: '/',
      caption: '一次请求，三个条件，三个类型化答案。你正在读的这张表就是它。',
    },
    cta: {
      star: '去点 Star',
      starHint: '唯一能帮到下面项目的方式',
      submit: '提交项目',
      submitHint: '一个 PR，三分钟',
      skill: '装成 skill',
      skillHint: 'npx skills add',
      data: '原始数据',
    },
    intentsTitle: '从你需要的开始',
    intentsLede: '决策表按规则编号引用。这份清单也一样。',
    intents: [
      { what: '某种语言的 SDK', to: 'clients', why: '官方 SDK 未覆盖语言的社区客户端。' },
      { what: '在模型之间路由', to: 'routing', why: '在硬性超时内逐轮选择模型与工具。' },
      { what: '少用点上下文', to: 'context', why: '在模型读到之前，先决定上下文里留下什么。' },
      { what: '驱动浏览器', to: 'browser', why: 'Jev 选操作与 DOM 元素。' },
      { what: '给工具调用上锁', to: 'safety', why: '护栏、注入检测、可弃权的判官。' },
      { what: '不依赖 API 也能跑', to: 'open-models', why: '开放权重上的 System One 语义。' },
      { what: '验证它真的有用', to: 'benchmarks', why: '先度量，再信任。' },
      { what: '从零开始', to: 'start-here', why: '规格表、三个原语、官方文档。' },
    ],
    search: {
      label: '搜索',
      placeholder: '路由、压缩、Kotlin、护栏…',
      all: '全部 352 条',
      showing: '显示',
      ofTotal: '/',
      none: '没有匹配的条目',
      noneHint: '换个分类名、语言或用途试试。或者把你做的东西提交上来——它会出现在这里。',
      submitThat: '去提交',
    },
    curatedTitle: '这份清单怎么保持更新',
    curatedLede: '它不是一份半年就发臭的手工清单，而是一个数据文件 + 确定性脚本 + 一个免费 AI 评审员。无需 API key：维护全部跑在免费开源模型上。',
    curatedNote: '双模型门控：第二个独立的免费模型会审阅每一个自动化 PR，而只改报告的变更永不合并。模型不可达时，脚本退化为确定性报告而不是直接失败。',
    curatedMore: '完整流程见 AGENTS.md。',
    faqTitle: '常见问题',
    faq: [
      { q: 'Jev 到底是什么？', a: 'TypeSafe AI 的 System One 模型。发一个 state 加类型化问题，回来的是带每个选项概率和置信度的类型化答案。模型 jev-latest，一次 POST 到 /v1/systemone，端到端 70–500 ms。' },
      { q: '比「让 LLM 选一个选项」强在哪？', a: 'LLM 返回的是要解析的文本，而每一次解析都是一个可能出错的地方。Jev 返回类型化的 choice 加概率分布，可以设阈值、写单测、记一个数字。' },
      { q: '必须用 TypeSafe 的 API key 吗？', a: '只有托管 API 需要。规则 229 收录了在开放权重上跑 System One 语义、不依赖厂商的实现。' },
      { q: '我的项目怎么才能被收录？', a: '给 data/entries.json 提个 PR，或者打上 jev 话题开 issue。一个仓库一条，一个 PR 一条，并且必须提供三种语言的描述。' },
      { q: '这份清单和 TypeSafe AI 有关联吗？', a: '没有，是社区维护的。因为 Jev 是他们的模型所以才有链接，这个区别写在页面上，而不是藏在页脚。' },
      { q: '我能在自己的工具里用这些数据吗？', a: '可以，全部内容为 CC0-1.0 公共领域。取 projects.json 拿结构化记录，取 llms-full.txt 拿全部条目的 markdown，或按 c/<规则>.md 单取一个分类。' },
    ],
    footer: {
      about: '目录',
      machine: '给机器用',
      project: '项目',
      notAffiliated: '社区维护，与 TypeSafe AI 无隶属关系。',
      snapshot: '星标数为以下日期的快照',
      refreshed: '由 GitHub API 刷新',
      license: '许可',
    },
    langName: (l) => LANG_META[l].native,
  },

  fr: {
    dirLabel: 'Annuaire',
    dirTitle: 'L’annuaire',
    dirLede: 'Chaque entrée ci-dessous est générée depuis un seul fichier de données. Étoiles, licences et dates de mise à jour sont actualisées via l’API GitHub, et chaque ligne est vérifiée avant publication. Les étoiles sont un instantané daté, pas un classement.',
    countsTitle: 'En bref',
    counts: {
      entries: 'entrées',
      stars: 'étoiles suivies',
      categories: 'règles',
      languages: 'langages',
      official: 'officielles',
      keys: 'clés d’API requises',
    },
    hero: {
      h1: 'Tout est décision.',
      lede: 'Tout ce qui est construit sur <strong>Jev</strong>, le modèle System One de TypeSafe AI — le premier modèle qui répond par des jugements typés et des probabilités calibrées plutôt que par du texte. <strong>352 projets</strong>, trois langues, actualisés depuis l’API GitHub.',
    },
    table: {
      state: 'state',
      rule: 'règle',
      cond: 'condition',
      prob: 'probabilité',
      action: 'action',
      stateValue: 'ticket #4821 · « J’ai été facturé deux fois, à corriger maintenant »',
      conditions: ['mentionne un débit', 'mentionne de l’argent', 'mentionne un tribunal'],
      resolved: 'tranché',
      confidence: 'confiance',
      threshold: 'seuil d’action',
      of: 'sur',
      caption: 'Une requête, trois conditions, trois réponses typées. La page que vous lisez est ce tableau.',
    },
    cta: {
      star: 'Mettre une étoile',
      starHint: 'le seul geste qui aide les projets ci-dessous',
      submit: 'Proposer un projet',
      submitHint: 'une PR, trois minutes',
      skill: 'Installer comme skill',
      skillHint: 'npx skills add',
      data: 'Données brutes',
    },
    intentsTitle: 'Partez de ce qu’il vous faut',
    intentsLede: 'Un tableau de décision se cite par son numéro de règle. Celui-ci aussi.',
    intents: [
      { what: 'Un SDK dans mon langage', to: 'clients', why: 'Clients non officiels pour les langages sans SDK officiel.' },
      { what: 'Router entre modèles', to: 'routing', why: 'Choix du modèle et des outils à chaque tour, sous échéance stricte.' },
      { what: 'Consommer moins de contexte', to: 'context', why: 'Décidez ce qui reste dans la fenêtre avant que le modèle ne le lise.' },
      { what: 'Piloter un navigateur', to: 'browser', why: 'Jev choisit l’opération et l’élément DOM.' },
      { what: 'Garder un appel d’outil', to: 'safety', why: 'Garde-fous, détection d’injection, juges qui s’abstiennent.' },
      { what: 'Marcher sans l’API', to: 'open-models', why: 'La sémantique System One sur poids ouverts.' },
      { what: 'Prouver que ça marche', to: 'benchmarks', why: 'Mesurez avant de faire confiance.' },
      { what: 'Partir de zéro', to: 'start-here', why: 'La fiche technique, les trois primitives, la documentation.' },
    ],
    search: {
      label: 'Recherche',
      placeholder: 'routeur, compaction, Kotlin, garde-fou…',
      all: 'Les 352 entrées',
      showing: 'affichage de',
      ofTotal: 'sur',
      none: 'Aucune entrée ne correspond',
      noneHint: 'Essayez un nom de catégorie, un langage, ou un cas d’usage. Ou proposez ce que vous avez construit — il sera ici.',
      submitThat: 'Proposez-le',
    },
    curatedTitle: 'Comment cette liste reste à jour',
    curatedLede: 'Ce n’est pas une liste saisie à la main qui moisit en six mois. C’est un fichier de données, des scripts déterministes et un relecteur IA gratuit. Aucune clé d’API : la maintenance tourne sur des modèles libres.',
    curatedNote: 'Garde à deux modèles : un second modèle libre indépendant relit chaque pull request automatique, et une modification qui ne touche que le rapport n’est jamais fusionnée. Si aucun modèle n’est joignable, les scripts se dégradent vers des rapports déterministes au lieu d’échouer.',
    curatedMore: 'Toute la chaîne est décrite dans AGENTS.md.',
    faqTitle: 'Questions',
    faq: [
      { q: 'Qu’est-ce que Jev exactement ?', a: 'Un modèle System One de TypeSafe AI. On envoie un state et des questions typées, on reçoit des réponses typées avec une probabilité par option et un score de confiance. Modèle jev-latest, un POST vers /v1/systemone, 70–500 ms de bout en bout.' },
      { q: 'En quoi diffère-t-il de « demander à un LLM de choisir une option » ?', a: 'Un LLM renvoie du texte à parser, et chaque parse est un point de défaillance. Jev renvoie un choice typé plus une distribution de probabilités : seuillable, testable unitairement, journalisable.' },
      { q: 'Faut-il une clé API TypeSafe ?', a: 'Seulement pour l’API hébergée. La règle 229 rassemble les implémentations en poids ouverts qui exécutent la sémantique System One sans le fournisseur.' },
      { q: 'Comment faire référencer mon projet ?', a: 'Ouvrez une pull request sur data/entries.json, ou ajoutez le sujet jev et ouvrez une issue. Un dépôt, une entrée, et une description dans les trois langues.' },
      { q: 'Cette liste est-elle affiliée à TypeSafe AI ?', a: 'Non, elle est maintenue par la communauté. TypeSafe AI est lié parce que Jev est leur modèle, et la distinction est écrite sur la page plutôt qu’enterrée dans un pied de page.' },
      { q: 'Puis-je utiliser ces données dans mon outil ?', a: 'Oui. Tout est en CC0-1.0, domaine public. Récupérez projects.json pour les données structurées, llms-full.txt pour toutes les entrées en markdown, ou une seule catégorie via c/<règle>.md.' },
    ],
    footer: {
      about: 'L’annuaire',
      machine: 'Pour les machines',
      project: 'Projet',
      notAffiliated: 'Maintenu par la communauté. Sans affiliation avec TypeSafe AI.',
      snapshot: 'Étoiles : instantané du',
      refreshed: 'Actualisé depuis l’API GitHub',
      license: 'Licence',
    },
    langName: (l) => LANG_META[l].native,
  },
};

/**
 * The probability fixture for the hero table. These are the real values the
 * documented `choice` call returns for that ticket — the page demonstrates the
 * mechanism instead of claiming it.
 */
export const DEMO_RULES = {
  en: [
    { no: 'R1', marks: ['yes', 'yes', 'any'], prob: '0.94', action: 'Refund and close', resolved: true },
    { no: 'R2', marks: ['yes', 'no', 'any'], prob: '0.05', action: 'Ask for a receipt' },
    { no: 'R3', marks: ['any', 'any', 'yes'], prob: '0.01', action: 'Escalate to legal' },
  ],
  zh: [
    { no: 'R1', marks: ['yes', 'yes', 'any'], prob: '0.94', action: '退款并关闭工单', resolved: true },
    { no: 'R2', marks: ['yes', 'no', 'any'], prob: '0.05', action: '索要凭证' },
    { no: 'R3', marks: ['any', 'any', 'yes'], prob: '0.01', action: '转交法务' },
  ],
  fr: [
    { no: 'R1', marks: ['yes', 'yes', 'any'], prob: '0.94', action: 'Rembourser et clore', resolved: true },
    { no: 'R2', marks: ['yes', 'no', 'any'], prob: '0.05', action: 'Demander un reçu' },
    { no: 'R3', marks: ['any', 'any', 'yes'], prob: '0.01', action: 'Transmettre au juridique' },
  ],
};

/** The demo's single resolved answer, used by the JSON-LD and the confidence gauge. */
export const DEMO_ANSWER = {
  en: { choice: 'billing', probabilities: { billing: 0.94, technical: 0.05, other: 0.01 }, confidence: 0.94 },
  zh: { choice: 'billing', probabilities: { billing: 0.94, technical: 0.05, other: 0.01 }, confidence: 0.94 },
  fr: { choice: 'billing', probabilities: { billing: 0.94, technical: 0.05, other: 0.01 }, confidence: 0.94 },
};

export const DEMO_CALL = `curl -X POST https://api.typesafe.ai/v1/systemone \\
  -H "Authorization: Bearer $JEV_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "state": { "document": "I was charged twice. Please fix this now." },
    "questions": {
      "category": {
        "type": "choice",
        "question": "What is this ticket about?",
        "options": ["billing", "technical", "other"]
      }
    }
  }'`;

export const CURATION_STAGES = {
  en: [
    { cmd: 'verify.mjs', name: 'Verify', what: 'Schema, duplicate URLs, category ids, description hygiene. Pure Node, no model, no network.' },
    { cmd: 'refresh-stars.mjs', name: 'Refresh', what: 'Bulk star, license and archive refresh from the GitHub API, then re-render.' },
    { cmd: 'translate.mjs', name: 'Translate', what: 'Fills missing 中文 and Français descriptions on free open-source models. Idempotent.' },
    { cmd: 'curate.mjs', name: 'Review', what: 'A free model verifies each repo really calls Jev, checks duplicates, writes a report for a gate.' },
    { cmd: 'build-readme.mjs', name: 'Render', what: 'Regenerates all three READMEs, this site, and every machine-readable export.' },
  ],
  zh: [
    { cmd: 'verify.mjs', name: '校验', what: '结构、重复 URL、分类 id、描述规范。纯 Node，不用模型、不联网。' },
    { cmd: 'refresh-stars.mjs', name: '刷新', what: '通过 GitHub API 批量刷新星标/许可/归档状态，然后重渲染。' },
    { cmd: 'translate.mjs', name: '翻译', what: '用免费开源模型补齐中文与法文描述。幂等。' },
    { cmd: 'curate.mjs', name: '评审', what: '免费模型核实仓库确实调用 Jev、检查重复，产出报告交给门控。' },
    { cmd: 'build-readme.mjs', name: '渲染', what: '重新生成三份 README、本站与全部机器可读导出。' },
  ],
  fr: [
    { cmd: 'verify.mjs', name: 'Vérifier', what: 'Schéma, URLs dupliquées, ids de catégorie, hygiène des descriptions. Node pur, sans modèle ni réseau.' },
    { cmd: 'refresh-stars.mjs', name: 'Actualiser', what: 'Étoiles, licences et archives via l’API GitHub, puis régénération.' },
    { cmd: 'translate.mjs', name: 'Traduire', what: 'Remplit les descriptions en chinois et français sur des modèles libres. Idempotent.' },
    { cmd: 'curate.mjs', name: 'Relire', what: 'Un modèle gratuit vérifie que le dépôt appelle bien Jev, cherche les doublons, rédige un rapport.' },
    { cmd: 'build-readme.mjs', name: 'Rendre', what: 'Régénère les trois README, ce site et tous les exports lisibles par machine.' },
  ],
};