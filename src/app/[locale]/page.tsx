import type { Metadata } from 'next';
import { WaitlistForm } from '@/components/home/WaitlistForm';

export const metadata: Metadata = {
  title: 'TheViralRecipe — Le ricette virali, finalmente in un posto solo',
  description:
    'TikTok, Instagram e YouTube monitorati ogni giorno per trovare le ricette più virali. Trasformate in schede leggibili, originali e cucinabili.',
};

// ── STATIC DATA ────────────────────────────────────────────────────

const features = [
  {
    emoji: '🔥',
    tileClass: 'bg-brand-50 border-brand-200',
    iconClass: 'bg-brand-100',
    it: { title: 'Trend Discovery', desc: 'Monitoriamo TikTok, Instagram e YouTube ogni giorno per trovare le ricette più condivise del momento.' },
    en: { title: 'Trend Discovery', desc: 'We monitor TikTok, Instagram and YouTube daily to find the most shared recipes.' },
  },
  {
    emoji: '📋',
    tileClass: 'bg-amber-50 border-amber-200',
    iconClass: 'bg-amber-100',
    it: { title: 'Ricette Riscritte', desc: 'Ogni video diventa una scheda strutturata: ingredienti precisi, procedimento chiaro, tips pratici.' },
    en: { title: 'Structured Recipes', desc: 'Every video becomes a proper recipe card: precise ingredients, clear steps and tips.' },
  },
  {
    emoji: '🏆',
    tileClass: 'bg-yellow-50 border-yellow-200',
    iconClass: 'bg-yellow-100',
    it: { title: 'Classifica Virale', desc: 'Una classifica aggiornata con le ricette più votate e replicate della settimana.' },
    en: { title: 'Viral Ranking', desc: 'A live leaderboard of the most voted and replicated recipes of the week.' },
  },
  {
    emoji: '👨‍🍳',
    tileClass: 'bg-green-50 border-green-200',
    iconClass: 'bg-green-100',
    it: { title: 'Creator Originali', desc: 'Ogni ricetta mantiene il credito al creator originale con link al post social.' },
    en: { title: 'Creator Credits', desc: 'Every recipe credits the original creator with a link to their post.' },
  },
  {
    emoji: '🔔',
    tileClass: 'bg-blue-50 border-blue-200',
    iconClass: 'bg-blue-100',
    it: { title: 'Alert Trend', desc: 'Ricevi notifiche sui nuovi trend prima che diventino mainstream.' },
    en: { title: 'Trend Alerts', desc: 'Get notified on new trends before they go mainstream.' },
  },
] as const;

const mockRecipes = [
  { emoji: '🍝', it: 'Pasta al limone', en: 'Lemon pasta',      badge: '#1',    badgeClass: 'badge-brand', time: '15 min', bg: 'bg-orange-50' },
  { emoji: '🫕', it: 'Tortilla soup',   en: 'Tortilla soup',    badge: 'Trend',  badgeClass: 'badge-viral', time: '30 min', bg: 'bg-red-50'    },
  { emoji: '🍰', it: 'Cheesecake Dubai', en: 'Dubai cheesecake', badge: 'Nuovo',  badgeClass: 'badge-new',   time: '45 min', bg: 'bg-pink-50'   },
  { emoji: '🥑', it: 'Toast avocado',   en: 'Avocado toast',    badge: '#4',    badgeClass: 'badge-brand', time: '10 min', bg: 'bg-green-50'  },
  { emoji: '🍜', it: 'Ramen in 10 min', en: '10-min ramen',     badge: '#2',    badgeClass: 'badge-brand', time: '10 min', bg: 'bg-yellow-50' },
  { emoji: '🧁', it: 'Mugcake virale',  en: 'Viral mugcake',    badge: 'Trend',  badgeClass: 'badge-viral', time: '5 min',  bg: 'bg-purple-50' },
] as const;

const trendingData = {
  it: [
    { platform: 'TikTok',    recipe: 'Pasta al limone',   views: '12.4M', trend: '+340%' },
    { platform: 'Instagram', recipe: 'Cheesecake Dubai',  views: '8.7M',  trend: '+210%' },
    { platform: 'YouTube',   recipe: 'Ramen in 10 min',   views: '5.1M',  trend: '+180%' },
    { platform: 'TikTok',    recipe: 'Tortilla soup',     views: '3.9M',  trend: '+95%'  },
  ],
  en: [
    { platform: 'TikTok',    recipe: 'Lemon pasta',       views: '12.4M', trend: '+340%' },
    { platform: 'Instagram', recipe: 'Dubai cheesecake',  views: '8.7M',  trend: '+210%' },
    { platform: 'YouTube',   recipe: '10-min ramen',      views: '5.1M',  trend: '+180%' },
    { platform: 'TikTok',    recipe: 'Tortilla soup',     views: '3.9M',  trend: '+95%'  },
  ],
} as const;

