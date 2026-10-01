# 📊 Benchmarks, Evals & Calibration

> Measure it before you trust it.

27 entries. Part of [Awesome Jev](https://github.com/hdjekuue/awesome-jev) — refreshed 2026-10-01.

---
### sutro-sh/jev-align

- url: https://github.com/sutro-sh/jev-align
- description: Finds the examples a Jev function is least sure about, asks you to label them, and improves the function with GEPA.
- stars: 301
- language: Python
- license: Apache-2.0
- pushed_at: 2026-09-20
- topics: active-learning, classification, cli, gepa, human-in-the-loop, jev
- use_cases: benchmark or calibrate Jev; label data or build a dataset; classify support tickets or messages

### fstandhartinger/jevbench

- url: https://github.com/fstandhartinger/jevbench
- description: Benchmark for Jev-class decision models: bounded rubric in, typed answer with a probability per option out, with cascade and committee experiments reported separately.
- stars: 186
- language: Python
- license: MIT
- pushed_at: 2026-09-29
- topics: jev, systemone, decisionmodels
- use_cases: benchmark or calibrate Jev; judge or verify an agent's output; score or rank candidates in a pipeline

### vinilana/jev-eval-agent

- url: https://github.com/vinilana/jev-eval-agent
- description: Personal-assistant agent with 100 mocked tools, measuring how many steps a Jev-gated agent needs.
- stars: 107
- language: HTML
- pushed_at: 2026-09-17
- use_cases: benchmark or calibrate Jev; compare Jev with an LLM; gate or approve tool calls before they run

### openlayer-ai/jevals

- url: https://github.com/openlayer-ai/jevals
- description: Runs a trace's agent, quality, and security evals as one batch of typed Jev questions instead of separate LLM-judge calls.
- stars: 97
- language: Python
- license: MIT
- pushed_at: 2026-09-24
- topics: agents, evals, guardrails, jev, llm, llm-evaluation
- use_cases: judge or verify an agent's output; detect prompt injection or risky commands; benchmark or calibrate Jev

### pinecone-io/cultivar

- url: https://github.com/pinecone-io/cultivar
- description: Pinecone's skill-testing CLI, with a Jev grading backend it reports at about 30 times cheaper than the LLM grader.
- stars: 41
- language: Python
- license: MIT
- pushed_at: 2026-09-18
- topics: agent, agent-skills, benchmarking, claude-code, codex, copilot
- use_cases: judge or verify an agent's output; benchmark or calibrate Jev; compare Jev with an LLM

### AbdelStark/jev-benchmarks

- url: https://github.com/AbdelStark/jev-benchmarks
- description: Probability-aware evaluation for typed decision models: calibration, selective risk, latency, reproducible.
- stars: 21
- language: Python
- license: Apache-2.0
- pushed_at: 2026-09-17
- topics: benchmarking, calibration, evaluation, machine-learning, reproducibility, selective-classification
- use_cases: benchmark or calibrate Jev; judge or verify an agent's output; route between models by task difficulty

### AntonioCoppe/jev-harness

- url: https://github.com/AntonioCoppe/jev-harness
- description: Confidence gates, shadow mode, recipes, and evals; reports Claude CLI at 48.9 s against Jev at 1.3 s on the same row-filter job.
- stars: 16
- language: TypeScript
- license: MIT
- pushed_at: 2026-09-25
- topics: agents, confidence, decision, evals, harness, jev
- use_cases: benchmark or calibrate Jev; judge or verify an agent's output; gate or approve tool calls before they run

### abhixhek/jevcal

- url: https://github.com/abhixhek/jevcal
- description: Stop guessing thresholds: calibrate, threshold, and drift-check against an LLM teacher.
- stars: 11
- language: Python
- license: MIT
- pushed_at: 2026-09-18
- topics: calibration, jev, llm-evals, system-one, typesafe, confidence-thresholds
- use_cases: benchmark or calibrate Jev; judge or verify an agent's output; route between models by task difficulty

### jmanhype/jev-dspy-lab

- url: https://github.com/jmanhype/jev-dspy-lab
- description: Reproducible calibration and selective-risk benchmarks for Jev decisions in DSPy.
- stars: 11
- language: Python
- license: MIT
- pushed_at: 2026-09-20
- use_cases: benchmark or calibrate Jev; judge or verify an agent's output; monitor or observe Jev usage and cost

### zhuyansen/jev-search-rerank-eval

- url: https://github.com/zhuyansen/jev-search-rerank-eval
- description: Does a Jev rerank beat embedding search? 9,831 graded pairs, with the judge-circularity bias measured.
- stars: 10
- language: Python
- license: MIT
- pushed_at: 2026-09-18
- topics: bge-m3, evaluation, information-retrieval, ndcg, reranking, typesafe-jev
- use_cases: benchmark or calibrate Jev; compare Jev with an LLM; rerank search results

### anessbelbati/jev-rerank-bench

- url: https://github.com/anessbelbati/jev-rerank-bench
- description: Jev against Cohere Rerank, ZeroEntropy, and a chat baseline on 14 datasets, raw responses included.
- stars: 9
- language: Python
- license: MIT
- pushed_at: 2026-09-25
- topics: benchmark, cohere, information-retrieval, llm-evaluation, ndcg, rag
- use_cases: benchmark or calibrate Jev; compare Jev with an LLM; judge or verify an agent's output

### anisselbd/jev-phishing-bench

- url: https://github.com/anisselbd/jev-phishing-bench
- description: Jev against Claude Haiku on 2,000 phishing emails: accuracy, calibration, latency, cost.
- stars: 8
- language: Python
- pushed_at: 2026-09-19
- use_cases: benchmark or calibrate Jev; compare Jev with an LLM; judge or verify an agent's output

### mahlernim/jev-korean-benchmark

- url: https://github.com/mahlernim/jev-korean-benchmark
- description: Korean understanding and medical text, with runtime and cost evidence.
- stars: 7
- language: Python
- pushed_at: 2026-09-17
- use_cases: judge or verify an agent's output; benchmark or calibrate Jev; monitor or observe Jev usage and cost

### wondertwins/jev-benchmark

- url: https://github.com/wondertwins/jev-benchmark
- description: Two benchmarks, chess and predator identification, one inside Jev's lane and one outside, both with results.
- stars: 7
- language: Python
- license: MIT
- pushed_at: 2026-09-16
- use_cases: benchmark or calibrate Jev; judge or verify an agent's output; learn how Jev works

### Gaurav-Gosain/jev-sec-bench

- url: https://github.com/Gaurav-Gosain/jev-sec-bench
- description: Blind benchmarks for prompt injection and vulnerable-code detection.
- stars: 4
- language: Go
- license: MIT
- pushed_at: 2026-09-16
- use_cases: benchmark or calibrate Jev; judge or verify an agent's output; moderate content or detect abuse

### TokenTrim/jev-agent-failure-benchmark

- url: https://github.com/TokenTrim/jev-agent-failure-benchmark
- description: Jev against a strong LLM on the Who and When agent-failure-attribution benchmark.
- stars: 4
- language: Python
- license: Apache-2.0
- pushed_at: 2026-09-17
- use_cases: benchmark or calibrate Jev; compare Jev with an LLM; judge or verify an agent's output

### RINNECODER/jev-behavior-study

- url: https://github.com/RINNECODER/jev-behavior-study
- description: Controlled prompt experiments on jev-1.13.0, raw results and offline verification.
- stars: 4
- language: Python
- license: MIT
- pushed_at: 2026-09-17
- use_cases: benchmark or calibrate Jev; judge or verify an agent's output; learn how Jev works

### chenmingtang830/jevarena

- url: https://github.com/chenmingtang830/jevarena
- description: Hosted arena that puts Jev against an opponent judge you connect and takes your vote before revealing which was which, with latency, cost provenance, and self-reported confidence; a vote records preference, not verified correctness.
- stars: 4
- language: TypeScript
- license: Apache-2.0
- pushed_at: 2026-09-20
- topics: byok, evaluation, jev, llm-as-a-judge, open-source
- use_cases: benchmark or calibrate Jev; compare Jev with an LLM; monitor or observe Jev usage and cost

### bitnovus/jev-spam-eval

- url: https://github.com/bitnovus/jev-spam-eval
- description: Zero-shot spam filtering with Noul questions against TF-IDF baselines.
- stars: 3
- language: Jupyter Notebook
- license: MIT
- pushed_at: 2026-09-18
- use_cases: benchmark or calibrate Jev; judge or verify an agent's output; moderate content or detect abuse

### PistachioAIHQ/jev-synergy-screening

- url: https://github.com/PistachioAIHQ/jev-synergy-screening
- description: Choice and Noul questions scored against ASReview SYNERGY gold labels for abstract screening.
- stars: 3
- language: Python
- pushed_at: 2026-09-16
- use_cases: benchmark or calibrate Jev; judge or verify an agent's output; score or rank candidates in a pipeline

### jgridifier/jev-research-eval

- url: https://github.com/jgridifier/jev-research-eval
- description: Reproducible harness over a pinned jev-ultrafast commit, with baseline and stress suites.
- stars: 3
- language: HTML
- license: NOASSERTION
- pushed_at: 2026-09-17
- use_cases: benchmark or calibrate Jev; judge or verify an agent's output; compare Jev with an LLM

### HackSing/jev-report

- url: https://github.com/HackSing/jev-report
- description: Independent Chinese research report: 52 pages, 50 reproducible tests, 143 traceable data rows.
- stars: 2
- language: Python
- license: MIT
- pushed_at: 2026-09-17
- topics: ai-research, chinese, jev, llm-evaluation, typesafe
- use_cases: benchmark or calibrate Jev; judge or verify an agent's output; compare Jev with an LLM

### hegargarcia/jev-playground

- url: https://github.com/hegargarcia/jev-playground
- description: Jev against other models in games with explicit states, legal actions, and a measurable outcome.
- stars: 2
- language: TypeScript
- pushed_at: 2026-09-17
- use_cases: benchmark or calibrate Jev; compare Jev with an LLM; judge or verify an agent's output

### yodablocks/jev-orderby-bench

- url: https://github.com/yodablocks/jev-orderby-bench
- description: Measures whether ORDER BY over a Jev probability is defensible: pairwise inversion, Score ordinality against a human grade, calibration, and wording invariants under a pre-registered gate; passes on 20 Newsgroups topics, fails four of six conditions on Amazon ESCI product relevance, and shows that a 40-row batched state through a DuckDB extension fails the ranking gate one row per request passes.
- stars: 1
- language: Python
- license: MIT
- pushed_at: 2026-09-20
- topics: benchmark, calibration, duckdb, information-retrieval, jev, llm-evaluation
- use_cases: benchmark or calibrate Jev; judge or verify an agent's output; score or rank candidates in a pipeline

### 4esv/jev-eval

- url: https://github.com/4esv/jev-eval
- description: Jev against GPT-5.6 Terra on three labeled tasks: equal on the easy ones, 6.7 points lower on 77-way routing, 5 times faster, 41 to 50 times cheaper.
- stars: 1
- language: Python
- pushed_at: 2026-09-23
- use_cases: benchmark or calibrate Jev; compare Jev with an LLM; judge or verify an agent's output

### themsquared/jev-benchmark

- url: https://github.com/themsquared/jev-benchmark
- description: Tool-call risk classification with the run-to-run variance reported; every wrong answer came with hedged confidence.
- stars: 1
- language: Python
- license: Apache-2.0
- pushed_at: 2026-09-24
- topics: agentgateway, ai-agents, benchmark, calibration, llm, mcp
- use_cases: benchmark or calibrate Jev; judge or verify an agent's output; compare Jev with an LLM

### blowxian/jev-fanout-bench

- url: https://github.com/blowxian/jev-fanout-bench
- description: Measures what a Jev request is billed and how its answers hold up under batching, translation, and rewording, from 3,455 billed requests with public raw logs.
- stars: 0
- language: Python
- license: MIT
- pushed_at: 2026-09-28
- topics: benchmark, jev, llm-cost, openrouter, system-one, typesafe
- use_cases: benchmark or calibrate Jev; judge or verify an agent's output; monitor or observe Jev usage and cost
