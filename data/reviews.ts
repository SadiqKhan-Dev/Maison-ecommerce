export interface Review {
  id: string;
  productSlug: string;
  author: string;
  location: string;
  rating: number;
  title: string;
  body: string;
  verified: boolean;
  createdAt: string;
  helpfulCount: number;
}

const reviews: Review[] = [
  // Merino Wool Overcoat
  {
    id: "r1",
    productSlug: "merino-wool-overcoat",
    author: "James W.",
    location: "London, UK",
    rating: 5,
    title: "Exceptional quality",
    body: "The wool is incredibly soft and the construction is flawless. Worth every penny — this will be in my rotation for years.",
    verified: true,
    createdAt: "2026-01-12",
    helpfulCount: 24,
  },
  {
    id: "r2",
    productSlug: "merino-wool-overcoat",
    author: "Daniel R.",
    location: "Stockholm, SE",
    rating: 4,
    title: "Runs slightly large",
    body: "Beautiful coat, beautifully made. I'd recommend sizing down if you're between sizes. Otherwise, perfect.",
    verified: true,
    createdAt: "2025-12-28",
    helpfulCount: 11,
  },
  {
    id: "r3",
    productSlug: "merino-wool-overcoat",
    author: "Alex M.",
    location: "New York, US",
    rating: 5,
    title: "New winter staple",
    body: "I've owned a lot of overcoats. This one is in a different league. The drape, the weight, the finish — everything is considered.",
    verified: true,
    createdAt: "2025-12-04",
    helpfulCount: 18,
  },
  // Cashmere Crew Sweater
  {
    id: "r4",
    productSlug: "cashmere-crew-sweater",
    author: "Eleanor V.",
    location: "London, UK",
    rating: 5,
    title: "The perfect sweater",
    body: "I've worn this almost daily since it arrived. The cashmere is light but warm, and the cut is forgiving without being shapeless.",
    verified: true,
    createdAt: "2026-01-08",
    helpfulCount: 32,
  },
  {
    id: "r5",
    productSlug: "cashmere-crew-sweater",
    author: "Naomi K.",
    location: "Berlin, DE",
    rating: 5,
    title: "Color is exactly right",
    body: "The 'oat' is a true neutral — works with everything. Already considering a second color.",
    verified: true,
    createdAt: "2025-12-19",
    helpfulCount: 9,
  },
  // Silk Slip Dress
  {
    id: "r6",
    productSlug: "silk-slip-dress",
    author: "Sofia R.",
    location: "Milan, IT",
    rating: 5,
    title: "A new favorite",
    body: "The bias cut does what it promises — this dress skims in all the right places. The silk is the real deal.",
    verified: true,
    createdAt: "2025-12-22",
    helpfulCount: 21,
  },
  // Cotton Oxford Shirt
  {
    id: "r7",
    productSlug: "cotton-oxford-shirt",
    author: "Marcus T.",
    location: "Brooklyn, US",
    rating: 5,
    title: "Wardrobe essential done right",
    body: "I've replaced my old oxfords with these. The cotton softens beautifully after a wash and the buttons are a nice touch.",
    verified: true,
    createdAt: "2025-11-30",
    helpfulCount: 14,
  },
  {
    id: "r8",
    productSlug: "cotton-oxford-shirt",
    author: "Ben H.",
    location: "Toronto, CA",
    rating: 4,
    title: "Great shirt, slight shrinkage",
    body: "Sizing is accurate. Cold wash and lay flat to dry to maintain the fit. Otherwise, no complaints.",
    verified: true,
    createdAt: "2025-11-15",
    helpfulCount: 7,
  },
  // High-Rise Wide-Leg Jeans
  {
    id: "r9",
    productSlug: "high-rise-wide-leg-jeans",
    author: "Hannah P.",
    location: "Los Angeles, US",
    rating: 5,
    title: "Best jeans I've owned",
    body: "The denim is substantial without being stiff. The fit is genuinely flattering. Already ordered another wash.",
    verified: true,
    createdAt: "2025-12-10",
    helpfulCount: 28,
  },
];

export function getReviewsForProduct(slug: string): Review[] {
  return reviews.filter((r) => r.productSlug === slug);
}

export function getReviewStatsForProduct(slug: string): {
  average: number;
  count: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
} {
  const list = getReviewsForProduct(slug);
  const count = list.length;
  const average =
    count === 0
      ? 0
      : list.reduce((sum, r) => sum + r.rating, 0) / count;
  const distribution: Record<1 | 2 | 3 | 4 | 5, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };
  list.forEach((r) => {
    distribution[r.rating as 1 | 2 | 3 | 4 | 5]++;
  });
  return { average, count, distribution };
}
