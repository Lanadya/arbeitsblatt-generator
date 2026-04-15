import type { GenerateRequest } from "./types";
import { getBerufConfig, getLernfeldContext, resolveBerufId, getBerufLabel } from "./beruf-config";

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

DATENAKTUALITÄT — HÖCHSTE PRIORITÄT:
- Verwende für ALLE Zahlen, Beträge, Prozentsätze, GOP-Nummern, Punktwerte und Fakten AUSSCHLIESSLICH die Daten aus dem Abschnitt "AKTUELLE INFORMATIONEN" (Web-Recherche).
- Verwende NIEMALS Zahlen oder GOP-Nummern aus deinem Trainingswissen — diese sind mit hoher Wahrscheinlichkeit veraltet oder falsch.
- Wenn die aktuellen Informationen eine bestimmte GOP-Nummer nennen (z.B. 03040 statt 03000), verwende IMMER die GOP aus den aktuellen Informationen.
- Wenn die aktuellen Informationen Punktwerte nennen, verwende GENAU diese Punktwerte — NIEMALS andere.
- Wenn keine aktuellen Zahlen in den Web-Ergebnissen stehen, verwende KEINE konkreten Zahlen, sondern schreibe: "Schlage den aktuellen Wert nach" oder "Frage deinen Lehrer."
- Bei Rechenaufgaben: Verwende NUR Werte, die WÖRTLICH in den aktuellen Informationen stehen. Erfinde KEINE Punktwerte.
- PRÜFE DICH SELBST: Steht jede Zahl in deiner Antwort auch in den aktuellen Informationen? Wenn nein, ersetze sie.

