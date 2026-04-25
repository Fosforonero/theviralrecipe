import Link from 'next/link';
import { Flame } from 'lucide-react';

interface FooterProps {
  locale: string;
}

export function Footer({ locale }: FooterProps) {
  const isIT = locale === 'it';
  const currentYear = new Date().getFullYear();

  const links = {
    ranking:    `/${locale}/${isIT ? 'classifica' : 'ranking'}`,
    categories: `/${locale}/${isIT ? 'categorie' : 'categories'}`,
    pro:        `/${locale}/pro`,
    creator:    `/${locale}/creator`,
    about:      `/${locale}/${isIT ? 'chi-siamo' : 'about'}`,
    privacy:    `/${locale}/privacy`,
    terms:      `/${locale}/${isIT ? 'termini' : 'terms'}`,
    contact:    `/${locale}/${isIT ? 'contatti' : 'contact'}`,
  };

  return (
    <footer className="bg-dark-bg text-white/70 border-t border-dark-border">
      <div className="container-main py-12 sm:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-12">

          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <Link href={`/${locale}`} className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-brand rounded-xl flex items-center justify-center">
                <Flame className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-white">
                <span className="text-brand-400">TheViral</span>Recipe
              </span>
            </Link>
            <p className="text-sm text-white/50 leading-relaxed">
              {isIT
                ? 'Le ricette più virali di TikTok, Instagram e YouTube. Nuove ogni giorno.'
                : 'The most viral recipes from TikTok, Instagram and YouTube. New ones every day.'}
            </p>
          </div>

          {/* Esplora */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4">
              {isIT ? 'Esplora' : 'Explore'}
            </h4>
            <ul className="space-y-2.5">
              <FooterLink href={links.ranking}    label={isIT ? 'Classifica' : 'Rankings'} />
              <FooterLink href={links.categories} label={isIT ? 'Categorie' : 'Categories'} />
              <FooterLink href={links.pro}        label="Pro ⭐" />
            </ul>
          </div>

          {/* Creator */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Creator</h4>
            <ul className="space-y-2.5">
              <FooterLink href={links.creator} label={isIT ? 'Diventa Creator' : 'Become a Creator'} />
              <FooterLink href={links.creator + '/pro'} label={isIT ? 'Piano Creator Pro' : 'Creator Pro Plan'} />
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Info</h4>
            <ul className="space-y-2.5">
              <FooterLink href={links.about}   label={isIT ? 'Chi siamo' : 'About us'} />
              <FooterLink href={links.privacy} label="Privacy Policy" />
              <FooterLink href={links.terms}   label={isIT ? 'Termini di servizio' : 'Terms of service'} />
              <FooterLink href={links.contact} label={isIT ? 'Contatti' : 'Contact'} />
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-dark-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            © {currentYear} TheViralRecipe. {isIT ? 'Tutti i diritti riservati.' : 'All rights reserved.'}
          </p>

          {/* Disclaimer affiliazione */}
          <p className="text-xs text-white/30 text-center sm:text-right max-w-md">
            {isIT
              ? 'Partecipante al Programma di Affiliazione Amazon. Guadagniamo commissioni dagli acquisti qualificati.'
              : 'Participant in the Amazon Affiliate Program. We earn commissions from qualifying purchases.'}
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm text-white/50 hover:text-white transition-colors"
      >
        {label}
      </Link>
    </li>
  );
}
