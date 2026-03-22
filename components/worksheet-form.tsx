"use client";

import { useState } from "react";
import { SUBJECT_OPTIONS, SCHOOL_TYPE_OPTIONS } from "@/lib/types";

export default function WorksheetForm() {
  const [topic, setTopic] = useState("");
  const [subject, setSubject] = useState("");
  const [customSubject, setCustomSubject] = useState("");
  const [schoolType, setSchoolType] = useState("");
  const [customSchoolType, setCustomSchoolType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const effectiveSubject = subject === "Sonstiges" ? customSubject : subject;
  const effectiveSchoolType = schoolType === "Sonstiges" ? customSchoolType : schoolType;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (topic.trim().length < 3) {
      setError("Bitte gib ein Thema ein (mindestens 3 Zeichen).");
      return;
    }
    if (!effectiveSubject) {
      setError("Bitte waehle ein Fachgebiet.");
      return;
    }
    if (!effectiveSchoolType) {
      setError("Bitte waehle eine Schulform / einen Beruf.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic.trim(),
          subject: effectiveSubject,
          schoolType: effectiveSchoolType,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.error || `Fehler ${response.status}`);
      }

      // Trigger download
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const disposition = response.headers.get("content-disposition");
      a.download = disposition?.split("filename=")[1]?.replace(/"/g, "") || "Arbeitsblatt.docx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-xl">
      {/* Thema */}
      <div>
        <label htmlFor="topic" className="block text-sm font-bold text-gray-800 mb-1">
          Thema *
        </label>
        <input
          id="topic"
          type="text"
          placeholder='z.B. "Wahlrecht", "Sozialversicherung", "Hygiene"'
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          disabled={loading}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-gray-800 focus:outline-none disabled:opacity-50"
        />
      </div>

      {/* Fachgebiet */}
      <div>
        <label htmlFor="subject" className="block text-sm font-bold text-gray-800 mb-1">
          Fachgebiet *
        </label>
        <select
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          disabled={loading}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-gray-800 focus:outline-none disabled:opacity-50 bg-white"
        >
          <option value="">-- Bitte waehlen --</option>
          {SUBJECT_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {subject === "Sonstiges" && (
          <input
            type="text"
            placeholder="Fachgebiet eingeben..."
            value={customSubject}
            onChange={(e) => setCustomSubject(e.target.value)}
            disabled={loading}
            className="w-full mt-2 px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-gray-800 focus:outline-none disabled:opacity-50"
          />
        )}
      </div>

      {/* Schulform / Beruf */}
      <div>
        <label htmlFor="schoolType" className="block text-sm font-bold text-gray-800 mb-1">
          Schulform / Ausbildungsberuf *
        </label>
        <select
          id="schoolType"
          value={schoolType}
          onChange={(e) => setSchoolType(e.target.value)}
          disabled={loading}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-gray-800 focus:outline-none disabled:opacity-50 bg-white"
        >
          <option value="">-- Bitte waehlen --</option>
          {SCHOOL_TYPE_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {schoolType === "Sonstiges" && (
          <input
            type="text"
            placeholder="Beruf / Schulform eingeben..."
            value={customSchoolType}
            onChange={(e) => setCustomSchoolType(e.target.value)}
            disabled={loading}
            className="w-full mt-2 px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-gray-800 focus:outline-none disabled:opacity-50"
          />
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
            Arbeitsblatt wird erstellt... (ca. 15-30 Sek.)
          </span>
        ) : (
          "Arbeitsblatt generieren"
        )}
      </button>
    </form>
  );
}
