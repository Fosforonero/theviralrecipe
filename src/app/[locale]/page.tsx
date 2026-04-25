import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { Flame, TrendingUp, Sparkles, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { RecipeCard, RecipeCardSkeleton, type RecipeCardData } from '@/components/recipe/RecipeCard';
import { cn } from '@/lib/utils';

// ── METADATA SEO ─────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });

  return {
    title: t('home_title'),
    description: t('home_description'),
    openGraph: {
      title: t('home_title'),
      description: t('home_description'),
      images: [{ url: '/og/home.jpg', width: 1200, height: 630 }],
    },
  };
}


// ── HOME PAGE ─────────────────────────────────────────────────────────
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const isIT = locale === 'it';

  // URL localizzati
  const rankingUrl    = `/${locale}/${isIT ? 'classifica' : 'ranking'}`;
  const categoriesUrl = `/${locale}/${isIT ? 'categorie' : 'categories'}`;

  return (
    <div className="pt-header">
      {/* ── HERO ───────────────────────────────────────────────────── */}
      <HeroSection locale={locale} />

      {/* ── TRENDING QUESTA SETTIMANA ──────────────────────────────── */}
      <section className="py-12 sm:py-16">
        <div className="container-main">
          <SectionHeader
            title={t('home.trending_title')}
            href={rankingUrl}
            label={t('common.see_all')}
          />
          <Suspense fallback={<RecipeGridSkeleton count={6} />}>
            <TrendingRecipes locale={locale} />
          </Suspense>
        </div>
      </section>

      {/* ── BANNER PRO ──────────────────────────────────────────────── */}
      <ProBanner locale={locale} />

      {/* ── ULTIME RICETTE AGGIUNTE ─────────────────────────────────── */}
      <section className="py-12 sm:py-16 bg-background-muted">
        <div className="container-main">
          <SectionHeader
            title={t('home.new_title')}
            href={rankingUrl + '?sort=new'}
            label={t('common.see_all')}
          />
          <Suspense fallback={<RecipeGridSkeleton count={6} />}>
            <NewestRecipes locale={locale} />
          </Suspense>
        </div>
      </section>

      {/* ── CATEGORIE ──────────────────────────────────────────────── */}
      <section className="py-12 sm:py-16">
        <div className="container-main">
          <SectionHeader
            title={t('home.categories_title')}
            href={categoriesUrl}
            label={t('common.see_all')}
          />
          <CategoryGrid locale={locale} />
        </div>
      </section>
    </div>
  );
}


// ── HERO SECTION ──────────────────────────────────────────────────────
function HeroSection({ locale }: { locale: string }) {
  const isIT = locale === 'it';
  const searchUrl = `/${locale}/${isIT ? 'cerca' : 'search'}`;
  const rankingUrl = `/${locale}/${isIT ? 'classifica' : 'ranking'}`;

  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Blob gradiente principale */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-100 rounded-full blur-3xl opacity-50 -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-72 h-72 bg-accent-100 rounded-full blur-3xl opacity-40" />
        {/* Pattern dots */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle, #FF3A2D 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className="container-main relative z-10 text-center">
        {/* Pill badge "New" */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-50 text-brand-600 text-sm font-semibold rounded-full border border-brand-100 mb-6 animate-fade-in">
          <Flame className="w-3.5 h-3.5" />
          {locale === 'it' ? 'Nuove ricette ogni giorno' : 'New recipes every day'}
        </div>

        {/* Titolo principale */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-text-primary tracking-tight mb-6 animate-fade-in-up max-w-4xl mx-auto">
          {locale === 'it' ? (
            <>
              Le ricette più{' '}
              <span className="font-display-title text-gradient-brand italic">virali</span>
              {' '}del web
            </>
          ) : (
            <>
              The most{' '}
              <span className="font-display-title text-gradient-brand italic">viral</span>
              {' '}recipes on the web
            </>
          )}
        </h1>

        {/* Sottotitolo */}
        <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10 animate-fade-in-up">
          {locale === 'it'
            ? 'Scopri cosa sta cucinando tutto il mondo su TikTok, Instagram e YouTube — già organizzato e pronto per te.'
            : 'Discover what the whole world is cooking on TikTok, Instagram and YouTube — already organized and ready for you.'}
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in-up">
          <Link href={rankingUrl} className="btn-primary text-base px-8 py-3.5 rounded-2xl shadow-glow-brand">
            <Flame className="w-5 h-5" />
            {locale === 'it' ? 'Esplora le ricette' : 'Explore recipes'}
          </Link>
          <Link href={searchUrl} className="btn-secondary text-base px-8 py-3.5 rounded-2xl">
            {locale === 'it' ? 'Cerca una ricetta' : 'Search a recipe'}
          </Link>
        </div>

        {/* Social proof */}
        <p className="mt-8 text-sm text-text-muted animate-fade-in">
          {locale === 'it'
            ? '✓ Nuove ricette ogni giorno · ✓ Sempre gratis · ✓ Senza registrazione'
            : '✓ New recipes daily · ✓ Always free · ✓ No signup needed'}
        </p>
      </div>
    </section>
  );
}


// ── TRENDING RECIPES (Server Component con fetch Supabase) ─────────────
async function TrendingRecipes({ locale }: { locale: string }) {
  const supabase = await createServerSupabaseClient();

  const { data: recipes, error } = await supabase
    .from('recipes')
    .select(`
      id, title_it, title_en, slug_it, slug_en, image_url,
      category, difficulty, time_total_minutes,
      votes_count, views_count, saves_count,
      source_platform, source_author, viral_score, is_featured
    `)
    .eq('is_published', true)
    .order('viral_score', { ascending: false })
    .limit(6);

  if (error || !recipes?.length) {
    return <EmptyRecipes locale={locale} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 card-grid">
      {recipes.map((recipe, i) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe as RecipeCardData}
          locale={locale}
          variant={i === 0 ? 'featured' : 'default'}
          className={i === 0 ? 'sm:col-span-2 lg:col-span-1' : undefined}
        />
      ))}
    </div>
  );
}

