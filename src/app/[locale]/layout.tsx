import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { Plus_Jakarta_Sans, Fraunces } from 'next/font/google';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from 'react-hot-toast';
import { cn } from '@/lib/utils';
import '../globals.css';

// ── FONT ────────────────────────────────────────────────────────────
// Plus Jakarta Sans: moderno, geometrico, molto leggibile
const fontJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

// Fraunces: serif display per titoli ricette (impatto editoriale)
const fontFraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  weight: ['400', '600', '700', '900'],
  style: ['normal', 'italic'],
});


// ── METADATA DI BASE ─────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });

  const baseUrl = 'https://theviralrecipe.com';

  return {
    metadataBase: new URL(baseUrl),

    title: {
      default: t('home_title'),
      template: `%s | ${t('site_name')}`,
    },

    description: t('home_description'),

    keywords: locale === 'it'
      ? ['ricette virali', 'ricette tiktok', 'ricette instagram', 'ricette youtube', 'ricette social', 'cucina virale']
      : ['viral recipes', 'tiktok recipes', 'instagram recipes', 'youtube recipes', 'trending food'],

    authors: [{ name: 'TheViralRecipe' }],

    openGraph: {
      type: 'website',
      locale: locale === 'it' ? 'it_IT' : 'en_US',
      alternateLocale: locale === 'it' ? 'en_US' : 'it_IT',
      siteName: t('site_name'),
      url: baseUrl,
    },

    twitter: {
      card: 'summary_large_image',
      site: '@theviralrecipe',
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // hreflang per SEO multilingua
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        'it': `${baseUrl}/it`,
        'en': `${baseUrl}/en`,
        'x-default': `${baseUrl}/it`,
      },
    },
  };
}


// ── LAYOUT ROOT ───────────────────────────────────────────────────────
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Valida che la locale sia supportata — mostra 404 se non lo è
  if (!routing.locales.includes(locale as 'it' | 'en')) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      // Classe per dark mode (aggiunta da JS se l'utente lo preferisce)
      suppressHydrationWarning
    >
      <head>
        {/* Preconnect ai domini usati frequentemente */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Structured Data globale */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'TheViralRecipe',
              url: 'https://theviralrecipe.com',
              inLanguage: [locale === 'it' ? 'it-IT' : 'en-US'],
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: `https://theviralrecipe.com/${locale}/${locale === 'it' ? 'cerca' : 'search'}?q={search_term_string}`,
                },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>

      <body
        className={cn(
          fontJakarta.variable,
          fontFraunces.variable,
          'font-sans bg-background text-text-primary antialiased',
          'selection:bg-brand-100 selection:text-brand-700'
        )}
      >
        <NextIntlClientProvider messages={messages}>
          {/* Skip to content per accessibilità */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-brand-500 focus:text-white focus:rounded-lg"
          >
            {locale === 'it' ? 'Vai al contenuto principale' : 'Skip to main content'}
          </a>

          {/* Header globale */}
          <Header locale={locale} />

          {/* Contenuto principale */}
          <main id="main-content" className="min-h-screen">
            {children}
          </main>

          {/* Footer */}
          <Footer locale={locale} />

          {/* Notifiche toast */}
          <Toaster
            position="bottom-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#1C1C1E',
                color: '#FFFFFF',
                borderRadius: '12px',
                padding: '12px 16px',
                fontSize: '14px',
                fontWeight: '500',
              },
            }}
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
