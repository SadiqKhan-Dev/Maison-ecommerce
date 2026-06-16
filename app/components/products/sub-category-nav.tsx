"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { CATEGORIES } from "@/data/categories";
import type { Category } from "@/types/product";

const SUBCATEGORY_HREFS: Record<Category, Record<string, string>> = {
  MEN: {
    Tops: "/men/tops",
    Bottoms: "/men/bottoms",
    Outerwear: "/men/outerwear",
    Footwear: "/men/footwear",
    Accessories: "/men?sub=Accessories",
    Sale: "/sale?category=MEN",
  },
  WOMEN: {
    Tops: "/women/tops",
    Dresses: "/women/dresses",
    Bottoms: "/women/bottoms",
    Outerwear: "/women/outerwear",
    Footwear: "/women/footwear",
    Accessories: "/women?sub=Accessories",
    Sale: "/sale?category=WOMEN",
  },
  CHILDREN: {
    Baby: "/children?sub=Baby",
    Toddler: "/children?sub=Toddler",
    Kids: "/children?sub=Kids",
    Teen: "/children?sub=Teen",
    Sale: "/sale?category=CHILDREN",
  },
};

export function SubCategoryNav({
  category,
  active,
}: {
  category: Category;
  active: string;
}) {
  const meta = CATEGORIES[category];
  if (!meta) return null;

  const hrefs = SUBCATEGORY_HREFS[category] ?? {};

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
              "inline-flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors",
              "border-transparent text-muted hover:text-foreground"
            )}
          >
            All {meta.label}
          </Link>
        </li>
        {meta.subCategories.map((s) => {
          const isActive = active === s;
          const isSale = s === "Sale";
          const href = hrefs[s] ?? `${meta.href}?sub=${encodeURIComponent(s)}`;
          return (
            <li key={s}>
              <Link
                href={href}
                className={cn(
                  "inline-flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                  isActive
                    ? "border-foreground text-foreground"
                    : "border-transparent hover:text-foreground",
                  isSale && !isActive && "text-sale"
                )}
              >
                {s}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
