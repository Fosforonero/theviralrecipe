/**
 * Client Supabase per il server (React Server Components, Route Handlers, Server Actions)
 * Deve essere creato per ogni request — NON riutilizzabile tra request diverse
 */
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from './types';

const supabaseUrl        = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey    = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Client server con permessi utente (rispetta RLS)
 * Da usare nelle pagine e nei componenti server standard
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Errore ignorabile: cookies() è read-only nei Server Components
          // Le Route Handlers e i Server Actions possono scrivere
        }
      },
    },
  });
}

/**
 * Client server con permessi admin (bypassa RLS)
 * Da usare SOLO nella pipeline, nell'admin dashboard, e nei cron jobs
 * MAI esporre al frontend o ai client components
 */
export async function createServerSupabaseAdminClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(supabaseUrl, supabaseServiceKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {}
      },
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Helper: ottieni l'utente corrente lato server
 * Ritorna null se non autenticato
 */
export async function getServerUser() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Helper: ottieni l'utente + il suo profilo completo lato server
 */
export async function getServerUserWithProfile() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { user: null, profile: null };

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return { user, profile };
}
