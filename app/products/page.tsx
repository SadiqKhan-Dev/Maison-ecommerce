import type { Metadata } from "next";
import { Breadcrumb } from "@/app/ui/breadcrumb";
import { Container } from "@/app/ui/container";
import { ProductGrid } from "@/app/components/products/product-grid";
import { ProductSort } from "@/app/components/products/product-sort";
import { ProductFiltersPanel } from "@/app/components/products/product-filters-panel";
import { ActiveFilters } from "@/app/components/products/active-filters";
import { Pagination } from "@/app/components/products/pagination";
import { FilterDrawer } from "@/app/components/products/filter-drawer";
import { EmptyState } from "@/app/components/shared/empty-state";
import { BackToTop } from "@/app/components/products/back-to-top";
import {
  applyFilters,
  applySort,
  getAvailableColors,
  getAvailableSizes,
  getBrands,
  getPriceRange,
  getSubCategories,
  paginate,
  parseFilters,
} from "@/lib/utils/filterProducts";
import { searchProducts } from "@/lib/search/search";
import { mockProducts } from "@/data/products";

export const metadata: Metadata = {
  title: "All Products",
  description: "Shop the full Maison collection.",
};

interface ProductsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const sp = await searchParams;
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (typeof v === "string") params.set(k, v);
    else if (Array.isArray(v) && v[0]) params.set(k, v[0]);
  }

  const filters = parseFilters(params);
  const query = params.get("q")?.trim() ?? "";

  // If a search query is present, restrict scope to matching products first
  const baseSet = query
    ? searchProducts(query, mockProducts, 50).map((r) => r.product)
    : mockProducts;

  // Compute facets from the unfiltered (or category-filtered) product set
  const facetScope = filters.category
    ? baseSet.filter((p) => p.category === filters.category)
    : baseSet;
  const facets = {
    subCategories: getSubCategories(facetScope),
    sizes: getAvailableSizes(facetScope),
    colors: getAvailableColors(facetScope),
    brands: getBrands(facetScope),
    priceRange: getPriceRange(facetScope),
  };

  const filtered = applyFilters(baseSet, filters);
  const sorted = applySort(filtered, filters.sort);
  const { items, total, totalPages, page } = paginate(
    sorted,
    filters.page,
    filters.perPage
  );

  return (
    <Container className="py-10 lg:py-14">
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "All Products" }]}
        className="mb-6"
      />

      <header className="mb-8 lg:mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted mb-2">
            {query ? `Search · “${query}”` : "The full edit"}
          </p>
          <h1 className="font-display text-4xl lg:text-5xl tracking-tight">
            {query ? "Search results" : "All Products"}
          </h1>
          <p className="text-sm text-muted mt-3">
            Showing <span className="text-foreground font-medium">{items.length}</span>{" "}
            of {total} {total === 1 ? "product" : "products"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <FilterDrawer facets={facets} />
          <ProductSort className="hidden sm:inline-flex" />
          <ProductSort className="sm:hidden" />
        </div>
      </header>

      <div className="grid lg:grid-cols-[260px_1fr] gap-10 lg:gap-14">
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <ProductFiltersPanel facets={facets} />
          </div>
        </aside>

        <div>
          <ActiveFilters />

          {items.length === 0 ? (
            <EmptyState
              title={query ? `Nothing matches “${query}”` : "No products match"}
              body="Try removing some filters or refining your search."
            />
          ) : (
            <ProductGrid products={items} />
          )}

          <Pagination page={page} totalPages={totalPages} />
        </div>
      </div>

      <BackToTop />
    </Container>
  );
}
