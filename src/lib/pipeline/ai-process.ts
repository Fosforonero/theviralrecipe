/**
 * PIPELINE — FASE 3: AI PROCESSING
 *
 * Usa Claude API (Haiku — veloce ed economico) per:
 * 1. Estrarre la ricetta strutturata dalla trascrizione
 * 2. Tradurre IT ↔ EN
 * 3. Assegnare categoria e tag
 * 4. Generare titolo SEO, slug e meta description
 *
 * Costo stimato: ~$0.001 per ricetta (Haiku è 25x più economico di Sonnet)
 */

import Anthropic from '@anthropic-ai/sdk';
import { slugify } from '@/lib/utils';

// ── TIPI ─────────────────────────────────────────────────────────────

export interface Ingredient {
  name: string;
  amount: string;
  unit: string;
  is_optional: boolean;
  amazon_url: string | null;
}

export interface ProcessedRecipe {
  // Contenuto italiano
  title_it: string;
  slug_it: string;
  intro_it: string;
  ingredients_it: Ingredient[];
  procedure_it: string[];
  tips_it: string;
  meta_title_it: string;
  meta_description_it: string;

  // Contenuto inglese
  title_en: string;
  slug_en: string;
  intro_en: string;
  ingredients_en: Ingredient[];
  procedure_en: string[];
  tips_en: string;
  meta_title_en: string;
  meta_description_en: string;

  // Classificazione
  category: string;
  difficulty: string;
  time_prep_minutes: number | null;
  time_cook_minutes: number | null;
  servings: number;
  tags: string[];
}


// ── PROMPT PRINCIPALE ─────────────────────────────────────────────────

const SYSTEM_PROMPT = `Sei un editor culinario esperto che lavora per theviralrecipe.com.
Il tuo compito è analizzare la trascrizione di un video di cucina e creare una scheda ricetta strutturata e ottimizzata per SEO.

REGOLE FONDAMENTALI:
- Riscrivi sempre con parole tue (mai copiare verbatim dalla fonte)
- Tono: friendly, giovane, social-native — come se parlassi con un amico
- L'intro deve spiegare PERCHÉ la ricetta è virale/trending
- Gli ingredienti devono avere dosi precise (stima se non sono dette esplicitamente)
- Il procedimento deve essere chiaro, step by step, ognuno autonomo
- I tips devono aggiungere valore (varianti, sostituzioni, errori da evitare)

CATEGORIE DISPONIBILI (scegli SOLO una):
antipasti, primi, secondi, contorni, dolci, bevande, snack, colazione, condimenti

TAG DISPONIBILI (scegli tutti quelli pertinenti):
Dieta: vegano, vegetariano, senza-glutine, fit, proteico, keto, low-carb, senza-lattosio
Ingrediente: carne, pesce, pasta, riso, uova, pollo, verdure, legumi
Stile: veloce, 5-ingredienti, economico, etnico, fusion, comfort-food, gourmet
Occasione: aperitivo, cena-romantica, meal-prep, party, brunch

DIFFICOLTÀ: facile (max 5 passaggi semplici), medio (richiede attenzione), difficile (tecnica avanzata)`;

function buildUserPrompt(
  transcript: string,
  sourceTitle?: string,
  sourceAuthor?: string,
): string {
  return `Analizza questo contenuto e crea una scheda ricetta completa in JSON.

FONTE:
- Titolo originale: ${sourceTitle ?? 'non disponibile'}
- Creator: ${sourceAuthor ?? 'non disponibile'}
- Trascrizione: """
${transcript.slice(0, 8000)}
"""

Rispondi SOLO con JSON valido, senza markdown, senza spiegazioni. Il formato esatto è:

{
  "title_it": "Titolo SEO-ottimizzato in italiano (max 70 char)",
  "intro_it": "Paragrafo introduttivo che spiega perché è virale (2-3 frasi, tono social)",
  "ingredients_it": [
    {"name": "nome ingrediente", "amount": "200", "unit": "g", "is_optional": false}
  ],
  "procedure_it": ["Step 1: descrizione chiara", "Step 2: ...", "..."],
  "tips_it": "Tips e varianti (2-3 suggerimenti pratici)",
  "title_en": "English SEO-optimized title (max 70 chars)",
  "intro_en": "English intro explaining why this recipe went viral",
  "ingredients_en": [
    {"name": "ingredient name", "amount": "200", "unit": "g", "is_optional": false}
  ],
  "procedure_en": ["Step 1: clear description", "Step 2: ...", "..."],
  "tips_en": "Tips and variations",
  "category": "una delle categorie",
  "difficulty": "facile|medio|difficile",
  "time_prep_minutes": 15,
  "time_cook_minutes": 30,
  "servings": 4,
  "tags": ["tag1", "tag2", "tag3"]
}

Se la trascrizione non contiene chiaramente una ricetta, rispondi con: {"error": "not_a_recipe"}`;
}


