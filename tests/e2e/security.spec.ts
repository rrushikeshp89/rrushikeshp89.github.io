import { expect, test } from "@playwright/test";

/** GitHub Pages cannot send headers, so the policy ships as a meta tag (ADR-029). */
test("every page carries the Content-Security-Policy meta tag", async ({ page }) => {
  for (const path of ["/", "/work/grove-hrms/", "/design/", "/this-page-does-not-exist"]) {
    await page.goto(path);
    const policy = await page
      .locator('meta[http-equiv="Content-Security-Policy"]')
      .getAttribute("content");
    expect(policy, path).toContain("default-src 'self'");
    expect(policy, path).toContain("object-src 'none'");
    expect(policy, path).toContain("base-uri 'self'");
    expect(policy, path).not.toContain("unsafe-eval");
    await expect(page.locator('meta[name="referrer"]')).toHaveAttribute(
      "content",
      "strict-origin-when-cross-origin",
    );
  }
});

test("the policy blocks a script from another origin", async ({ page }) => {
  await page.goto("/");
  const blocked = await page.evaluate(
    () =>
      new Promise<boolean>((done) => {
        const script = document.createElement("script");
        script.src = "https://example.com/injected.js";
        script.onerror = () => done(true);
        script.onload = () => done(false);
        document.head.append(script);
      }),
  );
  expect(blocked).toBe(true);
});

test("the page loads and hydrates without CSP violations", async ({ page }) => {
  const violations: string[] = [];
  page.on("console", (message) => {
    if (message.text().includes("Content Security Policy")) violations.push(message.text());
  });
  await page.addInitScript(() => {
    document.addEventListener("securitypolicyviolation", (event) => {
      console.error(
        `Content Security Policy violation: ${event.violatedDirective} ${event.blockedURI}`,
      );
    });
  });

  await page.goto("/");
  await page.waitForLoadState("networkidle");

  expect(violations).toEqual([]);
});
