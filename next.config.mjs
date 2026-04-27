import createNextIntlPlugin from 'next-intl/plugin';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Evita che Turbopack scelga un lockfile in una cartella padre come workspace root.
  turbopack: {
    root: __dirname,
  },

  // Ottimizzazione immagini
  images: {
    remotePatterns: [
      // Immagini AI generate su Supabase Storage
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      // Thumbnail YouTube (usate solo internamente, non riservite)
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
      // Avatar utenti da OAuth (Google, ecc.)
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      // Foto seed da Unsplash (per ricette demo)
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // Replicate (immagini AI generate dalla pipeline)
      {
        protocol: 'https',
        hostname: '*.replicate.delivery',
      },
    ],
    // Formati moderni per performance
    formats: ['image/avif', 'image/webp'],
  },

  // Header di sicurezza
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },

  // Redirect: root → /it
  async redirects() {
    return [
      {
        source: '/',
        destination: '/it',
        permanent: false,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
