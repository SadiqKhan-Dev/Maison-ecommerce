import { test, expect } from "@playwright/test";

test.describe("search", () => {
  test("Cmd+K opens the search overlay and finds a product", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("ControlOrMeta+k");
    const input = page.locator('input[placeholder*="Search"]').first();
    await input.fill("overcoat");
    await expect(page.locator("text=Merino Wool Overcoat").first()).toBeVisible({
      timeout: 5000,
    });
  });

  test("PLP search filters results", async ({ page }) => {
    await page.goto("/products?q=cashmere");
    await expect(page.locator("h1", { hasText: "Search results" })).toBeVisible();
    await expect(
      page.locator("a[href^='/products/']").first()
    ).toBeVisible();
  });
});
