export type Category = "MEN" | "WOMEN" | "CHILDREN";

export interface ProductVariant {
  id: string;
  size: string;
  color: string;
  colorHex: string;
  sku: string;
  stock: number;
  price?: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  brand: string;
  category: Category;
  subCategory: string;
  images: string[];
  variants: ProductVariant[];
  basePrice: number;
  salePrice?: number;
  tags: string[];
  rating: number;
  reviewCount: number;
  createdAt: string;
  isNew?: boolean;
  isBestseller?: boolean;
}
