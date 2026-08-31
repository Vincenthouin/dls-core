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

## Pull Figma → JSON (exporteur `tokens:pull`)

Régénère `design-tokens.json` depuis les Variables Figma DLS Core. Deux transports :

**A. REST (automatable, CI)** — `scripts/pull-figma-tokens.mjs` :
```bash
FIGMA_TOKEN=<pat> npm run tokens:pull   # puis npm run tokens:build
```
⚠️ L'endpoint `variables/local` est **Figma Enterprise only** → 403 sur un plan
perso/Éducation. Utiliser alors le transport B.

**B. MCP Figma / console plugin (plan perso)** — même lecture, exécutée *dans* Figma.
Script (lecture seule) validé, à lancer via le MCP `use_figma` ou la console du plugin ;
il produit le graphe `layer.cat.leaf → valeur` puis on reconstruit `design-tokens.json` :

```js
const cols = await figma.variables.getLocalVariableCollectionsAsync();
const LAYERS = { Primitives:"primitives", Semantic:"semantic", Component:"component" };
const colById = new Map(cols.map(c => [c.id, c]));
const all = await figma.variables.getLocalVariablesAsync();
const byId = new Map(all.map(v => [v.id, v]));
const catLeaf = v => { const p=v.name.split("/"); return { cat:p[0], leaf:p.slice(1).join("-") }; };
const layerOf = v => LAYERS[colById.get(v.variableCollectionId)?.name];
const hex = c => { const h=n=>Math.round(n*255).toString(16).padStart(2,"0");
  let s="#"+h(c.r)+h(c.g)+h(c.b); if(c.a<1) s+=h(c.a); return s.toLowerCase(); };
const out = {};
for (const col of cols){ const layer=LAYERS[col.name]; if(!layer) continue;
  const m=col.modes[0].modeId;
  for (const id of col.variableIds){ const v=byId.get(id); if(!v) continue;
    const {cat,leaf}=catLeaf(v); const val=v.valuesByMode[m]; let x;
    if (val && val.type==="VARIABLE_ALIAS"){ const a=byId.get(val.id); const t=catLeaf(a);
      x=`{${layerOf(a)}.${t.cat}.${t.leaf}}`; }
    else if (v.resolvedType==="COLOR") x={light:"",dark:hex(val)};
    else x=`${val}px`;
    (out[`${layer}.${cat}`] ||= {})[leaf]=x; } }
return JSON.stringify(out);
```
_(La version complète, avec résolution d'alias inter-collections et écriture du fichier,
est dans `scripts/pull-figma-tokens.mjs` — le corps REST et MCP partagent la même logique.)_

**Validé le 2026-08-31** : export Figma == `tokens.css` livré (91/91 tokens, zéro
divergence) → `design-tokens.json` est fidèle à Figma.

## Config à saisir dans les outils (option future : plugin bidirectionnel)

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
