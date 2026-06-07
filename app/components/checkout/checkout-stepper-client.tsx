"use client";

import { CheckoutStepper } from "./checkout-stepper";
import { useCheckoutStore } from "@/lib/store/checkoutStore";
import type { CheckoutStep } from "@/lib/checkout/types";

export function CheckoutStepperClient({ current }: { current: CheckoutStep }) {
  const contact = useCheckoutStore((s) => s.contact);
  const shippingAddress = useCheckoutStore((s) => s.shippingAddress);
  const shippingMethod = useCheckoutStore((s) => s.shippingMethod);
  const payment = useCheckoutStore((s) => s.payment);
  const hasReachedReview = useCheckoutStore((s) => s.hasReachedReview);

  const reachable: CheckoutStep[] = ["information"];
  if (contact && shippingAddress) {
    reachable.push("shipping");
  }
  if (contact && shippingAddress && shippingMethod) {
    reachable.push("payment");
  }
  if (
    contact &&
    shippingAddress &&
    shippingMethod &&
    payment?.status === "succeeded" &&
    hasReachedReview
  ) {
    reachable.push("review");
  }

  return <CheckoutStepper current={current} reachable={reachable} />;
}
