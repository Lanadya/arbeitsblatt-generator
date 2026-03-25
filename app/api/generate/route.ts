import { NextRequest, NextResponse } from "next/server";
import { generateWorksheet } from "@/lib/claude-client";
import { buildDocxBuffer } from "@/lib/docx-builder";
import { searchBraveForTopic } from "@/lib/brave-search";
import { getStripe } from "@/lib/stripe";
import { createOrder, markDelivered, markFailed, isSessionUsed } from "@/lib/db";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  let sessionId: string | undefined;

  try {
    const body = await request.json();
    sessionId = body.sessionId;

    // === SECURITY: Require valid paid Stripe session ===
    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json(
        { error: "Fehlende Sitzungs-ID. Bitte starte den Vorgang erneut." },
        { status: 401 }
      );
    }

    // Prevent double-generation (persistent in database)
    if (await isSessionUsed(sessionId)) {
      return NextResponse.json(
        { error: "Dieses Arbeitsblatt wurde bereits generiert. Bitte starte einen neuen Vorgang." },
        { status: 409 }
      );
    }

    // Verify payment with Stripe
    const stripe = getStripe();
    let session;
    try {
      session = await stripe.checkout.sessions.retrieve(sessionId);
    } catch {
      return NextResponse.json(
        { error: "Ungültige Sitzungs-ID." },
        { status: 401 }
      );
    }

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Zahlung nicht abgeschlossen." },
        { status: 402 }
      );
    }

    const { topic, subject, schoolType } = session.metadata || {};

    // Validate metadata from Stripe (not from user request body!)
    if (!topic || topic.trim().length < 3) {
      return NextResponse.json(
        { error: "Thema fehlt in der Zahlungssitzung." },
        { status: 400 }
      );
    }
    if (!subject) {
      return NextResponse.json(
        { error: "Fachgebiet fehlt in der Zahlungssitzung." },
        { status: 400 }
      );
    }
    if (!schoolType) {
      return NextResponse.json(
        { error: "Schulform fehlt in der Zahlungssitzung." },
        { status: 400 }
      );
    }

    // Track order in database (status: 'generating')
    await createOrder(sessionId, topic.trim(), subject, schoolType);

    // Search for current information about the topic
    const currentInfo = await searchBraveForTopic(topic.trim());

    // Generate content via Claude
    const worksheetContent = await generateWorksheet(
      {
        topic: topic.trim(),
        subject,
        schoolType,
      },
      currentInfo
    );

    // Build DOCX
    const buffer = await buildDocxBuffer(worksheetContent);

    // Mark as delivered in database
    await markDelivered(sessionId);

    // Create filename from topic
    const safeFilename = topic
      .trim()
      .replace(/[^a-zA-Z0-9äöüÄÖÜß\s-]/g, "")
      .replace(/\s+/g, "_")
      .substring(0, 50);

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="Arbeitsblatt_${safeFilename}.docx"`,
      },
    });
  } catch (error: unknown) {
    console.error("Generation error:", error);

    const message =
      error instanceof Error ? error.message : "Unbekannter Fehler";

    // Track failure in database (if we have a sessionId)
    if (sessionId) {
      try {
        await markFailed(sessionId, message);
      } catch (dbErr) {
        console.error("Failed to log error to DB:", dbErr);
      }
    }

    // User-friendly errors are already thrown by claude-client
    if (
      message.includes("überlastet") ||
      message.includes("Zu viele Anfragen") ||
      message.includes("API-Schlüssel") ||
      message.includes("ungültiges Format") ||
      message.includes("unvollständig") ||
      message.includes("erneut versuchen")
    ) {
      return NextResponse.json({ error: message }, { status: 502 });
    }

    return NextResponse.json(
      { error: "Bei der Erstellung ist ein Fehler aufgetreten. Bitte versuche es erneut oder kontaktiere uns." },
      { status: 502 }
    );
  }
}
