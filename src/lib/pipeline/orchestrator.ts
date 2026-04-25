/**
 * PIPELINE — ORCHESTRATOR
 *
 * Coordina tutte le fasi del pipeline per un singolo job:
 * pending → extract → ai_process → image_gen → nutrition → done
 *
 * Chiamato dalla Supabase Edge Function o dal Route Handler /api/pipeline/process
 */

import { createServerSupabaseAdminClient } from '@/lib/supabase/server';
import { extractFromSource } from './extract';
import { processRecipeWithAI, generateImagePrompt } from './ai-process';
import { generateAndStoreImage } from './image-gen';
import { calculateNutrition, ingredientsToStrings } from './nutrition';

/**
 * Processa un singolo pipeline job dall'inizio alla fine
 */
export async function processPipelineJob(jobId: string): Promise<{
  success: boolean;
  recipeId?: string;
  error?: string;
}> {
  const supabase = await createServerSupabaseAdminClient();

  // ── Segna il job come "in processing" ─────────────────────────
  await supabase
    .from('pipeline_jobs')
    .update({
      status: 'processing',
      started_at: new Date().toISOString(),
      attempts: supabase.rpc('increment', { x: 1 }),  // incrementa attempts
    })
    .eq('id', jobId);

  // Recupera il job
  const { data: job, error: jobError } = await supabase
    .from('pipeline_jobs')
    .select('*')
    .eq('id', jobId)
    .single();

  if (jobError || !job) {
    return { success: false, error: 'Job non trovato' };
  }

  try {
    // ── FASE 1: EXTRACTION ──────────────────────────────────────
    console.log(`[Pipeline] Job ${jobId}: extraction...`);
    await updateJobStep(supabase, jobId, 'transcription');

    const { transcript, metadata } = await extractFromSource(
      job.source_url,
      job.source_platform,
    );

    if (!transcript) {
      return await failJob(supabase, jobId, 'transcription', 'Impossibile ottenere trascrizione');
    }

    // Salva trascrizione nel job (utile per debug/retry)
    await supabase
      .from('pipeline_jobs')
      .update({ transcript: transcript.slice(0, 10000) })
      .eq('id', jobId);

    // ── FASE 2: AI PROCESSING ─────────────────────────────────────
    console.log(`[Pipeline] Job ${jobId}: AI processing...`);
    await updateJobStep(supabase, jobId, 'ai_extraction');

    const recipe = await processRecipeWithAI({
      transcript,
      sourceTitle:  metadata.title,
      sourceAuthor: metadata.author,
    });

    if (!recipe) {
      return await failJob(supabase, jobId, 'ai_extraction', 'Video non contiene una ricetta valida');
    }

    // Salva raw JSON (per debug)
    await supabase
      .from('pipeline_jobs')
      .update({ raw_recipe_json: recipe })
      .eq('id', jobId);

    // ── FASE 3: GENERAZIONE IMMAGINE ────────────────────────────
    console.log(`[Pipeline] Job ${jobId}: image generation...`);
    await updateJobStep(supabase, jobId, 'image_gen');

    const imagePrompt = generateImagePrompt(recipe);
    const imageUrl = await generateAndStoreImage({
      prompt: imagePrompt,
      recipeSlug: recipe.slug_it,
    });

    // ── FASE 4: INSERIMENTO RICETTA IN DATABASE ──────────────────
    console.log(`[Pipeline] Job ${jobId}: saving recipe...`);
    await updateJobStep(supabase, jobId, 'db_insert');

    const { data: newRecipe, error: insertError } = await supabase
      .from('recipes')
      .insert({
        // Contenuto IT
        title_it:            recipe.title_it,
        slug_it:             recipe.slug_it,
        intro_it:            recipe.intro_it,
        ingredients_it:      recipe.ingredients_it,
        procedure_it:        recipe.procedure_it,
        tips_it:             recipe.tips_it,
        meta_title_it:       recipe.meta_title_it,
        meta_description_it: recipe.meta_description_it,

        // Contenuto EN
        title_en:            recipe.title_en,
        slug_en:             recipe.slug_en,
        intro_en:            recipe.intro_en,
        ingredients_en:      recipe.ingredients_en,
        procedure_en:        recipe.procedure_en,
        tips_en:             recipe.tips_en,
        meta_title_en:       recipe.meta_title_en,
        meta_description_en: recipe.meta_description_en,

        // Classificazione
        category:            recipe.category,
        difficulty:          recipe.difficulty,
        time_prep_minutes:   recipe.time_prep_minutes,
        time_cook_minutes:   recipe.time_cook_minutes,
        servings:            recipe.servings,

        // Fonte
        source_platform:      job.source_platform,
        source_url:           job.source_url,
        source_video_id:      job.source_video_id,
        source_author:        metadata.author,
        source_author_handle: metadata.authorHandle,
        source_embed_code:    metadata.embedCode,
        source_thumbnail_url: metadata.thumbnailUrl,

        // Immagine AI generata
        image_url:    imageUrl,
        image_prompt: imagePrompt,

        // Stato: NON pubblicata — va approvata dall'admin
        is_published:    false,
        pipeline_job_id: jobId,
      })
      .select('id')
      .single();

    if (insertError || !newRecipe) {
      return await failJob(supabase, jobId, 'db_insert', `Errore DB: ${insertError?.message}`);
    }

    const recipeId = newRecipe.id;

    // ── FASE 5: TAG ───────────────────────────────────────────────
    if (recipe.tags.length > 0) {
      // Trova gli ID dei tag dal nome
      const { data: tagRows } = await supabase
        .from('tags')
        .select('id, slug')
        .in('slug', recipe.tags);

      if (tagRows?.length) {
        await supabase.from('recipe_tags').insert(
          tagRows.map((tag) => ({ recipe_id: recipeId, tag_id: tag.id }))
        );
      }
    }

    // ── FASE 6: VALORI NUTRIZIONALI ───────────────────────────────
    console.log(`[Pipeline] Job ${jobId}: nutrition...`);
    const ingredientStrings = ingredientsToStrings(recipe.ingredients_en as never[]);
    const nutrition = await calculateNutrition(ingredientStrings, recipe.servings);

    if (nutrition) {
      await supabase.from('nutrition').insert({
        recipe_id:  recipeId,
        ...nutrition,
        source: 'edamam',
      });
    }

    // ── JOB COMPLETATO ─────────────────────────────────────────────
    await supabase
      .from('pipeline_jobs')
      .update({
        status:       'done',
        recipe_id:    recipeId,
        completed_at: new Date().toISOString(),
        error_step:   null,
        error_message: null,
      })
      .eq('id', jobId);

    console.log(`[Pipeline] Job ${jobId}: COMPLETATO → Ricetta ${recipeId}`);
    return { success: true, recipeId };

  } catch (e) {
    const errMsg = e instanceof Error ? e.message : String(e);
    console.error(`[Pipeline] Job ${jobId} ERRORE:`, errMsg);
    return await failJob(supabase, jobId, 'unknown', errMsg);
  }
}


