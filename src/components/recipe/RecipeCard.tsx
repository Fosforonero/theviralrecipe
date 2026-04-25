import Image from 'next/image';
import Link from 'next/link';
import { Clock, Flame, Heart, Bookmark, ChevronUp } from 'lucide-react';
import { cn, formatCount, formatTime, getRecipeUrl, getCategoryColor, getPlatformIcon, shimmerDataUrl } from '@/lib/utils';

// Tipo che rispecchia le colonne di Supabase che ci servono per la card
export interface RecipeCardData {
  id: string;
  title_it: string;
  title_en: string;
  slug_it: string;
  slug_en: string;
  image_url: string | null;
  category: string;
  difficulty: string;
  time_total_minutes: number | null;
  votes_count: number;
  views_count: number;
  saves_count: number;
  source_platform: string | null;
  source_author: string | null;
  viral_score: number;
  is_featured: boolean;
}

interface RecipeCardProps {
  recipe: RecipeCardData;
  locale: string;
  /** Posizione nella classifica (opzionale) */
  rank?: number;
  /** Variante visiva della card */
  variant?: 'default' | 'featured' | 'compact' | 'ranking';
  className?: string;
}

/**
 * RecipeCard — componente principale per mostrare una ricetta in lista.
 *
 * Varianti:
 * - default: card standard in griglia
 * - featured: card grande in evidenza (hero della sezione)
 * - compact: card piccola per sidebar/mobile
 * - ranking: card con numero posizione in classifica
 */
