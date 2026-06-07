"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, X, Clock, TrendingUp, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { formatPrice } from "@/lib/utils/formatPrice";
import { mockProducts } from "@/data/products";
import {
  getPopularSuggestions,
  searchProducts,
  type SearchResult,
} from "@/lib/search/search";

const RECENT_KEY = "clothing-search-recents";
const MAX_RECENTS = 5;
const MAX_RESULTS = 8;

const POPULAR_CATEGORIES: { label: string; href: string; image: string }[] = [
  {
    label: "Outerwear",
    href: "/products?sub=Outerwear",
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=400&q=70&seed=cat-ow",
  },
  {
    label: "Knitwear",
    href: "/products?sub=Tops",
    image:
      "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?auto=format&fit=crop&w=400&q=70&seed=cat-kn",
  },
  {
    label: "Denim",
    href: "/products?brand=Studio+Seven",
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=400&q=70&seed=cat-de",
  },
  {
    label: "Dresses",
    href: "/women?sub=Dresses",
    image:
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=400&q=70&seed=cat-dr",
  },
];

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

function readRecents(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function writeRecents(items: string[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(items));
  } catch {
    /* ignore quota errors */
  }
}

function useDebouncedValue<T>(value: T, delay: number = 150): T {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  return (
    <AnimatePresence>
      {open && <SearchOverlayContent key="search" onClose={onClose} />}
    </AnimatePresence>
  );
}

