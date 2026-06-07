"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  CreditCard,
  Lock,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/app/ui/button";
import { useCheckoutStore } from "@/lib/store/checkoutStore";
import { useCartStore } from "@/lib/store/cartStore";
import { computeCheckoutTotals } from "@/lib/checkout/totals";
import { cn } from "@/lib/utils/cn";
import { cardSchema } from "@/lib/validations/checkout";
import { usePromoStore } from "@/lib/store/promoStore";
import { getStripePublishableKey } from "@/lib/checkout/stripe";
import { StripePaymentForm } from "./stripe-payment-form";

type Provider = "stripe" | "mock";

interface PaymentIntentResponse {
  provider: Provider;
  clientSecret: string;
  intentId: string;
}

const TEST_CARDS = [
  { brand: "Visa", num: "4242 4242 4242 4242" },
  { brand: "Mastercard", num: "5555 5555 5555 4444" },
  { brand: "Amex", num: "3782 822463 10005" },
];

export function PaymentStep() {
  const router = useRouter();
  const setCurrentStep = useCheckoutStore((s) => s.setCurrentStep);
  const contact = useCheckoutStore((s) => s.contact);
  const shippingAddress = useCheckoutStore((s) => s.shippingAddress);
  const shippingMethod = useCheckoutStore((s) => s.shippingMethod);
  const setPayment = useCheckoutStore((s) => s.setPayment);
  const items = useCartStore((s) => s.items);
  const promo = usePromoStore((s) => s.applied);

  const [provider] = React.useState<Provider>(() =>
    getStripePublishableKey() ? "stripe" : "mock"
  );
  const [intentData, setIntentData] =
    React.useState<PaymentIntentResponse | null>(null);
  const [isCreatingIntent, setIsCreatingIntent] = React.useState(false);
  const [intentError, setIntentError] = React.useState<string | null>(null);

  const totals = computeCheckoutTotals(
    items,
    shippingMethod,
    promo?.code ?? null
  );

  const createIntent = React.useCallback(async () => {
    setIsCreatingIntent(true);
    setIntentError(null);
    try {
      const res = await fetch("/api/checkout/payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(totals.total * 100),
          currency: "usd",
          metadata: { step: "payment" },
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Failed to initialize payment");
      }
      const data = (await res.json()) as PaymentIntentResponse;
      setIntentData(data);
    } catch (e) {
      setIntentError(
        e instanceof Error
          ? e.message
          : "We couldn't initialize the payment. Please try again."
      );
    } finally {
      setIsCreatingIntent(false);
    }
  }, [totals.total]);

  React.useEffect(() => {
    setCurrentStep("payment");
  }, [setCurrentStep]);

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
    if (provider === "stripe" && !intentData && !isCreatingIntent) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void createIntent();
    }
  }, [
    items.length,
    contact,
    shippingAddress,
    shippingMethod,
    provider,
    intentData,
    isCreatingIntent,
    createIntent,
    router,
  ]);

  const handlePaymentSuccess = (details: {
    last4?: string;
    brand?: string;
  }) => {
    if (!intentData) return;
    setPayment({
      provider: provider,
      last4: details.last4,
      cardBrand: details.brand,
      intentId: intentData.intentId,
      status: "succeeded",
    });
    router.push("/checkout/review");
  };

  return (
    <div className="space-y-10">
      <header>
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted">
          Step 3 of 4
        </p>
        <h1 className="mt-2 font-display text-3xl lg:text-4xl tracking-tight">
          Payment
        </h1>
        <p className="mt-2 text-sm text-muted max-w-prose flex items-center gap-2 flex-wrap">
          <Lock className="h-3.5 w-3.5" />
          All transactions are encrypted and securely processed.
          {provider === "mock" && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-accent/15 text-accent-dark text-[10px] uppercase tracking-wider rounded-full ml-1">
              Demo mode
            </span>
          )}
        </p>
      </header>

      {intentError && provider === "stripe" && (
        <div className="flex items-start gap-3 p-4 bg-error/5 border border-error/20 rounded-md">
          <AlertCircle className="h-5 w-5 text-error shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-error">{intentError}</p>
            <button
              type="button"
              onClick={createIntent}
              className="mt-2 text-xs underline underline-offset-4 text-foreground"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {provider === "stripe" && intentData ? (
        <StripePaymentForm
          clientSecret={intentData.clientSecret}
          onSuccess={handlePaymentSuccess}
        />
      ) : provider === "stripe" && isCreatingIntent ? (
        <div className="flex items-center gap-3 p-6 border border-border rounded-lg bg-card text-sm text-muted">
          <Loader2 className="h-4 w-4 animate-spin" />
          Preparing secure payment form…
        </div>
      ) : provider === "mock" ? (
        <MockPaymentForm onSuccess={handlePaymentSuccess} />
      ) : null}

      <div className="flex items-center justify-between gap-3 pt-4">
        <Button
          type="button"
          variant="ghost"
          size="md"
          onClick={() => router.push("/checkout/shipping")}
        >
          <ChevronLeft className="h-4 w-4" />
          Shipping
        </Button>
      </div>
    </div>
  );
}

