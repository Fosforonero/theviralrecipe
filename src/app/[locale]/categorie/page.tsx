import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return { title: t('categories_title') };
}

export default async function CategoriesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isIT = locale === 'it';
  const supabase = await createServerSupabaseClient();

  // Conta le ricette per categoria
  const { data: counts } = await supabase
    .from('recipes')
    .select('category')
    .eq('is_published', true);

  const countByCategory = (counts ?? []).reduce((acc: Record<string, number>, r) => {
    acc[r.category] = (acc[r.category] ?? 0) + 1;
    return acc;
  }, {});

  const categories = [
    { slug: 'antipasti', emoji: '🥗', label_it: 'Antipasti',  label_en: 'Appetizers',   color: 'from-orange-400 to-orange-500', desc_it: 'Stuzzichini e antipasti virali', desc_en: 'Viral starters and appetizers' },
    { slug: 'primi',     emoji: '🍝', label_it: 'Primi piatti',label_en: 'First courses', color: 'from-yellow-400 to-amber-500',  desc_it: 'Pasta, risotti e zuppe', desc_en: 'Pasta, risotto and soups' },
    { slug: 'secondi',   emoji: '🥩', label_it: 'Secondi',     label_en: 'Main courses',  color: 'from-red-400 to-rose-500',     desc_it: 'Carne, pesce e proteine', desc_en: 'Meat, fish and proteins' },
    { slug: 'contorni',  emoji: '🥦', label_it: 'Contorni',    label_en: 'Side dishes',   color: 'from-green-400 to-emerald-500',desc_it: 'Verdure e contorni creativi', desc_en: 'Vegetables and creative sides' },
    { slug: 'dolci',     emoji: '🍰', label_it: 'Dolci',       label_en: 'Desserts',      color: 'from-pink-400 to-rose-400',   desc_it: 'Torte, dolcetti e dessert', desc_en: 'Cakes, sweets and desserts' },
    { slug: 'bevande',   emoji: '🥤', label_it: 'Bevande',     label_en: 'Drinks',        color: 'from-blue-400 to-cyan-500',   desc_it: 'Cocktail, smoothie e bevande', desc_en: 'Cocktails, smoothies and drinks' },
    { slug: 'snack',     emoji: '🍿', label_it: 'Snack',       label_en: 'Snacks',        color: 'from-purple-400 to-violet-500',desc_it: 'Snack e finger food', desc_en: 'Snacks and finger food' },
    { slug: 'colazione', emoji: '🥐', label_it: 'Colazione',   label_en: 'Breakfast',     color: 'from-amber-400 to-yellow-500',desc_it: 'Colazioni dolci e salate', desc_en: 'Sweet and savory breakfast' },
    { slug: 'condimenti',emoji: '🫙', label_it: 'Condimenti',  label_en: 'Condiments',    color: 'from-teal-400 to-green-500',  desc_it: 'Salse, marinature e condimenti', desc_en: 'Sauces, marinades and condiments' },
  ];

  const baseUrl = `/${locale}/${isIT ? 'categorie' : 'categories'}`;

  return (
    <div className="pt-header py-12 sm:py-16">
      <div className="container-main">
        <div className="mb-10">
          <h1 className="section-title text-3xl sm:text-4xl mb-2">
            {isIT ? '🍽️ Tutte le categorie' : '🍽️ All categories'}
          </h1>
          <p className="text-text-secondary">
            {isIT
              ? 'Esplora le ricette virali divise per tipo di piatto.'
              : 'Explore viral recipes organized by dish type.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => {
            const count = countByCategory[cat.slug] ?? 0;
            return (
              <Link
                key={cat.slug}
                href={`${baseUrl}/${cat.slug}`}
                className="group flex items-center gap-5 p-6 bg-background-card rounded-3xl border border-border hover:border-brand-200 hover:shadow-card-hover transition-all duration-200"
              >
                {/* Icona con gradiente */}
                <div className={`shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 transition-transform duration-200`}>
                  {cat.emoji}
                </div>

                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-text-primary text-lg mb-0.5 group-hover:text-brand-500 transition-colors">
                    {isIT ? cat.label_it : cat.label_en}
                  </h2>
                  <p className="text-sm text-text-muted">
                    {isIT ? cat.desc_it : cat.desc_en}
                  </p>
                  {count > 0 && (
                    <p className="text-xs text-text-muted mt-1.5">
                      {count} {isIT ? 'ricette' : 'recipes'}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
