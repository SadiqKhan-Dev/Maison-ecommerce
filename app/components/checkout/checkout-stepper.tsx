"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import {
  CHECKOUT_STEPS,
  STEP_LABEL,
  stepIndex,
  getStepHref,
  type CheckoutStep,
} from "@/lib/checkout/types";

export interface CheckoutStepperProps {
  current: CheckoutStep;
  reachable: CheckoutStep[];
}

export function CheckoutStepper({ current, reachable }: CheckoutStepperProps) {
  const currentIdx = stepIndex(current);

  return (
    <nav aria-label="Checkout progress" className="w-full">
      <ol className="flex items-center gap-1 sm:gap-2">
        {CHECKOUT_STEPS.map((step, idx) => {
          const isComplete = idx < currentIdx;
          const isCurrent = step === current;
          const isReachable = reachable.includes(step);
          const label = STEP_LABEL[step];
          const stepNum = idx + 1;

          const node = (
            <div className="flex items-center gap-2 sm:gap-3 group">
              <div
                className={cn(
                  "flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full text-xs font-medium transition-colors",
                  isComplete && "bg-foreground text-background",
                  isCurrent && "bg-foreground text-background ring-4 ring-accent/20",
                  !isComplete && !isCurrent && "bg-muted/15 text-muted"
                )}
              >
                {isComplete ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span>{stepNum}</span>
                )}
              </div>
              <div className="hidden sm:block min-w-0">
                <p
                  className={cn(
                    "text-[10px] uppercase tracking-[0.2em] font-medium",
                    isCurrent ? "text-foreground" : "text-muted"
                  )}
                >
                  Step {stepNum}
                </p>
                <p
                  className={cn(
                    "text-sm font-medium",
                    isCurrent ? "text-foreground" : "text-muted"
                  )}
                >
                  {label}
                </p>
              </div>
              <span className="sm:hidden text-xs font-medium text-foreground ml-1">
                {label}
              </span>
            </div>
          );

          return (
            <li key={step} className="flex items-center gap-1 sm:gap-2 flex-1">
              {isReachable && !isCurrent ? (
                <Link
                  href={getStepHref(step)}
                  className="hover:opacity-80 transition-opacity"
                  aria-label={`Go to ${label}`}
                >
                  {node}
                </Link>
              ) : (
                node
              )}
              {idx < CHECKOUT_STEPS.length - 1 && (
                <div className="flex-1 h-px bg-border relative overflow-hidden">
                  <motion.div
                    initial={false}
                    animate={{ scaleX: idx < currentIdx ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    style={{ originX: 0 }}
                    className="absolute inset-0 bg-foreground"
                  />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
