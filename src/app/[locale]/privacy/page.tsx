import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

interface PrivacyPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PrivacyPageProps): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'it' ? 'Privacy Policy | TheViralRecipe' : 'Privacy Policy | TheViralRecipe',
    description:
      locale === 'it'
        ? 'Informativa sulla privacy di TheViralRecipe. Come raccogliamo, usiamo e proteggiamo i tuoi dati personali.'
        : 'TheViralRecipe Privacy Policy. How we collect, use and protect your personal data.',
    robots: { index: true, follow: true },
  };
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = await params;
  const isIT = locale === 'it';

  if (isIT) {
    return <PrivacyIT />;
  }
  return <PrivacyEN />;
}

// ── Versione italiana ─────────────────────────────────────────────────────────

function PrivacyIT() {
  return (
    <div className="bg-[#F8F5F0] min-h-screen py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8 sm:p-12">

          <header className="mb-10 pb-8 border-b border-stone-100">
            <div className="inline-flex items-center gap-2 text-xs font-medium text-brand-500 bg-brand-50 px-3 py-1 rounded-full mb-4" style={{ color: '#FF3A2D', backgroundColor: '#fff1f0' }}>
              Documento legale
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Privacy Policy
            </h1>
            <p className="text-gray-500 text-sm">
              Ultimo aggiornamento: <time dateTime="2025-04-01">1 aprile 2025</time>
            </p>
          </header>

          <div className="prose prose-stone prose-sm sm:prose-base max-w-none space-y-8">

            <Section title="1. Chi siamo">
              <p>
                TheViralRecipe.com è gestito da Matteo Pizzi, con sede in Italia. Puoi contattarci
                all&apos;indirizzo email{' '}
                <a href="mailto:brand@theviralrecipe.com" className="text-[#FF3A2D] hover:underline">
                  brand@theviralrecipe.com
                </a>{' '}
                per qualsiasi questione relativa alla privacy.
              </p>
              <p>
                Il presente documento descrive come TheViralRecipe.com raccoglie, utilizza e protegge
                le informazioni personali degli utenti in conformità al Regolamento UE 2016/679 (GDPR)
                e alla normativa italiana applicabile.
              </p>
            </Section>

            <Section title="2. Dati che raccogliamo">
              <p>Raccogliamo le seguenti categorie di dati:</p>
              <ul>
                <li>
                  <strong>Dati di registrazione:</strong> nome, indirizzo email, foto profilo (se
                  accedi con Google OAuth).
                </li>
                <li>
                  <strong>Dati di utilizzo:</strong> ricette visualizzate, votate o salvate; categorie
                  preferite; interazioni con i contenuti.
                </li>
                <li>
                  <strong>Dati di pagamento:</strong> per gli abbonamenti Pro, i dati della carta
                  vengono gestiti esclusivamente da Stripe Inc. Noi non conserviamo dati di pagamento
                  diretti.
                </li>
                <li>
                  <strong>Dati tecnici:</strong> indirizzo IP (anonimizzato), tipo di browser, sistema
                  operativo, pagine visitate, durata della sessione.
                </li>
                <li>
                  <strong>Cookie:</strong> vedi la nostra{' '}
                  <a href="/it/cookie" className="text-[#FF3A2D] hover:underline">
                    Cookie Policy
                  </a>{' '}
                  per i dettagli completi.
                </li>
              </ul>
            </Section>

            <Section title="3. Finalità del trattamento">
              <p>Utilizziamo i tuoi dati per le seguenti finalità:</p>
              <ul>
                <li>
                  <strong>Fornitura del servizio:</strong> gestione dell&apos;account, salvataggio
                  preferenze, personalizzazione dei contenuti (base giuridica: esecuzione del
                  contratto).
                </li>
                <li>
                  <strong>Miglioramento del sito:</strong> analisi del comportamento degli utenti
                  tramite Google Analytics 4 per ottimizzare l&apos;esperienza (base giuridica:
                  consenso).
                </li>
                <li>
                  <strong>Abbonamenti Pro:</strong> gestione dei pagamenti tramite Stripe, fatturazione
                  e gestione del recesso (base giuridica: esecuzione del contratto e obbligo legale).
                </li>
                <li>
                  <strong>Comunicazioni:</strong> invio di email transazionali (conferma registrazione,
                  reset password) e, con tuo consenso, newsletter (base giuridica: consenso o legittimo
                  interesse).
                </li>
                <li>
                  <strong>Pubblicità:</strong> con tuo consenso, mostriamo annunci personalizzati
                  tramite Google AdSense (base giuridica: consenso).
                </li>
                <li>
                  <strong>Sicurezza:</strong> prevenzione di frodi e abusi, protezione
                  dell&apos;integrità del servizio (base giuridica: legittimo interesse).
                </li>
              </ul>
            </Section>

            <Section title="4. Terze parti">
              <p>
                Per erogare il servizio ci avvaliamo dei seguenti fornitori terzi, ognuno dotato di
                proprie politiche privacy:
              </p>

              <div className="space-y-4 mt-4">
                <ThirdPartyItem
                  name="Supabase"
                  purpose="Database, autenticazione utenti e storage"
                  link="https://supabase.com/privacy"
                  location="Unione Europea (Frankfurt)"
                />
                <ThirdPartyItem
                  name="Vercel"
                  purpose="Hosting e CDN del sito web"
                  link="https://vercel.com/legal/privacy-policy"
                  location="Unione Europea / USA (Standard Contractual Clauses)"
                />
                <ThirdPartyItem
                  name="Google Analytics 4"
                  purpose="Analisi del traffico e comportamento utenti (solo con consenso)"
                  link="https://policies.google.com/privacy"
                  location="USA (Standard Contractual Clauses)"
                />
                <ThirdPartyItem
                  name="Google AdSense"
                  purpose="Pubblicità contestuale e personalizzata (solo con consenso marketing)"
                  link="https://policies.google.com/privacy"
                  location="USA (Standard Contractual Clauses)"
                />
                <ThirdPartyItem
                  name="Stripe"
                  purpose="Elaborazione pagamenti abbonamenti Pro"
                  link="https://stripe.com/it/privacy"
                  location="USA (Standard Contractual Clauses)"
                />
                <ThirdPartyItem
                  name="Replicate"
                  purpose="Generazione e ottimizzazione contenuti tramite AI"
                  link="https://replicate.com/privacy"
                  location="USA (Standard Contractual Clauses)"
                />
                <ThirdPartyItem
                  name="YouTube / Google"
                  purpose="Embed di video originali delle ricette"
                  link="https://policies.google.com/privacy"
                  location="USA (Standard Contractual Clauses)"
                />
              </div>

              <p className="mt-4 text-sm text-gray-500">
                Per i trasferimenti di dati verso paesi terzi (USA), utilizziamo le Clausole Contrattuali
                Standard approvate dalla Commissione Europea come garanzia di adeguata protezione.
              </p>
            </Section>

            <Section title="5. Conservazione dei dati">
              <ul>
                <li>
                  <strong>Dati dell&apos;account:</strong> conservati per tutta la durata del rapporto
                  contrattuale e per 2 anni dopo la cancellazione.
                </li>
                <li>
                  <strong>Dati analitici:</strong> 14 mesi (periodo standard Google Analytics).
                </li>
                <li>
                  <strong>Log tecnici:</strong> 90 giorni.
                </li>
                <li>
                  <strong>Dati fiscali/pagamenti:</strong> 10 anni come previsto dalla normativa italiana.
                </li>
              </ul>
            </Section>

            <Section title="6. I tuoi diritti GDPR">
              <p>
                In qualità di interessato, hai i seguenti diritti ai sensi del GDPR (artt. 15-22):
              </p>
              <ul>
                <li>
                  <strong>Diritto di accesso (art. 15):</strong> ottenere conferma del trattamento e
                  copia dei dati che ti riguardano.
                </li>
                <li>
                  <strong>Diritto di rettifica (art. 16):</strong> correggere dati inesatti o
                  incompleti.
                </li>
                <li>
                  <strong>Diritto alla cancellazione (art. 17):</strong> richiedere la cancellazione
                  dei tuoi dati (&quot;diritto all&apos;oblio&quot;), ove applicabile.
                </li>
                <li>
                  <strong>Diritto alla limitazione (art. 18):</strong> limitare il trattamento in
                  determinate circostanze.
                </li>
                <li>
                  <strong>Diritto alla portabilità (art. 20):</strong> ricevere i tuoi dati in formato
                  strutturato e leggibile da macchina.
                </li>
                <li>
                  <strong>Diritto di opposizione (art. 21):</strong> opporti al trattamento basato su
                  legittimo interesse o per finalità di marketing diretto.
                </li>
                <li>
                  <strong>Diritto di revocare il consenso:</strong> puoi revocare in qualsiasi momento
                  il consenso prestato, senza pregiudicare la liceità del trattamento precedente.
                </li>
              </ul>
              <p className="mt-4">
                Per esercitare i tuoi diritti, scrivi a{' '}
                <a href="mailto:brand@theviralrecipe.com" className="text-[#FF3A2D] hover:underline">
                  brand@theviralrecipe.com
                </a>
                . Risponderemo entro 30 giorni. Hai inoltre il diritto di proporre reclamo al Garante
                per la protezione dei dati personali (
                <a
                  href="https://www.garanteprivacy.it"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FF3A2D] hover:underline"
                >
                  garanteprivacy.it
                </a>
                ).
              </p>
            </Section>

            <Section title="7. Sicurezza">
              <p>
                Adottiamo misure tecniche e organizzative adeguate per proteggere i tuoi dati da
                accessi non autorizzati, perdita o divulgazione. Il traffico è cifrato tramite TLS,
                i database sono protetti da autenticazione e le chiavi API non sono mai esposte al
                client. In caso di violazione dei dati (data breach), daremo notifica alle autorità
                competenti entro 72 ore e, ove richiesto, agli interessati.
              </p>
            </Section>

            <Section title="8. Cookie">
              <p>
                Utilizziamo cookie tecnici necessari al funzionamento del sito e, con il tuo consenso,
                cookie analitici e di profilazione. Per informazioni dettagliate consulta la nostra{' '}
                <a href="/it/cookie" className="text-[#FF3A2D] hover:underline">
                  Cookie Policy
                </a>
                .
              </p>
            </Section>

            <Section title="9. Minori">
              <p>
                TheViralRecipe non è destinato a minori di 16 anni. Non raccogliamo consapevolmente
                dati personali di minori. Se sei un genitore e ritieni che tuo figlio ci abbia fornito
                dati, contattaci immediatamente.
              </p>
            </Section>

            <Section title="10. Modifiche alla Privacy Policy">
              <p>
                Ci riserviamo il diritto di aggiornare questa Privacy Policy. Le modifiche sostanziali
                saranno comunicate via email (se sei registrato) o tramite avviso prominente sul sito.
                La data di &quot;Ultimo aggiornamento&quot; in cima a questo documento indica quando è
                avvenuta l&apos;ultima modifica.
              </p>
            </Section>

            <Section title="11. Contatti">
              <p>
                Per qualsiasi domanda relativa alla presente Privacy Policy o al trattamento dei tuoi
                dati personali:
              </p>
              <address className="not-italic mt-3 text-sm text-gray-600 space-y-1">
                <p>
                  <strong>Email:</strong>{' '}
                  <a href="mailto:brand@theviralrecipe.com" className="text-[#FF3A2D] hover:underline">
                    brand@theviralrecipe.com
                  </a>
                </p>
                <p>
                  <strong>Sito:</strong>{' '}
                  <a
                    href="https://theviralrecipe.com"
                    className="text-[#FF3A2D] hover:underline"
                  >
                    theviralrecipe.com
                  </a>
                </p>
              </address>
            </Section>

          </div>
        </div>
      </div>
    </div>
  );
}

