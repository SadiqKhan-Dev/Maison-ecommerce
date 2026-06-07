"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { formatPrice } from "@/lib/utils/formatPrice";
import { Badge, type BadgeVariant } from "@/app/ui/badge";
import { StarRating } from "@/app/ui/star-rating";
import { useWishlistStore } from "@/lib/store/wishlistStore";
import { useCartStore } from "@/lib/store/cartStore";
import type { Product } from "@/types/product";

export interface ProductCardProps {
  product: Product;
  priority?: boolean;
  className?: string;
}

export function ProductCard({ product, priority, className }: ProductCardProps) {
  const has = useWishlistStore((s) => s.has);
  const toggle = useWishlistStore((s) => s.toggle);
  const addItem = useCartStore((s) => s.addItem);
  const closeCart = useCartStore((s) => s.closeCart);

  const isWished = has(product.id);
  const isSale =
    product.salePrice !== undefined && product.salePrice < product.basePrice;

  const badge: { label: string; variant: BadgeVariant } | null = isWished
    ? null
    : product.isNew
      ? { label: "New", variant: "new" }
      : isSale
        ? { label: "Sale", variant: "sale" }
        : null;

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(product.id);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const firstAvailable = product.variants.find((v) => v.stock > 0);
    if (!firstAvailable) return;
    addItem({
      productId: product.id,
      variantId: firstAvailable.id,
      name: product.name,
      brand: product.brand,
      image: product.images[0],
      size: firstAvailable.size,
      color: firstAvailable.color,
      colorHex: firstAvailable.colorHex,
      price: product.salePrice ?? product.basePrice,
      quantity: 1,
    });
    setTimeout(closeCart, 100);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn("group relative", className)}
    >
      <Link
        href={`/products/${product.slug}`}
        className="block focus:outline-none"
        aria-label={`${product.name} by ${product.brand}`}
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-muted/5 rounded-md">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            priority={priority}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          {product.images[1] && (
            <Image
              src={product.images[1]}
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              aria-hidden
              className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          )}

          {badge && (
            <div className="absolute top-3 left-3">
              <Badge variant={badge.variant}>{badge.label}</Badge>
            </div>
          )}

          <button
            onClick={handleWishlist}
            aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={isWished}
            className="absolute top-3 right-3 h-9 w-9 rounded-full bg-card/90 backdrop-blur flex items-center justify-center text-foreground hover:bg-card transition-all"
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-colors",
                isWished ? "fill-sale text-sale" : "text-foreground"
              )}
            />
          </button>

          <div className="absolute inset-x-3 bottom-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <button
              onClick={handleQuickAdd}
              className="w-full h-10 bg-foreground text-background text-[10px] uppercase tracking-[0.2em] font-medium rounded-md hover:bg-accent-dark transition-colors"
            >
              Quick add
            </button>
          </div>
        </div>

        <div className="mt-4 space-y-1.5">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted">
            {product.brand}
          </p>
          <h3 className="font-sans text-sm font-medium text-foreground leading-snug">
            {product.name}
          </h3>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-baseline gap-2">
              <span
                className={cn(
                  "price-mono text-sm font-medium",
                  isSale && "text-sale"
                )}
              >
                {formatPrice(product.salePrice ?? product.basePrice)}
              </span>
              {isSale && (
                <span className="price-mono text-xs text-muted line-through">
                  {formatPrice(product.basePrice)}
                </span>
              )}
            </div>
            {product.reviewCount > 0 && (
              <StarRating
                rating={product.rating}
                size="sm"
                showCount={product.reviewCount}
              />
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
