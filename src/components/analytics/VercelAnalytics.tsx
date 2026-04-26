'use client';

/**
 * Vercel Analytics — anonimo, aggregato, GDPR-safe, no consenso richiesto.
 * Documenta solo page views senza PII.
 */

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export function VercelAnalytics() {
  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
