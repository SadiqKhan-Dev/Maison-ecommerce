"use client";

import * as React from "react";
import { X } from "lucide-react";
import { useMultiFilter, useSingleFilter, useClearFilters } from "@/lib/hooks/useFilterUrl";
import { cn } from "@/lib/utils/cn";

interface Chip {
  key: string;
  label: string;
  onRemove: () => void;
}

export function ActiveFilters() {
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

  const chips: Chip[] = [
    ...sub.value.map((v) => ({
      key: `sub-${v}`,
      label: v,
      onRemove: () => sub.toggle(v),
    })),
    ...size.value.map((v) => ({
      key: `size-${v}`,
      label: `Size ${v}`,
      onRemove: () => size.toggle(v),
    })),
    ...color.value.map((v) => ({
      key: `color-${v}`,
      label: v,
      onRemove: () => color.toggle(v),
    })),
    ...brand.value.map((v) => ({
      key: `brand-${v}`,
      label: v,
      onRemove: () => brand.toggle(v),
    })),
  ];

  if (rating.value)
    chips.push({
      key: "rating",
      label: `${rating.value}★ & up`,
      onRemove: () => rating.setValue(null),
    });
  if (inStock.value === "true")
    chips.push({
      key: "stock",
      label: "In stock",
      onRemove: () => inStock.setValue(null),
    });
  if (onSale.value === "true")
    chips.push({
      key: "sale",
      label: "On sale",
      onRemove: () => onSale.setValue(null),
    });
  if (minPrice.value || maxPrice.value) {
    const lo = minPrice.value ?? "0";
    const hi = maxPrice.value ?? "∞";
    chips.push({
      key: "price",
      label: `$${lo}–$${hi}`,
      onRemove: () => {
        minPrice.setValue(null);
        maxPrice.setValue(null);
      },
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      {chips.map((c) => (
        <button
          key={c.key}
          onClick={c.onRemove}
          className={cn(
            "group inline-flex items-center gap-1.5 h-8 pl-3 pr-2 text-xs uppercase tracking-wider border border-border rounded-full hover:border-foreground transition-colors"
          )}
        >
          {c.label}
          <X className="h-3 w-3 opacity-50 group-hover:opacity-100" />
        </button>
      ))}
      <button
        onClick={clear}
        className="text-xs uppercase tracking-wider text-muted hover:text-foreground underline-offset-2 hover:underline ml-1"
      >
        Clear all
      </button>
    </div>
  );
}
