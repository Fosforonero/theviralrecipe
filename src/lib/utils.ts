import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combina classi Tailwind in modo sicuro (gestisce conflitti)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formatta un numero grande in modo leggibile
 * es. 1200 → "1.2K", 1500000 → "1.5M"
 */
export function formatCount(count: number, locale = 'it'): string {
  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(1).replace('.0', '')}M`;
  }
  if (count >= 1_000) {
    return `${(count / 1_000).toFixed(1).replace('.0', '')}K`;
  }
  return count.toLocaleString(locale);
}

/**
 * Formatta i minuti in formato leggibile
 * es. 90 → "1h 30min", 45 → "45min"
 */
export function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

/**
 * Genera uno slug SEO-safe da una stringa italiana
 * Gestisce accenti, spazi, caratteri speciali
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // rimuove accenti
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ñ]/g, 'n')
    .replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Trunca un testo alla lunghezza specificata con ellissi
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

/**
 * Formatta una data in modo relativo (italiano e inglese)
 * es. "2 giorni fa", "3 hours ago"
 */
export function formatRelativeDate(date: string | Date, locale = 'it'): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (diffDays > 30) {
    return d.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });
  }
  if (diffDays > 0) return rtf.format(-diffDays, 'day');
  if (diffHours > 0) return rtf.format(-diffHours, 'hour');
  if (diffMins > 0) return rtf.format(-diffMins, 'minute');
  return locale === 'it' ? 'adesso' : 'just now';
}

/**
 * Calcola il colore del badge ranking in base alla posizione
 */
export function getRankingBadgeClass(position: number): string {
  if (position === 1) return 'text-yellow-500'; // oro
  if (position === 2) return 'text-gray-400';   // argento
  if (position === 3) return 'text-amber-600';  // bronzo
  return 'text-text-secondary';
}

/**
 * Genera l'URL del profilo creator
 */
export function getCreatorUrl(slug: string, locale: string): string {
  return `/${locale}/creator/${slug}`;
}

/**
 * Genera l'URL di una ricetta nella lingua corretta
 */
export function getRecipeUrl(slug: string, locale: string): string {
  return locale === 'it' ? `/it/ricette/${slug}` : `/en/recipes/${slug}`;
}

/**
 * Genera l'icona per la piattaforma social sorgente
 */
export function getPlatformIcon(platform: string): string {
  const icons: Record<string, string> = {
    tiktok: '🎵',
    instagram: '📸',
    youtube: '▶️',
    altro: '🌐',
  };
  return icons[platform] ?? '🌐';
}

/**
 * Genera un colore di sfondo per category badge
 */
export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    antipasti: 'bg-orange-100 text-orange-700',
    primi:     'bg-yellow-100 text-yellow-700',
    secondi:   'bg-red-100 text-red-700',
    contorni:  'bg-green-100 text-green-700',
    dolci:     'bg-pink-100 text-pink-700',
    bevande:   'bg-blue-100 text-blue-700',
    snack:     'bg-purple-100 text-purple-700',
    colazione: 'bg-amber-100 text-amber-700',
    condimenti:'bg-teal-100 text-teal-700',
  };
  return colors[category] ?? 'bg-gray-100 text-gray-700';
}

/**
 * Genera il placeholder blur data URL per le immagini
 * (evita layout shift durante il caricamento)
 */
export const shimmerDataUrl = `data:image/svg+xml;base64,${Buffer.from(
  `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#F0EDE8"/>
        <stop offset="50%" stop-color="#F8F5F0"/>
        <stop offset="100%" stop-color="#F0EDE8"/>
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#g)"/>
  </svg>`
).toString('base64')}`;