/**
 * Processa tutti i job in coda (status = 'pending')
 * Chiamato dal Cron Job — processa max 5 per run per evitare timeout
 */
export async function processPendingJobs(): Promise<{ processed: number; failed: number }> {
  const supabase = await createServerSupabaseAdminClient();

  const { data: pendingJobs } = await supabase
    .from('pipeline_jobs')
    .select('id')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })
    .limit(5); // Max 5 per run (ogni run è ogni 6h → max 20/giorno)

  if (!pendingJobs?.length) return { processed: 0, failed: 0 };

  let processed = 0;
  let failed = 0;

  for (const job of pendingJobs) {
    const result = await processPipelineJob(job.id);
    if (result.success) processed++;
    else failed++;

    // Pausa tra un job e l'altro per non sovraccaricare le API
    await new Promise((r) => setTimeout(r, 2000));
  }

  return { processed, failed };
}


// ── HELPERS ────────────────────────────────────────────────────────

async function updateJobStep(supabase: ReturnType<typeof createServerSupabaseAdminClient> extends Promise<infer T> ? T : never, jobId: string, step: string) {
  await supabase
    .from('pipeline_jobs')
    .update({ error_step: step })
    .eq('id', jobId);
}

async function failJob(
  supabase: ReturnType<typeof createServerSupabaseAdminClient> extends Promise<infer T> ? T : never,
  jobId: string,
  step: string,
  message: string,
) {
  await supabase
    .from('pipeline_jobs')
    .update({
      status:        'error',
      error_step:    step,
      error_message: message,
      completed_at:  new Date().toISOString(),
    })
    .eq('id', jobId);

  return { success: false, error: message };
}
