import type { Metadata } from "next";
import { Container } from "@/app/ui/container";
import { Breadcrumb } from "@/app/ui/breadcrumb";
import { WishlistView } from "./wishlist-view";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Your saved items, all in one place.",
};

export default function WishlistPage() {
  return (
    <Container className="py-10 lg:py-14">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Account", href: "/account" },
          { label: "Wishlist" },
        ]}
        className="mb-6"
      />
      <WishlistView />
    </Container>
  );
}
