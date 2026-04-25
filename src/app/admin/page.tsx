/**
 * ADMIN DASHBOARD
 *
 * Accessibile solo a utenti admin (da definire in Supabase via policy).
 * Non ha routing i18n — sempre in italiano per il team.
 */

import Link from 'next/link';
import Image from 'next/image';
import { createServerSupabaseAdminClient } from '@/lib/supabase/server';
import { CheckCircle2, XCircle, Clock, Eye, RefreshCw, Flame } from 'lucide-react';
import { formatRelativeDate, shimmerDataUrl } from '@/lib/utils';

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status = 'pending' } = await searchParams;
  const supabase = await createServerSupabaseAdminClient();

  // Statistiche rapide
  const [pipelineStats, recipeStats] = await Promise.all([
    supabase.from('pipeline_jobs').select('status'),
    supabase.from('recipes').select('is_published'),
  ]);

  const pipelineCounts = (pipelineStats.data ?? []).reduce((acc: Record<string, number>, r) => {
    acc[r.status] = (acc[r.status] ?? 0) + 1; return acc;
  }, {});

  const recipeCounts = {
    published:   (recipeStats.data ?? []).filter((r) => r.is_published).length,
    unpublished: (recipeStats.data ?? []).filter((r) => !r.is_published).length,
  };

  // Ricette in attesa di approvazione (generate dalla pipeline, non ancora pubblicate)
  const { data: pendingRecipes } = await supabase
    .from('recipes')
    .select('id, title_it, slug_it, image_url, category, created_at, source_platform, source_url, source_author, votes_count')
    .eq('is_published', false)
    .order('created_at', { ascending: false })
    .limit(20);

  return (
    <div className="min-h-screen bg-background p-6 sm:p-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-text-primary flex items-center gap-2">
              <Flame className="w-6 h-6 text-brand-500" />
              TheViralRecipe — Admin
            </h1>
            <p className="text-text-muted text-sm mt-1">Dashboard di controllo e approvazione ricette</p>
          </div>
          <Link href="/" className="btn-secondary text-sm py-2 px-4 rounded-xl">
            Vai al sito
          </Link>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard label="Ricette pubblicate"  value={recipeCounts.published}           color="text-green-600" />
          <StatCard label="In attesa review"    value={recipeCounts.unpublished}          color="text-amber-600" />
          <StatCard label="Pipeline completati" value={pipelineCounts['done'] ?? 0}      color="text-blue-600" />
          <StatCard label="Pipeline errori"     value={pipelineCounts['error'] ?? 0}     color="text-red-600" />
        </div>

        {/* Azioni rapide */}
        <div className="flex gap-3 mb-8">
          <form action="/api/cron/discover" method="GET">
            <button className="btn-secondary text-sm py-2 px-4 rounded-xl flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Avvia discovery manuale
            </button>
          </form>
          <Link href="/admin/pipeline" className="btn-secondary text-sm py-2 px-4 rounded-xl">
            <Clock className="w-4 h-4 inline mr-1.5" />
            Coda pipeline ({pipelineCounts['pending'] ?? 0} pending)
          </Link>
        </div>

        {/* Ricette da approvare */}
        <div>
          <h2 className="font-bold text-lg mb-4">
            📋 Ricette da approvare ({pendingRecipes?.length ?? 0})
          </h2>

          {pendingRecipes?.length ? (
            <div className="space-y-3">
              {pendingRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="bg-background-card rounded-2xl border border-border p-4 flex items-center gap-4"
                >
                  {/* Thumbnail */}
                  {recipe.image_url && (
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                      <Image
                        src={recipe.image_url}
                        alt={recipe.title_it}
                        fill
                        sizes="64px"
                        className="object-cover"
                        placeholder="blur"
                        blurDataURL={shimmerDataUrl}
                      />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-text-primary line-clamp-1">{recipe.title_it}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-text-muted capitalize">{recipe.category}</span>
                      {recipe.source_platform && (
                        <span className="text-xs text-text-muted">• {recipe.source_platform}</span>
                      )}
                      {recipe.source_author && (
                        <span className="text-xs text-text-muted">• @{recipe.source_author}</span>
                      )}
                      <span className="text-xs text-text-muted">
                        • {formatRelativeDate(recipe.created_at, 'it')}
                      </span>
                    </div>
                  </div>

                  {/* Azioni */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/it/ricette/${recipe.slug_it}?preview=true`}
                      className="p-2 rounded-lg hover:bg-background-muted transition-colors"
                      title="Anteprima"
                      target="_blank"
                    >
                      <Eye className="w-4 h-4 text-text-secondary" />
                    </Link>

                    {/* Approva */}
                    <form action="/api/admin/recipe/publish" method="POST">
                      <input type="hidden" name="recipeId" value={recipe.id} />
                      <input type="hidden" name="action" value="publish" />
                      <button
                        type="submit"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors"
                        title="Pubblica"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Pubblica
                      </button>
                    </form>

                    {/* Rifiuta */}
                    <form action="/api/admin/recipe/publish" method="POST">
                      <input type="hidden" name="recipeId" value={recipe.id} />
                      <input type="hidden" name="action" value="reject" />
                      <button
                        type="submit"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                        title="Rifiuta"
                      >
                        <XCircle className="w-4 h-4" />
                        Rifiuta
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-background-card rounded-2xl border border-border text-text-muted">
              <p className="text-3xl mb-3">✅</p>
              <p>Nessuna ricetta in attesa di approvazione</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-background-card rounded-2xl border border-border p-5">
      <p className={`text-3xl font-black ${color}`}>{value}</p>
      <p className="text-sm text-text-muted mt-1">{label}</p>
    </div>
  );
}
