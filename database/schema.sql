-- =============================================
-- THEVIRALRECIPE.COM — Schema Supabase PostgreSQL
-- Versione: 1.0.0
-- Autore: generato con Claude
-- =============================================
-- ISTRUZIONI:
-- 1. Vai su Supabase Dashboard > SQL Editor
-- 2. Incolla questo file ed esegui
-- 3. Controlla che non ci siano errori
-- 4. Esegui il seed data (in fondo) separatamente se necessario
-- =============================================

-- Estensioni necessarie
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- per full-text search e LIKE veloce


-- =============================================
-- ENUM TYPES
-- =============================================

CREATE TYPE recipe_category AS ENUM (
  'antipasti',
  'primi',
  'secondi',
  'contorni',
  'dolci',
  'bevande',
  'snack',
  'colazione',
  'condimenti'
);

CREATE TYPE recipe_difficulty AS ENUM ('facile', 'medio', 'difficile');

CREATE TYPE source_platform AS ENUM ('tiktok', 'instagram', 'youtube', 'altro');

CREATE TYPE pipeline_status AS ENUM (
  'pending',      -- in attesa di essere processato
  'processing',   -- in elaborazione
  'done',         -- completato, ricetta creata
  'error',        -- errore durante il processing
  'rejected',     -- rifiutato dall'admin
  'duplicate'     -- URL già presente nel database
);

CREATE TYPE creator_tier AS ENUM (
  'free',   -- claim gratuito del profilo
  'pro',    -- 19€/mese — featured, analytics avanzate, custom page
  'brand'   -- accordo custom — sponsored content
);

CREATE TYPE user_plan AS ENUM (
  'free',   -- piano gratuito
  'pro'     -- 4,99€/mese
);


-- =============================================
-- PROFILI UTENTI
-- Estende auth.users di Supabase Auth
-- =============================================

