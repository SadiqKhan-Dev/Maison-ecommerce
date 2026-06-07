import { describe, it, expect } from "vitest";
import { reviewSchema } from "@/lib/validations/review";

describe("reviewSchema", () => {
  const validInput = {
    rating: 5,
    title: "Lovely piece",
    body: "Fits beautifully and the linen softens with each wear.",
  };

  it("accepts a valid review", () => {
    const result = reviewSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("trims title and body", () => {
    const result = reviewSchema.parse({
      ...validInput,
      title: "  Lovely piece  ",
      body: "  Fits beautifully.  ",
    });
    expect(result.title).toBe("Lovely piece");
    expect(result.body).toBe("Fits beautifully.");
  });

  it("rejects rating below 1", () => {
    const result = reviewSchema.safeParse({ ...validInput, rating: 0 });
    expect(result.success).toBe(false);
  });

  it("rejects rating above 5", () => {
    const result = reviewSchema.safeParse({ ...validInput, rating: 6 });
    expect(result.success).toBe(false);
  });

  it("rejects non-integer rating", () => {
    const result = reviewSchema.safeParse({ ...validInput, rating: 3.5 });
    expect(result.success).toBe(false);
  });

  it("rejects title shorter than 3 characters", () => {
    const result = reviewSchema.safeParse({ ...validInput, title: "Hi" });
    expect(result.success).toBe(false);
  });

  it("rejects title longer than 80 characters", () => {
    const result = reviewSchema.safeParse({
      ...validInput,
      title: "a".repeat(81),
    });
    expect(result.success).toBe(false);
  });

  it("rejects body shorter than 10 characters", () => {
    const result = reviewSchema.safeParse({ ...validInput, body: "Short" });
    expect(result.success).toBe(false);
  });

  it("rejects body longer than 2000 characters", () => {
    const result = reviewSchema.safeParse({
      ...validInput,
      body: "a".repeat(2001),
    });
    expect(result.success).toBe(false);
  });
});
