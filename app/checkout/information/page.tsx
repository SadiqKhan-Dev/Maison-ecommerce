import type { Metadata } from "next";
import { InformationStep } from "@/app/components/checkout/information-step";
import { CheckoutStepperClient } from "@/app/components/checkout/checkout-stepper-client";

export const metadata: Metadata = {
  title: "Checkout · Information",
  description: "Contact and shipping address.",
};

export default function CheckoutInformationPage() {
  return (
    <div className="space-y-10">
      <CheckoutStepperClient current="information" />
      <InformationStep />
    </div>
  );
}
