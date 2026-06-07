import { NextRequest, NextResponse } from "next/server";
import { mockProducts } from "@/data/products";
import { searchProducts } from "@/lib/search/search";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  const limitParam = request.nextUrl.searchParams.get("limit");
  const limit = Math.max(1, Math.min(Number(limitParam) || 8, 20));

  if (q.length === 0) {
    return NextResponse.json({ query: "", results: [] });
  }

  const results = searchProducts(q, mockProducts, limit).map((r) => ({
    id: r.product.id,
    slug: r.product.slug,
    name: r.product.name,
    brand: r.product.brand,
    category: r.product.category,
    subCategory: r.product.subCategory,
    image: r.product.images[0],
    price: r.product.salePrice ?? r.product.basePrice,
    score: r.score,
    matchedFields: r.matchedFields,
  }));

  return NextResponse.json({ query: q, results });
}