function MockPaymentForm({
  onSuccess,
}: {
  onSuccess: (details: { last4: string; brand: string }) => void;
}) {
  const [cardNumber, setCardNumber] = React.useState("");
  const [expiry, setExpiry] = React.useState("");
  const [cvc, setCvc] = React.useState("");
  const [name, setName] = React.useState("");
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = React.useState(false);

  const formatCardNumber = (raw: string): string => {
    const digits = raw.replace(/\D/g, "").slice(0, 19);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (raw: string): string => {
    const digits = raw.replace(/\D/g, "").slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  };

  const detectBrand = (num: string): string => {
    const digits = num.replace(/\D/g, "");
    if (/^4/.test(digits)) return "Visa";
    if (/^(5[1-5]|2[2-7])/.test(digits)) return "Mastercard";
    if (/^3[47]/.test(digits)) return "Amex";
    if (/^6/.test(digits)) return "Discover";
    return "";
  };

  const handleCardChange = (raw: string) => {
    setCardNumber(formatCardNumber(raw));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const parsed = cardSchema.safeParse({
      number: cardNumber,
      expiry,
      cvc,
      name,
    });
    if (!parsed.success) {
      const next: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const key = issue.path[0] as string;
        if (key && !next[key]) next[key] = issue.message;
      });
      setErrors(next);
      return;
    }

    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsProcessing(false);

    const digits = cardNumber.replace(/\D/g, "");
    onSuccess({
      last4: digits.slice(-4),
      brand: detectBrand(digits),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <label
          htmlFor="cardNumber"
          className="block text-[10px] uppercase tracking-[0.2em] font-medium text-muted mb-2"
        >
          Card number
        </label>
        <div className="relative">
          <CreditCard
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none"
            aria-hidden
          />
          <input
            id="cardNumber"
            type="text"
            inputMode="numeric"
            autoComplete="cc-number"
            placeholder="1234 1234 1234 1234"
            value={cardNumber}
            onChange={(e) => handleCardChange(e.target.value)}
            aria-invalid={!!errors.number}
            className={cn(
              "w-full h-12 pl-10 pr-4 bg-background border rounded-md text-sm font-mono transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent",
              errors.number ? "border-error" : "border-border"
            )}
          />
        </div>
        {errors.number && (
          <p className="mt-1.5 text-xs text-error">{errors.number}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="expiry"
            className="block text-[10px] uppercase tracking-[0.2em] font-medium text-muted mb-2"
          >
            Expiry
          </label>
          <input
            id="expiry"
            type="text"
            inputMode="numeric"
            autoComplete="cc-exp"
            placeholder="MM/YY"
            value={expiry}
            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
            aria-invalid={!!errors.expiry}
            className={cn(
              "w-full h-12 px-3 bg-background border rounded-md text-sm font-mono transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent",
              errors.expiry ? "border-error" : "border-border"
            )}
          />
          {errors.expiry && (
            <p className="mt-1.5 text-xs text-error">{errors.expiry}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="cvc"
            className="block text-[10px] uppercase tracking-[0.2em] font-medium text-muted mb-2"
          >
            CVC
          </label>
          <input
            id="cvc"
            type="text"
            inputMode="numeric"
            autoComplete="cc-csc"
            placeholder="123"
            maxLength={4}
            value={cvc}
            onChange={(e) => setCvc(e.target.value.replace(/\D/g, ""))}
            aria-invalid={!!errors.cvc}
            className={cn(
              "w-full h-12 px-3 bg-background border rounded-md text-sm font-mono transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent",
              errors.cvc ? "border-error" : "border-border"
            )}
          />
          {errors.cvc && (
            <p className="mt-1.5 text-xs text-error">{errors.cvc}</p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="cardName"
          className="block text-[10px] uppercase tracking-[0.2em] font-medium text-muted mb-2"
        >
          Name on card
        </label>
        <input
          id="cardName"
          type="text"
          autoComplete="cc-name"
          placeholder="Full name as shown on card"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-invalid={!!errors.name}
          className={cn(
            "w-full h-12 px-3 bg-background border rounded-md text-sm transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent",
            errors.name ? "border-error" : "border-border"
          )}
        />
        {errors.name && (
          <p className="mt-1.5 text-xs text-error">{errors.name}</p>
        )}
      </div>

      <Button
        type="submit"
        size="lg"
        shape="full"
        className="w-full"
        disabled={isProcessing}
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing payment…
          </>
        ) : (
          <>
            <Lock className="h-4 w-4" />
            Save and continue
          </>
        )}
      </Button>

      <div className="p-4 bg-muted/5 border border-border rounded-md">
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted mb-2">
          Test cards (no real charge)
        </p>
        <ul className="space-y-1 text-xs text-muted font-mono">
          {TEST_CARDS.map((c) => (
            <li key={c.brand} className="flex justify-between">
              <span>{c.brand}</span>
              <span>{c.num}</span>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-[10px] text-muted">
          Use any future expiry (e.g. 12/30) and any 3-digit CVC.
        </p>
      </div>
    </form>
  );
}
