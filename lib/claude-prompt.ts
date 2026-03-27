import type { GenerateRequest } from "./types";

// === MFA Lernfeld-Mapping ===
// Stabile Struktur (KMK-Rahmenlehrplan seit 2006, bundeseinheitlich)
const MFA_LERNFELD_MAP: Record<string, string> = {
  // Keywords → Lernfeld + Prüfungskontext
  "hygiene|desinfektion|sterilisation|rki|infektionsschutz|hygieneplan|mrsa":
    "LF 3: Praxishygiene und Schutz vor Infektionskrankheiten. Prüfungsbereich: Behandlungsassistenz. Kernbegriffe: RKI-Empfehlungen, Händehygiene, Flächendesinfektion, Sterilisation, Hygieneplan, Infektionsschutzgesetz, Biostoffverordnung. Alltagsbezug: Hygieneplan in der Praxis, Desinfektion von Behandlungsräumen, Aufbereitung von Instrumenten.",
  "sozialversicherung|krankenversicherung|rentenversicherung|pflegeversicherung|arbeitslosenversicherung|unfallversicherung|beitragssatz":
    "LF 1 + WiSo-Prüfungsbereich. Kernbegriffe: 5 Säulen der Sozialversicherung, Arbeitnehmer-/Arbeitgeberanteil, Beitragsbemessungsgrenze, Versicherungspflicht, Solidarprinzip. Alltagsbezug: Lohnabrechnung lesen, eigene Abzüge verstehen.",
  "ebm|goä|goae|abrechnung|gebührenordnung|orientierungswert|gop|punktwert|abrechnungsziffer":
    "LF 1/7 + Prüfungsbereich Betriebsorganisation und -verwaltung (120 Min.). WICHTIG: EBM = GKV-Patienten (Punkte × Orientierungswert), GOÄ = PKV-Patienten (Betrag × Steigerungsfaktor). Level 3 MUSS Rechenaufgaben enthalten. Alltagsbezug: 'Was tippst du in den Computer ein, wenn ein Patient behandelt wurde?'",
  "notfall|erste hilfe|reanimation|schock|bewusstlosigkeit":
    "LF 5: Zwischenfällen vorbeugen und in Notfallsituationen Hilfe leisten. Prüfungsbereich: Behandlungsassistenz. Kernbegriffe: Vitalzeichen, stabile Seitenlage, AED, Notruf 112. Alltagsbezug: Patient kollabiert im Wartezimmer.",
  "blutentnahme|labor|diagnostik|blutbild|blutzucker|urin":
    "LF 4/8/9: Diagnostik und Therapie. Prüfungsbereich: Behandlungsassistenz. Kernbegriffe: Kapillarblut, venöse Blutentnahme, Laborwerte, Normalwerte. Alltagsbezug: Arzt sagt 'Machen Sie mal ein kleines Blutbild'.",
  "wundversorgung|verbände|op|chirurgisch|naht|steril":
    "LF 10: Kleine chirurgische Behandlungen und Wundversorgung. Prüfungsbereich: Behandlungsassistenz + Praktische Prüfung. Alltagsbezug: Patient kommt mit Schnittwunde.",
  "impfung|vorsorge|prävention|früherkennung|u-untersuchung|j1":
    "LF 11: Prävention. Prüfungsbereich: Behandlungsassistenz. Kernbegriffe: Impfkalender STIKO, Vorsorgeuntersuchungen, Gesundheitsberatung. Alltagsbezug: Mutter fragt 'Welche Impfungen braucht mein Kind?'",
  "datenschutz|dokumentation|schweigepflicht|patientenakte|dsgvo|qm":
    "LF 7: Praxisabläufe im Team organisieren. Prüfungsbereich: Betriebsorganisation. Kernbegriffe: Schweigepflicht §203 StGB, DSGVO, Aufbewahrungsfristen, QM. Alltagsbezug: Anruf 'Ich bin die Mutter von..., wie geht es meinem Sohn?'",
  "waren|bestellung|material|lager|inventur|medikamente":
    "LF 6: Waren beschaffen und verwalten. Prüfungsbereich: Betriebsorganisation. Kernbegriffe: Bestellsystem, Verfallsdaten, Kühlkette, Betäubungsmittelgesetz. Alltagsbezug: Impfstoff ist leer, neue Bestellung aufgeben.",
  "arbeitsrecht|kündigung|mutterschutz|jugendarbeitsschutz|ausbildungsvertrag|bbig":
    "LF 1 + WiSo-Prüfungsbereich. Kernbegriffe: BBiG, Kündigungsschutz, Probezeit, Arbeitszeitgesetz, Mutterschutzgesetz, JArbSchG. Alltagsbezug: 'Dein Chef sagt: Du musst am Samstag arbeiten. Stimmt das?'",
  "kommunikation|patientengespräch|beschwerdemanagement|telefon|empfang":
    "LF 2: Patienten empfangen und begleiten. Kernbegriffe: Aktives Zuhören, Empathie, Beschwerdemanagement, Terminvergabe. Alltagsbezug: Aufgeregter Patient am Empfang.",
};

