/**
 * VERCEL CRON — Discovery ricette
 * Schedule: ogni 6 ore (configurato in vercel.json)
 *
 * Cerca nuovi video food virali e li inserisce nella coda pipeline.
 * Poi avvia il processing dei job in coda.
 */

import { NextRequest, NextResponse } from 'next/server';
import { discoverNewRecipes } from '@/lib/pipeline/discover';
import { processPendingJobs } from '@/lib/pipeline/orchestrator';

export const runtime = 'nodejs';
export const maxDuration = 300; // 5 minuti max (Vercel Pro)

export async function GET(req: NextRequest) {
  // Verifica autenticazione: CRON_SECRET obbligatorio in produzione
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  const isProd = process.env.NODE_ENV === 'production';

  if (isProd && !cronSecret) {
    console.error('[Cron/discover] CRON_SECRET non configurato in produzione — richiesta bloccata');
    return NextResponse.json({ error: 'CRON_SECRET non configurato' }, { status: 500 });
  }

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('[Cron/discover] Avvio discovery...');

    // FASE 1: Scopri nuovi video
    const discoveryResult = await discoverNewRecipes();
    console.log(`[Cron/discover] Discovery: ${discoveryResult.found} trovati, ${discoveryResult.queued} in coda`);

    // FASE 2: Processa i job in coda
    const processingResult = await processPendingJobs();
    console.log(`[Cron/discover] Processing: ${processingResult.processed} completati, ${processingResult.failed} falliti`);

    return NextResponse.json({
      ok: true,
      discovery: discoveryResult,
      processing: processingResult,
      timestamp: new Date().toISOString(),
    });

  } catch (e) {
    console.error('[Cron/discover] Errore:', e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Errore sconosciuto' },
      { status: 500 }
    );
  }
}
