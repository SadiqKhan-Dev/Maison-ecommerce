"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Container } from "@/app/ui/container";
import { StarRating } from "@/app/ui/star-rating";

export interface Testimonial {
  id: number;
  name: string;
  location: string;
  rating: number;
  title: string;
  body: string;
  verified: boolean;
}

export function Testimonials({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const id = setInterval(
      () => setIndex((i) => (i + 1) % testimonials.length),
      6000
    );
    return () => clearInterval(id);
  }, [testimonials.length]);

  const t = testimonials[index];

  return (
    <section
      className="py-20 lg:py-28 bg-muted/5"
      aria-labelledby="testimonials-heading"
    >
      <Container>
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted mb-3">
            What people are saying
          </p>
          <h2
            id="testimonials-heading"
            className="font-display text-4xl lg:text-5xl tracking-tight mb-14"
          >
            Loved by our community
          </h2>

          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <StarRating rating={t.rating} size="lg" className="justify-center mb-6" />
            <p className="font-display text-2xl lg:text-3xl leading-snug mb-8 text-balance">
              &ldquo;{t.body}&rdquo;
            </p>
            <div className="flex items-center justify-center gap-2 text-sm">
              <span className="font-medium">{t.name}</span>
              <span className="text-muted">·</span>
              <span className="text-muted">{t.location}</span>
              {t.verified && (
                <span className="inline-flex items-center gap-1 text-success text-xs ml-2">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Verified
                </span>
              )}
            </div>
          </motion.div>

          <div className="flex items-center justify-center gap-2 mt-10">
            {testimonials.map((tt, i) => (
              <button
                key={tt.id}
                onClick={() => setIndex(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index
                    ? "w-8 bg-foreground"
                    : "w-1.5 bg-muted/40 hover:bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
