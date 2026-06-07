"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Truck } from "lucide-react";
import { Button } from "@/app/ui/button";
import { useCheckoutStore } from "@/lib/store/checkoutStore";
import { useCartStore } from "@/lib/store/cartStore";
import {
  SHIPPING_METHODS,
  formatEta,
  estimatedDeliveryDate,
} from "@/lib/checkout/shipping";
import { cn } from "@/lib/utils/cn";
import { formatPrice } from "@/lib/utils/formatPrice";

export function ShippingStep() {
  const router = useRouter();
  const setCurrentStep = useCheckoutStore((s) => s.setCurrentStep);
  const shippingMethod = useCheckoutStore((s) => s.shippingMethod);
  const setShippingMethod = useCheckoutStore((s) => s.setShippingMethod);
  const contact = useCheckoutStore((s) => s.contact);
  const shippingAddress = useCheckoutStore((s) => s.shippingAddress);
  const items = useCartStore((s) => s.items);

  React.useEffect(() => {
    setCurrentStep("shipping");
  }, [setCurrentStep]);

  React.useEffect(() => {
    if (items.length === 0) {
      router.replace("/cart");
      return;
    }
    if (!contact || !shippingAddress) {
      router.replace("/checkout/information");
    }
  }, [items.length, contact, shippingAddress, router]);

  const handleContinue = () => {
    if (!shippingMethod) return;
    router.push("/checkout/payment");
  };

  return (
    <div className="space-y-10">
      <header>
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted">
          Step 2 of 4
        </p>
        <h1 className="mt-2 font-display text-3xl lg:text-4xl tracking-tight">
          Shipping method
        </h1>
        <p className="mt-2 text-sm text-muted max-w-prose">
          Choose how fast you&apos;d like your order. All methods are
          carbon-neutral and include tracking.
        </p>
      </header>

      <section className="space-y-3">
        {SHIPPING_METHODS.map((method) => {
          const selected = shippingMethod === method.id;
          const eta = formatEta(method);
          const delivery = estimatedDeliveryDate(method);
          return (
            <label
              key={method.id}
              className={cn(
                "group flex items-start gap-4 p-5 border rounded-lg cursor-pointer transition-all",
                selected
                  ? "border-foreground bg-foreground/[0.03] ring-1 ring-foreground"
                  : "border-border hover:border-foreground/40"
              )}
            >
              <input
                type="radio"
                name="shipping-method"
                value={method.id}
                checked={selected}
                onChange={() => setShippingMethod(method.id)}
                className="sr-only"
              />
              <div
                className={cn(
                  "mt-0.5 h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0",
                  selected ? "border-foreground" : "border-muted/40"
                )}
              >
                {selected && (
                  <div className="h-2.5 w-2.5 rounded-full bg-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-muted" />
                  <h3 className="font-display text-lg">{method.name}</h3>
                </div>
                <p className="mt-1 text-sm text-muted">{method.description}</p>
                <p className="mt-2 text-xs text-muted">
                  Arrives in <span className="text-foreground font-medium">{eta}</span>
                  {" · "}by{" "}
                  <span className="text-foreground font-medium">
                    {delivery.toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </p>
              </div>
              <p className="price-mono text-base font-medium shrink-0">
                {formatPrice(method.price)}
              </p>
            </label>
          );
        })}
      </section>

      <div className="flex items-center justify-between gap-3 pt-4">
        <Button
          type="button"
          variant="ghost"
          size="md"
          onClick={() => router.push("/checkout/information")}
        >
          <ChevronLeft className="h-4 w-4" />
          Information
        </Button>
        <Button
          type="button"
          size="lg"
          shape="full"
          onClick={handleContinue}
          disabled={!shippingMethod}
        >
          Continue to payment
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
