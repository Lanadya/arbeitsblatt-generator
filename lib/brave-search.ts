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

export async function searchBraveForTopic(topic: string): Promise<string> {
  const apiKey = process.env.BRAVE_SEARCH_API_KEY;

  if (!apiKey) {
    console.log("BRAVE_SEARCH_API_KEY not set — skipping web search.");
    return "";
  }

  try {
    const query = encodeURIComponent(topic);
    const url = `https://api.search.brave.com/res/v1/web/search?q=${query}&freshness=pm&count=5`;

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip",
        "X-Subscription-Token": apiKey,
      },
    });

    if (!response.ok) {
      console.error(`Brave Search API error: ${response.status} ${response.statusText}`);
      return "";
    }

    const data = (await response.json()) as BraveSearchResponse;
    const results: BraveSearchResult[] = (data.web?.results ?? [])
      .slice(0, 5)
      .filter((r): r is BraveWebResult & { title: string; description: string } =>
        Boolean(r.title && r.description)
      )
      .map((r) => ({ title: r.title, description: r.description }));

    if (results.length === 0) {
      return "";
    }

    const summary = results
      .map((r, i) => `${i + 1}. ${r.title}\n   ${r.description}`)
      .join("\n\n");

    return summary;
  } catch (error) {
    console.error("Brave Search failed:", error);
    return "";
  }
}
