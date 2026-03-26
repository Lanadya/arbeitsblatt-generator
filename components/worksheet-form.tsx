"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { SUBJECT_OPTIONS, SCHOOL_TYPE_OPTIONS } from "@/lib/types";

type ProductType = "standard" | "premium";

export default function WorksheetForm() {
  const [productType, setProductType] = useState<ProductType>("standard");
  const [topic, setTopic] = useState("");
  const [subject, setSubject] = useState("");
  const [customSubject, setCustomSubject] = useState("");
  const [schoolType, setSchoolType] = useState("");
  const [customSchoolType, setCustomSchoolType] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [blobUrl, setBlobUrl] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("cancelled") === "true") {
      setError("Zahlung abgebrochen. Du kannst es jederzeit erneut versuchen.");
    }
  }, [searchParams]);

  const effectiveSubject = subject === "Sonstiges" ? customSubject : subject;
  const effectiveSchoolType = schoolType === "Sonstiges" ? customSchoolType : schoolType;
  const isPremium = productType === "premium";

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Client-side validation
    if (selectedFile.size > 5 * 1024 * 1024) {
      setUploadError("Datei ist zu groß. Maximal 5 MB erlaubt.");
      return;
    }

    const isDocx = selectedFile.name.endsWith(".docx");
    const isPdf = selectedFile.name.endsWith(".pdf");
    if (!isDocx && !isPdf) {
      setUploadError("Nur DOCX- und PDF-Dateien sind erlaubt.");
      return;
    }

    setFile(selectedFile);
    setUploadError("");
    setBlobUrl("");
    setCharCount(0);
    setUploading(true);

    try {
      const isPdfFile = selectedFile.name.toLowerCase().endsWith(".pdf");

      if (isPdfFile) {
        // PDF: Extract text client-side with pdfjs-dist
        const arrayBuffer = await selectedFile.arrayBuffer();
        const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
        pdfjsLib.GlobalWorkerOptions.workerSrc = "";

        const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer), useWorkerFetch: false, isEvalSupported: false, useSystemFonts: true });
        const pdf = await loadingTask.promise;
        const pages: string[] = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const pageText = content.items
            .filter((item) => "str" in item)
            .map((item) => (item as { str: string }).str)
            .join(" ");
          pages.push(pageText);
        }
        const fullText = pages.join("\n\n");

        if (fullText.trim().length < 50) {
          throw new Error("Die PDF enthält keinen lesbaren Text — wahrscheinlich ist sie ein Scan oder Screenshot. Bitte lade stattdessen das Original als DOCX hoch.");
        }

        // Send extracted text to server (JSON, not FormData)
        const response = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: fullText, fileName: selectedFile.name }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Upload fehlgeschlagen");
        setBlobUrl(data.blobUrl);
        setCharCount(data.charCount);
      } else {
        // DOCX: Send file to server for mammoth extraction
        const formData = new FormData();
        formData.append("file", selectedFile);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Upload fehlgeschlagen");
        setBlobUrl(data.blobUrl);
        setCharCount(data.charCount);
      }
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "Upload fehlgeschlagen");
      setFile(null);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // Validate topic (required for standard, optional for premium)
    if (!isPremium && topic.trim().length < 3) {
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
    if (isPremium && !blobUrl) {
      setError("Bitte lade zuerst eine Datei hoch.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic.trim() || (isPremium ? "Premium-Arbeitsblatt" : ""),
          subject: effectiveSubject,
          schoolType: effectiveSchoolType,
          productType,
          ...(isPremium ? { blobUrl } : {}),
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.error || `Fehler ${response.status}`);
      }

      const { url } = await response.json();
      if (!url) throw new Error("Keine Checkout-URL erhalten.");
      window.location.href = url;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unbekannter Fehler");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-xl">
      {/* Product Type Toggle */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => { setProductType("standard"); setFile(null); setBlobUrl(""); setUploadError(""); }}
          className={`p-4 rounded-lg border-2 text-left transition-all ${
            !isPremium
              ? "border-gray-900 bg-gray-50"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <p className="font-bold text-sm text-gray-900">Standard</p>
          <p className="text-xs text-gray-500 mt-1">Thema eingeben, KI recherchiert</p>
          <p className="text-lg font-bold text-gray-900 mt-2">4,99 &euro;</p>
        </button>
        <button
          type="button"
          onClick={() => setProductType("premium")}
          className={`p-4 rounded-lg border-2 text-left transition-all relative ${
            isPremium
              ? "border-gray-900 bg-gray-50"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <span className="absolute -top-2 right-3 bg-gray-900 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
            NEU
          </span>
          <p className="font-bold text-sm text-gray-900">Premium</p>
          <p className="text-xs text-gray-500 mt-1">Eigenes Material hochladen</p>
          <p className="text-lg font-bold text-gray-900 mt-2">9,99 &euro;</p>
        </button>
      </div>

      {/* Premium: File Upload */}
      {isPremium && (
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-1">
            Material hochladen *
          </label>
          <div
            onClick={() => !uploading && fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const droppedFile = e.dataTransfer.files[0];
              if (droppedFile && fileInputRef.current) {
                const dt = new DataTransfer();
                dt.items.add(droppedFile);
                fileInputRef.current.files = dt.files;
                fileInputRef.current.dispatchEvent(new Event("change", { bubbles: true }));
              }
            }}
            className={`w-full p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
              blobUrl
                ? "border-green-400 bg-green-50"
                : uploading
                ? "border-gray-300 bg-gray-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".docx,.pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            {uploading ? (
              <div className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-gray-500" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span className="text-sm text-gray-500">Wird verarbeitet...</span>
              </div>
            ) : blobUrl ? (
              <div>
                <p className="text-sm font-bold text-green-700">{file?.name}</p>
                <p className="text-xs text-green-600 mt-1">{charCount.toLocaleString("de-DE")} Zeichen erkannt</p>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-500">DOCX oder PDF hierher ziehen</p>
                <p className="text-xs text-gray-400 mt-1">oder klicken zum Auswählen (max. 5 MB)</p>
              </div>
            )}
          </div>
          {uploadError && (
            <p className="mt-2 text-sm text-red-600">{uploadError}</p>
          )}
        </div>
      )}

      {/* Thema */}
      <div>
        <label htmlFor="topic" className="block text-sm font-bold text-gray-800 mb-1">
          Thema {isPremium ? "(optional)" : "*"}
        </label>
        <input
          id="topic"
          type="text"
          placeholder={isPremium ? "Optional — KI erkennt das Thema aus deinem Material" : "Thema eingeben..."}
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          disabled={loading}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-gray-800 focus:outline-none disabled:opacity-50"
        />
        {!isPremium && (
          <div className="flex flex-wrap gap-2 mt-2">
            {["Hygiene", "EBM-Abrechnung", "Sozialversicherung", "Diabetes Typ 2", "Arbeitsrecht", "GOP 03000"].map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => setTopic(example)}
                disabled={loading}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 hover:text-gray-800 transition-colors disabled:opacity-50"
              >
                {example}
              </button>
            ))}
          </div>
        )}
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
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        {subject === "Sonstiges" && (
          <input type="text" placeholder="Fachgebiet eingeben..." value={customSubject}
            onChange={(e) => setCustomSubject(e.target.value)} disabled={loading}
            className="w-full mt-2 px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-gray-800 focus:outline-none disabled:opacity-50" />
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
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        {schoolType === "Sonstiges" && (
          <input type="text" placeholder="Beruf / Schulform eingeben..." value={customSchoolType}
            onChange={(e) => setCustomSchoolType(e.target.value)} disabled={loading}
            className="w-full mt-2 px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-gray-800 focus:outline-none disabled:opacity-50" />
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
        disabled={loading || (isPremium && uploading)}
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
        ) : isPremium ? (
          "Premium-Arbeitsblatt kaufen — 9,99 \u20AC"
        ) : (
          "Arbeitsblatt kaufen — 4,99 \u20AC"
        )}
      </button>
    </form>
  );
}
