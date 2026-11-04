import { expect, test } from "@playwright/test";
import { rawFacts } from "../../src/content/facts";

const PHONE_PATTERN = /(?<!\d)(?:\+?91[\s-]?)?[6-9]\d{9}(?!\d)/;

test("the home page has share metadata and a canonical link", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    "content",
    `${rawFacts.identity.name}, ${rawFacts.identity.role}`,
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /\/og\.png$/);
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    "content",
    "summary_large_image",
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
});

test("Person JSON-LD names the profiles and nothing private", async ({ page }) => {
  await page.goto("/");
  const json = await page.locator('script[type="application/ld+json"]').textContent();
  const person = JSON.parse(json ?? "{}") as Record<string, unknown>;
  expect(person).toMatchObject({
    "@type": "Person",
    name: rawFacts.identity.name,
    jobTitle: rawFacts.identity.role,
    sameAs: [rawFacts.identity.linkedin, rawFacts.identity.github],
  });
  expect(json).not.toContain(rawFacts.identity.email);
  expect(json).not.toMatch(PHONE_PATTERN);
  expect(Object.keys(person).sort()).toEqual([
    "@context",
    "@type",
    "jobTitle",
    "name",
    "sameAs",
    "url",
  ]);
});

test("every case study has its own share image", async ({ request }) => {
  for (const project of rawFacts.projects) {
    const response = await request.get(`/work/${project.slug}/og.png`);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toBe("image/png");
  }
});

test("robots.txt keeps the design page out and points at the sitemap", async ({ request }) => {
  const body = await (await request.get("/robots.txt")).text();
  expect(body).toContain("Disallow: /design");
  expect(body).toMatch(/Sitemap: .+\/sitemap\.xml/);
});

test("the sitemap lists the home page and every case study, not /design", async ({ request }) => {
  const body = await (await request.get("/sitemap.xml")).text();
  for (const project of rawFacts.projects) expect(body).toContain(`/work/${project.slug}/</loc>`);
  expect(body).not.toContain("/design");
});

test("/resume forwards to the résumé, or to LinkedIn until it exists", async ({ request }) => {
  // No server-side redirects on GitHub Pages: a static page refreshes and links instead.
  const html = await (await request.get("/resume/")).text();
  const destination = rawFacts.identity.resume.endsWith(".pdf")
    ? rawFacts.identity.resume
    : rawFacts.identity.linkedin;
  expect(html).toContain(`<meta http-equiv="refresh" content="0; url=${destination}"`);
  expect(html).toContain(`href="${destination}"`);
});

test("unknown pages show the custom 404 with a way back", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "There is no page at this address.",
  );
  await expect(page).toHaveTitle(/Page not found/);
  await page.getByRole("link", { name: "Go to the home page" }).click();
  await expect(page).toHaveURL(/\/$/);
});
