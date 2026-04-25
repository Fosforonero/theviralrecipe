import type { Metadata } from 'next';

interface CookiePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: CookiePageProps): Promise<Metadata> {
  const { locale } = await params;
  const isIT = locale === 'it';
  return {
    title: isIT ? 'Cookie Policy | TheViralRecipe' : 'Cookie Policy | TheViralRecipe',
    description: isIT
      ? 'Cookie Policy di TheViralRecipe.com. Scopri quali cookie usiamo, a cosa servono e come gestirli.'
      : 'TheViralRecipe.com Cookie Policy. Learn which cookies we use, what they do and how to manage them.',
    robots: { index: true, follow: true },
  };
}

export default async function CookiePolicyPage({ params }: CookiePageProps) {
  const { locale } = await params;
  const isIT = locale === 'it';

  if (isIT) {
    return <CookiePolicyIT />;
  }
  return <CookiePolicyEN />;
}

// ── Versione italiana ─────────────────────────────────────────────────────────

function CookiePolicyIT() {
  return (
    <div className="bg-[#F8F5F0] min-h-screen py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8 sm:p-12" id="cookie-policy">

          <header className="mb-10 pb-8 border-b border-stone-100">
            <div className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full mb-4" style={{ color: '#FF3A2D', backgroundColor: '#fff1f0' }}>
              Documento legale
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Cookie Policy
            </h1>
            <p className="text-gray-500 text-sm">
              Ultimo aggiornamento: <time dateTime="2025-04-01">1 aprile 2025</time>
            </p>
          </header>

          <div className="prose prose-stone prose-sm sm:prose-base max-w-none space-y-8">

            <Section title="Cosa sono i cookie">
              <p>
                I cookie sono piccoli file di testo che i siti web salvano nel tuo browser quando li
                visiti. Vengono usati per far funzionare il sito correttamente, ricordare le tue
                preferenze, analizzare il traffico e mostrare annunci pertinenti.
              </p>
              <p>
                Ai sensi del D.Lgs. 69/2012 e del GDPR, i cookie che non sono strettamente necessari
                al funzionamento tecnico del sito richiedono il tuo consenso preventivo.
              </p>
            </Section>

            <Section title="Cookie che utilizziamo">
              <p className="font-semibold text-gray-800 mb-4">1. Cookie essenziali (sempre attivi)</p>
              <p>
                Questi cookie sono necessari per il funzionamento base del sito. Non possono essere
                disattivati perché senza di essi il sito non funzionerebbe correttamente.
              </p>

              <div className="overflow-x-auto mt-4">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-stone-50">
                      <th className="text-left p-3 border border-stone-200 font-semibold text-gray-700">Nome</th>
                      <th className="text-left p-3 border border-stone-200 font-semibold text-gray-700">Fornitore</th>
                      <th className="text-left p-3 border border-stone-200 font-semibold text-gray-700">Scopo</th>
                      <th className="text-left p-3 border border-stone-200 font-semibold text-gray-700">Durata</th>
                    </tr>
                  </thead>
                  <tbody>
                    <CookieRow
                      name="sb-*"
                      provider="Supabase"
                      purpose="Autenticazione utente, gestione sessione, token JWT"
                      duration="7 giorni (sessione)"
                    />
                    <CookieRow
                      name="cookie_consent"
                      provider="TheViralRecipe"
                      purpose="Memorizza la scelta del consenso cookie dell'utente"
                      duration="1 anno"
                    />
                    <CookieRow
                      name="cookie_preferences"
                      provider="TheViralRecipe"
                      purpose="Memorizza le preferenze dettagliate sui cookie (analytics/marketing)"
                      duration="1 anno"
                    />
                    <CookieRow
                      name="NEXT_LOCALE"
                      provider="TheViralRecipe"
                      purpose="Memorizza la preferenza di lingua (IT/EN)"
                      duration="1 anno"
                    />
                  </tbody>
                </table>
              </div>

              <p className="font-semibold text-gray-800 mt-8 mb-4">2. Cookie analitici (richiede consenso)</p>
              <p>
                Utilizziamo Google Analytics 4 per capire come gli utenti interagiscono con il sito,
                quali pagine sono più visitate e da dove provengono le visite. Questi dati ci aiutano
                a migliorare l&apos;esperienza degli utenti. Gli IP sono anonimizzati.
              </p>

              <div className="overflow-x-auto mt-4">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-stone-50">
                      <th className="text-left p-3 border border-stone-200 font-semibold text-gray-700">Nome</th>
                      <th className="text-left p-3 border border-stone-200 font-semibold text-gray-700">Fornitore</th>
                      <th className="text-left p-3 border border-stone-200 font-semibold text-gray-700">Scopo</th>
                      <th className="text-left p-3 border border-stone-200 font-semibold text-gray-700">Durata</th>
                    </tr>
                  </thead>
                  <tbody>
                    <CookieRow
                      name="_ga"
                      provider="Google Analytics"
                      purpose="Identifica gli utenti univoci e registra le sessioni"
                      duration="2 anni"
                    />
                    <CookieRow
                      name="_ga_*"
                      provider="Google Analytics"
                      purpose="Mantiene lo stato della sessione per Google Analytics 4"
                      duration="2 anni"
                    />
                    <CookieRow
                      name="_gid"
                      provider="Google Analytics"
                      purpose="Distingue gli utenti"
                      duration="24 ore"
                    />
                    <CookieRow
                      name="_gat"
                      provider="Google Analytics"
                      purpose="Limita la frequenza delle richieste"
                      duration="1 minuto"
                    />
                  </tbody>
                </table>
              </div>

              <p className="font-semibold text-gray-800 mt-8 mb-4">3. Cookie di marketing/pubblicità (richiede consenso)</p>
              <p>
                Utilizziamo Google AdSense per mostrare annunci pubblicitari agli utenti non Pro.
                Questi cookie permettono a Google di personalizzare gli annunci in base agli interessi
                dell&apos;utente. Vengono attivati solo con consenso esplicito al marketing.
              </p>

              <div className="overflow-x-auto mt-4">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-stone-50">
                      <th className="text-left p-3 border border-stone-200 font-semibold text-gray-700">Nome</th>
                      <th className="text-left p-3 border border-stone-200 font-semibold text-gray-700">Fornitore</th>
                      <th className="text-left p-3 border border-stone-200 font-semibold text-gray-700">Scopo</th>
                      <th className="text-left p-3 border border-stone-200 font-semibold text-gray-700">Durata</th>
                    </tr>
                  </thead>
                  <tbody>
                    <CookieRow
                      name="IDE"
                      provider="Google DoubleClick"
                      purpose="Tracciamento per annunci personalizzati"
                      duration="1 anno"
                    />
                    <CookieRow
                      name="DSID"
                      provider="Google DoubleClick"
                      purpose="Identifica gli utenti su dispositivi e siti"
                      duration="2 settimane"
                    />
                    <CookieRow
                      name="NID"
                      provider="Google"
                      purpose="Registra le preferenze dell'utente per gli annunci Google"
                      duration="6 mesi"
                    />
                  </tbody>
                </table>
              </div>
            </Section>

            <Section title="Cookie di terze parti incorporati">
              <p>
                Il Sito incorpora contenuti di terze parti (es. video YouTube) che possono impostare
                i propri cookie. Ti consigliamo di leggere le rispettive privacy policy:
              </p>
              <ul>
                <li>
                  <strong>YouTube:</strong>{' '}
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#FF3A2D] hover:underline"
                  >
                    policies.google.com/privacy
                  </a>{' '}
                  — I video YouTube possono impostare cookie per statistiche e funzionalità. Usiamo
                  youtube-nocookie.com per minimizzare il tracking.
                </li>
              </ul>
            </Section>

            <Section title="Come gestire i cookie">
              <p>
                Puoi gestire le tue preferenze sui cookie in qualsiasi momento nei seguenti modi:
              </p>
              <ul>
                <li>
                  <strong>Banner cookie del sito:</strong> al primo accesso puoi scegliere quali
                  cookie accettare. Puoi modificare le tue preferenze in qualsiasi momento dal footer
                  del sito.
                </li>
                <li>
                  <strong>Impostazioni del browser:</strong> puoi configurare il tuo browser per
                  bloccare o eliminare i cookie. Tieni presente che disabilitare i cookie essenziali
                  potrebbe compromettere il funzionamento del sito.
                  <div className="mt-2 space-y-1 text-xs text-gray-500">
                    <p>
                      Chrome: Impostazioni → Privacy e sicurezza → Cookie e altri dati dei siti
                    </p>
                    <p>Firefox: Opzioni → Privacy e sicurezza → Cookie e dati dei siti</p>
                    <p>Safari: Preferenze → Privacy → Gestisci dati dei siti web</p>
                    <p>Edge: Impostazioni → Cookie e autorizzazioni sito</p>
                  </div>
                </li>
                <li>
                  <strong>Google Analytics Opt-out:</strong> puoi installare il{' '}
                  <a
                    href="https://tools.google.com/dlpage/gaoptout"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#FF3A2D] hover:underline"
                  >
                    componente aggiuntivo del browser Google Analytics
                  </a>{' '}
                  per disabilitare il tracciamento di GA su tutti i siti.
                </li>
                <li>
                  <strong>Google AdSense / pubblicità:</strong> puoi gestire le tue preferenze
                  pubblicitarie su{' '}
                  <a
                    href="https://adssettings.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#FF3A2D] hover:underline"
                  >
                    adssettings.google.com
                  </a>
                  .
                </li>
              </ul>
            </Section>

            <Section title="Aggiornamenti alla Cookie Policy">
              <p>
                Potremmo aggiornare questa Cookie Policy per riflettere cambiamenti nel servizio o
                nella normativa applicabile. La data di &quot;Ultimo aggiornamento&quot; in cima a
                questo documento indica quando è avvenuta l&apos;ultima modifica.
              </p>
            </Section>

            <Section title="Informazioni aggiuntive">
              <p>
                Per ulteriori informazioni sul trattamento dei dati personali, consulta la nostra{' '}
                <a href="/it/privacy" className="text-[#FF3A2D] hover:underline">
                  Privacy Policy
                </a>
                .
              </p>
              <p>
                Per domande su questa Cookie Policy, contattaci a{' '}
                <a href="mailto:brand@theviralrecipe.com" className="text-[#FF3A2D] hover:underline">
                  brand@theviralrecipe.com
                </a>
                .
              </p>
            </Section>

          </div>
        </div>
      </div>
    </div>
  );
}

