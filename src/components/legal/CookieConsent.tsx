'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { X, ChevronDown, ChevronUp, Shield, BarChart2, Megaphone } from 'lucide-react';

interface CookiePreferences {
  analytics: boolean;
  marketing: boolean;
}

type ConsentValue = 'accepted' | 'essential' | 'custom';

export function CookieConsent() {
  const t = useTranslations('cookies');

  const [visible, setVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    setMounted(true);
    const existing = localStorage.getItem('cookie_consent');
    if (!existing) {
      // Piccolo delay per animazione slide-up
      const timer = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveConsent = (value: ConsentValue, prefs?: CookiePreferences) => {
    localStorage.setItem('cookie_consent', value);
    if (prefs) {
      localStorage.setItem('cookie_preferences', JSON.stringify(prefs));
    } else {
      localStorage.removeItem('cookie_preferences');
    }
    window.dispatchEvent(new CustomEvent('cookieConsentUpdated'));
    setVisible(false);
    setModalOpen(false);
  };

  const handleAcceptAll = () => {
    saveConsent('accepted', { analytics: true, marketing: true });
  };

  const handleEssentialOnly = () => {
    saveConsent('essential', { analytics: false, marketing: false });
  };

  const handleSaveCustom = () => {
    saveConsent('custom', preferences);
  };

  const togglePreference = (key: keyof CookiePreferences) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (!mounted || !visible) return null;

  return (
    <>
      {/* Overlay quando modal è aperto */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setModalOpen(false)}
        />
      )}

      {/* Banner principale */}
      <div
        className={`
          fixed bottom-0 left-0 right-0 z-50
          transition-transform duration-500 ease-out
          ${visible ? 'translate-y-0' : 'translate-y-full'}
        `}
        role="dialog"
        aria-label={t('banner_aria_label')}
        aria-modal="true"
      >
        <div className="bg-white border-t-4 border-brand-500 shadow-2xl">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 sm:py-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">

              {/* Icona + testo */}
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Shield className="w-5 h-5 text-brand-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">
                    {t('banner_title')}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5 leading-relaxed">
                    {t('banner_description')}{' '}
                    <a
                      href="#cookie-policy"
                      className="text-brand-500 underline underline-offset-2 hover:text-brand-600"
                    >
                      {t('banner_learn_more')}
                    </a>
                  </p>
                </div>
              </div>

              {/* Bottoni */}
              <div className="flex flex-wrap gap-2 sm:flex-nowrap sm:flex-shrink-0">
                <button
                  onClick={() => { setModalOpen(true); }}
                  className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors whitespace-nowrap"
                >
                  {t('btn_customize')}
                </button>
                <button
                  onClick={handleEssentialOnly}
                  className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors whitespace-nowrap"
                >
                  {t('btn_essential_only')}
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-5 py-2 text-sm font-semibold text-white bg-brand-500 rounded-xl hover:bg-brand-600 transition-colors whitespace-nowrap"
                  style={{ backgroundColor: '#FF3A2D' }}
                >
                  {t('btn_accept_all')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Personalizza */}
      {modalOpen && (
        <div className="fixed inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-lg bottom-4 sm:bottom-8 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            {/* Header modal */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900 text-base">
                {t('modal_title')}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                aria-label={t('modal_close')}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Corpo modal */}
            <div className="px-6 py-4 space-y-4 max-h-[60vh] overflow-y-auto">

              {/* Cookie essenziali — sempre attivi */}
              <CookieToggleRow
                icon={<Shield className="w-4 h-4 text-green-500" />}
                label={t('category_essential_label')}
                description={t('category_essential_desc')}
                checked={true}
                disabled={true}
                onChange={() => {}}
                alwaysOnLabel={t('always_on')}
              />

              {/* Analytics */}
              <CookieToggleRow
                icon={<BarChart2 className="w-4 h-4 text-blue-500" />}
                label={t('category_analytics_label')}
                description={t('category_analytics_desc')}
                checked={preferences.analytics}
                onChange={() => togglePreference('analytics')}
              />

              {/* Marketing */}
              <CookieToggleRow
                icon={<Megaphone className="w-4 h-4 text-orange-500" />}
                label={t('category_marketing_label')}
                description={t('category_marketing_desc')}
                checked={preferences.marketing}
                onChange={() => togglePreference('marketing')}
              />
            </div>

            {/* Footer modal */}
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
              <button
                onClick={handleEssentialOnly}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                {t('btn_essential_only')}
              </button>
              <button
                onClick={handleSaveCustom}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-white rounded-xl transition-colors"
                style={{ backgroundColor: '#FF3A2D' }}
              >
                {t('btn_save_preferences')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── Subcomponent ────────────────────────────────────────────────────────────

interface CookieToggleRowProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
  alwaysOnLabel?: string;
}

function CookieToggleRow({
  icon,
  label,
  description,
  checked,
  disabled = false,
  onChange,
  alwaysOnLabel,
}: CookieToggleRowProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-gray-100 p-4 bg-gray-50/50">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-white border border-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-800 text-sm">{label}</p>
            {expanded && (
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {alwaysOnLabel && disabled ? (
            <span className="text-xs text-green-600 font-medium">{alwaysOnLabel}</span>
          ) : (
            <button
              role="switch"
              aria-checked={checked}
              onClick={onChange}
              disabled={disabled}
              className={`
                relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2
                ${checked ? 'bg-brand-500' : 'bg-gray-200'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
              style={checked && !disabled ? { backgroundColor: '#FF3A2D' } : {}}
            >
              <span
                className={`
                  inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform
                  ${checked ? 'translate-x-4' : 'translate-x-0.5'}
                `}
              />
            </button>
          )}

          <button
            onClick={() => setExpanded((v) => !v)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label={expanded ? 'Chiudi dettagli' : 'Apri dettagli'}
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
