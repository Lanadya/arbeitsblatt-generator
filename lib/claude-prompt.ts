import type { GenerateRequest } from "./types";

const SYSTEM_PROMPT = `Du bist ein erfahrener Didaktik-Experte fuer niedrigschwellige Bildungsmaterialien.

ZIELGRUPPE DER SCHUELER:
- Sehr geringe Grundbildung
- Teilweise Deutsch als Zweitsprache
- Kaum Vorwissen im Themengebiet
- Geringe Aufmerksamkeitsspanne
- KEINE vorhandenen mentalen Modelle — alles muss von Grund auf aufgebaut werden

SPRACHREGELN:
- Saetze: max. 10 Woerter
- Keine Passivkonstruktionen
- Keine Nebensatzketten
- Keine Fachwoerter ausserhalb der Begriffe-Tabelle
- Einfache Hauptsaetze bevorzugen
- Direkte Ansprache ("du", "ihr")
- Keine Umlaute in den Texten (ae statt ä, oe statt ö, ue statt ü, ss statt ß)

Du antwortest NUR mit einem JSON-Objekt. Kein Markdown, keine Code-Fences, kein erklaerenderText. Nur reines JSON.`;

const JSON_SCHEMA = `{
  "title": "string — Haupttitel in GROSSBUCHSTABEN, z.B. 'WER BESTIMMT IM GESUNDHEITSWESEN?'",
  "subtitle": "string — Untertitel mit Schlagwoertern, getrennt durch |",
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
    "steps": ["string — kurze Schritte, je max 10 Woerter"],
    "merkeBox": {
      "title": "string — z.B. '!! MERKE !!'",
      "lines": ["string — Kernaussagen, kurz und praegnant"]
    }
  },

  "teil3_schaubild": {
    "heading": "string",
    "intro": "string — z.B. 'So kommt das Geld in deine Praxis:'",
    "boxes": [
      { "label": "string — max 4 Woerter", "sublabel": "string — optional, z.B. '(z.B. AOK, TK)'" }
    ],
    "arrows": ["string — Beschriftung zwischen den Kaesten, z.B. 'zahlt Beitrag'"]
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
          "options": ["string — 3 Antwortmoeglichkeiten"]
        }
      ]
    },
    "level2": {
      "wordBank": ["string — die einzusetzenden Woerter"],
      "sentences": ["string — Saetze mit _____ als Luecke"]
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
      { "falsch": "string — typisches Missverstaendnis", "richtig": "string — korrekte Erklaerung" }
    ]
  },

  "teil7_abschluss": {
    "title": "string — z.B. 'DAS KANNST DU JETZT!'",
    "competencies": ["string — z.B. 'Du weisst, wie das Geld in deine Praxis kommt.'"]
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
        "Fuer Aerzte: die KV (Kassenaerztliche Vereinigung)",
        "Fuer Zahnaerzte: die KZV (Kassenzahnaerztliche Vereinigung)",
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
      "Es gibt ein Gremium. Es heisst G-BA.",
      "G-BA = Gemeinsamer Bundesausschuss",
      "Der G-BA entscheidet: Was bezahlt die Kasse? Was nicht?",
      "Beispiel: Zahlt die Kasse eine Zahnreinigung? Der G-BA sagt: Nein (nur in bestimmten Faellen)."
    ]
  },
  "teil4_begriffe": {
    "terms": [
      { "begriff": "KV", "erklaerung": "Kassenaerztliche Vereinigung. Verteilt das Geld an Arztpraxen." },
      { "begriff": "KZV", "erklaerung": "Kassenzahnaerztliche Vereinigung. Verteilt das Geld an Zahnarztpraxen." },
      { "begriff": "G-BA", "erklaerung": "Gemeinsamer Bundesausschuss. Macht die Regeln: Was bezahlt die Kasse?" },
      { "begriff": "Verguetung", "erklaerung": "Das Geld, das die Praxis fuer eine Behandlung bekommt." },
      { "begriff": "Gesundheits-oekonomie", "erklaerung": "Wie wird das Geld im Gesundheitswesen verteilt? Wer bekommt wie viel?" },
      { "begriff": "Versicherten-karte", "erklaerung": "Die Karte vom Patienten. Sie zeigt: Ich bin versichert." }
    ]
  },
  "teil5_aufgaben": {
    "level1": {
      "instruction": "Was ist richtig? Kreuze an.",
      "questions": [
        {
          "question": "Wer verteilt das Geld an die Arztpraxen?",
          "options": ["Der Patient", "Die Krankenkasse direkt", "Die KV (Kassenaerztliche Vereinigung)"]
        },
        {
          "question": "Was macht der G-BA?",
          "options": ["Er behandelt Patienten", "Er macht Regeln fuer das Gesundheitswesen", "Er verkauft Medikamente"]
        },
        {
          "question": "Die KZV ist zustaendig fuer:",
          "options": ["Aerzte", "Zahnaerzte", "Apotheken"]
        }
      ]
    },
    "level2": {
      "wordBank": ["KV", "Krankenkasse", "G-BA", "Verguetung"],
      "sentences": [
        "1. Jeden Monat zahle ich Geld an meine _________________________",
        "2. Die _________________________ verteilt das Geld an die Arztpraxen.",
        "3. Der _________________________ entscheidet, welche Behandlungen bezahlt werden.",
        "4. Das Geld, das eine Praxis fuer eine Behandlung bekommt, heisst _________________________"
      ]
    },
    "level3": {
      "situation": [
        "Eine Patientin kommt in eure Praxis.",
        "Sie moechte eine professionelle Zahnreinigung.",
        "Sie sagt: \\"Das zahlt doch die Kasse!\\""
      ],
      "subQuestions": [
        { "label": "a) Wer entscheidet, ob die Kasse das bezahlt?", "hint": "3 Buchstaben", "lines": 1 },
        { "label": "b) Schreibe 2 kurze Saetze: Wie erklaerst du der Patientin, warum sie selbst zahlen muss?", "hint": null, "lines": 3 },
        { "label": "c) Diskutiert zu zweit: Findet ihr das fair? Warum ja / warum nein?", "hint": null, "lines": 0 }
      ]
    }
  },
  "teil6_fehler": {
    "rows": [
      { "falsch": "Die Krankenkasse bezahlt den Arzt direkt.", "richtig": "Die Kasse gibt Geld an die KV/KZV. Die verteilt es dann." },
      { "falsch": "KV und Krankenkasse sind das Gleiche.", "richtig": "Nein! Die Kasse sammelt Geld. Die KV verteilt es." },
      { "falsch": "Der Arzt kann machen, was er will.", "richtig": "Nein. Der G-BA macht Regeln. Der Arzt muss sich daran halten." },
      { "falsch": "Das betrifft mich nicht.", "richtig": "Doch! Die Verguetung bestimmt, wie viel Geld in eure Praxis kommt." }
    ]
  },
  "teil7_abschluss": {
    "title": "DAS KANNST DU JETZT!",
    "competencies": [
      "Du weisst, wie das Geld in deine Praxis kommt.",
      "Du kannst erklaeren, was KV, KZV und G-BA bedeuten.",
      "Du verstehst, warum nicht alles von der Kasse bezahlt wird.",
      "Du kannst einer Patientin erklaeren, warum sie selbst zahlen muss."
    ]
  }
}`;

