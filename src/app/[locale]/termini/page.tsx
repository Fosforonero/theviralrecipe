import type { Metadata } from 'next';

interface TerminiPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: TerminiPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isIT = locale === 'it';
  return {
    title: isIT
      ? 'Termini e Condizioni | TheViralRecipe'
      : 'Terms and Conditions | TheViralRecipe',
    description: isIT
      ? 'Termini e condizioni di utilizzo di TheViralRecipe.com. Leggi le regole per usare il sito e gli abbonamenti Pro.'
      : 'Terms and conditions of use for TheViralRecipe.com. Read the rules for using the site and Pro subscriptions.',
    robots: { index: true, follow: true },
  };
}

export default async function TerminiPage({ params }: TerminiPageProps) {
  const { locale } = await params;
  const isIT = locale === 'it';

  if (isIT) {
    return <TerminiIT />;
  }
  return <TermsEN />;
}

// ── Versione italiana ─────────────────────────────────────────────────────────

function TerminiIT() {
  return (
    <div className="bg-[#F8F5F0] min-h-screen py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8 sm:p-12">

          <header className="mb-10 pb-8 border-b border-stone-100">
            <div className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full mb-4" style={{ color: '#FF3A2D', backgroundColor: '#fff1f0' }}>
              Documento legale
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Termini e Condizioni di Utilizzo
            </h1>
            <p className="text-gray-500 text-sm">
              Ultimo aggiornamento: <time dateTime="2025-04-01">1 aprile 2025</time>
            </p>
          </header>

          <div className="prose prose-stone prose-sm sm:prose-base max-w-none space-y-8">

            <Section title="1. Accettazione dei termini">
              <p>
                Utilizzando TheViralRecipe.com (&quot;il Sito&quot;), accetti integralmente i presenti
                Termini e Condizioni. Se non accetti, ti preghiamo di non utilizzare il Sito. L&apos;utilizzo
                continuato dopo eventuali modifiche costituisce accettazione delle stesse.
              </p>
              <p>
                Il Sito è gestito da Matteo Pizzi (di seguito &quot;noi&quot;, &quot;il Gestore&quot;).
                Per qualsiasi comunicazione: {' '}
                <a href="mailto:brand@theviralrecipe.com" className="text-[#FF3A2D] hover:underline">
                  brand@theviralrecipe.com
                </a>
              </p>
            </Section>

            <Section title="2. Descrizione del servizio">
              <p>
                TheViralRecipe.com è una piattaforma che aggrega, organizza e presenta ricette virali
                tratte da social media (TikTok, Instagram, YouTube). Il contenuto delle ricette
                originali appartiene ai rispettivi creator; noi forniamo una rielaborazione
                strutturata e ottimizzata, citando sempre la fonte originale.
              </p>
              <p>
                Il Sito offre un piano gratuito con funzionalità di base e un piano Pro a pagamento
                con funzionalità avanzate. Ci riserviamo il diritto di modificare, sospendere o
                interrompere qualsiasi funzionalità in qualsiasi momento.
              </p>
            </Section>

            <Section title="3. Contenuti generati con AI">
              <p>
                Alcune ricette, descrizioni, immagini o testi presenti sul Sito possono essere stati
                generati o ottimizzati tramite intelligenza artificiale (in particolare tramite
                Replicate). In tal caso:
              </p>
              <ul>
                <li>
                  Il contenuto è fornito a scopo informativo e può contenere imprecisioni.
                </li>
                <li>
                  Non garantiamo l&apos;accuratezza nutrizionale, la completezza delle istruzioni o
                  l&apos;adeguatezza per persone con allergie o condizioni mediche specifiche.
                </li>
                <li>
                  È responsabilità dell&apos;utente verificare le informazioni prima di mettere in
                  pratica qualsiasi ricetta, soprattutto in caso di allergie, intolleranze o
                  patologie.
                </li>
                <li>
                  I valori nutrizionali mostrati sono stime e non devono essere considerati come
                  consulenza medica o dietetica.
                </li>
              </ul>
            </Section>

            <Section title="4. Account utente">
              <p>
                Per accedere a determinate funzionalità è necessario creare un account. L&apos;utente
                è responsabile di:
              </p>
              <ul>
                <li>Mantenere riservate le credenziali di accesso.</li>
                <li>
                  Fornire informazioni veritiere e aggiornate al momento della registrazione.
                </li>
                <li>
                  Non condividere l&apos;account con terzi.
                </li>
                <li>
                  Comunicarci immediatamente qualsiasi accesso non autorizzato al proprio account.
                </li>
              </ul>
              <p>
                Ci riserviamo il diritto di sospendere o cancellare account in caso di violazione
                dei presenti Termini.
              </p>
            </Section>

            <Section title="5. Abbonamento Pro">
              <p>
                Il piano Pro è disponibile al prezzo indicato nella pagina dedicata (attualmente
                4,99€/mese). L&apos;abbonamento si rinnova automaticamente ogni mese fino alla
                cancellazione esplicita da parte dell&apos;utente.
              </p>
              <p>I pagamenti sono elaborati da Stripe Inc. in modo sicuro. Il Gestore non conserva i dati della carta di pagamento.</p>
              <p>
                <strong>Diritto di recesso (consumatori UE):</strong> ai sensi del D.Lgs. 206/2005
                (Codice del Consumo), hai diritto di recedere dall&apos;abbonamento entro 14 giorni
                dalla sottoscrizione, senza fornire alcuna motivazione. Il diritto di recesso si
                applica ai servizi digitali secondo le condizioni previste dalla normativa vigente.
                Per esercitare il recesso, contattaci a{' '}
                <a href="mailto:brand@theviralrecipe.com" className="text-[#FF3A2D] hover:underline">
                  brand@theviralrecipe.com
                </a>{' '}
                entro 14 giorni dall&apos;attivazione.
              </p>
              <p>
                Il rimborso eventualmente dovuto sarà effettuato entro 14 giorni dalla ricezione
                della richiesta di recesso, tramite lo stesso metodo di pagamento utilizzato per
                l&apos;acquisto.
              </p>
            </Section>

            <Section title="6. Condotta dell'utente">
              <p>Utilizzando il Sito, ti impegni a non:</p>
              <ul>
                <li>Violare leggi o regolamenti applicabili.</li>
                <li>Pubblicare o trasmettere contenuti illegali, offensivi, diffamatori o che violino i diritti di terzi.</li>
                <li>Tentare di accedere non autorizzato a sistemi o dati.</li>
                <li>Utilizzare bot, scraper o strumenti automatizzati per raccogliere contenuti senza autorizzazione scritta.</li>
                <li>Interferire con il normale funzionamento del Sito.</li>
                <li>Creare account multipli per aggirare limitazioni o sospensioni.</li>
              </ul>
            </Section>

            <Section title="7. Proprietà intellettuale">
              <p>
                Il design, il codice, il logo e i contenuti originali di TheViralRecipe.com sono di
                proprietà del Gestore e protetti dalle leggi sul diritto d&apos;autore. È vietata la
                riproduzione, distribuzione o modifica senza autorizzazione scritta.
              </p>
              <p>
                Le ricette originali e i video appartengono ai rispettivi creator. Noi le
                riproduciamo citando la fonte; se sei titolare di un contenuto e ritieni che venga
                utilizzato in modo non appropriato, contattaci per una rimozione rapida.
              </p>
            </Section>

            <Section title="8. Limitazione di responsabilità">
              <p>
                Nella misura massima consentita dalla legge applicabile:
              </p>
              <ul>
                <li>Il Sito è fornito &quot;così come è&quot; senza garanzie di alcun tipo.</li>
                <li>
                  Non siamo responsabili per danni diretti, indiretti, incidentali o consequenziali
                  derivanti dall&apos;uso del Sito o dall&apos;impossibilità di accedervi.
                </li>
                <li>
                  Non garantiamo che il Sito sia sempre disponibile, privo di errori o sicuro da
                  virus.
                </li>
                <li>
                  I link a siti terzi sono forniti per comodità; non siamo responsabili del loro
                  contenuto.
                </li>
              </ul>
            </Section>

            <Section title="9. Pubblicità">
              <p>
                Il Sito può mostrare pubblicità tramite Google AdSense. Gli annunci sono mostrati
                solo agli utenti che hanno prestato il consenso ai cookie di marketing. Gli utenti
                Pro non visualizzano pubblicità.
              </p>
            </Section>

            <Section title="10. Legge applicabile e foro competente">
              <p>
                I presenti Termini sono regolati dalla legge italiana. Per qualsiasi controversia
                derivante dall&apos;utilizzo del Sito, il foro competente è quello del luogo di
                residenza dell&apos;utente consumatore, come previsto dall&apos;art. 66-bis del Codice
                del Consumo. Per gli utenti professionisti, il foro esclusivo è quello di Milano.
              </p>
            </Section>

            <Section title="11. Modifiche ai termini">
              <p>
                Ci riserviamo il diritto di modificare i presenti Termini in qualsiasi momento. Le
                modifiche saranno comunicate via email agli utenti registrati e/o tramite avviso sul
                Sito con almeno 15 giorni di preavviso per modifiche sostanziali. L&apos;uso continuato
                del Sito dopo la comunicazione delle modifiche costituisce accettazione delle stesse.
              </p>
            </Section>

            <Section title="12. Separabilità">
              <p>
                Se una qualsiasi disposizione dei presenti Termini fosse ritenuta non valida o
                inapplicabile, le restanti disposizioni rimarranno in pieno vigore ed effetto.
              </p>
            </Section>

          </div>
        </div>
      </div>
    </div>
  );
}

