"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { SUBJECT_OPTIONS, SCHOOL_TYPE_OPTIONS } from "@/lib/types";

const PILOT_CODE = "PILOT2026";

export default function WorksheetForm() {
  const [accessCode, setAccessCode] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [codeError, setCodeError] = useState("");
  const [topic, setTopic] = useState("");
  const [subject, setSubject] = useState("");
  const [customSubject, setCustomSubject] = useState("");
  const [schoolType, setSchoolType] = useState("");
  const [customSchoolType, setCustomSchoolType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("cancelled") === "true") {
      setError("Zahlung abgebrochen. Du kannst es jederzeit erneut versuchen.");
    }
    // Check if already unlocked in this session
    if (typeof window !== "undefined" && sessionStorage.getItem("pilot_unlocked") === "true") {
      setIsUnlocked(true);
    }
  }, [searchParams]);

  function handleCodeSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (accessCode.trim().toUpperCase() === PILOT_CODE) {
      setIsUnlocked(true);
      setCodeError("");
      if (typeof window !== "undefined") {
        sessionStorage.setItem("pilot_unlocked", "true");
      }
    } else {
      setCodeError("Ungültiger Zugangscode.");
    }
  }

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
      setError("Bitte wähle ein Fachgebiet.");
      return;
    }
    if (!effectiveSchoolType) {
      setError("Bitte wähle eine Schulform / einen Beruf.");
      return;
    }

    setLoading(true);

    try {
      // Create Stripe Checkout session
      const response = await fetch("/api/checkout", {
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

      const { url } = await response.json();

      if (!url) {
        throw new Error("Keine Checkout-URL erhalten.");
      }

      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unbekannter Fehler");
      setLoading(false);
    }
  }

  // Pilot gate: show access code form if not unlocked
  if (!isUnlocked) {
    return (
      <form onSubmit={handleCodeSubmit} className="space-y-4 w-full max-w-xl">
        <div className="border-2 border-gray-200 rounded-lg p-6 bg-white">
          <p className="text-sm font-bold text-gray-800 mb-1">Pilotphase</p>
          <p className="text-sm text-gray-500 mb-4">
            Der Arbeitsblatt-Generator befindet sich aktuell in der Pilotphase.
            Bitte gib deinen Zugangscode ein.
          </p>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Zugangscode"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-gray-800 focus:outline-none uppercase tracking-wider"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-700 transition-colors"
            >
              Freischalten
            </button>
          </div>
          {codeError && (
            <p className="mt-2 text-sm text-red-600">{codeError}</p>
          )}
        </div>
      </form>
    );
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
          <option value="">-- Bitte wählen --</option>
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
          <option value="">-- Bitte wählen --</option>
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
            Weiterleitung zur Zahlung...
          </span>
        ) : (
          "Arbeitsblatt kaufen — 4,99 \u20AC"
        )}
      </button>
    </form>
  );
}
