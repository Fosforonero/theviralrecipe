'use client';

import { useEffect, useState, useRef } from 'react';
import Script from 'next/script';

interface AdSenseProps {
  publisherId: string;
  slot: string;
  style?: React.CSSProperties;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export function AdSense({ publisherId, slot, style }: AdSenseProps) {
  const [hasConsent, setHasConsent] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    const checkConsent = () => {
      const consent = localStorage.getItem('cookie_consent');
      if (consent === 'accepted') {
        return true;
      } else if (consent === 'custom') {
        try {
          const prefs = JSON.parse(localStorage.getItem('cookie_preferences') || '{}');
          return prefs.marketing === true;
        } catch {
          return false;
        }
      }
      return false;
    };

    setHasConsent(checkConsent());

    const handleConsentUpdate = () => {
      setHasConsent(checkConsent());
    };

    window.addEventListener('cookieConsentUpdated', handleConsentUpdate);
    return () => window.removeEventListener('cookieConsentUpdated', handleConsentUpdate);
  }, []);

  useEffect(() => {
    if (hasConsent && scriptLoaded && adRef.current) {
      try {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
      } catch {
        // ignore
      }
    }
  }, [hasConsent, scriptLoaded]);

  if (!hasConsent) {
    return (
      <div
        style={style}
        className="flex items-center justify-center bg-stone-100 border border-stone-200 rounded-xl text-stone-400 text-xs"
      >
        <span>Pubblicità</span>
      </div>
    );
  }

  return (
    <>
      <Script
        id="adsense-script"
        src={`//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
        strategy="afterInteractive"
        crossOrigin="anonymous"
        onLoad={() => setScriptLoaded(true)}
      />
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client={publisherId}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </>
  );
}