RECHTLICHE KORREKTHEIT — KEINE FALSCHEN AUSSAGEN:
- Alle rechtlichen Aussagen MÜSSEN juristisch korrekt sein. Vereinfachung ist erlaubt, aber KEINE falschen Behauptungen.
- Nenne immer die korrekte Rechtsgrundlage (z.B. §286 BGB, §288 BGB, §203 StGB).
- Unterscheide klar zwischen gesetzlicher Regelung und gängiger Praxis. Z.B.: "Rechtlich reicht EINE Mahnung" vs. "In der Praxis schicken viele Praxen 3 Mahnungen."
- Bei Fristen und Terminen: Verwende die gesetzlich korrekten Angaben. Z.B.: Automatischer Verzug nach 30 Tagen (§286 Abs.3 BGB), nicht "nach 14 Tagen".
- Bei Zinssätzen: Verwende die korrekte Formel (z.B. "5 Prozentpunkte über dem Basiszinssatz" für Verbraucher gemäß §288 Abs.1 BGB).
- Wenn du dir bei einer rechtlichen Aussage nicht sicher bist, formuliere vorsichtiger ("in der Regel", "meistens") statt falsche Absolutaussagen zu machen.

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
  },

  "quellen": [
    { "titel": "string — Quellenname", "url": "string — optional, URL der Quelle" }
  ],

  "aktualitaetshinweise": {
    "hinweise": [
      { "was": "string — Was hat sich geändert", "material": "string — Wert im hochgeladenen Material", "aktuell": "string — Aktueller Wert aus Web-Recherche", "quelle": "string — Quellenname" }
    ],
    "fazit": "string — Zusammenfassung für die Lehrkraft. Bei keinen Abweichungen: 'Ihr Material ist auf dem aktuellen Stand.'"
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
  },
  "aktualitaetshinweise": {
    "hinweise": [
      { "was": "Orientierungswert", "material": "11,9 Cent", "aktuell": "12,7404 Cent (Stand Q1/2026)", "quelle": "KBV" }
    ],
    "fazit": "Wir haben den aktuellen Orientierungswert im Arbeitsblatt verwendet."
  }
}`;

export interface PipelineContext {
  perspective?: string;
  legalBasis?: string[];
  keyTerms?: string[];
  sourceUrls?: { title: string; url: string }[];
}

export function buildPrompt(input: GenerateRequest, currentInfo?: string, sourceText?: string, pipeline?: PipelineContext): { system: string; user: string } {
  let dataBlock: string;

  if (sourceText && currentInfo) {
    // PREMIUM MIT AKTUALITÄTSCHECK: Lehrkraft-Material + Web-Daten
    dataBlock = `\nQUELLENMATERIAL DER LEHRKRAFT (hochgeladen):\n---\n${sourceText}\n---\n\nAKTUALITÄTSCHECK AUS DEM WEB (Stand: ${new Date().toLocaleDateString("de-DE")}):\n${currentInfo}\n\nREGELN FÜR DIE KOMBINATION:\n- Das Quellenmaterial der Lehrkraft ist die HAUPTQUELLE für Struktur, Fachlogik und Zusammenhänge.\n- PRÜFE alle Zahlen, Punktwerte und Prozentsätze im Quellenmaterial gegen die Web-Daten.\n- Wenn die Web-Daten AKTUELLERE Werte liefern, verwende die aktuellen Werte im Arbeitsblatt.\n- Erfinde KEINE zusätzlichen Fakten — nimm nur, was im Material ODER in den Web-Daten steht.\n- Wenn das Material Ausnahmen, Sonderfälle oder Abschläge nennt, übernimm diese vollständig.\n- Level 3 MUSS sich auf die komplexeren Aspekte des Quellenmaterials beziehen.\n\nWICHTIG — AKTUALITÄTSHINWEISE:\nWenn du Abweichungen zwischen dem Lehrkraft-Material und den aktuellen Web-Daten findest (z.B. veraltete Punktwerte, geänderte Prozentsätze, neue Regelungen), füge im JSON ein Feld "aktualitaetshinweise" hinzu:\n"aktualitaetshinweise": {\n  "hinweise": [\n    { "was": "Name der Änderung", "material": "Wert im Material", "aktuell": "Aktueller Wert", "quelle": "Quellenname oder URL" }\n  ],\n  "fazit": "Kurzer zusammenfassender Satz für die Lehrkraft"\n}\nWenn KEINE Abweichungen gefunden wurden, setze "aktualitaetshinweise" trotzdem mit einem leeren hinweise-Array und fazit: "Ihr Material ist auf dem aktuellen Stand. Keine Anpassungen nötig."\n`;
  } else if (sourceText) {
    // PREMIUM OHNE WEB-DATEN: Nur Lehrkraft-Material
    dataBlock = `\nQUELLENMATERIAL DER LEHRKRAFT (hochgeladen):\n---\n${sourceText}\n---\n\nERSTELLE DAS ARBEITSBLATT BASIEREND AUF DIESEM MATERIAL.\n- Alle Fakten, Zahlen, Begriffe und Zusammenhänge kommen NUR aus diesem Quellenmaterial.\n- Erfinde KEINE zusätzlichen Fakten oder Zahlen.\n- Strukturiere das Material didaktisch nach der 7-Teile-Struktur.\n- Wenn das Material Ausnahmen, Sonderfälle oder Abschläge nennt, übernimm diese.\n- Level 3 MUSS sich auf die komplexeren Aspekte des Quellenmaterials beziehen.\n`;
  } else if (currentInfo) {
    dataBlock = `\nAKTUELLE INFORMATIONEN ZUM THEMA (Stand: ${new Date().toLocaleDateString("de-DE")}):\n${currentInfo}\n\nWICHTIG — VERWENDE KONKRETE ZAHLEN:\n- Du MUSST die konkreten Zahlen, Werte, Punktzahlen und Prozentsätze aus den obigen Informationen im Arbeitsblatt verwenden!\n- Baue diese Zahlen in die Erklärung (Teil 2), das Schaubild (Teil 3) und die Aufgaben (Teil 5) ein.\n- Die Lehrkraft zahlt für aktuelle, konkrete Daten — NICHT für Platzhalter wie 'siehe Tabelle'.\n- Wenn ein Orientierungswert, Beitragssatz oder Punktwert in den Informationen steht, MUSS er im Arbeitsblatt vorkommen.\n\nSTANDARD-PRODUKT — KEIN AKTUALITÄTSHINWEIS:\n- Setze "aktualitaetshinweise" auf null oder lasse es weg.\n- Bei Standard-Arbeitsblättern gibt es KEINEN Hinweiskasten auf dem Arbeitsblatt.\n- Du bist die Quelle — der Kunde vertraut darauf, dass die Daten aktuell sind.\n- Schreibe NIEMALS Sätze wie 'sollten nachgeschlagen werden' oder 'bitte prüfen' — das ist NICHT unser Service.\n`;
  } else {
    dataBlock = "\nKEINE aktuellen Web-Daten verfügbar. Verwende dein Fachwissen für grundlegende Fakten. Verwende konkrete Zahlen aus deinem Wissen. Schreibe NIEMALS 'bitte nachschlagen' oder 'aktuellen Wert prüfen' — die Lehrkraft erwartet fertige Inhalte.\n\nSetze \"aktualitaetshinweise\" auf null.\n";
  }

  // Resolve berufId from schoolType (backwards compatible)
  const berufId = resolveBerufId(input.schoolType);
  const berufConfig = getBerufConfig(berufId);
  const berufLabel = getBerufLabel(berufId);

  // Lernfeld-Kontext (works for all berufe with lernfeldMap)
  const lernfeldContext = getLernfeldContext(input.topic, berufId);
  const lernfeldBlock = lernfeldContext
    ? `\nLERNFELD-ZUORDNUNG:\n${lernfeldContext}\nBerücksichtige diese Zuordnung bei der Auswahl von Fachbegriffen, Alltagssituationen und Aufgabenstellungen.\n`
    : "";

  // Berufsspezifischer Praxisbezug (aus Config)
  const praxisbezugBlock = berufConfig?.promptErweiterungen?.praxisbezug
    ? `\n${berufConfig.promptErweiterungen.praxisbezug}\n`
    : "";

  // Themenspezifische Level-3-Anweisungen (aus Config)
  let level3Hint = "";
  if (berufConfig?.promptErweiterungen?.level3Spezial) {
    const topicLower = input.topic.toLowerCase();
    const suchConfig = berufConfig.suchkonfiguration;
    if (suchConfig) {
      for (const [gruppe, keywords] of Object.entries(suchConfig.keywords)) {
        if (keywords.some(kw => topicLower.includes(kw))) {
          const hint = berufConfig.promptErweiterungen.level3Spezial[gruppe];
          if (hint) {
            level3Hint = `\n${hint}`;
            break;
          }
        }
      }
    }
  }

  // Build system prompt with optional beruf-specific additions
  const systemPrompt = praxisbezugBlock
    ? SYSTEM_PROMPT.replace(
        "Du antwortest NUR mit einem JSON-Objekt.",
        `${praxisbezugBlock}\nDu antwortest NUR mit einem JSON-Objekt.`
      )
    : SYSTEM_PROMPT;

  // Select few-shot example: use beruf-specific if available, else MFA default
  const fewShot = berufConfig?.fewShotExample ?? FEW_SHOT_EXAMPLE;

  // Pipeline-Kontext: Perspektive, Rechtsgrundlagen, Quellen
  const perspectiveBlock = pipeline?.perspective
    ? `\nPERSPEKTIVE (DURCHGÄNGIG EINHALTEN):
