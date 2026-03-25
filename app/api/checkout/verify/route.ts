import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Keine Sitzungs-ID angegeben." },
        { status: 400 }
      );
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Zahlung wurde nicht abgeschlossen." },
        { status: 402 }
      );
    }

    // Only return payment status — no metadata (security: metadata stays server-side)
    return NextResponse.json({ paid: true });
  } catch (error: unknown) {
    console.error("Verify error:", error);
    const message =
      error instanceof Error ? error.message : "Unbekannter Fehler";
    return NextResponse.json(
      { error: `Fehler bei der Verifizierung: ${message}` },
      { status: 500 }
    );
  }
}
