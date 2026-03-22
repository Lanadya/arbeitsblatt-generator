import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import Stripe from "stripe";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Keine Stripe-Signatur vorhanden." },
      { status: 400 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET ist nicht gesetzt.");
    return NextResponse.json(
      { error: "Webhook-Konfiguration fehlt." },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unbekannter Fehler";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json(
      { error: `Webhook-Fehler: ${message}` },
      { status: 400 }
    );
  }

  // Handle the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log(
      "Zahlung erfolgreich:",
      session.id,
      "Metadata:",
      session.metadata
    );
    // The actual worksheet generation happens on the success page
    // via the /api/generate endpoint. The webhook confirms payment
    // was received and can be used for logging/analytics.
  }

  return NextResponse.json({ received: true });
}
