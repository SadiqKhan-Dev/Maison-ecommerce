import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import {
  getStripeClient,
  isStripeConfigured,
} from "@/lib/checkout/stripe";

const bodySchema = z.object({
  amount: z.number().int().positive().max(1_000_000),
  currency: z.string().min(3).max(8).default("usd"),
  metadata: z.record(z.string(), z.string()).optional(),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const { amount, currency, metadata } = parsed.data;

  if (isStripeConfigured()) {
    try {
      const stripe = getStripeClient();
      if (!stripe) {
        return NextResponse.json(
          { error: "Stripe not initialized" },
          { status: 500 }
        );
      }
      const intent = await stripe.paymentIntents.create({
        amount,
        currency,
        automatic_payment_methods: { enabled: true },
        metadata: metadata ?? {},
      });
      return NextResponse.json({
        provider: "stripe",
        clientSecret: intent.client_secret,
        intentId: intent.id,
      });
    } catch {
      return NextResponse.json(
        { error: "Failed to create payment intent" },
        { status: 500 }
      );
    }
  }

  const mockIntentId = `pi_mock_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;

  return NextResponse.json({
    provider: "mock",
    clientSecret: `${mockIntentId}_secret_${Math.random()
      .toString(36)
      .slice(2, 10)}`,
    intentId: mockIntentId,
  });
}
