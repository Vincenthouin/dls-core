import { defineConfig } from "@playwright/test";

/**
 * Visual regression de la galerie de composants (gallery.html).
 * Les baselines sont générés EN CI (Linux) — cf. .github/workflows/visual-baseline.yml —
 * pour éviter les différences de rendu macOS/Linux. Localement, on compare seulement.
 */
export default defineConfig({
  testDir: ".",
  snapshotPathTemplate: "{testDir}/__screenshots__/{arg}{ext}",
  fullyParallel: true,
  reporter: [["html", { open: "never" }]],
  use: { baseURL: "http://localhost:8799" },
  // sert la racine du repo (gallery.html + tokens/ + styles/ + package.json)
  webServer: {
    command: "python3 -m http.server 8799",
    cwd: "..",
    port: 8799,
    reuseExistingServer: true,
  },
  expect: {
    // fige les animations (le Loader tourne) + tolère le bruit d'anti-aliasing
    toHaveScreenshot: { animations: "disabled", maxDiffPixelRatio: 0.01 },
  },
});
