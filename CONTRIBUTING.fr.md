# Contribuer à Awesome Jev

Merci d'ajouter votre projet. Cette liste est **générée à partir d'un seul fichier de
données**, donc une contribution est plus petite qu'elle n'en a l'air — et elle atterrit
dans les trois langues à la fois.

[English](CONTRIBUTING.md) · [中文](CONTRIBUTING.zh.md) · **Français**

## La version 60 secondes

1. Fork et branche : `git checkout -b add-your-repo`
2. Ajoutez un objet à `data/entries.json` (schéma ci-dessous), dans les trois langues
3. `node scripts/verify.mjs` — doit passer avec 0 erreur
4. `npm run build` — regénérer
5. Ouvrez la PR avec le modèle, titre `Add owner/repo to Category`

C'est tout. Les tableaux des trois README, le site et les exports lisibles par machine sont
aussi régénérés par la CI ; si vous oubliez l'étape 4, le bot s'en charge.

## Pourquoi le fichier de données

`README.md`, `README.zh.md`, `README.fr.md` et `docs/` sont tous générés depuis
`data/entries.json`, entre les marqueurs `<!-- entries:start -->`. Modifier un tableau README
à la main fait diverger lentement les trois langues, ce qui est la manière la plus courante
de voir une liste awesome pourrir. Modifiez les données.

## Schéma

```jsonc
{
  "id": "owner--repo",              // slug : owner et repo en minuscules, "--" entre les deux
  "name": "owner/repo",
  "url": "https://github.com/owner/repo",
  "kind": "repo",                   // "repo" | "resource"
  "description": "Une phrase en anglais, 20–240 caractères.",
  "descriptionZh": "一句简体中文。",
  "descriptionFr": "Une phrase française.",
  "category": "coding-agents",
  "language": "TypeScript",
  "license": "MIT",
  "stars": 1234,                    // nombre pour kind="repo" ; null pour une ressource
  "forks": 56,
  "topics": ["jev", "agent"],
  "official": false,
  "archived": false,
  "pushedAt": "2026-09-24",
  "intents": ["gate or approve tool calls before they run"]
}
```

### Catégories

| id | Section |
| --- | --- |
| `start-here` | 🧭 Pour commencer |
| `official` | 🏛️ SDK officiels et support framework |
| `coding-agents` | 🤖 Agents de code |
| `routing` | 🚦 Routage et passerelles |
| `context` | 🗜️ Contexte et compaction |
| `code-review` | 🔍 Relecture de code et qualité |
| `browser` | 🌐 Navigation et contrôle d'ordinateur |
| `mobile` | 📱 Automatisation mobile et bureau |
| `search-rag` | 🔎 Recherche, reranking et RAG |
| `safety` | 🛡️ Sûreté, modération et vérification |
| `data-ops` | 🗄️ Données et exploitation |
| `apps` | 📦 Applications et extensions |
| `clients` | 🧩 SDK et clients communautaires |
| `cli` | ⌨️ Ligne de commande |
| `benchmarks` | 📊 Benchmarks, évaluations et calibration |
| `open-models` | 🧠 Modèles ouverts et répliques |
| `games` | 🎮 Jeux, robotique et simulation |
| `finance` | 💹 Finance et trading |
| `demos` | 🎪 Terrains de jeu et démos |
| `articles` | 📰 Articles et conférences |

### Règles de description

- Une phrase, factuelle, sans superlatifs (« fulgurant », « révolutionnaire »).
- Majuscule au début, point à la fin.
- Gardez les noms de produits, de dépôts, les drapeaux CLI et les chemins d'API en écriture
  latine dans les trois langues.
- Dites ce que ça fait ; si l'intérêt est la latence ou les dépendances, dites-le aussi.
- 20–240 caractères. `verify.mjs` avertit en dehors.

## Critères d'admission

1. **Il appelle Jev.** L'endpoint System One, un SDK officiel, ou une réplique documentée de
   l'interface System One. Mentionner Jev dans une liste ne compte pas.
2. **Il est public et lisible.** Dépôt public, README qui dit ce qu'il fait.
3. **Il tourne.** Pas d'appel d'API bricolé sans code derrière.
4. **Il n'est pas déjà listé.** Un dépôt, une entrée.
5. **Il n'est pas archivé.** (Les entrées archivées restent listées, marquées `archived: true`.)
6. **Rien de louche.** Pas de vol d'identifiants, pas de charge utile obfusquée, pas d'appel
   réseau caché au-delà des API documentées.

## Ce qui se passe après l'ouverture de la PR

| Étape | Ce qui s'exécute |
| --- | --- |
| `verify` | `node scripts/verify.mjs` — schéma, doublons, catégories, longueur des descriptions |
| `site` | régénère les README, `docs/`, `llms.txt`, `projects.json` |
| `curator` | un modèle **gratuit** vérifie que le dépôt appelle Jev, cherche les doublons, écrit un commentaire |
| `gate` | un second modèle gratuit indépendant approuve, demande des corrections ou ferme |

La fusion est faite par un mainteneur (ou par la porte). Si rien ne se passe en 48 h, laissez
un rappel amical.

## Règles de la maison

- **Une entrée par PR.** Les lots sont fermés pour que la relecture reste possible.
- **Recommander le projet d'autrui est toujours bienvenu** et n'est pas soumis au plafond
  d'auto-promotion ci-dessous.
- **L'auto-promotion est plafonnée.** Les soumissions rapides de vos propres dépôts
  (plusieurs en peu de temps) déclenchent d'abord un rappel amical, puis des rappels, puis une
  fermeture automatique. Voir [`.github/curator-policy.yml`](.github/curator-policy.yml). Il
  s'agit de capacité de relecture, pas de qui vous êtes.

## Une étoile plutôt qu'une simple soumission

Une étoile sur [cette liste](https://github.com/hdjekuue/awesome-jev) est le geste le plus
rentable possible ici : elle augmente la visibilité de chaque projet qu'elle contient. Si votre
entrée vous a été utile, mettez une étoile et partagez :

[![X](https://img.shields.io/badge/Partager%20-%20X-000000?style=flat-square&logo=x)](https://twitter.com/intent/tweet?text=Awesome%20Jev&url=https://github.com/hdjekuue/awesome-jev&hashtags=jev,typesafe,awesome)
[![Reddit](https://img.shields.io/badge/Partager%20-%20Reddit-ff4500?style=flat-square&logo=reddit&logoColor=white)](https://www.reddit.com/submit?url=https://github.com/hdjekuue/awesome-jev)

## Licence

Les contributions sont acceptées sous [CC0-1.0](LICENSE).