CREATE TABLE profiles (
  id               UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username         TEXT UNIQUE,
  display_name     TEXT,
  avatar_url       TEXT,
  bio              TEXT,

  -- Piano abbonamento
  plan             user_plan DEFAULT 'free' NOT NULL,
  stripe_customer_id TEXT UNIQUE,
  pro_expires_at   TIMESTAMPTZ,

  -- Counter cache (aggiornati da trigger)
  saved_recipes_count INT DEFAULT 0,

  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE profiles IS 'Profilo pubblico di ogni utente registrato. Creato automaticamente al signup via trigger.';


-- =============================================
-- RICETTE
-- Tabella principale del sito
-- =============================================

CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- ── CONTENUTO ITALIANO ──────────────────
  title_it            TEXT NOT NULL,
  slug_it             TEXT UNIQUE NOT NULL,
  intro_it            TEXT,                          -- paragrafo "perché è virale"
  ingredients_it      JSONB NOT NULL DEFAULT '[]',   -- [{name, amount, unit, is_optional, amazon_url}]
  procedure_it        TEXT[] NOT NULL DEFAULT '{}',  -- array di step testuali
  tips_it             TEXT,
  meta_title_it       TEXT,
  meta_description_it TEXT,

  -- ── CONTENUTO INGLESE ───────────────────
  title_en            TEXT NOT NULL,
  slug_en             TEXT UNIQUE NOT NULL,
  intro_en            TEXT,
  ingredients_en      JSONB NOT NULL DEFAULT '[]',
  procedure_en        TEXT[] NOT NULL DEFAULT '{}',
  tips_en             TEXT,
  meta_title_en       TEXT,
  meta_description_en TEXT,

  -- ── CLASSIFICAZIONE ─────────────────────
  category            recipe_category NOT NULL,
  difficulty          recipe_difficulty DEFAULT 'medio',
  time_prep_minutes   INT,
  time_cook_minutes   INT,
  time_total_minutes  INT GENERATED ALWAYS AS (
                        COALESCE(time_prep_minutes, 0) + COALESCE(time_cook_minutes, 0)
                      ) STORED,
  servings            INT DEFAULT 4,

  -- ── FONTE SOCIAL ────────────────────────
  source_platform       source_platform,
  source_url            TEXT,
  source_author         TEXT,
  source_author_handle  TEXT,
  source_video_id       TEXT,
  source_embed_code     TEXT,     -- HTML oEmbed per mostrare il post originale
  source_thumbnail_url  TEXT,     -- thumbnail originale (non riservita sul nostro CDN)

  -- ── IMMAGINE AI GENERATA ─────────────────
  -- Non usiamo immagini dei social (violazione ToS/copyright)
  -- Generiamo un'immagine food professionale con Replicate/Flux
  image_url    TEXT,              -- salvata su Supabase Storage
  image_prompt TEXT,              -- prompt usato (per ricreare o variare)

  -- ── LINK AFFILIAZIONE AMAZON ─────────────
  -- Link a ingredienti speciali o utensili usati nella ricetta
  amazon_links JSONB DEFAULT '[]',  -- [{label, url, asin}]

  -- ── METRICHE (counter cache) ─────────────
  votes_count  INT DEFAULT 0 NOT NULL,
  views_count  INT DEFAULT 0 NOT NULL,
  saves_count  INT DEFAULT 0 NOT NULL,
  made_count   INT DEFAULT 0 NOT NULL,  -- "l'ho fatta" social proof
  viral_score  FLOAT DEFAULT 0,         -- score per la classifica, ricalcolato periodicamente

  -- ── STATO ───────────────────────────────
  is_published       BOOLEAN DEFAULT FALSE NOT NULL,
  is_featured        BOOLEAN DEFAULT FALSE NOT NULL,   -- in home/hero
  is_pro_content     BOOLEAN DEFAULT FALSE NOT NULL,   -- visibile solo agli utenti Pro
  submitted_by_creator UUID REFERENCES profiles(id),  -- se inviata da creator (non pipeline)
  reviewed_by          UUID REFERENCES profiles(id),  -- admin che ha approvato
  pipeline_job_id      UUID,                          -- riferimento al job che l'ha generata

  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

COMMENT ON TABLE recipes IS 'Ricette virali. Possono essere generate dalla pipeline automatica o inviate direttamente dai creator.';
COMMENT ON COLUMN recipes.ingredients_it IS 'Array JSON: [{name: string, amount: string, unit: string, is_optional: boolean, amazon_url: string|null}]';
COMMENT ON COLUMN recipes.procedure_it IS 'Array di stringhe, un elemento per ogni step del procedimento';
COMMENT ON COLUMN recipes.viral_score IS 'Score calcolato: (voti*3 + views*0.1 + saves*5 + made*10) / eta_giorni^1.2';


-- =============================================
-- TAG
-- Vocabolario controllato + AI-assegnati
-- =============================================

CREATE TABLE tags (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug       TEXT UNIQUE NOT NULL,
  name_it    TEXT NOT NULL,
  name_en    TEXT NOT NULL,
  tag_type   TEXT NOT NULL CHECK (tag_type IN ('dieta', 'ingrediente', 'stile', 'fonte', 'occasione')),
  color      TEXT,         -- hex, es. #22C55E
  icon       TEXT,         -- emoji
  recipe_count INT DEFAULT 0,  -- cache aggiornata da trigger
  sort_order   INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Relazione many-to-many ricette ↔ tag
CREATE TABLE recipe_tags (
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  tag_id    UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (recipe_id, tag_id)
);


-- =============================================
-- VALORI NUTRIZIONALI
-- Visibili solo agli utenti Pro (RLS)
-- Fonte: Edamam API
-- =============================================

CREATE TABLE nutrition (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id   UUID UNIQUE REFERENCES recipes(id) ON DELETE CASCADE,
  per_serving BOOLEAN DEFAULT TRUE,  -- TRUE = per porzione, FALSE = per 100g
  calories    INT,
  protein_g   FLOAT,
  carbs_g     FLOAT,
  fat_g       FLOAT,
  fiber_g     FLOAT,
  sugar_g     FLOAT,
  sodium_mg   FLOAT,
  source      TEXT DEFAULT 'edamam',
  fetched_at  TIMESTAMPTZ DEFAULT NOW()
);


-- =============================================
-- INTERAZIONI UTENTI
-- =============================================

-- Voti — 1 per utente per ricetta
CREATE TABLE recipe_votes (
  recipe_id  UUID REFERENCES recipes(id) ON DELETE CASCADE,
  user_id    UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (recipe_id, user_id)
);

-- "L'ho fatta" — social proof con foto opzionale
CREATE TABLE recipe_made (
  recipe_id  UUID REFERENCES recipes(id) ON DELETE CASCADE,
  user_id    UUID REFERENCES profiles(id) ON DELETE CASCADE,
  photo_url  TEXT,   -- upload opzionale del piatto
  note       TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (recipe_id, user_id)
);

-- Ricette salvate (free: max 10, pro: illimitato)
CREATE TABLE saved_recipes (
  user_id    UUID REFERENCES profiles(id) ON DELETE CASCADE,
  recipe_id  UUID REFERENCES recipes(id) ON DELETE CASCADE,
  saved_at   TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, recipe_id)
);

-- Raccolte personali (free: 1, pro: illimitate)
CREATE TABLE collections (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  emoji        TEXT DEFAULT '📁',
  description  TEXT,
  is_public    BOOLEAN DEFAULT FALSE,
  recipe_count INT DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE collection_recipes (
  collection_id UUID REFERENCES collections(id) ON DELETE CASCADE,
  recipe_id     UUID REFERENCES recipes(id) ON DELETE CASCADE,
  added_at      TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (collection_id, recipe_id)
);

-- Lista della spesa — solo Pro
-- Generata automaticamente dagli ingredienti di una ricetta
CREATE TABLE shopping_lists (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name       TEXT NOT NULL DEFAULT 'Lista della spesa',
  -- items: [{ingredient, amount, unit, checked, recipe_id, recipe_title}]
  items      JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- =============================================
-- CREATOR / INFLUENCER PLAN
-- Piano per creator food che vogliono pubblicare
-- le proprie ricette virali sul sito
-- =============================================

CREATE TABLE creator_profiles (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,

  -- Identità pubblica
  creator_name      TEXT NOT NULL,
  creator_slug      TEXT UNIQUE NOT NULL,   -- URL: /creator/[slug]
  bio_it            TEXT,
  bio_en            TEXT,
  profile_image_url TEXT,
  cover_image_url   TEXT,

  -- Social links
  tiktok_handle     TEXT,
  instagram_handle  TEXT,
  youtube_handle    TEXT,
  website_url       TEXT,

  -- Verifica
  is_verified       BOOLEAN DEFAULT FALSE,
  verified_at       TIMESTAMPTZ,
  follower_count_approx INT,   -- follower cross-platform (self-declared)

  -- Piano creator
  tier                   creator_tier DEFAULT 'free' NOT NULL,
  stripe_subscription_id TEXT,
  tier_expires_at        TIMESTAMPTZ,

  -- Statistiche aggregate (cache)
  total_recipes     INT DEFAULT 0,
  total_views       INT DEFAULT 0,
  total_votes       INT DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE creator_profiles IS 'Profili creator/influencer. Free = claim profilo + badge. Pro (19€/mo) = featured + analytics + pagina custom. Brand = accordo custom.';

-- Ricette inviate direttamente dai creator
-- Bypassano la pipeline AI e vanno in coda di review admin
CREATE TABLE creator_submissions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id  UUID REFERENCES creator_profiles(id) ON DELETE CASCADE,
  recipe_id   UUID REFERENCES recipes(id),   -- popolato dopo approvazione

  -- Dati inviati dal creator (raw, per poterli rielaborare)
  raw_data    JSONB NOT NULL,

  status      TEXT DEFAULT 'pending' CHECK (
                status IN ('pending', 'approved', 'rejected', 'needs_revision')
              ),
  admin_notes TEXT,
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);


-- =============================================
-- PIPELINE AUTOMAZIONE
-- Traccia ogni job di discovery e processing
-- =============================================

CREATE TABLE pipeline_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Input
  source_platform source_platform NOT NULL,
  source_url      TEXT NOT NULL,
  source_video_id TEXT,

  -- Stato
  status   pipeline_status DEFAULT 'pending' NOT NULL,
  attempts INT DEFAULT 0,

  -- Output intermedio (utile per debug e retry)
  transcript       TEXT,
  raw_recipe_json  JSONB,

  -- Output finale
  recipe_id UUID REFERENCES recipes(id),

  -- Errori
  error_message TEXT,
  error_step    TEXT,   -- es. 'transcription', 'ai_extraction', 'image_gen'

  -- Timing
  started_at   TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE pipeline_jobs IS 'Log di ogni job della pipeline automatica. Permette retry, debug e audit.';


-- =============================================
-- TRACKING VIEWS (anonimo + autenticato)
-- =============================================

CREATE TABLE recipe_views (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id  UUID REFERENCES recipes(id) ON DELETE CASCADE,
  user_id    UUID REFERENCES profiles(id),   -- NULL se non loggato
  session_id TEXT,                            -- tracking anonimo
  lang       TEXT DEFAULT 'it' CHECK (lang IN ('it', 'en')),
  referrer   TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- =============================================
-- INDICI — PERFORMANCE
-- =============================================

-- Ricette: lookup per slug (usato dal router Next.js)
CREATE INDEX idx_recipes_slug_it    ON recipes(slug_it);
CREATE INDEX idx_recipes_slug_en    ON recipes(slug_en);

-- Ricette: classifica e filtri
CREATE INDEX idx_recipes_category   ON recipes(category)    WHERE is_published = TRUE;
CREATE INDEX idx_recipes_published  ON recipes(published_at DESC) WHERE is_published = TRUE;
CREATE INDEX idx_recipes_viral      ON recipes(viral_score DESC)  WHERE is_published = TRUE;
CREATE INDEX idx_recipes_featured   ON recipes(is_featured)       WHERE is_published = TRUE AND is_featured = TRUE;
CREATE INDEX idx_recipes_source     ON recipes(source_platform)   WHERE is_published = TRUE;

-- Full-text search in italiano e inglese
CREATE INDEX idx_fts_it ON recipes
  USING gin(to_tsvector('italian', COALESCE(title_it,'') || ' ' || COALESCE(intro_it,'')));
CREATE INDEX idx_fts_en ON recipes
  USING gin(to_tsvector('english', COALESCE(title_en,'') || ' ' || COALESCE(intro_en,'')));

-- Tag
CREATE INDEX idx_recipe_tags_recipe ON recipe_tags(recipe_id);
CREATE INDEX idx_recipe_tags_tag    ON recipe_tags(tag_id);

-- Interazioni utenti
CREATE INDEX idx_votes_recipe       ON recipe_votes(recipe_id);
CREATE INDEX idx_saved_user         ON saved_recipes(user_id);
CREATE INDEX idx_collections_user   ON collections(user_id);
CREATE INDEX idx_coll_recipes       ON collection_recipes(collection_id);

-- Pipeline
CREATE INDEX idx_pipeline_status    ON pipeline_jobs(status)
  WHERE status IN ('pending', 'processing');
CREATE INDEX idx_pipeline_url       ON pipeline_jobs(source_url);

-- Views
CREATE INDEX idx_views_recipe_date  ON recipe_views(recipe_id, created_at DESC);


-- =============================================
-- FUNZIONI & TRIGGER
-- =============================================

-- Aggiorna updated_at automaticamente su ogni UPDATE
CREATE OR REPLACE FUNCTION fn_update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();

CREATE TRIGGER trg_recipes_updated_at
  BEFORE UPDATE ON recipes
  FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();

CREATE TRIGGER trg_collections_updated_at
  BEFORE UPDATE ON collections
  FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();

CREATE TRIGGER trg_shopping_lists_updated_at
  BEFORE UPDATE ON shopping_lists
  FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();

CREATE TRIGGER trg_creator_profiles_updated_at
  BEFORE UPDATE ON creator_profiles
  FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();


-- Sincronizza votes_count su recipes quando un utente vota/svota
CREATE OR REPLACE FUNCTION fn_sync_votes_count()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE recipes SET votes_count = votes_count + 1 WHERE id = NEW.recipe_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE recipes SET votes_count = GREATEST(votes_count - 1, 0) WHERE id = OLD.recipe_id;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER trg_sync_votes
  AFTER INSERT OR DELETE ON recipe_votes
  FOR EACH ROW EXECUTE FUNCTION fn_sync_votes_count();


-- Sincronizza saves_count e il counter sul profilo utente
CREATE OR REPLACE FUNCTION fn_sync_saves_count()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE recipes  SET saves_count = saves_count + 1 WHERE id = NEW.recipe_id;
    UPDATE profiles SET saved_recipes_count = saved_recipes_count + 1 WHERE id = NEW.user_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE recipes  SET saves_count = GREATEST(saves_count - 1, 0) WHERE id = OLD.recipe_id;
    UPDATE profiles SET saved_recipes_count = GREATEST(saved_recipes_count - 1, 0) WHERE id = OLD.user_id;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER trg_sync_saves
  AFTER INSERT OR DELETE ON saved_recipes
  FOR EACH ROW EXECUTE FUNCTION fn_sync_saves_count();


-- Sincronizza made_count su recipes
CREATE OR REPLACE FUNCTION fn_sync_made_count()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE recipes SET made_count = made_count + 1 WHERE id = NEW.recipe_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE recipes SET made_count = GREATEST(made_count - 1, 0) WHERE id = OLD.recipe_id;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER trg_sync_made
  AFTER INSERT OR DELETE ON recipe_made
  FOR EACH ROW EXECUTE FUNCTION fn_sync_made_count();


-- Aggiorna recipe_count sul tag quando si aggiunge/rimuove un'associazione
CREATE OR REPLACE FUNCTION fn_sync_tag_recipe_count()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE tags SET recipe_count = recipe_count + 1 WHERE id = NEW.tag_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE tags SET recipe_count = GREATEST(recipe_count - 1, 0) WHERE id = OLD.tag_id;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER trg_sync_tag_count
  AFTER INSERT OR DELETE ON recipe_tags
  FOR EACH ROW EXECUTE FUNCTION fn_sync_tag_recipe_count();


-- Crea profilo automaticamente al signup
-- Chiamato da Supabase Auth via trigger su auth.users
CREATE OR REPLACE FUNCTION fn_handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    -- username = parte locale dell'email senza caratteri speciali
    LOWER(REGEXP_REPLACE(SPLIT_PART(NEW.email, '@', 1), '[^a-z0-9_]', '', 'g')),
    -- display_name = parte locale dell'email (leggibile)
    SPLIT_PART(NEW.email, '@', 1),
    -- avatar da OAuth se disponibile
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_new_user_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION fn_handle_new_user();


-- Calcola viral_score per una singola ricetta
-- Formula: (voti*3 + views*0.1 + saves*5 + "l'ho fatta"*10) / eta_giorni^1.2
-- Chiamata dal Vercel Cron ogni ora per aggiornare la classifica
CREATE OR REPLACE FUNCTION fn_calculate_viral_score(p_recipe_id UUID)
RETURNS FLOAT LANGUAGE plpgsql AS $$
DECLARE
  v   recipes%ROWTYPE;
  age FLOAT;
BEGIN
  SELECT * INTO v FROM recipes WHERE id = p_recipe_id;
  age := GREATEST(
    EXTRACT(EPOCH FROM (NOW() - COALESCE(v.published_at, v.created_at))) / 86400.0,
    0.01  -- evita divisione per zero
  );
  RETURN (
    v.votes_count  * 3.0  +
    v.views_count  * 0.1  +
    v.saves_count  * 5.0  +
    v.made_count   * 10.0
  ) / POWER(age, 1.2);
END;
$$;

-- Aggiorna viral_score di tutte le ricette pubblicate
-- Chiamata dal Vercel Cron ogni ora: SELECT fn_update_all_viral_scores();
CREATE OR REPLACE FUNCTION fn_update_all_viral_scores()
RETURNS VOID LANGUAGE plpgsql AS $$
BEGIN
  UPDATE recipes
  SET viral_score = fn_calculate_viral_score(id)
  WHERE is_published = TRUE;
END;
$$;


-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

ALTER TABLE profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes            ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_votes       ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_made        ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_recipes      ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections        ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_lists     ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_profiles   ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition          ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_views       ENABLE ROW LEVEL SECURITY;


-- PROFILI: pubblici in lettura, solo il proprietario in scrittura
CREATE POLICY "profili_select_public"
  ON profiles FOR SELECT USING (TRUE);

CREATE POLICY "profili_update_own"
  ON profiles FOR UPDATE USING (auth.uid() = id);


-- RICETTE: le pubblicate sono visibili a tutti
-- quelle is_pro_content solo a utenti con plan = 'pro' o creator pro/brand
CREATE POLICY "recipes_select_published"
  ON recipes FOR SELECT USING (
    is_published = TRUE
    AND (
      is_pro_content = FALSE
      OR EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND plan = 'pro'
      )
      OR EXISTS (
        SELECT 1 FROM creator_profiles
        WHERE id = auth.uid() AND tier IN ('pro', 'brand')
      )
    )
  );

-- Insert/Update/Delete solo da service_role (pipeline, admin)
-- Il frontend non scrive direttamente su recipes


-- VOTI
CREATE POLICY "votes_select_own"
  ON recipe_votes FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "votes_insert_authenticated"
  ON recipe_votes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "votes_delete_own"
  ON recipe_votes FOR DELETE USING (auth.uid() = user_id);


-- L'HO FATTA
CREATE POLICY "made_select_own"
  ON recipe_made FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "made_insert_authenticated"
  ON recipe_made FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "made_delete_own"
  ON recipe_made FOR DELETE USING (auth.uid() = user_id);


-- SAVED RECIPES: solo proprie
CREATE POLICY "saved_all_own"
  ON saved_recipes FOR ALL USING (auth.uid() = user_id);


-- RACCOLTE: pubbliche in lettura, private solo al proprietario
CREATE POLICY "collections_select"
  ON collections FOR SELECT
  USING (is_public = TRUE OR auth.uid() = user_id);

CREATE POLICY "collections_insert_own"
  ON collections FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "collections_update_own"
  ON collections FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "collections_delete_own"
  ON collections FOR DELETE USING (auth.uid() = user_id);


-- COLLECTION_RECIPES: solo chi possiede la raccolta
CREATE POLICY "collection_recipes_all"
  ON collection_recipes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM collections
      WHERE id = collection_id AND user_id = auth.uid()
    )
  );


-- LISTA SPESA: solo Pro e solo propria
CREATE POLICY "shopping_list_pro_own"
  ON shopping_lists FOR ALL
  USING (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND plan = 'pro'
    )
  );


