"use client";

import { create } from "zustand";

interface QuickViewProduct {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  images: string[];
  colors: Array<{ name: string; hex: string }>;
  sizes: Array<{ name: string; available: boolean }>;
}

interface QuickViewState {
  product: QuickViewProduct | null;
  isOpen: boolean;
  openQuickView: (product: QuickViewProduct) => void;
  closeQuickView: () => void;
}

export const useQuickViewStore = create<QuickViewState>()((set) => ({
  product: null,
  isOpen: false,
  openQuickView: (product) => set({ product, isOpen: true }),
  closeQuickView: () => set({ isOpen: false }),
}));
