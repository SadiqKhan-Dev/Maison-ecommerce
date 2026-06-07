import type { Address } from "@/types/user";

export type CheckoutStep = "information" | "shipping" | "payment" | "review";

export interface ContactInfo {
  email: string;
  marketingOptIn: boolean;
}

export type CheckoutAddress = Omit<Address, "id" | "isDefault">;

export type ShippingMethodId = "standard" | "express" | "white-glove";

export interface ShippingMethod {
  id: ShippingMethodId;
  name: string;
  description: string;
  price: number;
  etaMinDays: number;
  etaMaxDays: number;
}

export type PaymentProvider = "stripe" | "mock";

export interface PaymentDetails {
  provider: PaymentProvider;
  last4?: string;
  cardBrand?: string;
  intentId: string;
  status: "idle" | "processing" | "succeeded" | "failed" | "requires_action";
}

export interface BillingDetails {
  sameAsShipping: boolean;
  address?: CheckoutAddress;
}

export interface CheckoutTotals {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
}

export const CHECKOUT_STEPS: CheckoutStep[] = [
  "information",
  "shipping",
  "payment",
  "review",
];

export const STEP_LABEL: Record<CheckoutStep, string> = {
  information: "Information",
  shipping: "Shipping",
  payment: "Payment",
  review: "Review",
};

export function stepIndex(step: CheckoutStep): number {
  return CHECKOUT_STEPS.indexOf(step);
}

export function nextStep(step: CheckoutStep): CheckoutStep | null {
  const idx = stepIndex(step);
  if (idx < 0 || idx >= CHECKOUT_STEPS.length - 1) return null;
  return CHECKOUT_STEPS[idx + 1];
}

export function prevStep(step: CheckoutStep): CheckoutStep | null {
  const idx = stepIndex(step);
  if (idx <= 0) return null;
  return CHECKOUT_STEPS[idx - 1];
}

export function getStepHref(step: CheckoutStep): string {
  return `/checkout/${step}`;
}
