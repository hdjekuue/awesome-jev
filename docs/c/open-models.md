# 🧠 Open Models & Replicas

> Run System One semantics without the vendor — on a 3090 if you like.

41 entries. Part of [Awesome Jev](https://github.com/hdjekuue/awesome-jev) — refreshed 2026-10-01.

---
### jaredpalmer/kev

- url: https://github.com/jaredpalmer/kev
- description: LoRA adapter and readout head on Qwen2.5-0.5B that answers many typed questions in one prefill; trains in under two hours on a MacBook, held-out ECE 0.065, speaks the TypeSafe wire format.
- stars: 7,998
- language: Python
- license: Apache-2.0
- pushed_at: 2026-09-30
- topics: decision-model, jev, qwen3
- use_cases: run Jev on open models without the vendor; call Jev from a language SDK; benchmark or calibrate Jev

### TheoLeeCJ/SemIf

- url: https://github.com/TheoLeeCJ/SemIf
- description: Semantic ifs from open models on a single 3090; the most starred independent replica, formerly openjev.
- stars: 4,604
- language: Python
- license: MIT
- pushed_at: 2026-09-23
- use_cases: run Jev on open models without the vendor; compare Jev with an LLM; gate or approve tool calls before they run

### TianyuCodings/NanoJev

- url: https://github.com/TianyuCodings/NanoJev
- description: 0.6B replica with parallel decisions, dynamic candidates, and an end-to-end training pipeline.
- stars: 2,445
- language: Python
- license: MIT
- pushed_at: 2026-09-21
- use_cases: build a game or simulation on Jev; run Jev on open models without the vendor; benchmark or calibrate Jev

### vinnylarouge/jevlike

- url: https://github.com/vinnylarouge/jevlike
- description: Open option scorer that reads candidate logits instead of generating JSON.
- stars: 1,335
- language: Python
- license: MIT
- pushed_at: 2026-09-16
- use_cases: score or rank candidates in a pipeline; run Jev on open models without the vendor; judge or verify an agent's output

### ollaya-dev/ollaya

- url: https://github.com/ollaya-dev/ollaya
- description: Pulls and serves open decision models such as Laya, kev, and JevK5 behind a TypeSafe-compatible local endpoint, the way Ollama serves LLMs.
- stars: 1,011
- language: Rust
- license: Apache-2.0
- pushed_at: 2026-09-29
- topics: classification, decision-models, jev, laya, llm-routing, local-inference
- use_cases: run Jev on open models without the vendor; classify support tickets or messages; benchmark or calibrate Jev

### Mapika/decider

- url: https://github.com/Mapika/decider
- description: One-pass typed decisions fine-tuned from Qwen3.5-2B.
- stars: 988
- language: Python
- license: Apache-2.0
- pushed_at: 2026-09-30
- use_cases: score or rank candidates in a pipeline; classify support tickets or messages; judge or verify an agent's output

### nokia-applied-research/AnyJev

- url: https://github.com/nokia-applied-research/AnyJev
- description: Turns an open Hugging Face model into a calibrated decision endpoint served through vLLM, with no fine-tuning at the first two levels.
- stars: 981
- language: Python
- license: Apache-2.0
- pushed_at: 2026-09-28
- topics: calibration, decision-model, jev, jev-model, llm, system-one
- use_cases: run Jev on open models without the vendor; benchmark or calibrate Jev; call Jev from the command line

### wfzyx/von

- url: https://github.com/wfzyx/von
- description: Non-autoregressive open decision model reporting under 15 ms locally, as a drop-in alternative to Jev.
- stars: 781
- language: Python
- license: Apache-2.0
- pushed_at: 2026-09-30
- topics: decision-model, jev, machine-learning, python, rlcd, system-one
- use_cases: run Jev on open models without the vendor; score or rank candidates in a pipeline; call Jev from a language SDK

### Rizzo-AI-Academy/rizzo-flow

- url: https://github.com/Rizzo-AI-Academy/rizzo-flow
- description: Local-first take on the System One idea: unstructured state in, typed probabilistic decisions out, without generating a token.
- stars: 763
- language: Python
- license: Apache-2.0
- pushed_at: 2026-09-25
- use_cases: run Jev on open models without the vendor; score or rank candidates in a pipeline; classify support tickets or messages

### featherless-ai/simple-jev

- url: https://github.com/featherless-ai/simple-jev
- description: Reads next-token logits from any Hugging Face model for choice, rubric, and support questions; public demo API with no key.
- stars: 575
- language: Python
- license: Apache-2.0
- pushed_at: 2026-09-30
- use_cases: run Jev on open models without the vendor; judge or verify an agent's output; extract structured fields from text

### Liuziyu77/Valen

- url: https://github.com/Liuziyu77/Valen
- description: Multimodal decision model on Qwen3.5 that scores candidates against images and video as well as text, with training code and open weights.
- stars: 551
- language: Python
- license: Apache-2.0
- pushed_at: 2026-09-30
- use_cases: score or rank candidates in a pipeline; judge or verify an agent's output; review code or pull requests

### razorback16/openjev

- url: https://github.com/razorback16/openjev
- description: Jev-compatible decision server on DiffusionGemma 26B through vLLM, images included, hosted free on [Codiv](https://codiv.ai).
- stars: 541
- language: Python
- license: Apache-2.0
- pushed_at: 2026-09-29
- use_cases: run Jev on open models without the vendor; call Jev from a language SDK; compare Jev with an LLM

### Yinsongxu/LLM2Jev

- url: https://github.com/Yinsongxu/LLM2Jev
- description: Adapts local language models to runtime-defined Choice, Score, and Noul questions and returns typed answers with probabilities.
- stars: 377
- language: Python
- license: Apache-2.0
- pushed_at: 2026-09-26
- topics: jev, llm, mllm
- use_cases: run Jev on open models without the vendor; compare Jev with an LLM; score or rank candidates in a pipeline

### ekzhang/openjev-sglang

- url: https://github.com/ekzhang/openjev-sglang
- description: Jev-compatible API endpoint on SGLang, prefill only.
- stars: 336
- language: Python
- pushed_at: 2026-09-25
- topics: jev, llm, structured-generation, systemone
- use_cases: run Jev on open models without the vendor; extract structured fields from text; benchmark or calibrate Jev

### malevrigns/agent-jev

- url: https://github.com/malevrigns/agent-jev
- description: Decision model on Qwen3-0.6B that answers without decoding tokens, reports 79.25 percent top-1 on the public Typed Decisions benchmark.
- stars: 328
- language: Python
- license: Apache-2.0
- pushed_at: 2026-09-23
- use_cases: gate or approve tool calls before they run; score or rank candidates in a pipeline; benchmark or calibrate Jev

### hr98w/jev-visual

- url: https://github.com/hr98w/jev-visual
- description: Educational visual-inference variant on Apple Silicon: shared context, direct candidate scoring.
- stars: 303
- language: Python
- license: MIT
- pushed_at: 2026-09-21
- use_cases: run Jev on open models without the vendor; score or rank candidates in a pipeline; judge or verify an agent's output

### Heman10x-NGU/openJev-verdict-2.0

- url: https://github.com/Heman10x-NGU/openJev-verdict-2.0
- description: Non-autoregressive 151M decision engine with a WebGPU browser runtime, reporting 77.1 percent top-1 and 1.44 percent calibration error on its own benchmark.
- stars: 293
- language: Python
- license: NOASSERTION
- pushed_at: 2026-09-20
- topics: agentic-ai, brier-score, calibration, decision-engine, deep-learning, machine-learning
- use_cases: judge or verify an agent's output; benchmark or calibrate Jev; run Jev on open models without the vendor

### logan-markewich/jeff

- url: https://github.com/logan-markewich/jeff
- description: Self-hosted System One API on the 400M GLiFormer, with benchmarks that say where it trails Jev.
- stars: 273
- language: Python
- license: MIT
- pushed_at: 2026-09-20
- topics: classification, encoder, gliner, jev, typesafe
- use_cases: run Jev on open models without the vendor; score or rank candidates in a pipeline; compare Jev with an LLM

### togethercomputer/tev1

- url: https://github.com/togethercomputer/tev1
- description: Data recipe and training code that fine-tune Qwen3.5-4B into an open-weight decision model on Together AI.
- stars: 177
- language: Python
- license: MIT
- pushed_at: 2026-09-24
- use_cases: classify support tickets or messages; benchmark or calibrate Jev; compare Jev with an LLM

### kshetrajna12/reflex

- url: https://github.com/kshetrajna12/reflex
- description: Small open decision model on Qwen3.5: state plus typed questions to calibrated probabilities.
- stars: 160
- language: Python
- license: MIT
- pushed_at: 2026-09-27
- use_cases: run Jev on open models without the vendor; classify support tickets or messages; compare Jev with an LLM

### allebee/jevk5

- url: https://github.com/allebee/jevk5
- description: Qwen3.5 replica with distilled LoRA weights, ranked second of 76 systems and first among open ones on JevBench v1.4.
- stars: 126
- language: Python
- license: Apache-2.0
- pushed_at: 2026-09-28
- topics: calibration, decision-model, jev, jevbench, lora, qwen
- use_cases: run Jev on open models without the vendor; benchmark or calibrate Jev; compare Jev with an LLM

### daseinlabs/open-jev

- url: https://github.com/daseinlabs/open-jev
- description: Prefills once and scores every option in one padded pass on Gemma 3 4B with MLX; plays Doom from the terminal in the demo.
- stars: 121
- language: Python
- license: MIT
- pushed_at: 2026-09-30
- use_cases: run Jev on open models without the vendor; score or rank candidates in a pipeline; learn how Jev works

### mmastrac/djev

- url: https://github.com/mmastrac/djev
- description: Serves `/v1/systemone` on DiffusionGemma by reading typed answers and text spans off a seeded, pinned canvas, with no generation.
- stars: 111
- language: Python
- license: Apache-2.0
- pushed_at: 2026-09-24
- use_cases: benchmark or calibrate Jev; run Jev on open models without the vendor; learn how Jev works

### Heman10x-NGU/Verdict-open-jev

- url: https://github.com/Heman10x-NGU/Verdict-open-jev
- description: Non-autoregressive decision engine on ModernBERT with calibrated uncertainty and an in-browser WebGPU playground.
- stars: 110
- language: Python
- license: NOASSERTION
- pushed_at: 2026-09-28
- topics: brier-score, calibration, decision-engine, edge-ai, gliclass, jev
- use_cases: benchmark or calibrate Jev; judge or verify an agent's output; run Jev on open models without the vendor

### zwliJay/jev-forge

- url: https://github.com/zwliJay/jev-forge
- description: End-to-end stack for auditable data construction, Qwen3.5-0.8B training, fixed Mind2Web and OOD evaluation, local serving, and a preliminary RLCD baseline.
- stars: 94
- language: Python
- license: NOASSERTION
- pushed_at: 2026-09-23
- use_cases: benchmark or calibrate Jev; score or rank candidates in a pipeline; run Jev on open models without the vendor

### kikoncuo/jevfire

- url: https://github.com/kikoncuo/jevfire
- description: Parallel decisions for CUDA LLMs through a vLLM API, with game-agent examples and benchmarks.
- stars: 72
- language: JavaScript
- license: MIT
- pushed_at: 2026-09-18
- topics: cuda, game-ai, inference, jev, llm, parallel-decoding
- use_cases: benchmark or calibrate Jev; run Jev on open models without the vendor; build a game or simulation on Jev

### bnsd55/jevmlx

- url: https://github.com/bnsd55/jevmlx
- description: Parallel constrained decisions for any MLX model on Apple Silicon, one forward pass.
- stars: 69
- language: Python
- license: MIT
- pushed_at: 2026-09-25
- topics: apple-silicon, jev, local-llm, local-models, mlx
- use_cases: extract structured fields from text; run Jev on open models without the vendor; score or rank candidates in a pipeline

### r-ms/mini-jev

- url: https://github.com/r-ms/mini-jev
- description: Preregistered experiment on a frozen Qwen3-4B: read the option letter's logits, skip the JSON.
- stars: 58
- language: Python
- license: MIT
- pushed_at: 2026-09-18
- use_cases: compare Jev with an LLM; benchmark or calibrate Jev; judge or verify an agent's output

### ikermoel/open-alternative-jev

- url: https://github.com/ikermoel/open-alternative-jev
- description: Typed, calibrated decisions from any open-weights model in one forward pass, on Hugging Face and vLLM.
- stars: 57
- language: Python
- license: Apache-2.0
- pushed_at: 2026-09-25
- topics: calibration, classification, llm, transformers, vllm, jev
- use_cases: run Jev on open models without the vendor; compare Jev with an LLM; judge or verify an agent's output

### zhengxuyu/litjev

- url: https://github.com/zhengxuyu/litjev
- description: Turns any off-the-shelf LLM into a Jev-style decision layer.
- stars: 46
- language: Python
- license: Apache-2.0
- pushed_at: 2026-09-21
- use_cases: run Jev on open models without the vendor; score or rank candidates in a pipeline; compare Jev with an LLM

### OmniJev/PlayJev

- url: https://github.com/OmniJev/PlayJev
- description: Plays ten browser games from the frame alone on a fine-tuned Qwen3.5-0.8B, one forward pass per move, open weights and a browser demo.
- stars: 45
- language: JavaScript
- license: Apache-2.0
- pushed_at: 2026-09-24
- topics: browser-games, game-ai, game-playing-agent, html5-games, imitation-learning, jev
- use_cases: run Jev on open models without the vendor; compare Jev with an LLM; drive a browser or GUI with an agent

### JoshuaSP/open-jev

- url: https://github.com/JoshuaSP/open-jev
- description: Typed JSON inference with DiffusionGemma, benchmarked against Jev.
- stars: 43
- language: Python
- license: MIT
- pushed_at: 2026-09-16
- use_cases: compare Jev with an LLM; judge or verify an agent's output; extract structured fields from text

### iammrduncan/typesafe-ai-benchmark

- url: https://github.com/iammrduncan/typesafe-ai-benchmark
- description: LLM gateway that mimics the TypeSafe response shape, useful as a stand-in while you wait for a key.
- stars: 40
- language: TypeScript
- license: MIT
- pushed_at: 2026-09-19
- use_cases: compare Jev with an LLM; benchmark or calibrate Jev; judge or verify an agent's output

### mithalouni/system-one-open

- url: https://github.com/mithalouni/system-one-open
- description: Typed calibrated decisions in one forward pass on Gemma 4 E2B and Gemma 3 270M.
- stars: 38
- language: Python
- license: NOASSERTION
- pushed_at: 2026-09-17
- use_cases: classify support tickets or messages; run Jev on open models without the vendor; compare Jev with an LLM

### zhihz/openjev

- url: https://github.com/zhihz/openjev
- description: Bilingual local decisions from context, questions, and candidate answers.
- stars: 35
- language: Python
- license: NOASSERTION
- pushed_at: 2026-09-16
- use_cases: score or rank candidates in a pipeline; judge or verify an agent's output; run Jev on open models without the vendor

### rorshopping/jev-on-a-laptop

- url: https://github.com/rorshopping/jev-on-a-laptop
- description: Study of Jev-style decisions on stock 1.5B to 8B models on a laptop, with a Hugging Face demo.
- stars: 25
- language: Python
- license: NOASSERTION
- pushed_at: 2026-09-17
- use_cases: run Jev on open models without the vendor; compare Jev with an LLM; benchmark or calibrate Jev

### olanotolu/jevbetter

- url: https://github.com/olanotolu/jevbetter
- description: A stronger one-pass scorer with a head-to-head benchmark against the jevlike starter design.
- stars: 16
- language: Python
- license: MIT
- pushed_at: 2026-09-16
- use_cases: score or rank candidates in a pipeline; benchmark or calibrate Jev; pick which skill or prompt to load

### genai-craft/openvons

- url: https://github.com/genai-craft/openvons
- description: Open decision layer answering a finite option set with probabilities split into execute, confirm, and reject. Independent replica, not TypeSafe weights.
- stars: 14
- language: Python
- license: NOASSERTION
- pushed_at: 2026-09-21
- topics: calibration, decision-model, japanese, speech-recognition, voice-commands, whisper
- use_cases: gate or approve tool calls before they run; benchmark or calibrate Jev; compare Jev with an LLM

### amithgc/local-jev

- url: https://github.com/amithgc/local-jev
- description: Offline server wire-compatible with the System One endpoint, checked against the official SDK; reports 80.5 percent on JevBench's public items against 86.6 percent published for the hosted API.
- stars: 13
- language: Python
- license: MIT
- pushed_at: 2026-09-21
- use_cases: run Jev on open models without the vendor; classify support tickets or messages; compare Jev with an LLM

### David-Lolly/Jev-Compatible

- url: https://github.com/David-Lolly/Jev-Compatible
- description: Gateway that turns an existing SGLang or vLLM deployment into a Jev-compatible decision service by scoring candidate tokens, with no training and no model changes.
- stars: 6
- language: Python
- pushed_at: 2026-09-21
- use_cases: score or rank candidates in a pipeline; classify support tickets or messages; run Jev on open models without the vendor

### metask-ai/metask-jev

- url: https://github.com/metask-ai/metask-jev
- description: Open-weight typed-decision models on Qwen3.5 with calibrated per-option probabilities in one forward pass; reports 80.1 percent on JevBench against 75.3 for Jev 1.13.
- stars: 2
- language: Python
- pushed_at: 2026-09-22
- use_cases: benchmark or calibrate Jev; score or rank candidates in a pipeline; compare Jev with an LLM
