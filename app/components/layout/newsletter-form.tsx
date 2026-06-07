"use client";

import * as React from "react";

export function NewsletterForm({
  variant = "footer",
}: {
  variant?: "footer" | "inline";
}) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  if (variant === "inline") {
    return (
      <form
        onSubmit={handleSubmit}
        className="flex gap-0 max-w-md w-full"
        aria-label="Newsletter subscription"
      >
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          placeholder="your@email.com"
          className="flex-1 h-12 bg-transparent border border-foreground/30 px-4 text-sm placeholder:text-muted/50 focus:outline-none focus:border-foreground"
        />
        <button
          type="submit"
          className="h-12 px-6 bg-foreground text-background text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-accent hover:text-foreground transition-colors"
        >
          Subscribe
        </button>
      </form>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-0 max-w-md w-full"
      aria-label="Newsletter subscription"
    >
      <label htmlFor="footer-email" className="sr-only">
        Email address
      </label>
      <input
        id="footer-email"
        type="email"
        required
        placeholder="your@email.com"
        className="flex-1 h-12 bg-transparent border border-background/30 px-4 text-sm placeholder:text-background/40 focus:outline-none focus:border-accent"
      />
      <button
        type="submit"
        className="h-12 px-6 bg-accent text-foreground text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-accent-dark hover:text-background transition-colors"
      >
        Subscribe
      </button>
    </form>
  );
}