// ── Versione inglese ──────────────────────────────────────────────────────────

function CookiePolicyEN() {
  return (
    <div className="bg-[#F8F5F0] min-h-screen py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8 sm:p-12" id="cookie-policy">

          <header className="mb-10 pb-8 border-b border-stone-100">
            <div className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full mb-4" style={{ color: '#FF3A2D', backgroundColor: '#fff1f0' }}>
              Legal document
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Cookie Policy
            </h1>
            <p className="text-gray-500 text-sm">
              Last updated: <time dateTime="2025-04-01">April 1, 2025</time>
            </p>
          </header>

          <div className="prose prose-stone prose-sm sm:prose-base max-w-none space-y-8">

            <Section title="What are cookies">
              <p>
                Cookies are small text files that websites save to your browser when you visit them.
                They are used to make the site work correctly, remember your preferences, analyze
                traffic, and show relevant ads.
              </p>
              <p>
                Under GDPR and ePrivacy rules, cookies that are not strictly necessary for the
                technical operation of the site require your prior consent.
              </p>
            </Section>

            <Section title="Cookies we use">
              <p className="font-semibold text-gray-800 mb-4">1. Essential cookies (always active)</p>
              <p>
                These cookies are necessary for the basic operation of the site and cannot be
                disabled.
              </p>

              <div className="overflow-x-auto mt-4">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-stone-50">
                      <th className="text-left p-3 border border-stone-200 font-semibold text-gray-700">Name</th>
                      <th className="text-left p-3 border border-stone-200 font-semibold text-gray-700">Provider</th>
                      <th className="text-left p-3 border border-stone-200 font-semibold text-gray-700">Purpose</th>
                      <th className="text-left p-3 border border-stone-200 font-semibold text-gray-700">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    <CookieRow
                      name="sb-*"
                      provider="Supabase"
                      purpose="User authentication, session management, JWT token"
                      duration="7 days (session)"
                    />
                    <CookieRow
                      name="cookie_consent"
                      provider="TheViralRecipe"
                      purpose="Stores the user's cookie consent choice"
                      duration="1 year"
                    />
                    <CookieRow
                      name="cookie_preferences"
                      provider="TheViralRecipe"
                      purpose="Stores detailed cookie preferences (analytics/marketing)"
                      duration="1 year"
                    />
                    <CookieRow
                      name="NEXT_LOCALE"
                      provider="TheViralRecipe"
                      purpose="Stores language preference (IT/EN)"
                      duration="1 year"
                    />
                  </tbody>
                </table>
              </div>

              <p className="font-semibold text-gray-800 mt-8 mb-4">2. Analytics cookies (requires consent)</p>
              <p>
                We use Google Analytics 4 to understand how users interact with the site. IPs are
                anonymized.
              </p>

              <div className="overflow-x-auto mt-4">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-stone-50">
                      <th className="text-left p-3 border border-stone-200 font-semibold text-gray-700">Name</th>
                      <th className="text-left p-3 border border-stone-200 font-semibold text-gray-700">Provider</th>
                      <th className="text-left p-3 border border-stone-200 font-semibold text-gray-700">Purpose</th>
                      <th className="text-left p-3 border border-stone-200 font-semibold text-gray-700">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    <CookieRow
                      name="_ga"
                      provider="Google Analytics"
                      purpose="Identifies unique users and tracks sessions"
                      duration="2 years"
                    />
                    <CookieRow
                      name="_ga_*"
                      provider="Google Analytics"
                      purpose="Maintains session state for Google Analytics 4"
                      duration="2 years"
                    />
                    <CookieRow
                      name="_gid"
                      provider="Google Analytics"
                      purpose="Distinguishes users"
                      duration="24 hours"
                    />
                    <CookieRow
                      name="_gat"
                      provider="Google Analytics"
                      purpose="Throttles request rate"
                      duration="1 minute"
                    />
                  </tbody>
                </table>
              </div>

              <p className="font-semibold text-gray-800 mt-8 mb-4">3. Marketing/advertising cookies (requires consent)</p>
              <p>
                We use Google AdSense to show ads to non-Pro users. These cookies are activated only
                with explicit marketing consent.
              </p>

              <div className="overflow-x-auto mt-4">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-stone-50">
                      <th className="text-left p-3 border border-stone-200 font-semibold text-gray-700">Name</th>
                      <th className="text-left p-3 border border-stone-200 font-semibold text-gray-700">Provider</th>
                      <th className="text-left p-3 border border-stone-200 font-semibold text-gray-700">Purpose</th>
                      <th className="text-left p-3 border border-stone-200 font-semibold text-gray-700">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    <CookieRow
                      name="IDE"
                      provider="Google DoubleClick"
                      purpose="Tracking for personalized ads"
                      duration="1 year"
                    />
                    <CookieRow
                      name="DSID"
                      provider="Google DoubleClick"
                      purpose="Identifies users across devices and sites"
                      duration="2 weeks"
                    />
                    <CookieRow
                      name="NID"
                      provider="Google"
                      purpose="Records user preferences for Google ads"
                      duration="6 months"
                    />
                  </tbody>
                </table>
              </div>
            </Section>

            <Section title="Third-party embedded cookies">
              <p>
                The Site embeds third-party content (e.g. YouTube videos) that may set their own
                cookies. We recommend reading their respective privacy policies:
              </p>
              <ul>
                <li>
                  <strong>YouTube:</strong>{' '}
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#FF3A2D] hover:underline"
                  >
                    policies.google.com/privacy
                  </a>{' '}
                  — We use youtube-nocookie.com to minimize tracking.
                </li>
              </ul>
            </Section>

            <Section title="How to manage cookies">
              <ul>
                <li>
                  <strong>Site cookie banner:</strong> on first visit you can choose which cookies to
                  accept. You can update your preferences at any time from the site footer.
                </li>
                <li>
                  <strong>Browser settings:</strong> you can configure your browser to block or
                  delete cookies. Note that disabling essential cookies may affect site functionality.
                </li>
                <li>
                  <strong>Google Analytics Opt-out:</strong> install the{' '}
                  <a
                    href="https://tools.google.com/dlpage/gaoptout"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#FF3A2D] hover:underline"
                  >
                    Google Analytics opt-out browser add-on
                  </a>
                  .
                </li>
                <li>
                  <strong>Google AdSense:</strong> manage your ad preferences at{' '}
                  <a
                    href="https://adssettings.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#FF3A2D] hover:underline"
                  >
                    adssettings.google.com
                  </a>
                  .
                </li>
              </ul>
            </Section>

            <Section title="Additional information">
              <p>
                For more information on personal data processing, see our{' '}
                <a href="/en/privacy" className="text-[#FF3A2D] hover:underline">
                  Privacy Policy
                </a>
                .
              </p>
              <p>
                For questions about this Cookie Policy, contact us at{' '}
                <a href="mailto:brand@theviralrecipe.com" className="text-[#FF3A2D] hover:underline">
                  brand@theviralrecipe.com
                </a>
                .
              </p>
            </Section>

          </div>
        </div>
      </div>
    </div>
  );
}

// ── Shared subcomponents ──────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 pb-2 border-b border-stone-100">
        {title}
      </h2>
      <div className="text-gray-600 text-sm sm:text-base leading-relaxed space-y-3">
        {children}
      </div>
    </section>
  );
}

function CookieRow({
  name,
  provider,
  purpose,
  duration,
}: {
  name: string;
  provider: string;
  purpose: string;
  duration: string;
}) {
  return (
    <tr className="even:bg-stone-50">
      <td className="p-3 border border-stone-200 font-mono text-xs text-gray-700 font-medium">
        {name}
      </td>
      <td className="p-3 border border-stone-200 text-xs text-gray-600">{provider}</td>
      <td className="p-3 border border-stone-200 text-xs text-gray-600">{purpose}</td>
      <td className="p-3 border border-stone-200 text-xs text-gray-600 whitespace-nowrap">{duration}</td>
    </tr>
  );
}
