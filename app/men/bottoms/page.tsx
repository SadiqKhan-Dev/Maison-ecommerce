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
import { SubCategoryNav } from "@/app/components/products/sub-category-nav";
import { mockProducts } from "@/data/products";
import {
  applyFilters,
  applySort,
  getAvailableColors,
  getAvailableSizes,
  getBrands,
  getPriceRange,
  paginate,
  parseFilters,
} from "@/lib/utils/filterProducts";

export const metadata: Metadata = {
  title: "Men's Bottoms",
  description:
    "Trousers, jeans, and shorts. Precision-cut menswear for every occasion.",
};

export default async function MenBottomsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (typeof v === "string") params.set(k, v);
    else if (Array.isArray(v) && v[0]) params.set(k, v[0]);
  }
  params.set("category", "MEN");
  params.set("sub", "Bottoms");
  const filters = parseFilters(params);

  const allMenProducts = mockProducts.filter((p) => p.category === "MEN");
  const facets = {
    subCategories: ["Tops", "Bottoms", "Outerwear", "Footwear", "Accessories"],
    sizes: getAvailableSizes(allMenProducts),
    colors: getAvailableColors(allMenProducts),
    brands: getBrands(allMenProducts),
    priceRange: getPriceRange(allMenProducts),
  };

  const filtered = applyFilters(mockProducts, filters);
  const sorted = applySort(filtered, filters.sort);
  const { items, total, totalPages, page } = paginate(
    sorted,
    filters.page,
    filters.perPage
  );

  return (
    <>
      <section className="relative h-[50vh] min-h-[360px] overflow-hidden bg-foreground">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=2000&q=80&seed=men-bottoms')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/30 via-foreground/20 to-foreground/70" />
        <div className="relative h-full container-app flex flex-col justify-end pb-12 text-background">
          <p className="text-[10px] uppercase tracking-[0.3em] opacity-80 mb-4">
            Men / Autumn 2026
          </p>
          <h1 className="font-display text-5xl lg:text-7xl tracking-tight leading-[1] mb-4">
            Bottoms
          </h1>
          <p className="text-sm lg:text-base opacity-80 max-w-md">
            Trousers, jeans, and shorts precision-cut for a modern silhouette.
          </p>
        </div>
      </section>

      <Container className="py-10 lg:py-14">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Men", href: "/men" },
            { label: "Bottoms" },
          ]}
          className="mb-6"
        />

        <SubCategoryNav category="MEN" active="Bottoms" />

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <p className="text-sm text-muted">
            Showing{" "}
            <span className="text-foreground font-medium">{items.length}</span>{" "}
            of {total} {total === 1 ? "product" : "products"}
          </p>
          <div className="flex items-center gap-2">
            <FilterDrawer facets={facets} />
            <ProductSort />
          </div>
        </div>

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
                title="No bottoms in this view"
                body="Try a different filter or clear your selection."
              />
            ) : (
              <ProductGrid products={items} />
            )}
            <Pagination page={page} totalPages={totalPages} />
          </div>
        </div>

        <BackToTop />
      </Container>
    </>
  );
}
