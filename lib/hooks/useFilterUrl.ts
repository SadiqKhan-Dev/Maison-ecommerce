"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

/**
 * Returns a setter for a comma-separated list filter (e.g. size, color, brand).
 * Toggling adds/removes the value and resets the page to 1.
 */
export function useMultiFilter(key: string) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const value = React.useMemo(
    () => params.get(key)?.split(",").filter(Boolean) ?? [],
    [params, key]
  );

  const setValue = React.useCallback(
    (next: string[]) => {
      const sp = new URLSearchParams(params.toString());
      if (next.length === 0) sp.delete(key);
      else sp.set(key, next.join(","));
      sp.delete("page");
      router.replace(`${pathname}?${sp.toString()}`, { scroll: false });
    },
    [key, params, pathname, router]
  );

  const toggle = React.useCallback(
    (v: string) => {
      setValue(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
    },
    [value, setValue]
  );

  return { value, setValue, toggle };
}

/** Setter for a single-value filter (e.g. sort, rating). */
export function useSingleFilter(key: string) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const value = params.get(key);

  const setValue = React.useCallback(
    (next: string | null) => {
      const sp = new URLSearchParams(params.toString());
      if (next === null || next === "") sp.delete(key);
      else sp.set(key, next);
      if (key !== "page") sp.delete("page");
      router.replace(`${pathname}?${sp.toString()}`, { scroll: false });
    },
    [key, params, pathname, router]
  );

  return { value, setValue };
}

/** Clear all filters. */
export function useClearFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  return React.useCallback(() => {
    const sp = new URLSearchParams(params.toString());
    Array.from(sp.keys()).forEach((k) => {
      if (k !== "sort") sp.delete(k);
    });
    sp.set("sort", "newest");
    router.replace(`${pathname}?${sp.toString()}`, { scroll: false });
  }, [params, pathname, router]);
}
