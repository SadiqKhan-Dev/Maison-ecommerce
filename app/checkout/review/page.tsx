import type { Metadata } from "next";
import { ReviewStep } from "@/app/components/checkout/review-step";
import { CheckoutStepperClient } from "@/app/components/checkout/checkout-stepper-client";

export const metadata: Metadata = {
  title: "Checkout · Review",
  description: "Review and place your order.",
};

export default function CheckoutReviewPage() {
  return (
    <div className="space-y-10">
      <CheckoutStepperClient current="review" />
      <ReviewStep />
    </div>
  );
}
