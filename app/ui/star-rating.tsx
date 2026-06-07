import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface StarRatingProps {
  rating: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  showCount?: number;
  className?: string;
}

const sizeMap = {
  sm: "h-3 w-3",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

export function StarRating({
  rating,
  max = 5,
  size = "md",
  showCount,
  className,
}: StarRatingProps) {
  return (
    <div
      className={cn("inline-flex items-center gap-1", className)}
      role="img"
      aria-label={`Rated ${rating} out of ${max} stars`}
    >
      <div className="flex">
        {Array.from({ length: max }).map((_, i) => {
          const filled = i < Math.round(rating);
          return (
            <Star
              key={i}
              className={cn(
                sizeMap[size],
                filled
                  ? "fill-accent text-accent"
                  : "fill-transparent text-muted/40"
              )}
            />
          );
        })}
      </div>
      {showCount !== undefined && (
        <span className="text-xs text-muted ml-1">({showCount})</span>
      )}
    </div>
  );
}
