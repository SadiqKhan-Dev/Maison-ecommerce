import { describe, it, expect } from "vitest";
import {
  SHIPPING_METHODS,
  estimateShipping,
  qualifiesForFreeShipping,
  getShippingMethod,
  getShippingMethodOrUndefined,
  formatEta,
  estimatedDeliveryDate,
  FREE_SHIPPING_THRESHOLD,
} from "@/lib/checkout/shipping";

describe("shipping", () => {
  it("exposes the expected methods", () => {
    const ids = SHIPPING_METHODS.map((m) => m.id);
    expect(ids).toEqual(["standard", "express", "white-glove"]);
  });

  describe("qualifiesForFreeShipping", () => {
    it("is true at threshold", () => {
      expect(qualifiesForFreeShipping(FREE_SHIPPING_THRESHOLD)).toBe(true);
    });
    it("is false below threshold", () => {
      expect(qualifiesForFreeShipping(FREE_SHIPPING_THRESHOLD - 0.01)).toBe(
        false
      );
    });
  });

  describe("estimateShipping", () => {
    it("is free when subtotal meets threshold", () => {
      const e = estimateShipping(FREE_SHIPPING_THRESHOLD, "standard");
      expect(e.free).toBe(true);
      expect(e.amount).toBe(0);
      expect(e.method?.id).toBe("standard");
    });

    it("uses the chosen method when below threshold", () => {
      const e = estimateShipping(20, "express");
      expect(e.free).toBe(false);
      expect(e.amount).toBe(19.99);
      expect(e.method?.id).toBe("express");
    });

    it("falls back to standard when methodId is null/undefined", () => {
      const e = estimateShipping(20, null);
      expect(e.method?.id).toBe("standard");
    });

    it("is free when a free-shipping promo is active regardless of subtotal", () => {
      const e = estimateShipping(20, "standard", true);
      expect(e.free).toBe(true);
      expect(e.amount).toBe(0);
    });
  });

  describe("getShippingMethod", () => {
    it("returns the matching method", () => {
      expect(getShippingMethod("express").id).toBe("express");
    });
    it("returns standard for unknown id", () => {
      expect(getShippingMethod("unknown" as never).id).toBe("standard");
    });
  });

  describe("getShippingMethodOrUndefined", () => {
    it("returns undefined when id is falsy", () => {
      expect(getShippingMethodOrUndefined(null)).toBeUndefined();
      expect(getShippingMethodOrUndefined(undefined)).toBeUndefined();
    });
    it("returns undefined for unknown id", () => {
      expect(getShippingMethodOrUndefined("unknown" as never)).toBeUndefined();
    });
    it("returns the matching method for a known id", () => {
      expect(getShippingMethodOrUndefined("express")?.id).toBe("express");
    });
  });

  describe("formatEta", () => {
    it("uses plural when min != max", () => {
      expect(formatEta(SHIPPING_METHODS[0])).toBe("5–7 business days");
    });
    it("uses singular when min == max == 1", () => {
      expect(formatEta(SHIPPING_METHODS[2])).toBe("1 business day");
    });
  });

  describe("estimatedDeliveryDate", () => {
    it("returns a future date on a weekday", () => {
      const result = estimatedDeliveryDate(SHIPPING_METHODS[2]); // 1 day
      const today = new Date();
      expect(result.getTime()).toBeGreaterThan(today.getTime());
      const day = result.getDay();
      expect(day).not.toBe(0);
      expect(day).not.toBe(6);
    });

    it("skips weekends when computing multi-day delivery", () => {
      const result = estimatedDeliveryDate(SHIPPING_METHODS[0]); // 5–7 days
      const day = result.getDay();
      expect(day).not.toBe(0);
      expect(day).not.toBe(6);
    });
  });
});
