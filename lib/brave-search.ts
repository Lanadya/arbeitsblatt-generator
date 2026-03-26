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

// Keywords that trigger specialized search queries
const ABRECHNUNG_KEYWORDS = ["ebm", "goä", "goae", "goa", "abrechnung", "gebührenordnung", "orientierungswert", "gop", "punktwert", "steigerungsfaktor", "bema", "bel", "vorhaltepauschale", "versichertenpauschale", "grundpauschale", "konsultationspauschale"];
const RECHT_KEYWORDS = ["arbeitsrecht", "kündigungsschutz", "mutterschutz", "jugendarbeitsschutz", "arbeitszeit", "berufsbildungsgesetz", "bbig"];
const SOZIAL_KEYWORDS = ["sozialversicherung", "krankenversicherung", "rentenversicherung", "pflegeversicherung", "arbeitslosenversicherung", "unfallversicherung", "beitragssatz"];
const HYGIENE_KEYWORDS = ["hygiene", "desinfektion", "sterilisation", "rki", "infektionsschutz", "mrsa", "hygieneplan", "mpbetreibv"];

// Trusted sources for deep fetch (full page content)
const TRUSTED_DOMAINS = [
  "kbv.de",
  "kvb.de",
  "abrechnungsstelle.com",
  "gelbe-liste.de",
  "bundesaerztekammer.de",
  "rki.de",
  "gesetze-im-internet.de",
  "sozialversicherung.info",
  "haufe.de",
];

function buildSmartQueries(topic: string, schoolType?: string): string[] {
  const t = topic.toLowerCase();
  const year = new Date().getFullYear();
  const queries: string[] = [];

  // Check if topic matches specialized categories
  const isAbrechnung = ABRECHNUNG_KEYWORDS.some(kw => t.includes(kw));
  const isRecht = RECHT_KEYWORDS.some(kw => t.includes(kw));
  const isSozial = SOZIAL_KEYWORDS.some(kw => t.includes(kw));
  const isHygiene = HYGIENE_KEYWORDS.some(kw => t.includes(kw));

  if (isAbrechnung) {
    // Specific GOP number detection (e.g., "GOP 03000", "03040", "EBM 01100")
    const gopMatch = t.match(/(?:gop\s*)?(\d{5})/);
    if (gopMatch) {
      queries.push(`EBM GOP ${gopMatch[1]} Punktzahl Bewertung ${year}`);
      queries.push(`Gebührenordnungsposition ${gopMatch[1]} aktuell Abrechnung`);
    }
    // Topic-specific search (e.g., "Vorhaltepauschale", "Versichertenpauschale")
    queries.push(`${topic} EBM aktuell ${year} Punktwert Bewertung`);
    queries.push(`EBM Orientierungswert ${year} aktuell Cent pro Punkt`);
    if (t.includes("goä") || t.includes("goae") || t.includes("goa")) {
      queries.push(`GOÄ Reform Stand ${year} Steigerungsfaktor`);
    }
  } else if (isRecht) {
    queries.push(`${topic} aktuell ${year} Gesetzesänderung Deutschland`);
    queries.push(`${topic} Ausbildung Berufsschule`);
  } else if (isSozial) {
    queries.push(`Sozialversicherung Beitragssätze ${year} aktuell Deutschland`);
    queries.push(`${topic} einfach erklärt Ausbildung`);
  } else if (isHygiene) {
    queries.push(`${topic} RKI Empfehlung aktuell ${year}`);
    queries.push(`${topic} Arztpraxis Anforderungen`);
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

function isTrustedUrl(url: string): boolean {
  return TRUSTED_DOMAINS.some(domain => url.includes(domain));
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
    const isAbrechnung = ABRECHNUNG_KEYWORDS.some(kw => topic.toLowerCase().includes(kw));
    const isSozial = SOZIAL_KEYWORDS.some(kw => topic.toLowerCase().includes(kw));
    const needsDeepFetch = isAbrechnung || isSozial;

    let deepContent = "";
    if (needsDeepFetch) {
      // Find trusted URLs from results
      const trustedResults = unique.filter(r => isTrustedUrl(r.url));
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
