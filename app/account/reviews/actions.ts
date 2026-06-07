"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { reviewSchema } from "@/lib/validations/review";
import { addUserReview, hasUserReviewedProduct } from "@/lib/reviews/store";
import { getOrderById } from "@/lib/checkout/orders";
import { getProductById } from "@/lib/utils/products-lookup";
import { findUserById } from "@/lib/auth/users";

export interface SubmitReviewState {
  ok: boolean;
  message?: string;
  error?: string;
  fieldErrors?: Partial<Record<"rating" | "title" | "body", string>>;
}

export async function submitReviewAction(
  orderId: string,
  productId: string,
  _prev: SubmitReviewState | null,
  formData: FormData
): Promise<SubmitReviewState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "You must be signed in to write a review." };
  }

  const raw = {
    rating: Number(formData.get("rating") ?? 0),
    title: String(formData.get("title") ?? ""),
    body: String(formData.get("body") ?? ""),
  };

  const parsed = reviewSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: SubmitReviewState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof NonNullable<SubmitReviewState["fieldErrors"]>;
      if (key && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return { ok: false, fieldErrors };
  }

  const order = getOrderById(orderId);
  if (!order) {
    return { ok: false, error: "Order not found." };
  }
  if (order.userId !== session.user.id) {
    return { ok: false, error: "You can only review products from your own orders." };
  }
  if (order.status === "CANCELLED" || order.status === "RETURNED") {
    return { ok: false, error: "This order is no longer eligible for reviews." };
  }
  const hasItem = order.items.some((i) => i.productId === productId);
  if (!hasItem) {
    return { ok: false, error: "This product was not part of this order." };
  }

  const product = getProductById(productId);
  if (!product) {
    return { ok: false, error: "Product not found." };
  }

  if (hasUserReviewedProduct(session.user.id, productId)) {
    return { ok: false, error: "You&apos;ve already reviewed this product." };
  }

  const user = findUserById(session.user.id);
  addUserReview({
    userId: session.user.id,
    productId,
    productSlug: product.slug,
    orderId,
    author: user?.name ?? session.user.name ?? "Maison member",
    location: "Verified buyer",
    rating: parsed.data.rating,
    title: parsed.data.title,
    body: parsed.data.body,
  });

  revalidatePath(`/products/${product.slug}`);
  revalidatePath(`/account/orders/${orderId}`);

  return { ok: true, message: "Thanks for sharing your thoughts." };
}
