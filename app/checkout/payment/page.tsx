import type { Metadata } from "next";
import { Suspense } from "react";
import { PaymentStep } from "@/app/components/checkout/payment-step";
import { CheckoutStepperClient } from "@/app/components/checkout/checkout-stepper-client";

export const metadata: Metadata = {
  title: "Checkout · Payment",
  description: "Securely enter your payment details.",
};

export default function CheckoutPaymentPage() {
  return (
    <div className="space-y-10">
      <CheckoutStepperClient current="payment" />
      <Suspense fallback={null}>
        <PaymentStep />
      </Suspense>
    </div>
  );
}
