import { alleBerufe, weitereSchultypen } from "../config/berufe";
import type { BerufConfig, SchulTypOption } from "../config/berufe";

// === Lookup-Cache ===
const berufById = new Map<string, BerufConfig>();
for (const b of alleBerufe) {
  berufById.set(b.id, b);
}

const schulTypById = new Map<string, SchulTypOption>();
for (const s of weitereSchultypen) {
  schulTypById.set(s.id, s);
}

// === Public API ===

/** Get a BerufConfig by its ID. Returns undefined if not found. */
export function getBerufConfig(berufId: string): BerufConfig | undefined {
  return berufById.get(berufId);
}

/** Get all registered BerufConfigs (with full lernfeld maps). */
export function getAllBerufe(): BerufConfig[] {
  return alleBerufe;
}

/** Get all school types (berufe + weitere) for dropdown rendering. */
export function getAllSchulTypen(): { id: string; label: string; kategorie: string }[] {
  const result: { id: string; label: string; kategorie: string }[] = [];
  for (const b of alleBerufe) {
    result.push({ id: b.id, label: b.label, kategorie: b.kategorie });
  }
  for (const s of weitereSchultypen) {
    result.push({ id: s.id, label: s.label, kategorie: s.kategorie });
  }
  return result;
}

/** Get subject/fach options for a given beruf or school type. */
export function getFaecherForBeruf(berufId: string): string[] {
  const beruf = berufById.get(berufId);
  if (beruf) return beruf.faecher;
  const schulTyp = schulTypById.get(berufId);
  if (schulTyp) return schulTyp.faecher;
  // Fallback: generic subjects
  return ["Politik / Gesellschaft / Sozialkunde", "Wirtschaft / WiSo", "Mathematik / Rechnen", "Deutsch / Kommunikation", "Naturwissenschaften", "Recht", "Berufskunde / Fachtheorie", "Sonstiges"];
}

/** Get quick-tag topic suggestions for a given beruf or school type. */
export function getThemenBeispiele(berufId: string): string[] {
  const beruf = berufById.get(berufId);
  if (beruf) return beruf.themenBeispiele;
  const schulTyp = schulTypById.get(berufId);
  if (schulTyp) return schulTyp.themenBeispiele;
  return [];
}

/** Resolve lernfeld context for a topic + beruf. Returns empty string if no match. */
export function getLernfeldContext(topic: string, berufId: string): string {
  const beruf = berufById.get(berufId);
  if (!beruf) return "";

  const t = topic.toLowerCase();
  for (const [keywords, context] of Object.entries(beruf.lernfeldMap)) {
    const kws = keywords.split("|");
    if (kws.some(kw => t.includes(kw))) {
      return context;
    }
  }
  return "";
}

/** Get the display label for a beruf or school type. */
export function getBerufLabel(berufId: string): string {
  const beruf = berufById.get(berufId);
  if (beruf) return beruf.label;
  const schulTyp = schulTypById.get(berufId);
  if (schulTyp) return schulTyp.label;
  return berufId;
}

/** Try to resolve a berufId from an old-style schoolType label (backwards compatibility). */
export function resolveBerufId(schoolTypeOrBerufId: string): string {
  // Already a valid ID?
  if (berufById.has(schoolTypeOrBerufId) || schulTypById.has(schoolTypeOrBerufId)) {
    return schoolTypeOrBerufId;
  }

  // Try matching old labels to new IDs
  const lower = schoolTypeOrBerufId.toLowerCase();
  if (lower.includes("mfa")) return "mfa";
  if (lower.includes("zfa")) return "zfa";
  if (lower.includes("pflege")) return "pflege";
  if (lower.includes("einzelhandel") || lower.includes("verkäufer")) return "einzelhandel";
  if (lower.includes("friseur")) return "friseur";
  if (lower.includes("hauptschule") || lower.includes("mittelschule")) return "hauptschule";
  if (lower.includes("realschule")) return "realschule";
  if (lower.includes("daz") || lower.includes("willkommen")) return "daz";
  if (lower.includes("förderschule") || lower.includes("foerderschule")) {
    if (lower.includes("lernen")) return "foerderschule-lernen";
    if (lower.includes("sprache")) return "foerderschule-sprache";
    if (lower.includes("emotion") || lower.includes("sozial") || lower.includes("ese")) return "foerderschule-ese";
    if (lower.includes("hör") || lower.includes("hoer") || lower.includes("kommunikation")) return "foerderschule-hoeren";
    if (lower.includes("körper") || lower.includes("koerper") || lower.includes("motorisch")) return "foerderschule-kmb";
    return "foerderschule-lernen"; // default
  }
  if (lower.includes("allgemein")) return "allgemein";
  return "sonstiges";
}
