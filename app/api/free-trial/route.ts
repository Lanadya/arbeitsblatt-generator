import { NextRequest, NextResponse } from "next/server";
import { generateWorksheet } from "@/lib/claude-client";
import { buildDocxBuffer } from "@/lib/docx-builder";
import { runQualityPipeline, factCheckWorksheet, correctWorksheet } from "@/lib/quality-pipeline";
import Anthropic from "@anthropic-ai/sdk";
import {
  isDisposableEmail,
  isEmailUsed,
  isIpLimited,
  getDailyCount,
  createFreeTrial,
  markTrialGenerated,
  checkAndAlert,
  DAILY_LIMIT,
} from "@/lib/free-trial";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  let trialId: string | undefined;

  try {
    const body = await request.json();
    const { email, topic, subject, schoolType } = body;

    // --- Input validation ---
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Bitte gib eine gültige E-Mail-Adresse ein." }, { status: 400 });
    }
    if (!topic || typeof topic !== "string" || topic.trim().length < 3) {
      return NextResponse.json({ error: "Bitte gib ein Thema ein (mindestens 3 Zeichen)." }, { status: 400 });
    }
    if (!subject) {
      return NextResponse.json({ error: "Bitte wähle ein Fachgebiet." }, { status: 400 });
    }
    if (!schoolType) {
      return NextResponse.json({ error: "Bitte wähle eine Schulform." }, { status: 400 });
    }

    // --- Abuse protection ---
    if (isDisposableEmail(email)) {
      return NextResponse.json(
        { error: "Bitte verwende deine reguläre E-Mail-Adresse (keine Wegwerf-Adressen)." },
        { status: 400 }
      );
    }

    if (await isEmailUsed(email)) {
      return NextResponse.json(
        { error: "Diese E-Mail-Adresse wurde bereits für einen kostenlosen Versuch genutzt. Weitere Arbeitsblätter gibt es ab 4,99 €." },
        { status: 409 }
      );
    }

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || request.headers.get("x-real-ip")
      || "unknown";

    if (await isIpLimited(ip)) {
      return NextResponse.json(
        { error: "Zu viele Anfragen. Bitte versuche es später erneut." },
        { status: 429 }
      );
    }

    const dailyCount = await getDailyCount();
    if (dailyCount >= DAILY_LIMIT) {
      return NextResponse.json(
        { error: "Das tägliche Kontingent an kostenlosen Arbeitsblättern ist leider aufgebraucht. Versuche es morgen erneut oder kaufe eines ab 4,99 €." },
        { status: 429 }
      );
    }

    // --- Create trial record ---
    trialId = await createFreeTrial(email, ip, topic.trim(), subject, schoolType);

    // --- Alert check ---
    await checkAndAlert(dailyCount + 1);

    // --- Generate worksheet with quality pipeline ---
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

    console.log(`[Free Trial Pipeline] Starting for "${topic.trim()}"`);
    const pipelineResult = await runQualityPipeline(topic.trim(), subject, schoolType, anthropic);
    const currentInfo = pipelineResult.enrichedInfo;
    const pipelineContext = {
      perspective: pipelineResult.perspective,
      legalBasis: pipelineResult.analysis.legalBasis,
      keyTerms: pipelineResult.analysis.keyTerms,
      sourceUrls: pipelineResult.sources.map((s: { title: string; url: string }) => ({ title: s.title, url: s.url })),
    };

    const worksheetContent = await generateWorksheet(
      {
        topic: topic.trim(),
        subject,
        schoolType,
        productType: "standard",
      },
      currentInfo || undefined,
      undefined,
      pipelineContext
    );

    // Stufe 4+5: Fact-check and correct
    console.log(`[Free Trial Pipeline] Stufe 4: Faktencheck`);
    const worksheetJson = JSON.stringify(worksheetContent);
    const factCheck = await factCheckWorksheet(worksheetJson, currentInfo, pipelineResult.analysis, anthropic);

    if (!factCheck.passed && factCheck.issues.length > 0) {
      console.log(`[Free Trial Pipeline] Stufe 5: Korrektur (${factCheck.issues.length} Issues)`);
      const correctedJson = await correctWorksheet(worksheetJson, factCheck.issues, currentInfo, anthropic);
      try {
        const corrected = JSON.parse(correctedJson);
        Object.assign(worksheetContent, corrected);
        console.log(`[Free Trial Pipeline] Korrektur angewendet`);
      } catch {
        console.warn(`[Free Trial Pipeline] Korrektur-JSON nicht parsebar, Original wird verwendet`);
      }
    } else {
      console.log(`[Free Trial Pipeline] Faktencheck bestanden`);
    }

    const buffer = await buildDocxBuffer(worksheetContent, false);

    // --- Mark as generated ---
    await markTrialGenerated(trialId);

    const safeFilename = topic.trim()
      .replace(/[^a-zA-Z0-9äöüÄÖÜß\s-]/g, "")
      .replace(/\s+/g, "_")
      .substring(0, 50);

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="Arbeitsblatt_${safeFilename}.docx"`,
      },
    });
  } catch (error: unknown) {
    console.error("Free trial generation error:", error);
    const message = error instanceof Error ? error.message : "Unbekannter Fehler";
    return NextResponse.json(
      { error: `Bei der Erstellung ist ein Fehler aufgetreten: ${message}` },
      { status: 502 }
    );
  }
}