function getLernfeldContext(topic: string, schoolType: string): string {
  if (!schoolType.toLowerCase().includes("mfa")) return "";

  const t = topic.toLowerCase();
  for (const [keywords, context] of Object.entries(MFA_LERNFELD_MAP)) {
    const kws = keywords.split("|");
    if (kws.some(kw => t.includes(kw))) {
      return context;
    }
  }
  return "";
}

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

PRAXISBEZUG FÜR MFA:
- Beschreibe konkrete Handlungen: "Du tippst am Computer ein...", "Du siehst auf dem Bildschirm..."
- Verwende Alltagssprache der Praxis: "eintippen", "abrechnen", "Karte einlesen"
- Erkläre, was die MFA KONKRET TUT — nicht was abstrakt passiert
- Abschnitt "Wann NICHT abrechnen?" ist bei Abrechnungsthemen PFLICHT

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

export function buildPrompt(input: GenerateRequest, currentInfo?: string, sourceText?: string): { system: string; user: string } {
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

  // Lernfeld-Kontext für MFA
  const lernfeldContext = getLernfeldContext(input.topic, input.schoolType);
  const lernfeldBlock = lernfeldContext
    ? `\nLERNFELD-ZUORDNUNG:\n${lernfeldContext}\nBerücksichtige diese Zuordnung bei der Auswahl von Fachbegriffen, Alltagssituationen und Aufgabenstellungen.\n`
    : "";

  // Themenspezifische Level-3-Anweisungen
  const topicLower = input.topic.toLowerCase();
  const isAbrechnung = ["ebm", "goä", "goae", "abrechnung", "gop", "orientierungswert"].some(kw => topicLower.includes(kw));
  const isSozialversicherung = ["sozialversicherung", "beitragssatz", "lohnabrechnung"].some(kw => topicLower.includes(kw));

  let level3Hint = "";
  if (isAbrechnung) {
    level3Hint = `
LEVEL-3-SPEZIALANWEISUNG (Abrechnung):
- Level 3 MUSS eine Rechenaufgabe enthalten!
- Verwende die EXAKTE GOP-Nummer und Punktzahl aus den AKTUELLEN INFORMATIONEN. Erfinde KEINE Punktwerte!
- Aufgabenformat: "Patient kommt in die Praxis. Du tippst GOP ... ein. Diese GOP hat ... Punkte. Berechne die Vergütung."
- Für EBM: Punkte × Orientierungswert (NUR den Wert aus den AKTUELLEN INFORMATIONEN: z.B. 12,7404 Cent)
- Für GOÄ: Betrag × Steigerungsfaktor (1,0 / 2,3 / 3,5)
- Die Musterantwort MUSS den vollständigen Rechenweg mit den EXAKTEN Zahlen aus den aktuellen Informationen zeigen.
- Füge IMMER einen Abschnitt "Wann NICHT abrechnen?" ein mit konkreten Ausnahmen aus den aktuellen Informationen.
- Wenn die aktuelle Information gestaffelte Werte enthält (z.B. verschiedene Punktzahlen je nach Kriterien), erkläre die Staffelung in Teil 2 oder Teil 3.`;
  } else if (isSozialversicherung) {
    level3Hint = `
LEVEL-3-SPEZIALANWEISUNG (Sozialversicherung):
- Level 3 MUSS eine Fallaufgabe mit konkreter Lohnabrechnung enthalten!
- Aufgabenformat: "Maria verdient ... Euro brutto. Berechne ihren Anteil an der Krankenversicherung."
- NUR aktuelle Beitragssätze aus den AKTUELLEN INFORMATIONEN verwenden!
- Die Musterantwort MUSS den vollständigen Rechenweg zeigen.`;
  }

  const user = `Erstelle ein vollständiges Arbeitsblatt zum Thema: "${input.topic}"

KONTEXT:
- Fachgebiet: ${input.subject}
- Zielgruppe: ${input.schoolType}
- Sprachniveau: A2-B1
- Zeitrahmen: 45 Minuten
${lernfeldBlock}
STRUKTUR (zwingend einhalten, in dieser Reihenfolge):
1. ALLTAGSEINSTIEG — Konkrete Situation aus dem Alltag der Zielgruppe (${input.schoolType}). Max. 3 kurze Sätze, keine Fachbegriffe. Als Zitat/Sprechblase wenn möglich.
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

WICHTIG: Baue konkrete Bezüge zum Alltag von ${input.schoolType} ein!
${dataBlock}

Antworte NUR mit einem JSON-Objekt in exakt diesem Schema:

${JSON_SCHEMA}

Hier ein vollständiges Beispiel als Orientierung:

${FEW_SHOT_EXAMPLE}

Jetzt erstelle ein Arbeitsblatt zum Thema "${input.topic}" für ${input.schoolType} im Bereich ${input.subject}. Antworte NUR mit JSON.`;

  return { system: SYSTEM_PROMPT, user };
}
