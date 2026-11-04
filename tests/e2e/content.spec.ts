import { expect, test } from "@playwright/test";
import { rawFacts } from "../../src/content/facts";
import { TODO_CONFIRM } from "../../src/content/schema";

const FACTS_TEXT = JSON.stringify(rawFacts);
const NUMBER_TOKEN = /\d+(?:[.,]\d+)*/g;
const PHONE_PATTERN = /(?<!\d)(?:\+?91[\s-]?)?[6-9]\d{9}(?!\d)/;

test.describe("home page content", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("every number on the page comes from facts.ts", async ({ page }) => {
    const text = await page.locator("body").innerText();
    const numbers = [...new Set(text.match(NUMBER_TOKEN) ?? [])];

    expect(numbers.length).toBeGreaterThan(0);
    const unsourced = numbers.filter((value) => !FACTS_TEXT.includes(value));
    expect(unsourced).toEqual([]);
  });

  test("shows no unconfirmed facts and no phone number", async ({ page }) => {
    const html = await page.content();
    expect(html).not.toContain(TODO_CONFIRM);
    expect(html).not.toMatch(PHONE_PATTERN);
    expect(html).not.toContain("tel:");
  });

  test("has exactly one h1 and the expected sections", async ({ page }) => {
    await expect(page.locator("h1")).toHaveCount(1);
    for (const id of ["work", "approach", "experience", "skills", "credentials", "contact"]) {
      await expect(page.locator(`section#${id}`)).toHaveCount(1);
    }
  });

  test("offers email as the contact path", async ({ page }) => {
    const mailto = `mailto:${rawFacts.identity.email}`;
    await expect(page.getByRole("link", { name: "Email me" })).toHaveAttribute("href", mailto);
    await expect(
      page.locator("#contact").getByRole("link", { name: rawFacts.identity.email }),
    ).toHaveAttribute("href", mailto);
  });

  test("external links are rel=noopener noreferrer", async ({ page }) => {
    const externalLinks = page.locator('a[href^="http"]');
    const count = await externalLinks.count();
    expect(count).toBeGreaterThan(0);
    for (let index = 0; index < count; index += 1) {
      await expect(externalLinks.nth(index)).toHaveAttribute("rel", "noopener noreferrer");
    }
  });

  test("project links have names that make sense out of context", async ({ page }) => {
    for (const project of rawFacts.projects) {
      await expect(
        page.getByRole("link", { name: `Source code for ${project.name}` }),
      ).toHaveAttribute("href", project.links[0]?.href ?? "");
    }
  });
});
