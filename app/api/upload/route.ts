import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import mammoth from "mammoth";

export const runtime = "nodejs";
export const maxDuration = 30;

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_TEXT_LENGTH = 50_000; // ~10 pages of dense text
const ALLOWED_TYPES = [
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/pdf",
];

async function extractTextFromDocx(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  const { PDFParse } = await import("pdf-parse");
  const parser = new PDFParse({ data: new Uint8Array(buffer) });
  const result = await parser.getText();
  return result.text;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Keine Datei hochgeladen." },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Datei ist zu groß. Maximal 5 MB erlaubt." },
        { status: 400 }
      );
    }

    // Validate file type
    const isDocx = file.name.endsWith(".docx") || file.type === ALLOWED_TYPES[0];
    const isPdf = file.name.endsWith(".pdf") || file.type === ALLOWED_TYPES[1];

    if (!isDocx && !isPdf) {
      return NextResponse.json(
        { error: "Nur DOCX- und PDF-Dateien sind erlaubt." },
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

    // Read file buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract text
    let extractedText: string;
    try {
      if (isDocx) {
        extractedText = await extractTextFromDocx(buffer);
      } else {
        extractedText = await extractTextFromPdf(buffer);
      }
    } catch (parseError) {
      console.error("File parse error:", parseError);
      const isPasswordError = parseError instanceof Error &&
        (parseError.message.includes("password") || parseError.message.includes("encrypted"));

      if (isPasswordError) {
        return NextResponse.json(
          { error: "Die Datei ist passwortgeschützt. Bitte lade eine ungeschützte Datei hoch." },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: "Die Datei konnte nicht gelesen werden. Bitte überprüfe das Format." },
        { status: 400 }
      );
    }

    // Validate extracted text
    if (!extractedText || extractedText.trim().length < 50) {
      return NextResponse.json(
        {
          error: isPdf
            ? "Die PDF enthält keinen lesbaren Text. Bitte lade eine Text-PDF hoch (keine gescannten Bilder)."
            : "Die Datei enthält zu wenig Text. Bitte lade ein Dokument mit mehr Inhalt hoch.",
        },
        { status: 400 }
      );
    }

    // Truncate if needed
    const text = extractedText.trim().substring(0, MAX_TEXT_LENGTH);

    // Store in Vercel Blob
    const blob = await put(`uploads/${Date.now()}-${file.name}.txt`, text, {
      access: "public",
      contentType: "text/plain",
    });

    return NextResponse.json({
      blobUrl: blob.url,
      charCount: text.length,
    });
  } catch (error: unknown) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Fehler beim Hochladen. Bitte versuche es erneut." },
      { status: 500 }
    );
  }
}
