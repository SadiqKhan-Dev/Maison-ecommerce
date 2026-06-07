import type { CartItem } from "@/types/cart";
import type {
  CheckoutTotals,
  ShippingMethodId,
} from "./types";
import { estimateShipping } from "./shipping";
import { calculateTax } from "./tax";
import { findPromoByCode } from "./promos";

export interface PromoLike {
  type: "percent" | "shipping";
  value: number;
  code: string;
  label: string;
}

export interface CartTotalsLite {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
}

export const CHECKOUT_THRESHOLDS = {
  taxRate: 0.08,
  freeShipping: 150,
  standardShipping: 9.99,
};

export function computeCartTotals(
  subtotal: number,
  promo: PromoLike | null
): CartTotalsLite {
  let discount = 0;
  if (promo?.type === "percent") {
    discount = (subtotal * promo.value) / 100;
  }
  const afterDiscount = Math.max(0, subtotal - discount);

  const qualifiesFree = afterDiscount >= CHECKOUT_THRESHOLDS.freeShipping;
  let shipping = qualifiesFree ? 0 : CHECKOUT_THRESHOLDS.standardShipping;
  if (promo?.type === "shipping") shipping = 0;

  const tax = afterDiscount * CHECKOUT_THRESHOLDS.taxRate;
  const total = afterDiscount + shipping + tax;

  return { subtotal, discount, shipping, tax, total };
}

export function computeCheckoutTotals(
  cart: CartItem[],
  shippingMethodId: ShippingMethodId | null,
  promoCode: string | null
): CheckoutTotals {
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const promo = promoCode ? findPromoByCode(promoCode) : null;

  let discount = 0;
  if (promo?.type === "percent") {
    discount = (subtotal * promo.value) / 100;
  }
  const afterDiscount = Math.max(0, subtotal - discount);
  const isFreeShippingPromo = promo?.type === "shipping";

  const shippingEstimate = estimateShipping(
    afterDiscount,
    shippingMethodId,
    isFreeShippingPromo
  );
  const shipping = shippingEstimate.amount;
  const tax = calculateTax(afterDiscount);
  const total = afterDiscount + shipping + tax;

  return { subtotal, discount, shipping, tax, total };
}
