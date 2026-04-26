'use client';

/**
 * Google AdSense — script globale caricato solo dopo consenso marketing.
 * Mettere questo componente una sola volta nel layout principale.
 */

import Script from 'next/script';
import { useEffect, useState } from 'react';

interface AdSenseScriptProps {
  publisherId: string; // formato: ca-pub-XXXXXXXXXXXXXXXXX
}

function hasMarketingConsent(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = localStorage.getItem('cookie_preferences');
    if (raw) {
      const prefs = JSON.parse(raw);
      return prefs.marketing === true;
    }
    return localStorage.getItem('cookie_consent') === 'accepted';
  } catch {
    return false;
  }
}

/** Script AdSense globale — inserire una volta nel layout */
export function AdSenseScript({ publisherId }: AdSenseScriptProps) {
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    setHasConsent(hasMarketingConsent());
    const handler = () => setHasConsent(hasMarketingConsent());
    window.addEventListener('cookieConsentUpdated', handler);
    return () => window.removeEventListener('cookieConsentUpdated', handler);
  }, []);

  if (!publisherId || !hasConsent) return null;

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}

interface AdSlotProps {
  publisherId: string;
  slotId: string;
  format?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  className?: string;
  label?: string; // etichetta visibile "Pubblicità" per compliance
}

/**
 * Slot pubblicitario singolo.
 * Mostra un placeholder elegante finché AdSense non è approvato o
 * l'utente non ha dato il consenso marketing.
 */
export function AdSlot({
  publisherId,
  slotId,
  format = 'auto',
  className = '',
  label = 'Pubblicità',
}: AdSlotProps) {
  const [hasConsent, setHasConsent] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setHasConsent(hasMarketingConsent());
    const handler = () => setHasConsent(hasMarketingConsent());
    window.addEventListener('cookieConsentUpdated', handler);

    // Piccolo delay per assicurarsi che lo script AdSense sia caricato
    const t = setTimeout(() => setReady(true), 500);
    return () => {
      window.removeEventListener('cookieConsentUpdated', handler);
      clearTimeout(t);
    };
  }, []);

  if (!publisherId || publisherId === 'INCOLLA_QUI_ADSENSE_PUB_ID') {
    // Placeholder durante sviluppo / prima della verifica AdSense
    return (
      <div
        className={`flex items-center justify-center bg-dark-surface border border-dark-border rounded-xl text-white/20 text-xs ${className}`}
        style={{ minHeight: 90 }}
      >
        [Ad slot — in attesa verifica AdSense]
      </div>
    );
  }

  if (!hasConsent) {
    return (
      <div
        className={`flex items-center justify-center bg-dark-surface border border-dark-border rounded-xl text-white/20 text-xs ${className}`}
        style={{ minHeight: 90 }}
      >
        {label}
      </div>
    );
  }

  if (!ready) return null;

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={publisherId}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: '(adsbygoogle = window.adsbygoogle || []).push({});',
        }}
      />
    </div>
  );
}
