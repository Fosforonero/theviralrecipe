-- =============================================
-- THEVIRALRECIPE.COM — Waitlist
-- Da eseguire in: Supabase Dashboard > SQL Editor
-- =============================================

-- Assicuriamoci che l'estensione uuid sia abilitata (già presente in schema.sql)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabella waitlist: raccoglie le email prima del lancio pubblico
CREATE TABLE IF NOT EXISTS waitlist (
  id         UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
  email      TEXT         UNIQUE NOT NULL,
  locale     TEXT         CHECK (locale IN ('it', 'en')) DEFAULT 'it',
  source     TEXT         NOT NULL DEFAULT 'wip_page',
  -- Metadati opzionali per analytics (utile per capire da dove arrivano gli iscritti)
  user_agent TEXT,
  referrer   TEXT,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE waitlist IS
  'Lista di attesa raccolta dalla WIP page prima del lancio. '
  'Le insert avvengono esclusivamente via service role dalla API route /api/waitlist. '
  'Nessun client pubblico può leggere o scrivere direttamente.';

COMMENT ON COLUMN waitlist.source IS
  'Origine della registrazione: wip_page (default), newsletter, referral, ecc.';

COMMENT ON COLUMN waitlist.locale IS
  'Lingua della pagina da cui si è iscritto: it o en.';

COMMENT ON COLUMN waitlist.user_agent IS
  'User-Agent del browser al momento della registrazione. Troncato a 500 caratteri.';

COMMENT ON COLUMN waitlist.referrer IS
  'Header Referer HTTP al momento della registrazione. Troncato a 500 caratteri.';


-- Indice per query analitiche per data
CREATE INDEX IF NOT EXISTS idx_waitlist_created
  ON waitlist (created_at DESC);

-- Indice per filtrare per locale
CREATE INDEX IF NOT EXISTS idx_waitlist_locale
  ON waitlist (locale);

-- Indice per filtrare per source (utile con più landing page)
CREATE INDEX IF NOT EXISTS idx_waitlist_source
  ON waitlist (source);


-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- NESSUNA policy pubblica:
-- - Nessun SELECT pubblico (gli iscritti non possono vedere la lista)
-- - Nessun INSERT pubblico (le insert passano solo dal service role via /api/waitlist)
-- - Nessun UPDATE/DELETE pubblico
-- Il service role bypassa automaticamente RLS — non servono policy per le API route.
-- L'accesso admin avviene dalla Supabase Dashboard con il service role.

-- Nota operativa per il team:
-- Per esportare la lista: Supabase Dashboard > Table Editor > waitlist > Export CSV
-- Per contare gli iscritti:
--   SELECT COUNT(*), locale FROM waitlist GROUP BY locale;
-- Per iscritti per giorno:
--   SELECT DATE(created_at), COUNT(*) FROM waitlist GROUP BY 1 ORDER BY 1 DESC;
