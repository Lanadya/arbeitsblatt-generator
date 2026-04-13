import { NextRequest, NextResponse } from "next/server";
import { searchBraveForTopic } from "@/lib/brave-search";
import { resolveBerufId, getBerufLabel } from "@/lib/beruf-config";
import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";
export const maxDuration = 15;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let { topic, subject, schoolType } = body;
    const { sessionId } = body;

    // If sessionId provided, read topic/subject/schoolType from Stripe metadata
    if (sessionId) {
      const { getStripe } = await import("@/lib/stripe");
      const stripe = getStripe();
      try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (session.payment_status !== "paid") {
          return NextResponse.json({ error: "Zahlung nicht abgeschlossen." }, { status: 402 });
        }
        // Use Stripe metadata as defaults, allow override from body (for corrections)
        if (!topic) topic = session.metadata?.topic;
        if (!subject) subject = session.metadata?.subject;
        if (!schoolType) schoolType = session.metadata?.schoolType;
      } catch {
        return NextResponse.json({ error: "Ungültige Sitzung." }, { status: 401 });
      }
    }

    if (!topic || topic.trim().length < 2) {
      return NextResponse.json({ error: "Thema fehlt." }, { status: 400 });
    }

    const berufId = resolveBerufId(schoolType || "");
    const berufLabel = getBerufLabel(berufId);

    // Quick Brave search to ground the topic
    const searchResults = await searchBraveForTopic(topic.trim(), schoolType || "");

    // Short Claude call — cheap (haiku-level task, but we use sonnet for accuracy)
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 400,
      messages: [
        {
          role: "user",
          content: `Ein Lehrer möchte ein Arbeitsblatt zum Thema "${topic.trim()}" erstellen.
Fachgebiet: ${subject || "nicht angegeben"}
Schulform/Beruf: ${berufLabel || schoolType || "nicht angegeben"}

Hier sind aktuelle Web-Ergebnisse zum Thema:
${searchResults || "Keine Ergebnisse gefunden."}

Erstelle eine kurze Zusammenfassung (2-3 Sätze), die beschreibt, WAS genau das Arbeitsblatt behandeln wird. Nenne dabei die wichtigsten Fakten, Begriffe oder Nummern (z.B. GOP-Nummern, Paragraphen, Formeln), damit der Lehrer prüfen kann, ob das sein gewünschtes Thema trifft.

Antworte NUR mit der Zusammenfassung, ohne Einleitung oder Erklärung. Auf Deutsch.`,
        },
      ],
    });

    const summary =
      response.content[0].type === "text" ? response.content[0].text : "";

    return NextResponse.json({ summary, berufLabel });
  } catch (error: unknown) {
    console.error("Topic check error:", error);
    return NextResponse.json(
      { error: "Themenprüfung fehlgeschlagen. Bitte versuche es erneut." },
      { status: 500 }
    );
  }
}
