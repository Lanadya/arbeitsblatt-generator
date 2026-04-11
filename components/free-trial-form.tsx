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

export default function FreeTrialForm() {
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("");
  const [subject, setSubject] = useState("");
  const [schoolType, setSchoolType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const fachOptionen = schoolType ? getFaecherForBeruf(schoolType) : [];
  const themenTags = schoolType ? getThemenBeispiele(schoolType) : [];

  function handleSchoolTypeChange(value: string) {
    setSchoolType(value);
    setSubject("");
  }

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

    setLoading(true);

    try {
      const res = await fetch("/api/free-trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, topic: topic.trim(), subject, schoolType }),
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

      setDone(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="text-center space-y-4 w-full max-w-xl">
        <div className="flex justify-center">
          <svg className="h-16 w-16 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Dein Arbeitsblatt wurde heruntergeladen!</h2>
        <p className="text-gray-600">Hat es dir gefallen? Weitere Arbeitsblätter gibt es ab 4,99 EUR.</p>
        <a href="/" className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors font-bold">
          Weitere Arbeitsblätter erstellen
        </a>
      </div>
    );
  }

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
          disabled={loading}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-gray-800 focus:outline-none disabled:opacity-50"
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
          disabled={loading}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-gray-800 focus:outline-none disabled:opacity-50 bg-white"
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
          disabled={loading || !schoolType}
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
          disabled={loading}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-gray-800 focus:outline-none disabled:opacity-50"
        />
        {themenTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {themenTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setTopic(tag)}
                disabled={loading}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 hover:text-gray-800 transition-colors disabled:opacity-50"
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
        disabled={loading}
        className="w-full py-4 px-6 bg-gray-900 text-white text-lg font-bold rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-3">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Arbeitsblatt wird erstellt...
          </span>
        ) : (
          "Kostenloses Arbeitsblatt erstellen"
        )}
      </button>
    </form>
  );
}
