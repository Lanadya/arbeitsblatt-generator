interface BraveSearchResult {
  title: string;
  description: string;
  url: string;
}

interface BraveWebResult {
  title?: string;
  description?: string;
  url?: string;
}

interface BraveSearchResponse {
  web?: {
    results?: BraveWebResult[];
  };
}

import { getBerufConfig, resolveBerufId } from "./beruf-config";

// Fallback keywords for when no beruf-specific config exists
const FALLBACK_KEYWORDS: Record<string, string[]> = {
  recht: ["arbeitsrecht", "kündigungsschutz", "mutterschutz", "jugendarbeitsschutz", "arbeitszeit", "berufsbildungsgesetz", "bbig"],
  sozial: ["sozialversicherung", "krankenversicherung", "rentenversicherung", "pflegeversicherung", "arbeitslosenversicherung", "unfallversicherung", "beitragssatz"],
  hygiene: ["hygiene", "desinfektion", "sterilisation", "rki", "infektionsschutz", "mrsa", "hygieneplan"],
};

const FALLBACK_TRUSTED_DOMAINS = [
  "gesetze-im-internet.de",
  "haufe.de",
  "sozialversicherung.info",
];

function buildSmartQueries(topic: string, schoolType?: string): string[] {
  const t = topic.toLowerCase();
  const year = new Date().getFullYear();
  const queries: string[] = [];

  // Resolve beruf config for keyword-aware queries
  const berufId = schoolType ? resolveBerufId(schoolType) : undefined;
  const berufConfig = berufId ? getBerufConfig(berufId) : undefined;
  const suchKeywords = berufConfig?.suchkonfiguration?.keywords ?? FALLBACK_KEYWORDS;

  // Find which keyword group matches
  let matchedGroup: string | null = null;
  for (const [gruppe, keywords] of Object.entries(suchKeywords)) {
    if (keywords.some(kw => t.includes(kw))) {
      matchedGroup = gruppe;
      break;
    }
  }

  // Build queries based on matched keyword group
  if (matchedGroup === "abrechnung") {
    // MFA/ZFA-specific: GOP number detection
    const gopMatch = t.match(/(?:gop\s*)?(\d{5})/);
    if (gopMatch) {
      queries.push(`EBM GOP ${gopMatch[1]} Punktzahl Bewertung ${year}`);
      queries.push(`Gebührenordnungsposition ${gopMatch[1]} aktuell Abrechnung`);
    }
    queries.push(`${topic} EBM aktuell ${year} Punktwert Bewertung`);
    queries.push(`EBM Orientierungswert ${year} aktuell Cent pro Punkt`);
    if (t.includes("goä") || t.includes("goae") || t.includes("goa")) {
      queries.push(`GOÄ Reform Stand ${year} Steigerungsfaktor`);
    }
  } else if (matchedGroup === "kalkulation") {
    // Einzelhandel-specific
    queries.push(`${topic} Einzelhandel Kalkulation aktuell ${year}`);
    queries.push(`Handelskalkulation ${topic} Beispiel Berufsschule`);
  } else if (matchedGroup === "recht") {
    queries.push(`${topic} aktuell ${year} Gesetzesänderung Deutschland`);
    queries.push(`${topic} Ausbildung Berufsschule`);
  } else if (matchedGroup === "sozial") {
    queries.push(`Sozialversicherung Beitragssätze ${year} aktuell Deutschland`);
    queries.push(`${topic} einfach erklärt Ausbildung`);
  } else if (matchedGroup === "hygiene") {
    queries.push(`${topic} RKI Empfehlung aktuell ${year}`);
    queries.push(`${topic} Anforderungen Praxis`);
  } else if (matchedGroup === "medikamente") {
    // Pflege-specific
    queries.push(`${topic} Pflege aktuell ${year}`);
    queries.push(`${topic} Nebenwirkungen Pflegemaßnahmen`);
  } else if (matchedGroup === "pflege") {
    queries.push(`${topic} Pflegestandard aktuell ${year}`);
    queries.push(`${topic} Expertenstandard DNQP`);
  } else {
    // Generic: topic + context
    queries.push(`${topic} aktuell ${year} Deutschland`);
  }

  // Always add a school-type-specific query if provided
  if (schoolType) {
    queries.push(`${topic} ${schoolType} Unterricht Prüfung`);
  }

  return queries;
}

