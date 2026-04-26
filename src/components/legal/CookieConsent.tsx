'use client';

/**
 * Cookie Consent Banner — GDPR/EU compliant.
 * - Granulare: essenziali, analytics, marketing separati
 * - Persiste in localStorage
 * - Emette evento 'cookieConsentUpdated' per aggiornare GA/AdSense senza refresh
 * - Rispetta art. 7 GDPR: consenso esplicito, revocabile, documentato
 */

import { useEffect, useState } from 'react';
import { X, ChevronDown, ChevronUp, Shield } from 'lucide-react';

type ConsentLevel = 'accepted' | 'rejected' | 'custom' | null;

interface CookiePreferences {
  essential: boolean;   // sempre true, non modificabile
  analytics: boolean;   // GA4
  marketing: boolean;   // AdSense
}

const DEFAULT_PREFS: CookiePreferences = {
  essential: true,
  analytics: false,
  marketing: false,
};

function getStoredConsent(): ConsentLevel {
  try {
    return (localStorage.getItem('cookie_consent') as ConsentLevel) ?? null;
  } catch {
    return null;
  }
}

function getStoredPrefs(): CookiePreferences {
  try {
    const raw = localStorage.getItem('cookie_preferences');
    return raw ? JSON.parse(raw) : DEFAULT_PREFS;
  } catch {
    return DEFAULT_PREFS;
  }
}

function saveConsent(level: ConsentLevel, prefs: CookiePreferences) {
  try {
    localStorage.setItem('cookie_consent', level ?? '');
    localStorage.setItem('cookie_preferences', JSON.stringify(prefs));
    localStorage.setItem('cookie_consent_date', new Date().toISOString());
    window.dispatchEvent(new Event('cookieConsentUpdated'));
  } catch {
    // localStorage non disponibile (private browsing strict mode)
  }
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [prefs, setPrefs] = useState<CookiePreferences>(DEFAULT_PREFS);

  useEffect(() => {
    const stored = getStoredConsent();
    if (!stored) {
      // Piccolo delay per evitare layout shift on first paint
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    } else {
      setPrefs(getStoredPrefs());
    }
  }, []);

  const acceptAll = () => {
    const allPrefs = { essential: true, analytics: true, marketing: true };
    saveConsent('accepted', allPrefs);
    setPrefs(allPrefs);
    setVisible(false);
  };

  const rejectAll = () => {
    const minPrefs = { essential: true, analytics: false, marketing: false };
    saveConsent('rejected', minPrefs);
    setPrefs(minPrefs);
    setVisible(false);
  };

  const saveCustom = () => {
    saveConsent('custom', prefs);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Preferenze cookie"
      aria-modal="true"
      className="fixed bottom-0 left-0 right-0 z-[9999] p-4 sm:p-6
                 animate-in slide-in-from-bottom duration-300"
    >
      <div className="max-w-3xl mx-auto bg-[#1C1C1E] border border-brand-500/30
                      rounded-2xl shadow-2xl shadow-black/60 p-5 sm:p-6">

        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-brand-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Shield className="w-4 h-4 text-brand-400" />
          </div>
          <div>
            <h2 className="text-white font-semibold text-sm leading-snug">
              Questo sito usa i cookie
            </h2>
            <p className="text-white/50 text-xs mt-0.5 leading-relaxed">
              Usiamo cookie essenziali per far funzionare il sito. Con il tuo consenso,
              usiamo anche cookie di analisi (GA4) e pubblicità (AdSense).{' '}
              <a href="/it/cookie" className="text-brand-400 hover:underline">
                Cookie policy
              </a>
            </p>
          </div>
        </div>

        {/* Personalizza — accordion */}
        {showCustom && (
          <div className="mb-4 space-y-3 border border-white/10 rounded-xl p-4">
            {/* Essenziali */}
            <label className="flex items-center justify-between gap-3 cursor-not-allowed">
              <div>
                <p className="text-white text-sm font-medium">Essenziali</p>
                <p className="text-white/40 text-xs">
                  Autenticazione, sessione, sicurezza. Obbligatori.
                </p>
              </div>
              <div className="w-10 h-5 rounded-full bg-brand-500 flex-shrink-0 opacity-60" />
            </label>

            {/* Analytics */}
            <label className="flex items-center justify-between gap-3 cursor-pointer">
              <div>
                <p className="text-white text-sm font-medium">Analytics (GA4)</p>
                <p className="text-white/40 text-xs">
                  Statistiche anonime su come usi il sito. Nessun dato personale.
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={prefs.analytics}
                onClick={() => setPrefs(p => ({ ...p, analytics: !p.analytics }))}
                className={`w-10 h-5 rounded-full transition-colors flex-shrink-0
                  ${prefs.analytics ? 'bg-brand-500' : 'bg-white/20'}`}
              >
                <span
                  className={`block w-4 h-4 rounded-full bg-white shadow transition-transform m-0.5
                    ${prefs.analytics ? 'translate-x-5' : 'translate-x-0'}`}
                />
              </button>
            </label>

            {/* Marketing */}
            <label className="flex items-center justify-between gap-3 cursor-pointer">
              <div>
                <p className="text-white text-sm font-medium">Marketing (AdSense)</p>
                <p className="text-white/40 text-xs">
                  Pubblicità personalizzata. Puoi rifiutare e vedere annunci generici.
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={prefs.marketing}
                onClick={() => setPrefs(p => ({ ...p, marketing: !p.marketing }))}
                className={`w-10 h-5 rounded-full transition-colors flex-shrink-0
                  ${prefs.marketing ? 'bg-brand-500' : 'bg-white/20'}`}
              >
                <span
                  className={`block w-4 h-4 rounded-full bg-white shadow transition-transform m-0.5
                    ${prefs.marketing ? 'translate-x-5' : 'translate-x-0'}`}
                />
              </button>
            </label>
          </div>
        )}

        {/* Bottoni */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={acceptAll}
            className="flex-1 sm:flex-none px-4 py-2 bg-brand-500 hover:bg-brand-600
                       text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Accetta tutti
          </button>

          {showCustom ? (
            <button
              onClick={saveCustom}
              className="flex-1 sm:flex-none px-4 py-2 bg-white/10 hover:bg-white/20
                         text-white text-sm font-medium rounded-xl transition-colors"
            >
              Salva preferenze
            </button>
          ) : (
            <button
              onClick={() => setShowCustom(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1
                         px-4 py-2 bg-white/10 hover:bg-white/20
                         text-white text-sm font-medium rounded-xl transition-colors"
            >
              Personalizza
              <ChevronDown className="w-3 h-3" />
            </button>
          )}

          <button
            onClick={rejectAll}
            className="flex-1 sm:flex-none px-4 py-2 bg-transparent hover:bg-white/5
                       text-white/50 hover:text-white/70 text-sm rounded-xl
                       transition-colors border border-white/10"
          >
            Solo essenziali
          </button>
        </div>
      </div>
    </div>
  );
}
