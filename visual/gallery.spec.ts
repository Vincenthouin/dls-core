import { test, expect } from "@playwright/test";

// Un snapshot par section de composant → on sait lequel a régressé.
const SECTIONS = [
  "Button",
  "Input",
  "Toggle",
  "Icon button",
  "Loader",
  "Badge",
  "Chip",
  "Alert",
  "Icons",
];

test.beforeEach(async ({ page }) => {
  await page.goto("/gallery.html");
  await page.waitForLoadState("networkidle");
});

for (const name of SECTIONS) {
  test(`section: ${name}`, async ({ page }) => {
    const section = page.locator(`section:has(h2:text-is("${name}"))`);
    await expect(section).toHaveScreenshot(`${name.replace(/ /g, "-").toLowerCase()}.png`);
  });
}
