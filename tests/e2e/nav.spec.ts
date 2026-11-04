import { expect, test } from "@playwright/test";

test("the skip link is the first stop and moves focus to the main content", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");

  const skipLink = page.getByRole("link", { name: "Skip to content" });
  await expect(skipLink).toBeFocused();
  await expect(skipLink).toBeInViewport();

  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main$/);
  await expect(page.locator("main")).toBeFocused();
});

for (const [label, id] of [
  ["Work", "work"],
  ["Experience", "experience"],
  ["Skills", "skills"],
  ["Contact", "contact"],
] as const) {
  test(`the ${label} anchor scrolls to its section`, async ({ page }) => {
    await page.goto("/");
    await page
      .getByRole("navigation", { name: "Sections" })
      .getByRole("link", { name: label })
      .click();

    await expect(page).toHaveURL(new RegExp(`#${id}$`));
    await expect(page.locator(`section#${id} h2`)).toBeInViewport();
  });
}

test("every in-page link points at an element that exists", async ({ page }) => {
  await page.goto("/");
  const hrefs = await page
    .locator('a[href^="#"], a[href^="/#"]')
    .evaluateAll((links) => links.map((link) => link.getAttribute("href") ?? ""));

  for (const href of new Set(hrefs)) {
    const id = href.split("#")[1] ?? "";
    await expect(page.locator(`[id="${id}"]`), `target for ${href}`).toHaveCount(1);
  }
});

test("the page never scrolls sideways", async ({ page }) => {
  await page.goto("/");
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});

test("interactive targets are at least 44 by 44 pixels", async ({ page }) => {
  await page.goto("/");
  const undersized = await page
    .locator("main a, main button, header a, header button, footer a")
    .evaluateAll((elements) =>
      elements
        .filter((element) => element.getClientRects().length > 0)
        .map((element) => {
          const { width, height } = element.getBoundingClientRect();
          return { text: element.textContent?.trim() ?? "", width, height };
        })
        .filter(({ width, height }) => width < 44 || height < 44),
    );
  expect(undersized).toEqual([]);
});
