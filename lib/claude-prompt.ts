import type { GenerateRequest } from "./types";

const SYSTEM_PROMPT = `Du bist ein erfahrener Didaktik-Experte für niedrigschwellige Bildungsmaterialien.

ZIELGRUPPE DER SCHÜLER:
- Sehr geringe Grundbildung
- Teilweise Deutsch als Zweitsprache
- Kaum Vorwissen im Themengebiet
- Geringe Aufmerksamkeitsspanne
- KEINE vorhandenen mentalen Modelle — alles muss von Grund auf aufgebaut werden

SPRACHREGELN:
- Sätze: max. 10 Wörter
- Keine Passivkonstruktionen
- Keine Nebensatzketten
- Keine Fachwörter außerhalb der Begriffe-Tabelle
- Einfache Hauptsätze bevorzugen
- Direkte Ansprache ("du", "ihr")
- Verwende korrekte deutsche Umlaute (ä, ö, ü, ß) in allen Texten

Du antwortest NUR mit einem JSON-Objekt. Kein Markdown, keine Code-Fences, kein erklärender Text. Nur reines JSON.`;

const JSON_SCHEMA = `{
  "title": "string — Haupttitel in GROSSBUCHSTABEN, z.B. 'WER BESTIMMT IM GESUNDHEITSWESEN?'",
  "subtitle": "string — Untertitel mit Schlagwörtern, getrennt durch |",
  "headerText": "string — Kopfzeile, z.B. 'ARBEITSBLATT | Gesundheitswesen | MFA / ZFA'",

  "teil1_alltagseinstieg": {
    "situationIntro": "string — z.B. 'Stell dir vor:'",
    "quotes": [
      { "speaker": "string — z.B. 'Dein Chef sagt:'", "text": "string — das Zitat" }
    ],
    "questions": ["string — Fragen die Neugier wecken, z.B. 'Was bedeutet das?'"]
  },

  "teil2_erklaerung": {
    "heading": "string — z.B. 'Das Problem: Wer bezahlt den Arzt?'",
    "steps": ["string — kurze Schritte, je max 10 Wörter"],
    "merkeBox": {
      "title": "string — z.B. '!! MERKE !!'",
      "lines": ["string — Kernaussagen, kurz und prägnant"]
    }
  },

  "teil3_schaubild": {
    "heading": "string",
    "intro": "string — z.B. 'So kommt das Geld in deine Praxis:'",
    "boxes": [
      { "label": "string — max 4 Wörter", "sublabel": "string — optional, z.B. '(z.B. AOK, TK)'" }
    ],
    "arrows": ["string — Beschriftung zwischen den Kästen, z.B. 'zahlt Beitrag'"]
  },

  "teil3_achtungBox": {
    "title": "string — z.B. 'ACHTUNG: Und wer macht die Regeln?'",
    "lines": ["string — wichtige Zusatzinfos"]
  },

  "teil4_begriffe": {
    "terms": [
      { "begriff": "string", "erklaerung": "string — 1 einfacher Satz" }
    ]
  },

  "teil5_aufgaben": {
    "level1": {
      "instruction": "string — z.B. 'Was ist richtig? Kreuze an.'",
      "questions": [
        {
          "question": "string",
          "options": ["string — 3 Antwortmöglichkeiten"]
        }
      ]
    },
    "level2": {
      "wordBank": ["string — die einzusetzenden Wörter"],
      "sentences": ["string — Sätze mit _____ als Lücke"]
    },
    "level3": {
      "situation": ["string — Beschreibung einer Alltagssituation, je 1 Satz"],
      "subQuestions": [
        { "label": "string — z.B. 'a) Wer entscheidet...'", "hint": "string — optional", "lines": 1 }
      ]
    }
  },

  "teil6_fehler": {
    "rows": [
      { "falsch": "string — typisches Missverständnis", "richtig": "string — korrekte Erklärung" }
    ]
  },

  "teil7_abschluss": {
    "title": "string — z.B. 'DAS KANNST DU JETZT!'",
    "competencies": ["string — z.B. 'Du weißt, wie das Geld in deine Praxis kommt.'"]
  },

  "loesungen": {
    "level1_antworten": [
      { "questionIndex": 0, "correctOption": "string — die richtige Antwortoption wörtlich aus den options" }
    ],
    "level2_luecken": ["string — die vollständigen Sätze MIT den eingesetzten Wörtern (ohne Lücken)"],
    "level3_musterantwort": ["string — eine Musterantwort für die Level-3-Situation, je 1 Satz pro Teilfrage"],
    "lehrerhinweis_10min": ["string — 5 kurze Schritte für einen 10-Minuten-Lehrplan zu diesem Thema"]
  }
}`;

