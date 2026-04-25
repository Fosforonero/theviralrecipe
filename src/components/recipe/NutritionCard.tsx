import Link from 'next/link';
import { Lock, Star } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

interface NutritionData {
  calories: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  fiber_g: number | null;
  sugar_g: number | null;
  sodium_mg: number | null;
  per_serving: boolean;
}

interface NutritionCardProps {
  nutrition: NutritionData | null;
  /** Se l'utente è Pro, mostra i dati; altrimenti mostra blur + CTA */
  isPro?: boolean;
  locale: string;
  proUrl: string;
  className?: string;
}

/**
 * NutritionCard — Server Component (non ha interazioni client)
 * Mostra i valori nutrizionali oppure il paywall Pro.
 */
export function NutritionCard({ nutrition, isPro = false, locale, proUrl, className }: NutritionCardProps) {
  const isIT = locale === 'it';

  // Se non ci sono dati nutrizionali (non ancora calcolati), non mostrare nulla
  if (!nutrition) return null;

  return (
    <div className={cn('bg-background-card rounded-3xl border border-border overflow-hidden mb-8', className)}>
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <h2 className="font-bold text-base flex items-center gap-2">
          📊 {isIT ? 'Valori nutrizionali' : 'Nutrition facts'}
          <span className="badge badge-pro text-xs">PRO</span>
        </h2>
        <span className="text-xs text-text-muted">
          {isIT ? 'Per porzione' : 'Per serving'}
        </span>
      </div>

      <div className="relative p-6">
        {/* I valori nutrizionali — visibili solo ai Pro */}
        <div className={cn(
          'grid grid-cols-2 sm:grid-cols-4 gap-4 transition-all duration-300',
          !isPro && 'blur-sm pointer-events-none select-none'
        )}>
          <NutrientBox
            label={isIT ? 'Calorie' : 'Calories'}
            value={nutrition.calories ?? 0}
            unit="kcal"
            color="text-brand-500"
          />
          <NutrientBox
            label={isIT ? 'Proteine' : 'Protein'}
            value={nutrition.protein_g ?? 0}
            unit="g"
            color="text-blue-500"
          />
          <NutrientBox
            label={isIT ? 'Carboidrati' : 'Carbs'}
            value={nutrition.carbs_g ?? 0}
            unit="g"
            color="text-amber-500"
          />
          <NutrientBox
            label={isIT ? 'Grassi' : 'Fat'}
            value={nutrition.fat_g ?? 0}
            unit="g"
            color="text-green-500"
          />
          {nutrition.fiber_g && (
            <NutrientBox label={isIT ? 'Fibre' : 'Fiber'} value={nutrition.fiber_g} unit="g" />
          )}
          {nutrition.sugar_g && (
            <NutrientBox label={isIT ? 'Zuccheri' : 'Sugars'} value={nutrition.sugar_g} unit="g" />
          )}
          {nutrition.sodium_mg && (
            <NutrientBox label="Sodio" value={Math.round(nutrition.sodium_mg)} unit="mg" />
          )}
        </div>

        {/* Paywall overlay per utenti Free */}
        {!isPro && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6">
            <div className="flex items-center gap-2 text-text-secondary">
              <Lock className="w-5 h-5" />
              <span className="font-semibold">
                {isIT ? 'Sblocca con Pro' : 'Unlock with Pro'}
              </span>
            </div>
            <p className="text-sm text-text-muted text-center max-w-xs">
              {isIT
                ? 'I valori nutrizionali di tutte le ricette sono disponibili per gli utenti Pro.'
                : 'Full nutrition facts for all recipes are available to Pro users.'}
            </p>
            <Link
              href={proUrl}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-brand text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity shadow-sm"
            >
              <Star className="w-4 h-4" fill="white" />
              {isIT ? 'Scopri Pro — 4,99€/mese' : 'Discover Pro — €4.99/month'}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function NutrientBox({ label, value, unit, color }: {
  label: string; value: number; unit: string; color?: string;
}) {
  return (
    <div className="text-center p-4 bg-background-muted rounded-2xl">
      <p className={cn('text-2xl font-black mb-1', color ?? 'text-text-primary')}>
        {value}
        <span className="text-sm font-normal text-text-muted ml-0.5">{unit}</span>
      </p>
      <p className="text-xs text-text-secondary">{label}</p>
    </div>
  );
}
