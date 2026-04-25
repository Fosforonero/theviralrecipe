import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { RecipeCard, type RecipeCardData } from '@/components/recipe/RecipeCard';

// Tab per ordinamento — URL param: ?sort=weekly|monthly|alltime|trending
type SortTab = 'weekly' | 'monthly' | 'alltime' | 'trending';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: t('ranking_title'),
    description: locale === 'it'
      ? 'La classifica delle ricette virali più votate e condivise. Aggiornata ogni ora.'
      : 'The ranking of the most voted and shared viral recipes. Updated every hour.',
  };
}

export default async function ClassificaPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ sort?: string }>;
}) {
  const { locale } = await params;
  const { sort: rawSort } = await searchParams;
  const t = await getTranslations({ locale });
  const isIT = locale === 'it';

  const sort: SortTab = (['weekly', 'monthly', 'alltime', 'trending'].includes(rawSort ?? '') ? rawSort : 'weekly') as SortTab;

  const supabase = await createServerSupabaseClient();

  // Calcola il filtro data in base al tab
  let dateFilter: string | null = null;
  const now = new Date();
  if (sort === 'weekly') {
    const d = new Date(now); d.setDate(d.getDate() - 7);
    dateFilter = d.toISOString();
  } else if (sort === 'monthly') {
    const d = new Date(now); d.setMonth(d.getMonth() - 1);
    dateFilter = d.toISOString();
  }

  let query = supabase
    .from('recipes')
    .select('id, title_it, title_en, slug_it, slug_en, image_url, category, difficulty, time_total_minutes, votes_count, views_count, saves_count, source_platform, source_author, viral_score, is_featured')
    .eq('is_published', true);

  if (dateFilter) query = query.gte('published_at', dateFilter);

  // Ordine: trending usa viral_score, altrimenti votes
  query = sort === 'trending'
    ? query.order('viral_score', { ascending: false })
    : query.order('votes_count', { ascending: false });

  const { data: recipes } = await query.limit(30);

  const tabs: { key: SortTab; label: string }[] = [
    { key: 'weekly',   label: t('ranking.tab_weekly') },
    { key: 'monthly',  label: t('ranking.tab_monthly') },
    { key: 'alltime',  label: t('ranking.tab_alltime') },
    { key: 'trending', label: t('ranking.tab_trending') },
  ];

  const rankingUrl = `/${locale}/${isIT ? 'classifica' : 'ranking'}`;

  return (
    <div className="pt-header py-12 sm:py-16">
      <div className="container-main">
        {/* Header */}
        <div className="mb-8">
          <h1 className="section-title text-3xl sm:text-4xl mb-2">🏆 {t('ranking.title')}</h1>
          <p className="text-text-secondary">
            {isIT
              ? 'Le ricette più amate dalla community. Classifica aggiornata ogni ora.'
              : 'The most loved recipes by the community. Rankings updated every hour.'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-background-muted rounded-2xl mb-8 w-fit">
          {tabs.map((tab) => (
            <a
              key={tab.key}
              href={`${rankingUrl}?sort=${tab.key}`}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                sort === tab.key
                  ? 'bg-background-card text-text-primary shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {tab.label}
            </a>
          ))}
        </div>

        {/* Lista classifica */}
        {recipes?.length ? (
          <div className="space-y-3">
            {recipes.map((recipe, i) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe as RecipeCardData}
                locale={locale}
                rank={i + 1}
                variant="ranking"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-text-muted">
            <span className="text-5xl block mb-4">🍽️</span>
            <p>{isIT ? 'Nessuna ricetta ancora. Torna presto!' : 'No recipes yet. Come back soon!'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
