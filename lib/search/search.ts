import type { Product } from "@/types/product";

export interface SearchResult {
  product: Product;
  score: number;
  matchedFields: string[];
}

const FIELD_WEIGHTS: Record<string, number> = {
  name: 10,
  brand: 8,
  subCategory: 6,
  tags: 5,
  description: 3,
};

const MAX_RESULTS = 8;

function tokenize(input: string): string[] {
  return input
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter((t) => t.length > 0);
}

function tokenMatch(haystack: string, token: string): number {
  const h = haystack.toLowerCase();
  if (h === token) return 2;
  if (h.startsWith(token)) return 1.5;
  if (h.includes(token)) return 1;
  return 0;
}

function scoreField(
  fieldValue: string | string[] | undefined,
  tokens: string[]
): { score: number; matched: boolean } {
  if (!fieldValue) return { score: 0, matched: false };
  const values = Array.isArray(fieldValue) ? fieldValue : [fieldValue];
  let total = 0;
  let matched = false;
  for (const v of values) {
    for (const token of tokens) {
      const m = tokenMatch(v, token);
      if (m > 0) {
        total += m;
        matched = true;
      }
    }
  }
  return { score: total, matched };
}

export function searchProducts(
  query: string,
  products: Product[],
  limit: number = MAX_RESULTS
): SearchResult[] {
  const trimmed = query.trim();
  if (trimmed.length === 0) return [];
  const tokens = tokenize(trimmed);
  if (tokens.length === 0) return [];

  const results: SearchResult[] = [];

  for (const product of products) {
    let totalScore = 0;
    const matchedFields: string[] = [];

    for (const [field, weight] of Object.entries(FIELD_WEIGHTS)) {
      const value =
        field === "name"
          ? product.name
          : field === "brand"
            ? product.brand
            : field === "subCategory"
              ? product.subCategory
              : field === "tags"
                ? product.tags
                : field === "description"
                  ? product.description
                  : undefined;
      const { score, matched } = scoreField(value, tokens);
      if (matched) {
        totalScore += score * weight;
        matchedFields.push(field);
      }
    }

    if (totalScore > 0) {
      results.push({ product, score: totalScore, matchedFields });
    }
  }

  results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.product.reviewCount - a.product.reviewCount;
  });

  return results.slice(0, limit);
}

export interface SearchSuggestion {
  label: string;
  href: string;
}

export function getPopularSuggestions(): SearchSuggestion[] {
  return [
    { label: "New arrivals", href: "/products?sort=newest" },
    { label: "Cashmere", href: "/products?sub=Tops" },
    { label: "Wool coats", href: "/men?sub=Outerwear" },
    { label: "Sale", href: "/sale" },
  ];
}
