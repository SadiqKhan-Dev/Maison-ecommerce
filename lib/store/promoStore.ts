"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Promo } from "@/lib/checkout/promos";

export type AppliedPromo = Promo;

interface PromoStore {
  applied: AppliedPromo | null;
  apply: (promo: AppliedPromo) => void;
  remove: () => void;
}

export const usePromoStore = create<PromoStore>()(
  persist(
    (set) => ({
      applied: null,
      apply: (promo) => set({ applied: promo }),
      remove: () => set({ applied: null }),
    }),
    {
      name: "clothing-promo",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
