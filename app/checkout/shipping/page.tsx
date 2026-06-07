import type { Metadata } from "next";
import { ShippingStep } from "@/app/components/checkout/shipping-step";
import { CheckoutStepperClient } from "@/app/components/checkout/checkout-stepper-client";

export const metadata: Metadata = {
  title: "Checkout · Shipping",
  description: "Choose your shipping method.",
};

export default function CheckoutShippingPage() {
  return (
    <div className="space-y-10">
      <CheckoutStepperClient current="shipping" />
      <ShippingStep />
    </div>
  );
}
