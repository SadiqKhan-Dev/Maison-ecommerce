"use client";

import * as React from "react";
import { Plus, Minus, Truck, Calendar } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

export function ProductAccordion({ items }: { items: AccordionItem[] }) {
  const [open, setOpen] = React.useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="border-t border-border">
      {items.map((item) => {
        const isOpen = open === item.id;
        return (
          <div key={item.id} className="border-b border-border">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : item.id)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between py-5 text-left"
            >
              <span className="text-sm font-medium uppercase tracking-wider">
                {item.title}
              </span>
              {isOpen ? (
                <Minus className="h-4 w-4" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
            </button>
            <div
              className={cn(
                "grid transition-all duration-300 ease-out",
                isOpen ? "grid-rows-[1fr] pb-6" : "grid-rows-[0fr]"
              )}
            >
              <div className="overflow-hidden text-sm text-muted leading-relaxed">
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function DeliveryEstimator() {
  const [postcode, setPostcode] = React.useState("");
  const [estimate, setEstimate] = React.useState<string | null>(null);

  const handleEstimate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postcode.trim()) return;
    const days = 3 + (postcode.length % 4);
    const date = new Date();
    date.setDate(date.getDate() + days);
    setEstimate(
      date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    );
  };

  return (
    <div className="border border-border rounded-md p-4">
      <div className="flex items-center gap-2 mb-2">
        <Truck className="h-4 w-4 text-accent-dark" />
        <span className="text-sm font-medium">Estimated delivery</span>
      </div>
      <form
        onSubmit={handleEstimate}
        className="flex items-center gap-2"
        aria-label="Estimate delivery"
      >
        <label htmlFor="postcode" className="sr-only">
          Postcode
        </label>
        <input
          id="postcode"
          type="text"
          value={postcode}
          onChange={(e) => setPostcode(e.target.value)}
          placeholder="Enter postcode"
          className="flex-1 h-9 bg-transparent border-b border-foreground/30 text-sm outline-none focus:border-foreground placeholder:text-muted/60 price-mono"
        />
        <button
          type="submit"
          className="text-xs uppercase tracking-widest hover:text-accent-dark"
        >
          Check
        </button>
      </form>
      {estimate && (
        <p className="mt-2 text-xs text-foreground flex items-center gap-1.5">
          <Calendar className="h-3 w-3" />
          Arrives by {estimate}
        </p>
      )}
    </div>
  );
}
