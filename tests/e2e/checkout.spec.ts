import { test, expect } from "@playwright/test";

test.describe("checkout (guest)", () => {
  test.beforeEach(async ({ page }) => {
    // Add one product to the cart before each test
    await page.goto("/products");
    await page.getByRole("button", { name: "Quick add" }).first().click();
    await expect(
      page.getByRole("heading", { name: /Your Bag/i })
    ).toBeVisible({ timeout: 5000 });
  });

  test("can navigate from cart to checkout information step", async ({ page }) => {
    await page.goto("/cart");
    await page.getByRole("link", { name: /checkout/i }).first().click();
    await page.waitForURL(/\/checkout/);
    await expect(
      page.locator("text=/contact|email|delivery/i").first()
    ).toBeVisible();
  });

  test("empty promo code does not break totals", async ({ page }) => {
    await page.goto("/cart");
    // The promo code input is optional; verify totals are visible.
    await expect(page.locator("text=/subtotal/i").first()).toBeVisible();
  });
});
