import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  // Dark mode via classe HTML
  darkMode: 'class',

  theme: {
    extend: {
      // ── PALETTE COLORI ──────────────────────────────────────────
      // Filosofia: warm white + viral red + orange accents
      // Food photography si vede meglio su sfondi caldi e neutri
      colors: {
        // Brand principale
        brand: {
          50:  '#FFF5F5',
          100: '#FFE5E5',
          200: '#FFBDBD',
          300: '#FF8F8F',
          400: '#FF5757',
          500: '#FF3A2D',   // ← colore principale "viral red"
          600: '#E62419',
          700: '#BF1810',
          800: '#9A130D',
          900: '#7A100B',
          950: '#3D0504',
        },

        // Accent caldo (trending, highlight)
        accent: {
          50:  '#FFF8EC',
          100: '#FFEEC8',
          200: '#FFD980',
          300: '#FFC040',
          400: '#FFAB1A',
          500: '#FF8C00',   // ← orange "trending"
          600: '#E07500',
          700: '#BA5D00',
          800: '#964900',
          900: '#7A3A00',
        },

        // Oro per top ranking / featured
        gold: {
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
        },

        // Sfondo (warm white — il cibo risalta di più)
        background: {
          DEFAULT: '#F8F5F0',
          card:    '#FFFFFF',
          muted:   '#F0EDE8',
        },

        // Testo
        text: {
          primary:   '#1C1C1E',
          secondary: '#6E6E73',
          muted:     '#AEAEB2',
          inverse:   '#FFFFFF',
        },

        // Bordi
        border: {
          DEFAULT: '#E8E4DF',
          strong:  '#C8C4BE',
        },

        // Stati
        success: '#22C55E',
        error:   '#EF4444',
        warning: '#F59E0B',
        info:    '#3B82F6',

        // Dark mode surfaces
        dark: {
          bg:      '#0F0F0F',
          surface: '#1A1A1A',
          card:    '#242424',
          border:  '#2E2E2E',
        },
      },

      // ── TIPOGRAFIA ───────────────────────────────────────────────
      fontFamily: {
        // Plus Jakarta Sans — geometrico, moderno, molto leggibile
        // Usato per tutto: headings + body
        sans: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
        // Fraunces — serif display per titoli ricetta (impatto editoriale)
        display: ['var(--font-fraunces)', 'Georgia', 'serif'],
        // Monospace per codice (non usato molto ma ci vuole)
        mono: ['ui-monospace', 'SFMono-Regular', 'monospace'],
      },

      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
        'xs':  ['0.75rem',  { lineHeight: '1rem' }],
        'sm':  ['0.875rem', { lineHeight: '1.25rem' }],
        'base':['1rem',     { lineHeight: '1.5rem' }],
        'lg':  ['1.125rem', { lineHeight: '1.75rem' }],
        'xl':  ['1.25rem',  { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem',   { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem',  { lineHeight: '2.5rem' }],
        '5xl': ['3rem',     { lineHeight: '1.15' }],
        '6xl': ['3.75rem',  { lineHeight: '1.1' }],
        '7xl': ['4.5rem',   { lineHeight: '1.05' }],
        '8xl': ['6rem',     { lineHeight: '1' }],
      },

      // ── BORDI ────────────────────────────────────────────────────
      borderRadius: {
        'sm':  '0.375rem',
        'DEFAULT': '0.5rem',
        'md':  '0.75rem',
        'lg':  '1rem',
        'xl':  '1.25rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        'full': '9999px',
      },

      // ── OMBRE ────────────────────────────────────────────────────
      boxShadow: {
        'sm':  '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
        'DEFAULT': '0 4px 12px 0 rgb(0 0 0 / 0.08)',
        'md':  '0 8px 24px 0 rgb(0 0 0 / 0.10)',
        'lg':  '0 16px 48px 0 rgb(0 0 0 / 0.12)',
        'xl':  '0 24px 64px 0 rgb(0 0 0 / 0.16)',
        'glow-brand': '0 0 24px 0 rgb(255 58 45 / 0.25)',
        'glow-gold':  '0 0 24px 0 rgb(245 158 11 / 0.30)',
        'card': '0 2px 8px 0 rgb(0 0 0 / 0.06), 0 1px 2px 0 rgb(0 0 0 / 0.04)',
        'card-hover': '0 8px 32px 0 rgb(0 0 0 / 0.10)',
        'none': 'none',
      },

      // ── ANIMAZIONI ───────────────────────────────────────────────
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },

      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        'slide-in-right': {
          from: { transform: 'translateX(100%)' },
          to:   { transform: 'translateX(0)' },
        },
        'pulse-subtle': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'bounce-in': {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.08)' },
          '70%': { transform: 'scale(0.96)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },

      animation: {
        'fade-in': 'fade-in 0.4s ease-out',
        'fade-in-up': 'fade-in-up 0.5s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
        'slide-in-right': 'slide-in-right 0.35s ease-out',
        'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'bounce-in': 'bounce-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },

      // ── LAYOUT ───────────────────────────────────────────────────
      maxWidth: {
        'container': '1280px',
        'content': '860px',
        'narrow': '640px',
      },

      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '88': '22rem',
        '128': '32rem',
      },

      // ── ASPECT RATIOS ────────────────────────────────────────────
      aspectRatio: {
        'recipe-card': '4 / 3',
        'recipe-hero': '16 / 9',
        'recipe-square': '1 / 1',
      },

      // ── GRADIENTI ────────────────────────────────────────────────
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #FF3A2D 0%, #FF8C00 100%)',
        'gradient-dark': 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.8) 100%)',
        'gradient-card': 'linear-gradient(180deg, transparent 40%, rgba(28,28,30,0.95) 100%)',
        'shimmer-bg': 'linear-gradient(90deg, #F0EDE8 25%, #F8F5F0 50%, #F0EDE8 75%)',
      },
    },
  },

  plugins: [],
};

export default config;
