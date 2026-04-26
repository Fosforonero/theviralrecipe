import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TheViralRecipe — Coming Soon',
  description: 'Le ricette più virali di TikTok, Instagram e YouTube. In arrivo molto presto.',
};

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isIT = locale === 'it';

  return (
    <>
      {/* Copre header e footer al 100% */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: '#080808',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          overflow: 'hidden',
        }}
      >

        {/* ── BLOB DI LUCE ──────────────────────────────────────── */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden',
        }}>
          {/* Blob rosso centrale in alto */}
          <div className="wip-blob" style={{
            position: 'absolute',
            top: '-10%', left: '50%', transform: 'translateX(-50%)',
            width: 700, height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(255,50,30,0.18) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }} />
          {/* Blob arancio in basso a destra */}
          <div className="wip-blob-2" style={{
            position: 'absolute',
            bottom: '-5%', right: '-5%',
            width: 500, height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(255,140,0,0.12) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }} />
          {/* Sottile griglia */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),' +
              'linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }} />
        </div>

        {/* ── CONTENUTO ─────────────────────────────────────────── */}
        <div style={{
          position: 'relative', zIndex: 1,
          textAlign: 'center', padding: '0 24px',
          maxWidth: 560, width: '100%',
        }}>

          {/* LOGO */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 12,
            marginBottom: 48,
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: 'linear-gradient(135deg, #FF3A2D 0%, #FF8C00 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24,
              boxShadow: '0 0 32px rgba(255,58,45,0.35)',
            }}>
              🔥
            </div>
            <span style={{
              color: '#fff', fontWeight: 900, fontSize: 22, letterSpacing: '-0.03em',
            }}>
              TheViral<span style={{ color: '#FF3A2D' }}>Recipe</span>
            </span>
          </div>

          {/* BADGE */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px', borderRadius: 999,
            background: 'rgba(255,58,45,0.1)',
            border: '1px solid rgba(255,58,45,0.25)',
            color: '#FF7060',
            fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: 28,
          }}>
            <span className="wip-dot-blink" style={{
              display: 'inline-block',
              width: 6, height: 6, borderRadius: '50%',
              background: '#FF3A2D',
              boxShadow: '0 0 8px #FF3A2D',
            }} />
            {isIT ? 'In arrivo' : 'Coming soon'}
          </div>

          {/* HEADLINE */}
          <h1 style={{
            color: '#fff',
            fontWeight: 900,
            fontSize: 'clamp(2.2rem, 7vw, 4.2rem)',
            lineHeight: 1.05,
            letterSpacing: '-0.04em',
            margin: '0 0 20px',
          }}>
            {isIT ? (
              <>Le ricette più{' '}
                <span style={{
                  background: 'linear-gradient(135deg, #FF3A2D 0%, #FFAB1A 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontStyle: 'italic',
                }}>virali</span>
                {' '}del web
              </>
            ) : (
              <>The most{' '}
                <span style={{
                  background: 'linear-gradient(135deg, #FF3A2D 0%, #FFAB1A 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontStyle: 'italic',
                }}>viral</span>
                {' '}recipes on the web
              </>
            )}
          </h1>

          {/* SOTTOTITOLO */}
          <p style={{
            color: 'rgba(255,255,255,0.42)',
            fontSize: 16, lineHeight: 1.65,
            margin: '0 0 48px',
          }}>
            {isIT
              ? 'Stiamo costruendo qualcosa di straordinario. TikTok, Instagram, YouTube — tutte le ricette virali in un unico posto.'
              : "We're building something extraordinary. TikTok, Instagram, YouTube — all viral recipes in one place."}
          </p>

          {/* PROGRESS BAR */}
          <div style={{ marginBottom: 40 }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              marginBottom: 10,
            }}>
              <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12, fontWeight: 600 }}>
                {isIT ? 'Completamento' : 'Progress'}
              </span>
              <span style={{ color: '#FF7060', fontSize: 12, fontWeight: 700 }}>78%</span>
            </div>
            <div style={{
              width: '100%', height: 3, borderRadius: 999,
              background: 'rgba(255,255,255,0.07)',
            }}>
              <div style={{
                width: '78%', height: '100%', borderRadius: 999,
                background: 'linear-gradient(90deg, #FF3A2D 0%, #FFAB1A 100%)',
                boxShadow: '0 0 16px rgba(255,58,45,0.45)',
              }} />
            </div>
          </div>

          {/* FEATURES ROW */}
          <div style={{
            display: 'flex', gap: 12, justifyContent: 'center',
            flexWrap: 'wrap', marginBottom: 48,
          }}>
            {[
              { e: '🎵', t: 'TikTok' },
              { e: '📸', t: 'Instagram' },
              { e: '▶️', t: 'YouTube' },
            ].map(p => (
              <div key={p.t} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 16px', borderRadius: 12,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}>
                <span style={{ fontSize: 16 }}>{p.e}</span>
                <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, fontWeight: 600 }}>
                  {p.t}
                </span>
              </div>
            ))}
          </div>

          {/* EMAIL */}
          <div style={{
            display: 'flex', gap: 8,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16, padding: 6,
            marginBottom: 32,
          }}>
            <input
              type="email"
              placeholder={isIT ? 'La tua email per essere avvisato' : 'Your email to be notified'}
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                color: '#fff', fontSize: 14, padding: '8px 12px',
                fontFamily: 'inherit',
              }}
            />
            <button
              type="button"
              style={{
                background: 'linear-gradient(135deg, #FF3A2D 0%, #FF8C00 100%)',
                border: 'none', borderRadius: 12, cursor: 'pointer',
                color: '#fff', fontWeight: 700, fontSize: 13,
                padding: '10px 20px', fontFamily: 'inherit',
                whiteSpace: 'nowrap',
              }}
            >
              {isIT ? 'Avvisami' : 'Notify me'}
            </button>
          </div>

          {/* FOOTER NOTE */}
          <p style={{ color: 'rgba(255,255,255,0.15)', fontSize: 12 }}>
            {isIT ? '© 2026 TheViralRecipe' : '© 2026 TheViralRecipe'}
            {'  ·  '}
            <a
              href="mailto:brand@theviralrecipe.com"
              style={{ color: 'rgba(255,255,255,0.25)', textDecoration: 'none' }}
            >
              brand@theviralrecipe.com
            </a>
          </p>

        </div>
      </div>
    </>
  );
}