const steps = [
  {
    num: '01',
    emoji: '📡',
    it: {
      title: 'Scopriamo i trend',
      desc: 'I nostri algoritmi monitorano TikTok, Instagram e YouTube ogni giorno per identificare le ricette che stanno esplodendo.',
    },
    en: {
      title: 'We find the trends',
      desc: 'Our algorithms monitor TikTok, Instagram and YouTube daily to identify recipes that are going viral.',
    },
  },
  {
    num: '02',
    emoji: '✍️',
    it: {
      title: 'Trascriviamo le ricette',
      desc: 'Ogni video viene trasformato in una scheda strutturata con ingredienti precisi, procedimento chiaro e suggerimenti utili.',
    },
    en: {
      title: 'We transcribe recipes',
      desc: 'Every video becomes a structured card with precise ingredients, clear steps and useful tips.',
    },
  },
  {
    num: '03',
    emoji: '🍽',
    it: {
      title: 'Tu cucini',
      desc: 'Trovi tutto in un posto: classifica virale aggiornata, ricette scritte bene e credito al creator originale.',
    },
    en: {
      title: 'You cook',
      desc: 'Find everything in one place: live viral rankings, well-written recipes, and credit to the original creator.',
    },
  },
] as const;

// ── PAGE ────────────────────────────────────────────────────────────

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isIT = locale === 'it';
  const trending = isIT ? trendingData.it : trendingData.en;

  return (
    <div className="bg-background">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="pt-header overflow-hidden">
        <div className="container-main py-16 lg:py-28">
          <div className="grid lg:grid-cols-[1fr_460px] gap-14 items-center">

            {/* Copy + form */}
            <div className="max-w-[560px]">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100 text-brand-600 text-xs font-bold tracking-widest uppercase mb-7 select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse shrink-0" />
                {isIT ? 'In arrivo' : 'Coming soon'}
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-[64px] font-black text-text-primary leading-[1.06] tracking-tight mb-6">
                {isIT ? (
                  <>
                    Le ricette{' '}
                    <span className="text-gradient-brand font-display-title">virali</span>,
                    <br />
                    finalmente
                    <br />
                    in un posto solo
                  </>
                ) : (
                  <>
                    Viral recipes,
                    <br />
                    <span className="text-gradient-brand font-display-title">finally</span>
                    <br />
                    in one place
                  </>
                )}
              </h1>

              <p className="text-lg text-text-secondary leading-relaxed mb-9 max-w-[460px]">
                {isIT
                  ? 'TikTok, Instagram e YouTube monitorati ogni giorno per trovare le ricette che esplodono — poi trasformate in schede leggibili e cucinabili.'
                  : 'TikTok, Instagram and YouTube monitored daily to find exploding recipes — then turned into readable and cookable recipe cards.'}
              </p>

              <WaitlistForm locale={locale} />

              <div className="flex items-center gap-2.5 mt-7 flex-wrap">
                <span className="text-xs text-text-muted font-medium">
                  {isIT ? 'Trend da' : 'Trends from'}
                </span>
                {(['TikTok', 'Instagram', 'YouTube'] as const).map((p) => (
                  <span
                    key={p}
                    className="inline-flex items-center px-3 py-1 rounded-full bg-background-card border border-border text-xs font-semibold text-text-secondary"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>

            {/* Hero visual (desktop) */}
            <div className="hidden lg:block">
              <HeroVisual isIT={isIT} />
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURE TILES ─────────────────────────────────────────── */}
      <section className="py-16 lg:py-20 bg-background-muted">
        <div className="container-main">
          <p className="text-center text-xs font-bold tracking-widest uppercase text-text-muted mb-10">
            {isIT ? 'Cosa troverai su TheViralRecipe' : "What you'll find on TheViralRecipe"}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {features.map((f) => {
              const c = isIT ? f.it : f.en;
              return (
                <div key={f.emoji} className={`rounded-2xl border p-5 flex flex-col gap-3 ${f.tileClass}`}>
                  <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${f.iconClass}`}>
                    {f.emoji}
                  </span>
                  <div>
                    <p className="font-bold text-text-primary text-sm mb-1">{c.title}</p>
                    <p className="text-xs text-text-secondary leading-relaxed">{c.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CONTENT PREVIEW ──────────────────────────────────────── */}
      <section className="py-16 lg:py-28">
        <div className="container-main">
          <div className="text-center mb-14">
            <p className="text-xs font-bold tracking-widest uppercase text-text-muted mb-3">
              {isIT ? 'Anteprima del prodotto' : 'Product preview'}
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight">
              {isIT ? 'Ricette virali, finalmente leggibili' : 'Viral recipes, finally readable'}
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">

            {/* Monitoring panel */}
            <div className="bg-dark-surface rounded-3xl p-6 lg:p-8 border border-dark-border">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs font-bold tracking-widest uppercase text-text-muted mb-1">
                    {isIT ? 'Monitoraggio live' : 'Live monitoring'}
                  </p>
                  <h3 className="text-xl font-bold text-white">
                    {isIT ? 'Trend questa settimana' : 'Trends this week'}
                  </h3>
                </div>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-green-400 bg-green-400/10 px-3 py-1.5 rounded-full border border-green-400/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shrink-0" />
                  Live
                </span>
              </div>

              <div className="space-y-2.5">
                {trending.map((item) => (
                  <div
                    key={item.recipe}
                    className="flex items-center gap-3 bg-dark-card rounded-xl px-4 py-3"
                  >
                    <span className="text-xs font-bold text-text-muted w-[76px] shrink-0">{item.platform}</span>
                    <span className="text-sm font-semibold text-white flex-1 truncate">{item.recipe}</span>
                    <span className="text-xs text-text-muted shrink-0">{item.views}</span>
                    <span className="text-xs font-bold text-green-400 shrink-0 w-14 text-right">{item.trend}</span>
                  </div>
                ))}
              </div>

              <p className="text-2xs text-text-muted mt-5 text-center opacity-70">
                {isIT ? '* Dati simulati — in arrivo con il lancio' : '* Simulated data — live at launch'}
              </p>
            </div>

            {/* Recipe card grid */}
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-text-muted mb-3">
                {isIT ? 'Ricette della settimana' : "This week's recipes"}
              </p>
              <p className="text-2xl font-bold text-text-primary tracking-tight mb-6">
                {isIT ? 'Ogni ricetta, una scheda curata' : 'Every recipe, a curated card'}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {mockRecipes.map((r) => (
                  <div key={r.en} className={`${r.bg} rounded-2xl p-4 border border-border/60 flex flex-col gap-2`}>
                    <span className="text-3xl">{r.emoji}</span>
                    <p className="text-sm font-semibold text-text-primary leading-tight line-clamp-2">
                      {isIT ? r.it : r.en}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-1">
                      <span className={`${r.badgeClass} text-2xs`}>{r.badge}</span>
                      <span className="text-2xs text-text-muted font-medium">{r.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COME FUNZIONA ─────────────────────────────────────────── */}
      <section className="py-16 lg:py-24 bg-background-muted">
        <div className="container-main">
          <div className="text-center mb-14">
            <p className="text-xs font-bold tracking-widest uppercase text-text-muted mb-3">
              {isIT ? 'Il processo' : 'The process'}
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight">
              {isIT ? 'Come funziona' : 'How it works'}
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-8 lg:gap-12 max-w-4xl mx-auto">
            {steps.map((s) => {
              const c = isIT ? s.it : s.en;
              return (
                <div key={s.num} className="flex flex-col gap-5">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-black text-gradient-brand font-display-title">{s.num}</span>
                    <span className="text-3xl">{s.emoji}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-text-primary text-lg mb-2 tracking-tight">{c.title}</h3>
                    <p className="text-sm text-text-secondary leading-relaxed">{c.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SECOND CTA ────────────────────────────────────────────── */}
      <section className="py-16 lg:py-24">
        <div className="container-main">
          <div className="max-w-lg mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight mb-3">
              {isIT ? 'Vuoi essere tra i primi?' : 'Want to be among the first?'}
            </h2>
            <p className="text-text-secondary mb-8">
              {isIT
                ? 'Lascia la tua email — ti avvisiamo il giorno del lancio, niente spam.'
                : "Leave your email — we'll notify you on launch day, no spam."}
            </p>
            <WaitlistForm locale={locale} />
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────── */}
      <footer className="border-t border-border bg-background-card">
        <div className="container-main py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <p className="font-black text-text-primary text-lg tracking-tight">
                TheViral<span className="text-gradient-brand">Recipe</span>
              </p>
              <p className="text-xs text-text-muted mt-1">
                {isIT ? '© 2025 · Tutti i diritti riservati' : '© 2025 · All rights reserved'}
              </p>
            </div>
            <div className="flex items-center gap-6 text-sm text-text-secondary">
              <a href={`/${locale}/privacy`} className="hover:text-text-primary transition-colors">
                Privacy
              </a>
              <a href={`/${locale}/cookie`} className="hover:text-text-primary transition-colors">
                Cookie
              </a>
              <a href="mailto:ciao@theviralrecipe.com" className="hover:text-text-primary transition-colors">
                {isIT ? 'Contatti' : 'Contact'}
              </a>
            </div>
            <div className="flex items-center gap-1">
              <a
                href="/it"
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${locale === 'it' ? 'bg-brand-100 text-brand-600' : 'text-text-muted hover:text-text-primary'}`}
              >
                IT
              </a>
              <a
                href="/en"
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${locale === 'en' ? 'bg-brand-100 text-brand-600' : 'text-text-muted hover:text-text-primary'}`}
              >
                EN
              </a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}


// ── HERO VISUAL (desktop only) ───────────────────────────────────────

function HeroVisual({ isIT }: { isIT: boolean }) {
  const topRecipes = [
    { rank: 1, emoji: '🍝', it: 'Pasta al limone', en: 'Lemon pasta', time: '15 min' },
    { rank: 2, emoji: '🫕', it: 'Tortilla soup',   en: 'Tortilla soup', time: '30 min' },
    { rank: 3, emoji: '🍰', it: 'Cheesecake Dubai', en: 'Dubai cheesecake', time: '45 min' },
  ] as const;

  return (
    <div className="relative" style={{ height: 500 }}>

      {/* Main card */}
      <div className="absolute inset-x-6 inset-y-10 bg-background-card rounded-3xl border border-border shadow-xl overflow-hidden flex flex-col">
        <div className="flex-1 bg-gradient-to-br from-brand-50 via-amber-50 to-orange-50 flex flex-col justify-between p-5">
          <div className="flex items-center justify-between">
            <span className="badge-brand text-2xs">
              {isIT ? '🔥 Trending ora' : '🔥 Trending now'}
            </span>
            <span className="flex items-center gap-1.5 text-2xs text-text-muted font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Live
            </span>
          </div>

          <div className="text-center py-4">
            <span className="text-[88px] select-none leading-none">🍝</span>
            <p className="mt-3 text-xl font-black text-text-primary">
              {isIT ? 'Pasta al limone' : 'Lemon pasta'}
            </p>
            <p className="text-xs text-text-secondary mt-1">
              {isIT ? '12.4M visualizzazioni · TikTok' : '12.4M views · TikTok'}
            </p>
          </div>

          <div className="space-y-2">
            {topRecipes.map((r) => (
              <div
                key={r.rank}
                className="flex items-center gap-3 bg-white/70 rounded-xl px-3 py-2.5"
              >
                <span className="text-xs font-black text-brand-500 w-5 shrink-0">#{r.rank}</span>
                <span className="text-base shrink-0">{r.emoji}</span>
                <span className="text-xs font-semibold text-text-primary flex-1 truncate">
                  {isIT ? r.it : r.en}
                </span>
                <span className="text-2xs text-text-muted shrink-0">{r.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating card — top right */}
      <div className="absolute top-0 right-0 w-32 bg-background-card rounded-2xl border border-border shadow-md p-3 rotate-3 select-none">
        <span className="text-xl">📡</span>
        <p className="text-xs font-bold text-text-primary mt-1 leading-tight">
          {isIT ? '3 piattaforme' : '3 platforms'}
        </p>
        <p className="text-2xs text-brand-500 font-bold mt-0.5">
          {isIT ? 'monitorate ogni giorno' : 'monitored daily'}
        </p>
      </div>

      {/* Floating card — bottom left */}
      <div className="absolute bottom-0 left-0 w-36 bg-background-card rounded-2xl border border-border shadow-md p-3 -rotate-2 select-none">
        <span className="text-xl">🏆</span>
        <p className="text-xs font-bold text-text-primary mt-1 leading-tight">
          {isIT ? 'Classifica virale' : 'Viral ranking'}
        </p>
        <p className="text-2xs text-accent-500 font-bold mt-0.5">
          {isIT ? 'Aggiornata ogni settimana' : 'Updated weekly'}
        </p>
      </div>

    </div>
  );
}