// ── NEWEST RECIPES ─────────────────────────────────────────────────────
async function NewestRecipes({ locale }: { locale: string }) {
  const supabase = await createServerSupabaseClient();

  const { data: recipes, error } = await supabase
    .from('recipes')
    .select(`
      id, title_it, title_en, slug_it, slug_en, image_url,
      category, difficulty, time_total_minutes,
      votes_count, views_count, saves_count,
      source_platform, source_author, viral_score, is_featured
    `)
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(6);

  if (error || !recipes?.length) {
    return <EmptyRecipes locale={locale} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 card-grid">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe as RecipeCardData}
          locale={locale}
        />
      ))}
    </div>
  );
}


// ── CATEGORY GRID ──────────────────────────────────────────────────────
function CategoryGrid({ locale }: { locale: string }) {
  const isIT = locale === 'it';

  const categories = [
    { slug: 'antipasti', emoji: '🥗', label: isIT ? 'Antipasti' : 'Appetizers', color: 'from-orange-400 to-orange-500' },
    { slug: 'primi',     emoji: '🍝', label: isIT ? 'Primi' : 'First courses', color: 'from-yellow-400 to-amber-500' },
    { slug: 'secondi',   emoji: '🥩', label: isIT ? 'Secondi' : 'Mains',        color: 'from-red-400 to-rose-500' },
    { slug: 'contorni',  emoji: '🥦', label: isIT ? 'Contorni' : 'Sides',       color: 'from-green-400 to-emerald-500' },
    { slug: 'dolci',     emoji: '🍰', label: isIT ? 'Dolci' : 'Desserts',       color: 'from-pink-400 to-rose-400' },
    { slug: 'bevande',   emoji: '🥤', label: isIT ? 'Bevande' : 'Drinks',       color: 'from-blue-400 to-cyan-500' },
    { slug: 'snack',     emoji: '🍿', label: isIT ? 'Snack' : 'Snacks',         color: 'from-purple-400 to-violet-500' },
    { slug: 'colazione', emoji: '🥐', label: isIT ? 'Colazione' : 'Breakfast',  color: 'from-amber-400 to-yellow-500' },
  ];

  const baseUrl = `/${locale}/${isIT ? 'categorie' : 'categories'}`;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      {categories.map((cat) => (
        <Link
          key={cat.slug}
          href={`${baseUrl}/${cat.slug}`}
          className="group flex flex-col items-center gap-3 p-5 bg-background-card rounded-2xl border border-border hover:border-brand-200 hover:shadow-card-hover transition-all duration-200"
        >
          <div className={cn(
            'w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform duration-200',
            cat.color
          )}>
            {cat.emoji}
          </div>
          <span className="text-sm font-semibold text-text-primary text-center leading-tight">
            {cat.label}
          </span>
        </Link>
      ))}
    </div>
  );
}


// ── PRO BANNER ─────────────────────────────────────────────────────────
function ProBanner({ locale }: { locale: string }) {
  const isIT = locale === 'it';

  return (
    <section className="py-8">
      <div className="container-main">
        <div className="relative bg-gradient-brand rounded-3xl p-8 sm:p-10 overflow-hidden text-white">
          {/* Decorazioni */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-1/4 -translate-y-1/4" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -translate-x-1/4 translate-y-1/4" />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5" />
                <span className="text-sm font-semibold text-white/80 uppercase tracking-wider">
                  {isIT ? 'Piano Pro' : 'Pro Plan'}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black mb-2">
                {isIT ? 'Cucinare senza limiti' : 'Cook without limits'}
              </h2>
              <p className="text-white/80 text-sm sm:text-base max-w-md">
                {isIT
                  ? 'Valori nutrizionali, lista spesa automatica, raccolte illimitate. Solo 4,99€/mese.'
                  : 'Nutrition facts, automatic shopping list, unlimited collections. Only €4.99/month.'}
              </p>
            </div>
            <Link
              href={`/${locale}/pro`}
              className="shrink-0 flex items-center gap-2 px-6 py-3 bg-white text-brand-600 rounded-2xl font-bold text-sm hover:bg-brand-50 transition-colors shadow-lg"
            >
              {isIT ? 'Scopri Pro' : 'Discover Pro'}
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}


// ── HELPERS ────────────────────────────────────────────────────────────
function SectionHeader({ title, href, label }: { title: string; href: string; label: string }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="section-title mb-0">{title}</h2>
      <Link
        href={href}
        className="flex items-center gap-1 text-sm font-medium text-brand-500 hover:text-brand-600 transition-colors"
      >
        {label}
        <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

function RecipeGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <RecipeCardSkeleton key={i} />
      ))}
    </div>
  );
}

function EmptyRecipes({ locale }: { locale: string }) {
  return (
    <div className="text-center py-12 text-text-muted">
      <span className="text-4xl block mb-3">🍽️</span>
      <p>{locale === 'it' ? 'Nessuna ricetta ancora. Torna presto!' : 'No recipes yet. Come back soon!'}</p>
    </div>
  );
}
