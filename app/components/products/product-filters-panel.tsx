"use client";

import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useMultiFilter, useSingleFilter, useClearFilters } from "@/lib/hooks/useFilterUrl";

interface Facets {
  subCategories: string[];
  sizes: string[];
  colors: { name: string; hex: string }[];
  brands: string[];
  priceRange: [number, number];
}

export function ProductFiltersPanel({ facets }: { facets: Facets }) {
  const sub = useMultiFilter("sub");
  const size = useMultiFilter("size");
  const color = useMultiFilter("color");
  const brand = useMultiFilter("brand");
  const rating = useSingleFilter("rating");
  const inStock = useSingleFilter("inStock");
  const onSale = useSingleFilter("onSale");
  const minPrice = useSingleFilter("minPrice");
  const maxPrice = useSingleFilter("maxPrice");
  const clear = useClearFilters();

  // Local refs for price inputs (uncontrolled — keyed by URL value so they reset on change)
  const loRef = React.useRef<HTMLInputElement>(null);
  const hiRef = React.useRef<HTMLInputElement>(null);

  const applyPrice = () => {
    minPrice.setValue(loRef.current?.value || null);
    maxPrice.setValue(hiRef.current?.value || null);
  };

  return (
    <div className="p-6 lg:p-0 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl">Refine</h2>
        <button
          onClick={clear}
          className="text-xs uppercase tracking-widest text-muted hover:text-foreground underline-offset-2 hover:underline"
        >
          Clear all
        </button>
      </div>

      {facets.subCategories.length > 0 && (
        <FilterSection title="Category">
          <ul className="space-y-2.5">
            {facets.subCategories.map((s) => (
              <li key={s}>
                <Checkbox
                  label={s}
                  checked={sub.value.includes(s)}
                  onChange={() => sub.toggle(s)}
                />
              </li>
            ))}
          </ul>
        </FilterSection>
      )}

      {facets.sizes.length > 0 && (
        <FilterSection title="Size">
          <div className="flex flex-wrap gap-2">
            {facets.sizes.map((s) => {
              const active = size.value.includes(s);
              return (
                <button
                  key={s}
                  onClick={() => size.toggle(s)}
                  aria-pressed={active}
                  className={cn(
                    "min-w-[44px] h-10 px-2 text-xs font-medium border rounded-md transition-colors",
                    active
                      ? "bg-foreground text-background border-foreground"
                      : "border-border hover:border-foreground"
                  )}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </FilterSection>
      )}

      {facets.colors.length > 0 && (
        <FilterSection title="Color">
          <div className="flex flex-wrap gap-2">
            {facets.colors.map((c) => {
              const active = color.value.includes(c.name);
              return (
                <button
                  key={c.name}
                  onClick={() => color.toggle(c.name)}
                  aria-pressed={active}
                  aria-label={c.name}
                  title={c.name}
                  className={cn(
                    "h-9 w-9 rounded-full border-2 transition-all relative",
                    active
                      ? "border-foreground scale-110"
                      : "border-transparent hover:scale-105"
                  )}
                  style={{ backgroundColor: c.hex }}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-wider whitespace-nowrap transition-opacity",
                      active ? "opacity-100 text-foreground" : "opacity-0"
                    )}
                  >
                    {c.name}
                  </span>
                </button>
              );
            })}
          </div>
        </FilterSection>
      )}

      <FilterSection title="Price">
        <div className="flex items-center gap-2">
          <label className="flex-1">
            <span className="sr-only">Minimum price</span>
            <div className="flex items-center border border-border rounded-md h-10 px-3 focus-within:border-foreground">
              <span className="text-muted text-xs mr-1">$</span>
              <input
                key={`min-${minPrice.value ?? ""}`}
                ref={loRef}
                type="number"
                inputMode="numeric"
                min={0}
                defaultValue={minPrice.value ?? ""}
                onBlur={applyPrice}
                placeholder={String(facets.priceRange[0])}
                className="w-full bg-transparent text-sm outline-none price-mono"
              />
            </div>
          </label>
          <span className="text-muted">–</span>
          <label className="flex-1">
            <span className="sr-only">Maximum price</span>
            <div className="flex items-center border border-border rounded-md h-10 px-3 focus-within:border-foreground">
              <span className="text-muted text-xs mr-1">$</span>
              <input
                key={`max-${maxPrice.value ?? ""}`}
                ref={hiRef}
                type="number"
                inputMode="numeric"
                min={0}
                defaultValue={maxPrice.value ?? ""}
                onBlur={applyPrice}
                placeholder={String(facets.priceRange[1])}
                className="w-full bg-transparent text-sm outline-none price-mono"
              />
            </div>
          </label>
        </div>
      </FilterSection>

      {facets.brands.length > 0 && (
        <FilterSection title="Brand">
          <ul className="space-y-2.5">
            {facets.brands.map((b) => (
              <li key={b}>
                <Checkbox
                  label={b}
                  checked={brand.value.includes(b)}
                  onChange={() => brand.toggle(b)}
                />
              </li>
            ))}
          </ul>
        </FilterSection>
      )}

      <FilterSection title="Rating">
        <ul className="space-y-2">
          {[4, 3, 2].map((r) => (
            <li key={r}>
              <button
                onClick={() =>
                  rating.setValue(rating.value === String(r) ? null : String(r))
                }
                className={cn(
                  "flex items-center gap-2 text-sm py-1 w-full text-left hover:text-foreground",
                  rating.value === String(r)
                    ? "text-foreground"
                    : "text-muted"
                )}
              >
                <span className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-3.5 w-3.5",
                        i < r
                          ? "fill-accent text-accent"
                          : "fill-transparent text-muted/40"
                      )}
                    />
                  ))}
                </span>
                <span>& up</span>
              </button>
            </li>
          ))}
        </ul>
      </FilterSection>

      <FilterSection title="Availability">
        <div className="space-y-3">
          <Switch
            label="In stock only"
            checked={inStock.value === "true"}
            onChange={(c) => inStock.setValue(c ? "true" : null)}
          />
          <Switch
            label="On sale"
            checked={onSale.value === "true"}
            onChange={(c) => onSale.setValue(c ? "true" : null)}
          />
        </div>
      </FilterSection>
    </div>
  );
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="text-[10px] uppercase tracking-[0.2em] text-muted mb-4">
        {title}
      </h3>
      {children}
    </section>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-2.5 text-sm cursor-pointer group">
      <span
        className={cn(
          "h-4 w-4 inline-flex items-center justify-center border rounded-sm transition-colors",
          checked
            ? "bg-foreground border-foreground"
            : "border-border group-hover:border-foreground"
        )}
      >
        {checked && (
          <svg viewBox="0 0 12 12" className="h-3 w-3 text-background">
            <path
              d="M2 6.5l2.5 2.5L10 3.5"
              stroke="currentColor"
              strokeWidth={2}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <span className="text-foreground/85 group-hover:text-foreground transition-colors">
        {label}
      </span>
    </label>
  );
}

function Switch({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex items-center justify-between gap-3 w-full text-sm"
    >
      <span>{label}</span>
      <span
        className={cn(
          "relative h-5 w-9 rounded-full transition-colors",
          checked ? "bg-foreground" : "bg-border"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-4 w-4 bg-background rounded-full transition-transform shadow",
            checked ? "translate-x-4" : "translate-x-0.5"
          )}
        />
      </span>
    </button>
  );
}
