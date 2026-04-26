'use client';

/**
 * Google Analytics 4 — caricato SOLO dopo consenso cookie analytics.
 * Ascolta l'evento 'cookieConsentUpdated' per aggiornarsi senza refresh.
 */

import Script from 'next/script';
import { useEffect, useState } from 'react';

interface Props {
  measurementId: string;
}

function getConsent(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = localStorage.getItem('cookie_preferences');
    if (raw) {
      const prefs = JSON.parse(raw);
      return prefs.analytics === true;
    }
    return localStorage.getItem('cookie_consent') === 'accepted';
  } catch {
    return false;
  }
}

export function GoogleAnalytics({ measurementId }: Props) {
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    setHasConsent(getConsent());

    const handler = () => setHasConsent(getConsent());
    window.addEventListener('cookieConsentUpdated', handler);
    return () => window.removeEventListener('cookieConsentUpdated', handler);
  }, []);

  if (!measurementId || !hasConsent) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}', {
            page_path: window.location.pathname,
            anonymize_ip: true,
            cookie_flags: 'SameSite=None;Secure'
          });
        `}
      </Script>
    </>
  );
}

/** Helper per tracciare eventi custom da qualsiasi componente */
export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }
}
