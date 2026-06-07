import { describe, it, expect } from "vitest";
import { slugify } from "@/lib/utils/slugify";
import { formatPrice, formatPriceCompact } from "@/lib/utils/formatPrice";
import { findPromoByCode, PROMOS } from "@/lib/checkout/promos";
import { calculateTax } from "@/lib/checkout/tax";

describe("slugify", () => {
  it("lowercases and replaces spaces with hyphens", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });
  it("removes special characters", () => {
    expect(slugify("Hello, World!")).toBe("hello-world");
  });
  it("collapses repeated separators", () => {
    expect(slugify("hello   world___foo")).toBe("hello-world-foo");
  });
  it("trims leading and trailing hyphens", () => {
    expect(slugify("--hello--")).toBe("hello");
  });
});

describe("formatPrice", () => {
  it("formats USD with 2 fraction digits", () => {
    expect(formatPrice(49.99)).toBe("$49.99");
  });
  it("formats zero", () => {
    expect(formatPrice(0)).toBe("$0.00");
  });
  it("formats compact (no fraction digits)", () => {
    expect(formatPriceCompact(49.99)).toBe("$50");
  });
});

describe("promos", () => {
  it("finds a known code case-insensitively", () => {
    expect(findPromoByCode("edit10")?.code).toBe("EDIT10");
  });
  it("trims whitespace", () => {
    expect(findPromoByCode("  FREESHIP  ")?.code).toBe("FREESHIP");
  });
  it("returns null for unknown codes", () => {
    expect(findPromoByCode("NOPE")).toBeNull();
  });
  it("has percent and shipping types", () => {
    const types = new Set(Object.values(PROMOS).map((p) => p.type));
    expect(types.has("percent")).toBe(true);
    expect(types.has("shipping")).toBe(true);
  });
});

describe("calculateTax", () => {
  it("applies a flat 8% rate", () => {
    expect(calculateTax(100)).toBe(8);
  });
  it("returns 0 for negative amounts", () => {
    expect(calculateTax(-10)).toBe(0);
  });
});
