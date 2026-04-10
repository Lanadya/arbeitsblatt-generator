import type { BerufConfig } from "./_schema";

const einzelhandel: BerufConfig = {
  id: "einzelhandel",
  label: "Einzelhandelskaufleute",
  kurz: "Einzelhandel",
  kategorie: "ausbildungsberuf",

  // Bündelfächer nach KMK-Rahmenlehrplan / NRW-Modell
  faecher: [
    // Berufsbezogene Bündelfächer (NRW: LF-Zuordnung)
    "Kundenkommunikation und -service",          // LF 2, 3, 10, 12
    "Warenbezogene Prozesse",                    // LF 4, 5, 6, 7
    "Wirtschafts- und Sozialprozesse",           // LF 1, 9, 13, 14
    "Kaufmännische Steuerung und Kontrolle",     // LF 8, 11
    // Berufsübergreifende Fächer
    "Deutsch / Kommunikation",
    "Politik / Gesellschaftslehre",
    "Sonstiges",
  ],

  themenBeispiele: [
    "Verkaufsgespräch",
    "Kaufvertrag",
    "Zahlungsverzug",
    "Lagerkennziffern",
    "Marketing-Mix",
    "Reklamation",
  ],

  lernfeldMap: {
    "einzelhandel|betriebsform|fachgeschäft|discounter|supermarkt|filiale|sortiment|betriebsorganisation|organigramm":
      "LF 1: Das Einzelhandelsunternehmen repräsentieren. Prüfungsbereich: Verkauf und Werbemaßnahmen. Kernbegriffe: Betriebsformen im Einzelhandel, Sortiment, Aufbau-/Ablauforganisation, Wirtschaftskreislauf. Alltagsbezug: Du fängst neu in einem Elektronikmarkt an — welche Betriebsform ist das und wie ist der Laden organisiert?",
    "verkaufsgespräch|kundenberatung|bedarfsermittlung|einwandbehandlung|kaufmotiv|kundentyp|zusatzverkauf|cross-selling":
      "LF 2: Verkaufsgespräche kundenorientiert führen. Prüfungsbereich: Verkauf und Werbemaßnahmen + mündliche Prüfung. Kernbegriffe: Verkaufsgesprächsphasen, Bedarfsermittlung, Kundentypen, Kaufmotive, Einwandbehandlung, Zusatzverkauf. Alltagsbezug: Ein Kunde kommt ins Möbelhaus und sucht einen neuen Esstisch — wie berätst du ihn?",
    "kasse|kassensystem|zahlungsart|kartenzahlung|wechselgeld|kassenbon|kassenbericht|ec-karte":
      "LF 3: Kunden im Servicebereich Kasse betreuen. Prüfungsbereich: Warenwirtschaft und Kalkulation. Kernbegriffe: Kassenarten, Zahlungsarten, Kassenbericht, Wechselgeld, Umtausch. Alltagsbezug: Du stehst an der Kasse — ein Kunde will mit EC zahlen, die Karte wird abgelehnt. Was tust du?",
    "warenpräsentation|visual merchandising|schaufenster|regalzone|ladengestaltung|platzierung|sichtzone|greifzone":
      "LF 4: Waren präsentieren. Prüfungsbereich: Verkauf und Werbemaßnahmen. Kernbegriffe: Regalzonen (Sicht-, Greif-, Bück-, Reckzone), Visual Merchandising, Warenkennzeichnung. Alltagsbezug: Du sollst das neue Saisonobst so platzieren, dass es gut verkauft wird — wo und wie?",
    "werbung|verkaufsförderung|aida|werbeträger|werbemittel|uwg|sonderangebot|prospekt|kundenkarte":
      "LF 5: Werben und den Verkauf fördern. Prüfungsbereich: Verkauf und Werbemaßnahmen. Kernbegriffe: AIDA-Modell, Werbeplanung, Werbeträger vs. Werbemittel, VKF-Maßnahmen, UWG. Alltagsbezug: Dein Chef sagt: 'Mach mal ein Angebot für den Sommer-Sale' — was musst du rechtlich beachten?",
    "warenbeschaffung|bestellung|lieferant|angebotsvergleich|bezugskalkulation|einkauf|bestellpunkt|bestellrhythmus":
      "LF 6: Waren beschaffen. Prüfungsbereich: Warenwirtschaft und Kalkulation. Kernbegriffe: Beschaffungsplanung, Angebotsvergleich, Bezugskalkulation, Bestellverfahren. Alltagsbezug: Der Kaffeevorrat geht zur Neige — wann bestellst du nach und bei welchem Lieferanten?",
    "wareneingang|lager|lagerkennziffer|inventur|mindestbestand|meldebestand|fifo|warenpflege|sachmangel|lieferverzug":
      "LF 7: Waren annehmen, lagern und pflegen. Prüfungsbereich: Warenwirtschaft und Kalkulation. Kernbegriffe: Wareneingangskontrolle, Sachmängel, Lieferverzug, Lagerkennziffern, Inventurarten, FIFO. Alltagsbezug: Eine Lieferung kommt an — 3 Kartons fehlen und 5 Stück haben falsche Größen. Was tust du?",
    "geschäftsprozess|bilanz|guv|warenwirtschaftssystem|wws|umsatzkennziffer|statistik|kennzahl|controlling":
      "LF 8: Geschäftsprozesse erfassen und kontrollieren. Prüfungsbereich: Warenwirtschaft und Kalkulation. Kernbegriffe: Belege, Bilanz, GuV, Warenwirtschaftssystem, Umsatzkennziffern. Alltagsbezug: Dein Chef will wissen, welche Warengruppe am besten läuft — wie findest du das im WWS heraus?",
    "kalkulation|handelsspanne|kalkulationszuschlag|preispolitik|preisreduzierung|mischkalkulation|kalkulationsfaktor":
      "LF 9: Preispolitische Maßnahmen vorbereiten und durchführen. Prüfungsbereich: Warenwirtschaft und Kalkulation. WICHTIG: Rechenaufgaben! Kernbegriffe: Vorwärts-/Rückwärtskalkulation, Handelsspanne, Kalkulationszuschlag/-faktor. Alltagsbezug: Ein T-Shirt kostet im Einkauf 12 € — wie berechnest du den Verkaufspreis?",
    "reklamation|gewährleistung|garantie|umtausch|beschwerde|ladendiebstahl|konflikt|verbraucherschutz|kundenreklamation":
      "LF 10: Besondere Verkaufssituationen bewältigen. Prüfungsbereich: Verkauf und Werbemaßnahmen + mündliche Prüfung. Kernbegriffe: Gewährleistung (2 Jahre), Garantie (freiwillig), Umtausch, Beschwerdemanagement, Ladendiebstahl. Alltagsbezug: Ein Kunde bringt nach 4 Monaten einen defekten Fernseher zurück — was sind seine Rechte?",
    "umsatzsteuer|vorsteuer|abschreibung|nachkalkulation|rentabilität|erfolgsrechnung|zahllast":
      "LF 11: Geschäftsprozesse erfolgsorientiert steuern. Prüfungsbereich: Geschäftsprozesse im Einzelhandel. Kernbegriffe: Umsatzsteuer (Vorsteuer/Zahllast), Abschreibungen, Nachkalkulation, Rentabilitätskennziffern. Alltagsbezug: Am Jahresende muss die Umsatzsteuer ans Finanzamt — wie berechnet man die Zahllast?",
    "marketing|marketingkonzept|marketing-mix|crm|e-commerce|onlineshop|kundenbindung|marktforschung|sortimentspolitik":
      "LF 12: Mit Marketingkonzepten Kunden gewinnen und binden. Prüfungsbereich: Geschäftsprozesse im Einzelhandel. Kernbegriffe: Marketing-Mix (4P), CRM, E-Commerce, Marktforschung. Alltagsbezug: Dein Laden verliert Kunden an den Online-Handel — welche Maßnahmen schlägst du vor?",
    "personalplanung|mitarbeiterführung|führungsstil|personalentwicklung|personaleinsatz|arbeitszeitmodell|dienstplan":
      "LF 13: Personaleinsatz planen und Mitarbeiter führen. Prüfungsbereich: Geschäftsprozesse im Einzelhandel. Kernbegriffe: Führungsstile, Personalbedarfsplanung, Konfliktmanagement, Arbeitszeitmodelle. Alltagsbezug: Du bist Abteilungsleiter und musst den Dienstplan für die Weihnachtszeit erstellen.",
    "unternehmensform|rechtsform|gmbh|ohg|kg|franchising|finanzierung|insolvenz|standort":
      "LF 14: Ein Einzelhandelsunternehmen leiten und entwickeln. Prüfungsbereich: Geschäftsprozesse im Einzelhandel. Kernbegriffe: Rechtsformen, Franchising, Eigen-/Fremdfinanzierung, Standortfaktoren. Alltagsbezug: Du willst dich mit einem Schuhgeschäft selbstständig machen — welche Rechtsform wählst du?",
  },

  suchkonfiguration: {
    keywords: {
      kalkulation: ["kalkulation", "handelsspanne", "kalkulationszuschlag", "bezugskalkulation", "preiskalkulation"],
      recht: ["gewährleistung", "kaufvertrag", "reklamation", "umtausch", "verbraucherschutz", "widerrufsrecht"],
      lager: ["lagerkennziffer", "inventur", "bestandsführung", "fifo", "lifo", "warenwirtschaft"],
    },
    trustedDomains: [
      "gesetze-im-internet.de",
      "ihk.de",
      "haufe.de",
      "einzelhandel.de",
      "handelswissen.de",
    ],
    deepFetchTrigger: ["kalkulation"],
  },

  promptErweiterungen: {
    praxisbezug: `PRAXISBEZUG FÜR EINZELHANDEL:
- Beschreibe konkrete Verkaufssituationen: "Ein Kunde kommt in den Laden...", "Du stehst an der Kasse..."
- Verwende Alltagssprache des Handels: "Ware einräumen", "Kasse machen", "Lieferschein prüfen"
- Erkläre, was der Azubi KONKRET TUT — mit konkretem Kunden oder Vorgang`,
    level3Spezial: {
      kalkulation: `LEVEL-3-SPEZIALANWEISUNG (Kalkulation):
- Level 3 MUSS eine Rechenaufgabe mit konkreter Kalkulation enthalten!
- Aufgabenformat: Bezugskalkulation oder Verkaufspreisberechnung
- Alle Werte (Listeneinkaufspreis, Rabatt, Skonto, Bezugskosten, Gewinnzuschlag, MwSt) müssen konkret sein
- Die Musterantwort MUSS den vollständigen Rechenweg zeigen.`,
    },
  },
};

export default einzelhandel;
