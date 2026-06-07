import { test, expect } from "@playwright/test";

test.describe("auth", () => {
  test("unauthenticated /account redirects to login with callbackUrl", async ({ page }) => {
    await page.context().clearCookies();
    await page.goto("/account");
    await expect(page).toHaveURL(/\/auth\/login.*callbackUrl/);
  });

  test("login with demo credentials lands on /account", async ({ page }) => {
    await page.context().clearCookies();
    await page.goto("/auth/login");
    await page.locator('input[type="email"]').fill("demo@maison.com");
    await page.locator('input[type="password"]').fill("maison123");
    await page.getByRole("button", { name: /sign in/i }).first().click();
    await page.waitForURL(/\/account(?:\/?$|\?)/, { timeout: 10_000 });
    await expect(page.locator("text=Hi, Demo").first()).toBeVisible();
  });

  test("invalid credentials show an error", async ({ page }) => {
    await page.context().clearCookies();
    await page.goto("/auth/login");
    await page.locator('input[type="email"]').fill("demo@maison.com");
    await page.locator('input[type="password"]').fill("wrongpassword");
    await page.getByRole("button", { name: /sign in/i }).first().click();
    await expect(
      page.locator("text=/invalid|incorrect|wrong|credentials/i").first()
    ).toBeVisible({ timeout: 10_000 });
  });

  test("logout from account sidebar returns to home", async ({ page }) => {
    // Sign in first
    await page.context().clearCookies();
    await page.goto("/auth/login");
    await page.locator('input[type="email"]').fill("demo@maison.com");
    await page.locator('input[type="password"]').fill("maison123");
    await page.getByRole("button", { name: /sign in/i }).first().click();
    await page.waitForURL(/\/account(?:\/?$|\?)/, { timeout: 10_000 });

    // Open user menu, click Sign out
    await page.getByRole("button", { name: /open user menu|account/i }).first().click().catch(() => {});
    const signOut = page.getByRole("button", { name: /sign out|log out/i }).first();
    if (await signOut.isVisible()) {
      await signOut.click();
      await page.waitForURL(/\/$|login/);
    }
  });
});
