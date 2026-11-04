import { expect, test } from "@playwright/test";

/** The decorative hero art: present on wide screens, absent on phones and for reduced motion. */
test("hero flow lines are decorative and hidden from assistive tech", async ({ page }) => {
  await page.goto("/");
  const art = page.locator("section[aria-labelledby=hero-title] .flow-lines");
  await expect(art).toHaveAttribute("aria-hidden", "true");
  await expect(art).toBeEmpty();
});

test("hero flow lines show on wide screens and load no script", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "wide-screen behaviour");
  const requests: string[] = [];
  page.on("request", (request) => requests.push(request.url()));

  await page.goto("/");
  const art = page.locator(".flow-lines");
  await expect(art).toBeVisible();
  expect(await art.evaluate((node) => getComputedStyle(node).maskImage)).toContain(
    "flow-lines.svg",
  );

  await page.waitForLoadState("networkidle");
  const artRequests = requests.filter((url) => url.includes("flow-lines"));
  expect(artRequests.every((url) => url.endsWith(".svg"))).toBe(true);
});

test("hero flow lines are off on phones", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "small-screen behaviour");
  const requests: string[] = [];
  page.on("request", (request) => requests.push(request.url()));

  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await expect(page.locator(".flow-lines")).toBeHidden();
  expect(requests.some((url) => url.includes("flow-lines.svg"))).toBe(false);
});

test("hero flow lines are off when reduced motion is requested", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".flow-lines")).toBeHidden();
});
