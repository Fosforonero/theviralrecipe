'use client';

import { useState } from 'react';

interface WaitlistFormProps {
  locale: string;
}

export function WaitlistForm({ locale }: WaitlistFormProps) {
  const isIT = locale === 'it';
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim() || state === 'loading') return;

    setState('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), locale }),
      });

      const data = (await res.json()) as { ok: boolean; error?: string };

      if (data.ok) {
        setState('success');
        setEmail('');
      } else {
        const isInvalidEmail = data.error === 'email_invalid';
        setErrorMsg(
          isIT
            ? isInvalidEmail
              ? 'Email non valida. Controlla e riprova.'
              : 'Qualcosa è andato storto. Riprova.'
            : isInvalidEmail
            ? 'Invalid email. Please check and try again.'
            : 'Something went wrong. Please try again.',
        );
        setState('error');
      }
    } catch {
      setErrorMsg(
        isIT ? 'Errore di rete. Riprova tra poco.' : 'Network error. Please try again.',
      );
      setState('error');
    }
  };

  if (state === 'success') {
    return (
      <div className="flex items-center gap-3 px-5 py-4 bg-green-50 border border-green-200 rounded-2xl">
        <span className="text-xl shrink-0">✅</span>
        <div>
          <p className="font-semibold text-sm text-green-800">
            {isIT ? 'Sei nella lista!' : "You're on the list!"}
          </p>
          <p className="text-xs text-green-600 mt-0.5">
            {isIT
              ? 'Ti avviseremo il giorno del lancio.'
              : "We'll notify you on launch day."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-2" noValidate>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={isIT ? 'La tua email' : 'Your email'}
          required
          disabled={state === 'loading'}
          className="input-base flex-1 min-w-0"
          aria-label={isIT ? 'La tua email' : 'Your email'}
        />
        <button
          type="submit"
          disabled={state === 'loading' || !email.trim()}
          className="btn-primary shrink-0"
          style={{ minWidth: '100px' }}
        >
          {state === 'loading' ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {isIT ? 'Invio…' : 'Sending…'}
            </span>
          ) : isIT ? (
            'Avvisami'
          ) : (
            'Notify me'
          )}
        </button>
      </form>
      {state === 'error' && (
        <p className="text-sm text-error mt-2 flex items-center gap-1.5">
          <span aria-hidden>⚠</span>
          {errorMsg}
        </p>
      )}
    </div>
  );
}
