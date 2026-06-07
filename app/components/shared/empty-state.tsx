import * as React from "react";
import Link from "next/link";
import { Button } from "@/app/ui/button";

export interface EmptyStateProps {
  title: string;
  body?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({
  title,
  body,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="py-20 lg:py-28 text-center max-w-md mx-auto">
      <h2 className="font-display text-3xl lg:text-4xl mb-3">{title}</h2>
      {body && <p className="text-sm text-muted mb-6">{body}</p>}
      {actionLabel &&
        (actionHref ? (
          <Button asChild>
            <Link href={actionHref}>{actionLabel}</Link>
          </Button>
        ) : onAction ? (
          <Button onClick={onAction}>{actionLabel}</Button>
        ) : null)}
    </div>
  );
}