// ── Versione inglese ──────────────────────────────────────────────────────────

function PrivacyEN() {
  return (
    <div className="bg-[#F8F5F0] min-h-screen py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8 sm:p-12">

          <header className="mb-10 pb-8 border-b border-stone-100">
            <div className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full mb-4" style={{ color: '#FF3A2D', backgroundColor: '#fff1f0' }}>
              Legal document
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Privacy Policy
            </h1>
            <p className="text-gray-500 text-sm">
              Last updated: <time dateTime="2025-04-01">April 1, 2025</time>
            </p>
          </header>

          <div className="prose prose-stone prose-sm sm:prose-base max-w-none space-y-8">

            <Section title="1. Who we are">
              <p>
                TheViralRecipe.com is operated by Matteo Pizzi, based in Italy. You can reach us at{' '}
                <a href="mailto:brand@theviralrecipe.com" className="text-[#FF3A2D] hover:underline">
                  brand@theviralrecipe.com
                </a>{' '}
                for any privacy-related matter.
              </p>
              <p>
                This document describes how TheViralRecipe.com collects, uses and protects the
                personal information of its users in compliance with EU Regulation 2016/679 (GDPR)
                and applicable Italian law.
              </p>
            </Section>

            <Section title="2. Data we collect">
              <ul>
                <li>
                  <strong>Registration data:</strong> name, email address, profile photo (if you sign
                  in via Google OAuth).
                </li>
                <li>
                  <strong>Usage data:</strong> recipes viewed, voted or saved; preferred categories;
                  content interactions.
                </li>
                <li>
                  <strong>Payment data:</strong> for Pro subscriptions, card data is handled
                  exclusively by Stripe Inc. We do not store direct payment data.
                </li>
                <li>
                  <strong>Technical data:</strong> anonymized IP address, browser type, operating
                  system, pages visited, session duration.
                </li>
                <li>
                  <strong>Cookies:</strong> see our{' '}
                  <a href="/en/cookie" className="text-[#FF3A2D] hover:underline">
                    Cookie Policy
                  </a>{' '}
                  for full details.
                </li>
              </ul>
            </Section>

            <Section title="3. Purposes of processing">
              <ul>
                <li>
                  <strong>Service delivery:</strong> account management, saving preferences, content
                  personalization (legal basis: contract performance).
                </li>
                <li>
                  <strong>Site improvement:</strong> behavioral analysis via Google Analytics 4
                  (legal basis: consent).
                </li>
                <li>
                  <strong>Pro subscriptions:</strong> payment processing via Stripe, billing and
                  withdrawal management (legal basis: contract performance and legal obligation).
                </li>
                <li>
                  <strong>Communications:</strong> transactional emails and, with your consent,
                  newsletters (legal basis: consent or legitimate interest).
                </li>
                <li>
                  <strong>Advertising:</strong> with your consent, personalized ads via Google AdSense
                  (legal basis: consent).
                </li>
                <li>
                  <strong>Security:</strong> fraud and abuse prevention (legal basis: legitimate
                  interest).
                </li>
              </ul>
            </Section>

            <Section title="4. Third parties">
              <div className="space-y-4 mt-4">
                <ThirdPartyItem
                  name="Supabase"
                  purpose="Database, user authentication and storage"
                  link="https://supabase.com/privacy"
                  location="European Union (Frankfurt)"
                />
                <ThirdPartyItem
                  name="Vercel"
                  purpose="Website hosting and CDN"
                  link="https://vercel.com/legal/privacy-policy"
                  location="EU / USA (Standard Contractual Clauses)"
                />
                <ThirdPartyItem
                  name="Google Analytics 4"
                  purpose="Traffic and user behavior analysis (consent only)"
                  link="https://policies.google.com/privacy"
                  location="USA (Standard Contractual Clauses)"
                />
                <ThirdPartyItem
                  name="Google AdSense"
                  purpose="Contextual and personalized advertising (marketing consent only)"
                  link="https://policies.google.com/privacy"
                  location="USA (Standard Contractual Clauses)"
                />
                <ThirdPartyItem
                  name="Stripe"
                  purpose="Pro subscription payment processing"
                  link="https://stripe.com/privacy"
                  location="USA (Standard Contractual Clauses)"
                />
                <ThirdPartyItem
                  name="Replicate"
                  purpose="AI-powered content generation and optimization"
                  link="https://replicate.com/privacy"
                  location="USA (Standard Contractual Clauses)"
                />
                <ThirdPartyItem
                  name="YouTube / Google"
                  purpose="Embedding original recipe videos"
                  link="https://policies.google.com/privacy"
                  location="USA (Standard Contractual Clauses)"
                />
              </div>
            </Section>

            <Section title="5. Data retention">
              <ul>
                <li><strong>Account data:</strong> retained for the duration of the contract and 2 years after deletion.</li>
                <li><strong>Analytics data:</strong> 14 months (Google Analytics standard period).</li>
                <li><strong>Technical logs:</strong> 90 days.</li>
                <li><strong>Tax/payment data:</strong> 10 years as required by Italian law.</li>
              </ul>
            </Section>

            <Section title="6. Your GDPR rights">
              <ul>
                <li><strong>Right of access (Art. 15):</strong> obtain confirmation of processing and a copy of your data.</li>
                <li><strong>Right to rectification (Art. 16):</strong> correct inaccurate or incomplete data.</li>
                <li><strong>Right to erasure (Art. 17):</strong> request deletion of your data (&quot;right to be forgotten&quot;), where applicable.</li>
                <li><strong>Right to restriction (Art. 18):</strong> restrict processing under certain circumstances.</li>
                <li><strong>Right to data portability (Art. 20):</strong> receive your data in a structured, machine-readable format.</li>
                <li><strong>Right to object (Art. 21):</strong> object to processing based on legitimate interest or for direct marketing.</li>
                <li><strong>Right to withdraw consent:</strong> you may withdraw consent at any time without affecting prior lawful processing.</li>
              </ul>
              <p className="mt-4">
                To exercise your rights, write to{' '}
                <a href="mailto:brand@theviralrecipe.com" className="text-[#FF3A2D] hover:underline">
                  brand@theviralrecipe.com
                </a>
                . We will respond within 30 days. You also have the right to lodge a complaint with the
                Italian Data Protection Authority (
                <a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer" className="text-[#FF3A2D] hover:underline">
                  garanteprivacy.it
                </a>
                ).
              </p>
            </Section>

            <Section title="7. Security">
              <p>
                We implement appropriate technical and organizational measures to protect your data
                from unauthorized access, loss or disclosure. Traffic is encrypted via TLS, databases
                are protected by authentication, and API keys are never exposed to the client.
              </p>
            </Section>

            <Section title="8. Cookies">
              <p>
                We use technically necessary cookies and, with your consent, analytics and profiling
                cookies. For detailed information, see our{' '}
                <a href="/en/cookie" className="text-[#FF3A2D] hover:underline">Cookie Policy</a>.
              </p>
            </Section>

            <Section title="9. Minors">
              <p>
                TheViralRecipe is not intended for users under 16 years of age. We do not knowingly
                collect personal data from minors. If you are a parent and believe your child has
                provided us with data, please contact us immediately.
              </p>
            </Section>

            <Section title="10. Changes">
              <p>
                We reserve the right to update this Privacy Policy. Material changes will be
                communicated via email (if you are registered) or via a prominent notice on the site.
              </p>
            </Section>

            <Section title="11. Contact">
              <address className="not-italic mt-3 text-sm text-gray-600 space-y-1">
                <p>
                  <strong>Email:</strong>{' '}
                  <a href="mailto:brand@theviralrecipe.com" className="text-[#FF3A2D] hover:underline">
                    brand@theviralrecipe.com
                  </a>
                </p>
                <p>
                  <strong>Website:</strong>{' '}
                  <a href="https://theviralrecipe.com" className="text-[#FF3A2D] hover:underline">
                    theviralrecipe.com
                  </a>
                </p>
              </address>
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

function ThirdPartyItem({
  name,
  purpose,
  link,
  location,
}: {
  name: string;
  purpose: string;
  link: string;
  location: string;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 p-3 rounded-xl bg-stone-50 border border-stone-100">
      <span className="font-semibold text-gray-800 text-sm sm:w-36 flex-shrink-0">{name}</span>
      <div className="flex-1 text-sm text-gray-600">
        <span>{purpose}</span>
        <span className="block text-xs text-gray-400 mt-0.5">{location}</span>
      </div>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-[#FF3A2D] hover:underline flex-shrink-0"
      >
        Privacy Policy →
      </a>
    </div>
  );
}
