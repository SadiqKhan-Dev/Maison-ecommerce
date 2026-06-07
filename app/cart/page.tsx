import type { Metadata } from "next";
import { mockProducts, bestsellers } from "@/data/products";
import { CartView } from "./cart-view";

export const metadata: Metadata = {
  title: "Shopping bag",
  description: "Review and edit the items in your bag.",
};

export default function CartPage() {
  return <CartView allProducts={mockProducts} bestsellers={bestsellers} />;
}
