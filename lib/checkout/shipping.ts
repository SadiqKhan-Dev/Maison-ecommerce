import type { ShippingMethod, ShippingMethodId } from "./types";

export const SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: "standard",
    name: "Standard",
    description: "Carbon-neutral delivery",
    price: 9.99,
    etaMinDays: 5,
    etaMaxDays: 7,
  },
  {
    id: "express",
    name: "Express",
    description: "Priority handling, signature on delivery",
    price: 19.99,
    etaMinDays: 2,
    etaMaxDays: 3,
  },
  {
    id: "white-glove",
    name: "White Glove",
    description: "Next-business-day delivery with hand-off",
    price: 39.99,
    etaMinDays: 1,
    etaMaxDays: 1,
  },
];

export function getShippingMethod(id: ShippingMethodId): ShippingMethod {
  return SHIPPING_METHODS.find((m) => m.id === id) ?? SHIPPING_METHODS[0];
}

export function getShippingMethodOrUndefined(
  id: ShippingMethodId | null | undefined
): ShippingMethod | undefined {
  if (!id) return undefined;
  return SHIPPING_METHODS.find((m) => m.id === id);
}

export const FREE_SHIPPING_THRESHOLD = 150;
export const STANDARD_SHIPPING_PRICE = 9.99;

export function qualifiesForFreeShipping(subtotalAfterDiscount: number): boolean {
  return subtotalAfterDiscount >= FREE_SHIPPING_THRESHOLD;
}

export interface ShippingEstimate {
  basePrice: number;
  free: boolean;
  amount: number;
  method?: ShippingMethod;
}

export function estimateShipping(
  subtotalAfterDiscount: number,
  methodId?: ShippingMethodId | null,
  freeShippingPromo = false
): ShippingEstimate {
  if (freeShippingPromo || qualifiesForFreeShipping(subtotalAfterDiscount)) {
    return {
      basePrice: 0,
      free: true,
      amount: 0,
      method: methodId ? getShippingMethod(methodId) : undefined,
    };
  }
  const method = methodId ? getShippingMethod(methodId) : SHIPPING_METHODS[0];
  return {
    basePrice: method.price,
    free: false,
    amount: method.price,
    method,
  };
}

export function formatEta(method: ShippingMethod): string {
  if (method.etaMinDays === method.etaMaxDays) {
    return `${method.etaMinDays} business day${method.etaMinDays === 1 ? "" : "s"}`;
  }
  return `${method.etaMinDays}–${method.etaMaxDays} business days`;
}

export function estimatedDeliveryDate(method: ShippingMethod): Date {
  const now = new Date();
  const days = method.etaMaxDays;
  const result = new Date(now);
  let added = 0;
  while (added < days) {
    result.setDate(result.getDate() + 1);
    const day = result.getDay();
    if (day !== 0 && day !== 6) {
      added += 1;
    }
  }
  return result;
}
