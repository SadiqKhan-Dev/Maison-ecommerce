"use client";

import * as React from "react";
import { Check, Tag, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { findPromoByCode, type Promo } from "@/lib/checkout/promos";

export type AppliedPromo = Promo;

export function PromoCodeInput({
  applied,
  onApply,
  onRemove,
  className,
}: {
  applied: AppliedPromo | null;
  onApply: (promo: AppliedPromo) => void;
  onRemove: () => void;
  className?: string;
}) {
  const [code, setCode] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const promo = findPromoByCode(code);
    if (!promo) {
      setError("Invalid code");
      return;
    }
    onApply(promo);
    setCode("");
  };

  if (applied) {
    return (
      <div
        className={cn(
          "flex items-center justify-between gap-2 h-11 px-3 bg-success/10 border border-success/30 rounded-md text-sm",
          className
        )}
      >
        <span className="flex items-center gap-2 text-success">
          <Check className="h-4 w-4" />
          <span className="font-medium">{applied.code}</span>
          <span className="text-muted">— {applied.label} applied</span>
        </span>
        <button
          onClick={onRemove}
          aria-label="Remove promo code"
          className="text-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-1.5", className)}>
      <div className="flex items-stretch">
        <div className="flex items-center px-3 border border-r-0 border-border rounded-l-md text-muted">
          <Tag className="h-4 w-4" />
        </div>
        <label htmlFor="promo" className="sr-only">
          Promo code
        </label>
        <input
          id="promo"
          type="text"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setError(null);
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
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs text-error"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}
