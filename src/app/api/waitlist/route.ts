import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function isValidEmail(email: string): boolean {
  // Accetta solo caratteri RFC 5321 comuni nel local-part; rifiuta <>, spazi, caratteri di controllo
  return /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(email);
}

export async function POST(req: NextRequest) {
  // Parse body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  if (typeof body !== 'object' || body === null) {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const { email: rawEmail, locale: rawLocale } = body as Record<string, unknown>;

  // Normalizza email
  const email =
    typeof rawEmail === 'string' ? rawEmail.toLowerCase().trim() : '';

  // Valida email
  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: 'email_invalid' }, { status: 400 });
  }

  // Locale: solo 'it' o 'en', default 'it'
  const locale = rawLocale === 'en' ? 'en' : 'it';

  // Crea client Supabase con service role lato server (mai esposto al client)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('[waitlist] Variabili Supabase mancanti');
    return NextResponse.json({ ok: false, error: 'service_unavailable' }, { status: 503 });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Metadati opzionali per analytics
  const userAgent = req.headers.get('user-agent')?.slice(0, 500) ?? null;
  const referrer = req.headers.get('referer')?.slice(0, 500) ?? null;

  const { error } = await supabase
    .from('waitlist')
    .insert({ email, locale, user_agent: userAgent, referrer, source: 'wip_page' });

  if (error) {
    // Codice 23505 = violazione unique constraint (email già presente)
    // Trattato come successo idempotente: non rivela se l'email esiste già
    if (error.code === '23505') {
      return NextResponse.json({ ok: true });
    }
    console.error('[waitlist] Errore DB:', error.message);
    return NextResponse.json({ ok: false, error: 'db_error' }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
