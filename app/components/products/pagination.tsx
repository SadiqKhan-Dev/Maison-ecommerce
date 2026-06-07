"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

export interface PaginationProps {
  page: number;
  totalPages: number;
}

function buildHref(pathname: string, params: URLSearchParams, page: number) {
  const sp = new URLSearchParams(params.toString());
  if (page <= 1) sp.delete("page");
  else sp.set("page", String(page));
  const qs = sp.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

export function Pagination({ page, totalPages }: PaginationProps) {
  const pathname = usePathname();
  const params = useSearchParams();

  if (totalPages <= 1) return null;

  const pages: (number | "…")[] = [];
  const push = (n: number | "…") =>
    pages[pages.length - 1] !== n && pages.push(n);

  const window = 1;
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= page - window && i <= page + window)
    ) {
      push(i);
    } else if (
      i === page - window - 1 ||
      i === page + window + 1
    ) {
      push("…");
    }
  }

  return (
    <nav
      aria-label="Pagination"
      className="mt-16 flex items-center justify-center gap-1"
    >
      <Link
        href={buildHref(pathname, params, page - 1)}
        aria-disabled={page <= 1}
        className={cn(
          "h-10 w-10 inline-flex items-center justify-center border border-border rounded-full",
          page <= 1
            ? "pointer-events-none opacity-30"
            : "hover:bg-foreground hover:text-background hover:border-foreground transition-colors"
        )}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous page</span>
      </Link>

      {pages.map((p, i) =>
        p === "…" ? (
          <span
            key={`gap-${i}`}
            className="w-8 text-center text-muted text-sm"
            aria-hidden
          >
            …
          </span>
        ) : (
          <Link
            key={p}
            href={buildHref(pathname, params, p)}
            aria-current={p === page ? "page" : undefined}
            className={cn(
              "h-10 w-10 inline-flex items-center justify-center text-sm border rounded-full",
              p === page
                ? "bg-foreground text-background border-foreground"
                : "border-border hover:border-foreground transition-colors"
            )}
          >
            {p}
          </Link>
        )
      )}

      <Link
        href={buildHref(pathname, params, page + 1)}
        aria-disabled={page >= totalPages}
        className={cn(
          "h-10 w-10 inline-flex items-center justify-center border border-border rounded-full",
          page >= totalPages
            ? "pointer-events-none opacity-30"
            : "hover:bg-foreground hover:text-background hover:border-foreground transition-colors"
        )}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next page</span>
      </Link>
    </nav>
  );
}
