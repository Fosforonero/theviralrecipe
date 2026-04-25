import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Clock, Users, ChefHat, ExternalLink, Share2, Bookmark, Heart } from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { VoteButton } from '@/components/recipe/VoteButton';
import { SaveButton } from '@/components/recipe/SaveButton';
import { ShareButton } from '@/components/recipe/ShareButton';
import { NutritionCard } from '@/components/recipe/NutritionCard';
import { RecipeCard } from '@/components/recipe/RecipeCard';
import { cn, formatCount, formatTime, getCategoryColor, getPlatformIcon, shimmerDataUrl } from '@/lib/utils';

// ── METADATA SEO (dinamico per ogni ricetta) ──────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const supabase = await createServerSupabaseClient();

  const slugField = locale === 'it' ? 'slug_it' : 'slug_en';
  const { data: recipe } = await supabase
    .from('recipes')
    .select('title_it, title_en, meta_title_it, meta_title_en, meta_description_it, meta_description_en, image_url, slug_it, slug_en')
    .eq(slugField, slug)
    .eq('is_published', true)
    .single();

  if (!recipe) return { title: 'Ricetta non trovata' };

  const title  = locale === 'it' ? (recipe.meta_title_it  ?? recipe.title_it)  : (recipe.meta_title_en  ?? recipe.title_en);
  const desc   = locale === 'it' ? recipe.meta_description_it : recipe.meta_description_en;
  const baseUrl = 'https://theviralrecipe.com';

  return {
    title,
    description: desc ?? undefined,
    openGraph: {
      title,
      description: desc ?? undefined,
      images: recipe.image_url ? [{ url: recipe.image_url, width: 1200, height: 900 }] : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: desc ?? undefined,
      images: recipe.image_url ? [recipe.image_url] : [],
    },
    // hreflang per versione IT e EN
    alternates: {
      canonical: `${baseUrl}/${locale}/${locale === 'it' ? 'ricette' : 'recipes'}/${slug}`,
      languages: {
        'it': `${baseUrl}/it/ricette/${recipe.slug_it}`,
        'en': `${baseUrl}/en/recipes/${recipe.slug_en}`,
      },
    },
  };
}


