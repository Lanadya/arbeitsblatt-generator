// === BerufConfig Schema ===
// Jeder Beruf/Schultyp hat eine eigene Config-Datei.
// Pflichtfelder: id, label, kurz, faecher
// Alles andere ist optional — der Generator funktioniert auch ohne.

export interface LernfeldEntry {
  /** Lernfeld-Name, z.B. "LF 3: Praxishygiene..." */
  name: string;
  /** Prüfungsbereich, z.B. "Behandlungsassistenz" */
  pruefungsbereich?: string;
  /** Kernbegriffe als Array */
  kernbegriffe?: string[];
  /** Konkretes Praxis-Szenario */
  alltagsbezug?: string;
}

export interface SuchKonfiguration {
  /** Keyword-Gruppen für spezialisierte Suchqueries */
  keywords: Record<string, string[]>;
  /** Domains die als vertrauenswürdig gelten (Deep-Fetch) */
  trustedDomains: string[];
  /** Bei welchen Keyword-Gruppen wird Deep-Fetch ausgelöst */
  deepFetchTrigger: string[];
}

export interface PromptErweiterungen {
  /** Praxisbezug-Text der in den System-Prompt injiziert wird */
  praxisbezug: string;
  /** Level-3-Spezialanweisungen pro Keyword-Gruppe */
  level3Spezial: Record<string, string>;
}

export interface BerufConfig {
  /** Eindeutige ID, z.B. "mfa", "pflege", "einzelhandel" */
  id: string;
  /** Anzeige-Label im Dropdown, z.B. "MFA (Medizinische Fachangestellte)" */
  label: string;
  /** Kurzform, z.B. "MFA" */
  kurz: string;
  /** Kategorie für optgroup im Dropdown */
  kategorie: "ausbildungsberuf" | "allgemeinbildend" | "foerderschule" | "sonstige";

  /** Fachgebiet-Optionen (Dropdown "Fach") */
  faecher: string[];
  /** Beispiel-Themen (Quick-Tags im Formular) */
  themenBeispiele: string[];

  /** Keyword → Lernfeld-Kontext Mapping (pipe-getrennte Keywords als Key) */
  lernfeldMap: Record<string, string>;

  /** Suchkonfiguration für Brave Search */
  suchkonfiguration?: SuchKonfiguration;

  /** Prompt-Erweiterungen */
  promptErweiterungen?: PromptErweiterungen;

  /** Vollständiges JSON-Beispiel für Few-Shot-Prompting */
  fewShotExample?: string;
}
