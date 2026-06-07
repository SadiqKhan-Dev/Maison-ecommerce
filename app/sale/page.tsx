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
import { SaleHero } from "@/app/components/sale/sale-hero";
import { mockProducts } from "@/data/products";
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

export const metadata: Metadata = {
  title: "Sale",
  description:
    "Considered reductions on the season's best. Up to 40% off while stock lasts.",
};

interface SalePageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function getSaleProducts() {
  return mockProducts.filter(
    (p) =>
      (p.salePrice !== undefined && p.salePrice < p.basePrice) ||
      p.tags.includes("sale")
  );
}

export default async function SalePage({ searchParams }: SalePageProps) {
  const sp = await searchParams;
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (typeof v === "string") params.set(k, v);
    else if (Array.isArray(v) && v[0]) params.set(k, v[0]);
  }
  const filters = parseFilters(params);

  const saleProducts = getSaleProducts();

  const facets = {
    subCategories: getSubCategories(saleProducts),
    sizes: getAvailableSizes(saleProducts),
    colors: getAvailableColors(saleProducts),
    brands: getBrands(saleProducts),
    priceRange: getPriceRange(saleProducts),
  };

  const filtered = applyFilters(saleProducts, filters);
  const sorted = applySort(filtered, filters.sort);
  const { items, total, totalPages, page } = paginate(
    sorted,
    filters.page,
    filters.perPage
  );

  const maxDiscount = Math.round(
    Math.max(
      ...saleProducts.map((p) =>
        p.salePrice !== undefined && p.salePrice < p.basePrice
          ? ((p.basePrice - p.salePrice) / p.basePrice) * 100
          : 0
      )
    )
  );

  return (
    <>
      <SaleHero itemCount={saleProducts.length} maxDiscount={maxDiscount} />

      <Container className="py-10 lg:py-14">
        <Breadcrumb
          items={[{ label: "Home", href: "/" }, { label: "Sale" }]}
          className="mb-6"
        />

        <header className="mb-8 lg:mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted mb-2">
              Final reductions
            </p>
            <h2 className="font-display text-4xl lg:text-5xl tracking-tight">
              The sale edit
            </h2>
            <p className="text-sm text-muted mt-3">
              Showing{" "}
              <span className="text-foreground font-medium">{items.length}</span>{" "}
              of {total} {total === 1 ? "piece" : "pieces"}
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
                title="No sale items match"
                body="Try removing some filters to see the full sale edit."
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
