import { expect, test } from "@playwright/test";
import { rawFacts } from "../../src/content/facts";
import { TODO_CONFIRM } from "../../src/content/schema";

const PHONE_PATTERN = /(?<!\d)(?:\+?91[\s-]?)?[6-9]\d{9}(?!\d)/;

test("the résumé document is generated from facts.ts and holds nothing private", async ({
  page,
}) => {
  await page.goto("/resume/document/");
  const text = await page.locator("article").innerText();
  expect(text).toContain(rawFacts.identity.name);
  expect(text).toContain(rawFacts.identity.email);
  for (const project of rawFacts.projects) expect(text).toContain(project.name);
  expect(text).not.toMatch(PHONE_PATTERN);
  expect(await page.content()).not.toContain(TODO_CONFIRM);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});

test("the résumé PDF is published next to the site", async ({ request }) => {
  const response = await request.get(rawFacts.identity.resume);
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toBe("application/pdf");
  expect((await response.body()).subarray(0, 5).toString()).toBe("%PDF-");
});

test("the header and Contact section link to the résumé PDF", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.locator("#contact").getByRole("link", { name: "Download résumé (PDF)" }),
  ).toHaveAttribute("href", rawFacts.identity.resume);
  const headerLink = page.getByRole("banner").getByRole("link", { name: "Résumé" });
  if (await headerLink.isVisible())
    await expect(headerLink).toHaveAttribute("href", rawFacts.identity.resume);
});
