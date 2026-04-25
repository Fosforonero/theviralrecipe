import type { Metadata } from 'next';
import Link from 'next/link';
import { Check, Star, Zap, ShieldCheck } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'it' ? 'TheViralRecipe Pro — Cucinare senza limiti' : 'TheViralRecipe Pro — Cook without limits',
    description: locale === 'it'
      ? 'Sblocca valori nutrizionali, lista spesa automatica, raccolte illimitate. Solo 4,99€/mese.'
      : 'Unlock nutrition facts, automatic shopping list, unlimited collections. Only €4.99/month.',
  };
}

export default async function ProPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isIT = locale === 'it';

  const features = {
    pro: [
      { icon: '🚫', label: isIT ? 'Zero pubblicità' : 'Zero ads' },
      { icon: '📊', label: isIT ? 'Valori nutrizionali di ogni ricetta' : 'Full nutrition facts for every recipe' },
      { icon: '🔖', label: isIT ? 'Salvataggio ricette illimitato' : 'Unlimited recipe saving' },
      { icon: '📁', label: isIT ? 'Raccolte personali illimitate' : 'Unlimited personal collections' },
      { icon: '🛒', label: isIT ? 'Lista della spesa automatica' : 'Automatic shopping list' },
      { icon: '⚡', label: isIT ? 'Accesso anticipato alle ricette virali' : 'Early access to viral recipes' },
      { icon: '⭐', label: isIT ? 'Badge Pro sul profilo' : 'Pro badge on your profile' },
    ],
    creator: [
      { icon: '✅', label: isIT ? 'Profilo creator verificato' : 'Verified creator profile' },
      { icon: '🔝', label: isIT ? 'Ricette in evidenza in home' : 'Featured recipes on homepage' },
      { icon: '📈', label: isIT ? 'Analytics avanzate' : 'Advanced analytics' },
      { icon: '🎨', label: isIT ? 'Pagina creator personalizzata' : 'Custom creator page' },
      { icon: '🖼️', label: isIT ? 'Card ricetta brandizzate' : 'Branded recipe cards' },
      { icon: '📧', label: isIT ? 'Integrazione newsletter' : 'Newsletter integration' },
    ],
  };

  return (
    <div className="pt-header py-16 sm:py-24 bg-gradient-to-b from-background to-background-muted min-h-screen">
      <div className="container-main max-w-narrow">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-50 text-brand-600 rounded-full text-sm font-semibold border border-brand-100 mb-6">
            <Star className="w-4 h-4" fill="currentColor" />
            {isIT ? 'Piano Pro' : 'Pro Plan'}
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-text-primary mb-4 tracking-tight">
            {isIT ? 'Cucina senza limiti' : 'Cook without limits'}
          </h1>
          <p className="text-xl text-text-secondary max-w-md mx-auto">
            {isIT
              ? 'Tutto quello di cui hai bisogno per cucinare meglio, ogni giorno.'
              : 'Everything you need to cook better, every day.'}
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid sm:grid-cols-2 gap-6 mb-12">

          {/* Piano Pro Utente */}
          <div className="bg-background-card rounded-3xl border-2 border-brand-400 p-8 relative shadow-lg shadow-brand-100">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="badge badge-pro px-4 py-1 text-sm">
                {isIT ? '⭐ Più popolare' : '⭐ Most popular'}
              </span>
            </div>

            <div className="mb-6">
              <h2 className="font-bold text-xl mb-1">{isIT ? 'Pro' : 'Pro'}</h2>
              <p className="text-text-muted text-sm mb-4">
                {isIT ? 'Per chi vuole cucinare meglio' : 'For those who want to cook better'}
              </p>
              <div className="flex items-end gap-1">
                <span className="text-4xl font-black text-text-primary">4,99€</span>
                <span className="text-text-muted mb-1">/{isIT ? 'mese' : 'month'}</span>
              </div>
              <p className="text-xs text-text-muted mt-1">
                {isIT ? 'Annullabile in qualsiasi momento' : 'Cancel anytime'}
              </p>
            </div>

            <ul className="space-y-3 mb-8">
              {features.pro.map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-text-primary">
                  <span className="text-base shrink-0">{f.icon}</span>
                  {f.label}
                </li>
              ))}
            </ul>

            <Link
              href={`/${locale}/checkout?plan=pro`}
              className="btn-primary w-full justify-center py-3.5 rounded-2xl text-base shadow-glow-brand"
            >
              {isIT ? 'Inizia ora — 4,99€/mese' : 'Start now — €4.99/month'}
            </Link>
            <p className="text-center text-xs text-text-muted mt-3">
              {isIT ? '7 giorni di prova gratuita' : '7-day free trial'}
            </p>
          </div>

          {/* Piano Creator Pro */}
          <div className="bg-background-card rounded-3xl border border-border p-8">
            <div className="mb-6">
              <h2 className="font-bold text-xl mb-1">Creator Pro</h2>
              <p className="text-text-muted text-sm mb-4">
                {isIT ? 'Per food creator e influencer' : 'For food creators and influencers'}
              </p>
              <div className="flex items-end gap-1">
                <span className="text-4xl font-black text-text-primary">19€</span>
                <span className="text-text-muted mb-1">/{isIT ? 'mese' : 'month'}</span>
              </div>
              <p className="text-xs text-text-muted mt-1">
                {isIT ? 'Include tutto il piano Pro' : 'Includes everything in Pro'}
              </p>
            </div>

            <ul className="space-y-3 mb-8">
              {features.creator.map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-text-primary">
                  <span className="text-base shrink-0">{f.icon}</span>
                  {f.label}
                </li>
              ))}
            </ul>

            <Link
              href={`/${locale}/checkout?plan=creator`}
              className="btn-secondary w-full justify-center py-3.5 rounded-2xl text-base"
            >
              {isIT ? 'Diventa Creator Pro' : 'Become Creator Pro'}
            </Link>
            <p className="text-center text-xs text-text-muted mt-3">
              {isIT ? '14 giorni di prova gratuita' : '14-day free trial'}
            </p>
          </div>
        </div>

        {/* Brand partner */}
        <div className="text-center p-8 bg-dark-bg text-white rounded-3xl mb-12">
          <h3 className="font-bold text-xl mb-2">
            {isIT ? '🏢 Brand Partner' : '🏢 Brand Partner'}
          </h3>
          <p className="text-white/70 text-sm mb-4 max-w-md mx-auto">
            {isIT
              ? 'Sei un brand food? Parliamo di sponsorizzazioni, ricette featured e newsletter. Piano su misura.'
              : 'Are you a food brand? Let\'s talk about sponsorships, featured recipes and newsletter. Custom plan.'}
          </p>
          <Link
            href={`mailto:brand@theviralrecipe.com`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-dark-bg rounded-2xl font-bold text-sm hover:bg-gray-100 transition-colors"
          >
            {isIT ? 'Contattaci' : 'Contact us'}
          </Link>
        </div>

        {/* Garanzie */}
        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            { icon: <ShieldCheck className="w-6 h-6 text-green-500" />, label: isIT ? 'Pagamento sicuro' : 'Secure payment' },
            { icon: <Zap className="w-6 h-6 text-brand-500" />, label: isIT ? 'Attivazione immediata' : 'Instant activation' },
            { icon: <Check className="w-6 h-6 text-blue-500" />, label: isIT ? 'Annulla quando vuoi' : 'Cancel anytime' },
          ].map((g, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              {g.icon}
              <span className="text-xs text-text-muted">{g.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
