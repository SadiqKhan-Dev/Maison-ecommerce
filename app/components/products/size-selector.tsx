"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface SizeSelectorProps {
  sizes: { size: string; stock: number }[];
  value?: string;
  onChange: (size: string) => void;
}

export function SizeSelector({ sizes, value, onChange }: SizeSelectorProps) {
  if (sizes.length === 0) return null;

  return (
    <fieldset>
      <legend className="flex items-center justify-between w-full mb-3">
        <span className="text-sm font-medium">
          Size{value ? `: ${value}` : ""}
        </span>
        <button
          type="button"
          className="text-xs uppercase tracking-widest text-muted hover:text-foreground underline-offset-2 hover:underline"
        >
          Size guide
        </button>
      </legend>
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
        {sizes.map(({ size, stock }) => {
          const oos = stock <= 0;
          const active = value === size;
          return (
            <button
              key={size}
              type="button"
              onClick={() => !oos && onChange(size)}
              disabled={oos}
              aria-pressed={active}
              title={oos ? "Out of stock" : undefined}
              className={cn(
                "h-11 text-sm font-medium border rounded-md transition-colors relative",
                active
                  ? "bg-foreground text-background border-foreground"
                  : oos
                    ? "border-border text-muted/50 cursor-not-allowed line-through"
                    : "border-border hover:border-foreground"
              )}
            >
              {size}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
