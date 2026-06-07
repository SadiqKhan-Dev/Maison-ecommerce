import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/app/ui/container";
import { Breadcrumb } from "@/app/ui/breadcrumb";
import { PdpInteractive } from "@/app/components/products/pdp-interactive";
import { ReviewsSection } from "@/app/components/products/reviews-section";
import { RelatedProducts } from "@/app/components/products/related-products";
import { JsonLd } from "@/app/components/seo/json-ld";
import {
  getProductJsonLd,
  getBreadcrumbJsonLd,
} from "@/app/components/seo/json-ld-data";
import { getAllProductSlugs, getProductBySlug, getRelatedProducts } from "@/data/products";
import { CATEGORIES } from "@/data/categories";
import { formatPrice } from "@/lib/utils/formatPrice";
import { auth } from "@/auth";
import { getOrdersForUser } from "@/lib/checkout/orders";
import { hasUserReviewedProduct } from "@/lib/reviews/store";

interface PdpRouteParams {
  slug: string;
}

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export async function generateStaticParams(): Promise<PdpRouteParams[]> {
  return getAllProductSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PdpRouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Not found" };

  const price = product.salePrice ?? product.basePrice;
  const description = `${product.name} by ${product.brand} from Maison. ${formatPrice(
    price
  )}. ${product.description.slice(0, 140)}`;
  const url = `${BASE_URL}/products/${product.slug}`;

  return {
    title: product.name,
    description,
    keywords: [product.name, product.brand, product.subCategory, product.category.toLowerCase()],
    alternates: {
      canonical: `/products/${product.slug}`,
    },
    openGraph: {
      title: `${product.name} · ${product.brand}`,
      description,
      url,
      type: "website",
      images: [
        {
          url: product.images[0],
          width: 1200,
          height: 1600,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} · ${product.brand}`,
      description,
      images: [product.images[0]],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<PdpRouteParams>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const category = CATEGORIES[product.category];
  const related = getRelatedProducts(product, 4);
  const totalStock = product.variants.reduce((s, v) => s + v.stock, 0);
  const firstSku = product.variants[0]?.sku ?? product.id;

  const session = await auth();
  const userId = session?.user?.id;
  const isLoggedIn = Boolean(userId);

  let canReview = false;
  let reviewHref = `/auth/login?callbackUrl=/products/${product.slug}`;
  if (userId) {
    const alreadyReviewed = hasUserReviewedProduct(userId, product.id);
    if (!alreadyReviewed) {
      const orders = getOrdersForUser(userId);
      const eligibleOrder = orders.find(
        (o) =>
          o.status !== "CANCELLED" &&
          o.status !== "RETURNED" &&
          o.items.some((i) => i.productId === product.id)
      );
      if (eligibleOrder) {
        canReview = true;
        reviewHref = `/account/orders/${eligibleOrder.id}/write-review/${product.id}`;
      }
    }
  }

  const productJsonLd = getProductJsonLd({
    name: product.name,
    description: product.description,
    brand: product.brand,
    images: product.images,
    price: product.basePrice,
    salePrice: product.salePrice,
    sku: firstSku,
    rating: product.rating,
    reviewCount: product.reviewCount,
    availability: totalStock > 0 ? "InStock" : "OutOfStock",
    urlPath: `/products/${product.slug}`,
  });

  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: category.label, url: category.href },
    { name: product.name, url: `/products/${product.slug}` },
  ]);

  return (
    <>
      <Container className="pt-8 lg:pt-12 pb-4">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: category.label, href: category.href },
            { label: product.subCategory, href: `${category.href}?sub=${encodeURIComponent(product.subCategory)}` },
            { label: product.name },
          ]}
        />
      </Container>

      <Container className="pb-16 lg:pb-24">
        <PdpInteractive product={product} />
      </Container>

      <div id="reviews">
        <ReviewsSection
          productSlug={product.slug}
          isLoggedIn={isLoggedIn}
          canReview={canReview}
          reviewHref={reviewHref}
          loginHref={`/auth/login?callbackUrl=/products/${product.slug}#reviews`}
        />
      </div>

      <RelatedProducts products={related} />

      <div className="lg:hidden h-20" aria-hidden />

      <JsonLd data={[productJsonLd, breadcrumbJsonLd]} />
    </>
  );
}
