"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  ContactInfo,
  CheckoutAddress,
  ShippingMethodId,
  BillingDetails,
  PaymentDetails,
  CheckoutStep,
} from "@/lib/checkout/types";

interface CheckoutStore {
  contact: ContactInfo | null;
  shippingAddress: CheckoutAddress | null;
  billing: BillingDetails | null;
  shippingMethod: ShippingMethodId | null;
  payment: PaymentDetails | null;
  currentStep: CheckoutStep;
  hasReachedReview: boolean;
  setContact: (c: ContactInfo) => void;
  setShippingAddress: (a: CheckoutAddress) => void;
  setBilling: (b: BillingDetails) => void;
  setShippingMethod: (id: ShippingMethodId) => void;
  setPayment: (p: PaymentDetails | null) => void;
  setCurrentStep: (s: CheckoutStep) => void;
  setHasReachedReview: (v: boolean) => void;
  reset: () => void;
}

const initialState = {
  contact: null,
  shippingAddress: null,
  billing: null,
  shippingMethod: null as ShippingMethodId | null,
  payment: null,
  currentStep: "information" as CheckoutStep,
  hasReachedReview: false,
};

export const useCheckoutStore = create<CheckoutStore>()(
  persist(
    (set) => ({
      ...initialState,
      setContact: (c) => set({ contact: c }),
      setShippingAddress: (a) => set({ shippingAddress: a }),
      setBilling: (b) => set({ billing: b }),
      setShippingMethod: (id) => set({ shippingMethod: id }),
      setPayment: (p) => set({ payment: p }),
      setCurrentStep: (s) => set({ currentStep: s }),
      setHasReachedReview: (v) => set({ hasReachedReview: v }),
      reset: () => set({ ...initialState }),
    }),
    {
      name: "clothing-checkout",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
