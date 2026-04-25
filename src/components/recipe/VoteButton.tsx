'use client';

import { useState, useTransition } from 'react';
import { Heart } from 'lucide-react';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase/client';
import { cn, formatCount } from '@/lib/utils';

interface VoteButtonProps {
  recipeId: string;
  initialVotes: number;
  className?: string;
}

export function VoteButton({ recipeId, initialVotes, className }: VoteButtonProps) {
  const t = useTranslations('recipe');

  // Stato ottimistico: aggiorna immediatamente l'UI
  const [voted, setVoted]   = useState(false);
  const [votes, setVotes]   = useState(initialVotes);
  const [isPending, startTransition] = useTransition();

  const handleVote = () => {
    startTransition(async () => {
      // Controlla autenticazione
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error(
          'Accedi per votare le ricette!',
          { icon: '👤', duration: 3000 }
        );
        return;
      }

      if (voted) {
        // Rimuovi voto (toggle)
        const { error } = await supabase
          .from('recipe_votes')
          .delete()
          .eq('recipe_id', recipeId)
          .eq('user_id', user.id);

        if (!error) {
          setVoted(false);
          setVotes((v) => Math.max(0, v - 1));
        }
      } else {
        // Aggiungi voto
        const { error } = await supabase
          .from('recipe_votes')
          .insert({ recipe_id: recipeId, user_id: user.id });

        if (!error) {
          setVoted(true);
          setVotes((v) => v + 1);
          toast.success('Ricetta votata! ❤️', { duration: 2000 });
        } else if (error.code === '23505') {
          // Già votata (constraint violation) — sync stato
          setVoted(true);
        }
      }
    });
  };

  return (
    <button
      onClick={handleVote}
      disabled={isPending}
      className={cn(
        'flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200',
        voted
          ? 'bg-brand-500 text-white shadow-glow-brand scale-105'
          : 'bg-background-muted text-text-secondary hover:bg-brand-50 hover:text-brand-500 border border-border',
        isPending && 'opacity-70 cursor-not-allowed',
        className
      )}
      aria-label={voted ? t('voted') : t('vote')}
      aria-pressed={voted}
    >
      <Heart
        className={cn('w-4 h-4 transition-all duration-200', voted && 'fill-current animate-bounce-in')}
      />
      <span>{formatCount(votes)}</span>
    </button>
  );
}
