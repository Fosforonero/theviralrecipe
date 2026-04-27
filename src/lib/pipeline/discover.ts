/**
 * PIPELINE — FASE 1: DISCOVERY
 *
 * Cerca contenuti food virali su YouTube (API ufficiale).
 * TikTok e Instagram vengono aggiunti quando le API sono disponibili.
 *
 * Strategia: cerca hashtag food trending degli ultimi 7 giorni,
 * filtra per visualizzazioni minime e durata video (1-15 min = ricetta).
 */

import { createServerSupabaseAdminClient } from '@/lib/supabase/server';

// Hashtag e keyword da monitorare
const FOOD_KEYWORDS_IT = [
  'ricetta virale', 'ricetta tiktok', 'cucina virale',
  'ricetta facile', 'ricetta veloce', 'ricetta 5 ingredienti',
  'pasta virale', 'dolce virale', 'trending food italy',
];

const FOOD_KEYWORDS_EN = [
  'viral recipe', 'tiktok recipe', 'trending food',
  'easy recipe', 'quick recipe', '5 ingredient recipe',
  'viral pasta', 'viral dessert', 'food trend 2024',
];

const ALL_KEYWORDS = [...FOOD_KEYWORDS_IT, ...FOOD_KEYWORDS_EN];

interface YouTubeSearchResult {
  id: { videoId: string };
  snippet: {
    title: string;
    channelTitle: string;
    publishedAt: string;
    thumbnails: { high: { url: string } };
  };
}

interface YouTubeVideoDetail {
  id: string;
  snippet: {
    title: string;
    description: string;
    channelTitle: string;
    publishedAt: string;
    thumbnails: { maxres?: { url: string }; high: { url: string } };
    defaultAudioLanguage?: string;
    tags?: string[];
  };
  statistics: {
    viewCount: string;
    likeCount: string;
  };
  contentDetails: {
    duration: string; // ISO 8601 es. PT5M30S
  };
}

/**
 * Converti durata ISO 8601 in minuti
 */
function parseDurationToMinutes(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours   = parseInt(match[1] ?? '0');
  const minutes = parseInt(match[2] ?? '0');
  const seconds = parseInt(match[3] ?? '0');
  return hours * 60 + minutes + Math.round(seconds / 60);
}

/**
 * Cerca video YouTube con una keyword
 */
async function searchYouTube(keyword: string, maxResults = 10): Promise<string[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) throw new Error('YOUTUBE_API_KEY non configurata');

  // Ultime due settimane
  const publishedAfter = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();

  const url = new URL('https://www.googleapis.com/youtube/v3/search');
  url.searchParams.set('part', 'id,snippet');
  url.searchParams.set('q', keyword);
  url.searchParams.set('type', 'video');
  url.searchParams.set('order', 'viewCount');
  url.searchParams.set('publishedAfter', publishedAfter);
  url.searchParams.set('maxResults', maxResults.toString());
  url.searchParams.set('relevanceLanguage', keyword.includes('ricetta') ? 'it' : 'en');
  url.searchParams.set('key', apiKey);

  const res = await fetch(url.toString());
  if (!res.ok) {
    console.error(`YouTube search error: ${res.status} ${res.statusText}`);
    return [];
  }

  const data = await res.json();
  return (data.items as YouTubeSearchResult[]).map((item) => item.id.videoId);
}

/**
 * Ottieni dettagli di più video YouTube in batch
 */
async function getYouTubeVideoDetails(videoIds: string[]): Promise<YouTubeVideoDetail[]> {
  if (!videoIds.length) return [];
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return [];

  const url = new URL('https://www.googleapis.com/youtube/v3/videos');
  url.searchParams.set('part', 'snippet,statistics,contentDetails');
  url.searchParams.set('id', videoIds.join(','));
  url.searchParams.set('key', apiKey);

  const res = await fetch(url.toString());
  if (!res.ok) return [];
  const data = await res.json();
  return data.items as YouTubeVideoDetail[];
}

/**
 * Filtra i video: solo quelli che sembrano effettivamente ricette
 */
function isLikelyRecipeVideo(video: YouTubeVideoDetail): boolean {
  const duration  = parseDurationToMinutes(video.contentDetails.duration);
  const views     = parseInt(video.statistics.viewCount ?? '0');
  const titleLow  = video.snippet.title.toLowerCase();
  const descLow   = video.snippet.description.toLowerCase().slice(0, 500);

  // Durata: tra 1 e 20 minuti (video tipici di ricette)
  if (duration < 1 || duration > 20) return false;

  // Almeno 10k visualizzazioni (è "virale")
  if (views < 10_000) return false;

  // Deve contenere parole chiave di ricetta nel titolo o nella descrizione
  const recipeWords = [
    'ricetta', 'ingredienti', 'recipe', 'ingredient', 'cook', 'cucinare',
    'preparare', 'pasta', 'dolce', 'torta', 'pollo', 'cake', 'make', 'how to',
  ];
  const hasRecipeWord = recipeWords.some(w => titleLow.includes(w) || descLow.includes(w));
  if (!hasRecipeWord) return false;

  return true;
}

/**
 * MAIN: Scopri nuove ricette e inseriscile in pipeline_jobs
 * Chiamata dal Vercel Cron ogni 6 ore
 */
export async function discoverNewRecipes(): Promise<{ found: number; queued: number }> {
  const supabase = await createServerSupabaseAdminClient();

  // Recupera URL già in coda o processati (per evitare duplicati)
  const { data: existing } = await supabase
    .from('pipeline_jobs')
    .select('source_url')
    .in('status', ['pending', 'processing', 'done']);

  const existingUrls = new Set((existing ?? []).map((r) => r.source_url));

  // Cerca su YouTube con rotazione delle keyword
  // Per non esaurire la quota API (10.000 unità/giorno), limitiamo a 3 keyword per run
  const randomKeywords = ALL_KEYWORDS.sort(() => Math.random() - 0.5).slice(0, 3);
  const allVideoIds: string[] = [];

  for (const keyword of randomKeywords) {
    try {
      const ids = await searchYouTube(keyword, 5);
      allVideoIds.push(...ids);
      // Pausa per non fare rate limiting
      await new Promise((r) => setTimeout(r, 300));
    } catch (e) {
      console.error(`Discovery error for "${keyword}":`, e);
    }
  }

  // Deduplication degli ID
  const uniqueIds = [...new Set(allVideoIds)];

  // Recupera dettagli in batch
  const videos = await getYouTubeVideoDetails(uniqueIds);

  // Filtra solo ricette vere e non già in coda
  const newJobs = videos.filter((v) => {
    const url = `https://www.youtube.com/watch?v=${v.id}`;
    return isLikelyRecipeVideo(v) && !existingUrls.has(url);
  });

  if (!newJobs.length) {
    return { found: videos.length, queued: 0 };
  }

  // Inserisci in pipeline_jobs
  const jobsToInsert = newJobs.map((v) => ({
    source_platform: 'youtube' as const,
    source_url: `https://www.youtube.com/watch?v=${v.id}`,
    source_video_id: v.id,
    status: 'pending' as const,
  }));

  const { error } = await supabase
    .from('pipeline_jobs')
    .insert(jobsToInsert);

  if (error) {
    console.error('Errore inserimento pipeline jobs:', error);
    return { found: videos.length, queued: 0 };
  }

  return { found: videos.length, queued: newJobs.length };
}
