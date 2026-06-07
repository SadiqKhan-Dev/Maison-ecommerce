import { describe, it, expect } from "vitest";
import { searchProducts, getPopularSuggestions } from "@/lib/search/search";
import type { Product } from "@/types/product";

const make = (overrides: Partial<Product>): Product => ({
  id: "p",
  slug: "p",
  name: "P",
  description: "Desc",
  brand: "Maison Noir",
  category: "MEN",
  subCategory: "Tops",
  images: [],
  variants: [],
  basePrice: 100,
  rating: 4.5,
  reviewCount: 10,
  createdAt: "2025-01-01",
  tags: [],
  ...overrides,
});

const products: Product[] = [
  make({ id: "1", name: "Merino Wool Overcoat", brand: "Maison Noir", subCategory: "Outerwear", tags: ["wool", "tailored"], description: "Italian merino wool" }),
  make({ id: "2", name: "Cotton Oxford Shirt", brand: "Maison Noir", subCategory: "Tops", tags: ["essentials", "cotton"], description: "Egyptian cotton" }),
  make({ id: "3", name: "Cashmere Crew Sweater", brand: "Atelier Lumen", subCategory: "Knitwear", tags: ["cashmere"], description: "Mongolian cashmere" }),
];

describe("searchProducts", () => {
  it("returns empty for blank queries", () => {
    expect(searchProducts("", products)).toEqual([]);
    expect(searchProducts("   ", products)).toEqual([]);
  });

  it("finds by name", () => {
    const results = searchProducts("overcoat", products);
    expect(results[0]?.product.id).toBe("1");
  });

  it("finds by brand", () => {
    const results = searchProducts("atelier", products);
    expect(results.some((r) => r.product.id === "3")).toBe(true);
  });

  it("finds by tag", () => {
    const results = searchProducts("cashmere", products);
    expect(results[0]?.product.id).toBe("3");
  });

  it("respects the limit", () => {
    expect(searchProducts("wool", products, 1)).toHaveLength(1);
  });

  it("ranks more-specific matches first", () => {
    // "wool" matches in name, brand, description
    const results = searchProducts("wool", products);
    expect(results[0]?.product.id).toBe("1");
  });

  it("ranks ties by reviewCount descending", () => {
    // All three contain "Maison" in brand. Adjust review counts.
    const ranked = [
      make({ id: "x1", name: "X Maison", brand: "Foo", reviewCount: 10 }),
      make({ id: "x2", name: "Y Maison", brand: "Bar", reviewCount: 30 }),
    ];
    const results = searchProducts("Maison", ranked);
    expect(results[0]?.product.id).toBe("x2");
  });
});

describe("getPopularSuggestions", () => {
  it("returns a non-empty list of suggestions", () => {
    const s = getPopularSuggestions();
    expect(s.length).toBeGreaterThan(0);
    expect(s.every((x) => x.label && x.href)).toBe(true);
  });
});