export function RecipeCard({ recipe, locale, rank, variant = 'default', className }: RecipeCardProps) {
  const title = locale === 'it' ? recipe.title_it : recipe.title_en;
  const href  = getRecipeUrl(locale === 'it' ? recipe.slug_it : recipe.slug_en, locale);
  const isTopThree = rank !== undefined && rank <= 3;

  if (variant === 'ranking') {
    return <RankingCard recipe={recipe} locale={locale} rank={rank!} title={title} href={href} className={className} />;
  }

  if (variant === 'compact') {
    return <CompactCard recipe={recipe} locale={locale} title={title} href={href} className={className} />;
  }

  if (variant === 'featured') {
    return <FeaturedCard recipe={recipe} locale={locale} title={title} href={href} className={className} />;
  }

  // ── DEFAULT CARD ─────────────────────────────────────────────────
  return (
    <article
      className={cn(
        'group card cursor-pointer animate-fade-in-up',
        className
      )}
    >
      <Link href={href} className="block">
        {/* Immagine */}
        <div className="relative aspect-recipe overflow-hidden">
          {recipe.image_url ? (
            <Image
              src={recipe.image_url}
              alt={title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              placeholder="blur"
              blurDataURL={shimmerDataUrl}
            />
          ) : (
            <div className="w-full h-full bg-background-muted flex items-center justify-center">
              <span className="text-4xl">🍽️</span>
            </div>
          )}

          {/* Overlay gradiente */}
          <div className="img-gradient" />

          {/* Badge categoria */}
          <div className="absolute top-3 left-3">
            <span className={cn('badge text-xs', getCategoryColor(recipe.category))}>
              {getCategoryLabel(recipe.category, locale)}
            </span>
          </div>

          {/* Badge fonte social */}
          {recipe.source_platform && (
            <div className="absolute top-3 right-3">
              <span className="text-lg leading-none">
                {getPlatformIcon(recipe.source_platform)}
              </span>
            </div>
          )}

          {/* Metriche in basso a sinistra */}
          <div className="absolute bottom-3 left-3 flex items-center gap-3">
            <MetricBadge icon={<Heart className="w-3 h-3" />} value={formatCount(recipe.votes_count)} />
            {recipe.time_total_minutes && (
              <MetricBadge icon={<Clock className="w-3 h-3" />} value={formatTime(recipe.time_total_minutes)} />
            )}
          </div>
        </div>

        {/* Testo */}
        <div className="p-4">
          <h3 className="font-bold text-base text-text-primary line-clamp-2 group-hover:text-brand-500 transition-colors duration-150 mb-1">
            {title}
          </h3>

          {recipe.source_author && (
            <p className="text-xs text-text-muted">
              @{recipe.source_author}
            </p>
          )}
        </div>
      </Link>
    </article>
  );
}


// ── VARIANTE: FEATURED ───────────────────────────────────────────────
function FeaturedCard({ recipe, locale, title, href, className }: {
  recipe: RecipeCardData; locale: string; title: string; href: string; className?: string;
}) {
  return (
    <article className={cn('group relative rounded-3xl overflow-hidden cursor-pointer shadow-lg', className)}>
      <Link href={href} className="block">
        {/* Immagine grande */}
        <div className="relative h-80 sm:h-96">
          {recipe.image_url ? (
            <Image
              src={recipe.image_url}
              alt={title}
              fill
              sizes="(max-width: 640px) 100vw, 70vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              priority
              placeholder="blur"
              blurDataURL={shimmerDataUrl}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
              <span className="text-6xl">🍽️</span>
            </div>
          )}

          {/* Gradiente scuro per leggibilità testo */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Contenuto sovrapposto */}
          <div className="absolute inset-0 flex flex-col justify-end p-6">
            {/* Badge */}
            <div className="flex items-center gap-2 mb-3">
              <span className={cn('badge text-xs', getCategoryColor(recipe.category))}>
                {getCategoryLabel(recipe.category, locale)}
              </span>
              {recipe.source_platform && (
                <span className="text-sm">{getPlatformIcon(recipe.source_platform)}</span>
              )}
            </div>

            {/* Titolo */}
            <h3 className="font-display-title text-white text-2xl sm:text-3xl leading-tight mb-3">
              {title}
            </h3>

            {/* Metriche */}
            <div className="flex items-center gap-4 text-white/80 text-sm">
              <span className="flex items-center gap-1.5">
                <Heart className="w-4 h-4" />
                {formatCount(recipe.votes_count)}
              </span>
              {recipe.time_total_minutes && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {formatTime(recipe.time_total_minutes)}
                </span>
              )}
              {recipe.source_author && (
                <span className="text-white/60">@{recipe.source_author}</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}


// ── VARIANTE: RANKING ─────────────────────────────────────────────────
function RankingCard({ recipe, locale, rank, title, href, className }: {
  recipe: RecipeCardData; locale: string; rank: number; title: string; href: string; className?: string;
}) {
  const rankColors: Record<number, string> = {
    1: 'text-yellow-500',
    2: 'text-gray-400',
    3: 'text-amber-600',
  };
  const rankEmoji: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

  return (
    <article className={cn('group flex items-center gap-4 p-4 bg-background-card rounded-2xl border border-border hover:border-brand-200 hover:shadow-card transition-all duration-200 cursor-pointer', className)}>
      {/* Rank number */}
      <div className="shrink-0 w-10 text-center">
        {rank <= 3 ? (
          <span className="text-2xl">{rankEmoji[rank]}</span>
        ) : (
          <span className={cn('text-xl font-black', rankColors[rank] ?? 'text-text-muted')}>
            #{rank}
          </span>
        )}
      </div>

      {/* Immagine piccola */}
      <Link href={href} className="shrink-0">
        <div className="relative w-16 h-16 rounded-xl overflow-hidden">
          {recipe.image_url ? (
            <Image
              src={recipe.image_url}
              alt={title}
              fill
              sizes="64px"
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              placeholder="blur"
              blurDataURL={shimmerDataUrl}
            />
          ) : (
            <div className="w-full h-full bg-background-muted flex items-center justify-center text-2xl">🍽️</div>
          )}
        </div>
      </Link>

      {/* Testo */}
      <Link href={href} className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm text-text-primary line-clamp-2 group-hover:text-brand-500 transition-colors">
          {title}
        </h3>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-xs text-text-muted flex items-center gap-1">
            <Heart className="w-3 h-3" />
            {formatCount(recipe.votes_count)}
          </span>
          <span className={cn('text-xs', getCategoryColor(recipe.category), 'px-1.5 py-0.5 rounded-md')}>
            {getCategoryLabel(recipe.category, locale)}
          </span>
        </div>
      </Link>

      {/* Trending indicator */}
      <div className="shrink-0">
        <ChevronUp className="w-4 h-4 text-brand-500" />
      </div>
    </article>
  );
}


// ── VARIANTE: COMPACT ─────────────────────────────────────────────────
function CompactCard({ recipe, locale, title, href, className }: {
  recipe: RecipeCardData; locale: string; title: string; href: string; className?: string;
}) {
  return (
    <article className={cn('group flex items-center gap-3 cursor-pointer', className)}>
      <Link href={href} className="shrink-0">
        <div className="relative w-14 h-14 rounded-xl overflow-hidden">
          {recipe.image_url ? (
            <Image
              src={recipe.image_url}
              alt={title}
              fill
              sizes="56px"
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-background-muted flex items-center justify-center text-xl">🍽️</div>
          )}
        </div>
      </Link>

      <Link href={href} className="flex-1 min-w-0">
        <h3 className="font-medium text-sm text-text-primary line-clamp-2 group-hover:text-brand-500 transition-colors leading-snug">
          {title}
        </h3>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-text-muted flex items-center gap-1">
            <Heart className="w-3 h-3" />
            {formatCount(recipe.votes_count)}
          </span>
        </div>
      </Link>
    </article>
  );
}


// ── SKELETON LOADER ───────────────────────────────────────────────────
export function RecipeCardSkeleton({ variant = 'default' }: { variant?: RecipeCardProps['variant'] }) {
  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-3">
        <div className="skeleton w-14 h-14 rounded-xl shrink-0" />
        <div className="flex-1">
          <div className="skeleton h-4 w-full rounded mb-2" />
          <div className="skeleton h-3 w-1/2 rounded" />
        </div>
      </div>
    );
  }

  if (variant === 'ranking') {
    return (
      <div className="flex items-center gap-4 p-4 bg-background-card rounded-2xl border border-border">
        <div className="skeleton w-10 h-8 rounded" />
        <div className="skeleton w-16 h-16 rounded-xl shrink-0" />
        <div className="flex-1">
          <div className="skeleton h-4 w-full rounded mb-2" />
          <div className="skeleton h-3 w-1/3 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="skeleton aspect-recipe" />
      <div className="p-4">
        <div className="skeleton h-5 w-full rounded mb-2" />
        <div className="skeleton h-5 w-3/4 rounded mb-3" />
        <div className="skeleton h-3 w-1/2 rounded" />
      </div>
    </div>
  );
}


// ── HELPERS ───────────────────────────────────────────────────────────
function MetricBadge({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-full">
      {icon}
      {value}
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
