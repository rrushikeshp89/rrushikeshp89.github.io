import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { COLOR_SCHEMES, ROUTES } from "./routes";

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"];

for (const route of ROUTES) {
  for (const colorScheme of COLOR_SCHEMES) {
    test(`${route} has no axe violations in ${colorScheme} theme`, async ({ page }) => {
      await page.emulateMedia({ colorScheme });
      await page.goto(route);
      const { violations } = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
      expect(violations).toEqual([]);
    });
  }
}
