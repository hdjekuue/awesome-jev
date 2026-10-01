<div align="center">

# Awesome Jev

# ⚡ Tout est décision.

**L'annuaire de référence, mis à jour automatiquement, de tout ce qui est construit sur [Jev](https://typesafe.ai) — le modèle System One de TypeSafe AI, le premier modèle qui répond par des jugements typés et des probabilités calibrées plutôt que par du texte.**

**[English](README.md) · [中文](README.zh.md) · [Français](README.fr.md)**

</div>

<p align="center">
  <a href="https://github.com/hdjekuue/awesome-jev"><img src="https://img.shields.io/github/stars/hdjekuue/awesome-jev?style=social" alt="GitHub stars"></a>
  <a href="https://github.com/hdjekuue/awesome-jev/fork"><img src="https://img.shields.io/github/forks/hdjekuue/awesome-jev?style=social" alt="GitHub forks"></a>
  <img src="https://img.shields.io/github/last-commit/hdjekuue/awesome-jev" alt="last commit">
  <a href="CONTRIBUTING.fr.md"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs welcome"></a>
  <a href="https://github.com/topics/jev"><img src="https://img.shields.io/badge/topic-jev-ff7a45" alt="jev topic"></a>
  <img src="https://img.shields.io/badge/CC0-lightgrey.svg" alt="CC0">
</p>

<p align="center">
  <a href="https://typesafe.ai"><b>TypeSafe AI</b></a> ·
  <a href="https://docs.typesafe.ai"><b>Documentation</b></a> ·
  <a href="https://vercel.com/ai-gateway/models/jev"><b>AI Gateway</b></a> ·
  <a href="https://discord.gg/typesafe"><b>Discord</b></a> ·
  <a href="https://github.com/topics/jev"><b>Sujet <code>jev</code></b></a> ·
  <a href="https://hdjekuue.github.io/awesome-jev/fr/"><b>Site web</b></a>
</p>

---

