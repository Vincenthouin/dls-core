# DLS Core

Design Language System — **cœur réutilisable** pour l'ensemble des apps.
Contient les **tokens** (couleurs, dimensions, rôles) et les **composants
génériques React** (Button, Input, Toggle, Icon button, Badge, Chip, Alert, Loader, Icons ✓).

📺 **Galerie live (tous les composants × états)** : <https://vincenthouin.github.io/dls-core/>
_(auto-déployée à chaque push sur `main` ; une régression visuelle échoue la CI — cf. `visual/`)._

Les composants sont **portables** : stylés via les CSS variables des tokens,
sans dépendance Tailwind. Ils fonctionnent dans n'importe quel projet React
tant que `tokens.css` + `components.css` sont importés.

```tsx
import "dls-core/tokens.css";
import "dls-core/components.css";
import { Button } from "dls-core";

<Button variant="primary" platform="desktop">Copy all</Button>
```

## Pipeline de tokens (Figma → code, automatisé)

Source de vérité : **`tokens/design-tokens.json`** (format [W3C Design Tokens](https://design-tokens.github.io/community-group/format/)).
Il est édité **dans Figma via le Token Plugin** (bidirectionnel, ouvre une PR) ou à la main.
`tokens.css` et `tokens.json` en sont **GÉNÉRÉS** — ne pas les éditer :

```bash
npm run tokens:pull    # Figma → design-tokens.json (voir TOKENS-SYNC.md ; REST Enterprise, ou MCP)
npm run tokens:build   # design-tokens.json → tokens.css + tokens.json (aussi lancé par prepare/build)
```

Boucle : *éditer dans Figma → le plugin ouvre une PR (design-tokens.json) → CI valide + vérifie l'absence
de dérive → merge → `npm update dls-core` côté app.* Un token à `<layer>.<cat>.<leaf>` devient la variable
CSS `--<cat>-<leaf>`. Dark-only pour l'instant (la valeur `dark` des couleurs `{ light, dark }` est émise dans
`:root` ; un thème clair pourra brancher les valeurs `light` sans changer l'API).

## Contenu

| Fichier | Rôle |
|---|---|
| `tokens/design-tokens.json` | **Source de vérité** — graphe W3C (Primitives → Semantic → Component), éditable Figma/main |
| `tokens/tokens.css` | _généré_ — CSS custom properties, mode dark dans `:root` |
| `tokens/tokens.json` | _généré_ — miroir plat `@alias` pour tooling |
| `tokens/tailwind-preset.cjs` | Preset Tailwind (`bg-page`, `text-secondary`, `border`, `rounded-md`…) |
| `scripts/build-tokens.mjs` | Générateur `design-tokens.json` → css/json |

## Installation

```bash
npm i github:Vincenthouin/dls-core   # ou, après publication npm : npm i dls-core
```

## Usage

**1. Importer les variables une fois** (point d'entrée de l'app) :

```ts
import "dls-core/tokens.css";
```

**2. Brancher le preset Tailwind** :

```js
// tailwind.config.js
const dls = require("dls-core/tailwind-preset");
module.exports = { presets: [dls], content: ["./src/**/*.{ts,tsx}"] };
```

**3. Utiliser les utilitaires tokenisés** :

```tsx
<div className="bg-page text-primary">
  <div className="bg-card border rounded-md p-control-m">…</div>
</div>
```

Ou directement en CSS : `background: var(--surface-page)`.

## Architecture des tokens

- **Primitives** — valeurs brutes : `--color-neutral-1000`, `--number-12`.
- **Semantic** — rôles : `--surface-page`, `--text-primary`, `--border-default`, `--radius-md`.
- **Component** — spécifiques : `--button-radius`, `--toggle-track-on`.

Les apps consomment surtout le **Semantic**. Un seul mode (`Dark`) pour l'instant ;
un mode clair pourra être ajouté plus tard sans changer l'API.
