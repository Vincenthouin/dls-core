# DLS Core

Design Language System — **cœur réutilisable** pour l'ensemble des apps.
Contient les **tokens** (couleurs, dimensions, rôles) et les **composants
génériques React** (Button, Input, Toggle, Icon button, Alert, Icons ✓).

Les composants sont **portables** : stylés via les CSS variables des tokens,
sans dépendance Tailwind. Ils fonctionnent dans n'importe quel projet React
tant que `tokens.css` + `components.css` sont importés.

```tsx
import "dls-core/tokens.css";
import "dls-core/components.css";
import { Button } from "dls-core";

<Button variant="primary" platform="desktop">Copy all</Button>
```

Source de vérité : la bibliothèque Figma **DLS Core**. Les fichiers de `tokens/`
sont **générés depuis Figma** — ne pas les éditer à la main.

## Contenu

| Fichier | Rôle |
|---|---|
| `tokens/tokens.css` | CSS custom properties (Primitives → Semantic → Component), mode dark |
| `tokens/tailwind-preset.cjs` | Preset Tailwind (`bg-page`, `text-secondary`, `border`, `rounded-md`…) |
| `tokens/tokens.json` | Graphe brut (valeurs + alias) pour tooling |

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
