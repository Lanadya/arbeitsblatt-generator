import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, subject, schoolType } = body;

    // Validate inputs
    if (!topic || topic.trim().length < 3) {
      return NextResponse.json(
        { error: "Thema muss mindestens 3 Zeichen lang sein." },
        { status: 400 }
      );
    }
    if (!subject) {
      return NextResponse.json(
        { error: "Bitte ein Fachgebiet auswaehlen." },
        { status: 400 }
      );
    }
    if (!schoolType) {
      return NextResponse.json(
        { error: "Bitte eine Schulform / einen Beruf auswaehlen." },
        { status: 400 }
      );
    }

    const stripe = getStripe();

    const origin = request.headers.get("origin") || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Arbeitsblatt: ${topic.trim()}`,
              description: `Fach: ${subject} | Schulform: ${schoolType}`,
            },
            unit_amount: 199, // 1.99 EUR in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?cancelled=true`,
      metadata: {
        topic: topic.trim(),
        subject,
        schoolType,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    console.error("Checkout error:", error);
    const message =
      error instanceof Error ? error.message : "Unbekannter Fehler";
    return NextResponse.json(
      { error: `Fehler beim Erstellen der Zahlung: ${message}` },
      { status: 500 }
    );
  }
}
