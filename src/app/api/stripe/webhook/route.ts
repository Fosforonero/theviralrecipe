/**
 * API — Stripe Webhook
 * Gestisce gli eventi Stripe per aggiornare il piano utente nel database.
 *
 * Eventi gestiti:
 * - checkout.session.completed → attiva il piano
 * - customer.subscription.updated → aggiorna expiry
 * - customer.subscription.deleted → revoca il piano (downgrade a free)
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServerSupabaseAdminClient } from '@/lib/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig  = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (e) {
    console.error('Webhook signature error:', e);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = await createServerSupabaseAdminClient();

  try {
    switch (event.type) {

      // ── Checkout completato → attiva piano ────────────────────
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId  = session.metadata?.supabase_user_id;
        const plan    = session.metadata?.plan;

        if (!userId || !plan) break;

        // Recupera la subscription per la data di expiry
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

        await supabase
          .from('profiles')
          .update({
            plan: plan === 'creator' ? 'pro' : 'pro',  // entrambi mappano a 'pro' per i benefici base
            pro_expires_at: new Date(subscription.current_period_end * 1000).toISOString(),
          })
          .eq('id', userId);

        // Se è creator, crea/aggiorna il creator_profile
        if (plan === 'creator') {
          // Controlla se esiste già
          const { data: existing } = await supabase
            .from('creator_profiles')
            .select('id')
            .eq('id', userId)
            .single();

          if (existing) {
            await supabase
              .from('creator_profiles')
              .update({
                tier: 'pro',
                stripe_subscription_id: subscription.id,
                tier_expires_at: new Date(subscription.current_period_end * 1000).toISOString(),
              })
              .eq('id', userId);
          }
        }

        console.log(`✅ Piano ${plan} attivato per utente ${userId}`);
        break;
      }

      // ── Subscription aggiornata ────────────────────────────────
      case 'customer.subscription.updated': {
        const sub    = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.supabase_user_id;
        if (!userId) break;

        await supabase
          .from('profiles')
          .update({
            pro_expires_at: new Date(sub.current_period_end * 1000).toISOString(),
          })
          .eq('id', userId);

        break;
      }

      // ── Subscription cancellata → downgrade a free ─────────────
      case 'customer.subscription.deleted': {
        const sub    = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.supabase_user_id;
        if (!userId) break;

        await supabase
          .from('profiles')
          .update({ plan: 'free', pro_expires_at: null })
          .eq('id', userId);

        // Downgrade creator a free tier se applicabile
        await supabase
          .from('creator_profiles')
          .update({ tier: 'free', tier_expires_at: null })
          .eq('id', userId);

        console.log(`⬇️ Downgrade a free per utente ${userId}`);
        break;
      }

      default:
        // Evento non gestito — ok
        break;
    }

    return NextResponse.json({ received: true });

  } catch (e) {
    console.error('Webhook processing error:', e);
    return NextResponse.json({ error: 'Processing error' }, { status: 500 });
  }
}
