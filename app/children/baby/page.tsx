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
  title: "Baby (0–2)",
  description:
    "Soft organic fabrics for babies. Gentle, comfortable clothing for the earliest stages.",
};

export default async function ChildrenBabyPage({
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
  params.set("category", "CHILDREN");
  params.set("sub", "Baby");
  const filters = parseFilters(params);

  const categoryProducts = mockProducts.filter(
    (p) => p.category === "CHILDREN" && p.subCategory === "Baby"
  );

  const allChildrenProducts = mockProducts.filter((p) => p.category === "CHILDREN");
  const facets = {
    subCategories: ["Baby", "Toddler", "Kids", "Teen"],
    sizes: getAvailableSizes(allChildrenProducts),
    colors: getAvailableColors(allChildrenProducts),
    brands: getBrands(allChildrenProducts),
    priceRange: getPriceRange(allChildrenProducts),
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
              "url('https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=2000&q=80&seed=children-baby')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/30 via-foreground/20 to-foreground/70" />
        <div className="relative h-full container-app flex flex-col justify-end pb-12 text-background">
          <p className="text-[10px] uppercase tracking-[0.3em] opacity-80 mb-4">
            Children / Autumn 2026
          </p>
          <h1 className="font-display text-5xl lg:text-7xl tracking-tight leading-[1] mb-4">
            Baby (0–2)
          </h1>
          <p className="text-sm lg:text-base opacity-80 max-w-md">
            Soft organic fabrics for babies, gentle and comfortable from day one.
          </p>
        </div>
      </section>

      <Container className="py-10 lg:py-14">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Children", href: "/children" },
            { label: "Baby" },
          ]}
          className="mb-6"
        />

        <SubCategoryNav category="CHILDREN" active="Baby" />

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
                title="No baby products in this view"
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
