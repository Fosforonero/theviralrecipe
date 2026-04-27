import type { Metadata } from 'next';
import { WaitlistForm } from '@/components/home/WaitlistForm';

export const metadata: Metadata = {
  title: 'TheViralRecipe — Le ricette virali, finalmente in un posto solo',
  description:
    'TikTok, Instagram e YouTube monitorati ogni giorno per trovare le ricette più virali. Trasformate in schede leggibili, originali e cucinabili.',
};

// ── DATI STATICI ─────────────────────────────────────────────────────

const features = [
  {
    icon: '🔥',
    it: {
      title: 'Trend Discovery',
      desc: 'Monitoriamo TikTok, Instagram e YouTube ogni giorno per trovare le ricette più condivise del momento.',
    },
    en: {
      title: 'Trend Discovery',
      desc: 'We monitor TikTok, Instagram and YouTube daily to surface the most shared recipes of the moment.',
    },
  },
  {
    icon: '📋',
    it: {
      title: 'Ricette Riscritte',
      desc: 'Ogni video diventa una scheda strutturata: ingredienti precisi, procedimento chiaro, tips pratici.',
    },
    en: {
      title: 'Structured Recipes',
      desc: 'Every video becomes a proper recipe card: precise ingredients, clear steps and practical tips.',
    },
  },
  {
    icon: '🏆',
    it: {
      title: 'Classifica Virale',
      desc: 'Una classifica aggiornata con le ricette più votate, salvate e replicate della settimana.',
    },
    en: {
      title: 'Viral Ranking',
      desc: 'A live leaderboard of the most voted, saved and replicated recipes of the week.',
    },
  },
  {
    icon: '👨‍🍳',
    it: {
      title: 'Creator Originali',
      desc: 'Ogni ricetta mantiene il credito al creator originale con link al post e all\'account social.',
    },
    en: {
      title: 'Original Creators',
      desc: 'Every recipe credits the original creator with links to the original post and social profile.',
    },
  },
] as const;

const platforms = [
  { icon: '🎵', label: 'TikTok' },
  { icon: '📸', label: 'Instagram' },
  { icon: '▶', label: 'YouTube' },
];

// ── MOCK RECIPE CARDS (visual hero, nessuna immagine esterna) ─────────

const mockRecipes = [
  {
    emoji: '🍝',
    labelIT: 'Pasta al limone',
    labelEN: 'Lemon pasta',
    badge: '#1 🔥',
    badgeColor: 'text-brand-500',
    time: '15 min',
    bg: 'from-orange-50 to-amber-50',
  },
  {
    emoji: '🫕',
    labelIT: 'Tortilla soup virale',
    labelEN: 'Viral tortilla soup',
    badge: 'Trending',
    badgeColor: 'text-accent-600',
    time: '30 min',
    bg: 'from-red-50 to-orange-50',
  },
  {
    emoji: '🍰',
    labelIT: 'Cheesecake Dubai',
    labelEN: 'Dubai cheesecake',
    badge: 'Nuovo ✨',
    badgeColor: 'text-violet-600',
    time: '45 min',
    bg: 'from-pink-50 to-rose-50',
  },
] as const;


