/**
 * Client Supabase per il browser (React Client Components)
 * Usa @supabase/ssr per la gestione corretta dei cookie
 */
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './types';

// Variabili d'ambiente (pubbliche, non sensibili)
const supabaseUrl     = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Singleton del client browser — NON creare istanze multiple
 */
let browserClient: ReturnType<typeof createBrowserClient<Database>> | undefined;

export function getSupabaseBrowserClient() {
  if (!browserClient) {
    browserClient = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
  }
  return browserClient;
}

// Export di default per comodità
export const supabase = getSupabaseBrowserClient();
