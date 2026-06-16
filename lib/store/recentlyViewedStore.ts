import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RecentProduct {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  image: string;
}

interface RecentlyViewedState {
  items: RecentProduct[];
  addProduct: (product: RecentProduct) => void;
  getProducts: (limit?: number) => RecentProduct[];
}

const MAX_ITEMS = 20;

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set, get) => ({
      items: [],
      addProduct: (product) => {
        set((state) => {
          const filtered = state.items.filter((item) => item.id !== product.id);
          return { items: [product, ...filtered].slice(0, MAX_ITEMS) };
        });
      },
      getProducts: (limit = 8) => get().items.slice(0, limit),
    }),
    { name: "clothing-recently-viewed" }
  )
);
