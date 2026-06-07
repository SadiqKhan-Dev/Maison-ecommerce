"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { useCartStore } from "@/lib/store/cartStore";
import { useWishlistStore } from "@/lib/store/wishlistStore";
import { formatPrice } from "@/lib/utils/formatPrice";
import { QuantitySelector } from "@/app/ui/quantity-selector";
import { cn } from "@/lib/utils/cn";
import type { CartItem as CartItemType } from "@/types/cart";

export interface CartItemProps {
  item: CartItemType;
  /** "sm" for drawer, "md" for cart page */
  size?: "sm" | "md";
  onNavigate?: () => void;
}

export function CartItem({ item, size = "sm", onNavigate }: CartItemProps) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const moveToWishlist = useWishlistStore((s) => s.toggle);

  const isSm = size === "sm";
  const isLowStock = item.variant ? item.variant.stock <= 3 && item.variant.stock > 0 : false;

  const handleMoveToWishlist = () => {
    moveToWishlist(item.productId);
    removeItem(item.id);
  };

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      className={cn(
        "flex gap-4",
        isSm ? "pb-6 border-b border-border/60 last:border-0" : "pb-6 border-b border-border last:border-0"
      )}
    >
      <Link
        href={`/products/${item.id}`}
        onClick={onNavigate}
        className={cn(
          "relative flex-shrink-0 overflow-hidden rounded-md bg-muted/5",
          isSm ? "h-24 w-20" : "h-32 w-24 lg:h-36 lg:w-28"
        )}
      >
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes={isSm ? "80px" : "112px"}
          className="object-cover"
        />
      </Link>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted">
              {item.brand}
            </p>
            <h3
              className={cn(
                "font-medium truncate",
                isSm ? "text-sm" : "text-base"
              )}
            >
              {item.name}
            </h3>
            <p
              className={cn(
                "text-muted mt-0.5",
                isSm ? "text-xs" : "text-sm"
              )}
            >
              {item.size} · {item.color}
            </p>
            {!isSm && isLowStock && item.variant && (
              <p className="text-xs text-sale mt-2 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-sale animate-pulse" />
                Only {item.variant.stock} left
              </p>
            )}
          </div>
          <button
            onClick={() => removeItem(item.id)}
            aria-label={`Remove ${item.name} from cart`}
            className="p-1 -m-1 text-muted hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div
          className={cn(
            "flex items-center justify-between gap-2",
            isSm ? "mt-3" : "mt-4"
          )}
        >
          <QuantitySelector
            value={item.quantity}
            onChange={(q) => updateQuantity(item.id, q)}
            max={Math.max(1, item.variant?.stock ?? 99)}
            className={isSm ? "h-9" : "h-10"}
          />
          <span
            className={cn(
              "price-mono font-medium",
              isSm ? "text-sm" : "text-base"
            )}
          >
            {formatPrice(item.price * item.quantity)}
          </span>
        </div>
        {!isSm && (
          <button
            onClick={handleMoveToWishlist}
            className="mt-2 text-xs text-muted hover:text-foreground underline-offset-2 hover:underline"
          >
            Move to wishlist
          </button>
        )}
      </div>
    </motion.li>
  );
}
