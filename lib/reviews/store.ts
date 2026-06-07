import type { Review } from "@/data/reviews";
import {
  getReviewsForProduct as getSeedReviewsForProduct,
  getReviewStatsForProduct as getSeedReviewStatsForProduct,
} from "@/data/reviews";

export interface UserReview extends Review {
  userId: string;
  productId: string;
  orderId: string;
}

const userReviews: UserReview[] = [];

export function addUserReview(input: {
  userId: string;
  productId: string;
  productSlug: string;
  orderId: string;
  author: string;
  location: string;
  rating: number;
  title: string;
  body: string;
}): UserReview {
  const review: UserReview = {
    id: `ur_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
    productSlug: input.productSlug,
    productId: input.productId,
    userId: input.userId,
    orderId: input.orderId,
    author: input.author,
    location: input.location,
    rating: input.rating,
    title: input.title,
    body: input.body,
    verified: true,
    createdAt: new Date().toISOString(),
    helpfulCount: 0,
  };
  userReviews.push(review);
  return review;
}

export function getAllReviewsForProduct(slug: string): Review[] {
  const seed = getSeedReviewsForProduct(slug);
  const user = userReviews.filter((r) => r.productSlug === slug);
  // User reviews first (most recent), then seed reviews
  const userSorted = [...user].sort((a, b) =>
    a.createdAt < b.createdAt ? 1 : -1
  );
  return [...userSorted, ...seed];
}

export function getReviewStatsForProductCombined(slug: string): {
  average: number;
  count: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
} {
  const all = getAllReviewsForProduct(slug);
  const count = all.length;
  const average =
    count === 0
      ? 0
      : all.reduce((sum, r) => sum + r.rating, 0) / count;
  const distribution: Record<1 | 2 | 3 | 4 | 5, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };
  all.forEach((r) => {
    distribution[r.rating as 1 | 2 | 3 | 4 | 5]++;
  });
  return { average, count, distribution };
}

export function hasUserReviewedProduct(
  userId: string,
  productId: string
): boolean {
  return userReviews.some(
    (r) => r.userId === userId && r.productId === productId
  );
}

export function getUserReviews(userId: string): UserReview[] {
  return userReviews.filter((r) => r.userId === userId);
}

export { getSeedReviewsForProduct, getSeedReviewStatsForProduct };
