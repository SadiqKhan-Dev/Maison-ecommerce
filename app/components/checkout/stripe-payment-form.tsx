"use client";

import * as React from "react";
import { Loader2, Lock, AlertCircle } from "lucide-react";
import { Button } from "@/app/ui/button";
import { getStripePublishableKey } from "@/lib/checkout/stripe";

type StripeInstance = {
  confirmPayment: (opts: {
    elements: unknown;
    clientSecret: string;
    confirmParams?: { return_url: string };
    redirect?: "if_required" | "always";
  }) => Promise<{
    error?: { message?: string };
    paymentIntent?: {
      id: string;
      payment_method?: {
        card?: { last4?: string; brand?: string };
      };
    };
  }>;
};

type ElementsInstance = {
  submit: () => Promise<{ error?: { message?: string } }>;
};

type ReactStripeMod = {
  Elements: React.ComponentType<{
    stripe: Promise<unknown> | null;
    options: { clientSecret: string; appearance?: { theme?: string } };
    children: React.ReactNode;
  }>;
  PaymentElement: React.ComponentType<{ options?: { layout?: string } }>;
  useStripe: () => StripeInstance | null;
  useElements: () => ElementsInstance | null;
};

export function StripePaymentForm({
  clientSecret,
  onSuccess,
}: {
  clientSecret: string;
  onSuccess: (details: { last4?: string; brand?: string }) => void;
}) {
  const [mod, setMod] = React.useState<ReactStripeMod | null>(null);
  const [stripePromise, setStripePromise] =
    React.useState<Promise<unknown> | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    Promise.all([
      import("@stripe/stripe-js"),
      import("@stripe/react-stripe-js"),
    ]).then(([stripeMod, reactMod]) => {
      if (cancelled) return;
      const publishableKey = getStripePublishableKey();
      if (!publishableKey) {
        setError("Stripe publishable key missing");
        return;
      }
      setStripePromise(stripeMod.loadStripe(publishableKey));
      setMod(reactMod as unknown as ReactStripeMod);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div className="flex items-start gap-3 p-4 bg-error/5 border border-error/20 rounded-md">
        <AlertCircle className="h-5 w-5 text-error shrink-0 mt-0.5" />
        <p className="text-sm text-error">{error}</p>
      </div>
    );
  }

  if (!mod || !stripePromise) {
    return (
      <div className="flex items-center gap-3 p-6 border border-border rounded-lg bg-card text-sm text-muted">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading secure payment form…
      </div>
    );
  }

  const { Elements } = mod;

  return (
    <Elements
      stripe={stripePromise}
      options={{ clientSecret, appearance: { theme: "stripe" } }}
    >
      <StripeInner
        mod={mod}
        onSuccess={onSuccess}
        clientSecret={clientSecret}
      />
      <PaymentElementShim mod={mod} />
    </Elements>
  );
}

function StripeInner({
  mod,
  onSuccess,
  clientSecret,
}: {
  mod: ReactStripeMod;
  onSuccess: (details: { last4?: string; brand?: string }) => void;
  clientSecret: string;
}) {
  const stripe = mod.useStripe();
  const elements = mod.useElements();
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setError(null);
    setSubmitting(true);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message ?? "Please complete all required fields.");
      setSubmitting(false);
      return;
    }

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url:
          typeof window !== "undefined"
            ? window.location.origin + "/checkout/review"
            : "",
      },
      redirect: "if_required",
    });

    if (confirmError) {
      setError(confirmError.message ?? "Payment failed");
      setSubmitting(false);
      return;
    }

    onSuccess({
      last4: paymentIntent?.payment_method?.card?.last4,
      brand: paymentIntent?.payment_method?.card?.brand,
    });
    setSubmitting(false);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {error && (
        <p className="text-sm text-error flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          {error}
        </p>
      )}
      <Button
        type="submit"
        size="lg"
        shape="full"
        className="w-full"
        disabled={submitting || !stripe || !elements}
      >
        {submitting ? (
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
    </form>
  );
}

function PaymentElementShim({ mod }: { mod: ReactStripeMod }) {
  const PaymentElement = mod.PaymentElement;
  return (
    <div className="p-5 border border-border rounded-lg bg-card">
      <PaymentElement options={{ layout: "tabs" }} />
    </div>
  );
}