// Fetch full page text from a URL (for trusted sources)
async function fetchPageText(url: string): Promise<string> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000); // 8s timeout

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Arbeitsblatt-Generator/1.0 (Educational Tool)",
        "Accept": "text/html",
      },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) return "";

    const html = await response.text();

    // Strip HTML tags, scripts, styles — extract readable text
    const text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "")
      .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "")
      .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&nbsp;/g, " ")
      .replace(/&quot;/g, '"')
      .replace(/&#\d+;/g, "")
      .replace(/\s+/g, " ")
      .trim();

    // Return first 3000 chars (enough for Claude to extract key data)
    return text.substring(0, 3000);
  } catch {
    return "";
  }
}

function isTrustedUrl(url: string, trustedDomains: string[]): boolean {
  return trustedDomains.some(domain => url.includes(domain));
}

export async function searchBraveForTopic(topic: string, schoolType?: string): Promise<string> {
  const apiKey = process.env.BRAVE_SEARCH_API_KEY;

  if (!apiKey) {
    console.log("BRAVE_SEARCH_API_KEY not set — skipping web search.");
    return "";
  }

  try {
    const queries = buildSmartQueries(topic, schoolType);
    const allResults: BraveSearchResult[] = [];

    for (const q of queries) {
      const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(q)}&freshness=py&count=5`;

      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          "Accept-Encoding": "gzip",
          "X-Subscription-Token": apiKey,
        },
      });

      if (!response.ok) {
        console.error(`Brave Search API error for "${q}": ${response.status}`);
        continue;
      }

      const data = (await response.json()) as BraveSearchResponse;
      const results = (data.web?.results ?? [])
        .slice(0, 5)
        .filter((r): r is BraveWebResult & { title: string; description: string; url: string } =>
          Boolean(r.title && r.description && r.url)
        )
        .map((r) => ({ title: r.title, description: r.description, url: r.url }));

      allResults.push(...results);
    }

    if (allResults.length === 0) {
      return "";
    }

    // Deduplicate by URL
    const seen = new Set<string>();
    const unique = allResults.filter(r => {
      if (seen.has(r.url)) return false;
      seen.add(r.url);
      return true;
    });

    // === DEEP FETCH: Get full content from the best trusted sources ===
    const berufId = schoolType ? resolveBerufId(schoolType) : undefined;
    const berufConfig = berufId ? getBerufConfig(berufId) : undefined;
    const trustedDomains = berufConfig?.suchkonfiguration?.trustedDomains ?? FALLBACK_TRUSTED_DOMAINS;
    const deepFetchTriggers = berufConfig?.suchkonfiguration?.deepFetchTrigger ?? [];
    const suchKeywords = berufConfig?.suchkonfiguration?.keywords ?? FALLBACK_KEYWORDS;

    // Check if deep fetch is needed based on config triggers
    const topicLower = topic.toLowerCase();
    const needsDeepFetch = deepFetchTriggers.some(trigger => {
      const keywords = suchKeywords[trigger];
      return keywords?.some(kw => topicLower.includes(kw));
    });

    let deepContent = "";
    if (needsDeepFetch) {
      // Find trusted URLs from results
      const trustedResults = unique.filter(r => isTrustedUrl(r.url, trustedDomains));
      const fetchTargets = trustedResults.length > 0
        ? trustedResults.slice(0, 2)
        : unique.slice(0, 2); // fallback: fetch top 2 results

      console.log(`Deep-fetching ${fetchTargets.length} pages for topic "${topic}"`);

      const fetches = await Promise.all(
        fetchTargets.map(async (r) => {
          const text = await fetchPageText(r.url);
          if (text.length > 100) {
            return `\n--- Quelle: ${r.title} (${r.url}) ---\n${text}`;
          }
          return "";
        })
      );

      deepContent = fetches.filter(Boolean).join("\n");
    }

    // Build summary: snippets + deep content
    const snippetSummary = unique
      .slice(0, 8)
      .map((r, i) => `${i + 1}. ${r.title}\n   ${r.description}`)
      .join("\n\n");

    if (deepContent) {
      return `${snippetSummary}\n\n=== DETAILLIERTE QUELLENINFORMATIONEN ===\n${deepContent}`;
    }

    return snippetSummary;
  } catch (error) {
    console.error("Brave Search failed:", error);
    return "";
  }
}
