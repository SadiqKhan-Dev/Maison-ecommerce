import type { CartItem } from "./cart";
import type { Address } from "./user";

export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURNED";

export interface Order {
  id: string;
  userId: string;
  guestEmail?: string;
  items: CartItem[];
  status: OrderStatus;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  shippingAddress: Address;
  billingAddress: Address;
  shippingMethodId: string;
  shippingMethodName: string;
  createdAt: string;
  estimatedDelivery: string;
  stripeId?: string;
  paymentLast4?: string;
  paymentBrand?: string;
}
