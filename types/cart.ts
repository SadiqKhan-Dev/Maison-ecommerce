import type { ProductVariant } from "./product";

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  name: string;
  brand: string;
  image: string;
  size: string;
  color: string;
  colorHex: string;
  price: number;
  quantity: number;
  variant?: ProductVariant;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
}
