import { describe, it, expect } from "vitest";
import {
  applyFilters,
  applySort,
  getAvailableColors,
  getAvailableSizes,
  getBrands,
  getSubCategories,
  getPriceRange,
  paginate,
  parseFilters,
  DEFAULT_FILTERS,
} from "@/lib/utils/filterProducts";
import type { Product } from "@/types/product";

const make = (overrides: Partial<Product> = {}): Product => ({
  id: "p",
  slug: "p",
  name: "P",
  description: "Desc",
  brand: "Maison Noir",
  category: "MEN",
  subCategory: "Tops",
  images: ["https://example.com/x.jpg"],
  variants: [
    { id: "1", size: "M", color: "Black", colorHex: "#000", sku: "1", stock: 5 },
  ],
  basePrice: 100,
  rating: 4.5,
  reviewCount: 10,
  createdAt: "2025-01-01",
  tags: [],
  ...overrides,
});

describe("filterProducts", () => {
  const products: Product[] = [
    make({ id: "1", name: "Coat", brand: "Atelier Lumen", category: "WOMEN", subCategory: "Outerwear", basePrice: 400, salePrice: 300, rating: 4.8, reviewCount: 100, isBestseller: true }),
    make({ id: "2", name: "Shirt", brand: "Maison Noir", category: "MEN", subCategory: "Tops", basePrice: 80, rating: 4.0, reviewCount: 50, isNew: true }),
    make({ id: "3", name: "Sneakers", brand: "Northbound", category: "MEN", subCategory: "Footwear", basePrice: 200, rating: 4.5, reviewCount: 30 }),
  ];

  describe("applyFilters", () => {
    it("returns all when no filters set", () => {
      const result = applyFilters(products, { ...DEFAULT_FILTERS });
      expect(result).toHaveLength(3);
    });

    it("filters by category", () => {
      const result = applyFilters(products, { ...DEFAULT_FILTERS, category: "MEN" });
      expect(result.map((p) => p.id)).toEqual(["2", "3"]);
    });

    it("filters by subCategory", () => {
      const result = applyFilters(products, { ...DEFAULT_FILTERS, subCategories: ["Outerwear"] });
      expect(result.map((p) => p.id)).toEqual(["1"]);
    });

    it("filters by brand", () => {
      const result = applyFilters(products, { ...DEFAULT_FILTERS, brands: ["Northbound"] });
      expect(result.map((p) => p.id)).toEqual(["3"]);
    });

    it("filters by sale only", () => {
      const result = applyFilters(products, { ...DEFAULT_FILTERS, onSaleOnly: true });
      expect(result.map((p) => p.id)).toEqual(["1"]);
    });

    it("filters by price range using sale price when set", () => {
      // p1 is on sale (300) — falls in 200-350
      // p3 basePrice is 200, also falls in 200-350
      const result = applyFilters(products, { ...DEFAULT_FILTERS, minPrice: 200, maxPrice: 350 });
      expect(result.map((p) => p.id)).toEqual(["1", "3"]);
    });

    it("filters by minimum rating", () => {
      const result = applyFilters(products, { ...DEFAULT_FILTERS, minRating: 4.5 });
      expect(result.map((p) => p.id)).toEqual(["1", "3"]);
    });

    it("filters by size with stock", () => {
      const result = applyFilters(products, { ...DEFAULT_FILTERS, sizes: ["M"] });
      expect(result.length).toBe(3); // all have M in stock
    });
  });

  describe("applySort", () => {
    it("sorts by price ascending", () => {
      const sorted = applySort(products, "price_asc");
      expect(sorted.map((p) => p.id)).toEqual(["2", "3", "1"]);
    });
    it("sorts by price descending", () => {
      const sorted = applySort(products, "price_desc");
      expect(sorted.map((p) => p.id)).toEqual(["1", "3", "2"]);
    });
    it("sorts by rating", () => {
      const sorted = applySort(products, "rating");
      expect(sorted[0].id).toBe("1");
    });
    it("sorts by popularity (reviewCount)", () => {
      const sorted = applySort(products, "popular");
      expect(sorted.map((p) => p.id)).toEqual(["1", "2", "3"]);
    });
    it("does not mutate the input", () => {
      const before = [...products];
      applySort(products, "price_asc");
      expect(products).toEqual(before);
    });
  });

  describe("paginate", () => {
    it("returns first page items", () => {
      const r = paginate(products, 1, 2);
      expect(r.items).toHaveLength(2);
      expect(r.totalPages).toBe(2);
      expect(r.page).toBe(1);
    });
    it("clamps page to valid range", () => {
      const r = paginate(products, 99, 2);
      expect(r.page).toBe(2);
      expect(r.items).toHaveLength(1);
    });
    it("returns empty page for empty list", () => {
      const r = paginate([], 1, 10);
      expect(r.totalPages).toBe(1);
      expect(r.items).toHaveLength(0);
    });
  });

  describe("parseFilters", () => {
    it("parses comma-separated values", () => {
      const sp = new URLSearchParams("sub=Outerwear,Tops&brand=Maison%20Noir");
      const f = parseFilters(sp);
      expect(f.subCategories).toEqual(["Outerwear", "Tops"]);
      expect(f.brands).toEqual(["Maison Noir"]);
    });
    it("parses category", () => {
      expect(parseFilters(new URLSearchParams("category=MEN")).category).toBe("MEN");
      expect(parseFilters(new URLSearchParams("category=BAD")).category).toBeUndefined();
    });
    it("parses booleans", () => {
      expect(parseFilters(new URLSearchParams("inStock=true")).inStockOnly).toBe(true);
      expect(parseFilters(new URLSearchParams("onSale=true")).onSaleOnly).toBe(true);
    });
    it("clamps page to >= 1", () => {
      expect(parseFilters(new URLSearchParams("page=-5")).page).toBe(1);
    });
  });

  describe("aggregates", () => {
    it("getPriceRange uses sale price when present", () => {
      const [min, max] = getPriceRange(products);
      expect(min).toBe(80);
      // 300 is the sale price of p1, not 400 (base price)
      expect(max).toBe(300);
    });
    it("getBrands returns sorted unique list", () => {
      expect(getBrands(products)).toEqual([
        "Atelier Lumen",
        "Maison Noir",
        "Northbound",
      ]);
    });
    it("getSubCategories returns sorted unique list", () => {
      expect(getSubCategories(products)).toEqual([
        "Footwear",
        "Outerwear",
        "Tops",
      ]);
    });
    it("getAvailableColors dedupes by name", () => {
      const colors = getAvailableColors(products);
      expect(colors.find((c) => c.name === "Black")).toBeDefined();
    });
    it("getAvailableSizes returns only in-stock sizes", () => {
      const sizes = getAvailableSizes(products);
      expect(sizes).toContain("M");
    });
  });
});
