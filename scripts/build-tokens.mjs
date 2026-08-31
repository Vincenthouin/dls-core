#!/usr/bin/env node
/**
 * Générateur de tokens — DLS Core.
 *
 * Source de vérité : tokens/design-tokens.json (format W3C Design Tokens ;
 * édité dans Figma via le Token Plugin, ou à la main).
 * Sorties GÉNÉRÉES (ne pas éditer à la main) :
 *   - tokens/tokens.css   : CSS custom properties (mode Dark actif dans :root)
 *   - tokens/tokens.json  : miroir plat @alias (compat outillage)
 *
 * Convention de nommage : un token à `<layer>.<cat>.<leaf>` devient la variable
 * CSS `--<cat>-<leaf>` (la layer ne sert qu'à ranger/valider, pas au nom CSS).
 * Un alias `{<layer>.<cat>.<leaf>}` devient `var(--<cat>-<leaf>)`.
 *
 * Dark-only pour l'instant : pour une couleur `{ light, dark }`, on émet la
 * valeur `dark` dans `:root`. Le jour où un thème clair est branché, ajouter
 * ici un bloc `:root[data-theme="light"]` à partir des valeurs `light`.
 *
 * Usage : node scripts/build-tokens.mjs   (ou `npm run tokens:build`)
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(root, "tokens", "design-tokens.json");

const CAT_LABELS = {
  color: "Couleurs",
  number: "Dimensions (px)",
  surface: "Surfaces",
  text: "Texte",
  border: "Bordures",
  radius: "Rayons",
  size: "Tailles",
  button: "Button",
  control: "Control",
  toggle: "Toggle",
  loader: "Loader",
};
const LAYER_LABELS = { primitives: "Primitives", semantic: "Semantic", component: "Component" };

const isToken = (n) => n && typeof n === "object" && "$value" in n;
const varName = (cat, leaf) => `--${cat}-${leaf}`;

/** `{primitives.color.neutral-1000}` -> { layer, cat, leaf } */
function parseAlias(v) {
  const m = /^\{([^.]+)\.([^.]+)\.(.+)\}$/.exec(v);
  if (!m) return null;
  return { layer: m[1], cat: m[2], leaf: m[3] };
}

/** Résout la valeur CSS d'un token (dark-only). */
function cssValue(token) {
  const v = token.$value;
  if (typeof v === "string") {
    const a = parseAlias(v);
    if (a) return `var(${varName(a.cat, a.leaf)})`;
    return v; // dimension littérale ("12px")
  }
  if (v && typeof v === "object" && "dark" in v) return v.dark; // couleur { light, dark }
  throw new Error(`Valeur de token non supportée: ${JSON.stringify(v)}`);
}

/** Valeur pour le miroir @alias tokens.json. */
function jsonValue(token) {
  const v = token.$value;
  if (typeof v === "string") {
    const a = parseAlias(v);
    if (a) return `@${a.cat}/${a.leaf}`;
    return v;
  }
  if (v && typeof v === "object" && "dark" in v) return v.dark;
  throw new Error(`Valeur de token non supportée: ${JSON.stringify(v)}`);
}

const doc = JSON.parse(readFileSync(SRC, "utf8"));
const layers = Object.keys(doc).filter((k) => !k.startsWith("$"));

// ── tokens.css ────────────────────────────────────────────
const lines = [];
lines.push("/**");
lines.push(" * DLS Core — Design tokens (CSS custom properties).");
lines.push(" * ⚠️ GÉNÉRÉ depuis tokens/design-tokens.json — NE PAS ÉDITER À LA MAIN.");
lines.push(" *   Régénérer : npm run tokens:build");
lines.push(" * 3 tiers : Primitives → Semantic → Component. Mode Dark actif dans :root.");
lines.push(" */");
lines.push(":root {");
let first = true;
for (const layer of layers) {
  for (const [cat, leaves] of Object.entries(doc[layer])) {
    const label = `${LAYER_LABELS[layer] ?? layer} · ${CAT_LABELS[cat] ?? cat}`;
    lines.push(`${first ? "" : "\n"}  /* ── ${label} ${"─".repeat(Math.max(2, 52 - label.length))} */`);
    first = false;
    for (const [leaf, token] of Object.entries(leaves)) {
      if (!isToken(token)) continue;
      lines.push(`  ${varName(cat, leaf)}: ${cssValue(token)};`);
    }
  }
}
lines.push("}");
writeFileSync(join(root, "tokens", "tokens.css"), lines.join("\n") + "\n");

// ── tokens.json (miroir plat @alias) ──────────────────────
const flat = {
  _comment:
    "GÉNÉRÉ depuis design-tokens.json (npm run tokens:build). Miroir plat : primitives = valeurs brutes (dark), semantic/component = alias @cat/leaf.",
};
for (const layer of layers) {
  const out = {};
  for (const [cat, leaves] of Object.entries(doc[layer])) {
    for (const [leaf, token] of Object.entries(leaves)) {
      if (!isToken(token)) continue;
      out[`${cat}/${leaf}`] = jsonValue(token);
    }
  }
  flat[layer] = out;
}
writeFileSync(join(root, "tokens", "tokens.json"), JSON.stringify(flat, null, 2) + "\n");

const count = layers.reduce(
  (n, l) => n + Object.values(doc[l]).reduce((m, c) => m + Object.keys(c).length, 0),
  0,
);
console.log(`✓ tokens.css + tokens.json générés depuis design-tokens.json (${count} tokens)`);