function SearchOverlayContent({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const resultsRef = React.useRef<HTMLUListElement>(null);
  const [query, setQuery] = React.useState("");
  const [recents, setRecents] = React.useState<string[]>(() => readRecents());
  const [activeIdx, setActiveIdx] = React.useState(0);
  const debouncedQuery = useDebouncedValue(query, 120);

  const results: SearchResult[] = React.useMemo(() => {
    if (debouncedQuery.trim().length === 0) return [];
    return searchProducts(debouncedQuery, mockProducts, MAX_RESULTS);
  }, [debouncedQuery]);

  const suggestions = React.useMemo(() => getPopularSuggestions(), []);
  const maxIdx = Math.max(0, results.length - 1);
  const safeIdx = Math.min(activeIdx, maxIdx);

  React.useEffect(() => {
    const id = window.setTimeout(() => inputRef.current?.focus(), 30);
    return () => window.clearTimeout(id);
  }, []);

  React.useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const submitQuery = (q: string) => {
    const trimmed = q.trim();
    if (trimmed.length === 0) return;
    const next = [trimmed, ...recents.filter((r) => r !== trimmed)].slice(
      0,
      MAX_RECENTS
    );
    setRecents(next);
    writeRecents(next);
    onClose();
    router.push(`/products?q=${encodeURIComponent(trimmed)}`);
  };

  const goToResult = (slug: string) => {
    if (query.trim().length > 0) {
      const next = [query.trim(), ...recents.filter((r) => r !== query.trim())].slice(
        0,
        MAX_RECENTS
      );
      setRecents(next);
      writeRecents(next);
    }
    onClose();
    router.push(`/products/${slug}`);
  };

  const clearRecents = () => {
    setRecents([]);
    writeRecents([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, maxIdx));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results.length > 0) {
        goToResult(results[safeIdx].product.slug);
      } else if (query.trim().length > 0) {
        submitQuery(query);
      }
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      role="dialog"
      aria-modal="true"
      aria-label="Search the store"
    >
      <div
        className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      <motion.div
        className="relative z-10 bg-background border-b border-border shadow-2xl"
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -24, opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="container-app py-5 flex items-center gap-4">
          <Search className="h-5 w-5 text-muted shrink-0" aria-hidden />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search for products, brands, categories…"
            className="flex-1 bg-transparent text-lg outline-none placeholder:text-muted"
            aria-label="Search the store"
            aria-autocomplete="list"
            aria-controls="search-results"
            aria-activedescendant={
              results[safeIdx] ? `search-result-${safeIdx}` : undefined
            }
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 h-7 px-2 border border-border rounded text-[10px] uppercase tracking-widest text-muted">
            Esc
          </kbd>
          <button
            onClick={onClose}
            aria-label="Close search"
            className="p-2 -mr-2 hover:text-accent-dark transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </motion.div>

      <div
        className="relative z-10 flex-1 overflow-y-auto bg-background"
        onClick={onClose}
      >
        <div
          className="container-app py-8 max-w-4xl"
          onClick={(e) => e.stopPropagation()}
        >
          {results.length > 0 ? (
            <section aria-labelledby="search-results-heading">
              <h2
                id="search-results-heading"
                className="text-[10px] uppercase tracking-[0.3em] text-muted mb-5"
              >
                Products · {results.length}{" "}
                {results.length === 1 ? "result" : "results"}
              </h2>
              <ul
                ref={resultsRef}
                id="search-results"
                role="listbox"
                className="divide-y divide-border/60 border-y border-border/60"
              >
                {results.map((r, i) => {
                  const isActive = i === safeIdx;
                  const price = r.product.salePrice ?? r.product.basePrice;
                  return (
                    <li
                      key={r.product.id}
                      id={`search-result-${i}`}
                      role="option"
                      aria-selected={isActive}
                    >
                      <button
                        onClick={() => goToResult(r.product.slug)}
                        onMouseEnter={() => setActiveIdx(i)}
                        className={cn(
                          "w-full flex items-center gap-5 py-4 text-left transition-colors",
                          isActive && "bg-muted/10"
                        )}
                      >
                        <span className="relative h-16 w-12 sm:h-20 sm:w-16 overflow-hidden rounded-md bg-muted/10 shrink-0">
                          <Image
                            src={r.product.images[0]}
                            alt={r.product.name}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className="block text-[10px] uppercase tracking-[0.2em] text-muted mb-1">
                            {r.product.brand} · {r.product.subCategory}
                          </span>
                          <span className="block font-medium text-foreground truncate">
                            {r.product.name}
                          </span>
                        </span>
                        <span className="hidden sm:flex flex-col items-end gap-1 shrink-0">
                          <span
                            className={cn(
                              "price-mono text-sm font-medium",
                              r.product.salePrice !== undefined &&
                                r.product.salePrice < r.product.basePrice &&
                                "text-sale"
                            )}
                          >
                            {formatPrice(price)}
                          </span>
                          {isActive && (
                            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-muted">
                              Open <ArrowRight className="h-3 w-3" />
                            </span>
                          )}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-4">
                <button
                  onClick={() => submitQuery(query)}
                  className="text-xs uppercase tracking-widest text-muted hover:text-foreground transition-colors"
                >
                  See all results for &ldquo;{query}&rdquo;
                </button>
              </div>
            </section>
          ) : query.trim().length > 0 ? (
            <NoResults query={query} />
          ) : (
            <DefaultView
              recents={recents}
              onPickRecent={(q) => {
                setQuery(q);
                inputRef.current?.focus();
              }}
              onClearRecents={clearRecents}
              suggestions={suggestions}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}

function NoResults({ query }: { query: string }) {
  return (
    <div className="py-16 text-center max-w-md mx-auto">
      <Search className="h-10 w-10 text-muted mx-auto mb-4" aria-hidden />
      <h2 className="font-display text-2xl mb-2">No results</h2>
      <p className="text-sm text-muted">
        Nothing matches &ldquo;{query}&rdquo;. Try a different term, or browse our{" "}
        <Link
          href="/products"
          className="text-foreground underline underline-offset-2"
        >
          full catalog
        </Link>
        .
      </p>
    </div>
  );
}

function DefaultView({
  recents,
  onPickRecent,
  onClearRecents,
  suggestions,
}: {
  recents: string[];
  onPickRecent: (q: string) => void;
  onClearRecents: () => void;
  suggestions: { label: string; href: string }[];
}) {
  return (
    <div className="space-y-12">
      {recents.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[10px] uppercase tracking-[0.3em] text-muted flex items-center gap-2">
              <Clock className="h-3 w-3" aria-hidden /> Recent
            </h2>
            <button
              onClick={onClearRecents}
              className="text-xs uppercase tracking-widest text-muted hover:text-foreground"
            >
              Clear
            </button>
          </div>
          <ul className="flex flex-wrap gap-2">
            {recents.map((r) => (
              <li key={r}>
                <button
                  onClick={() => onPickRecent(r)}
                  className="h-9 px-4 border border-border rounded-full text-sm hover:border-foreground transition-colors"
                >
                  {r}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2 className="text-[10px] uppercase tracking-[0.3em] text-muted mb-5 flex items-center gap-2">
          <TrendingUp className="h-3 w-3" aria-hidden /> Popular searches
        </h2>
        <ul className="flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <li key={s.label}>
              <Link
                href={s.href}
                className="inline-flex items-center gap-1.5 h-9 px-4 border border-border rounded-full text-sm hover:border-foreground transition-colors"
              >
                {s.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-[10px] uppercase tracking-[0.3em] text-muted mb-5">
          Browse categories
        </h2>
        <ul className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {POPULAR_CATEGORIES.map((c) => (
            <li key={c.label}>
              <Link
                href={c.href}
                className="group block relative aspect-[4/5] overflow-hidden rounded-md"
              >
                <Image
                  src={c.image}
                  alt={c.label}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent"
                  aria-hidden
                />
                <span className="absolute inset-x-0 bottom-0 p-3 text-background font-medium text-sm">
                  {c.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
