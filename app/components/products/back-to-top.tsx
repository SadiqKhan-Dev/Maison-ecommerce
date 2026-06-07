"use client";

import * as React from "react";
import { ChevronLeft } from "lucide-react";

export function BackToTop() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 800);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-30 h-10 w-10 rounded-full bg-foreground text-background shadow-lg flex items-center justify-center hover:bg-accent-dark transition-colors"
      aria-label="Back to top"
    >
      <ChevronLeft className="h-4 w-4 rotate-90" />
    </button>
  );
}
