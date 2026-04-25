/**
 * PIPELINE — FASE 5: VALORI NUTRIZIONALI
 *
 * Usa Edamam Nutrition Analysis API per calcolare i macro.
 * Piano free: 10.000 chiamate/mese — sufficiente per 300 ricette/mese.
 *
 * I valori nutrizionali sono visibili SOLO agli utenti Pro (RLS su Supabase).
 */

interface EdamamNutrient {
  label: string;
  quantity: number;
  unit: string;
}

interface EdamamResponse {
  calories: number;
  totalNutrients: {
    ENERC_KCAL?: EdamamNutrient;
    PROCNT?: EdamamNutrient;   // Protein
    CHOCDF?: EdamamNutrient;   // Carbs
    FAT?: EdamamNutrient;
    FIBTG?: EdamamNutrient;    // Fiber
    SUGAR?: EdamamNutrient;
    NA?: EdamamNutrient;       // Sodium
  };
  yield: number;   // numero porzioni calcolato
}

export interface NutritionData {
  calories: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  fiber_g: number | null;
  sugar_g: number | null;
  sodium_mg: number | null;
  per_serving: boolean;
}

/**
 * Calcola i valori nutrizionali per una ricetta
 * @param ingredients - array di ingredienti in formato testuale (es. "200g pasta")
 * @param servings - numero di porzioni
 */
export async function calculateNutrition(
  ingredients: string[],
  servings: number = 4,
): Promise<NutritionData | null> {
  const appId  = process.env.EDAMAM_APP_ID;
  const appKey = process.env.EDAMAM_APP_KEY;

  if (!appId || !appKey) {
    console.warn('Edamam API non configurata, skip nutrizione');
    return null;
  }

  if (!ingredients.length) return null;

  try {
    const res = await fetch(
      `https://api.edamam.com/api/nutrition-details?app_id=${appId}&app_key=${appKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Recipe',
          ingr: ingredients,
          yield: servings,
        }),
      },
    );

    if (!res.ok) {
      // 422 = ingredienti non riconosciuti — skip silenzioso
      if (res.status === 422) return null;
      console.error(`Edamam error: ${res.status}`);
      return null;
    }

    const data: EdamamResponse = await res.json();
    const n = data.totalNutrients;

    // Calcola per porzione
    const perServing = (val?: EdamamNutrient) =>
      val ? Math.round((val.quantity / servings) * 10) / 10 : null;

    return {
      calories:  Math.round((data.calories ?? 0) / servings),
      protein_g: perServing(n.PROCNT),
      carbs_g:   perServing(n.CHOCDF),
      fat_g:     perServing(n.FAT),
      fiber_g:   perServing(n.FIBTG),
      sugar_g:   perServing(n.SUGAR),
      sodium_mg: perServing(n.NA),
      per_serving: true,
    };
  } catch (e) {
    console.error('Errore Edamam API:', e);
    return null;
  }
}

/**
 * Converte ingredienti strutturati in stringhe per Edamam
 * es. { amount: "200", unit: "g", name: "pasta" } → "200g pasta"
 */
export function ingredientsToStrings(
  ingredients: Array<{ amount: string; unit: string; name: string }>,
): string[] {
  return ingredients
    .filter((i) => i.amount && i.name)
    .map((i) => `${i.amount}${i.unit} ${i.name}`.trim())
    .slice(0, 20); // Edamam: max 20 ingredienti per chiamata
}
