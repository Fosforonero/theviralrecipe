/**
 * API — Stripe Checkout
 * Crea una sessione di checkout e redirige l'utente su Stripe.
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServerSupabaseClient } from '@/lib/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
});

const PRICE_IDS: Record<string, string> = {
  pro:     process.env.STRIPE_PRO_MONTHLY_PRICE_ID!,
  creator: process.env.STRIPE_CREATOR_PRO_PRICE_ID!,
};

export async function POST(req: NextRequest) {
  try {
    // Controlla autenticazione
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
    }

    const { plan, locale = 'it' } = await req.json();

    if (!PRICE_IDS[plan]) {
      return NextResponse.json({ error: 'Piano non valido' }, { status: 400 });
    }

    // Recupera o crea il customer Stripe
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;

      // Salva il customer ID nel profilo
      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id);
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!;

    // Crea la sessione di checkout
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: PRICE_IDS[plan], quantity: 1 }],
      allow_promotion_codes: true,
      subscription_data: {
        trial_period_days: plan === 'creator' ? 14 : 7,
        metadata: {
          supabase_user_id: user.id,
          plan,
        },
      },
      success_url: `${baseUrl}/${locale}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/${locale}/pro`,
      metadata: {
        supabase_user_id: user.id,
        plan,
        locale,
      },
    });

    return NextResponse.json({ url: session.url });

  } catch (e) {
    console.error('Stripe checkout error:', e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Errore sconosciuto' },
      { status: 500 }
    );
  }
}
