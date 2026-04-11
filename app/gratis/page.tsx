import { Suspense } from "react";
import Link from "next/link";
import FreeTrialForm from "@/components/free-trial-form";

export const metadata = {
  title: "Kostenloses Arbeitsblatt erstellen — Arbeitsblatt-Generator",
  description:
    "Teste den Arbeitsblatt-Generator gratis: 1 kostenloses Arbeitsblatt mit 3 Schwierigkeitsstufen, Lösungen und Lehrerhinweisen. Keine Anmeldung, kein Abo.",
};

export default function GratisPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center px-4 py-12">
      <div className="w-full max-w-xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold text-gray-900">
            1 Arbeitsblatt kostenlos testen
          </h1>
          <p className="text-gray-600 text-lg">
            Erstelle ein vollständiges Arbeitsblatt mit 3 Schwierigkeitsstufen,
            Lösungen und Lehrerhinweisen — komplett kostenlos.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-sm text-gray-700">
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl mb-1">&#x2193;</div>
            <div className="font-semibold">Sofort als .docx</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl mb-1">&#x2261;</div>
            <div className="font-semibold">3 Niveaustufen</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl mb-1">&#x2713;</div>
            <div className="font-semibold">Mit Lösungen</div>
          </div>
        </div>

        {/* Form */}
        <Suspense fallback={<div className="text-center text-gray-400">Laden...</div>}>
          <FreeTrialForm />
        </Suspense>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400">
          Weitere Arbeitsblätter ab 4,99 EUR.{" "}
          <Link href="/" className="underline hover:text-gray-600">
            Zum Generator
          </Link>
        </p>
      </div>
    </main>
  );
}
