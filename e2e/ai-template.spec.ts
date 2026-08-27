import { expect, test } from "@playwright/test";

const chapters = [
  "The Approach",
  "The Threshold",
  "The Inner Ward",
  "The Keep",
  "The Watch",
];

test("renders the complete cinematic AI template journey", async ({ page }) => {
  await page.goto("/showcase/ai-template");

  await expect(page.locator("[data-ai-template]")).toBeVisible();
  await expect(page.locator("#ai-template-canvas")).toBeAttached();

  for (const title of chapters) {
    await expect(page.getByRole("heading", { name: title })).toBeAttached();
  }

  await expect(page.getByRole("link", { name: "Enter the platform" })).toBeAttached();
  await page.locator("#watch").scrollIntoViewIfNeeded();
  await expect(page.getByRole("heading", { name: "The Watch" })).toBeVisible();
});

test("keeps all chapter content readable with reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/showcase/ai-template");

  for (const title of chapters) {
    await expect(page.getByRole("heading", { name: title })).toBeAttached();
  }
});
