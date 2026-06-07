"use client";

import * as React from "react";
import Link from "next/link";
import { Truck, ChevronRight, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import { usePromoStore } from "@/lib/store/promoStore";
import { formatPrice } from "@/lib/utils/formatPrice";
import { Button } from "@/app/ui/button";
import { cn } from "@/lib/utils/cn";
import { PromoCodeInput } from "./promo-code-input";
import { computeCartTotals, CHECKOUT_THRESHOLDS } from "@/lib/checkout/totals";

const FREE_SHIPPING_THRESHOLD = CHECKOUT_THRESHOLDS.freeShipping;

export interface CartSummaryProps {
  variant?: "sm" | "md";
  showCheckout?: boolean;
  onNavigate?: () => void;
  className?: string;
}

export function CartSummary({
  variant = "md",
  showCheckout = true,
  onNavigate,
  className,
}: CartSummaryProps) {
  const subtotal = useCartStore((s) => s.getSubtotal());
  const itemCount = useCartStore((s) => s.getItemCount());
  const promo = usePromoStore((s) => s.applied);
  const applyPromo = usePromoStore((s) => s.apply);
  const removePromo = usePromoStore((s) => s.remove);

  const totals = computeCartTotals(subtotal, promo);
  const remainingForFree = FREE_SHIPPING_THRESHOLD - totals.subtotal;
  const isDrawer = variant === "sm";

  return (
    <div className={cn("space-y-4", className)}>
      {!isDrawer && subtotal > 0 && (
        <div className="text-xs">
          {remainingForFree > 0 ? (
            <div className="flex items-center gap-2 text-muted">
              <Truck className="h-3.5 w-3.5" />
              <span>
                Add{" "}
                <span className="text-foreground font-medium price-mono">
                  {formatPrice(remainingForFree)}
                </span>{" "}
                more for free shipping
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-success">
              <Truck className="h-3.5 w-3.5" />
              <span>You qualify for free shipping</span>
            </div>
          )}
          <div className="mt-2 h-1 bg-muted/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-success transition-all"
              style={{
                width: `${Math.min(100, (totals.subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%`,
              }}
            />
          </div>
        </div>
      )}

      <PromoCodeInput
        applied={promo}
        onApply={applyPromo}
        onRemove={removePromo}
      />

      <dl className="space-y-2 text-sm">
        <Row label="Subtotal" value={formatPrice(totals.subtotal)} />
        {totals.discount > 0 && (
          <Row
            label={`Discount (${promo?.code})`}
            value={`−${formatPrice(totals.discount)}`}
            valueClass="text-success"
          />
        )}
        <Row
          label="Shipping"
          value={
            totals.shipping === 0 ? (
              <span className="text-success">Free</span>
            ) : (
              formatPrice(totals.shipping)
            )
          }
          hint={
            subtotal > 0 && subtotal < FREE_SHIPPING_THRESHOLD
              ? `Free over ${formatPrice(FREE_SHIPPING_THRESHOLD)}`
              : undefined
          }
        />
        <Row label="Tax (est.)" value={formatPrice(totals.tax)} />
        <div className="border-t border-border pt-3 mt-3">
          <Row
            label="Total"
            value={formatPrice(totals.total)}
            className="text-base font-medium"
            bold
          />
        </div>
      </dl>

      {showCheckout && (
        <Button
          size="lg"
          shape="full"
          className="w-full"
          disabled={itemCount === 0}
          asChild
        >
          <Link
            href="/checkout"
            onClick={onNavigate}
            className="inline-flex items-center gap-2"
          >
            Checkout
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      )}

      {!showCheckout && (
        <Button
          size="md"
          shape="full"
          variant="ghost"
          className="w-full"
          asChild
        >
          <Link href="/cart" onClick={onNavigate}>
            View full bag
          </Link>
        </Button>
      )}

      {!isDrawer && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full"
          asChild
        >
          <Link href="/products" onClick={onNavigate}>
            <ShoppingBag className="h-3.5 w-3.5 mr-1.5" />
            Continue shopping
          </Link>
        </Button>
      )}
    </div>
  );
}

function Row({
  label,
  value,
  hint,
  bold,
  className,
  valueClass,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  bold?: boolean;
  className?: string;
  valueClass?: string;
}) {
  return (
    <div className={cn("flex items-baseline justify-between gap-3", className)}>
      <dt className={cn("text-muted", bold && "text-foreground")}>
        {label}
        {hint && <span className="block text-[10px] mt-0.5">{hint}</span>}
      </dt>
      <dd
        className={cn(
          "price-mono",
          bold ? "text-lg font-medium" : "text-sm",
          valueClass
        )}
      >
        {value}
      </dd>
    </div>
  );
}
