"use client";

import * as React from "react";
import { Truck, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const messages = [
  "Complimentary shipping on orders over $150",
  "Use code EDIT10 for 10% off your first order",
  "Free returns within 30 days",
];

export function AnnouncementBar({ className }: { className?: string }) {
  const [dismissed, setDismissed] = React.useState(false);
  if (dismissed) return null;

  return (
    <div
      className={cn(
        "relative bg-[#1a1a18] text-[#fafaf8] dark:bg-[#0a0a09] dark:text-[#f0efe8] text-xs",
        className
      )}
      role="region"
      aria-label="Announcements"
    >
      <div className="overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap py-2.5">
          {[...messages, ...messages, ...messages].map((m, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-8 text-[11px] uppercase tracking-[0.18em]"
            >
              <Truck className="h-3 w-3 opacity-70" aria-hidden />
              <span>{m}</span>
              <span className="opacity-30" aria-hidden>
                •
              </span>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss announcements"
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:opacity-70 transition-opacity"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