// ── Versione inglese ──────────────────────────────────────────────────────────

function TermsEN() {
  return (
    <div className="bg-[#F8F5F0] min-h-screen py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8 sm:p-12">

          <header className="mb-10 pb-8 border-b border-stone-100">
            <div className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full mb-4" style={{ color: '#FF3A2D', backgroundColor: '#fff1f0' }}>
              Legal document
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Terms and Conditions
            </h1>
            <p className="text-gray-500 text-sm">
              Last updated: <time dateTime="2025-04-01">April 1, 2025</time>
            </p>
          </header>

          <div className="prose prose-stone prose-sm sm:prose-base max-w-none space-y-8">

            <Section title="1. Acceptance of terms">
              <p>
                By using TheViralRecipe.com (&quot;the Site&quot;), you fully accept these Terms and
                Conditions. If you do not agree, please do not use the Site. Continued use after any
                changes constitutes acceptance of those changes.
              </p>
              <p>
                The Site is operated by Matteo Pizzi (&quot;we&quot;, &quot;the Operator&quot;). For
                any communication:{' '}
                <a href="mailto:brand@theviralrecipe.com" className="text-[#FF3A2D] hover:underline">
                  brand@theviralrecipe.com
                </a>
              </p>
            </Section>

            <Section title="2. Description of service">
              <p>
                TheViralRecipe.com is a platform that aggregates, organizes and presents viral
                recipes from social media (TikTok, Instagram, YouTube). The content of original
                recipes belongs to the respective creators; we provide a structured and optimized
                reworking, always citing the original source.
              </p>
            </Section>

            <Section title="3. AI-generated content">
              <p>
                Some recipes, descriptions, images or texts on the Site may have been generated or
                optimized using artificial intelligence (in particular via Replicate). In such cases:
              </p>
              <ul>
                <li>Content is provided for informational purposes and may contain inaccuracies.</li>
                <li>
                  We do not guarantee nutritional accuracy, completeness of instructions, or
                  suitability for people with allergies or specific medical conditions.
                </li>
                <li>
                  It is the user&apos;s responsibility to verify information before following any
                  recipe, especially in cases of allergies, intolerances or health conditions.
                </li>
                <li>
                  Nutritional values shown are estimates and should not be considered as medical or
                  dietary advice.
                </li>
              </ul>
            </Section>

            <Section title="4. User account">
              <p>
                Certain features require an account. You are responsible for maintaining the
                confidentiality of your credentials, providing accurate registration information, and
                notifying us immediately of any unauthorized access.
              </p>
            </Section>

            <Section title="5. Pro subscription">
              <p>
                The Pro plan is available at the price shown on the dedicated page (currently
                €4.99/month). The subscription renews automatically each month until explicitly
                cancelled.
              </p>
              <p>
                <strong>Right of withdrawal (EU consumers):</strong> you have the right to withdraw
                from the subscription within 14 days of purchase, without providing any reason.
                Contact us at{' '}
                <a href="mailto:brand@theviralrecipe.com" className="text-[#FF3A2D] hover:underline">
                  brand@theviralrecipe.com
                </a>{' '}
                within 14 days of activation. Any refund due will be processed within 14 days via
                the same payment method used for the purchase.
              </p>
            </Section>

            <Section title="6. User conduct">
              <p>By using the Site, you agree not to:</p>
              <ul>
                <li>Violate any applicable laws or regulations.</li>
                <li>Post or transmit illegal, offensive or defamatory content, or content that infringes third-party rights.</li>
                <li>Attempt unauthorized access to systems or data.</li>
                <li>Use bots, scrapers or automated tools to collect content without written authorization.</li>
                <li>Interfere with the normal operation of the Site.</li>
              </ul>
            </Section>

            <Section title="7. Intellectual property">
              <p>
                The design, code, logo and original content of TheViralRecipe.com are owned by the
                Operator and protected by copyright law. Reproduction, distribution or modification
                without written authorization is prohibited.
              </p>
            </Section>

            <Section title="8. Limitation of liability">
              <p>
                To the maximum extent permitted by applicable law, the Site is provided &quot;as is&quot;
                without warranties of any kind. We are not liable for direct, indirect, incidental or
                consequential damages arising from the use of or inability to access the Site.
              </p>
            </Section>

            <Section title="9. Governing law">
              <p>
                These Terms are governed by Italian law. For consumer disputes, the competent court
                is that of the consumer&apos;s place of residence. For professional users, the
                exclusive court is Milan, Italy.
              </p>
            </Section>

            <Section title="10. Changes">
              <p>
                We reserve the right to modify these Terms at any time. Material changes will be
                communicated with at least 15 days&apos; notice to registered users. Continued use
                after notification constitutes acceptance.
              </p>
            </Section>

          </div>
        </div>
      </div>
    </div>
  );
}

// ── Shared subcomponent ───────────────────────────────────────────────────────

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
