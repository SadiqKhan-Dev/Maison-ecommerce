"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Tag, X, Truck, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/lib/store/cartStore";
import { useCheckoutStore } from "@/lib/store/checkoutStore";
import { usePromoStore } from "@/lib/store/promoStore";
import { computeCheckoutTotals } from "@/lib/checkout/totals";
import { formatPrice } from "@/lib/utils/formatPrice";
import { cn } from "@/lib/utils/cn";
import { findPromoByCode } from "@/lib/checkout/promos";
import { getShippingMethod } from "@/lib/checkout/shipping";

export interface CheckoutSummaryProps {
  collapsible?: boolean;
  defaultOpen?: boolean;
  showEditLink?: boolean;
}

export function CheckoutSummary({
  collapsible = false,
  defaultOpen = true,
  showEditLink = true,
}: CheckoutSummaryProps) {
  const items = useCartStore((s) => s.items);
  const promo = usePromoStore((s) => s.applied);
  const applyPromo = usePromoStore((s) => s.apply);
  const removePromo = usePromoStore((s) => s.remove);
  const shippingMethod = useCheckoutStore((s) => s.shippingMethod);
  const setShippingMethod = useCheckoutStore((s) => s.setShippingMethod);

  const [open, setOpen] = React.useState(defaultOpen);
  const [code, setCode] = React.useState("");
  const [codeError, setCodeError] = React.useState<string | null>(null);

  const totals = computeCheckoutTotals(
    items,
    shippingMethod,
    promo?.code ?? null
  );

  const method = shippingMethod ? getShippingMethod(shippingMethod) : null;

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setCodeError(null);
    const next = findPromoByCode(code);
    if (!next) {
      setCodeError("Invalid code");
      return;
    }
    applyPromo(next);
    setCode("");
  };

  const containerClass = cn(
    "bg-card border border-border rounded-lg",
    collapsible && "overflow-hidden"
  );

  return (
    <div className={containerClass}>
      {collapsible ? (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="w-full flex items-center justify-between p-5 text-left"
        >
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted">
              Order summary
            </p>
            <p className="mt-1 font-display text-2xl">
              {formatPrice(totals.total)}
            </p>
          </div>
          <ChevronDown
            className={cn(
              "h-5 w-5 text-muted transition-transform",
              open && "rotate-180"
            )}
          />
        </button>
      ) : (
        <div className="p-5 border-b border-border flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted">
            Order summary
          </p>
          {showEditLink && (
            <Link
              href="/cart"
              className="text-xs text-muted hover:text-foreground underline-offset-4 hover:underline"
            >
              Edit bag
            </Link>
          )}
        </div>
      )}

      <AnimatePresence initial={false}>
        {(!collapsible || open) && (
          <motion.div
            initial={collapsible ? { height: 0, opacity: 0 } : false}
            animate={collapsible ? { height: "auto", opacity: 1 } : undefined}
            exit={collapsible ? { height: 0, opacity: 0 } : undefined}
            transition={{ duration: 0.2 }}
            className={cn(collapsible && "overflow-hidden")}
          >
            <div className="p-5 space-y-5">
              <ul className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-start gap-3 text-sm"
                  >
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-muted/10">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                      <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 bg-foreground text-background text-[10px] font-medium rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] uppercase tracking-[0.15em] text-muted">
                        {item.brand}
                      </p>
                      <p className="font-medium leading-tight truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted mt-0.5">
                        {item.size} · {item.color}
                      </p>
                    </div>
                    <p className="price-mono text-sm font-medium shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </li>
                ))}
              </ul>

              {items.length > 0 && !collapsible && (
                <form onSubmit={handleApply} className="space-y-1.5">
                  <div className="flex items-stretch">
                    <div className="flex items-center px-3 border border-r-0 border-border rounded-l-md text-muted">
                      <Tag className="h-4 w-4" />
                    </div>
                    <label htmlFor="promo-checkout" className="sr-only">
                      Promo code
                    </label>
                    {promo ? (
                      <div className="flex-1 h-11 px-3 bg-success/10 border border-success/30 rounded-r-md flex items-center justify-between text-sm">
                        <span className="text-success font-medium">
                          {promo.code} — {promo.label}
                        </span>
                        <button
                          type="button"
                          onClick={removePromo}
                          aria-label="Remove promo code"
                          className="text-success hover:text-foreground"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <input
                          id="promo-checkout"
                          type="text"
                          value={code}
                          onChange={(e) => {
                            setCode(e.target.value);
                            setCodeError(null);
                          }}
                          placeholder="Promo code"
                          autoComplete="off"
                          className="flex-1 h-11 bg-transparent border border-border px-3 text-sm outline-none focus:border-foreground uppercase tracking-wider placeholder:normal-case placeholder:tracking-normal"
                        />
                        <button
                          type="submit"
                          className="h-11 px-4 bg-foreground text-background text-xs uppercase tracking-[0.2em] font-medium rounded-r-md hover:bg-accent-dark transition-colors"
                        >
                          Apply
                        </button>
                      </>
                    )}
                  </div>
                  {codeError && (
                    <p className="text-xs text-error">{codeError}</p>
                  )}
                </form>
              )}

              {items.length > 0 && collapsible && (
                <form onSubmit={handleApply} className="space-y-1.5">
                  {promo ? (
                    <div className="flex items-center justify-between h-11 px-3 bg-success/10 border border-success/30 rounded-md text-sm">
                      <span className="text-success font-medium">
                        {promo.code} applied
                      </span>
                      <button
                        type="button"
                        onClick={removePromo}
                        aria-label="Remove promo code"
                        className="text-success hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-stretch">
                      <div className="flex items-center px-3 border border-r-0 border-border rounded-l-md text-muted">
                        <Tag className="h-4 w-4" />
                      </div>
                      <input
                        type="text"
                        value={code}
                        onChange={(e) => {
                          setCode(e.target.value);
                          setCodeError(null);
                        }}
                        placeholder="Promo code"
                        className="flex-1 h-10 bg-transparent border border-border px-3 text-sm outline-none focus:border-foreground uppercase tracking-wider placeholder:normal-case placeholder:tracking-normal"
                      />
                      <button
                        type="submit"
                        className="h-10 px-4 bg-foreground text-background text-[10px] uppercase tracking-[0.2em] font-medium rounded-r-md hover:bg-accent-dark transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                  {codeError && (
                    <p className="text-xs text-error">{codeError}</p>
                  )}
                </form>
              )}

              <dl className="space-y-2 text-sm border-t border-border pt-4">
                <Row label="Subtotal" value={formatPrice(totals.subtotal)} />
                {totals.discount > 0 && (
                  <Row
                    label={`Discount (${promo?.code})`}
                    value={`−${formatPrice(totals.discount)}`}
                    valueClass="text-success"
                  />
                )}
                {method && !collapsible && (
                  <Row
                    label="Shipping"
                    value={
                      totals.shipping === 0 ? (
                        <span className="text-success">Free</span>
                      ) : (
                        formatPrice(totals.shipping)
                      )
                    }
                    hint={`${method.name} · ${method.etaMinDays}–${method.etaMaxDays} days`}
                  />
                )}
                {collapsible && (
                  <Row
                    label="Shipping"
                    value={
                      totals.shipping === 0 ? (
                        <span className="text-success">Free</span>
                      ) : (
                        formatPrice(totals.shipping)
                      )
                    }
                  />
                )}
                <Row label="Tax" value={formatPrice(totals.tax)} />
                <div className="border-t border-border pt-3 mt-3">
                  <Row
                    label="Total"
                    value={formatPrice(totals.total)}
                    className="text-base font-medium"
                    bold
                  />
                </div>
              </dl>

              {!collapsible && (
                <div className="space-y-2 pt-2">
                  {(["standard", "express", "white-glove"] as const).map(
                    (id) => {
                      const m = getShippingMethod(id);
                      const selected = shippingMethod === id;
                      return (
                        <label
                          key={id}
                          className={cn(
                            "flex items-center justify-between gap-3 p-3 border rounded-md cursor-pointer transition-colors",
                            selected
                              ? "border-foreground bg-foreground/[0.03]"
                              : "border-border hover:border-foreground/40"
                          )}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={cn(
                                "h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0",
                                selected
                                  ? "border-foreground"
                                  : "border-muted/40"
                              )}
                            >
                              {selected && (
                                <div className="h-2 w-2 rounded-full bg-foreground" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium">{m.name}</p>
                              <p className="text-xs text-muted truncate">
                                {m.etaMinDays}–{m.etaMaxDays} business days
                              </p>
                            </div>
                          </div>
                          <p className="text-sm price-mono font-medium shrink-0">
                            {m.price === 0 ? "Free" : formatPrice(m.price)}
                          </p>
                          <input
                            type="radio"
                            name="shipping"
                            value={id}
                            checked={selected}
                            onChange={() => setShippingMethod(id)}
                            className="sr-only"
                          />
                        </label>
                      );
                    }
                  )}
                </div>
              )}

              <div className="flex items-center gap-2 text-xs text-muted pt-2">
                <Truck className="h-3.5 w-3.5" />
                <span>Carbon-neutral delivery</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Secure 256-bit SSL checkout</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