Der Schüler ist: ${pipeline.perspective}
- Das Einstiegsbeispiel (Teil 1) MUSS aus dem Arbeitsalltag DIESER Person kommen.
- Die Personen/Namen aus dem Einstiegsbeispiel MÜSSEN im gesamten Arbeitsblatt weitergeführt werden (Aufgaben, Level 3, Fehler-Tabelle).
- Alle Beispiele, Situationen und Aufgaben beziehen sich auf DIESEN konkreten Arbeitsplatz.\n`
    : "";

  const legalBasisBlock = pipeline?.legalBasis?.length
    ? `\nRECHTSGRUNDLAGEN (MÜSSEN im Arbeitsblatt vorkommen):
${pipeline.legalBasis.map(l => `- ${l}`).join("\n")}
- Nenne diese Rechtsgrundlagen in der Erklärung (Teil 2) und in der Merke-Box.
- In Level 3 MUSS mindestens eine Rechtsgrundlage angewendet werden.\n`
    : "";

  const keyTermsBlock = pipeline?.keyTerms?.length
    ? `\nSCHLÜSSELBEGRIFFE (MÜSSEN in der Begriffe-Tabelle erscheinen):
${pipeline.keyTerms.map(t => `- ${t}`).join("\n")}\n`
    : "";

  const quellenBlock = pipeline?.sourceUrls?.length
    ? `\nQUELLENVERZEICHNIS — PFLICHT:
