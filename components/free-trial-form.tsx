"use client";

import { useState } from "react";
import { getAllSchulTypen, getFaecherForBeruf, getThemenBeispiele } from "@/lib/beruf-config";

const allSchulTypen = getAllSchulTypen();
const schulTypGruppen: { label: string; items: { id: string; label: string }[] }[] = [
  { label: "Ausbildungsberufe", items: allSchulTypen.filter(s => s.kategorie === "ausbildungsberuf") },
  { label: "Allgemeinbildende Schulen", items: allSchulTypen.filter(s => s.kategorie === "allgemeinbildend") },
  { label: "Förderschule", items: allSchulTypen.filter(s => s.kategorie === "foerderschule") },
  { label: "Sonstige", items: allSchulTypen.filter(s => s.kategorie === "sonstige") },
].filter(g => g.items.length > 0);

type FormStep = "form" | "confirming" | "loading" | "generating" | "done";

export default function FreeTrialForm() {
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("");
  const [subject, setSubject] = useState("");
  const [schoolType, setSchoolType] = useState("");
  const [step, setStep] = useState<FormStep>("form");
  const [error, setError] = useState("");
  const [summary, setSummary] = useState("");
  const [correction, setCorrection] = useState("");
  const [showCorrectionField, setShowCorrectionField] = useState(false);
  const [activeTopic, setActiveTopic] = useState(""); // topic after confirmation (may be corrected)

  const fachOptionen = schoolType ? getFaecherForBeruf(schoolType) : [];
  const themenTags = schoolType ? getThemenBeispiele(schoolType) : [];

  function handleSchoolTypeChange(value: string) {
    setSchoolType(value);
    setSubject("");
  }

  // Step 1: Validate form + get topic summary
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email || !email.includes("@")) {
      setError("Bitte gib eine gültige E-Mail-Adresse ein.");
      return;
    }
    if (!schoolType) {
      setError("Bitte wähle eine Schulform.");
      return;
    }
    if (!subject) {
      setError("Bitte wähle ein Fachgebiet.");
      return;
    }
    if (topic.trim().length < 3) {
      setError("Bitte gib ein Thema ein (mindestens 3 Zeichen).");
      return;
    }

    await checkTopic(topic.trim());
  }

  // Topic check (used for initial submit and corrections)
  async function checkTopic(topicToCheck: string) {
    setStep("loading");
    setError("");

    try {
      const res = await fetch("/api/topic-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topicToCheck, subject, schoolType }),
      });

      if (res.ok) {
        const data = await res.json();
        setSummary(data.summary);
        setActiveTopic(topicToCheck);
        setShowCorrectionField(false);
        setCorrection("");
        setStep("confirming");
      } else {
        // Topic check failed — skip confirmation, generate directly
        setActiveTopic(topicToCheck);
        await generateWorksheet(topicToCheck);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Themenprüfung fehlgeschlagen.");
      setStep("form");
    }
  }

  // Step 2: Generate after confirmation
  async function generateWorksheet(finalTopic: string) {
    setStep("generating");
    setError("");

    try {
      const res = await fetch("/api/free-trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, topic: finalTopic, subject, schoolType }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || `Fehler ${res.status}`);
      }

      // Download the file
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const disposition = res.headers.get("content-disposition");
      a.download = disposition?.split("filename=")[1]?.replace(/"/g, "") || "Arbeitsblatt.docx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setStep("done");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unbekannter Fehler");
      setStep("form");
    }
  }

  // === DONE STATE ===
  if (step === "done") {
    return (
      <div className="text-center space-y-4 w-full max-w-xl">
        <div className="flex justify-center">
          <svg className="h-16 w-16 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Dein Arbeitsblatt wurde heruntergeladen!</h2>

        {/* Feedback */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 text-left">
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

        <p className="text-gray-600">Weitere Arbeitsblätter gibt es ab 4,99 EUR.</p>
        <a href="/" className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors font-bold">
          Weitere Arbeitsblätter erstellen
        </a>
      </div>
    );
  }

  // === CONFIRMING STATE ===
  if (step === "confirming") {
    return (
      <div className="space-y-5 w-full max-w-xl">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Stimmt die Richtung?</h2>
          <p className="text-gray-600 text-sm">Bevor wir dein Arbeitsblatt erstellen:</p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
          <p className="text-sm font-semibold text-gray-500 mb-2">Dein Arbeitsblatt wird behandeln:</p>
          <p className="text-gray-800 leading-relaxed">{summary}</p>
        </div>

        {!showCorrectionField ? (
          <div className="flex flex-col gap-3">
            <button
              onClick={() => generateWorksheet(activeTopic)}
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
            <p className="text-sm text-gray-600">
              Beschreibe genauer, was dein Arbeitsblatt behandeln soll:
            </p>
            <textarea
              value={correction}
              onChange={(e) => setCorrection(e.target.value)}
              placeholder='z.B. "Ich meine die GOP 03220, nicht 03040" oder "Es geht um das Pflegestärkungsgesetz II"'
              className="w-full p-3 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-gray-400"
              rows={3}
            />
            <div className="flex gap-3">
              <button
                onClick={() => checkTopic(correction.trim())}
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
      </div>
    );
  }

  // === LOADING / GENERATING STATE ===
  if (step === "loading" || step === "generating") {
    return (
      <div className="text-center space-y-4 w-full max-w-xl">
        <div className="flex justify-center">
          <svg className="animate-spin h-10 w-10 text-gray-800" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900">
          {step === "loading" ? "Thema wird geprüft..." : "Arbeitsblatt wird erstellt..."}
        </h2>
        <p className="text-gray-600 text-sm">
          {step === "loading"
            ? "Wir recherchieren aktuelle Informationen zu deinem Thema."
            : "Das dauert ca. 15-30 Sekunden. Bitte Seite nicht schließen."}
        </p>
      </div>
    );
  }

  // === FORM STATE ===
  return (
    <form onSubmit={handleSubmit} className="space-y-5 w-full max-w-xl">
      {/* E-Mail */}
      <div>
        <label htmlFor="email" className="block text-sm font-bold text-gray-800 mb-1">
          Deine E-Mail-Adresse *
        </label>
        <input
          id="email"
          type="email"
          placeholder="name@schule.de"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-gray-800 focus:outline-none"
        />
        <p className="text-xs text-gray-400 mt-1">Nur für den Freiversuch. Kein Newsletter, kein Spam.</p>
      </div>

      {/* Schulform */}
      <div>
        <label htmlFor="ft-schoolType" className="block text-sm font-bold text-gray-800 mb-1">
          Schulform / Ausbildungsberuf *
        </label>
        <select
          id="ft-schoolType"
          value={schoolType}
          onChange={(e) => handleSchoolTypeChange(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-gray-800 focus:outline-none bg-white"
        >
          <option value="">-- Bitte wählen --</option>
          {schulTypGruppen.map((gruppe) => (
            <optgroup key={gruppe.label} label={gruppe.label}>
              {gruppe.items.map((item) => (
                <option key={item.id} value={item.id}>{item.label}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* Fachgebiet */}
      <div>
        <label htmlFor="ft-subject" className="block text-sm font-bold text-gray-800 mb-1">
          Fachgebiet *
        </label>
        <select
          id="ft-subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          disabled={!schoolType}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-gray-800 focus:outline-none disabled:opacity-50 bg-white"
        >
          <option value="">{schoolType ? "-- Bitte wählen --" : "-- Erst Schulform wählen --"}</option>
          {fachOptionen.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      {/* Thema */}
      <div>
        <label htmlFor="ft-topic" className="block text-sm font-bold text-gray-800 mb-1">
          Thema *
        </label>
        <input
          id="ft-topic"
          type="text"
          placeholder="Thema eingeben..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-gray-800 focus:outline-none"
        />
        {themenTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {themenTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setTopic(tag)}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 hover:text-gray-800 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 border-2 border-red-400 bg-red-50 rounded-lg text-red-800 text-sm">
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        className="w-full py-4 px-6 bg-gray-900 text-white text-lg font-bold rounded-lg hover:bg-gray-700 transition-colors"
      >
        Kostenloses Arbeitsblatt erstellen
      </button>
    </form>
  );
}
