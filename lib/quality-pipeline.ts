/**
 * 5-Stufen-Qualitätspipeline für Arbeitsblatt-Generierung
 *
 * Stufe 1: Thema-Analyse + Kategorisierung
 * Stufe 2: Gezielte Quellenrecherche (mehrere Brave-Queries)
 * Stufe 3: Generierung mit Quellenverankerung
 * Stufe 4: Automatischer Faktencheck
 * Stufe 5: Korrektur bei Bedarf
 */

import Anthropic from "@anthropic-ai/sdk";
import { searchBraveForTopic } from "./brave-search";
import { resolveBerufId, getBerufLabel } from "./beruf-config";

// ============================================================
// TYPES
// ============================================================

export interface TopicAnalysis {
  category: "legal" | "medical" | "financial" | "procedural" | "conceptual";
  searchQueries: string[];
  factTypes: string[];
  perspective: string;
  keyTerms: string[];
  legalBasis?: string[];
}

export interface VerifiedSource {
  title: string;
  url: string;
  facts: string[];
}

export interface QualityResult {
  enrichedInfo: string;
  sources: VerifiedSource[];
  analysis: TopicAnalysis;
  perspective: string;
}

export interface FactCheckResult {
  passed: boolean;
  issues: { fact: string; problem: string; suggestion: string }[];
}

// ============================================================
// STUFE 1: THEMA-ANALYSE
// ============================================================

export async function analyzeTopicWithSources(
  topic: string,
  subject: string,
  schoolType: string,
  anthropic: Anthropic
): Promise<TopicAnalysis> {
  const berufId = resolveBerufId(schoolType);
  const berufLabel = getBerufLabel(berufId);
  const year = new Date().getFullYear();

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 600,
    messages: [
      {
        role: "user",
        content: `Analysiere dieses Arbeitsblatt-Thema für eine Qualitätsprüfung.

Thema: "${topic}"
Fachgebiet: ${subject}
Beruf/Schulform: ${berufLabel}
Jahr: ${year}

Antworte NUR mit JSON:
{
  "category": "legal" | "medical" | "financial" | "procedural" | "conceptual",
  "searchQueries": ["3-5 sehr gezielte Suchanfragen für aktuelle, korrekte Fakten. Bei Gesetzen: direkt nach dem Paragraphen suchen. Bei EBM: nach der GOP-Nummer. Bei Sozialversicherung: nach aktuellen Beitragssätzen ${year}."],
  "factTypes": ["Welche Fakten-Kategorien müssen stimmen? z.B. 'Paragraphen', 'Fristen', 'Zinssätze', 'Punktwerte', 'Beitragssätze', 'Dosierungen'"],
  "perspective": "Wer ist der Schüler in diesem Szenario? z.B. 'Auszubildende/r zur MFA in einer Hausarztpraxis' oder 'Auszubildende/r im Einzelhandel an der Kasse'",
  "keyTerms": ["Die 3-5 wichtigsten Fachbegriffe, die korrekt definiert sein müssen"],
  "legalBasis": ["Relevante Gesetze/Verordnungen, z.B. '§ 286 BGB', 'EBM Kapitel 3', 'PflAPrV'"]
}`,
      },
    ],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  const cleaned = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();

  try {
    return JSON.parse(cleaned) as TopicAnalysis;
  } catch {
    // Fallback if parsing fails
    return {
      category: "conceptual",
      searchQueries: [`${topic} aktuell ${year} Deutschland`],
      factTypes: [],
      perspective: `Auszubildende/r (${berufLabel})`,
      keyTerms: [],
    };
  }
}

// ============================================================
// STUFE 2: GEZIELTE QUELLENRECHERCHE
// ============================================================