const FEW_SHOT_EXAMPLE = `{
  "title": "WER BESTIMMT IM GESUNDHEITSWESEN?",
  "subtitle": "KV | KZV | G-BA | Geldfluss im Gesundheitswesen",
  "headerText": "ARBEITSBLATT | Gesundheitswesen | MFA / ZFA",
  "teil1_alltagseinstieg": {
    "situationIntro": "Stell dir vor:",
    "quotes": [
      { "speaker": "Dein Chef sagt:", "text": "Die KV hat die Punkte wieder gesenkt. Das nervt!" },
      { "speaker": "Oder deine Chefin sagt:", "text": "Der G-BA hat neue Regeln gemacht. Wir rechnen das jetzt anders ab." }
    ],
    "questions": [
      "Was bedeutet das? Wer sind KV und G-BA?",
      "Warum bestimmen die, was in eurer Praxis passiert?"
    ]
  },
  "teil2_erklaerung": {
    "heading": "Das Problem: Wer bezahlt den Arzt?",
    "steps": [
      "Du gehst zum Arzt oder Zahnarzt.",
      "Du zeigst deine Versichertenkarte.",
      "Du bezahlst nichts direkt.",
      "Aber: Der Arzt arbeitet ja. Wer gibt ihm Geld?"
    ],
    "merkeBox": {
      "title": "!! MERKE !!",
      "lines": [
        "Die Krankenkasse bezahlt den Arzt NICHT direkt.",
        "Dazwischen steht eine Vereinigung.",
        "Für Ärzte: die KV (Kassenärztliche Vereinigung)",
        "Für Zahnärzte: die KZV (Kassenzahnärztliche Vereinigung)",
        "Die KV / KZV verteilt das Geld an die Praxen."
      ]
    }
  },
  "teil3_schaubild": {
    "heading": "DER WEG DES GELDES",
    "intro": "So kommt das Geld in deine Praxis:",
    "boxes": [
      { "label": "DU (Patient)", "sublabel": null },
      { "label": "KRANKENKASSE", "sublabel": "(z.B. AOK, TK, Barmer)" },
      { "label": "KV / KZV", "sublabel": "(Vereinigung = Mittelsmann)" },
      { "label": "DEINE PRAXIS", "sublabel": "(dein Arbeitsplatz!)" }
    ],
    "arrows": [
      "zahlt Beitrag jeden Monat",
      "gibt Geld weiter",
      "verteilt das Geld"
    ]
  },
  "teil3_achtungBox": {
    "title": "ACHTUNG: Und wer macht die Regeln?",
    "lines": [
      "Es gibt ein Gremium. Es heißt G-BA.",
      "G-BA = Gemeinsamer Bundesausschuss",
      "Der G-BA entscheidet: Was bezahlt die Kasse? Was nicht?",
      "Beispiel: Zahlt die Kasse eine Zahnreinigung? Der G-BA sagt: Nein (nur in bestimmten Fällen)."
    ]
  },
  "teil4_begriffe": {
    "terms": [
      { "begriff": "KV", "erklaerung": "Kassenärztliche Vereinigung. Verteilt das Geld an Arztpraxen." },
      { "begriff": "KZV", "erklaerung": "Kassenzahnärztliche Vereinigung. Verteilt das Geld an Zahnarztpraxen." },
      { "begriff": "G-BA", "erklaerung": "Gemeinsamer Bundesausschuss. Macht die Regeln: Was bezahlt die Kasse?" },
      { "begriff": "Vergütung", "erklaerung": "Das Geld, das die Praxis für eine Behandlung bekommt." },
      { "begriff": "Gesundheitsökonomie", "erklaerung": "Wie wird das Geld im Gesundheitswesen verteilt? Wer bekommt wie viel?" },
      { "begriff": "Versicherten-karte", "erklaerung": "Die Karte vom Patienten. Sie zeigt: Ich bin versichert." }
    ]
  },
  "teil5_aufgaben": {
    "level1": {
      "instruction": "Was ist richtig? Kreuze an.",
      "questions": [
        {
          "question": "Wer verteilt das Geld an die Arztpraxen?",
          "options": ["Der Patient", "Die Krankenkasse direkt", "Die KV (Kassenärztliche Vereinigung)"]
        },
        {
          "question": "Was macht der G-BA?",
          "options": ["Er behandelt Patienten", "Er macht Regeln für das Gesundheitswesen", "Er verkauft Medikamente"]
        },
        {
          "question": "Die KZV ist zuständig für:",
          "options": ["Ärzte", "Zahnärzte", "Apotheken"]
        }
      ]
    },
    "level2": {
      "wordBank": ["KV", "Krankenkasse", "G-BA", "Vergütung"],
      "sentences": [
        "1. Jeden Monat zahle ich Geld an meine _________________________",
        "2. Die _________________________ verteilt das Geld an die Arztpraxen.",
        "3. Der _________________________ entscheidet, welche Behandlungen bezahlt werden.",
        "4. Das Geld, das eine Praxis für eine Behandlung bekommt, heißt _________________________"
      ]
    },
    "level3": {
      "situation": [
        "Eine Patientin kommt in eure Praxis.",
        "Sie möchte eine professionelle Zahnreinigung.",
        "Sie sagt: \\"Das zahlt doch die Kasse!\\""
      ],
      "subQuestions": [
        { "label": "a) Wer entscheidet, ob die Kasse das bezahlt?", "hint": "3 Buchstaben", "lines": 1 },
        { "label": "b) Schreibe 2 kurze Sätze: Wie erklärst du der Patientin, warum sie selbst zahlen muss?", "hint": null, "lines": 3 },
        { "label": "c) Diskutiert zu zweit: Findet ihr das fair? Warum ja / warum nein?", "hint": null, "lines": 0 }
      ]
    }
  },
  "teil6_fehler": {
    "rows": [
      { "falsch": "Die Krankenkasse bezahlt den Arzt direkt.", "richtig": "Die Kasse gibt Geld an die KV/KZV. Die verteilt es dann." },
      { "falsch": "KV und Krankenkasse sind das Gleiche.", "richtig": "Nein! Die Kasse sammelt Geld. Die KV verteilt es." },
      { "falsch": "Der Arzt kann machen, was er will.", "richtig": "Nein. Der G-BA macht Regeln. Der Arzt muss sich daran halten." },
      { "falsch": "Das betrifft mich nicht.", "richtig": "Doch! Die Vergütung bestimmt, wie viel Geld in eure Praxis kommt." }
    ]
  },
  "teil7_abschluss": {
    "title": "DAS KANNST DU JETZT!",
    "competencies": [
      "Du weißt, wie das Geld in deine Praxis kommt.",
      "Du kannst erklären, was KV, KZV und G-BA bedeuten.",
      "Du verstehst, warum nicht alles von der Kasse bezahlt wird.",
      "Du kannst einer Patientin erklären, warum sie selbst zahlen muss."
    ]
  },
  "loesungen": {
    "level1_antworten": [
      { "questionIndex": 0, "correctOption": "Die KV (Kassenärztliche Vereinigung)" },
      { "questionIndex": 1, "correctOption": "Er macht Regeln für das Gesundheitswesen" },
      { "questionIndex": 2, "correctOption": "Zahnärzte" }
    ],
    "level2_luecken": [
      "1. Jeden Monat zahle ich Geld an meine Krankenkasse.",
      "2. Die KV verteilt das Geld an die Arztpraxen.",
      "3. Der G-BA entscheidet, welche Behandlungen bezahlt werden.",
      "4. Das Geld, das eine Praxis für eine Behandlung bekommt, heißt Vergütung."
    ],
    "level3_musterantwort": [
      "a) Der G-BA entscheidet, ob die Kasse das bezahlt.",
      "b) Die Zahnreinigung steht nicht im Leistungskatalog. Der G-BA hat entschieden, dass die Kasse das nicht bezahlt. Deshalb müssen Sie selbst zahlen.",
      "c) Offene Diskussion — verschiedene Meinungen sind möglich."
    ],
    "lehrerhinweis_10min": [
      "Min 1-2: Einstieg mit der Alltagssituation — Schüler lesen die Zitate laut vor.",
      "Min 3-4: Erklärung am Schaubild — den Geldfluss Schritt für Schritt durchgehen.",
      "Min 5-6: Begriffe-Tabelle gemeinsam lesen und klären.",
      "Min 7-8: Aufgabe 1 (Ankreuzen) selbstständig bearbeiten lassen.",
      "Min 9-10: Aufgabe 2 (Lückentext) bearbeiten, gemeinsam kontrollieren."
    ]
  }
}`;

