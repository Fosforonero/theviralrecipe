'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Search, Menu, X, Flame, ChevronDown, User, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  locale: string;
}

export function Header({ locale }: HeaderProps) {
  const t = useTranslations('nav');
  const pathname = usePathname();

  // Stato header: scrollato → sfondo pieno, in cima → trasparente
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isIT = locale === 'it';

  // Link localizzati
  const links = {
    home: `/${locale}`,
    classifica: `/${locale}/${isIT ? 'classifica' : 'ranking'}`,
    categorie: `/${locale}/${isIT ? 'categorie' : 'categories'}`,
    cerca: `/${locale}/${isIT ? 'cerca' : 'search'}`,
    pro: `/${locale}/pro`,
    profilo: `/${locale}/${isIT ? 'profilo' : 'profile'}`,
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Chiudi menu mobile quando cambia la pagina
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-background-card/95 backdrop-blur-md shadow-sm border-b border-border'
          : 'bg-transparent'
      )}
      style={{ height: 'var(--header-height)' }}
    >
      <div className="container-main h-full flex items-center justify-between gap-4">

        {/* ── LOGO ─────────────────────────────────────────────── */}
        <Link
          href={links.home}
          className="flex items-center gap-2 shrink-0 group"
          aria-label="TheViralRecipe - Home"
        >
          {/* Icona fiamma */}
          <div className="w-8 h-8 bg-gradient-brand rounded-xl flex items-center justify-center shadow-glow-brand group-hover:scale-110 transition-transform duration-200">
            <Flame className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
          </div>

          {/* Nome sito */}
          <span className="font-bold text-lg tracking-tight">
            <span className="text-gradient-brand">TheViral</span>
            <span className="text-text-primary">Recipe</span>
          </span>
        </Link>

        {/* ── NAVIGAZIONE DESKTOP ──────────────────────────────── */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Navigazione principale">
          <NavLink href={links.classifica} label={t('classifica')} pathname={pathname} />
          <NavLink href={links.categorie} label={t('categorie')} pathname={pathname} />
        </nav>

        {/* ── AZIONI DESTRA ────────────────────────────────────── */}
        <div className="flex items-center gap-2">

          {/* Search */}
          <Link
            href={links.cerca}
            className="p-2 rounded-xl hover:bg-background-muted transition-colors"
            aria-label={t('cerca')}
          >
            <Search className="w-5 h-5 text-text-secondary" />
          </Link>

          {/* Language switcher */}
          <Link
            href={pathname.replace(`/${locale}`, locale === 'it' ? '/en' : '/it')}
            className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-background-muted transition-colors"
            aria-label="Switch language"
          >
            {locale === 'it' ? '🇬🇧 EN' : '🇮🇹 IT'}
          </Link>

          {/* CTA Pro */}
          <Link
            href={links.pro}
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-brand text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm"
          >
            <Star className="w-3.5 h-3.5" fill="white" />
            Pro
          </Link>

          {/* Profilo / Login */}
          <Link
            href={links.profilo}
            className="p-2 rounded-xl hover:bg-background-muted transition-colors"
            aria-label={t('profilo')}
          >
            <User className="w-5 h-5 text-text-secondary" />
          </Link>

          {/* Menu burger mobile */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-background-muted transition-colors"
            aria-label={menuOpen ? 'Chiudi menu' : 'Apri menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen
              ? <X className="w-5 h-5 text-text-primary" />
              : <Menu className="w-5 h-5 text-text-secondary" />
            }
          </button>
        </div>
      </div>

      {/* ── MENU MOBILE ──────────────────────────────────────────── */}
      {menuOpen && (
        <div className="md:hidden bg-background-card border-t border-border animate-fade-in">
          <nav className="container-main py-4 flex flex-col gap-1" aria-label="Menu mobile">
            <MobileNavLink href={links.classifica} label={t('classifica')} />
            <MobileNavLink href={links.categorie} label={t('categorie')} />
            <MobileNavLink href={links.cerca} label="Cerca ricette" />

            <div className="border-t border-border my-2" />

            <MobileNavLink href={links.profilo} label={t('profilo')} />
            <Link
              href={links.pro}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-brand text-white font-semibold text-sm mt-1"
            >
              <Star className="w-4 h-4" fill="white" />
              {t('pro')}
            </Link>

            <div className="border-t border-border my-2" />

            <Link
              href={pathname.replace(`/${locale}`, locale === 'it' ? '/en' : '/it')}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-text-secondary hover:bg-background-muted transition-colors"
            >
              {locale === 'it' ? '🇬🇧 Switch to English' : '🇮🇹 Passa all\'italiano'}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

// ── SUB-COMPONENTI ──────────────────────────────────────────────────

function NavLink({ href, label, pathname }: { href: string; label: string; pathname: string }) {
  const isActive = pathname === href || pathname.startsWith(href + '/');
  return (
    <Link
      href={href}
      className={cn(
        'px-4 py-2 rounded-xl text-sm font-medium transition-colors',
        isActive
          ? 'bg-background-muted text-text-primary'
          : 'text-text-secondary hover:text-text-primary hover:bg-background-muted'
      )}
    >
      {label}
    </Link>
  );
}

function MobileNavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="px-4 py-3 rounded-xl text-sm font-medium text-text-primary hover:bg-background-muted transition-colors"
    >
      {label}
    </Link>
  );
}