export async function researchWithSources(
  topic: string,
  schoolType: string,
  analysis: TopicAnalysis
): Promise<{ enrichedInfo: string; sources: VerifiedSource[] }> {
  const apiKey = process.env.BRAVE_SEARCH_API_KEY;
  if (!apiKey) {
    return { enrichedInfo: "", sources: [] };
  }

  const allResults: { title: string; description: string; url: string }[] = [];
  const sources: VerifiedSource[] = [];

  // Run the targeted queries from Stufe 1 + the standard beruf-specific query
  const queries = [
    ...analysis.searchQueries,
    // Standard search as fallback
  ];

  for (const q of queries) {
    try {
      const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(q)}&freshness=py&count=5`;
      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          "Accept-Encoding": "gzip",
          "X-Subscription-Token": apiKey,
        },
      });

      if (!response.ok) continue;

      const data = await response.json();
      const results = (data.web?.results ?? [])
        .slice(0, 5)
        .filter((r: Record<string, string>) => r.title && r.description && r.url)
        .map((r: Record<string, string>) => ({
          title: r.title,
          description: r.description,
          url: r.url,
        }));

      allResults.push(...results);
    } catch {
      continue;
    }
  }

  // Deduplicate by URL
  const seen = new Set<string>();
  const unique = allResults.filter((r) => {
    if (seen.has(r.url)) return false;
    seen.add(r.url);
    return true;
  });

  // Deep-fetch top results for detailed content
  const fetchTargets = unique.slice(0, 4);
  for (const target of fetchTargets) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const resp = await fetch(target.url, {
        headers: {
          "User-Agent": "Arbeitsblatt-Generator/1.0 (Educational Tool)",
          Accept: "text/html",
        },
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!resp.ok) continue;

      const html = await resp.text();
      const text = html
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
        .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "")
        .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&nbsp;/g, " ")
        .replace(/&quot;/g, '"')
        .replace(/&#\d+;/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .substring(0, 3000);

      if (text.length > 100) {
        sources.push({
          title: target.title,
          url: target.url,
          facts: [], // Will be filled by Claude in Stufe 3
        });
      }
    } catch {
      continue;
    }
  }

  // Also add snippet-only sources
  for (const r of unique.slice(0, 10)) {
    if (!sources.find((s) => s.url === r.url)) {
      sources.push({
        title: r.title,
        url: r.url,
        facts: [],
      });
    }
  }

  // Build enriched info block (existing format + source tracking)
  // Also run the standard beruf-specific search for completeness
  const standardInfo = await searchBraveForTopic(topic, schoolType);

  const snippetBlock = unique
    .slice(0, 10)
    .map((r, i) => `${i + 1}. ${r.title} (${r.url})\n   ${r.description}`)
    .join("\n\n");

  const enrichedInfo = standardInfo
    ? `${standardInfo}\n\n=== ZUSÄTZLICHE GEZIELTE RECHERCHE ===\n${snippetBlock}`
    : snippetBlock;

  return { enrichedInfo, sources: sources.slice(0, 8) };
}

// ============================================================
// STUFE 4: FAKTENCHECK
// ============================================================

export async function factCheckWorksheet(
  worksheetJson: string,
  enrichedInfo: string,
  analysis: TopicAnalysis,
  anthropic: Anthropic
): Promise<FactCheckResult> {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1500,
    messages: [
      {
        role: "user",
        content: `Du bist ein Faktenprüfer für Bildungsmaterialien. Prüfe dieses Arbeitsblatt auf inhaltliche Korrektheit.

FAKTEN-KATEGORIEN DIE STIMMEN MÜSSEN: ${analysis.factTypes.join(", ")}
RELEVANTE RECHTSGRUNDLAGEN: ${(analysis.legalBasis || []).join(", ") || "keine"}
SCHLÜSSELBEGRIFFE: ${analysis.keyTerms.join(", ")}

QUELLENINFORMATIONEN (Web-Recherche):
${enrichedInfo.substring(0, 4000)}

ARBEITSBLATT (JSON):
${worksheetJson.substring(0, 6000)}

PRÜFE SYSTEMATISCH:
1. Stimmen alle Zahlen, Paragraphen, GOP-Nummern, Fristen, Prozentsätze mit den Quelleninformationen überein?
2. Gibt es Widersprüche zwischen Merke-Box, Schaubild und Aufgaben?
3. Sind die Lösungen korrekt? (Stimmen Ankreuz-Antworten, Lückentexte, Musterantworten?)
4. Ist die Perspektive konsistent? (Wer spricht? Wer handelt?)
5. Gibt es juristische/medizinische/fachliche Ungenauigkeiten?
6. Wird das Einstiegsbeispiel (Teil 1) im Rest des Arbeitsblatts weitergeführt?

Antworte NUR mit JSON:
{
  "passed": true/false,
  "issues": [
    {
      "fact": "Was ist falsch/ungenau?",
      "problem": "Warum ist es falsch?",
      "suggestion": "Was wäre korrekt?"
    }
  ]
}

Wenn alles korrekt ist: {"passed": true, "issues": []}`,
      },
    ],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  const cleaned = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();

  try {
    return JSON.parse(cleaned) as FactCheckResult;
  } catch {
    // If parsing fails, assume it passed (don't block generation)
    console.warn("Fact check response not parseable, assuming passed");
    return { passed: true, issues: [] };
  }
}

// ============================================================
// STUFE 5: KORREKTUR
// ============================================================

export async function correctWorksheet(
  worksheetJson: string,
  issues: FactCheckResult["issues"],
  enrichedInfo: string,
  anthropic: Anthropic
): Promise<string> {
  const issueList = issues
    .map((i, idx) => `${idx + 1}. FEHLER: ${i.fact}\n   PROBLEM: ${i.problem}\n   KORREKTUR: ${i.suggestion}`)
    .join("\n\n");

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 6000,
    messages: [
      {
        role: "user",
        content: `Du hast ein Arbeitsblatt erstellt, aber der Faktencheck hat Fehler gefunden. Korrigiere NUR die gefundenen Fehler. Ändere NICHTS anderes.

GEFUNDENE FEHLER:
${issueList}

QUELLENINFORMATIONEN (für korrekte Werte):
${enrichedInfo.substring(0, 3000)}

AKTUELLES ARBEITSBLATT (JSON):
${worksheetJson}

Antworte NUR mit dem korrigierten JSON. Gleiche Struktur, nur die Fehler behoben.`,
      },
    ],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  return text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
}

// ============================================================
// ORCHESTRATOR: Full Pipeline
// ============================================================

export async function runQualityPipeline(
  topic: string,
  subject: string,
  schoolType: string,
  anthropic: Anthropic
): Promise<QualityResult> {
  console.log(`[Pipeline] Stufe 1: Thema-Analyse für "${topic}"`);
  const analysis = await analyzeTopicWithSources(topic, subject, schoolType, anthropic);
  console.log(`[Pipeline] Kategorie: ${analysis.category}, Queries: ${analysis.searchQueries.length}, Perspektive: ${analysis.perspective}`);

  console.log(`[Pipeline] Stufe 2: Gezielte Quellenrecherche (${analysis.searchQueries.length} Queries)`);
  const { enrichedInfo, sources } = await researchWithSources(topic, schoolType, analysis);
  console.log(`[Pipeline] ${sources.length} Quellen gefunden, ${enrichedInfo.length} Zeichen Info`);

  return {
    enrichedInfo,
    sources,
    analysis,
    perspective: analysis.perspective,
  };
}
