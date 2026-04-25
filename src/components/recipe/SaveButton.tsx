'use client';

import { useState, useTransition } from 'react';
import { Bookmark } from 'lucide-react';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

interface SaveButtonProps {
  recipeId: string;
  initialSaved?: boolean;
  className?: string;
}

export function SaveButton({ recipeId, initialSaved = false, className }: SaveButtonProps) {
  const t = useTranslations('recipe');
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    startTransition(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Accedi per salvare le ricette!', { icon: '👤' });
        return;
      }

      if (saved) {
        // Rimuovi dai salvati
        const { error } = await supabase
          .from('saved_recipes')
          .delete()
          .eq('recipe_id', recipeId)
          .eq('user_id', user.id);

        if (!error) {
          setSaved(false);
          toast('Rimossa dai salvati', { icon: '🗑️' });
        }
      } else {
        // Controlla limite piano free (max 10 ricette salvate)
        const { count } = await supabase
          .from('saved_recipes')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        const { data: profile } = await supabase
          .from('profiles')
          .select('plan')
          .eq('id', user.id)
          .single();

        if ((count ?? 0) >= 10 && profile?.plan === 'free') {
          toast.error('Hai raggiunto il limite di 10 ricette. Passa a Pro per salvarne illimitate!', {
            duration: 4000,
            icon: '⭐',
          });
          return;
        }

        const { error } = await supabase
          .from('saved_recipes')
          .insert({ recipe_id: recipeId, user_id: user.id });

        if (!error) {
          setSaved(true);
          toast.success('Ricetta salvata!', { icon: '🔖' });
        }
      }
    });
  };

  return (
    <button
      onClick={handleSave}
      disabled={isPending}
      className={cn(
        'flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 border',
        saved
          ? 'bg-brand-50 text-brand-600 border-brand-200'
          : 'bg-background-muted text-text-secondary border-border hover:border-brand-200 hover:text-brand-500',
        isPending && 'opacity-70 cursor-not-allowed',
        className
      )}
      aria-label={saved ? t('saved') : t('save')}
      aria-pressed={saved}
    >
      <Bookmark className={cn('w-4 h-4', saved && 'fill-current')} />
      {saved ? t('saved') : t('save')}
    </button>
  );
}
