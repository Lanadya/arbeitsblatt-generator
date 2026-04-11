import type { BerufConfig } from "./_schema";

const buero: BerufConfig = {
  id: "buero",
  label: "Kaufleute für Büromanagement",
  kurz: "Büro",
  kategorie: "ausbildungsberuf",

  // Bündelfächer nach KMK-Rahmenlehrplan 2013 (i.d.F. 2025) / NRW-Modell
  faecher: [
    // Berufsbezogene Bündelfächer (NRW: LF-Zuordnung)
    "Büroprozesse",                              // LF 1, 2, 8, 11, 12
    "Geschäftsprozesse",                         // LF 3, 4, 5, 7, 13
    "Steuerung und Kontrolle",                   // LF 6, 9, 10
    // Berufsübergreifende Fächer
    "Deutsch / Kommunikation",
    "Politik / Gesellschaftslehre",
    "Sonstiges",
  ],

  themenBeispiele: [
    "Kaufvertragsstörungen",
    "Buchungssätze",
    "DIN 5008",
    "Angebotsvergleich",
    "Entgeltabrechnung",
    "Marketing-Mix",
  ],

  lernfeldMap: {
    "ausbildungsvertrag|betrieb|rechtsform|vollmacht|prokura|kaufmannseigenschaft|betriebsrat|jav|mitbestimmung":
      "LF 1: Die eigene Rolle im Betrieb mitgestalten und den Betrieb präsentieren. Prüfungsbereich: Wirtschafts- und Sozialkunde. Kernbegriffe: Berufsausbildungsvertrag, BBiG, Rechte/Pflichten, Rechtsformen, Vollmachten, JAV. Alltagsbezug: Dein erster Tag im Büro — was steht in deinem Ausbildungsvertrag und welche Rechte hast du?",

    "büroorganisation|arbeitsplatz|ergonomie|terminplanung|zeitmanagement|ablage|dokumentenmanagement|posteingang|schriftgut":
      "LF 2: Büroprozesse gestalten und Arbeitsvorgänge organisieren. Prüfungsbereich: Informationstechnisches Büromanagement (GAP Teil 1). Kernbegriffe: Arbeitsplatzergonomie, Terminplanung, Ablagesysteme, Schriftgutverwaltung, Postbearbeitung, Datenschutz. Alltagsbezug: Dein Chef sagt 'Räum mal das Ablagesystem auf, niemand findet mehr was' — wie gehst du vor?",

    "geschäftsbrief|din 5008|angebot|auftragsbestätigung|rechnung|auftragsbearbeitung|anfrage|textverarbeitung":
      "LF 3: Aufträge bearbeiten. Prüfungsbereich: Informationstechnisches Büromanagement (GAP Teil 1). Kernbegriffe: DIN 5008, Geschäftsbriefe, Auftragsabwicklung (Anfrage→Angebot→Bestellung→Lieferung→Rechnung), Angebotskalkulation. Alltagsbezug: Ein Kunde fragt per E-Mail nach einem Angebot für 500 Kugelschreiber mit Firmenlogo — du schreibst das Angebot.",

    "beschaffung|einkauf|angebotsvergleich|kaufvertrag|vertragsrecht|lieferverzug|mängelrüge|gewährleistung|zahlungsverzug|wareneingang":
      "LF 4: Sachgüter und Dienstleistungen beschaffen und Verträge schließen. Prüfungsbereich: Kundenbeziehungsprozesse (GAP Teil 2). Kernbegriffe: Bedarfsermittlung, quantitativer/qualitativer Angebotsvergleich, Kaufvertrag, Kaufvertragsstörungen (Lieferverzug, Schlechtleistung, Zahlungsverzug). WICHTIG: Rechtlich korrekte Grundlagen nach BGB. Alltagsbezug: Drei Lieferanten bieten Kopierpapier an — welches Angebot ist am günstigsten?",

    "marketing|marktforschung|kundenbindung|werbung|marketing-mix|zielgruppe|crm|kundenakquise|online-marketing":
      "LF 5: Kunden akquirieren und binden. Prüfungsbereich: Kundenbeziehungsprozesse (GAP Teil 2). Kernbegriffe: Marktforschung, Marketing-Mix (4P), Zielgruppenanalyse, CRM, Online-Marketing, Kundenzufriedenheit. Alltagsbezug: Dein Chef will die Website nutzen, um neue Kunden zu gewinnen — welche Online-Marketing-Maßnahmen schlägst du vor?",

    "buchführung|buchungssatz|bilanz|inventur|inventar|konto|soll|haben|umsatzsteuer|vorsteuer|jahresabschluss|skr":
      "LF 6: Werteströme erfassen und beurteilen. Prüfungsbereich: Kundenbeziehungsprozesse (GAP Teil 2). WICHTIG: Rechenaufgaben und Buchungssätze! Kernbegriffe: Doppelte Buchführung, Bestands-/Erfolgskonten, Buchungssätze, Umsatzsteuer, Kontenrahmen (SKR 03/04). Alltagsbezug: Die Firma kauft einen neuen Drucker für 500 € netto — wie lautet der Buchungssatz?",

    "kommunikation|gesprächsführung|konflikt|beschwerde|feedback|fragetechnik|präsentation|schulz von thun|aktives zuhören":
      "LF 7: Gesprächssituationen gestalten. Prüfungsbereich: Fachaufgabe in der Wahlqualifikation (GAP Teil 2, mündlich). Kernbegriffe: Kommunikationsmodelle, aktives Zuhören, Fragetechniken, Konfliktgespräch, Beschwerdemanagement, interkulturelle Kommunikation. Alltagsbezug: Ein verärgerter Lieferant ruft an, weil die Rechnung seit 3 Wochen nicht bezahlt wurde — wie führst du das Gespräch?",

    "personal|stellenausschreibung|bewerbung|arbeitsvertrag|entgeltabrechnung|brutto|netto|kündigung|personalakte|lohnsteuer|sozialabgaben":
      "LF 8: Personalwirtschaftliche Aufgaben wahrnehmen. Prüfungsbereich: Kundenbeziehungsprozesse (GAP Teil 2). Kernbegriffe: Personalplanung, Stellenausschreibung, Arbeitsvertrag, Entgeltabrechnung (Brutto→Netto), Sozialversicherungsbeiträge, Kündigung, Personalentwicklung. Alltagsbezug: Du sollst eine Stellenausschreibung für eine neue Bürokraft schreiben — was muss rein?",

    "liquidität|finanzierung|kredit|darlehen|leasing|investition|mahnwesen|zahlungsverkehr|bonität":
      "LF 9: Liquidität sichern und Finanzierung vorbereiten. Prüfungsbereich: Kundenbeziehungsprozesse (GAP Teil 2). Kernbegriffe: Liquiditätsplanung, Finanzierungsarten, Kreditarten, Investitionsrechnung, Mahnwesen, Bonität. Alltagsbezug: Die Firma braucht einen neuen Firmenwagen — kaufen, finanzieren oder leasen?",

    "kosten|leistungsrechnung|deckungsbeitrag|kostenarten|kostenstellen|kostenträger|break-even|wirtschaftlichkeit|rentabilität":
      "LF 10: Wertschöpfungsprozesse erfolgsorientiert steuern. Prüfungsbereich: Kundenbeziehungsprozesse (GAP Teil 2). WICHTIG: Rechenaufgaben! Kernbegriffe: Kostenartenrechnung, Kostenstellenrechnung, Kostenträgerrechnung, Deckungsbeitragsrechnung, Break-even-Analyse. Alltagsbezug: Der Chef fragt: 'Lohnt sich unser Seminarraum oder sollten wir ihn vermieten?' — wie rechnest du das aus?",

    "geschäftsprozess|prozessoptimierung|qualitätsmanagement|qm|pdca|kvp|flussdiagramm|digitalisierung":
      "LF 11: Geschäftsprozesse darstellen und optimieren. Prüfungsbereich: Kundenbeziehungsprozesse (GAP Teil 2). Kernbegriffe: Prozessmodellierung, EPK, Flussdiagramm, Schwachstellenanalyse, KVP, PDCA-Zyklus, Digitalisierung. Alltagsbezug: Die Rechnungsbearbeitung dauert immer ewig — zeichne den Prozess auf und finde die Schwachstelle.",

    "veranstaltung|geschäftsreise|tagung|messe|reisekosten|reisekostenabrechnung|eventplanung|meeting":
      "LF 12: Veranstaltungen und Geschäftsreisen organisieren. Prüfungsbereich: Kundenbeziehungsprozesse (GAP Teil 2). Kernbegriffe: Veranstaltungsplanung, Budget, Raum-/Technikplanung, Geschäftsreiseplanung, Reisekostenabrechnung. Alltagsbezug: Dein Chef fährt nächste Woche nach München zur Messe — organisiere Bahn, Hotel und Programm.",

    "projekt|projektplanung|projektmanagement|meilenstein|gantt|teamarbeit|projektcontrolling|netzplan":
      "LF 13: Ein Projekt planen und durchführen. Prüfungsbereich: Kundenbeziehungsprozesse (GAP Teil 2). Kernbegriffe: Projektauftrag, Projektstrukturplan, Gantt-Diagramm, Meilensteine, Teamarbeit, Projektcontrolling, Evaluation. Alltagsbezug: Eure Abteilung soll bis Jahresende auf papierloses Büro umstellen — plane das Projekt!",
  },

  suchkonfiguration: {
    keywords: {
      buchfuehrung: ["buchführung", "buchungssatz", "bilanz", "inventur", "konto", "soll", "haben", "umsatzsteuer", "vorsteuer", "skr"],
      recht: ["kaufvertrag", "lieferverzug", "mängelrüge", "gewährleistung", "zahlungsverzug", "arbeitsvertrag", "kündigung", "vertragsrecht"],
      personal: ["entgeltabrechnung", "brutto", "netto", "lohnsteuer", "sozialabgaben", "stellenausschreibung", "personalakte"],
      organisation: ["din 5008", "geschäftsbrief", "büroorganisation", "ablage", "dokumentenmanagement", "terminplanung"],
    },
    trustedDomains: [
      "ihk.de",
      "bibb.de",
      "gesetze-im-internet.de",
      "haufe.de",
      "prozubi.de",
      "gripscoachtv.de",
      "berufsbildung.nrw.de",
    ],
    deepFetchTrigger: ["buchfuehrung", "recht"],
  },

  promptErweiterungen: {
    praxisbezug: `PRAXISBEZUG FÜR KAUFLEUTE FÜR BÜROMANAGEMENT:
- Beschreibe konkrete Büro-Situationen: "Du sitzt am Schreibtisch und...", "Eine E-Mail kommt rein..."
- Verwende Alltagssprache des Büros: "Vorgang anlegen", "Rechnung buchen", "Termin koordinieren"
- Erkläre, was die Auszubildende KONKRET TUT — nicht was abstrakt passiert
- Bei Buchführungsthemen: Buchungssätze immer mit T-Konten-Darstellung`,
    level3Spezial: {
      buchfuehrung: `LEVEL-3-SPEZIALANWEISUNG (Buchführung):
- Level 3 MUSS eine Buchungsaufgabe mit Kontierung enthalten!
- Aufgabenformat: "Geschäftsfall: Die Firma kauft... Bilde den Buchungssatz."
- Verwende Kontenrahmen SKR 03 oder SKR 04 (im Aufgabentext angeben)
- Die Musterantwort MUSS den vollständigen Buchungssatz mit Kontonummern und Beträgen zeigen.
- Bei Umsatzsteuer: Netto, USt und Brutto getrennt ausweisen.`,
      recht: `LEVEL-3-SPEZIALANWEISUNG (Kaufvertragsstörungen):
- Level 3 MUSS einen konkreten Rechtsfall enthalten!
- Aufgabenformat: "Sachverhalt: Die Firma hat bestellt... Was ist das rechtliche Problem? Welche Rechte hat der Käufer?"
- NUR aktuelle Rechtsgrundlagen aus BGB verwenden (§§ angeben)
- Unterscheide klar: Lieferverzug (§286 BGB), Schlechtleistung (§434 BGB), Zahlungsverzug (§286 BGB)`,
    },
  },
};

export default buero;
