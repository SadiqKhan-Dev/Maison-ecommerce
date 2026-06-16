import * as React from "react";
import { cn } from "@/lib/utils/cn";

const variants = {
  default: "bg-foreground text-background",
  sale: "bg-sale text-background",
  new: "bg-success text-background",
  outline: "border border-foreground/20 text-foreground bg-background",
  muted: "bg-muted/10 text-muted",
  accent: "bg-accent text-foreground",
} as const;

export type BadgeVariant = keyof typeof variants;

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.15em] rounded-full",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
