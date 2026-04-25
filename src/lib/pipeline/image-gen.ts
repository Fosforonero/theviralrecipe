/**
 * PIPELINE — FASE 4: GENERAZIONE IMMAGINE AI
 *
 * Genera un'immagine food professionale con Replicate (modello Flux).
 * L'immagine è al 100% originale e di nostra proprietà — nessun problema legale.
 *
 * Costo: ~$0.003 per immagine con Flux Schnell (il più veloce)
 * Alternativa: Flux Pro per qualità superiore ($0.055/immagine)
 */

import { createServerSupabaseAdminClient } from '@/lib/supabase/server';

/**
 * Genera un'immagine con Replicate Flux e salvala su Supabase Storage
 */
export async function generateAndStoreImage(params: {
  prompt: string;
  recipeSlug: string;
}): Promise<string | null> {
  const { prompt, recipeSlug } = params;
  const replicateToken = process.env.REPLICATE_API_TOKEN;

  if (!replicateToken) {
    console.warn('REPLICATE_API_TOKEN non configurato, skip generazione immagine');
    return null;
  }

  try {
    // ── STEP 1: Avvia la generazione su Replicate ─────────────────
    const startRes = await fetch('https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${replicateToken}`,
        'Content-Type': 'application/json',
        'Prefer': 'wait', // Aspetta il completamento (max 60s)
      },
      body: JSON.stringify({
        input: {
          prompt,
          go_fast: true,
          num_outputs: 1,
          aspect_ratio: '4:3',         // Perfetto per recipe cards
          output_format: 'webp',       // WebP per performance web
          output_quality: 90,
          num_inference_steps: 4,      // Flux Schnell: 4 steps sono ottimali
        },
      }),
    });

    if (!startRes.ok) {
      const err = await startRes.text();
      console.error('Replicate API error:', err);
      return null;
    }

    const prediction = await startRes.json();

    // Con Prefer: wait, l'output è già disponibile
    const imageUrl = prediction.output?.[0] ?? null;
    if (!imageUrl) {
      console.error('Nessun output da Replicate:', prediction);
      return null;
    }

    // ── STEP 2: Scarica l'immagine da Replicate ────────────────────
    const imageRes = await fetch(imageUrl);
    if (!imageRes.ok) return null;

    const imageBuffer = await imageRes.arrayBuffer();

    // ── STEP 3: Carica su Supabase Storage ────────────────────────
    const supabase = await createServerSupabaseAdminClient();
    const fileName = `recipes/${recipeSlug}.webp`;

    const { error: uploadError } = await supabase.storage
      .from('recipe-images')
      .upload(fileName, imageBuffer, {
        contentType: 'image/webp',
        upsert: true,    // Sovrascrive se già esiste (utile per rigenerare)
        cacheControl: '31536000', // 1 anno di cache
      });

    if (uploadError) {
      console.error('Errore upload Supabase Storage:', uploadError);
      return null;
    }

    // ── STEP 4: Ottieni URL pubblico ───────────────────────────────
    const { data: publicUrl } = supabase.storage
      .from('recipe-images')
      .getPublicUrl(fileName);

    return publicUrl.publicUrl;

  } catch (e) {
    console.error('Errore generazione immagine:', e);
    return null;
  }
}


/**
 * Verifica che il bucket Supabase Storage esista
 * Da chiamare una volta in setup
 */
export async function ensureStorageBucket(): Promise<void> {
  const supabase = await createServerSupabaseAdminClient();

  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = buckets?.some((b) => b.name === 'recipe-images');

  if (!exists) {
    await supabase.storage.createBucket('recipe-images', {
      public: true,
      allowedMimeTypes: ['image/webp', 'image/jpeg', 'image/png'],
      fileSizeLimit: 5 * 1024 * 1024, // 5MB max
    });
    console.log('Bucket recipe-images creato');
  }
}
