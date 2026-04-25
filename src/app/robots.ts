import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/api/',
          '/it/profilo',
          '/en/profile',
          '/it/impostazioni',
          '/en/settings',
        ],
      },
    ],
    sitemap: 'https://theviralrecipe.com/sitemap.xml',
    host: 'https://theviralrecipe.com',
  };
}
