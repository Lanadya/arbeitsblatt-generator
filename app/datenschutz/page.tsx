import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Datenschutzerkl\u00e4rung",
  robots: { index: false, follow: false },
};

export default function Datenschutz() {
  return (
    <main className="flex-1 flex flex-col items-center px-4 py-12">
      <div className="w-full max-w-2xl space-y-8 text-gray-700 text-sm leading-relaxed">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-800">
          &larr; Zur&uuml;ck zur Startseite
        </Link>

        <h1 className="text-3xl font-bold text-gray-900">Datenschutzerkl&auml;rung</h1>

        {/* 1. Verantwortlicher */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-gray-800">1. Verantwortlicher</h2>
          <p>
            ARQON GmbH i.G.<br />
            Nina Klee<br />
            Im Mediapark 5, 50670 K&ouml;ln<br />
            E-Mail: klee@arbeitsblatt-generator.com
          </p>
        </section>

        {/* 2. Übersicht */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-gray-800">2. &Uuml;bersicht der Datenverarbeitungen</h2>
          <p>
            Diese Datenschutzerkl&auml;rung informiert Sie &uuml;ber die Art, den Umfang und den Zweck
            der Verarbeitung personenbezogener Daten innerhalb unseres Onlineangebotes.
          </p>
        </section>

        {/* 3. Hosting */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-gray-800">3. Hosting</h2>
          <p>
            Unser Angebot wird gehostet von <strong>Vercel Inc.</strong>, 440 N Baxter St, Los Angeles, CA 90012, USA.
            Vercel verarbeitet Zugriffsdaten (IP-Adresse, Zeitpunkt des Zugriffs, abgerufene Seite) zur Bereitstellung
            der Website. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an sicherer Bereitstellung).
          </p>
          <p>
            Vercel ist unter dem EU-US Data Privacy Framework zertifiziert.
            Weitere Informationen:
            {" "}
            <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline">
              vercel.com/legal/privacy-policy
            </a>
          </p>
        </section>

        {/* 4. Zahlungsabwicklung */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-gray-800">4. Zahlungsabwicklung (Stripe)</h2>
          <p>
            F&uuml;r die Zahlungsabwicklung nutzen wir <strong>Stripe Payments Europe, Ltd.</strong>,
            1 Grand Canal Street Lower, Dublin 2, Irland. Bei einem Kauf werden Zahlungsdaten
            (Kreditkartendaten, E-Mail-Adresse) direkt an Stripe &uuml;bermittelt und dort verarbeitet.
            Wir selbst speichern keine Kreditkartendaten.
          </p>
          <p>
            Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragserf&uuml;llung).
            {" "}
            <a href="https://stripe.com/de/privacy" target="_blank" rel="noopener noreferrer" className="underline">
              Stripe Datenschutzerkl&auml;rung
            </a>
          </p>
        </section>

        {/* 5. KI-Verarbeitung */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-gray-800">5. KI-gest&uuml;tzte Inhaltsgeneriung (Anthropic)</h2>
          <p>
            Zur Generierung der Arbeitsbl&auml;tter nutzen wir die API von <strong>Anthropic, PBC</strong>,
            548 Market St, San Francisco, CA 94104, USA. Dabei wird ausschlie&szlig;lich das
            eingegebene Thema, Fachgebiet und die Schulform an die API &uuml;bermittelt &mdash;
            keine personenbezogenen Daten der Nutzer.
          </p>
          <p>
            Anthropic speichert API-Anfragen nicht f&uuml;r Trainingszwecke.
            {" "}
            <a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer" className="underline">
              Anthropic Privacy Policy
            </a>
          </p>
        </section>

        {/* 6. Websuche */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-gray-800">6. Websuche (Brave Search)</h2>
          <p>
            F&uuml;r aktuelle Informationen nutzen wir die <strong>Brave Search API</strong>
            {" "}(Brave Software, Inc., San Francisco, USA). Dabei wird lediglich das Thema
            als Suchbegriff &uuml;bermittelt &mdash; keine personenbezogenen Daten.
          </p>
          <p>
            <a href="https://brave.com/privacy/browser/" target="_blank" rel="noopener noreferrer" className="underline">
              Brave Privacy Policy
            </a>
          </p>
        </section>

        {/* 7. Cookies */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-gray-800">7. Cookies &amp; Local Storage</h2>
          <p>
            Wir verwenden keine Tracking-Cookies. Die Website nutzt ausschlie&szlig;lich
            technisch notwendige Session-Daten (SessionStorage) zur Speicherung des
            Zugangscodes w&auml;hrend einer Sitzung. Diese werden beim Schlie&szlig;en des
            Browsers automatisch gel&ouml;scht.
          </p>
        </section>

        {/* 8. Betroffenenrechte */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-gray-800">8. Ihre Rechte</h2>
          <p>Sie haben jederzeit das Recht auf:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Auskunft &uuml;ber Ihre gespeicherten Daten (Art. 15 DSGVO)</li>
            <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
            <li>L&ouml;schung Ihrer Daten (Art. 17 DSGVO)</li>
            <li>Einschr&auml;nkung der Verarbeitung (Art. 18 DSGVO)</li>
            <li>Daten&uuml;bertragbarkeit (Art. 20 DSGVO)</li>
            <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
          </ul>
          <p>
            Wenden Sie sich hierzu an: klee@arbeitsblatt-generator.com
          </p>
        </section>

        {/* 9. Beschwerderecht */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-gray-800">9. Beschwerderecht bei einer Aufsichtsbeh&ouml;rde</h2>
          <p>
            Wenn Sie der Ansicht sind, dass die Verarbeitung Ihrer personenbezogenen Daten
            gegen die DSGVO verst&ouml;&szlig;t, haben Sie das Recht, sich bei einer
            Datenschutzaufsichtsbeh&ouml;rde zu beschweren.
          </p>
        </section>

        <footer className="pt-8 border-t border-gray-200 text-xs text-gray-400">
          Stand: M&auml;rz 2026
        </footer>
      </div>
    </main>
  );
}
