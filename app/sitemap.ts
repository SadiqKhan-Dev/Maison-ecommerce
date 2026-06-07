import type { MetadataRoute } from "next";
import { mockProducts, newArrivals } from "@/data/products";
import { collections, getAllCollectionSlugs } from "@/data/collections";

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

const STATIC_ROUTES = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" as const },
  { path: "/products", priority: 0.9, changeFrequency: "daily" as const },
  { path: "/men", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/women", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/children", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/collections", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/sale", priority: 0.9, changeFrequency: "daily" as const },
  { path: "/about", priority: 0.5, changeFrequency: "monthly" as const },
  { path: "/sustainability", priority: 0.5, changeFrequency: "monthly" as const },
  { path: "/shipping", priority: 0.4, changeFrequency: "monthly" as const },
  { path: "/returns", priority: 0.4, changeFrequency: "monthly" as const },
  { path: "/size-guide", priority: 0.4, changeFrequency: "monthly" as const },
  { path: "/faq", priority: 0.4, changeFrequency: "monthly" as const },
  { path: "/contact", priority: 0.4, changeFrequency: "monthly" as const },
  { path: "/careers", priority: 0.5, changeFrequency: "monthly" as const },
  { path: "/press", priority: 0.4, changeFrequency: "monthly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const newArrivalIds = new Set(newArrivals.map((p) => p.id));

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${BASE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  const productEntries: MetadataRoute.Sitemap = mockProducts.map((p) => ({
    url: `${BASE_URL}/products/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: p.isBestseller ? 0.9 : newArrivalIds.has(p.id) ? 0.85 : 0.7,
    images: p.images.slice(0, 1),
  }));

  const collectionEntries: MetadataRoute.Sitemap = collections.map((c) => ({
    url: `${BASE_URL}/collections/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
    images: [c.heroImage],
  }));

  return [...staticEntries, ...productEntries, ...collectionEntries];
}

export const _collectionSlugs = getAllCollectionSlugs();
