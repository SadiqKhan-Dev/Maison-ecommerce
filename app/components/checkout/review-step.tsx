"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Edit3,
  CheckCircle2,
  Loader2,
  Truck,
  MapPin,
  CreditCard,
  Mail,
  Lock,
} from "lucide-react";
import { Button } from "@/app/ui/button";
import { useCheckoutStore } from "@/lib/store/checkoutStore";
import { useCartStore } from "@/lib/store/cartStore";
import { computeCheckoutTotals } from "@/lib/checkout/totals";
import { usePromoStore } from "@/lib/store/promoStore";
import { getShippingMethod } from "@/lib/checkout/shipping";
import { estimatedDeliveryDate, formatEta } from "@/lib/checkout/shipping";
import { formatPrice } from "@/lib/utils/formatPrice";
import { placeOrderAction } from "@/app/checkout/actions";

export function ReviewStep() {
  const router = useRouter();
  const setCurrentStep = useCheckoutStore((s) => s.setCurrentStep);
  const setHasReachedReview = useCheckoutStore((s) => s.setHasReachedReview);
  const contact = useCheckoutStore((s) => s.contact);
  const shippingAddress = useCheckoutStore((s) => s.shippingAddress);
  const billing = useCheckoutStore((s) => s.billing);
  const shippingMethod = useCheckoutStore((s) => s.shippingMethod);
  const payment = useCheckoutStore((s) => s.payment);
  const resetCheckout = useCheckoutStore((s) => s.reset);
  const clearCart = useCartStore((s) => s.clearCart);
  const removePromo = usePromoStore((s) => s.remove);
  const items = useCartStore((s) => s.items);
  const promo = usePromoStore((s) => s.applied);

  const [isPlacing, setIsPlacing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const totals = computeCheckoutTotals(
    items,
    shippingMethod,
    promo?.code ?? null
  );

  React.useEffect(() => {
    setCurrentStep("review");
    setHasReachedReview(true);
  }, [setCurrentStep, setHasReachedReview]);

  React.useEffect(() => {
    if (items.length === 0) {
      router.replace("/cart");
      return;
    }
    if (!contact || !shippingAddress) {
      router.replace("/checkout/information");
      return;
    }
    if (!shippingMethod) {
      router.replace("/checkout/shipping");
      return;
    }
    if (!payment || payment.status !== "succeeded") {
      router.replace("/checkout/payment");
    }
  }, [
    items.length,
    contact,
    shippingAddress,
    shippingMethod,
    payment,
    router,
  ]);

  const onPlaceOrder = async () => {
    if (!contact || !shippingAddress || !shippingMethod || !payment) return;
    setError(null);
    setIsPlacing(true);
    try {
      const method = getShippingMethod(shippingMethod);
      const delivery = estimatedDeliveryDate(method);

      const result = await placeOrderAction({
        contact,
        shippingAddress,
        billingAddress: billing?.address ?? shippingAddress,
        shippingMethod,
        shippingMethodName: method.name,
        payment,
        items,
        totals,
        estimatedDelivery: delivery.toISOString(),
      });

      if (!result.ok || !result.orderId) {
        setError(result.error ?? "We couldn't place your order. Please try again.");
        setIsPlacing(false);
        return;
      }

      clearCart();
      if (promo) removePromo();
      resetCheckout();
      router.push(`/checkout/success?order=${result.orderId}`);
    } catch {
      setError("We couldn't place your order. Please try again.");
      setIsPlacing(false);
    }
  };

  if (!contact || !shippingAddress || !shippingMethod || !payment) {
    return null;
  }

  const method = getShippingMethod(shippingMethod);
  const delivery = estimatedDeliveryDate(method);

  return (
    <div className="space-y-10">
      <header>
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted">
          Step 4 of 4
        </p>
        <h1 className="mt-2 font-display text-3xl lg:text-4xl tracking-tight">
          Review your order
        </h1>
        <p className="mt-2 text-sm text-muted max-w-prose">
          Please double-check the details below. Once you place your order,
          we&apos;ll send a confirmation to your email.
        </p>
      </header>

      {error && (
        <div className="flex items-start gap-3 p-4 bg-error/5 border border-error/20 rounded-md">
          <span className="text-error text-sm">{error}</span>
        </div>
      )}

      <section className="space-y-3">
        <ReviewCard
          icon={Mail}
          title="Contact"
          editHref="/checkout/information"
        >
          <p className="text-sm">{contact.email}</p>
          {contact.marketingOptIn && (
            <p className="text-xs text-muted mt-1">
              Subscribed to Maison emails
            </p>
          )}
        </ReviewCard>

        <ReviewCard
          icon={MapPin}
          title="Ship to"
          editHref="/checkout/information"
        >
          <p className="text-sm">
            {shippingAddress.firstName} {shippingAddress.lastName}
          </p>
          <p className="text-sm text-muted">
            {shippingAddress.addressLine1}
            {shippingAddress.addressLine2
              ? `, ${shippingAddress.addressLine2}`
              : ""}
          </p>
          <p className="text-sm text-muted">
            {shippingAddress.city}, {shippingAddress.state}{" "}
            {shippingAddress.postcode}
          </p>
          <p className="text-sm text-muted">{shippingAddress.country}</p>
        </ReviewCard>

        <ReviewCard
          icon={Truck}
          title="Shipping method"
          editHref="/checkout/shipping"
        >
          <p className="text-sm font-medium">{method.name}</p>
          <p className="text-xs text-muted mt-1">
            {formatEta(method)} · arrives by{" "}
            {delivery.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </p>
        </ReviewCard>

        <ReviewCard
          icon={CreditCard}
          title="Payment"
          editHref="/checkout/payment"
        >
          <p className="text-sm font-mono">
            {payment.cardBrand
              ? `${payment.cardBrand} ending in ${payment.last4}`
              : "Card on file"}
          </p>
          <p className="text-xs text-muted mt-1">
            {payment.provider === "stripe" ? "Stripe" : "Demo"} · ID{" "}
            <span className="font-mono">{payment.intentId.slice(0, 18)}…</span>
          </p>
        </ReviewCard>
      </section>

      <section className="p-5 border border-border rounded-lg bg-card space-y-3">
        <h2 className="font-display text-xl">Items</h2>
        <ul className="divide-y divide-border">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
            >
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase tracking-[0.15em] text-muted">
                  {item.brand}
                </p>
                <p className="font-medium leading-tight truncate">
                  {item.name}
                </p>
                <p className="text-xs text-muted mt-0.5">
                  {item.size} · {item.color} · Qty {item.quantity}
                </p>
              </div>
              <p className="price-mono text-sm font-medium shrink-0">
                {formatPrice(item.price * item.quantity)}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="p-5 border border-foreground/20 rounded-lg bg-card space-y-2">
        <div className="flex items-baseline justify-between text-sm">
          <span className="text-muted">Subtotal</span>
          <span className="price-mono">{formatPrice(totals.subtotal)}</span>
        </div>
        {totals.discount > 0 && (
          <div className="flex items-baseline justify-between text-sm">
            <span className="text-muted">Discount ({promo?.code})</span>
            <span className="price-mono text-success">
              −{formatPrice(totals.discount)}
            </span>
          </div>
        )}
        <div className="flex items-baseline justify-between text-sm">
          <span className="text-muted">Shipping</span>
          <span className="price-mono">
            {totals.shipping === 0 ? (
              <span className="text-success">Free</span>
            ) : (
              formatPrice(totals.shipping)
            )}
          </span>
        </div>
        <div className="flex items-baseline justify-between text-sm">
          <span className="text-muted">Tax</span>
          <span className="price-mono">{formatPrice(totals.tax)}</span>
        </div>
        <div className="border-t border-border pt-3 mt-3 flex items-baseline justify-between">
          <span className="font-display text-xl">Total</span>
          <span className="price-mono text-xl font-medium">
            {formatPrice(totals.total)}
          </span>
        </div>
      </section>

      <div className="flex items-center justify-between gap-3 pt-4">
        <Button
          type="button"
          variant="ghost"
          size="md"
          onClick={() => router.push("/checkout/payment")}
          disabled={isPlacing}
        >
          <ChevronLeft className="h-4 w-4" />
          Payment
        </Button>
        <Button
          type="button"
          size="lg"
          shape="full"
          onClick={onPlaceOrder}
          disabled={isPlacing}
          className="min-w-[200px]"
        >
          {isPlacing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Placing order…
            </>
          ) : (
            <>
              <Lock className="h-4 w-4" />
              Place order · {formatPrice(totals.total)}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

function ReviewCard({
  icon: Icon,
  title,
  editHref,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  editHref: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-5 border border-border rounded-lg bg-card">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted" />
          <h2 className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium">
            {title}
          </h2>
        </div>
        <Link
          href={editHref}
          className="inline-flex items-center gap-1 text-xs text-muted hover:text-foreground transition-colors"
        >
          <Edit3 className="h-3 w-3" />
          Edit
        </Link>
      </div>
      {children}
    </div>
  );
}

void CheckCircle2;
void ChevronRight;
