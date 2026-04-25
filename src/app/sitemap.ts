import type { MetadataRoute } from 'next';
import { createServerSupabaseAdminClient } from '@/lib/supabase/server';

const BASE_URL = 'https://theviralrecipe.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createServerSupabaseAdminClient();

  // Fetch tutte le ricette pubblicate
  const { data: recipes } = await supabase
    .from('recipes')
    .select('slug_it, slug_en, updated_at')
    .eq('is_published', true)
    .order('updated_at', { ascending: false });

  const recipeUrls: MetadataRoute.Sitemap = (recipes ?? []).flatMap((recipe) => [
    {
      url: `${BASE_URL}/it/ricette/${recipe.slug_it}`,
      lastModified: new Date(recipe.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      alternates: {
        languages: {
          it: `${BASE_URL}/it/ricette/${recipe.slug_it}`,
          en: `${BASE_URL}/en/recipes/${recipe.slug_en}`,
        },
      },
    },
    {
      url: `${BASE_URL}/en/recipes/${recipe.slug_en}`,
      lastModified: new Date(recipe.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ]);

  // Pagine statiche
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/it`,               priority: 1.0,  changeFrequency: 'daily' },
    { url: `${BASE_URL}/en`,               priority: 1.0,  changeFrequency: 'daily' },
    { url: `${BASE_URL}/it/classifica`,    priority: 0.9,  changeFrequency: 'hourly' },
    { url: `${BASE_URL}/en/ranking`,       priority: 0.9,  changeFrequency: 'hourly' },
    { url: `${BASE_URL}/it/categorie`,     priority: 0.8,  changeFrequency: 'weekly' },
    { url: `${BASE_URL}/en/categories`,    priority: 0.8,  changeFrequency: 'weekly' },
    { url: `${BASE_URL}/it/pro`,           priority: 0.7,  changeFrequency: 'monthly' },
    { url: `${BASE_URL}/en/pro`,           priority: 0.7,  changeFrequency: 'monthly' },
    // Categorie IT
    ...['antipasti','primi','secondi','contorni','dolci','bevande','snack','colazione','condimenti'].flatMap((cat) => [
      { url: `${BASE_URL}/it/categorie/${cat}`, priority: 0.75, changeFrequency: 'daily' as const },
      { url: `${BASE_URL}/en/categories/${cat}`, priority: 0.75, changeFrequency: 'daily' as const },
    ]),
  ];

  return [...staticPages, ...recipeUrls];
}
