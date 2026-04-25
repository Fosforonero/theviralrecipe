import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { RecipeCard, type RecipeCardData } from '@/components/recipe/RecipeCard';

const VALID_CATEGORIES = ['antipasti','primi','secondi','contorni','dolci','bevande','snack','colazione','condimenti'];

const LABELS: Record<string, { it: string; en: string; emoji: string }> = {
  antipasti: { it: 'Antipasti',   en: 'Appetizers',   emoji: '🥗' },
  primi:     { it: 'Primi piatti',en: 'First courses', emoji: '🍝' },
  secondi:   { it: 'Secondi',     en: 'Main courses',  emoji: '🥩' },
  contorni:  { it: 'Contorni',    en: 'Side dishes',   emoji: '🥦' },
  dolci:     { it: 'Dolci',       en: 'Desserts',      emoji: '🍰' },
  bevande:   { it: 'Bevande',     en: 'Drinks',        emoji: '🥤' },
  snack:     { it: 'Snack',       en: 'Snacks',        emoji: '🍿' },
  colazione: { it: 'Colazione',   en: 'Breakfast',     emoji: '🥐' },
  condimenti:{ it: 'Condimenti',  en: 'Condiments',    emoji: '🫙' },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string; categoria: string }> }): Promise<Metadata> {
  const { locale, categoria } = await params;
  const label = LABELS[categoria];
  if (!label) return { title: 'Categoria non trovata' };
  const title = `${label.emoji} Ricette ${locale === 'it' ? label.it : label.en}`;
  return {
    title,
    description: locale === 'it'
      ? `Le migliori ricette ${label.it.toLowerCase()} virali da TikTok, Instagram e YouTube.`
      : `The best viral ${label.en.toLowerCase()} recipes from TikTok, Instagram and YouTube.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; categoria: string }>;
  searchParams: Promise<{ tag?: string; sort?: string }>;
}) {
  const { locale, categoria } = await params;
  const { tag, sort = 'viral' } = await searchParams;
  const isIT = locale === 'it';

  if (!VALID_CATEGORIES.includes(categoria)) notFound();

  const label = LABELS[categoria];
  const supabase = await createServerSupabaseClient();

  // Fetch ricette per categoria, con filtro tag opzionale
  let query = supabase
    .from('recipes')
    .select('id, title_it, title_en, slug_it, slug_en, image_url, category, difficulty, time_total_minutes, votes_count, views_count, saves_count, source_platform, source_author, viral_score, is_featured')
    .eq('is_published', true)
    .eq('category', categoria);

  query = sort === 'new'
    ? query.order('published_at', { ascending: false })
    : query.order('viral_score', { ascending: false });

  const { data: recipes } = await query.limit(24);

  // Fetch tags disponibili per questa categoria
  const { data: tagData } = await supabase
    .from('recipe_tags')
    .select('tags(slug, name_it, name_en, icon)')
    .in('recipe_id', recipes?.map((r) => r.id) ?? []);

  const uniqueTags = [...new Map(
    (tagData ?? [])
      .flatMap((rt: any) => (Array.isArray(rt?.tags) ? rt.tags : rt?.tags ? [rt.tags] : []))
      .map((t: any) => [t.slug, t] as const)
  ).values()];

  const categoriesUrl = `/${locale}/${isIT ? 'categorie' : 'categories'}`;
  const currentUrl = `${categoriesUrl}/${categoria}`;

  return (
    <div className="pt-header py-12 sm:py-16">
      <div className="container-main">
        {/* Breadcrumb */}
        <nav className="text-sm text-text-muted mb-6">
          <a href={categoriesUrl} className="hover:text-text-primary transition-colors">
            {isIT ? 'Categorie' : 'Categories'}
          </a>
          <span className="mx-2">/</span>
          <span className="text-text-primary font-medium">{isIT ? label.it : label.en}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="section-title text-3xl sm:text-4xl mb-2">
            {label.emoji} {isIT ? label.it : label.en}
          </h1>
          <p className="text-text-secondary">
            {(recipes?.length ?? 0)} {isIT ? 'ricette virali' : 'viral recipes'}
          </p>
        </div>

        {/* Filtri: sort + tag */}
        <div className="flex flex-wrap gap-3 mb-8">
          {/* Sort */}
          <div className="flex gap-1 p-1 bg-background-muted rounded-2xl">
            {[
              { key: 'viral', label: isIT ? '🔥 Virali' : '🔥 Viral' },
              { key: 'new',   label: isIT ? '✨ Nuove' : '✨ New' },
            ].map((s) => (
              <a
                key={s.key}
                href={`${currentUrl}?sort=${s.key}${tag ? `&tag=${tag}` : ''}`}
                className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${
                  sort === s.key ? 'bg-background-card text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {s.label}
              </a>
            ))}
          </div>

          {/* Tag filter */}
          {uniqueTags.slice(0, 8).map((t) => (
            <a
              key={t.slug}
              href={`${currentUrl}?sort=${sort}&tag=${t.slug}`}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-all ${
                tag === t.slug
                  ? 'bg-brand-500 text-white border-brand-500'
                  : 'bg-background-card text-text-secondary border-border hover:border-brand-300'
              }`}
            >
              {t.icon} {isIT ? t.name_it : t.name_en}
            </a>
          ))}
        </div>

        {/* Grid ricette */}
        {recipes?.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 card-grid">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe as RecipeCardData} locale={locale} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-text-muted">
            <span className="text-5xl block mb-4">{label.emoji}</span>
            <p>{isIT ? 'Nessuna ricetta ancora. Torna presto!' : 'No recipes yet. Come back soon!'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
