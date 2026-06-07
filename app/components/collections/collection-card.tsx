import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Collection } from "@/data/collections";
import { mockProducts } from "@/data/products";

export interface CollectionCardProps {
  collection: Collection;
  size?: "default" | "wide" | "tall";
  priority?: boolean;
}

function getProductCount(collection: Collection): number {
  return collection.productIds.filter((id) =>
    mockProducts.some((p) => p.id === id)
  ).length;
}

export function CollectionCard({
  collection,
  size = "default",
  priority,
}: CollectionCardProps) {
  const aspect =
    size === "wide"
      ? "aspect-[16/10]"
      : size === "tall"
        ? "aspect-[3/4]"
        : "aspect-[4/5]";

  const count = getProductCount(collection);

  return (
    <Link
      href={`/collections/${collection.slug}`}
      className="group block relative overflow-hidden rounded-md"
      aria-label={`${collection.title} — ${collection.subtitle}`}
    >
      <div className={cn(`relative ${aspect} bg-muted/5`)}>
        <Image
          src={collection.heroImage}
          alt={collection.title}
          fill
          sizes={
            size === "wide"
              ? "(max-width: 1024px) 100vw, 66vw"
              : "(max-width: 1024px) 100vw, 33vw"
          }
          priority={priority}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent"
          aria-hidden
        />
        <div className="absolute inset-x-0 bottom-0 p-6 lg:p-8 text-background flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] opacity-80 mb-2">
              {collection.category} · {count} pieces
            </p>
            <h3 className="font-display text-3xl lg:text-4xl tracking-tight leading-tight">
              {collection.title}
            </h3>
            <p className="text-sm opacity-80 mt-2 max-w-md">
              {collection.subtitle}
            </p>
          </div>
          <ArrowUpRight
            className="h-6 w-6 shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
            aria-hidden
          />
        </div>
      </div>
    </Link>
  );
}

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
