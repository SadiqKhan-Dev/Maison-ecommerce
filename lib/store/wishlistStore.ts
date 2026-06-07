"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface WishlistStore {
  items: string[];
  isOpen: boolean;
  toggle: (productId: string) => void;
  has: (productId: string) => boolean;
  clear: () => void;
  openWishlist: () => void;
  closeWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      toggle: (productId) => {
        const exists = get().items.includes(productId);
        set({
          items: exists
            ? get().items.filter((id) => id !== productId)
            : [...get().items, productId],
        });
      },
      has: (productId) => get().items.includes(productId),
      clear: () => set({ items: [] }),
      openWishlist: () => set({ isOpen: true }),
      closeWishlist: () => set({ isOpen: false }),
    }),
    {
      name: "clothing-wishlist",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
