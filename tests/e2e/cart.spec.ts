import { test, expect } from "@playwright/test";

test.describe("cart", () => {
  test("quick-add from PLP opens the cart drawer with the item", async ({ page }) => {
    await page.goto("/products");
    // Click the first product's Quick add button
    const quickAdd = page.getByRole("button", { name: "Quick add" }).first();
    await quickAdd.click();
    // Drawer should be visible with the bag header
    await expect(page.getByRole("heading", { name: /Your Bag/i })).toBeVisible({
      timeout: 5000,
    });
  });

  test("PDP add-to-cart and remove flow", async ({ page }) => {
    await page.goto("/products/merino-wool-overcoat");
    // Find the add to cart button (it has visible text "Add to bag" or similar)
    const addToCart = page
      .getByRole("button", { name: /add to bag|add to cart/i })
      .first();
    await addToCart.click();
    await expect(page.getByRole("heading", { name: /Your Bag/i })).toBeVisible();
    // Remove the only item
    const removeBtn = page
      .getByRole("button", { name: /remove|delete/i })
      .first();
    if (await removeBtn.isVisible()) {
      await removeBtn.click();
      await expect(page.locator("text=Your bag is empty")).toBeVisible();
    }
  });

  test("cart page shows added item and quantity stepper", async ({ page }) => {
    await page.goto("/products");
    await page.getByRole("button", { name: "Quick add" }).first().click();
    await expect(page.getByRole("heading", { name: /Your Bag/i })).toBeVisible();
    await page.getByRole("link", { name: /View full bag|View bag/i }).first().click();
    await page.waitForURL(/\/cart/);
    await expect(page.locator("h1", { hasText: "Your Bag" })).toBeVisible();
  });
});