-- NUTRIZIONE: solo utenti Pro o creator pro/brand
CREATE POLICY "nutrition_pro_only"
  ON nutrition FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND plan = 'pro')
    OR EXISTS (SELECT 1 FROM creator_profiles WHERE id = auth.uid() AND tier IN ('pro', 'brand'))
  );


-- CREATOR PROFILES: pubblici in lettura, solo il proprietario in scrittura
CREATE POLICY "creator_profiles_select_public"
  ON creator_profiles FOR SELECT USING (TRUE);

CREATE POLICY "creator_profiles_update_own"
  ON creator_profiles FOR UPDATE USING (auth.uid() = id);


-- CREATOR SUBMISSIONS: solo il creator vede le sue
CREATE POLICY "creator_submissions_own"
  ON creator_submissions FOR ALL USING (auth.uid() = creator_id);


-- VIEWS: chiunque può inserire, solo il proprietario vede le sue
CREATE POLICY "views_insert_public"
  ON recipe_views FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "views_select_own"
  ON recipe_views FOR SELECT USING (
    auth.uid() = user_id OR user_id IS NULL
  );


-- =============================================
-- SEED DATA — TAG DI DEFAULT
-- =============================================

INSERT INTO tags (slug, name_it, name_en, tag_type, color, icon, sort_order) VALUES

