import Anthropic from "@anthropic-ai/sdk";
import { buildPrompt } from "./claude-prompt";
import type { GenerateRequest, WorksheetContent } from "./types";

function getClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY ist nicht gesetzt. Bitte .env.local prüfen.");
  }
  return new Anthropic({ apiKey });
}

// Retry with exponential backoff for transient errors (429, 529, 500, network)
async function callClaudeWithRetry(
  anthropic: Anthropic,
  params: Anthropic.MessageCreateParamsNonStreaming,
  maxRetries = 3
): Promise<Anthropic.Message> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await anthropic.messages.create(params);
    } catch (error: unknown) {
      const isApiError = error instanceof Error && "status" in error;
      const statusCode = isApiError ? (error as Error & { status: number }).status : 0;

      const isRetryable = isApiError && [429, 500, 503, 529].includes(statusCode);

      const isNetworkError =
        error instanceof Error &&
        (error.message.includes("fetch failed") || error.message.includes("ECONNRESET"));

      if ((isRetryable || isNetworkError) && attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
        console.log(`Claude API retry ${attempt + 1}/${maxRetries} after ${delay}ms (status: ${statusCode || "network"})`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      // Not retryable or out of retries — throw user-friendly error
      if (isApiError) {
        if (statusCode === 529 || statusCode === 503) {
          throw new Error("Der KI-Service ist gerade überlastet. Bitte versuche es in 1-2 Minuten erneut.");
        }
        if (statusCode === 429) {
          throw new Error("Zu viele Anfragen. Bitte warte einen Moment und versuche es erneut.");
        }
        if (statusCode === 401) {
          throw new Error("API-Schlüssel fehlt oder ist ungültig. Bitte kontaktiere den Support.");
        }
      }
      throw error;
    }
  }
  throw new Error("Maximale Anzahl an Versuchen erreicht.");
}

export async function generateWorksheet(input: GenerateRequest, currentInfo?: string, sourceText?: string): Promise<WorksheetContent> {
  const { system, user } = buildPrompt(input, currentInfo, sourceText);

  const isPremium = !!sourceText;
  const anthropic = getClient();
  const message = await callClaudeWithRetry(anthropic, {
    model: "claude-sonnet-4-20250514",
    max_tokens: isPremium ? 8192 : 4096,
    temperature: 0.7,
    system,
    messages: [{ role: "user", content: user }],
  });

  // Check if Claude was cut off by token limit
  if (message.stop_reason === "max_tokens") {
    console.error("Claude response was cut off (max_tokens reached).");
    throw new Error("Das Arbeitsblatt war zu umfangreich und wurde abgeschnitten. Bitte versuche es erneut.");
  }

  // Extract text from response
  const textBlock = message.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Keine Textantwort von Claude erhalten. Bitte erneut versuchen.");
  }

  let rawText = textBlock.text.trim();

  // Strip markdown code fences if present
  if (rawText.startsWith("```")) {
    rawText = rawText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  }

  // Parse JSON
  let parsed: WorksheetContent;
  try {
    parsed = JSON.parse(rawText) as WorksheetContent;
  } catch {
    console.error("JSON parse error. Raw response:", rawText.substring(0, 500));
    throw new Error("Die KI hat ein ungültiges Format zurückgegeben. Bitte versuche es erneut.");
  }

  // Basic validation
  if (!parsed.title || !parsed.teil1_alltagseinstieg || !parsed.teil5_aufgaben) {
    throw new Error("Das generierte Arbeitsblatt ist unvollständig. Bitte erneut versuchen.");
  }

  return parsed;
}
