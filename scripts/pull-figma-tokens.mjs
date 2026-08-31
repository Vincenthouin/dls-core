#!/usr/bin/env node
/**
 * Pull Figma → tokens/design-tokens.json (source de vérité W3C).
 *
 * Lit les Variables de la bibliothèque Figma **DLS Core** (collections
 * Primitives / Semantic / Component) et régénère `design-tokens.json`.
 * Ensuite : `npm run tokens:build` (css/json) → PR → CI.
 *
 * Convention : collection = layer, nom de variable `cat/leaf` → `layer.cat.leaf`.
 * Couleurs mono-mode → `{ light:"", dark:"#…" }` (dark-only ; light réservé).
 * Alias Figma → `"{layer.cat.leaf}"`.
 *
 *   FIGMA_TOKEN=<pat> npm run tokens:pull
 *   FIGMA_TOKEN=<pat> FIGMA_FILE_KEY=<key> node scripts/pull-figma-tokens.mjs
 *
 * ⚠️ L'endpoint REST `variables/local` est réservé aux plans **Figma Enterprise**.
 * Sur un plan perso/Éducation il renvoie 403 : passer alors par le MCP Figma /
 * la console du plugin (script équivalent documenté dans TOKENS-SYNC.md).
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const FILE_KEY = process.env.FIGMA_FILE_KEY || "FRFEzZgOLYRcT6p2ZTZ57M"; // DLS Core
const TOKEN = process.env.FIGMA_TOKEN;
const LAYERS = { Primitives: "primitives", Semantic: "semantic", Component: "component" };

if (!TOKEN) {
  console.error("✗ FIGMA_TOKEN manquant. Usage : FIGMA_TOKEN=<pat> npm run tokens:pull");
  process.exit(1);
}

const catLeaf = (name) => {
  const p = name.split("/");
  return { cat: p[0], leaf: p.slice(1).join("-") };
};
const w3cType = (t) => (t === "COLOR" ? "color" : t === "STRING" ? "fontFamily" : "dimension");
const hex = ({ r, g, b, a }) => {
  const c = (n) => Math.round(n * 255).toString(16).padStart(2, "0");
  let s = "#" + c(r) + c(g) + c(b);
  if (typeof a === "number" && a < 1) s += c(a);
  return s.toLowerCase();
};

const res = await fetch(`https://api.figma.com/v1/files/${FILE_KEY}/variables/local`, {
  headers: { "X-Figma-Token": TOKEN },
});
if (!res.ok) {
  const body = await res.text();
  console.error(`✗ Figma API ${res.status}: ${body.slice(0, 200)}`);
  if (res.status === 403)
    console.error("  → l'API Variables exige Figma Enterprise. Voir TOKENS-SYNC.md (export via MCP).");
  process.exit(1);
}
const { meta } = await res.json();
const vars = meta.variables;
const cols = meta.variableCollections;

const tree = {
  $schema: "https://design-tokens.github.io/community-group/format/",
  $description:
    "DLS Core design tokens (W3C). SOURCE DE VÉRITÉ — pull depuis Figma (scripts/pull-figma-tokens.mjs). " +
    "tokens.css/tokens.json sont générés (npm run tokens:build).",
  primitives: {},
  semantic: {},
  component: {},
};

const aliasRef = (id) => {
  const v = vars[id];
  const layer = LAYERS[cols[v.variableCollectionId]?.name];
  const { cat, leaf } = catLeaf(v.name);
  return `{${layer}.${cat}.${leaf}}`;
};

let count = 0;
for (const col of Object.values(cols)) {
  const layer = LAYERS[col.name];
  if (!layer) continue;
  const modeId = col.defaultModeId;
  for (const id of col.variableIds) {
    const v = vars[id];
    if (!v) continue;
    const { cat, leaf } = catLeaf(v.name);
    const val = v.valuesByMode[modeId];
    let value;
    if (val && val.type === "VARIABLE_ALIAS") value = aliasRef(val.id);
    else if (v.resolvedType === "COLOR") value = { light: "", dark: hex(val) };
    else if (v.resolvedType === "FLOAT") value = `${val}px`;
    else value = String(val);
    (tree[layer][cat] ||= {})[leaf] = { $type: w3cType(v.resolvedType), $value: value };
    count++;
  }
}

const dest = join(dirname(fileURLToPath(import.meta.url)), "..", "tokens", "design-tokens.json");
writeFileSync(dest, JSON.stringify(tree, null, 2) + "\n");
console.log(`✓ design-tokens.json écrit depuis Figma (${count} tokens). Lance ensuite: npm run tokens:build`);
