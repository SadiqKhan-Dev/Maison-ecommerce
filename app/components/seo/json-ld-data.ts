const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export function getOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Maison",
    alternateName: "Maison Noir",
    url: BASE_URL,
    logo: `${BASE_URL}/icon.png`,
    description:
      "Considered clothing for considered lives. Made in small batches with the world's finest mills.",
    sameAs: [
      "https://www.instagram.com/maison",
      "https://www.pinterest.com/maison",
      "https://www.facebook.com/maison",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "hello@maison.com",
      availableLanguage: ["English"],
    },
  };
}

export function getWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Maison",
    url: BASE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${BASE_URL}/products?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

interface ProductJsonLdInput {
  name: string;
  description: string;
  brand: string;
  images: string[];
  price: number;
  salePrice?: number;
  currency?: string;
  sku: string;
  rating?: number;
  reviewCount?: number;
  availability?: "InStock" | "OutOfStock";
  urlPath: string;
}

export function getProductJsonLd(product: ProductJsonLdInput) {
  const price = product.salePrice ?? product.price;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    offers: {
      "@type": "Offer",
      url: `${BASE_URL}${product.urlPath}`,
      priceCurrency: product.currency ?? "USD",
      price: price.toFixed(2),
      availability:
        product.availability === "OutOfStock"
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Maison",
      },
    },
    ...(product.rating !== undefined && product.reviewCount !== undefined
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.rating.toFixed(1),
            reviewCount: product.reviewCount,
            bestRating: "5",
            worstRating: "1",
          },
        }
      : {}),
  };
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function getBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: `${BASE_URL}${item.url}`,
    })),
  };
}
