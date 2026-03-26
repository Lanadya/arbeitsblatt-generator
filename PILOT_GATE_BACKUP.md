# Pilot-Gate Code (deaktiviert am 26.03.2026)

Kann jederzeit wieder aktiviert werden, indem der Code in `worksheet-form.tsx` eingefügt wird.

## Zugangscode
`PILOT2026`

## Code-Snippet für worksheet-form.tsx

```tsx
const PILOT_CODE = "PILOT2026";

// In der Component:
const [accessCode, setAccessCode] = useState("");
const [isUnlocked, setIsUnlocked] = useState(false);
const [codeError, setCodeError] = useState("");

// Im useEffect:
if (typeof window !== "undefined" && sessionStorage.getItem("pilot_unlocked") === "true") {
  setIsUnlocked(true);
}

// Handler:
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

// Vor dem return des Formulars:
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
```
