import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // Le due lingue supportate
  locales: ['it', 'en'],

  // Italiano come lingua di default
  defaultLocale: 'it',

  // /it/ricette/slug-italiano — la lingua è sempre esplicita nell'URL
  // Migliore per SEO multilingua e hreflang
  localePrefix: 'always',

  // Mapping dei path per lingua — importante per SEO
  // Gli slug italiani e inglesi sono diversi per massimizzare la ricerca locale
  pathnames: {
    '/': '/',

    '/ricette/[slug]': {
      it: '/ricette/[slug]',
      en: '/recipes/[slug]',
    },

    '/classifica': {
      it: '/classifica',
      en: '/ranking',
    },

    '/categorie': {
      it: '/categorie',
      en: '/categories',
    },

    '/categorie/[categoria]': {
      it: '/categorie/[categoria]',
      en: '/categories/[categoria]',
    },

    '/creator/[slug]': {
      it: '/creator/[slug]',
      en: '/creator/[slug]',
    },

    '/profilo': {
      it: '/profilo',
      en: '/profile',
    },

    '/pro': {
      it: '/pro',
      en: '/pro',
    },

    '/cerca': {
      it: '/cerca',
      en: '/search',
    },
  },
});