Füge im JSON ein Feld "quellen" hinzu mit den verwendeten Quellen:
"quellen": [
  { "titel": "Quellenname", "url": "https://..." }
]
Verwende diese Quellen als Grundlage:
${pipeline.sourceUrls.map(s => `- ${s.title} (${s.url})`).join("\n")}
Nenne NUR Quellen, deren Informationen du tatsächlich im Arbeitsblatt verwendet hast.\n`
    : "";

  const user = `Erstelle ein vollständiges Arbeitsblatt zum Thema: "${input.topic}"

KONTEXT:
- Fachgebiet: ${input.subject}
- Zielgruppe: ${berufLabel}
- Sprachniveau: A2-B1
- Zeitrahmen: 45 Minuten
${lernfeldBlock}${perspectiveBlock}${legalBasisBlock}${keyTermsBlock}
STRUKTUR (zwingend einhalten, in dieser Reihenfolge):
1. ALLTAGSEINSTIEG — Konkrete Situation aus dem Alltag der Zielgruppe (${berufLabel}). Max. 3 kurze Sätze, keine Fachbegriffe. Als Zitat/Sprechblase wenn möglich.
2. EINFACHE ERKLÄRUNG — Extrem einfach, Sätze max. 10 Wörter. Schritt-für-Schritt-Aufbau.
3. SCHAUBILD — Flussdiagramm mit max. 5 Kästen. Max. 4 Wörter pro Kasten. Plus optionale Achtung-Box für wichtige Zusatzinfos.
4. BEGRIFFE-TABELLE — Max. 6 Begriffe. Je 1 einfacher Erklärungssatz.
5. ÜBUNGEN (3 Stufen):
   - Level 1 (Schwierigkeit: *): 3 Multiple-Choice-Fragen (je 3 Optionen). Grundverständnis prüfen. Auch für Schüler mit A2-Niveau lösbar.
   - Level 2 (Schwierigkeit: **): 4 Lückentexte mit Wortbank. Fachbegriffe erkennen und zuordnen.
   - Level 3 (Schwierigkeit: ***): 1 Alltagssituation aus der Praxis mit 2-3 Teilfragen. Angelehnt an Prüfungsformat (Fallbeispiel + Begründung/Berechnung). Das ist das anspruchsvollste Level!
6. TYPISCHE FEHLER — 3-4 häufige Missverständnisse als Falsch/Richtig-Paare.
7. ABSCHLUSS — "Das kannst du jetzt!" mit 3-4 Kompetenzpunkten.
8. LÖSUNGEN — Lösungen für alle Aufgaben: Level 1 (welche Option ist richtig), Level 2 (vollständige Sätze mit eingesetzten Wörtern), Level 3 (Musterantwort mit vollständigem Lösungsweg). Plus ein 10-Minuten-Lehrplan mit 5 Schritten.
${level3Hint}

ROTER FADEN — EINSTIEGSBEISPIEL DURCHZIEHEN:
- Die Personen und die Situation aus Teil 1 (Alltagseinstieg) MÜSSEN sich durch das gesamte Arbeitsblatt ziehen.
- Level 3 greift das Einstiegsbeispiel auf oder baut darauf auf.
- Die Fehler-Tabelle (Teil 6) bezieht sich auf typische Missverständnisse zum Thema, idealerweise mit Bezug zur Einstiegssituation.

WICHTIG: Baue konkrete Bezüge zum Alltag von ${berufLabel} ein!
${dataBlock}${quellenBlock}

Antworte NUR mit einem JSON-Objekt in exakt diesem Schema:

${JSON_SCHEMA}

Hier ein vollständiges Beispiel als Orientierung:

${fewShot}

Jetzt erstelle ein Arbeitsblatt zum Thema "${input.topic}" für ${berufLabel} im Bereich ${input.subject}. Antworte NUR mit JSON.`;

  return { system: systemPrompt, user };
}
