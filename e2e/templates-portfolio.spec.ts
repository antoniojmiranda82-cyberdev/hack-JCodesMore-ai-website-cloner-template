import { expect, test } from "@playwright/test";

test("portfolio opens benchmark detail", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Templates Portfolio" })).toBeVisible();
  await page.getByRole("link", { name: /AI Template Design/i }).first().click();
  await expect(page.getByRole("heading", { name: "AI Template Design" })).toBeVisible();
  await expect(page.getByText(/Commercialization Readiness/i)).toBeVisible();
});
