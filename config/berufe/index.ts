import type { BerufConfig } from "./_schema";
import mfa from "./mfa";
import pflege from "./pflege";
import einzelhandel from "./einzelhandel";
import buero from "./buero";

// === Alle registrierten Berufe ===
// Neue Berufe hier importieren und zum Array hinzufügen.
const alleBerufe: BerufConfig[] = [
  mfa,
  pflege,
  einzelhandel,
  buero,
];

// === Schultypen OHNE eigene Beruf-Config ===
// Diese haben keine Lernfeld-Maps, bekommen aber trotzdem Fach-Optionen.
export interface SchulTypOption {
  id: string;
  label: string;
  kategorie: BerufConfig["kategorie"];
  faecher: string[];
  themenBeispiele: string[];
}

const weitereSchultypen: SchulTypOption[] = [
  {
    // Bündelfächer nach KMK-Rahmenlehrplan 2021/2022
    id: "zfa",
    label: "ZFA (Zahnmedizinische Fachangestellte)",
    kategorie: "ausbildungsberuf",
    faecher: [
      "Zahnmedizinische Assistenz",                       // LF 3, 6, 7, 10, 12
      "Leistungserfassung und -abrechnung",               // LF 4, 5, 8, 11
      "Wirtschaftsbeziehungen und Praxismanagement",      // LF 1, 2, 9, 13
      "Deutsch / Kommunikation",
      "Politik / Gesellschaftslehre",
      "Sonstiges",
    ],
    themenBeispiele: ["Kariesbehandlung", "BEMA-Abrechnung", "Röntgen", "Prophylaxe", "Arbeitsrecht"],
  },
  {
    // Bündelfächer nach KMK-Rahmenlehrplan 2008
    id: "friseur",
    label: "Friseur/in",
    kategorie: "ausbildungsberuf",
    faecher: [
      "Salon- und Kundenmanagement",                      // LF 1, 2, 12
      "Pflege und Gestaltung",                             // LF 3, 4, 5, 6, 10
      "Farb- und Formveränderung",                         // LF 7, 8, 9, 11, 13
      "Wirtschafts- und Betriebslehre",
      "Deutsch / Kommunikation",
      "Politik / Gesellschaftslehre",
      "Sonstiges",
    ],
    themenBeispiele: ["Haartypen", "Kundenberatung", "Dauerwelle", "Arbeitsschutz", "Kaufvertrag"],
  },
  {
    id: "hauptschule",
    label: "Hauptschule / Mittelschule",
    kategorie: "allgemeinbildend",
    faecher: ["Politik / Gesellschaft / Sozialkunde", "Wirtschaft / WiSo", "Mathematik / Rechnen", "Deutsch / Kommunikation", "Naturwissenschaften", "Sonstiges"],
    themenBeispiele: ["Demokratie", "Bewerbung", "Prozentrechnung", "Erörterung"],
  },
  {
    id: "realschule",
    label: "Realschule",
    kategorie: "allgemeinbildend",
    faecher: ["Politik / Gesellschaft / Sozialkunde", "Wirtschaft / WiSo", "Mathematik / Rechnen", "Deutsch / Kommunikation", "Naturwissenschaften", "Sonstiges"],
    themenBeispiele: ["Soziale Marktwirtschaft", "Erörterung", "Gleichungen", "Ökologie"],
  },
  {
    id: "daz",
    label: "DaZ / Willkommensklasse",
    kategorie: "allgemeinbildend",
    faecher: ["Deutsch / Kommunikation", "Mathematik / Rechnen", "Politik / Gesellschaft / Sozialkunde", "Berufsorientierung", "Sonstiges"],
    themenBeispiele: ["Einkaufen", "Arztbesuch", "Bewerbung", "Wohnung suchen"],
  },
  // Förderschule — differenziert nach Schwerpunkt (Cowork-04)
  {
    id: "foerderschule-lernen",
    label: "Förderschule — Lernen",
    kategorie: "foerderschule",
    faecher: ["Mathematik (vereinfacht)", "Deutsch / Lesen", "Alltagskunde", "Berufsorientierung", "Sonstiges"],
    themenBeispiele: ["Geld zählen", "Uhrzeit", "Einkaufen", "Brief schreiben"],
  },
  {
    id: "foerderschule-sprache",
    label: "Förderschule — Sprache",
    kategorie: "foerderschule",
    faecher: ["Deutsch / Kommunikation", "Mathematik / Rechnen", "Politik / Gesellschaft / Sozialkunde", "Naturwissenschaften", "Sonstiges"],
    themenBeispiele: ["Wortarten", "Textverständnis", "Gesprächsregeln", "Bericht schreiben"],
  },
  {
    id: "foerderschule-ese",
    label: "Förderschule — Emotionale/soziale Entwicklung",
    kategorie: "foerderschule",
    faecher: ["Politik / Gesellschaft / Sozialkunde", "Deutsch / Kommunikation", "Mathematik / Rechnen", "Berufsorientierung", "Sonstiges"],
    themenBeispiele: ["Konflikte lösen", "Teamarbeit", "Bewerbung", "Rechte und Pflichten"],
  },
  {
    id: "foerderschule-hoeren",
    label: "Förderschule — Hören und Kommunikation",
    kategorie: "foerderschule",
    faecher: ["Deutsch / Kommunikation", "Mathematik / Rechnen", "Politik / Gesellschaft / Sozialkunde", "Naturwissenschaften", "Sonstiges"],
    themenBeispiele: ["Textverständnis", "Diagramme lesen", "Demokratie", "Bewerbung"],
  },
  {
    id: "foerderschule-kmb",
    label: "Förderschule — Körperliche/motorische Entwicklung",
    kategorie: "foerderschule",
    faecher: ["Politik / Gesellschaft / Sozialkunde", "Deutsch / Kommunikation", "Mathematik / Rechnen", "Naturwissenschaften", "Sonstiges"],
    themenBeispiele: ["Demokratie", "Erörterung", "Prozentrechnung", "Ökologie"],
  },
  {
    id: "allgemein",
    label: "Allgemein (kein spezifischer Beruf)",
    kategorie: "sonstige",
    faecher: ["Politik / Gesellschaft / Sozialkunde", "Wirtschaft / WiSo", "Mathematik / Rechnen", "Deutsch / Kommunikation", "Naturwissenschaften", "Recht", "Berufskunde / Fachtheorie", "Sonstiges"],
    themenBeispiele: [],
  },
  {
    id: "sonstiges",
    label: "Sonstiges",
    kategorie: "sonstige",
    faecher: ["Sonstiges"],
    themenBeispiele: [],
  },
];

export { alleBerufe, weitereSchultypen };
export type { BerufConfig };