// ── PAGE ─────────────────────────────────────────────────────────────

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isIT = locale === 'it';

  return (
    <div className="bg-background">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="pt-header">
        <div className="container-main py-14 lg:py-24">
          <div className="grid lg:grid-cols-[1fr_480px] gap-12 items-center">

            {/* ── LEFT: headline + form ──────────────────────────── */}
            <div className="max-w-xl">

              {/* Badge coming soon */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100 text-brand-600 text-xs font-bold tracking-widest uppercase mb-7 select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse shrink-0" />
                {isIT ? 'In arrivo' : 'Coming soon'}
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-black text-text-primary leading-[1.08] tracking-tight mb-5">
                {isIT ? (
                  <>
                    Le ricette{' '}
                    <span className="text-gradient-brand font-display-title">virali</span>,
                    <br />
                    finalmente in un posto solo
                  </>
                ) : (
                  <>
                    Viral recipes,{' '}
                    <span className="text-gradient-brand font-display-title">finally</span>
                    <br />
                    in one place
                  </>
                )}
              </h1>

              {/* Sottotitolo */}
              <p className="text-lg text-text-secondary leading-relaxed mb-8">
                {isIT
                  ? 'TikTok, Instagram e YouTube vengono monitorati per trovare i trend food del momento, poi trasformati in ricette leggibili, originali e cucinabili.'
                  : 'TikTok, Instagram and YouTube are monitored to find the latest food trends, then transformed into readable, original and cookable recipes.'}
              </p>

              {/* Form waitlist */}
              <WaitlistForm locale={locale} />

              {/* Platform tags */}
              <div className="flex items-center gap-2.5 mt-6 flex-wrap">
                <span className="text-xs text-text-muted font-medium">
                  {isIT ? 'Contenuti da' : 'Content from'}
                </span>
                {platforms.map((p) => (
                  <span
                    key={p.label}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-background-card border border-border text-xs font-semibold text-text-secondary"
                  >
                    <span aria-hidden>{p.icon}</span>
                    {p.label}
                  </span>
                ))}
              </div>
            </div>

            {/* ── RIGHT: visual collage ──────────────────────────── */}
            <div className="hidden lg:block">
              <RecipeCollage isIT={isIT} />
            </div>
          </div>
        </div>
      </section>

      {/* ── DIVIDER ──────────────────────────────────────────────── */}
      <div className="container-main">
        <div className="border-t border-border" />
      </div>

      {/* ── FEATURES ─────────────────────────────────────────────── */}
      <section className="py-16 lg:py-20">
        <div className="container-main">
          <p className="text-center text-xs font-bold tracking-widest uppercase text-text-muted mb-3">
            {isIT ? 'Cosa troverai su TheViralRecipe' : 'What you\'ll find on TheViralRecipe'}
          </p>
          <h2 className="text-center text-2xl sm:text-3xl font-black text-text-primary tracking-tight mb-12">
            {isIT
              ? 'Tutto quello che ti serve per cucinare virale'
              : 'Everything you need to cook viral'}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f) => {
              const c = isIT ? f.it : f.en;
              return (
                <div
                  key={f.icon}
                  className="bg-background-card rounded-2xl border border-border p-6 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="w-11 h-11 bg-brand-50 rounded-xl flex items-center justify-center text-xl mb-4">
                    {f.icon}
                  </div>
                  <h3 className="font-bold text-text-primary mb-2 text-sm">{c.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{c.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────── */}
      <section className="py-12 bg-background-muted">
        <div className="container-main">
          <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-xl mx-auto text-center">
            {(
              [
                { value: '3', labelIT: 'Piattaforme monitorate', labelEN: 'Platforms monitored' },
                { value: '24h', labelIT: 'Aggiornamento trend', labelEN: 'Trend updates' },
                { value: '100%', labelIT: 'Ricette originali', labelEN: 'Original recipes' },
              ] as const
            ).map((s) => (
              <div key={s.value}>
                <p className="text-3xl sm:text-4xl font-black text-gradient-brand mb-1">
                  {s.value}
                </p>
                <p className="text-xs sm:text-sm text-text-muted font-medium">
                  {isIT ? s.labelIT : s.labelEN}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECOND CTA ───────────────────────────────────────────── */}
      <section className="py-16 lg:py-20">
        <div className="container-main">
          <div className="max-w-lg mx-auto text-center">
            <p className="text-2xl sm:text-3xl font-black text-text-primary mb-3 tracking-tight">
              {isIT ? 'Vuoi essere tra i primi?' : 'Want to be among the first?'}
            </p>
            <p className="text-text-secondary mb-8">
              {isIT
                ? 'Lascia la tua email — ti avvisiamo il giorno del lancio, niente spam.'
                : "Leave your email — we'll notify you on launch day, no spam."}
            </p>
            <WaitlistForm locale={locale} />
          </div>
        </div>
      </section>

    </div>
  );
}


// ── VISUAL COLLAGE (desktop only) ────────────────────────────────────

function RecipeCollage({ isIT }: { isIT: boolean }) {
  return (
    <div className="relative" style={{ height: 440 }}>

      {/* Card grande centrale */}
      <div className="absolute inset-6 bg-background-card rounded-3xl border border-border shadow-lg overflow-hidden flex flex-col">
        {/* Visual area */}
        <div className="flex-1 bg-gradient-to-br from-brand-50 via-accent-50 to-amber-50 flex flex-col items-center justify-center gap-3 p-6">
          <div className="grid grid-cols-3 gap-3">
            {mockRecipes.map((r) => (
              <div
                key={r.labelEN}
                className={`rounded-2xl bg-gradient-to-br ${r.bg} border border-border/60 p-3 flex flex-col items-center gap-1.5`}
              >
                <span className="text-2xl">{r.emoji}</span>
                <span className="text-2xs text-text-muted font-medium text-center leading-tight">
                  {isIT ? r.labelIT : r.labelEN}
                </span>
                <span className={`text-2xs font-bold ${r.badgeColor}`}>{r.badge}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer card */}
        <div className="px-5 py-4 border-t border-border flex items-center justify-between">
          <div>
            <p className="text-xs text-text-muted font-medium">
              {isIT ? 'Ricette virali questa settimana' : 'Viral recipes this week'}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="badge-brand">
                {isIT ? 'In arrivo' : 'Coming soon'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-text-muted font-medium">
            {platforms.map((p) => (
              <span key={p.label} aria-label={p.label}>
                {p.icon}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Floating card — top right */}
      <div
        className="absolute top-0 right-0 w-36 bg-background-card rounded-2xl border border-border shadow-md p-3"
        style={{ transform: 'rotate(3deg)' }}
      >
        <span className="text-xl">🔥</span>
        <p className="text-xs font-bold text-text-primary mt-1 leading-tight">
          {isIT ? 'Trending ora' : 'Trending now'}
        </p>
        <p className="text-2xs text-brand-500 font-bold mt-0.5">
          {isIT ? 'Aggiornato 1h fa' : 'Updated 1h ago'}
        </p>
      </div>

      {/* Floating card — bottom left */}
      <div
        className="absolute bottom-0 left-0 w-36 bg-background-card rounded-2xl border border-border shadow-md p-3"
        style={{ transform: 'rotate(-2deg)' }}
      >
        <span className="text-xl">🏆</span>
        <p className="text-xs font-bold text-text-primary mt-1 leading-tight">
          {isIT ? 'Classifica virale' : 'Viral ranking'}
        </p>
        <p className="text-2xs text-accent-500 font-bold mt-0.5">
          {isIT ? 'Ogni settimana' : 'Weekly updated'}
        </p>
      </div>

    </div>
  );
}
