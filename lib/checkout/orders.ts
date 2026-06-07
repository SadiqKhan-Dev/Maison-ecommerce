import type { Order, OrderStatus } from "@/types/order";
import type { CheckoutAddress } from "./types";

export interface CreateOrderInput {
  userId: string | null;
  guestEmail: string;
  items: Order["items"];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  shippingAddress: CheckoutAddress;
  billingAddress: CheckoutAddress;
  shippingMethodId: string;
  shippingMethodName: string;
  estimatedDelivery: string;
  stripeId?: string;
  paymentLast4?: string;
  paymentBrand?: string;
}

const orders: Order[] = [];

function generateOrderId(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `MSN-${ts}-${rand}`;
}

export function createOrder(input: CreateOrderInput): Order {
  const id = generateOrderId();
  const now = new Date().toISOString();
  const order: Order = {
    id,
    userId: input.userId ?? "guest",
    items: input.items,
    status: "PROCESSING" as OrderStatus,
    subtotal: input.subtotal,
    shipping: input.shipping,
    tax: input.tax,
    discount: input.discount,
    total: input.total,
    shippingAddress: { ...input.shippingAddress },
    createdAt: now,
    estimatedDelivery: input.estimatedDelivery,
    stripeId: input.stripeId,
    paymentLast4: input.paymentLast4,
    paymentBrand: input.paymentBrand,
    shippingMethodId: input.shippingMethodId,
    shippingMethodName: input.shippingMethodName,
    billingAddress: { ...input.billingAddress },
    guestEmail: input.guestEmail,
  } as Order;
  orders.push(order);
  return order;
}

export function getOrderById(id: string): Order | undefined {
  return orders.find((o) => o.id === id);
}

export function getOrdersForUser(userId: string): Order[] {
  return orders.filter((o) => o.userId === userId);
}

export function getRecentOrders(limit = 10): Order[] {
  return [...orders]
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, limit);
}
