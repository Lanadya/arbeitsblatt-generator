import type { BerufConfig } from "./_schema";

const mfa: BerufConfig = {
  id: "mfa",
  label: "MFA (Medizinische Fachangestellte)",
  kurz: "MFA",
  kategorie: "ausbildungsberuf",

  // Bündelfächer nach KMK-Rahmenlehrplan / NRW-Modell
  faecher: [
    // Berufsbezogene Bündelfächer (NRW: LF-Zuordnung)
    "Medizinische Assistenz",                    // LF 3, 5, 9
    "Patientenbetreuung und Abrechnung",         // LF 4, 8, 10
    "Wirtschafts- und Sozialprozesse",           // LF 1, 6, 12
    "Praxismanagement",                          // LF 2, 7, 11
    // Berufsübergreifende Fächer
    "Deutsch / Kommunikation",
    "Politik / Gesellschaftslehre",
    "Sonstiges",
  ],

  themenBeispiele: [
    "Hygiene",
    "EBM-Abrechnung",
    "Sozialversicherung",
    "Diabetes Typ 2",
    "Arbeitsrecht",
    "GOP 03000",
  ],

  lernfeldMap: {
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
    "zahlungsverzug|mahnung|mahnwesen|inkasso|forderung|verzugszinsen|basiszinssatz":
      "LF 7 + WiSo-Prüfungsbereich. RECHTLICH KORREKTE Grundlagen: §286 BGB (Verzug), §288 BGB (Verzugszinsen: 5 Prozentpunkte über Basiszinssatz bei Verbrauchern), §286 Abs.3 BGB (automatischer Verzug 30 Tage nach Fälligkeit und Zugang der Rechnung). WICHTIG: Eine Mahnung ist keine gesetzliche Pflicht für den Verzugseintritt (§286 Abs.3), aber in der Praxis üblich. Alltagsbezug: Patient zahlt Rechnung nicht, MFA muss Mahnung schreiben.",
  },

  suchkonfiguration: {
    keywords: {
      abrechnung: ["ebm", "goä", "goae", "goa", "abrechnung", "gebührenordnung", "orientierungswert", "gop", "punktwert", "steigerungsfaktor", "bema", "bel", "vorhaltepauschale", "versichertenpauschale", "grundpauschale", "konsultationspauschale"],
      recht: ["arbeitsrecht", "kündigungsschutz", "mutterschutz", "jugendarbeitsschutz", "arbeitszeit", "berufsbildungsgesetz", "bbig"],
      sozial: ["sozialversicherung", "krankenversicherung", "rentenversicherung", "pflegeversicherung", "arbeitslosenversicherung", "unfallversicherung", "beitragssatz"],
      hygiene: ["hygiene", "desinfektion", "sterilisation", "rki", "infektionsschutz", "mrsa", "hygieneplan", "mpbetreibv"],
    },
    trustedDomains: [
      "kbv.de",
      "kvb.de",
      "abrechnungsstelle.com",
      "gelbe-liste.de",
      "bundesaerztekammer.de",
      "rki.de",
      "gesetze-im-internet.de",
      "sozialversicherung.info",
      "haufe.de",
    ],
    deepFetchTrigger: ["abrechnung", "sozial"],
  },

  promptErweiterungen: {
    praxisbezug: `PRAXISBEZUG FÜR MFA:
- Beschreibe konkrete Handlungen: "Du tippst am Computer ein...", "Du siehst auf dem Bildschirm..."
- Verwende Alltagssprache der Praxis: "eintippen", "abrechnen", "Karte einlesen"
- Erkläre, was die MFA KONKRET TUT — nicht was abstrakt passiert
- Abschnitt "Wann NICHT abrechnen?" ist bei Abrechnungsthemen PFLICHT`,
    level3Spezial: {
      abrechnung: `LEVEL-3-SPEZIALANWEISUNG (Abrechnung):
- Level 3 MUSS eine Rechenaufgabe enthalten!
- Verwende die EXAKTE GOP-Nummer und Punktzahl aus den AKTUELLEN INFORMATIONEN. Erfinde KEINE Punktwerte!
- Aufgabenformat: "Patient kommt in die Praxis. Du tippst GOP ... ein. Diese GOP hat ... Punkte. Berechne die Vergütung."
- Für EBM: Punkte × Orientierungswert (NUR den Wert aus den AKTUELLEN INFORMATIONEN: z.B. 12,7404 Cent)
- Für GOÄ: Betrag × Steigerungsfaktor (1,0 / 2,3 / 3,5)
- Die Musterantwort MUSS den vollständigen Rechenweg mit den EXAKTEN Zahlen aus den aktuellen Informationen zeigen.
- Füge IMMER einen Abschnitt "Wann NICHT abrechnen?" ein mit konkreten Ausnahmen aus den aktuellen Informationen.
- Wenn die aktuelle Information gestaffelte Werte enthält (z.B. verschiedene Punktzahlen je nach Kriterien), erkläre die Staffelung in Teil 2 oder Teil 3.`,
      sozial: `LEVEL-3-SPEZIALANWEISUNG (Sozialversicherung):
- Level 3 MUSS eine Fallaufgabe mit konkreter Lohnabrechnung enthalten!
- Aufgabenformat: "Maria verdient ... Euro brutto. Berechne ihren Anteil an der Krankenversicherung."
- NUR aktuelle Beitragssätze aus den AKTUELLEN INFORMATIONEN verwenden!
- Die Musterantwort MUSS den vollständigen Rechenweg zeigen.`,
    },
  },

  fewShotExample: `{
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
}`,
};

export default mfa;
