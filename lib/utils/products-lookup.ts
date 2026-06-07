import { mockProducts } from "@/data/products";
import type { Product } from "@/types/product";

export function getProductById(id: string): Product | undefined {
  return mockProducts.find((p) => p.id === id);
}

export function getProductBySlugOrId(slugOrId: string): Product | undefined {
  return (
    mockProducts.find((p) => p.slug === slugOrId) ??
    mockProducts.find((p) => p.id === slugOrId)
  );
}
