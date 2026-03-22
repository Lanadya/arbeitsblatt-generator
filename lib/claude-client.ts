import Anthropic from "@anthropic-ai/sdk";
import { buildPrompt } from "./claude-prompt";
import type { GenerateRequest, WorksheetContent } from "./types";

function getClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY ist nicht gesetzt. Bitte .env.local pruefen.");
  }
  return new Anthropic({ apiKey });
}

export async function generateWorksheet(input: GenerateRequest, currentInfo?: string): Promise<WorksheetContent> {
  const { system, user } = buildPrompt(input, currentInfo);

  const anthropic = getClient();
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    temperature: 0.7,
    system,
    messages: [{ role: "user", content: user }],
  });

  // Extract text from response
  const textBlock = message.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Keine Textantwort von Claude erhalten");
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
  } catch (e) {
    console.error("JSON parse error. Raw response:", rawText.substring(0, 500));
    throw new Error("Claude hat kein gueltiges JSON zurueckgegeben. Bitte erneut versuchen.");
  }

  // Basic validation
  if (!parsed.title || !parsed.teil1_alltagseinstieg || !parsed.teil5_aufgaben) {
    throw new Error("Das generierte Arbeitsblatt ist unvollstaendig. Bitte erneut versuchen.");
  }

  return parsed;
}
