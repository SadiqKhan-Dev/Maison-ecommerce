"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Star, Check, AlertCircle } from "lucide-react";
import { Button } from "@/app/ui/button";
import { cn } from "@/lib/utils/cn";
import { reviewSchema, type ReviewInput } from "@/lib/validations/review";
import { submitReviewAction, type SubmitReviewState } from "@/app/account/reviews/actions";

interface ReviewFormProps {
  orderId: string;
  productId: string;
  productName: string;
}

export function ReviewForm({ orderId, productId, productName }: ReviewFormProps) {
  const router = useRouter();
  const [state, setState] = React.useState<SubmitReviewState | null>(null);
  const [isPending, startTransition] = React.useTransition();
  const [hoverRating, setHoverRating] = React.useState<number | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ReviewInput>({
    resolver: zodResolver(reviewSchema),
    mode: "onBlur",
    defaultValues: { rating: 0, title: "", body: "" },
  });

  const rating = useWatch({ control, name: "rating" }) ?? 0;
  const bodyValue = useWatch({ control, name: "body" }) ?? "";

  const onSubmit = (data: ReviewInput) => {
    setState(null);
    startTransition(async () => {
      const fd = new FormData();
      fd.append("rating", String(data.rating));
      fd.append("title", data.title);
      fd.append("body", data.body);
      const result = await submitReviewAction(orderId, productId, null, fd);
      setState(result);
      if (result.ok) {
        window.setTimeout(() => {
          router.push(`/account/orders/${orderId}`);
          router.refresh();
        }, 800);
      }
    });
  };

  const titleError = errors.title?.message ?? state?.fieldErrors?.title;
  const bodyError = errors.body?.message ?? state?.fieldErrors?.body;
  const ratingError = errors.rating?.message ?? state?.fieldErrors?.rating;
  const charCount = bodyValue.length;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
      noValidate
      aria-label={`Review ${productName}`}
    >
      {state?.ok && state.message && (
        <div
          role="status"
          className="flex items-start gap-3 p-4 bg-success/5 border border-success/20 rounded-md"
        >
          <Check className="h-5 w-5 text-success shrink-0 mt-0.5" />
          <p className="text-sm text-success">{state.message}</p>
        </div>
      )}
      {state?.error && (
        <div
          role="alert"
          className="flex items-start gap-3 p-4 bg-error/5 border border-error/20 rounded-md"
        >
          <AlertCircle className="h-5 w-5 text-error shrink-0 mt-0.5" />
          <p className="text-sm text-error">{state.error}</p>
        </div>
      )}

      <div>
        <p
          id="rating-label"
          className="block text-[10px] uppercase tracking-[0.2em] font-medium text-muted mb-3"
        >
          Your rating
        </p>
        <div
          className="flex items-center gap-1.5"
          role="radiogroup"
          aria-labelledby="rating-label"
          aria-required="true"
        >
          {[1, 2, 3, 4, 5].map((n) => {
            const active = (hoverRating ?? rating) >= n;
            return (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={rating === n}
                aria-label={`${n} star${n === 1 ? "" : "s"}`}
                onClick={() =>
                  setValue("rating", n, { shouldValidate: true })
                }
                onMouseEnter={() => setHoverRating(n)}
                onMouseLeave={() => setHoverRating(null)}
                className="p-1 -m-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <Star
                  className={cn(
                    "h-7 w-7 transition-colors",
                    active
                      ? "fill-accent text-accent"
                      : "fill-transparent text-muted/40"
                  )}
                />
              </button>
            );
          })}
          {rating > 0 && (
            <span className="ml-3 text-sm text-muted">
              {[1, 2, 3, 4, 5].includes(rating)
                ? ["", "Disappointing", "Just okay", "Good", "Great", "Excellent"][rating]
                : ""}
            </span>
          )}
        </div>
        <input type="hidden" {...register("rating")} />
        {ratingError && (
          <p className="mt-2 text-xs text-error">{ratingError}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="title"
          className="block text-[10px] uppercase tracking-[0.2em] font-medium text-muted mb-2"
        >
          Headline
        </label>
        <input
          id="title"
          type="text"
          maxLength={80}
          placeholder="Sum up your experience in a few words"
          aria-invalid={!!titleError}
          aria-describedby={titleError ? "title-error" : undefined}
          className={cn(
            "w-full h-12 px-4 bg-background border rounded-md text-sm transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent",
            titleError ? "border-error" : "border-border"
          )}
          {...register("title")}
        />
        {titleError && (
          <p id="title-error" className="mt-1.5 text-xs text-error">
            {titleError}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="body"
          className="block text-[10px] uppercase tracking-[0.2em] font-medium text-muted mb-2"
        >
          Your review
        </label>
        <textarea
          id="body"
          rows={6}
          maxLength={2000}
          placeholder="What did you love (or not)? How does it fit, feel, hold up?"
          aria-invalid={!!bodyError}
          aria-describedby={bodyError ? "body-error" : undefined}
          className={cn(
            "w-full px-4 py-3 bg-background border rounded-md text-sm leading-relaxed transition-colors resize-y",
            "focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent",
            bodyError ? "border-error" : "border-border"
          )}
          {...register("body")}
        />
        <div className="flex items-center justify-between mt-1.5">
          {bodyError ? (
            <p id="body-error" className="text-xs text-error">
              {bodyError}
            </p>
          ) : (
            <p className="text-xs text-muted">
              Between 10 and 2000 characters.
            </p>
          )}
          <p className="text-xs text-muted price-mono">{charCount}/2000</p>
        </div>
      </div>

      <div className="pt-2 flex items-center gap-3">
        <Button
          type="submit"
          size="md"
          shape="full"
          disabled={isPending || isSubmitting || (state?.ok ?? false)}
        >
          {isPending || isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting…
            </>
          ) : (
            "Submit review"
          )}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="md"
          shape="full"
          onClick={() => router.push(`/account/orders/${orderId}`)}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
