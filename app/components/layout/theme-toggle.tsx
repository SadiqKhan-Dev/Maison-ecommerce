"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <button
        aria-label="Toggle theme"
        className={cn("p-2 hover:text-accent-dark transition-colors", className)}
        disabled
      >
        <Sun className="h-5 w-5 opacity-0" />
      </button>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn("p-2 hover:text-accent-dark transition-colors", className)}
    >
      <Sun
        className={cn(
          "h-5 w-5 transition-all duration-300",
          isDark ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-0 opacity-0 absolute"
        )}
      />
      <Moon
        className={cn(
          "h-5 w-5 transition-all duration-300",
          isDark ? "-rotate-90 scale-0 opacity-0 absolute" : "rotate-0 scale-100 opacity-100"
        )}
      />
    </button>
  );
}
