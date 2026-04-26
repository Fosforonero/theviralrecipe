import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'TheViralRecipe — Le ricette più virali del web',
  description: 'Le ricette più virali di TikTok, Instagram e YouTube. In arrivo.',
};

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isIT = locale === 'it';

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center relative overflow-hidden">

      {/* ── SFONDO ANIMATO ──────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Blob principale rosso */}
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, #FF3A2D 0%, transparent 70%)',
            filter: 'blur(80px)',
            animation: 'pulse 6s ease-in-out infinite',
          }}
        />
        {/* Blob arancio a destra */}
        <div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-15"
          style={{
            background: 'radial-gradient(circle, #FF8C00 0%, transparent 70%)',
            filter: 'blur(60px)',
            animation: 'pulse 8s ease-in-out infinite 2s',
          }}
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
        {/* Noise overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
          }}
        />
      </div>

      {/* ── CONTENUTO CENTRALE ─────────────────────────────────────── */}
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">

        {/* Logo / wordmark */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #FF3A2D 0%, #FF8C00 100%)' }}
          >
            🔥
          </div>
          <span className="text-white font-black text-2xl tracking-tight">
            TheViral<span style={{ color: '#FF3A2D' }}>Recipe</span>
          </span>
        </div>

        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-8"
          style={{
            background: 'rgba(255,58,45,0.12)',
            border: '1px solid rgba(255,58,45,0.3)',
            color: '#FF6B5B',
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: '#FF3A2D',
              boxShadow: '0 0 6px #FF3A2D',
              animation: 'blink 1.5s ease-in-out infinite',
            }}
          />
          {isIT ? 'In costruzione' : 'Under construction'}
        </div>

        {/* Headline */}
        <h1
          className="font-black text-white mb-6 leading-[1.05]"
          style={{
            fontSize: 'clamp(2.5rem, 8vw, 5rem)',
            letterSpacing: '-0.03em',
          }}
        >
          {isIT ? (
            <>
              Le ricette più{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #FF3A2D 0%, #FF8C00 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontStyle: 'italic',
                }}
              >
                virali
              </span>
              {' '}del web
            </>
          ) : (
            <>
              The most{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #FF3A2D 0%, #FF8C00 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontStyle: 'italic',
                }}
              >
                viral
              </span>
              {' '}recipes on the web
            </>
          )}
        </h1>

        {/* Sottotitolo */}
        <p
          className="text-lg sm:text-xl mb-12 leading-relaxed"
          style={{ color: 'rgba(255,255,255,0.5)' }}
        >
          {isIT
            ? 'Stiamo costruendo qualcosa di straordinario. TikTok, Instagram, YouTube — tutte le ricette che stanno impazzendo sul web, in un unico posto.'
            : "We're building something extraordinary. TikTok, Instagram, YouTube — all the recipes going viral, in one place."}
        </p>

        {/* Piattaforme */}
        <div className="flex items-center justify-center gap-6 mb-12">
          {[
            { icon: '🎵', label: 'TikTok' },
            { icon: '📸', label: 'Instagram' },
            { icon: '▶️', label: 'YouTube' },
          ].map((p) => (
            <div
              key={p.label}
              className="flex flex-col items-center gap-2"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                {p.icon}
              </div>
              <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.3)' }}>
                {p.label}
              </span>
            </div>
          ))}
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-3 gap-4 mb-14">
          {[
            { value: '15+', label: isIT ? 'Ricette seed' : 'Seed recipes' },
            { value: '8', label: isIT ? 'Categorie' : 'Categories' },
            { value: '3', label: isIT ? 'Piattaforme' : 'Platforms' },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl p-4"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <div
                className="text-2xl sm:text-3xl font-black mb-1"
                style={{
                  background: 'linear-gradient(135deg, #FF3A2D 0%, #FF8C00 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {s.value}
              </div>
              <div className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Barra di progresso */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.35)' }}>
              {isIT ? 'Completamento' : 'Progress'}
            </span>
            <span className="text-xs font-bold" style={{ color: '#FF6B5B' }}>78%</span>
          </div>
          <div
            className="w-full h-1.5 rounded-full overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.08)' }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: '78%',
                background: 'linear-gradient(90deg, #FF3A2D 0%, #FF8C00 100%)',
                boxShadow: '0 0 12px rgba(255,58,45,0.5)',
              }}
            />
          </div>
        </div>

        {/* Checklist */}
        <div
          className="rounded-2xl p-6 mb-10 text-left"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.25)' }}>
            {isIT ? 'Cosa stiamo costruendo' : "What we're building"}
          </p>
          <div className="space-y-3">
            {[
              { done: true,  text: isIT ? 'Database ricette + pipeline AI' : 'Recipe database + AI pipeline' },
              { done: true,  text: isIT ? '15 ricette seed pubblicate' : '15 seed recipes published' },
              { done: true,  text: isIT ? 'Backend + API Supabase' : 'Backend + Supabase API' },
              { done: false, text: isIT ? 'Design homepage (in corso 🔥)' : 'Homepage design (in progress 🔥)' },
              { done: false, text: isIT ? 'Pagine ricette con step-by-step' : 'Recipe pages with step-by-step' },
              { done: false, text: isIT ? 'Piano Pro + Stripe' : 'Pro plan + Stripe' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs"
                  style={{
                    background: item.done
                      ? 'linear-gradient(135deg, #FF3A2D 0%, #FF8C00 100%)'
                      : 'rgba(255,255,255,0.06)',
                    border: item.done ? 'none' : '1px solid rgba(255,255,255,0.12)',
                  }}
                >
                  {item.done ? '✓' : ''}
                </div>
                <span
                  className="text-sm"
                  style={{
                    color: item.done ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)',
                    textDecoration: item.done ? 'none' : 'none',
                    fontWeight: item.done ? '500' : '400',
                  }}
                >
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Contatti */}
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
          {isIT ? 'Contatti: ' : 'Contact: '}
          <a
            href="mailto:brand@theviralrecipe.com"
            className="hover:opacity-60 transition-opacity"
            style={{ color: 'rgba(255,255,255,0.35)' }}
          >
            brand@theviralrecipe.com
          </a>
        </p>

      </div>

      {/* ── ANIMAZIONI CSS INLINE ──────────────────────────────────── */}
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.2; }
          50% { transform: translate(-50%, -50%) scale(1.15); opacity: 0.3; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
