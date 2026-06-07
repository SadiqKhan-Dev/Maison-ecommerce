"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Mail, Check } from "lucide-react";
import { Container } from "@/app/ui/container";
import { Button } from "@/app/ui/button";

export function NewsletterSignup() {
  const [email, setEmail] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <section
      className="py-20 lg:py-28 bg-foreground text-background"
      aria-labelledby="newsletter-heading"
    >
      <Container className="text-center max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Mail
            className="h-8 w-8 text-accent mx-auto mb-6"
            strokeWidth={1.5}
          />
          <h2
            id="newsletter-heading"
            className="font-display text-4xl lg:text-5xl tracking-tight mb-4 text-balance"
          >
            Stay close to the studio
          </h2>
          <p className="text-base text-background/70 mb-10 text-pretty">
            Get early access to new drops, behind-the-seam stories, and 10% off
            your first order.
          </p>

          {submitted ? (
            <div className="inline-flex items-center gap-2 text-sm text-accent">
              <Check className="h-4 w-4" />
              Thanks — check your inbox to confirm.
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              aria-label="Newsletter signup"
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="flex-1 h-12 bg-transparent border border-background/30 px-4 text-sm placeholder:text-background/40 focus:outline-none focus:border-accent"
              />
              <Button
                type="submit"
                size="md"
                shape="full"
                className="bg-accent text-foreground hover:bg-background"
              >
                Subscribe
              </Button>
            </form>
          )}
          <p className="text-xs text-background/50 mt-6 max-w-md mx-auto">
            By subscribing, you agree to our privacy policy. We send no more
            than two emails per month, and you can unsubscribe at any time.
          </p>
        </motion.div>
      </Container>
    </section>
  );
}
