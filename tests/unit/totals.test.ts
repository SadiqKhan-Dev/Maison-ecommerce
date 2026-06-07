import { describe, it, expect } from "vitest";
import {
  computeCartTotals,
  computeCheckoutTotals,
  CHECKOUT_THRESHOLDS,
} from "@/lib/checkout/totals";
import type { CartItem } from "@/types/cart";

const item = (
  productId: string,
  price: number,
  quantity: number
): CartItem => ({
  id: `${productId}-v`,
  productId,
  variantId: `${productId}-v`,
  name: productId,
  brand: "Test",
  image: "",
  size: "M",
  color: "Black",
  colorHex: "#000",
  price,
  quantity,
});

describe("computeCartTotals", () => {
  it("returns subtotal/tax as zero for zero subtotal, but charges standard shipping", () => {
    const totals = computeCartTotals(0, null);
    expect(totals.subtotal).toBe(0);
    expect(totals.discount).toBe(0);
    expect(totals.tax).toBe(0);
    // 0 < 150 free-shipping threshold, so standard shipping is charged
    expect(totals.shipping).toBe(CHECKOUT_THRESHOLDS.standardShipping);
    expect(totals.total).toBe(CHECKOUT_THRESHOLDS.standardShipping);
  });

  it("applies percent discount to subtotal", () => {
    const totals = computeCartTotals(100, {
      type: "percent",
      value: 10,
      code: "X",
      label: "10% off",
    });
    expect(totals.discount).toBe(10);
    expect(totals.subtotal).toBe(100);
    const expectedTax = 90 * CHECKOUT_THRESHOLDS.taxRate;
    expect(totals.tax).toBeCloseTo(expectedTax, 2);
  });

  it("disqualifies free shipping when discount lowers subtotal below threshold", () => {
    // 100 * 0.9 = 90 < 150 threshold → shipping should be charged
    const totals = computeCartTotals(100, {
      type: "percent",
      value: 10,
      code: "X",
      label: "10% off",
    });
    expect(totals.shipping).toBe(CHECKOUT_THRESHOLDS.standardShipping);
  });

  it("grants free shipping when subtotal meets threshold", () => {
    const totals = computeCartTotals(150, null);
    expect(totals.shipping).toBe(0);
  });

  it("grants free shipping when promo type is shipping", () => {
    const totals = computeCartTotals(20, {
      type: "shipping",
      value: 100,
      code: "FREESHIP",
      label: "Free shipping",
    });
    expect(totals.shipping).toBe(0);
  });

  it("clamps afterDiscount at zero (so tax never goes negative)", () => {
    const totals = computeCartTotals(50, {
      type: "percent",
      value: 1000, // absurdly large — discount would be 500
      code: "X",
      label: "X",
    });
    // discount may exceed subtotal; afterDiscount should be 0
    expect(totals.discount).toBe(500);
    expect(totals.tax).toBe(0); // 0 * 0.08 = 0
    // total should not be negative
    expect(totals.total).toBeGreaterThanOrEqual(0);
  });
});

describe("computeCheckoutTotals", () => {
  it("sums line items into subtotal", () => {
    const totals = computeCheckoutTotals(
      [item("a", 30, 2), item("b", 50, 1)],
      "standard",
      null
    );
    expect(totals.subtotal).toBe(110);
  });

  it("uses the selected shipping method's price when below free threshold", () => {
    const totals = computeCheckoutTotals(
      [item("a", 20, 1)],
      "express",
      null
    );
    expect(totals.shipping).toBe(19.99);
  });

  it("uses the selected shipping method's price when above free threshold (still free)", () => {
    const totals = computeCheckoutTotals(
      [item("a", 200, 1)],
      "white-glove",
      null
    );
    expect(totals.shipping).toBe(0);
  });

  it("applies a percent promo via promo code lookup", () => {
    const totals = computeCheckoutTotals(
      [item("a", 100, 1)],
      "standard",
      "EDIT10"
    );
    expect(totals.discount).toBe(10);
  });

  it("ignores an unknown promo code", () => {
    const totals = computeCheckoutTotals(
      [item("a", 100, 1)],
      "standard",
      "NOPE"
    );
    expect(totals.discount).toBe(0);
  });
});
