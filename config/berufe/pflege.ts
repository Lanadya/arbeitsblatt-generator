import type { BerufConfig } from "./_schema";

const pflege: BerufConfig = {
  id: "pflege",
  label: "Pflegefachkraft",
  kurz: "Pflege",
  kategorie: "ausbildungsberuf",

  // Pflege hat KEINE klassischen Bündelfächer — nutzt 5 Kompetenzbereiche (PflAPrV)
  // + berufsübergreifende Fächer (landesspezifisch)
  faecher: [
    // Kompetenzbereiche I-V (PflBG / PflAPrV Anlage 6)
    "KB I: Pflegeprozesse planen und durchführen",       // 1.000 Std.
    "KB II: Kommunikation und Beratung",                  // 280 Std.
    "KB III: Interprofessionelles Handeln",                // 300 Std.
    "KB IV: Recht und Ethik in der Pflege",                // 160 Std.
    "KB V: Wissenschaft und Berufsentwicklung",            // 160 Std.
    // Berufsübergreifende Fächer
    "Deutsch / Kommunikation",
    "Politik / Gesellschaftslehre",
    "Sonstiges",
  ],

  themenBeispiele: [
    "Dekubitusprophylaxe",
    "Vitalzeichen messen",
    "Pflegeplanung",
    "Sturzprophylaxe",
    "Hygiene",
    "Demenz",
  ],

  lernfeldMap: {
    "berufsbild|pflegeberuf|ausbildung pflege|berufskunde|pflegegeschichte|berufsidentität|pflegeverständnis":
      "CE 01: Ausbildungsstart – sich beruflich orientieren. Prüfungsrelevanz: KB IV (Gesetze, Ethik). Kernbegriffe: PflBG, Berufsbild Pflegefachfrau/-mann, Generalistische Ausbildung, Berufspflichten, Berufsethik, ICN-Ethikkodex. Alltagsbezug: Du fängst deine Ausbildung an. Ein Bewohner fragt: 'Was ist der Unterschied zwischen Krankenschwester und Pflegefachfrau?'",
    "körperpflege|waschen|mobilisation|mobilität|lagerung|dekubitus|prophylaxe|grundpflege|transfer|sturzprophylaxe|ganzkörperwäsche|positionswechsel|bobath|kinästhetik":
      "CE 02: Bewegung und Selbstversorgung unterstützen. Prüfungsrelevanz: KB I.1, I.2 (Pflegeprozess), praktische Prüfung. Kernbegriffe: Dekubitusprophylaxe (Braden-Skala), Kontrakturprophylaxe, Sturzrisiko, Bobath-Konzept, Kinästhetik, 30°-Lagerung, Mikrolagerung, Aktivierende Pflege, ATL/AEDL. WICHTIG: Fallbasiert prüfen. Alltagsbezug: Bewohnerin Frau K. kann nach einem Schlaganfall den linken Arm nicht bewegen. Du hilfst ihr beim Aufstehen aus dem Bett.",
    "reflexion|pflegeprozess|pflegeplanung|pflegedokumentation|pflegediagnose|assessment|evaluation|pflegebericht|sis|strukturmodell":
      "CE 03: Erste Pflegeerfahrungen reflektieren + Pflegeprozess. Prüfungsrelevanz: KB I.1, KB V. Kernbegriffe: Pflegeprozess (6 Schritte), Pflegediagnosen (NANDA), Pflegeziele (SMART), SIS, AEDL nach Krohwinkel, ATL nach Roper. Alltagsbezug: Du schreibst zum ersten Mal einen Pflegebericht. Was gehört rein, was nicht?",
    "hygiene|desinfektion|infektionsschutz|prävention|gesundheitsförderung|ernährung|hygieneplan|mrsa|norovirus|händedesinfektion|sterilisation|impfung|gesundheitsberatung":
      "CE 04: Gesundheit fördern und präventiv handeln. Prüfungsrelevanz: KB I.2, II.2, Klausur 2. Kernbegriffe: RKI-Empfehlungen, 5 Momente der Händedesinfektion, Standardhygiene, MRSA/MRGN/VRE, IfSG, Meldepflicht, Ernährungsberatung, Ottawa-Charta. WICHTIG: Hygiene ist Pflichtthema in allen 3 Ausbildungsdritteln. Alltagsbezug: Auf der Station gibt es einen Norovirus-Ausbruch. Was musst du sofort tun?",
    "medikamente|wundversorgung|injektion|infusion|operation|prä-op|post-op|verband|drainage|katheter|sonde|blutzucker|insulin|vitalzeichen|blutdruck|puls|temperatur|arzneimittel|nebenwirkung":
      "CE 05: Kurative Prozesse pflegerisch unterstützen. Prüfungsrelevanz: KB I.2, III.2, Klausur 2+3. Kernbegriffe: 5R-Regel, subkutane/intramuskuläre Injektion, Wundbeobachtung, Vitalzeichen-Normalwerte, prä-/postoperative Pflege. Alltagsbezug: Der Arzt ordnet Heparin s.c. an. Du bereitest die Spritze vor — worauf achtest du?",
    "notfall|reanimation|erste hilfe|schock|bewusstlosigkeit|herzstillstand|atemnot|sturz|aspiration|anaphylaxie|akut":
      "CE 06: In Akutsituationen sicher handeln. Prüfungsrelevanz: KB I.3, I.4, Klausur 3. Kernbegriffe: BLS, AED, stabile Seitenlage, Schockarten, Notfallprotokoll, Glasgow Coma Scale, Aspirationsprophylaxe. WICHTIG: Prüfungsliebling! Alltagsbezug: Du findest Herrn B. bewusstlos im Zimmer. Was tust du zuerst?",
    "rehabilitation|reha|entlassungsmanagement|teamarbeit|interprofessionell|physiotherapie|ergotherapie|logopädie|pflegeüberleitung":
      "CE 07: Rehabilitatives Pflegehandeln im interprofessionellen Team. Prüfungsrelevanz: KB III.1, III.3. Kernbegriffe: ICF-Modell, Entlassungsmanagement (DNQP), Pflegeüberleitung, Case Management, Hilfsmittelversorgung. Alltagsbezug: Herr S. hatte eine Hüft-OP und soll nach Hause entlassen werden. Er lebt allein. Was organisierst du?",
    "palliativ|sterbebegleitung|tod|trauer|hospiz|schmerzmanagement|sterbephase|patientenverfügung|vorsorgevollmacht|ethik|würde|lebensende":
      "CE 08: Kritische Lebenssituationen und letzte Lebensphase. Prüfungsrelevanz: KB I.3, II.3, Klausur 3. Kernbegriffe: Palliative Care, Symptomkontrolle, Sterbephasen nach Kübler-Ross, Patientenverfügung, Vorsorgevollmacht, Hospizarbeit, ethische Fallbesprechung. Alltagsbezug: Frau W. ist in der letzten Lebensphase. Die Tochter weint und fragt: 'Muss meine Mutter jetzt leiden?'",
    "demenz|alzheimer|biografiearbeit|validation|alltagsgestaltung|beschäftigung|orientierung|verwirrtheit|gerontologie|alter|altenheim|langzeitpflege|aktivierung|tagesstruktur":
      "CE 09: Lebensgestaltung lebensweltorientiert unterstützen. Prüfungsrelevanz: KB I.5, I.6, Klausur 1. Kernbegriffe: Demenzformen, Validation nach Feil, Biografiearbeit, ROT, Snoezelen, Basale Stimulation, MMST, herausforderndes Verhalten. WICHTIG: Demenz ist das Mega-Thema in der Altenpflege! Alltagsbezug: Herr M. läuft nachts durch die Flure und ruft nach seiner Mutter. Wie reagierst du?",
    "kind|pädiatrie|säugling|jugendlich|entwicklung|kindeswohl|kinderkrankenpflege|stillen|impfkalender|u-untersuchung|kinderschutz|gewalt":
      "CE 10: Entwicklung und Gesundheit in Kindheit und Jugend. Prüfungsrelevanz: KB I.2, II.2, Pflichteinsatz Pädiatrie. Kernbegriffe: Entwicklungsstufen, Kindeswohl §8a SGB VIII, U-Untersuchungen, Impfkalender STIKO, atraumatische Pflege. Alltagsbezug: Du pflegst ein 3-jähriges Kind nach einer Mandel-OP. Es weint und will nicht trinken. Was machst du?",
    "psychiatrie|depression|angst|sucht|psychose|schizophrenie|suizid|abhängigkeit|psychische erkrankung|zwangsmaßnahme|fixierung|deeskalation|borderline":
      "CE 11: Psychische Gesundheitsprobleme und kognitive Beeinträchtigungen. Prüfungsrelevanz: KB I.3, II.3, Klausur 3, Pflichteinsatz Psychiatrie. Kernbegriffe: Depression, Angststörungen, Suchterkrankungen, Psychosen, Suizidalität, PsychKG, Deeskalation, Recovery-Ansatz, Fixierung (rechtliche Grundlagen). Alltagsbezug: Ein Patient sagt zu dir: 'Ich will nicht mehr leben.' Wie reagierst du?",
    "kommunikation|beratung|angehörige|gesprächsführung|patientengespräch|übergabe|pflegevisite":
      "Querschnittsthema: Kommunikation und Beratung. Prüfungsrelevanz: KB II, alle 3 Klausuren. Kernbegriffe: Aktives Zuhören, Schulz von Thun, motivierende Gesprächsführung, SBAR-Schema, Beratungskonzepte, kultursensible Pflege. Alltagsbezug: Du machst Übergabe an die Spätschicht. Bewohnerin Frau L. hat heute kaum gegessen und wirkt traurig.",
    "recht|haftung|betreuungsrecht|freiheitsentziehung|pflegegesetz|pflbg|dokumentationspflicht|berufsordnung":
      "Querschnittsthema: Rechtliche Grundlagen. Prüfungsrelevanz: KB IV, Klausur 1+3. Kernbegriffe: PflBG, Vorbehaltsaufgaben §4, Delegation, Haftung, Betreuungsrecht, FEM, Dokumentationspflicht, Schweigepflicht, Patientenrechtegesetz. Alltagsbezug: Eine Kollegin sagt: 'Fixier den Bewohner mal kurz am Bett, der fällt sonst raus.' Darfst du das?",
  },

  suchkonfiguration: {
    keywords: {
      medikamente: ["medikament", "arzneimittel", "injektion", "insulin", "heparin", "nebenwirkung", "wechselwirkung"],
      hygiene: ["hygiene", "desinfektion", "mrsa", "norovirus", "rki", "infektionsschutz", "mrgn"],
      recht: ["betreuungsrecht", "fixierung", "freiheitsentziehung", "pflbg", "haftung", "schweigepflicht"],
      pflege: ["pflegeprozess", "pflegeplanung", "prophylaxe", "dekubitus", "sturzprophylaxe", "mobilisation"],
    },
    trustedDomains: [
      "rki.de",
      "pflege.de",
      "dbfk.de",
      "gesetze-im-internet.de",
      "dnqp.de",
      "pqsg.de",
      "altenpflegemagazin.de",
    ],
    deepFetchTrigger: ["medikamente", "recht"],
  },

  promptErweiterungen: {
    praxisbezug: `PRAXISBEZUG FÜR PFLEGE:
- Beschreibe konkrete Pflegesituationen: "Du gehst ins Zimmer von Frau M...", "Du misst den Blutdruck..."
- Verwende Alltagssprache der Pflege: "lagern", "mobilisieren", "Vitalzeichen kontrollieren"
- Erkläre, was die Pflegekraft KONKRET TUT — mit konkretem Bewohner/Patient
- Fallbeispiele immer mit Namen und Situation`,
    level3Spezial: {
      medikamente: `LEVEL-3-SPEZIALANWEISUNG (Medikamente/Pflege):
- Level 3 MUSS ein Fallbeispiel mit konkretem Patienten enthalten!
- Aufgabenformat: "Herr/Frau X hat Diagnose Y. Der Arzt ordnet Z an. Was musst du beachten?"
- 5R-Regel immer erwähnen
- Die Musterantwort MUSS pflegerische Maßnahmen VOR und NACH der Gabe beschreiben.`,
    },
  },
};

export default pflege;
