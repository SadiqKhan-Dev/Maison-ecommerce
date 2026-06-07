import type { Category, Product } from "@/types/product";

export type SortKey =
  | "newest"
  | "price_asc"
  | "price_desc"
  | "popular"
  | "rating";

export const SORT_LABELS: Record<SortKey, string> = {
  newest: "Newest",
  price_asc: "Price: low to high",
  price_desc: "Price: high to low",
  popular: "Most popular",
  rating: "Top rated",
};

export interface ProductFilters {
  category?: Category;
  subCategories: string[];
  sizes: string[];
  colors: string[];
  brands: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStockOnly?: boolean;
  onSaleOnly?: boolean;
  sort: SortKey;
  page: number;
  perPage: number;
}

export const DEFAULT_FILTERS: ProductFilters = {
  subCategories: [],
  sizes: [],
  colors: [],
  brands: [],
  sort: "newest",
  page: 1,
  perPage: 12,
};

/** Parse a URLSearchParams into a typed filters object. */
export function parseFilters(params: URLSearchParams): ProductFilters {
  const filters: ProductFilters = {
    ...DEFAULT_FILTERS,
    subCategories: params.get("sub")?.split(",").filter(Boolean) ?? [],
    sizes: params.get("size")?.split(",").filter(Boolean) ?? [],
    colors: params.get("color")?.split(",").filter(Boolean) ?? [],
    brands: params.get("brand")?.split(",").filter(Boolean) ?? [],
    sort: (params.get("sort") as SortKey) || "newest",
    page: Math.max(1, Number(params.get("page")) || 1),
  };

  const category = params.get("category");
  if (category === "MEN" || category === "WOMEN" || category === "CHILDREN") {
    filters.category = category;
  }

  const minPrice = params.get("minPrice");
  const maxPrice = params.get("maxPrice");
  if (minPrice) filters.minPrice = Number(minPrice);
  if (maxPrice) filters.maxPrice = Number(maxPrice);

  const rating = params.get("rating");
  if (rating) filters.minRating = Number(rating);

  if (params.get("inStock") === "true") filters.inStockOnly = true;
  if (params.get("onSale") === "true") filters.onSaleOnly = true;

  return filters;
}

/** Apply filters to a product list. */
export function applyFilters(
  products: Product[],
  filters: ProductFilters
): Product[] {
  return products.filter((p) => {
    if (filters.category && p.category !== filters.category) return false;
    if (
      filters.subCategories.length > 0 &&
      !filters.subCategories.includes(p.subCategory)
    )
      return false;
    if (filters.brands.length > 0 && !filters.brands.includes(p.brand))
      return false;
    if (filters.sizes.length > 0) {
      const hasSize = p.variants.some(
        (v) => filters.sizes.includes(v.size) && v.stock > 0
      );
      if (!hasSize) return false;
    }
    if (filters.colors.length > 0) {
      const hasColor = p.variants.some(
        (v) => filters.colors.includes(v.color) && v.stock > 0
      );
      if (!hasColor) return false;
    }
    const price = p.salePrice ?? p.basePrice;
    if (filters.minPrice !== undefined && price < filters.minPrice) return false;
    if (filters.maxPrice !== undefined && price > filters.maxPrice) return false;
    if (
      filters.minRating !== undefined &&
      p.rating < filters.minRating
    )
      return false;
    if (filters.inStockOnly) {
      const totalStock = p.variants.reduce((s, v) => s + v.stock, 0);
      if (totalStock <= 0) return false;
    }
    if (filters.onSaleOnly) {
      if (p.salePrice === undefined || p.salePrice >= p.basePrice) return false;
    }
    return true;
  });
}

/** Apply sort to a product list. Does not mutate. */
export function applySort(products: Product[], sort: SortKey): Product[] {
  const list = [...products];
  switch (sort) {
    case "newest":
      return list.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    case "price_asc":
      return list.sort(
        (a, b) => (a.salePrice ?? a.basePrice) - (b.salePrice ?? b.basePrice)
      );
    case "price_desc":
      return list.sort(
        (a, b) => (b.salePrice ?? b.basePrice) - (a.salePrice ?? a.basePrice)
      );
    case "rating":
      return list.sort((a, b) => b.rating - a.rating);
    case "popular":
      return list.sort((a, b) => b.reviewCount - a.reviewCount);
  }
}

/** Paginate a list. */
export function paginate<T>(items: T[], page: number, perPage: number) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * perPage;
  return {
    items: items.slice(start, start + perPage),
    total,
    totalPages,
    page: safePage,
  };
}

/** Compute the global price range from a list of products. */
export function getPriceRange(products: Product[]): [number, number] {
  if (products.length === 0) return [0, 0];
  const prices = products.map((p) => p.salePrice ?? p.basePrice);
  return [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))];
}

/** Get all unique brands for a product set. */
export function getBrands(products: Product[]): string[] {
  return Array.from(new Set(products.map((p) => p.brand))).sort();
}

/** Get all available sub-categories for a product set. */
export function getSubCategories(products: Product[]): string[] {
  return Array.from(new Set(products.map((p) => p.subCategory))).sort();
}

/** Get all available colors (from variants) for a product set. */
export function getAvailableColors(
  products: Product[]
): { name: string; hex: string }[] {
  const seen = new Map<string, { name: string; hex: string }>();
  products.forEach((p) => {
    p.variants.forEach((v) => {
      if (!seen.has(v.color)) seen.set(v.color, { name: v.color, hex: v.colorHex });
    });
  });
  return Array.from(seen.values()).sort((a, b) => a.name.localeCompare(b.name));
}

/** Get all available sizes (from variants) for a product set. */
export function getAvailableSizes(products: Product[]): string[] {
  const seen = new Set<string>();
  products.forEach((p) => {
    p.variants.forEach((v) => {
      if (v.stock > 0) seen.add(v.size);
    });
  });
  // Sort by an ordered size preference if possible
  const order = [
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "XXL",
    "24",
    "26",
    "28",
    "30",
    "32",
    "34",
    "36",
    "2Y",
    "4Y",
    "6Y",
    "8Y",
    "10Y",
    "12Y",
    "14Y",
    "One Size",
  ];
  return Array.from(seen).sort(
    (a, b) => order.indexOf(a) - order.indexOf(b)
  );
}
