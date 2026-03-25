interface BraveSearchResult {
  title: string;
  description: string;
}

interface BraveWebResult {
  title?: string;
  description?: string;
}

interface BraveSearchResponse {
  web?: {
    results?: BraveWebResult[];
  };
}

// Keywords that trigger specialized search queries
const ABRECHNUNG_KEYWORDS = ["ebm", "goä", "goae", "goa", "abrechnung", "gebührenordnung", "orientierungswert", "gop", "punktwert", "steigerungsfaktor", "bema", "bel"];
const RECHT_KEYWORDS = ["arbeitsrecht", "kündigungsschutz", "mutterschutz", "jugendarbeitsschutz", "arbeitszeit", "berufsbildungsgesetz", "bbig"];
const SOZIAL_KEYWORDS = ["sozialversicherung", "krankenversicherung", "rentenversicherung", "pflegeversicherung", "arbeitslosenversicherung", "unfallversicherung", "beitragssatz"];
const HYGIENE_KEYWORDS = ["hygiene", "desinfektion", "sterilisation", "rki", "infektionsschutz", "mrsa", "hygieneplan", "mpbetreibv"];

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
    queries.push(`EBM Orientierungswert ${year} aktuell Cent pro Punkt`);
    queries.push(`${topic} MFA Abrechnung aktuell ${year}`);
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
      const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(q)}&freshness=pm&count=3`;

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
        .slice(0, 3)
        .filter((r): r is BraveWebResult & { title: string; description: string } =>
          Boolean(r.title && r.description)
        )
        .map((r) => ({ title: r.title, description: r.description }));

      allResults.push(...results);
    }

    if (allResults.length === 0) {
      return "";
    }

    // Deduplicate by title
    const seen = new Set<string>();
    const unique = allResults.filter(r => {
      if (seen.has(r.title)) return false;
      seen.add(r.title);
      return true;
    });

    const summary = unique
      .slice(0, 8)
      .map((r, i) => `${i + 1}. ${r.title}\n   ${r.description}`)
      .join("\n\n");

    return summary;
  } catch (error) {
    console.error("Brave Search failed:", error);
    return "";
  }
}
