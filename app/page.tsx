import { Suspense } from "react";
import WorksheetForm from "@/components/worksheet-form";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Arbeitsblatt-Generator",
  url: "https://arbeitsblatt-generator.vercel.app",
  description:
    "Erstelle in 30 Sekunden fertige, kopierfeste Arbeitsbl\u00e4tter f\u00fcr heterogene Lerngruppen. Einfache Sprache, 3 Schwierigkeitsstufen.",
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "1.99",
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

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center px-4 py-12">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Aktuell Banner */}
      <div className="mb-8 w-full max-w-xl">
        <div className="border border-gray-300 rounded-lg px-5 py-3 flex items-start gap-3 bg-white">
          <span className="text-lg font-bold text-gray-900 leading-tight mt-0.5">&#9679;</span>
          <div>
            <p className="text-sm font-bold text-gray-900">Immer aktuell.</p>
            <p className="text-xs text-gray-500">
              Jedes Arbeitsblatt ber&uuml;cksichtigt automatisch aktuelle Ereignisse und &Auml;nderungen.
            </p>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="text-center mb-10 max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Arbeitsblatt-Generator f&uuml;r heterogene Lerngruppen
        </h1>
        <p className="text-gray-600 text-lg">
          Erstelle kopierfeste Arbeitsbl&auml;tter in einfacher Sprache (A2&ndash;B1).
          Thema eingeben &mdash; fertiges Word-Dokument in 30 Sekunden.
        </p>
        <p className="text-gray-400 text-sm mt-2">
          Ideal f&uuml;r Berufsschule, DaZ, Willkommensklassen, F&ouml;rderschule &amp; Realschule.
        </p>
      </div>

      {/* Form */}
      <Suspense fallback={null}>
        <WorksheetForm />
      </Suspense>

      {/* Info */}
      <div className="mt-12 max-w-xl text-sm text-gray-500 space-y-2">
        <p className="font-bold text-gray-700">Was du bekommst:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Fertiges Word-Dokument (.docx) zum Drucken</li>
          <li>7-Schritte-Didaktik: Alltag, Erklaerung, Schaubild, Begriffe, Uebungen, Fehler, Abschluss</li>
          <li>3 Schwierigkeitsstufen bei den Aufgaben</li>
          <li>Kopierfestes S/W-Design (kein Farbdrucker noetig)</li>
          <li>Sprachniveau A2-B1 (auch fuer DaZ geeignet)</li>
        </ul>
      </div>

      {/* Footer */}
      <footer className="mt-auto pt-12 pb-6 text-center text-xs text-gray-400">
        Arbeitsblatt-Generator | Powered by Claude AI
      </footer>
    </main>
  );
}
