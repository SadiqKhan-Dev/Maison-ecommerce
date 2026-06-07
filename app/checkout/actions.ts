"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { createOrder, getOrderById } from "@/lib/checkout/orders";
import { sendEmail } from "@/lib/email/resend";
import { orderConfirmationEmail } from "@/lib/email/templates";
import type { CartItem } from "@/types/cart";
import type {
  ContactInfo,
  CheckoutAddress,
  PaymentDetails,
  ShippingMethodId,
  CheckoutTotals,
} from "@/lib/checkout/types";

export interface PlaceOrderInput {
  contact: ContactInfo;
  shippingAddress: CheckoutAddress;
  billingAddress: CheckoutAddress;
  shippingMethod: ShippingMethodId;
  shippingMethodName: string;
  payment: PaymentDetails;
  items: CartItem[];
  totals: CheckoutTotals;
  estimatedDelivery: string;
}

export interface PlaceOrderResult {
  ok: boolean;
  orderId?: string;
  error?: string;
}

export async function placeOrderAction(
  input: PlaceOrderInput
): Promise<PlaceOrderResult> {
  if (!input.contact?.email) {
    return { ok: false, error: "Missing contact email." };
  }
  if (!input.items || input.items.length === 0) {
    return { ok: false, error: "Your cart is empty." };
  }
  if (
    !input.shippingAddress?.firstName ||
    !input.shippingAddress?.addressLine1
  ) {
    return { ok: false, error: "Missing shipping address." };
  }
  if (!input.shippingMethod) {
    return { ok: false, error: "Please choose a shipping method." };
  }
  if (!input.payment || input.payment.status !== "succeeded") {
    return { ok: false, error: "Payment has not been completed." };
  }

  const session = await auth();

  const order = createOrder({
    userId: session?.user?.id ?? null,
    guestEmail: input.contact.email,
    items: input.items,
    subtotal: input.totals.subtotal,
    shipping: input.totals.shipping,
    tax: input.totals.tax,
    discount: input.totals.discount,
    total: input.totals.total,
    shippingAddress: input.shippingAddress,
    billingAddress: input.billingAddress,
    shippingMethodId: input.shippingMethod,
    shippingMethodName: input.shippingMethodName,
    estimatedDelivery: input.estimatedDelivery,
    stripeId:
      input.payment.provider === "stripe" ? input.payment.intentId : undefined,
    paymentLast4: input.payment.last4,
    paymentBrand: input.payment.cardBrand,
  });

  revalidatePath("/account");
  revalidatePath("/account/orders");

  await sendOrderConfirmation(order.id).catch((err) => {
    console.error("[checkout] failed to send order confirmation:", err);
  });

  return { ok: true, orderId: order.id };
}

export async function sendOrderConfirmation(orderId: string) {
  const order = getOrderById(orderId);
  if (!order) return { ok: false, error: "Order not found" } as const;
  const message = orderConfirmationEmail(order);
  if (!message.to) return { ok: false, error: "No recipient" } as const;
  return sendEmail(message);
}

export async function getOrderAction(id: string) {
  return getOrderById(id);
}
