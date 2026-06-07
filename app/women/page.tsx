import type { Metadata } from "next";
import { CategoryPage } from "@/app/components/products/category-page";

export const metadata: Metadata = {
  title: "Women",
  description:
    "A modern wardrobe of elevated essentials, refined tailoring, and considered eveningwear.",
};

export default async function WomenPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  return <CategoryPage category="WOMEN" searchParams={sp} />;
}
