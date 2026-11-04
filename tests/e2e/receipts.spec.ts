import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Locator, type Page } from "@playwright/test";

const HERO_TABLES = /^45 tables, show source$/;

function heroReceipt(page: Page): Locator {
  return page
    .locator("section[aria-labelledby=hero-title]")
    .getByRole("button", { name: HERO_TABLES });
}

const focusIsInside = (dialog: Locator) =>
  dialog.evaluate((node) => node.contains(document.activeElement));

test.describe("receipts", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  for (const key of ["Enter", "Space"] as const) {
    test(`a receipt opens with ${key}, holds focus, and Esc returns it`, async ({ page }) => {
      const trigger = heroReceipt(page);
      await trigger.focus();
      await page.keyboard.press(key);

      const slip = page.getByRole("dialog", { name: /45\s+tables/ });
      await expect(slip).toBeVisible();
      await expect(slip).toContainText("The Prisma schema defines 45 models");
      expect(await focusIsInside(slip)).toBe(true);

      await page.keyboard.press("Escape");
      await expect(slip).toHaveCount(0);
      await expect(trigger).toBeFocused();
    });
  }

  test("links to the proof file in the repository", async ({ page }) => {
    await heroReceipt(page).click();
    await expect(
      page.getByRole("dialog").getByRole("link", { name: "prisma/schema.prisma in Grove HRMS" }),
    ).toHaveAttribute(
      "href",
      "https://github.com/rrushikeshp89/grove-hrms/blob/main/prisma/schema.prisma",
    );
  });

  test("keeps the rest of the page out of reach while open", async ({ page }) => {
    await heroReceipt(page).click();
    const slip = page.getByRole("dialog");
    for (let step = 0; step < 5; step += 1) {
      await page.keyboard.press("Tab");
      const landedOutside = await page.evaluate(() => {
        const active = document.activeElement;
        const dialog = document.querySelector("dialog[open]");
        return Boolean(active && active !== document.body && dialog && !dialog.contains(active));
      });
      expect(landedOutside).toBe(false);
    }
    await expect(slip).toBeVisible();
  });

  test("the close button closes it and returns focus", async ({ page }) => {
    const trigger = heroReceipt(page);
    await trigger.click();
    const slip = page.getByRole("dialog");
    // Let the 160 ms entrance animation finish: a click mid-animation can land on the backdrop,
    // which (by design, closedby="any") closes the slip before the button is reached.
    await slip.evaluate((node) => Promise.all(node.getAnimations().map((a) => a.finished)));
    await slip.getByRole("button", { name: "Close" }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });

  test("every metric on the page is a receipt", async ({ page }) => {
    const receipts = page.getByRole("button", { name: /, show source$/ });
    // Hero sentence (4) + Grove numerals (4) + Stockroom numerals (3) + Zetpeak (1).
    await expect(receipts).toHaveCount(12);
  });

  test("an open receipt has no axe violations", async ({ page }) => {
    await heroReceipt(page).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    const { violations } = await new AxeBuilder({ page }).include("dialog").analyze();
    expect(violations).toEqual([]);
  });
});

/** The digits a sighted reader sees inside a receipt (the accessible name is separate). */
const visibleNumber = (page: Page, name: string) =>
  page.getByRole("button", { name }).last().locator(":scope > span[aria-hidden=true]");

test.describe("count-up", () => {
  test("shows final values at once when motion is reduced", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(visibleNumber(page, "45 tables, show source")).toHaveText("45");
    await expect(visibleNumber(page, "130+ tests, show source")).toHaveText("130+");
    await expect(visibleNumber(page, "15% fewer ingestion-level errors, show source")).toHaveText(
      "15%",
    );
  });

  test("lands on the real value and never shifts layout", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");
    await page.evaluate(() => {
      const target = window as unknown as { shift: number };
      target.shift = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as (PerformanceEntry & { value: number })[]) {
          target.shift += entry.value;
        }
      }).observe({ type: "layout-shift", buffered: false });
    });

    await page.locator("#grove-hrms-title").scrollIntoViewIfNeeded();
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(1500);

    await expect(visibleNumber(page, "45 tables, show source")).toHaveText("45");
    await expect(visibleNumber(page, "130+ tests, show source")).toHaveText("130+");
    const shift = await page.evaluate(() => (window as unknown as { shift: number }).shift);
    expect(shift).toBeLessThan(0.01);
  });
});

test("every receipt shows a dotted underline, including counting numerals", async ({ page }) => {
  await page.goto("/");
  const undecorated = await page
    .getByRole("button", { name: /, show source$/ })
    .evaluateAll((buttons) =>
      buttons
        .map((button) => {
          const digits = button.querySelector("[data-count-up]") ?? button;
          return {
            name: button.textContent ?? "",
            line: getComputedStyle(digits).textDecorationLine,
          };
        })
        .filter(({ line }) => !line.includes("underline")),
    );
  expect(undecorated).toEqual([]);
});
