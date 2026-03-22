import WorksheetForm from "@/components/worksheet-form";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center px-4 py-12">
      {/* Header */}
      <div className="text-center mb-10 max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Arbeitsblatt-Generator
        </h1>
        <p className="text-gray-600 text-lg">
          Erstelle niedrigschwellige, kopierfeste Arbeitsblaetter fuer heterogene Lerngruppen.
          Einfach Thema eingeben — fertig in 30 Sekunden.
        </p>
      </div>

      {/* Form */}
      <WorksheetForm />

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
