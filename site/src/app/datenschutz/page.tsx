import { generateSEO } from "@/lib/seo";
import siteData from "@/data/site.json";
import type { SiteConfig } from "@/data/types";

const site = siteData as SiteConfig;

export const metadata = generateSEO({
  title: "Datenschutzerklärung",
  description:
    "Datenschutzerklärung — Informationen zur Verarbeitung Ihrer personenbezogenen Daten durch Rund ums Haus Littawe.",
  path: "/datenschutz",
});

export default function DatenschutzPage() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-3xl mx-auto prose prose-charcoal">
        <h1 className="font-heading text-4xl font-bold mb-8">
          Datenschutzerklärung
        </h1>

        <h2 className="font-heading text-2xl font-semibold mt-8 mb-4">
          1. Verantwortlicher
        </h2>
        <p>
          {site.owner}
          <br />
          {site.company}
          <br />
          {site.address.street}, {site.address.zip} {site.address.city}
          <br />
          E-Mail: {site.email}
          <br />
          Telefon: {site.phone}
        </p>

        <h2 className="font-heading text-2xl font-semibold mt-8 mb-4">
          2. Hosting
        </h2>
        <p>
          Diese Website wird bei GitHub Pages (GitHub Inc. / Microsoft
          Corporation, USA) gehostet. Beim Besuch der Website werden
          automatisch Informationen (z.B. IP-Adresse, Zeitpunkt des Zugriffs)
          in Server-Log-Files gespeichert. Rechtsgrundlage: Art. 6 Abs. 1
          lit. f DSGVO.
        </p>

        <h2 className="font-heading text-2xl font-semibold mt-8 mb-4">
          3. Kontaktformular
        </h2>
        <p>
          Wenn Sie uns über das Kontaktformular kontaktieren, werden Ihre
          Angaben (Name, E-Mail, Nachricht) zur Bearbeitung Ihrer Anfrage
          verarbeitet. Die Daten werden über den Dienst FormSubmit.co
          übermittelt und per E-Mail an uns weitergeleitet. Rechtsgrundlage:
          Art. 6 Abs. 1 lit. b DSGVO.
        </p>

        <h2 className="font-heading text-2xl font-semibold mt-8 mb-4">
          4. Cookies
        </h2>
        <p>
          Diese Website verwendet ausschließlich technisch notwendige Cookies
          (Speicherung der Cookie-Einwilligung). Es werden keine
          Tracking-Cookies, Analyse-Tools oder Drittanbieter-Skripte
          eingesetzt.
        </p>

        <h2 className="font-heading text-2xl font-semibold mt-8 mb-4">
          5. Google Fonts
        </h2>
        <p>
          Die auf dieser Website verwendeten Schriftarten (Lora, Plus Jakarta
          Sans) werden lokal auf dem Server gehostet. Es erfolgt keine
          Verbindung zu Google-Servern.
        </p>

        <h2 className="font-heading text-2xl font-semibold mt-8 mb-4">
          6. SSL-Verschlüsselung
        </h2>
        <p>
          Diese Website nutzt aus Sicherheitsgründen eine
          SSL-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie an
          dem Schloss-Symbol in der Adresszeile Ihres Browsers.
        </p>

        <h2 className="font-heading text-2xl font-semibold mt-8 mb-4">
          7. Speicherdauer
        </h2>
        <p>
          Kontaktformular-Daten werden nach Abschluss der Bearbeitung Ihrer
          Anfrage gelöscht, sofern keine gesetzlichen Aufbewahrungspflichten
          bestehen. Server-Log-Files werden nach 30 Tagen automatisch
          gelöscht.
        </p>

        <h2 className="font-heading text-2xl font-semibold mt-8 mb-4">
          8. Ihre Rechte (Betroffenenrechte)
        </h2>
        <p>Sie haben gemäß der DSGVO folgende Rechte:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>
            <strong>Art. 15 — Auskunftsrecht:</strong> Sie können Auskunft
            über Ihre bei uns gespeicherten personenbezogenen Daten verlangen.
          </li>
          <li>
            <strong>Art. 16 — Recht auf Berichtigung:</strong> Sie können die
            Berichtigung unrichtiger Daten verlangen.
          </li>
          <li>
            <strong>Art. 17 — Recht auf Löschung:</strong> Sie können die
            Löschung Ihrer Daten verlangen, sofern keine gesetzlichen
            Aufbewahrungspflichten entgegenstehen.
          </li>
          <li>
            <strong>Art. 18 — Recht auf Einschränkung der Verarbeitung:</strong>{" "}
            Sie können die Einschränkung der Verarbeitung Ihrer Daten
            verlangen.
          </li>
          <li>
            <strong>Art. 20 — Recht auf Datenübertragbarkeit:</strong> Sie
            können verlangen, dass wir Ihnen Ihre Daten in einem
            maschinenlesbaren Format übermitteln.
          </li>
          <li>
            <strong>Art. 21 — Widerspruchsrecht:</strong> Sie können der
            Verarbeitung Ihrer Daten jederzeit widersprechen.
          </li>
          <li>
            <strong>Art. 7 Abs. 3 — Recht auf Widerruf:</strong> Eine
            erteilte Einwilligung können Sie jederzeit widerrufen.
          </li>
        </ul>

        <h2 className="font-heading text-2xl font-semibold mt-8 mb-4">
          9. Beschwerderecht (Art. 77 DSGVO)
        </h2>
        <p>
          Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu
          beschweren. Die für uns zuständige Aufsichtsbehörde ist:
        </p>
        <p className="mt-2">
          Die Landesbeauftragte für den Datenschutz Niedersachsen
          <br />
          Prinzenstraße 5
          <br />
          30159 Hannover
          <br />
          <a
            href="https://www.lfd.niedersachsen.de"
            target="_blank"
            rel="noopener noreferrer"
            className="text-copper hover:text-copper-light"
          >
            www.lfd.niedersachsen.de
          </a>
        </p>
      </div>
    </section>
  );
}
