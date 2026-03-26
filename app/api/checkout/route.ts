import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, subject, schoolType, productType, blobUrl } = body;

    const isPremium = productType === "premium";

    // Validate inputs
    // For premium, topic is optional (derived from uploaded material)
    if (!isPremium && (!topic || topic.trim().length < 3)) {
      return NextResponse.json(
        { error: "Thema muss mindestens 3 Zeichen lang sein." },
        { status: 400 }
      );
    }
    if (!subject) {
      return NextResponse.json(
        { error: "Bitte ein Fachgebiet auswählen." },
        { status: 400 }
      );
    }
    if (!schoolType) {
      return NextResponse.json(
        { error: "Bitte eine Schulform / einen Beruf auswählen." },
        { status: 400 }
      );
    }

    // Premium requires a blob URL
    if (isPremium && !blobUrl) {
      return NextResponse.json(
        { error: "Bitte lade zuerst eine Datei hoch." },
        { status: 400 }
      );
    }

    const stripe = getStripe();
    const origin = request.headers.get("origin") || "http://localhost:3000";

    const effectiveTopic = topic?.trim() || "Premium-Arbeitsblatt";
    const unitAmount = isPremium ? 799 : 499; // 7.99€ or 4.99€
    const productName = isPremium
      ? `Premium-Arbeitsblatt: ${effectiveTopic}`
      : `Arbeitsblatt: ${effectiveTopic}`;
    const productDescription = isPremium
      ? `Fach: ${subject} | Schulform: ${schoolType} | Basierend auf eigenem Material`
      : `Fach: ${subject} | Schulform: ${schoolType}`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: productName,
              description: productDescription,
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?cancelled=true`,
      metadata: {
        topic: effectiveTopic,
        subject,
        schoolType,
        productType: isPremium ? "premium" : "standard",
        ...(blobUrl ? { blobUrl } : {}),
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
