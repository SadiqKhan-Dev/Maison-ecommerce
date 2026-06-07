import type { Category } from "@/types/product";

export interface CategoryMeta {
  slug: Category;
  label: string;
  href: string;
  description: string;
  subCategories: string[];
  sizes: string[];
}

export const CATEGORIES: Record<Category, CategoryMeta> = {
  MEN: {
    slug: "MEN",
    label: "Men",
    href: "/men",
    description:
      "Considered menswear, built to last. Tailored essentials and statement outerwear.",
    subCategories: [
      "Tops",
      "Bottoms",
      "Outerwear",
      "Footwear",
      "Accessories",
      "Sale",
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  WOMEN: {
    slug: "WOMEN",
    label: "Women",
    href: "/women",
    description:
      "A modern wardrobe of elevated essentials, refined tailoring, and considered eveningwear.",
    subCategories: [
      "Tops",
      "Dresses",
      "Bottoms",
      "Outerwear",
      "Footwear",
      "Lingerie",
      "Accessories",
      "Sale",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  CHILDREN: {
    slug: "CHILDREN",
    label: "Children",
    href: "/children",
    description:
      "Soft, safe, and built to move. Organic fabrics, considered details.",
    subCategories: ["Baby", "Toddler", "Kids", "Teen", "Sale"],
    sizes: ["2Y", "4Y", "6Y", "8Y", "10Y", "12Y", "14Y"],
  },
};

export const BRANDS = [
  "Maison Noir",
  "Atelier Lumen",
  "Lumière",
  "Studio Seven",
  "Little Folk",
  "Northbound",
] as const;

export type Brand = (typeof BRANDS)[number];
