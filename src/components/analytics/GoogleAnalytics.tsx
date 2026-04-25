'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

interface GoogleAnalyticsProps {
  measurementId: string;
}

export function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    // Controlla il consenso al mount
    const consent = localStorage.getItem('cookie_consent');
    if (consent === 'accepted') {
      setHasConsent(true);
    } else if (consent === 'custom') {
      try {
        const prefs = JSON.parse(localStorage.getItem('cookie_preferences') || '{}');
        if (prefs.analytics === true) {
          setHasConsent(true);
        }
      } catch {
        // ignore
      }
    }

    // Ascolta aggiornamenti in tempo reale
    const handleConsentUpdate = () => {
      const updatedConsent = localStorage.getItem('cookie_consent');
      if (updatedConsent === 'accepted') {
        setHasConsent(true);
      } else if (updatedConsent === 'custom') {
        try {
          const prefs = JSON.parse(localStorage.getItem('cookie_preferences') || '{}');
          setHasConsent(prefs.analytics === true);
        } catch {
          setHasConsent(false);
        }
      } else {
        setHasConsent(false);
      }
    };

    window.addEventListener('cookieConsentUpdated', handleConsentUpdate);
    return () => window.removeEventListener('cookieConsentUpdated', handleConsentUpdate);
  }, []);

  if (!hasConsent) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}', {
              page_path: window.location.pathname,
              anonymize_ip: true,
              cookie_flags: 'SameSite=None;Secure'
            });
          `,
        }}
      />
    </>
  );
}
