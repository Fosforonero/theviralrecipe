import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getServerUserWithProfile } from '@/lib/supabase/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { RecipeCard, type RecipeCardData } from '@/components/recipe/RecipeCard';
import { Star, Bookmark, FolderOpen, ShoppingCart, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

export default async function ProfiloPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { locale }    = await params;
  const { tab = 'saved' } = await searchParams;
  const isIT = locale === 'it';

  // Redirect se non autenticato
  const { user, profile } = await getServerUserWithProfile();
  if (!user || !profile) {
    redirect(`/${locale}/login`);
  }

  const supabase = await createServerSupabaseClient();
  const isPro = profile.plan === 'pro';

  // Fetch contenuti in base al tab attivo
  let savedRecipes: RecipeCardData[] = [];
  let collections: { id: string; name: string; emoji: string; recipe_count: number }[] = [];

  if (tab === 'saved') {
    const { data } = await supabase
      .from('saved_recipes')
      .select(`
        recipe:recipes(id, title_it, title_en, slug_it, slug_en, image_url, category, difficulty, time_total_minutes, votes_count, views_count, saves_count, source_platform, source_author, viral_score, is_featured)
      `)
      .eq('user_id', user.id)
      .order('saved_at', { ascending: false })
      .limit(12);

    savedRecipes = (data ?? []).map((d) => d.recipe).filter(Boolean) as RecipeCardData[];
  }

  if (tab === 'collections') {
    const { data } = await supabase
      .from('collections')
      .select('id, name, emoji, recipe_count')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    collections = data ?? [];
  }

  const profileUrl = `/${locale}/${isIT ? 'profilo' : 'profile'}`;

  const tabs = [
    { key: 'saved',       icon: <Bookmark className="w-4 h-4" />,     label: isIT ? 'Salvate' : 'Saved' },
    { key: 'collections', icon: <FolderOpen className="w-4 h-4" />,   label: isIT ? 'Raccolte' : 'Collections', pro: false },
    { key: 'shopping',    icon: <ShoppingCart className="w-4 h-4" />, label: isIT ? 'Lista spesa' : 'Shopping list', pro: true },
  ];

  return (
    <div className="pt-header py-12 sm:py-16">
      <div className="container-main">
        <div className="grid lg:grid-cols-[280px_1fr] gap-8">

          {/* ── SIDEBAR PROFILO ───────────────────────────────── */}
          <aside className="space-y-4">
            {/* Card avatar + nome */}
            <div className="bg-background-card rounded-3xl border border-border p-6 text-center">
              {/* Avatar */}
              <div className="relative w-20 h-20 mx-auto mb-4">
                {profile.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={profile.display_name ?? ''}
                    fill
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-brand flex items-center justify-center text-white text-2xl font-bold">
                    {(profile.display_name ?? profile.username ?? 'U')[0].toUpperCase()}
                  </div>
                )}

                {/* Badge Pro */}
                {isPro && (
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-gradient-brand rounded-full flex items-center justify-center shadow-sm">
                    <Star className="w-3.5 h-3.5 text-white" fill="white" />
                  </div>
                )}
              </div>

              <h1 className="font-bold text-lg text-text-primary">
                {profile.display_name ?? profile.username ?? user.email}
              </h1>
              <p className="text-sm text-text-muted">{user.email}</p>

              {/* Piano */}
              <div className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mt-3',
                isPro ? 'bg-gradient-brand text-white' : 'bg-background-muted text-text-secondary'
              )}>
                {isPro ? <><Star className="w-3 h-3" fill="white" /> Pro</> : isIT ? 'Piano Free' : 'Free plan'}
              </div>

              {!isPro && (
                <Link
                  href={`/${locale}/pro`}
                  className="btn-primary w-full justify-center mt-4 py-2.5 text-sm rounded-xl"
                >
                  {isIT ? 'Passa a Pro' : 'Go Pro'}
                </Link>
              )}
            </div>

            {/* Statistiche */}
            <div className="bg-background-card rounded-3xl border border-border p-6">
              <h3 className="font-semibold text-sm text-text-secondary mb-4">
                {isIT ? 'Le tue statistiche' : 'Your stats'}
              </h3>
              <div className="space-y-3">
                <StatRow label={isIT ? 'Ricette salvate' : 'Saved recipes'} value={profile.saved_recipes_count ?? 0} />
                <StatRow label={isIT ? 'Raccolte' : 'Collections'} value={collections.length} />
              </div>
            </div>

            {/* Impostazioni + Logout */}
            <div className="bg-background-card rounded-3xl border border-border p-4 space-y-1">
              <Link
                href={`/${locale}/impostazioni`}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-secondary hover:text-text-primary hover:bg-background-muted transition-colors"
              >
                <Settings className="w-4 h-4" />
                {isIT ? 'Impostazioni' : 'Settings'}
              </Link>
              <form action={`/api/auth/logout`} method="POST">
                <button
                  type="submit"
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  {isIT ? 'Esci' : 'Log out'}
                </button>
              </form>
            </div>
          </aside>

          {/* ── CONTENUTO PRINCIPALE ──────────────────────────── */}
          <div>
            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-background-muted rounded-2xl mb-6 w-fit">
              {tabs.map((t) => (
                <a
                  key={t.key}
                  href={`${profileUrl}?tab=${t.key}`}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
                    tab === t.key
                      ? 'bg-background-card text-text-primary shadow-sm'
                      : 'text-text-secondary hover:text-text-primary',
                    t.pro && !isPro && 'opacity-50'
                  )}
                >
                  {t.icon}
                  {t.label}
                  {t.pro && <span className="badge badge-pro text-xs">PRO</span>}
                </a>
              ))}
            </div>

            {/* Tab: Ricette salvate */}
            {tab === 'saved' && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-lg">{isIT ? 'Ricette salvate' : 'Saved recipes'}</h2>
                  {!isPro && (
                    <p className="text-xs text-text-muted">
                      {savedRecipes.length}/10 {isIT ? '(limite free)' : '(free limit)'}
                    </p>
                  )}
                </div>
                {savedRecipes.length ? (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {savedRecipes.map((r) => (
                      <RecipeCard key={r.id} recipe={r} locale={locale} />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    emoji="🔖"
                    title={isIT ? 'Nessuna ricetta salvata' : 'No saved recipes'}
                    desc={isIT ? 'Salva le ricette che vuoi rifare premi il tasto 🔖' : 'Save recipes you want to make again using the 🔖 button'}
                  />
                )}
              </>
            )}

            {/* Tab: Raccolte */}
            {tab === 'collections' && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-lg">{isIT ? 'Le mie raccolte' : 'My collections'}</h2>
                  <button className="btn-primary py-2 px-4 text-sm rounded-xl">
                    {isIT ? '+ Nuova raccolta' : '+ New collection'}
                  </button>
                </div>
                {collections.length ? (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {collections.map((col) => (
                      <Link
                        key={col.id}
                        href={`${profileUrl}/raccolte/${col.id}`}
                        className="card p-5 flex items-center gap-4"
                      >
                        <div className="w-12 h-12 bg-background-muted rounded-2xl flex items-center justify-center text-2xl">
                          {col.emoji}
                        </div>
                        <div>
                          <p className="font-semibold text-text-primary">{col.name}</p>
                          <p className="text-sm text-text-muted">{col.recipe_count} {isIT ? 'ricette' : 'recipes'}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <EmptyState emoji="📁" title={isIT ? 'Nessuna raccolta' : 'No collections'} desc={isIT ? 'Crea una raccolta per organizzare le tue ricette preferite' : 'Create a collection to organize your favorite recipes'} />
                )}
              </>
            )}

            {/* Tab: Lista spesa (Pro) */}
            {tab === 'shopping' && !isPro && (
              <div className="text-center py-16 bg-background-card rounded-3xl border border-border">
                <p className="text-4xl mb-4">🛒</p>
                <h3 className="font-bold text-lg mb-2">{isIT ? 'Lista spesa automatica' : 'Automatic shopping list'}</h3>
                <p className="text-text-muted text-sm mb-6 max-w-xs mx-auto">
                  {isIT ? 'Genera la lista spesa da qualsiasi ricetta con un click. Solo per Pro.' : 'Generate a shopping list from any recipe with one click. Pro only.'}
                </p>
                <Link href={`/${locale}/pro`} className="btn-primary">
                  {isIT ? 'Passa a Pro' : 'Go Pro'}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-text-secondary">{label}</span>
      <span className="font-semibold text-text-primary">{value}</span>
    </div>
  );
}

function EmptyState({ emoji, title, desc }: { emoji: string; title: string; desc: string }) {
  return (
    <div className="text-center py-12 text-text-muted">
      <p className="text-4xl mb-3">{emoji}</p>
      <p className="font-semibold text-text-primary mb-1">{title}</p>
      <p className="text-sm">{desc}</p>
    </div>
  );
}
