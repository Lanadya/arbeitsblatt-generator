import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Impressum",
  robots: { index: false, follow: false },
};

export default function Impressum() {
  return (
    <main className="flex-1 flex flex-col items-center px-4 py-12">
      <div className="w-full max-w-2xl space-y-8">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-800">
          &larr; Zur&uuml;ck zur Startseite
        </Link>

        <h1 className="text-3xl font-bold text-gray-900">Impressum</h1>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-gray-800">Angaben gem&auml;&szlig; &sect; 5 DDG</h2>
          <p className="text-gray-700">
            ARQON GmbH i.G.<br />
            Im Mediapark 5<br />
            50670 K&ouml;ln
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-gray-800">Kontakt</h2>
          <p className="text-gray-700">
            E-Mail: info@arbeitsblatt-generator.com
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-gray-800">Umsatzsteuer-ID</h2>
          <p className="text-gray-700">
            Umsatzsteueridentifikationsnummer gem&auml;&szlig; &sect; 27a Umsatzsteuergesetz:<br />
            [wird nach Eintragung erg&auml;nzt]
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-gray-800">Verantwortlich f&uuml;r den Inhalt nach &sect; 18 Abs. 2 MStV</h2>
          <p className="text-gray-700">
            Nina Klee<br />
            ARQON GmbH i.G.<br />
            Im Mediapark 5, 50670 K&ouml;ln
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-gray-800">EU-Streitschlichtung</h2>
          <p className="text-gray-700 text-sm">
            Die Europ&auml;ische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
            {" "}
            <a
              href="https://ec.europa.eu/consumers/odr/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-900"
            >
              https://ec.europa.eu/consumers/odr/
            </a>
            <br />
            Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren
            vor einer Verbraucherschlichtungsstelle teilzunehmen.
          </p>
        </section>

        <footer className="pt-8 border-t border-gray-200 text-xs text-gray-400">
          Stand: M&auml;rz 2026
        </footer>
      </div>
    </main>
  );
}