// ── PAGINA RICETTA ─────────────────────────────────────────────────
export default async function RecipePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale });
  const isIT = locale === 'it';

  const supabase = await createServerSupabaseClient();
  const slugField = locale === 'it' ? 'slug_it' : 'slug_en';

  // Fetch ricetta
  const { data: recipe } = await supabase
    .from('recipes')
    .select(`
      *,
      nutrition(*),
      recipe_tags(tag_id, tags(slug, name_it, name_en, color, icon))
    `)
    .eq(slugField, slug)
    .eq('is_published', true)
    .single();

  if (!recipe) notFound();

  // Incrementa views (fire & forget)
  supabase.from('recipe_views').insert({ recipe_id: recipe.id, lang: locale }).then(() => {});

  // Titolo e contenuto nella lingua corrente
  const title       = isIT ? recipe.title_it       : recipe.title_en;
  const intro       = isIT ? recipe.intro_it        : recipe.intro_en;
  const ingredients = isIT ? recipe.ingredients_it  : recipe.ingredients_en;
  const procedure   = isIT ? recipe.procedure_it    : recipe.procedure_en;
  const tips        = isIT ? recipe.tips_it         : recipe.tips_en;

  // Ricette simili (stessa categoria, no current)
  const { data: similar } = await supabase
    .from('recipes')
    .select('id, title_it, title_en, slug_it, slug_en, image_url, category, difficulty, time_total_minutes, votes_count, views_count, saves_count, source_platform, source_author, viral_score, is_featured')
    .eq('category', recipe.category)
    .eq('is_published', true)
    .neq('id', recipe.id)
    .order('viral_score', { ascending: false })
    .limit(3);

  // Tags della ricetta
  const tags = recipe.recipe_tags?.map((rt: { tags: { slug: string; name_it: string; name_en: string; color: string; icon: string } }) => rt.tags) ?? [];

  return (
    <div className="pt-header">
      {/* ── STRUCTURED DATA JSON-LD ──────────────────────────────── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Recipe',
            name: title,
            description: intro,
            image: recipe.image_url ? [recipe.image_url] : [],
            author: {
              '@type': 'Person',
              name: recipe.source_author ?? 'TheViralRecipe',
            },
            datePublished: recipe.published_at,
            prepTime: recipe.time_prep_minutes ? `PT${recipe.time_prep_minutes}M` : undefined,
            cookTime: recipe.time_cook_minutes ? `PT${recipe.time_cook_minutes}M` : undefined,
            totalTime: recipe.time_total_minutes ? `PT${recipe.time_total_minutes}M` : undefined,
            recipeYield: `${recipe.servings} ${isIT ? 'porzioni' : 'servings'}`,
            recipeCategory: recipe.category,
            recipeCuisine: isIT ? 'Italiana' : 'International',
            recipeIngredient: (ingredients as { amount: string; unit: string; name: string }[]).map(
              (i) => `${i.amount}${i.unit} ${i.name}`
            ),
            recipeInstructions: (procedure as string[]).map((step, i) => ({
              '@type': 'HowToStep',
              position: i + 1,
              text: step,
            })),
            aggregateRating: recipe.votes_count > 0 ? {
              '@type': 'AggregateRating',
              ratingValue: '4.5',
              reviewCount: recipe.votes_count,
            } : undefined,
            nutrition: recipe.nutrition ? {
              '@type': 'NutritionInformation',
              calories: `${recipe.nutrition.calories} calories`,
              proteinContent: `${recipe.nutrition.protein_g}g`,
              carbohydrateContent: `${recipe.nutrition.carbs_g}g`,
              fatContent: `${recipe.nutrition.fat_g}g`,
            } : undefined,
          }),
        }}
      />

      {/* ── HERO IMMAGINE ──────────────────────────────────────────── */}
      <section className="relative h-72 sm:h-96 lg:h-[480px] overflow-hidden">
        {recipe.image_url ? (
          <Image
            src={recipe.image_url}
            alt={title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            placeholder="blur"
            blurDataURL={shimmerDataUrl}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand-400 to-accent-500 flex items-center justify-center">
            <span className="text-8xl">🍽️</span>
          </div>
        )}

        {/* Gradiente bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

        {/* Badges sovrapposti */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className={cn('badge', getCategoryColor(recipe.category))}>
            {getCategoryLabel(recipe.category, locale)}
          </span>
          {recipe.source_platform && (
            <span className="badge bg-black/60 text-white backdrop-blur-sm">
              {getPlatformIcon(recipe.source_platform)} {recipe.source_platform}
            </span>
          )}
        </div>
      </section>

      {/* ── CONTENUTO PRINCIPALE ──────────────────────────────────── */}
      <div className="container-content -mt-12 relative z-10 pb-16">

        {/* ── HEADER RICETTA ──────────────────────────────────────── */}
        <div className="bg-background-card rounded-3xl border border-border shadow-lg p-6 sm:p-8 mb-8">
          {/* Titolo */}
          <h1 className="font-display-title text-3xl sm:text-4xl text-text-primary mb-4 leading-tight">
            {title}
          </h1>

          {/* Info rapide */}
          <div className="flex flex-wrap gap-4 mb-6">
            {recipe.time_total_minutes && (
              <InfoChip icon={<Clock className="w-4 h-4" />} label={formatTime(recipe.time_total_minutes)} />
            )}
            <InfoChip icon={<Users className="w-4 h-4" />} label={`${recipe.servings} ${isIT ? 'porzioni' : 'servings'}`} />
            <InfoChip
              icon={<ChefHat className="w-4 h-4" />}
              label={isIT
                ? { facile: 'Facile', medio: 'Medio', difficile: 'Difficile' }[recipe.difficulty] ?? recipe.difficulty
                : { facile: 'Easy', medio: 'Medium', difficile: 'Hard' }[recipe.difficulty] ?? recipe.difficulty
              }
            />
            <div className="flex items-center gap-1.5 text-sm text-text-secondary">
              <Heart className="w-4 h-4 text-brand-500" />
              <span>{formatCount(recipe.votes_count)} {t('recipe.votes_count', { count: '' }).replace('{count} ', '')}</span>
            </div>
          </div>

          {/* Tag dieta/stile */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {tags.map((tag: { slug: string; icon: string; name_it: string; name_en: string }) => (
                <span key={tag.slug} className="inline-flex items-center gap-1 px-3 py-1 bg-background-muted rounded-full text-sm text-text-secondary">
                  {tag.icon} {isIT ? tag.name_it : tag.name_en}
                </span>
              ))}
            </div>
          )}

          {/* Intro virale */}
          <p className="text-text-secondary leading-relaxed text-base sm:text-lg border-l-4 border-brand-400 pl-4 italic">
            {intro}
          </p>

          {/* Azioni: vota, salva, condividi */}
          <div className="flex items-center gap-3 mt-6 pt-6 border-t border-border">
            <VoteButton recipeId={recipe.id} initialVotes={recipe.votes_count} />
            <SaveButton recipeId={recipe.id} />
            <ShareButton title={title} />

            {/* Link al video originale */}
            {recipe.source_url && (
              <a
                href={recipe.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto flex items-center gap-1.5 text-sm text-text-muted hover:text-text-secondary transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                {t('recipe.source_label')}
              </a>
            )}
          </div>
        </div>

        {/* ── INGREDIENTI ─────────────────────────────────────────── */}
        <div className="grid md:grid-cols-[280px_1fr] gap-6 mb-8">
          <div className="bg-background-card rounded-3xl border border-border p-6 h-fit">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              🛒 {t('recipe.ingredients')}
            </h2>
            <ul className="space-y-3">
              {(ingredients as { name: string; amount: string; unit: string; is_optional: boolean; amazon_url: string | null }[]).map((ing, i) => (
                <li key={i} className={cn(
                  'flex items-center justify-between gap-3 py-2 border-b border-border last:border-0',
                  ing.is_optional && 'opacity-60'
                )}>
                  <span className="text-text-primary font-medium">
                    {ing.name}
                    {ing.is_optional && (
                      <span className="ml-1.5 text-xs text-text-muted font-normal">
                        ({isIT ? 'opzionale' : 'optional'})
                      </span>
                    )}
                  </span>
                  <span className="text-text-secondary text-sm shrink-0 font-medium">
                    {ing.amount} {ing.unit}
                    {ing.amazon_url && (
                      <a
                        href={ing.amazon_url}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                        className="ml-2 text-accent-600 text-xs hover:underline"
                        title="Acquista su Amazon"
                      >
                        🛒
                      </a>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── PROCEDIMENTO ────────────────────────────────────────── */}
          <div className="bg-background-card rounded-3xl border border-border p-6 sm:p-8">
            <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
              👨‍🍳 {t('recipe.procedure')}
            </h2>
            <ol className="space-y-6">
              {(procedure as string[]).map((step, i) => (
                <li key={i} className="flex gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-brand-500 text-white text-sm font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-text-primary leading-relaxed pt-1">{step}</p>
                </li>
              ))}
            </ol>

            {/* Tips */}
            {tips && (
              <div className="mt-8 p-5 bg-accent-50 border border-accent-200 rounded-2xl">
                <h3 className="font-bold text-accent-700 mb-2 flex items-center gap-2">
                  💡 {t('recipe.tips')}
                </h3>
                <p className="text-text-secondary leading-relaxed">{tips}</p>
              </div>
            )}
          </div>
        </div>

        {/* ── VALORI NUTRIZIONALI (Pro) ────────────────────────────── */}
        <NutritionCard nutrition={recipe.nutrition} locale={locale} proUrl={`/${locale}/pro`} />

        {/* ── VIDEO ORIGINALE (oEmbed) ────────────────────────────── */}
        {recipe.source_embed_code && (
          <div className="bg-background-card rounded-3xl border border-border p-6 mb-8">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              {getPlatformIcon(recipe.source_platform ?? '')}
              {t('recipe.source_view')}
              {recipe.source_author && (
                <span className="text-text-muted font-normal text-sm">
                  {t('recipe.from_creator')} @{recipe.source_author_handle ?? recipe.source_author}
                </span>
              )}
            </h2>
            <div
              dangerouslySetInnerHTML={{ __html: recipe.source_embed_code }}
              className="rounded-xl overflow-hidden"
            />
            <p className="text-xs text-text-muted mt-3">
              {isIT
                ? '✓ Fonte originale linkata — tutte le ricette sono riscritte con parole nostre nel rispetto del copyright.'
                : '✓ Original source linked — all recipes are rewritten in our own words, respecting copyright.'}
            </p>
          </div>
        )}

        {/* ── RICETTE SIMILI ───────────────────────────────────────── */}
        {similar && similar.length > 0 && (
          <div>
            <h2 className="section-title">
              {t('recipe.similar')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {similar.map((r) => (
                <RecipeCard key={r.id} recipe={r as never} locale={locale} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── HELPERS ─────────────────────────────────────────────────────────

function InfoChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-sm text-text-secondary bg-background-muted px-3 py-1.5 rounded-full">
      <span className="text-text-muted">{icon}</span>
      {label}
    </div>
  );
}

function getCategoryLabel(category: string, locale: string): string {
  const labels: Record<string, { it: string; en: string }> = {
    antipasti: { it: 'Antipasti', en: 'Appetizers' },
    primi:     { it: 'Primi', en: 'First courses' },
    secondi:   { it: 'Secondi', en: 'Mains' },
    contorni:  { it: 'Contorni', en: 'Sides' },
    dolci:     { it: 'Dolci', en: 'Desserts' },
    bevande:   { it: 'Bevande', en: 'Drinks' },
    snack:     { it: 'Snack', en: 'Snacks' },
    colazione: { it: 'Colazione', en: 'Breakfast' },
    condimenti:{ it: 'Condimenti', en: 'Condiments' },
  };
  return labels[category]?.[locale as 'it' | 'en'] ?? category;
}
