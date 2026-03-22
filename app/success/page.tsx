"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [status, setStatus] = useState<
    "loading" | "generating" | "done" | "error"
  >("loading");
  const [error, setError] = useState("");
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!sessionId || hasStarted.current) return;
    hasStarted.current = true;

    async function handleSuccess() {
      try {
        // 1. Verify the checkout session and get metadata
        setStatus("loading");
        const verifyRes = await fetch(
          `/api/checkout/verify?session_id=${sessionId}`
        );
        if (!verifyRes.ok) {
          const errData = await verifyRes.json().catch(() => null);
          throw new Error(
            errData?.error || "Zahlung konnte nicht verifiziert werden."
          );
        }

        const { topic, subject, schoolType } = await verifyRes.json();

        // 2. Generate the worksheet
        setStatus("generating");
        const generateRes = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic, subject, schoolType }),
        });

        if (!generateRes.ok) {
          const errData = await generateRes.json().catch(() => null);
          throw new Error(
            errData?.error || `Fehler bei der Generierung (${generateRes.status})`
          );
        }

        // 3. Download the file
        const blob = await generateRes.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        const disposition = generateRes.headers.get("content-disposition");
        a.download =
          disposition?.split("filename=")[1]?.replace(/"/g, "") ||
          "Arbeitsblatt.docx";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        setStatus("done");
      } catch (err: unknown) {
        console.error("Success page error:", err);
        setError(
          err instanceof Error ? err.message : "Ein unbekannter Fehler ist aufgetreten."
        );
        setStatus("error");
      }
    }

    handleSuccess();
  }, [sessionId]);

  if (!sessionId) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-700 mb-4">
          Fehler
        </h1>
        <p className="text-gray-600">
          Keine Sitzungs-ID gefunden. Bitte starte den Vorgang erneut.
        </p>
        <a
          href="/"
          className="inline-block mt-6 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Zurück zur Startseite
        </a>
      </div>
    );
  }

  return (
    <div className="text-center max-w-lg">
      {status === "loading" && (
        <>
          <div className="flex justify-center mb-6">
            <svg
              className="animate-spin h-10 w-10 text-gray-800"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Zahlung wird geprüft...
          </h1>
          <p className="text-gray-600">Bitte warte einen Moment.</p>
        </>
      )}

      {status === "generating" && (
        <>
          <div className="flex justify-center mb-6">
            <svg
              className="animate-spin h-10 w-10 text-gray-800"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Zahlung erfolgreich!
          </h1>
          <p className="text-gray-600">
            Dein Arbeitsblatt wird jetzt erstellt... (ca. 15-30 Sekunden)
          </p>
        </>
      )}

      {status === "done" && (
        <>
          <div className="flex justify-center mb-6">
            <svg
              className="h-16 w-16 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Fertig!
          </h1>
          <p className="text-gray-600 mb-6">
            Dein Arbeitsblatt wurde heruntergeladen. Falls der Download nicht
            automatisch gestartet ist, klicke den Button unten.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Neues Arbeitsblatt erstellen
          </a>
        </>
      )}

      {status === "error" && (
        <>
          <div className="flex justify-center mb-6">
            <svg
              className="h-16 w-16 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-red-700 mb-2">
            Fehler
          </h1>
          <p className="text-gray-600 mb-2">{error}</p>
          <p className="text-sm text-gray-500 mb-6">
            Deine Zahlung wurde erfolgreich verarbeitet. Bitte kontaktiere uns,
            falls das Problem weiterhin besteht.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Zurück zur Startseite
          </a>
        </>
      )}
    </div>
  );
}

export default function SuccessPage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
      <Suspense
        fallback={
          <div className="text-center">
            <p className="text-gray-600">Laden...</p>
          </div>
        }
      >
        <SuccessContent />
      </Suspense>
    </main>
  );
}
