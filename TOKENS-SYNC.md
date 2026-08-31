# Sync tokens Figma ⇄ dls-core

`tokens/design-tokens.json` (W3C) est la **source de vérité**. `tokens.css` et
`tokens.json` en sont générés (`npm run tokens:build`, cf. [README](./README.md)).

On réutilise l'outillage du POC Somfy (repo **`Token-Plugin-Editor`**) :
`figma-plugin/` (Figma ⇄ JSON GitHub, PR en 1 clic) + `editor/` (édition UI desktop).

## Boucle cible

```
Figma (DLS Core)  ──plugin──▶  PR sur dls-core (design-tokens.json)
                                     │
                                CI (validate + no-drift)  ──merge──▶  main
                                     │
                          npm update dls-core  ──▶  app Music Share
```

## Config à saisir dans les outils

**Éditeur desktop** (réutilisable tel quel — multi-projets) → ajouter un projet :

| Champ   | Valeur                        |
|---------|-------------------------------|
| owner   | `Vincenthouin`                |
| repo    | `dls-core`                    |
| branch  | `main` (ou un `develop` dédié)|
| path    | `tokens/design-tokens.json`   |
| token   | un PAT GitHub (scope `repo`)  |

**Plugin Figma** : mêmes valeurs (stockées en `clientStorage`, saisies dans l'UI).

## ⚠️ Le plugin est spécifique Somfy — 3 points à généraliser

Le plugin actuel (`figma-plugin/code.ts`) suppose la structure Figma **Somfy**,
différente de **DLS Core**. À adapter (idéalement en fork / « mode dls-core »,
**sans toucher au comportement Somfy**) :

| # | Hardcodé Somfy (ligne) | DLS Core | Adaptation |
|---|---|---|---|
| 1 | Collection unique `"Somfy Tokens"` (`c.name === "Somfy Tokens"`, l.267/398) | 3 collections : `Primitives`, `Semantic`, `Component` | Scanner les 3 collections (ou rendre la liste configurable) |
| 2 | Chemin = `variable.name.replace("/", ".")` (l.272) → la **layer est dans le nom** (`primitives/…`) | Noms **sans** layer (`color/neutral-1000`, `surface/page`, `toggle/track-on`) ; la layer = la **collection** | Préfixer le chemin par `collection.name.toLowerCase()` → `primitives.color.neutral-1000` (= forme exacte de notre `design-tokens.json`) |
| 3 | Modes nommés `Light` / `Dark` (l.404-405) | Un seul mode (`Dark` / `Value`) | Tolérer un mode unique → `$value` simple (ou `{ light:"", dark }`) |

Rien d'autre ne bloque : le format JSON (layers top-level, `$type`/`$value`,
alias `{layer.cat.leaf}`, couleurs `{light,dark}`) est **déjà aligné** sur ce que
le plugin lit/écrit. Notre `design-tokens.json` est précisément la cible qu'un
plugin ainsi généralisé produirait depuis DLS Core.

## En attendant la généralisation du plugin

L'édition **à la main** de `design-tokens.json` + `npm run tokens:build` + PR
fonctionne déjà (la CI valide et bloque toute dérive). Le plugin/éditeur
n'automatisent que l'aller-retour Figma ; ils ne sont pas un prérequis.
