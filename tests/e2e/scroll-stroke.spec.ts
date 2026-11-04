import { expect, test, type Page } from "@playwright/test";

const strokeOffset = (page: Page) =>
  page
    .locator(".scroll-stroke path")
    .evaluate((path) => Number(getComputedStyle(path).strokeDashoffset.replace("px", "")));

async function scrollThroughWork(page: Page, fraction: number) {
  await page.evaluate((progress) => {
    const work = document.querySelector<HTMLElement>("#work");
    if (!work) throw new Error("#work missing");
    const top = work.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, top + (work.offsetHeight - window.innerHeight) * progress);
  }, fraction);
  await page.waitForTimeout(200);
}

test("the scroll stroke is decorative", async ({ page }) => {
  await page.goto("/");
  const stroke = page.locator("#work .scroll-stroke");
  await expect(stroke).toHaveAttribute("aria-hidden", "true");
  await expect(stroke).toHaveAttribute("focusable", "false");
});

test("the scroll stroke draws as the reader moves through Selected work", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "the margin column exists on wide screens only");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");

  await expect(page.locator(".scroll-stroke")).toBeVisible();
  await scrollThroughWork(page, 0.2);
  const early = await strokeOffset(page);
  await scrollThroughWork(page, 0.8);
  const late = await strokeOffset(page);

  expect(early).toBeGreaterThan(late);
  expect(late).toBeGreaterThanOrEqual(0);
});

test("with reduced motion the stroke is fully drawn and still", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "the margin column exists on wide screens only");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  await scrollThroughWork(page, 0.2);
  expect(await strokeOffset(page)).toBe(0);
  await scrollThroughWork(page, 0.8);
  expect(await strokeOffset(page)).toBe(0);
});

test("the scroll stroke is not shown on phones", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "small-screen behaviour");
  await page.goto("/");
  await expect(page.locator(".scroll-stroke")).toBeHidden();
});

test("the footer credits Skiper UI", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("contentinfo").getByRole("link", { name: "Skiper UI" }),
  ).toHaveAttribute("href", "https://skiper-ui.com");
});
