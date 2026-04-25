/**
 * VERCEL CRON — Aggiorna viral scores
 * Schedule: ogni ora (configurato in vercel.json)
 *
 * Ricalcola il viral_score di tutte le ricette pubblicate.
 * Il punteggio decade col tempo → le ricette nuove possono scalzare le vecchie.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseAdminClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = await createServerSupabaseAdminClient();

    // Chiama la funzione PostgreSQL che aggiorna tutti i viral scores
    const { error } = await supabase.rpc('fn_update_all_viral_scores');

    if (error) throw error;

    return NextResponse.json({
      ok: true,
      message: 'Viral scores aggiornati',
      timestamp: new Date().toISOString(),
    });

  } catch (e) {
    console.error('[Cron/viral-scores] Errore:', e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Errore sconosciuto' },
      { status: 500 }
    );
  }
}
