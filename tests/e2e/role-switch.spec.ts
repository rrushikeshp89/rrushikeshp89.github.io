import { expect, test, type Page } from "@playwright/test";

const demo = (page: Page) => page.getByRole("group", { name: "View the directory as" });
const table = (page: Page) => page.getByRole("region", { name: /Sample directory as seen by/ });

test.describe("Grove role switch", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("starts as Employee: own fields only, no offboarded people", async ({ page }) => {
    await expect(demo(page).getByRole("radio", { name: "Employee" })).toBeChecked();
    const asha = table(page).getByRole("row", { name: /Asha Rao/ });
    await expect(asha).toContainText("₹1,10,000");
    await expect(table(page).getByRole("row", { name: /Vikram Shah/ })).toContainText("Restricted");
    await expect(table(page).getByRole("row", { name: /Rohan Das/ })).toHaveCount(0);
    await expect(page.getByRole("status")).toHaveText(
      "As Employee: 4 of 5 people shown, 9 fields restricted.",
    );
  });

  test("Manager sees the team's leave but not the team's salary", async ({ page }) => {
    await demo(page).getByText("Manager").click();
    const asha = table(page).getByRole("row", { name: /Asha Rao/ });
    await expect(asha).toContainText("12 days");
    await expect(asha).toContainText("Restricted");
    await expect(page.getByRole("status")).toHaveText(
      "As Manager: 4 of 5 people shown, 8 fields restricted.",
    );
  });

  test("HR Admin sees everyone, including offboarded people, with nothing restricted", async ({
    page,
  }) => {
    await demo(page).getByText("HR Admin").click();
    await expect(table(page).getByRole("row", { name: /Rohan Das/ })).toBeVisible();
    await expect(table(page)).not.toContainText("Restricted");
    await expect(page.getByRole("status")).toHaveText(
      "As HR Admin: 5 of 5 people shown, nothing restricted.",
    );
  });

  test("works from the keyboard with arrow keys", async ({ page }) => {
    await demo(page).getByRole("radio", { name: "Employee" }).focus();
    await page.keyboard.press("ArrowRight");
    await expect(demo(page).getByRole("radio", { name: "Manager" })).toBeChecked();
    await page.keyboard.press("ArrowRight");
    await expect(demo(page).getByRole("radio", { name: "HR Admin" })).toBeChecked();
    await expect(table(page).getByRole("row", { name: /Rohan Das/ })).toBeVisible();
  });

  test("states that the data is illustrative and links to the real demo", async ({ page }) => {
    const card = page.locator("article[aria-labelledby=grove-hrms-title]");
    await expect(card).toContainText("Enforced on the server, not hidden in the UI.");
    await expect(card).toContainText("made-up people");
    await expect(
      card.getByRole("link", { name: "try the real permissions in the Grove HRMS live demo" }),
    ).toHaveAttribute("href", "https://hrms.fluentopsai.com");
  });
});