export function buildPrompt(input: GenerateRequest, currentInfo?: string): { system: string; user: string } {
  const currentInfoBlock = currentInfo
    ? `\nAKTUELLE INFORMATIONEN ZUM THEMA (Stand: ${new Date().toLocaleDateString("de-DE")}):\n${currentInfo}\nBerücksichtige diese aktuellen Informationen im Arbeitsblatt, besonders im Alltagseinstieg und in den Aufgaben.\n`
    : "";

  const user = `Erstelle ein vollständiges Arbeitsblatt zum Thema: "${input.topic}"

KONTEXT:
- Fachgebiet: ${input.subject}
- Zielgruppe: ${input.schoolType}
- Sprachniveau: A2-B1
- Zeitrahmen: 45 Minuten

STRUKTUR (zwingend einhalten, in dieser Reihenfolge):
1. ALLTAGSEINSTIEG — Konkrete Situation aus dem Alltag der Zielgruppe (${input.schoolType}). Max. 3 kurze Sätze, keine Fachbegriffe. Als Zitat/Sprechblase wenn möglich.
2. EINFACHE ERKLÄRUNG — Extrem einfach, Sätze max. 10 Wörter. Schritt-für-Schritt-Aufbau.
3. SCHAUBILD — Flussdiagramm mit max. 5 Kästen. Max. 4 Wörter pro Kasten. Plus optionale Achtung-Box für wichtige Zusatzinfos.
4. BEGRIFFE-TABELLE — Max. 6 Begriffe. Je 1 einfacher Erklärungssatz.
5. ÜBUNGEN (3 Stufen) — Level 1: 3 Multiple-Choice-Fragen (je 3 Optionen). Level 2: 4 Lückentexte mit Wortbank. Level 3: 1 Alltagssituation mit 2-3 Teilfragen.
6. TYPISCHE FEHLER — 3-4 häufige Missverständnisse als Falsch/Richtig-Paare.
7. ABSCHLUSS — "Das kannst du jetzt!" mit 3-4 Kompetenzpunkten.
8. LÖSUNGEN — Lösungen für alle Aufgaben: Level 1 (welche Option ist richtig), Level 2 (vollständige Sätze mit eingesetzten Wörtern), Level 3 (Musterantwort). Plus ein 10-Minuten-Lehrplan mit 5 Schritten.

WICHTIG: Baue konkrete Bezüge zum Alltag von ${input.schoolType} ein!
${currentInfoBlock}

Antworte NUR mit einem JSON-Objekt in exakt diesem Schema:

${JSON_SCHEMA}

Hier ein vollständiges Beispiel als Orientierung:

${FEW_SHOT_EXAMPLE}

Jetzt erstelle ein Arbeitsblatt zum Thema "${input.topic}" für ${input.schoolType} im Bereich ${input.subject}. Antworte NUR mit JSON.`;

  return { system: SYSTEM_PROMPT, user };
}
