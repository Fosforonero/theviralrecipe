/**
 * OG Image dinamica per ogni ricetta
 * Generata on-the-fly con next/og (ImageResponse)
 *
 * URL: /og/recipe/[id]
 * Usata nei meta tag og:image della pagina ricetta
 *
 * Design: immagine della ricetta + titolo + brand
 */

import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { createServerSupabaseAdminClient } from '@/lib/supabase/server';

export const runtime = 'edge';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const locale = searchParams.get('locale') ?? 'it';

  // Fetch dati ricetta
  const supabase = await createServerSupabaseAdminClient();
  const { data: recipe } = await supabase
    .from('recipes')
    .select('title_it, title_en, image_url, category, votes_count')
    .eq('id', id)
    .single();

  const title = recipe
    ? (locale === 'it' ? recipe.title_it : recipe.title_en)
    : 'TheViralRecipe';

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          position: 'relative',
          fontFamily: 'system-ui, sans-serif',
          background: '#F8F5F0',
        }}
      >
        {/* Immagine di sfondo */}
        {recipe?.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={recipe.image_url}
            alt=""
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        )}

        {/* Overlay gradiente */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
          }}
        />

        {/* Contenuto */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '48px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #FF3A2D, #FF8C00)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
              }}
            >
              🔥
            </div>
            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '18px', fontWeight: '600' }}>
              TheViralRecipe
            </span>
          </div>

          {/* Titolo */}
          <p
            style={{
              color: 'white',
              fontSize: '52px',
              fontWeight: '900',
              lineHeight: '1.1',
              margin: 0,
              maxWidth: '900px',
            }}
          >
            {title}
          </p>

          {/* Metriche */}
          {recipe && recipe.votes_count > 0 && (
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '22px', margin: 0 }}>
              ❤️ {recipe.votes_count.toLocaleString()} voti
            </p>
          )}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
