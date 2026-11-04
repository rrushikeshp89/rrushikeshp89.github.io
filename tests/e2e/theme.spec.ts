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

test.describe("theme toggle", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/design");
  });

  test("switches theme, persists it, and survives a reload", async ({ page }) => {
    const toggle = page.getByRole("button", { name: "Switch to dark theme" }).first();
    await toggle.click();

    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    expect(await page.evaluate(() => localStorage.getItem("theme"))).toBe("dark");
    await expect(page.locator('meta[name="theme-color"]').first()).toHaveAttribute(
      "content",
      "#131a17",
    );

    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    expect(await bodyBackground(page)).toBe(DARK_PAPER);
    await expect(page.getByRole("button", { name: "Switch to light theme" }).first()).toBeVisible();
  });

  test("works from the keyboard", async ({ page }) => {
    const toggle = page.getByRole("button", { name: "Switch to dark theme" }).first();
    await toggle.focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    await page.keyboard.press("Space");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  });
});
