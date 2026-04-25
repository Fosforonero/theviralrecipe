'use client';

import { useState } from 'react';
import { Share2, Check, Copy } from 'lucide-react';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

interface ShareButtonProps {
  title: string;
  className?: string;
}

export function ShareButton({ title, className }: ShareButtonProps) {
  const t = useTranslations();
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    const text = `${t('common.share_text')} ${title}`;

    // Usa l'API nativa di condivisione se disponibile (mobile)
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch {
        // L'utente ha annullato — fallback al copia link
      }
    }

    // Fallback: copia link negli appunti
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success(t('common.copied'), { icon: '🔗', duration: 2000 });
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error('Impossibile copiare il link');
    }
  };

  return (
    <button
      onClick={handleShare}
      className={cn(
        'flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200',
        'border border-border bg-background-muted text-text-secondary',
        'hover:border-border-strong hover:text-text-primary',
        className
      )}
      aria-label={t('recipe.share')}
    >
      {copied
        ? <Check className="w-4 h-4 text-green-500" />
        : <Share2 className="w-4 h-4" />
      }
      {t('recipe.share')}
    </button>
  );
}
