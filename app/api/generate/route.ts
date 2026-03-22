import { NextRequest, NextResponse } from "next/server";
import { generateWorksheet } from "@/lib/claude-client";
import { buildDocxBuffer } from "@/lib/docx-builder";
import { searchBraveForTopic } from "@/lib/brave-search";
import type { GenerateRequest } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as GenerateRequest;

    // Validate
    if (!body.topic || body.topic.trim().length < 3) {
      return NextResponse.json(
        { error: "Thema muss mindestens 3 Zeichen lang sein." },
        { status: 400 }
      );
    }
    if (!body.subject) {
      return NextResponse.json(
        { error: "Bitte ein Fachgebiet auswählen." },
        { status: 400 }
      );
    }
    if (!body.schoolType) {
      return NextResponse.json(
        { error: "Bitte eine Schulform / einen Beruf auswählen." },
        { status: 400 }
      );
    }

    // Search for current information about the topic
    const currentInfo = await searchBraveForTopic(body.topic.trim());

    // Generate content via Claude
    const worksheetContent = await generateWorksheet(
      {
        topic: body.topic.trim(),
        subject: body.subject,
        schoolType: body.schoolType,
      },
      currentInfo
    );

    // Build DOCX
    const buffer = await buildDocxBuffer(worksheetContent);

    // Create filename from topic
    const safeFilename = body.topic
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

    // Check if it's an API error
    if (message.includes("authentication") || message.includes("API key")) {
      return NextResponse.json(
        { error: "API-Schlüssel fehlt oder ist ungültig. Bitte .env.local prüfen." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: `Fehler bei der Generierung: ${message}` },
      { status: 502 }
    );
  }
}
