/**
 * Tipi generati automaticamente dal database Supabase.
 *
 * QUESTO È UNO STUB TEMPORANEO per sbloccare la build di produzione.
 * Per generare la versione reale (type-safe) lanciare:
 *
 *   npm run supabase:types
 *
 * (richiede la Supabase CLI e la variabile d'ambiente SUPABASE_PROJECT_ID)
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Database type permissivo: lascia passare qualsiasi accesso a tabelle/colonne.
// Sostituire con l'output di `npm run supabase:types` appena possibile.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Database = any;
