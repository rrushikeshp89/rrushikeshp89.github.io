import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { rawFacts } from "../../src/content/facts";

const EMAIL = rawFacts.identity.email;
const MAILTO = `mailto:${EMAIL}`;

const emailMe = (page: Page) =>
  page.locator("section[aria-labelledby=hero-title]").getByRole("link", { name: "Email me" });

async function openPanel(page: Page) {
  await emailMe(page).click();
  const panel = page.getByRole("dialog", { name: `Email ${EMAIL}` });
  await expect(panel).toBeVisible();
  // Let the 160 ms entrance animation finish before clicking inside it.
  await panel.evaluate((node) => Promise.all(node.getAnimations().map((a) => a.finished)));
  return panel;
}

test.describe("Email me", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("stays a real mailto link, so it works without JavaScript", async ({ page }) => {
    await expect(emailMe(page)).toHaveAttribute("href", MAILTO);
    await expect(emailMe(page)).toHaveAttribute("aria-haspopup", "dialog");
  });

  test("opens a panel with every way to write", async ({ page }) => {
    const panel = await openPanel(page);
    await expect(panel.getByRole("button", { name: "Copy email address" })).toBeVisible();
    await expect(panel.getByRole("link", { name: /Write in Gmail/ })).toHaveAttribute(
      "href",
      `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(EMAIL)}`,
    );
    await expect(panel.getByRole("link", { name: /Write in Outlook\.com/ })).toHaveAttribute(
      "href",
      `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(EMAIL)}`,
    );
    await expect(panel.getByRole("link", { name: "Open my mail app" })).toHaveAttribute(
      "href",
      MAILTO,
    );
    for (const name of [/Write in Gmail/, /Write in Outlook\.com/]) {
      await expect(panel.getByRole("link", { name })).toHaveAttribute("target", "_blank");
      await expect(panel.getByRole("link", { name })).toHaveAttribute("rel", "noopener noreferrer");
    }
  });

  test("copies the address and says so", async ({ page, context, browserName }) => {
    test.skip(browserName !== "chromium", "clipboard permissions are Chromium-specific");
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    const panel = await openPanel(page);
    await panel.getByRole("button", { name: "Copy email address" }).click();
    await expect(panel.getByRole("status")).toHaveText(`Copied ${EMAIL}`);
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(EMAIL);
  });

  test("closes with Esc and returns focus to Email me", async ({ page }) => {
    await emailMe(page).focus();
    await page.keyboard.press("Enter");
    const panel = page.getByRole("dialog", { name: `Email ${EMAIL}` });
    await expect(panel).toBeVisible();
    expect(await panel.evaluate((node) => node.contains(document.activeElement))).toBe(true);
    await page.keyboard.press("Escape");
    await expect(panel).toHaveCount(0);
    await expect(emailMe(page)).toBeFocused();
  });

  test("the Contact address opens the same panel", async ({ page }) => {
    await page.locator("#contact").getByRole("link", { name: EMAIL }).click();
    await expect(page.getByRole("dialog", { name: `Email ${EMAIL}` })).toBeVisible();
  });

  test("the open panel has no axe violations", async ({ page }) => {
    await openPanel(page);
    const { violations } = await new AxeBuilder({ page }).include("dialog").analyze();
    expect(violations).toEqual([]);
  });
});