-- DIETA
('vegano',          'Vegano',         'Vegan',          'dieta', '#22C55E', '🌱', 10),
('vegetariano',     'Vegetariano',    'Vegetarian',     'dieta', '#84CC16', '🥦', 20),
('senza-glutine',   'Senza Glutine',  'Gluten Free',    'dieta', '#F59E0B', '🌾', 30),
('fit',             'Fit',            'Fit',            'dieta', '#3B82F6', '💪', 40),
('proteico',        'Proteico',       'High Protein',   'dieta', '#8B5CF6', '🥩', 50),
('keto',            'Keto',           'Keto',           'dieta', '#EF4444', '🥑', 60),
('low-carb',        'Low Carb',       'Low Carb',       'dieta', '#F97316', '📉', 70),
('senza-lattosio',  'Senza Lattosio', 'Dairy Free',     'dieta', '#06B6D4', '🥛', 80),

-- INGREDIENTE PRINCIPALE
('carne',           'Carne',          'Meat',           'ingrediente', '#DC2626', '🥩', 10),
('pesce',           'Pesce',          'Fish',           'ingrediente', '#2563EB', '🐟', 20),
('pasta',           'Pasta',          'Pasta',          'ingrediente', '#D97706', '🍝', 30),
('riso',            'Riso',           'Rice',           'ingrediente', '#65A30D', '🍚', 40),
('uova',            'Uova',           'Eggs',           'ingrediente', '#CA8A04', '🥚', 50),
('pollo',           'Pollo',          'Chicken',        'ingrediente', '#EA580C', '🍗', 60),
('verdure',         'Verdure',        'Vegetables',     'ingrediente', '#16A34A', '🥗', 70),
('legumi',          'Legumi',         'Legumes',        'ingrediente', '#92400E', '🫘', 80),

