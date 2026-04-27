/**
 * API Admin — Pubblica o rifiuta una ricetta dalla coda
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseAdminClient, getServerUser } from '@/lib/supabase/server';

function isAdmin(email: string | undefined): boolean {
  if (!email) return false;
  const allowed = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return allowed.includes(email.toLowerCase());
}

export async function POST(req: NextRequest) {
  const user = await getServerUser();
  if (!user) {
    return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
  }
  if (!isAdmin(user.email)) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 403 });
  }

  const formData = await req.formData();
  const recipeId = formData.get('recipeId') as string;
  const action   = formData.get('action') as 'publish' | 'reject';

  if (!recipeId || !['publish', 'reject'].includes(action)) {
    return NextResponse.json({ error: 'Parametri non validi' }, { status: 400 });
  }

  const supabase = await createServerSupabaseAdminClient();

  if (action === 'publish') {
    const { error } = await supabase
      .from('recipes')
      .update({
        is_published:  true,
        published_at:  new Date().toISOString(),
        reviewed_by:   user.id,
      })
      .eq('id', recipeId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  } else {
    // Rifiuta: aggiorna il pipeline_job come 'rejected' e elimina la ricetta draft
    await supabase
      .from('pipeline_jobs')
      .update({ status: 'rejected' })
      .eq('recipe_id', recipeId);

    await supabase.from('recipes').delete().eq('id', recipeId);
  }

  // Redirect indietro alla dashboard
  return NextResponse.redirect(new URL('/admin', req.url));
}
