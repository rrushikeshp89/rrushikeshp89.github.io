import { expect, test } from "@playwright/test";
import { rawFacts } from "../../src/content/facts";
import { TODO_CONFIRM } from "../../src/content/schema";

const FACTS_TEXT = JSON.stringify(rawFacts);
const NUMBER_TOKEN = /\d+(?:[.,]\d+)*/g;

for (const project of rawFacts.projects) {
  test.describe(`${project.name} case study`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/work/${project.slug}`);
    });

    test("has its sections in order and a descriptive title", async ({ page }) => {
      await expect(page).toHaveTitle(new RegExp(`${project.name} case study`));
      await expect(page.locator("h1")).toHaveText(project.name);
      const sections = await page.locator("main section h2").allInnerTexts();
      expect(sections).toEqual([
        "The problem",
        "Architecture",
        "Key decisions",
        "Proof",
        "What it doesn’t do yet",
      ]);
    });

    test("draws the architecture as an ordered list of layers", async ({ page }) => {
      const layers = page.getByRole("list", { name: /top to bottom/ }).locator(":scope > li");
      await expect(layers).toHaveCount(project.caseStudy.diagram.layers.length);
      await expect(page.locator("figure figcaption")).toHaveText(
        project.caseStudy.diagram.description,
      );
    });

    test("links every proof claim to the repository", async ({ page }) => {
      for (const item of project.caseStudy.proof) {
        await expect(
          page.getByRole("link", { name: `${item.label} in the ${project.name} repository` }),
        ).toHaveAttribute("href", item.href);
      }
    });

    test("states its limitations and shows only sourced numbers", async ({ page }) => {
      for (const limitation of project.limitations) {
        await expect(page.locator(`#${project.slug}-limitations`)).toContainText(limitation);
      }
      const text = await page.locator("main").innerText();
      const unsourced = [...new Set(text.match(NUMBER_TOKEN) ?? [])].filter(
        (value) => !FACTS_TEXT.includes(value),
      );
      expect(unsourced).toEqual([]);
      expect(await page.content()).not.toContain(TODO_CONFIRM);
    });
  });
}

test("each home-page card opens its case study", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Case study for LeadHub CRM" }).click();
  await expect(page).toHaveURL(/\/work\/leadhub-crm$/);
  // Visited routes stay in the DOM but hidden, so ask for the visible level-1 heading.
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("LeadHub CRM");
});

test("after client-side navigation the skip link reaches the visible page", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Case study for Grove HRMS" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Grove HRMS");

  await page.getByRole("link", { name: "Skip to content" }).focus();
  await page.keyboard.press("Enter");
  const focusedMain = await page.evaluate(() => {
    const active = document.activeElement;
    return active?.tagName === "MAIN" && active.checkVisibility()
      ? active.querySelector("h1")?.textContent
      : null;
  });
  expect(focusedMain).toBe("Grove HRMS");
});

test("case studies link onward to the next one", async ({ page }) => {
  await page.goto("/work/grove-hrms");
  const next = page.getByRole("navigation", { name: "More case studies" }).getByRole("link");
  await expect(next).toHaveText("LeadHub CRM");
});

test("after moving between case studies, each diagram keeps its own name", async ({ page }) => {
  await page.goto("/work/grove-hrms");
  await page
    .getByRole("navigation", { name: "More case studies" })
    .getByRole("link", { name: "LeadHub CRM" })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("LeadHub CRM");
  await expect(page.getByRole("figure")).toHaveAccessibleName("How LeadHub is put together");
  const ids = await page.evaluate(() => {
    const all = [...document.querySelectorAll("[id]")].map((node) => node.id);
    return all.filter((id, index) => all.indexOf(id) !== index);
  });
  // Only the shared layout landmark may repeat (the skip link handles it, ADR-025).
  expect(ids.filter((id) => id !== "main")).toEqual([]);
});

test("an unknown case study returns 404", async ({ page }) => {
  const response = await page.goto("/work/not-a-project");
  expect(response?.status()).toBe(404);
});
