"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [status, setStatus] = useState<
    "loading" | "confirming" | "generating" | "done" | "error"
  >("loading");
  const [error, setError] = useState("");
  const [summary, setSummary] = useState("");
  const [correction, setCorrection] = useState("");
  const [showCorrectionField, setShowCorrectionField] = useState(false);
  const [topicData, setTopicData] = useState<{ topic: string; subject: string; schoolType: string } | null>(null);
  const hasStarted = useRef(false);

  // Step 1: Verify payment + get topic check
  useEffect(() => {
    if (!sessionId || hasStarted.current) return;
    hasStarted.current = true;

    async function verifyAndCheck() {
      try {
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
        await verifyRes.json();

        // Get topic summary from topic-check API
        const checkRes = await fetch("/api/topic-check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        if (checkRes.ok) {
          const checkData = await checkRes.json();
          setSummary(checkData.summary);
          setStatus("confirming");
        } else {
          // Topic check failed — skip confirmation, generate directly
          console.warn("Topic check failed, skipping confirmation");
          await generateWorksheet();
        }
      } catch (err: unknown) {
        console.error("Verify error:", err);
        setError(
          err instanceof Error ? err.message : "Ein unbekannter Fehler ist aufgetreten."
        );
        setStatus("error");
      }
    }

    verifyAndCheck();
  }, [sessionId]);

  // Step 2: Generate worksheet (after confirmation)
  async function generateWorksheet(correctedTopic?: string) {
    try {
      setStatus("generating");
      const body: Record<string, string> = { sessionId: sessionId! };
      if (correctedTopic) {
        body.correctedTopic = correctedTopic;
      }

      const generateRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!generateRes.ok) {
        const errData = await generateRes.json().catch(() => null);
        throw new Error(
          errData?.error || `Fehler bei der Generierung (${generateRes.status})`
        );
      }

      // Download the file
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
      console.error("Generation error:", err);
      setError(
        err instanceof Error ? err.message : "Ein unbekannter Fehler ist aufgetreten."
      );
      setStatus("error");
    }
  }

  // Re-check with corrected topic
  async function handleCorrection() {
    if (!correction.trim()) return;
    try {
      setShowCorrectionField(false);
      setStatus("loading");

      const checkRes = await fetch("/api/topic-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          topic: correction.trim(),
        }),
      });

      if (checkRes.ok) {
        const checkData = await checkRes.json();
        setSummary(checkData.summary);
        setTopicData((prev) => ({ ...prev!, topic: correction.trim() }));
        setCorrection("");
        setStatus("confirming");
      } else {
        // Fallback: generate with corrected topic directly
        await generateWorksheet(correction.trim());
      }
    } catch (err: unknown) {
      console.error("Correction check error:", err);
      setError(
        err instanceof Error ? err.message : "Fehler bei der Korrektur."
      );
      setStatus("error");
    }
  }

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
            Thema wird geprüft...
          </h1>
          <p className="text-gray-600">Wir recherchieren aktuelle Informationen zu deinem Thema.</p>
        </>
      )}

      {status === "confirming" && (
        <>
          <div className="flex justify-center mb-6">
            <svg className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Zahlung erfolgreich!
          </h1>
          <p className="text-gray-600 mb-6">
            Bevor wir dein Arbeitsblatt erstellen — stimmt die Richtung?
          </p>

          {/* Summary box */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-6 text-left">
            <p className="text-sm font-semibold text-gray-500 mb-2">Dein Arbeitsblatt wird behandeln:</p>
            <p className="text-gray-800 leading-relaxed">{summary}</p>
          </div>

          {!showCorrectionField ? (
            <div className="flex flex-col gap-3 items-center">
              <button
                onClick={() => generateWorksheet(topicData?.topic)}
                className="w-full px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors font-bold"
              >
                Ja, passt — Arbeitsblatt erstellen
              </button>
              <button
                onClick={() => setShowCorrectionField(true)}
                className="w-full px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Nein, ich meine etwas anderes
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 text-left">
                Beschreibe genauer, was dein Arbeitsblatt behandeln soll:
              </p>
              <textarea
                value={correction}
                onChange={(e) => setCorrection(e.target.value)}
                placeholder="z.B. &quot;Ich meine die GOP 03220, nicht 03040&quot; oder &quot;Es geht um das Pflegestärkungsgesetz II, nicht III&quot;"
                className="w-full p-3 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-gray-400"
                rows={3}
              />
              <div className="flex gap-3">
                <button
                  onClick={handleCorrection}
                  disabled={!correction.trim()}
                  className="flex-1 px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors font-bold disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Nochmal prüfen
                </button>
                <button
                  onClick={() => {
                    setShowCorrectionField(false);
                    setCorrection("");
                  }}
                  className="px-4 py-3 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Abbrechen
                </button>
              </div>
            </div>
          )}
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
            Arbeitsblatt wird erstellt...
          </h1>
          <p className="text-gray-600">
            Das dauert ca. 15-30 Sekunden. Bitte Seite nicht schließen.
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
          <p className="text-gray-600 mb-4">
            Dein Arbeitsblatt wurde heruntergeladen.
          </p>

          {/* Feedback section */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-6 text-left">
            <p className="font-semibold text-gray-800 mb-2">Zufrieden mit dem Arbeitsblatt?</p>
            <p className="text-sm text-gray-600 mb-3">
              Was können wir besser machen? Dein Feedback hilft uns, die Qualität zu verbessern.
            </p>
            <a
              href="mailto:klee@arbeitsblatt-generator.com?subject=Feedback%20Arbeitsblatt"
              className="text-sm text-gray-900 underline hover:text-gray-600"
            >
              klee@arbeitsblatt-generator.com
            </a>
          </div>

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
            Das hat leider nicht geklappt
          </h1>
          <p className="text-gray-600 mb-2">{error}</p>
          <p className="text-sm text-gray-500 mb-6">
            Deine Zahlung ist gesichert. Falls es erneut fehlschlägt, kontaktiere uns unter klee@arbeitsblatt-generator.com.
          </p>
          <div className="flex flex-col gap-3 items-center">
            <button
              onClick={() => {
                hasStarted.current = false;
                setError("");
                setStatus("loading");
                window.location.reload();
              }}
              className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors font-bold"
            >
              Erneut versuchen
            </button>
            <a
              href="/"
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Zurück zur Startseite
            </a>
          </div>
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
