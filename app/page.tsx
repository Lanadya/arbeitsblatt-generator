import { Suspense } from "react";
import Link from "next/link";
import WorksheetForm from "@/components/worksheet-form";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Arbeitsblatt-Generator",
  url: "https://arbeitsblatt-generator.com",
  description:
    "Erstelle in 30 Sekunden fertige, kopierfeste Arbeitsbl\u00e4tter f\u00fcr heterogene Lerngruppen. Einfache Sprache, 3 Schwierigkeitsstufen.",
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "4.99",
    priceCurrency: "EUR",
    description: "Pro Arbeitsblatt",
  },
  audience: {
    "@type": "EducationalAudience",
    educationalRole: "teacher",
  },
  inLanguage: "de",
  keywords:
    "Arbeitsblatt, Generator, heterogene Lerngruppen, DaZ, Berufsschule, einfache Sprache, kopierfest",
};

const features = [
  {
    icon: "\u2193",
    title: "Sofort druckfertig",
    desc: "Fertiges Word-Dokument (.docx) \u2014 direkt ausdrucken oder anpassen.",
  },
  {
    icon: "\u2261",
    title: "3 Schwierigkeitsstufen",
    desc: "Ankreuzen, L\u00fcckentext, offene Aufgaben \u2014 f\u00fcr jedes Niveau.",
  },
  {
    icon: "\u25A8",
    title: "Kopierfestes S/W-Design",
    desc: "Optimiert f\u00fcr Schulkopierer. Keine Farbe, keine Emojis, kein Grau.",
  },
  {
    icon: "A2",
    title: "Einfache Sprache",
    desc: "Sprachniveau A2\u2013B1. Max. 10 W\u00f6rter pro Satz. Ideal f\u00fcr DaZ.",
  },
  {
    icon: "\u2713",
    title: "L\u00f6sungsblatt inklusive",
    desc: "Separate Lehrerseite mit Antworten und 10-Minuten-Unterrichtsplan.",
  },
  {
    icon: "7",
    title: "7-Schritte-Didaktik",
    desc: "Alltag \u2192 Erkl\u00e4rung \u2192 Schaubild \u2192 Begriffe \u2192 \u00dcbungen \u2192 Fehler \u2192 Abschluss.",
  },
];

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <section className="w-full bg-gray-900 text-white px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          {/* Aktuell Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-gray-300">Immer aktuell &mdash; mit Live-Daten aus dem Web</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Arbeitsbl&auml;tter f&uuml;r<br />heterogene Lerngruppen
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-4 max-w-2xl mx-auto">
            Thema eingeben &mdash; fertiges Word-Dokument in 30 Sekunden.
            Kopierfest, differenziert, in einfacher Sprache.
          </p>
          <p className="text-sm text-gray-500">
            F&uuml;r Berufsschule &bull; DaZ &bull; Willkommensklassen &bull; F&ouml;rderschule &bull; Realschule
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="w-full px-4 -mt-8">
        <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 p-6 md:p-8">
          <Suspense fallback={null}>
            <WorksheetForm />
          </Suspense>
        </div>
      </section>

      {/* Features Grid */}
      <section className="w-full px-4 py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">
            Was du bekommst
          </h2>
          <p className="text-gray-500 text-center mb-10">
            Jedes Arbeitsblatt folgt einem bew&auml;hrten didaktischen Konzept.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="border border-gray-200 rounded-lg p-5 hover:border-gray-400 transition-colors"
              >
                <div className="w-10 h-10 bg-gray-900 text-white rounded-lg flex items-center justify-center font-bold text-sm mb-3">
                  {f.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="w-full bg-gray-50 px-4 py-16 md:py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-10">So funktioniert&apos;s</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">1</div>
              <h3 className="font-bold text-gray-900 mb-2">Thema eingeben</h3>
              <p className="text-sm text-gray-500">z.B. &bdquo;Wahlrecht&ldquo;, &bdquo;Hygiene&ldquo;, &bdquo;Sozialversicherung&ldquo;</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">2</div>
              <h3 className="font-bold text-gray-900 mb-2">Fach &amp; Schulform w&auml;hlen</h3>
              <p className="text-sm text-gray-500">Damit das Arbeitsblatt zum Alltag deiner Sch&uuml;ler passt.</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">3</div>
              <h3 className="font-bold text-gray-900 mb-2">Herunterladen &amp; drucken</h3>
              <p className="text-sm text-gray-500">Fertiges .docx mit Aufgaben, L&ouml;sungen und Lehrerhinweisen.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust / Social Proof */}
      <section className="w-full px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">30s</p>
              <p className="text-xs text-gray-500 mt-1">pro Arbeitsblatt</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">7</p>
              <p className="text-xs text-gray-500 mt-1">didaktische Schritte</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">3</p>
              <p className="text-xs text-gray-500 mt-1">Aufgaben-Niveaus</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">A2&ndash;B1</p>
              <p className="text-xs text-gray-500 mt-1">Sprachniveau</p>
            </div>
          </div>
        </div>
      </section>

      {/* Kontakt */}
      <section className="w-full max-w-3xl mx-auto mt-8 px-4 text-center">
        <p className="text-sm text-gray-500">
          Fragen, Feedback oder Interesse an einer Schullizenz?{" "}
          <a href="mailto:klee@arbeitsblatt-generator.com" className="text-gray-800 font-bold hover:underline">
            klee@arbeitsblatt-generator.com
          </a>
        </p>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-gray-200 mt-8 py-8 px-4">
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <p>&copy; 2026 ARQON GmbH i.G. &mdash; Arbeitsblatt-Generator</p>
          <div className="flex gap-4">
            <Link href="/impressum" className="hover:text-gray-600 underline">Impressum</Link>
            <Link href="/datenschutz" className="hover:text-gray-600 underline">Datenschutz</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
