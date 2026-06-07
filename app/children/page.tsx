import type { Metadata } from "next";
import { CategoryPage } from "@/app/components/products/category-page";

export const metadata: Metadata = {
  title: "Children",
  description:
    "Soft, safe, and built to move. Organic fabrics, considered details.",
};

export default async function ChildrenPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  return <CategoryPage category="CHILDREN" searchParams={sp} />;
}
