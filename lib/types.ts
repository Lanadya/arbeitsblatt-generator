// === Eingabe von der Lehrkraft ===

export interface GenerateRequest {
  topic: string;
  subject: string;
  schoolType: string;
}

// === Strukturierter Output von Claude ===
// Exakte JSON-Struktur fuer die 7 Teile des Arbeitsblatts

export interface WorksheetContent {
  title: string;
  subtitle: string;
  headerText: string;

  teil1_alltagseinstieg: {
    situationIntro: string;
    quotes: { speaker: string; text: string }[];
    questions: string[];
  };

  teil2_erklaerung: {
    heading: string;
    steps: string[];
    merkeBox: {
      title: string;
      lines: string[];
    };
  };

  teil3_schaubild: {
    heading: string;
    intro: string;
    boxes: { label: string; sublabel?: string }[];
    arrows: string[];
  };

  teil3_achtungBox?: {
    title: string;
    lines: string[];
  };

  teil4_begriffe: {
    terms: { begriff: string; erklaerung: string }[];
  };

  teil5_aufgaben: {
    level1: {
      instruction: string;
      questions: {
        question: string;
        options: string[];
      }[];
    };
    level2: {
      wordBank: string[];
      sentences: string[];
    };
    level3: {
      situation: string[];
      subQuestions: { label: string; hint?: string; lines: number }[];
    };
  };

  teil6_fehler: {
    rows: { falsch: string; richtig: string }[];
  };

  teil7_abschluss: {
    title: string;
    competencies: string[];
  };

  loesungen: {
    level1_antworten: { questionIndex: number; correctOption: string }[];
    level2_luecken: string[];
    level3_musterantwort: string[];
    lehrerhinweis_10min: string[];
  };
}

// === Dropdown-Optionen fuer das Formular ===

export const SUBJECT_OPTIONS = [
  "Politik / Gesellschaft / Sozialkunde",
  "Wirtschaft / WiSo",
  "Gesundheitswesen",
  "Mathematik / Rechnen",
  "Naturwissenschaften",
  "Deutsch / Kommunikation",
  "Recht",
  "Berufskunde / Fachtheorie",
  "Sonstiges",
] as const;

export const SCHOOL_TYPE_OPTIONS = [
  "MFA (Medizinische Fachangestellte)",
  "ZFA (Zahnmedizinische Fachangestellte)",
  "Einzelhandelskaufleute",
  "Friseur/in",
  "Pflegefachkraft",
  "Hauptschule / Mittelschule",
  "Realschule",
  "DaZ / Willkommensklasse",
  "Allgemein (kein spezifischer Beruf)",
  "Sonstiges",
] as const;
