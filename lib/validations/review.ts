import { z } from "zod";

export const reviewSchema = z.object({
  rating: z
    .number({ error: "Please choose a rating" })
    .int("Rating must be a whole number")
    .min(1, "Please choose a rating")
    .max(5, "Rating cannot exceed 5 stars"),
  title: z
    .string()
    .min(1, "A short title is required")
    .min(3, "Title must be at least 3 characters")
    .max(80, "Title must be 80 characters or fewer")
    .transform((v) => v.trim()),
  body: z
    .string()
    .min(1, "Please share a few words about the product")
    .min(10, "Comments must be at least 10 characters")
    .max(2000, "Comments must be 2000 characters or fewer")
    .transform((v) => v.trim()),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