// ── FUNZIONE PRINCIPALE ───────────────────────────────────────────────

/**
 * Processa una trascrizione e genera la ricetta strutturata completa
 */
export async function processRecipeWithAI(params: {
  transcript: string;
  sourceTitle?: string;
  sourceAuthor?: string;
}): Promise<ProcessedRecipe | null> {
  const { transcript, sourceTitle, sourceAuthor } = params;

  if (!transcript?.trim()) return null;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('[ai-process] ANTHROPIC_API_KEY non configurata');
    return null;
  }

  const anthropic = new Anthropic({ apiKey });

  try {
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: buildUserPrompt(transcript, sourceTitle, sourceAuthor),
        },
      ],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    if (!text) return null;

    // Parse JSON (Claude Haiku è molto affidabile con JSON)
    let raw: Record<string, unknown>;
    try {
      // Rimuovi eventuale markdown se presente
      const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      raw = JSON.parse(cleaned);
    } catch {
      console.error('Errore parse JSON da Claude:', text.slice(0, 200));
      return null;
    }

    // Controlla se non è una ricetta
    if (raw.error === 'not_a_recipe') {
      console.log('Video non contiene una ricetta, skip');
      return null;
    }

    // Genera slug puliti e unici (aggiungi timestamp per unicità)
    const ts = Date.now().toString(36);
    const slug_it = `${slugify(raw.title_it as string)}-${ts}`;
    const slug_en = `${slugify(raw.title_en as string)}-${ts}`;

    // Genera meta SEO se non presenti (Haiku a volte le omette)
    const meta_title_it  = `${(raw.title_it as string).slice(0, 55)} | TheViralRecipe`;
    const meta_title_en  = `${(raw.title_en as string).slice(0, 55)} | TheViralRecipe`;
    const meta_desc_it   = (raw.intro_it as string)?.slice(0, 155) ?? meta_title_it;
    const meta_desc_en   = (raw.intro_en as string)?.slice(0, 155) ?? meta_title_en;

    // Aggiungi amazon_url null a tutti gli ingredienti (popolato dopo in fase affiliate)
    const enrichIngredients = (arr: unknown[]): Ingredient[] =>
      (arr as Ingredient[]).map((ing) => ({ ...ing, amazon_url: null }));

    return {
      title_it:            raw.title_it as string,
      slug_it,
      intro_it:            raw.intro_it as string,
      ingredients_it:      enrichIngredients(raw.ingredients_it as unknown[]),
      procedure_it:        raw.procedure_it as string[],
      tips_it:             raw.tips_it as string,
      meta_title_it,
      meta_description_it: meta_desc_it,

      title_en:            raw.title_en as string,
      slug_en,
      intro_en:            raw.intro_en as string,
      ingredients_en:      enrichIngredients(raw.ingredients_en as unknown[]),
      procedure_en:        raw.procedure_en as string[],
      tips_en:             raw.tips_en as string,
      meta_title_en,
      meta_description_en: meta_desc_en,

      category:            raw.category as string,
      difficulty:          raw.difficulty as string,
      time_prep_minutes:   (raw.time_prep_minutes as number) ?? null,
      time_cook_minutes:   (raw.time_cook_minutes as number) ?? null,
      servings:            (raw.servings as number) ?? 4,
      tags:                (raw.tags as string[]) ?? [],
    };
  } catch (e) {
    console.error('Errore Claude API:', e);
    return null;
  }
}


/**
 * Genera un prompt per l'immagine AI basato sulla ricetta
 * (usato da image-gen.ts)
 */
export function generateImagePrompt(recipe: ProcessedRecipe): string {
  const ingredients = recipe.ingredients_en.slice(0, 4).map((i) => i.name).join(', ');
  return [
    `Professional food photography of ${recipe.title_en}.`,
    `Key ingredients: ${ingredients}.`,
    'Style: editorial food photo, natural lighting, shallow depth of field.',
    'Shot: overhead or 45-degree angle, clean white or rustic wooden surface.',
    'Mood: appetizing, fresh, modern food blog aesthetic.',
    'Ultra-high quality, 8K, photorealistic, Michelin star presentation.',
    'No text, no watermarks, no people.',
  ].join(' ');
}
