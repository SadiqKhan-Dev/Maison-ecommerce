"use client";

import * as React from "react";
import Link from "next/link";
import { Star, LogIn, PenLine } from "lucide-react";
import { Container } from "@/app/ui/container";
import { StarRating } from "@/app/ui/star-rating";
import { Button } from "@/app/ui/button";
import { cn } from "@/lib/utils/cn";
import type { Review } from "@/data/reviews";
import {
  getAllReviewsForProduct,
  getReviewStatsForProductCombined,
} from "@/lib/reviews/store";

export interface ReviewsSectionProps {
  productSlug: string;
  isLoggedIn: boolean;
  canReview: boolean;
  reviewHref: string;
  loginHref: string;
}

export function ReviewsSection({
  productSlug,
  isLoggedIn,
  canReview,
  reviewHref,
  loginHref,
}: ReviewsSectionProps) {
  const stats = getReviewStatsForProductCombined(productSlug);
  const reviews = getAllReviewsForProduct(productSlug);
  const [filter, setFilter] = React.useState<number | "all">("all");

  const filtered = filter === "all" ? reviews : reviews.filter((r) => r.rating === filter);

  return (
    <section
      className="py-20 lg:py-28 border-t border-border"
      aria-labelledby="reviews-heading"
    >
      <Container>
        <div className="grid lg:grid-cols-[320px_1fr] gap-10 lg:gap-16">
          <aside>
            <h2
              id="reviews-heading"
              className="font-display text-3xl lg:text-4xl mb-3"
            >
              Reviews
            </h2>
            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-display text-5xl price-mono">
                {stats.average.toFixed(1)}
              </span>
              <div className="flex flex-col">
                <StarRating rating={stats.average} size="md" />
                <span className="text-xs text-muted mt-1">
                  Based on {stats.count} review{stats.count === 1 ? "" : "s"}
                </span>
              </div>
            </div>

            <ul className="space-y-2 mb-6">
              {([5, 4, 3, 2, 1] as const).map((r) => {
                const count = stats.distribution[r];
                const pct = stats.count > 0 ? (count / stats.count) * 100 : 0;
                return (
                  <li key={r}>
                    <button
                      onClick={() =>
                        setFilter((f) => (f === r ? "all" : r))
                      }
                      className="w-full flex items-center gap-2 text-xs hover:text-foreground"
                    >
                      <span className="w-4 text-left price-mono">{r}</span>
                      <Star
                        className={cn(
                          "h-3 w-3",
                          "fill-accent text-accent"
                        )}
                      />
                      <div className="flex-1 h-1.5 bg-muted/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-6 text-right text-muted price-mono">
                        {count}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {canReview ? (
              <Button asChild variant="outline" size="md" shape="full" className="w-full">
                <Link href={reviewHref}>
                  <PenLine className="h-4 w-4" />
                  Write a review
                </Link>
              </Button>
            ) : isLoggedIn ? (
              <Button
                variant="outline"
                size="md"
                shape="full"
                className="w-full"
                disabled
              >
                You&apos;ve reviewed this product
              </Button>
            ) : (
              <Button asChild variant="outline" size="md" shape="full" className="w-full">
                <Link href={loginHref}>
                  <LogIn className="h-4 w-4" />
                  Sign in to review
                </Link>
              </Button>
            )}
          </aside>

          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-sm text-muted">Filter:</span>
              {(["all", 5, 4, 3] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "text-xs px-3 h-7 rounded-full border transition-colors",
                    filter === f
                      ? "bg-foreground text-background border-foreground"
                      : "border-border hover:border-foreground"
                  )}
                >
                  {f === "all" ? "All" : `${f}★`}
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <p className="text-sm text-muted py-10 text-center">
                No reviews for this filter.
              </p>
            ) : (
              <ul className="space-y-8">
                {filtered.map((r) => (
                  <ReviewItem key={r.id} review={r} />
                ))}
              </ul>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

function ReviewItem({ review }: { review: Review }) {
  const [helpful, setHelpful] = React.useState(false);
  const [count, setCount] = React.useState(review.helpfulCount);

  const toggleHelpful = () => {
    setHelpful((h) => {
      setCount((c) => (h ? c - 1 : c + 1));
      return !h;
    });
  };

  return (
    <li className="pb-8 border-b border-border last:border-0">
      <div className="flex items-center gap-3 mb-2">
        <StarRating rating={review.rating} size="sm" />
        {review.verified && (
          <span className="text-[10px] uppercase tracking-widest text-success">
            Verified buyer
          </span>
        )}
      </div>
      <h3 className="font-medium text-base mb-1">{review.title}</h3>
      <p className="text-sm text-muted leading-relaxed mb-4">{review.body}</p>
      <div className="flex items-center justify-between text-xs text-muted">
        <span>
          {review.author} · {review.location} ·{" "}
          {new Date(review.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
        <button
          onClick={toggleHelpful}
          aria-pressed={helpful}
          className={cn(
            "hover:text-foreground transition-colors",
            helpful && "text-foreground"
          )}
        >
          Helpful ({count})
        </button>
      </div>
    </li>
  );
}
