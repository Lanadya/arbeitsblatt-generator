import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import mammoth from "mammoth";

export const runtime = "nodejs";
export const maxDuration = 30;

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_TEXT_LENGTH = 50_000; // ~10 pages of dense text

async function extractTextFromDocx(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";

    let text: string;
    let fileName: string;

    if (contentType.includes("application/json")) {
      // PDF text was extracted client-side — receive plain text
      const body = await request.json();
      text = body.text;
      fileName = body.fileName || "upload.pdf";

      if (!text || typeof text !== "string") {
        return NextResponse.json(
          { error: "Kein Text empfangen." },
          { status: 400 }
        );
      }
    } else {
      // DOCX: extract server-side with mammoth
      const formData = await request.formData();
      const file = formData.get("file") as File | null;

      if (!file) {
        return NextResponse.json(
          { error: "Keine Datei hochgeladen." },
          { status: 400 }
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: "Datei ist zu groß. Maximal 5 MB erlaubt." },
          { status: 400 }
        );
      }

      // Block macro-enabled files
      if (file.name.endsWith(".docm") || file.name.endsWith(".xlsm")) {
        return NextResponse.json(
          { error: "Makro-Dateien sind aus Sicherheitsgründen nicht erlaubt." },
          { status: 400 }
        );
      }

      if (!file.name.endsWith(".docx")) {
        return NextResponse.json(
          { error: "Auf dem Server werden nur DOCX-Dateien verarbeitet. PDF wird im Browser extrahiert." },
          { status: 400 }
        );
      }

      fileName = file.name;
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      try {
        text = await extractTextFromDocx(buffer);
      } catch (parseError) {
        console.error("DOCX parse error:", parseError);
        return NextResponse.json(
          { error: "Die DOCX-Datei konnte nicht gelesen werden. Bitte überprüfe, ob die Datei beschädigt ist." },
          { status: 400 }
        );
      }
    }

    // Validate extracted text
    if (!text || text.trim().length < 50) {
      return NextResponse.json(
        { error: "Die Datei enthält zu wenig lesbaren Text. Bitte lade ein Dokument mit mehr Inhalt hoch." },
        { status: 400 }
      );
    }

    // Truncate if needed
    const finalText = text.trim().substring(0, MAX_TEXT_LENGTH);

    // Store in Vercel Blob
    const blob = await put(`uploads/${Date.now()}-${fileName}.txt`, finalText, {
      access: "public",
      contentType: "text/plain",
    });

    return NextResponse.json({
      blobUrl: blob.url,
      charCount: finalText.length,
    });
  } catch (error: unknown) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Fehler beim Hochladen. Bitte versuche es erneut." },
      { status: 500 }
    );
  }
}
