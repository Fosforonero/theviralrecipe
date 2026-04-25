/**
 * PIPELINE — FASE 2: EXTRACTION
 *
 * Estrae la trascrizione testuale dal video.
 * Strategia: prima prova i sottotitoli ufficiali YouTube (gratis),
 * poi come fallback usa Whisper via Replicate (a pagamento ma più accurato).
 *
 * Recupera anche i metadati del video (titolo, autore, embed code).
 */

// ── SOTTOTITOLI YOUTUBE ──────────────────────────────────────────────

/**
 * Ottieni la trascrizione da YouTube Captions API
 * Funziona solo per video con sottotitoli abilitati (la maggioranza dei creator food li ha)
 */
export async function getYouTubeTranscript(videoId: string): Promise<string | null> {
  try {
    // Fetch la pagina del video per trovare i caption tracks
    const pageRes = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TheViralRecipe/1.0)',
        'Accept-Language': 'it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7',
      },
    });

    if (!pageRes.ok) return null;
    const html = await pageRes.text();

    // Estrai il playerCaptionsTracklistRenderer dalla risposta
    const captionMatch = html.match(/"captionTracks":(\[.*?\])/);
    if (!captionMatch) return null;

    const captionTracks = JSON.parse(captionMatch[1]);
    if (!captionTracks.length) return null;

    // Preferisci IT, poi EN, poi qualsiasi lingua disponibile
    const track =
      captionTracks.find((t: { languageCode: string }) => t.languageCode === 'it') ||
      captionTracks.find((t: { languageCode: string }) => t.languageCode === 'en') ||
      captionTracks[0];

    if (!track?.baseUrl) return null;

    // Scarica i sottotitoli in formato XML
    const captionRes = await fetch(track.baseUrl);
    if (!captionRes.ok) return null;

    const xml = await captionRes.text();

    // Estrai testo pulito dall'XML
    const text = xml
      .replace(/<[^>]+>/g, ' ')           // rimuove tag XML
      .replace(/&#39;/g, "'")             // decode entità HTML
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/\s+/g, ' ')               // normalizza spazi
      .trim();

    return text || null;
  } catch (e) {
    console.error('Errore estrazione trascrizione YouTube:', e);
    return null;
  }
}


/**
 * Ottieni i metadati di un video YouTube via API
 */
export async function getYouTubeMetadata(videoId: string): Promise<{
  title: string;
  channelTitle: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
  tags: string[];
} | null> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return null;

  try {
    const url = new URL('https://www.googleapis.com/youtube/v3/videos');
    url.searchParams.set('part', 'snippet,statistics');
    url.searchParams.set('id', videoId);
    url.searchParams.set('key', apiKey);

    const res = await fetch(url.toString());
    if (!res.ok) return null;

    const data = await res.json();
    const video = data.items?.[0];
    if (!video) return null;

    return {
      title:        video.snippet.title,
      channelTitle: video.snippet.channelTitle,
      description:  video.snippet.description?.slice(0, 1000) ?? '',
      thumbnailUrl: video.snippet.thumbnails?.maxres?.url ?? video.snippet.thumbnails?.high?.url ?? '',
      publishedAt:  video.snippet.publishedAt,
      tags:         video.snippet.tags ?? [],
    };
  } catch (e) {
    console.error('Errore metadati YouTube:', e);
    return null;
  }
}


/**
 * Genera codice oEmbed per YouTube (per mostrare il video originale nella pagina ricetta)
 * Usa il player ufficiale YouTube — completamente legale
 */
export function generateYouTubeEmbed(videoId: string): string {
  return `<iframe
    width="100%"
    style="aspect-ratio: 16/9; border-radius: 12px;"
    src="https://www.youtube.com/embed/${videoId}"
    title="Video ricetta originale"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowfullscreen
    loading="lazy"
  ></iframe>`;
}


/**
 * ENTRY POINT EXTRACTION:
 * Data una source_url, recupera trascrizione + metadati
 */
export async function extractFromSource(sourceUrl: string, platform: string): Promise<{
  transcript: string | null;
  metadata: {
    title?: string;
    author?: string;
    authorHandle?: string;
    thumbnailUrl?: string;
    embedCode?: string;
  };
}> {
  if (platform === 'youtube') {
    // Estrai video ID dall'URL
    const match = sourceUrl.match(/[?&]v=([^&]+)/) ?? sourceUrl.match(/youtu\.be\/([^?]+)/);
    const videoId = match?.[1];

    if (!videoId) return { transcript: null, metadata: {} };

    const [transcript, metadata] = await Promise.all([
      getYouTubeTranscript(videoId),
      getYouTubeMetadata(videoId),
    ]);

    return {
      transcript,
      metadata: {
        title:        metadata?.title,
        author:       metadata?.channelTitle,
        authorHandle: metadata?.channelTitle?.toLowerCase().replace(/\s+/g, ''),
        thumbnailUrl: metadata?.thumbnailUrl,
        embedCode:    generateYouTubeEmbed(videoId),
      },
    };
  }

  // Placeholder per TikTok e Instagram (quando le API saranno disponibili)
  console.warn(`Platform "${platform}" non ancora supportata per extraction`);
  return { transcript: null, metadata: {} };
}
