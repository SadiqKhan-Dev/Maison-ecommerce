import { test, expect } from "@playwright/test";

test.describe("smoke", () => {
  test("homepage renders and shows the brand", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Maison/);
    await expect(page.locator("text=MAISON").first()).toBeVisible();
    await expect(page.locator("text=Shop Women").first()).toBeVisible();
    await expect(page.locator("text=Shop Men").first()).toBeVisible();
  });

  test("PLP renders products and exposes filters", async ({ page }) => {
    await page.goto("/products");
    await expect(page.locator("h1", { hasText: "All Products" })).toBeVisible();
    await expect(
      page.locator("a[href^='/products/']").first()
    ).toBeVisible();
  });

  test("PDP renders price, brand, and reviews section", async ({ page }) => {
    await page.goto("/products/merino-wool-overcoat");
    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page.locator("text=/\\$\\d/").first()).toBeVisible();
    await expect(page.locator("#reviews")).toBeVisible();
  });

  test("collections index and detail pages render", async ({ page }) => {
    await page.goto("/collections");
    await expect(page.locator("h1").first()).toBeVisible();

    await page.goto("/collections/quiet-tailoring");
    await expect(page.locator("h1").first()).toBeVisible();
  });

  test("sale page renders", async ({ page }) => {
    await page.goto("/sale");
    await expect(page.locator("h1").first()).toBeVisible();
  });

  test("404 page renders on unknown route", async ({ page }) => {
    const res = await page.goto("/this-does-not-exist");
    expect(res?.status()).toBe(404);
    await expect(page.locator("text=404")).toBeVisible();
  });

  test("sitemap.xml is reachable and well-formed", async ({ request }) => {
    const res = await request.get("/sitemap.xml");
    expect(res.status()).toBe(200);
    const xml = await res.text();
    expect(xml).toContain("<urlset");
    expect(xml).toContain("/products/merino-wool-overcoat");
  });

  test("robots.txt disallows /account, /checkout, /api", async ({ request }) => {
    const res = await request.get("/robots.txt");
    expect(res.status()).toBe(200);
    const text = await res.text();
    expect(text).toContain("Disallow: /account");
    expect(text).toContain("Disallow: /checkout");
    expect(text).toContain("Disallow: /api");
    expect(text).toContain("Sitemap:");
  });
});
