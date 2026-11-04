import { expect, test, type Page } from "@playwright/test";

const LIGHT_PAPER = "rgb(245, 246, 240)";
const DARK_PAPER = "rgb(19, 26, 23)";

const bodyBackground = (page: Page) =>
  page.evaluate(() => getComputedStyle(document.body).backgroundColor);

test("follows the system colour scheme by default", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  expect(await bodyBackground(page)).toBe(DARK_PAPER);

  await page.emulateMedia({ colorScheme: "light" });
  expect(await bodyBackground(page)).toBe(LIGHT_PAPER);
});

test("a stored choice overrides the system before first paint", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("theme", "light"));
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");

  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  expect(await bodyBackground(page)).toBe(LIGHT_PAPER);
});
