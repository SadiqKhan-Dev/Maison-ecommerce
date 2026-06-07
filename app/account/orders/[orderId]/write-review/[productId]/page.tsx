import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { auth } from "@/auth";
import { getOrderById } from "@/lib/checkout/orders";
import { getProductById } from "@/lib/utils/products-lookup";
import { hasUserReviewedProduct } from "@/lib/reviews/store";
import { ReviewForm } from "./review-form";

export const metadata: Metadata = {
  title: "Write a review",
  description: "Share your thoughts on a recent purchase.",
  robots: { index: false, follow: false },
};

interface PageParams {
  orderId: string;
  productId: string;
}

export default async function WriteReviewPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { orderId, productId } = await params;
  const session = await auth();
  if (!session?.user) {
    redirect(`/auth/login?callbackUrl=/account/orders/${orderId}/write-review/${productId}`);
  }

  const order = getOrderById(orderId);
  if (!order) notFound();
  if (order.userId !== session.user.id) notFound();

  const product = getProductById(productId);
  if (!product) notFound();

  const orderItem = order.items.find((i) => i.productId === productId);
  if (!orderItem) notFound();

  if (order.status === "CANCELLED" || order.status === "RETURNED") {
    notFound();
  }

  if (hasUserReviewedProduct(session.user.id, productId)) {
    redirect(`/account/orders/${orderId}`);
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <nav className="flex items-center gap-1.5 text-xs text-muted" aria-label="Breadcrumb">
        <Link
          href="/account/orders"
          className="hover:text-foreground transition-colors"
        >
          Orders
        </Link>
        <ChevronRight className="h-3 w-3 opacity-50" />
        <Link
          href={`/account/orders/${order.id}`}
          className="hover:text-foreground transition-colors"
        >
          {order.id}
        </Link>
        <ChevronRight className="h-3 w-3 opacity-50" />
        <span className="text-foreground">Write a review</span>
      </nav>

      <header>
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted">
          Reviewing
        </p>
        <h1 className="mt-2 font-display text-3xl tracking-tight">
          {product.name}
        </h1>
        <p className="mt-2 text-sm text-muted">
          Order{" "}
          <Link
            href={`/account/orders/${order.id}`}
            className="text-foreground underline underline-offset-2"
          >
            {order.id}
          </Link>{" "}
          · {orderItem.size} · {orderItem.color}
        </p>
        <p className="mt-1 text-xs text-muted">
          Your review will be marked as a verified purchase.
        </p>
      </header>

      <ReviewForm
        orderId={order.id}
        productId={product.id}
        productName={product.name}
      />
    </div>
  );
}
