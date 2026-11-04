import { expect, test } from "@playwright/test";

const TRIGGER_NAME = /where this number comes from/;

test.describe("annotation slip", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/design");
  });

  for (const key of ["Enter", "Space"] as const) {
    test(`opens with ${key}, moves focus in, and Esc returns focus`, async ({ page }) => {
      const trigger = page.getByRole("button", { name: TRIGGER_NAME });
      await trigger.focus();
      await page.keyboard.press(key);

      const slip = page.getByRole("dialog", { name: /cumulative layout shift/ });
      await expect(slip).toBeVisible();
      await expect(slip).toContainText("0.495 down to 0.004");
      expect(await slip.evaluate((node) => node.contains(document.activeElement))).toBe(true);

      await page.keyboard.press("Escape");
      await expect(slip).toBeHidden();
      await expect(trigger).toBeFocused();
    });
  }

  test("keeps focus inside while open", async ({ page }) => {
    const trigger = page.getByRole("button", { name: TRIGGER_NAME });
    await trigger.click();
    const slip = page.getByRole("dialog");

    for (let step = 0; step < 4; step += 1) {
      await page.keyboard.press("Tab");
      expect(await slip.evaluate((node) => node.contains(document.activeElement))).toBe(true);
    }
  });

  test("the close button closes it and returns focus", async ({ page }) => {
    const trigger = page.getByRole("button", { name: TRIGGER_NAME });
    await trigger.click();
    await page.getByRole("button", { name: "Close" }).click();

    await expect(page.getByRole("dialog")).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("has no axe violations while open", async ({ page }) => {
    const { default: AxeBuilder } = await import("@axe-core/playwright");
    await page.getByRole("button", { name: TRIGGER_NAME }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    const { violations } = await new AxeBuilder({ page }).include("[role=dialog]").analyze();
    expect(violations).toEqual([]);
  });
});

test("the design page is excluded from search engines", async ({ page }) => {
  await page.goto("/design");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});
