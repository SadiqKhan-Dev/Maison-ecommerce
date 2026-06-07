"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import {
  SORT_LABELS,
  type SortKey,
} from "@/lib/utils/filterProducts";
import { useSingleFilter } from "@/lib/hooks/useFilterUrl";
import { cn } from "@/lib/utils/cn";

const OPTIONS: SortKey[] = [
  "newest",
  "popular",
  "price_asc",
  "price_desc",
  "rating",
];

export function ProductSort({
  className,
}: {
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const { value, setValue } = useSingleFilter("sort");
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const current = (value as SortKey) || "newest";

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="inline-flex items-center gap-2 h-10 px-4 border border-border text-sm hover:border-foreground transition-colors"
      >
        <span className="text-muted">Sort by:</span>
        <span className="font-medium">{SORT_LABELS[current]}</span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute right-0 z-30 mt-2 w-56 bg-card border border-border rounded-md shadow-lg py-1"
        >
          {OPTIONS.map((opt) => (
            <li key={opt} role="option" aria-selected={opt === current}>
              <button
                onClick={() => {
                  setValue(opt);
                  setOpen(false);
                }}
                className={cn(
                  "w-full text-left px-4 py-2 text-sm hover:bg-muted/10 transition-colors",
                  opt === current && "font-medium text-accent-dark"
                )}
              >
                {SORT_LABELS[opt]}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
