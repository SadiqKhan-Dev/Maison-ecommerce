import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
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
import { CategoryHeroText } from "@/app/components/products/category-hero-text";
import { CATEGORIES, type CategoryMeta } from "@/data/categories";
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
import { cn } from "@/lib/utils/cn";
import type { Category } from "@/types/product";

const HERO_IMAGES: Record<Category, string> = {
  MEN: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=2000&q=80&seed=cat-hero-m",
  WOMEN: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=2000&q=80&seed=cat-hero-w",
  CHILDREN: "https://images.unsplash.com/photo-1519278409-1f56fdda7fe5?auto=format&fit=crop&w=2000&q=80&seed=cat-hero-c",
};

export function CategoryPage({
  category,
  searchParams,
}: {
  category: Category;
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const meta = CATEGORIES[category];
  if (!meta) notFound();

  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(searchParams)) {
    if (typeof v === "string") params.set(k, v);
    else if (Array.isArray(v) && v[0]) params.set(k, v[0]);
  }
  // Always force the category
  params.set("category", category);
  const filters = parseFilters(params);

  const categoryProducts = mockProducts.filter((p) => p.category === category);

  const facets = {
    subCategories: getSubCategories(categoryProducts),
    sizes: getAvailableSizes(categoryProducts),
    colors: getAvailableColors(categoryProducts),
    brands: getBrands(categoryProducts),
    priceRange: getPriceRange(categoryProducts),
  };

  const filtered = applyFilters(mockProducts, filters);
  const sorted = applySort(filtered, filters.sort);
  const { items, total, totalPages, page } = paginate(
    sorted,
    filters.page,
    filters.perPage
  );

  // Sub-category counts
  const subCounts = meta.subCategories.reduce<Record<string, number>>(
    (acc, sub) => {
      acc[sub] = categoryProducts.filter((p) => p.subCategory === sub).length;
      return acc;
    },
    {}
  );

  return (
    <>
      {/* Editorial hero */}
      <section className="relative h-[60vh] min-h-[420px] overflow-hidden bg-foreground">
        <Image
          src={HERO_IMAGES[category]}
          alt={`${meta.label} collection`}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-90"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-foreground/30 via-foreground/20 to-foreground/70"
          aria-hidden
        />
        <div className="relative h-full container-app flex flex-col justify-end pb-12">
          <CategoryHeroText label={meta.label} description={meta.description} />
        </div>
      </section>

      <Container className="py-10 lg:py-14">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: meta.label },
          ]}
          className="mb-6"
        />

        {/* Sub-category tabs */}
        <SubCategoryTabs
          meta={meta}
          active={filters.subCategories[0]}
          counts={subCounts}
        />

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <p className="text-sm text-muted">
            Showing <span className="text-foreground font-medium">{items.length}</span>{" "}
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
                title="No products in this view"
                body="Try a different sub-category or clear your filters."
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

function SubCategoryTabs({
  meta,
  active,
  counts,
}: {
  meta: CategoryMeta;
  active?: string;
  counts: Record<string, number>;
}) {
  return (
    <nav
      className="border-b border-border mb-8 -mx-6 px-6 lg:mx-0 lg:px-0 overflow-x-auto scrollbar-hide"
      aria-label="Sub-categories"
    >
      <ul className="flex items-center gap-1 min-w-max pb-px">
        <li>
          <Link
            href={meta.href}
            className={cn(
              "inline-flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
              !active
                ? "border-foreground text-foreground"
                : "border-transparent text-muted hover:text-foreground"
            )}
          >
            All {meta.label}
            <span className="text-xs text-muted">({Object.values(counts).reduce((a, b) => a + b, 0)})</span>
          </Link>
        </li>
        {meta.subCategories.map((s) => {
          const isActive = active === s;
          const isSale = s === "Sale";
          const href = isSale
            ? `${meta.href}?onSale=true`
            : `${meta.href}?sub=${encodeURIComponent(s)}`;
          return (
            <li key={s}>
              <Link
                href={href}
                className={cn(
                  "inline-flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                  isActive
                    ? "border-foreground text-foreground"
                    : "border-transparent hover:text-foreground",
                  isSale && !isActive && "text-sale"
                )}
              >
                {s}
                {counts[s] !== undefined && (
                  <span className="text-xs text-muted">({counts[s]})</span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