-- STILE
('veloce',          'Veloce',         'Quick',          'stile', '#FBBF24', '⚡', 10),
('5-ingredienti',   '5 Ingredienti',  '5 Ingredients',  'stile', '#34D399', '5️⃣', 20),
('economico',       'Economico',      'Budget',         'stile', '#6EE7B7', '💰', 30),
('etnico',          'Etnico',         'Ethnic',         'stile', '#F472B6', '🌍', 40),
('fusion',          'Fusion',         'Fusion',         'stile', '#C084FC', '✨', 50),
('comfort-food',    'Comfort Food',   'Comfort Food',   'stile', '#FB923C', '🛋️', 60),
('gourmet',         'Gourmet',        'Gourmet',        'stile', '#1D4ED8', '👨‍🍳', 70),

-- FONTE SOCIAL
('tiktok-viral',    'TikTok Viral',   'TikTok Viral',   'fonte', '#FF0050', '🎵', 10),
('instagram-trend', 'Instagram Trend','Instagram Trend','fonte', '#E1306C', '📸', 20),
('youtube-recipe',  'Da YouTube',     'From YouTube',   'fonte', '#FF0000', '▶️', 30),

-- OCCASIONE
('aperitivo',       'Aperitivo',      'Aperitivo',      'occasione', '#7C3AED', '🍸', 10),
('cena-romantica',  'Cena Romantica', 'Romantic Dinner','occasione', '#DB2777', '❤️', 20),
('meal-prep',       'Meal Prep',      'Meal Prep',      'occasione', '#0891B2', '📦', 30),
('party',           'Party',          'Party',          'occasione', '#D97706', '🎉', 40),
('brunch',          'Brunch',         'Brunch',         'occasione', '#65A30D', '☀️', 50);