> ### ⭐ Mettez une étoile — c'est comme ça que le prochain bâtisseur vous trouve
>
> Chaque entrée ci-dessous a été ajoutée par un contributeur qui voulait que son projet soit trouvé. GitHub classe les listes étoilées plus haut, et **une étoile est le geste le plus rentable que vous puissiez faire pour les projets listés ici.**
>
> <a href="https://github.com/hdjekuue/awesome-jev"><img src="https://img.shields.io/github/stars/hdjekuue/awesome-jev?style=for-the-badge&label=%E2%AD%90%20Star%20%E2%AD%90" alt="Star on GitHub"></a>
>
> **Objectif : 0 → 100 étoiles.** À l'approche, les entrées notables seront épinglées en haut du README et du site. Aucun placement payant, aucun quota — juste le signal de la communauté sur ce qui vaut vraiment le coup.
>
> **Vous avez construit quelque chose sur Jev ?** [Ouvrez une PR](CONTRIBUTING.fr.md) (une entrée par PR, trois minutes). Ajoutez le sujet [`jev`](https://github.com/topics/jev) à votre dépôt et [ouvrez une issue](https://github.com/hdjekuue/awesome-jev/issues/new/choose) si vous préférez — le curateur IA s'en chargera.

---

## 📖 Sommaire

- [Qu'est-ce que Jev ?](#quest-ce-que-jev) · [Pourquoi des décisions typées](#pourquoi-des-décisions-typées) · [L'annuaire](#-lannuaire) · [Comment il est tenu](#-comment-cette-liste-est-tenue) · [FAQ](#-faq) · [Contribuer](#-contribuer) · [Licence](#-licence)

---

## Qu'est-ce que Jev ?

Jev est le modèle **System One** de TypeSafe AI. Vous lui donnez un `state` et un ensemble de **questions typées**, évaluées en parallèle, et il renvoie des réponses typées avec une probabilité par option et un score de confiance. Pas de prompt engineering, pas de regex sur du texte, plus de parse qui échoue à 3 h du matin.

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
| **Modèle** | `jev-latest` |
| **Endpoint** | `POST https://api.typesafe.ai/v1/systemone` |
| **Entrée** | un `state` + des `questions` typées, évaluées en parallèle |
| **Sortie** | réponses typées, probabilités par option, confiance |
| **Latence** | 70–500 ms de bout en bout |
| **Tarification** | 0,042 $ / MTok en entrée · **sortie gratuite** |
| **SDK** | [JS/TS](https://github.com/typesafe-ai/typesafe-sdk-js) · [Python](https://github.com/typesafe-ai/typesafe-sdk-python) · [AI Gateway](https://vercel.com/ai-gateway/models/jev) · 30+ clients communautaires ci-dessous |

### Les trois primitives

| Primitive | Ce que vous demandez | Ce que vous recevez |
| --- | --- | --- |
| **`choice`** | Choisir une option dans une liste | `choice`, `probabilities`, `confidence` |
| **`score`** | Noter l'état selon une grille | `score`, `probabilities`, `confidence` |
| **`noul`** | Cette affirmation est-elle vraie ? | `noul` (0–1) |

## Pourquoi des décisions typées

Une boucle d'agent ne pose pas une question difficile — elle en pose **des centaines de petites**. Quel modèle pour ce tour ? Cet appel d'outil est-il sûr ? Quelle skill charger ? Ce contexte est-il encore pertinent ? La réponse est-elle assez bonne pour s'arrêter ? Aujourd'hui, chaque réponse est une chaîne à parser, et chaque parse est un point de défaillance.

Jev transforme tout cela en appels que vous pouvez **seuiller, auditer, tester et facturer** :

```ts
// Tout le garde-fou, et il est testable unitairement.
if (res.answers.risk.choice === "block" && res.answers.risk.confidence > 0.8) {
  return deny("blocked by risk judge");
}
```

C'est pourquoi l'écosystème ci-dessus n'est pas une liste de jouets : ce sont des routeurs qui réduisent le coût d'inférence, des portes qui bloquent les appels d'outils dangereux, des passes de compaction qui gardent la fenêtre propre, des juges qui attrapent le slop, et des garde-fous contre l'injection de prompt — le tout dans un budget de 70–500 ms.

## 📊 En chiffres

| | |
| --- | --- |
| **350+** projets catalogués, actualisés automatiquement via l'API GitHub |
| **90 k+** étoiles suivies sur les dépôts listés |
| **20** catégories, des SDK officiels aux répliques open-source |
| **3** langues — English, 中文, Français |
| **1** fichier de données, pour que les langues ne puissent pas diverger |
| **0** clé d'API — l'IA de maintenance tourne sur des modèles gratuits |

## 🔍 Trouvez vite ce qu'il vous faut

- **Je veux un SDK dans mon langage** → [🧩 SDK et clients communautaires](#%EF%B8%8F-sdks-et-clients-communautaires)
- **Je veux router entre modèles ou agents** → [🚦 Routage et passerelles](#%EF%B8%8F-routage-et-passerelles)
- **Je veux que mon agent consomme moins de contexte** → [🗜️ Contexte et compaction](#%EF%B8%8F-contexte-et-compaction)
- **Je veux un agent de navigation web** → [🌐 Navigation et contrôle d'ordinateur](#%EF%B8%8F-navigation-et-contrôle-dordinateur)
- **Je veux de la modération / sécurité** → [🛡️ Sûreté, modération et vérification](#%EF%B8%8F-sûreté-modération-et-vérification)
- **Je veux m'affranchir de l'API TypeSafe** → [🧠 Modèles ouverts et répliques](#-mod%C3%A8les-ouverts-et-r%C3%A9pliques)
- **Je veux savoir si ça marche vraiment** → [📊 Benchmarks, évaluations et calibration](#-benchmarks-%C3%A9valuations-et-calibration)
- **Je démarre** → [🧭 Pour commencer](#%EF%B8%8F-pour-commencer)

> 🤖 **Vous travaillez avec un agent IA ?** Cette liste est publiée sous forme de données lisibles par machine, pas seulement de prose. Récupérez [`llms.txt`](https://hdjekuue.github.io/awesome-jev/llms.txt) pour l'index, [`llms-full.txt`](https://hdjekuue.github.io/awesome-jev/llms-full.txt) pour toutes les entrées en markdown, [`projects.json`](https://hdjekuue.github.io/awesome-jev/projects.json) pour les données structurées, ou ajoutez-la comme skill avec [`npx skills add hdjekuue/awesome-jev`](https://skills.sh/hdjekuue/awesome-jev). Voir [AGENTS.md](AGENTS.md).

---

## 🗂️ L'annuaire

Tout ce qui suit est généré à partir de [`data/entries.json`](data/entries.json). Étoiles, licences et dates de push sont actualisées par GitHub Actions — une ligne périmée est corrigée au tour suivant, et chaque entrée est vérifiée avant publication.

<!-- entries:start -->

<!-- 352 entries · 335 repos · 93,460 stars · 21 languages · updated 2026-10-01 -->

- [🧭 Pour commencer](#-pour-commencer) — 16
- [🏛️ SDK officiels et support framework](#-sdk-officiels-et-support-framework) — 7
- [🤖 Agents de code](#-agents-de-code) — 48
- [🚦 Routage et passerelles](#-routage-et-passerelles) — 10
- [🗜️ Contexte et compaction](#-contexte-et-compaction) — 6
- [🔍 Relecture de code et qualité](#-relecture-de-code-et-qualité) — 21
- [🌐 Navigation et contrôle d'ordinateur](#-navigation-et-contrôle-dordinateur) — 14
- [📱 Automatisation mobile et bureau](#-automatisation-mobile-et-bureau) — 4
- [🔎 Recherche, reranking et RAG](#-recherche-reranking-et-rag) — 13
- [🛡️ Sûreté, modération et vérification](#-sûreté-modération-et-vérification) — 14
- [🗄️ Données et exploitation](#-données-et-exploitation) — 20
- [📦 Applications et extensions](#-applications-et-extensions) — 29
- [🧩 SDK et clients communautaires](#-sdk-et-clients-communautaires) — 32
- [⌨️ Ligne de commande](#-ligne-de-commande) — 14
- [📊 Benchmarks, évaluations et calibration](#-benchmarks-évaluations-et-calibration) — 27
- [🧠 Modèles ouverts et répliques](#-modèles-ouverts-et-répliques) — 41
- [🎮 Jeux, robotique et simulation](#-jeux-robotique-et-simulation) — 19
- [💹 Finance et trading](#-finance-et-trading) — 5
- [🎪 Terrains de jeu et démos](#-terrains-de-jeu-et-démos) — 12

## 🧭 Pour commencer

La fiche technique, les trois primitives et la documentation — à lire avant de construire quoi que ce soit. _(16 entrées)_

| Projet | Description | Lang / Licence | ⭐ | Maj |
| --- | --- | --- | --- | --- |
| [Introduction](https://docs.typesafe.ai/introduction) | Le modèle mental en deux pages : état plus questions typées en entrée, réponses typées avec probabilités en sortie. | official | — | — |
| [Quick start](https://docs.typesafe.ai/introduction/quickstart) | Première requête en Python, TypeScript ou curl. | official | — | — |
| [Primitives](https://docs.typesafe.ai/primitives) | Choice, Score et Noul, et quand utiliser chacun. | official | — | — |
| [State](https://docs.typesafe.ai/concepts/state) | Comment structurer ce que Jev évalue, et pourquoi moins c'est mieux. | official | — | — |
| [API reference](https://docs.typesafe.ai/api) | Le contrat de requête et de réponse. | official | — | — |
| [Models](https://docs.typesafe.ai/models) | Alias, version actuelle, tarifs et limites de débit. | official | — | — |
| [Model jaggedness: jev-1.13](https://docs.typesafe.ai/model-jaggedness/jev-1.13) | Modes de défaillance connus, directement fournis par le fournisseur. | official | — | — |
| [System One](https://docs.typesafe.ai/concepts/system-one) | Ce que signifie cette catégorie et en quoi elle diffère d'un modèle de conversation. | official | — | — |
| [How to build with System One](https://docs.typesafe.ai/concepts/how-to-build-with-system-one) | Décomposer un jugement en questions atomiques et conserver le flux de contrôle dans le code. | official | — | — |
| [Confidence](https://docs.typesafe.ai/confidence) | Ce que signifie le champ confidence et comment le convertir en action, révision ou repli. | official | — | — |
| [Patterns](https://docs.typesafe.ai/patterns) | Fan-out spéculatif, routage par confiance, scoring composite, routage par intention. | official | — | — |
| [Use-case map](https://docs.typesafe.ai/concepts/use-case-map) | Le catalogue du fournisseur indiquant où Jev convient et où il ne convient pas. | official | — | — |
| [Cookbooks](https://docs.typesafe.ai/cookbooks/parallel_questions) | Recettes pratiques, en commençant par le regroupement de plusieurs questions en une seule requête ; la barre latérale contient les autres. | official | — | — |
| [Workflow evals](https://evals.typesafe.ai/) | Le benchmark du fournisseur sur quatre workflows, avec les réserves indiquées sur la page. | official | — | — |
| [llms.txt](https://docs.typesafe.ai/llms.txt) | Chaque page de documentation en Markdown brut, à fournir à un agent. | official | — | — |
| [Console](https://console.typesafe.ai/) | Liste d'attente, clés API et utilisation. | official | — | — |

## 🏛️ SDK officiels et support framework

Maintenus par TypeSafe AI, plus les frameworks qui intègrent Jev nativement. _(7 entrées)_

| Projet | Description | Lang / Licence | ⭐ | Maj |
| --- | --- | --- | --- | --- |
| [vercel/eve](https://github.com/vercel/eve) | Framework d'agents de Vercel ; Jev est le juge typé dans son étape evaluate. | typescript · apache-2.0 | 5,418 | 2026-09-30 |
| [typesafe-ai/skills](https://github.com/typesafe-ai/skills) | Skills d’agent pour concevoir des questions, construire des workflows et les évaluer. | official · mit | 2,469 | 2026-09-12 |
| [vercel-labs/ai-cli](https://github.com/vercel-labs/ai-cli) | Le Vercel AI SDK dans votre terminal, avec un chemin evaluate qui s'exécute sur Jev. | typescript | 817 | 2026-09-30 |
| [typesafe-ai/system-one-adapter-python](https://github.com/typesafe-ai/system-one-adapter-python) | Même interface `TypeSafeClient` adossée à une API LLM, pour comparer Jev à un modèle de chat sur des questions identiques. | official · python · mit | 363 | 2026-09-22 |
| [typesafe-ai/typesafe-sdk-js](https://github.com/typesafe-ai/typesafe-sdk-js) | Client TypeScript et JavaScript avec des types de réponse inférés à partir de vos questions. | official · typescript · mit | 259 | 2026-09-15 |
| [typesafe-ai/typesafe-sdk-python](https://github.com/typesafe-ai/typesafe-sdk-python) | Client Python, synchrone et asynchrone. | official · python · mit | 256 | 2026-09-26 |
| [Agent skill](https://docs.typesafe.ai/agent-skill) | Comment installer le skill officiel dans Claude Code, Cursor et les outils associés. | official | — | — |

## 🤖 Agents de code

Routage, garde-fous d'outils, relecteurs, skills et serveurs MCP pour les harnais d'agents. _(48 entrées)_

| Projet | Description | Lang / Licence | ⭐ | Maj |
| --- | --- | --- | --- | --- |
| [nicobailon/pi-mcp-adapter](https://github.com/nicobailon/pi-mcp-adapter) | Évaluation typée et recherche sémantique opt-in sur les résultats d’outils MCP, derrière une liste d’autorisation de sortie de données par serveur. | typescript · mit | 1,568 | 2026-09-30 |
| [kerpopule/hermes-jev-skills](https://github.com/kerpopule/hermes-jev-skills) | Confie les petites décisions d'un agent à Jev : quel modèle répond au tour, quelles skills charger, quels passages comptent, quels tours survivent à la compaction. | python · mit | 918 | 2026-09-29 |
| [gargpratyush/jev-router](https://github.com/gargpratyush/jev-router) | Achemine chaque tâche vers le modèle Claude le moins cher capable de la traiter. | javascript · mit | 499 | 2026-09-19 |
| [jkudish/jev-mcp](https://github.com/jkudish/jev-mcp) | Premier serveur MCP pour Jev, et toujours le plus lié. | javascript · mit | 464 | 2026-09-29 |
| [notque/vexjoy-agent](https://github.com/notque/vexjoy-agent) | Boîte à outils d'agents dont la commande `/d` choisit l'agent spécialiste, la skill et le pipeline en un seul appel Jev, plus un plugin optionnel Jev auto-compact. | python · mit | 426 | 2026-09-30 |
| [TianyuCodings/JevHarness](https://github.com/TianyuCodings/JevHarness) | Fait écrire par un LLM un harness spécifique à la tâche qui transforme les observations en questions Jev, puis le fige et l'améliore à partir des récompenses et des traces d'exécution complètes. | python | 400 | 2026-09-21 |
| [itsmostafa/typesafe-mcp](https://github.com/itsmostafa/typesafe-mcp) | Serveur MCP et CLI Go en binaire unique qui expose les jugements TypeSafe Jev à Claude Desktop, Claude Code et Codex. | go · mit | 337 | 2026-09-30 |
| [miuuyy/Astra-Ares](https://github.com/miuuyy/Astra-Ares) | Laisse Jev choisir l'effort de raisonnement et sa durée de maintien pour une tâche Codex en cours, sur un CLI Codex patché compilé depuis la source upstream. | javascript · mit | 293 | 2026-09-23 |
| [0xNatoshi/jev-codex-router](https://github.com/0xNatoshi/jev-codex-router) | Choisit le modèle, la profondeur de réflexion et le mode de vitesse pour chaque tour de Codex. | javascript · mit · archived | 278 | 2026-09-22 |
| [kitze/skillbox](https://github.com/kitze/skillbox) | Bibliothèque de skills auto-hébergée et versionnée servie via MCP, avec Jev qui recommande quel skill charger. | typescript · mit | 255 | 2026-09-19 |
| [DevMortimer/pi-warden](https://github.com/DevMortimer/pi-warden) | Garde-fous qui orientent au lieu d'interrompre : appels irréversibles, appels hors tâche, boucles bloquées, affirmations d'achèvement non vérifiées, environ 250 ms chacun. | typescript · mit | 154 | 2026-09-29 |
| [y0usaf/pi-jev](https://github.com/y0usaf/pi-jev) | Un contrôle mesuré des appels d'outils plus un outil `jev_ask` pour des réponses typées dans Pi. | typescript · mit | 151 | 2026-09-25 |
| [dbreunig/building-with-jev-skill](https://github.com/dbreunig/building-with-jev-skill) | Skill pour écrire et améliorer des programmes qui appellent Jev. | — | 145 | 2026-09-17 |
| [Dicklesworthstone/skillranker](https://github.com/Dicklesworthstone/skillranker) | CLI Rust et hooks qui classent les skills installés pour l'étape suivante à partir du contexte live de la session, avec abstention. | rust · noassertion | 125 | 2026-09-29 |
| [devagrawal09/jev-code](https://github.com/devagrawal09/jev-code) | Boîte à outils en ligne de commande à laquelle les agents de codage confient les tâches à fort jugement, avec un workflow Jev typé par requête. | typescript · mit | 119 | 2026-09-19 |
| [devagrawal09/stanley-code](https://github.com/devagrawal09/stanley-code) | CLI de codage où Jev achemine une requête en langage courant vers un workflow déterministe unique, et ce workflow pose à Jev des questions à choix fixe sur les preuves recueillies. | typescript · mit | 119 | 2026-09-19 |
| [fabricioctelles/skills](https://github.com/fabricioctelles/skills) | Annuaire d'agent-skills pouvant noter des critères d'évaluation subjectifs avec Jev. | python · apache-2.0 | 97 | 2026-09-27 |
| [EliaAlberti/jev-rules](https://github.com/EliaAlberti/jev-rules) | Évalue vos règles permanentes par rapport à chaque prompt et ne fournit que celles qui s'appliquent, une fois par session. | javascript · mit | 63 | 2026-09-27 |
| [TheoOliveira/pi-jev](https://github.com/TheoOliveira/pi-jev) | Routage sémantique d'outils et décisions typées sous forme d'outils Pi. | typescript · mit | 58 | 2026-09-24 |
| [DevMortimer/pi-typesafe](https://github.com/DevMortimer/pi-typesafe) | Outil d'évaluation par lots, terrain de jeu en terminal et API typée pour les auteurs d'extensions Pi. | typescript · mit | 49 | 2026-09-30 |
| [tacticocc/Jevbridge](https://github.com/tacticocc/Jevbridge) | Adaptateur ACP et MCP qui associe Jev à n’importe quel LLM pour l’utilisation d’ordinateur et les décisions typées. | typescript · mit | 46 | 2026-09-21 |
| [shantanugoel/ask-jev-skill](https://github.com/shantanugoel/ask-jev-skill) | Permet à Hermes et aux agents similaires d’interroger Jev directement. | python · mit | 42 | 2026-09-17 |
| [shitianfang/jev-use](https://github.com/shitianfang/jev-use) | Confie à Jev les étapes Claude Code, Codex et pi qui ne nécessitent aucune sortie texte, avec un contrat d'escalade typé pour tout ce qu'il ne doit pas décider. | javascript · mit | 31 | 2026-09-22 |
| [jomatsu/pi-jev-auto-mode](https://github.com/jomatsu/pi-jev-auto-mode) | Approuve automatiquement les appels bash, write et edit de façon sémantique et refuse par défaut quand il ne peut pas trancher. | typescript · mit | 31 | 2026-09-24 |
| [keeltrace/hermes-jev](https://github.com/keeltrace/hermes-jev) | Décisions typées, classement, vérification et contrôle d'outils opt-in. | python · mit | 31 | 2026-09-28 |
| [compozy/yoshi](https://github.com/compozy/yoshi) | Proxy d'élagage de contexte pour Claude Code et Codex, avec des économies mesurées plutôt qu'affirmées. | typescript · mit | 27 | 2026-09-18 |
| [blakestone-x/jev-mcp](https://github.com/blakestone-x/jev-mcp) | Classify, score, check, match et screen, avec un niveau de confiance sur chaque réponse. | python · mit | 26 | 2026-09-16 |
| [GodsBoy/jev-agent-skill-router](https://github.com/GodsBoy/jev-agent-skill-router) | Routage de compétences sensible à la confiance avec un chemin d'abstention. | python · mit | 24 | 2026-09-16 |
| [Brainwires/jevwire](https://github.com/Brainwires/jevwire) | Serveur MCP, modèle de décision embarquable et plugin à escalade seule qui peut rendre le harnais plus strict mais jamais plus souple. | typescript · mit | 22 | 2026-09-21 |
| [valentynkit/jev-belay](https://github.com/valentynkit/jev-belay) | Hook d'arrêt qui bloque un "done" non vérifié : lit la transcription pour trouver des preuves et, uniquement lorsque des fichiers ont changé sans vérification réussie depuis, dépense un appel Jev à quatre questions ; reste ouvert sur chaque chemin d'erreur. | javascript · mit | 20 | 2026-09-20 |
| [anpicasso/hermes-jev-approvals](https://github.com/anpicasso/hermes-jev-approvals) | Approuve, refuse ou escalade les commandes shell signalées avant leur exécution ; accélérations rapportées par le fournisseur. | python · mit | 20 | 2026-09-22 |
| [mejiasd3v/pi-jev-router](https://github.com/mejiasd3v/pi-jev-router) | Routage automatique de modèles pour Pi via Vercel AI Gateway. | javascript · mit | 16 | 2026-09-22 |
| [DECRUX9812/typesafe-skill-router](https://github.com/DECRUX9812/typesafe-skill-router) | Désigne l'unique skill à charger avant l'appel au modèle ; stdlib uniquement, environ un dixième de cent par tour. | python · mit | 15 | 2026-09-21 |
| [kubet/azdaja](https://github.com/kubet/azdaja) | Couche récursive de modèles de langage pour Claude Code, Codex, Gemini et OpenCode qui conserve les sources en local ; Jev est une feuille optionnelle pour le reranking, la vérification et les jointures sémantiques. | python · mit | 14 | 2026-09-21 |
| [HyunjunJeon/pi-quiet-ask](https://github.com/HyunjunJeon/pi-quiet-ask) | Jev comme couche de décision silencieuse de l'agent de codage Pi. | typescript · mit | 12 | 2026-09-18 |
| [harshwasan/pi-jev-sentinel](https://github.com/harshwasan/pi-jev-sentinel) | Vérifie les appels d'outils Pi, les sorties d'outils et les réponses contre les actions risquées et l'injection de prompt, avec approbations utilisateur, revérifications du contexte, masquage des secrets et épinglage facultatif des tâches. | typescript · mit | 11 | 2026-09-20 |
| [24601/Augustus](https://github.com/24601/Augustus) | Skill pour décider où un jugement typé a sa place et ce qui reste dans le code ; un complément au skill officiel, pas un remplacement. | python · mit | 11 | 2026-09-28 |
| [adarshmishra07/jcm-router](https://github.com/adarshmishra07/jcm-router) | Proxy local qui choisit le modèle et l’effort par message et laisse le chat principal en cache intact. | typescript · mit | 9 | 2026-09-17 |
| [AbdelStark/bicameral](https://github.com/AbdelStark/bicameral) | Harnais hybride pour Pi : un LLM écrit le code, les réflexes Jev filtrent chaque appel en allow, confirm, block, warn ou steer. | typescript · mit | 9 | 2026-09-16 |
| [ajensenwaud/hermes-jev-plugin](https://github.com/ajensenwaud/hermes-jev-plugin) | Quatre outils Hermes pour vérifications atomiques, routage et notation par grille ; répertoriés dans le catalogue de plugins Hermes. | python · mit | 8 | 2026-09-19 |
| [HyunjunJeon/jev-judgment](https://github.com/HyunjunJeon/jev-judgment) | Envoie les jugements fermés d'un agent de codage à Jev au lieu du modèle de chat. | python · mit | 7 | 2026-09-17 |
| [3clyp50/a0-typesafe-ai](https://github.com/3clyp50/a0-typesafe-ai) | Outils typés et cartes de probabilités pour Agent Zero. | python · mit | 6 | 2026-09-17 |
| [bestagentkits/jev-skillful](https://github.com/bestagentkits/jev-skillful) | Routeur par prompt couvrant les skills, les serveurs MCP, les agents et les commandes, qui mesure si l'injection a été utile. | typescript · mit | 5 | 2026-09-17 |
| [noplan-inc/limpet](https://github.com/noplan-inc/limpet) | Hook Stop qui empêche l'agent de s'arrêter trop tôt, évalué selon des règles en langage naturel. | python · mit | 5 | 2026-09-17 |
| [suenot/codex-jev-router](https://github.com/suenot/codex-jev-router) | Utilise Jev pour sélectionner le modèle et l'effort de raisonnement des sous-agents Codex, avec des seuils de confiance et un repli Sol. | javascript · mit | 5 | 2026-09-27 |
| [legacybridge-tech/pi-typesafe-jev](https://github.com/legacybridge-tech/pi-typesafe-jev) | Extension Pi exposant les jugements Jev sous forme de cinq outils Pi. | typescript · noassertion | 4 | 2026-09-17 |
| [BYK/jev-mcp](https://github.com/BYK/jev-mcp) | Serveur MCP axé sur l'évaluation : prototyper une question, l'appliquer à de nombreux éléments, puis mesurer les variantes contre des exemples étiquetés avec un balayage de seuil. | typescript · mit | 4 | 2026-09-18 |
| [samtay32/jev-system-architect](https://github.com/samtay32/jev-system-architect) | Repère le jugement flou dans un système et le transforme en petites primitives Choice, Score et Noul. | mit | 3 | 2026-09-17 |

## 🚦 Routage et passerelles

Choix du modèle et des outils à chaque tour, sous une échéance stricte. _(10 entrées)_

| Projet | Description | Lang / Licence | ⭐ | Maj |
| --- | --- | --- | --- | --- |
| [BillionsBobby/JevRouter](https://github.com/BillionsBobby/JevRouter) | Modèles, subagents, skills, outils MCP et CLI réunis en un seul ensemble de candidats ; Jev choisit, le routeur applique les permissions et le risque ; 44 % de bons appels d'outils dans les cinq premiers contre 24 pour DeepSeek sur Toolathlon. | typescript · mit | 303 | 2026-09-26 |
| [vinilana/jev-gateway](https://github.com/vinilana/jev-gateway) | Passerelle locale pour Codex et Claude Code qui envoie la décision "which tool next" à Jev et tout le reste à votre modèle habituel. | typescript · mit | 267 | 2026-09-25 |
| [juspay/neurolink](https://github.com/juspay/neurolink) | SDK d'IA TypeScript où decide, via Jev, est l'égal de generate et stream : un appel de jugement typé oriente le choix du modèle, élague le contexte et sélectionne les outils MCP. | typescript · mit | 144 | 2026-09-30 |
| [nidhi-singh02/agent-router](https://github.com/nidhi-singh02/agent-router) | Choisit entre Cursor, Claude Code, Codex ou OpenCode avec modèle et niveau d'effort pour une tâche, puis la lance. | typescript · mit | 99 | 2026-09-27 |
| [yusukebe/hono-jev-router](https://github.com/yusukebe/hono-jev-router) | Route les requêtes HTTP par leur sens dans Hono. | typescript · mit | 51 | 2026-09-18 |
| [xinyao27/jevonian](https://github.com/xinyao27/jevonian) | Proxy local compatible OpenAI, Anthropic et Responses qui effectue un appel Jev par tour pour choisir à la fois la route du modèle et le niveau de réflexion, en filtrant les candidats par fenêtre de contexte et quota. | typescript · agpl-3.0 | 16 | 2026-09-29 |
| [prismhq/jev-router](https://github.com/prismhq/jev-router) | Routeur LLM au-dessus de LiteLLM. | python · mit | 15 | 2026-09-17 |
| [iamvatsalpatel/tiershift](https://github.com/iamvatsalpatel/tiershift) | Bascule chaque appel LLM vers le modèle le moins cher capable de le traiter, politique en YAML, décision en environ 180 ms. | typescript · mit | 4 | 2026-09-28 |
| [FirasSX914/Janus](https://github.com/FirasSX914/Janus) | Mesure sur vos données quand Jev surpasse les autres modèles, puis route en conséquence. | python · mit | 3 | 2026-09-18 |
| [daviddl9/jev-router](https://github.com/daviddl9/jev-router) | Jev choisit le niveau de worker pour chaque étape dans OMP et Pi, en gardant la planification et la révision sur un modèle puissant et le travail borné sur des modèles moins chers. | typescript · noassertion | 0 | 2026-09-21 |

## 🗜️ Contexte et compaction

Décidez ce qui reste dans la fenêtre avant que le modèle ne le lise. _(6 entrées)_

| Projet | Description | Lang / Licence | ⭐ | Maj |
| --- | --- | --- | --- | --- |
| [tamaratran/fast-jev-compaction](https://github.com/tamaratran/fast-jev-compaction) | Remplace le résumé de compaction par des décisions Jev : chaque appel d'outil et résultat est noté en une seule requête, les éléments obsolètes sont supprimés, tout ce qui est conservé reste verbatim. | typescript · mit | 7,225 | 2026-09-18 |
| [tamaratran/jev-pruner](https://github.com/tamaratran/jev-pruner) | Élague les longues sorties Bash avec Jev après l'exécution de la commande et avant que le modèle ne les voie ; les sorties courtes, les erreurs et les formats structurés passent intacts. | typescript · mit | 153 | 2026-09-30 |
| [GhalebDweikat/winnow](https://github.com/GhalebDweikat/winnow) | Évalue chaque résultat d'outil avant son entrée en contexte, pour que la fenêtre se remplisse moins vite au lieu d'être nettoyée ensuite. | python · mit | 100 | 2026-09-30 |
| [IAmUnbounded/save-token-jev-clean](https://github.com/IAmUnbounded/save-token-jev-clean) | Compaction qui demande à Jev quels appels d'outils comptent encore et conserve le reste tel quel, avec des adaptateurs pour Claude Code, Codex, OpenCode et les transcriptions API brutes. | typescript · mit | 76 | 2026-09-18 |
| [joelhooks/pi-fast-jev-compaction](https://github.com/joelhooks/pi-fast-jev-compaction) | L'idée de compaction verbatim, portée sur Pi. | typescript · mit | 14 | 2026-09-18 |
| [Nyarlathoteppppp/pi-heed](https://github.com/Nyarlathoteppppp/pi-heed) | Vérifie chaque appel d'outil à effet de bord par rapport à ce qui a été dit plus tôt dans la session, pour que "review only" reste valable après compaction. | typescript · mit | 11 | 2026-09-19 |

## 🔍 Relecture de code et qualité

Juges, linters, seuils de couverture et tableaux de bord de relecture. _(21 entrées)_

| Projet | Description | Lang / Licence | ⭐ | Maj |
| --- | --- | --- | --- | --- |
| [devagrawal09/jev-review](https://github.com/devagrawal09/jev-review) | Workflow de revue de code par étapes avec un tableau de bord local. | typescript · mit | 643 | 2026-09-17 |
| [thruwire/foreman](https://github.com/thruwire/foreman) | Supervise une usine logicielle d'agents, Jev prenant les décisions de validation et de rejet. | python · mit | 619 | 2026-09-28 |
| [lakeday-org/perch](https://github.com/lakeday-org/perch) | Linting sémantique : règles en langage courant, chaque fichier évalué par Jev, exécution en local ou en CI. | javascript · mit | 316 | 2026-09-30 |
| [NiazMorshed2007/jev-review](https://github.com/NiazMorshed2007/jev-review) | Plugin MCP local-first pour la revue qualité continue par des agents de codage. | typescript · mit | 231 | 2026-09-17 |
| [supercorp-ai/supercov](https://github.com/supercorp-ai/supercov) | Signaux de qualité de code et de couverture pour les agents de codage. | rust · mit | 141 | 2026-09-27 |
| [kyu1204/jgrep](https://github.com/kyu1204/jgrep) | `--diff` bloque une PR en CI selon une règle écrite en anglais, `--tests` liste les fichiers de test qu'un diff peut affecter, et `jgrep` seul recherche dans le code par ce qu'il fait ; un Noul par chunk, 16 chunks par requête. | typescript · mit | 58 | 2026-09-30 |
| [Alurith/jeff](https://github.com/Alurith/jeff) | CLI Go en lecture seule qui vérifie les fichiers par rapport à des règles codées telles que les effets de bord cachés et la gestion d'erreurs faible. | go · apache-2.0 | 38 | 2026-09-20 |
| [devanshbatham/commit-miner](https://github.com/devanshbatham/commit-miner) | Classe les diffs et messages de commit : corrections de bugs, corrections de sécurité avec CWEs, types de modifications. | rust | 36 | 2026-09-17 |
| [lukstei/slop-grader](https://github.com/lukstei/slop-grader) | Note les fichiers texte et markdown sur le slop IA, la grammaire et la qualité de la documentation technique, et guide un agent IA pour corriger automatiquement les violations. | typescript · mit | 32 | 2026-09-24 |
| [valentynkit/jev-commit](https://github.com/valentynkit/jev-commit) | Hook pre-commit : un appel Jev juge si le message de commit correspond au diff stagé, plus les restes de débogage, le travail non mentionné et les identifiants exposés ; avertit sauf en cas de secret, qu'il bloque. | python · mit | 13 | 2026-09-19 |
| [frostney/clean-code-review](https://github.com/frostney/clean-code-review) | Chaque fichier d'une PR jugé selon les règles Clean Code, puis relu par un LLM. | typescript · mit | 12 | 2026-09-23 |
| [huntedman/JevLint](https://github.com/huntedman/JevLint) | Linting sémantique configurable avec des jugements Noul au niveau des fichiers. | typescript · mit | 12 | 2026-09-20 |
| [doeixd/jev-pref](https://github.com/doeixd/jev-pref) | Transforme les préférences de votre AGENTS.md en un linter qui s'exécute sur les modifications de code et rend compte à l'agent. | javascript · mit | 11 | 2026-09-18 |
| [nozomi-koborinai/jev-spec](https://github.com/nozomi-koborinai/jev-spec) | Vérifie le code par rapport aux exigences d'une spec Markdown à chaque commit et fait échouer le build lorsque les deux divergent. | typescript · mit | 11 | 2026-09-29 |
| [HexyeDEV/JevPR](https://github.com/HexyeDEV/JevPR) | Application GitHub qui demande à Jev si une pull request peut être approuvée sans risque ou nécessite un spécialiste, puis convertit le verdict en check run. | python · apache-2.0 | 10 | 2026-09-25 |
| [stratonext/software-factory](https://github.com/stratonext/software-factory) | Exécute plusieurs agents de codage en local avec Jev comme juge et orchestrateur. | python · mit | 9 | 2026-09-30 |
| [raihankhan-rk/diffjury](https://github.com/raihankhan-rk/diffjury) | Routeur de risques PR et coach de revue. | typescript | 8 | 2026-09-22 |
| [cephalization/jev-triage](https://github.com/cephalization/jev-triage) | Récupère de grands dépôts et trie leurs issues avec des questions Jev typées. | typescript · mit | 5 | 2026-09-29 |
| [Ramneet-Singh/jevopt](https://github.com/Ramneet-Singh/jevopt) | Pilote de compilateur C/C++ qui demande à Jev s'il faut inliner chaque site d'appel discrétionnaire, à partir de l'IR LLVM et du source d'origine. | python · gpl-3.0 | 4 | 2026-09-21 |
| [allebee/pytest-jev](https://github.com/allebee/pytest-jev) | Plugin Pytest qui demande à Jev si des affirmations en anglais courant sur le texte d'un test sont valides, le tout en une seule requête, et fait échouer le test avec la probabilité de chaque affirmation sauf si Jev est sûr à au moins 80 %. | python · mit | 3 | 2026-09-21 |
| [fatwang2/jev-review-action](https://github.com/fatwang2/jev-review-action) | GitHub Action pour la révision des soumissions et la classification des PR avec Jev, sans modèle de génération de texte dans la boucle. | javascript · mit | 2 | 2026-09-20 |

## 🌐 Navigation et contrôle d'ordinateur

Jev choisit l'opération et l'élément DOM ; un petit LLM n'écrit que le texte. _(14 entrées)_

| Projet | Description | Lang / Licence | ⭐ | Maj |
| --- | --- | --- | --- | --- |
| [browser-use/jev-ultrafast](https://github.com/browser-use/jev-ultrafast) | Une seule requête sélectionne à la fois l'opération et l'élément cible depuis une table DOM indexée ; un petit LLM écrit uniquement du texte typé. Trajet de Zürich à Londres réservé en 7,1 secondes. | python · mit | 21,495 | 2026-09-30 |
| [awlevin/typesafe-computer-use](https://github.com/awlevin/typesafe-computer-use) | Fait de l'OCR sur l'écran, classifie l'action suivante, clique ; environ $0.0002 par étape sur macOS. | python · mit | 1,097 | 2026-09-29 |
| [wy-coliney/jev-browser-use](https://github.com/wy-coliney/jev-browser-use) | Skill et plugin Codex où Jev gère la navigation, les clics et le défilement tandis que Codex conserve la saisie et la vérification ; annonce des étapes de navigateur 5 à 10 fois plus rapides. | javascript · mit | 707 | 2026-09-23 |
| [Sac-Y/Jev-cu](https://github.com/Sac-Y/Jev-cu) | Utilisation d'ordinateur Codex où Jev choisit l'élément, l'action, l'achèvement et le risque à partir du texte à l'écran, sans envoi de captures d'écran ; readme en chinois. | javascript · mit | 613 | 2026-09-22 |
| [moritzkremb/jev-voice-browser](https://github.com/moritzkremb/jev-voice-browser) | Intention et cible décidées à chaque mot prononcé en environ 300 ms, souvent avant la fin de la phrase. | javascript · mit | 371 | 2026-09-21 |
| [jkudish/jev-browser](https://github.com/jkudish/jev-browser) | Le premier agent navigateur communautaire basé sur Jev, avec un GIF de démonstration. | javascript · mit | 297 | 2026-09-29 |
| [YUTA-fywoo/jev-gui-delegate](https://github.com/YUTA-fywoo/jev-gui-delegate) | Exécute une tâche d'interface graphique déléguée pour Codex via la vraie session Chrome ou Windows UI Automation, avec Jev qui choisit le contrôle à chaque étape. | python | 131 | 2026-09-27 |
| [socai-io/jev-social](https://github.com/socai-io/jev-social) | Laisse Jev choisir chaque étape de recherche sociale en lecture seule pendant que socai l'exécute dans une vraie session Chrome et diffuse des preuves vérifiables Instagram, TikTok ou LinkedIn dans un rapport. | javascript · mit | 128 | 2026-09-30 |
| [savka777/jev-use](https://github.com/savka777/jev-use) | Pilotage vocal et au clavier de macOS : Jev choisit la prochaine action à l'écran depuis l'Accessibility tree, sans captures d'écran. | swift · mit | 112 | 2026-09-21 |
| [Ying-Kai-Liao/jev-browser](https://github.com/Ying-Kai-Liao/jev-browser) | Un LLM planifie, Jev décide ; bibliothèque, CLI et serveur MCP. | javascript · mit | 94 | 2026-09-29 |
| [hqman/JevScout](https://github.com/hqman/JevScout) | Skill de recherche d’emploi qui pilote Chrome via CDP et fait noter chaque lien et chaque annonce par Jev. | python | 38 | 2026-09-18 |
| [romaluev/jev-ego](https://github.com/romaluev/jev-ego) | Agent navigateur qui dépense une requête Jev par étape pour choisir l'action. | typescript · noassertion | 17 | 2026-09-17 |
| [tontoko/jev-browser](https://github.com/tontoko/jev-browser) | Un cœur Jev et Playwright ancré derrière un SDK typé, une CLI persistante et un serveur MCP. | javascript · apache-2.0 | 11 | 2026-09-30 |
| [imanshu03/jev-browser-use](https://github.com/imanshu03/jev-browser-use) | Exécute des tâches de navigation à partir d'une instruction en langage naturel via CDP ou agent-browser de Vercel, avec Jev qui sélectionne les opérations et les cibles et du code qui vérifie la confiance avant d'agir. | typescript | 0 | 2026-09-27 |

## 📱 Automatisation mobile et bureau

Piloter téléphones, clients de messagerie et interfaces natives sans patch ni hook. _(4 entrées)_

| Projet | Description | Lang / Licence | ⭐ | Maj |
| --- | --- | --- | --- | --- |
| [droidrun/mobile-jev](https://github.com/droidrun/mobile-jev) | La même boucle sur un vrai téléphone Android ; neuf actions Uber en 21 secondes dans la démo. | javascript · mit | 426 | 2026-09-17 |
| [ainame/swift-typesafe](https://github.com/ainame/swift-typesafe) | SDK Swift 6.4 suivant l'API du SDK Python, sur les plateformes Apple et Linux. | swift · mit | 16 | 2026-09-23 |
| [friedjof/jev-mobile](https://github.com/friedjof/jev-mobile) | Sous-agent Android via USB exécutant observe, normalize, decide, mutate, verify, avec Jev qui décide. | python · mit | 8 | 2026-09-18 |
| [xinwang-nwpu/jev-mobile](https://github.com/xinwang-nwpu/jev-mobile) | Automatisation Android où une seule requête Jev choisit à la fois l'action et l'élément cible dans l'arbre d'accessibilité, exécutée via ADB. | python · mit | 3 | 2026-09-21 |

## 🔎 Recherche, reranking et RAG

Compréhension de requête, sélection de sources, reranking et SQL sémantique. _(13 entrées)_

| Projet | Description | Lang / Licence | ⭐ | Maj |
| --- | --- | --- | --- | --- |
| [superagents-lab/jev-search](https://github.com/superagents-lab/jev-search) | Sélection des sources, compréhension des requêtes et classement de pertinence pour la recherche web. | typescript · mit | 493 | 2026-09-20 |
| [jexp/neo4jev](https://github.com/jexp/neo4jev) | Parcourt un graphe Neo4j en classifiant les relations voisines. | jupyter notebook · mit | 154 | 2026-09-18 |
| [uehaj/jev-semgrep](https://github.com/uehaj/jev-semgrep) | Recherche par sens plutôt que par regex : chaque ligne reçoit une probabilité de Jev, et les sens se combinent avec AND, OR et NOT. | javascript · noassertion | 145 | 2026-09-30 |
| [ellipsis-dev/blink](https://github.com/ellipsis-dev/blink) | Recherche dans une base de code où Jev note les candidats. | typescript | 93 | 2026-09-16 |
| [kbhuw/jev-sift](https://github.com/kbhuw/jev-sift) | Outil MCP qui note un lot de fichiers, d'URL ou d'extraits selon leur pertinence pour que l'agent n'ouvre que l'essentiel. | javascript | 48 | 2026-09-18 |
| [hev/reranker](https://github.com/hev/reranker) | Jev comme reranker calibré : un appel, jusqu'à 30 documents, une probabilité par document. | python · apache-2.0 | 15 | 2026-09-17 |
| [reachjalil/jev-tree](https://github.com/reachjalil/jev-tree) | Choix récursif dans une taxonomie, au-delà de la limite de 255 options. | typescript · mit | 10 | 2026-09-18 |
| [WiktorB2004/llama-index-jev](https://github.com/WiktorB2004/llama-index-jev) | Reranker et routeur LlamaIndex, moins cher qu'un juge LLM. | python · mit | 9 | 2026-09-25 |
| [kylemclaren/jev-search](https://github.com/kylemclaren/jev-search) | Bloc de registre shadcn/ui : résultats par mots-clés dès la première frappe, reclassés par Jev un instant après, et l'ordre par mots-clés est conservé si l'appel échoue. | typescript · mit | 9 | 2026-09-23 |
| [AkashPriyadarshii/jev-scout](https://github.com/AkashPriyadarshii/jev-scout) | CLI Rust et serveur MCP qui trouvent des repos et crates réels et maintenus pour une requête en langage naturel, avec notation des candidats par Jev. | rust · mit | 6 | 2026-09-30 |
| [kylemclaren/jevpdf](https://github.com/kylemclaren/jevpdf) | Recherche dans un PDF par le sens dans le navigateur : pdf.js extrait les lignes localement, Jev répond un Noul par ligne par lots de 16, et les lignes correspondantes s'illuminent page par page, classées par probabilité. | typescript · mit | 5 | 2026-09-23 |
| [mttrbrts/jev-folio-recursive-classifier](https://github.com/mttrbrts/jev-folio-recursive-classifier) | Classifie les accords juridiques océrisés via l'ontologie FOLIO Document Types avec des Jev Choices récursifs, beam search, arrêt aux feuilles conditionné par la confiance et benchmarking de la longueur de contexte. | python · apache-2.0 | 1 | 2026-09-19 |
| [liou666/senseek](https://github.com/liou666/senseek) | Extension de navigateur qui recherche par le sens dans la page en cours de lecture, dans un champ de type Ctrl+F, avec votre propre clé et sans backend. | javascript | 0 | 2026-09-21 |

## 🛡️ Sûreté, modération et vérification

Garde-fous, détection d'injection de prompt, juges qui savent s'abstenir. _(14 entrées)_

| Projet | Description | Lang / Licence | ⭐ | Maj |
| --- | --- | --- | --- | --- |
| [leepokai/jev-guard](https://github.com/leepokai/jev-guard) | Mode auto pour Claude Code, Codex, Cursor, Gemini CLI, Pi et OpenCode : attribue à chaque appel d'outil un score de risque deny, ask ou allow et signale les injections de prompt dans les résultats. | javascript · mit | 48 | 2026-09-28 |
| [brainstormity/Jev-Moderation-Bot](https://github.com/brainstormity/Jev-Moderation-Bot) | Modération de chat avec des règles modifiables. | python · mit | 48 | 2026-09-22 |
| [DanRWilloughby/snifftest](https://github.com/DanRWilloughby/snifftest) | Linter de prose pour les marqueurs d'écriture IA : règles comptables plus un modèle de jugement. | typescript · mit | 34 | 2026-09-18 |
| [luantak/is-malicious](https://github.com/luantak/is-malicious) | Analyse une base de code pour détecter les comportements cachés ou de vol de données avant exécution ; un rapport vierge n'est pas une preuve, et il le précise. | typescript · mit | 33 | 2026-09-23 |
| [MarissaFamularo/citation-verifier](https://github.com/MarissaFamularo/citation-verifier) | L'article cité soutient-il la phrase qui le cite ? Claude trouve la citation, Jev la note, un humain décide. | javascript · mit | 11 | 2026-09-17 |
| [scale-venture-partners/riff](https://github.com/scale-venture-partners/riff) | Codes de règles façon Ruff pour l'écriture. | python · mit | 7 | 2026-09-29 |
| [caiovicentino/jev-shield](https://github.com/caiovicentino/jev-shield) | Pare-feu MCP sémantique qui filtre chaque appel d'outil, résultat et description ; annonce 94 % de rappel de blocage à environ 0,00002 $ par contrôle. | javascript · mit | 4 | 2026-09-17 |
| [noelzappy/tripwire](https://github.com/noelzappy/tripwire) | Middleware et proxy pour AI SDK qui exécute sept contrôles Jev sur chaque réponse LLM avant qu'elle ne parvienne à l'utilisateur ; aucun chiffre de précision pour l'instant, et il l'indique clairement. | typescript · mit | 4 | 2026-09-18 |
| [teyhouse/jev-secret-detection](https://github.com/teyhouse/jev-secret-detection) | Mesure la capacité de Jev à repérer les vrais identifiants dans des extraits de fichiers, avec les cas difficiles en forme de configuration évalués séparément. | python | 3 | 2026-09-18 |
| [santos-sanz/jev-audio-beeper](https://github.com/santos-sanz/jev-audio-beeper) | Preuve de concept de censure audio à faible latence : les décisions typées de Jev pilotent ffmpeg. | typescript | 3 | 2026-09-17 |
| [asfarsadewa/human-compiler](https://github.com/asfarsadewa/human-compiler) | Collez du texte, obtenez des diagnostics, comme un compilateur pour la prose. | typescript · mit | 2 | 2026-09-17 |
| [DansiDanutz/fake-real-jev](https://github.com/DansiDanutz/fake-real-jev) | Vérifie les affirmations par rapport aux extraits cités avec Jev dans un site de fact-checking en anglais et en roumain, avec un exemple d'intégration public et une application complète à code source fermé. | javascript · mit | 1 | 2026-09-26 |
| [paulgoodchild/SkillsCheck](https://github.com/paulgoodchild/SkillsCheck) | Envoie le texte d'une skill d'agent à Jev avant l'installation et retourne un verdict avec des scores par catégorie, sans charger la skill dans le contexte de l'agent ; le texte soumis n'est pas expurgé de ses secrets. | javascript | 0 | 2026-09-21 |
| [hteariH/stopspam-jev-bot](https://github.com/hteariH/stopspam-jev-bot) | Bot Telegram qui supprime les spams et les arnaques des chats de groupe grâce à une classification à confiance calibrée. | python | 0 | 2026-09-21 |

## 🗄️ Données et exploitation

Extensions Postgres, SQL sémantique et pipelines de télémétrie qui appellent Jev. _(20 entrées)_

| Projet | Description | Lang / Licence | ⭐ | Maj |
| --- | --- | --- | --- | --- |
| [kyotofin/tax-doc-classifier](https://github.com/kyotofin/tax-doc-classifier) | Une requête par page choisit parmi 261 formulaires IRS et sept types de page ; rapporte 100 pour cent sur son corpus à $0.001 par page, 34 fois moins cher que le pipeline LLM remplacé. | typescript · apache-2.0 | 484 | 2026-09-29 |
| [realZachi/pg-jev](https://github.com/realZachi/pg-jev) | Extension PostgreSQL qui répond aux questions en langage courant sur vos tables. | shell · noassertion | 381 | 2026-09-18 |
| [AgriciDaniel/jev-seo](https://github.com/AgriciDaniel/jev-seo) | Explore un site, le vérifie par rapport à 52 règles SEO, fait juger chaque page par Jev, et génère des rapports PDF, tableur et Markdown. | python · mit | 266 | 2026-09-22 |
| [AkashPriyadarshii/jev-curate](https://github.com/AkashPriyadarshii/jev-curate) | Trie les données d'entraînement Parquet et JSONL à plus de 1 500 lignes par seconde. | rust · mit | 92 | 2026-09-30 |
| [giuliosmall/pg_typesafe](https://github.com/giuliosmall/pg_typesafe) | Extension PostgreSQL en pré-alpha pour la classification catégorielle avec Jev. | c · mit | 88 | 2026-09-24 |
| [AboveColin/HA-Jev](https://github.com/AboveColin/HA-Jev) | Intégration Home Assistant : posez une question sur votre maison, obtenez une probabilité, un choix ou un score sous forme d'entité. | python · mit | 69 | 2026-09-30 |
| [choxos/jev-reviewer](https://github.com/choxos/jev-reviewer) | Interroge un rapport d'essai clinique pour des données de revue systématique par voix, texte ou fichier de questions ; chaque réponse est une citation exacte avec son fichier et son emplacement. | javascript · mit | 38 | 2026-09-19 |
| [chenmingtang830/jevgraph](https://github.com/chenmingtang830/jevgraph) | Analyse localement les PDF, DOCX, PPTX ou texte, puis pose à Jev une question de relation en ensemble fermé par paire d'entités candidate et exporte un graphe avec probabilités par arête et preuves de page vers JSON, CSV ou Neo4j. | python · apache-2.0 | 31 | 2026-09-20 |
| [colliber/duckdb-jev](https://github.com/colliber/duckdb-jev) | Extension DuckDB qui pose une question à chaque ligne et renvoie un vrai type SQL. | c++ · mit | 28 | 2026-09-18 |
| [chopratejas/invalidate](https://github.com/chopratejas/invalidate) | Donne à chaque mémoire d'agent stockée un bail et demande à Jev si de nouvelles preuves y mettent fin ; [live demo](https://invalidate-playground.vercel.app). | python · apache-2.0 | 23 | 2026-09-21 |
| [reachjalil/jevlogs](https://github.com/reachjalil/jevlogs) | Score le signal des logs OpenTelemetry avant de payer pour l'analyse LLM. | javascript · mit | 17 | 2026-09-22 |
| [kylemclaren/jevql](https://github.com/kylemclaren/jevql) | SQL sémantique pour PostgreSQL, avec Jev qui répond aux prédicats. | go · mit | 15 | 2026-09-19 |
| [collapseindex/jev-ultralightspeed](https://github.com/collapseindex/jev-ultralightspeed) | Regroupe 32 éléments dans une seule requête pour la classification en masse et calibre le seuil de confiance qui envoie les lignes les moins sûres à un humain, avec 533 éléments par seconde rapportés à 89,2 pour cent d'accord avec les étiquettes humaines. | python · noassertion | 12 | 2026-09-22 |
| [keltokhy/jlink](https://github.com/keltokhy/jlink) | Relie les enregistrements de deux jeux de données à partir d'une règle de correspondance écrite en anglais simple, depuis Python, le shell, Stata ou R, et rapporte un F1 de 0.73 contre 0.69 pour la correspondance de chaînes optimisée sur les cessionnaires de brevets NBER vers Compustat. | python · mit | 7 | 2026-09-28 |
| [EugeneBoondock/jevsql](https://github.com/EugeneBoondock/jevsql) | SQL avec prédicats en langage naturel sur SQLite : filtrer, classer et catégoriser les lignes par sens, par lots et avec garde-fous de coût. | javascript · mit | 6 | 2026-09-19 |
| [Foadsf/jev-for-engineers](https://github.com/Foadsf/jev-for-engineers) | Huit petits exemples issus du génie mécanique et électrique : routage CAD, tri FEM, criblage DFM, alignement BOM. | python · mit | 6 | 2026-09-16 |
| [Query-farm/vgi-typesafe](https://github.com/Query-farm/vgi-typesafe) | Worker DuckDB qui expose choice, noul et score comme fonctions table utilisables en jointure latérale en SQL. | python · mit | 5 | 2026-09-19 |
| [mgaitan/sqlite-jev](https://github.com/mgaitan/sqlite-jev) | Ajoute les jugements Jev Noul, Choice et Score à SQLite via une extension C chargeable et un wrapper Python, avec fonctions scalaires et requêtes groupées sur tables virtuelles. | c | 4 | 2026-09-18 |
| [opaielsheikh/typesafe-migration-guard](https://github.com/opaielsheikh/typesafe-migration-guard) | Examine les migrations de base de données pour en vérifier la sécurité avant leur exécution. | typescript | 3 | 2026-09-17 |
| [ddfeyes/jev-mode](https://github.com/ddfeyes/jev-mode) | Triage de tickets et étiquetage de fichiers sur un modèle à jugement typé ; rapporte 78 % de tokens en moins et une précision de 96,1 % contre une référence à 93,7 %. | python · mit | 3 | 2026-09-18 |

## 📦 Applications et extensions

Des outils de bout en bout que les gens ouvrent vraiment chaque jour. _(29 entrées)_

| Projet | Description | Lang / Licence | ⭐ | Maj |
| --- | --- | --- | --- | --- |
| [anishfn/shapeshift](https://github.com/anishfn/shapeshift) | Transforme une zone de texte en carte correspondante pendant la frappe, jugée par un seul appel Jev parallèle, avec un repli par mot-clé quand aucune clé n'est définie. | typescript · mit | 752 | 2026-09-23 |
| [kitze/unclutter](https://github.com/kitze/unclutter) | Extension de navigateur qui supprime l'encombrement des pages grâce à des règles de modèles réutilisables. | typescript · mit | 341 | 2026-09-18 |
| [FerryCorleone/crush-monitor](https://github.com/FerryCorleone/crush-monitor) | Lit un journal de discussion localement et étiquette chaque message avec les trois plus probables parmi douze émotions et trente-cinq intentions. | typescript · mit | 262 | 2026-09-25 |
| [monteduro/killmyidea](https://github.com/monteduro/killmyidea) | Décrivez votre idée de startup ; Jev dit s'il faut l'abandonner, la corriger ou la lancer. | typescript | 244 | 2026-09-24 |
| [usenotra/notra](https://github.com/usenotra/notra) | Transforme le travail en contenu, Jev décidant ce qui vaut la peine d'être publié. | typescript · agpl-3.0 | 226 | 2026-09-30 |
| [wquguru/dasheng](https://github.com/wquguru/dasheng) | Lisez l'anglais à voix haute et voyez-le noté : la reconnaissance vocale en continu écoute, Jev juge mot à mot, et le total est calculé arithmétiquement dans le code. | javascript | 144 | 2026-09-20 |
| [trungdq88/youtube-sponsor-detection](https://github.com/trungdq88/youtube-sponsor-detection) | Extension Chrome qui repère les lectures sponsorisées depuis la transcription ou l'audio en direct et les saute ; le code contrôle chaque horodatage, pour moins d'un centime par heure en mode transcription. | javascript | 109 | 2026-09-18 |
| [kevinbadi/jev-voice](https://github.com/kevinbadi/jev-voice) | Parlez à macOS : whisper.cpp local transcrit, un appel Jev en éventail choisit l'action et ses arguments typés, puis le code l'exécute. | python · mit | 106 | 2026-09-23 |
| [w3cj/jev-chat](https://github.com/w3cj/jev-chat) | Barre de commandes en forme de chat où Jev choisit l'outil, les arguments et la forme de la réponse, et le code construit la réponse à partir des données propres aux outils, donc aucun modèle n'écrit le texte. | typescript · mit | 105 | 2026-09-18 |
| [ChetasLua/jevmeter](https://github.com/ChetasLua/jevmeter) | Appose une jauge en direct sur n'importe quelle vidéo : chaque phrase notée sur cinq questions, rendue en montage 16:9, un débat entier pour environ deux centimes. | python · mit | 103 | 2026-09-17 |
| [fazlerocks/jevmail](https://github.com/fazlerocks/jevmail) | Tri Gmail en lecture seule : trois questions Jev par message le répartissent dans l'une des cinq catégories avec un score d'urgence. | typescript · mit | 92 | 2026-09-19 |
| [realZachi/typesafe-adblock](https://github.com/realZachi/typesafe-adblock) | Extension Chrome qui demande "is this element an ad?" pour chaque nœud DOM ; un jouet, et elle l'assume. | javascript · mit | 88 | 2026-09-17 |
| [AkashPriyadarshii/jev-seo](https://github.com/AkashPriyadarshii/jev-seo) | CLI Rust et serveur MCP pour des vérifications SEO et GEO sur les résultats DuckDuckGo, notés par Jev. | rust · mit | 86 | 2026-09-30 |
| [RafalWilinski/vibecheck](https://github.com/RafalWilinski/vibecheck) | Vérifie ton post X avant de le publier. | javascript | 49 | 2026-09-20 |
| [parth-kp/jev-mail-classifier](https://github.com/parth-kp/jev-mail-classifier) | Classification d'inbox pilotée par configuration qui étiquette, déplace, signale et notifie, via TypeSafe directement ou OpenRouter. | python · mit | 19 | 2026-09-20 |
| [kevthetech143/super-jev](https://github.com/kevthetech143/super-jev) | Petit harnais reliant les preuves, les jugements Jev, les actions autorisées et les résultats vérifiés. | python · mit | 14 | 2026-09-30 |
| [manifoldor/xtags](https://github.com/manifoldor/xtags) | Étiquette chaque publication de votre timeline X avec ce qu'elle cherche à vous faire faire. | javascript · mit | 12 | 2026-09-27 |
| [gtaras7/typesafe-jev](https://github.com/gtaras7/typesafe-jev) | Expériences Jev commençant par un banc d’essai local de tri de CV, chacune avec ses résultats mesurés. | typescript · mit | 10 | 2026-09-27 |
| [harshil1712/slidepilot](https://github.com/harshil1712/slidepilot) | Avancement automatique piloté par la voix pour Slidev sur Cloudflare Agents. | typescript · mit | 9 | 2026-09-22 |
| [valentynkit/jev.nvim](https://github.com/valentynkit/jev.nvim) | Plugin Neovim : posez une question en langage naturel au buffer, Treesitter le découpe en fonctions, Jev note chacune d'elles, et les réponses arrivent dans quickfix classées par probabilité. | lua · mit | 9 | 2026-09-19 |
| [andrelandgraf/safer-with-jev](https://github.com/andrelandgraf/safer-with-jev) | Proxy Neon Function pour la Neon AI Gateway avec routage Jev en amont. | typescript | 6 | 2026-09-18 |
| [valentynkit/jev-skip](https://github.com/valentynkit/jev-skip) | Extension de navigateur qui lit la piste de sous-titres et affiche une probabilité de sponsor par segment sur la barre de recherche, sans base de données participative. | typescript · mit | 6 | 2026-09-19 |
| [chris-wozniczek/jev-voice-control](https://github.com/chris-wozniczek/jev-voice-control) | Application Swift pour barre de menus qui transforme les commandes vocales en décisions typées Jev et en actions macOS. | swift · mit | 5 | 2026-09-21 |
| [hellogumbo/should-ai-kill-us-all](https://github.com/hellogumbo/should-ai-kill-us-all) | Pose la question à Jev toutes les dix minutes en s'appuyant sur les titres d'actualité réels. | javascript · cc0-1.0 | 4 | 2026-09-18 |
| [sriganesh/jevibe-check](https://github.com/sriganesh/jevibe-check) | Étiquettes de ton en direct pour les publications et les brouillons Bluesky. | javascript · mit | 3 | 2026-09-17 |
| [phureewat29/jev-got](https://github.com/phureewat29/jev-got) | Jeu de rôle Game of Thrones où un modèle narratif écrit chaque scène et Jev répond à cinq questions typées qui pilotent l'en-tête, la bande-son, l'illustration et le prompt suivant. | typescript | 3 | 2026-09-19 |
| [hazlema/jev-riffs](https://github.com/hazlema/jev-riffs) | Extrait les motifs répétitifs d'une mélodie MIDI, évalue chaque candidat en un seul appel Jev groupé, et surligne et joue le gagnant sur un piano roll ; sur un Lac des cygnes orchestral, le motif principal est le thème du cygne. | typescript · mit | 3 | 2026-09-25 |
| [thenewpotato/privacy-facts](https://github.com/thenewpotato/privacy-facts) | Transforme les politiques de confidentialité en étiquettes de type nutritionnel avec des réponses en langage clair, des scores de confiance Jev et des clauses sources suggérées. | javascript · mit | 2 | 2026-09-18 |
| [0xShin0221/openpoke-meets-jev](https://github.com/0xShin0221/openpoke-meets-jev) | Fork OpenPoke qui migre le filtrage des e-mails, un garde-fou de tool-call et le reranking de recherche vers Jev, avec un A/B contre l'appel Sonnet remplacé et un run adverse sur le filtre anti-injection. | python · mit | 1 | 2026-09-20 |

## 🧩 SDK et clients communautaires

Clients non officiels pour les langages sans SDK officiel. _(32 entrées)_

| Projet | Description | Lang / Licence | ⭐ | Maj |
| --- | --- | --- | --- | --- |
| [pithings/advocaat](https://github.com/pithings/advocaat) | Petit client TypeScript pour poser des questions sur vos propres données. | typescript · mit | 97 | 2026-09-18 |
| [milvus-io/milvus-model](https://github.com/milvus-io/milvus-model) | Paquet reranker dont l'adaptateur Jev envoie chaque document candidat comme une question Noul en une seule requête, trie selon les probabilités renvoyées et conserve les indices d'origine ; livré dans la version v0.3.4. | python · apache-2.0 | 61 | 2026-09-23 |
| [obie/ruby_decision_model](https://github.com/obie/ruby_decision_model) | Client Ruby pour modèles de décision avec les fournisseurs OpenRouter et TypeSafe derrière une seule interface, stdlib uniquement. | ruby · mit | 52 | 2026-09-18 |
| [dannote/jev](https://github.com/dannote/jev) | Client Elixir conçu pour OTP : répond à Jev depuis un GenServer et applique un filtrage par motif à la réponse. | elixir · mit | 35 | 2026-09-26 |
| [kieranklaassen/ruby_llm-typesafe](https://github.com/kieranklaassen/ruby_llm-typesafe) | TypeSafe comme fournisseur de sortie structurée pour RubyLLM 2. | ruby · mit | 19 | 2026-09-29 |
| [Twister915/typesafe-ai](https://github.com/Twister915/typesafe-ai) | Client Rust avec backends asynchrone et bloquant et retries observables. | rust · apache-2.0 | 14 | 2026-09-16 |
| [saibimajdi/typesafeai-dotnet-sdk](https://github.com/saibimajdi/typesafeai-dotnet-sdk) | SDK .NET communautaire avec des questions typées Noul, Choice et Score. | c# · mit | 13 | 2026-09-29 |
| [Premo-Cloud/typesafe-sdk-java](https://github.com/Premo-Cloud/typesafe-sdk-java) | Client Java non officiel pour l'API TypeSafe System One, appelant les questions Choice, Score et Noul via HTTP. | java · mit | 11 | 2026-09-25 |
| [pambrose/jev4k](https://github.com/pambrose/jev4k) | DSL et client Kotlin. | kotlin · apache-2.0 | 11 | 2026-09-28 |
| [Tangerg/typesafe-sdk-go](https://github.com/Tangerg/typesafe-sdk-go) | SDK Go sans dépendances tierces. | go · mit | 10 | 2026-09-19 |
| [jomatsu/zod-jev](https://github.com/jomatsu/zod-jev) | Schémas Zod 4 avec règles sémantiques : les vérifications de forme restent dans Zod, les vérifications de sens partent vers Jev en une seule requête et reviennent comme des Zod issues. | typescript · mit | 9 | 2026-09-17 |
| [joshmn/typesafe-sdk](https://github.com/joshmn/typesafe-sdk) | Client Ruby non officiel pour l'API TypeSafe AI, renvoyant des réponses typées avec probabilités au lieu de prose analysée. | ruby · mit | 8 | 2026-09-26 |
| [inanna-malick/jev-dsl](https://github.com/inanna-malick/jev-dsl) | DSL Haskell avec paquets typés et types de réponses inférés. | haskell · mit | 8 | 2026-09-18 |
| [gilljon/typesafe-ai-rs](https://github.com/gilljon/typesafe-ai-rs) | SDK Rust indépendant, asynchrone et bloquant. | rust · mit | 7 | 2026-09-17 |
| [Gaurav-Gosain/jev-go](https://github.com/Gaurav-Gosain/jev-go) | Client Go qui renvoie des jugements typés et des probabilités. | go · mit | 6 | 2026-09-16 |
| [jamesward/zio-typesafe-ai](https://github.com/jamesward/zio-typesafe-ai) | Client Scala basé sur ZIO. | scala · apache-2.0 | 6 | 2026-09-23 |
| [Stumble/jev-go](https://github.com/Stumble/jev-go) | SDK Go communautaire pour TypeSafe Jev / System One, couvrant les questions typées Choice, Score et Noul. | go · mit | 6 | 2026-09-18 |
| [nshkrdotcom/typesafe_sdk](https://github.com/nshkrdotcom/typesafe_sdk) | Port Elixir du SDK IA TypeScript avec un fournisseur TypeSafe. | elixir · mit | 6 | 2026-09-20 |
| [alterhq/typesafe-sdk-swift](https://github.com/alterhq/typesafe-sdk-swift) | SDK Swift non officiel pour l'API TypeSafe AI, encapsulant les questions et réponses typées dans des types Swift. | swift · mit | 5 | 2026-09-15 |
| [zhirschtritt/typesafe-go](https://github.com/zhirschtritt/typesafe-go) | SDK Go idiomatique pour l'API TypeSafe. | go · mit | 4 | 2026-09-29 |
| [Butochnikov/laravel-typesafe-jev](https://github.com/Butochnikov/laravel-typesafe-jev) | Intégration Laravel avec réponses typées, requêtes asynchrones et doublures de test. | php · mit | 4 | 2026-09-17 |
| [Hawxy/TypeSafeAI.Net](https://github.com/Hawxy/TypeSafeAI.Net) | SDK .NET non officiel pour la plateforme TypeSafe AI, utilisable depuis toute application .NET. | c# · apache-2.0 | 4 | 2026-09-19 |
| [mateonunez/jod](https://github.com/mateonunez/jod) | Schémas de style Zod sur Jev : valider l'état localement, puis projeter des réponses typées. | typescript · mit | 4 | 2026-09-17 |
| [GenieRobot/typesafe-ai-rails](https://github.com/GenieRobot/typesafe-ai-rails) | Intégration Rails basée sur le gem Ruby communautaire. | ruby · mit | 4 | 2026-09-16 |
| [steven-shoemaker/hunch](https://github.com/steven-shoemaker/hunch) | Transforme les questions Choice, Score et Noul en fonctions Python sur des listes et des DataFrames, avec déduplication, mise en cache, escalade des lignes incertaines vers un LLM tenu aux mêmes étiquettes, et un portage TypeScript sur npm sous le nom hunch-jev. | python · mit | 4 | 2026-09-22 |
| [AboveColin/jevclient](https://github.com/AboveColin/jevclient) | Client Python asynchrone, probabilités et choix en sortie, aucun texte à analyser. | python · mit | 3 | 2026-09-21 |
| [Butochnikov/typesafe-sdk-php](https://github.com/Butochnikov/typesafe-sdk-php) | Client PHP avec appels synchrones, promesses Guzzle et journalisation PSR-3. | php · mit | 3 | 2026-09-17 |
| [AbdelStark/s1-rs](https://github.com/AbdelStark/s1-rs) | Transforme les enums et structs Rust en questions Choice, Score et Noul avec des réponses vérifiées à la compilation et conditionnées par la confiance. | rust · mit | 2 | 2026-09-16 |
| [AbdelStark/typesafe-rs](https://github.com/AbdelStark/typesafe-rs) | Client Rust axé sur la latence, disponible sur crates.io. | rust · mit | 2 | 2026-09-16 |
| [DomMonte/n8n-nodes-typesafe-ai](https://github.com/DomMonte/n8n-nodes-typesafe-ai) | Nœud communautaire n8n pour les questions oui/non, à choix et à score. | typescript · mit | 1 | 2026-09-21 |
| [kunobi-ninja/kunobi-jev](https://github.com/kunobi-ninja/kunobi-jev) | Client Rust pour l'API System One. | rust · apache-2.0 | 1 | 2026-09-24 |
| [bariskisir/JevSharp](https://github.com/bariskisir/JevSharp) | SDK .NET 10 pour les décisions Jev via TypeSafe, OpenRouter, Vercel AI Gateway et les endpoints compatibles. | c# · mit | 0 | 2026-09-24 |

## ⌨️ Ligne de commande

Appeler Jev depuis un shell, sans SDK. _(14 entrées)_

| Projet | Description | Lang / Licence | ⭐ | Maj |
| --- | --- | --- | --- | --- |
| [dzhng/jevgrep](https://github.com/dzhng/jevgrep) | Trouve les fichiers, déclarations et extraits verbatim dont un agent de codage a besoin en demandant à Jev quelles déclarations répondent à une question en langage simple sur le repo. | typescript · mit | 1,853 | 2026-09-29 |
| [dorkitude/webctl](https://github.com/dorkitude/webctl) | Recherche sur le web pour un agent et fait scorer et dédupliquer par Jev les résultats et les fragments de pages, afin que seul le texte pertinent atteigne le modèle. | go · mit | 150 | 2026-09-23 |
| [keltokhy/jgrep](https://github.com/keltokhy/jgrep) | Affiche les lignes correspondant à une description en anglais courant, en continu depuis `tail -f` avec un plafond de dépenses, et rapporte un F1 de 0,91 sur le spam SMS contre 0,72 pour un grep par mots-clés. | python · mit | 132 | 2026-09-28 |
| [mrnugget/jev-shell-history](https://github.com/mrnugget/jev-shell-history) | Suggestions d'historique zsh façon Fish, classées par Jev. | typescript | 116 | 2026-09-18 |
| [sharziki/semdecide](https://github.com/sharziki/semdecide) | Décisions sémantiques typées pour les pipelines Unix et la CI. | python · mit | 74 | 2026-09-16 |
| [shiftynick/jev-axi](https://github.com/shiftynick/jev-axi) | Verbes shell pour les agents et les humains : pick, rate, check, rank, triage, guard. | typescript · mit | 26 | 2026-09-24 |
| [Nasrallah-AL/jev-cli](https://github.com/Nasrallah-AL/jev-cli) | CLI npm avec la clé dans le trousseau système ; jugements typés depuis le shell. | typescript · mit | 23 | 2026-09-27 |
| [tumf/jev-cli](https://github.com/tumf/jev-cli) | CLI Python sans dépendances enveloppant Choice, Score et Noul. | python · mit | 14 | 2026-09-23 |
| [cristianoliveira/jeq](https://github.com/cristianoliveira/jeq) | Enchaîne et compose des jugements Jev sur JSON et NDJSON avec map, reduce, rank et rate, puis applique la politique via une gate hors ligne explicite. | go · mit | 10 | 2026-09-27 |
| [sufianetaouil/every](https://github.com/sufianetaouil/every) | Pose une question oui/non à chaque fonction d'une base de code ; un grep dont le motif est une question. | python · mit | 8 | 2026-09-17 |
| [y0usaf/typesafe-cli](https://github.com/y0usaf/typesafe-cli) | Réponses Noul, choice et score sous forme de nombres depuis le shell. | typescript · mit | 5 | 2026-09-19 |
| [jtsang4/jev-cli](https://github.com/jtsang4/jev-cli) | Questions typées en entrée, réponses JSON structurées en sortie. | typescript · mit | 4 | 2026-09-18 |
| [jexp/watfile](https://github.com/jexp/watfile) | Trie les PDF et les fichiers texte dans des dossiers de catégories, à raison d'un Jev Choice par document, avec un backend Laya local comme alternative. | python | 2 | 2026-09-21 |
| [allebee/jevgrep](https://github.com/allebee/jevgrep) | Filtre les lignes de journaux et autres flux de texte par le sens, un Noul par ligne en micro-lots, en streaming depuis `tail -f` avec les options et les codes de sortie de grep. | python · mit | 1 | 2026-09-21 |

## 📊 Benchmarks, évaluations et calibration

Mesurez avant de faire confiance. _(27 entrées)_

| Projet | Description | Lang / Licence | ⭐ | Maj |
| --- | --- | --- | --- | --- |
| [sutro-sh/jev-align](https://github.com/sutro-sh/jev-align) | Trouve les exemples dont une fonction Jev est la moins sûre, vous demande de les annoter et améliore la fonction avec GEPA. | python · apache-2.0 | 301 | 2026-09-20 |
| [fstandhartinger/jevbench](https://github.com/fstandhartinger/jevbench) | Benchmark pour modèles de décision de classe Jev : rubrique bornée en entrée, réponse typée avec une probabilité par option en sortie, avec expériences en cascade et en comité rapportées séparément. | python · mit | 186 | 2026-09-29 |
| [vinilana/jev-eval-agent](https://github.com/vinilana/jev-eval-agent) | Agent assistant personnel avec 100 outils simulés, mesurant le nombre d'étapes nécessaires à un agent piloté par Jev. | html | 107 | 2026-09-17 |
| [openlayer-ai/jevals](https://github.com/openlayer-ai/jevals) | Exécute les évaluations d'agent, de qualité et de sécurité d'une trace en un seul lot de questions Jev typées au lieu d'appels séparés à un LLM juge. | python · mit | 97 | 2026-09-24 |
| [pinecone-io/cultivar](https://github.com/pinecone-io/cultivar) | CLI de test de skills de Pinecone, avec un backend de notation Jev annoncé environ 30 fois moins cher que le correcteur LLM. | python · mit | 41 | 2026-09-18 |
| [AbdelStark/jev-benchmarks](https://github.com/AbdelStark/jev-benchmarks) | Évaluation sensible aux probabilités pour modèles de décision typés : calibration, risque sélectif, latence, reproductible. | python · apache-2.0 | 21 | 2026-09-17 |
| [AntonioCoppe/jev-harness](https://github.com/AntonioCoppe/jev-harness) | Seuils de confiance, mode fantôme, recettes et evals ; rapporte Claude CLI à 48.9 s contre Jev à 1.3 s sur la même tâche de filtrage de lignes. | typescript · mit | 16 | 2026-09-25 |
| [abhixhek/jevcal](https://github.com/abhixhek/jevcal) | Arrêtez de deviner les seuils : calibrez, seuillez et contrôlez la dérive face à un LLM enseignant. | python · mit | 11 | 2026-09-18 |
| [jmanhype/jev-dspy-lab](https://github.com/jmanhype/jev-dspy-lab) | Benchmarks reproductibles de calibration et de risque sélectif pour les décisions Jev dans DSPy. | python · mit | 11 | 2026-09-20 |
| [zhuyansen/jev-search-rerank-eval](https://github.com/zhuyansen/jev-search-rerank-eval) | Un rerank Jev bat-il la recherche par embeddings ? 9 831 paires évaluées, avec le biais de circularité du juge mesuré. | python · mit | 10 | 2026-09-18 |
| [anessbelbati/jev-rerank-bench](https://github.com/anessbelbati/jev-rerank-bench) | Jev face à Cohere Rerank, ZeroEntropy et une base de référence chat sur 14 jeux de données, réponses brutes incluses. | python · mit | 9 | 2026-09-25 |
| [anisselbd/jev-phishing-bench](https://github.com/anisselbd/jev-phishing-bench) | Jev contre Claude Haiku sur 2 000 e-mails de phishing : précision, calibration, latence, coût. | python | 8 | 2026-09-19 |
| [mahlernim/jev-korean-benchmark](https://github.com/mahlernim/jev-korean-benchmark) | Compréhension du coréen et textes médicaux, avec données d'exécution et de coût. | python | 7 | 2026-09-17 |
| [wondertwins/jev-benchmark](https://github.com/wondertwins/jev-benchmark) | Deux benchmarks, échecs et identification de prédateurs, l'un dans le domaine de Jev et l'autre hors domaine, tous deux avec résultats. | python · mit | 7 | 2026-09-16 |
| [Gaurav-Gosain/jev-sec-bench](https://github.com/Gaurav-Gosain/jev-sec-bench) | Benchmarks aveugles pour l'injection de prompts et la détection de code vulnérable. | go · mit | 4 | 2026-09-16 |
| [TokenTrim/jev-agent-failure-benchmark](https://github.com/TokenTrim/jev-agent-failure-benchmark) | Jev face à un LLM puissant sur le benchmark d'attribution des échecs d'agents Who and When. | python · apache-2.0 | 4 | 2026-09-17 |
| [RINNECODER/jev-behavior-study](https://github.com/RINNECODER/jev-behavior-study) | Expériences contrôlées de prompts sur jev-1.13.0, résultats bruts et vérification hors ligne. | python · mit | 4 | 2026-09-17 |
| [chenmingtang830/jevarena](https://github.com/chenmingtang830/jevarena) | Arène hébergée qui oppose Jev à un juge adverse que vous connectez et recueille votre vote avant de révéler qui était qui, avec latence, provenance des coûts et confiance autodéclarée ; un vote enregistre une préférence, pas une exactitude vérifiée. | typescript · apache-2.0 | 4 | 2026-09-20 |
| [bitnovus/jev-spam-eval](https://github.com/bitnovus/jev-spam-eval) | Filtrage anti-spam zero-shot avec des questions Noul face à des références TF-IDF. | jupyter notebook · mit | 3 | 2026-09-18 |
| [PistachioAIHQ/jev-synergy-screening](https://github.com/PistachioAIHQ/jev-synergy-screening) | Questions Choice et Noul évaluées par rapport aux étiquettes de référence ASReview SYNERGY pour la présélection des résumés. | python | 3 | 2026-09-16 |
| [jgridifier/jev-research-eval](https://github.com/jgridifier/jev-research-eval) | Harnais reproductible sur un commit jev-ultrafast épinglé, avec suites de référence et de charge. | html · noassertion | 3 | 2026-09-17 |
| [HackSing/jev-report](https://github.com/HackSing/jev-report) | Rapport de recherche chinois indépendant : 52 pages, 50 tests reproductibles, 143 lignes de données traçables. | python · mit | 2 | 2026-09-17 |
| [hegargarcia/jev-playground](https://github.com/hegargarcia/jev-playground) | Jev face à d'autres modèles dans des jeux aux états explicites, aux actions légales et au résultat mesurable. | typescript | 2 | 2026-09-17 |
| [yodablocks/jev-orderby-bench](https://github.com/yodablocks/jev-orderby-bench) | Mesure si un ORDER BY sur une probabilité Jev est défendable : inversion par paire, ordinalité face à une note humaine, calibration et invariants de formulation sous un seuil pré-enregistré. | python · mit | 1 | 2026-09-20 |
| [4esv/jev-eval](https://github.com/4esv/jev-eval) | Jev face à GPT-5.6 Terra sur trois tâches étiquetées : à égalité sur les plus faciles, 6,7 points en dessous sur le routage à 77 choix, 5 fois plus rapide, 41 à 50 fois moins cher. | python | 1 | 2026-09-23 |
| [themsquared/jev-benchmark](https://github.com/themsquared/jev-benchmark) | Classification des risques d'appels d'outils avec la variance entre les exécutions rapportée ; chaque mauvaise réponse s'accompagnait d'une confiance nuancée. | python · apache-2.0 | 1 | 2026-09-24 |
| [blowxian/jev-fanout-bench](https://github.com/blowxian/jev-fanout-bench) | Mesure la facturation d'une requête Jev et la tenue de ses réponses face au traitement par lots, à la traduction et à la reformulation, à partir de 3 455 requêtes facturées avec journaux bruts publics. | python · mit | 0 | 2026-09-28 |

## 🧠 Modèles ouverts et répliques

Exécuter la sémantique System One sans le fournisseur — sur une 3090 si vous voulez. _(41 entrées)_

| Projet | Description | Lang / Licence | ⭐ | Maj |
| --- | --- | --- | --- | --- |
| [jaredpalmer/kev](https://github.com/jaredpalmer/kev) | Adaptateur LoRA et tête de lecture sur Qwen2.5-0.5B qui répond à de nombreuses questions typées en un seul prefill ; entraînement en moins de deux heures sur un MacBook, ECE hors échantillon de 0,065, utilise le format wire TypeSafe. | python · apache-2.0 | 7,998 | 2026-09-30 |
| [TheoLeeCJ/SemIf](https://github.com/TheoLeeCJ/SemIf) | Ifs sémantiques issus de modèles ouverts sur une seule 3090 ; la réplique indépendante la plus étoilée, anciennement openjev. | python · mit | 4,604 | 2026-09-23 |
| [TianyuCodings/NanoJev](https://github.com/TianyuCodings/NanoJev) | Réplique 0.6B avec décisions parallèles, candidats dynamiques et pipeline d’entraînement de bout en bout. | python · mit | 2,445 | 2026-09-21 |
| [vinnylarouge/jevlike](https://github.com/vinnylarouge/jevlike) | Scorer d'options ouvert qui lit les logits des candidats au lieu de générer du JSON. | python · mit | 1,335 | 2026-09-16 |
| [ollaya-dev/ollaya](https://github.com/ollaya-dev/ollaya) | Télécharge et sert des modèles de décision ouverts tels que Laya, kev et JevK5 derrière un endpoint local compatible TypeSafe, comme Ollama sert les LLM. | rust · apache-2.0 | 1,011 | 2026-09-29 |
| [Mapika/decider](https://github.com/Mapika/decider) | Décisions typées en une passe, affinées à partir de Qwen3.5-2B. | python · apache-2.0 | 988 | 2026-09-30 |
| [nokia-applied-research/AnyJev](https://github.com/nokia-applied-research/AnyJev) | Transforme un modèle ouvert Hugging Face en endpoint de décision calibré servi via vLLM, sans fine-tuning aux deux premiers niveaux. | python · apache-2.0 | 981 | 2026-09-28 |
| [wfzyx/von](https://github.com/wfzyx/von) | Modèle de décision ouvert non autorégressif annoncé à moins de 15 ms en local, comme alternative directe à Jev. | python · apache-2.0 | 781 | 2026-09-30 |
| [Rizzo-AI-Academy/rizzo-flow](https://github.com/Rizzo-AI-Academy/rizzo-flow) | Interprétation local-first de l'idée System One : état non structuré en entrée, décisions probabilistes typées en sortie, sans générer de token. | python · apache-2.0 | 763 | 2026-09-25 |
| [featherless-ai/simple-jev](https://github.com/featherless-ai/simple-jev) | Lit les logits du token suivant depuis n'importe quel modèle Hugging Face pour les questions de choix, d'évaluation et de support ; API de démonstration publique sans clé. | python · apache-2.0 | 575 | 2026-09-30 |
| [Liuziyu77/Valen](https://github.com/Liuziyu77/Valen) | Modèle de décision multimodal basé sur Qwen3.5 qui évalue les candidats face aux images et à la vidéo ainsi qu'au texte, avec code d'entraînement et poids ouverts. | python · apache-2.0 | 551 | 2026-09-30 |
| [razorback16/openjev](https://github.com/razorback16/openjev) | Serveur de décision compatible Jev basé sur DiffusionGemma 26B via vLLM, images incluses, hébergé gratuitement sur [Codiv](https://codiv.ai). | python · apache-2.0 | 541 | 2026-09-29 |
| [Yinsongxu/LLM2Jev](https://github.com/Yinsongxu/LLM2Jev) | Adapte les modèles de langage locaux aux questions Choice, Score et Noul définies à l'exécution et renvoie des réponses typées avec probabilités. | python · apache-2.0 | 377 | 2026-09-26 |
| [ekzhang/openjev-sglang](https://github.com/ekzhang/openjev-sglang) | Point de terminaison d'API compatible Jev sur SGLang, prefill uniquement. | python | 336 | 2026-09-25 |
| [malevrigns/agent-jev](https://github.com/malevrigns/agent-jev) | Modèle de décision basé sur Qwen3-0.6B qui répond sans décoder de tokens, avec 79,25 % de top-1 sur le benchmark public Typed Decisions. | python · apache-2.0 | 328 | 2026-09-23 |
| [hr98w/jev-visual](https://github.com/hr98w/jev-visual) | Variante éducative d'inférence visuelle sur Apple Silicon : contexte partagé, notation directe des candidats. | python · mit | 303 | 2026-09-21 |
| [Heman10x-NGU/openJev-verdict-2.0](https://github.com/Heman10x-NGU/openJev-verdict-2.0) | Moteur de décision non autorégressif de 151M avec un runtime navigateur WebGPU, annonçant 77,1 % de top-1 et 1,44 % d'erreur de calibration sur son propre benchmark. | python · noassertion | 293 | 2026-09-20 |
| [logan-markewich/jeff](https://github.com/logan-markewich/jeff) | API System One auto-hébergée sur le GLiFormer 400M, avec des benchmarks qui indiquent où elle reste derrière Jev. | python · mit | 273 | 2026-09-20 |
| [togethercomputer/tev1](https://github.com/togethercomputer/tev1) | Recette de données et code d'entraînement qui affine Qwen3.5-4B en modèle de décision à poids ouverts sur Together AI. | python · mit | 177 | 2026-09-24 |
| [kshetrajna12/reflex](https://github.com/kshetrajna12/reflex) | Petit modèle de décision ouvert sur Qwen3.5 : état plus questions typées vers des probabilités calibrées. | python · mit | 160 | 2026-09-27 |
| [allebee/jevk5](https://github.com/allebee/jevk5) | Réplique de Qwen3.5 avec poids LoRA distillés, classée deuxième sur 76 systèmes et première parmi les systèmes ouverts sur JevBench v1.4. | python · apache-2.0 | 126 | 2026-09-28 |
| [daseinlabs/open-jev](https://github.com/daseinlabs/open-jev) | Pré-remplit une fois et note chaque option en un seul passage rembourré sur Gemma 3 4B avec MLX ; joue à Doom depuis le terminal dans la démo. | python · mit | 121 | 2026-09-30 |
| [mmastrac/djev](https://github.com/mmastrac/djev) | Expose `/v1/systemone` sur DiffusionGemma en lisant des réponses typées et des segments de texte depuis un canvas initialisé et figé, sans génération. | python · apache-2.0 | 111 | 2026-09-24 |
| [Heman10x-NGU/Verdict-open-jev](https://github.com/Heman10x-NGU/Verdict-open-jev) | Moteur de décision non autorégressif sur ModernBERT avec incertitude calibrée et terrain de jeu WebGPU dans le navigateur. | python · noassertion | 110 | 2026-09-28 |
| [zwliJay/jev-forge](https://github.com/zwliJay/jev-forge) | Stack complète pour la construction auditable de données, l'entraînement de Qwen3.5-0.8B, l'évaluation figée Mind2Web et OOD, le service local et une base de référence RLCD préliminaire. | python · noassertion | 94 | 2026-09-23 |
| [kikoncuo/jevfire](https://github.com/kikoncuo/jevfire) | Décisions parallèles pour les LLM CUDA via une API vLLM, avec des exemples d'agents de jeu et des benchmarks. | javascript · mit | 72 | 2026-09-18 |
| [bnsd55/jevmlx](https://github.com/bnsd55/jevmlx) | Décisions contraintes parallèles pour tout modèle MLX sur Apple Silicon, en une seule passe avant. | python · mit | 69 | 2026-09-25 |
| [r-ms/mini-jev](https://github.com/r-ms/mini-jev) | Expérience préenregistrée sur un Qwen3-4B figé : lit les logits de la lettre d'option, sans passer par le JSON. | python · mit | 58 | 2026-09-18 |
| [ikermoel/open-alternative-jev](https://github.com/ikermoel/open-alternative-jev) | Décisions typées et calibrées depuis tout modèle à poids ouverts en une seule passe avant, sur Hugging Face et vLLM. | python · apache-2.0 | 57 | 2026-09-25 |
| [zhengxuyu/litjev](https://github.com/zhengxuyu/litjev) | Transforme n’importe quel LLM standard en couche de décision de style Jev. | python · apache-2.0 | 46 | 2026-09-21 |
| [OmniJev/PlayJev](https://github.com/OmniJev/PlayJev) | Joue à dix jeux navigateur à partir de la seule image sur un Qwen3.5-0.8B affiné, une passe avant par coup, avec poids ouverts et démo dans le navigateur. | javascript · apache-2.0 | 45 | 2026-09-24 |
| [JoshuaSP/open-jev](https://github.com/JoshuaSP/open-jev) | Inférence JSON typée avec DiffusionGemma, évaluée par rapport à Jev. | python · mit | 43 | 2026-09-16 |
| [iammrduncan/typesafe-ai-benchmark](https://github.com/iammrduncan/typesafe-ai-benchmark) | Passerelle LLM qui imite le format de réponse TypeSafe, utile comme substitut en attendant une clé. | typescript · mit | 40 | 2026-09-19 |
| [mithalouni/system-one-open](https://github.com/mithalouni/system-one-open) | Décisions typées et calibrées en une seule passe avant sur Gemma 4 E2B et Gemma 3 270M. | python · noassertion | 38 | 2026-09-17 |
| [zhihz/openjev](https://github.com/zhihz/openjev) | Décisions locales bilingues à partir du contexte, des questions et des réponses candidates. | python · noassertion | 35 | 2026-09-16 |
| [rorshopping/jev-on-a-laptop](https://github.com/rorshopping/jev-on-a-laptop) | Étude des décisions de type Jev sur des modèles standard de 1,5B à 8B sur un ordinateur portable, avec une démo Hugging Face. | python · noassertion | 25 | 2026-09-17 |
| [olanotolu/jevbetter](https://github.com/olanotolu/jevbetter) | Un évaluateur en un seul passage plus puissant avec un benchmark direct contre le design de démarrage jevlike. | python · mit | 16 | 2026-09-16 |
| [genai-craft/openvons](https://github.com/genai-craft/openvons) | Couche de décision ouverte répondant à un ensemble fini d'options avec des probabilités réparties entre execute, confirm et reject. Réplique indépendante, sans les poids TypeSafe. | python · noassertion | 14 | 2026-09-21 |
| [amithgc/local-jev](https://github.com/amithgc/local-jev) | Serveur hors ligne compatible avec le point de terminaison System One, vérifié contre le SDK officiel ; rapporte 80,5 pour cent sur les éléments publics de JevBench contre 86,6 pour cent publiés pour l'API hébergée. | python · mit | 13 | 2026-09-21 |
| [David-Lolly/Jev-Compatible](https://github.com/David-Lolly/Jev-Compatible) | Passerelle qui transforme un déploiement SGLang ou vLLM existant en service de décision compatible Jev en notant les tokens candidats, sans entraînement ni modification du modèle. | python | 6 | 2026-09-21 |
| [metask-ai/metask-jev](https://github.com/metask-ai/metask-jev) | Modèles de décision typée à poids ouverts sur Qwen3.5 avec probabilités calibrées par option en une seule passe avant ; 80,1 % sur JevBench contre 75,3 pour Jev 1.13. | python | 2 | 2026-09-22 |

## 🎮 Jeux, robotique et simulation

Les décisions comme mécanique de jeu. _(19 entrées)_

| Projet | Description | Lang / Licence | ⭐ | Maj |
| --- | --- | --- | --- | --- |
| [rmalde/minecraft-agent](https://github.com/rmalde/minecraft-agent) | Tue le dragon sur un serveur vanilla avec un modèle de pointe pour la planification et Jev sélectionnant chaque action du joueur ; la partie enregistrée a nécessité 131 décisions Jev et 35 appels au planificateur. | javascript | 569 | 2026-09-20 |
| [fhshaik/typesafe-mario](https://github.com/fhshaik/typesafe-mario) | Joue à Super Mario Bros. à partir de l'état structuré de l'émulateur ; Jev choisit directement l'entrée de la manette NES. | python | 422 | 2026-09-16 |
| [FBddcz/embodied-jev](https://github.com/FBddcz/embodied-jev) | Workbench navigateur pour expériences incarnées dans MuJoCo où chaque pas du robot est une décision Jev visible, adossé à un modèle local ou à une API cloud. | python · mit | 250 | 2026-09-22 |
| [rokbenko/quackd](https://github.com/rokbenko/quackd) | Ligne de commande pour robots pilotés par LLM sur sept corps, avec un stepper Jev optionnel qui choisit parmi les appels sans jamais écrire un angle d'articulation. | python · apache-2.0 | 245 | 2026-09-30 |
| [RomanSlack/jev-drone](https://github.com/RomanSlack/jev-drone) | Drone à caméra seule dans MuJoCo avec Jev dans la boucle à 2,5 Hz. | python · mit | 229 | 2026-09-24 |
| [standardagents/jevpilot](https://github.com/standardagents/jevpilot) | Simulateur de conduite Three.js où Jev choisit direction et vitesse parmi des trajectoires échantillonnées jusqu'à quatre fois par seconde ; [conduisez-le](https://jevpilot.standardagents.ai). | javascript | 203 | 2026-09-17 |
| [emrickgarrett/OneVOneJev](https://github.com/emrickgarrett/OneVOneJev) | Arène 1v1 quickscope en Three.js. | typescript | 41 | 2026-09-18 |
| [phyous/tsai-sc](https://github.com/phyous/tsai-sc) | Joue à la version shareware originale de StarCraft au clavier et à la souris, avec probabilités d'action enregistrées. | python · mit | 28 | 2026-09-16 |
| [lukaske/jev-doom-agent](https://github.com/lukaske/jev-doom-agent) | Agent Doom natif du navigateur avec état spatial structuré et télémétrie de décision en direct. | typescript | 28 | 2026-09-17 |
| [sorrycc/typesafe-snake](https://github.com/sorrycc/typesafe-snake) | Un Choice par tick ; coups légaux et faits générés en code. | typescript | 24 | 2026-09-17 |
| [vinilana/live-jev](https://github.com/vinilana/live-jev) | Voiture en vue de dessus dans le navigateur envoyant quatre questions typées toutes les 200 ms, avec des overrides conditionnés par la confiance dans le code. | javascript | 21 | 2026-09-18 |
| [TarunTomar122/jev-askable-arm](https://github.com/TarunTomar122/jev-askable-arm) | Objectifs en anglais zero-shot sur un bras Franka simulé ; Jev enchaîne des primitives codées en dur. | python · mit | 12 | 2026-09-17 |
| [valentynkit/jev-plays-pokemon-red](https://github.com/valentynkit/jev-plays-pokemon-red) | Pokemon Red sur PyBoy : le code gère l’itinéraire et les calculs, Jev ne choisit qu’aux embranchements, et chaque tour de combat enregistre une prédiction faible évaluée par le score de Brier par rapport à ce qu’indique la RAM. | python · mit | 10 | 2026-09-19 |
| [AbdelStark/heist-one](https://github.com/AbdelStark/heist-one) | Jeu d'infiltration où Jev produit les jugements des gardes et le code déterministe contrôle le monde. | typescript · mit | 9 | 2026-09-17 |
| [anxkhn/JevPlaysPokemon](https://github.com/anxkhn/JevPlaysPokemon) | Pokémon de génération 3 via Showdown et une vraie ROM FireRed. | html · gpl-3.0 | 7 | 2026-09-18 |
| [vishxrad/clashroyale-jev](https://github.com/vishxrad/clashroyale-jev) | Joue à Clash Royale avec Jev qui choisit les cartes et les placements à partir de la vision du champ de bataille Qwen et de la reconnaissance locale de la main et de l'élixir par OpenCV. | python | 4 | 2026-09-22 |
| [phyous/tsai-civ2](https://github.com/phyous/tsai-civ2) | Civilization II dans un navigateur, harnais de jeu complet, probabilités d'action en direct. | python · noassertion | 3 | 2026-09-18 |
| [siroccomask/snake-jev](https://github.com/siroccomask/snake-jev) | Snake contrôlé par des évaluations Jev parallèles, un appel API par tick. | python · mit | 3 | 2026-09-19 |
| [hazlema/jev-connect4](https://github.com/hazlema/jev-connect4) | Puissance 4 avec neuf stratégies de requête interchangeables pour un seul modèle, chaque réponse évaluée par rapport à la vérité terrain du moteur dans un inspecteur en direct. | typescript · mit | 1 | 2026-09-21 |

## 💹 Finance et trading

Noter des signaux financiers avec des probabilités calibrées. _(5 entrées)_

| Projet | Description | Lang / Licence | ⭐ | Maj |
| --- | --- | --- | --- | --- |
| [jarrodwatts/jev-trader](https://github.com/jarrodwatts/jev-trader) | Une décision de trading à chaque bloc Monad, sur Kuru MON-USDC, environ 300 ms chacune. | typescript · mit | 2,695 | 2026-09-17 |
| [imikerussell/beebots](https://github.com/imikerussell/beebots) | Exécute trois bots de trading pilotés par Jev contre les perpetuals OKX avec un tableau de bord en direct, paper trading par défaut et argent réel derrière des flags explicites. | typescript · mit | 180 | 2026-09-27 |
| [aowang-ai/jev-trade](https://github.com/aowang-ai/jev-trade) | Trader Jev en direct sur Hyperliquid. | typescript · noassertion | 171 | 2026-09-21 |
| [zadescoxp/Jev-Trades](https://github.com/zadescoxp/Jev-Trades) | Bot de trading crypto avec backtesting. | python · apache-2.0 | 37 | 2026-09-25 |
| [justinhe16/trade-jev](https://github.com/justinhe16/trade-jev) | Évalue Jev en backtest comme trader d'achat, de vente ou de conservation sur des données de carnet d'ordres NQ. | python · mit | 11 | 2026-09-17 |

## 🎪 Terrains de jeu et démos

Essayez en trente secondes. _(12 entrées)_

| Projet | Description | Lang / Licence | ⭐ | Maj |
| --- | --- | --- | --- | --- |
| [dabit3/jev-experiments](https://github.com/dabit3/jev-experiments) | Assortiment de petites expériences Jev de Nader Dabit. | typescript | 397 | 2026-09-21 |
| [TypeSafeAI/typesafe-playground](https://github.com/TypeSafeAI/typesafe-playground) | 110 cas d'usage, jeux et défis de modèles avec prompts modifiables et comparaisons A/B ; une organisation communautaire, pas le fournisseur, anciennement sous BunsDev. | typescript · mit | 22 | 2026-09-28 |
| [kavehmz/typesafe-playground](https://github.com/kavehmz/typesafe-playground) | Du routage de support à une simulation de conduite 3D avec entrées de capteurs visibles. | javascript | 14 | 2026-09-29 |
| [GiesN/typesafe-jev-workflow](https://github.com/GiesN/typesafe-jev-workflow) | Démo LangGraph qui envoie un e-mail simulé à Jev et route selon le Choice typé qu'elle renvoie. | python | 12 | 2026-09-16 |
| [lbotinelly/jev-little-airways](https://github.com/lbotinelly/jev-little-airways) | Étude de capacités avec démonstration pour Jev. | html · mit | 7 | 2026-09-17 |
| [haseeb-heaven/jev-system-one](https://github.com/haseeb-heaven/jev-system-one) | Interface de terminal où OpenAI répond et Jev évalue séparément la pertinence, la fiabilité et la qualité. | python · mit | 6 | 2026-09-17 |
| [markjaquith/typesafe-ai-playground](https://github.com/markjaquith/typesafe-ai-playground) | Playground CLI en Rust pour des expériences autour de Jev. | rust · mit | 5 | 2026-09-22 |
| [replynodes/jev-web-analyzer](https://github.com/replynodes/jev-web-analyzer) | Convertit une landing page SaaS en Markdown et pose à Jev dix questions Choice bornées sur ce que comprend un visiteur qui découvre, présenté comme une analyse pour fondateurs. | typescript · apache-2.0 | 5 | 2026-09-28 |
| [wustep/jev-playground](https://github.com/wustep/jev-playground) | Détermine si un modèle System One peut piloter une composition musicale uniquement via des décisions typées classify, score et pick. | typescript | 2 | 2026-09-26 |
| [willprout/magic-8-ball](https://github.com/willprout/magic-8-ball) | Posez une question, un choix parmi vingt réponses sélectionne la réponse et affiche la latence entre le clic et la réponse ; [démo en direct](https://willprout.github.io/magic-8-ball/). | typescript | 1 | 2026-09-18 |
| [bud-ro/jev-demos](https://github.com/bud-ro/jev-demos) | Démos conçues pour tester les points forts de Jev. | dart | 1 | 2026-09-18 |
| [rishi-raj-jain/hn-thread-judge](https://github.com/rishi-raj-jain/hn-thread-judge) | Lit les fils Hacker News les plus discutés commentaire par commentaire avec Jev et réduit chacun à un verdict unique, servi en direct depuis Postgres. | typescript | 0 | 2026-09-21 |

<!-- entries:end -->

---

## 🧭 Comment cette liste est tenue

Ce n'est pas une liste saisie à la main qui moisit en six mois. C'est **un fichier de données, des scripts déterministes et un relecteur IA gratuit** :

| Étape | Commande | Ce qu'elle fait |
| --- | --- | --- |
| **Semence** | `node scripts/import-seed.mjs <projects.json>` | Importe un dump communautaire CC0 dans `data/entries.json`. Manuel, au re-seed. |
| **Vérification** | `node scripts/verify.mjs` | Schéma, URLs dupliquées, ids de catégorie, hygiène des descriptions. Node pur, sans modèle ni réseau. |
| **Actualisation** | `node scripts/refresh-stars.mjs` | Étoiles/licences/archives via l'API GitHub, puis régénération README et site. |
| **Traduction** | `node scripts/translate.mjs` | Remplit les descriptions en chinois et en français avec des modèles opencode **gratuits**. Idempotent, reprenable. |
| **Relecture** | `node scripts/curate.mjs` | Un modèle gratuit relit les nouvelles soumissions et audite périodiquement l'état du dépôt. |
| **Rendu** | `node scripts/build-readme.mjs`, `site/build.mjs` | Régénère les trois README, le site et les exports lisibles par machine. |

**IA gratuite, jamais de clé d'API.** Le curateur tourne sur les modèles publics `*-free` d'[opencode Zen](https://opencode.ai/zen), découverts en direct sur `/zen/v1/models` avec une liste de secours statique. Si le réseau ou le modèle est indisponible, il se dégrade vers un rapport déterministe au lieu d'échouer. Il ne pousse jamais sur `main`, n'approuve jamais automatiquement une PR humaine, et n'invente jamais un nombre d'étoiles.

**Garde à deux modèles.** Les nouvelles entrées sont rédigées par un modèle gratuit et relues par un second modèle gratuit indépendant avant toute fusion. Une modification qui ne touche que le rapport n'est jamais fusionnée automatiquement — elle doit toucher le fichier de données.

---

## ❓ FAQ

**Qu'est-ce que Jev exactement ?** Un modèle System One de TypeSafe AI : on envoie un state et des questions typées, on reçoit des réponses typées avec probabilités et confiance.

**En quoi diffère-t-il de « demander à un LLM de choisir une option » ?** Un LLM renvoie du texte à parser. Jev renvoie un `choice` typé plus une distribution de probabilités : on peut seuiller, écrire des tests unitaires et journaliser un nombre.

**Faut-il une clé API TypeSafe ?** Seulement pour l'API hébergée. La catégorie [Modèles ouverts et répliques](#-mod%C3%A8les-ouverts-et-r%C3%A9pliques) contient la sémantique System One sur des poids ouverts.

**Comment faire référencer mon projet ?** Ouvrez une PR sur `data/entries.json`, ou ajoutez le sujet `jev` et ouvrez une issue. Voir [CONTRIBUTING.fr.md](CONTRIBUTING.fr.md).

**Cette liste est-elle affiliée à TypeSafe AI ?** Non, elle est maintenue par la communauté. TypeSafe AI est lié parce que Jev est leur modèle.

**À quel point les étoiles sont-elles à jour ?** Actualisées par GitHub Actions ; le pied de page porte la date exacte.

**Puis-je utiliser ces données dans mon outil ?** Oui — CC0-1.0, domaine public. Récupérez `projects.json` ou `llms-full.txt` et faites-en ce que vous voulez.

---

## 📣 Partagez

Un partage vaut dix étoiles pour les bâtisseurs listés ci-dessous.

[![Partager sur X](https://img.shields.io/badge/Partager%20-%20X-000000?style=for-the-badge&logo=x)](https://twitter.com/intent/tweet?text=Awesome%20Jev%20%E2%80%94%20tout%20ce%20qui%20est%20construit%20sur%20Jev%2C%20le%20mod%C3%A8le%20System%20One%20de%20TypeSafe%20AI.&url=https://github.com/hdjekuue/awesome-jev&hashtags=jev,typesafe,aiagents,awesome)
[![Partager sur Reddit](https://img.shields.io/badge/Partager%20-%20Reddit-ff4500?style=for-the-badge&logo=reddit&logoColor=white)](https://www.reddit.com/submit?url=https://github.com/hdjekuue/awesome-jev&title=Awesome%20Jev)
[![Partager sur LinkedIn](https://img.shields.io/badge/Partager%20-%20LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/sharing/share-offsite/?url=https://github.com/hdjekuue/awesome-jev)

## 📮 Contribuer

Il manque un projet Jev, ou une ligne n'est plus à jour ? **Une entrée par PR, trois minutes de travail, fusion rapide.** Lisez [CONTRIBUTING.fr.md](CONTRIBUTING.fr.md) (ou [English](CONTRIBUTING.md) / [中文](CONTRIBUTING.zh.md)) pour le format exact et la checklist de fusion.

<sub>Nombre d'étoiles au 2026-10-01. Cette liste est mise à jour en continu — voir « Comment cette liste est tenue » ci-dessus.</sub>

## 📄 Licence

[CC0-1.0](LICENSE) — domaine public. Utilisez-la librement, dans n'importe quelle langue, avec ou sans attribution.