export function buildPrompt(input: GenerateRequest): { system: string; user: string } {
  const user = `Erstelle ein vollstaendiges Arbeitsblatt zum Thema: "${input.topic}"

KONTEXT:
- Fachgebiet: ${input.subject}
- Zielgruppe: ${input.schoolType}
- Sprachniveau: A2-B1
- Zeitrahmen: 45 Minuten

STRUKTUR (zwingend einhalten, in dieser Reihenfolge):
1. ALLTAGSEINSTIEG — Konkrete Situation aus dem Alltag der Zielgruppe (${input.schoolType}). Max. 3 kurze Saetze, keine Fachbegriffe. Als Zitat/Sprechblase wenn moeglich.
2. EINFACHE ERKLAERUNG — Extrem einfach, Saetze max. 10 Woerter. Schritt-fuer-Schritt-Aufbau.
3. SCHAUBILD — Flussdiagramm mit max. 5 Kaesten. Max. 4 Woerter pro Kasten. Plus optionale Achtung-Box fuer wichtige Zusatzinfos.
4. BEGRIFFE-TABELLE — Max. 6 Begriffe. Je 1 einfacher Erklaerungssatz.
5. UEBUNGEN (3 Stufen) — Level 1: 3 Multiple-Choice-Fragen (je 3 Optionen). Level 2: 4 Lueckentexte mit Wortbank. Level 3: 1 Alltagssituation mit 2-3 Teilfragen.
6. TYPISCHE FEHLER — 3-4 haeufige Missverstaendnisse als Falsch/Richtig-Paare.
7. ABSCHLUSS — "Das kannst du jetzt!" mit 3-4 Kompetenzpunkten.

WICHTIG: Baue konkrete Bezuege zum Alltag von ${input.schoolType} ein!

Antworte NUR mit einem JSON-Objekt in exakt diesem Schema:

${JSON_SCHEMA}

Hier ein vollstaendiges Beispiel als Orientierung:

${FEW_SHOT_EXAMPLE}

Jetzt erstelle ein Arbeitsblatt zum Thema "${input.topic}" fuer ${input.schoolType} im Bereich ${input.subject}. Antworte NUR mit JSON.`;

  return { system: SYSTEM_PROMPT, user };
}
